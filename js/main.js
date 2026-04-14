import {
    elements, menu, usernameModal, themeModal, otherSettingsModal, aboutModal,
    pinSettings, createPinModal, pinEnterModal, promptModal, promptViewerModal,
    addEditPromptModal, confirmationModal, infoModal, howItWorksModal, imageViewerModal,
    advancedPromptModal, addEditAdvancedPromptModal, advancedPromptViewerModal,
    settingSwitches, i18nData, userPIN, prompts, advancedPrompts,
    currentUser, setCurrentUser, setUserPIN, setPrompts, setAdvancedPrompts, languageSettings, setLanguageSettings,
    activeModalStack, activePromptMenu, confirmationModalPurpose, setConfirmationModalPurpose,
    isManageModeActive, isAdvancedManageModeActive, isSearchModeActive, isAdvancedSearchModeActive,
    currentPromptId, setAnimationFrameId, setSortableInstance, setAdvancedSortableInstance, setPinModalPurpose, currentAdvancedPromptId,
    pinModalPurpose, dataManagement, confirmationMergeReplaceModal, currentImageViewerId, imageViewerSource,
    uiHideTimeout, setUiHideTimeout, setCurrentImageNavList, setIsAdvancedManageModeActive, setIsAdvancedSearchModeActive,
    isBlockingModalActive, setActiveModalStack, updateModal, CURRENT_VERSION, bookmarks, setBookmarks, bookmarkListModal,
    activeBookmarkMenu, setBookmarkSortableInstance, isBookmarkSearchModeActive, isBookmarkManageModeActive,
    bookmarkOpenAction, setBookmarkOpenAction, footerSearch, searchEngine, setSearchEngine, initFooterSearch,
    searchOpenAction, setSearchOpenAction, isPromptSearchEnabled, setIsPromptSearchEnabled, confirmationBookmarkMergeModal,
    bookmarkModal, isShortcutCtrlDEnabled, setIsShortcutCtrlDEnabled, setCharacterDataStale, setIsAdvancedGridStale,
    setIsPromptGridStale, dataDeletion, colorScheme, setColorScheme, customThemeOverrides, setCustomThemeOverrides,
    isDataOperationInProgress, setIsDataOperationInProgress, todoList, setTodoList, todoListModal, todoModal,
    setTodoSortableInstance, activeTodoMenu, mainPageTodoContainer, isTodoSearchModeActive, isTodoManageModeActive,
    setIsDraggingTodo, todoSortableInstance, isDraggingTodo, setCurrentPromptFolderId, setPromptFolders,
    promptFolderModal, addEditFolderModal, promptFolders, isFolderManageModeActive, isFolderSearchModeActive, folderSortableInstance,
    setFolderSortableInstance, activeHeaderMenu, setActiveHeaderMenu, moveFolderModal, selectedMoveFolderId,
    setSelectedMoveFolderId, promptsToMove, setPromptsToMove
} from './config.js';

import { debounce, getBrowserLanguage, showToast, formatBytes, log } from './utils.js';
import {
    loadSettings, saveSetting, getAllPromptMetadata, clearUserData, calculateCacheSize, clearCache, calculateStoreSize,
    clearHiddenData, clearTemporaryCacheOnLoad, saveWallpaperToCache, getWallpaperFromCache, clearWallpaperCache
} from './storage.js';
import { translateUI, updateClock, updateInfrequentElements, animationLoop, handleVisibilityChange, updateOfflineStatus, checkForUpdates } from './core.js';
import {
    toggleMenu, closeMenuOnClickOutside, openModal, closeModal, closeThemeModal, showInfoModal,
    handleSaveUsername, applyTheme, updateMainPageSwitchesState, adjustSeparatorWidth, applyShowGreeting, applyShowUsername,
    applyShowDescription, applyShowDate, applyShowTime, applyShowSeconds, updateClockSwitchesState, updateSeparatorVisibility,
    applyMenuBlur, applyFooterBlur, updateUsernameDisplay, updateSecurityFeaturesUI, applyEnableAnimation, applyShowContent,
    applyShowBookmark, applyBookmarkBlur, applyShowSearchBar, updateBookmarkDropdownState, updateLanguageControlsState,
    updateSearchEngineDisplay, applyColorScheme, applyCustomBackground, removeCustomBackground, applyThemeOverrides,
    updateCustomThemeSettingsVisibility, updateThemeOverrideButtons, isAdvancedModalSmallMode
} from './ui.js';
import {
    initializeBookmarks, confirmDeleteBookmark, closeAllBookmarkMenus as closeAllBookmarkMenus_bookmark, renderMainPageBookmarks,
    renderBookmarkModalGrid, toggleManageMode as toggleBookmarkManageMode, toggleSearchMode as toggleBookmarkSearchMode, closeAllMainBookmarkMenus_main,
    closeAllContainerBookmarkMenus_main, handleOpenAddBookmarkModal
} from './bookmark.js';
import {
    initializeTodoList, confirmDeleteTodo, closeAllTodoMenus, renderMainPageTodoList, renderTodoModalGrid,
    applyShowTodoList, toggleManageMode as toggleTodoManageMode, toggleSearchMode as toggleTodoSearchMode,
    closeAllContainerTodoMenus_main
} from './todoList.js';
import { initializeSearch, closeSearch, initializeData as reinitializeSearchData } from './search.js';
import { startPinUpdate, handleSaveInitialPin, handleDisableFeature, handlePinSubmit } from './pinManager.js';
import {
    renderPrompts, handleOpenAddPromptModal, handleEditPrompt, handleDeletePrompt,
    copyPromptTextFromViewer, showFullImage, copyPromptTextFromItem,
    handleSavePrompt, confirmDelete, closeAllPromptMenus,
    toggleManageMode as togglePromptManageMode,
    handleSelectAll as handlePromptSelectAll,
    handleDeleteSelected as handlePromptDeleteSelected,
    updateManageModeUI as updatePromptManageModeUI,
    toggleSearchMode as togglePromptSearchMode,
    handleSearchInput as handlePromptSearchInput,
    savePromptImage, navigateImageViewer, closeImageViewer
} from './promptManager.js';
import {
    renderAdvancedPrompts, toggleAdvancedManageMode, handleAdvancedSelectAll,
    handleAdvancedDeleteSelected, toggleAdvancedSearchMode, handleAdvancedSearchInput,
    updateAdvancedManageModeUI, handleOpenAddAdvancedPromptModal, handleSaveAdvancedPrompt,
    copyAdvancedPromptText, handleDeleteAdvancedPrompt, handleEditAdvancedPrompt,
    copyAdvancedPromptTextFromViewer, confirmAdvancedDelete, handleCharacterSearchInput,
    copyAdvancedCharacterText, adjustVisibleIcons, updateCharacterIconInBuilderItems, reorderAdvancedPromptGrid,
    handleCharacterDeletionInBuilder, updateSingleAdvancedPromptItem, handleFolderTabClick, openFolderManagementModal,
    filterAndRenderAdvancedPrompts, renderFolderTabs, openAddEditFolderModal, handleSaveFolder, handleDeleteFolder,
    initFolderDropdownListener, confirmDeleteFolder, toggleFolderManageMode, toggleFolderSearchMode,
    handleFolderSearchInput, handleFolderSelectAll, handleFolderDeleteSelected, closeSidebarContextMenu,
    openAdvancedPromptManager, handleArchiveAdvancedPrompt, handleOpenMoveFolderModal, handleMovePrompts,
    updateMoveFolderDropdownDisplay, handleAdvancedMoveSelected, handleAdvancedArchiveSelected
} from './promptBuilder.js';
import {
    exportUserData, exportHiddenData, importUserData, importHiddenData,
    handleMerge, handleReplace, handleBookmarkMerge, handleBookmarkReplace
} from './importExport.js';

let updateBookmarkActionDropdownDisplay = () => { };
let updateSearchActionDropdownDisplay = () => { };

// ===================================================================
// D. INISIALISASI & EVENT LISTENERS
// ===================================================================

let bookmarkSearchStatesBeforeToggle = {
    search: false,
    popup: false
};

function handleSettingsTabSwitch(activeTab) {
    if (pinSettings.input) {
        pinSettings.input.value = '';
    }

    const tabs = [otherSettingsModal.generalTab, otherSettingsModal.displayTab, otherSettingsModal.dataTab, otherSettingsModal.otherTab];
    const panels = [otherSettingsModal.generalPanel, otherSettingsModal.displayPanel, otherSettingsModal.dataPanel, otherSettingsModal.otherPanel];

    tabs.forEach(tab => tab.classList.remove('active'));
    panels.forEach(panel => panel.classList.remove('active'));

    switch (activeTab) {
        case 'display':
            otherSettingsModal.displayTab.classList.add('active');
            otherSettingsModal.displayPanel.classList.add('active');
            break;
        case 'data':
            otherSettingsModal.dataTab.classList.add('active');
            otherSettingsModal.dataPanel.classList.add('active');
            break;
        case 'other':
            otherSettingsModal.otherTab.classList.add('active');
            otherSettingsModal.otherPanel.classList.add('active');
            break;
        case 'general':
        default:
            otherSettingsModal.generalTab.classList.add('active');
            otherSettingsModal.generalPanel.classList.add('active');
            break;
    }
    const modalBody = otherSettingsModal.overlay.querySelector('.modal-body');
    if (modalBody) {
        modalBody.scrollTop = 0;
    }
}

function toggleHeaderMenu(menuEl, btnEl) {
    if (activeHeaderMenu && activeHeaderMenu !== menuEl) {
        activeHeaderMenu.classList.remove('show');
    }

    closeAllPromptMenus();
    closeSidebarContextMenu();
    closeAllBookmarkMenus_bookmark();
    closeAllTodoMenus();

    const isShowing = menuEl.classList.toggle('show');
    setActiveHeaderMenu(isShowing ? menuEl : null);

    if (isShowing) {
        // const btnRect = btnEl.getBoundingClientRect();
        // menuEl.style.top = `${btnRect.bottom + -30}px`;
        // menuEl.style.left = `${btnRect.left - menuEl.offsetWidth + btnRect.width}px`;
    }
}

function handleHeaderMenuAction(modal, action) {
    if (activeHeaderMenu) {
        activeHeaderMenu.classList.remove('show');
        setActiveHeaderMenu(null);
    }

    if (action === 'search') {
        if (modal === promptModal) togglePromptSearchMode(true);
        if (modal === advancedPromptModal) toggleAdvancedSearchMode(true);
        if (modal === bookmarkListModal) toggleBookmarkSearchMode(true);
        if (modal === todoListModal) toggleTodoSearchMode(true);
        if (modal === promptFolderModal) toggleFolderSearchMode(true);
    } else if (action === 'manage') {
        if (modal === promptModal) togglePromptManageMode(true);
        if (modal === advancedPromptModal) toggleAdvancedManageMode(true);
        if (modal === bookmarkListModal) toggleBookmarkManageMode(true);
        if (modal === todoListModal) toggleTodoManageMode(true);
        if (modal === promptFolderModal) toggleFolderManageMode(true);
    }
}

export function closeHeaderMenu() {
    if (activeHeaderMenu) {
        activeHeaderMenu.classList.remove('show');
        setActiveHeaderMenu(null);
    }
    closeSidebarContextMenu();
}

function initializeDragAndDrop() {
    if (promptModal.grid) {
        const sortable = new Sortable(promptModal.grid, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            filter: '.add-prompt-item',
            preventOnFilter: true,
            delay: 200,
            delayOnTouchOnly: true,
            onStart: function () {
                closeAllPromptMenus();
                closeHeaderMenu();
            },
            onMove: function (evt) {
                return !evt.related.classList.contains('add-prompt-item');
            },
            onEnd: async function (evt) {
                const newPrompts = [...prompts];
                const movedItem = newPrompts.splice(evt.oldIndex, 1)[0];
                newPrompts.splice(evt.newIndex, 0, movedItem);
                setPrompts(newPrompts);
                const newOrder = newPrompts.map(p => p.id);
                await saveSetting('promptOrder', newOrder);
                document.dispatchEvent(new CustomEvent('characterListUpdated', {
                    detail: { type: 'reorder' }
                }));
            },
        });
        setSortableInstance(sortable);
    }
    if (advancedPromptModal.grid) {
        const advancedSortable = new Sortable(advancedPromptModal.grid, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            filter: '.add-prompt-item',
            preventOnFilter: true,
            delay: 200,
            delayOnTouchOnly: true,
            fallbackOnBody: true,
            onStart: function () {
                closeAllPromptMenus();
                closeHeaderMenu();
            },
            onMove: function (evt) {
                return !evt.related.classList.contains('add-prompt-item');
            },
            onEnd: async function (evt) {
                const newAdvancedPrompts = [...advancedPrompts];
                const movedItem = newAdvancedPrompts.splice(evt.oldIndex, 1)[0];
                newAdvancedPrompts.splice(evt.newIndex, 0, movedItem);
                setAdvancedPrompts(newAdvancedPrompts);
                await saveSetting('advancedPrompts', newAdvancedPrompts);
            },
        });
        setAdvancedSortableInstance(advancedSortable);
    }
    if (bookmarkListModal.grid) {
        const bookmarkSortable = new Sortable(bookmarkListModal.grid, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            filter: '.add-bookmark-item',
            preventOnFilter: true,
            delay: 200,
            delayOnTouchOnly: true,
            onStart: function () {
                closeAllBookmarkMenus_bookmark();
                closeHeaderMenu();
            },
            onMove: function (evt) {
                return !evt.related.classList.contains('add-bookmark-item');
            },
            onEnd: async function (evt) {
                const newBookmarks = [...bookmarks];
                const movedItem = newBookmarks.splice(evt.oldIndex, 1)[0];
                newBookmarks.splice(evt.newIndex, 0, movedItem);
                setBookmarks(newBookmarks);
                await saveSetting('bookmarks', newBookmarks);
                renderMainPageBookmarks();
            },
        });
        setBookmarkSortableInstance(bookmarkSortable);
    }
    if (todoListModal.grid) {
        const todoSortable = new Sortable(todoListModal.grid, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            forceFallback: true,
            filter: '.add-bookmark-item, .todo-item.completed, .todo-completed-header',
            preventOnFilter: true,
            delay: 200,
            delayOnTouchOnly: true,
            onStart: function () {
                closeAllTodoMenus();
                setIsDraggingTodo(true);
                closeHeaderMenu();
            },
            onMove: function (evt) {
                const isAddButton = evt.related.classList.contains('add-bookmark-item');
                const isRelatedCompleted = evt.related.classList.contains('completed');
                const isHeader = evt.related.classList.contains('todo-completed-header');
                return !isAddButton && !isRelatedCompleted && !isHeader;
            },
            onEnd: async function (evt) {
                const incompleteTodos = todoList.filter(t => !t.completed);
                const completedTodos = todoList.filter(t => t.completed);
                const movedItem = incompleteTodos.splice(evt.oldIndex, 1)[0];
                incompleteTodos.splice(evt.newIndex, 0, movedItem);
                const newTodos = [...incompleteTodos, ...completedTodos];
                setTodoList(newTodos);
                await saveSetting('todoList', newTodos);
                renderMainPageTodoList();
                setTimeout(() => {
                    setIsDraggingTodo(false);
                }, 0);
            },
        });
        setTodoSortableInstance(todoSortable);
    }
    if (promptFolderModal.grid) {
        const folderSortable = new Sortable(promptFolderModal.grid, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            filter: '.add-bookmark-item',
            preventOnFilter: true,
            delay: 200,
            delayOnTouchOnly: true,
            onStart: function () {
                closeAllPromptMenus();
                closeHeaderMenu();
            },
            onMove: function (evt) {
                return !evt.related.classList.contains('add-bookmark-item');
            },
            onEnd: async function (evt) {
                const newFolders = [...promptFolders];
                const movedItem = newFolders.splice(evt.oldIndex, 1)[0];
                newFolders.splice(evt.newIndex, 0, movedItem);
                setPromptFolders(newFolders);
                await saveSetting('promptFolders', newFolders);
                renderFolderTabs();
            },
        });
        setFolderSortableInstance(folderSortable);
    }
}

const langDropdowns = ['greeting', 'description', 'date'];
function updateApplyAllState(isApplied) {
    langDropdowns.forEach(type => {
        const container = document.getElementById(`lang-container-${type}`);
        if (container) {
            if (isApplied) {
                const newLangSettings = { ...languageSettings, [type]: languageSettings.ui };
                setLanguageSettings(newLangSettings);
            }
            updateDropdownDisplay(type);
        }
    });
    if (isApplied) { updateInfrequentElements(); }
}

function updateDropdownDisplay(type) {
    const trigger = document.getElementById(`lang-select-${type}`); if (!trigger) return;
    const optionsContainer = trigger.nextElementSibling; const selectedTextSpan = trigger.querySelector('span:first-child');
    const currentLang = languageSettings[type]; const selectedOption = optionsContainer.querySelector(`[data-value="${currentLang}"]`);
    if (selectedOption) { selectedTextSpan.textContent = selectedOption.textContent; optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected')); selectedOption.classList.add('selected'); }
}

function setupSearchEngineDropdown() {
    const trigger = document.getElementById('search-engine-select');
    if (!trigger) return;
    const optionsContainer = trigger.nextElementSibling;
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
    optionsContainer.addEventListener('click', async (e) => {
        const option = e.target.closest('.custom-option');
        if (option) {
            const newEngine = option.getAttribute('data-value');
            setSearchEngine(newEngine);
            await saveSetting('searchEngine', newEngine);
            updateSearchEngineDisplay();
            optionsContainer.classList.remove('show');
            trigger.classList.remove('open');
        }
    });
}

function setupDropdown(type) {
    const trigger = document.getElementById(`lang-select-${type}`); if (!trigger) return;
    const optionsContainer = trigger.nextElementSibling;
    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); if (trigger.closest('.switch-container.disabled')) return;
        document.querySelectorAll('.custom-select-options.show').forEach(openOption => { if (openOption !== optionsContainer) { openOption.classList.remove('show'); openOption.previousElementSibling.classList.remove('open'); } });
        const isShown = optionsContainer.classList.toggle('show'); trigger.classList.toggle('open', isShown);
    });
    optionsContainer.addEventListener('click', async (e) => {
        const option = e.target.closest('.custom-option');
        if (option) {
            const newLang = option.getAttribute('data-value');
            const newLangSettings = { ...languageSettings, [type]: newLang };
            setLanguageSettings(newLangSettings);

            if (type === 'ui') {
                translateUI(newLang);
                updateBookmarkActionDropdownDisplay();
                updateSearchActionDropdownDisplay();
                updateUsernameDisplay();
                updateSecurityFeaturesUI();
                renderPrompts();
                renderAdvancedPrompts();
                renderMainPageBookmarks();
                renderBookmarkModalGrid();
                reinitializeSearchData();
                renderMainPageTodoList();
                renderTodoModalGrid();
                if (isManageModeActive) {
                    updatePromptManageModeUI();
                }
                if (isAdvancedManageModeActive) {
                    updateAdvancedManageModeUI();
                }
                if (languageSettings.applyToAll) {
                    updateApplyAllState(true);
                }
            }
            updateInfrequentElements();
            updateDropdownDisplay(type);
            await saveSetting('languageSettings', languageSettings);
            optionsContainer.classList.remove('show');
            trigger.classList.remove('open');
        }
    });
    updateDropdownDisplay(type);
}

function handleAvatarDoubleClick() {
    if (!userPIN) return;
    if (themeModal.previewCheckbox && themeModal.previewCheckbox.checked) {
        return;
    }
    menu.container.classList.remove("show-menu");
    openAdvancedPromptManager();
}

document.addEventListener("DOMContentLoaded", async () => {
    const keysToLoad = [
        "username", "theme", "showSeconds", "menuBlur", "footerBlur",
        "languageSettings", "userPIN", "advancedPrompts", "enablePopupFinder",
        "promptOrder", "enableAnimation", "showContent", "showGreeting", "showDescription", "showDate", "showTime",
        "showUsername", "bookmarks", "showBookmark", "bookmarkBlur", "enableSearchBar", "bookmarkOpenAction", "searchEngine",
        "searchOpenAction", "enableHistorySearch", "enableBookmarkSearch", "enableBookmarkPopupFinder", "enablePromptSearch",
        "enableShortcutCtrlD", "colorScheme", "customBackground", "customThemeOverrides", "todoList", "showTodoList",
        "promptFolders"
    ];

    const settings = await loadSettings(keysToLoad);

    mainPageTodoContainer.list = document.querySelector('#main-page-todo-container .main-page-todo-list');

    const todoArrowBtn = document.getElementById('open-todo-modal-arrow-btn');
    if (todoArrowBtn) {
        todoArrowBtn.addEventListener('click', () => {
            openModal(todoListModal.overlay);
        });
    }

    if (settings.languageSettings) {
        setLanguageSettings({ ...languageSettings, ...settings.languageSettings });
    } else {
        const browserLang = getBrowserLanguage();
        const newSettings = { ...languageSettings };
        Object.keys(newSettings).forEach(key => { if (key !== 'applyToAll') newSettings[key] = browserLang; });
        setLanguageSettings(newSettings);
    }

    await clearTemporaryCacheOnLoad();
    await clearCache('image-viewer-context-menu-cache');

    initFooterSearch();
    const shouldShowContent = settings.showContent !== false;
    settingSwitches.showContent.checked = shouldShowContent;
    document.addEventListener('keydown', handleModalSearchShortcut);

    const appVersionElement = document.getElementById('app-version');
    if (appVersionElement) {
        appVersionElement.textContent = CURRENT_VERSION;
    }

    setCurrentUser(settings.username || "K1234");
    setUserPIN(settings.userPIN || null);
    setAdvancedPrompts(settings.advancedPrompts || []);
    setPromptFolders(settings.promptFolders || []);
    setBookmarks(settings.bookmarks || []);
    setTodoList(settings.todoList || []);
    setColorScheme(settings.colorScheme || 'default');

    if (settings.languageSettings) {
        setLanguageSettings({ ...languageSettings, ...settings.languageSettings });
    } else {
        const browserLang = getBrowserLanguage();
        const newSettings = { ...languageSettings };
        Object.keys(newSettings).forEach(key => { if (key !== 'applyToAll') newSettings[key] = browserLang; });
        setLanguageSettings(newSettings);
    }

    if (settings.customBackground === true) {
        const wallpaperBlob = await getWallpaperFromCache();
        if (wallpaperBlob) {
            await applyCustomBackground(wallpaperBlob);
        } else {
            await saveSetting('customBackground', false);
        }
    }

    if (settings.customThemeOverrides) {
        setCustomThemeOverrides(settings.customThemeOverrides);
    }

    if (themeModal.uploadBackgroundBtn) {
        themeModal.uploadBackgroundBtn.addEventListener('click', () => {
            themeModal.backgroundFileInput.click();
        });
    }

    if (themeModal.backgroundFileInput) {
        themeModal.backgroundFileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                showToast("toast.imageOnly");
                return;
            }
            try {
                await saveWallpaperToCache(file);
                await saveSetting('customBackground', true);
                applyCustomBackground(file);
                showToast("toast.wallpaperApplied");
            } catch (error) {
                showToast("toast.imageReadFail");
                console.error("Failed to apply background:", error);
            }
            event.target.value = '';
        });
    }

    if (themeModal.removeBackgroundBtn) {
        themeModal.removeBackgroundBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            removeCustomBackground();
        });
    }

    ['ui', ...langDropdowns].forEach(setupDropdown);

    const shouldEnableAnimation = settings.enableAnimation !== false;
    const shouldShowGreeting = settings.showGreeting !== false; settingSwitches.showGreeting.checked = shouldShowGreeting;
    const shouldShowDescription = settings.showDescription !== false; settingSwitches.showDescription.checked = shouldShowDescription;
    const shouldShowDate = settings.showDate !== false; settingSwitches.showDate.checked = shouldShowDate;
    const shouldShowTime = settings.showTime !== false; settingSwitches.showTime.checked = shouldShowTime;
    const shouldShowSeconds = settings.showSeconds !== false; settingSwitches.showSeconds.checked = shouldShowSeconds;

    const shouldShowUsername = settings.showUsername !== false;
    if (settingSwitches.showUsername) {
        settingSwitches.showUsername.checked = shouldShowUsername;
    }

    const shouldUseMenuBlur = settings.menuBlur !== false; settingSwitches.menuBlur.checked = shouldUseMenuBlur;
    const shouldUseBookmarkBlur = settings.bookmarkBlur !== false; settingSwitches.bookmarkBlur.checked = shouldUseBookmarkBlur;
    const shouldShowBookmark = settings.showBookmark !== false; settingSwitches.showBookmark.checked = shouldShowBookmark;
    const shouldShowTodoList = settings.showTodoList !== false;
    if (settingSwitches.showTodoList) settingSwitches.showTodoList.checked = shouldShowTodoList;
    const shouldUseFooterBlur = settings.footerBlur !== false; settingSwitches.footerBlur.checked = shouldUseFooterBlur;
    const shouldShowSearchBar = settings.enableSearchBar !== false; settingSwitches.enableSearchBar.checked = shouldShowSearchBar;
    settingSwitches.enableAnimation.checked = shouldEnableAnimation;
    settingSwitches.applyToAll.checked = languageSettings.applyToAll;

    document.addEventListener('characterListUpdated', async (event) => {
        setIsAdvancedGridStale(true);
        setIsPromptGridStale(true);
        const detail = event.detail;
        if (detail?.type === 'edit' && detail.updatedPrompt) {
            const updatedCharacterId = detail.updatedPrompt.id;
            await updateCharacterIconInBuilderItems(updatedCharacterId);
            const affectedBuilderPrompts = advancedPrompts.filter(p =>
                p.characterIds && p.characterIds.includes(updatedCharacterId)
            );
            for (const builderPrompt of affectedBuilderPrompts) {
                await updateSingleAdvancedPromptItem(builderPrompt);
            }
        }
        if (detail?.type === 'delete' && detail.deletedIds) {
            await handleCharacterDeletionInBuilder(detail.deletedIds);
        }
    });

    const shouldEnableShortcutCtrlD = settings.enableShortcutCtrlD !== false;
    setIsShortcutCtrlDEnabled(shouldEnableShortcutCtrlD);
    if (settingSwitches.enableShortcutCtrlD) {
        settingSwitches.enableShortcutCtrlD.checked = shouldEnableShortcutCtrlD;
    }

    let promptMetadata = await getAllPromptMetadata();

    if (settings.promptOrder && Array.isArray(settings.promptOrder)) {
        const orderMap = new Map(settings.promptOrder.map((id, index) => [id, index]));
        promptMetadata.sort((a, b) => {
            const aIndex = orderMap.get(a.id) ?? Infinity;
            const bIndex = orderMap.get(b.id) ?? Infinity;
            return aIndex - bIndex;
        });
    }

    setPrompts(promptMetadata || []);
    setSearchEngine(settings.searchEngine || 'google');

    setBookmarkOpenAction(settings.bookmarkOpenAction || 'newTab');
    setSearchOpenAction(settings.searchOpenAction || 'newTab');

    function setupBookmarkActionDropdown() {
        const trigger = document.getElementById('bookmark-open-action-select');
        if (!trigger) return;

        const optionsContainer = trigger.nextElementSibling;
        const selectedTextSpan = trigger.querySelector('span:first-child');

        const updateDisplay = () => {
            const selectedOption = optionsContainer.querySelector(`[data-value="${bookmarkOpenAction}"]`);
            if (selectedOption) {
                selectedTextSpan.textContent = selectedOption.textContent;
                optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                selectedOption.classList.add('selected');
            }
        };

        updateBookmarkActionDropdownDisplay = updateDisplay;

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

        optionsContainer.addEventListener('click', async (e) => {
            const option = e.target.closest('.custom-option');
            if (option) {
                const newValue = option.getAttribute('data-value');
                setBookmarkOpenAction(newValue);
                await saveSetting('bookmarkOpenAction', newValue);
                updateDisplay();
                renderMainPageBookmarks();
                renderBookmarkModalGrid();
                optionsContainer.classList.remove('show');
                trigger.classList.remove('open');
            }
        });

        updateDisplay();
    }

    function setupSearchActionDropdown() {
        const trigger = document.getElementById('search-open-action-select');
        if (!trigger) return;

        const optionsContainer = trigger.nextElementSibling;

        const updateDisplay = () => {
            const selectedTextSpan = trigger.querySelector('span:first-child');
            const selectedOption = optionsContainer.querySelector(`[data-value="${searchOpenAction}"]`);
            if (selectedOption) {
                const i18nKey = selectedOption.getAttribute('data-i18n-key');
                const lang = languageSettings.ui;
                const translatedText = i18nData[i18nKey]?.[lang] || selectedOption.textContent;

                selectedTextSpan.textContent = translatedText;
                optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                selectedOption.classList.add('selected');
            }
        };

        updateSearchActionDropdownDisplay = updateDisplay;

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

        optionsContainer.addEventListener('click', async (e) => {
            const option = e.target.closest('.custom-option');
            if (option) {
                const newValue = option.getAttribute('data-value');
                setSearchOpenAction(newValue);
                await saveSetting('searchOpenAction', newValue);
                updateDisplay();
                optionsContainer.classList.remove('show');
                trigger.classList.remove('open');
            }
        });

        updateDisplay();
    }

    setupBookmarkActionDropdown();
    setupSearchActionDropdown();
    setupSearchEngineDropdown();
    initializeBookmarks();
    initializeTodoList();
    initializeSearch();
    initializeDragAndDrop();

    const fullImageViewer = imageViewerModal.image;
    const contextMenu = document.getElementById('image-viewer-context-menu');

    if (fullImageViewer && contextMenu) {
        fullImageViewer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            contextMenu.style.zIndex = parseInt(imageViewerModal.overlay.style.zIndex || 102) + 1;
            contextMenu.innerHTML = '';

            const source = imageViewerSource;
            const lang = languageSettings.ui;
            let menuItems = [];

            if (source === 'grid') {
                menuItems = [
                    { action: 'copy', key: 'prompt.image.copy' },
                    { action: 'save-image', key: 'prompt.menu.saveImage' },
                    { action: 'edit', key: 'prompt.menu.edit' },
                    { action: 'delete', key: 'prompt.menu.delete' }
                ];
            } else if (source === 'builder') {
                const copyCharTextKey = "prompt.menu.copyCharText";
                menuItems = [
                    { action: 'copy-char-text-only', key: copyCharTextKey },
                    { action: 'save-image', key: 'prompt.menu.saveImage' }
                ];
            }

            menuItems.forEach(item => {
                const button = document.createElement('button');
                button.className = 'prompt-menu-option';
                button.dataset.action = item.action;
                button.textContent = i18nData[item.key]?.[lang] || i18nData[item.key]?.['id'];
                contextMenu.appendChild(button);
            });

            const { clientX: mouseX, clientY: mouseY } = e;
            const { innerWidth, innerHeight } = window;
            const menuWidth = contextMenu.offsetWidth;
            const menuHeight = contextMenu.offsetHeight;
            let top = mouseY, left = mouseX;
            if (mouseY + menuHeight > innerHeight) top = innerHeight - menuHeight - 5;
            if (mouseX + menuWidth > innerWidth) left = innerWidth - menuWidth - 5;
            contextMenu.style.top = `${top}px`;
            contextMenu.style.left = `${left}px`;
            contextMenu.style.display = 'flex';
        });

        window.addEventListener('click', () => {
            if (contextMenu && contextMenu.style.display === 'flex') {
                contextMenu.style.display = 'none';
            }
        });

        contextMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = e.target.closest('.prompt-menu-option');
            if (!target) return;

            const action = target.dataset.action;
            const promptId = currentImageViewerId;

            switch (action) {
                case 'copy':
                    copyPromptTextFromItem(promptId);
                    break;
                case 'save-image':
                    savePromptImage(promptId);
                    break;
                case 'edit':
                    closeModal(imageViewerModal.overlay);
                    handleEditPrompt(promptId);
                    break;
                case 'delete':
                    handleDeletePrompt(promptId);
                    break;
                case 'copy-char-text-only':
                    const character = prompts.find(c => c.id === promptId);
                    if (character) {
                        navigator.clipboard.writeText(character.text);
                        showToast("prompt.copy.success");
                    }
                    break;
            }
            contextMenu.style.display = 'none';
        });
    }

    if (imageViewerModal.prevBtn) {
        imageViewerModal.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateImageViewer(-1);
        });
    }
    if (imageViewerModal.nextBtn) {
        imageViewerModal.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateImageViewer(1);
        });
    }
    if (imageViewerModal.overlay) {
        imageViewerModal.overlay.addEventListener('mousemove', () => {
            const controls = imageViewerModal.controls;
            if (controls && !imageViewerModal.overlay.classList.contains('hidden')) {
                controls.classList.remove('hidden-ui');
                clearTimeout(uiHideTimeout);
                const newTimeout = setTimeout(() => {
                    controls.classList.add('hidden-ui');
                }, 3000);
                setUiHideTimeout(newTimeout);
            }
        });
        imageViewerModal.closeBtn.addEventListener('click', () => {
            clearTimeout(uiHideTimeout);
        });
    }

    window.addEventListener('resize', () => {
        if (!advancedPromptModal.overlay.classList.contains('hidden')) {
            adjustVisibleIcons();
        }
    });

    const shouldEnablePromptSearch = settings.enablePromptSearch === true;
    setIsPromptSearchEnabled(shouldEnablePromptSearch);
    if (settingSwitches.enablePromptSearch) {
        settingSwitches.enablePromptSearch.checked = shouldEnablePromptSearch;
    }

    const shouldEnableBookmarkSearch = settings.enableBookmarkSearch !== false;
    if (settingSwitches.enableBookmarkSearch) {
        settingSwitches.enableBookmarkSearch.checked = shouldEnableBookmarkSearch;
    }

    const shouldEnableBookmarkPopupFinder = settings.enableBookmarkPopupFinder === true;
    if (settingSwitches.enableBookmarkPopupFinder) {
        settingSwitches.enableBookmarkPopupFinder.checked = shouldEnableBookmarkPopupFinder;
    }

    const shouldEnablePopupFinder = settings.enablePopupFinder === true;
    if (settingSwitches.enablePopupFinder) {
        settingSwitches.enablePopupFinder.checked = shouldEnablePopupFinder;
    }

    if (settingSwitches.enableHistorySearch) {
        settingSwitches.enableHistorySearch.checked = settings.enableHistorySearch === true;
    }

    applyTheme(settings.theme || "system");
    applyColorScheme(settings.colorScheme || "default");
    applyEnableAnimation(shouldEnableAnimation);
    applyShowGreeting(shouldShowGreeting);
    applyShowUsername(shouldShowUsername);
    applyShowDescription(shouldShowDescription);
    applyShowDate(shouldShowDate);
    applyShowTime(shouldShowTime);
    applyShowSeconds(shouldShowSeconds);
    applyMenuBlur(shouldUseMenuBlur);
    applyBookmarkBlur(shouldUseBookmarkBlur);
    applyFooterBlur(shouldUseFooterBlur);
    applyShowContent(shouldShowContent);
    applyShowBookmark(shouldShowBookmark);
    applyShowTodoList(shouldShowTodoList);
    applyShowSearchBar(shouldShowSearchBar);

    adjustSeparatorWidth();
    setTimeout(() => updateMainPageSwitchesState(), 0);
    updateSeparatorVisibility();

    translateUI(languageSettings.ui);
    updateSearchEngineDisplay();
    updateBookmarkActionDropdownDisplay();
    updateUsernameDisplay();
    updateApplyAllState(languageSettings.applyToAll);
    updateSecurityFeaturesUI();

    applyThemeOverrides();
    updateThemeOverrideButtons();
    updateCustomThemeSettingsVisibility();

    updateOfflineStatus();
    updateClock();
    updateInfrequentElements();

    setAnimationFrameId(requestAnimationFrame(animationLoop));

    const infoSection = document.querySelector('.info-section');
    if (infoSection) {
        setTimeout(() => {
            infoSection.classList.add('visible');
            document.querySelector('.footer').classList.add('footer-visible');
            document.getElementById('bottom-search-bar').classList.add('footer-visible');
        },);
    }

    function handleImageFileSelection(file) {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showInfoModal("info.attention.title", "prompt.dnd.notImage");
            addEditPromptModal.imageFileInput.value = '';
            return;
        }

        if (file.size === 0) {
            showInfoModal("info.longPath.title", "info.longPath.text");
            addEditPromptModal.imageFileInput.value = '';
            return;
        }

        const isAdding = currentPromptId === null;
        const targetImage = isAdding ? addEditPromptModal.imagePreviewSingle : addEditPromptModal.imagePreviewNew;
        const targetContainer = isAdding ? targetImage.parentElement : addEditPromptModal.previewsContainer;

        addEditPromptModal.previewsContainer.classList.toggle('hidden', isAdding);
        addEditPromptModal.imagePreviewSingle.parentElement.classList.toggle('hidden', !isAdding);
        targetContainer.classList.add('is-loading');

        targetImage.onload = () => {
            targetContainer.classList.remove('is-loading');
            targetImage.classList.remove('hidden');
        };

        targetImage.onerror = () => {
            targetContainer.classList.remove('is-loading');
            log('error', 'log.error.loadPreviewFailed');
            showInfoModal("info.attention.title", "prompt.save.fileError");
        };

        const reader = new FileReader();
        reader.onerror = (error) => {
            log('error', 'log.error.fileReader', {}, error);
            targetContainer.classList.remove('is-loading');
            showInfoModal("info.attention.title", "prompt.save.fileError");
        };

        reader.onload = (e) => {
            targetImage.src = e.target.result;
        };

        reader.readAsDataURL(file);

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        addEditPromptModal.imageFileInput.files = dataTransfer.files;
    }

    if (addEditPromptModal.imageFileInput) {
        addEditPromptModal.imageFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                handleImageFileSelection(file);
            }
        });
    }

    function setupDragAndDrop(targetElement, onDropCallback, conditionCallback = () => true) {
        let dragCounter = 0;
        targetElement.addEventListener('dragenter', e => {
            e.preventDefault(); e.stopPropagation();
            if (!e.dataTransfer.types.includes('Files')) return;
            dragCounter++;
            if (dragCounter === 1 && conditionCallback()) {
                targetElement.classList.add('drag-over');
            }
        });
        targetElement.addEventListener('dragleave', e => {
            e.preventDefault(); e.stopPropagation();
            if (!e.dataTransfer.types.includes('Files')) return;
            dragCounter--;
            if (dragCounter === 0) {
                targetElement.classList.remove('drag-over');
            }
        });
        targetElement.addEventListener('dragover', e => {
            e.preventDefault(); e.stopPropagation();
        });
        targetElement.addEventListener('drop', e => {
            e.preventDefault(); e.stopPropagation();
            if (!e.dataTransfer.types.includes('Files')) return;
            dragCounter = 0;
            targetElement.classList.remove('drag-over');
            if (conditionCallback()) {
                const droppedFiles = e.dataTransfer.files;
                if (droppedFiles.length > 0) {
                    onDropCallback(droppedFiles[0]);
                }
            }
        });
    }

    const addEditModalContent = addEditPromptModal.overlay.querySelector('.modal-content');
    if (addEditModalContent) {
        setupDragAndDrop(addEditModalContent, handleImageFileSelection);
    }
    const promptModalContent = promptModal.overlay.querySelector('.modal-content');
    if (promptModalContent) {
        const onDropOnMainGrid = (file) => {
            if (file.type.startsWith('image/')) {
                handleOpenAddPromptModal();
                handleImageFileSelection(file);
            } else {
                showInfoModal("info.attention.title", "prompt.dnd.notImage");
            }
        };
        const condition = () => !isManageModeActive && !isSearchModeActive;
        setupDragAndDrop(promptModalContent, onDropOnMainGrid, condition);
    }
    document.body.addEventListener('click', (e) => {
        const target = e.target;
        if (target.matches('.prompt-menu-option')) {
            const action = target.dataset.action;
            const parentMenu = target.closest('.prompt-item-menu') || target.closest('#folder-sidebar-context-menu');
            if (!parentMenu) {
                return;
            }
            const id = parseInt(parentMenu.dataset.id, 10);
            closeSidebarContextMenu();
            closeAllPromptMenus();
            closeHeaderMenu();
            if (action === 'view-image') {
                const isFromBuilder = target.closest('#advanced-prompt-viewer-modal-overlay');
                const source = isFromBuilder ? 'builder' : 'grid';

                if (source === 'grid') {
                    const allPromptIds = prompts.map(p => p.id);
                    setCurrentImageNavList(allPromptIds);
                }

                showFullImage(id, source);
            }
            if (action === 'copy') copyPromptTextFromItem(id);
            if (action === 'save-image') savePromptImage(id);
            if (action === 'edit') handleEditPrompt(id);
            if (action === 'delete') handleDeletePrompt(id);
            if (action === 'copy-advanced') copyAdvancedPromptText(id);
            if (action === 'copy-char-advanced') copyAdvancedCharacterText(id);
            if (action === 'archive-advanced') {
                handleArchiveAdvancedPrompt(id, true);
            }
            if (action === 'unarchive-advanced') {
                handleArchiveAdvancedPrompt(id, false);
            }
            if (action === 'edit-advanced') handleEditAdvancedPrompt(id);
            if (action === 'delete-advanced') handleDeleteAdvancedPrompt(id);
            if (action === 'move-advanced') handleOpenMoveFolderModal([id]);
            if (action === 'edit-folder') {
                openAddEditFolderModal(id);
            }
            if (action === 'delete-folder') {
                confirmDeleteFolder(id);
            }
        }
    });
    if (addEditAdvancedPromptModal.searchInput) {
        addEditAdvancedPromptModal.searchInput.addEventListener('input', handleCharacterSearchInput);
    }

    // Import and Export Data
    window.addEventListener('beforeunload', (event) => {
        if (isDataOperationInProgress) {
            event.preventDefault();
            event.returnValue = '';
        }
    });

    if (otherSettingsModal.dataTab) {
        otherSettingsModal.dataTab.addEventListener('click', () => {
            handleSettingsTabSwitch('data');
            updateStorageUsage();
        });
    }

    if (dataManagement.exportUserDataBtn) dataManagement.exportUserDataBtn.addEventListener('click', exportUserData);
    if (dataManagement.importUserDataBtn) dataManagement.importUserDataBtn.addEventListener('click', importUserData);
    if (dataManagement.exportHiddenDataBtn) dataManagement.exportHiddenDataBtn.addEventListener('click', exportHiddenData);
    if (dataManagement.importHiddenDataBtn) dataManagement.importHiddenDataBtn.addEventListener('click', importHiddenData);

    if (confirmationBookmarkMergeModal.closeBtn) {
        confirmationBookmarkMergeModal.closeBtn.addEventListener('click', () => {
            closeModal(confirmationBookmarkMergeModal.overlay);
            setIsDataOperationInProgress(false);
        });
    }
    if (confirmationBookmarkMergeModal.mergeBtn) {
        confirmationBookmarkMergeModal.mergeBtn.addEventListener('click', handleBookmarkMerge);
    }
    if (confirmationBookmarkMergeModal.replaceBtn) {
        confirmationBookmarkMergeModal.replaceBtn.addEventListener('click', handleBookmarkReplace);
    }

    if (confirmationMergeReplaceModal.closeBtn) {
        confirmationMergeReplaceModal.closeBtn.addEventListener('click', () => {
            closeModal(confirmationMergeReplaceModal.overlay);
            setIsDataOperationInProgress(false);
        });
    }
    if (confirmationMergeReplaceModal.mergeBtn) confirmationMergeReplaceModal.mergeBtn.addEventListener('click', handleMerge);
    if (confirmationMergeReplaceModal.replaceBtn) confirmationMergeReplaceModal.replaceBtn.addEventListener('click', handleReplace);

    const advancedModalObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const targetElement = mutation.target;
                const isNowVisible = !targetElement.classList.contains('hidden');
                const wasPreviouslyHidden = mutation.oldValue && mutation.oldValue.includes('hidden');

                if (isNowVisible && wasPreviouslyHidden) {
                    const modalContent = advancedPromptModal.content;

                    if (isAdvancedModalSmallMode()) {
                        modalContent.classList.remove('sidebar-open');
                    }
                    else {
                        if (!isAdvancedManageModeActive && !isAdvancedSearchModeActive) {
                            modalContent.classList.add('sidebar-open');
                        } else {
                            modalContent.classList.remove('sidebar-open');
                        }
                    }

                    renderFolderTabs();
                    filterAndRenderAdvancedPrompts();
                    adjustVisibleIcons();
                    setTimeout(() => {
                        adjustVisibleIcons();
                    }, 300);
                }
            }
        }
    });

    if (advancedPromptModal.overlay) {
        advancedModalObserver.observe(advancedPromptModal.overlay, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['class']
        });
    }

    if (elements.mainPageBookmarkContainer) {
        elements.mainPageBookmarkContainer.addEventListener('wheel', (event) => {
            const container = elements.mainPageBookmarkContainer;
            const { scrollTop, scrollHeight, clientHeight } = container;
            const scrollAmount = event.deltaY;

            const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
            if (isAtBottom && scrollAmount > 0) {
                event.preventDefault();
            }

            const isAtTop = scrollTop === 0;
            if (isAtTop && scrollAmount < 0) {
                event.preventDefault();
            }
        });
    }

    // Delete Website Data
    if (dataDeletion.deleteUserDataBtn) {
        dataDeletion.deleteUserDataBtn.addEventListener('click', () => {
            setConfirmationModalPurpose('deleteUserData');
            const lang = languageSettings.ui;
            confirmationModal.title.textContent = i18nData["confirm.delete.user.title"][lang];
            confirmationModal.text.innerHTML = i18nData["confirm.delete.user.text"][lang];
            openModal(confirmationModal.overlay);
        });
    }

    if (dataDeletion.deleteHiddenDataBtn) {
        dataDeletion.deleteHiddenDataBtn.addEventListener('click', () => {
            if (!userPIN) {
                showToast("settings.hidden.notEnabled");
                return;
            }
            setConfirmationModalPurpose('deleteHiddenData');
            const lang = languageSettings.ui;
            confirmationModal.title.textContent = i18nData["confirm.delete.hidden.title"][lang];
            confirmationModal.text.innerHTML = i18nData["confirm.delete.hidden.text"][lang];
            openModal(confirmationModal.overlay);
        });
    }

    if (dataDeletion.clearBookmarkCacheBtn) {
        dataDeletion.clearBookmarkCacheBtn.addEventListener('click', async () => {
            await clearCache('favicon-cache');
            showToast("data.cache.clearedReloadSuccess");
            setTimeout(() => window.location.reload(), 1500);
        });
    }

    if (dataDeletion.deleteTodoListDataBtn) {
        dataDeletion.deleteTodoListDataBtn.addEventListener('click', () => {
            setConfirmationModalPurpose('deleteTodoListData');
            const lang = languageSettings.ui;
            confirmationModal.title.textContent = i18nData["confirm.delete.todo.title"][lang];
            confirmationModal.text.innerHTML = i18nData["confirm.delete.todo.text"][lang];
            openModal(confirmationModal.overlay);
        });
    }

    if (dataDeletion.clearHiddenCacheBtn) {
        dataDeletion.clearHiddenCacheBtn.addEventListener('click', async () => {
            await clearCache('prompt-blob-cache');
            showToast("data.cache.clearedReloadSuccess");
            setTimeout(() => window.location.reload(), 1500);
        });
    }

    async function handleOverrideChange(type, value) {
        const newOverrides = { ...customThemeOverrides, [type]: value };
        setCustomThemeOverrides(newOverrides);
        applyThemeOverrides();
        updateThemeOverrideButtons();
        await saveSetting('customThemeOverrides', newOverrides);
    }

    if (themeModal.infoSectionThemeDefaultBtn) themeModal.infoSectionThemeDefaultBtn.addEventListener('click', () => handleOverrideChange('infoSection', 'default'));
    if (themeModal.infoSectionThemeLightBtn) themeModal.infoSectionThemeLightBtn.addEventListener('click', () => handleOverrideChange('infoSection', 'light'));
    if (themeModal.infoSectionThemeDarkBtn) themeModal.infoSectionThemeDarkBtn.addEventListener('click', () => handleOverrideChange('infoSection', 'dark'));

    if (themeModal.footerThemeDefaultBtn) themeModal.footerThemeDefaultBtn.addEventListener('click', () => handleOverrideChange('footer', 'default'));
    if (themeModal.footerThemeLightBtn) themeModal.footerThemeLightBtn.addEventListener('click', () => handleOverrideChange('footer', 'light'));
    if (themeModal.footerThemeDarkBtn) themeModal.footerThemeDarkBtn.addEventListener('click', () => handleOverrideChange('footer', 'dark'));

    if (themeModal.shadowThemeDefaultBtn) themeModal.shadowThemeDefaultBtn.addEventListener('click', () => handleOverrideChange('shadow', 'default'));
    if (themeModal.shadowThemeLightBtn) themeModal.shadowThemeLightBtn.addEventListener('click', () => handleOverrideChange('shadow', 'light'));
    if (themeModal.shadowThemeDarkBtn) themeModal.shadowThemeDarkBtn.addEventListener('click', () => handleOverrideChange('shadow', 'dark'));

    window.addEventListener("blur", () => {
        if (isDraggingTodo) {
            const pointerUpEvent = new PointerEvent('pointerup', {
                view: window,
                bubbles: true,
                cancelable: true,
                pointerId: 1,
                isPrimary: true
            });

            window.dispatchEvent(pointerUpEvent);
            document.dispatchEvent(pointerUpEvent);
            document.body.dispatchEvent(pointerUpEvent);

            const mouseUpEvent = new MouseEvent('mouseup', {
                view: window,
                bubbles: true,
                cancelable: true
            });

            window.dispatchEvent(mouseUpEvent);
            document.dispatchEvent(mouseUpEvent);
            document.body.dispatchEvent(mouseUpEvent);
        }
    });

    const addFolderBtn = document.getElementById('advanced-prompt-add-folder-btn');
    if (addFolderBtn) {
        addFolderBtn.addEventListener('click', () => {
            openAddEditFolderModal(null);
        });
    }

    const moreFoldersBtn = document.getElementById('advanced-prompt-more-folders-btn');
    if (moreFoldersBtn) {
        moreFoldersBtn.addEventListener('click', () => {
            openFolderManagementModal();
        });
    }

    const closeFolderModalBtn = document.getElementById('close-prompt-folder-modal-btn');
    if (closeFolderModalBtn) {
        closeFolderModalBtn.addEventListener('click', () => {
            toggleFolderManageMode(false);
            toggleFolderSearchMode(false);
            closeModal(promptFolderModal.overlay);
            renderFolderTabs();
        });
    }

    if (promptFolderModal.addBtn) {
        promptFolderModal.addBtn.addEventListener('click', () => openAddEditFolderModal(null));
    }
    if (promptFolderModal.manageBtn) {
        promptFolderModal.manageBtn.addEventListener('click', () => toggleFolderManageMode());
    }
    if (promptFolderModal.cancelManageBtn) {
        promptFolderModal.cancelManageBtn.addEventListener('click', () => toggleFolderManageMode(false));
    }
    if (promptFolderModal.selectAllBtn) {
        promptFolderModal.selectAllBtn.addEventListener('click', handleFolderSelectAll);
    }
    if (promptFolderModal.deleteSelectedBtn) {
        promptFolderModal.deleteSelectedBtn.addEventListener('click', handleFolderDeleteSelected);
    }
    if (promptFolderModal.searchBtn) {
        promptFolderModal.searchBtn.addEventListener('click', () => toggleFolderSearchMode());
    }
    if (promptFolderModal.cancelSearchBtn) {
        promptFolderModal.cancelSearchBtn.addEventListener('click', () => toggleFolderSearchMode(false));
    }
    if (promptFolderModal.searchInput) {
        promptFolderModal.searchInput.addEventListener('input', handleFolderSearchInput);
    }

    const allFoldersBtn = document.getElementById('advanced-prompt-folder-all');
    if (allFoldersBtn) {
        allFoldersBtn.addEventListener('click', () => {
            handleFolderTabClick('all');
        });
    }

    const closeAddEditFolderBtn = document.getElementById('close-add-edit-folder-modal-btn');
    if (closeAddEditFolderBtn) {
        closeAddEditFolderBtn.addEventListener('click', () => closeModal(addEditFolderModal.overlay));
    }

    const saveFolderBtn = document.getElementById('save-folder-btn');
    if (saveFolderBtn) {
        saveFolderBtn.addEventListener('click', handleSaveFolder);
    }

    const folderNameInput = document.getElementById('folder-name-input');
    if (folderNameInput) {
        folderNameInput.addEventListener('keydown', (e) => {
            if (e.key === "Enter") {
                handleSaveFolder();
            }
        });
    }

    initFolderDropdownListener();

    const toggleSidebarBtn = document.getElementById('advanced-prompt-toggle-sidebar-btn');
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', () => {
            const modalContent = advancedPromptModal.overlay.querySelector('.modal-content');
            if (modalContent) {
                modalContent.classList.toggle('sidebar-open');
                setTimeout(() => {
                    adjustVisibleIcons();
                }, 300);
            }
        });
    }

    const advancedPromptMainArea = document.querySelector('#advanced-prompt-modal-overlay .advanced-prompt-main-area');
    if (advancedPromptMainArea) {
        advancedPromptModal.mainArea = advancedPromptMainArea;
    }

    if (advancedPromptModal.content) {
        advancedPromptModal.content.addEventListener('click', (e) => {
            const isSmallModeActive = isAdvancedModalSmallMode();
            const modalContent = advancedPromptModal.content;

            if (e.target.closest('#advanced-prompt-toggle-sidebar-btn')) {
                return;
            }

            if (isSmallModeActive && modalContent.classList.contains('sidebar-open')) {
                if (e.target.closest('#advanced-prompt-folder-bar') === null) {
                    modalContent.classList.remove('sidebar-open');
                }
            }
        });
    }

    if (advancedPromptModal.overlay && !window.advancedModalObserverAttached) {
        advancedModalObserver.observe(advancedPromptModal.overlay, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['class']
        });
        window.advancedModalObserverAttached = true;
    }

    if (advancedPromptModal.moveSelectedBtn) {
        advancedPromptModal.moveSelectedBtn.addEventListener('click', handleAdvancedMoveSelected);
    }
    if (advancedPromptModal.archiveSelectedBtn) {
        advancedPromptModal.archiveSelectedBtn.addEventListener('click', handleAdvancedArchiveSelected);
    }

    function setupModalHeaderMenu(modal) {
        if (modal.moreBtn && modal.headerMenu) {
            modal.moreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleHeaderMenu(modal.headerMenu, modal.moreBtn);
            });

            modal.headerMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                const option = e.target.closest('.prompt-menu-option');
                if (option) {
                    const action = option.dataset.action;
                    handleHeaderMenuAction(modal, action);
                }
            });
        }
    }

    setupModalHeaderMenu(promptModal);
    setupModalHeaderMenu(advancedPromptModal);
    setupModalHeaderMenu(bookmarkListModal);
    setupModalHeaderMenu(todoListModal);
    setupModalHeaderMenu(promptFolderModal);

    document.body.classList.add('loaded');
});

window.addEventListener("click", (e) => {
    closeMenuOnClickOutside(e);
    document.querySelectorAll('.custom-select-options.show').forEach(options => {
        const container = options.closest('.custom-select-container');
        if (container && !container.contains(e.target)) { options.classList.remove('show'); options.previousElementSibling.classList.remove('open'); }
    });
    if (activeHeaderMenu && !activeHeaderMenu.contains(e.target) && !e.target.closest('.modal-header-btn.more-btn')) {
        activeHeaderMenu.classList.remove('show');
        setActiveHeaderMenu(null);
    }
    if (activePromptMenu && !activePromptMenu.contains(e.target) && !e.target.closest('.prompt-item-menu-btn')) {
        closeSidebarContextMenu();
        closeAllPromptMenus();
    }
    if (activeBookmarkMenu && !activeBookmarkMenu.contains(e.target) && !e.target.closest('.bookmark-menu-btn')) {
        closeAllBookmarkMenus_bookmark();
    }
    if (activeTodoMenu && !activeTodoMenu.contains(e.target) && !e.target.closest('.todo-menu-btn')) {
        closeAllTodoMenus();
    }
    const contextMenuMain = document.getElementById('bookmark-context-menu-main');
    if (contextMenuMain && contextMenuMain.classList.contains('show') && !contextMenuMain.contains(e.target) && !e.target.closest('.bookmark-menu-btn-main')) {
        contextMenuMain.classList.remove('show');
    }
    const contextMenuTodo = document.getElementById('todo-container-context-menu');
    if (contextMenuTodo && contextMenuTodo.classList.contains('show') && !contextMenuTodo.contains(e.target)) {
        closeAllContainerTodoMenus_main();
    }
});

window.addEventListener("online", updateOfflineStatus);
window.addEventListener("offline", updateOfflineStatus);

let isMobileResolution = window.innerWidth <= 600;

window.addEventListener("resize", () => {
    adjustSeparatorWidth();
    if (settingSwitches.showTodoList) {
        applyShowTodoList(settingSwitches.showTodoList.checked);
    }
    if (settingSwitches.showTodoList?.checked) {
        renderMainPageTodoList();
    }

    if (!advancedPromptModal.overlay.classList.contains('hidden')) {
        const isSmallModeActive = isAdvancedModalSmallMode();
        const modalContent = advancedPromptModal.content;

        if (isSmallModeActive) {
            if (isAdvancedManageModeActive || isAdvancedSearchModeActive) {
                if (modalContent.classList.contains('sidebar-open')) {
                    modalContent.classList.remove('sidebar-open');
                }
            }
        }
    }

    const newIsMobileResolution = window.innerWidth <= 600;
    if (isMobileResolution && !newIsMobileResolution) {
        if (activeHeaderMenu) {
            closeHeaderMenu();
        }
    }
    isMobileResolution = newIsMobileResolution;
});

window.addEventListener("keydown", (event) => {
    const isImageViewerOpen = activeModalStack.length > 0 &&
        activeModalStack[activeModalStack.length - 1] === imageViewerModal.overlay;

    if (event.key === "Escape") {
        const sidebarContextMenu = document.getElementById('folder-sidebar-context-menu');
        if (sidebarContextMenu && sidebarContextMenu.style.display === 'flex') {
            event.preventDefault();
            event.stopPropagation();
            closeSidebarContextMenu();
            return;
        }

        if (activeHeaderMenu) {
            event.preventDefault();
            event.stopPropagation();
            activeHeaderMenu.classList.remove('show');
            setActiveHeaderMenu(null);
            return;
        }

        if (activeModalStack.length > 0 && activeModalStack[activeModalStack.length - 1] === advancedPromptModal.overlay) {
            const isSmallModeActive = isAdvancedModalSmallMode();
            const modalContent = advancedPromptModal.content;

            if (isSmallModeActive && modalContent.classList.contains('sidebar-open')) {
                event.preventDefault();
                event.stopPropagation();
                modalContent.classList.remove('sidebar-open');
                return;
            }
        }

        const contextMenu = document.getElementById('image-viewer-context-menu');

        if (contextMenu && contextMenu.style.display === 'flex') {
            contextMenu.style.display = 'none';
            return;
        }

        if (activeBookmarkMenu) {
            closeAllBookmarkMenus_bookmark();
            return;
        }

        if (activeTodoMenu) {
            closeAllTodoMenus();
            return;
        }

        const contextMenuContainer = document.getElementById('bookmark-container-context-menu');
        if (contextMenuContainer && contextMenuContainer.classList.contains('show')) {
            closeAllContainerBookmarkMenus_main();
            return;
        }

        const contextMenuTodoContainer = document.getElementById('todo-container-context-menu');
        if (contextMenuTodoContainer && contextMenuTodoContainer.classList.contains('show')) {
            closeAllContainerTodoMenus_main();
            return;
        }

        if (activePromptMenu) {
            closeSidebarContextMenu();
            closeAllPromptMenus();
            return;
        }
        if (menu.container.classList.contains('show-menu')) { menu.container.classList.remove('show-menu'); return; }
        const openSelects = document.querySelectorAll('.custom-select-options.show');
        if (openSelects.length > 0) {
            openSelects.forEach(options => {
                options.classList.remove('show');
                options.previousElementSibling.classList.remove('open');
            });
            return;
        }

        const contextMenuMain = document.getElementById('bookmark-context-menu-main');
        if (contextMenuMain && contextMenuMain.classList.contains('show')) {
            closeAllMainBookmarkMenus_main();
            return;
        }

        const activeEl = document.activeElement;
        if (activeEl === pinSettings.input) {
            if (pinSettings.input.value !== '') {
                pinSettings.input.value = '';
                event.preventDefault();
                return;
            }
            else {
                pinSettings.input.blur();
                event.preventDefault();
                if (activeModalStack.includes(pinEnterModal.overlay)) {
                    closeModal(pinEnterModal.overlay);
                }
                else {
                    document.body.focus({ preventScroll: true });
                }
                return;
            }
        }

        const isBookmarkInput = activeEl === bookmarkModal.nameInput || activeEl === bookmarkModal.urlInput;
        if (isBookmarkInput && !bookmarkModal.overlay.classList.contains('hidden')) {
            activeEl.blur();
            event.preventDefault();
        }

        if (activeModalStack.length > 0 && !isBlockingModalActive) {
            const lastModal = activeModalStack[activeModalStack.length - 1];

            if (lastModal === promptModal.overlay) {
                if (isSearchModeActive) {
                    togglePromptSearchMode(false);
                    return;
                }
                if (isManageModeActive) {
                    togglePromptManageMode(false);
                    return;
                }
            }

            if (lastModal === advancedPromptModal.overlay) {
                if (isAdvancedSearchModeActive) {
                    toggleAdvancedSearchMode(false);
                    return;
                }
                if (isAdvancedManageModeActive) {
                    toggleAdvancedManageMode(false);
                    return;
                }
            }

            if (lastModal === bookmarkListModal.overlay) {
                if (isBookmarkSearchModeActive) {
                    toggleBookmarkSearchMode(false);
                    return;
                }
                if (isBookmarkManageModeActive) {
                    toggleBookmarkManageMode(false);
                    return;
                }
            }

            if (lastModal === todoListModal.overlay) {
                if (isTodoSearchModeActive) {
                    toggleTodoSearchMode(false);
                    return;
                }
                if (isTodoManageModeActive) {
                    toggleTodoManageMode(false);
                    return;
                }
            }

            if (lastModal === promptFolderModal.overlay) {
                if (isFolderSearchModeActive) {
                    toggleFolderSearchMode(false);
                    return;
                }
                if (isFolderManageModeActive) {
                    toggleFolderManageMode(false);
                    return;
                }
            }

            if (lastModal === addEditAdvancedPromptModal.overlay) {
                if (addEditAdvancedPromptModal.searchInput && addEditAdvancedPromptModal.searchInput.value !== '') {
                    addEditAdvancedPromptModal.searchInput.value = '';
                    handleCharacterSearchInput();
                    return;
                }
            }

            const closeButton = lastModal.querySelector('.close-btn');
            if (closeButton) {
                closeButton.click();
            } else {
                closeModal(lastModal);
            }
        }
    } else if (event.key === "ArrowLeft" && isImageViewerOpen) {
        navigateImageViewer(-1);
    } else if (event.key === "ArrowRight" && isImageViewerOpen) {
        navigateImageViewer(1);
    } else if (event.key === "PageUp" && isImageViewerOpen) {
        navigateImageViewer(-1);
    } else if (event.key === "PageDown" && isImageViewerOpen) {
        navigateImageViewer(1);
    } else if (event.key === "Enter") {
        const activeEl = document.activeElement;
        const isInputFocused = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA';
        const isSearchBarEnabled = settingSwitches.enableSearchBar && settingSwitches.enableSearchBar.checked;

        if (activeModalStack.length > 0) {
            const topModal = activeModalStack[activeModalStack.length - 1];
            if (topModal === confirmationModal.overlay && !confirmationModal.confirmBtn.disabled) {
                event.preventDefault();
                confirmationModal.confirmBtn.click();
                return;
            }
        }

        if (activeModalStack.length === 0 && !isInputFocused && isSearchBarEnabled) {
            event.preventDefault();
            footerSearch.input.focus();
        }
    } else if (event.key === "Delete") {
        const activeEl = document.activeElement;
        const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

        if (activeModalStack.length > 0 && !isBlockingModalActive && !isInputFocused) {
            const topModal = activeModalStack[activeModalStack.length - 1];
            if (topModal === promptModal.overlay && isManageModeActive && !promptModal.deleteSelectedBtn.disabled) {
                event.preventDefault();
                promptModal.deleteSelectedBtn.click();
            } else if (topModal === advancedPromptModal.overlay && isAdvancedManageModeActive && !advancedPromptModal.deleteSelectedBtn.disabled) {
                event.preventDefault();
                advancedPromptModal.deleteSelectedBtn.click();
            } else if (topModal === bookmarkListModal.overlay && isBookmarkManageModeActive && !bookmarkListModal.deleteSelectedBtn.disabled) {
                event.preventDefault();
                bookmarkListModal.deleteSelectedBtn.click();
            } else if (topModal === todoListModal.overlay && isTodoManageModeActive && !todoListModal.deleteSelectedBtn.disabled) {
                event.preventDefault();
                todoListModal.deleteSelectedBtn.click();
            } else if (topModal === promptFolderModal.overlay && isFolderManageModeActive && !promptFolderModal.deleteSelectedBtn.disabled) {
                event.preventDefault();
                promptFolderModal.deleteSelectedBtn.click();
            }
        }
    }

    const isControlOrCommand = event.ctrlKey || event.metaKey;
    const isAKey = event.key === 'a' || event.key === 'A';

    if (isControlOrCommand && isAKey) {
        if (activeModalStack.length > 0 && !isBlockingModalActive) {
            const topModal = activeModalStack[activeModalStack.length - 1];
            const activeEl = document.activeElement;
            const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
            if (!isInputFocused) {
                if (topModal === promptModal.overlay) {
                    event.preventDefault();
                    if (!isManageModeActive) togglePromptManageMode(true);
                    promptModal.selectAllBtn.click();
                } else if (topModal === advancedPromptModal.overlay) {
                    event.preventDefault();
                    if (!isAdvancedManageModeActive) toggleAdvancedManageMode(true);
                    advancedPromptModal.selectAllBtn.click();
                } else if (topModal === bookmarkListModal.overlay) {
                    event.preventDefault();
                    if (!isBookmarkManageModeActive) toggleBookmarkManageMode(true);
                    bookmarkListModal.selectAllBtn.click();
                } else if (topModal === todoListModal.overlay) {
                    event.preventDefault();
                    if (!isTodoManageModeActive) toggleTodoManageMode(true);
                    todoListModal.selectAllBtn.click();
                } else if (topModal === promptFolderModal.overlay) {
                    event.preventDefault();
                    if (!isFolderManageModeActive) toggleFolderManageMode(true);
                    promptFolderModal.selectAllBtn.click();
                }
            }
        }
    }

    const isHKey = event.key === 'h' || event.key === 'H';
    if (isControlOrCommand && event.shiftKey && isHKey && activeModalStack.length === 0) {
        if (!userPIN) return;
        event.preventDefault();
        closeSearch();
        handleAvatarDoubleClick();
        return;
    }
    const isDKey = event.key === 'd' || event.key === 'D';
    if (isControlOrCommand && isDKey) {
        const isBookmarkVisible = settingSwitches.showBookmark ? settingSwitches.showBookmark.checked : false;
        if (isShortcutCtrlDEnabled && activeModalStack.length === 0 && isBookmarkVisible) {
            event.preventDefault();
            closeSearch();
            handleOpenAddBookmarkModal();
        }
        return;
    }
    const allFoldersBtn = document.getElementById('advanced-prompt-folder-all');
    if (allFoldersBtn) {
        allFoldersBtn.addEventListener('click', () => {
            handleFolderTabClick('all');
        });
    }
    const archiveBtn = document.querySelector('.folder-tab-btn[data-folder-id="archive"]');
    if (archiveBtn) {
        archiveBtn.addEventListener('click', () => {
            handleFolderTabClick('archive');
        });
    }
});

function handleModalSearchShortcut(event) {
    const isControlOrCommand = event.ctrlKey || event.metaKey;
    const isFKey = event.key === 'f' || event.key === 'F';

    if (isControlOrCommand && isFKey) {
        const topModal = activeModalStack[activeModalStack.length - 1];

        if (topModal === promptModal.overlay) {
            event.preventDefault();
            if (!isManageModeActive) {
                togglePromptSearchMode(true);
            }
        } else if (topModal === advancedPromptModal.overlay) {
            event.preventDefault();
            if (!isAdvancedManageModeActive) {
                toggleAdvancedSearchMode(true);
            }
        } else if (topModal === bookmarkListModal.overlay) {
            event.preventDefault();
            if (!isBookmarkManageModeActive) {
                toggleBookmarkSearchMode(true);
            }
        } else if (topModal === todoListModal.overlay) {
            event.preventDefault();
            if (!isTodoManageModeActive) {
                toggleTodoSearchMode(true);
            }
        } else if (topModal === promptFolderModal.overlay) {
            event.preventDefault();
            if (!isFolderManageModeActive) {
                toggleFolderSearchMode(true);
            }
        }
    }
}

document.addEventListener('visibilitychange', handleVisibilityChange);

if (menu.button) {
    menu.button.addEventListener("click", toggleMenu);
    menu.button.addEventListener("dblclick", handleAvatarDoubleClick);
    menu.button.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        toggleMenu(event);
    });
}

// Event Listeners for Modals
if (usernameModal.openBtn) usernameModal.openBtn.addEventListener("click", () => {
    closeSearch();
    menu.container.classList.remove("show-menu");
    usernameModal.input.value = currentUser;
    openModal(usernameModal.overlay);
    usernameModal.input.focus();
});
if (usernameModal.closeBtn) usernameModal.closeBtn.addEventListener("click", () => closeModal(usernameModal.overlay));
if (usernameModal.saveBtn) usernameModal.saveBtn.addEventListener("click", handleSaveUsername);
if (usernameModal.input) usernameModal.input.addEventListener("keydown", (event) => { if (event.key === "Enter") handleSaveUsername(); });

if (themeModal.openBtn) themeModal.openBtn.addEventListener("click", () => {
    menu.container.classList.remove("show-menu");
    openModal(themeModal.overlay);
});
if (themeModal.closeBtn) themeModal.closeBtn.addEventListener("click", closeThemeModal);

if (otherSettingsModal.openBtn) otherSettingsModal.openBtn.addEventListener("click", () => {
    menu.container.classList.remove("show-menu");
    openModal(otherSettingsModal.overlay);
    pinSettings.input.value = '';
    handleSettingsTabSwitch('general');
});
if (otherSettingsModal.closeBtn) otherSettingsModal.closeBtn.addEventListener("click", () => closeModal(otherSettingsModal.overlay));

if (otherSettingsModal.generalTab) {
    otherSettingsModal.generalTab.addEventListener('click', () => handleSettingsTabSwitch('general'));
}
if (otherSettingsModal.displayTab) {
    otherSettingsModal.displayTab.addEventListener('click', () => handleSettingsTabSwitch('display'));
}
if (otherSettingsModal.otherTab) {
    otherSettingsModal.otherTab.addEventListener('click', () => handleSettingsTabSwitch('other'));
}

if (aboutModal.openBtn) aboutModal.openBtn.addEventListener("click", () => {
    menu.container.classList.remove("show-menu");
    openModal(aboutModal.overlay);
});
if (aboutModal.closeBtn) aboutModal.closeBtn.addEventListener("click", () => closeModal(aboutModal.overlay));

const handleUpdatePinClick = () => {
    const newPin = pinSettings.input.value;
    pinSettings.input.blur();
    if (!/^\d{4}$/.test(newPin)) {
        showToast("settings.pin.feedback.error");
        return;
    }
    startPinUpdate('hidden');
};

if (pinSettings.updateBtn) pinSettings.updateBtn.addEventListener('click', handleUpdatePinClick);
if (pinSettings.input) pinSettings.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUpdatePinClick();
});

if (createPinModal.saveBtn) createPinModal.saveBtn.addEventListener('click', handleSaveInitialPin);
if (createPinModal.input) createPinModal.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSaveInitialPin(); });
if (createPinModal.closeBtn) createPinModal.closeBtn.addEventListener('click', () => { closeModal(createPinModal.overlay); settingSwitches.hiddenFeature.checked = false; });

if (pinEnterModal.closeBtn) pinEnterModal.closeBtn.addEventListener("click", () => {
    pinEnterModal.input.blur();
    closeModal(pinEnterModal.overlay);
    if (confirmationModalPurpose === 'disableHiddenFeature' || confirmationModalPurpose === 'disableContinueFeature') {
        updateSecurityFeaturesUI();
    }

    const currentPurpose = pinModalPurpose;
    if (currentPurpose === 'confirmEnablePopupFinder') {
        settingSwitches.enablePopupFinder.checked = false;
    } else if (currentPurpose === 'confirmDisablePopupFinder') {
        settingSwitches.enablePopupFinder.checked = true;
    } else if (currentPurpose === 'confirmEnablePromptSearch') {
        settingSwitches.enablePromptSearch.checked = false;
    } else if (currentPurpose === 'confirmDisablePromptSearch') {
        settingSwitches.enablePromptSearch.checked = true;
    }
    document.body.focus({ preventScroll: true });
});

if (pinEnterModal.submitBtn) pinEnterModal.submitBtn.addEventListener("click", handlePinSubmit);

if (pinEnterModal.input) pinEnterModal.input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        handlePinSubmit();
    }
});

if (promptModal.closeBtn) promptModal.closeBtn.addEventListener("click", () => {
    togglePromptManageMode(false);
    togglePromptSearchMode(false);
    closeModal(promptModal.overlay);
});
if (promptModal.addBtn) {
    promptModal.addBtn.addEventListener('click', handleOpenAddPromptModal);
}
if (promptModal.manageBtn) promptModal.manageBtn.addEventListener('click', () => togglePromptManageMode());
if (promptModal.cancelManageBtn) promptModal.cancelManageBtn.addEventListener('click', () => togglePromptManageMode(false));
if (promptModal.selectAllBtn) promptModal.selectAllBtn.addEventListener('click', handlePromptSelectAll);
if (promptModal.deleteSelectedBtn) promptModal.deleteSelectedBtn.addEventListener('click', handlePromptDeleteSelected);
if (promptModal.searchBtn) promptModal.searchBtn.addEventListener('click', () => togglePromptSearchMode());
if (promptModal.cancelSearchBtn) promptModal.cancelSearchBtn.addEventListener('click', () => togglePromptSearchMode(false));
if (promptModal.searchInput) promptModal.searchInput.addEventListener('input', handlePromptSearchInput);

// --- Advanced Prompt Modal Listeners ---
if (advancedPromptModal.closeBtn) advancedPromptModal.closeBtn.addEventListener("click", () => {
    toggleAdvancedManageMode(false);
    toggleAdvancedSearchMode(false);
    advancedPromptModal.content.classList.remove('manage-mode', 'search-mode');
    setCurrentPromptFolderId('all');
    const folderBar = document.getElementById('advanced-prompt-folder-bar');
    if (folderBar) {
        folderBar.scrollTop = 0;
    }
    const promptGrid = document.getElementById('advanced-prompt-grid');
    if (promptGrid) {
        promptGrid.parentElement.scrollTop = 0;
    }
    closeModal(advancedPromptModal.overlay);
});
if (advancedPromptModal.addBtn) {
    advancedPromptModal.addBtn.addEventListener('click', handleOpenAddAdvancedPromptModal);
}
if (advancedPromptModal.manageBtn) advancedPromptModal.manageBtn.addEventListener('click', () => toggleAdvancedManageMode());
if (advancedPromptModal.cancelManageBtn) advancedPromptModal.cancelManageBtn.addEventListener('click', () => toggleAdvancedManageMode(false));
if (advancedPromptModal.selectAllBtn) advancedPromptModal.selectAllBtn.addEventListener('click', handleAdvancedSelectAll);
if (advancedPromptModal.deleteSelectedBtn) advancedPromptModal.deleteSelectedBtn.addEventListener('click', handleAdvancedDeleteSelected);
if (advancedPromptModal.moveSelectedBtn) advancedPromptModal.moveSelectedBtn.addEventListener('click', handleAdvancedMoveSelected);

if (advancedPromptModal.searchBtn) advancedPromptModal.searchBtn.addEventListener('click', () => toggleAdvancedSearchMode());
if (advancedPromptModal.cancelSearchBtn) advancedPromptModal.cancelSearchBtn.addEventListener('click', () => toggleAdvancedSearchMode(false));
if (advancedPromptModal.searchInput) advancedPromptModal.searchInput.addEventListener('input', handleAdvancedSearchInput);


if (promptViewerModal.closeBtn) promptViewerModal.closeBtn.addEventListener("click", () => { closeModal(promptViewerModal.overlay); });
if (promptViewerModal.copyBtn) promptViewerModal.copyBtn.addEventListener("click", copyPromptTextFromViewer);
if (promptViewerModal.deleteBtn) promptViewerModal.deleteBtn.addEventListener("click", () => handleDeletePrompt(currentPromptId));
if (promptViewerModal.editBtn) promptViewerModal.editBtn.addEventListener("click", () => { closeModal(promptViewerModal.overlay); handleEditPrompt(currentPromptId); });

if (advancedPromptViewerModal.closeBtn) advancedPromptViewerModal.closeBtn.addEventListener("click", () => {
    advancedPromptViewerModal.body.querySelectorAll('.viewer-character-thumbnail').forEach(img => {
        if (img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
        }
    });
    closeModal(advancedPromptViewerModal.overlay);
});

if (advancedPromptViewerModal.copyBtn) advancedPromptViewerModal.copyBtn.addEventListener("click", () => copyAdvancedPromptTextFromViewer(currentAdvancedPromptId));
if (advancedPromptViewerModal.deleteBtn) advancedPromptViewerModal.deleteBtn.addEventListener("click", () => handleDeleteAdvancedPrompt(currentAdvancedPromptId));
if (advancedPromptViewerModal.editBtn) advancedPromptViewerModal.editBtn.addEventListener("click", () => { closeModal(advancedPromptViewerModal.overlay); handleEditAdvancedPrompt(currentAdvancedPromptId); });

if (addEditPromptModal.closeBtn) addEditPromptModal.closeBtn.addEventListener("click", () => {
    [addEditPromptModal.imagePreviewSingle, addEditPromptModal.imagePreviewOld, addEditPromptModal.imagePreviewNew].forEach(img => {
        if (img && img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
        }
    });
    closeModal(addEditPromptModal.overlay);
});

if (addEditPromptModal.saveBtn) addEditPromptModal.saveBtn.addEventListener("click", handleSavePrompt);

if (addEditAdvancedPromptModal.closeBtn) addEditAdvancedPromptModal.closeBtn.addEventListener("click", () => { closeModal(addEditAdvancedPromptModal.overlay); });
if (addEditAdvancedPromptModal.saveBtn) addEditAdvancedPromptModal.saveBtn.addEventListener("click", handleSaveAdvancedPrompt);

const handleCancelConfirmation = () => {
    closeModal(confirmationModal.overlay);
    if (confirmationModalPurpose === 'disableHiddenFeature') {
        settingSwitches.hiddenFeature.checked = true;
    } else if (confirmationModalPurpose === 'disableContinueFeature') {
        settingSwitches.continueFeature.checked = true;
    }
};
if (confirmationModal.closeBtn) confirmationModal.closeBtn.addEventListener("click", handleCancelConfirmation);
if (confirmationModal.cancelBtn) confirmationModal.cancelBtn.addEventListener("click", handleCancelConfirmation);
if (confirmationModal.confirmBtn) confirmationModal.confirmBtn.addEventListener("click", () => {
    const purpose = confirmationModalPurpose;
    if (purpose === 'disableHiddenFeature') {
        handleDisableFeature('hidden');
    } else if (purpose === 'disableContinueFeature') {
        handleDisableFeature('advanced');
    } else if (purpose === 'deletePrompt' || purpose === 'deleteSelectedPrompts') {
        confirmDelete();
    } else if (purpose === 'deleteAdvancedPrompt' || purpose === 'deleteSelectedAdvancedPrompts') {
        confirmAdvancedDelete();
    } else if (purpose === 'deleteFolder' || purpose === 'deleteSelectedFolders') {
        handleDeleteFolder();
    } else if (purpose === 'deleteBookmark' || purpose === 'deleteSelectedBookmarks') {
        confirmDeleteBookmark();
    } else if (purpose === 'deleteTodo' || purpose === 'deleteSelectedTodos' || purpose === 'deleteTodoListData') {
        confirmDeleteTodo();
    } else if (purpose === 'deleteUserData') {
        clearUserData().then(() => {
            showToast("data.delete.user.success");
            setTimeout(() => window.location.reload(), 1500);
        });
    } else if (purpose === 'deleteHiddenData') {
        closeModal(confirmationModal.overlay);
        setPinModalPurpose('confirmDeleteHiddenData');
        const lang = languageSettings.ui;
        pinEnterModal.title.textContent = i18nData["pin.enter.confirmDisable"][lang];
        pinEnterModal.label.textContent = i18nData["confirm.delete.hidden.pinLabel"][lang];
        pinEnterModal.input.value = '';
        openModal(pinEnterModal.overlay);
        pinEnterModal.input.focus();
    }
});

if (infoModal.closeBtn) infoModal.closeBtn.addEventListener("click", () => closeModal(infoModal.overlay));

if (howItWorksModal.openBtn) howItWorksModal.openBtn.addEventListener("click", () => openModal(howItWorksModal.overlay));
if (howItWorksModal.closeBtn) howItWorksModal.closeBtn.addEventListener("click", () => closeModal(howItWorksModal.overlay));

if (imageViewerModal.closeBtn) { imageViewerModal.closeBtn.addEventListener("click", closeImageViewer); }
if (imageViewerModal.overlay) {
    imageViewerModal.overlay.addEventListener("click", (e) => {
        if (e.target === imageViewerModal.overlay) {
            closeImageViewer();
        }
    });
}

if (moveFolderModal.closeBtn) moveFolderModal.closeBtn.addEventListener("click", () => closeModal(moveFolderModal.overlay));
if (moveFolderModal.saveBtn) moveFolderModal.saveBtn.addEventListener("click", handleMovePrompts);
if (moveFolderModal.addFolderBtn) moveFolderModal.addFolderBtn.addEventListener("click", () => openAddEditFolderModal(null));

if (moveFolderModal.folderSelect && moveFolderModal.folderSelectOptions) {
    moveFolderModal.folderSelect.addEventListener('click', (e) => {
        e.stopPropagation();
        const optionsContainer = moveFolderModal.folderSelectOptions;
        const trigger = moveFolderModal.folderSelect;

        document.querySelectorAll('.custom-select-options.show').forEach(openOption => {
            if (openOption !== optionsContainer) {
                openOption.classList.remove('show');
                openOption.previousElementSibling.classList.remove('open');
            }
        });

        const isShown = optionsContainer.classList.toggle('show');
        trigger.classList.toggle('open', isShown);
    });

    moveFolderModal.folderSelectOptions.addEventListener('click', (e) => {
        const option = e.target.closest('.custom-option');
        if (option) {
            const newValue = option.getAttribute('data-value');
            setSelectedMoveFolderId((newValue === 'all' || newValue === 'archive') ? newValue : parseInt(newValue, 10));
            updateMoveFolderDropdownDisplay();
            moveFolderModal.folderSelectOptions.classList.remove('show');
            moveFolderModal.folderSelect.classList.remove('open');
        }
    });
}

// Event Listeners for Settings
if (themeModal.lightBtn) themeModal.lightBtn.addEventListener("click", async () => { applyTheme("light"); await saveSetting("theme", "light"); });
if (themeModal.darkBtn) themeModal.darkBtn.addEventListener("click", async () => { applyTheme("dark"); await saveSetting("theme", "dark"); });
if (themeModal.systemBtn) themeModal.systemBtn.addEventListener("click", async () => { applyTheme("system"); await saveSetting("theme", "system"); });
const schemeDefaultBtn = document.getElementById('scheme-default-btn');
const schemeMonochromeBtn = document.getElementById('scheme-monochrome-btn');
if (schemeDefaultBtn) schemeDefaultBtn.addEventListener("click", async () => { applyColorScheme("default"); await saveSetting("colorScheme", "default"); });
if (schemeMonochromeBtn) schemeMonochromeBtn.addEventListener("click", async () => { applyColorScheme("monochrome"); await saveSetting("colorScheme", "monochrome"); });

if (settingSwitches.applyToAll) { settingSwitches.applyToAll.addEventListener('change', async (e) => { const isChecked = e.target.checked; const newLangSettings = { ...languageSettings, applyToAll: isChecked }; setLanguageSettings(newLangSettings); updateApplyAllState(isChecked); updateLanguageControlsState(); await saveSetting('languageSettings', languageSettings); }); }
if (settingSwitches.showContent) {
    settingSwitches.showContent.addEventListener("change", async (e) => {
        const isChecked = e.target.checked;
        applyShowContent(isChecked);
        updateMainPageSwitchesState();
        applyShowGreeting(settingSwitches.showGreeting.checked);
        if (settingSwitches.showUsername) {
            applyShowUsername(settingSwitches.showUsername.checked);
        }
        applyShowDescription(settingSwitches.showDescription.checked);
        applyShowDate(settingSwitches.showDate.checked);
        applyShowTime(settingSwitches.showTime.checked);
        await saveSetting("showContent", isChecked);
    });
}

if (settingSwitches.showGreeting) {
    settingSwitches.showGreeting.addEventListener("change", async (e) => {
        applyShowGreeting(e.target.checked);
        updateSeparatorVisibility();
        updateLanguageControlsState();
        updateMainPageSwitchesState();
        if (settingSwitches.showUsername) {
            applyShowUsername(settingSwitches.showUsername.checked);
        }
        await saveSetting("showGreeting", e.target.checked);
    });
}

if (settingSwitches.showUsername) {
    settingSwitches.showUsername.addEventListener("change", async (e) => {
        applyShowUsername(e.target.checked);
        await saveSetting("showUsername", e.target.checked);
    });
}

if (settingSwitches.showDescription) { settingSwitches.showDescription.addEventListener("change", async (e) => { applyShowDescription(e.target.checked); updateSeparatorVisibility(); updateLanguageControlsState(); await saveSetting("showDescription", e.target.checked); }); }
if (settingSwitches.showDate) { settingSwitches.showDate.addEventListener("change", async (e) => { applyShowDate(e.target.checked); updateSeparatorVisibility(); updateLanguageControlsState(); await saveSetting("showDate", e.target.checked); }); }
if (settingSwitches.showTime) { settingSwitches.showTime.addEventListener("change", async (e) => { const isChecked = e.target.checked; applyShowTime(isChecked); updateClockSwitchesState(); updateSeparatorVisibility(); await saveSetting("showTime", isChecked); }); }
if (settingSwitches.showSeconds) settingSwitches.showSeconds.addEventListener("change", async (e) => { applyShowSeconds(e.target.checked); await saveSetting("showSeconds", e.target.checked); });

if (settingSwitches.showBookmark) {
    settingSwitches.showBookmark.addEventListener("change", async (e) => {
        const isChecked = e.target.checked;
        applyShowBookmark(isChecked);
        if (!isChecked) {
            await saveSetting("lastKnownBookmarkSearchState", settingSwitches.enableBookmarkSearch.checked);
            await saveSetting("lastKnownBookmarkPopupState", settingSwitches.enableBookmarkPopupFinder.checked);
            if (settingSwitches.enableBookmarkSearch.checked) {
                settingSwitches.enableBookmarkSearch.checked = false;
                await saveSetting("enableBookmarkSearch", false);
            }
            if (settingSwitches.enableBookmarkPopupFinder.checked) {
                settingSwitches.enableBookmarkPopupFinder.checked = false;
                await saveSetting("enableBookmarkPopupFinder", false);
            }
        } else {
            const lastStates = await loadSettings(['lastKnownBookmarkSearchState', 'lastKnownBookmarkPopupState']);
            if (lastStates.lastKnownBookmarkSearchState) {
                settingSwitches.enableBookmarkSearch.checked = true;
                await saveSetting("enableBookmarkSearch", true);
            }
            if (lastStates.lastKnownBookmarkPopupState) {
                settingSwitches.enableBookmarkPopupFinder.checked = true;
                await saveSetting("enableBookmarkPopupFinder", true);
            }
        }
        updateMainPageSwitchesState();
        reinitializeSearchData();
        await saveSetting("showBookmark", isChecked);
    });
}
if (settingSwitches.bookmarkBlur) {
    settingSwitches.bookmarkBlur.addEventListener("change", async (e) => {
        applyBookmarkBlur(e.target.checked);
        await saveSetting("bookmarkBlur", e.target.checked);
    });
}

if (settingSwitches.showTodoList) {
    settingSwitches.showTodoList.addEventListener("change", async (e) => {
        const isChecked = e.target.checked;
        applyShowTodoList(isChecked);
        await saveSetting("showTodoList", isChecked);
    });
}

if (settingSwitches.enablePromptSearch) {
    settingSwitches.enablePromptSearch.addEventListener("change", (e) => {
        e.preventDefault();
        const targetState = e.target.checked;
        if (!userPIN) {
            showInfoModal("info.attention.title", "settings.hidden.disableWarningText");
            e.target.checked = false;
            return;
        }
        const purpose = targetState ? 'confirmEnablePromptSearch' : 'confirmDisablePromptSearch';
        setPinModalPurpose(purpose);
        const lang = languageSettings.ui;
        pinEnterModal.title.textContent = i18nData["pin.enter.confirmFeatureTitle"][lang];
        pinEnterModal.label.textContent = i18nData["pin.enter.confirmFeatureLabel"][lang];
        pinEnterModal.input.value = '';
        openModal(pinEnterModal.overlay);
        pinEnterModal.input.focus();
    });
}

if (settingSwitches.enableHistorySearch) {
    settingSwitches.enableHistorySearch.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            chrome.permissions.request({
                permissions: ['history']
            }, async (granted) => {
                if (granted) {
                    await saveSetting("enableHistorySearch", true);
                    showToast("toast.historyEnabled");
                    reinitializeSearchData();
                } else {
                    e.target.checked = false;
                }
            });
        } else {
            chrome.permissions.remove({
                permissions: ['history']
            }, async (removed) => {
                if (removed) {
                    await saveSetting("enableHistorySearch", false);
                    showToast("toast.historyDisabled");
                    reinitializeSearchData();
                } else {
                    e.target.checked = true;
                }
            });
        }
    });
}

if (settingSwitches.enableSearchBar) {
    settingSwitches.enableSearchBar.addEventListener("change", async (e) => {
        const isChecked = e.target.checked;
        applyShowSearchBar(isChecked);
        updateMainPageSwitchesState();
        await saveSetting("enableSearchBar", isChecked);
        reinitializeSearchData();
    });
}

if (settingSwitches.enableBookmarkSearch) {
    settingSwitches.enableBookmarkSearch.addEventListener("change", async (e) => {
        const isChecked = e.target.checked;
        await saveSetting("enableBookmarkSearch", isChecked);
        reinitializeSearchData();
    });
}

if (settingSwitches.enableBookmarkPopupFinder) {
    settingSwitches.enableBookmarkPopupFinder.addEventListener("change", async (e) => {
        const isChecked = e.target.checked;
        await saveSetting("enableBookmarkPopupFinder", isChecked);
    });
}

if (settingSwitches.enableShortcutCtrlD) {
    settingSwitches.enableShortcutCtrlD.addEventListener("change", async (e) => {
        const isChecked = e.target.checked;
        setIsShortcutCtrlDEnabled(isChecked);
        await saveSetting("enableShortcutCtrlD", isChecked);
    });
}

if (settingSwitches.menuBlur) settingSwitches.menuBlur.addEventListener("change", async (e) => { applyMenuBlur(e.target.checked); await saveSetting("menuBlur", e.target.checked); });
if (settingSwitches.footerBlur) settingSwitches.footerBlur.addEventListener("change", async (e) => { applyFooterBlur(e.target.checked); await saveSetting("footerBlur", e.target.checked); });
if (settingSwitches.avatarFullShow) settingSwitches.avatarFullShow.addEventListener("change", async (e) => { applyAvatarFullShow(e.target.checked); await saveSetting("avatarFullShow", e.target.checked); });

if (settingSwitches.enableAnimation) {
    settingSwitches.enableAnimation.addEventListener("change", async (e) => {
        const isChecked = e.target.checked;
        applyEnableAnimation(isChecked);
        await saveSetting("enableAnimation", isChecked);
    });
}

if (settingSwitches.enablePopupFinder) {
    settingSwitches.enablePopupFinder.addEventListener("change", (e) => {
        e.preventDefault();

        const targetState = e.target.checked;
        const purpose = targetState ? 'confirmEnablePopupFinder' : 'confirmDisablePopupFinder';
        setPinModalPurpose(purpose);

        const lang = languageSettings.ui;

        pinEnterModal.title.textContent = i18nData["pin.enter.confirmFeatureTitle"][lang];
        pinEnterModal.label.textContent = i18nData["pin.enter.confirmFeatureLabel"][lang];
        pinEnterModal.input.value = '';

        openModal(pinEnterModal.overlay);
        pinEnterModal.input.focus();
    });
}
if (settingSwitches.hiddenFeature) {
    settingSwitches.hiddenFeature.addEventListener('change', (e) => {
        if (e.target.checked) {
            if (!userPIN) {
                e.preventDefault();
                createPinModal.input.value = '';
                openModal(createPinModal.overlay);
                createPinModal.input.focus();
            }
        } else {
            e.preventDefault();
            setConfirmationModalPurpose('disableHiddenFeature');
            const lang = languageSettings.ui;
            confirmationModal.title.textContent = i18nData["settings.hidden.disableWarningTitle"][lang];
            confirmationModal.text.textContent = i18nData["settings.hidden.disableWarningText_extended"][lang];
            openModal(confirmationModal.overlay);
        }
    });
}

const checkForUpdateBtn = document.getElementById('check-for-update-btn');
if (checkForUpdateBtn) {
    checkForUpdateBtn.addEventListener('click', () => {
        menu.container.classList.remove("show-menu");
        checkForUpdates(true);
    });
}
if (updateModal.closeBtn) {
    updateModal.closeBtn.addEventListener("click", () => closeModal(updateModal.overlay));
}

async function updateStorageUsage() {
    const lang = languageSettings.ui;
    const calculatingText = i18nData["data.calculating"][lang] || "Menghitung...";
    const { bookmarkCacheUsageText, hiddenCacheUsageText } = dataDeletion;
    if (bookmarkCacheUsageText) bookmarkCacheUsageText.textContent = calculatingText;
    if (hiddenCacheUsageText) hiddenCacheUsageText.textContent = calculatingText;
    const [faviconCacheSize, promptCacheSize] = await Promise.all([
        calculateCacheSize('favicon-cache'),
        calculateCacheSize('prompt-blob-cache')
    ]);
    if (bookmarkCacheUsageText) {
        bookmarkCacheUsageText.textContent = formatBytes(faviconCacheSize);
    }
    if (hiddenCacheUsageText) {
        hiddenCacheUsageText.textContent = formatBytes(promptCacheSize);
    }
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.prompt-item-menu-btn') ||
        e.target.closest('.bookmark-menu-btn') ||
        e.target.closest('.bookmark-menu-btn-main') ||
        e.target.closest('.todo-menu-btn') ||
        e.target.closest('.folder-item-menu-btn') ||
        e.target.closest('.image-viewer-nav-btn')) {

        closeHeaderMenu();
    }
});

document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.prompt-item') ||
        e.target.closest('.advanced-prompt-item') ||
        e.target.closest('.bookmark-item') ||
        e.target.closest('.bookmark-item-main') ||
        e.target.closest('.todo-item') ||
        e.target.closest('.folder-item') ||
        e.target.closest('#full-image-viewer')) {

        closeHeaderMenu();
    }
});

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        const activeElement = document.activeElement;
        const isInput = ['INPUT', 'TEXTAREA'].includes(activeElement.tagName);
        const isInsideDetailModal = activeElement.closest('#advanced-prompt-viewer-modal-overlay') !== null;

        if (!isInput && !isInsideDetailModal) {
            e.preventDefault();
        }
    }
});