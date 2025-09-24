import {
    languageSettings, i18nData, prompts, advancedPrompts, promptModal, activePromptMenu,
    promptViewerModal, imageViewerModal, addEditPromptModal, confirmationModal,
    isManageModeActive, selectedPromptIds, confirmationModalPurpose,
    setPrompts, setActivePromptMenu, setCurrentPromptId, setConfirmationModalPurpose,
    setIsManageModeActive, setSelectedPromptIds, currentPromptId, sortableInstance,
    isSearchModeActive, setIsSearchModeActive
} from './config.js';
import { openModal, closeModal, showInfoModal } from './ui.js';
import { showToast, readFileAsDataURL } from './utils.js';
import { saveSetting, updateStorageIndicator, updateEditStorageIndicator, updateStorageIndicatorForDeletion } from './storage.js';

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
export function renderPrompts(promptsToRender = prompts) {
    promptModal.grid.innerHTML = '';
    promptModal.noResultsMessage.classList.add('hidden');
    const lang = languageSettings.ui;
  
    promptsToRender.forEach(p => {
        const item = document.createElement('div');
        item.className = 'prompt-item';
        item.dataset.id = p.id;
  
        const img = document.createElement('img');
        img.src = p.imageUrl;
        img.alt = 'Prompt Image';
        img.className = 'prompt-item-img';
        img.loading = 'lazy';
        item.appendChild(img);
  
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
  
        promptModal.grid.appendChild(item);
    });
  
    const addBtn = document.createElement('button');
    addBtn.id = 'add-prompt-btn';
    addBtn.className = 'prompt-item add-prompt-item';
    addBtn.innerHTML = '<span>+</span>';
    addBtn.onclick = handleOpenAddPromptModal;
    promptModal.grid.appendChild(addBtn);
}

export function showPromptViewer(prompt) {
    setCurrentPromptId(prompt.id);
    promptViewerModal.text.textContent = prompt.text;
    openModal(promptViewerModal.overlay);
}

export function showFullImage(promptId) {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
        imageViewerModal.image.src = prompt.imageUrl;
        openModal(imageViewerModal.overlay);
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
    addEditPromptModal.imagePreviewSingle.src = '';
    addEditPromptModal.imageHelpText.style.display = 'none';

    openModal(addEditPromptModal.overlay);
    updateEditStorageIndicator();
}

export function handleEditPrompt(promptId) {
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
    addEditPromptModal.imagePreviewOld.src = promptToEdit.imageUrl;
    addEditPromptModal.imagePreviewNew.src = promptToEdit.imageUrl;
    addEditPromptModal.imagePreviewSingle.classList.add('hidden');
    addEditPromptModal.imageHelpText.style.display = 'block';
    
    openModal(addEditPromptModal.overlay);
    updateEditStorageIndicator();
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
        
        if (isEditing) {
            if (!text) {
                showInfoModal("info.attention.title", "prompt.edit.textRequired");
                return;
            }
        } else {
            if (!file || !text) {
                showInfoModal("info.attention.title", "prompt.add.fieldsRequired");
                return;
            }
        }

        const tempPrompts = JSON.parse(JSON.stringify(prompts));
        let newImageUrl = null;
        if (file) {
            try {
                newImageUrl = await readFileAsDataURL(file);
            } catch (fileError) {
                console.error("Error reading file:", fileError);
                showInfoModal("info.attention.title", "prompt.save.fileError");
                return;
            }
        }

        if (isEditing) {
            const promptIndex = tempPrompts.findIndex(p => p.id === currentPromptId);
            if (promptIndex === -1) return;
            
            tempPrompts[promptIndex].text = text;
            if (newImageUrl) {
                tempPrompts[promptIndex].imageUrl = newImageUrl;
            }
        } else {
            const newPromptData = { id: Date.now(), imageUrl: newImageUrl, text };
            tempPrompts.push(newPromptData);
        }

        const QUOTA_BYTES = 5 * 1024 * 1024;
        const finalSize = new Blob([JSON.stringify(tempPrompts)]).size;

        if (finalSize > QUOTA_BYTES) {
            showInfoModal("info.attention.title", "prompt.save.storageError");
            return;
        }
        
        await saveSetting('prompts', tempPrompts);
        setPrompts(tempPrompts);
        
        closeModal(addEditPromptModal.overlay);
        const promptModalBody = promptModal.overlay.querySelector('.modal-body');
        const scrollPosition = promptModalBody.scrollTop;
        renderPrompts();
        promptModalBody.scrollTop = scrollPosition;

        updateStorageIndicator();
        showToast(isEditing ? "prompt.edit.success" : "prompt.save.success");
        
        // Memicu pembaruan UI untuk Prompt Builder
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

        let newPrompts;
        if (confirmationModalPurpose === 'deleteSelectedPrompts') {
            newPrompts = prompts.filter(p => !selectedPromptIds.includes(p.id));
        } else {
            newPrompts = prompts.filter(p => p.id !== currentPromptId);
        }
        setPrompts(newPrompts);
        
        await saveSetting('prompts', prompts);
        renderPrompts();
        promptModalBody.scrollTop = scrollPosition;

        if (confirmationModalPurpose === 'deleteSelectedPrompts') {
            toggleManageMode(false);
        }

        updateStorageIndicator();
        closeModal(confirmationModal.overlay);
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
    updateStorageIndicatorForDeletion();
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
    outgoingContent.style.opacity = '0'; // Mulai fade-out konten yang keluar

    setTimeout(() => {
        outgoingContent.classList.add('hidden');
        outgoingContent.style.opacity = '1'; // Reset untuk penggunaan selanjutnya

        incomingContent.classList.remove('hidden');
        incomingContent.style.opacity = '0'; // Buat konten baru tak terlihat sebelum fade-in

        // Memicu reflow agar transisi fade-in berjalan dengan benar
        void incomingContent.offsetWidth; 

        incomingContent.style.opacity = '1'; // Mulai fade-in konten baru

        if (onComplete) {
            onComplete();
        }
    }, 200); // Sesuaikan durasi dengan transisi di CSS
}

export function toggleManageMode(forceState = null) {
    const newManageState = forceState !== null ? forceState : !isManageModeActive;

    // Menangani kasus khusus: beralih langsung dari mode Cari ke Kelola
    if (newManageState && isSearchModeActive) {
        // BARIS BARU: Membersihkan status pencarian sebelumnya
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
        return; // Keluar dari fungsi lebih awal
    }

    // Logika normal untuk masuk/keluar mode Kelola
    setIsManageModeActive(newManageState);
    promptModal.content.classList.toggle('manage-mode', newManageState);
    if (sortableInstance) sortableInstance.option('disabled', newManageState);

    if (newManageState) {
        promptModal.searchContent.classList.add('hidden');
        promptModal.manageContent.classList.remove('hidden');
        promptModal.actionBar.classList.remove('hidden');
        updateManageModeUI();
    } else {
        // BARIS BARU: Memastikan pencarian juga bersih saat membatalkan mode Kelola
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
        updateStorageIndicator();
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

    // Menangani kasus khusus: beralih langsung dari mode Kelola ke Cari
    if (newSearchState && isManageModeActive) {
        // BARIS BARU: Membersihkan status pengelolaan (item yang dipilih)
        setSelectedPromptIds([]);
        promptModal.grid.querySelectorAll('.prompt-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        updateStorageIndicator();

        setIsManageModeActive(false);
        setIsSearchModeActive(true);
        promptModal.content.classList.remove('manage-mode');
        promptModal.content.classList.add('search-mode');

        handleDirectBarSwap(promptModal.manageContent, promptModal.searchContent, () => {
            if (sortableInstance) sortableInstance.option('disabled', true);
            promptModal.searchInput.focus();
        });
        return; // Keluar dari fungsi lebih awal
    }

    // Logika normal untuk masuk/keluar mode Cari
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
    }
}