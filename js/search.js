import { loadSettings, getAllPromptMetadata } from './storage.js';
import { i18nData, languageSettings, footerSearch, searchEngine, searchOpenAction, isPromptSearchEnabled } from './config.js';
import { showToast, isValidURL, debounce } from './utils.js';

let searchableData = [];
let selectedIndex = -1;
let isSearchDataStale = true; 
let lastLocalResults = [];

export function markSearchDataAsStale() {
    isSearchDataStale = true;
}

function highlightMatch(text, query) {
    if (!query || !text) {
        return text;
    }
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(safeQuery, 'gi');
    return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
}

function getTranslation(key, replacements = {}) {
    const lang = languageSettings.ui;
    let text = i18nData[key]?.[lang] || i18nData[key]?.['id'] || key;
    for (const placeholder in replacements) {
        text = text.replace(`{${placeholder}}`, replacements[placeholder]);
    }
    return text;
}

export async function initializeData() {
    try {
        const [characterPrompts, settingsData] = await Promise.all([
            getAllPromptMetadata(),
            loadSettings(['advancedPrompts', 'enableHistorySearch', 'bookmarks', 'enableBookmarkSearch', 'enablePromptSearch'])
        ]);

        const builderPrompts = settingsData.advancedPrompts || [];
        const bookmarks = settingsData.bookmarks || [];
        const isBookmarkSearchEnabled = settingsData.enableBookmarkSearch !== false;
        const isPromptSearchEnabled = settingsData.enablePromptSearch === true;

        let allSearchData = [];
        
        if (isBookmarkSearchEnabled) {
            const bookmarkData = bookmarks.map(b => ({
                id: `bkmk-${b.id}`,
                text: `${b.name} - ${b.url}`, 
                type: getTranslation('popup.type.bookmark'),
                url: b.url,
                resultType: 'bookmark',
                originalName: b.name
            }));
            allSearchData.push(...bookmarkData);
        }

        if (isPromptSearchEnabled) {

            const characterData = (characterPrompts || []).map(p => ({
                id: `char-${p.id}`,
                text: p.text,
                type: getTranslation('popup.type.character'),
                originalData: p,
                resultType: 'local'
            }));
            allSearchData.push(...characterData); 

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
                    originalData: p,
                    resultType: 'local'
                };
            });
            allSearchData.push(...builderData); 
        }
        searchableData = allSearchData;
        isSearchDataStale = false;
    } catch (error) {
        console.error("Gagal menginisialisasi data pencarian footer:", error);
        if (footerSearch.resultsList) {
            footerSearch.resultsList.innerHTML = `<div class="no-results">${getTranslation('popup.error.loadFailed')}</div>`;
        }
    }
}

function performLocalSearch(query) {
    const lowerCaseQuery = query.toLowerCase().trim().replace(/\s+/g, ' ');
    const results = [];

    if (isValidURL(query)) {
        let fullUrl = query;
        if (!/^https?:\/\//i.test(fullUrl)) {
            fullUrl = 'https://' + fullUrl;
        }
        results.push({
            id: `url-${fullUrl}`,
            text: getTranslation('popup.search.url', { url: query }),
            url: fullUrl,
            resultType: 'url'
        });
    }

    const engineName = getTranslation(`searchEngine.${searchEngine}`);
    const webSearchResult = {
        id: `web-${searchEngine}`,
        text: getTranslation('popup.search.web', { engine: engineName, query: query }),
        query: query,
        engine: searchEngine,
        resultType: 'web'
    };
    results.push(webSearchResult);

    const localResults = searchableData.filter(item => {
        const itemText = (item.text || '').toLowerCase().replace(/\s+/g, ' ');
        const itemType = (item.type || '').toLowerCase();
        return itemText.includes(lowerCaseQuery) || itemType.includes(lowerCaseQuery);
    });

    results.push(...localResults.slice(0, 5)); 
    
    return results;
}

async function performHistorySearch(query) {
    const { enableHistorySearch } = await loadSettings(['enableHistorySearch']);
    if (!enableHistorySearch) return [];

    const lowerCaseQuery = query.toLowerCase().trim().replace(/\s+/g, ' ');
    const longTimeAgo = new Date();
    longTimeAgo.setFullYear(longTimeAgo.getFullYear() - 10);

    const historyItems = await new Promise(resolve => {
        chrome.history.search({
            text: lowerCaseQuery,
            startTime: longTimeAgo.getTime(),
            maxResults: 5 
        }, items => resolve(items));
    });

    return historyItems.map(item => {
        const text = item.title ? `${item.title} - ${item.url}` : item.url;
        
        return {
            id: `hist-${item.id}`,
            text: text,
            url: item.url,
            type: getTranslation('search.historyType'),
            resultType: 'history'
        };
    });
}

function appendResults(results) {
    if (!footerSearch.resultsList || results.length === 0) return;

    const query = footerSearch.input.value.trim();
    const fragment = document.createDocumentFragment();

    results.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.dataset.id = item.id;
        
        let finalText;
        if (item.resultType === 'local' || item.resultType === 'history' || item.resultType === 'bookmark') {
            finalText = highlightMatch(item.text, query);
        } else {
            finalText = item.text;
        }

        let innerHTML = `<span class="result-text">${finalText}</span>`;
        if (item.type) {
            innerHTML += `<span class="result-type">${item.type}</span>`;
        }
        
        if (item.url) resultItem.dataset.url = item.url;
        if (item.query) resultItem.dataset.query = item.query;
        
        resultItem.innerHTML = innerHTML;
        fragment.appendChild(resultItem);
    });

    footerSearch.resultsList.appendChild(fragment);

    const resultItems = footerSearch.resultsList.querySelectorAll('.result-item');
    resultItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            selectedIndex = index;
            updateSelection();
        });
    });
}

function displayResults(localResults, historyResults = []) {
    if (!footerSearch.resultsContainer || !footerSearch.resultsList) return;

    const query = footerSearch.input.value.trim();
    footerSearch.resultsList.innerHTML = '';

    if (query === '') {
        footerSearch.resultsContainer.classList.remove('show');
        return;
    }
    
    footerSearch.resultsContainer.classList.add('show');
    const finalResults = [...localResults, ...historyResults];
    
    if (!finalResults || finalResults.length === 0) {
        footerSearch.resultsList.innerHTML = `<div class="no-results">${getTranslation('popup.error.noResults')}</div>`;
    } else {
        appendResults(finalResults);
    }
}

function updateSelection() {
    const items = footerSearch.resultsList.querySelectorAll('.result-item');
    if (!items.length) return;

    items.forEach(item => item.classList.remove('selected'));

    if (selectedIndex >= 0 && selectedIndex < items.length) {
        const selectedItem = items[selectedIndex];
        selectedItem.classList.add('selected');
        selectedItem.scrollIntoView({ block: 'nearest' });
    }
}

export function closeSearch() {
    footerSearch.resultsContainer.classList.remove('show');
    footerSearch.input.value = '';
    footerSearch.input.blur();
}

export function initializeSearch() {
    if (!footerSearch.input || !footerSearch.container) return;

    const debouncedHistorySearchAndDisplay = debounce(async (query) => {
        if (query.trim() !== '') {
            const historyResults = await performHistorySearch(query);
            displayResults(lastLocalResults, historyResults);
        }
    }, 250);

    footerSearch.input.addEventListener('input', async (event) => {
        const query = event.target.value;
        selectedIndex = -1;

        if (query.trim() === '') {
            footerSearch.resultsContainer.classList.remove('show');
            footerSearch.resultsList.innerHTML = '';
            return;
        }

        if (isSearchDataStale) {
            await initializeData();
        }

        const localResults = performLocalSearch(query);
        lastLocalResults = localResults;
        displayResults(localResults);
        debouncedHistorySearchAndDisplay(query);
    });

    footerSearch.resultsList.addEventListener('click', async (event) => {
        const resultItem = event.target.closest('.result-item');
        if (!resultItem) return;
    
        const itemId = resultItem.dataset.id;
        
        if (itemId.startsWith('url-') || itemId.startsWith('hist-') || itemId.startsWith('web-')) {
            let url;
            if (itemId.startsWith('web-')) {
                const query = resultItem.dataset.query;
                const engine = resultItem.dataset.id.substring(4);
                switch (engine) {
                    case 'yahoo':
                        url = `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`;
                        break;
                    case 'bing':
                        url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
                        break;
                    case 'duckduckgo':
                        url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                        break;
                    case 'google':
                    default:
                        url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                        break;
                }
            } else {
                url = resultItem.dataset.url;
            }
            
            if (searchOpenAction === 'direct') {
                window.location.href = url;
            } else {
                window.open(url, '_blank');
            }
            closeSearch();
        } else if (itemId.startsWith('bkmk-')) {
            const url = resultItem.dataset.url;
            if (searchOpenAction === 'direct') {
                window.location.href = url;
            } else {
                window.open(url, '_blank');
            }
            closeSearch();
        } else {
            const itemToCopy = searchableData.find(item => item.id === itemId);
            if (itemToCopy) {
                try {
                    await navigator.clipboard.writeText(itemToCopy.text);
                    showToast('popup.copy.success');
                    closeSearch();
                } catch (err) {
                    console.error(getTranslation('popup.copy.errorVerbose'), err);
                    showToast('popup.copy.error');
                }
            }
        }
    });

    const handleOutsideClick = (e) => {
        if (!footerSearch.container.contains(e.target) && !footerSearch.resultsContainer.contains(e.target)) {
            footerSearch.resultsContainer.classList.remove('show');
        }
    };

    document.addEventListener('click', handleOutsideClick, true);
    document.addEventListener('contextmenu', handleOutsideClick, true);
    
    document.addEventListener('keydown', (event) => {
        if (document.activeElement !== footerSearch.input) return;
    
        if (event.key === 'Escape') {
            event.preventDefault();
            const resultsVisible = footerSearch.resultsContainer.classList.contains('show');
            const hasText = footerSearch.input.value.trim() !== '';
    
            if (resultsVisible) {
                footerSearch.resultsContainer.classList.remove('show');
            } else if (hasText) {
                footerSearch.input.value = '';
            } else {
                closeSearch();
            }
            return;
        }
        
        const items = footerSearch.resultsList.querySelectorAll('.result-item');
        if (!items.length) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                updateSelection();
                break;
            case 'ArrowUp':
                event.preventDefault();
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                updateSelection();
                break;
            case 'Enter':
                event.preventDefault();
                if (selectedIndex >= 0) {
                    items[selectedIndex].click();
                } else if (items.length > 0) {
                    items[0].click();
                }
                break;
        }
    });

    initializeData();
}