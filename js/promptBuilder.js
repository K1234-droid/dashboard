import {
    languageSettings, i18nData, prompts, advancedPrompts, advancedPromptModal,
    addEditAdvancedPromptModal, advancedPromptViewerModal, confirmationModal,
    isAdvancedManageModeActive, selectedAdvancedPromptIds,
    setAdvancedPrompts, setActivePromptMenu, setCurrentAdvancedPromptId, setConfirmationModalPurpose,
    setIsAdvancedManageModeActive, setSelectedAdvancedPromptIds, currentAdvancedPromptId,
    isAdvancedSearchModeActive, setIsAdvancedSearchModeActive, advancedSortableInstance,
    confirmationModalPurpose, setCurrentImageNavList, cachedIconDataUrls, setCachedIconDataUrls
} from './config.js';
import { openModal, closeModal, showInfoModal } from './ui.js';
import { showToast, blobToDataURL } from './utils.js';
import { saveSetting, getPromptBlob } from './storage.js';
import { showPromptContextMenu, showFullImage, populateIconCacheIfNeeded } from './promptManager.js';
import { markSearchDataAsStale } from './search.js';

function getIconDataUrl(charId) {
    return cachedIconDataUrls[charId];
}

/**
 * Menemukan dan memperbarui HANYA ikon dari karakter tertentu di semua
 * item "Pembuat Prompt AI" yang menampilkannya.
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

    const textElement = item.querySelector('p');
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
    item.appendChild(text);

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
    
    const menuContainer = document.createElement('div');
    menuContainer.className = 'prompt-item-menu';
    menuContainer.dataset.id = newPrompt.id;
    menuContainer.innerHTML = `
        <button class="prompt-menu-option" data-action="copy-advanced">${i18nData["prompt.menu.copy"][lang]}</button>
        <button class="prompt-menu-option" data-action="copy-char-advanced">${i18nData["prompt.menu.copyChar"][lang]}</button>
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
        showAdvancedPromptViewer(newPrompt);
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
    
    addEditAdvancedPromptModal.title.textContent = i18nData["advanced.prompt.editTitle"][lang];
    addEditAdvancedPromptModal.saveBtn.textContent = i18nData["prompt.saveChanges"][lang];
    addEditAdvancedPromptModal.textInput.value = promptToEdit.text;
    addEditAdvancedPromptModal.addCommaSwitch.checked = promptToEdit.useCommas || false;

    if (isCharacterGridStale) {
        syncCharacterSelectionGrid();
    }

    if (addEditAdvancedPromptModal.searchInput) {
        addEditAdvancedPromptModal.searchInput.value = '';
    }
    handleCharacterSearchInput();

    addEditAdvancedPromptModal.textInput.scrollTop = 0;
    addEditAdvancedPromptModal.characterGrid.scrollTop = 0;

    updateSelectionVisuals();
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
    const promptData = isEditing 
    ? tempPrompts.find(p => p.id === currentAdvancedPromptId) 
    : tempPrompts[tempPrompts.length - 1];

    closeModal(addEditAdvancedPromptModal.overlay);

    if (isAdvancedSearchModeActive) {
        handleAdvancedSearchInput();
    } else {
        if (isEditing) {
            await updateSingleAdvancedPromptItem(promptData);
        } else {
            await appendNewAdvancedPromptItem(promptData);
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
    confirmationModal.title.textContent = i18nData["prompt.delete.title"][lang];
    confirmationModal.text.textContent = i18nData["prompt.delete.text"][lang];
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
        advancedPromptModal.grid.querySelectorAll('.advanced-prompt-item:not(.add-prompt-item)').forEach(item => {
            item.style.display = '';
        });

        advancedPromptModal.noResultsMessage.classList.add('hidden');
    }
}

export function handleAdvancedSearchInput() {
    const searchTerm = advancedPromptModal.searchInput.value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
    
    const allPromptItems = advancedPromptModal.grid.querySelectorAll('.advanced-prompt-item:not(.add-prompt-item)');
    let visibleCount = 0;

    allPromptItems.forEach(item => {
        const promptId = parseInt(item.dataset.id, 10);
        const p = advancedPrompts.find(prompt => prompt.id === promptId);

        if (!p) {
            item.style.display = 'none';
            return;
        };

        const characterTexts = (p.characterIds || [])
            .map(id => prompts.find(char => char.id === id)?.text)
            .filter(Boolean);

        let searchableText = [p.text || '', ...characterTexts].filter(Boolean).join(p.useCommas ? ', ' : ' ');
        const singleLineSearchableText = searchableText.replace(/\s+/g, ' ');
        const isMatch = singleLineSearchableText.toLowerCase().includes(searchTerm);

        item.style.display = isMatch ? '' : 'none';
        if (isMatch) {
            visibleCount++;
        }
    });

    if (visibleCount === 0 && searchTerm.length > 0) {
        advancedPromptModal.noResultsMessage.classList.remove('hidden');
    } else {
        advancedPromptModal.noResultsMessage.classList.add('hidden');
    }
}