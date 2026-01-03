import { loadSettings, getAllPromptMetadata } from './storage.js';
import { i18nData } from './config.js';
import { log } from './utils.js';

let currentLanguage = 'en';

function getTranslation(key) {
    if (i18nData[key] && i18nData[key][currentLanguage]) {
        return i18nData[key][currentLanguage];
    }
    if (i18nData[key] && i18nData[key]['id']) {
        return i18nData[key]['id'];
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
 * @param {string} theme
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
 * @param {string} scheme
 */
function applyPopupColorScheme(scheme) {
    document.documentElement.classList.remove("monochrome-scheme");
    if (scheme === "monochrome") {
        document.documentElement.classList.add("monochrome-scheme");
    }
}

/**
 * @param {boolean} show
 */
function applyPopupAnimations(show) {
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

    const settings = await loadSettings([ 'enablePopupFinder', 'enableBookmarkPopupFinder', 'languageSettings', 'theme', 'colorScheme',
        'enableAnimation', 'bookmarks', 'bookmarkOpenAction', 'showBookmarks'
    ]);
    currentLanguage = settings.languageSettings?.ui || 'id';

    applyPopupTheme(settings.theme);
    applyPopupColorScheme(settings.colorScheme);
    applyPopupAnimations(settings.enableAnimation);
    applyTranslations();

    const isPromptFinderEnabled = settings.enablePopupFinder === true;
    const isBookmarkFinderEnabled = settings.enableBookmarkPopupFinder !== false && settings.showBookmarks !== false;

    if (!isPromptFinderEnabled && !isBookmarkFinderEnabled) {
        if(searchContainer) searchContainer.classList.add('hidden');
        if(searchResultsContainer) searchResultsContainer.classList.add('hidden');
        if(disabledMessage) disabledMessage.classList.remove('hidden');
        return;
    }

    let searchableData = [];
    let selectedIndex = -1;

    async function initializeData() {
        try {
            let characterData = [];
            let builderData = [];
            let bookmarkData = [];

            if (isPromptFinderEnabled) {
                const [characterPrompts, settingsData] = await Promise.all([
                    getAllPromptMetadata(),
                    loadSettings(['advancedPrompts'])
                ]);

                const builderPrompts = settingsData.advancedPrompts || [];

                characterData = (characterPrompts || []).map(p => ({
                    id: `char-${p.id}`,
                    text: p.text,
                    copyText: p.text,
                    type: getTranslation('popup.type.character'),
                    dataType: 'prompt',
                    subType: 'character'
                }));

                builderData = builderPrompts.map(p => {
                    const characterTexts = (p.characterIds || [])
                        .map(charId => (characterPrompts.find(c => c.id === charId) || {}).text)
                        .filter(Boolean);

                    const combinedText = [p.text, ...characterTexts].filter(Boolean).join(p.useCommas ? ', ' : ' ');

                    let displayText;
                    if (p.title && p.title.trim() !== '') {
                        displayText = `${p.title.trim()} - ${combinedText}`;
                    } else {
                        displayText = combinedText;
                    }

                    return {
                        id: `bldr-${p.id}`,
                        text: displayText,
                        copyText: combinedText,
                        type: getTranslation('popup.type.builder'),
                        dataType: 'prompt',
                        subType: 'builder'
                    };
                });
            }

            if (isBookmarkFinderEnabled) {
                const allBookmarks = settings.bookmarks || [];
                bookmarkData = allBookmarks.map(b => ({
                    id: `bm-${b.id}`,
                    name: b.name,
                    url: b.url,
                    type: getTranslation('popup.type.bookmark'),
                    dataType: 'bookmark'
                }));
            }

            searchableData = [...characterData, ...builderData, ...bookmarkData];

        } catch (error) {
            log('error', 'log.error.popupInitFailed', {}, error);
            resultsListContainer.innerHTML = `<div class="no-results">${getTranslation('popup.error.loadFailed')}</div>`;
        }
    }

    function performSearch(query) {
        if (!query) {
            return [];
        }
        const lowerCaseQuery = query.toLowerCase().trim().replace(/\s+/g, ' ');

        const filterLogic = item => {
            const itemType = (item.type || '').toLowerCase();
            let searchableText = '';

            if (item.dataType === 'bookmark') {
                searchableText = `${item.name.toLowerCase()} ${item.url.toLowerCase()}`;
            } else {
                searchableText = (item.text || '').toLowerCase();
            }

            return searchableText.includes(lowerCaseQuery) || itemType.includes(lowerCaseQuery);
        };

        const characterResults = searchableData
            .filter(item => item.subType === 'character' && filterLogic(item))
            .slice(0, 5);

        const builderResults = searchableData
            .filter(item => item.subType === 'builder' && filterLogic(item))
            .slice(0, 5);

        const bookmarkResults = searchableData
            .filter(item => item.dataType === 'bookmark' && filterLogic(item))
            .slice(0, 5);

        return [...characterResults, ...builderResults, ...bookmarkResults];
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
            if (item.dataType === 'bookmark') {
                 resultsHTML += `
                    <div class="result-item" data-id="${item.id}">
                        <span class="result-text">${item.name} - ${item.url}</span>
                        <span class="result-type">${item.type}</span>
                    </div>
                `;
            } else {
                resultsHTML += `
                    <div class="result-item" data-id="${item.id}">
                        <span class="result-text">${item.text}</span>
                        <span class="result-type">${item.type}</span>
                    </div>
                `;
            }
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

        items.forEach(item => item.classList.remove('selected'));

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
                selectedIndex = (selectedIndex > 0) ? selectedIndex - 1 : items.length - 1;
                updateSelection();
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
        const clickedItem = searchableData.find(item => item.id === itemId);

        if (clickedItem.dataType === 'bookmark') {
            const url = clickedItem.url;
            if (settings.bookmarkOpenAction === 'newTab') {
                chrome.tabs.create({ url: url });
            } else {
                chrome.tabs.update({ url: url });
            }
            window.close();
        } else {
            try {
                const textToCopy = clickedItem.copyText !== undefined ? clickedItem.copyText : clickedItem.text;
                await navigator.clipboard.writeText(textToCopy);
                const originalTextEl = resultItem.querySelector('.result-text');
                const originalText = originalTextEl.textContent;
                originalTextEl.textContent = getTranslation('popup.copy.success');
                setTimeout(() => {
                    originalTextEl.textContent = originalText;
                }, 1500);
            } catch (err) {
                log('error', 'popup.copy.errorVerbose', {}, err);
                const originalTextEl = resultItem.querySelector('.result-text');
                originalTextEl.textContent = getTranslation('popup.copy.error');
            }
        }
    });

    await initializeData();
    displayResults([]);
    searchInput.focus();
});

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        const activeElement = document.activeElement;
        
        if (activeElement.id !== 'search-input') {
            e.preventDefault();
        }
    }
});