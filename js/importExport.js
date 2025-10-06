import {
    saveSetting,
    getAllSettings,
    getAllPromptMetadata,
    getFullPrompt,
    getPromptBlob,
    savePrompt,
    deletePromptDB
} from './storage.js';
import { showToast, resizeImage } from './utils.js';
import {
    userPIN, advancedPIN, setPinModalPurpose, languageSettings,
    i18nData, pinEnterModal, confirmationMergeReplaceModal,
    setTempImportData, tempImportData, advancedPrompts,
    currentUser
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
        console.error('Download failed:', error);
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
    const settingsToExport = await getAllSettings([
        'username', 'theme', 'showSeconds', 'menuBlur', 'footerBlur',
        'avatarFullShow', 'avatarAnimation', 'detectMouseStillness',
        'languageSettings', 'showCredit', 'showFooterInfo', 'showFooter',
        'enableAnimation'
    ]);
    const now = new Date();
    const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const filename = `${currentUser}_${dateString}_user-settings.json`;
    const blob = new Blob([JSON.stringify({ type: 'userData', data: settingsToExport }, null, 2)], { type: 'application/json' });
    downloadBlob(blob, filename);
}

export function importUserData() {
    triggerImport(async (file) => {
        if (!file.name.endsWith('.json')) {
            hideLoadingModal();
            showInfoModal('info.attention.title', 'import.failed');
            return;
        }

        try {
            const text = await file.text();
            const imported = JSON.parse(text);

            if (imported.type !== 'userData' || !imported.data) {
                throw new Error("Invalid file format");
            }
            for (const key in imported.data) {
                await saveSetting(key, imported.data[key]);
            }
            hideLoadingModal();
            showToast('import.success');
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            // console.error('Import user data failed:', error);
            hideLoadingModal();
            showInfoModal('info.attention.title', 'import.failed');
        }
    }, '.json');
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
    pinEnterModal.feedbackText.classList.remove('show');
    openModal(pinEnterModal.overlay);
    pinEnterModal.input.focus();
}

export async function proceedWithHiddenDataExport() {
    showProgressModal('progress.export.title', 'progress.message');
    try {
        const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));

        const settings = await getAllSettings(['userPIN', 'advancedPIN', 'advancedPrompts', 'enablePopupFinder', 'promptOrder']);
        const promptMetadataList = await getAllPromptMetadata();

        const metadata = {
            userPIN: settings.userPIN,
            advancedPIN: settings.advancedPIN,
            enablePopupFinder: settings.enablePopupFinder,
            promptOrder: settings.promptOrder || [],
            prompts: [],
            advancedPrompts: settings.advancedPrompts
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
        console.error("Export hidden data failed:", error);
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
            setTempImportData({ zipBlob: file });
            hideLoadingModal();
            openModal(confirmationMergeReplaceModal.overlay);
        } catch (error) {
            console.error('Import failed at initial stage:', error);
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

        const existingSettings = await getAllSettings(['promptOrder']);
        let finalPromptOrder = existingSettings.promptOrder || [];

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

        if (importedPrompts.length > 0) {
            const importOrder = data.promptOrder || [];
            let index = 0;
            for (const promptId of importOrder) {
                const p = importedPrompts.find(prompt => prompt.id === promptId);
                if (p && (replace || !existingPromptIds.has(p.id))) {
                    
                    const imageFileEntry = entries.find(entry => entry.filename === `images/${p.imageFilename}`);
                    
                    if (imageFileEntry) {
                        const imageBlobOriginal = await imageFileEntry.getData(new zip.BlobWriter());
                        
                        const [imageBlobViewer, imageBlobThumbnail, imageBlobIcon] = await Promise.all([
                            resizeImage(imageBlobOriginal, 1080, 1920),
                            resizeImage(imageBlobOriginal, 500, 500),
                            resizeImage(imageBlobOriginal, 200, 200)
                        ]);

                        const reconstructedPrompt = {
                            ...p,
                            imageBlobOriginal, imageBlobViewer, imageBlobThumbnail, imageBlobIcon
                        };
                        delete reconstructedPrompt.imageFilename;

                        await savePrompt(reconstructedPrompt);
                        
                        if (!existingPromptIds.has(p.id)) {
                            newPromptIds.push(p.id);
                        }
                    }
                }
                index++;
                updateProgress((index / importOrder.length) * 100);
            }
        } else {
            updateProgress(100);
        }

        if (replace) {
            finalPromptOrder = data.promptOrder || [];
        } else {
            finalPromptOrder.push(...newPromptIds);
        }
        await saveSetting('promptOrder', finalPromptOrder);
        await saveSetting('userPIN', data.userPIN || userPIN);
        await saveSetting('advancedPIN', data.advancedPIN || advancedPIN);
        await saveSetting('advancedPrompts', data.advancedPrompts || []);
        if (typeof data.enablePopupFinder !== 'undefined') {
            await saveSetting('enablePopupFinder', data.enablePopupFinder);
        }

        await zipReader.close();

        showToast(replace ? 'import.replaced' : 'import.merged');
        return true;

    } catch (error) {
        console.error("Apply imported data failed:", error);
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