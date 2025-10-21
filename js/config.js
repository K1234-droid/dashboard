/*
 * ===================================================================
 * A. DEFINISI ELEMEN, STATE & KAMUS i18n
 * ===================================================================
 */

// ==================== PENGATURAN PEMBARUAN ====================
export const CURRENT_VERSION = 'v3.11.5';
export const GITHUB_OWNER = 'K1234-droid';
export const GITHUB_REPO = 'dashboard';
// ==============================================================

// Objek untuk menampung elemen-elemen UI utama.
export const elements = {
    greeting: document.getElementById("greeting"),
    date: document.getElementById("date"),
    timeContainer: document.getElementById("time-container"),
    timeMain: document.getElementById("time-main"),
    timeSeconds: document.getElementById("time-seconds"),
    description: document.getElementById("description"),
    body: document.body,
    accountMessage: document.getElementById("account-message"),
    toast: document.getElementById('toast-notification'),
    creditText: document.getElementById('credit-text-span'),
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
    previewCheckbox: document.getElementById("theme-preview-checkbox"),
    lightBtn: document.getElementById("theme-light-btn"),
    darkBtn: document.getElementById("theme-dark-btn"),
    systemBtn: document.getElementById("theme-system-btn"),
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

export const confirmationMergeReplaceModal = {
    overlay: document.getElementById('confirmation-merge-replace-modal-overlay'),
    closeBtn: document.getElementById('close-confirmation-merge-replace-modal-btn'),
    title: document.getElementById('confirmation-merge-replace-modal-title'),
    text: document.getElementById('confirmation-merge-replace-modal-text'),
    mergeBtn: document.getElementById('confirm-merge-btn'),
    replaceBtn: document.getElementById('confirm-replace-btn'),
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

export const createAdvancedPinModal = {
    overlay: document.getElementById('create-advanced-pin-modal-overlay'),
    closeBtn: document.getElementById('close-create-advanced-pin-modal-btn'),
    input: document.getElementById('create-advanced-pin-input'),
    saveBtn: document.getElementById('save-initial-advanced-pin-btn'),
    feedbackText: document.getElementById('create-advanced-pin-feedback'),
};

export const updatePinChoiceModal = {
    overlay: document.getElementById('update-pin-choice-modal-overlay'),
    closeBtn: document.getElementById('close-update-pin-choice-modal-btn'),
    hiddenBtn: document.getElementById('update-pin-hidden-choice-btn'),
    advancedBtn: document.getElementById('update-pin-advanced-choice-btn'),
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
    grid: document.getElementById('prompt-grid'),
    content: document.querySelector('#prompt-modal-overlay .modal-content'),
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
    grid: document.getElementById('advanced-prompt-grid'),
    content: document.querySelector('#advanced-prompt-modal-overlay .modal-content'),
    manageBtn: document.getElementById('advanced-prompt-manage-btn'),
    selectCount: document.getElementById('advanced-prompt-select-count'),
    selectAllBtn: document.getElementById('advanced-prompt-select-all-btn'),
    deleteSelectedBtn: document.getElementById('advanced-prompt-delete-selected-btn'),
    cancelManageBtn: document.getElementById('advanced-prompt-cancel-manage-btn'),
    searchBtn: document.getElementById('advanced-prompt-search-btn'),
    searchInput: document.getElementById('advanced-prompt-search-input'),
    cancelSearchBtn: document.getElementById('advanced-prompt-cancel-search-btn'),
    noResultsMessage: document.getElementById('advanced-prompt-no-results'),
    actionBar: document.getElementById('advanced-prompt-action-bar'),
    manageContent: document.getElementById('advanced-prompt-manage-content'),
    searchContent: document.getElementById('advanced-prompt-search-content'),
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
    textInput: document.getElementById('advanced-prompt-text-input'),
    characterGrid: document.getElementById('advanced-prompt-character-selection-grid'),
    addCommaSwitch: document.getElementById('add-comma-switch'),
    addCommaSwitchContainer: document.getElementById('add-comma-switch-container'),
    saveBtn: document.getElementById('save-advanced-prompt-btn'),
    searchInput: document.getElementById('character-search-input'),
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
// ===================================================================================
  
// Elemen-elemen untuk switch pengaturan.
export const settingSwitches = {
    enableAnimation: document.getElementById("enable-animation-switch"),
    showSeconds: document.getElementById("show-seconds-switch"),
    menuBlur: document.getElementById("blur-menu-switch"),
    footerBlur: document.getElementById("blur-footer-switch"),
    avatarFullShow: document.getElementById("avatar-full-show"),
    avatarAnimation: document.getElementById("avatar-animation-switch"),
    detectMouseStillness: document.getElementById("detect-mouse-stillness-switch"),
    applyToAll: document.getElementById("apply-to-all-switch"),
    hiddenFeature: document.getElementById('hidden-feature-switch'),
    continueFeature: document.getElementById('continue-feature-switch'),
    showCredit: document.getElementById('show-credit-switch'),
    showFooter: document.getElementById('show-footer-switch'),
    showFooterInfo: document.getElementById('show-footer-info-switch'),
    enablePopupFinder: document.getElementById('enable-popup-finder-switch'),
};
  
// Elemen-elemen terkait status animasi avatar.
export const avatarStatus = {
    text: document.getElementById("avatar-status-text"),
    helpText: document.getElementById("avatar-help-text"),
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
export let advancedPIN = null;
export let prompts = [];
export let advancedPrompts = [];
export let currentPromptId = null;
export let currentImageViewerId = null;
export let imageViewerSource = 'grid';
export let currentAdvancedPromptId = null;
export let activePromptMenu = null;
export let activeModalStack = []; 
export let pinModalPurpose = 'login';
export let tempNewPIN = null;
export let confirmationModalPurpose = 'deletePrompt';
export let tempImportData = null;
export let toastTimeout;
export let isManageModeActive = false;
export let isSearchModeActive = false;
export let selectedPromptIds = [];
export let isAdvancedManageModeActive = false;
export let isAdvancedSearchModeActive = false;
export let selectedAdvancedPromptIds = [];
export let sortableInstance = null;
export let advancedSortableInstance = null;
export let isBlockingModalActive = false;

export let currentImageNavList = [];
export let uiHideTimeout = null;
export function setUiHideTimeout(value) { uiHideTimeout = value; }
export function setCurrentImageNavList(value) { currentImageNavList = value; }
  
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
export function setCurrentUser(value) { currentUser = value; }
export function setUserPIN(value) { userPIN = value; }
export function setAdvancedPIN(value) { advancedPIN = value; }
export function setPrompts(value) { prompts = value; }
export function setAdvancedPrompts(value) { advancedPrompts = value; }
export function setCurrentPromptId(value) { currentPromptId = value; }
export function setCurrentImageViewerId(value) { currentImageViewerId = value; }
export function setImageViewerSource(value) { imageViewerSource = value; }
export function setCurrentAdvancedPromptId(value) { currentAdvancedPromptId = value; }
export function setActivePromptMenu(value) { activePromptMenu = value; }
export function setActiveModalStack(value) { activeModalStack = value; }
export function setPinModalPurpose(value) { pinModalPurpose = value; }
export function setTempNewPIN(value) { tempNewPIN = value; }
export function setConfirmationModalPurpose(value) { confirmationModalPurpose = value; }
export function setTempImportData(value) { tempImportData = value; }
export function setToastTimeout(value) { toastTimeout = value; }
export function setIsManageModeActive(value) { isManageModeActive = value; }
export function setIsSearchModeActive(value) { isSearchModeActive = value; }
export function setSelectedPromptIds(value) { selectedPromptIds = value; }
export function setIsAdvancedManageModeActive(value) { isAdvancedManageModeActive = value; }
export function setIsAdvancedSearchModeActive(value) { isAdvancedSearchModeActive = value; }
export function setSelectedAdvancedPromptIds(value) { selectedAdvancedPromptIds = value; }
export function setSortableInstance(value) { sortableInstance = value; }
export function setAdvancedSortableInstance(value) { advancedSortableInstance = value; }
export function setIsBlockingModalActive(value) { isBlockingModalActive = value; }
export function setLanguageSettings(value) { languageSettings = value; }
export function setAnimationFrameId(value) { animationFrameId = value; }
export function setLastUpdatedHour(value) { lastUpdatedHour = value; }
export function setFeedbackTimeout(value) { feedbackTimeout = value; }
export function setLastActiveModalOverlay(value) { lastActiveModalOverlay = value; }
  
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
    "footer.account": { id: "Anda sebagai {value}", en: "You are logged in as {value}", ja: "{value} としてログイン中" },
    "footer.offline": { id: "Anda sedang offline", en: "You are offline", ja: "オフラインです" },
    "footer.checking": { id: "Memeriksa koneksi", en: "Checking connection", ja: "接続を確認しています" },
    "footer.credit": { id: "Ilustrasi karakter dibuat menggunakan Google Imagen 4", en: "Character illustration created using Google Imagen 4", ja: "キャラクターイラストはGoogle Imagen 4を使用して作成" },
    "footer.tooltip.settings": { id: "Pengaturan Dashboard", en: "Dashboard Settings", ja: "ダッシュボード設定" },
    "animation.enableRequired": { id: "Anda harus mengaktifkan animasi terlebih dahulu.", en: "You must enable animation first.", ja: "まずアニメーションを有効にしてください。" },
    "footer.enableRequired": { id: "Anda harus mengaktifkan footer terlebih dahulu.", en: "You must enable the footer first.", ja: "まずフッターを有効にする必要があります。" },
    "menu.changeUsername": { id: "Ubah Username", en: "Change Username", ja: "ユーザー名を変更" },
    "menu.adjustTheme": { id: "Sesuaikan Tema", en: "Adjust Theme", ja: "テーマを調整" },
    "menu.otherSettings": { id: "Pengaturan Lainnya", en: "Other Settings", ja: "その他の設定" },
    "menu.about": { id: "Tentang Dashboard", en: "About Dashboard", ja: "ダッシュボードについて" },
    "settings.username.title": { id: "Ubah Username", en: "Change Username", ja: "ユーザー名を変更" },
    "settings.username.label": { id: "Username (Maks. 6 karakter)", en: "Username (Max. 6 characters)", ja: "ユーザー名（最大6文字）" },
    "settings.username.save": { id: "Simpan", en: "Save", ja: "保存" },
    "settings.username.feedback.saved": { id: "Username berhasil disimpan!", en: "Username saved successfully!", ja: "ユーザー名を保存しました！" },
    "settings.username.feedback.error": { id: "Username harus 1-6 karakter.", en: "Username must be 1-6 characters.", ja: "ユーザー名は1～6文字にしてください。" },
    "settings.theme.title": { id: "Pilih Tampilan", en: "Choose Appearance", ja: "テーマを選択" },
    "settings.theme.light": { id: "Terang", en: "Light", ja: "ライト" },
    "settings.theme.dark": { id: "Gelap", en: "Dark", ja: "ダーク" },
    "settings.theme.system": { id: "Sistem", en: "System", ja: "システム" },
    "settings.theme.showPreview": { id: "Tampilkan Pratinjau Halaman", en: "Show Page Preview", ja: "ページプレビューを表示" },
    "settings.theme.escInfo": { id: "Tekan tombol \"Esc\" pada keyboard untuk keluar window", en: "Press the \"Esc\" key on the keyboard to exit the window", ja: "ウィンドウを終了するにはキーボードの「Esc」キーを押してください" },
    "settings.language.title": { id: "Pilihan Bahasa", en: "Language Options", ja: "言語オプション" },
    "settings.language.allContent": { id: "Semua Konten Tampilan", en: "All Display Content", ja: "すべての表示内容" },
    "settings.language.applyAll": { id: "Terapkan ke Semua Konten", en: "Apply to All Content", ja: "すべてに適用" },
    "settings.language.greeting": { id: "Ucapan Salam", en: "Greeting", ja: "挨拶" },
    "settings.language.description": { id: "Deskripsi", en: "Description", ja: "説明" },
    "settings.language.date": { id: "Hari dan Tanggal", en: "Day and Date", ja: "曜日と日付" },
    "settings.other.clock": { id: "Jam", en: "Clock", ja: "時間" },
    "settings.other.showSeconds": { id: "Tampilkan Detik", en: "Show Seconds", ja: "秒を表示" },
    "settings.other.visual": { id: "Visual", en: "Visuals", ja: "ビジュアル" },
    "settings.other.enableAnimation": { id: "Aktifkan Animasi", en: "Enable Animation", ja: "アニメーションを有効にする" },
    "settings.other.blurMenu": { id: "Aktifkan Efek Blur Background Menu", en: "Enable Menu Background Blur Effect", ja: "メニュー背景のぼかし効果を有効にする" },
    "settings.other.blurFooter": { id: "Aktifkan Efek Blur Footer", en: "Enable Footer Blur Effect", ja: "フッターのぼかし効果を有効にする" },
    "settings.other.interactiveChar": { id: "Gambar Karakter Interaktif", en: "Interactive Character Image", ja: "インタラクティブキャラクター画像" },
    "settings.other.showChar": { id: "Tampilkan Karakter", en: "Show Character", ja: "キャラクターを表示" },
    "settings.other.enableAnim": { id: "Aktifkan Animasi Interaktif", en: "Enable Interactive Animation", ja: "インタラクティブアニメーションを有効にする" },
    "settings.other.detectMouse": { id: "Deteksi Mouse Diam", en: "Detect Still Mouse", ja: "マウス静止を検出" },
    "settings.other.showCredit": { id: "Tampilkan Sumber Karakter", en: "Show Character Source", ja: "キャラクターの出典を表示" },
    "settings.other.showFooter": { id: "Tampilkan Footer", en: "Show Footer", ja: "フッターを表示" },
    "settings.other.animHelp": { id: "Animasi interaktif akan dimulai setelah kursor diam di atas gambar karakter selama 0,3 detik untuk menghindari interaksi yang tidak disengaja.", en: "The interactive animation will start after the cursor remains still over the character image for 0.3 seconds to avoid unintentional interactions.", ja: "意図しない操作を避けるため、キャラクター画像上でカーソルが0.3秒間静止した後にインタラクティブアニメーションが開始されます。" },
    "settings.other.support": { id: "Dukungan gambar karakter interaktif:", en: "Interactive character image support:", ja: "インタラクティブキャラクター画像のサポート：" },
    "settings.other.supportHelp": { id: "Atur ke resolusi layar lebih tinggi untuk mendapat dukungan gambar karakter interaktif.\nMinimal 480px (lebar) x 510px (tinggi)", en: "Set to a higher screen resolution to get interactive character image support.\nMinimum 480px (width) x 510px (height)", ja: "インタラクティブキャラクター画像のサポートを得るには、より高い画面解像度に設定してください。\n最小480px（幅）x 510px（高さ）" },
    "about.p1": { id: "Halaman ini bertujuan untuk menggantikan halaman beranda yang ada pada browser. Terima kasih telah menggunakan.", en: "This page is intended to replace the default browser homepage. Thank you for using it.", ja: "このページは、ブラウザのホームページを置き換えることを目的としています。ご利用いただきありがとうございます。" },
    "about.featuresTitle": { id: "Apa Saja Fitur-Fiturnya?", en: "What are the Features?", ja: "主な機能" },
    "about.f1": { id: "Informasi waktu real-time", en: "Real-time clock information", ja: "リアルタイムの時刻情報" },
    "about.f2": { id: "Penyesuaian tema gelap, terang, atau default perangkat", en: "Light, dark, or system default theme customization", ja: "ライト、ダーク、またはデバイスデフォルトのテーマ調整" },
    "about.f3": { id: "Ilustrasi karakter", en: "Character illustration", ja: "キャラクターイラスト" },
    "about.f4": { id: "Status koneksi internet jika sedang offline", en: "Offline internet connection status", ja: "オフライン時のインターネット接続ステータス" },
    "about.p2": { id: "Untuk info selengkapnya, silahkan kunjungi halaman readme.", en: "For more information, please visit the readme page.", ja: "詳細については、readme ページをご覧ください。" },
    "about.notesTitle": { id: "Catatan", en: "Notes", ja: "注意" },
    "about.n1": { id: "Penerapan fitur tema terang dan gelap hanya berlaku untuk halaman dashboard ini.", en: "The light and dark theme features only apply to this dashboard page.", ja: "ライトおよびダークテーマ機能は、このダッシュボードページにのみ適用されます。" },
    "about.n2": { id: "Pada resolusi layar di atas 930px, arahkan mouse ke karakter untuk melihat lebih dekat.\nCek dukungan gambar karakter interaktif melalui menu \"Pengaturan Lainnya\".", en: "On screen resolutions above 930px, hover the mouse over the character to see it closer.\nCheck for interactive character image support via the \"Other Settings\" menu.", ja: "930px以上の画面解像度では、キャラクターにマウスを合わせると拡大表示されます。\nインタラクティブキャラクター画像のサポートについては、「その他の設定」メニューで確認してください。" },
    "about.creditTitle": { id: "Kredit", en: "Credits", ja: "クレジット" },
    "about.c1": { id: "Font:", en: "Font:", ja: "フォント：" },
    "about.d1": { id: "Poppins - Indian Type Foundry, Jonny Pinhorn, dan Ninad Kale", en: "Poppins - Indian Type Foundry, Jonny Pinhorn, and Ninad Kale", ja: "Poppins（Indian Type Foundry、Jonny Pinhorn、Ninad Kale）" },
    "about.c2": { id: "Font untuk bahasa Jepang:", en: "Japanese font:", ja: "日本語フォント：" },
    "about.d2": { id: "Noto Sans Japanese - Adobe", en: "Noto Sans Japanese - Adobe", ja: "Noto Sans Japanese（Adobe）" },
    "about.c3": { id: "Gambar karakter:", en: "Character image:", ja: "キャラクター画像：" },
    "about.d3": { id: "Google Imagen 4", en: "Google Imagen 4", ja: "Google Imagen 4" },
    "about.c4": { id: "Website di buat oleh:", en: "Website created by:", ja: "ウェブサイト制作：" },
    "about.d4": { id: "Danny Bungai", en: "Danny Bungai", ja: "Danny Bungai" },
    "about.versionTitle": { id: "Versi Website", en: "Website Version", ja: "ウェブ版" },
    "about.readmeButton": { id: "Lihat readme", en: "View readme", ja: "readme を表示" },
    "settings.security.changePinLabel": { id: "Ubah PIN Keamanan (4 digit)", en: "Change Security PIN (4 digits)", ja: "セキュリティPINの変更（4桁）" },
    "pin.enter.title": { id: "Masukkan PIN", en: "Enter PIN", ja: "PINを入力" },
    "pin.enter.label": { id: "PIN 4 Digit", en: "4-Digit PIN", ja: "4桁のPIN" },
    "pin.enter.submit": { id: "Masuk", en: "Enter", ja: "入力" },
    "prompt.delete.title": { id: "Konfirmasi Hapus", en: "Confirm Deletion", ja: "削除の確認" },
    "prompt.delete.text": { id: "Apakah Anda yakin ingin menghapus prompt ini? Tindakan ini tidak dapat diurungkan.", en: "Are you sure you want to delete this prompt? This action cannot be undone.", ja: "このプロンプトを削除してもよろしいですか？この操作は元に戻せません。" },
    "prompt.delete.inUseError": { id: "Prompt ini tidak dapat dihapus karena digunakan oleh Prompt Builder. Mohon hapus data dari Prompt Builder terlebih dahulu.", en: "This prompt cannot be deleted because it is being used by the Prompt Builder. Please remove it from the Prompt Builder data first.", ja: "このプロンプトはプロンプトビルダーで使用されているため削除できません。まずプロンプトビルダーのデータから削除してください。" },
    "prompt.delete.selectedText": { id: "Apakah Anda yakin ingin menghapus {count} prompt yang dipilih? Tindakan ini tidak dapat diurungkan.", en: "Are you sure you want to delete the {count} selected prompts? This action cannot be undone.", ja: "選択した{count}個のプロンプトを削除してもよろしいですか？この操作は元に戻せません。" },
    "prompt.delete.cancel": { id: "Batal", en: "Cancel", ja: "キャンセル" },
    "prompt.delete.confirm": { id: "Ya, Hapus", en: "Yes, Delete", ja: "はい、削除します" },
    "settings.pin.feedback.saved": { id: "PIN berhasil disimpan!", en: "PIN saved successfully!", ja: "PINを保存しました！" },
    "settings.pin.feedback.removed": { id: "PIN berhasil dihapus.", en: "PIN removed successfully.", ja: "PINを削除しました。" },
    "settings.pin.feedback.error": { id: "PIN harus 4 digit angka.", en: "PIN must be 4 digits.", ja: "PINは4桁の数字にしてください。" },
    "settings.pin.feedback.wrong": { id: "PIN salah. Coba lagi.", en: "Incorrect PIN. Try again.", ja: "PINが間違っています。もう一度お試しください。" },
    "pin.feedback.used": { id: "PIN sudah digunakan. Silakan pilih PIN lain.", en: "PIN is already in use. Please choose another PIN.", ja: "このPINは既に使用されています。別のPINを選択してください。" },
    "prompt.copy.success": { id: "Teks berhasil disalin!", en: "Text copied successfully!", ja: "テキストをコピーしました！" },
    "prompt.copy.noChar": { id: "Tidak ada karakter untuk disalin.", en: "No characters to copy.", ja: "コピーするキャラクターがいません。" },
    "prompt.save.success": { id: "Prompt berhasil disimpan!", en: "Prompt saved successfully!", ja: "プロンプトが正常に保存されました！" },
    "prompt.edit.success": { id: "Prompt berhasil diedit!", en: "Prompt edited successfully!", ja: "プロンプトが正常に編集されました！" },
    "prompt.delete.success": { id: "Prompt berhasil dihapus!", en: "Prompt deleted successfully!", ja: "プロンプトが正常に削除されました！" },
    "prompt.listTitle": { id: "Prompt Karakter AI", en: "AI Character Prompts", ja: "AIキャラクタープロンプト" },
    "advanced.prompt.listTitle": { id: "Pembuat Prompt AI Lengkap", en: "Complete AI Prompt Builder", ja: "完全なAIプロンプトビルダー" },
    "prompt.detailTitle": { id: "Detail Prompt", en: "Prompt Details", ja: "プロンプト詳細" },
    "advanced.prompt.detailTitle": { id: "Detail Prompt Builder", en: "Prompt Builder Details", ja: "プロンプトビルダー詳細" },
    "prompt.addTitle": { id: "Tambah Prompt Baru", en: "Add New Prompt", ja: "新しいプロンプトを追加" },
    "advanced.prompt.addTitle": { id: "Tambah Prompt Builder Baru", en: "Add New Prompt Builder", ja: "新しいプロンプトビルダーを追加" },
    "prompt.editTitle": { id: "Edit Prompt", en: "Edit Prompt", ja: "プロンプトを編集" },
    "advanced.prompt.editTitle": { id: "Edit Prompt Builder", en: "Edit Prompt Builder", ja: "プロンプトビルダーを編集" },
    "prompt.saveChanges": { id: "Simpan Perubahan", en: "Save Changes", ja: "変更を保存" },
    "prompt.saving": { id: "Menyimpan...", en: "Saving...", ja: "保存中..." },
    "prompt.edit.imageLabel": { id: "Pilih File Gambar dari perangkat", en: "Select Image File from device", ja: "デバイスから画像ファイルを選択" },
    "prompt.edit.imageHelp": { id: "Kosongkan jika tidak ingin mengubah gambar sampul.", en: "Leave empty if you don't want to change the cover image.", ja: "カバー画像を変更しない場合は空のままにしてください。" },
    "prompt.edit.textLabel": { id: "Teks Prompt", en: "Prompt Text", ja: "プロンプトテキスト" },
    "advanced.prompt.textLabel": { id: "Teks Prompt", en: "Prompt Text", ja: "プロンプトテキスト" },
    "advanced.prompt.characterLabel": { id: "Pilih Karakter AI", en: "Select AI Character", ja: "AIキャラクターを選択" },
    "advanced.prompt.addComma": { id: "Tambahkan Koma", en: "Add Commas", ja: "コンマを追加" },
    "prompt.menu.view": { id: "Tampilkan Gambar Penuh", en: "View Full Image", ja: "画像全体を表示" },
    "prompt.menu.copy": { id: "Salin Teks", en: "Copy Text", ja: "テキストをコピー" },
    "prompt.menu.saveImage": { id: "Simpan Gambar", en: "Save Image", ja: "画像を保存" },
    "prompt.menu.copyChar": { id: "Salin Karakter", en: "Copy Characters", ja: "キャラクターをコピー" },
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
    "prompt.add.fieldsRequired": { id: "Gambar dan teks prompt tidak boleh kosong.", en: "Image and prompt text cannot be empty.", ja: "画像とプロンプトテキストは空にできません。" },
    "advanced.prompt.add.fieldsRequired": { id: "Teks prompt tidak boleh kosong.", en: "Prompt text cannot be empty.", ja: "プロンプトテキストは空にできません。" },
    "prompt.edit.textRequired": { id: "Teks prompt tidak boleh kosong.", en: "Prompt text cannot be empty.", ja: "プロンプトテキストは空にできません。" },
    "prompt.save.fileError": { id: "Terjadi kesalahan saat memproses file.", en: "An error occurred while processing the file.", ja: "ファイルの処理中にエラーが発生しました。" },
    "prompt.save.storageError": { id: "Gagal menyimpan. Penyimpanan browser penuh. Coba gunakan gambar yang lebih kecil atau hapus prompt lama.", en: "Save failed. Browser storage is full. Try using smaller images or deleting old prompts.", ja: "保存に失敗しました。ブラウザのストレージがいっぱいです。小さい画像を使用するか、古いプロンプトを削除してください。" },
    "settings.hidden.title": { id: "Fitur Tersembunyi", en: "Hidden Feature", ja: "隠し機能" },
    "settings.hidden.enable": { id: "Aktifkan Fitur Tersembunyi", en: "Enable Hidden Feature", ja: "隠し機能を有効にする" },
    "settings.continue.enable": { id: "Aktifkan Fitur Lanjutan", en: "Enable Advanced Feature", ja: "高度な機能を有効にする" },
    "settings.hidden.updatePin": { id: "Perbarui PIN", en: "Update PIN", ja: "PINを更新" },
    "settings.hidden.createPin": { id: "Buat PIN", en: "Create PIN", ja: "PINを作成" },
    "hiddenFeature.howItWorks.title": { id: "Cara Kerja Fitur Tersembunyi", en: "How the Hidden Feature Works", ja: "隠し機能の仕組み" },
    "hiddenFeature.howItWorks.button": { id: "Cara Kerja", en: "How it Works", ja: "仕組み" },
    "hiddenFeature.howItWorks.p1": { id: "Tekan dua kali pada avatar pojok kanan bawah.", en: "Double-click the avatar in the bottom right corner.", ja: "右下の角にあるアバターをダブルクリックします。" },
    "settings.hidden.disableWarningTitle": { id: "Nonaktifkan Fitur Tersembunyi?", en: "Disable Hidden Feature?", ja: "隠し機能を無効にしますか？" },
    "settings.hidden.disableWarningText": { id: "Menonaktifkan fitur ini akan menghapus PIN dan semua prompt karakter Anda secara permanen. Apakah Anda yakin?", en: "Disabling this feature will permanently delete your PIN and all character prompts. Are you sure?", ja: "この機能を無効にすると、PINとすべてのキャラクタープロンプトが完全に削除されます。よろしいですか？" },
    "settings.hidden.disableWarningText_extended": { id: "Menonaktifkan fitur ini akan menghapus PIN dan semua data (Prompt Karakter & Pembuat Prompt) secara permanen. Apakah Anda yakin?", en: "Disabling this feature will permanently delete your PIN and all data (Character & Builder Prompts). Are you sure?", ja: "この機能を無効にすると、PINとすべてのデータ（キャラクタープロンプトとビルダープロンプト）が完全に削除されます。よろしいですか？" },
    "settings.continue.disableWarningTitle": { id: "Nonaktifkan Fitur Lanjutan?", en: "Disable Advanced Feature?", ja: "高度な機能を無効にする？" },
    "settings.continue.disableWarningText": { id: "Ini akan menghapus PIN dan semua data Pembuat Prompt AI Lengkap secara permanen. Yakin?", en: "This will permanently delete the PIN and all Complete AI Prompt Builder data. Are you sure?", ja: "これにより、PINとすべての完全なAIプロンプトビルダーデータが完全に削除されます。よろしいですか？" },
    "settings.hidden.pinUpdated": { id: "PIN berhasil diperbarui!", en: "PIN updated successfully!", ja: "PINが正常に更新されました！" },
    "settings.hidden.disabled": { id: "Fitur dinonaktifkan dan semua data telah dihapus.", en: "Feature disabled and all data has been deleted.", ja: "機能が無効になり、すべてのデータが削除されました。" },
    "pin.enter.confirmUpdate": { id: "Konfirmasi PIN Lama", en: "Confirm Old PIN", ja: "古いPINの確認" },
    "pin.enter.confirmUpdateLabel": { id: "Masukkan PIN lama Anda untuk melanjutkan", en: "Enter your old PIN to continue", ja: "続行するには古いPINを入力してください" },
    "pin.enter.confirmDisable": { id: "Konfirmasi Penghapusan", en: "Confirm Deletion", ja: "削除の確認" },
    "pin.enter.confirmDisableLabel": { id: "Masukkan PIN untuk menghapus semua data", en: "Enter PIN to delete all data", ja: "すべてのデータを削除するにはPINを入力してください" },
    "pin.create.title": { id: "Buat PIN Keamanan", en: "Create Security PIN", ja: "セキュリティPINの作成" },
    "pin.create.description": { id: "PIN akan digunakan untuk melindungi dan mengakses fitur tersembunyi.", en: "The PIN will be used to protect and access hidden features.", ja: "PINは隠し機能の保護とアクセスに使用されます。" },
    "pin.create.advanced.title": { id: "Buat PIN Fitur Lanjutan", en: "Create Advanced Feature PIN", ja: "高度な機能のPINを作成" },
    "pin.create.advanced.description": { id: "PIN ini akan digunakan untuk mengakses Pembuat Prompt AI Lengkap.", en: "This PIN will be used to access the Complete AI Prompt Builder.", ja: "このPINは、完全なAIプロンプトビルダーへのアクセスに使用されます。" },
    "pin.update.choice.title": { id: "Pilih Penerapan PIN", en: "Choose PIN Application", ja: "PINの適用を選択" },
    "pin.update.choice.text": { id: "Anda ingin memperbarui PIN untuk fitur yang mana?", en: "Which feature's PIN do you want to update?", ja: "どの機能のPINを更新しますか？" },
    "pin.update.choice.hidden": { id: "Fitur Tersembunyi", en: "Hidden Feature", ja: "隠し機能" },
    "pin.update.choice.advanced": { id: "Fitur Lanjutan", en: "Advanced Feature", ja: "高度な機能" },
    "prompt.dnd.notImage": { id: "Hanya file gambar yang didukung.", en: "Only image files are supported.", ja: "画像ファイルのみがサポートされています。" },
    "prompt.dnd.dropHere": { id: "Jatuhkan gambar untuk menambah prompt baru", en: "Drop image to add a new prompt", ja: "画像をドロップして新しいプロンプトを追加" },
    "info.longPath.title": { id: "Gagal Memuat File", en: "Failed to Load File", ja: "ファイルの読み込みに失敗しました" },
    "info.longPath.text": { id: "File tidak bisa dimuat karena lokasinya terlalu dalam (nama folder atau path terlalu panjang).\nSilakan gunakan tombol 'Pilih File' untuk membuka gambar ini.", en: "The file could not be loaded because its location is too deep (the folder name or path is too long).\nPlease use the 'Choose File' button to open this image.", ja: "場所が深すぎる（フォルダ名またはパスが長すぎます）ため、ファイルを読み込めませんでした。\n「ファイルを選択」ボタンを使用してこの画像を開いてください。" },
    "advanced.prompt.characterLabel": { id: "Pilih Karakter AI", en: "Select AI Character", ja: "AIキャラクターを選択" },
    "advanced.prompt.addComma": { id: "Tambahkan Koma", en: "Add Commas", ja: "コンマを追加" },
    "advanced.prompt.noCharacters": { id: "Karakter AI Kosong", en: "No AI Characters Available", ja: "AIキャラクターがいません" },
    "prompt.menu.view": { id: "Tampilkan Gambar Penuh", en: "View Full Image", ja: "画像全体を表示" },
    "advanced.prompt.noCharacters": { id: "Karakter AI Kosong", en: "No AI Characters Available", ja: "AIキャラクターがいません" },
    "character.search.placeholder": { id: "Cari karakter...", en: "Search characters...", ja: "キャラクターを検索..." },
    "character.search.noResults": { id: "Karakter tidak ditemukan", en: "No characters found", ja: "キャラクターが見つかりません" },
    "prompt.menu.copyCharText": { id: "Salin Teks Karakter", en: "Copy Character Text", ja: "キャラクターテキストをコピー" },
    "settings.tabs.general": { id: "Umum", en: "General", ja: "一般" },
    "settings.tabs.display": { id: "Tampilan", en: "Display", ja: "表示" },
    "settings.tabs.other": { id: "Lainnya", en: "Other", ja: "その他" },
    "settings.popup.enable": { id: "Aktifkan Pop-up Pencari Prompt", en: "Enable Prompt Finder Pop-up", ja: "プロンプト検索ポップアップを有効にする" },
    "settings.popup.enableHelp": { id: "Dengan mengaktifkan fitur ini, maka data prompt Anda akan mudah dicari melalui Pop-up Dashboard.", en: "By enabling this feature, your prompt data can be easily searched via the Dashboard Pop-up.", ja: "この機能を有効にすると、ダッシュボードのポップアップからプロンプトデータを簡単に検索できます。" },
    "settings.other.showFooterInfo": { id: "Tampilkan Informasi Username dan Koneksi Internet di Footer", en: "Show Username and Internet Connection Information in Footer", ja: "フッターにユーザー名とインターネット接続情報を表示する" },
    // Import and Export Data
    "settings.tabs.data": { id: "Data", en: "Data", ja: "データ" },
    "data.manageUser.title": { id: "Kelola Data Pengguna", en: "Manage User Data", ja: "ユーザーデータの管理" },
    "data.manageUser.desc": { id: "Mengelola username, pilihan tema, dan pengaturan lainnya.", en: "Manage username, theme preferences, and other settings.", ja: "ユーザー名、テーマ設定、その他の設定を管理します。" },
    "data.manageHidden.title": { id: "Kelola Data Fitur Tersembunyi", en: "Manage Hidden Feature Data", ja: "隠し機能データの管理" },
    "data.manageHidden.desc": { id: "Mengelola data prompt karakter dan pembuat prompt beserta PIN nya.", en: "Manage character prompt and prompt builder data, including PINs.", ja: "キャラクタープロンプトとプロンプトビルダーのデータ（PINを含む）を管理します。" },
    "data.button.import": { id: "Impor File", en: "Import File", ja: "ファイルをインポート" },
    "data.button.export": { id: "Ekspor File", en: "Export File", ja: "ファイルをエクスポート" },
    "pin.enter.confirmExport": { id: "Konfirmasi Ekspor", en: "Confirm Export", ja: "エクスポートの確認" },
    "pin.enter.confirmExportLabel": { id: "Masukkan PIN Fitur Tersembunyi untuk melanjutkan", en: "Enter Hidden Feature PIN to continue", ja: "続行するには隠し機能のPINを入力してください" },
    "export.success": { id: "Data berhasil diekspor!", en: "Data exported successfully!", ja: "データが正常にエクスポートされました！" },
    "export.failed": { id: "Gagal mengekspor data.", en: "Failed to export data.", ja: "データのエクスポートに失敗しました。" },
    "import.success": { id: "Data berhasil diimpor! Memuat ulang halaman.", en: "Data imported successfully! Reload the page.", ja: "データが正常にインポートされました！ ページを再読み込みしてください。" },
    "import.failed": { id: "Gagal mengimpor data. File mungkin rusak atau tidak valid.", en: "Failed to import data. The file may be corrupt or invalid.", ja: "データのインポートに失敗しました。ファイルが破損しているか、無効な可能性があります。" },
    "import.noData": { id: "Tidak ada data yang ditemukan untuk diimpor.", en: "No data found to import.", ja: "インポートするデータが見つかりません。" },
    "confirm.import.mergeTitle": { id: "Impor Data Fitur Tersembunyi", en: "Import Hidden Feature Data", ja: "隠し機能データをインポート" },
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
    // Pop-up Feature
    "pin.enter.confirmFeatureTitle": { id: "Konfirmasi Fitur", en: "Feature Confirmation", ja: "機能の確認" },
    "pin.enter.confirmFeatureLabel": { id: "Masukkan PIN Fitur Tersembunyi untuk melanjutkan", en: "Enter Hidden Feature PIN to continue", ja: "続行するには隠し機能のPINを入力してください" },
    "popup.success.enabled": { id: "Pop-up pencari prompt berhasil diaktifkan!", en: "Prompt finder pop-up enabled successfully!", ja: "プロンプト検索ポップアップが正常に有効化されました！" },
    "popup.success.disabled": { id: "Pop-up pencari prompt dinonaktifkan.", en: "Prompt finder pop-up disabled.", ja: "プロンプト検索ポップアップが無効になりました。" },
    "popup.featureDisabled.title": { id: "Fitur Dinonaktifkan", en: "Feature Disabled", ja: "機能が無効です" },
    "popup.featureDisabled.message": { id: "Fitur Pop-up Pencari dinonaktifkan. Silakan aktifkan melalui menu \"Pengaturan Lainnya\" di halaman utama.", en: "The Pop-up Finder feature is disabled. Please enable it through the \"Other Settings\" menu on the main page.", ja: "ポップアップファインダー機能は無効です。メインページの「その他の設定」メニューから有効にしてください。" },
    "popup.search.placeholder": { id: "Cari karakter AI atau prompt builder...", en: "Search AI characters or prompt builder...", ja: "AIキャラクターまたはプロンプトビルダーを検索..." },
    "popup.type.character": { id: "Karakter", en: "Character", ja: "キャラクター" },
    "popup.type.builder": { id: "Builder", en: "Builder", ja: "ビルダー" },
    "popup.error.loadFailed": { id: "Gagal memuat data", en: "Failed to load data", ja: "データの読み込みに失敗しました" },
    "popup.error.noResults": { id: "Tidak ditemukan hasil", en: "No results found", ja: "結果が見つかりません" },
    "popup.copy.success": { id: "Teks berhasil disalin!", en: "Text copied successfully!", ja: "テキストをコピーしました！" },
    "popup.copy.errorVerbose": { id: "Gagal menyalin teks (detail teknis):", en: "Failed to copy text (technical detail):", ja: "テキストのコピーに失敗しました（技術的な詳細）：" },
    "popup.copy.error": { id: "Gagal menyalin teks!", en: "Failed to copy text!", ja: "テキストのコピーに失敗しました！" },
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