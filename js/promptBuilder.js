import {
    languageSettings, i18nData, prompts, advancedPrompts, advancedPromptModal,
    addEditAdvancedPromptModal, advancedPromptViewerModal, confirmationModal,
    isAdvancedManageModeActive, selectedAdvancedPromptIds,
    setAdvancedPrompts, setActivePromptMenu, setCurrentAdvancedPromptId, setConfirmationModalPurpose,
    setIsAdvancedManageModeActive, setSelectedAdvancedPromptIds, currentAdvancedPromptId,
    isAdvancedSearchModeActive, setIsAdvancedSearchModeActive, advancedSortableInstance,
    confirmationModalPurpose, setCurrentImageNavList
} from './config.js';
import { openModal, closeModal, showInfoModal } from './ui.js';
import { showToast, blobToDataURL } from './utils.js';
import { saveSetting, getPromptBlob } from './storage.js';
import { showPromptContextMenu, showFullImage } from './promptManager.js';

let selectionOrder = [];

function updateSelectionVisuals() {
    const gridItems = addEditAdvancedPromptModal.characterGrid.querySelectorAll('.prompt-item');
    gridItems.forEach(item => {
        const id = parseInt(item.dataset.id, 10);
        const orderIndex = selectionOrder.indexOf(id);
        
        let numberEl = item.querySelector('.selection-order-number');
        if (orderIndex > -1) {
            item.classList.add('selected');
            if (!numberEl) {
                numberEl = document.createElement('span');
                numberEl.className = 'selection-order-number';
                item.appendChild(numberEl);
            }
            numberEl.textContent = orderIndex + 1;
        } else {
            item.classList.remove('selected');
            if (numberEl) {
                numberEl.remove();
            }
        }
    });

    const switchContainer = addEditAdvancedPromptModal.addCommaSwitchContainer;
    if (selectionOrder.length > 1) {
        switchContainer.classList.remove('hidden');
    } else {
        switchContainer.classList.add('hidden');
    }
}

function renderCharacterSelection(promptsToRender = prompts) {
    const grid = addEditAdvancedPromptModal.characterGrid;

    grid.querySelectorAll('.prompt-item-img').forEach(img => {
        if (img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
        }
    });

    grid.innerHTML = '';
    const lang = languageSettings.ui;

    if (prompts.length === 0) {
        const messageEl = document.createElement('p');
        messageEl.className = 'no-characters-message';
        messageEl.textContent = i18nData["advanced.prompt.noCharacters"][lang];
        grid.appendChild(messageEl);
        return;
    }

    if (promptsToRender.length === 0) {
        const messageEl = document.createElement('p');
        messageEl.className = 'no-characters-message';
        messageEl.textContent = i18nData["character.search.noResults"][lang];
        grid.appendChild(messageEl);
    } else {
        promptsToRender.forEach(p => {
            const item = document.createElement('div');
            item.className = 'prompt-item img-container-loading';
            item.dataset.id = p.id;
            
            const img = document.createElement('img');
            img.alt = "Character";
            img.className = "prompt-item-img img-lazy-load";
            img.loading = "lazy";
            
            item.appendChild(img);

            (async () => {
                const iconBlob = await getPromptBlob(p.id, 'imageBlobIcon');
                if (iconBlob) {
                    img.onload = () => {
                        item.classList.add('loaded');
                        img.classList.add('loaded');
                    };
                    img.src = URL.createObjectURL(iconBlob);
                } else {
                    item.classList.remove('img-container-loading');
                }
            })();
            
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id, 10);
                const index = selectionOrder.indexOf(id);
                if (index > -1) {
                    selectionOrder.splice(index, 1);
                } else {
                    selectionOrder.push(id);
                }
                updateSelectionVisuals();
            });

            grid.appendChild(item);
        });
    }
    updateSelectionVisuals();
}

export function handleCharacterSearchInput() {
    const searchTerm = addEditAdvancedPromptModal.searchInput.value.toLowerCase().trim();
    const filteredPrompts = prompts.filter(p => p.text.toLowerCase().includes(searchTerm));
    renderCharacterSelection(filteredPrompts);
}

// --- Rendering and Displaying Prompts ---
export function renderAdvancedPrompts(promptsToRender = advancedPrompts) {
    advancedPromptModal.grid.innerHTML = '';
    advancedPromptModal.noResultsMessage.classList.add('hidden');
    const lang = languageSettings.ui;

    promptsToRender.forEach(p => {
        const item = document.createElement('div');
        item.className = 'advanced-prompt-item';
        item.dataset.id = p.id;

        const text = document.createElement('p');
        const characterTexts = (p.characterIds && p.characterIds.length > 0)
            ? p.characterIds.map(charId => {
                const character = prompts.find(c => c.id === charId);
                return character ? character.text : '';
            }).filter(Boolean)
            : [];

        let combinedText;
        if (p.useCommas && characterTexts.length > 0) {
            combinedText = [p.text, ...characterTexts].filter(Boolean).join(', ');
        } else {
            combinedText = [p.text, ...characterTexts].filter(Boolean).join(' ');
        }

        text.textContent = combinedText;
        item.appendChild(text);

        const charsContainer = document.createElement('div');
        charsContainer.className = 'advanced-prompt-item-chars';
        const maxVisibleIcons = 4;
        if (p.characterIds && p.characterIds.length > 0) {
            const idsToShow = p.characterIds.slice(0, maxVisibleIcons);
            
            if(p.characterIds.length > maxVisibleIcons) {
                idsToShow.pop();
            }

            idsToShow.forEach(charId => {
                const character = prompts.find(c => c.id === charId);
                if (character) {
                    const iconWrapper = document.createElement('div');
                    iconWrapper.className = 'char-icon-wrapper img-container-loading';

                    const img = document.createElement('img');
                    img.alt = 'Character Icon';
                    img.className = 'img-lazy-load';
                    img.dataset.charId = character.id;
                    
                    iconWrapper.appendChild(img);
                    charsContainer.appendChild(iconWrapper);

                    (async () => {
                        const iconBlob = await getPromptBlob(character.id, 'imageBlobIcon');
                        if (iconBlob) {
                            img.onload = () => {
                                iconWrapper.classList.add('loaded');
                                img.classList.add('loaded');
                            };
                            img.src = URL.createObjectURL(iconBlob);
                        } else {
                            iconWrapper.classList.remove('img-container-loading');
                        }
                    })();
                }
            });

            if (p.characterIds.length > maxVisibleIcons) {
                const overflowEl = document.createElement('div');
                overflowEl.className = 'char-overflow-indicator';
                overflowEl.textContent = `+${p.characterIds.length - idsToShow.length}`;
                charsContainer.appendChild(overflowEl);
            }
        }
        item.appendChild(charsContainer);
  
        const menuBtn = document.createElement('button');
        menuBtn.className = 'prompt-item-menu-btn';
        menuBtn.innerHTML = '&#8942;';
        menuBtn.onclick = showPromptContextMenu;
  
        const menuContainer = document.createElement('div');
        menuContainer.className = 'prompt-item-menu';
        menuContainer.dataset.id = p.id;
        menuContainer.innerHTML = `
            <button class="prompt-menu-option" data-action="copy-advanced">${i18nData["prompt.menu.copy"][lang]}</button>
            <button class="prompt-menu-option" data-action="copy-char-advanced">${i18nData["prompt.menu.copyChar"][lang]}</button>
            <button class="prompt-menu-option" data-action="edit-advanced">${i18nData["prompt.menu.edit"][lang]}</button>
            <button class="prompt-menu-option" data-action="delete-advanced">${i18nData["prompt.menu.delete"][lang]}</button>
        `;
  
        item.appendChild(menuBtn);
        item.appendChild(menuContainer);
        
        item.addEventListener('click', (e) => {
            if (isAdvancedManageModeActive) {
                if (!e.target.closest('.prompt-item-menu-btn')) {
                    toggleAdvancedPromptSelection(p.id);
                }
                return;
            }
            if (e.target.closest('.prompt-item-menu-btn')) { return; }
            showAdvancedPromptViewer(p);
        });

        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        
            if (isAdvancedManageModeActive) {
                toggleAdvancedPromptSelection(p.id);
            } else {
                const menuBtn = item.querySelector('.prompt-item-menu-btn');
                if (menuBtn) {
                    menuBtn.click();
                }
            }
        });
  
        advancedPromptModal.grid.appendChild(item);
    });
  
    const addBtn = document.createElement('button');
    addBtn.id = 'add-advanced-prompt-btn';
    addBtn.className = 'prompt-item add-prompt-item';
    addBtn.innerHTML = '<span>+</span>';
    addBtn.onclick = handleOpenAddAdvancedPromptModal;
    advancedPromptModal.grid.appendChild(addBtn);
}

export function showAdvancedPromptViewer(prompt) {
    setCurrentAdvancedPromptId(prompt.id);
    const viewerBody = advancedPromptViewerModal.body;

    viewerBody.querySelectorAll('.viewer-character-thumbnail').forEach(img => {
        if (img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
        }
    });

    viewerBody.innerHTML = '';

    const mainPromptText = document.createElement('p');
    mainPromptText.className = 'viewer-prompt-text';
    mainPromptText.textContent = prompt.text;
    viewerBody.appendChild(mainPromptText);

    if (prompt.characterIds && prompt.characterIds.length > 0) {
        const lang = languageSettings.ui;
        prompt.characterIds.forEach(charId => {
            const character = prompts.find(c => c.id === charId);
            if (character) {
                const imageWrapper = document.createElement('div');
                imageWrapper.className = 'viewer-character-image-wrapper img-container-loading';

                const thumb = document.createElement('img');
                thumb.className = 'viewer-character-thumbnail img-lazy-load';

                imageWrapper.appendChild(thumb);

                const menuBtn = document.createElement('button');
                menuBtn.className = 'prompt-item-menu-btn';
                menuBtn.innerHTML = '&#8942;';
                menuBtn.onclick = showPromptContextMenu;
                imageWrapper.appendChild(menuBtn);

                const menuContainer = document.createElement('div');
                menuContainer.className = 'prompt-item-menu';
                menuContainer.dataset.id = character.id;
                menuContainer.innerHTML = `
                    <button class="prompt-menu-option" data-action="copy">${i18nData["prompt.menu.copyCharText"][lang]}</button>
                    <button class="prompt-menu-option" data-action="save-image">${i18nData["prompt.menu.saveImage"][lang] || i18nData["prompt.menu.saveImage"]["id"]}</button>
                `;
                imageWrapper.appendChild(menuContainer);
                
                viewerBody.appendChild(imageWrapper);

                (async () => {
                    const thumbnailBlob = await getPromptBlob(character.id, 'imageBlobThumbnail');
                    if (thumbnailBlob) {
                        thumb.onload = () => {
                            imageWrapper.classList.add('loaded');
                            thumb.classList.add('loaded');
                        };
                        thumb.src = URL.createObjectURL(thumbnailBlob);
                    } else {
                        imageWrapper.classList.remove('img-container-loading');
                    }
                })();

                const charText = document.createElement('p');
                charText.className = 'viewer-prompt-text';
                charText.textContent = character.text;
                viewerBody.appendChild(charText);

                thumb.addEventListener('click', () => {
                    setCurrentImageNavList(prompt.characterIds);
                    showFullImage(character.id, 'builder');
                });
            }
        });
    }
    
    openModal(advancedPromptViewerModal.overlay);
}

// --- Prompt Actions (Copy, Save, Edit, Delete) ---
export async function copyAdvancedPromptText(promptId) {
    const prompt = advancedPrompts.find(p => p.id === promptId);
    if (prompt) {
        try {
            const characterTexts = prompt.characterIds
                .map(id => prompts.find(p => p.id === id)?.text)
                .filter(Boolean);

            let combinedText;
            if (prompt.useCommas && characterTexts.length > 0) {
                combinedText = [prompt.text, ...characterTexts].filter(Boolean).join(', ');
            } else {
                combinedText = [prompt.text, ...characterTexts].filter(Boolean).join(' ');
            }

            await navigator.clipboard.writeText(combinedText);
            showToast("prompt.copy.success");
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }
}

export async function copyAdvancedCharacterText(promptId) {
    const prompt = advancedPrompts.find(p => p.id === promptId);
    if (prompt && prompt.characterIds && prompt.characterIds.length > 0) {
        try {
            const characterTexts = prompt.characterIds
                .map(id => prompts.find(p => p.id === id)?.text)
                .filter(Boolean);

            const combinedText = characterTexts.join(' ');

            await navigator.clipboard.writeText(combinedText);
            showToast("prompt.copy.success");
        } catch (err) {
            console.error('Failed to copy character text: ', err);
        }
    } else {
        showToast("prompt.copy.noChar");
    }
}

export async function copyAdvancedPromptTextFromViewer() {
    await copyAdvancedPromptText(currentAdvancedPromptId);
}

export function handleOpenAddAdvancedPromptModal() {
    setCurrentAdvancedPromptId(null);
    selectionOrder = [];
    const lang = languageSettings.ui;
    addEditAdvancedPromptModal.title.textContent = i18nData["advanced.prompt.addTitle"][lang];
    addEditAdvancedPromptModal.saveBtn.textContent = i18nData["settings.username.save"][lang];
    addEditAdvancedPromptModal.textInput.value = '';
    addEditAdvancedPromptModal.addCommaSwitch.checked = false;
    if (addEditAdvancedPromptModal.searchInput) {
        addEditAdvancedPromptModal.searchInput.value = '';
    }

    addEditAdvancedPromptModal.textInput.scrollTop = 0;
    addEditAdvancedPromptModal.characterGrid.scrollTop = 0;

    renderCharacterSelection();
    openModal(addEditAdvancedPromptModal.overlay);
}

export function handleEditAdvancedPrompt(promptId) {
    const promptToEdit = advancedPrompts.find(p => p.id === promptId);
    if (!promptToEdit) return;
    setCurrentAdvancedPromptId(promptId);
    selectionOrder = [...promptToEdit.characterIds];
    const lang = languageSettings.ui;
    
    addEditAdvancedPromptModal.title.textContent = i18nData["advanced.prompt.editTitle"][lang];
    addEditAdvancedPromptModal.saveBtn.textContent = i18nData["prompt.saveChanges"][lang];
    addEditAdvancedPromptModal.textInput.value = promptToEdit.text;
    addEditAdvancedPromptModal.addCommaSwitch.checked = promptToEdit.useCommas || false;
    if (addEditAdvancedPromptModal.searchInput) {
        addEditAdvancedPromptModal.searchInput.value = '';
    }

    addEditAdvancedPromptModal.textInput.scrollTop = 0;
    addEditAdvancedPromptModal.characterGrid.scrollTop = 0;

    renderCharacterSelection();
    openModal(addEditAdvancedPromptModal.overlay);
}

export async function handleSaveAdvancedPrompt() {
    const text = addEditAdvancedPromptModal.textInput.value.trim();
    if (!text) {
        showInfoModal("info.attention.title", "advanced.prompt.add.fieldsRequired");
        return;
    }

    const characterIds = [...selectionOrder];
    const useCommas = characterIds.length > 1 ? addEditAdvancedPromptModal.addCommaSwitch.checked : false;

    const isEditing = !!currentAdvancedPromptId;
    let tempPrompts = [...advancedPrompts];

    if (isEditing) {
        const index = tempPrompts.findIndex(p => p.id === currentAdvancedPromptId);
        if (index > -1) {
            tempPrompts[index] = { ...tempPrompts[index], text, characterIds, useCommas };
        }
    } else {
        const newPrompt = { id: Date.now(), text, characterIds, useCommas };
        tempPrompts.push(newPrompt);
    }
    
    setAdvancedPrompts(tempPrompts);
    await saveSetting('advancedPrompts', advancedPrompts);
    
    closeModal(addEditAdvancedPromptModal.overlay);
    renderAdvancedPrompts();
    showToast(isEditing ? "prompt.edit.success" : "prompt.save.success");
    setCurrentAdvancedPromptId(null);
}

export function handleDeleteAdvancedPrompt(promptId) {
    setConfirmationModalPurpose('deleteAdvancedPrompt');
    setCurrentAdvancedPromptId(promptId);
    const lang = languageSettings.ui;
    confirmationModal.title.textContent = i18nData["prompt.delete.title"][lang];
    confirmationModal.text.textContent = i18nData["prompt.delete.text"][lang];
    openModal(confirmationModal.overlay);
}

export async function confirmAdvancedDelete() {
    try {
        let newPrompts;
        if (confirmationModalPurpose === 'deleteSelectedAdvancedPrompts') {
            newPrompts = advancedPrompts.filter(p => !selectedAdvancedPromptIds.includes(p.id));
        } else {
            newPrompts = advancedPrompts.filter(p => p.id !== currentAdvancedPromptId);
        }
        setAdvancedPrompts(newPrompts);
        
        await saveSetting('advancedPrompts', advancedPrompts);
        renderAdvancedPrompts();

        if (confirmationModalPurpose === 'deleteSelectedAdvancedPrompts') {
            toggleAdvancedManageMode(false);
        }

        closeModal(confirmationModal.overlay);
        showToast("prompt.delete.success");
        if(!advancedPromptViewerModal.overlay.classList.contains('hidden')) {
            closeModal(advancedPromptViewerModal.overlay);
        }
    } catch (error) {
        console.error("Failed to delete advanced prompt:", error);
        showInfoModal("info.attention.title", "An error occurred while deleting the prompt.");
    }
}

// --- Manage & Search Mode ---
export function updateAdvancedManageModeUI() {
    const lang = languageSettings.ui;
    const selectCountFormat = i18nData["prompt.selectCount"][lang] || i18nData["prompt.selectCount"]["id"];
    advancedPromptModal.selectCount.textContent = selectCountFormat.replace('{count}', selectedAdvancedPromptIds.length);

    if (selectedAdvancedPromptIds.length === advancedPrompts.length && advancedPrompts.length > 0) {
        advancedPromptModal.selectAllBtn.textContent = i18nData["prompt.deselectAll"][lang] || i18nData["prompt.deselectAll"]["id"];
    } else {
        advancedPromptModal.selectAllBtn.textContent = i18nData["prompt.selectAll"][lang] || i18nData["prompt.selectAll"]["id"];
    }

    advancedPromptModal.deleteSelectedBtn.disabled = selectedAdvancedPromptIds.length === 0;
}

export function toggleAdvancedPromptSelection(promptId) {
    const idAsNumber = parseInt(promptId, 10);
    const itemElement = advancedPromptModal.grid.querySelector(`.advanced-prompt-item[data-id="${idAsNumber}"]`);
    
    let currentSelectedIds = [...selectedAdvancedPromptIds];
    const index = currentSelectedIds.indexOf(idAsNumber);

    if (index > -1) {
        currentSelectedIds.splice(index, 1);
        itemElement?.classList.remove('selected');
    } else {
        currentSelectedIds.push(idAsNumber);
        itemElement?.classList.add('selected');
    }
    setSelectedAdvancedPromptIds(currentSelectedIds);
    updateAdvancedManageModeUI();
}

export function handleAdvancedSelectAll() {
    const allPromptItems = advancedPromptModal.grid.querySelectorAll('.advanced-prompt-item:not(.add-prompt-item)');
    if (selectedAdvancedPromptIds.length === advancedPrompts.length) {
        setSelectedAdvancedPromptIds([]);
        allPromptItems.forEach(item => item.classList.remove('selected'));
    } else {
        setSelectedAdvancedPromptIds(advancedPrompts.map(p => p.id));
        allPromptItems.forEach(item => item.classList.add('selected'));
    }
    updateAdvancedManageModeUI();
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

export function toggleAdvancedManageMode(forceState = null) {
    const newManageState = forceState !== null ? forceState : !isAdvancedManageModeActive;

    if (newManageState && isAdvancedSearchModeActive) {
        advancedPromptModal.searchInput.value = '';
        renderAdvancedPrompts();

        setIsAdvancedSearchModeActive(false);
        setIsAdvancedManageModeActive(true);
        advancedPromptModal.content.classList.remove('search-mode');
        advancedPromptModal.content.classList.add('manage-mode');

        handleDirectBarSwap(advancedPromptModal.searchContent, advancedPromptModal.manageContent, () => {
            if (advancedSortableInstance) advancedSortableInstance.option('disabled', true);
            updateAdvancedManageModeUI();
        });
        return;
    }

    setIsAdvancedManageModeActive(newManageState);
    advancedPromptModal.content.classList.toggle('manage-mode', newManageState);
    if (advancedSortableInstance) advancedSortableInstance.option('disabled', newManageState);

    if (newManageState) {
        advancedPromptModal.searchContent.classList.add('hidden');
        advancedPromptModal.manageContent.classList.remove('hidden');
        advancedPromptModal.actionBar.classList.remove('hidden');
        updateAdvancedManageModeUI();
    } else {
        advancedPromptModal.searchInput.value = '';
        renderAdvancedPrompts();
        
        advancedPromptModal.actionBar.classList.add('hidden');
        setTimeout(() => {
            advancedPromptModal.manageContent.classList.add('hidden');
        }, 300);

        setSelectedAdvancedPromptIds([]);
        advancedPromptModal.grid.querySelectorAll('.advanced-prompt-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        updateAdvancedManageModeUI();
    }
}

export function handleAdvancedDeleteSelected() {
    if (selectedAdvancedPromptIds.length === 0) return;
    setConfirmationModalPurpose('deleteSelectedAdvancedPrompts');
    const lang = languageSettings.ui;
    confirmationModal.title.textContent = i18nData["prompt.delete.title"][lang];
    const textFormat = i18nData["prompt.delete.selectedText"][lang];
    confirmationModal.text.textContent = textFormat.replace('{count}', selectedAdvancedPromptIds.length);
    openModal(confirmationModal.overlay);
}

export function toggleAdvancedSearchMode(forceState = null) {
    const newSearchState = forceState !== null ? forceState : !isAdvancedSearchModeActive;

    if (newSearchState && isAdvancedManageModeActive) {
        setSelectedAdvancedPromptIds([]);
        advancedPromptModal.grid.querySelectorAll('.advanced-prompt-item.selected').forEach(item => {
            item.classList.remove('selected');
        });

        setIsAdvancedManageModeActive(false);
        setIsAdvancedSearchModeActive(true);
        advancedPromptModal.content.classList.remove('manage-mode');
        advancedPromptModal.content.classList.add('search-mode');

        handleDirectBarSwap(advancedPromptModal.manageContent, advancedPromptModal.searchContent, () => {
            if (advancedSortableInstance) advancedSortableInstance.option('disabled', true);
            advancedPromptModal.searchInput.focus();
        });
        return;
    }

    setIsAdvancedSearchModeActive(newSearchState);
    advancedPromptModal.content.classList.toggle('search-mode', newSearchState);
    if (advancedSortableInstance) advancedSortableInstance.option('disabled', newSearchState);

    if (newSearchState) {
        advancedPromptModal.manageContent.classList.add('hidden');
        advancedPromptModal.searchContent.classList.remove('hidden');
        advancedPromptModal.actionBar.classList.remove('hidden');
        advancedPromptModal.searchInput.focus();
    } else {
        advancedPromptModal.actionBar.classList.add('hidden');
        setTimeout(() => {
            advancedPromptModal.searchContent.classList.add('hidden');
        }, 300);
        
        advancedPromptModal.searchInput.value = '';
        renderAdvancedPrompts();
    }
}

export function handleAdvancedSearchInput() {
    const searchTerm = advancedPromptModal.searchInput.value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
    
    const filteredPrompts = advancedPrompts.filter(p => {
        if (!p) return false;

        const characterTexts = (p.characterIds || [])
            .map(id => prompts.find(char => char.id === id)?.text)
            .filter(Boolean);

        let searchableText;
        if (p.useCommas && characterTexts.length > 0) {
            searchableText = [p.text, ...characterTexts].filter(Boolean).join(', ');
        } else {
            searchableText = [p.text || '', ...characterTexts].filter(Boolean).join(' ');
        }

        const singleLineSearchableText = searchableText.replace(/\s+/g, ' ');
        return singleLineSearchableText.toLowerCase().includes(searchTerm);
    });

    renderAdvancedPrompts(filteredPrompts);

    if (filteredPrompts.length === 0 && searchTerm.length > 0) {
        advancedPromptModal.noResultsMessage.classList.remove('hidden');
    }
}

export function cleanupAdvancedPromptBlobs() {
}