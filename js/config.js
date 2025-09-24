/*
 * ===================================================================
 * A. DEFINISI ELEMEN, STATE & KAMUS i18n
 * ===================================================================
 */

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
};
  
// Elemen terkait Modal Tentang.
export const aboutModal = {
    overlay: document.getElementById("about-modal-overlay"),
    openBtn: document.getElementById("open-about-modal-btn"),
    closeBtn: document.getElementById("close-about-modal-btn"),
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
    storageBar: document.getElementById('storage-bar'),
    storageText: document.getElementById('storage-text'),
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
    storageBar: document.getElementById('storage-bar-edit'),
    storageText: document.getElementById('storage-text-edit'),
    storageIndicator: document.getElementById('storage-indicator-edit'),
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
};
// ===================================================================================
  
// Elemen-elemen untuk switch pengaturan.
export const settingSwitches = {
    showSeconds: document.getElementById("show-seconds-switch"),
    menuBlur: document.getElementById("blur-menu-switch"),
    footerBlur: document.getElementById("blur-footer-switch"),
    avatarFullShow: document.getElementById("avatar-full-show"),
    avatarAnimation: document.getElementById("avatar-animation-switch"),
    detectMouseStillness: document.getElementById("detect-mouse-stillness-switch"),
    applyToAll: document.getElementById("apply-to-all-switch"),
    hiddenFeature: document.getElementById('hidden-feature-switch'),
    continueFeature: document.getElementById('continue-feature-switch'),
};
  
// Elemen-elemen terkait status animasi avatar.
export const avatarStatus = {
    text: document.getElementById("avatar-status-text"),
    helpText: document.getElementById("avatar-help-text"),
};
  
// --- State & Data ---
export let currentUser = "K1234";
export let userPIN = null;
export let advancedPIN = null;
export let prompts = [];
export let advancedPrompts = [];
export let currentPromptId = null;
export let currentAdvancedPromptId = null;
export let activePromptMenu = null;
export let activeModalStack = []; 
export let pinModalPurpose = 'login'; // 'loginHidden', 'loginAdvanced', 'loginChoice', 'updateConfirmHidden', 'updateConfirmAdvanced', 'disableConfirmHidden', 'disableConfirmAdvanced'
export let tempNewPIN = null;
export let confirmationModalPurpose = 'deletePrompt'; // 'deletePrompt', 'disableHiddenFeature', 'disableContinueFeature', 'deleteSelectedPrompts', 'deleteAdvancedPrompt', 'deleteSelectedAdvancedPrompts'
export let toastTimeout;
export let isManageModeActive = false;
export let isSearchModeActive = false;
export let selectedPromptIds = [];
export let isAdvancedManageModeActive = false;
export let isAdvancedSearchModeActive = false;
export let selectedAdvancedPromptIds = [];
export let sortableInstance = null;
export let advancedSortableInstance = null;
  
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
export function setCurrentAdvancedPromptId(value) { currentAdvancedPromptId = value; }
export function setActivePromptMenu(value) { activePromptMenu = value; }
export function setActiveModalStack(value) { activeModalStack = value; }
export function setPinModalPurpose(value) { pinModalPurpose = value; }
export function setTempNewPIN(value) { tempNewPIN = value; }
export function setConfirmationModalPurpose(value) { confirmationModalPurpose = value; }
export function setToastTimeout(value) { toastTimeout = value; }
export function setIsManageModeActive(value) { isManageModeActive = value; }
export function setIsSearchModeActive(value) { isSearchModeActive = value; }
export function setSelectedPromptIds(value) { selectedPromptIds = value; }
export function setIsAdvancedManageModeActive(value) { isAdvancedManageModeActive = value; }
export function setIsAdvancedSearchModeActive(value) { isAdvancedSearchModeActive = value; }
export function setSelectedAdvancedPromptIds(value) { selectedAdvancedPromptIds = value; }
export function setSortableInstance(value) { sortableInstance = value; }
export function setAdvancedSortableInstance(value) { advancedSortableInstance = value; }
export function setLanguageSettings(value) { languageSettings = value; }
export function setAnimationFrameId(value) { animationFrameId = value; }
export function setLastUpdatedHour(value) { lastUpdatedHour = value; }
export function setFeedbackTimeout(value) { feedbackTimeout = value; }
export function setLastActiveModalOverlay(value) { lastActiveModalOverlay = value; }
  
export const supportedLangs = ['id', 'en', 'ja'];
export const localeMap = { id: 'id-ID', en: 'en-US', ja: 'ja-JP' };
  
export const i18nData = {
    // ... (Your entire i18nData object remains here, unchanged) ...
    "greeting.morning": { id: "Selamat Pagi!", en: "Good Morning!", ja: "おはようございます!" },
    "greeting.afternoon": { id: "Selamat Siang!", en: "Good Afternoon!", ja: "こんにちは!" },
    "greeting.evening": { id: "Selamat Sore!", en: "Good Evening!", ja: "こんばんは!" },
    "greeting.night": { id: "Selamat Malam!", en: "Good Night!", ja: "おやすみなさい!" },
    "description.day": { id: "Teruslah menjelajahi untuk menemukan hal-hal baru dimasa depan. Tetap semangat.", en: "Keep exploring to find new things in the future. Stay spirited.", ja: "未来に新しいものを見つけるために探検を続けてください。元気でね。" },
    "description.night": { id: "Jangan lupa istahat karena sudah malam :)", en: "It's late, don't forget to rest :)", ja: "夜遅いですので、休むことを忘れないでください :)" },
    "page.title": { id: "Tab Baru", en: "New Tab", ja: "新しいタブ" },
    "page.unsupportedRes": { id: "Maaf, halaman dashboard belum mendukung resolusi rendah", en: "Sorry, the dashboard page doesn't support low resolutions yet", ja: "申し訳ありませんが、ダッシュボードはまだ低解像度をサポートしていません" },
    "footer.account": { id: "Anda sebagai {value}", en: "You are logged in as {value}", ja: "{value} としてログイン中" },
    "footer.offline": { id: "Anda sedang offline", en: "You are offline", ja: "オフラインです" },
    "footer.checking": { id: "Memeriksa koneksi", en: "Checking connection", ja: "接続を確認しています" },
    "footer.credit": { id: "Ilustrasi karakter dibuat menggunakan Google Imagen 4", en: "Character illustration created using Google Imagen 4", ja: "キャラクターイラストはGoogle Imagen 4を使用して作成" },
    "footer.tooltip.settings": { id: "Pengaturan Dashboard", en: "Dashboard Settings", ja: "ダッシュボード設定" },
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
    "settings.theme.system": { id: "Default Perangkat", en: "Device Default", ja: "デバイスのデフォルト" },
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
    "settings.other.blurMenu": { id: "Aktifkan Efek Blur Background Menu", en: "Enable Menu Background Blur Effect", ja: "メニュー背景のぼかし効果を有効にする" },
    "settings.other.blurFooter": { id: "Aktifkan Efek Blur Footer", en: "Enable Footer Blur Effect", ja: "フッターのぼかし効果を有効にする" },
    "settings.other.interactiveChar": { id: "Gambar Karakter Interaktif", en: "Interactive Character Image", ja: "インタラクティブキャラクター画像" },
    "settings.other.showChar": { id: "Tampilkan Karakter", en: "Show Character", ja: "キャラクターを表示" },
    "settings.other.enableAnim": { id: "Aktifkan Animasi Interaktif", en: "Enable Interactive Animation", ja: "インタラクティブアニメーションを有効にする" },
    "settings.other.detectMouse": { id: "Deteksi Mouse Diam", en: "Detect Still Mouse", ja: "マウス静止を検出" },
    "settings.other.animHelp": { id: "Animasi interaktif akan dimulai setelah kursor diam di atas gambar karakter selama 0,3 detik untuk menghindari interaksi yang tidak disengaja.", en: "The interactive animation will start after the cursor remains still over the character image for 0.3 seconds to avoid unintentional interactions.", ja: "意図しない操作を避けるため、キャラクター画像上でカーソルが0.3秒間静止した後にインタラクティブアニメーションが開始されます。" },
    "settings.other.support": { id: "Dukungan gambar karakter interaktif:", en: "Interactive character image support:", ja: "インタラクティブキャラクター画像のサポート：" },
    "settings.other.supportHelp": { id: "Atur ke resolusi layar lebih tinggi untuk mendapat dukungan gambar karakter interaktif.\nMinimal 480px (lebar) x 510px (tinggi)", en: "Set to a higher screen resolution to get interactive character image support.\nMinimum 480px (width) x 510px (height)", ja: "インタラクティブキャラクター画像のサポートを得るには、より高い画面解像度に設定してください。\n最小480px（幅）x 510px（高さ）" },
    "about.p1": { id: "Halaman ini bertujuan untuk menggantikan halaman beranda yang ada pada browser. Terima kasih telah menggunakan.", en: "This page is intended to replace the default browser homepage. Thank you for using it.", ja: "このページは、ブラウザのホームページを置き換えることを目的としています。ご利用いただきありがとうございます。" },
    "about.featuresTitle": { id: "Apa Saja Fitur-Fiturnya?", en: "What are the Features?", ja: "主な機能" },
    "about.f1": { id: "Informasi waktu real-time", en: "Real-time clock information", ja: "リアルタイムの時刻情報" },
    "about.f2": { id: "Penyesuaian tema gelap, terang, atau default perangkat", en: "Light, dark, or system default theme customization", ja: "ライト、ダーク、またはデバイスデフォルトのテーマ調整" },
    "about.f3": { id: "Ilustrasi karakter", en: "Character illustration", ja: "キャラクターイラスト" },
    "about.f4": { id: "Status koneksi internet jika sedang offline", en: "Offline internet connection status", ja: "オフライン時のインターネット接続ステータス" },
    "about.p2": { id: "Untuk info selengkapnya, silahkan download dan kunjungi halaman readme.md.", en: "For more info, please download and visit the readme.md page.", ja: "詳細については、readme.mdページをダウンロードしてご覧ください。" },
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
    "prompt.storage.label": { id: "Penyimpanan Lokal", en: "Local Storage", ja: "ローカルストレージ" },
    "prompt.storage.loading": { id: "Memuat...", en: "Loading...", ja: "読み込み中..." },
    "prompt.storage.status": { id: "{current} / {total}", en: "{current} / {total}", ja: "{current} / {total}" },
    "prompt.storage.error": { id: "Gagal memuat info", en: "Failed to load info", ja: "情報の読み込みに失敗しました" },
    "prompt.storage.preview": { id: "{current} &rarr; {after} / {total}", en: "{current} &rarr; {after} / {total}", ja: "{current} &rarr; {after} / {total}" },
    "settings.hidden.title": { id: "Fitur Tersembunyi", en: "Hidden Feature", ja: "隠し機能" },
    "settings.hidden.enable": { id: "Aktifkan Fitur Tersembunyi", en: "Enable Hidden Feature", ja: "隠し機能を有効にする" },
    "settings.continue.enable": { id: "Aktifkan Fitur Lanjutkan", en: "Enable Continue Feature", ja: "続行機能を有効にする" },
    "settings.hidden.updatePin": { id: "Perbarui PIN", en: "Update PIN", ja: "PINを更新" },
    "settings.hidden.createPin": { id: "Buat PIN", en: "Create PIN", ja: "PINを作成" },
    "hiddenFeature.howItWorks.title": { id: "Cara Kerja Fitur Tersembunyi", en: "How the Hidden Feature Works", ja: "隠し機能の仕組み" },
    "hiddenFeature.howItWorks.button": { id: "Cara Kerja", en: "How it Works", ja: "仕組み" },
    "hiddenFeature.howItWorks.p1": { id: "Tekan dua kali pada avatar pojok kanan bawah.", en: "Double-click the avatar in the bottom right corner.", ja: "右下の角にあるアバターをダブルクリックします。" },
    "hiddenFeature.howItWorks.p2": { id: "Perhatikan bahwa fitur ini akan menggunakan penyimpanan bawaan browser maksimal 5 MB.", en: "Note that this feature will use the browser's built-in storage up to a maximum of 5 MB.", ja: "この機能は、ブラウザの組み込みストレージを最大5MBまで使用することにご注意ください。" },
    "settings.hidden.disableWarningTitle": { id: "Nonaktifkan Fitur Tersembunyi?", en: "Disable Hidden Feature?", ja: "隠し機能を無効にしますか？" },
    "settings.hidden.disableWarningText": { id: "Menonaktifkan fitur ini akan menghapus PIN dan semua prompt karakter Anda secara permanen. Apakah Anda yakin?", en: "Disabling this feature will permanently delete your PIN and all character prompts. Are you sure?", ja: "この機能を無効にすると、PINとすべてのキャラクタープロンプトが完全に削除されます。よろしいですか？" },
    "settings.hidden.disableWarningText_extended": { id: "Menonaktifkan fitur ini akan menghapus PIN dan semua data (Prompt Karakter & Pembuat Prompt) secara permanen. Apakah Anda yakin?", en: "Disabling this feature will permanently delete your PIN and all data (Character & Builder Prompts). Are you sure?", ja: "この機能を無効にすると、PINとすべてのデータ（キャラクタープロンプトとビルダープロンプト）が完全に削除されます。よろしいですか？" },
    "settings.continue.disableWarningTitle": { id: "Nonaktifkan Fitur Lanjutkan?", en: "Disable Continue Feature?", ja: "続行機能を無効にしますか？" },
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
    "character.search.noResults": { id: "Karakter tidak ditemukan", en: "No characters found", ja: "キャラクターが見つかりません" }
};