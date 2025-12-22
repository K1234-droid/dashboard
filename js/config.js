/*
 * ===================================================================
 * A. DEFINISI ELEMEN, STATE & KAMUS i18n
 * ===================================================================
 */

// ==================== PENGATURAN PEMBARUAN ====================
export const CURRENT_VERSION = 'v6.0.0';
export const GITHUB_OWNER = 'K1234-droid';
export const GITHUB_REPO = 'dashboard';
// ==============================================================

// Objek untuk menampung elemen-elemen UI utama.
export const elements = {
    greeting: document.getElementById("greeting"),
    greetingText: document.getElementById("greeting-text"),
    greetingUsername: document.getElementById("greeting-username"),
    date: document.getElementById("date"),
    timeContainer: document.getElementById("time-container"),
    timeMain: document.getElementById("time-main"),
    timeSeconds: document.getElementById("time-seconds"),
    description: document.getElementById("description"),
    body: document.body,
    accountMessage: document.getElementById("account-message"),
    toast: document.getElementById('toast-notification'),
    infoSeparator: document.getElementById("info-separator"),
    bookmarkSection: document.getElementById('bookmark-section'),
    bookmarkGrid: document.getElementById('bookmark-grid'),
    mainPageBookmarkContainer: document.getElementById('main-page-bookmark-container'),
    mainPageBookmarkContainer: document.getElementById('main-page-bookmark-container'),
    mainPageBookmarkControls: document.getElementById('main-page-bookmark-controls'),
    mainPageTodoContainer: document.getElementById('main-page-todo-container'),
    hiddenFeatureAccessTip: document.getElementById('hidden-feature-access-tip'),
};

// Elemen terkait status koneksi.
export const connectionStatus = {
    offlineMessage: document.getElementById("offline-message"),
    loadingMessage: document.getElementById("loading-message"),
};

// Elemen terkait menu pop-up.
export const menu = {
    container: document.getElementById("avatar-menu-container"),
    button: document.getElementById("avatar-logo-btn"),
    popup: document.getElementById("menu-popup"),
};

// Elemen terkait Modal Ubah Username.
export const usernameModal = {
    overlay: document.getElementById("username-modal-overlay"),
    openBtn: document.getElementById("open-username-modal-btn"),
    closeBtn: document.getElementById("close-username-modal-btn"),
    input: document.getElementById("username-input"),
    saveBtn: document.getElementById("save-username-btn"),
    feedbackText: document.getElementById("username-feedback"),
};

// Elemen terkait Modal Pengaturan Tema.
export const themeModal = {
    overlay: document.getElementById("theme-modal-overlay"),
    openBtn: document.getElementById("open-theme-modal-btn"),
    closeBtn: document.getElementById("close-theme-modal-btn"),
    lightBtn: document.getElementById("theme-light-btn"),
    darkBtn: document.getElementById("theme-dark-btn"),
    systemBtn: document.getElementById("theme-system-btn"),
    schemeDefaultBtn: document.getElementById("scheme-default-btn"),
    schemeMonochromeBtn: document.getElementById("scheme-monochrome-btn"),
    uploadBackgroundBtn: document.getElementById('upload-background-btn'),
    removeBackgroundBtn: document.getElementById('remove-background-btn'),
    backgroundFileInput: document.getElementById('background-file-input'),
    infoSectionThemeContainer: document.getElementById('info-section-theme-container'),
    infoSectionThemeDefaultBtn: document.getElementById('info-theme-default-btn'),
    infoSectionThemeLightBtn: document.getElementById('info-theme-light-btn'),
    infoSectionThemeDarkBtn: document.getElementById('info-theme-dark-btn'),
    footerThemeContainer: document.getElementById('footer-theme-container'),
    footerThemeDefaultBtn: document.getElementById('footer-theme-default-btn'),
    footerThemeLightBtn: document.getElementById('footer-theme-light-btn'),
    footerThemeDarkBtn: document.getElementById('footer-theme-dark-btn'),
    shadowThemeContainer: document.getElementById('shadow-theme-container'),
    shadowThemeDefaultBtn: document.getElementById('shadow-theme-default-btn'),
    shadowThemeLightBtn: document.getElementById('shadow-theme-light-btn'),
    shadowThemeDarkBtn: document.getElementById('shadow-theme-dark-btn'),
};

// Elemen terkait Modal Pengaturan Lainnya.
export const otherSettingsModal = {
    overlay: document.getElementById("other-settings-modal-overlay"),
    openBtn: document.getElementById("open-other-settings-modal-btn"),
    closeBtn: document.getElementById("close-other-settings-modal-btn"),
    generalTab: document.getElementById('settings-tab-general'),
    displayTab: document.getElementById('settings-tab-display'),
    otherTab: document.getElementById('settings-tab-other'),
    generalPanel: document.getElementById('settings-panel-general'),
    displayPanel: document.getElementById('settings-panel-display'),
    otherPanel: document.getElementById('settings-panel-other'),
    dataTab: document.getElementById('settings-tab-data'),
    dataPanel: document.getElementById('settings-panel-data'),
};

// Elemen terkait Modal Tentang.
export const aboutModal = {
    overlay: document.getElementById("about-modal-overlay"),
    openBtn: document.getElementById("open-about-modal-btn"),
    closeBtn: document.getElementById("close-about-modal-btn"),
};

// Elemen terkait Modal Bookmark.
export const bookmarkModal = {
    overlay: document.getElementById('bookmark-modal-overlay'),
    closeBtn: document.getElementById('close-bookmark-modal-btn'),
    title: document.getElementById('bookmark-modal-title'),
    nameInput: document.getElementById('bookmark-name-input'),
    urlInput: document.getElementById('bookmark-url-input'),
    saveBtn: document.getElementById('save-bookmark-btn'),
};

// Elemen terkait Modal To-do List.
export const todoModal = {
    overlay: document.getElementById('todo-modal-overlay'),
    closeBtn: document.getElementById('close-todo-modal-btn'),
    title: document.getElementById('todo-modal-title'),
    titleInput: document.getElementById('todo-title-input'),
    descriptionInput: document.getElementById('todo-description-input'),
    dateTimeInput: document.getElementById('todo-datetime-input'),
    saveBtn: document.getElementById('save-todo-btn'),
};

export const todoListModal = {
    overlay: document.getElementById('todo-list-modal-overlay'),
    closeBtn: document.getElementById('close-todo-list-modal-btn'),
    addBtn: document.getElementById('todo-add-btn-header'),
    grid: document.getElementById('todo-grid'),
    manageBtn: document.getElementById('todo-manage-btn'),
    selectCount: document.getElementById('todo-select-count'),
    selectAllBtn: document.getElementById('todo-select-all-btn'),
    deleteSelectedBtn: document.getElementById('todo-delete-selected-btn'),
    cancelManageBtn: document.getElementById('todo-cancel-manage-btn'),
    searchBtn: document.getElementById('todo-search-btn'),
    searchInput: document.getElementById('todo-search-input'),
    cancelSearchBtn: document.getElementById('todo-cancel-search-btn'),
    noResultsMessage: document.getElementById('todo-no-results'),
    actionBar: document.getElementById('todo-action-bar'),
    manageContent: document.getElementById('todo-manage-content'),
    searchContent: document.getElementById('todo-search-content'),
    content: document.querySelector('#todo-list-modal-overlay .modal-content'),
    moreBtn: document.getElementById('todo-more-btn-header'),
    headerMenu: document.getElementById('todo-header-menu'),
};

export const mainPageTodoContainer = {
    container: document.getElementById('main-page-todo-container'),
    list: null,
};

// Elemen terkait Pencarian di Footer.
export let footerSearch = {};
export function initFooterSearch() {
    footerSearch.container = document.getElementById('footer-search-container');
    footerSearch.toggleBtn = document.getElementById('footer-search-toggle-btn');
    footerSearch.input = document.getElementById('footer-search-input');
    footerSearch.resultsContainer = document.getElementById('footer-search-results');
    footerSearch.resultsList = document.querySelector('#footer-search-results .results-list');
}

// Elemen terkait Pencarian di Footer.
export let isBookmarkSearchEnabled = false;
export function setIsBookmarkSearchEnabled(value) {
    isBookmarkSearchEnabled = value;
}

// Elemen terkait Render Gambar Prompt.
export let isCharacterDataStale = true;
export function setCharacterDataStale(value) { isCharacterDataStale = value; }

export const bookmarkListModal = {
    overlay: document.getElementById('bookmark-list-modal-overlay'),
    closeBtn: document.getElementById('close-bookmark-list-modal-btn'),
    addBtn: document.getElementById('bookmark-add-btn-header'),
    grid: document.getElementById('bookmark-grid'),
    manageBtn: document.getElementById('bookmark-manage-btn'),
    selectCount: document.getElementById('bookmark-select-count'),
    selectAllBtn: document.getElementById('bookmark-select-all-btn'),
    deleteSelectedBtn: document.getElementById('bookmark-delete-selected-btn'),
    cancelManageBtn: document.getElementById('bookmark-cancel-manage-btn'),
    searchBtn: document.getElementById('bookmark-search-btn'),
    searchInput: document.getElementById('bookmark-search-input'),
    cancelSearchBtn: document.getElementById('bookmark-cancel-search-btn'),
    noResultsMessage: document.getElementById('bookmark-no-results'),
    actionBar: document.getElementById('bookmark-action-bar'),
    manageContent: document.getElementById('bookmark-manage-content'),
    searchContent: document.getElementById('bookmark-search-content'),
    content: document.querySelector('#bookmark-list-modal-overlay .modal-content'),
    moreBtn: document.getElementById('bookmark-more-btn-header'),
    headerMenu: document.getElementById('bookmark-header-menu'),
};

// Elemen terkait Modal Pembaruan.
export const updateModal = {
    overlay: document.getElementById('update-modal-overlay'),
    closeBtn: document.getElementById('close-update-modal-btn'),
    title: document.getElementById('update-modal-title'),
    versionInfo: document.getElementById('update-version-info'),
    releaseNotes: document.getElementById('update-release-notes'),
    downloadBtn: document.getElementById('update-download-btn'),
    checkBtn: document.getElementById('check-for-update-btn'),
};

export const dataManagement = {
    importUserDataBtn: document.getElementById('import-user-data-btn'),
    exportUserDataBtn: document.getElementById('export-user-data-btn'),
    importHiddenDataBtn: document.getElementById('import-hidden-data-btn'),
    exportHiddenDataBtn: document.getElementById('export-hidden-data-btn'),
};

export const confirmationBookmarkMergeModal = {
    overlay: document.getElementById('confirmation-bookmark-merge-modal-overlay'),
    closeBtn: document.getElementById('close-confirmation-bookmark-merge-modal-btn'),
    title: document.getElementById('confirmation-bookmark-merge-modal-title'),
    text: document.getElementById('confirmation-bookmark-merge-modal-text'),
    mergeBtn: document.getElementById('confirm-bookmark-merge-btn'),
    replaceBtn: document.getElementById('confirm-bookmark-replace-btn'),
};

export const confirmationMergeReplaceModal = {
    overlay: document.getElementById('confirmation-merge-replace-modal-overlay'),
    closeBtn: document.getElementById('close-confirmation-merge-replace-modal-btn'),
    title: document.getElementById('confirmation-merge-replace-modal-title'),
    text: document.getElementById('confirmation-merge-replace-modal-text'),
    mergeBtn: document.getElementById('confirm-merge-btn'),
    replaceBtn: document.getElementById('confirm-replace-btn'),
};

export const dataDeletion = {
    bookmarkCacheUsageText: document.getElementById('bookmark-cache-usage-text'),
    hiddenCacheUsageText: document.getElementById('hidden-cache-usage-text'),
    clearBookmarkCacheBtn: document.getElementById('clear-bookmark-cache-btn'),
    clearHiddenCacheBtn: document.getElementById('clear-hidden-cache-btn'),
    deleteUserDataBtn: document.getElementById('delete-user-data-btn'),
    deleteHiddenDataBtn: document.getElementById('delete-hidden-data-btn'),
    deleteTodoListDataBtn: document.getElementById('delete-todo-list-data-btn'),
};

// ==================== DEFINISI ELEMEN FITUR PIN & PROMPT ====================
export const pinSettings = {
    input: document.getElementById('pin-input'),
    feedbackText: document.getElementById('pin-feedback'),
    updateBtn: document.getElementById('update-pin-btn'),
    container: document.getElementById('pin-settings-container'),
};

export const createPinModal = {
    overlay: document.getElementById('create-pin-modal-overlay'),
    closeBtn: document.getElementById('close-create-pin-modal-btn'),
    input: document.getElementById('create-pin-input'),
    saveBtn: document.getElementById('save-initial-pin-btn'),
    feedbackText: document.getElementById('create-pin-feedback'),
};

export const pinEnterModal = {
    overlay: document.getElementById('pin-enter-modal-overlay'),
    closeBtn: document.getElementById('close-pin-enter-modal-btn'),
    input: document.getElementById('pin-enter-input'),
    submitBtn: document.getElementById('submit-pin-btn'),
    feedbackText: document.getElementById('pin-enter-feedback'),
    title: document.querySelector('#pin-enter-modal-overlay h3'),
    label: document.querySelector('#pin-enter-modal-overlay label'),
};

export const promptModal = {
    overlay: document.getElementById('prompt-modal-overlay'),
    closeBtn: document.getElementById('close-prompt-modal-btn'),
    addBtn: document.getElementById('prompt-add-btn-header'),
    grid: document.getElementById('prompt-grid'),
    content: document.querySelector('#prompt-modal-overlay .modal-content'),
    moreBtn: document.getElementById('prompt-more-btn-header'),
    headerMenu: document.getElementById('prompt-header-menu'),
    manageBtn: document.getElementById('prompt-manage-btn'),
    selectCount: document.getElementById('prompt-select-count'),
    selectAllBtn: document.getElementById('prompt-select-all-btn'),
    deleteSelectedBtn: document.getElementById('prompt-delete-selected-btn'),
    cancelManageBtn: document.getElementById('prompt-cancel-manage-btn'),
    searchBtn: document.getElementById('prompt-search-btn'),
    searchInput: document.getElementById('prompt-search-input'),
    cancelSearchBtn: document.getElementById('prompt-cancel-search-btn'),
    noResultsMessage: document.getElementById('prompt-no-results'),
    actionBar: document.getElementById('prompt-action-bar'),
    manageContent: document.getElementById('prompt-manage-content'),
    searchContent: document.getElementById('prompt-search-content'),
};

export const advancedPromptModal = {
    overlay: document.getElementById('advanced-prompt-modal-overlay'),
    closeBtn: document.getElementById('close-advanced-prompt-modal-btn'),
    addBtn: document.getElementById('advanced-prompt-add-btn-header'),
    grid: document.getElementById('advanced-prompt-grid'),
    content: document.querySelector('#advanced-prompt-modal-overlay .modal-content'),
    moreBtn: document.getElementById('advanced-prompt-more-btn-header'),
    headerMenu: document.getElementById('advanced-prompt-header-menu'),
    mainArea: document.querySelector('#advanced-prompt-modal-overlay .advanced-prompt-main-area'),
    manageBtn: document.getElementById('advanced-prompt-manage-btn'),
    selectCount: document.getElementById('advanced-prompt-select-count'),
    selectAllBtn: document.getElementById('advanced-prompt-select-all-btn'),
    deleteSelectedBtn: document.getElementById('advanced-prompt-delete-selected-btn'),
    moveSelectedBtn: document.getElementById('advanced-prompt-move-selected-btn'),
    cancelManageBtn: document.getElementById('advanced-prompt-cancel-manage-btn'),
    searchBtn: document.getElementById('advanced-prompt-search-btn'),
    searchInput: document.getElementById('advanced-prompt-search-input'),
    cancelSearchBtn: document.getElementById('advanced-prompt-cancel-search-btn'),
    noResultsMessage: document.getElementById('advanced-prompt-no-results'),
    actionBar: document.getElementById('advanced-prompt-action-bar'),
    manageContent: document.getElementById('advanced-prompt-manage-content'),
    searchContent: document.getElementById('advanced-prompt-search-content'),
};

export const promptFolderModal = {
    overlay: document.getElementById('prompt-folder-modal-overlay'),
    closeBtn: document.getElementById('close-prompt-folder-modal-btn'),
    grid: document.getElementById('prompt-folder-grid'),
    addBtn: document.getElementById('folder-add-btn-header'),
    noResultsMessage: document.getElementById('prompt-folder-no-results'),
    manageBtn: document.getElementById('folder-manage-btn'),
    selectCount: document.getElementById('folder-select-count'),
    selectAllBtn: document.getElementById('folder-select-all-btn'),
    deleteSelectedBtn: document.getElementById('folder-delete-selected-btn'),
    cancelManageBtn: document.getElementById('folder-cancel-manage-btn'),
    searchBtn: document.getElementById('folder-search-btn'),
    searchInput: document.getElementById('folder-search-input'),
    cancelSearchBtn: document.getElementById('folder-cancel-search-btn'),
    actionBar: document.getElementById('folder-action-bar'),
    manageContent: document.getElementById('folder-manage-content'),
    searchContent: document.getElementById('folder-search-content'),
    content: document.querySelector('#prompt-folder-modal-overlay .modal-content'),
    moreBtn: document.getElementById('folder-more-btn-header'),
    headerMenu: document.getElementById('folder-header-menu'),
};

export const addEditFolderModal = {
    overlay: document.getElementById('add-edit-folder-modal-overlay'),
    closeBtn: document.getElementById('close-add-edit-folder-modal-btn'),
    title: document.getElementById('add-edit-folder-title'),
    input: document.getElementById('folder-name-input'),
    saveBtn: document.getElementById('save-folder-btn'),
};

export const promptViewerModal = {
    overlay: document.getElementById('prompt-viewer-modal-overlay'),
    closeBtn: document.getElementById('close-prompt-viewer-modal-btn'),
    text: document.getElementById('prompt-viewer-text'),
    copyBtn: document.getElementById('copy-prompt-btn'),
    deleteBtn: document.getElementById('delete-prompt-btn'),
    editBtn: document.getElementById('edit-prompt-btn'),
};

export const advancedPromptViewerModal = {
    overlay: document.getElementById('advanced-prompt-viewer-modal-overlay'),
    closeBtn: document.getElementById('close-advanced-prompt-viewer-modal-btn'),
    body: document.getElementById('advanced-prompt-viewer-body'),
    copyBtn: document.getElementById('copy-advanced-prompt-btn'),
    deleteBtn: document.getElementById('delete-advanced-prompt-btn'),
    editBtn: document.getElementById('edit-advanced-prompt-btn'),
};

export const addEditPromptModal = {
    overlay: document.getElementById('add-edit-prompt-modal-overlay'),
    closeBtn: document.getElementById('close-add-edit-prompt-modal-btn'),
    title: document.getElementById('add-edit-prompt-title'),
    imageFileInput: document.getElementById('prompt-image-file-input'),
    previewsContainer: document.getElementById('prompt-image-previews-container'),
    imagePreviewOld: document.getElementById('prompt-image-preview-old'),
    imagePreviewNew: document.getElementById('prompt-image-preview-new'),
    imagePreviewSingle: document.getElementById('prompt-image-preview-single'),
    textInput: document.getElementById('prompt-text-input'),
    saveBtn: document.getElementById('save-prompt-btn'),
    imageHelpText: document.getElementById('prompt-image-help-text'),
};

export const addEditAdvancedPromptModal = {
    overlay: document.getElementById('add-edit-advanced-prompt-modal-overlay'),
    closeBtn: document.getElementById('close-add-edit-advanced-prompt-modal-btn'),
    title: document.getElementById('add-edit-advanced-prompt-title'),
    titleInput: document.getElementById('advanced-prompt-title-input'),
    textInput: document.getElementById('advanced-prompt-text-input'),
    characterGrid: document.getElementById('advanced-prompt-character-selection-grid'),
    addCommaSwitch: document.getElementById('add-comma-switch'),
    addCommaSwitchContainer: document.getElementById('add-comma-switch-container'),
    saveBtn: document.getElementById('save-advanced-prompt-btn'),
    searchInput: document.getElementById('character-search-input'),
    folderSelectContainer: document.getElementById('prompt-folder-select-container'),
    folderSelect: document.getElementById('prompt-folder-select'),
    folderSelectOptions: document.getElementById('prompt-folder-select-options'),
};

export const confirmationModal = {
    overlay: document.getElementById('confirmation-modal-overlay'),
    closeBtn: document.getElementById('close-confirmation-modal-btn'),
    title: document.getElementById('confirmation-modal-title'),
    text: document.getElementById('confirmation-modal-text'),
    cancelBtn: document.getElementById('cancel-confirmation-btn'),
    confirmBtn: document.getElementById('confirm-confirmation-btn'),
};

export const infoModal = {
    overlay: document.getElementById('info-modal-overlay'),
    title: document.getElementById('info-modal-title'),
    text: document.getElementById('info-modal-text'),
    closeBtn: document.getElementById('close-info-modal-btn'),
};

export const howItWorksModal = {
    overlay: document.getElementById('how-it-works-modal-overlay'),
    openBtn: document.getElementById('how-it-works-btn'),
    closeBtn: document.getElementById('close-how-it-works-modal-btn'),
};

export const imageViewerModal = {
    overlay: document.getElementById('image-viewer-modal-overlay'),
    closeBtn: document.getElementById('close-image-viewer-modal-btn'),
    image: document.getElementById('full-image-viewer'),
    prevBtn: document.getElementById('prev-image-btn'),
    nextBtn: document.getElementById('next-image-btn'),
    controls: document.getElementById('image-viewer-controls'),
};

export const moveFolderModal = {
    overlay: document.getElementById('move-folder-modal-overlay'),
    closeBtn: document.getElementById('close-move-folder-modal-btn'),
    title: document.getElementById('move-folder-modal-title'),
    folderSelect: document.getElementById('move-prompt-folder-select'),
    folderSelectOptions: document.getElementById('move-prompt-folder-select-options'),
    addFolderBtn: document.getElementById('add-folder-from-move-btn'),
    saveBtn: document.getElementById('move-prompt-save-btn'),
};
// ===================================================================================

// Elemen-elemen untuk switch pengaturan.
export const settingSwitches = {
    enableAnimation: document.getElementById("enable-animation-switch"),
    showContent: document.getElementById('show-content-switch'),
    showGreeting: document.getElementById('show-greeting-switch'),
    showUsername: document.getElementById('show-username-switch'),
    showDescription: document.getElementById('show-description-switch'),
    showDate: document.getElementById('show-date-switch'),
    showTime: document.getElementById('show-time-switch'),
    showSeconds: document.getElementById("show-seconds-switch"),
    showBookmark: document.getElementById("show-bookmark-switch"),
    showTodoList: document.getElementById("show-todo-list-switch"),
    enableSearchBar: document.getElementById("enable-search-bar-switch"),
    bookmarkBlur: document.getElementById("blur-bookmark-switch"),
    menuBlur: document.getElementById("blur-menu-switch"),
    footerBlur: document.getElementById("blur-footer-switch"),
    applyToAll: document.getElementById("apply-to-all-switch"),
    hiddenFeature: document.getElementById('hidden-feature-switch'),
    enablePopupFinder: document.getElementById('enable-popup-finder-switch'),
    enableHistorySearch: document.getElementById('enable-history-search-switch'),
    enableBookmarkSearch: document.getElementById("enable-bookmark-search-switch"),
    enableBookmarkPopupFinder: document.getElementById('enable-bookmark-popup-finder-switch'),
    enablePromptSearch: document.getElementById('enable-prompt-search-switch'),
    enableShortcutCtrlD: document.getElementById("enable-shortcut-ctrl-d-switch"),
};

export const loadingModal = {
    overlay: document.getElementById('loading-modal-overlay'),
    title: document.getElementById('loading-modal-title'),
    text: document.getElementById('loading-modal-text'),
};

export const progressModal = {
    overlay: document.getElementById('progress-modal-overlay'),
    title: document.getElementById('progress-modal-title'),
    text: document.getElementById('progress-modal-text'),
    bar: document.getElementById('progress-bar'),
    percentage: document.getElementById('progress-percentage'),
};

// --- State & Data ---
export let currentUser = "K1234";
export let userPIN = null;
export let prompts = [];
export let advancedPrompts = [];
export let promptFolders = [];
export let currentPromptFolderId = 'all';
export let bookmarks = [];
export let todoList = [];
export let currentPromptId = null;
export let currentImageViewerId = null;
export let imageViewerSource = 'grid';
export let currentAdvancedPromptId = null;
export let currentEditFolderId = null;
export let activePromptMenu = null;
export let activeBookmarkMenu = null;
export let activeTodoMenu = null;
export let isBookmarkManageModeActive = false;
export let isBookmarkSearchModeActive = false;
export let selectedBookmarkIds = [];
export let isTodoManageModeActive = false;
export let isDraggingTodo = false;
export let isTodoSearchModeActive = false;
export let selectedTodoIds = [];
export let bookmarkSortableInstance = null;
export let todoSortableInstance = null;
export let activeModalStack = [];
export let pinModalPurpose = 'login';
export let tempNewPIN = null;
export let confirmationModalPurpose = 'deletePrompt';
export let tempImportData = null;
export let tempUserImportData = null;
export let toastTimeout;
export let isManageModeActive = false;
export let isSearchModeActive = false;
export let selectedPromptIds = [];
export let isAdvancedManageModeActive = false;
export let isAdvancedSearchModeActive = false;
export let selectedAdvancedPromptIds = [];
export let isFolderManageModeActive = false;
export let isFolderSearchModeActive = false;
export let selectedFolderIds = [];
export let folderSortableInstance = null;
export let sortableInstance = null;
export let advancedSortableInstance = null;
export let isBlockingModalActive = false;
export let isDataOperationInProgress = false;
export let bookmarkOpenAction = 'newTab';
export let searchEngine = 'google';
export let searchOpenAction = 'newTab';
export let isPromptSearchEnabled = false;
export let isAdvancedGridStale = true;
export let isShortcutCtrlDEnabled = true;
export let isPromptGridStale = true;
export let colorScheme = 'default';
export let selectedMoveFolderId = 'all';
export let promptsToMove = [];

export let customThemeOverrides = {
    infoSection: 'default',
    footer: 'default',
    shadow: 'default',
};

export let activeHeaderMenu = null;
export function setActiveHeaderMenu(value) { activeHeaderMenu = value; }

export let currentImageNavList = [];
export let uiHideTimeout = null;
export function setUiHideTimeout(value) { uiHideTimeout = value; }
export function setCurrentImageNavList(value) { currentImageNavList = value; }
export function setIsPromptSearchEnabled(value) { isPromptSearchEnabled = value; }
export function setIsPromptGridStale(value) { isPromptGridStale = value; }
export function setIsDraggingTodo(value) { isDraggingTodo = value; }
export function setSelectedMoveFolderId(value) { selectedMoveFolderId = value; }
export function setPromptsToMove(value) { promptsToMove = value; }

export let cachedIconDataUrls = {};
export function setCachedIconDataUrls(value) { cachedIconDataUrls = value; }
export let cachedThumbnailDataUrls = {};
export function setCachedThumbnailDataUrls(value) { cachedThumbnailDataUrls = value; }

export let languageSettings = {
    ui: 'id',
    greeting: 'id',
    description: 'id',
    date: 'id',
    applyToAll: true,
};

export let animationFrameId = null;
export let lastUpdatedHour = new Date().getHours();
export let feedbackTimeout;
export let lastActiveModalOverlay = null;

// --- Setters for state variables ---
export function setBookmarks(value) { bookmarks = value; }
export function setTodoList(value) { todoList = value; }
export function setCurrentUser(value) { currentUser = value; }
export function setUserPIN(value) { userPIN = value; }
export function setPrompts(value) { prompts = value; }
export function setAdvancedPrompts(value) { advancedPrompts = value; }
export function setPromptFolders(value) { promptFolders = value; }
export function setCurrentPromptFolderId(value) { currentPromptFolderId = value; }
export function setCurrentPromptId(value) { currentPromptId = value; }
export function setCurrentImageViewerId(value) { currentImageViewerId = value; }
export function setImageViewerSource(value) { imageViewerSource = value; }
export function setCurrentAdvancedPromptId(value) { currentAdvancedPromptId = value; }
export function setCurrentEditFolderId(value) { currentEditFolderId = value; }
export function setActivePromptMenu(value) { activePromptMenu = value; }
export function setActiveBookmarkMenu(value) { activeBookmarkMenu = value; }
export function setActiveTodoMenu(value) { activeTodoMenu = value; }
export function setIsBookmarkManageModeActive(value) { isBookmarkManageModeActive = value; }
export function setIsBookmarkSearchModeActive(value) { isBookmarkSearchModeActive = value; }
export function setSelectedBookmarkIds(value) { selectedBookmarkIds = value; }
export function setIsTodoManageModeActive(value) { isTodoManageModeActive = value; }
export function setIsTodoSearchModeActive(value) { isTodoSearchModeActive = value; }
export function setSelectedTodoIds(value) { selectedTodoIds = value; }
export function setBookmarkSortableInstance(value) { bookmarkSortableInstance = value; }
export function setTodoSortableInstance(value) { todoSortableInstance = value; }
export function setActiveModalStack(value) { activeModalStack = value; }
export function setPinModalPurpose(value) { pinModalPurpose = value; }
export function setTempNewPIN(value) { tempNewPIN = value; }
export function setConfirmationModalPurpose(value) { confirmationModalPurpose = value; }
export function setTempImportData(value) { tempImportData = value; }
export function setTempUserImportData(value) { tempUserImportData = value; }
export function setToastTimeout(value) { toastTimeout = value; }
export function setIsManageModeActive(value) { isManageModeActive = value; }
export function setIsSearchModeActive(value) { isSearchModeActive = value; }
export function setSelectedPromptIds(value) { selectedPromptIds = value; }
export function setIsAdvancedManageModeActive(value) { isAdvancedManageModeActive = value; }
export function setIsAdvancedSearchModeActive(value) { isAdvancedSearchModeActive = value; }
export function setSelectedAdvancedPromptIds(value) { selectedAdvancedPromptIds = value; }
export function setIsFolderManageModeActive(value) { isFolderManageModeActive = value; }
export function setIsFolderSearchModeActive(value) { isFolderSearchModeActive = value; }
export function setSelectedFolderIds(value) { selectedFolderIds = value; }
export function setFolderSortableInstance(value) { folderSortableInstance = value; }
export function setSortableInstance(value) { sortableInstance = value; }
export function setAdvancedSortableInstance(value) { advancedSortableInstance = value; }
export function setIsBlockingModalActive(value) { isBlockingModalActive = value; }
export function setBookmarkOpenAction(value) { bookmarkOpenAction = value; }
export function setSearchEngine(value) { searchEngine = value; }
export function setSearchOpenAction(value) { searchOpenAction = value; }
export function setIsAdvancedGridStale(value) { isAdvancedGridStale = value; }
export function setIsDataOperationInProgress(value) { isDataOperationInProgress = value; }
export function setLanguageSettings(value) { languageSettings = value; }
export function setAnimationFrameId(value) { animationFrameId = value; }
export function setLastUpdatedHour(value) { lastUpdatedHour = value; }
export function setFeedbackTimeout(value) { feedbackTimeout = value; }
export function setLastActiveModalOverlay(value) { lastActiveModalOverlay = value; }
export function setIsShortcutCtrlDEnabled(value) { isShortcutCtrlDEnabled = value; }
export function setColorScheme(value) { colorScheme = value; }
export function setCustomThemeOverrides(value) { customThemeOverrides = value; }

export const supportedLangs = ['id', 'en', 'ja'];
export const localeMap = { id: 'id-ID', en: 'en-US', ja: 'ja-JP' };

export const i18nData = {
    "greeting.morning": { id: "Selamat Pagi!", en: "Good Morning!", ja: "おはようございます!" },
    "greeting.afternoon": { id: "Selamat Siang!", en: "Good Afternoon!", ja: "こんにちは!" },
    "greeting.evening": { id: "Selamat Sore!", en: "Good Evening!", ja: "こんばんは!" },
    "greeting.night": { id: "Selamat Malam!", en: "Good Night!", ja: "おやすみなさい!" },
    "description.day": { id: "Teruslah menjelajahi untuk menemukan hal-hal baru dimasa depan. Tetap semangat.", en: "Keep exploring to find new things in the future. Stay spirited.", ja: "未来に新しいものを見つけるために探検を続けてください。元気でね。" },
    "description.night": { id: "Jangan lupa istirahat karena sudah malam :)", en: "It's late, don't forget to rest :)", ja: "夜遅いですので、休むことを忘れないでください :)" },
    "page.title": { id: "Tab Baru", en: "New Tab", ja: "新しいタブ" },
    "footer.account": { id: "Anda terhubung ke internet", en: "You are connected to the internet", ja: "インターネットに接続されています" },
    "footer.offline": { id: "Anda sedang offline", en: "You are offline", ja: "オフラインです" },
    "footer.checking": { id: "Memeriksa koneksi", en: "Checking connection", ja: "接続を確認しています" },
    "footer.search.placeholder": { id: "Cari sesuatu", en: "Search for something", ja: "何かを検索" },
    "footer.search.text": { id: "Cari sesuatu...", en: "Search for something...", ja: "何かを検索..." },
    "footer.search.shortcut": { id: "Enter", en: "Enter", ja: "エンター" },
    "popup.search.web": { id: "Telusuri {engine} untuk \"{query}\"", en: "Search {engine} for \"{query}\"", ja: "{engine}で「{query}」を検索" },
    "popup.search.url": { id: "Kunjungi alamat \"{url}\"", en: "Go to address \"{url}\"", ja: "アドレス「{url}」に移動" },
    "footer.tooltip.settings": { id: "Sesuaikan Dashboard", en: "Customize Dashboard", ja: "ダッシュボードをカスタマイズ" },
    "animation.enableRequired": { id: "Anda harus mengaktifkan animasi terlebih dahulu.", en: "You must enable animation first.", ja: "まずアニメーションを有効にしてください。" },
    "menu.changeUsername": { id: "Ubah Username", en: "Change Username", ja: "ユーザー名を変更" },
    "menu.adjustTheme": { id: "Sesuaikan Tema", en: "Adjust Theme", ja: "テーマを調整" },
    "menu.otherSettings": { id: "Pengaturan", en: "Settings", ja: "設定" },
    "menu.about": { id: "Tentang", en: "About", ja: "について" },
    "settings.username.title": { id: "Ubah Username", en: "Change Username", ja: "ユーザー名を変更" },
    "settings.username.label": { id: "Username (Maks. 6 karakter)", en: "Username (Max. 6 characters)", ja: "ユーザー名（最大6文字）" },
    "settings.username.save": { id: "Simpan", en: "Save", ja: "保存" },
    "settings.username.feedback.saved": { id: "Username berhasil disimpan!", en: "Username saved successfully!", ja: "ユーザー名を保存しました！" },
    "settings.username.feedback.error": { id: "Username harus 1-6 karakter.", en: "Username must be 1-6 characters.", ja: "ユーザー名は1～6文字にしてください。" },
    "settings.theme.title": { id: "Pilih Tampilan", en: "Choose Appearance", ja: "テーマを選択" },
    "settings.theme.options.title": { id: "Tema", en: "Theme", ja: "テーマ" },
    "settings.theme.light": { id: "Terang", en: "Light", ja: "ライト" },
    "settings.theme.dark": { id: "Gelap", en: "Dark", ja: "ダーク" },
    "settings.theme.system": { id: "Sistem", en: "System", ja: "システム" },
    "settings.theme.scheme.title": { id: "Skema Warna", en: "Color Scheme", ja: "カラースキーム" },
    "settings.theme.scheme.default": { id: "Bawaan", en: "Default", ja: "デフォルト" },
    "settings.theme.scheme.monochrome": { id: "Monokrom", en: "Monochrome", ja: "モノクロ" },
    "settings.upload.background.title": { id: "Background Gambar", en: "Background Image", ja: "背景画像" },
    "settings.upload.background": { id: "Upload Gambar", en: "Upload Image", ja: "画像をアップロード" },
    "settings.theme.infoSection.title": { id: "Bagian Info", en: "Info Section", ja: "情報セクション" },
    "settings.theme.footer.title": { id: "Bookmark, Footer, dan Daftar Tugas", en: "Bookmark, Footer, and To-do List", ja: "ブックマーク、フッター、タスク一覧" },
    "settings.theme.shadow.title": { id: "Bayangan", en: "Shadow", ja: "影" },
    "settings.theme.override.default": { id: "Bawaan", en: "Default", ja: "デフォルト" },
    "settings.theme.override.light": { id: "Terang", en: "Light", ja: "ライト" },
    "settings.theme.override.dark": { id: "Gelap", en: "Dark", ja: "ダーク" },
    "settings.language.title": { id: "Pilihan Bahasa", en: "Language Options", ja: "言語オプション" },
    "settings.language.allContent": { id: "Semua Konten Tampilan", en: "All Display Content", ja: "すべての表示内容" },
    "settings.language.applyAll": { id: "Terapkan ke Semua Konten", en: "Apply to All Content", ja: "すべてに適用" },
    "settings.language.greeting": { id: "Ucapan Salam", en: "Greeting", ja: "挨拶" },
    "settings.other.showUsername": { id: "Username", en: "Username", ja: "ユーザー名" },
    "settings.language.description": { id: "Deskripsi", en: "Description", ja: "説明" },
    "settings.language.date": { id: "Hari dan Tanggal", en: "Day and Date", ja: "曜日と日付" },
    "settings.other.clock": { id: "Jam", en: "Clock", ja: "時間" },
    "data.displayHiddenResolution": { id: "Beberapa tampilan tidak dapat muncul di halaman utama karena keterbatasan resolusi.", en: "Some views cannot appear on the main page due to resolution limitations.", ja: "解像度の制限により、一部のビューはメイン ページに表示できません。" },
    "settings.other.mainPage": { id: "Halaman Utama", en: "Main Page", ja: "メインページ" },
    "settings.other.showContent": { id: "Tampilkan Konten", en: "Show Content", ja: "コンテンツを表示" },
    "settings.other.showTime": { id: "Jam", en: "Clock", ja: "クロック" },
    "settings.other.showSeconds": { id: "Detik", en: "Seconds", ja: "秒" },
    "settings.other.showBookmark": { id: "Tampilkan Bookmark", en: "Show Bookmark", ja: "ブックマークを表示" },
    "settings.other.showTodoList": { id: "Tampilkan Daftar Tugas", en: "Show To-do List", ja: "タスクリストを表示" },
    "settings.other.search": { id: "Pencarian", en: "Search", ja: "検索" },
    "settings.other.enableSearchBar": { id: "Aktifkan Bar Pencarian", en: "Enable Search Bar", ja: "検索バーを有効にする" },
    "settings.other.searchEngine": { id: "Mesin Telusur", en: "Search Engine", ja: "検索エンジン" },
    "settings.other.visual": { id: "Visual", en: "Visuals", ja: "ビジュアル" },
    "settings.other.enableAnimation": { id: "Aktifkan Animasi", en: "Enable Animation", ja: "アニメーションを有効にする" },
    "settings.other.blurBookmark": { id: "Efek Blur Bookmark dan Daftar Tugas", en: "Bookmark and To-do List Blur Effect", ja: "ブックマークとタスク一覧のぼかし効果" },
    "settings.other.blurMenu": { id: "Efek Blur Background Menu", en: "Menu Background Blur Effect", ja: "メニュー背景ぼかし効果" },
    "settings.other.blurFooter": { id: "Efek Blur Footer", en: "Footer Blur Effect", ja: "フッターのぼかし効果" },
    "searchEngine.google": { id: "Google", en: "Google", ja: "Google" },
    "searchEngine.yahoo": { id: "Yahoo!", en: "Yahoo!", ja: "Yahoo!" },
    "searchEngine.bing": { id: "Microsoft Bing", en: "Microsoft Bing", ja: "Microsoft Bing" },
    "searchEngine.duckduckgo": { id: "DuckDuckGo", en: "DuckDuckGo", ja: "DuckDuckGo" },
    "about.p1": { id: "Halaman ini bertujuan untuk menggantikan halaman beranda yang ada pada browser. Terima kasih telah menggunakan.", en: "This page is intended to replace the default browser homepage. Thank you for using it.", ja: "このページは、ブラウザのホームページを置き換えることを目的としています。ご利用いただきありがとうございます。" },
    "about.p2": { id: "Untuk info selengkapnya, silahkan kunjungi halaman readme.", en: "For more information, please visit the readme page.", ja: "詳細については、readme ページをご覧ください。" },
    "about.notesTitle": { id: "Catatan", en: "Notes", ja: "注意" },
    "about.n1": { id: "Penerapan fitur tema terang dan gelap hanya berlaku untuk halaman dashboard ini.", en: "The light and dark theme features only apply to this dashboard page.", ja: "ライトおよびダークテーマ機能は、このダッシュボードページにのみ適用されます。" },
    "about.creditTitle": { id: "Kredit", en: "Credits", ja: "クレジット" },
    "about.c1": { id: "Font:", en: "Font:", ja: "フォント：" },
    "about.d1": { id: "Poppins - Indian Type Foundry, Jonny Pinhorn, dan Ninad Kale", en: "Poppins - Indian Type Foundry, Jonny Pinhorn, and Ninad Kale", ja: "Poppins（Indian Type Foundry、Jonny Pinhorn、Ninad Kale）" },
    "about.c2": { id: "Font untuk bahasa Jepang:", en: "Japanese font:", ja: "日本語フォント：" },
    "about.d2": { id: "Noto Sans Japanese - Adobe", en: "Noto Sans Japanese - Adobe", ja: "Noto Sans Japanese（Adobe）" },
    "about.c3": { id: "Perpustakaan pihak ketiga:", en: "Third-party libraries:", ja: "サードパーティ ライブラリ：" },
    "about.d3": { id: "sortable.js - Untuk fungsionalitas drag-and-drop.", en: "sortable.js - For drag-and-drop functionality.", ja: "sortable.js - ドラッグアンドドロップ機能のため。" },
    "about.d4": { id: "zip.js - Untuk fungsionalitas impor dan ekspor data.", en: "zip.js - For data import and export functionality.", ja: "zip.js - データインポート/エクスポート機能のため。" },
    "about.versionTitle": { id: "Versi Website", en: "Website Version", ja: "ウェブ版" },
    "about.readmeButton": { id: "Lihat readme", en: "View readme", ja: "readme を表示" },
    "settings.security.changePinLabel": { id: "Ubah PIN Keamanan (4 digit)", en: "Change Security PIN (4 digits)", ja: "セキュリティPINの変更（4桁）" },
    "pin.enter.title": { id: "Masukkan PIN", en: "Enter PIN", ja: "PINを入力" },
    "pin.enter.label": { id: "PIN 4 Digit", en: "4-Digit PIN", ja: "4桁のPIN" },
    "pin.enter.submit": { id: "Masuk", en: "Enter", ja: "入力" },
    "prompt.delete.inUseError": { id: "Gambar ini tidak dapat dihapus karena digunakan di dalam Catatan. Mohon hapus dari Catatan terlebih dahulu.", en: "This image cannot be deleted because it is used in a Note. Please remove it from the Note first.", ja: "この画像はノートで使用されているため削除できません。まずノートから削除してください。" },
    "prompt.delete.cancel": { id: "Batal", en: "Cancel", ja: "キャンセル" },
    "prompt.delete.confirm": { id: "Ya, Hapus", en: "Yes, Delete", ja: "はい、削除します" },
    "delete.confirm.title": { id: "Konfirmasi Hapus", en: "Confirm Deletion", ja: "削除の確認" },
    "delete.confirm.text": { id: "Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat diurungkan.", en: "Are you sure you want to delete this item? This action cannot be undone.", ja: "この項目を削除してもよろしいですか？この操作は元に戻せません。" },
    "delete.confirm.selectedText": { id: "Apakah Anda yakin ingin menghapus {count} item yang dipilih? Tindakan ini tidak dapat diurungkan.", en: "Are you sure you want to delete the {count} selected items? This action cannot be undone.", ja: "選択した{count}個の項目を削除してもよろしいですか？この操作は元に戻せません。" },
    "settings.pin.feedback.saved": { id: "PIN berhasil disimpan!", en: "PIN saved successfully!", ja: "PINを保存しました！" },
    "settings.pin.feedback.removed": { id: "PIN berhasil dihapus.", en: "PIN removed successfully.", ja: "PINを削除しました。" },
    "settings.pin.feedback.error": { id: "PIN harus 4 digit angka.", en: "PIN must be 4 digits.", ja: "PINは4桁の数字にしてください。" },
    "settings.pin.feedback.wrong": { id: "PIN salah. Coba lagi.", en: "Incorrect PIN. Try again.", ja: "PINが間違っています。もう一度お試しください。" },
    "pin.feedback.used": { id: "PIN sudah digunakan. Silakan pilih PIN lain.", en: "PIN is already in use. Please choose another PIN.", ja: "このPINは既に使用されています。別のPINを選択してください。" },
    "prompt.copy.success": { id: "Teks berhasil disalin!", en: "Text copied successfully!", ja: "テキストをコピーしました！" },
    "prompt.copy.noChar": { id: "Tidak ada deskripsi gambar untuk disalin.", en: "No image description to copy.", ja: "コピーする画像の説明がありません。" },
    "prompt.save.success": { id: "Data berhasil disimpan!", en: "Data saved successfully!", ja: "データが正常に保存されました！" },
    "prompt.edit.success": { id: "Data berhasil diperbarui!", en: "Data successfully updated!", ja: "データが正常に更新されました！" },
    "prompt.delete.success": { id: "Data berhasil dihapus!", en: "Data deleted successfully!", ja: "データが正常に削除されました！" },
    "prompt.listTitle": { id: "Galeri Gambar", en: "Image Gallery", ja: "画像ギャラリー" },
    "advanced.prompt.listTitle": { id: "Daftar Catatan", en: "Notes List", ja: "ノートリスト" },
    "prompt.detailTitle": { id: "Detail Gambar", en: "Image Details", ja: "画像の詳細" },
    "advanced.prompt.detailTitle": { id: "Detail Catatan", en: "Note Details", ja: "ノートの詳細" },
    "prompt.addTitle": { id: "Tambah Gambar Baru", en: "Add New Image", ja: "新しい画像を追加" },
    "advanced.prompt.addTitle": { id: "Tambah Catatan Baru", en: "Add New Note", ja: "新しいノートを追加" },
    "prompt.editTitle": { id: "Edit Gambar", en: "Edit Image", ja: "画像を編集" },
    "advanced.prompt.editTitle": { id: "Edit Catatan", en: "Edit Note", ja: "ノートを編集" },
    "prompt.saveChanges": { id: "Simpan Perubahan", en: "Save Changes", ja: "変更を保存" },
    "prompt.saving": { id: "Menyimpan...", en: "Saving...", ja: "保存中..." },
    "prompt.edit.imageLabel": { id: "Pilih File Gambar dari perangkat", en: "Select Image File from device", ja: "デバイスから画像ファイルを選択" },
    "prompt.edit.imageHelp": { id: "Kosongkan jika tidak ingin mengubah gambar.", en: "Leave empty if you don't want to change the image.", ja: "画像を変更しない場合は空のままにしてください。" },
    "prompt.edit.textLabel": { id: "Deskripsi Gambar", en: "Image Description", ja: "画像の説明" },
    "advanced.prompt.textLabel": { id: "Isi Catatan", en: "Note Content", ja: "ノートの内容" },
    "advanced.prompt.characterLabel": { id: "Pilih Gambar", en: "Select Image", ja: "画像を選択" },
    "advanced.prompt.addComma": { id: "Tambahkan Koma", en: "Add Commas", ja: "コンマを追加" },
    "prompt.menu.copy": { id: "Salin Teks", en: "Copy Text", ja: "テキストをコピー" },
    "prompt.image.copy": { id: "Salin Deskripsi", en: "Copy Description", ja: "説明をコピー" },
    "prompt.menu.saveImage": { id: "Simpan Gambar", en: "Save Image", ja: "画像を保存" },
    "prompt.menu.copyChar": { id: "Salin Deskripsi Gambar", en: "Copy Image Description", ja: "画像の説明をコピー" },
    "prompt.menu.edit": { id: "Edit", en: "Edit", ja: "編集" },
    "prompt.menu.delete": { id: "Hapus", en: "Delete", ja: "削除" },
    "prompt.manage": { id: "Kelola", en: "Manage", ja: "管理" },
    "prompt.search": { id: "Cari", en: "Search", ja: "検索" },
    "prompt.search.placeholder": { id: "Ketik untuk mencari...", en: "Type to search...", ja: "検索するには入力..." },
    "prompt.search.noResults": { id: "Tidak ditemukan hasil", en: "No results found", ja: "結果が見つかりません" },
    "prompt.selectCount": { id: "Pilih ({count})", en: "Select ({count})", ja: "選択 ({count})" },
    "prompt.selectAll": { id: "Pilih Semua", en: "Select All", ja: "すべて選択" },
    "prompt.deselectAll": { id: "Batal Pilih Semua", en: "Deselect All", ja: "選択をすべて解除" },
    "info.success.title": { id: "Berhasil", en: "Success", ja: "成功" },
    "info.attention.title": { id: "Perhatian", en: "Attention", ja: "注意" },
    "prompt.add.fieldsRequired": { id: "Gambar dan deskripsi tidak boleh kosong.", en: "Image and description cannot be empty.", ja: "画像と説明は空にできません。" },
    "advanced.prompt.add.fieldsRequired": { id: "Isi catatan tidak boleh kosong.", en: "Note content cannot be empty.", ja: "ノートの内容は空にできません。" },
    "prompt.edit.textRequired": { id: "Deskripsi/Isi tidak boleh kosong.", en: "Description/Content cannot be empty.", ja: "説明/内容は空にできません。" },
    "prompt.save.fileError": { id: "Terjadi kesalahan saat memproses file.", en: "An error occurred while processing the file.", ja: "ファイルの処理中にエラーが発生しました。" },
    "advanced.prompt.label.title": { id: "Judul Catatan (Opsional)", en: "Note Title (Optional)", ja: "ノートのタイトル（任意）" },
    "prompt.save.storageError": { id: "Gagal menyimpan. Penyimpanan browser penuh. Coba gunakan gambar yang lebih kecil atau hapus prompt lama.", en: "Save failed. Browser storage is full. Try using smaller images or deleting old prompts.", ja: "保存に失敗しました。ブラウザのストレージがいっぱいです。小さい画像を使用するか、古いプロンプトを削除してください。" },
    "settings.hidden.title": { id: "Catatan", en: "Notes", ja: "ノート" },
    "settings.hidden.enable": { id: "Aktifkan Catatan", en: "Enable Notes", ja: "メモを有効にする" },
    "settings.hidden.updatePin": { id: "Perbarui PIN", en: "Update PIN", ja: "PINを更新" },
    "settings.hidden.createPin": { id: "Buat PIN", en: "Create PIN", ja: "PINを作成" },
    "hiddenFeature.howItWorks.title": { id: "Cara Kerja Catatan", en: "How Notes Work", ja: "ノートの仕組み" },
    "hiddenFeature.howItWorks.button": { id: "Cara Kerja", en: "How it Works", ja: "仕組み" },
    "hiddenFeature.howItWorks.p1": { id: "Klik dua kali pada ikon garis tiga pojok kanan bawah atau gunakan pintasan keyboard Ctrl + Shift + H di Windows atau CMD + Shift + H di macOS.", en: "Double-click on the three-line icon in the bottom right corner or use the keyboard shortcut Ctrl + Shift + H on Windows or CMD + Shift + H on macOS.", ja: "右下隅にある 3 本の線のアイコンをダブルクリックするか、Windows ではキーボード ショートカット Ctrl + Shift + H、macOS では CMD + Shift + H を使用します。" },
    "settings.hidden.disableWarningTitle": { id: "Nonaktifkan Catatan?", en: "Disable Notes?", ja: "メモを無効にしますか？" },
    "settings.hidden.disableWarningText": { id: "Menonaktifkan fitur ini akan menghapus PIN dan semua gambar Anda secara permanen. Apakah Anda yakin?", en: "Disabling this feature will permanently delete your PIN and all images. Are you sure?", ja: "この機能を無効にすると、PINとすべての画像が完全に削除されます。よろしいですか？" },
    "settings.hidden.disableWarningText_extended": { id: "Tindakan ini akan menghapus semua data catatan dan PIN Anda secara permanen. Apakah Anda yakin?", en: "This action will permanently delete all your notes data and PIN. Are you sure?", ja: "この操作により、すべてのノートデータとPINが完全に削除されます。よろしいですか？" },
    "settings.hidden.pinUpdated": { id: "PIN berhasil diperbarui!", en: "PIN updated successfully!", ja: "PINが正常に更新されました！" },
    "settings.hidden.disabled": { id: "Fitur dinonaktifkan dan semua data telah dihapus.", en: "Feature disabled and all data has been deleted.", ja: "機能が無効になり、すべてのデータが削除されました。" },
    "pin.enter.confirmUpdate": { id: "Konfirmasi PIN Lama", en: "Confirm Old PIN", ja: "古いPINの確認" },
    "pin.enter.confirmUpdateLabel": { id: "Masukkan PIN lama Anda untuk melanjutkan", en: "Enter your old PIN to continue", ja: "続行するには古いPINを入力してください" },
    "pin.enter.confirmDisable": { id: "Konfirmasi Penghapusan", en: "Confirm Deletion", ja: "削除の確認" },
    "pin.enter.confirmDisableLabel": { id: "Masukkan PIN untuk menghapus semua data", en: "Enter PIN to delete all data", ja: "すべてのデータを削除するにはPINを入力してください" },
    "pin.create.title": { id: "Buat PIN Keamanan", en: "Create Security PIN", ja: "セキュリティPINの作成" },
    "pin.create.description": { id: "PIN akan digunakan untuk melindungi catatan ketika melakukan ekspor, hapus seluruh data, dan perubahan fitur.", en: "PIN will be used to protect notes when exporting, deleting all data, and changing features.", ja: "PINは、エクスポート、全データの削除、および機能の変更時にノートを保護するために使用されます。" },
    "prompt.dnd.notImage": { id: "Hanya file gambar yang didukung.", en: "Only image files are supported.", ja: "画像ファイルのみがサポートされています。" },
    "prompt.dnd.dropHere": { id: "Jatuhkan gambar untuk menambah gambar baru", en: "Drop image to add a new image", ja: "画像をドロップして新しい画像を追加" },
    "info.longPath.title": { id: "Gagal Memuat File", en: "Failed to Load File", ja: "ファイルの読み込みに失敗しました" },
    "info.longPath.text": { id: "File tidak bisa dimuat karena lokasinya terlalu dalam (nama folder atau path terlalu panjang).\nSilakan gunakan tombol 'Pilih File' untuk membuka gambar ini.", en: "The file could not be loaded because its location is too deep (the folder name or path is too long).\nPlease use the 'Choose File' button to open this image.", ja: "場所が深すぎる（フォルダ名またはパスが長すぎます）ため、ファイルを読み込めませんでした。\n「ファイルを選択」ボタンを使用してこの画像を開いてください。" },
    "advanced.prompt.addComma": { id: "Tambahkan Koma", en: "Add Commas", ja: "コンマを追加" },
    "advanced.prompt.noCharacters": { id: "Gambar Kosong", en: "No Images Available", ja: "画像がありません" },
    "prompt.menu.view": { id: "Lihat Gambar", en: "View Image", ja: "画像を表示" },
    "character.search.placeholder": { id: "Cari gambar...", en: "Search images...", ja: "画像を検索..." },
    "character.search.noResults": { id: "Gambar tidak ditemukan", en: "No images found", ja: "画像が見つかりません" },
    "prompt.menu.copyCharText": { id: "Salin Deskripsi Gambar", en: "Copy Image Description", ja: "画像の説明をコピー" },
    "settings.tabs.general": { id: "Umum", en: "General", ja: "一般" },
    "settings.tabs.display": { id: "Tampilan", en: "Display", ja: "表示" },
    "settings.tabs.other": { id: "Keamanan", en: "Security", ja: "安全" },
    "data.searchPopup.title": { id: "Data di Pencarian Pop-up Dashboard", en: "Data in Pop-up Dashboard Search", ja: "ダッシュボードのポップアップ検索のデータ" },
    "settings.search.enableHelp": { id: "Dengan mengaktifkan fitur ini, maka data catatan dan deskripsi gambar Anda akan mudah dicari melalui bar pencarian.", en: "By activating this feature, your note data and image descriptions will be easy to search through the search bar.", ja: "この機能を有効にすると、検索バーからメモデータや画像の説明を簡単に検索できるようになります。" },
    "settings.popup.enableHelp": { id: "Dengan mengaktifkan fitur ini, maka data catatan dan deskripsi gambar Anda akan mudah dicari melalui Pop-up Dashboard.", en: "By activating this feature, your note data and image descriptions will be easy to search via the Pop-up Dashboard.", ja: "この機能を有効にすると、ポップアップダッシュボードからメモデータや画像の説明を簡単に検索できるようになります。" },
    "search.historyType": { id: "Riwayat", en: "History", ja: "履歴" },
    "toast.historyEnabled": { id: "Histori browser diaktifkan untuk pencarian.", en: "Browser history enabled for search.", ja: "検索のためにブラウザ履歴が有効になりました。" },
    "toast.historyDisabled": { id: "Histori browser dinonaktifkan untuk pencarian.", en: "Browser history disabled for search.", ja: "検索のためにブラウザ履歴が無効になりました。" },
    "toast.imageOnly": { id: "Hanya file gambar yang didukung.", en: "Only image files are supported.", ja: "画像ファイルのみがサポートされています。" },
    "toast.wallpaperApplied": { id: "Wallpaper berhasil diterapkan.", en: "Wallpaper applied successfully.", ja: "壁紙が正常に適用されました。" },
    "toast.imageReadFail": { id: "Gagal membaca file gambar.", en: "Failed to read image file.", ja: "画像ファイルの読み込みに失敗しました。" },
    "toast.backgroundRemoved": { id: "Background kustom dihapus.", en: "Custom background removed.", ja: "カスタム背景を削除しました。" },
    // Bookmark
    "bookmark.title": { id: "Bookmark", en: "Bookmarks", ja: "ブックマーク" },
    "bookmark.open": { id: "Lihat Bookmark", en: "View Bookmarks", ja: "ブックマークを表示" },
    "bookmark.add": { id: "Tambah Bookmark", en: "Add Bookmark", ja: "ブックマークを追加" },
    "bookmark.addTitle": { id: "Tambah Bookmark Baru", en: "Add New Bookmark", ja: "新しいブックマークを追加" },
    "bookmark.editTitle": { id: "Edit Bookmark", en: "Edit Bookmark", ja: "ブックマークを編集" },
    "bookmark.label.name": { id: "Nama", en: "Name", ja: "名前" },
    "bookmark.label.url": { id: "URL", en: "URL", ja: "URL" },
    "bookmark.error.urlRequired": { id: "URL tidak boleh kosong.", en: "URL cannot be empty.", ja: "URLは空にできません。" },
    "bookmark.error.urlInvalid": { id: "URL tidak valid.", en: "Invalid URL.", ja: "無効なURLです。" },
    "bookmark.error.urlExists": { id: "URL sudah ada.", en: "URL already exists.", ja: "URLはすでに存在します。" },
    "bookmark.save.success": { id: "Bookmark berhasil disimpan!", en: "Bookmark saved successfully!", ja: "ブックマークが正常に保存されました！" },
    "bookmark.edit.success": { id: "Bookmark berhasil diperbarui!", en: "Bookmark updated successfully!", ja: "ブックマークが正常に更新されました！" },
    "bookmark.delete.success": { id: "Bookmark berhasil dihapus!", en: "Bookmark deleted successfully!", ja: "ブックマークが正常に削除されました！" },
    "bookmark.menu.copyLink": { id: "Salin Tautan", en: "Copy Link", ja: "リンクをコピー" },
    "bookmark.copy.link.success": { id: "URL berhasil disalin!", en: "URL copied successfully!", ja: "URLを正常にコピーしました！" },
    "popup.copy.localPathSuccess": { id: "Path file lokal disalin! Tempel di File Explorer.", en: "Local file path copied! Paste it in File Explorer.", ja: "ローカルファイルパスがコピーされました！エクスプローラーに貼り付けてください。" },
    "bookmark.menu.edit": { id: "Edit", en: "Edit", ja: "編集" },
    "bookmark.menu.delete": { id: "Hapus", en: "Delete", ja: "削除" },
    "settings.bookmark.openAction": { id: "Aksi Membuka Situs", en: "Bookmark Open Action", ja: "ブックマークを開くアクション" },
    "settings.bookmark.openAction.direct": { id: "Buka Langsung", en: "Open Directly", ja: "直接開く" },
    "settings.bookmark.openAction.newTab": { id: "Tab Baru", en: "New Tab", ja: "新しいタブ" },
    "settings.bookmark.enableShortcutCtrlD": { id: "Gunakan Pintasan Keyboard CTRL + D atau atau CMD + D untuk Tambah Bookmark", en: "Use CTRL + D or CMD + D Keyboard Shortcut to Add Bookmark", ja: "ブックマークを追加するには、Ctrl + D または CMD + D キーボードショートカットを使用します。" },
    "settings.bookmark.shortcutHelp": { id: "Jika Anda selalu menambahkan bookmark menggunakan browser bawaan, matikan fitur ini.", en: "If you always add bookmarks using the default browser, turn off this feature.", ja: "常にデフォルトのブラウザを使用してブックマークを追加する場合は、この機能をオフにしてください。" },
    "settings.search.openAction": { id: "Aksi Membuka Situs", en: "Search Open Action", ja: "検索を開くアクション" },
    "data.search.title": { id: "Data di Bar Pencarian", en: "Data in Search Bar", ja: "検索バーのデータ" },
    "data.searchHelp": { id: "Bar pencarian perlu diaktifkan terlebih dahulu di menu tampilan sebelum melakukan perubahan fitur dibawah.", en: "The search bar needs to be enabled first in the display menu before making any feature changes below.", ja: "以下の機能変更を行う前に、まず表示メニューで検索バーを有効にする必要があります。" },
    "settings.search.enablePrompt": { id: "Catatan dan Deskripsi Gambar", en: "Notes and Image Description", ja: "注釈と画像の説明" },
    "settings.search.enableHistory": { id: "Histori Browser", en: "Browser History", ja: "ブラウザ履歴" },
    "settings.search.enableHistoryHelp": { id: "Histori browser Anda akan mudah dicari melalui bar pencarian hingga 1 tahun terakhir. Mohon pertimbangkan sebelum mengaktifkan nya.", en: "Your browser history will be easy to search via the search bar for up to the last 1 year. Please consider before activating it.", ja: "検索バーを使用すると、過去 1 年間までのブラウザ履歴を簡単に検索できます。有効化する前に検討してください。" },
    "settings.search.enableHistoryHelp2": { id: "Untuk keamanan, opsi ini tidak akan di ekspor.", en: "For security reasons, this option will not be exported.", ja: "セキュリティ上の理由から、このオプションはエクスポートされません。" },
    // To-do List
    "todo.main.title": { id: "Daftar Tugas", en: "To-do List", ja: "やることリスト" },
    "todo.main.description": { id: "Daftar Tugas", en: "To-do List", ja: "やることリスト" },
    "todo.main.noItems": { id: "Tidak ada tugas", en: "No tasks", ja: "タスクはありません" },
    "todo.listTitle": { id: "Daftar Tugas", en: "To-do List", ja: "やることリスト" },
    "todo.add": { id: "Tambah Daftar Tugas", en: "Add To Do List", ja: "タスクを追加" },
    "todo.open": { id: "Lihat Daftar Tugas", en: "View Task List", ja: "タスクリスト表示" },
    "todo.addTitle": { id: "Tambah Daftar Tugas Baru", en: "Add New To-do", ja: "新しいタスクリスト追加" },
    "todo.editTitle": { id: "Edit Daftar Tugas", en: "Edit To-do", ja: "タスクリスト編集" },
    "todo.label.title": { id: "Judul", en: "Title", ja: "タイトル" },
    "todo.label.description": { id: "Deskripsi (Opsional)", en: "Description (Optional)", ja: "説明（任意）" },
    "todo.label.datetime": { id: "Tenggat Waktu (Opsional)", en: "Due Date (Optional)", ja: "期日（任意）" },
    "todo.error.titleRequired": { id: "Judul tidak boleh kosong.", en: "Title cannot be empty.", ja: "タイトルは空にできません。" },
    "todo.save.success": { id: "Daftar tugas berhasil disimpan!", en: "To-do saved successfully!", ja: "タスクリストが正常に保存されました！" },
    "todo.edit.success": { id: "Daftar tugas berhasil diperbarui!", en: "To-do updated successfully!", ja: "タスクリストが正常に更新されました！" },
    "todo.delete.success": { id: "Daftar tugas berhasil dihapus!", en: "To-do deleted successfully!", ja: "タスクリストが正常に削除されました！" },
    "todo.menu.edit": { id: "Edit", en: "Edit", ja: "編集" },
    "todo.menu.delete": { id: "Hapus", en: "Delete", ja: "削除" },
    "todo.completedTitle": { id: "Tugas Selesai", en: "Completed Tasks", ja: "完了したタスク" },
    // Prompt Builder Folder
    "prompt.all": { id: "Semua", en: "All", ja: "すべて" },
    "prompt.more": { id: "Lainnya", en: "More", ja: "その他" },
    "prompt.addFolder": { id: "Tambah Folder", en: "Add Folder", ja: "フォルダーを追加" },
    "folder.title": { id: "Folder", en: "Folders", ja: "フォルダー" },
    "folder.addTitle": { id: "Tambah Folder Baru", en: "Add New Folder", ja: "新しいフォルダーを追加" },
    "folder.editTitle": { id: "Edit Folder", en: "Edit Folder", ja: "フォルダを編集" },
    "folder.label.name": { id: "Nama", en: "Name", ja: "名前" },
    "folder.error.nameRequired": { id: "Nama folder tidak boleh kosong.", en: "Folder name cannot be empty.", ja: "フォルダー名は空にできません。" },
    "folder.error.nameExists": { id: "Nama folder sudah ada.", en: "Folder name already exists.", ja: "フォルダー名はすでに存在します。" },
    "folder.save.success": { id: "Folder berhasil disimpan!", en: "Folder saved successfully!", ja: "フォルダーが正常に保存されました！" },
    "folder.edit.success": { id: "Folder berhasil diperbarui!", en: "Folder updated successfully!", ja: "フォルダーが正常に更新されました！" },
    "folder.delete.success": { id: "Folder berhasil dihapus!", en: "Folder deleted successfully!", ja: "フォルダーが正常に削除されました！" },
    "folder.label.select": { id: "Folder", en: "Folder", ja: "フォルダー" },
    "folder.noFolder": { id: "Tidak ada folder", en: "No Folder", ja: "フォルダーなし" },
    "prompt.images": { id: "Gambar", en: "Images", ja: "画像" },
    "prompt.archive": { id: "Arsip", en: "Archive", ja: "アーカイブ" },
    "prompt.archived": { id: "Diarsipkan!", en: "Archived!", ja: "アーカイブ済み！" },
    "prompt.unarchive": { id: "Batal Arsip", en: "Unarchive", ja: "アーカイブ解除" },
    "prompt.menu.move": { id: "Pindahkan", en: "Move", ja: "移動" },
    "move.error.targetRequired": { id: "Anda harus memilih folder tujuan yang valid.", en: "You must select a valid destination folder.", ja: "有効な移動先フォルダを選択する必要があります。" },
    "delete.folder.text": { id: "Apakah Anda yakin ingin menghapus item ini? Catatan di dalamnya tidak akan dihapus, tetapi akan dipindahkan ke \"Semua\".", en: "Are you sure you want to delete this item? Notes inside will not be deleted, but will be moved to \"All\".", ja: "この項目を削除してもよろしいですか？中のノートは削除されず、「すべて」に移動します。" },
    "delete.folder.selectedText": { id: "Apakah Anda yakin ingin menghapus {count} item yang dipilih? Catatan di dalamnya tidak akan dihapus, tetapi akan dipindahkan ke \"Semua\".", en: "Are you sure you want to delete the {count} selected items? Notes inside will not be deleted, but will be moved to \"All\".", ja: "選択した{count}個の項目を削除してもよろしいですか？中のノートは削除されず、「すべて」に移動します。" },
    // Import and Export Data
    "settings.tabs.data": { id: "Data", en: "Data", ja: "データ" },
    "data.manageData.title": { id: "Impor dan Ekspor", en: "Import and Export", ja: "輸入と輸出" },
    "data.manageData.desc": { id: "Setiap kali Anda melakukan impor, halaman akan memuat ulang secara otomatis.", en: "Every time you import, the page will reload automatically.", ja: "インポートするたびに、ページは自動的にリロードされます。" },
    "data.manageUser.title": { id: "Data Pengguna", en: "User Data", ja: "ユーザーデータ" },
    "data.manageUser.desc": { id: "Username, pilihan tema, bookmark, daftar tugas, dan pengaturan.", en: "Username, theme choices, bookmarks, to-do list, and settings.", ja: "ユーザー名、テーマの選択、ブックマーク、タスク一覧、設定。" },
    "data.manageHidden.title": { id: "Data Catatan & Gambar", en: "Notes & Images Data", ja: "ノートと画像データ" },
    "data.manageHidden.desc": { id: "Data gambar dan catatan beserta PIN nya.", en: "Image and note data, including PINs.", ja: "PIN を含む、画像とノートのデータ。" },
    "data.button.import": { id: "Impor", en: "Import", ja: "輸入" },
    "data.button.export": { id: "Ekspor", en: "Export", ja: "エクスポルト" },
    "pin.enter.confirmExport": { id: "Konfirmasi Ekspor", en: "Confirm Export", ja: "エクスポートの確認" },
    "pin.enter.confirmExportLabel": { id: "Masukkan PIN Catatan untuk melanjutkan", en: "Enter Notes PIN to continue", ja: "続行するにはノートPINを入力してください" },
    "export.success": { id: "Data berhasil diekspor!", en: "Data exported successfully!", ja: "データが正常にエクスポートされました！" },
    "export.failed": { id: "Gagal mengekspor data.", en: "Failed to export data.", ja: "データのエクスポートに失敗しました。" },
    "import.success": { id: "Data berhasil diimpor! Memuat ulang halaman.", en: "Data imported successfully! Reload the page.", ja: "データが正常にインポートされました！ ページを再読み込みしてください。" },
    "import.failed": { id: "Gagal mengimpor data. File mungkin rusak atau tidak valid.", en: "Failed to import data. The file may be corrupt or invalid.", ja: "データのインポートに失敗しました。ファイルが破損しているか、無効な可能性があります。" },
    "import.noData": { id: "Tidak ada data yang ditemukan untuk diimpor.", en: "No data found to import.", ja: "インポートするデータが見つかりません。" },
    "confirm.import.user.title": { id: "Impor Data Pengguna", en: "Import User Data", ja: "ユーザーデータのインポート" },
    "confirm.import.mergeTitle": { id: "Impor Data Catatan & Gambar", en: "Import Notes & Images Data", ja: "ノートと画像データをインポート" },
    "confirm.import.mergeText": { id: "File cadangan terdeteksi. Apa yang ingin Anda lakukan dengan data yang ada saat ini?", en: "Backup file detected. What would you like to do with the current data?", ja: "バックアップファイルが検出されました。現在のデータをどうしますか？" },
    "confirm.import.mergeBtn": { id: "Gabungkan", en: "Merge", ja: "マージ" },
    "confirm.import.replaceBtn": { id: "Gantikan Semua", en: "Replace All", ja: "すべて置き換える" },
    "import.merged": { id: "Data berhasil digabungkan! Memuat ulang halaman.", en: "Data merged successfully! Reload the page.", ja: "データが正常にマージされました！ ページを再読み込みしてください。" },
    "import.replaced": { id: "Data berhasil digantikan! Memuat ulang halaman.", en: "Data replaced successfully! Reload the page.", ja: "データが正常に置き換えられました！ ページを再読み込みしてください。" },
    "confirm.import.pinWarning": { id: "Jika memilih salah satu opsi ini, PIN dari file cadangan akan digunakan dan menggantikan PIN yang sekarang.", en: "By selecting either option, the PINs from the backup file will be used and will replace your current PINs.", ja: "いずれかのオプションを選択すると、バックアップファイルのPINが使用され、現在のPINが置き換えられます。" },
    "loading.title": { id: "Proses Membaca Data", en: "Reading Data", ja: "データ読み込み中" },
    "loading.message": { id: "Proses membaca data sedang dilakukan, mohon tunggu...", en: "Reading data, please wait...", ja: "データを読み込んでいます。しばらくお待ちください..." },
    "progress.import.title": { id: "Proses Impor Data", en: "Importing Data", ja: "データインポート処理" },
    "progress.export.title": { id: "Proses Ekspor Data", en: "Exporting Data", ja: "データエクスポート処理" },
    "progress.message": { id: "Proses perpindahan data sedang dilakukan, mohon tunggu...", en: "Data transfer is in progress, please wait...", ja: "データ転送処理中です。しばらくお待ちください..." },
    // Delete Website Data
    "data.cache.title": { id: "Data dan Cache", en: "Data and Cache", ja: "データとキャッシュ" },
    "data.button.deleteUserData": { id: "Hapus Data Pengguna", en: "Delete User Data", ja: "ユーザーデータを削除" },
    "data.button.deleteHiddenData": { id: "Hapus Data Catatan & Gambar", en: "Delete Notes & Images Data", ja: "ノートと画像データを削除" },
    "data.button.deleteTodoListData": { id: "Hapus Data Daftar Tugas", en: "Delete To-do List Data", ja: "タスクリストのデータ削除" },
    "confirm.delete.user.title": { id: "Hapus Semua Data Pengguna?", en: "Delete All User Data?", ja: "すべてのユーザーデータを削除しますか？" },
    "confirm.delete.user.text": {
        id: "Tindakan ini akan menghapus data-data berikut:<ul><li>Pengaturan</li><li>Username</li><li>Bookmark</li><li>Daftar Tugas</li></ul>Apakah Anda yakin?",
        en: "This action will delete the following data:<ul><li>Settings</li><li>Username</li><li>Bookmarks</li><li>To-do List</li></ul>Are you sure?",
        ja: "この操作により、以下のデータが削除されます：<ul><li>設定</li><li>ユーザー名</li><li>ブックマーク</li><li>やることリスト</li></ul>よろしいですか？"
    },
    "confirm.delete.hidden.pinLabel": { id: "Masukkan PIN untuk menghapus semua data catatan & gambar", en: "Enter PIN to delete all notes & images data", ja: "すべてのノートと画像データを削除するにはPINを入力してください" },
    "data.delete.user.success": { id: "Data pengguna berhasil dihapus! Memuat ulang halaman.", en: "User data deleted successfully! Reload the page.", ja: "ユーザーデータを正常に削除しました！ページを再読み込みしてください。" },
    "data.delete.hidden.success": { id: "Data catatan & gambar berhasil dihapus! Memuat ulang halaman.", en: "Notes & images data deleted successfully! Reload the page.", ja: "ノートと画像データが正常に削除されました！ページを再読み込みしてください。" },
    "data.cache.clearedReloadSuccess": { id: "Cache berhasil dihapus! Memuat ulang halaman.", en: "Cache cleared successfully! Reload the page.", ja: "キャッシュが正常にクリアされました！ページを再読み込みしてください。" },
    "data.cache.bookmarkLabel": { id: "Cache bookmark (favicon):", en: "Bookmark cache (favicons):", ja: "ブックマークキャッシュ（ファビコン）:" },
    "data.cache.hiddenFeatureLabel": { id: "Cache galeri gambar:", en: "Image gallery cache:", ja: "画像ギャラリーのキャッシュ:" },
    "data.button.clearBookmarkCache": { id: "Hapus Cache Bookmark", en: "Clear Bookmark Cache", ja: "ブックマークキャッシュをクリア" },
    "data.button.clearHiddenCache": { id: "Hapus Cache Galeri Gambar", en: "Clear Image Gallery Cache", ja: "画像ギャラリーのキャッシュをクリアする" },
    "data.calculating": { id: "Menghitung...", en: "Calculating...", ja: "計算中..." },
    "confirm.delete.hidden.title": { id: "Hapus Semua Data Catatan & Gambar?", en: "Delete All Notes & Images Data?", ja: "すべてのノートと画像データを削除しますか？" },
    "confirm.delete.hidden.text": {
        id: "Tindakan ini akan menghapus data-data berikut:<ul><li>Daftar Catatan</li><li>Galeri Gambar</li><li>PIN Keamanan</li></ul>Apakah Anda yakin?",
        en: "This action will delete the following data:<ul><li>Notes List</li><li>Image Gallery</li><li>Security PIN</li></ul>Are you sure?",
        ja: "この操作により、以下のデータが削除されます：<ul><li>ノートリスト</li><li>画像ギャラリー</li><li>セキュリティPIN</li></ul>よろしいですか？"
    },
    "settings.hidden.notEnabled": { id: "Anda belum mengaktifkan fitur keamanan catatan.", en: "You haven't enabled the note security feature yet.", ja: "メモのセキュリティ機能がまだ有効になっていません。" },
    "settings.hidden.accessTip": { id: "Aktifkan catatan di menu \"Tampilan\" terlebih dahulu untuk mengakses fitur ini.", en: "Enable notes in the \"Display\" menu first to access this feature.", ja: "この機能にアクセスするには、「表示」メニューでメモを有効にしてください。" },
    "confirm.delete.todo.title": { id: "Hapus Semua Data Daftar Tugas?", en: "Delete All To-do Data?", ja: "すべてのタスクリストデータを削除？" },
    "confirm.delete.todo.text": {
        id: "Tindakan ini akan menghapus data-data berikut:<ul><li>Daftar Tugas</li></ul>Apakah Anda yakin?",
        en: "This action will delete the following data:<ul><li>To-do List</li></ul>Are you sure?",
        ja: "この操作により、以下のデータが削除されます：<ul><li>やることリスト</li></ul>よろしいですか？"
    },
    "data.delete.todo.success": { id: "Data daftar tugas berhasil dihapus! Memuat ulang halaman.", en: "To-do List data deleted successfully! Reload the page.", ja: "タスクリストのデータが正常に削除されました！ページを再読み込みしてください。" },
    // Pop-up Feature
    "pin.enter.confirmFeatureTitle": { id: "Konfirmasi Fitur", en: "Feature Confirmation", ja: "機能の確認" },
    "pin.enter.confirmFeatureLabel": { id: "Masukkan PIN Catatan untuk melanjutkan", en: "Enter Notes PIN to continue", ja: "続行するにはノートPINを入力してください" },
    "prompt.search.success.enabled": { id: "Pencarian Gambar & Catatan berhasil diaktifkan!", en: "Image & Note search enabled successfully!", ja: "画像とノートの検索が正常に有効化されました！" },
    "prompt.search.success.disabled": { id: "Pencarian Gambar & Catatan dinonaktifkan.", en: "Image & Note search disabled.", ja: "画像とノートの検索が無効になりました。" },
    "popup.success.enabled": { id: "Pop-up pencari catatan & gambar berhasil diaktifkan!", en: "Note & image finder pop-up enabled successfully!", ja: "ノートと画像の検索ポップアップが正常に有効化されました！" },
    "popup.success.disabled": { id: "Pop-up pencari catatan & gambar dinonaktifkan.", en: "Note & image finder pop-up disabled.", ja: "ノートと画像の検索ポップアップが無効になりました。" },
    "popup.featureDisabled.title": { id: "Fitur Dinonaktifkan", en: "Feature Disabled", ja: "機能が無効です" },
    "popup.featureDisabled.message": { id: "Fitur pop-up pencari dinonaktifkan. Silakan aktifkan melalui \"Pengaturan\" di menu data.", en: "The search pop-up feature is disabled. Please enable it via \"Settings\" in the data menu.", ja: "検索ポップアップ機能は無効になっています。データメニューの「設定」から有効にしてください。" },
    "popup.type.character": { id: "Deskripsi Gambar", en: "Image Description", ja: "画像の説明" },
    "popup.type.builder": { id: "Catatan", en: "Note", ja: "ノート" },
    "settings.search.enableBookmark": { id: "Bookmark", en: "Bookmark", ja: "ブックマーク" },
    "popup.type.bookmark": { id: "Bookmark", en: "Bookmark", ja: "ブックマーク" },
    "popup.error.loadFailed": { id: "Gagal memuat data", en: "Failed to load data", ja: "データの読み込みに失敗しました" },
    "popup.error.noResults": { id: "Tidak ditemukan hasil", en: "No results found", ja: "結果が見つかりません" },
    "popup.copy.success": { id: "Teks berhasil disalin!", en: "Text copied successfully!", ja: "テキストをコピーしました！" },
    "popup.copy.errorVerbose": { id: "Gagal menyalin teks (detail teknis):", en: "Failed to copy text (technical detail):", ja: "テキストのコピーに失敗しました（技術的な詳細）：" },
    "popup.copy.error": { id: "Gagal menyalin teks!", en: "Failed to copy text!", ja: "テキストのコピーに失敗しました！" },
    // Log Message
    "log.info.viewerCacheCleared": { id: "Cache viewer sementara berhasil dibersihkan saat memuat halaman.", en: "Temporary viewer cache cleared successfully on page load.", ja: "ページ読み込み時に一時的なビューアキャッシュが正常にクリアされました。" },
    "log.error.failedToClearViewerCache": { id: "Gagal membersihkan cache viewer saat memuat:", en: "Failed to clear viewer cache on load:", ja: "読み込み時にビューアキャッシュのクリアに失敗しました：" },
    "log.error.fetchFavicon": { id: "Gagal mengambil favicon untuk {domain} karena error jaringan:", en: "Failed to fetch favicon for {domain} due to network error:", ja: "ネットワークエラーのため、{domain} のファビコンの取得に失敗しました：" },
    "log.error.failedToInitSearch": { id: "Gagal menginisialisasi data pencarian footer:", en: "Failed to initialize footer search data:", ja: "フッター検索データの初期化に失敗しました：" },
    "log.error.downloadFailed": { id: "Download gagal:", en: "Download failed:", ja: "ダウンロードに失敗しました：" },
    "log.error.importUserDataFailed": { id: "Impor data pengguna gagal:", en: "Import user data failed:", ja: "ユーザーデータのインポートに失敗しました：" },
    "log.error.copyLocalPathFailed": { id: "Gagal menyalin path file lokal:", en: "Failed to copy local file path:", ja: "ローカルファイルパスのコピーに失敗しました：" },
    "log.error.db.generic": { id: "Galat database:", en: "Database error:", ja: "データベースエラー：" },
    "log.error.db.saveItem": { id: "Gagal menyimpan item dengan kunci \"{key}\":", en: "Error saving item with key \"{key}\":", ja: "キー「{key}」のアイテムの保存に失敗しました：" },
    "log.error.db.getItem": { id: "Gagal mengambil item dengan kunci \"{key}\":", en: "Error getting item with key \"{key}\":", ja: "キー「{key}」のアイテムの取得に失敗しました：" },
    "log.error.db.clearStore": { id: "Gagal membersihkan penyimpanan \"{storeName}\":", en: "Error clearing store \"{storeName}\":", ja: "ストア「{storeName}」のクリアに失敗しました：" },
    "log.error.bookmarkMergeFailed": { id: "Penggabungan bookmark gagal:", en: "Bookmark merge failed:", ja: "ブックマークのマージに失敗しました：" },
    "log.error.bookmarkReplaceFailed": { id: "Penggantian bookmark gagal:", en: "Bookmark replace failed:", ja: "ブックマークの置換に失敗しました：" },
    "log.error.exportHiddenFailed": { id: "Ekspor data catatan gagal:", en: "Notes data export failed:", ja: "ノートデータのエクスポートに失敗しました：" },
    "log.error.importInitial": { id: "Impor gagal pada tahap awal:", en: "Import failed at initial stage:", ja: "初期段階でインポートに失敗しました：" },
    "log.error.applyImportFailed": { id: "Penerapan data impor gagal:", en: "Apply imported data failed:", ja: "インポートデータの適用に失敗しました：" },
    "log.error.popupInitFailed": { id: "Gagal menginisialisasi data pop-up:", en: "Failed to initialize pop-up data:", ja: "ポップアップデータの初期化に失敗しました：" },
    "log.error.copyLinkFailed": { id: "Gagal menyalin tautan:", en: "Failed to copy link:", ja: "リンクのコピーに失敗しました：" },
    "log.warn.viewerBlobMissing": { id: "imageBlobViewer tidak ditemukan untuk gambar {id}, menggunakan fallback.", en: "imageBlobViewer not found for image {id}, using fallback.", ja: "画像{id}のimageBlobViewerが見つかりません。フォールバックを使用します。" },
    "log.error.createViewerFallbackFailed": { id: "Gagal membuat gambar viewer (fallback):", en: "Failed to create viewer image (fallback):", ja: "ビューア画像の作成に失敗しました（フォールバック）：" },
    "log.error.copyFailed": { id: "Gagal menyalin teks:", en: "Failed to copy text:", ja: "テキストのコピーに失敗しました：" },
    "log.error.copyCharTextFailed": { id: "Gagal menyalin deskripsi gambar:", en: "Failed to copy image description:", ja: "画像の説明のコピーに失敗しました：" },
    "log.error.getBlobFromCacheFailed": { id: "Gagal mengambil blob dari cache:", en: "Error fetching blob from cache:", ja: "キャッシュからのブロブの取得に失敗しました：" },
    "log.error.saveBlobToCacheFailed": { id: "Gagal menyimpan blob ke cache:", en: "Error saving blob to cache:", ja: "キャッシュへのブロブの保存に失敗しました：" },
    "log.error.deleteBlobFromCacheFailed": { id: "Gagal menghapus blob dari cache:", en: "Error deleting blob from cache:", ja: "キャッシュからのブロブの削除に失敗しました：" },
    "log.error.deleteTypedBlobFailed": { id: "Gagal menghapus blob tipe \"{blobType}\" dari cache:", en: "Failed to delete blob of type \"{blobType}\" from cache:", ja: "キャッシュからタイプ「{blobType}」のブロブの削除に失敗しました：" },
    "log.error.saveFaviconFailed": { id: "Gagal menyimpan favicon ke cache:", en: "Failed to save favicon to cache:", ja: "キャッシュへのファビコンの保存に失敗しました：" },
    "log.error.getFaviconFailed": { id: "Gagal mengambil favicon dari cache:", en: "Failed to get favicon from cache:", ja: "キャッシュからのファビコンの取得に失敗しました：" },
    "log.error.deleteFaviconFailed": { id: "Gagal menghapus favicon dari cache:", en: "Failed to delete favicon from cache:", ja: "キャッシュからのファビコンの削除に失敗しました：" },
    "log.info.allPromptsDeleted": { id: "Semua data berhasil dihapus dari IndexedDB.", en: "All data successfully deleted from IndexedDB.", ja: "すべてのデータがIndexedDBから正常に削除されました。" },
    "log.error.deleteAllPromptsFailed": { id: "Gagal menghapus semua data:", en: "Failed to delete all data:", ja: "すべてのデータの削除に失敗しました：" },
    "log.info.cacheStorageDeleted": { id: "Cache Storage \"{cacheName}\" berhasil dihapus.", en: "Cache Storage \"{cacheName}\" successfully deleted.", ja: "キャッシュストレージ「{cacheName}」が正常に削除されました。" },
    "log.error.deleteCacheStorageFailed": { id: "Gagal menghapus Cache Storage:", en: "Failed to delete Cache Storage:", ja: "キャッシュストレージの削除に失敗しました：" },
    "log.error.deleteFaviconCacheFailed": { id: "Gagal menghapus Cache Storage Favicon:", en: "Failed to delete Favicon Cache Storage:", ja: "ファビコンキャッシュストレージの削除に失敗しました：" },
    "log.error.calculateCacheSizeFailed": { id: "Gagal menghitung ukuran cache {cacheName}:", en: "Failed to calculate cache size for {cacheName}:", ja: "キャッシュサイズ{cacheName}の計算に失敗しました：" },
    "log.info.cacheDeleted": { id: "Cache \"{cacheName}\" berhasil dihapus.", en: "Cache \"{cacheName}\" successfully deleted.", ja: "キャッシュ「{cacheName}」が正常に削除されました。" },
    "log.info.cacheNotFound": { id: "Cache \"{cacheName}\" tidak ditemukan.", en: "Cache \"{cacheName}\" not found.", ja: "キャッシュ「{cacheName}」が見つかりません。" },
    "log.error.clearCacheFailed": { id: "Terjadi kesalahan saat menghapus cache \"{cacheName}\":", en: "An error occurred while deleting cache \"{cacheName}\":", ja: "キャッシュ「{cacheName}」の削除中にエラーが発生しました：" },
    "log.info.userDataCleared": { id: "Data pengguna berhasil dihapus.", en: "User data successfully cleared.", ja: "ユーザーデータが正常にクリアされました。" },
    "log.error.clearUserDataFailed": { id: "Gagal menghapus data pengguna:", en: "Failed to clear user data:", ja: "ユーザーデータのクリアに失敗しました：" },
    "log.info.hiddenDataCleared": { id: "Data catatan & gambar berhasil dihapus.", en: "Notes & images data successfully cleared.", ja: "ノートと画像データが正常にクリアされました。" },
    "log.error.clearHiddenDataFailed": { id: "Gagal menghapus data catatan & gambar:", en: "Failed to clear notes & images data:", ja: "ノートと画像データのクリアに失敗しました：" },
    "log.error.saveWallpaperFailed": { id: "Gagal menyimpan wallpaper ke cache:", en: "Failed to save wallpaper to cache:", ja: "壁紙をキャッシュに保存できませんでした：" },
    "log.error.takeWallpaperFailed": { id: "Gagal mengambil wallpaper dari cache:", en: "Failed to fetch wallpaper from cache:", ja: "キャッシュから壁紙を取得できませんでした：" },
    "log.error.deleteWallpaperFailed": { id: "Gagal menghapus cache wallpaper:", en: "Failed to clear wallpaper cache:", ja: "壁紙のキャッシュをクリアできませんでした：" },
    "log.error.loadPreviewFailed": { id: "Gagal memuat pratinjau gambar.", en: "Failed to load image preview.", ja: "画像プレビューの読み込みに失敗しました。" },
    "log.error.fileReader": { id: "Kesalahan FileReader:", en: "FileReader Error:", ja: "ファイルリーダーエラー：" },
    "log.info.connectionCheckFailed": { id: "Pengecekan koneksi percobaan ke-{attempt} gagal.", en: "Connection check attempt {attempt} failed.", ja: "接続確認試行{attempt}回目に失敗しました。" },
    "log.error.updateCheckFailed": { id: "Pengecekan pembaruan gagal:", en: "Update check failed:", ja: "更新の確認に失敗しました：" },
    "log.error.wallpaperExportFailed": { id: "Gagal mengonversi wallpaper ke Data URL saat ekspor:", en: "Failed to convert wallpaper to URL Data during export:", ja: "エクスポート中に壁紙を URL データに変換できませんでした：" },
    "log.error.wallpaperImportFailed": { id: "Gagal memproses dan menyimpan wallpaper impor:", en: "Failed to process and save imported wallpaper:", ja: "インポートした壁紙の処理と保存に失敗しました：" },
    "log.warn.cacheReadFailedTryDB": { id: "Gagal membaca cache, mencoba IndexedDB...", en: "Failed to read cache, trying IndexedDB...", ja: "キャッシュの読み込みに失敗しました。IndexedDBを試行します..." },
    "log.error.deleteWallpaperFromDBFailed": { id: "Gagal menghapus wallpaper dari DB.", en: "Failed to delete wallpaper from DB.", ja: "DBから壁紙を削除できませんでした。" },
    // Update Checker
    "update.checkBtn": { id: "Cek Pembaruan", en: "Check for Updates", ja: "アップデートを確認" },
    "update.checking": { id: "Mengecek pembaruan...", en: "Checking for updates...", ja: "アップデートを確認中..." },
    "update.uptodate": { id: "Anda sudah menggunakan versi terbaru!", en: "You are already on the latest version!", ja: "あなたはすでに最新バージョンです！" },
    "update.availableTitle": { id: "Pembaruan Tersedia", en: "Update Available", ja: "アップデートがあります" },
    "update.versionInfo": { id: "Versi {version} sekarang tersedia.", en: "Version {version} is now available.", ja: "バージョン{version}が利用可能です。" },
    "update.releaseNotes": { id: "Catatan Rilis:", en: "Release Notes:", ja: "リリースノート：" },
    "update.downloadBtn": { id: "Buka Halaman Unduh", en: "Go to Download Page", ja: "ダウンロードページへ" },
    "update.error": { id: "Tidak dapat memeriksa pembaruan. Silakan coba lagi nanti.", en: "Could not check for updates. Please try again later.", ja: "アップデートを確認できませんでした。後でもう一度お試しください。" },
    "update.noReleaseNotes": { id: "Tidak ada catatan rilis.", en: "No release notes available.", ja: "リリースノートはありません。" },
    "update.offlineError": { id: "Periksa koneksi internet Anda dan coba lagi.", en: "Check your internet connection and try again.", ja: "インターネット接続を確認して、もう一度お試しください。" }
};