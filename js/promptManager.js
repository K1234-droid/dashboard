import {
    languageSettings, i18nData, prompts, advancedPrompts, promptModal, activePromptMenu,
    promptViewerModal, imageViewerModal, addEditPromptModal, confirmationModal,
    isManageModeActive, selectedPromptIds, confirmationModalPurpose,
    setPrompts, setActivePromptMenu, setCurrentPromptId, setConfirmationModalPurpose,
    setIsManageModeActive, setSelectedPromptIds, currentPromptId, sortableInstance,
    isSearchModeActive, setIsSearchModeActive, setCurrentImageViewerId, setImageViewerSource,
    uiHideTimeout, setUiHideTimeout, imageViewerSource, currentImageViewerId, currentImageNavList
} from './config.js';
import { openModal, closeModal, showInfoModal } from './ui.js';
import { showToast, resizeImage, blobToDataURL } from './utils.js';
import { saveSetting, getPromptBlob, savePrompt as savePromptToDB, deletePromptDB, getFullPrompt } from './storage.js';

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
export function cleanupPromptBlobs() {
    if (promptModal.grid) {
        promptModal.grid.querySelectorAll('.prompt-item-img').forEach(img => {
            if (img.src.startsWith('blob:')) {
                URL.revokeObjectURL(img.src);
            }
        });
    }
}

export async function renderPrompts(promptsToRender = prompts) {
    cleanupPromptBlobs();
    const lang = languageSettings.ui;
    
    const fragment = document.createDocumentFragment();

    const itemPromises = promptsToRender.map(async (p) => {
        const item = document.createElement('div');
        item.className = 'prompt-item img-container-loading';
        item.dataset.id = p.id;

        const img = document.createElement('img');
        img.alt = 'Prompt Image';
        img.className = 'prompt-item-img img-lazy-load';
        img.loading = 'lazy';

        item.appendChild(img);

        const thumbnailBlob = await getPromptBlob(p.id, 'imageBlobThumbnail');
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
        menuContainer.dataset.id = p.id;
        menuContainer.innerHTML = `
            <button class="prompt-menu-option" data-action="view-image">${i18nData["prompt.menu.view"][lang] || i18nData["prompt.menu.view"]["id"]}</button>
            <button class="prompt-menu-option" data-action="copy">${i18nData["prompt.menu.copy"][lang] || i18nData["prompt.menu.copy"]["id"]}</button>
            <button class="prompt-menu-option" data-action="save-image">${i18nData["prompt.menu.saveImage"][lang] || i18nData["prompt.menu.saveImage"]["id"]}</button>
            <button class="prompt-menu-option" data-action="edit">${i18nData["prompt.menu.edit"][lang] || i18nData["prompt.menu.edit"]["id"]}</button>
            <button class="prompt-menu-option" data-action="delete">${i18nData["prompt.menu.delete"][lang] || i18nData["prompt.menu.delete"]["id"]}</button>
        `;
  
        item.appendChild(menuBtn);
        item.appendChild(menuContainer);
        
        item.addEventListener('click', (e) => {
            if (isManageModeActive) {
                if (!e.target.closest('.prompt-item-menu-btn')) {
                    togglePromptSelection(p.id);
                }
                return;
            }

            if (e.target.closest('.prompt-item-menu-btn')) {
                return;
            }
            showPromptViewer(p);
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
        
        return item;
    });

    const items = await Promise.all(itemPromises);

    promptModal.grid.innerHTML = '';
    items.forEach(item => fragment.appendChild(item));

    const addBtn = document.createElement('button');
    addBtn.id = 'add-prompt-btn';
    addBtn.className = 'prompt-item add-prompt-item';
    addBtn.innerHTML = '<span>+</span>';
    addBtn.onclick = handleOpenAddPromptModal;
    fragment.appendChild(addBtn);

    promptModal.grid.appendChild(fragment);
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
    const prompt = prompts.find(p => p.id === promptId);
    const viewerBlob = await getPromptBlob(promptId, 'imageBlobViewer');

    if (prompt && viewerBlob) {
        setCurrentImageViewerId(promptId);
        setImageViewerSource(source);

        const oldUrl = imageViewerModal.image.src;
        if (oldUrl.startsWith('blob:')) {
            URL.revokeObjectURL(oldUrl);
        }
        
        imageViewerModal.image.src = URL.createObjectURL(viewerBlob);
        
        openModal(imageViewerModal.overlay);

        const controls = imageViewerModal.controls;
        if (controls) {
            controls.classList.toggle('nav-disabled', source !== 'grid');
            
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
                console.error("Gagal membuat gambar viewer (fallback):", error);
            }
        })();
    }
}

// --- Prompt Actions (Copy, Save, Edit, Delete) ---
export async function copyPromptTextFromItem(promptId) {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
        try {
            await navigator.clipboard.writeText(prompt.text);
            showToast("prompt.copy.success");
        } catch (err) {
            console.error('Gagal menyalin teks: ', err);
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
        document.body.removeChild(link);
        
        URL.revokeObjectURL(link.href);
    } else {
        console.error('Prompt atau blob gambar original tidak ditemukan untuk ID:', promptId);
    }
}

export async function copyPromptTextFromViewer() {
    try {
        await navigator.clipboard.writeText(promptViewerModal.text.textContent);
        showToast("prompt.copy.success");
    } catch (err) {
        console.error('Gagal menyalin teks: ', err);
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
    
    openModal(addEditPromptModal.overlay);
}

export async function handleSavePrompt() {
    const saveBtn = addEditPromptModal.saveBtn;
    const originalBtnText = saveBtn.textContent;
    const lang = languageSettings.ui;
    const isEditing = !!currentPromptId;

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

        if (isEditing) {
            const promptIndex = tempPromptsMetadata.findIndex(p => p.id === currentPromptId);
            if (promptIndex === -1) return;

            const fullOldPrompt = await getFullPrompt(currentPromptId);

            if (!fullOldPrompt) return;

            promptData = {
                ...tempPromptsMetadata[promptIndex],
                text: text
            };

            if (file) {
                promptData.imageBlobOriginal = file;

                const [viewer, thumbnail, icon] = await Promise.all([
                    resizeImage(file, 1080, 1920),
                    resizeImage(file, 500, 500),
                    resizeImage(file, 200, 200)
                ]);

                promptData.imageBlobViewer = viewer;
                promptData.imageBlobThumbnail = thumbnail;
                promptData.imageBlobIcon = icon;
            } else {
                promptData.imageBlobOriginal = fullOldPrompt.imageBlobOriginal;
                promptData.imageBlobViewer = fullOldPrompt.imageBlobViewer;
                promptData.imageBlobThumbnail = fullOldPrompt.imageBlobThumbnail;
                promptData.imageBlobIcon = fullOldPrompt.imageBlobIcon;
            }
            
            await savePromptToDB(promptData);

            const { imageBlobOriginal, imageBlobViewer, imageBlobThumbnail, imageBlobIcon, ...metadata } = promptData;
            tempPromptsMetadata[promptIndex] = metadata;

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

            await savePromptToDB(promptData);

            const { imageBlobOriginal: _, imageBlobViewer: _1, imageBlobThumbnail: _2, imageBlobIcon: _3, ...metadata } = promptData;
            tempPromptsMetadata.push(metadata);
        }

        setPrompts(tempPromptsMetadata);
        
        closeModal(addEditPromptModal.overlay);
        const promptModalBody = promptModal.overlay.querySelector('.modal-body');
        const scrollPosition = promptModalBody.scrollTop;
        renderPrompts();
        promptModalBody.scrollTop = scrollPosition;

        showToast(isEditing ? "prompt.edit.success" : "prompt.save.success");
        
        document.dispatchEvent(new CustomEvent('characterPromptsUpdated'));
        
        setCurrentPromptId(null);

    } catch (error) {
        console.error("Gagal menyimpan prompt (unexpected error):", error);
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
    confirmationModal.title.textContent = i18nData["prompt.delete.title"][lang];
    confirmationModal.text.textContent = i18nData["prompt.delete.text"][lang];
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
        
        renderPrompts();
        promptModalBody.scrollTop = scrollPosition;

        if (confirmationModalPurpose === 'deleteSelectedPrompts') {
            toggleManageMode(false);
        }

        closeModal(confirmationModal.overlay);

        if(!imageViewerModal.overlay.classList.contains('hidden')) {
            closeModal(imageViewerModal.overlay);
        }

        showToast("prompt.delete.success");
        if(!promptViewerModal.overlay.classList.contains('hidden')) {
            closeModal(promptViewerModal.overlay);
        }
    } catch (error) {
        console.error("Gagal menghapus prompt:", error);
        showInfoModal("info.attention.title", "Terjadi kesalahan saat mencoba menghapus prompt.");
    }
}

// --- Manage & Search Mode ---
export function updateManageModeUI() {
    const lang = languageSettings.ui;
    const selectCountFormat = i18nData["prompt.selectCount"][lang] || i18nData["prompt.selectCount"]["id"];
    promptModal.selectCount.textContent = selectCountFormat.replace('{count}', selectedPromptIds.length);

    if (selectedPromptIds.length === prompts.length && prompts.length > 0) {
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
    if (selectedPromptIds.length === prompts.length) {
        setSelectedPromptIds([]);
        allPromptItems.forEach(item => item.classList.remove('selected'));
    } else {
        setSelectedPromptIds(prompts.map(p => p.id));
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
        renderPrompts();

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
        renderPrompts();
        
        promptModal.actionBar.classList.add('hidden');
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
    confirmationModal.title.textContent = i18nData["prompt.delete.title"][lang] || i18nData["prompt.delete.title"]["id"];
    const textFormat = i18nData["prompt.delete.selectedText"][lang] || i18nData["prompt.delete.selectedText"]["id"];
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
        renderPrompts();
    }
}

export function handleSearchInput() {
    const searchTerm = promptModal.searchInput.value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');

    const filteredPrompts = prompts.filter(p => {
        const singleLineText = p.text.replace(/\s+/g, ' ');
        return singleLineText.toLowerCase().includes(searchTerm);
    });
    
    renderPrompts(filteredPrompts);

    if (filteredPrompts.length === 0 && searchTerm.length > 0) {
        promptModal.noResultsMessage.classList.remove('hidden');
    } else {
        promptModal.noResultsMessage.classList.add('hidden');
    }
}