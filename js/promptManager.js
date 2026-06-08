import {
    languageSettings, i18nData, prompts, advancedPrompts, promptModal, activePromptMenu,
    promptViewerModal, imageViewerModal, addEditPromptModal, confirmationModal,
    isManageModeActive, selectedPromptIds, confirmationModalPurpose,
    setPrompts, setActivePromptMenu, setCurrentPromptId, setConfirmationModalPurpose,
    setIsManageModeActive, setSelectedPromptIds, currentPromptId, sortableInstance,
    isSearchModeActive, setIsSearchModeActive, setCurrentImageViewerId, setImageViewerSource,
    uiHideTimeout, setUiHideTimeout, imageViewerSource, currentImageViewerId, currentImageNavList,
    setCharacterDataStale, cachedIconDataUrls, setCachedIconDataUrls, cachedThumbnailDataUrls,
    setCachedThumbnailDataUrls, isPromptGridStale, setIsPromptGridStale, setCurrentImageNavList
} from './config.js';
import { openModal, closeModal, showInfoModal, showLoadingModal, hideLoadingModal } from './ui.js';
import { showToast, resizeImage, blobToDataURL, log } from './utils.js';
import { saveSetting, getPromptBlob, savePrompt as savePromptToDB, deletePromptDB, getFullPrompt, deletePromptBlobFromCache,
    saveBlobToCache
 } from './storage.js';
import { markSearchDataAsStale } from './search.js';
import { updateSingleCharacterItem } from './promptBuilder.js';

export function openCharacterPromptManager() {
    showLoadingModal();
    setTimeout(async () => {
        await populateThumbnailCacheIfNeeded();
        if (isPromptGridStale) {
            await renderPrompts();
            setIsPromptGridStale(false);
        }
        hideLoadingModal();
        openModal(promptModal.overlay);
        const manageContent = promptModal.manageContent;
        if (manageContent) {
            manageContent.addEventListener('wheel', (e) => {
                if (isManageModeActive) {
                    e.preventDefault();
                    manageContent.scrollLeft += e.deltaY; 
                }
            }, { passive: false });
        }
    }, 50);
}

export async function populateThumbnailCacheIfNeeded() {
    if (Object.keys(cachedThumbnailDataUrls).length > 0) {
        return;
    }

    if (!('caches' in window)) return;

    const cache = await caches.open('prompt-blob-cache');
    const keys = await cache.keys();
    const thumbnailKeys = keys.filter(key => key.url.includes('imageBlobThumbnail'));

    const newThumbnailCache = {};

    if (thumbnailKeys.length > 0) {
        const hydrationPromises = thumbnailKeys.map(async (request) => {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                const dataUrl = await blobToDataURL(blob);
                const urlParts = request.url.split('/');
                const keyPart = urlParts[urlParts.length - 1];
                const promptId = parseInt(keyPart.split('-')[0], 10);

                if (!isNaN(promptId)) {
                    newThumbnailCache[promptId] = dataUrl;
                }
            }
        });
        await Promise.all(hydrationPromises);
    }

    if (Object.keys(newThumbnailCache).length === 0 && prompts.length > 0) {
        const creationPromises = prompts.map(p => (async () => {
            const thumbnailBlob = await getPromptBlob(p.id, 'imageBlobThumbnail');
            if (thumbnailBlob) {
                const dataUrl = await blobToDataURL(thumbnailBlob);
                newThumbnailCache[p.id] = dataUrl;
            }
        })());
        await Promise.all(creationPromises);
    }

    setCachedThumbnailDataUrls(newThumbnailCache);
}

export async function populateIconCacheIfNeeded() {
    if (Object.keys(cachedIconDataUrls).length > 0) {
        return;
    }

    if (!('caches' in window)) return;

    const cache = await caches.open('prompt-blob-cache');
    const keys = await cache.keys();
    const iconKeys = keys.filter(key => key.url.includes('imageBlobIcon'));
    
    const newIconCache = {};

    if (iconKeys.length > 0) {
        const hydrationPromises = iconKeys.map(async (request) => {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                const dataUrl = await blobToDataURL(blob);
                
                const urlParts = request.url.split('/');
                const keyPart = urlParts[urlParts.length - 1];
                const promptId = parseInt(keyPart.split('-')[0], 10);

                if (!isNaN(promptId)) {
                    newIconCache[promptId] = dataUrl;
                }
            }
        });
        await Promise.all(hydrationPromises);
        setCachedIconDataUrls(newIconCache);
        return;
    }

    const allPrompts = prompts; 
    const creationPromises = allPrompts.map(p => (async () => {
        const iconBlob = await getPromptBlob(p.id, 'imageBlobIcon');
        if (iconBlob) {
            const dataUrl = await blobToDataURL(iconBlob);
            newIconCache[p.id] = dataUrl;
        }
    })());

    await Promise.all(creationPromises);
    setCachedIconDataUrls(newIconCache);
}

// --- Context Menu ---
export function showPromptContextMenu(event) {
    closeAllPromptMenus();
    
    const btn = event.currentTarget;
    const menuEl = btn.nextElementSibling;
    if (!menuEl) return;

    const btnRect = btn.getBoundingClientRect();
    menuEl._originalParent = btn.parentNode;
    document.body.appendChild(menuEl);

    menuEl.style.position = 'fixed';
    menuEl.style.zIndex = '102'; 
    menuEl.classList.add('show');
    
    const menuHeight = menuEl.offsetHeight;
    const windowHeight = window.innerHeight;

    if (btnRect.bottom + menuHeight + 4 > windowHeight) {
        menuEl.style.top = `${btnRect.top - menuHeight - 4}px`;
    } else {
        menuEl.style.top = `${btnRect.bottom + 4}px`;
    }

    const menuWidth = menuEl.offsetWidth;
    let menuLeft = btnRect.right - menuWidth;

    if (menuLeft < 0) {
        menuLeft = btnRect.left;
    }

    menuEl.style.left = `${menuLeft}px`; 

    setActivePromptMenu(menuEl);
}

export function closeAllPromptMenus() {
    if (activePromptMenu) {
        if (activePromptMenu._originalParent) {
            activePromptMenu.style.position = '';
            activePromptMenu.style.zIndex = '';
            activePromptMenu.style.top = '';
            activePromptMenu.style.left = '';
            activePromptMenu.classList.remove('show');
            activePromptMenu._originalParent.appendChild(activePromptMenu);
        }
        setActivePromptMenu(null);
    }
}

// --- Rendering and Displaying Prompts ---
export async function renderPrompts(promptsToRender = prompts) {
    const oldImages = promptModal.grid.querySelectorAll('.prompt-item-img');
    promptModal.grid.innerHTML = '';
    const lang = languageSettings.ui;
    const fragment = document.createDocumentFragment();

    promptsToRender.forEach(p => {
        const item = document.createElement('div');
        item.className = 'prompt-item';
        item.dataset.id = p.id;

        const img = document.createElement('img');
        img.alt = 'Prompt Image';
        img.className = 'prompt-item-img';
        item.appendChild(img);

        const thumbnailDataUrl = cachedThumbnailDataUrls[p.id];
        
        if (thumbnailDataUrl) {
            img.src = thumbnailDataUrl;
            item.classList.add('loaded');
            img.classList.add('loaded');
        } else {
            item.classList.add('img-container-loading');
            (async () => {
                const thumbnailBlob = await getPromptBlob(p.id, 'imageBlobThumbnail');
                if (thumbnailBlob) {
                    const dataUrl = await blobToDataURL(thumbnailBlob);
                    cachedThumbnailDataUrls[p.id] = dataUrl;

                    img.onload = () => {
                        item.classList.remove('img-container-loading');
                        item.classList.add('loaded');
                        img.classList.add('loaded');
                    };
                    img.src = dataUrl;
                } else {
                    item.classList.remove('img-container-loading');
                }
            })();
        }

        const menuBtn = document.createElement('button');
        menuBtn.type = 'button';
        menuBtn.className = 'prompt-item-menu-btn';
        menuBtn.innerHTML = '&#8942;';
        menuBtn.onclick = showPromptContextMenu;
  
        const menuContainer = document.createElement('div');
        menuContainer.className = 'prompt-item-menu';
        menuContainer.dataset.id = p.id;
        menuContainer.innerHTML = `
            <button class="prompt-menu-option" type="button" data-action="view-prompt-details">${i18nData["prompt.detailTitle"][lang] || i18nData["prompt.detailTitle"]["id"]}</button>
            <button class="prompt-menu-option" type="button" data-action="copy">${i18nData["prompt.image.copy"][lang] || i18nData["prompt.image.copy"]["id"]}</button>
            <button class="prompt-menu-option" type="button" data-action="save-image">${i18nData["prompt.menu.saveImage"][lang] || i18nData["prompt.menu.saveImage"]["id"]}</button>
            <button class="prompt-menu-option" type="button" data-action="edit">${i18nData["prompt.menu.edit"][lang] || i18nData["prompt.menu.edit"]["id"]}</button>
            <button class="prompt-menu-option" type="button" data-action="delete">${i18nData["prompt.menu.delete"][lang] || i18nData["prompt.menu.delete"]["id"]}</button>
        `;
  
        item.appendChild(menuBtn);
        item.appendChild(menuContainer);
        
        item.addEventListener('click', (e) => {
            if (isManageModeActive) {
                if (!e.target.closest('.prompt-item-menu-btn')) {
                    togglePromptSelection(p.id);
                }
                return;
            } else if (e.ctrlKey || e.shiftKey || e.metaKey) {
                if (!e.target.closest('.prompt-item-menu-btn')) {
                    e.preventDefault();
                    toggleManageMode(true);
                    togglePromptSelection(p.id);
                    return;
                }
            }

            if (e.target.closest('.prompt-item-menu-btn')) {
                return;
            }
            const allPromptIds = Array.from(promptModal.grid.querySelectorAll('.prompt-item:not(.add-prompt-item)'))
                .map(el => parseInt(el.dataset.id, 10))
                .filter(id => !isNaN(id));
            setCurrentImageNavList(allPromptIds);
            showFullImage(p.id, 'grid');
        });

        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (isManageModeActive) {
                togglePromptSelection(p.id);
            } else {
                const menuBtn = item.querySelector('.prompt-item-menu-btn');
                if (menuBtn) {
                    menuBtn.click();
                }
            }
        });
        
        fragment.appendChild(item);
    });

    const addBtn = document.createElement('button');
    addBtn.id = 'add-prompt-btn';
    addBtn.type = 'button';
    addBtn.className = 'prompt-item add-prompt-item';
    addBtn.innerHTML = '<span>+</span>';
    addBtn.onclick = handleOpenAddPromptModal;

    if (promptsToRender.length > 0) {
        addBtn.style.display = 'none';
    } else {
        addBtn.style.display = '';
    }

    fragment.appendChild(addBtn);

    promptModal.grid.appendChild(fragment);

    oldImages.forEach(img => {
        if (img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
        }
    });
}

async function updateSinglePromptItem(updatedPrompt) {
    const item = promptModal.grid.querySelector(`.prompt-item[data-id="${updatedPrompt.id}"]`);
    if (!item) return;

    const img = item.querySelector('.prompt-item-img');
    if (!img) return;

    item.classList.remove('loaded');
    item.classList.add('img-container-loading');

    const thumbnailBlob = await getPromptBlob(updatedPrompt.id, 'imageBlobThumbnail');
    if (thumbnailBlob) {
        if (img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
        }

        img.onload = () => {
            item.classList.add('loaded');
            img.classList.add('loaded');
            item.classList.remove('img-container-loading');
        };

        img.src = URL.createObjectURL(thumbnailBlob);
    } else {
        item.classList.remove('img-container-loading');
    }
}

export function showPromptViewer(prompt) {
    setCurrentPromptId(prompt.id);
    promptViewerModal.text.textContent = prompt.text;
    openModal(promptViewerModal.overlay);
}

export function navigateImageViewer(direction) {
    const contextMenu = document.getElementById('image-viewer-context-menu');
    if (contextMenu) {
        contextMenu.style.display = 'none';
    }

    const navList = currentImageNavList; 
    if (navList.length <= 1) return;

    const currentIndex = navList.indexOf(currentImageViewerId);
    if (currentIndex === -1) return;

    const newIndex = (currentIndex + direction + navList.length) % navList.length;
    const newPromptId = navList[newIndex];
    
    showFullImage(newPromptId, imageViewerSource); 
}

export async function showFullImage(promptId, source = 'grid') {
    if (currentImageViewerId && currentImageViewerId !== promptId) {
        await deletePromptBlobFromCache(currentImageViewerId, 'imageBlobViewer');
    }

    const prompt = prompts.find(p => p.id === promptId);
    const viewerBlob = await getPromptBlob(promptId, 'imageBlobViewer');

    if (prompt && viewerBlob) {
        const oldUrl = imageViewerModal.image.src;
        if (oldUrl.startsWith('blob:')) {
            URL.revokeObjectURL(oldUrl);
        }
        
        setCurrentImageViewerId(promptId);
        setImageViewerSource(source);
        
        imageViewerModal.image.src = URL.createObjectURL(viewerBlob);
        
        if (imageViewerModal.overlay.classList.contains('hidden')) {
            openModal(imageViewerModal.overlay);
        }

        const controls = imageViewerModal.controls;
        if (controls) {
            controls.classList.toggle('nav-disabled', currentImageNavList.length <= 1);
            
            clearTimeout(uiHideTimeout);
            controls.classList.remove('hidden-ui');

            const newTimeout = setTimeout(() => {
                controls.classList.add('hidden-ui');
            }, 3000);
            setUiHideTimeout(newTimeout);
        }
    } else if (prompt && prompt.imageBlobOriginal) {
        console.warn(`imageBlobViewer tidak ditemukan untuk prompt ${promptId}, mengubah ukuran gambar asli secara langsung.`);

        (async () => {
            try {
                const viewerBlob = await resizeImage(prompt.imageBlobOriginal, 1080, 1920);
                setCurrentImageViewerId(promptId);
                setImageViewerSource(source);
                const oldUrl = imageViewerModal.image.src;
                if (oldUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(oldUrl);
                }
                imageViewerModal.image.src = URL.createObjectURL(viewerBlob);
                openModal(imageViewerModal.overlay);
            } catch (error) {
                log('error', 'log.error.createViewerFallbackFailed', {}, error);
            }
        })();
    }
}

export function closeImageViewer() {
    const overlay = imageViewerModal.overlay;
    const img = imageViewerModal.image;

    clearTimeout(uiHideTimeout);

    const cleanupAfterAnimation = async () => {
        overlay.removeEventListener('transitionend', cleanupAfterAnimation);

        if (img && img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
            img.src = ''; 
        }

        if (currentImageViewerId) {
            await deletePromptBlobFromCache(currentImageViewerId, 'imageBlobViewer');
        }
    };

    overlay.addEventListener('transitionend', cleanupAfterAnimation, { once: true });

    closeModal(overlay);
}

// --- Prompt Actions (Copy, Save, Edit, Delete) ---
export async function copyPromptTextFromItem(promptId) {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
        try {
            await navigator.clipboard.writeText(prompt.text);
            showToast("prompt.copy.success");
        } catch (err) {
            log('error', 'log.error.copyFailed', {}, err);
        }
    }
}

/**
 * Membuat dan memicu unduhan untuk gambar dari prompt yang dipilih.
 * @param {number} promptId - ID dari prompt yang gambarnya akan disimpan.
 */
export async function savePromptImage(promptId) {
    const prompt = prompts.find(p => p.id === promptId);
    const imageBlobOriginal = await getPromptBlob(promptId, 'imageBlobOriginal');

    if (prompt && imageBlobOriginal) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(imageBlobOriginal);

        const extension = imageBlobOriginal.type.split('/')[1] || 'png';
        
        link.download = `prompt_${prompt.id}.${extension}`;

        document.body.appendChild(link);
        link.click();

        setTimeout(async () => {
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
            await deletePromptBlobFromCache(promptId, 'imageBlobOriginal');
        }, 100);
    } else {
        console.error('Original image prompt or blob not found for ID:', promptId);
    }
}

export async function copyPromptTextFromViewer() {
    try {
        await navigator.clipboard.writeText(promptViewerModal.text.textContent);
        showToast("prompt.copy.success");
    } catch (err) {
        log('error', 'log.error.copyFailed', {}, err);
    }
}

export function handleOpenAddPromptModal() {
    setCurrentPromptId(null);
    const lang = languageSettings.ui;
    addEditPromptModal.title.textContent = i18nData["prompt.addTitle"][lang] || i18nData["prompt.addTitle"]["id"];
    addEditPromptModal.saveBtn.textContent = i18nData["settings.username.save"][lang] || i18nData["settings.username.save"]["id"];
    addEditPromptModal.textInput.value = '';
    addEditPromptModal.imageFileInput.value = '';

    addEditPromptModal.textInput.scrollTop = 0;
    
    addEditPromptModal.previewsContainer.classList.add('hidden');
    addEditPromptModal.imagePreviewSingle.classList.add('hidden');
    addEditPromptModal.imageHelpText.style.display = 'none';
    addEditPromptModal.imagePreviewSingle.oncontextmenu = (e) => {
        e.preventDefault();
    };

    openModal(addEditPromptModal.overlay);
}

export async function handleEditPrompt(promptId) {
    const promptToEdit = prompts.find(p => p.id === promptId);
    if (!promptToEdit) return;
    setCurrentPromptId(promptId);
    const lang = languageSettings.ui;
    
    addEditPromptModal.title.textContent = i18nData["prompt.editTitle"][lang] || i18nData["prompt.editTitle"]["id"];
    addEditPromptModal.saveBtn.textContent = i18nData["prompt.saveChanges"][lang] || i18nData["prompt.saveChanges"]["id"];
    addEditPromptModal.textInput.value = promptToEdit.text;
    addEditPromptModal.imageFileInput.value = '';

    addEditPromptModal.textInput.scrollTop = 0;

    addEditPromptModal.previewsContainer.classList.remove('hidden');

    if (addEditPromptModal.imagePreviewOld.src.startsWith('blob:')) {
        URL.revokeObjectURL(addEditPromptModal.imagePreviewOld.src);
    }
    if (addEditPromptModal.imagePreviewNew.src.startsWith('blob:')) {
        URL.revokeObjectURL(addEditPromptModal.imagePreviewNew.src);
    }

    const thumbnailBlob = await getPromptBlob(promptId, 'imageBlobThumbnail');
    if (thumbnailBlob) {
        const imageUrl = URL.createObjectURL(thumbnailBlob);
        addEditPromptModal.imagePreviewOld.src = imageUrl;
        addEditPromptModal.imagePreviewNew.src = imageUrl;
    }

    addEditPromptModal.imagePreviewSingle.classList.add('hidden');
    addEditPromptModal.imageHelpText.style.display = 'block';
    addEditPromptModal.imagePreviewOld.oncontextmenu = (e) => {
        e.preventDefault();
    };
    addEditPromptModal.imagePreviewNew.oncontextmenu = (e) => {
        e.preventDefault();
    };
    
    openModal(addEditPromptModal.overlay);
}

async function appendNewPromptItem(newPrompt) {
    const lang = languageSettings.ui;
    const item = document.createElement('div');
    item.className = 'prompt-item img-container-loading';
    item.dataset.id = newPrompt.id;

    const img = document.createElement('img');
    img.alt = 'Prompt Image';
    img.className = 'prompt-item-img img-lazy-load';
    img.loading = 'lazy';
    item.appendChild(img);

    const thumbnailBlob = await getPromptBlob(newPrompt.id, 'imageBlobThumbnail');
    if (thumbnailBlob) {
        img.onload = () => {
            item.classList.add('loaded');
            img.classList.add('loaded');
        };
        img.src = URL.createObjectURL(thumbnailBlob);
    } else {
        item.classList.remove('img-container-loading');
    }

    const menuBtn = document.createElement('button');
    menuBtn.className = 'prompt-item-menu-btn';
    menuBtn.innerHTML = '&#8942;';
    menuBtn.onclick = showPromptContextMenu;

    const menuContainer = document.createElement('div');
    menuContainer.className = 'prompt-item-menu';
    menuContainer.dataset.id = newPrompt.id;
    menuContainer.innerHTML = `
        <button class="prompt-menu-option" data-action="view-prompt-details">${i18nData["prompt.detailTitle"][lang] || i18nData["prompt.detailTitle"]["id"]}</button>
        <button class="prompt-menu-option" data-action="copy">${i18nData["prompt.image.copy"][lang]}</button>
        <button class="prompt-menu-option" data-action="save-image">${i18nData["prompt.menu.saveImage"][lang]}</button>
        <button class="prompt-menu-option" data-action="edit">${i18nData["prompt.menu.edit"][lang]}</button>
        <button class="prompt-menu-option" data-action="delete">${i18nData["prompt.menu.delete"][lang]}</button>
    `;

    item.appendChild(menuBtn);
    item.appendChild(menuContainer);
    item.addEventListener('click', (e) => {
        if (isManageModeActive) {
            if (!e.target.closest('.prompt-item-menu-btn')) {
                togglePromptSelection(newPrompt.id);
            }
            return;
        } else if (e.ctrlKey || e.shiftKey || e.metaKey) {
            if (!e.target.closest('.prompt-item-menu-btn')) {
                e.preventDefault();
                toggleManageMode(true);
                togglePromptSelection(newPrompt.id);
                return;
            }
        }
        if (e.target.closest('.prompt-item-menu-btn')) { return; }
        const allPromptIds = Array.from(promptModal.grid.querySelectorAll('.prompt-item:not(.add-prompt-item)'))
            .map(el => parseInt(el.dataset.id, 10))
            .filter(id => !isNaN(id));
        setCurrentImageNavList(allPromptIds);
        showFullImage(newPrompt.id, 'grid');
    });

    item.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (isManageModeActive) {
            togglePromptSelection(newPrompt.id);
        } else {
            const btn = item.querySelector('.prompt-item-menu-btn');
            if (btn) btn.click();
        }
    });

    const addBtn = promptModal.grid.querySelector('#add-prompt-btn');
    if (addBtn) {
        promptModal.grid.insertBefore(item, addBtn);
    } else {
        promptModal.grid.appendChild(item);
    }
}

export async function handleSavePrompt() {
    const saveBtn = addEditPromptModal.saveBtn;
    const originalBtnText = saveBtn.textContent;
    const lang = languageSettings.ui;
    const isEditing = !!currentPromptId;
    const promptModalBody = promptModal.overlay.querySelector('.modal-body');
    const scrollPosition = promptModalBody.scrollTop;

    saveBtn.disabled = true;
    saveBtn.textContent = i18nData["prompt.saving"][lang] || 'Menyimpan...';

    try {
        const file = addEditPromptModal.imageFileInput.files[0];
        const text = addEditPromptModal.textInput.value.trim();

        if (!isEditing && (!file || text === '')) {
            showInfoModal("info.attention.title", "prompt.add.fieldsRequired");
            return;
        }

        if (isEditing && text === '') {
            showInfoModal("info.attention.title", "prompt.edit.textRequired");
            return;
        }
        
        let promptData;
        const tempPromptsMetadata = [...prompts];
        let newIconBlobForCache = null;

        if (isEditing) {
            const promptIndex = tempPromptsMetadata.findIndex(p => p.id === currentPromptId);
            if (promptIndex === -1) return;

            const fullOldPrompt = await getFullPrompt(currentPromptId);
            if (!fullOldPrompt) return;

            promptData = { ...fullOldPrompt, text: text };

            if (file) {
                await deletePromptDB(currentPromptId);
                
                const [viewer, thumbnail, icon] = await Promise.all([
                    resizeImage(file, 1080, 1920),
                    resizeImage(file, 500, 500),
                    resizeImage(file, 200, 200)
                ]);
                promptData.imageBlobOriginal = file;
                promptData.imageBlobViewer = viewer;
                promptData.imageBlobThumbnail = thumbnail;
                promptData.imageBlobIcon = icon;
                newIconBlobForCache = icon;
            } else {
                newIconBlobForCache = promptData.imageBlobIcon;
            }
        } else {
            const imageBlobOriginal = file;
            const [imageBlobViewer, imageBlobThumbnail, imageBlobIcon] = await Promise.all([
                resizeImage(imageBlobOriginal, 1080, 1920),
                resizeImage(imageBlobOriginal, 500, 500),
                resizeImage(imageBlobOriginal, 200, 200)
            ]);
            
            promptData = { 
                id: Date.now(), 
                imageBlobOriginal, 
                imageBlobViewer,
                imageBlobThumbnail,
                imageBlobIcon,
                text 
            };
            
            newIconBlobForCache = imageBlobIcon;
        }
        
        await savePromptToDB(promptData);

        if (newIconBlobForCache) {
            await saveBlobToCache(promptData.id, 'imageBlobIcon', newIconBlobForCache);
        }
        if (promptData.imageBlobThumbnail) {
            await saveBlobToCache(promptData.id, 'imageBlobThumbnail', promptData.imageBlobThumbnail);
        }
        // if (promptData.imageBlobViewer) {
        //     await saveBlobToCache(promptData.id, 'imageBlobViewer', promptData.imageBlobViewer);
        // }

        const { imageBlobOriginal: _, imageBlobViewer: _1, imageBlobThumbnail: _2, imageBlobIcon: _3, ...metadata } = promptData;

        if (newIconBlobForCache) {
            const iconDataUrl = await blobToDataURL(newIconBlobForCache);
            const updatedCache = { ...cachedIconDataUrls, [metadata.id]: iconDataUrl };
            setCachedIconDataUrls(updatedCache);
        }

        const newThumbnailBlobForCache = promptData.imageBlobThumbnail;
        if (newThumbnailBlobForCache) {
            const thumbnailDataUrl = await blobToDataURL(newThumbnailBlobForCache);
            const updatedThumbnailCache = { ...cachedThumbnailDataUrls, [metadata.id]: thumbnailDataUrl };
            setCachedThumbnailDataUrls(updatedThumbnailCache);
        }

        if (isEditing) {
            const promptIndex = tempPromptsMetadata.findIndex(p => p.id === currentPromptId);
            if (promptIndex > -1) {
                tempPromptsMetadata[promptIndex] = metadata;
            }
        } else {
            tempPromptsMetadata.unshift(metadata);
            const currentIds = prompts.map(p => p.id);
            const newOrder = [metadata.id, ...currentIds];
            await saveSetting('promptOrder', newOrder);
        }

        setPrompts(tempPromptsMetadata);

        if (isEditing) {
            document.dispatchEvent(new CustomEvent('characterListUpdated', {
                detail: { type: 'edit', updatedPrompt: metadata }
            }));
        } else {
            document.dispatchEvent(new CustomEvent('characterListUpdated')); 
        }

        closeModal(addEditPromptModal.overlay);

        if (isSearchModeActive) {
            handleSearchInput();
        } else {
            if (isEditing) {
                await updateSinglePromptItem(metadata);
                await updateSingleCharacterItem(metadata);
            } else {
                await renderPrompts();
            }
        }
        
        promptModalBody.scrollTop = scrollPosition;

        showToast(isEditing ? "prompt.edit.success" : "prompt.save.success");
        markSearchDataAsStale();
        setCurrentPromptId(null);

    } catch (error) {
        console.error("Failed to save prompt (unexpected error):", error);
        showInfoModal("info.attention.title", "prompt.save.fileError");
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = originalBtnText;
    }
}

export function handleDeletePrompt(promptId) {
    const isBeingUsed = advancedPrompts.some(p => p.characterIds && p.characterIds.includes(promptId));

    if (isBeingUsed) {
        showInfoModal("info.attention.title", "prompt.delete.inUseError");
        return;
    }

    setConfirmationModalPurpose('deletePrompt');
    setCurrentPromptId(promptId);
    const lang = languageSettings.ui;
    confirmationModal.title.textContent = i18nData["delete.confirm.title"][lang];
    confirmationModal.text.textContent = i18nData["delete.confirm.text"][lang];
    openModal(confirmationModal.overlay);
}

export async function confirmDelete() {
    try {
        const promptModalBody = promptModal.overlay.querySelector('.modal-body');
        const scrollPosition = promptModalBody.scrollTop;

        let idsToDelete;
        let newPromptsMetadata;

        if (confirmationModalPurpose === 'deleteSelectedPrompts') {
            idsToDelete = [...selectedPromptIds];
            newPromptsMetadata = prompts.filter(p => !selectedPromptIds.includes(p.id));
        } else {
            idsToDelete = [currentPromptId];
            newPromptsMetadata = prompts.filter(p => p.id !== currentPromptId);
        }

        for (const id of idsToDelete) {
            await deletePromptDB(id);
        }

        setPrompts(newPromptsMetadata);

        const newOrder = newPromptsMetadata.map(p => p.id);
        await saveSetting('promptOrder', newOrder);

        document.dispatchEvent(new CustomEvent('characterListUpdated', {
            detail: { type: 'delete', deletedIds: idsToDelete }
        }));
        
        idsToDelete.forEach(id => {
            const itemToRemove = promptModal.grid.querySelector(`.prompt-item[data-id="${id}"]`);
            if (itemToRemove) {
                const img = itemToRemove.querySelector('.prompt-item-img');
                if (img && img.src.startsWith('blob:')) {
                    URL.revokeObjectURL(img.src);
                }
                itemToRemove.remove();
            }
        });
        
        promptModalBody.scrollTop = scrollPosition;

        if (confirmationModalPurpose === 'deleteSelectedPrompts') {
            toggleManageMode(false);
        }

        if (isSearchModeActive) {
            handleSearchInput();
        }

        if (newPromptsMetadata.length === 0) {
            renderPrompts();
        }

        closeModal(confirmationModal.overlay);

        if(!imageViewerModal.overlay.classList.contains('hidden')) {
            closeModal(imageViewerModal.overlay);
        }

        showToast("prompt.delete.success");
        markSearchDataAsStale();
        if(!promptViewerModal.overlay.classList.contains('hidden')) {
            closeModal(promptViewerModal.overlay);
        }
    } catch (error) {
        console.error("Failed to delete prompt:", error);
        showInfoModal("info.attention.title", "Terjadi kesalahan saat mencoba menghapus prompt.");
    }
}

// --- Manage & Search Mode ---
export function updateManageModeUI() {
    const lang = languageSettings.ui;
    const selectCountFormat = i18nData["prompt.selectCount"][lang] || i18nData["prompt.selectCount"]["id"];
    promptModal.selectCount.textContent = selectCountFormat.replace('{count}', selectedPromptIds.length);

    const allVisibleItems = Array.from(promptModal.grid.querySelectorAll('.prompt-item:not(.add-prompt-item)'));
    const allVisibleIds = allVisibleItems.map(item => parseInt(item.dataset.id, 10));

    const allAreSelected = allVisibleIds.length > 0 && allVisibleIds.every(id => selectedPromptIds.includes(id));

    if (allAreSelected) {
        promptModal.selectAllBtn.textContent = i18nData["prompt.deselectAll"][lang] || i18nData["prompt.deselectAll"]["id"];
    } else {
        promptModal.selectAllBtn.textContent = i18nData["prompt.selectAll"][lang] || i18nData["prompt.selectAll"]["id"];
    }

    promptModal.deleteSelectedBtn.disabled = selectedPromptIds.length === 0;
}

export function togglePromptSelection(promptId) {
    const idAsNumber = parseInt(promptId, 10);
    const itemElement = promptModal.grid.querySelector(`.prompt-item[data-id="${idAsNumber}"]`);
    
    let currentSelectedIds = [...selectedPromptIds];
    const index = currentSelectedIds.indexOf(idAsNumber);

    if (index > -1) {
        currentSelectedIds.splice(index, 1);
        itemElement?.classList.remove('selected');
    } else {
        currentSelectedIds.push(idAsNumber);
        itemElement?.classList.add('selected');
    }
    setSelectedPromptIds(currentSelectedIds);
    updateManageModeUI();
}

export function handleSelectAll() {
    const allPromptItems = promptModal.grid.querySelectorAll('.prompt-item:not(.add-prompt-item)');
    const allVisibleIds = Array.from(allPromptItems).map(item => parseInt(item.dataset.id, 10));
    
    const allAreSelected = allVisibleIds.length > 0 && allVisibleIds.every(id => selectedPromptIds.includes(id));

    if (allAreSelected) {
        setSelectedPromptIds(selectedPromptIds.filter(id => !allVisibleIds.includes(id)));
        allPromptItems.forEach(item => item.classList.remove('selected'));
    } else {
        const newSelectedIds = new Set([...selectedPromptIds, ...allVisibleIds]);
        setSelectedPromptIds(Array.from(newSelectedIds));
        allPromptItems.forEach(item => item.classList.add('selected'));
    }
    updateManageModeUI();
}

function handleDirectBarSwap(outgoingContent, incomingContent, onComplete) {
    outgoingContent.style.opacity = '0';

    setTimeout(() => {
        outgoingContent.classList.add('hidden');
        outgoingContent.style.opacity = '1';

        incomingContent.classList.remove('hidden');
        incomingContent.style.opacity = '0';

        void incomingContent.offsetWidth; 

        incomingContent.style.opacity = '1';

        if (onComplete) {
            onComplete();
        }
    }, 200);
}

export function toggleManageMode(forceState = null) {
    const newManageState = forceState !== null ? forceState : !isManageModeActive;

    if (newManageState && isSearchModeActive) {
        promptModal.searchInput.value = '';

        setIsSearchModeActive(false);
        setIsManageModeActive(true);
        promptModal.content.classList.remove('search-mode');
        promptModal.content.classList.add('manage-mode');

        handleDirectBarSwap(promptModal.searchContent, promptModal.manageContent, () => {
            if (sortableInstance) sortableInstance.option('disabled', true);
            updateManageModeUI();
        });
        return;
    }

    setIsManageModeActive(newManageState);
    promptModal.content.classList.toggle('manage-mode', newManageState);
    if (sortableInstance) sortableInstance.option('disabled', newManageState);

    if (newManageState) {
        promptModal.searchContent.classList.add('hidden');
        promptModal.manageContent.classList.remove('hidden');
        promptModal.actionBar.classList.remove('hidden');
        updateManageModeUI();
    } else {
        promptModal.searchInput.value = '';
        
        promptModal.actionBar.classList.add('hidden');
        promptModal.manageContent.scrollLeft = 0;
        setTimeout(() => {
            promptModal.manageContent.classList.add('hidden');
        }, 300);

        setSelectedPromptIds([]);
        promptModal.grid.querySelectorAll('.prompt-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        updateManageModeUI();
    }
}

export function handleDeleteSelected() {
    if (selectedPromptIds.length === 0) return;

    const isAnyInUse = selectedPromptIds.some(id =>
        advancedPrompts.some(p => p.characterIds && p.characterIds.includes(id))
    );

    if (isAnyInUse) {
        showInfoModal("info.attention.title", "prompt.delete.inUseError");
        return;
    }

    setConfirmationModalPurpose('deleteSelectedPrompts');
    const lang = languageSettings.ui;
    confirmationModal.title.textContent = i18nData["delete.confirm.title"][lang];
    const textFormat = i18nData["delete.confirm.selectedText"][lang];
    confirmationModal.text.textContent = textFormat.replace('{count}', selectedPromptIds.length);
    openModal(confirmationModal.overlay);
}

export function toggleSearchMode(forceState = null) {
    const newSearchState = forceState !== null ? forceState : !isSearchModeActive;

    if (newSearchState && isManageModeActive) {
        setSelectedPromptIds([]);
        promptModal.grid.querySelectorAll('.prompt-item.selected').forEach(item => {
            item.classList.remove('selected');
        });

        setIsManageModeActive(false);
        setIsSearchModeActive(true);
        promptModal.content.classList.remove('manage-mode');
        promptModal.content.classList.add('search-mode');

        handleDirectBarSwap(promptModal.manageContent, promptModal.searchContent, () => {
            if (sortableInstance) sortableInstance.option('disabled', true);
            promptModal.searchInput.focus();
        });
        return;
    }

    setIsSearchModeActive(newSearchState);
    promptModal.content.classList.toggle('search-mode', newSearchState);
    if (sortableInstance) sortableInstance.option('disabled', newSearchState);

    if (newSearchState) {
        promptModal.manageContent.classList.add('hidden');
        promptModal.searchContent.classList.remove('hidden');
        promptModal.actionBar.classList.remove('hidden');
        promptModal.searchInput.focus();
    } else {
        promptModal.actionBar.classList.add('hidden');
        setTimeout(() => {
            promptModal.searchContent.classList.add('hidden');
        }, 300);
        
        promptModal.searchInput.value = '';
        promptModal.grid.querySelectorAll('.prompt-item:not(.add-prompt-item)').forEach(item => {
            item.style.display = '';
        });

        promptModal.noResultsMessage.classList.add('hidden');
    }
}

export function handleSearchInput() {
    const searchTerm = promptModal.searchInput.value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');

    const allPromptItems = promptModal.grid.querySelectorAll('.prompt-item:not(.add-prompt-item)');
    let visibleCount = 0;

    allPromptItems.forEach(item => {
        const promptId = parseInt(item.dataset.id, 10);
        const promptData = prompts.find(p => p.id === promptId);
        
        if (promptData) {
            const singleLineText = promptData.text.replace(/\s+/g, ' ');
            const isMatch = singleLineText.toLowerCase().includes(searchTerm);
            
            item.style.display = isMatch ? '' : 'none';
            if (isMatch) {
                visibleCount++;
            }
        }
    });

    if (visibleCount === 0 && searchTerm.length > 0) {
        promptModal.noResultsMessage.classList.remove('hidden');
    } else {
        promptModal.noResultsMessage.classList.add('hidden');
    }
}