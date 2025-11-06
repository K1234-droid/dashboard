import {
    saveSetting, getAllSettings, getAllPromptMetadata, getFullPrompt, getPromptBlob, savePrompt, deletePromptDB, getWallpaperFromCache, saveWallpaperToCache
} from './storage.js';
import { showToast, resizeImage, log } from './utils.js';
import {
    userPIN, advancedPIN, setPinModalPurpose, languageSettings, i18nData, pinEnterModal, confirmationMergeReplaceModal,
    setTempImportData, tempImportData, advancedPrompts, currentUser, bookmarks, confirmationBookmarkMergeModal, setTempUserImportData,
    tempUserImportData
} from './config.js';
import { openModal, closeModal, showInfoModal, showProgressModal, updateProgress, hideProgressModal, showLoadingModal, hideLoadingModal } from './ui.js';

// =================== FUNGSI UTILITAS LOKAL ===================

function downloadBlob(blob, filename) {
    try {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('export.success');
    } catch (error) {
        log('error', 'log.error.downloadFailed', {}, error);
        showToast('export.failed');
    }
}

function triggerImport(callback, acceptedTypes) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptedTypes;
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        showLoadingModal();
        setTimeout(() => {
            callback(file);
        }, 50); 
    };
    input.click();
}

// =================== LOGIKA EKSPOR ===================

export async function exportUserData() {
    showProgressModal('progress.export.title', 'progress.message');
    try {
        const settingsToExport = await getAllSettings([
            'username', 'theme', 'colorScheme', 'showSeconds', 'menuBlur', 'footerBlur',
            'languageSettings', 'enableAnimation', 'showContent', 'showGreeting',
            'showDescription', 'showDate', 'showTime', 'showUsername', 'bookmarks', 'showBookmark', 'enableBookmarkSearch',
            'enableBookmarkPopupFinder', 'bookmarkOpenAction', 'enableShortcutCtrlD', 'bookmarkBlur', 'enableSearchBar',
            'searchEngine', 'searchOpenAction', 'customBackground', 'customThemeOverrides'
        ]);
        updateProgress(20);

        const wallpaperBlob = settingsToExport.customBackground ? await getWallpaperFromCache() : null;
        updateProgress(40);
        
        const now = new Date();
        const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        if (wallpaperBlob) {
            const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
            
            await zipWriter.add("user-settings.json", new zip.TextReader(JSON.stringify({ type: 'userData', data: settingsToExport }, null, 2)));
            updateProgress(70);

            const extension = wallpaperBlob.type.split('/')[1] || 'png';
            await zipWriter.add(`wallpaper.${extension}`, new zip.BlobReader(wallpaperBlob));
            updateProgress(90);

            const zipBlob = await zipWriter.close();
            const filename = `${currentUser}_${dateString}_user-data.zip`;
            downloadBlob(zipBlob, filename);
        } else {
            const filename = `${currentUser}_${dateString}_user-settings.json`;
            const blob = new Blob([JSON.stringify({ type: 'userData', data: settingsToExport }, null, 2)], { type: 'application/json' });
            downloadBlob(blob, filename);
        }
        updateProgress(100);

    } catch (error) {
        log('error', 'log.error.wallpaperExportFailed', {}, error);
        showToast('export.failed');
    } finally {
        setTimeout(hideProgressModal, 500);
    }
}

export function importUserData() {
    triggerImport(async (file) => {
        try {
            let importedData;

            if (file.name.endsWith('.zip')) {
                const zipReader = new zip.ZipReader(new zip.BlobReader(file));
                const entries = await zipReader.getEntries();

                const settingsEntry = entries.find(e => e.filename === 'user-settings.json');
                if (!settingsEntry) throw new Error("ZIP file is missing user-settings.json");

                const settingsText = await settingsEntry.getData(new zip.TextWriter());
                const imported = JSON.parse(settingsText);
                if (imported.type !== 'userData' || !imported.data) {
                    throw new Error("Invalid file format inside ZIP");
                }
                importedData = imported.data;
                
                if (importedData.customBackground) {
                    const wallpaperEntry = entries.find(e => e.filename.startsWith('wallpaper.'));
                    if (wallpaperEntry) {
                        const wallpaperBlob = await wallpaperEntry.getData(new zip.BlobWriter());
                        await saveWallpaperToCache(wallpaperBlob);
                    } else {
                        importedData.customBackground = false;
                    }
                }
                await zipReader.close();

            } else if (file.name.endsWith('.json')) {
                const text = await file.text();
                const imported = JSON.parse(text);

                if (imported.type !== 'userData' || !imported.data) {
                    throw new Error("Invalid file format");
                }
                importedData = imported.data;
            } else {
                 hideLoadingModal();
                 showInfoModal('info.attention.title', 'import.failed');
                 return;
            }

            const currentBookmarks = bookmarks;
            const hasImportableBookmarks = 'bookmarks' in importedData && Array.isArray(importedData.bookmarks) && importedData.bookmarks.length > 0;

            if (hasImportableBookmarks) {
                if (Array.isArray(currentBookmarks) && currentBookmarks.length > 0) {
                    setTempUserImportData(importedData);
                    hideLoadingModal();
                    openModal(confirmationBookmarkMergeModal.overlay);
                } else {
                    for (const key in importedData) {
                        await saveSetting(key, importedData[key]);
                    }
                    hideLoadingModal();
                    showToast('import.success');
                    setTimeout(() => window.location.reload(), 1000);
                }
            } else {
                for (const key in importedData) {
                    if (key !== 'bookmarks') {
                        await saveSetting(key, importedData[key]);
                    }
                }
                hideLoadingModal();
                showToast('import.success');
                setTimeout(() => window.location.reload(), 1000);
            }
        } catch (error) {
            hideLoadingModal();
            showInfoModal('info.attention.title', 'import.failed');
        }
    }, '.json, .zip');
}


async function applyUserSettings(settings, shouldSkipBookmarks = false) {
    for (const key in settings) {
        if (shouldSkipBookmarks && key === 'bookmarks') {
            continue;
        }
        await saveSetting(key, settings[key]);
    }
}

export async function handleBookmarkMerge() {
    if (!tempUserImportData) return;

    showLoadingModal();
    try {
        await applyUserSettings(tempUserImportData, true);

        const importedBookmarks = tempUserImportData.bookmarks || [];
        const currentBookmarks = [...bookmarks];
        const existingUrls = new Set(currentBookmarks.map(b => b.url.trim().toLowerCase()));
        const existingIds = new Set(currentBookmarks.map(b => b.id));

        importedBookmarks.forEach(importedBookmark => {
            const normalizedUrl = importedBookmark.url.trim().toLowerCase();
            
            if (!existingUrls.has(normalizedUrl)) {
                let newBookmark = { ...importedBookmark };

                if (existingIds.has(newBookmark.id)) {
                    newBookmark.id = Date.now() + Math.random();
                }

                currentBookmarks.push(newBookmark);
                existingUrls.add(normalizedUrl);
                existingIds.add(newBookmark.id);
            }
        });
        
        await saveSetting('bookmarks', currentBookmarks);

        closeModal(confirmationBookmarkMergeModal.overlay);
        setTempUserImportData(null);
        hideLoadingModal();
        showToast('import.merged');
        setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
        log('error', 'log.error.bookmarkMergeFailed', {}, error);
        hideLoadingModal();
        showInfoModal('info.attention.title', 'import.failed');
    }
}

export async function handleBookmarkReplace() {
    if (!tempUserImportData) return;

    showLoadingModal();
    try {
        await applyUserSettings(tempUserImportData, false);

        closeModal(confirmationBookmarkMergeModal.overlay);
        setTempUserImportData(null);
        hideLoadingModal();
        showToast('import.replaced');
        setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
        log('error', 'log.error.bookmarkReplaceFailed', {}, error);
        hideLoadingModal();
        showInfoModal('info.attention.title', 'import.failed');
    }
}

export function exportHiddenData() {
    if (!userPIN) {
        showInfoModal('info.attention.title', 'settings.hidden.disabled');
        return;
    }
    setPinModalPurpose('exportHidden');
    const lang = languageSettings.ui;
    pinEnterModal.title.textContent = i18nData["pin.enter.confirmExport"][lang];
    pinEnterModal.label.textContent = i18nData["pin.enter.confirmExportLabel"][lang];
    pinEnterModal.input.value = '';
    openModal(pinEnterModal.overlay);
    pinEnterModal.input.focus();
}

export async function proceedWithHiddenDataExport() {
    showProgressModal('progress.export.title', 'progress.message');
    try {
        const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));

        const settings = await getAllSettings(['userPIN', 'advancedPIN', 'advancedPrompts', 'enablePopupFinder', 'promptOrder', 'enablePromptSearch']); 
        const promptMetadataList = await getAllPromptMetadata();

        const metadata = {
            userPIN: settings.userPIN,
            advancedPIN: settings.advancedPIN,
            enablePopupFinder: settings.enablePopupFinder,
            promptOrder: settings.promptOrder || [],
            prompts: [],
            advancedPrompts: settings.advancedPrompts,
            enablePromptSearch: settings.enablePromptSearch
        };

        const totalPrompts = promptMetadataList.length;
        let index = 0;

        for (const meta of promptMetadataList) {
            const imageBlobOriginal = await getPromptBlob(meta.id, 'imageBlobOriginal');

            if (imageBlobOriginal instanceof Blob) {
                const extension = imageBlobOriginal.type.split('/')[1] || 'png';
                const filename = `prompt_${meta.id}.${extension}`;

                await zipWriter.add(`images/${filename}`, new zip.BlobReader(imageBlobOriginal));
                
                metadata.prompts.push({ ...meta, imageFilename: filename });
            }
            index++;
            updateProgress((index / totalPrompts) * 80);
        }

        const metadataString = JSON.stringify(metadata, null, 2);
        await zipWriter.add("data.json", new zip.TextReader(metadataString));
        updateProgress(90);

        const zipBlob = await zipWriter.close();
        updateProgress(100);

        const now = new Date();
        const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const filename = `${currentUser}_${dateString}_hidden-features-backup.zip`;
        
        downloadBlob(zipBlob, filename);

    } catch (error) {
        log('error', 'log.error.exportHiddenFailed', {}, error);
        showToast('export.failed');
    } finally {
        setTimeout(hideProgressModal, 500);
    }
}

// =================== LOGIKA IMPOR ===================

export function importHiddenData() {
    triggerImport(async (file) => {
        if (!file.name.endsWith('.zip')) {
            hideLoadingModal();
            showInfoModal('info.attention.title', 'import.failed');
            return;
        }

        try {
            const zipReader = new zip.ZipReader(new zip.BlobReader(file));
            const entries = await zipReader.getEntries();
            const dataFileEntry = entries.find(entry => entry.filename === "data.json");
            await zipReader.close();

            if (!dataFileEntry) {
                throw new Error("ZIP file is missing data.json");
            }

            setTempImportData({ zipBlob: file });
            hideLoadingModal();
            openModal(confirmationMergeReplaceModal.overlay);
        } catch (error) {
            hideLoadingModal();
            showInfoModal('info.attention.title', 'import.failed');
        }
    }, '.zip');
}

async function applyImportedData(importData, replace = false) {
    showProgressModal('progress.import.title', 'progress.message');
    try {
        const zipReader = new zip.ZipReader(new zip.BlobReader(importData.zipBlob));
        const entries = await zipReader.getEntries();
        const dataFileEntry = entries.find(entry => entry.filename === "data.json");
        if (!dataFileEntry) throw new Error("ZIP file is missing data.json");

        const metadataString = await dataFileEntry.getData(new zip.TextWriter());
        const data = JSON.parse(metadataString);
        const existingSettings = await getAllSettings(['promptOrder', 'advancedPrompts']);
        let finalPromptOrder = existingSettings.promptOrder || [];
        let existingAdvancedPrompts = existingSettings.advancedPrompts || [];

        if (replace) {
            const oldMetadata = await getAllPromptMetadata();
            for (const p of oldMetadata) {
                await deletePromptDB(p.id);
            }
            finalPromptOrder = [];
        }

        const importedPrompts = data.prompts || [];
        const existingPromptIds = new Set(finalPromptOrder);
        const newPromptIds = [];

        const promptMap = new Map(importedPrompts.map(p => [p.id, p]));
        const orderedIds = data.promptOrder && data.promptOrder.length > 0 
            ? data.promptOrder 
            : importedPrompts.map(p => p.id);

        if (orderedIds.length > 0) {
            let index = 0;
            for (const promptId of orderedIds) {
                const p = promptMap.get(promptId);
                if (!p) continue;

                if (replace || !existingPromptIds.has(p.id)) {
                    const imageFileEntry = entries.find(entry => entry.filename === `images/${p.imageFilename}`);
                    if (imageFileEntry) {
                        const imageBlobOriginal = await imageFileEntry.getData(new zip.BlobWriter());
                        const [imageBlobViewer, imageBlobThumbnail, imageBlobIcon] = await Promise.all([
                            resizeImage(imageBlobOriginal, 1080, 1920),
                            resizeImage(imageBlobOriginal, 500, 500),
                            resizeImage(imageBlobOriginal, 200, 200)
                        ]);
                        const reconstructedPrompt = { ...p, imageBlobOriginal, imageBlobViewer, imageBlobThumbnail, imageBlobIcon };
                        delete reconstructedPrompt.imageFilename;
                        await savePrompt(reconstructedPrompt);
                        if (!existingPromptIds.has(p.id)) {
                            newPromptIds.push(p.id);
                        }
                    }
                }
                index++;
                updateProgress((index / orderedIds.length) * 100);
            }
        } else {
            updateProgress(100);
        }

        if (replace) {
            finalPromptOrder = data.promptOrder || [];
            await saveSetting('promptOrder', finalPromptOrder);
            await saveSetting('userPIN', data.userPIN || userPIN);
            await saveSetting('advancedPIN', data.advancedPIN || advancedPIN);
            await saveSetting('advancedPrompts', data.advancedPrompts || []);
            if (typeof data.enablePopupFinder !== 'undefined') await saveSetting('enablePopupFinder', data.enablePopupFinder);
            if (typeof data.enablePromptSearch !== 'undefined') await saveSetting('enablePromptSearch', data.enablePromptSearch);

        } else {
            finalPromptOrder.push(...newPromptIds);
            await saveSetting('promptOrder', finalPromptOrder);
            await saveSetting('userPIN', data.userPIN || userPIN);
            await saveSetting('advancedPIN', data.advancedPIN || advancedPIN);
            
            if (Array.isArray(data.advancedPrompts) && data.advancedPrompts.length > 0) {
                const combinedPrompts = [...existingAdvancedPrompts, ...data.advancedPrompts];
                const uniquePrompts = [...new Set(combinedPrompts)];
                await saveSetting('advancedPrompts', uniquePrompts);
            }

            if (typeof data.enablePopupFinder !== 'undefined') await saveSetting('enablePopupFinder', data.enablePopupFinder);
            if (typeof data.enablePromptSearch !== 'undefined') await saveSetting('enablePromptSearch', data.enablePromptSearch);
        }

        await zipReader.close();
        showToast(replace ? 'import.replaced' : 'import.merged');
        return true;

    } catch (error) {
        showInfoModal("info.attention.title", "import.failed");
        return false;
    } finally {
        setTimeout(hideProgressModal, 500);
    }
}

export async function handleMerge() {
    if (tempImportData) {
        closeModal(confirmationMergeReplaceModal.overlay);
        const success = await applyImportedData(tempImportData, false);
        if (success) {
            setTempImportData(null);
            setTimeout(() => window.location.reload(), 1000);
        }
    }
}

export async function handleReplace() {
    if (tempImportData) {
        closeModal(confirmationMergeReplaceModal.overlay);
        const success = await applyImportedData(tempImportData, true);
        if (success) {
            setTempImportData(null);
            setTimeout(() => window.location.reload(), 1000);
        }
    }
}