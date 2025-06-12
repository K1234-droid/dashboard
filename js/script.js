/*
 * ===================================================================
 * A. DEFINISI ELEMEN, STATE & KAMUS i18n
 * ===================================================================
 */

// Objek untuk menampung elemen-elemen UI utama.
const elements = {
  greeting: document.getElementById("greeting"),
  date: document.getElementById("date"),
  timeContainer: document.getElementById("time-container"),
  timeMain: document.getElementById("time-main"),
  timeSeconds: document.getElementById("time-seconds"),
  description: document.getElementById("description"),
  body: document.body,
  unsupportedResolutionMessage: document.getElementById("unsupported-resolution-message"),
  accountMessage: document.getElementById("account-message"),
};

// Elemen terkait status koneksi.
const connectionStatus = {
  offlineMessage: document.getElementById("offline-message"),
  loadingMessage: document.getElementById("loading-message"),
};

// Elemen terkait menu pop-up.
const menu = {
  container: document.getElementById("avatar-menu-container"),
  button: document.getElementById("avatar-logo-btn"),
  popup: document.getElementById("menu-popup"),
};

// Elemen terkait Modal Ubah Username.
const usernameModal = {
  overlay: document.getElementById("username-modal-overlay"),
  openBtn: document.getElementById("open-username-modal-btn"),
  closeBtn: document.getElementById("close-username-modal-btn"),
  input: document.getElementById("username-input"),
  saveBtn: document.getElementById("save-username-btn"),
  feedbackText: document.getElementById("username-feedback"),
};

// Elemen terkait Modal Pengaturan Tema.
const themeModal = {
  overlay: document.getElementById("theme-modal-overlay"),
  openBtn: document.getElementById("open-theme-modal-btn"),
  closeBtn: document.getElementById("close-theme-modal-btn"),
  previewCheckbox: document.getElementById("theme-preview-checkbox"),
  lightBtn: document.getElementById("theme-light-btn"),
  darkBtn: document.getElementById("theme-dark-btn"),
  systemBtn: document.getElementById("theme-system-btn"),
};

// Elemen terkait Modal Pengaturan Lainnya.
const otherSettingsModal = {
  overlay: document.getElementById("other-settings-modal-overlay"),
  openBtn: document.getElementById("open-other-settings-modal-btn"),
  closeBtn: document.getElementById("close-other-settings-modal-btn"),
};

// Elemen terkait Modal Tentang.
const aboutModal = {
  overlay: document.getElementById("about-modal-overlay"),
  openBtn: document.getElementById("open-about-modal-btn"),
  closeBtn: document.getElementById("close-about-modal-btn"),
};

// Elemen-elemen untuk switch pengaturan.
const settingSwitches = {
  showSeconds: document.getElementById("show-seconds-switch"),
  menuBlur: document.getElementById("blur-menu-switch"),
  footerBlur: document.getElementById("blur-footer-switch"),
  avatarFullShow: document.getElementById("avatar-full-show"),
  avatarAnimation: document.getElementById("avatar-animation-switch"),
  detectMouseStillness: document.getElementById("detect-mouse-stillness-switch"),
  applyToAll: document.getElementById("apply-to-all-switch"),
};

// Elemen-elemen terkait status animasi avatar.
const avatarStatus = {
  text: document.getElementById("avatar-status-text"),
  helpText: document.getElementById("avatar-help-text"),
};

// --- State & Data ---
let currentUser = "K1234"; // Default username

let languageSettings = {
    ui: 'id',
    greeting: 'id',
    description: 'id',
    date: 'id',
    applyToAll: true,
};

// Variabel untuk mengelola animation loop
let animationFrameId = null;
let lastUpdatedHour = new Date().getHours();
let feedbackTimeout;

let lastActiveModalOverlay = null;

const supportedLangs = ['id', 'en', 'jp'];
const localeMap = { id: 'id-ID', en: 'en-US', jp: 'ja-JP' };

const i18nData = {
    // Greetings & Descriptions
    "greeting.morning": { id: "Selamat Pagi!", en: "Good Morning!", jp: "おはようございます!" },
    "greeting.afternoon": { id: "Selamat Siang!", en: "Good Afternoon!", jp: "こんにちは!" },
    "greeting.evening": { id: "Selamat Sore!", en: "Good Evening!", jp: "こんばんは!" },
    "greeting.night": { id: "Selamat Malam!", en: "Good Night!", jp: "おやすみなさい!" },
    "description.day": { id: "Teruslah menjelajahi untuk menemukan hal-hal baru dimasa depan. Tetap semangat.", en: "Keep exploring to find new things in the future. Stay spirited.", jp: "未来に新しいものを見つけるために探検を続けてください。元気でね。" },
    "description.night": { id: "Jangan lupa istirahat karena sudah malam :)", en: "It's late, don't forget to rest :)", jp: "夜遅いですので、休むことを忘れないでください :)" },
    // General UI
    "page.title": { id: "Tab Baru", en: "New Tab", jp: "新しいタブ" },
    "page.unsupportedRes": { id: "Maaf, halaman dashboard belum mendukung resolusi rendah", en: "Sorry, the dashboard page doesn't support low resolutions yet", jp: "申し訳ありませんが、ダッシュボードはまだ低解像度をサポートしていません" },
    // Footer
    "footer.account": { id: "Anda sebagai {value}", en: "You are logged in as {value}", jp: "{value} としてログイン中" },
    "footer.offline": { id: "Anda sedang offline", en: "You are offline", jp: "オフラインです" },
    "footer.checking": { id: "Memeriksa koneksi", en: "Checking connection", jp: "接続を確認しています" },
    "footer.credit": { id: "Ilustrasi karakter dibuat menggunakan Google Imagen 4", en: "Character illustration created using Google Imagen 4", jp: "キャラクターイラストはGoogle Imagen 4を使用して作成" },
    "footer.tooltip.settings": { id: "Pengaturan Dashboard", en: "Dashboard Settings", jp: "ダッシュボード設定" },
    // Main Menu
    "menu.changeUsername": { id: "Ubah Username", en: "Change Username", jp: "ユーザー名を変更" },
    "menu.adjustTheme": { id: "Sesuaikan Tema", en: "Adjust Theme", jp: "テーマを調整" },
    "menu.otherSettings": { id: "Pengaturan Lainnya", en: "Other Settings", jp: "その他の設定" },
    "menu.about": { id: "Tentang Dashboard", en: "About Dashboard", jp: "ダッシュボードについて" },
    // Username Settings
    "settings.username.title": { id: "Ubah Username", en: "Change Username", jp: "ユーザー名を変更" },
    "settings.username.label": { id: "Username (Maks. 6 karakter)", en: "Username (Max. 6 characters)", jp: "ユーザー名（最大6文字）" },
    "settings.username.save": { id: "Simpan", en: "Save", jp: "保存" },
    "settings.username.feedback.saved": { id: "Username berhasil disimpan!", en: "Username saved successfully!", jp: "ユーザー名を保存しました！" },
    "settings.username.feedback.error": { id: "Username harus 1-6 karakter.", en: "Username must be 1-6 characters.", jp: "ユーザー名は1～6文字にしてください。" },
    // Theme Settings
    "settings.theme.title": { id: "Pilih Tampilan", en: "Choose Appearance", jp: "テーマを選択" },
    "settings.theme.light": { id: "Terang", en: "Light", jp: "ライト" },
    "settings.theme.dark": { id: "Gelap", en: "Dark", jp: "ダーク" },
    "settings.theme.system": { id: "Default Perangkat", en: "Device Default", jp: "デバイスのデフォルト" },
    "settings.theme.showPreview": { id: "Tampilkan Pratinjau Halaman", en: "Show Page Preview", jp: "ページプレビューを表示" },
    "settings.theme.escInfo": { id: "Tekan tombol \"Esc\" pada keyboard untuk keluar window", en: "Press the \"Esc\" key on the keyboard to exit the window", jp: "ウィンドウを終了するにはキーボードの「Esc」キーを押してください" },
    // Other Settings
    "settings.language.title": { id: "Pilihan Bahasa", en: "Language Options", jp: "言語オプション" },
    "settings.language.allContent": { id: "Semua Konten Tampilan", en: "All Display Content", jp: "すべての表示内容" },
    "settings.language.applyAll": { id: "Terapkan ke Semua Konten", en: "Apply to All Content", jp: "すべてに適用" },
    "settings.language.greeting": { id: "Ucapan Salam", en: "Greeting", jp: "挨拶" },
    "settings.language.description": { id: "Deskripsi", en: "Description", jp: "説明" },
    "settings.language.date": { id: "Hari dan Tanggal", en: "Day and Date", jp: "曜日と日付" },
    "settings.other.clock": { id: "Jam", en: "Clock", jp: "時間" },
    "settings.other.showSeconds": { id: "Tampilkan Detik", en: "Show Seconds", jp: "秒を表示" },
    "settings.other.visual": { id: "Visual", en: "Visuals", jp: "ビジュアル" },
    "settings.other.blurMenu": { id: "Aktifkan Efek Blur Background Menu", en: "Enable Menu Background Blur Effect", jp: "メニュー背景のぼかし効果を有効にする" },
    "settings.other.blurFooter": { id: "Aktifkan Efek Blur Footer", en: "Enable Footer Blur Effect", jp: "フッターのぼかし効果を有効にする" },
    "settings.other.interactiveChar": { id: "Gambar Karakter Interaktif", en: "Interactive Character Image", jp: "インタラクティブキャラクター画像" },
    "settings.other.showChar": { id: "Tampilkan Karakter", en: "Show Character", jp: "キャラクターを表示" },
    "settings.other.enableAnim": { id: "Aktifkan Animasi Interaktif", en: "Enable Interactive Animation", jp: "インタラクティブアニメーションを有効にする" },
    "settings.other.detectMouse": { id: "Deteksi Mouse Diam", en: "Detect Still Mouse", jp: "マウス静止を検出" },
    "settings.other.animHelp": { id: "Animasi interaktif akan dimulai setelah kursor diam di atas gambar karakter selama 0,3 detik untuk menghindari interaksi yang tidak disengaja.", en: "The interactive animation will start after the cursor remains still over the character image for 0.3 seconds to avoid unintentional interactions.", jp: "意図しない操作を避けるため、キャラクター画像上でカーソルが0.3秒間静止した後にインタラクティブアニメーションが開始されます。" },
    "settings.other.support": { id: "Dukungan gambar karakter interaktif:", en: "Interactive character image support:", jp: "インタラクティブキャラクター画像のサポート：" },
    "settings.other.supportHelp": { id: "Atur ke resolusi layar lebih tinggi untuk mendapat dukungan gambar karakter interaktif.\nMinimal 480px (lebar) x 510px (tinggi)", en: "Set to a higher screen resolution to get interactive character image support.\nMinimum 480px (width) x 510px (height)", jp: "インタラクティブキャラクター画像のサポートを得るには、より高い画面解像度に設定してください。\n最小480px（幅）x 510px（高さ）" },
    // About Modal
    "about.p1": { id: "Halaman ini bertujuan untuk menggantikan halaman beranda yang ada pada browser. Terima kasih telah menggunakan.", en: "This page is intended to replace the default browser homepage. Thank you for using it.", jp: "このページは、ブラウザのホームページを置き換えることを目的としています。ご利用いただきありがとうございます。" },
    "about.featuresTitle": { id: "Apa Saja Fitur-Fiturnya?", en: "What are the Features?", jp: "主な機能" },
    "about.f1": { id: "Informasi waktu real-time", en: "Real-time clock information", jp: "リアルタイムの時刻情報" },
    "about.f2": { id: "Penyesuaian tema gelap, terang, atau default perangkat", en: "Light, dark, or system default theme customization", jp: "ライト、ダーク、またはデバイスデフォルトのテーマ調整" },
    "about.f3": { id: "Ilustrasi karakter", en: "Character illustration", jp: "キャラクターイラスト" },
    "about.f4": { id: "Status koneksi internet jika sedang offline", en: "Offline internet connection status", jp: "オフライン時のインターネット接続ステータス" },
    "about.p2": { id: "Untuk info selengkapnya, silahkan download dan kunjungi halaman readme.md.", en: "For more info, please download and visit the readme.md page.", jp: "詳細については、readme.mdページをダウンロードしてご覧ください。" },
    "about.notesTitle": { id: "Catatan", en: "Notes", jp: "注意" },
    "about.n1": { id: "Penerapan fitur tema terang dan gelap hanya berlaku untuk halaman dashboard ini.", en: "The light and dark theme features only apply to this dashboard page.", jp: "ライトおよびダークテーマ機能は、このダッシュボードページにのみ適用されます。" },
    "about.n2": { id: "Pada resolusi layar di atas 930px, arahkan mouse ke karakter untuk melihat lebih dekat.\nCek dukungan gambar karakter interaktif melalui menu \"Pengaturan Lainnya\".", en: "On screen resolutions above 930px, hover the mouse over the character to see it closer.\nCheck for interactive character image support via the \"Other Settings\" menu.", jp: "930px以上の画面解像度では、キャラクターにマウスを合わせると拡大表示されます。\nインタラクティブキャラクター画像のサポートについては、「その他の設定」メニューで確認してください。" },
    "about.creditTitle": { id: "Kredit", en: "Credits", jp: "クレジット" },
    "about.c1": { id: "Font:", en: "Font:", jp: "フォント：" },
    "about.d1": { id: "Poppins - Indian Type Foundry, Jonny Pinhorn, dan Ninad Kale", en: "Poppins - Indian Type Foundry, Jonny Pinhorn, and Ninad Kale", jp: "Poppins（Indian Type Foundry、Jonny Pinhorn、Ninad Kale）" },
    "about.c2": { id: "Font untuk bahasa Jepang:", en: "Japanese font:", jp: "日本語フォント：" },
    "about.d2": { id: "Noto Sans Japanese - Adobe", en: "Noto Sans Japanese - Adobe", jp: "Noto Sans Japanese（Adobe）" },
    "about.c3": { id: "Gambar karakter:", en: "Character image:", jp: "キャラクター画像：" },
    "about.d3": { id: "Google Imagen 4", en: "Google Imagen 4", jp: "Google Imagen 4" },
    "about.c4": { id: "Website di buat oleh:", en: "Website created by:", jp: "ウェブサイト制作：" },
    "about.d4": { id: "Danny Bungai", en: "Danny Bungai", jp: "Danny Bungai" },
    "about.versionTitle": { id: "Versi Website", en: "Website Version", jp: "ウェブ版" },
};

/*
 * ===================================================================
 * B. LOGIKA INTI & UTILITAS
 * ===================================================================
 */

function debounce(func, wait) { let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); }; }
function getBrowserLanguage() { const browserLangs = navigator.languages || [navigator.language]; for (const lang of browserLangs) { const primaryCode = lang.split('-')[0].toLowerCase(); if (supportedLangs.includes(primaryCode)) { return primaryCode; } } return 'en'; }

function translateUI(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n-key]').forEach(el => {
        const key = el.getAttribute('data-i18n-key');
        let translation = i18nData[key]?.[lang] || i18nData[key]?.['id'];
        if (translation) {
            if (el.hasAttribute('data-i18n-value')) {
                const value = el.getAttribute('data-i18n-value');
                translation = translation.replace('{value}', value);
            }
            if (el.hasAttribute('data-tooltip')) {
                el.setAttribute('data-tooltip', translation);
            } else {
                el.textContent = translation;
            }
        }
    });
}

async function saveSetting(key, value) { if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) { await chrome.storage.local.set({ [key]: value }); } else { localStorage.setItem(key, JSON.stringify(value)); } }
async function loadSettings(keys) { if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) { return new Promise((resolve) => { chrome.storage.local.get(keys, (result) => resolve(result)); }); } else { const settings = {}; for (const key of keys) { const value = localStorage.getItem(key); if (value !== null) { try { settings[key] = JSON.parse(value); } catch (e) { settings[key] = value; } } } return Promise.resolve(settings); } }

function updateClock() { const now = new Date(); const hours = String(now.getHours()).padStart(2, "0"); const minutes = String(now.getMinutes()).padStart(2, "0"); if (elements.timeMain) elements.timeMain.textContent = `${hours}:${minutes}`; if (elements.timeSeconds && !elements.body.classList.contains('seconds-hidden')) { const seconds = String(now.getSeconds()).padStart(2, "0"); elements.timeSeconds.textContent = `:${seconds}`; } }
function updateInfrequentElements() {
  const now = new Date(); const hour = now.getHours();
  const greetingLang = languageSettings.greeting; let greetingKey; if (hour >= 5 && hour < 11) greetingKey = "greeting.morning"; else if (hour >= 11 && hour < 15) greetingKey = "greeting.afternoon"; else if (hour >= 15 && hour < 18) greetingKey = "greeting.evening"; else greetingKey = "greeting.night"; if (elements.greeting) { elements.greeting.textContent = i18nData[greetingKey]?.[greetingLang] || i18nData[greetingKey]?.['id']; }
  const descLang = languageSettings.description; const descKey = (hour >= 23 || hour < 4) ? "description.night" : "description.day"; if (elements.description) { elements.description.textContent = i18nData[descKey]?.[descLang] || i18nData[descKey]?.['id']; }
  const dateLang = languageSettings.date; const dateLocale = localeMap[dateLang] || 'id-ID'; const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }; if (elements.date) { elements.date.textContent = now.toLocaleDateString(dateLocale, dateOptions); }
}

function animationLoop() { animationFrameId = requestAnimationFrame(animationLoop); updateClock(); const currentHour = new Date().getHours(); if (currentHour !== lastUpdatedHour) { updateInfrequentElements(); lastUpdatedHour = currentHour; } }
function handleVisibilityChange() { if (document.hidden) { cancelAnimationFrame(animationFrameId); } else { lastUpdatedHour = -1; animationFrameId = requestAnimationFrame(animationLoop); } }

function updateUsernameDisplay() { const lang = languageSettings.ui; const template = i18nData["footer.account"]?.[lang] || i18nData["footer.account"]?.['id']; if (elements.accountMessage && template) { elements.accountMessage.textContent = template.replace('{value}', currentUser); elements.accountMessage.setAttribute('data-i18n-value', currentUser); } }
async function checkRealInternetConnection() { try { await fetch(`https://www.google.com/favicon.ico?_=${new Date().getTime()}`,{method: "HEAD", mode: "no-cors", cache: "no-store"}); return true; } catch (error) { return false; } }
async function updateOfflineStatus() {
  const showOfflineState = () => { if (connectionStatus.offlineMessage) connectionStatus.offlineMessage.classList.add("show"); if (connectionStatus.loadingMessage) connectionStatus.loadingMessage.classList.remove("show"); if (elements.accountMessage) elements.accountMessage.style.display = "none"; };
  const showOnlineState = () => { if (connectionStatus.offlineMessage) connectionStatus.offlineMessage.classList.remove("show"); if (connectionStatus.loadingMessage) connectionStatus.loadingMessage.classList.remove("show"); if (elements.accountMessage) elements.accountMessage.style.display = "inline"; };
  if (navigator.onLine) { if (connectionStatus.loadingMessage) connectionStatus.loadingMessage.classList.add("show"); if (connectionStatus.offlineMessage) connectionStatus.offlineMessage.classList.remove("show"); if (elements.accountMessage) elements.accountMessage.style.display = "none"; const isTrulyOnline = await checkRealInternetConnection(); if (isTrulyOnline) { showOnlineState(); } else { showOfflineState(); } } else { showOfflineState(); }
}

const avatar = document.querySelector(".avatar-full"); let hoverTimeout; const handleSimpleMouseEnter = () => avatar.classList.add('is-zoomed'); const handleSimpleMouseLeave = () => avatar.classList.remove('is-zoomed'); const handleStillnessMouseEnter = () => { hoverTimeout = setTimeout(() => avatar.classList.add('is-zoomed'), 300); }; const handleStillnessMouseMove = () => { clearTimeout(hoverTimeout); hoverTimeout = setTimeout(() => avatar.classList.add('is-zoomed'), 300); }; const handleStillnessMouseLeave = () => { clearTimeout(hoverTimeout); avatar.classList.remove('is-zoomed'); };
function setupAvatarHoverListeners() {
  avatar.removeEventListener('mouseenter', handleSimpleMouseEnter); avatar.removeEventListener('mouseleave', handleSimpleMouseLeave); avatar.removeEventListener('mouseenter', handleStillnessMouseEnter); avatar.removeEventListener('mousemove', handleStillnessMouseMove); avatar.removeEventListener('mouseleave', handleStillnessMouseLeave); avatar.classList.remove('is-zoomed');
  const isAnimationFeatureEnabled = !settingSwitches.avatarAnimation.disabled && settingSwitches.avatarAnimation.checked;
  settingSwitches.detectMouseStillness.disabled = !isAnimationFeatureEnabled;
  if (isAnimationFeatureEnabled) {
      const isStillnessDetectionEnabled = settingSwitches.detectMouseStillness.checked;
      if (isStillnessDetectionEnabled) { avatar.addEventListener('mouseenter', handleStillnessMouseEnter); avatar.addEventListener('mousemove', handleStillnessMouseMove); avatar.addEventListener('mouseleave', handleStillnessMouseLeave); }
      else { avatar.addEventListener('mouseenter', handleSimpleMouseEnter); avatar.addEventListener('mouseleave', handleSimpleMouseLeave); }
  }
}

/*
 * ===================================================================
 * C. LOGIKA UI & MANAJEMEN PENGATURAN
 * ===================================================================
 */

function toggleMenu(event) { event.stopPropagation(); menu.container.classList.toggle("show-menu"); window.scrollTo({ top: 0, behavior: "smooth" }); }
function closeMenuOnClickOutside(event) { if (menu.container && menu.container.classList.contains("show-menu")) { if (!menu.popup.contains(event.target)) { menu.container.classList.remove("show-menu"); } } }
function openModal(overlay) { if (overlay) { overlay.classList.remove("hidden"); const modalBody = overlay.querySelector(".modal-body"); if (modalBody) modalBody.scrollTop = 0; } elements.body.classList.add("modal-open"); }
function closeModal(overlay) { if (overlay) overlay.classList.add("hidden"); elements.body.classList.remove("modal-open"); }
function closeThemeModal() {
  if (themeModal.overlay) {
    themeModal.overlay.classList.add("hidden"); themeModal.overlay.classList.remove("preview-mode");
    if (themeModal.previewCheckbox) themeModal.previewCheckbox.checked = false;
    [usernameModal.openBtn, themeModal.openBtn, aboutModal.openBtn, otherSettingsModal.openBtn].forEach((btn) => { if (btn) btn.disabled = false; });
  }
  elements.body.classList.remove("modal-open");
}

function showFeedback(modalFeedbackElement, messageKey, isError = false) {
    clearTimeout(feedbackTimeout); const lang = languageSettings.ui; const message = i18nData[messageKey]?.[lang] || i18nData[messageKey]?.['id'] || '';
    modalFeedbackElement.textContent = message; modalFeedbackElement.className = 'feedback-text show'; modalFeedbackElement.classList.toggle('error', isError); modalFeedbackElement.classList.toggle('success', !isError);
    feedbackTimeout = setTimeout(() => { modalFeedbackElement.classList.remove('show'); }, 3000);
}

function handleSaveUsername() {
    let newUsername = usernameModal.input.value.trim();
    if (newUsername.length === 0) { newUsername = "K1234"; }
    if (newUsername.length <= 6) { currentUser = newUsername; saveSetting("username", currentUser); updateUsernameDisplay(); showFeedback(usernameModal.feedbackText, "settings.username.feedback.saved", false); setTimeout(() => closeModal(usernameModal.overlay), 500); }
    else { showFeedback(usernameModal.feedbackText, "settings.username.feedback.error", true); }
}

function applyTheme(theme) {
  elements.body.classList.remove("dark-theme", "light-theme"); [themeModal.lightBtn, themeModal.darkBtn, themeModal.systemBtn].forEach((btn) => { if (btn) btn.classList.remove("active"); });
  if (theme === "dark") { elements.body.classList.add("dark-theme"); if (themeModal.darkBtn) themeModal.darkBtn.classList.add("active"); }
  else if (theme === "light") { elements.body.classList.add("light-theme"); if (themeModal.lightBtn) themeModal.lightBtn.classList.add("active"); }
  else { if (themeModal.systemBtn) themeModal.systemBtn.classList.add("active"); }
}

function applyShowSeconds(show) { elements.body.classList.toggle("seconds-hidden", !show); }
function applyMenuBlur(show) { elements.body.classList.toggle("menu-blur-disabled", !show); }
function applyFooterBlur(show) { elements.body.classList.toggle("footer-blur-disabled", !show); }

function applyAvatarFullShow(show) {
  const avatarFull = document.querySelector(".avatar-full"); if (avatarFull) { avatarFull.classList.toggle("hidden", !show); }
  elements.body.classList.toggle("avatar-hidden", !show);
  updateAvatarStatus(); checkResolutionAndToggleMessage();
}

function applyAvatarAnimation(show) { elements.body.classList.toggle("avatar-animation-disabled", !show); updateAvatarStatus(); }

function updateAvatarStatus() {
  if (!avatarStatus.text || !avatarStatus.helpText) return;
  const isSupportedResolution = window.innerWidth > 930;
  const supportedText = { id: "Iya", en: "Yes", jp: "はい" }; const notSupportedText = { id: "Tidak", en: "No", jp: "いいえ" };
  avatarStatus.text.textContent = isSupportedResolution ? supportedText[languageSettings.ui] : notSupportedText[languageSettings.ui];
  avatarStatus.text.className = isSupportedResolution ? "supported" : "not-supported";
  avatarStatus.helpText.classList.toggle("is-hidden", isSupportedResolution);
  const isAvatarFullShown = settingSwitches.avatarFullShow.checked; const isAvatarAnimationOn = settingSwitches.avatarAnimation.checked;
  const disableAnimationSwitches = !isAvatarFullShown || !isSupportedResolution;
  if (settingSwitches.avatarAnimation) { settingSwitches.avatarAnimation.disabled = disableAnimationSwitches; }
  if (settingSwitches.detectMouseStillness) { settingSwitches.detectMouseStillness.disabled = disableAnimationSwitches || !isAvatarAnimationOn; }
  setupAvatarHoverListeners(); checkResolutionAndToggleMessage();
}

function checkResolutionAndToggleMessage() {
  const isAvatarHidden = elements.body.classList.contains("avatar-hidden"); const currentHeight = window.innerHeight; const currentWidth = window.innerWidth; let showUnsupportedMessage = false;
  if (isAvatarHidden) { if (currentWidth <= 480 || currentHeight <= 415) { showUnsupportedMessage = true; } }
  else { if (currentWidth <= 480 || currentHeight <= 510) { showUnsupportedMessage = true; } }
  if (elements.unsupportedResolutionMessage) {
    const mainElements = [ document.querySelector(".info-section"), document.querySelector(".container"), document.querySelector(".footer"), document.querySelector(".hover-dead-zone"), document.querySelector(".hover-dead-zone-top") ];
    const allModals = [usernameModal.overlay, themeModal.overlay, otherSettingsModal.overlay, aboutModal.overlay];
    if (showUnsupportedMessage) {
        elements.unsupportedResolutionMessage.style.display = "flex"; elements.body.style.overflow = "hidden"; mainElements.forEach(el => el ? el.style.display = "none" : null);
        lastActiveModalOverlay = null; allModals.forEach(modal => { if (modal && !modal.classList.contains("hidden")) { lastActiveModalOverlay = modal; modal.classList.add("hidden"); } });
    } else {
        elements.unsupportedResolutionMessage.style.display = "none"; elements.body.style.overflow = ""; mainElements.forEach(el => el ? el.style.display = "" : null);
        if (lastActiveModalOverlay) { lastActiveModalOverlay.classList.remove("hidden"); lastActiveModalOverlay = null; }
    }
  }
}

/*
 * ===================================================================
 * D. INISIALISASI & EVENT LISTENERS
 * ===================================================================
 */

const langDropdowns = ['greeting', 'description', 'date'];
function updateApplyAllState(isApplied) {
    langDropdowns.forEach(type => {
        const container = document.getElementById(`lang-container-${type}`); container.classList.toggle('disabled', isApplied);
        if (isApplied) { languageSettings[type] = languageSettings.ui; }
        updateDropdownDisplay(type);
    });
    if (isApplied) { updateInfrequentElements(); }
}

function updateDropdownDisplay(type) {
    const trigger = document.getElementById(`lang-select-${type}`); if (!trigger) return;
    const optionsContainer = trigger.nextElementSibling; const selectedTextSpan = trigger.querySelector('span:first-child');
    const currentLang = languageSettings[type]; const selectedOption = optionsContainer.querySelector(`[data-value="${currentLang}"]`);
    if (selectedOption) { selectedTextSpan.textContent = selectedOption.textContent; optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected')); selectedOption.classList.add('selected'); }
}

function setupDropdown(type) {
    const trigger = document.getElementById(`lang-select-${type}`); if (!trigger) return;
    const optionsContainer = trigger.nextElementSibling;
    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); if (trigger.closest('.switch-container.disabled')) return;
        document.querySelectorAll('.custom-select-options.show').forEach(openOption => { if(openOption !== optionsContainer) { openOption.classList.remove('show'); openOption.previousElementSibling.classList.remove('open'); } });
        const isShown = optionsContainer.classList.toggle('show'); trigger.classList.toggle('open', isShown);
    });
    optionsContainer.addEventListener('click', (e) => {
        const option = e.target.closest('.custom-option');
        if (option) {
            const newLang = option.getAttribute('data-value'); languageSettings[type] = newLang;
            if (type === 'ui') { translateUI(newLang); updateUsernameDisplay(); updateAvatarStatus(); if (languageSettings.applyToAll) { updateApplyAllState(true); } }
            updateInfrequentElements(); updateDropdownDisplay(type); saveSetting('languageSettings', languageSettings);
            optionsContainer.classList.remove('show'); trigger.classList.remove('open');
        }
    });
    updateDropdownDisplay(type);
}

document.addEventListener("DOMContentLoaded", async () => {
  const keysToLoad = ["username", "theme", "showSeconds", "menuBlur", "footerBlur", "avatarFullShow", "avatarAnimation", "detectMouseStillness", "languageSettings"];
  const settings = await loadSettings(keysToLoad);
  currentUser = settings.username || "K1234";
  if (settings.languageSettings) { languageSettings = { ...languageSettings, ...settings.languageSettings }; }
  else { const browserLang = getBrowserLanguage(); Object.keys(languageSettings).forEach(key => { if(key !== 'applyToAll') languageSettings[key] = browserLang; }); }
  translateUI(languageSettings.ui); updateUsernameDisplay();
  ['ui', ...langDropdowns].forEach(setupDropdown);
  settingSwitches.applyToAll.checked = languageSettings.applyToAll;
  applyTheme(settings.theme || "system");
  const shouldShowSeconds = settings.showSeconds !== false; settingSwitches.showSeconds.checked = shouldShowSeconds;
  const shouldUseMenuBlur = settings.menuBlur !== false; settingSwitches.menuBlur.checked = shouldUseMenuBlur;
  const shouldUseFooterBlur = settings.footerBlur !== false; settingSwitches.footerBlur.checked = shouldUseFooterBlur;
  const shouldShowAvatar = settings.avatarFullShow !== false; settingSwitches.avatarFullShow.checked = shouldShowAvatar;
  const shouldAnimateAvatar = settings.avatarAnimation !== false; settingSwitches.avatarAnimation.checked = shouldAnimateAvatar;
  const shouldDetectStillness = settings.detectMouseStillness !== false; settingSwitches.detectMouseStillness.checked = shouldDetectStillness;
  updateApplyAllState(languageSettings.applyToAll);
  applyShowSeconds(shouldShowSeconds); applyMenuBlur(shouldUseMenuBlur); applyFooterBlur(shouldUseFooterBlur); applyAvatarFullShow(shouldShowAvatar); applyAvatarAnimation(shouldAnimateAvatar);
  updateOfflineStatus(); updateClock(); updateInfrequentElements(); animationFrameId = requestAnimationFrame(animationLoop);
});

window.addEventListener("click", (e) => {
    closeMenuOnClickOutside(e);
    document.querySelectorAll('.custom-select-options.show').forEach(options => {
        const container = options.closest('.custom-select-container');
        if (container && !container.contains(e.target)) { options.classList.remove('show'); options.previousElementSibling.classList.remove('open'); }
    });
});
window.addEventListener("online", updateOfflineStatus); window.addEventListener("offline", updateOfflineStatus);
const debouncedResizeHandler = debounce(() => { updateAvatarStatus(); checkResolutionAndToggleMessage(); }, 250);
window.addEventListener("resize", debouncedResizeHandler);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!usernameModal.overlay.classList.contains("hidden")) closeModal(usernameModal.overlay);
    if (!themeModal.overlay.classList.contains("hidden")) closeThemeModal();
    if (!aboutModal.overlay.classList.contains("hidden")) closeModal(aboutModal.overlay);
    if (!otherSettingsModal.overlay.classList.contains("hidden")) closeModal(otherSettingsModal.overlay);
    document.querySelectorAll('.custom-select-options.show').forEach(options => { options.classList.remove('show'); options.previousElementSibling.classList.remove('open'); });
  }
});
document.addEventListener('visibilitychange', handleVisibilityChange);

if (menu.button) menu.button.addEventListener("click", toggleMenu);

// Event Listeners for Modals
if (usernameModal.openBtn) usernameModal.openBtn.addEventListener("click", () => { usernameModal.input.value = currentUser; usernameModal.feedbackText.classList.remove('show'); openModal(usernameModal.overlay); });
if (usernameModal.closeBtn) usernameModal.closeBtn.addEventListener("click", () => closeModal(usernameModal.overlay));
if (usernameModal.overlay) usernameModal.overlay.addEventListener("click", (event) => { if (event.target === usernameModal.overlay) closeModal(usernameModal.overlay); });
if (usernameModal.saveBtn) usernameModal.saveBtn.addEventListener("click", handleSaveUsername);
if (usernameModal.input) usernameModal.input.addEventListener("keydown", (event) => { if (event.key === "Enter") handleSaveUsername(); });

if (themeModal.openBtn) themeModal.openBtn.addEventListener("click", () => openModal(themeModal.overlay));
if (themeModal.closeBtn) themeModal.closeBtn.addEventListener("click", closeThemeModal);
if (themeModal.overlay) themeModal.overlay.addEventListener("click", (event) => { if (event.target === themeModal.overlay && !themeModal.overlay.classList.contains("preview-mode")) { closeThemeModal(); } });
if (otherSettingsModal.openBtn) otherSettingsModal.openBtn.addEventListener("click", () => { openModal(otherSettingsModal.overlay); updateAvatarStatus(); });
if (otherSettingsModal.closeBtn) otherSettingsModal.closeBtn.addEventListener("click", () => closeModal(otherSettingsModal.overlay));
if (otherSettingsModal.overlay) otherSettingsModal.overlay.addEventListener("click", (event) => { if (event.target === otherSettingsModal.overlay) closeModal(otherSettingsModal.overlay); });
if (aboutModal.openBtn) aboutModal.openBtn.addEventListener("click", () => openModal(aboutModal.overlay));
if (aboutModal.closeBtn) aboutModal.closeBtn.addEventListener("click", () => closeModal(aboutModal.overlay));
if (aboutModal.overlay) aboutModal.overlay.addEventListener("click", (event) => { if (event.target === aboutModal.overlay) closeModal(aboutModal.overlay); });

// Event Listeners for Settings
if (themeModal.lightBtn) themeModal.lightBtn.addEventListener("click", () => { applyTheme("light"); saveSetting("theme", "light"); });
if (themeModal.darkBtn) themeModal.darkBtn.addEventListener("click", () => { applyTheme("dark"); saveSetting("theme", "dark"); });
if (themeModal.systemBtn) themeModal.systemBtn.addEventListener("click", () => { applyTheme("system"); saveSetting("theme", "system"); });
if (themeModal.previewCheckbox) themeModal.previewCheckbox.addEventListener("change", () => {
    const isPreviewing = themeModal.previewCheckbox.checked;
    elements.body.classList.toggle("modal-open", !isPreviewing);
    themeModal.overlay.classList.toggle("preview-mode", isPreviewing);
    [usernameModal.openBtn, themeModal.openBtn, aboutModal.openBtn, otherSettingsModal.openBtn,].forEach((btn) => { if (btn) btn.disabled = isPreviewing; });
});

if (settingSwitches.applyToAll) { settingSwitches.applyToAll.addEventListener('change', (e) => { const isChecked = e.target.checked; languageSettings.applyToAll = isChecked; updateApplyAllState(isChecked); saveSetting('languageSettings', languageSettings); }); }
if (settingSwitches.showSeconds) settingSwitches.showSeconds.addEventListener("change", (e) => { applyShowSeconds(e.target.checked); saveSetting("showSeconds", e.target.checked); });
if (settingSwitches.menuBlur) settingSwitches.menuBlur.addEventListener("change", (e) => { applyMenuBlur(e.target.checked); saveSetting("menuBlur", e.target.checked); });
if (settingSwitches.footerBlur) settingSwitches.footerBlur.addEventListener("change", (e) => { applyFooterBlur(e.target.checked); saveSetting("footerBlur", e.target.checked); });
if (settingSwitches.avatarFullShow) settingSwitches.avatarFullShow.addEventListener("change", (e) => { applyAvatarFullShow(e.target.checked); saveSetting("avatarFullShow", e.target.checked); });
if (settingSwitches.avatarAnimation) settingSwitches.avatarAnimation.addEventListener("change", (e) => { applyAvatarAnimation(e.target.checked); saveSetting("avatarAnimation", e.target.checked); });
if (settingSwitches.detectMouseStillness) settingSwitches.detectMouseStillness.addEventListener("change", (e) => { saveSetting("detectMouseStillness", e.target.checked); setupAvatarHoverListeners(); });