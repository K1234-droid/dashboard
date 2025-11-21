import {
    languageSettings, i18nData, prompts, advancedPrompts, advancedPromptModal,
    addEditAdvancedPromptModal, advancedPromptViewerModal, confirmationModal,
    isAdvancedManageModeActive, selectedAdvancedPromptIds,
    setAdvancedPrompts, setActivePromptMenu, setCurrentAdvancedPromptId, setConfirmationModalPurpose,
    setIsAdvancedManageModeActive, setSelectedAdvancedPromptIds, currentAdvancedPromptId,
    isAdvancedSearchModeActive, setIsAdvancedSearchModeActive, advancedSortableInstance,
    confirmationModalPurpose, setCurrentImageNavList, cachedIconDataUrls, setCachedIconDataUrls,
    promptFolders, currentPromptFolderId, setCurrentPromptFolderId, promptFolderModal, addEditFolderModal,
    currentEditFolderId, setCurrentEditFolderId, setPromptFolders, activeModalStack,
    isFolderManageModeActive, setIsFolderManageModeActive, isFolderSearchModeActive, setIsFolderSearchModeActive,
    selectedFolderIds, setSelectedFolderIds, folderSortableInstance, activePromptMenu, isAdvancedGridStale, 
    setIsAdvancedGridStale, moveFolderModal, selectedMoveFolderId, setSelectedMoveFolderId, promptsToMove, setPromptsToMove
} from './config.js';
import { openModal, closeModal, showInfoModal, isAdvancedModalSmallMode, showLoadingModal,
    hideLoadingModal } from './ui.js';
import { showToast, blobToDataURL } from './utils.js';
import { saveSetting, getPromptBlob } from './storage.js';
import { showPromptContextMenu, showFullImage, populateIconCacheIfNeeded, closeAllPromptMenus, openCharacterPromptManager } from './promptManager.js';
import { markSearchDataAsStale } from './search.js';
import { closeHeaderMenu } from './main.js';

export function openAdvancedPromptManager() {
    showLoadingModal();
    setTimeout(async () => {
        await populateIconCacheIfNeeded();
        const previousFolderId = currentPromptFolderId;
        setCurrentPromptFolderId('all');
        renderFolderTabs();
        const isGridEmpty = advancedPromptModal.grid.children.length <= 1;
        if (isAdvancedGridStale || previousFolderId !== 'all' || isGridEmpty) {
            filterAndRenderAdvancedPrompts(); 
            setIsAdvancedGridStale(false);
        }
        hideLoadingModal();
        openModal(advancedPromptModal.overlay);
        const manageContent = advancedPromptModal.manageContent;
        if (manageContent) {
            manageContent.addEventListener('wheel', (e) => {
                if (isAdvancedManageModeActive) {
                    e.preventDefault();
                    manageContent.scrollLeft += e.deltaY;
                }
            }, { passive: false });
        }
    }, 50);
}

function getIconDataUrl(charId) {
    return cachedIconDataUrls[charId];
}

let selectedFolderId = 'all';

export function showSidebarFolderContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    closeHeaderMenu();
    closeAllPromptMenus();

    const menu = document.getElementById('folder-sidebar-context-menu');
    if (!menu) return;

    const folderBtn = e.currentTarget;
    const folderId = folderBtn.dataset.folderId;
    if (folderId === 'all' || folderId === 'archive') {
        return;
    }
    
    menu.dataset.id = folderId;

    const lang = languageSettings.ui;
    menu.querySelector('[data-action="edit-folder"]').textContent = i18nData["prompt.menu.edit"][lang];
    menu.querySelector('[data-action="delete-folder"]').textContent = i18nData["prompt.menu.delete"][lang];

    menu.style.top = `${e.clientY}px`;
    menu.style.left = `${e.clientX}px`;
    menu.style.display = 'flex';

    setActivePromptMenu(menu);
}

/**
 * @param {number} characterId - ID dari prompt karakter yang telah diperbarui.
 */
export async function updateCharacterIconInBuilderItems(characterId) {
    const newIconBlob = await getPromptBlob(characterId, 'imageBlobIcon', true);
    if (!newIconBlob) return;

    const newSrcDataUrl = await blobToDataURL(newIconBlob);

    const updatedCache = { ...cachedIconDataUrls, [characterId]: newSrcDataUrl };
    setCachedIconDataUrls(updatedCache);

    const affectedIcons = advancedPromptModal.grid.querySelectorAll(`.advanced-prompt-item-chars img[data-char-id="${characterId}"]`);

    affectedIcons.forEach(img => {
        const iconWrapper = img.closest('.char-icon-wrapper');
        if (!iconWrapper) return;

        iconWrapper.classList.remove('loaded');
        iconWrapper.classList.add('img-container-loading');

        if (img.src && img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
        }

        const newSrc = URL.createObjectURL(newIconBlob);
        
        img.onload = () => {
            iconWrapper.classList.add('loaded');
            img.classList.add('loaded');
            iconWrapper.classList.remove('img-container-loading');
        };
        img.src = newSrcDataUrl;
    });
}

export async function handleCharacterDeletionInBuilder(deletedCharacterIds) {
    let wasModified = false;
    const affectedAdvancedPrompts = [];

    const newAdvancedPromptsState = advancedPrompts.map(p => {
        if (!p.characterIds || p.characterIds.length === 0) return p;

        const originalLength = p.characterIds.length;
        const newCharacterIds = p.characterIds.filter(id => !deletedCharacterIds.includes(id));

        if (newCharacterIds.length < originalLength) {
            wasModified = true;
            const updatedPrompt = { ...p, characterIds: newCharacterIds };
            affectedAdvancedPrompts.push(updatedPrompt);
            return updatedPrompt;
        }
        return p;
    });

    if (wasModified) {
        setAdvancedPrompts(newAdvancedPromptsState);
        await saveSetting('advancedPrompts', newAdvancedPromptsState);

        for (const prompt of affectedAdvancedPrompts) {
            await updateSingleAdvancedPromptItem(prompt);
        }
        markSearchDataAsStale();
    }
}

let selectionOrder = [];
let isCharacterGridStale = true;
document.addEventListener('characterListUpdated', () => {
    isCharacterGridStale = true;
    if (!addEditAdvancedPromptModal.overlay.classList.contains('hidden')) {
        syncCharacterSelectionGrid();
    }
});

export function reorderAdvancedPromptGrid() {
    const grid = advancedPromptModal.grid;
    const addBtn = grid.querySelector('#add-advanced-prompt-btn');

    const itemsMap = new Map();
    grid.querySelectorAll('.advanced-prompt-item:not(.add-prompt-item)').forEach(item => {
        itemsMap.set(parseInt(item.dataset.id, 10), item);
    });

    advancedPrompts.forEach((prompt, index) => {
        const currentItem = itemsMap.get(prompt.id);
        if (!currentItem) return;

        const nextPromptInData = advancedPrompts[index + 1];
        const nextItemInDom = nextPromptInData ? itemsMap.get(nextPromptInData.id) : addBtn;

        if (currentItem.nextElementSibling !== nextItemInDom) {
            grid.insertBefore(currentItem, nextItemInDom);
        }
    });
}

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

function createCharacterItem(prompt) {
    const item = document.createElement('div');
    item.className = 'prompt-item img-container-loading';
    item.dataset.id = prompt.id;
    
    const img = document.createElement('img');
    img.alt = "Character";
    img.className = "prompt-item-img img-lazy-load";
    img.loading = "lazy";
    item.appendChild(img);

    const iconDataUrl = getIconDataUrl(prompt.id);

    if (iconDataUrl) {
        img.src = iconDataUrl; 
        item.classList.remove('img-container-loading');
        item.classList.add('loaded');
        img.classList.add('loaded');
    } else {
        item.classList.remove('img-container-loading');
        (async () => {
             const iconBlob = await getPromptBlob(prompt.id, 'imageBlobIcon');
             if (iconBlob) {
                 img.onload = () => {
                     item.classList.add('loaded');
                     img.classList.add('loaded');
                 };
                 img.src = URL.createObjectURL(iconBlob);
             }
        })();
    }

    item.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
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

    return item;
}

async function syncCharacterSelectionGrid() {
    if (addEditAdvancedPromptModal.searchInput && addEditAdvancedPromptModal.searchInput.value) {
        return;
    }

    const grid = addEditAdvancedPromptModal.characterGrid;
    const lang = languageSettings.ui;

    const domItemsMap = new Map();
    grid.querySelectorAll('.prompt-item').forEach(item => {
        domItemsMap.set(parseInt(item.dataset.id, 10), item);
    });

    const noCharMessage = grid.querySelector('.no-characters-message');
    if (noCharMessage) noCharMessage.remove();

    let lastSeenElement = null;
    for (const prompt of prompts) {
        const currentItem = domItemsMap.get(prompt.id);

        if (currentItem) {
            if ((lastSeenElement && lastSeenElement.nextElementSibling !== currentItem) || (!lastSeenElement && grid.firstChild !== currentItem)) {
                grid.insertBefore(currentItem, lastSeenElement ? lastSeenElement.nextElementSibling : grid.firstChild);
            }
            domItemsMap.delete(prompt.id);
        } else {
            const newItem = createCharacterItem(prompt);
            grid.insertBefore(newItem, lastSeenElement ? lastSeenElement.nextElementSibling : grid.firstChild);
        }
        lastSeenElement = grid.querySelector(`.prompt-item[data-id="${prompt.id}"]`);
    }

    for (const itemToRemove of domItemsMap.values()) {
        const img = itemToRemove.querySelector('img');
        if (img && img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
        }
        itemToRemove.remove();
    }

    if (prompts.length === 0 && !grid.querySelector('.no-characters-message')) {
        const messageEl = document.createElement('p');
        messageEl.className = 'no-characters-message';
        messageEl.textContent = i18nData["advanced.prompt.noCharacters"][lang];
        grid.appendChild(messageEl);
    }

    updateSelectionVisuals();
    isCharacterGridStale = false;
}

export async function updateSingleCharacterItem(updatedCharacter) {
    if (!addEditAdvancedPromptModal.characterGrid) return;

    const item = addEditAdvancedPromptModal.characterGrid.querySelector(`.prompt-item[data-id="${updatedCharacter.id}"]`);
    if (!item) return;

    const img = item.querySelector('.prompt-item-img');
    if (!img) return;

    item.classList.remove('loaded');
    item.classList.add('img-container-loading');

    const iconDataUrl = getIconDataUrl(updatedCharacter.id); 

    if (iconDataUrl) {
        if (img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
        }

        img.onload = () => {
            item.classList.add('loaded');
            img.classList.add('loaded');
            item.classList.remove('img-container-loading');
        };
        img.src = iconDataUrl;
    } else {
        item.classList.remove('img-container-loading');
    }
}

export function handleCharacterSearchInput() {
    const searchTerm = addEditAdvancedPromptModal.searchInput.value.toLowerCase().trim();
    const allCharacterItems = addEditAdvancedPromptModal.characterGrid.querySelectorAll('.prompt-item');
    const lang = languageSettings.ui;
    let visibleCount = 0;

    allCharacterItems.forEach(item => {
        const id = parseInt(item.dataset.id, 10);
        const promptData = prompts.find(p => p.id === id);
        if (promptData) {
            const isMatch = promptData.text.toLowerCase().includes(searchTerm);
            item.style.display = isMatch ? '' : 'none';
            if (isMatch) visibleCount++;
        }
    });

    let noResultsEl = addEditAdvancedPromptModal.characterGrid.querySelector('.no-characters-message');
    if (!noResultsEl) {
        noResultsEl = document.createElement('p');
        noResultsEl.className = 'no-characters-message';
        addEditAdvancedPromptModal.characterGrid.appendChild(noResultsEl);
    }

    if (prompts.length === 0) {
        noResultsEl.textContent = i18nData["advanced.prompt.noCharacters"][lang];
        noResultsEl.style.display = 'block';
    } else if (visibleCount === 0 && searchTerm.length > 0) {
        noResultsEl.textContent = i18nData["character.search.noResults"][lang];
        noResultsEl.style.display = 'block';
    } else {
        noResultsEl.style.display = 'none';
    }
}

// --- Rendering and Displaying Prompts ---
export async function updateSingleAdvancedPromptItem(updatedPrompt) {
    const item = advancedPromptModal.grid.querySelector(`.advanced-prompt-item[data-id="${updatedPrompt.id}"]`);
    if (!item) return;

    let textWrapper = item.querySelector('.advanced-prompt-text-wrapper');
    if (!textWrapper) {
        textWrapper = document.createElement('div');
        textWrapper.className = 'advanced-prompt-text-wrapper';
        item.insertBefore(textWrapper, item.querySelector('.advanced-prompt-item-chars'));
    }

    let titleElement = textWrapper.querySelector('.advanced-prompt-item-title');
    if (updatedPrompt.title) {
        if (!titleElement) {
            titleElement = document.createElement('h5');
            titleElement.className = 'advanced-prompt-item-title';
            textWrapper.prepend(titleElement);
        }
        titleElement.textContent = updatedPrompt.title;
    } else if (titleElement) {
        titleElement.remove();
    }

    let textElement = textWrapper.querySelector('p');
    if (!textElement) {
        textElement = document.createElement('p');
        textWrapper.appendChild(textElement);
    }

    if (textElement) {
        const characterTexts = (updatedPrompt.characterIds || [])
            .map(charId => prompts.find(c => c.id === charId)?.text)
            .filter(Boolean);

        let combinedText;
        if (updatedPrompt.useCommas && characterTexts.length > 0) {
            combinedText = [updatedPrompt.text, ...characterTexts].filter(Boolean).join(', ');
        } else {
            combinedText = [updatedPrompt.text, ...characterTexts].filter(Boolean).join(' ');
        }
        textElement.textContent = combinedText;
    }

    const charsContainer = item.querySelector('.advanced-prompt-item-chars');
    if (charsContainer) {
        charsContainer.querySelectorAll('.char-icon-wrapper, .char-overflow-indicator').forEach(el => {
            const img = el.querySelector('img');
            if (img && img.src.startsWith('blob:')) {
                URL.revokeObjectURL(img.src);
            }
            el.remove();
        });

        if (updatedPrompt.characterIds && updatedPrompt.characterIds.length > 0) {
            for (const charId of updatedPrompt.characterIds) {
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

                    const iconDataUrl = getIconDataUrl(character.id);

                    if (iconDataUrl) {
                        iconWrapper.classList.remove('img-container-loading');
                        iconWrapper.classList.add('loaded');
                        img.classList.add('loaded');
                        img.src = iconDataUrl;
                    } else {
                        iconWrapper.classList.remove('img-container-loading');
                        const iconBlob = await getPromptBlob(character.id, 'imageBlobIcon');
                        if (iconBlob) {
                            img.onload = () => {
                                iconWrapper.classList.add('loaded');
                                img.classList.add('loaded');
                            };
                            if (img.src.startsWith('blob:')) {
                                URL.revokeObjectURL(img.src);
                            }
                            img.src = URL.createObjectURL(iconBlob);
                        }
                    }
                }
            }
        }
        const overflowEl = document.createElement('span');
        overflowEl.className = 'char-overflow-indicator';
        overflowEl.style.display = 'none';
        charsContainer.appendChild(overflowEl);
    }
    
    adjustVisibleIcons();
}

async function appendNewAdvancedPromptItem(newPrompt) {
    const lang = languageSettings.ui;
    const item = document.createElement('div');
    item.className = 'advanced-prompt-item';
    item.dataset.id = newPrompt.id;

    const textWrapper = document.createElement('div');
    textWrapper.className = 'advanced-prompt-text-wrapper';

    if (newPrompt.title) {
        const titleEl = document.createElement('h5');
        titleEl.className = 'advanced-prompt-item-title';
        titleEl.textContent = newPrompt.title;
        textWrapper.appendChild(titleEl);
    }

    const text = document.createElement('p');
    const characterTexts = (newPrompt.characterIds || [])
        .map(charId => prompts.find(c => c.id === charId)?.text)
        .filter(Boolean);

    let combinedText;
    if (newPrompt.useCommas && characterTexts.length > 0) {
        combinedText = [newPrompt.text, ...characterTexts].filter(Boolean).join(', ');
    } else {
        combinedText = [newPrompt.text, ...characterTexts].filter(Boolean).join(' ');
    }
    text.textContent = combinedText;
    textWrapper.appendChild(text);

    item.appendChild(textWrapper);

    const charsContainer = document.createElement('div');
    charsContainer.className = 'advanced-prompt-item-chars';
    
    if (newPrompt.characterIds && newPrompt.characterIds.length > 0) {
        for (const charId of newPrompt.characterIds) {
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

                const iconDataUrl = getIconDataUrl(character.id);

                if (iconDataUrl) {
                    iconWrapper.classList.remove('img-container-loading');
                    iconWrapper.classList.add('loaded');
                    img.classList.add('loaded');
                    img.src = iconDataUrl;
                } else {
                    iconWrapper.classList.remove('img-container-loading');
                    const iconBlob = await getPromptBlob(character.id, 'imageBlobIcon');
                    if (iconBlob) {
                        img.onload = () => {
                            iconWrapper.classList.add('loaded');
                            img.classList.add('loaded');
                        };
                        img.src = URL.createObjectURL(iconBlob);
                    }
                }
            }
        }
    }
    const overflowEl = document.createElement('span');
    overflowEl.className = 'char-overflow-indicator';
    overflowEl.style.display = 'none';
    charsContainer.appendChild(overflowEl);

    item.appendChild(charsContainer);

    const menuBtn = document.createElement('button');
    menuBtn.className = 'prompt-item-menu-btn';
    menuBtn.innerHTML = '&#8942;';
    menuBtn.onclick = showPromptContextMenu;
    item.appendChild(menuBtn);
    
    const isArchived = newPrompt.archived || false;
    const archiveAction = isArchived ? 'unarchive-advanced' : 'archive-advanced';
    const archiveText = isArchived ? (i18nData["prompt.unarchive"][lang]) : (i18nData["prompt.archive"][lang]);
        
    const menuContainer = document.createElement('div');
    menuContainer.className = 'prompt-item-menu';
    menuContainer.dataset.id = newPrompt.id;

    menuContainer.innerHTML = `
        <button class="prompt-menu-option" data-action="copy-advanced">${i18nData["prompt.menu.copy"][lang]}</button>
        <button class="prompt-menu-option" data-action="copy-char-advanced">${i18nData["prompt.menu.copyChar"][lang]}</button>
        <button class="prompt-menu-option" data-action="move-advanced">${i18nData["prompt.menu.move"][lang]}</button> 
        <button class="prompt-menu-option" data-action="${archiveAction}">${archiveText}</button>
        <button class="prompt-menu-option" data-action="edit-advanced">${i18nData["prompt.menu.edit"][lang]}</button>
        <button class="prompt-menu-option" data-action="delete-advanced">${i18nData["prompt.menu.delete"][lang]}</button>
    `;
    item.appendChild(menuContainer);
    
    item.addEventListener('click', (e) => {
        if (isAdvancedManageModeActive) {
            if (!e.target.closest('.prompt-item-menu-btn')) {
                toggleAdvancedPromptSelection(newPrompt.id);
            }
            return;
        }
        if (e.target.closest('.prompt-item-menu-btn')) { return; }
        const currentPromptData = advancedPrompts.find(prompt => prompt.id === newPrompt.id);
        if (currentPromptData) {
            showAdvancedPromptViewer(currentPromptData);
        }
    });

    item.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (isAdvancedManageModeActive) {
            toggleAdvancedPromptSelection(newPrompt.id);
        } else {
            const btn = item.querySelector('.prompt-item-menu-btn');
            if (btn) btn.click();
        }
    });

    const addBtn = advancedPromptModal.grid.querySelector('#add-advanced-prompt-btn');
    advancedPromptModal.grid.insertBefore(item, addBtn);
    
    adjustVisibleIcons();
}

export function renderAdvancedPrompts(promptsToRender = advancedPrompts) {
    const oldImages = advancedPromptModal.grid.querySelectorAll('.advanced-prompt-item-chars img');
    advancedPromptModal.grid.innerHTML = '';
    advancedPromptModal.noResultsMessage.classList.add('hidden');
    const lang = languageSettings.ui;

    promptsToRender.forEach(p => {
        const item = document.createElement('div');
        item.className = 'advanced-prompt-item';
        item.dataset.id = p.id;

        const textWrapper = document.createElement('div');
        textWrapper.className = 'advanced-prompt-text-wrapper';

        if (p.title) {
            const titleEl = document.createElement('h5');
            titleEl.className = 'advanced-prompt-item-title';
            titleEl.textContent = p.title;
            textWrapper.appendChild(titleEl);
        }

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
        textWrapper.appendChild(text);

        item.appendChild(textWrapper);

        const charsContainer = document.createElement('div');
        charsContainer.className = 'advanced-prompt-item-chars';
        
        if (p.characterIds && p.characterIds.length > 0) {
            
            p.characterIds.forEach(charId => {
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

                    const iconDataUrl = getIconDataUrl(character.id);
                    
                    if (iconDataUrl) {
                        iconWrapper.classList.remove('img-container-loading');
                        iconWrapper.classList.add('loaded');
                        img.classList.add('loaded');
                        img.src = iconDataUrl;
                    } else {
                        iconWrapper.classList.remove('img-container-loading');
                        (async () => {
                             const iconBlob = await getPromptBlob(character.id, 'imageBlobIcon');
                             if (iconBlob) {
                                 img.onload = () => {
                                     iconWrapper.classList.add('loaded');
                                     img.classList.add('loaded');
                                 };
                                 img.src = URL.createObjectURL(iconBlob);
                             }
                        })();
                    }
                }
            });

            adjustVisibleIcons();
        }

        const overflowEl = document.createElement('span');
        overflowEl.className = 'char-overflow-indicator';
        overflowEl.style.display = 'none';
        charsContainer.appendChild(overflowEl);
        
        item.appendChild(charsContainer);
  
        const menuBtn = document.createElement('button');
        menuBtn.className = 'prompt-item-menu-btn';
        menuBtn.innerHTML = '&#8942;';
        menuBtn.onclick = showPromptContextMenu;
  
        const isArchived = p.archived || false;
        const archiveAction = isArchived ? 'unarchive-advanced' : 'archive-advanced';
        const archiveText = isArchived ? (i18nData["prompt.unarchive"][lang]) : (i18nData["prompt.archive"][lang]);
        
        const menuContainer = document.createElement('div');
        menuContainer.className = 'prompt-item-menu';
        menuContainer.dataset.id = p.id;

        menuContainer.innerHTML = `
            <button class="prompt-menu-option" data-action="copy-advanced">${i18nData["prompt.menu.copy"][lang]}</button>
            <button class="prompt-menu-option" data-action="copy-char-advanced">${i18nData["prompt.menu.copyChar"][lang]}</button>
            <button class="prompt-menu-option" data-action="move-advanced">${i18nData["prompt.menu.move"][lang]}</button>
            <button class="prompt-menu-option" data-action="${archiveAction}">${archiveText}</button>
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
            const currentPromptData = advancedPrompts.find(prompt => prompt.id === p.id);
            if (currentPromptData) {
                showAdvancedPromptViewer(currentPromptData);
            }
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

    if (promptsToRender.length > 0) {
        addBtn.style.display = 'none';
    } else {
        addBtn.style.display = '';
    }

    advancedPromptModal.grid.appendChild(addBtn);

    oldImages.forEach(img => {
        if (img.src && img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
        }
    });
}

export function adjustVisibleIcons() {
    const gridItems = advancedPromptModal.grid.querySelectorAll('.advanced-prompt-item:not(.add-prompt-item)');
    if (gridItems.length === 0) return;

    const maxVisibleIcons = window.matchMedia("(max-width: 640px)").matches ? 3 : 4;

    gridItems.forEach(item => {
        const promptId = parseInt(item.dataset.id, 10);
        const promptData = advancedPrompts.find(p => p.id === promptId);
        if (!promptData || !promptData.characterIds || promptData.characterIds.length === 0) {
            return;
        }

        const totalIcons = promptData.characterIds.length;
        const iconWrappers = item.querySelectorAll('.char-icon-wrapper');
        const overflowEl = item.querySelector('.char-overflow-indicator');

        let numToShow = totalIcons;
        if (totalIcons > maxVisibleIcons) {
            numToShow = maxVisibleIcons - 1;
        }

        iconWrappers.forEach((wrapper, index) => {
            wrapper.style.display = index < numToShow ? '' : 'none';
        });

        if (overflowEl) {
            if (totalIcons > maxVisibleIcons) {
                overflowEl.textContent = `+${totalIcons - numToShow}`;
                overflowEl.style.display = '';
            } else {
                overflowEl.style.display = 'none';
            }
        }
    });
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

    const mainPromptBox = document.createElement('div');
    mainPromptBox.className = 'viewer-prompt-text viewer-prompt-wrapper-box'; 

    if (prompt.title) {
        const titleEl = document.createElement('h5');
        titleEl.className = 'advanced-prompt-viewer-title-in-box';
        titleEl.textContent = prompt.title;
        mainPromptBox.appendChild(titleEl);
    }

    const mainPromptText = document.createElement('p');
    mainPromptText.className = 'viewer-prompt-main-text';
    mainPromptText.textContent = prompt.text;
    mainPromptBox.appendChild(mainPromptText);

    viewerBody.appendChild(mainPromptBox);

    if (prompt.characterIds && prompt.characterIds.length > 0) {
        const lang = languageSettings.ui;
        prompt.characterIds.forEach(charId => {
            const character = prompts.find(c => c.id === charId);
            if (character) {
                const imageWrapper = document.createElement('div');
                imageWrapper.className = 'viewer-character-image-wrapper img-container-loading';

                const thumb = document.createElement('img');
                thumb.className = 'viewer-character-thumbnail img-lazy-load';

                thumb.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                });

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
            log('error', 'log.error.copyFailed', {}, err);
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
            log('error', 'log.error.copyCharTextFailed', {}, err);
        }
    } else {
        showToast("prompt.copy.noChar");
    }
}

export async function copyAdvancedPromptTextFromViewer() {
    await copyAdvancedPromptText(currentAdvancedPromptId);
}

export async function handleOpenAddAdvancedPromptModal() {
    await populateIconCacheIfNeeded();
    setCurrentAdvancedPromptId(null);
    selectionOrder = [];
    const lang = languageSettings.ui;
    addEditAdvancedPromptModal.title.textContent = i18nData["advanced.prompt.addTitle"][lang];
    addEditAdvancedPromptModal.saveBtn.textContent = i18nData["settings.username.save"][lang];
    addEditAdvancedPromptModal.titleInput.value = '';
    addEditAdvancedPromptModal.textInput.value = '';
    addEditAdvancedPromptModal.addCommaSwitch.checked = false;

    if (isCharacterGridStale) {
        syncCharacterSelectionGrid();
    }

    if (addEditAdvancedPromptModal.searchInput) {
        addEditAdvancedPromptModal.searchInput.value = '';
    }
    handleCharacterSearchInput();

    addEditAdvancedPromptModal.textInput.scrollTop = 0;
    addEditAdvancedPromptModal.characterGrid.scrollTop = 0;

    populateFolderDropdown();

    if (currentPromptFolderId === 'archive') {
        selectedFolderId = 'archive';
    } else {
        selectedFolderId = (currentPromptFolderId === 'all') ? 'all' : currentPromptFolderId;
    }

    updateFolderDropdownDisplay();

    updateSelectionVisuals();
    openModal(addEditAdvancedPromptModal.overlay);
}

export async function handleEditAdvancedPrompt(promptId) {
    await populateIconCacheIfNeeded();
    const promptToEdit = advancedPrompts.find(p => p.id === promptId);
    if (!promptToEdit) return;
    setCurrentAdvancedPromptId(promptId);
    selectionOrder = [...promptToEdit.characterIds];
    const lang = languageSettings.ui;
    const isCurrentlyArchived = promptToEdit.archived || false;
    
    addEditAdvancedPromptModal.title.textContent = i18nData["advanced.prompt.editTitle"][lang];
    addEditAdvancedPromptModal.saveBtn.textContent = i18nData["prompt.saveChanges"][lang];
    addEditAdvancedPromptModal.titleInput.value = promptToEdit.title || '';
    addEditAdvancedPromptModal.textInput.value = promptToEdit.text;
    addEditAdvancedPromptModal.addCommaSwitch.checked = promptToEdit.useCommas || false;

    selectedFolderId = isCurrentlyArchived 
        ? (promptToEdit.folderId || 'all') 
        : (promptToEdit.folderId || 'all');

    if (isCharacterGridStale) {
        syncCharacterSelectionGrid();
    }

    if (addEditAdvancedPromptModal.searchInput) {
        addEditAdvancedPromptModal.searchInput.value = '';
    }
    handleCharacterSearchInput();

    addEditAdvancedPromptModal.textInput.scrollTop = 0;
    addEditAdvancedPromptModal.characterGrid.scrollTop = 0;

    populateFolderDropdown();
    selectedFolderId = promptToEdit.folderId || 'all';
    updateFolderDropdownDisplay();

    updateSelectionVisuals();
    openModal(addEditAdvancedPromptModal.overlay);
    addEditAdvancedPromptModal.overlay.dataset.isArchived = isCurrentlyArchived.toString();
}

export async function handleSaveAdvancedPrompt() {
    const title = addEditAdvancedPromptModal.titleInput.value.trim();
    const text = addEditAdvancedPromptModal.textInput.value.trim();
    if (!text) {
        showInfoModal("info.attention.title", "advanced.prompt.add.fieldsRequired");
        return;
    }

    const characterIds = [...selectionOrder];
    const useCommas = characterIds.length > 1 ? addEditAdvancedPromptModal.addCommaSwitch.checked : false;

    const isFolderDropdownArchive = selectedFolderId === 'archive';
    
    let statusArsipBaru;
    let folderIdBaru;

    const isEditing = !!currentAdvancedPromptId;
    let tempPrompts = [...advancedPrompts];

    const originalPrompt = isEditing ? tempPrompts.find(p => p.id === currentAdvancedPromptId) : null;
    const originalIsArchived = originalPrompt ? (originalPrompt.archived || false) : false;

    if (isEditing) {
        const folderIdLama = originalPrompt.folderId || 'all';

        if (isFolderDropdownArchive) {
            statusArsipBaru = true;
            folderIdBaru = null;
        } else if (selectedFolderId !== folderIdLama) {
            statusArsipBaru = false;
            folderIdBaru = (selectedFolderId === 'all') ? null : selectedFolderId;
        } else if (originalIsArchived && selectedFolderId === folderIdLama) {
            statusArsipBaru = true;
            folderIdBaru = null;
        } else {
            statusArsipBaru = originalIsArchived;
            folderIdBaru = (selectedFolderId === 'all') ? null : selectedFolderId;
        }
        
        const index = tempPrompts.findIndex(p => p.id === currentAdvancedPromptId);
        if (index > -1) {
            tempPrompts[index] = { 
                ...tempPrompts[index], 
                title, 
                text, 
                characterIds, 
                useCommas, 
                folderId: folderIdBaru, 
                archived: statusArsipBaru 
            };
        }
    } else {
        if (isFolderDropdownArchive) {
            statusArsipBaru = true;
            folderIdBaru = null;
        } else {
            statusArsipBaru = false;
            folderIdBaru = (selectedFolderId === 'all') ? null : selectedFolderId;
        }
        
        const newPrompt = { 
            id: Date.now(), 
            title, 
            text, 
            characterIds, 
            useCommas, 
            folderId: folderIdBaru, 
            archived: statusArsipBaru 
        }; 
        tempPrompts.unshift(newPrompt);
    }
    
    setAdvancedPrompts(tempPrompts);
    await saveSetting('advancedPrompts', advancedPrompts);
    
    closeModal(addEditAdvancedPromptModal.overlay);
    const promptData = isEditing 
    ? tempPrompts.find(p => p.id === currentAdvancedPromptId) 
    : tempPrompts[0];

    closeModal(addEditAdvancedPromptModal.overlay);

    if (isAdvancedSearchModeActive) {
        if (isEditing) {
            await updateSingleAdvancedPromptItem(promptData);
        } else {
            filterAndRenderAdvancedPrompts();
        }
        handleAdvancedSearchInput();
    } else {
        if (isEditing) {
            const originalIsArchived = isEditing ? advancedPrompts.find(p => p.id === currentAdvancedPromptId)?.archived : false;
            if (statusArsipBaru !== originalIsArchived || folderIdBaru !== (originalPrompt.folderId || null)) {
                filterAndRenderAdvancedPrompts();
            } else {
               await updateSingleAdvancedPromptItem(promptData);
            }
        } else {
           filterAndRenderAdvancedPrompts();
        }
    }

    showToast(isEditing ? "prompt.edit.success" : "prompt.save.success");
    markSearchDataAsStale();
    setCurrentAdvancedPromptId(null);
}

export function handleDeleteAdvancedPrompt(promptId) {
    setConfirmationModalPurpose('deleteAdvancedPrompt');
    setCurrentAdvancedPromptId(promptId);
    const lang = languageSettings.ui;
    confirmationModal.title.textContent = i18nData["delete.confirm.title"][lang];
    confirmationModal.text.textContent = i18nData["delete.confirm.text"][lang];
    openModal(confirmationModal.overlay);
}

export async function confirmAdvancedDelete() {
    try {
        let idsToDelete;
        if (confirmationModalPurpose === 'deleteSelectedAdvancedPrompts') {
            idsToDelete = [...selectedAdvancedPromptIds];
        } else {
            idsToDelete = [currentAdvancedPromptId];
        }

        const newPrompts = advancedPrompts.filter(p => !idsToDelete.includes(p.id));
        setAdvancedPrompts(newPrompts);
        
        await saveSetting('advancedPrompts', newPrompts);

        idsToDelete.forEach(id => {
            const itemToRemove = advancedPromptModal.grid.querySelector(`.advanced-prompt-item[data-id="${id}"]`);
            if (itemToRemove) {
                itemToRemove.querySelectorAll('.char-icon-wrapper img').forEach(img => {
                    if (img && img.src.startsWith('blob:')) {
                        URL.revokeObjectURL(img.src);
                    }
                });
                itemToRemove.remove();
            }
        });

        if (confirmationModalPurpose === 'deleteSelectedAdvancedPrompts') {
            toggleAdvancedManageMode(false);
        }

        if (isAdvancedSearchModeActive) {
            handleAdvancedSearchInput();
        } else {
            filterAndRenderAdvancedPrompts(); 
        }

        closeModal(confirmationModal.overlay);
        showToast("prompt.delete.success");
        markSearchDataAsStale();
        if(!advancedPromptViewerModal.overlay.classList.contains('hidden')) {
            closeModal(advancedPromptViewerModal.overlay);
        }
    } catch (error) {
        console.error("Failed to delete advanced prompt:", error);
        showInfoModal("info.attention.title", "An error occurred while deleting the prompt.");
    }
}

export function handleArchiveAdvancedPrompt(promptId, archiveState) {
    const promptToUpdate = advancedPrompts.find(p => p.id === promptId);
    if (!promptToUpdate) return;
    
    setConfirmationModalPurpose(archiveState ? 'archiveAdvancedPrompt' : 'unarchiveAdvancedPrompt');
    setCurrentAdvancedPromptId(promptId);
    
    confirmArchiveUnarchive(promptId, archiveState);
}

async function confirmArchiveUnarchive(promptId, archiveState) {
    const tempPrompts = advancedPrompts.map(p => {
        if (p.id === promptId) {
            return { ...p, archived: archiveState };
        }
        return p;
    });

    setAdvancedPrompts(tempPrompts);
    await saveSetting('advancedPrompts', tempPrompts);
    
    const itemToRemove = advancedPromptModal.grid.querySelector(`.advanced-prompt-item[data-id="${promptId}"]`);
    if (itemToRemove) {
        itemToRemove.remove();
    }
    
    if (isAdvancedSearchModeActive) {
        handleAdvancedSearchInput();
    } else {
        filterAndRenderAdvancedPrompts();
    }

    showToast(archiveState ? "prompt.archived" : "prompt.unarchive");
    setCurrentAdvancedPromptId(null);
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
    advancedPromptModal.moveSelectedBtn.disabled = selectedAdvancedPromptIds.length === 0;
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

    if (newManageState) {
        if (isAdvancedModalSmallMode() && advancedPromptModal.content.classList.contains('sidebar-open')) {
            advancedPromptModal.content.classList.remove('sidebar-open');
        }
    }

    if (newManageState && isAdvancedSearchModeActive) {
        advancedPromptModal.searchInput.value = '';

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
        
        advancedPromptModal.actionBar.classList.add('hidden');
        advancedPromptModal.manageContent.scrollLeft = 0;
        setTimeout(() => {
            advancedPromptModal.manageContent.classList.add('hidden');
        }, 300);

        setSelectedAdvancedPromptIds([]);
        advancedPromptModal.grid.querySelectorAll('.advanced-prompt-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        updateAdvancedManageModeUI();
        filterAndRenderAdvancedPrompts();
    }
}

export function handleAdvancedDeleteSelected() {
    if (selectedAdvancedPromptIds.length === 0) return;
    setConfirmationModalPurpose('deleteSelectedAdvancedPrompts');
    const lang = languageSettings.ui;
    confirmationModal.title.textContent = i18nData["delete.confirm.title"][lang];
    const textFormat = i18nData["delete.confirm.selectedText"][lang];
    confirmationModal.text.textContent = textFormat.replace('{count}', selectedAdvancedPromptIds.length);
    openModal(confirmationModal.overlay);
}

export function toggleAdvancedSearchMode(forceState = null) {
    const newSearchState = forceState !== null ? forceState : !isAdvancedSearchModeActive;

    if (newSearchState) {
        if (isAdvancedModalSmallMode() && advancedPromptModal.content.classList.contains('sidebar-open')) {
            advancedPromptModal.content.classList.remove('sidebar-open');
        }
    }

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
        advancedPromptModal.grid.querySelectorAll('.advanced-prompt-item:not(.add-prompt-item)').forEach(item => {
            item.style.display = '';
        });

        advancedPromptModal.noResultsMessage.classList.add('hidden');
        filterAndRenderAdvancedPrompts();
    }
}

export function handleAdvancedSearchInput() {
    filterAndRenderAdvancedPrompts();
}

export function renderFolderTabs() {
    const folderBar = document.getElementById('advanced-prompt-folder-bar');
    if (!folderBar) return;

    folderBar.querySelectorAll('.folder-tab-btn').forEach(btn => {
        if (btn.dataset.folderId !== 'all') {
            btn.remove();
        }
    });
    
    const allBtn = folderBar.querySelector('#advanced-prompt-folder-all');
    const stickyWrapper = folderBar.querySelector('.folder-sidebar-sticky-buttons');
    const foldersToRender = promptFolders;
    const lang = languageSettings.ui;
    
    const imagesBtn = document.createElement('button');
    imagesBtn.className = 'folder-tab-btn';
    imagesBtn.dataset.type = 'images';

    const imgIconSpan = document.createElement('span');
    imgIconSpan.className = 'folder-tab-icon';
    imgIconSpan.textContent = '🖼️';

    const imgNameSpan = document.createElement('span');
    imgNameSpan.className = 'folder-tab-name';
    imgNameSpan.textContent = i18nData["prompt.images"]?.[lang] || "Images";

    imagesBtn.appendChild(imgIconSpan);
    imagesBtn.appendChild(imgNameSpan);

    imagesBtn.addEventListener('click', () => {
        openCharacterPromptManager();
    });

    folderBar.insertBefore(imagesBtn, stickyWrapper);

    foldersToRender.forEach(folder => {
        const folderBtn = document.createElement('button');
        folderBtn.className = 'folder-tab-btn';
        folderBtn.dataset.folderId = folder.id;

        const iconSpan = document.createElement('span');
        iconSpan.className = 'folder-tab-icon';
        iconSpan.textContent = '📁';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'folder-tab-name';
        nameSpan.textContent = folder.name;

        folderBtn.appendChild(iconSpan);
        folderBtn.appendChild(nameSpan);
        
        folderBtn.addEventListener('click', () => handleFolderTabClick(folder.id));
        folderBtn.addEventListener('contextmenu', showSidebarFolderContextMenu);

        if (folder.id === currentPromptFolderId) {
            folderBtn.classList.add('active');
        }

        folderBar.insertBefore(folderBtn, stickyWrapper);
    });

    const archiveBtn = document.createElement('button');
    archiveBtn.className = 'folder-tab-btn';
    archiveBtn.dataset.folderId = 'archive';
    
    const archiveIconSpan = document.createElement('span');
    archiveIconSpan.className = 'folder-tab-icon';
    archiveIconSpan.textContent = '📦';
    
    const archiveNameSpan = document.createElement('span');
    archiveNameSpan.className = 'folder-tab-name';
    archiveNameSpan.textContent = i18nData["prompt.archive"]?.[lang] || "Archive";

    archiveBtn.appendChild(archiveIconSpan);
    archiveBtn.appendChild(archiveNameSpan);

    if ('archive' === currentPromptFolderId) {
        archiveBtn.classList.add('active');
    }

    archiveBtn.addEventListener('click', () => handleFolderTabClick('archive'));

    folderBar.insertBefore(archiveBtn, stickyWrapper);

    allBtn.classList.toggle('active', currentPromptFolderId === 'all');
}

export function filterAndRenderAdvancedPrompts() {
    let promptsToRender;
    const isArchivedView = currentPromptFolderId === 'archive';

    if (currentPromptFolderId === 'all') {
        promptsToRender = advancedPrompts.filter(p => !p.archived); 
    } else if (isArchivedView) {
        promptsToRender = advancedPrompts.filter(p => p.archived);
    } else {
        promptsToRender = advancedPrompts.filter(p => p.folderId === currentPromptFolderId);
    }

    let visibleCount = promptsToRender.length;
    const searchTerm = advancedPromptModal.searchInput.value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');

    if (isAdvancedSearchModeActive && searchTerm.length > 0) {
        promptsToRender = promptsToRender.filter(p => {
            const characterTexts = (p.characterIds || [])
                .map(id => prompts.find(char => char.id === id)?.text)
                .filter(Boolean);

            let combinedPromptText;
            if (p.useCommas && characterTexts.length > 0) {
                combinedPromptText = [p.text || '', ...characterTexts].filter(Boolean).join(', ');
            } else {
                combinedPromptText = [p.text || '', ...characterTexts].filter(Boolean).join(' ');
            }

            let searchableText = [p.title || '', combinedPromptText].filter(Boolean).join(' ');
            const singleLineSearchableText = searchableText.replace(/\s+/g, ' ');
            
            return singleLineSearchableText.toLowerCase().includes(searchTerm);
        });
        visibleCount = promptsToRender.length;
    }

    renderAdvancedPrompts(promptsToRender);

    if (visibleCount === 0 && (isAdvancedSearchModeActive && searchTerm.length > 0)) {
        advancedPromptModal.noResultsMessage.classList.remove('hidden');
    } else {
        advancedPromptModal.noResultsMessage.classList.add('hidden');
    }

    advancedPromptModal.grid.querySelectorAll('.advanced-prompt-item:not(.add-prompt-item)').forEach(item => {
        item.style.display = '';
    });
}

export function handleFolderTabClick(folderId) {
    if (folderId === currentPromptFolderId) {
        return;
    }
    if (isAdvancedManageModeActive) {
        toggleAdvancedManageMode(false);
    }
    if (isAdvancedSearchModeActive) {
        toggleAdvancedSearchMode(false);
    }

    setCurrentPromptFolderId(folderId);

    const folderBar = document.getElementById('advanced-prompt-folder-bar');
    folderBar.querySelectorAll('.folder-tab-btn').forEach(btn => btn.classList.remove('active'));

    const newActiveBtn = folderBar.querySelector(`.folder-tab-btn[data-folder-id="${folderId}"]`);
    const allBtn = folderBar.querySelector('#advanced-prompt-folder-all');
    const imagesBtn = folderBar.querySelector('.folder-tab-btn[data-type="images"]');
    const archiveBtn = folderBar.querySelector('.folder-tab-btn[data-folder-id="archive"]');

    if (folderId === 'all') {
        allBtn.classList.add('active');
    } else if (folderId === 'archive') {
        archiveBtn.classList.add('active');
    } else if (folderId !== 'images' && newActiveBtn) {
        newActiveBtn.classList.add('active');
    }

    filterAndRenderAdvancedPrompts();
    adjustVisibleIcons();

    const isSmallScreen = window.matchMedia("(max-width: 1060px)").matches;
    const modalContent = advancedPromptModal.content;

    if (isSmallScreen && modalContent.classList.contains('sidebar-open')) {
        modalContent.classList.remove('sidebar-open');
    }
}

function renderFolderManagementGrid(foldersToRender = promptFolders) {
    const grid = promptFolderModal.grid;
    const lang = languageSettings.ui;

    grid.querySelectorAll('.folder-item, .add-bookmark-item').forEach(item => {
        const menu = item.querySelector('.prompt-item-menu');
        if (menu && menu.classList.contains('show')) {
            closeAllPromptMenus(); 
        }
        item.remove();
    });

    const foldersOnly = foldersToRender.filter(f => f.id !== 'archive');

    foldersToRender.forEach(folder => {
        if (folder.id === 'archive') {
            return; 
        }

        const folderItem = document.createElement('div');
        folderItem.className = 'folder-item';
        folderItem.dataset.id = folder.id;

        const icon = document.createElement('span');
        icon.className = 'folder-item-icon';
        icon.textContent = '📁';

        const name = document.createElement('span');
        name.className = 'folder-item-name';
        name.textContent = folder.name;

        folderItem.appendChild(icon);
        folderItem.appendChild(name);

        const menuBtn = document.createElement('button');
        menuBtn.className = 'prompt-item-menu-btn';
        menuBtn.innerHTML = '&#8942;';
        menuBtn.onclick = (e) => {
            e.stopPropagation();
            closeHeaderMenu();
            showPromptContextMenu(e);
        };
        folderItem.appendChild(menuBtn);

        const menuContainer = document.createElement('div');
        menuContainer.className = 'prompt-item-menu';
        menuContainer.dataset.id = folder.id;
        menuContainer.innerHTML = `
            <button class="prompt-menu-option" data-action="edit-folder">${i18nData["prompt.menu.edit"][lang]}</button>
            <button class="prompt-menu-option" data-action="delete-folder">${i18nData["prompt.menu.delete"][lang]}</button>
        `;
        folderItem.appendChild(menuContainer);

        folderItem.addEventListener('click', () => {
            if (isFolderManageModeActive) {
                toggleFolderSelection(folder.id);
                return;
            }
            handleFolderTabClick(folder.id);
            closeModal(promptFolderModal.overlay);
        });

        folderItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (isFolderManageModeActive) {
                toggleFolderSelection(folder.id);
            } else {
                const menuBtn = folderItem.querySelector('.prompt-item-menu-btn');
                if (menuBtn) {
                    menuBtn.click();
                }
            }
        });

        grid.appendChild(folderItem);
    });

    const addBtnGrid = document.createElement('button');
    addBtnGrid.id = 'add-folder-grid-btn';
    addBtnGrid.className = 'bookmark-item add-bookmark-item';
    addBtnGrid.innerHTML = '<span>+</span>';
    addBtnGrid.onclick = () => openAddEditFolderModal(null);

    if (foldersOnly.length > 0) {
        addBtnGrid.style.display = 'none';
    } else {
        addBtnGrid.style.display = '';
    }

    grid.appendChild(addBtnGrid);
}

export function openFolderManagementModal() {
    if (isAdvancedSearchModeActive) {
        toggleAdvancedSearchMode(false);
    }
    if (isAdvancedManageModeActive) {
        toggleAdvancedManageMode(false);
    }
    toggleFolderManageMode(false);
    toggleFolderSearchMode(false);
    renderFolderManagementGrid();
    openModal(promptFolderModal.overlay);
    const manageContent = promptFolderModal.manageContent;
    if (manageContent) {
        manageContent.addEventListener('wheel', (e) => {
            if (isFolderManageModeActive) {
                e.preventDefault();
                manageContent.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }
}

export function openAddEditFolderModal(folderId = null) {
    if (isAdvancedSearchModeActive) {
        toggleAdvancedSearchMode(false);
    }
    if (isAdvancedManageModeActive) {
        toggleAdvancedManageMode(false);
    }
    const lang = languageSettings.ui;
    if (folderId) {
        const folder = promptFolders.find(f => f.id === folderId);
        if (!folder) return;
        setCurrentEditFolderId(folderId);
        addEditFolderModal.title.textContent = i18nData["folder.editTitle"][lang];
        addEditFolderModal.input.value = folder.name;
        addEditFolderModal.saveBtn.textContent = i18nData["prompt.saveChanges"][lang];
        addEditFolderModal.saveBtn.setAttribute('data-i18n-key', 'prompt.saveChanges');
    } else {
        setCurrentEditFolderId(null);
        addEditFolderModal.title.textContent = i18nData["folder.addTitle"][lang];
        addEditFolderModal.input.value = '';
        addEditFolderModal.saveBtn.textContent = i18nData["settings.username.save"][lang];
        addEditFolderModal.saveBtn.setAttribute('data-i18n-key', 'settings.username.save');
    }
    openModal(addEditFolderModal.overlay);
    addEditFolderModal.input.focus();
}

export async function handleSaveFolder() {
    const isEditing = !!currentEditFolderId;
    const folderName = addEditFolderModal.input.value.trim();
    if (!folderName) {
        showInfoModal("info.attention.title", "folder.error.nameRequired");
        return;
    }

    let newFolders = [...promptFolders];

    if (currentEditFolderId) {
        if (newFolders.some(f => f.name.toLowerCase() === folderName.toLowerCase() && f.id !== currentEditFolderId)) {
            showInfoModal("info.attention.title", "folder.error.nameExists");
            return;
        }
        newFolders = newFolders.map(f => 
            f.id === currentEditFolderId ? { ...f, name: folderName } : f
        );
    } else {
        if (newFolders.some(f => f.name.toLowerCase() === folderName.toLowerCase())) {
            showInfoModal("info.attention.title", "folder.error.nameExists");
            return;
        }
        const newFolder = { id: Date.now(), name: folderName };
        newFolders.unshift(newFolder);
    }

    setPromptFolders(newFolders);
    await saveSetting('promptFolders', newFolders);

    const parentModal = activeModalStack[activeModalStack.length - 2];

    closeModal(addEditFolderModal.overlay);
    showToast(isEditing ? "folder.edit.success" : "folder.save.success");
    renderFolderTabs();

    if (parentModal && parentModal.id === 'move-folder-modal-overlay') {
        populateMoveFolderDropdown();
        updateMoveFolderDropdownDisplay();
    }
    
    if (parentModal && parentModal.id === 'add-edit-advanced-prompt-modal-overlay') {
        populateFolderDropdown();
        updateFolderDropdownDisplay();
    }

    if (parentModal && parentModal === promptFolderModal.overlay) {
        if (isFolderSearchModeActive) {
            handleFolderSearchInput();
        } else {
            renderFolderManagementGrid();
        }
    }
}

export function confirmDeleteFolder(folderId) {
    const folder = promptFolders.find(f => f.id === folderId);
    if (!folder) return;

    setCurrentEditFolderId(folderId);
    setConfirmationModalPurpose('deleteFolder');

    const lang = languageSettings.ui;
    confirmationModal.title.textContent = i18nData["delete.confirm.title"][lang];
    confirmationModal.text.textContent = i18nData["delete.folder.text"][lang];

    openModal(confirmationModal.overlay);
}

export async function handleDeleteFolder() {
    let folderIdsToDelete = [];
    let foldersToDeleteNames = [];

    if (confirmationModalPurpose === 'deleteSelectedFolders') {
        folderIdsToDelete = [...selectedFolderIds];
        foldersToDeleteNames = promptFolders
            .filter(f => folderIdsToDelete.includes(f.id))
            .map(f => f.name);
    } else if (confirmationModalPurpose === 'deleteFolder') {
        if (!currentEditFolderId) return;
        folderIdsToDelete = [currentEditFolderId];
        const folder = promptFolders.find(f => f.id === currentEditFolderId);
        if (folder) {
            foldersToDeleteNames = [folder.name];
        }
    } else {
        return;
    }

    if (folderIdsToDelete.length === 0) {
        closeModal(confirmationModal.overlay);
        return;
    }

    const newFolders = promptFolders.filter(f => !folderIdsToDelete.includes(f.id));
    setPromptFolders(newFolders);
    await saveSetting('promptFolders', newFolders);

    let promptsModified = false;
    const newAdvancedPrompts = advancedPrompts.map(p => {
        if (p.folderId && folderIdsToDelete.includes(p.folderId)) {
            promptsModified = true;
            return { ...p, folderId: null };
        }
        return p;
    });

    if (promptsModified) {
        setAdvancedPrompts(newAdvancedPrompts);
        await saveSetting('advancedPrompts', newAdvancedPrompts);
    }

    closeModal(confirmationModal.overlay);
    showToast("folder.delete.success");
    renderFolderTabs();
    
    if (isFolderManageModeActive) {
        toggleFolderManageMode(false);
    }
    
    if (isFolderSearchModeActive) {
        handleFolderSearchInput();
    } else {
        renderFolderManagementGrid();
    }
    
    filterAndRenderAdvancedPrompts();
    markSearchDataAsStale();
}

function updateFolderDropdownDisplay() {
    const trigger = addEditAdvancedPromptModal.folderSelect;
    if (!trigger) return;
    const optionsContainer = addEditAdvancedPromptModal.folderSelectOptions;
    const selectedTextSpan = trigger.querySelector('span:first-child');

    let selectedOptionText;
    let selectedOptionKey;

    if (selectedFolderId === 'all') {
        selectedOptionKey = "folder.noFolder";
        selectedOptionText = i18nData[selectedOptionKey]?.[languageSettings.ui] || i18nData[selectedOptionKey]?.['id'];
    } else {
        const folder = promptFolders.find(f => f.id === selectedFolderId);
        selectedOptionText = folder ? folder.name : (i18nData["folder.noFolder"]?.[languageSettings.ui] || i18nData["folder.noFolder"]?.['id']);
    }

    selectedTextSpan.textContent = selectedOptionText;
    if (selectedOptionKey) {
        selectedTextSpan.setAttribute('data-i18n-key', selectedOptionKey);
    } else {
        selectedTextSpan.removeAttribute('data-i18n-key');
    }

    optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
    const selectedOption = optionsContainer.querySelector(`[data-value="${selectedFolderId}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
}

export function populateFolderDropdown() {
    const optionsContainer = addEditAdvancedPromptModal.folderSelectOptions;
    if (!optionsContainer) return;

    optionsContainer.innerHTML = '';
    const lang = languageSettings.ui;

    const allOption = document.createElement('div');
    allOption.className = 'custom-option';
    allOption.dataset.value = 'all';
    allOption.textContent = i18nData["folder.noFolder"]?.[lang] || i18nData["folder.noFolder"]?.['id'];
    allOption.setAttribute('data-i18n-key', 'folder.noFolder');
    optionsContainer.appendChild(allOption);

    promptFolders.forEach(folder => {
        if (folder.id === 'archive') return;

        const option = document.createElement('div');
        option.className = 'custom-option';
        option.dataset.value = folder.id;
        option.textContent = folder.name;
        optionsContainer.appendChild(option);
    });

    updateFolderDropdownDisplay();
}

export function initFolderDropdownListener() {
    const trigger = addEditAdvancedPromptModal.folderSelect;
    const optionsContainer = addEditAdvancedPromptModal.folderSelectOptions;

    if (trigger && optionsContainer) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (trigger.closest('.switch-container.disabled')) return;
            document.querySelectorAll('.custom-select-options.show').forEach(openOption => {
                if (openOption !== optionsContainer) {
                    openOption.classList.remove('show');
                    openOption.previousElementSibling.classList.remove('open');
                }
            });
            const isShown = optionsContainer.classList.toggle('show');
            trigger.classList.toggle('open', isShown);
        });

        optionsContainer.addEventListener('click', (e) => {
            const option = e.target.closest('.custom-option');
            if (option) {
                const newValue = option.getAttribute('data-value');
                selectedFolderId = (newValue === 'all') ? 'all' : parseInt(newValue, 10);
                updateFolderDropdownDisplay();
                optionsContainer.classList.remove('show');
                trigger.classList.remove('open');
            }
        });
    }
}

// --- Folder Manage & Search Mode ---
export function updateFolderManageModeUI() {
    const lang = languageSettings.ui;
    const selectCountFormat = i18nData["prompt.selectCount"][lang] || i18nData["prompt.selectCount"]["id"];
    promptFolderModal.selectCount.textContent = selectCountFormat.replace('{count}', selectedFolderIds.length);

    const totalFolders = promptFolderModal.grid.querySelectorAll('.folder-item').length;
    if (selectedFolderIds.length === totalFolders && totalFolders > 0) {
        promptFolderModal.selectAllBtn.textContent = i18nData["prompt.deselectAll"][lang] || i18nData["prompt.deselectAll"]["id"];
    } else {
        promptFolderModal.selectAllBtn.textContent = i18nData["prompt.selectAll"][lang] || i18nData["prompt.selectAll"]["id"];
    }

    promptFolderModal.deleteSelectedBtn.disabled = selectedFolderIds.length === 0;
}

export function toggleFolderSelection(folderId) {
    const idAsNumber = parseInt(folderId, 10);
    const itemElement = promptFolderModal.grid.querySelector(`.folder-item[data-id="${idAsNumber}"]`);
    
    let currentSelectedIds = [...selectedFolderIds];
    const index = currentSelectedIds.indexOf(idAsNumber);

    if (index > -1) {
        currentSelectedIds.splice(index, 1);
        itemElement?.classList.remove('selected');
    } else {
        currentSelectedIds.push(idAsNumber);
        itemElement?.classList.add('selected');
    }
    setSelectedFolderIds(currentSelectedIds);
    updateFolderManageModeUI();
}

export function handleFolderSelectAll() {
    const allFolderItems = promptFolderModal.grid.querySelectorAll('.folder-item');
    if (selectedFolderIds.length === allFolderItems.length) {
        setSelectedFolderIds([]);
        allFolderItems.forEach(item => item.classList.remove('selected'));
    } else {
        const allFolderIds = Array.from(allFolderItems).map(item => parseInt(item.dataset.id, 10));
        setSelectedFolderIds(allFolderIds);
        allFolderItems.forEach(item => item.classList.add('selected'));
    }
    updateFolderManageModeUI();
}

export function handleFolderDeleteSelected() {
    if (selectedFolderIds.length === 0) return;
    setConfirmationModalPurpose('deleteSelectedFolders');
    const lang = languageSettings.ui;
    confirmationModal.title.textContent = i18nData["delete.confirm.title"][lang];
    const textFormat = i18nData["delete.folder.selectedText"][lang];
    confirmationModal.text.textContent = textFormat.replace('{count}', selectedFolderIds.length);
    openModal(confirmationModal.overlay);
}

export function toggleFolderManageMode(forceState = null) {
    const newManageState = forceState !== null ? forceState : !isFolderManageModeActive;

    if (newManageState && isFolderSearchModeActive) {
        promptFolderModal.searchInput.value = '';
        handleFolderSearchInput();
        setIsFolderSearchModeActive(false);
        setIsFolderManageModeActive(true);
        promptFolderModal.content.classList.remove('search-mode');
        promptFolderModal.content.classList.add('manage-mode');

        handleDirectBarSwap(promptFolderModal.searchContent, promptFolderModal.manageContent, () => {
            if (folderSortableInstance) folderSortableInstance.option('disabled', true);
            updateFolderManageModeUI();
        });
        return;
    }

    setIsFolderManageModeActive(newManageState);
    promptFolderModal.content.classList.toggle('manage-mode', newManageState);
    if (folderSortableInstance) folderSortableInstance.option('disabled', newManageState);

    if (newManageState) {
        closeAllPromptMenus();
        promptFolderModal.searchContent.classList.add('hidden');
        promptFolderModal.manageContent.classList.remove('hidden');
        promptFolderModal.actionBar.classList.remove('hidden');
        updateFolderManageModeUI();
    } else {
        promptFolderModal.searchInput.value = '';
        handleFolderSearchInput();
        promptFolderModal.actionBar.classList.add('hidden');
        promptFolderModal.manageContent.scrollLeft = 0;
        setTimeout(() => promptFolderModal.manageContent.classList.add('hidden'), 300);

        setSelectedFolderIds([]);
        promptFolderModal.grid.querySelectorAll('.folder-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        updateFolderManageModeUI();
    }
}

export function toggleFolderSearchMode(forceState = null) {
    const newSearchState = forceState !== null ? forceState : !isFolderSearchModeActive;

    if (newSearchState && isFolderManageModeActive) {
        setSelectedFolderIds([]);
        promptFolderModal.grid.querySelectorAll('.folder-item.selected').forEach(item => {
            item.classList.remove('selected');
        });

        setIsFolderManageModeActive(false);
        setIsFolderSearchModeActive(true);
        promptFolderModal.content.classList.remove('manage-mode');
        promptFolderModal.content.classList.add('search-mode');

        handleDirectBarSwap(promptFolderModal.manageContent, promptFolderModal.searchContent, () => {
            if (folderSortableInstance) folderSortableInstance.option('disabled', true);
            promptFolderModal.searchInput.focus();
        });
        return;
    }

    setIsFolderSearchModeActive(newSearchState);
    promptFolderModal.content.classList.toggle('search-mode', newSearchState);
    if (folderSortableInstance) folderSortableInstance.option('disabled', newSearchState);

    if (newSearchState) {
        closeAllPromptMenus();
        promptFolderModal.manageContent.classList.add('hidden');
        promptFolderModal.searchContent.classList.remove('hidden');
        promptFolderModal.actionBar.classList.remove('hidden');
        promptFolderModal.searchInput.focus();
    } else {
        promptFolderModal.actionBar.classList.add('hidden');
        setTimeout(() => promptFolderModal.searchContent.classList.add('hidden'), 300);
        
        promptFolderModal.searchInput.value = '';
        handleFolderSearchInput();
        promptFolderModal.noResultsMessage.classList.add('hidden');
    }
}

export function handleFolderSearchInput() {
    const searchTerm = promptFolderModal.searchInput.value.toLowerCase().trim();
    const filtered = promptFolders.filter(f => f.id !== 'archive' && f.name.toLowerCase().includes(searchTerm));
    renderFolderManagementGrid(filtered);

    if (filtered.length === 0 && searchTerm.length > 0) {
        promptFolderModal.noResultsMessage.classList.remove('hidden');
    } else {
        promptFolderModal.noResultsMessage.classList.add('hidden');
    }
}

export function closeSidebarContextMenu() {
    const menu = document.getElementById('folder-sidebar-context-menu');
    if (menu) {
        menu.style.display = 'none';
        if (activePromptMenu === menu) {
            setActivePromptMenu(null);
        }
    }
}

export function handleAdvancedMoveSelected() {
    if (selectedAdvancedPromptIds.length === 0) return;
    handleOpenMoveFolderModal(selectedAdvancedPromptIds);
}

export function handleOpenMoveFolderModal(promptIds) {
    if (promptIds.length === 0) return;
    setPromptsToMove(promptIds);
    setSelectedMoveFolderId('all'); 

    const lang = languageSettings.ui;
    moveFolderModal.title.textContent = i18nData["prompt.menu.move"][lang];

    populateMoveFolderDropdown();
    updateMoveFolderDropdownDisplay();
    openModal(moveFolderModal.overlay);
}

export function populateMoveFolderDropdown() {
    const optionsContainer = moveFolderModal.folderSelectOptions;
    if (!optionsContainer) return;

    optionsContainer.innerHTML = '';
    const lang = languageSettings.ui;

    const noneOption = document.createElement('div');
    noneOption.className = 'custom-option';
    noneOption.dataset.value = 'all';
    noneOption.textContent = i18nData["prompt.all"]?.[lang] || i18nData["prompt.all"]?.['id'];
    noneOption.setAttribute('data-i18n-key', 'prompt.all');
    optionsContainer.appendChild(noneOption);

    promptFolders.forEach(folder => {
        if (folder.id === 'archive') return; 

        const option = document.createElement('div');
        option.className = 'custom-option';
        option.dataset.value = folder.id;
        option.textContent = folder.name;
        optionsContainer.appendChild(option);
    });

    const archiveOption = document.createElement('div');
    archiveOption.className = 'custom-option';
    archiveOption.dataset.value = 'archive';
    archiveOption.textContent = i18nData["prompt.archive"]?.[lang] || i18nData["prompt.archive"]?.['id'];
    archiveOption.setAttribute('data-i18n-key', 'prompt.archive');
    optionsContainer.appendChild(archiveOption);
}

export function updateMoveFolderDropdownDisplay() {
    const trigger = moveFolderModal.folderSelect;
    if (!trigger) return;

    const optionsContainer = moveFolderModal.folderSelectOptions;
    const selectedTextSpan = trigger.querySelector('span:first-child');
    const lang = languageSettings.ui;

    let selectedOptionText;
    let selectedOptionKey;

    if (selectedMoveFolderId === 'all') {
        selectedOptionKey = "prompt.all";
        selectedOptionText = i18nData[selectedOptionKey]?.[lang] || i18nData[selectedOptionKey]?.['id'];
    } else if (selectedMoveFolderId === 'archive') {
        selectedOptionKey = "prompt.archive";
        selectedOptionText = i18nData[selectedOptionKey]?.[lang] || i18nData[selectedOptionKey]?.['id'];
    } else {
        const folder = promptFolders.find(f => f.id === selectedMoveFolderId);
        selectedOptionText = folder ? folder.name : (i18nData["prompt.all"]?.[lang] || i18nData["prompt.all"]?.['id']);
    }

    selectedTextSpan.textContent = selectedOptionText;
    if (selectedOptionKey) {
        selectedTextSpan.setAttribute('data-i18n-key', selectedOptionKey);
    } else {
        selectedTextSpan.removeAttribute('data-i18n-key');
    }

    optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
    const selectedOption = optionsContainer.querySelector(`[data-value="${selectedMoveFolderId}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
}

export async function handleMovePrompts() {
    if (promptsToMove.length === 0) return;

    const targetId = selectedMoveFolderId;

    if (!targetId) {
        showInfoModal("info.attention.title", "move.error.targetRequired");
        return;
    }

    if (typeof targetId === 'number') {
        const folderExists = promptFolders.some(f => f.id === targetId);
        if (!folderExists) {
            showInfoModal("info.attention.title", "move.error.targetRequired");
            return;
        }
    }

    const isArchived = targetId === 'archive';
    const newFolderId = (targetId === 'all' || targetId === 'archive') ? null : targetId;

    const updatedPrompts = advancedPrompts.map(p => {
        if (promptsToMove.includes(p.id)) {
            return {
                ...p,
                folderId: newFolderId,
                archived: isArchived
            };
        }
        return p;
    });

    setAdvancedPrompts(updatedPrompts);
    await saveSetting('advancedPrompts', updatedPrompts);

    closeModal(moveFolderModal.overlay);
    
    if (isAdvancedManageModeActive) {
        toggleAdvancedManageMode(false);
    } else if (isAdvancedSearchModeActive) {
        handleAdvancedSearchInput();
    } else {
        filterAndRenderAdvancedPrompts();
    }

    showToast("prompt.menu.move");
    markSearchDataAsStale();
}