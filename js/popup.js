import { loadSettings, getAllPromptMetadata } from './storage.js';
import { i18nData } from './config.js';

let currentLanguage = 'en';

function getTranslation(key) {
    if (i18nData[key] && i18nData[key][currentLanguage]) {
        return i18nData[key][currentLanguage];
    }
    return key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n-key]').forEach(el => {
        const key = el.getAttribute('data-i18n-key');
        el.textContent = getTranslation(key);
    });
    document.querySelectorAll('[data-i18n-key-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-key-placeholder');
        el.placeholder = getTranslation(key);
    });
}

/**
 * Menerapkan kelas tema ke elemen <body> popup.
 * @param {string} theme - Nama tema ('light', 'dark', atau 'system').
 */
function applyPopupTheme(theme) {
    document.body.classList.remove("dark-theme", "light-theme");

    if (theme === "dark") {
        document.body.classList.add("dark-theme");
    } else if (theme === "light") {
        document.body.classList.add("light-theme");
    }
}

/**
 * Menerapkan atau menonaktifkan animasi di popup berdasarkan pengaturan.
 * @param {boolean} show - Status dari pengaturan enableAnimation.
 */
function applyPopupAnimations(show) {
    // Default ke true jika pengaturan belum ada (undefined)
    const animationsEnabled = show !== false;
    document.body.classList.toggle("animations-disabled", !animationsEnabled);
}

document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results'); 
    const resultsListContainer = document.querySelector('.results-list');
    const modalBody = document.querySelector('.modal-body');
    const searchContainer = document.querySelector('.modal-button-group-column');
    const disabledMessage = document.getElementById('popup-disabled-message');

    const settings = await loadSettings(['enablePopupFinder', 'languageSettings', 'theme', 'enableAnimation']);
    currentLanguage = settings.languageSettings?.ui || 'id';

    applyPopupTheme(settings.theme);
    applyPopupAnimations(settings.enableAnimation);

    applyTranslations(); 

    if (settings.enablePopupFinder !== true) {
        if(searchContainer) searchContainer.classList.add('hidden');
        if(searchResultsContainer) searchResultsContainer.classList.add('hidden');
        
        if(disabledMessage) disabledMessage.classList.remove('hidden');

        return; 
    }

    let searchableData = [];
    let selectedIndex = -1;

    async function initializeData() {
        try {
            const [characterPrompts, settingsData] = await Promise.all([
                getAllPromptMetadata(),
                loadSettings(['advancedPrompts'])
            ]);

            const builderPrompts = settingsData.advancedPrompts || [];

            const characterData = (characterPrompts || []).map(p => ({
                id: `char-${p.id}`, 
                text: p.text, 
                type: getTranslation('popup.type.character'), 
                originalData: p 
            }));

            const builderData = builderPrompts.map(p => {
                const characterTexts = (p.characterIds || [])
                    .map(charId => {
                        const character = characterPrompts.find(c => c.id === charId);
                        return character ? character.text : '';
                    })
                    .filter(Boolean);

                let combinedText;
                if (p.useCommas && characterTexts.length > 0) {
                    combinedText = [p.text, ...characterTexts].filter(Boolean).join(', ');
                } else {
                    combinedText = [p.text, ...characterTexts].filter(Boolean).join(' ');
                }

                return {
                    id: `bldr-${p.id}`,
                    text: combinedText, 
                    type: getTranslation('popup.type.builder'),
                    originalData: p 
                };
            });
            
            searchableData = [...characterData, ...builderData];

        } catch (error) {
            console.error("Gagal menginisialisasi data pop-up:", error); // Log error untuk debugging
            resultsListContainer.innerHTML = `<div class="no-results">${getTranslation('popup.error.loadFailed')}</div>`;
        }
    }

    function performSearch(query) {
        if (!query) {
            return [];
        }
        const lowerCaseQuery = query.toLowerCase().trim().replace(/\s+/g, ' ');
        
        return searchableData.filter(item => {
            const itemText = (item.text || '').toLowerCase().replace(/\s+/g, ' ');
            const itemType = (item.type || '').toLowerCase();
            return itemText.includes(lowerCaseQuery) || itemType.includes(lowerCaseQuery);
        });
    }

    function displayResults(results) {
        if (searchInput.value.trim() === '') {
            resultsListContainer.innerHTML = '';
            searchResultsContainer.style.display = 'none';
            return;
        }
        
        searchResultsContainer.style.display = 'block';

        if (!results || results.length === 0) {
            resultsListContainer.innerHTML = `<div class="no-results">${getTranslation('popup.error.noResults')}</div>`;
            return;
        }

        let resultsHTML = '';
        results.forEach(item => {
            const displayText = item.text;
            
            resultsHTML += `
                <div class="result-item" data-id="${item.id}">
                    <span class="result-text">${displayText}</span>
                    <span class="result-type">${item.type}</span>
                </div>
            `;
        });
        resultsListContainer.innerHTML = resultsHTML;
        
        const resultItems = resultsListContainer.querySelectorAll('.result-item');
        resultItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                selectedIndex = index;
                updateSelection();
            });
        });
    }

    searchInput.addEventListener('input', (event) => {
        const query = event.target.value;
        const results = performSearch(query);
        
        selectedIndex = -1;

        displayResults(results);
    });
    
    function updateSelection() {
        const items = resultsListContainer.querySelectorAll('.result-item');
        if (!items.length) return;

        items.forEach((item, index) => {
            item.classList.remove('selected');
        });

        if (selectedIndex >= 0 && selectedIndex < items.length) {
            const selectedItem = items[selectedIndex];
            selectedItem.classList.add('selected');
            selectedItem.scrollIntoView({ block: 'nearest' });
        }
    }
    
    resultsListContainer.addEventListener('mouseleave', () => {
        selectedIndex = -1;
        updateSelection();
    });

    document.addEventListener('keydown', (event) => {
        const items = resultsListContainer.querySelectorAll('.result-item');
        if (!items.length) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                updateSelection();
                break;

            case 'ArrowUp':
                event.preventDefault();
                if (selectedIndex > 0) {
                    selectedIndex--;
                    updateSelection();
                } else {
                    selectedIndex = -1;
                    searchInput.focus();
                    modalBody.scrollTop = 0;
                    updateSelection();
                }
                break;

            case 'Enter':
                event.preventDefault();
                if (selectedIndex >= 0) {
                    items[selectedIndex].click();
                }
                break;
        }
    });

    resultsListContainer.addEventListener('click', async (event) => {
        const resultItem = event.target.closest('.result-item');
        if (!resultItem) return;

        const itemId = resultItem.dataset.id;
        const itemToCopy = searchableData.find(item => item.id === itemId);

        if (itemToCopy) {
            const originalTextEl = resultItem.querySelector('.result-text');
            const originalText = originalTextEl.textContent;
        
            try {
                await navigator.clipboard.writeText(itemToCopy.text);
                
                originalTextEl.textContent = getTranslation('popup.copy.success');
        
                setTimeout(() => {
                    originalTextEl.textContent = originalText;
                    resultItem.style.opacity = '1';
                }, 1500);
        
            } catch (err) {
                console.error(getTranslation('popup.copy.errorVerbose'), err);
                
                originalTextEl.textContent = getTranslation('popup.copy.error');
                resultItem.style.opacity = '1';
        
                setTimeout(() => {
                    originalTextEl.textContent = originalText;
                    resultItem.style.color = ''; 
                    resultItem.style.opacity = '1';
                }, 1500);
            }
        }
    });
    
    await initializeData();
    displayResults([]); 
    searchInput.focus();
});