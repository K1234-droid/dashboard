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
    accountMessage: document.getElementById("account-message"),
    toast: document.getElementById('toast-notification'),
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
  
  // ==================== DEFINISI ELEMEN FITUR PIN & PROMPT ====================
  const pinSettings = {
      input: document.getElementById('pin-input'),
      feedbackText: document.getElementById('pin-feedback'),
      updateBtn: document.getElementById('update-pin-btn'),
      container: document.getElementById('pin-settings-container'),
  };
  
  const createPinModal = {
      overlay: document.getElementById('create-pin-modal-overlay'),
      closeBtn: document.getElementById('close-create-pin-modal-btn'),
      input: document.getElementById('create-pin-input'),
      saveBtn: document.getElementById('save-initial-pin-btn'),
      feedbackText: document.getElementById('create-pin-feedback'),
  };
  
  const pinEnterModal = {
      overlay: document.getElementById('pin-enter-modal-overlay'),
      closeBtn: document.getElementById('close-pin-enter-modal-btn'),
      input: document.getElementById('pin-enter-input'),
      submitBtn: document.getElementById('submit-pin-btn'),
      feedbackText: document.getElementById('pin-enter-feedback'),
      title: document.querySelector('#pin-enter-modal-overlay h3'),
      label: document.querySelector('#pin-enter-modal-overlay label'),
  };
  
  const promptModal = {
      overlay: document.getElementById('prompt-modal-overlay'),
      closeBtn: document.getElementById('close-prompt-modal-btn'),
      grid: document.getElementById('prompt-grid'),
      storageBar: document.getElementById('storage-bar'),
      storageText: document.getElementById('storage-text'),
      content: document.querySelector('#prompt-modal-overlay .modal-content'),
      manageBtn: document.getElementById('prompt-manage-btn'),
      manageBar: document.getElementById('prompt-manage-bar'),
      selectCount: document.getElementById('prompt-select-count'),
      selectAllBtn: document.getElementById('prompt-select-all-btn'),
      deleteSelectedBtn: document.getElementById('prompt-delete-selected-btn'),
      cancelManageBtn: document.getElementById('prompt-cancel-manage-btn'),
  };
  
  const promptViewerModal = {
      overlay: document.getElementById('prompt-viewer-modal-overlay'),
      closeBtn: document.getElementById('close-prompt-viewer-modal-btn'),
      text: document.getElementById('prompt-viewer-text'),
      copyBtn: document.getElementById('copy-prompt-btn'),
      deleteBtn: document.getElementById('delete-prompt-btn'),
      editBtn: document.getElementById('edit-prompt-btn'),
  };
  
  const addEditPromptModal = {
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
  
  const confirmationModal = {
      overlay: document.getElementById('confirmation-modal-overlay'),
      closeBtn: document.getElementById('close-confirmation-modal-btn'),
      title: document.getElementById('confirmation-modal-title'),
      text: document.getElementById('confirmation-modal-text'),
      cancelBtn: document.getElementById('cancel-confirmation-btn'),
      confirmBtn: document.getElementById('confirm-confirmation-btn'),
  };
  
  const infoModal = {
      overlay: document.getElementById('info-modal-overlay'),
      title: document.getElementById('info-modal-title'),
      text: document.getElementById('info-modal-text'),
      closeBtn: document.getElementById('close-info-modal-btn'),
  };

  const howItWorksModal = {
      overlay: document.getElementById('how-it-works-modal-overlay'),
      openBtn: document.getElementById('how-it-works-btn'),
      closeBtn: document.getElementById('close-how-it-works-modal-btn'),
  };
  
  const imageViewerModal = {
      overlay: document.getElementById('image-viewer-modal-overlay'),
      closeBtn: document.getElementById('close-image-viewer-modal-btn'),
      image: document.getElementById('full-image-viewer'),
  };
  // ===================================================================================
  
  
  // Elemen-elemen untuk switch pengaturan.
  const settingSwitches = {
    showSeconds: document.getElementById("show-seconds-switch"),
    menuBlur: document.getElementById("blur-menu-switch"),
    footerBlur: document.getElementById("blur-footer-switch"),
    avatarFullShow: document.getElementById("avatar-full-show"),
    avatarAnimation: document.getElementById("avatar-animation-switch"),
    detectMouseStillness: document.getElementById("detect-mouse-stillness-switch"),
    applyToAll: document.getElementById("apply-to-all-switch"),
    hiddenFeature: document.getElementById('hidden-feature-switch'),
  };
  
  // Elemen-elemen terkait status animasi avatar.
  const avatarStatus = {
    text: document.getElementById("avatar-status-text"),
    helpText: document.getElementById("avatar-help-text"),
  };
  
  // --- State & Data ---
  let currentUser = "K1234";
  let userPIN = null;
  let prompts = [];
  let currentPromptId = null;
  let activePromptMenu = null;
  let activeModalStack = []; 
  let pinModalPurpose = 'login'; // 'login', 'update', 'disable'
  let tempNewPIN = null;
  let confirmationModalPurpose = 'deletePrompt'; // 'deletePrompt', 'disableFeature', 'deleteSelectedPrompts'
  let toastTimeout;
  let isManageModeActive = false;
  let selectedPromptIds = [];
  let sortableInstance = null;
  
  let languageSettings = {
      ui: 'id',
      greeting: 'id',
      description: 'id',
      date: 'id',
      applyToAll: true,
  };
  
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
      "description.night": { id: "Jangan lupa istahat karena sudah malam :)", en: "It's late, don't forget to rest :)", jp: "夜遅いですので、休むことを忘れないでください :)" },
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
      "settings.security.pinLabel": { id: "Buat/Ubah PIN Prompt Karakter (4 digit)", en: "Create/Change Character Prompt PIN (4 digits)", jp: "キャラクタープロンプトPINの作成/変更（4桁）" },
      "pin.enter.title": { id: "Masukkan PIN", en: "Enter PIN", jp: "PINを入力" },
      "pin.enter.label": { id: "PIN 4 Digit", en: "4-Digit PIN", jp: "4桁のPIN" },
      "pin.enter.submit": { id: "Masuk", en: "Enter", jp: "入力" },
      "prompt.delete.title": { id: "Konfirmasi Hapus", en: "Confirm Deletion", jp: "削除の確認" },
      "prompt.delete.text": { id: "Apakah Anda yakin ingin menghapus prompt ini? Tindakan ini tidak dapat diurungkan.", en: "Are you sure you want to delete this prompt? This action cannot be undone.", jp: "このプロンプトを削除してもよろしいですか？この操作は元に戻せません。" },
      "prompt.delete.selectedText": { id: "Apakah Anda yakin ingin menghapus {count} prompt yang dipilih? Tindakan ini tidak dapat diurungkan.", en: "Are you sure you want to delete the {count} selected prompts? This action cannot be undone.", jp: "選択した{count}個のプロンプトを削除してもよろしいですか？この操作は元に戻せません。" },
      "prompt.delete.cancel": { id: "Batal", en: "Cancel", jp: "キャンセル" },
      "prompt.delete.confirm": { id: "Ya, Hapus", en: "Yes, Delete", jp: "はい、削除します" },
      "settings.pin.feedback.saved": { id: "PIN berhasil disimpan!", en: "PIN saved successfully!", jp: "PINを保存しました！" },
      "settings.pin.feedback.removed": { id: "PIN berhasil dihapus.", en: "PIN removed successfully.", jp: "PINを削除しました。" },
      "settings.pin.feedback.error": { id: "PIN harus 4 digit angka.", en: "PIN must be 4 digits.", jp: "PINは4桁の数字にしてください。" },
      "settings.pin.feedback.wrong": { id: "PIN salah. Coba lagi.", en: "Incorrect PIN. Try again.", jp: "PINが間違っています。もう一度お試しください。" },
      "prompt.copy.success": { id: "Teks berhasil disalin!", en: "Text copied successfully!", jp: "テキストをコピーしました！" },
      "prompt.save.success": { id: "Prompt berhasil disimpan!", en: "Prompt saved successfully!", jp: "プロンプトが正常に保存されました！" },
      "prompt.edit.success": { id: "Prompt berhasil diedit!", en: "Prompt edited successfully!", jp: "プロンプトが正常に編集されました！" },
      "prompt.delete.success": { id: "Prompt berhasil dihapus!", en: "Prompt deleted successfully!", jp: "プロンプトが正常に削除されました！" },
      "prompt.listTitle": { id: "Prompt Karakter AI", en: "AI Character Prompts", jp: "AIキャラクタープロンプト" },
      "prompt.detailTitle": { id: "Detail Prompt", en: "Prompt Details", jp: "プロンプト詳細" },
      "prompt.addTitle": { id: "Tambah Prompt Baru", en: "Add New Prompt", jp: "新しいプロンプトを追加" },
      "prompt.editTitle": { id: "Edit Prompt", en: "Edit Prompt", jp: "プロンプトを編集" },
      "prompt.saveChanges": { id: "Simpan Perubahan", en: "Save Changes", jp: "変更を保存" },
      "prompt.saving": { id: "Menyimpan...", en: "Saving...", jp: "保存中..." },
      "prompt.edit.imageLabel": { id: "Pilih File Gambar dari perangkat", en: "Select Image File from device", jp: "デバイスから画像ファイルを選択" },
      "prompt.edit.imageHelp": { id: "Kosongkan jika tidak ingin mengubah gambar sampul.", en: "Leave empty if you don't want to change the cover image.", jp: "カバー画像を変更しない場合は空のままにしてください。" },
      "prompt.edit.textLabel": { id: "Teks Prompt", en: "Prompt Text", jp: "プロンプトテキスト" },
      "prompt.menu.view": { id: "Tampilkan Gambar Penuh", en: "View Full Image", jp: "画像全体を表示" },
      "prompt.menu.copy": { id: "Salin Teks", en: "Copy Text", jp: "テキストをコピー" },
      "prompt.menu.edit": { id: "Edit", en: "Edit", jp: "編集" },
      "prompt.menu.delete": { id: "Hapus", en: "Delete", jp: "削除" },
      "prompt.manage": { id: "Kelola", en: "Manage", jp: "管理" },
      "prompt.selectCount": { id: "Pilih ({count})", en: "Select ({count})", jp: "選択 ({count})" },
      "prompt.selectAll": { id: "Pilih Semua", en: "Select All", jp: "すべて選択" },
      "prompt.deselectAll": { id: "Batal Pilih Semua", en: "Deselect All", jp: "選択をすべて解除" },
      "info.success.title": { id: "Berhasil", en: "Success", jp: "成功" },
      "info.attention.title": { id: "Perhatian", en: "Attention", jp: "注意" },
      "prompt.add.fieldsRequired": { id: "Gambar dan teks prompt tidak boleh kosong.", en: "Image and prompt text cannot be empty.", jp: "画像とプロンプトテキストは空にできません。" },
      "prompt.edit.textRequired": { id: "Teks prompt tidak boleh kosong.", en: "Prompt text cannot be empty.", jp: "プロンプトテキストは空にできません。" },
      "prompt.save.fileError": { id: "Terjadi kesalahan saat memproses file.", en: "An error occurred while processing the file.", jp: "ファイルの処理中にエラーが発生しました。" },
      "prompt.save.storageError": { id: "Gagal menyimpan. Penyimpanan browser penuh. Coba gunakan gambar yang lebih kecil atau hapus prompt lama.", en: "Save failed. Browser storage is full. Try using smaller images or deleting old prompts.", jp: "保存に失敗しました。ブラウザのストレージがいっぱいです。小さい画像を使用するか、古いプロンプトを削除してください。" },
      "prompt.storage.label": { id: "Penyimpanan Lokal", en: "Local Storage", jp: "ローカルストレージ" },
      "prompt.storage.loading": { id: "Memuat...", en: "Loading...", jp: "読み込み中..." },
      "prompt.storage.status": { id: "{current} / {total}", en: "{current} / {total}", jp: "{current} / {total}" },
      "prompt.storage.error": { id: "Gagal memuat info", en: "Failed to load info", jp: "情報の読み込みに失敗しました" },
      "prompt.storage.preview": { id: "{current} &rarr; {after} / {total}", en: "{current} &rarr; {after} / {total}", jp: "{current} &rarr; {after} / {total}" },
      "settings.hidden.title": { id: "Fitur Tersembunyi", en: "Hidden Feature", jp: "隠し機能" },
      "settings.hidden.enable": { id: "Aktifkan Fitur Tersembunyi", en: "Enable Hidden Feature", jp: "隠し機能を有効にする" },
      "settings.hidden.updatePin": { id: "Perbarui PIN", en: "Update PIN", jp: "PINを更新" },
      "settings.hidden.createPin": { id: "Buat PIN", en: "Create PIN", jp: "PINを作成" },
      "hiddenFeature.howItWorks.title": { id: "Cara Kerja Fitur Tersembunyi", en: "How the Hidden Feature Works", jp: "隠し機能の仕組み" },
      "hiddenFeature.howItWorks.button": { id: "Cara Kerja", en: "How it Works", jp: "仕組み" },
      "hiddenFeature.howItWorks.p1": { id: "Tekan dua kali pada avatar pojok kanan bawah.", en: "Double-click the avatar in the bottom right corner.", jp: "右下の角にあるアバターをダブルクリックします。" },
      "hiddenFeature.howItWorks.p2": { id: "Perhatikan bahwa fitur ini akan menggunakan penyimpanan bawaan browser maksimal 5 MB.", en: "Note that this feature will use the browser's built-in storage up to a maximum of 5 MB.", jp: "この機能は、ブラウザの組み込みストレージを最大5MBまで使用することにご注意ください。" },
      "settings.hidden.disableWarningTitle": { id: "Nonaktifkan Fitur Tersembunyi?", en: "Disable Hidden Feature?", jp: "隠し機能を無効にしますか？" },
      "settings.hidden.disableWarningText": { id: "Menonaktifkan fitur ini akan menghapus PIN dan semua prompt karakter Anda secara permanen. Apakah Anda yakin?", en: "Disabling this feature will permanently delete your PIN and all character prompts. Are you sure?", jp: "この機能を無効にすると、PINとすべてのキャラクタープロンプトが完全に削除されます。よろしいですか？" },
      "settings.hidden.pinUpdated": { id: "PIN berhasil diperbarui!", en: "PIN updated successfully!", jp: "PINが正常に更新されました！" },
      "settings.hidden.disabled": { id: "Fitur dinonaktifkan dan semua data telah dihapus.", en: "Feature disabled and all data has been deleted.", jp: "機能が無効になり、すべてのデータが削除されました。" },
      "pin.enter.confirmUpdate": { id: "Konfirmasi PIN Lama", en: "Confirm Old PIN", jp: "古いPINの確認" },
      "pin.enter.confirmUpdateLabel": { id: "Masukkan PIN lama Anda untuk melanjutkan", en: "Enter your old PIN to continue", jp: "続行するには古いPINを入力してください" },
      "pin.enter.confirmDisable": { id: "Konfirmasi Penghapusan", en: "Confirm Deletion", jp: "削除の確認" },
      "pin.enter.confirmDisableLabel": { id: "Masukkan PIN untuk menghapus semua data", en: "Enter PIN to delete all data", jp: "すべてのデータを削除するにはPINを入力してください" },
      "pin.create.title": { id: "Buat PIN Keamanan", en: "Create Security PIN", jp: "セキュリティPINの作成" },
      "pin.create.description": { id: "PIN akan digunakan untuk melindungi dan mengakses fitur tersembunyi.", en: "The PIN will be used to protect and access hidden features.", jp: "PINは隠し機能の保護とアクセスに使用されます。" },
      "prompt.dnd.notImage": { id: "Hanya file gambar yang didukung.", en: "Only image files are supported.", jp: "画像ファイルのみがサポートされています。" },
      "prompt.dnd.dropHere": { id: "Jatuhkan gambar untuk menambah prompt baru", en: "Drop image to add a new prompt", jp: "画像をドロップして新しいプロンプトを追加" },
      "info.longPath.title": { 
          id: "Gagal Memuat File", 
          en: "Failed to Load File", 
          jp: "ファイルの読み込みに失敗しました" 
      },
      "info.longPath.text": { 
          id: "File tidak bisa dimuat karena lokasinya terlalu dalam (nama folder atau path terlalu panjang).\nSilakan gunakan tombol 'Pilih File' untuk membuka gambar ini.", 
          en: "The file could not be loaded because its location is too deep (the folder name or path is too long).\nPlease use the 'Choose File' button to open this image.", 
          jp: "場所が深すぎる（フォルダ名またはパスが長すぎます）ため、ファイルを読み込めませんでした。\n「ファイルを選択」ボタンを使用してこの画像を開いてください。"
      }
  };
  
  /*
   * ===================================================================
   * B. LOGIKA INTI & UTILITAS
   * ===================================================================
   */
  
  function debounce(func, wait) { let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); }; }
  function getBrowserLanguage() { const browserLangs = navigator.languages || [navigator.language]; for (const lang of browserLangs) { const primaryCode = lang.split('-')[0].toLowerCase(); if (supportedLangs.includes(primaryCode)) { return primaryCode; } } return 'en'; }
  
  function showToast(messageKey) {
      if (!elements.toast) return;
      clearTimeout(toastTimeout);
      const lang = languageSettings.ui;
      const message = i18nData[messageKey]?.[lang] || i18nData[messageKey]?.['id'] || messageKey;
      elements.toast.textContent = message;
      elements.toast.classList.add('show');
      toastTimeout = setTimeout(() => {
          elements.toast.classList.remove('show');
      }, 2500);
  }
  
  /**
   * Membaca file sebagai Data URL menggunakan Promise.
   * @param {File} file - File yang akan dibaca.
   * @returns {Promise<string>} Sebuah Promise yang akan resolve dengan Data URL file.
   */
  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
  
  function formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
  async function updateStorageIndicator() {
      const lang = languageSettings.ui;
      try {
          const settings = await loadSettings(['prompts']);
          const promptsData = JSON.stringify(settings.prompts || []);
          
          const currentBytes = new Blob([promptsData]).size;
          const totalBytes = 5 * 1024 * 1024;
          const percentage = (currentBytes / totalBytes) * 100;
  
          if (promptModal.storageBar && promptModal.storageText) {
              const statusTextFormat = i18nData["prompt.storage.status"][lang] || "{current} / {total}";
              const statusText = statusTextFormat
                  .replace("{current}", formatBytes(currentBytes))
                  .replace("{total}", "5 MB");
              
              promptModal.storageText.innerHTML = statusText;
              promptModal.storageBar.style.width = `${Math.min(percentage, 100)}%`;
              promptModal.storageBar.classList.remove('warning', 'danger');
  
              if (percentage > 95) {
                  promptModal.storageBar.classList.add('danger');
              } else if (percentage > 80) {
                  promptModal.storageBar.classList.add('warning');
              }
          }
      } catch (e) {
          console.error("Gagal menghitung penggunaan penyimpanan:", e);
          if(promptModal.storageText) {
              promptModal.storageText.textContent = i18nData["prompt.storage.error"][lang] || "Failed to load info";
          }
      }
  }
  
  async function updateEditStorageIndicator(newFile = null) {
      const lang = languageSettings.ui;
      try {
          const promptsData = JSON.stringify(prompts || []);
          let currentBytes = new Blob([promptsData]).size;
          let finalBytes = currentBytes;
          const totalBytes = 5 * 1024 * 1024;
          let isSizeChanging = false;
  
          if (newFile) {
              isSizeChanging = true;
              let imageSizeChange = newFile.size * (4 / 3);
  
              if (currentPromptId) {
                  const oldPrompt = prompts.find(p => p.id === currentPromptId);
                  if (oldPrompt && oldPrompt.imageUrl.startsWith('data:image')) {
                      const oldImageBytes = oldPrompt.imageUrl.length;
                      imageSizeChange -= oldImageBytes;
                  }
              }
              finalBytes = currentBytes + imageSizeChange;
          }
  
          const finalPercentage = (finalBytes / totalBytes) * 100;
  
          if (addEditPromptModal.storageBar && addEditPromptModal.storageText) {
              let textToShow;
              if (isSizeChanging) {
                  const format = i18nData["prompt.storage.preview"][lang] || "{current} &rarr; {after} / {total}";
                  textToShow = format.replace("{current}", formatBytes(currentBytes))
                                     .replace("{after}", formatBytes(finalBytes))
                                     .replace("{total}", "5 MB");
              } else {
                  const format = i18nData["prompt.storage.status"][lang] || "{current} / {total}";
                  textToShow = format.replace("{current}", formatBytes(currentBytes))
                                     .replace("{total}", "5 MB");
              }
  
              addEditPromptModal.storageText.innerHTML = textToShow;
              addEditPromptModal.storageBar.style.width = `${Math.min(finalPercentage, 100)}%`;
              addEditPromptModal.storageBar.classList.remove('warning', 'danger');
  
              if (finalPercentage > 95) {
                  addEditPromptModal.storageBar.classList.add('danger');
              } else if (finalPercentage > 80) {
                  addEditPromptModal.storageBar.classList.add('warning');
              }
          }
      } catch (e) {
          console.error("Gagal menghitung pratinjau penyimpanan:", e);
          if(addEditPromptModal.storageText) {
              addEditPromptModal.storageText.textContent = i18nData["prompt.storage.error"][lang] || "Failed to load info";
          }
      }
  }

  async function updateStorageIndicatorForDeletion() {
    const lang = languageSettings.ui;
    try {
        const promptsData = JSON.stringify(prompts || []);
        const currentBytes = new Blob([promptsData]).size;
        const totalBytes = 5 * 1024 * 1024;
        let finalBytes = currentBytes;
        let isSizeChanging = false;

        if (selectedPromptIds.length > 0) {
            isSizeChanging = true;
            const remainingPrompts = prompts.filter(p => !selectedPromptIds.includes(p.id));
            finalBytes = new Blob([JSON.stringify(remainingPrompts)]).size;
        }

        const finalPercentage = (finalBytes / totalBytes) * 100;
        let textToShow;

        if (isSizeChanging) {
            const format = i18nData["prompt.storage.preview"][lang] || "{current} &rarr; {after} / {total}";
            textToShow = format.replace("{current}", formatBytes(currentBytes))
                               .replace("{after}", formatBytes(finalBytes))
                               .replace("{total}", "5 MB");
        } else {
            const format = i18nData["prompt.storage.status"][lang] || "{current} / {total}";
            textToShow = format.replace("{current}", formatBytes(currentBytes))
                               .replace("{total}", "5 MB");
        }

        promptModal.storageText.innerHTML = textToShow;
        promptModal.storageBar.style.width = `${Math.min(finalPercentage, 100)}%`;
        promptModal.storageBar.classList.remove('warning', 'danger');

        if (finalPercentage > 95) {
            promptModal.storageBar.classList.add('danger');
        } else if (finalPercentage > 80) {
            promptModal.storageBar.classList.add('warning');
        }

    } catch (e) {
        console.error("Gagal menghitung pratinjau penghapusan:", e);
         if(promptModal.storageText) {
            promptModal.storageText.textContent = i18nData["prompt.storage.error"][lang] || "Failed to load info";
        }
    }
}
  
  
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
      const promptModalContent = document.querySelector('#prompt-modal-overlay .modal-content');
      if (promptModalContent) {
          const dropText = i18nData["prompt.dnd.dropHere"]?.[lang] || i18nData["prompt.dnd.dropHere"]?.['id'] || '';
          promptModalContent.setAttribute('data-drop-text', dropText);
      }
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
  
  function showInfoModal(titleKey, messageKey) {
      const lang = languageSettings.ui;
      const translatedTitle = i18nData[titleKey]?.[lang] || titleKey;
      const translatedMessage = i18nData[messageKey]?.[lang] || messageKey;
      infoModal.title.textContent = translatedTitle;
      infoModal.text.textContent = translatedMessage;
      openModal(infoModal.overlay);
  }
  
  function showPromptContextMenu(event) {
    closeAllPromptMenus();
    
    const btn = event.currentTarget;
    const menuEl = btn.nextElementSibling;
    if (!menuEl) return;

    const btnRect = btn.getBoundingClientRect();

    menuEl._originalParent = btn.parentNode;
    document.body.appendChild(menuEl);

    menuEl.style.position = 'fixed';
    menuEl.style.zIndex = '102'; 
    menuEl.classList.add('show');
    
    const menuHeight = menuEl.offsetHeight;
    const windowHeight = window.innerHeight;

    if (btnRect.bottom + menuHeight + 4 > windowHeight) {
        menuEl.style.top = `${btnRect.top - menuHeight - 4}px`;
    } else {
        menuEl.style.top = `${btnRect.bottom + 4}px`;
    }

    const menuWidth = menuEl.offsetWidth;
    let menuLeft = btnRect.right - menuWidth;

    if (menuLeft < 0) {
        menuLeft = btnRect.left;
    }

    menuEl.style.left = `${menuLeft}px`; 

    activePromptMenu = menuEl;
}
  
  function closeAllPromptMenus() {
      if (activePromptMenu) {
          if (activePromptMenu._originalParent) {
              activePromptMenu.style.position = '';
              activePromptMenu.style.zIndex = '';
              activePromptMenu.style.top = '';
              activePromptMenu.style.left = '';
              activePromptMenu.classList.remove('show');
              activePromptMenu._originalParent.appendChild(activePromptMenu);
          }
          activePromptMenu = null;
      }
  }
  
  function renderPrompts() {
    promptModal.grid.innerHTML = '';
    const lang = languageSettings.ui;
  
    prompts.forEach(p => {
        const item = document.createElement('div');
        item.className = 'prompt-item';
        item.dataset.id = p.id;
  
        const img = document.createElement('img');
        img.src = p.imageUrl;
        img.alt = 'Prompt Image';
        img.className = 'prompt-item-img';
        img.loading = 'lazy';
        item.appendChild(img);
  
        const menuBtn = document.createElement('button');
        menuBtn.className = 'prompt-item-menu-btn';
        menuBtn.innerHTML = '&#8942;';
        
        menuBtn.onclick = showPromptContextMenu;
  
        const menuContainer = document.createElement('div');
        menuContainer.className = 'prompt-item-menu';
        menuContainer.dataset.id = p.id;
        menuContainer.innerHTML = `
            <button class="prompt-menu-option" data-action="view-image">${i18nData["prompt.menu.view"][lang] || i18nData["prompt.menu.view"]["id"]}</button>
            <button class="prompt-menu-option" data-action="copy">${i18nData["prompt.menu.copy"][lang] || i18nData["prompt.menu.copy"]["id"]}</button>
            <button class="prompt-menu-option" data-action="edit">${i18nData["prompt.menu.edit"][lang] || i18nData["prompt.menu.edit"]["id"]}</button>
            <button class="prompt-menu-option" data-action="delete">${i18nData["prompt.menu.delete"][lang] || i18nData["prompt.menu.delete"]["id"]}</button>
        `;
  
        item.appendChild(menuBtn);
        item.appendChild(menuContainer);
        
        item.addEventListener('click', (e) => {
            if (isManageModeActive) {
                if (!e.target.closest('.prompt-item-menu-btn')) {
                    togglePromptSelection(p.id);
                }
                return;
            }

            if (e.target.closest('.prompt-item-menu-btn')) {
                return;
            }
            showPromptViewer(p);
        });
  
        promptModal.grid.appendChild(item);
    });
  
    const addBtn = document.createElement('button');
    addBtn.id = 'add-prompt-btn';
    addBtn.className = 'prompt-item add-prompt-item';
    addBtn.innerHTML = '<span>+</span>';
    addBtn.onclick = handleOpenAddPromptModal;
    promptModal.grid.appendChild(addBtn);
  }
  
  function showPromptViewer(prompt) {
      currentPromptId = prompt.id;
      promptViewerModal.text.textContent = prompt.text;
      openModal(promptViewerModal.overlay);
  }
  
  function showFullImage(promptId) {
      const prompt = prompts.find(p => p.id === promptId);
      if (prompt) {
          imageViewerModal.image.src = prompt.imageUrl;
          openModal(imageViewerModal.overlay);
      }
  }
  
  async function copyPromptTextFromItem(promptId) {
      const prompt = prompts.find(p => p.id === promptId);
      if (prompt) {
          try {
              await navigator.clipboard.writeText(prompt.text);
              showToast("prompt.copy.success");
          } catch (err) {
              console.error('Gagal menyalin teks: ', err);
          }
      }
  }
  
  async function copyPromptTextFromViewer() {
      try {
          await navigator.clipboard.writeText(promptViewerModal.text.textContent);
          showToast("prompt.copy.success");
      } catch (err) {
          console.error('Gagal menyalin teks: ', err);
      }
  }
  
  
  /*
   * ===================================================================
   * C. LOGIKA UI & MANAJEMEN PENGATURAN
   * ===================================================================
   */
  
  function toggleMenu(event) { event.stopPropagation(); menu.container.classList.toggle("show-menu"); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function closeMenuOnClickOutside(event) { if (menu.container && menu.container.classList.contains("show-menu")) { if (!menu.popup.contains(event.target)) { menu.container.classList.remove("show-menu"); } } }
  
  function openModal(overlay) { 
      if (overlay) { 
          overlay.classList.remove("hidden"); 
          activeModalStack.push(overlay);
          const modalBody = overlay.querySelector(".modal-body"); 
          if (modalBody) modalBody.scrollTop = 0; 
      } 
      elements.body.classList.add("modal-open"); 
  }
  
  function closeModal(overlay) { 
      if (overlay) {
          overlay.classList.add("hidden");
          activeModalStack = activeModalStack.filter(modal => modal !== overlay);
      }
      if (activeModalStack.length === 0) {
          elements.body.classList.remove("modal-open");
      }
  }
  
  function closeThemeModal() {
    if (themeModal.overlay) {
      themeModal.overlay.classList.add("hidden"); 
      themeModal.overlay.classList.remove("preview-mode");
      activeModalStack = activeModalStack.filter(modal => modal !== themeModal.overlay);
      if (themeModal.previewCheckbox) themeModal.previewCheckbox.checked = false;
      [usernameModal.openBtn, themeModal.openBtn, aboutModal.openBtn, otherSettingsModal.openBtn].forEach((btn) => { if (btn) btn.disabled = false; });
    }
    if (activeModalStack.length === 0) {
      elements.body.classList.remove("modal-open");
    }
  }
  
  function showFeedback(modalFeedbackElement, messageKey, isError = false) {
      clearTimeout(feedbackTimeout); const lang = languageSettings.ui; const message = i18nData[messageKey]?.[lang] || i18nData[messageKey]?.['id'] || '';
      modalFeedbackElement.textContent = message; modalFeedbackElement.className = 'feedback-text show'; modalFeedbackElement.classList.toggle('error', isError); modalFeedbackElement.classList.toggle('success', !isError);
      feedbackTimeout = setTimeout(() => { modalFeedbackElement.classList.remove('show'); }, 3000);
  }
  
  async function handleSaveUsername() {
      let newUsername = usernameModal.input.value.trim();
      if (newUsername.length === 0) { newUsername = "K1234"; }
      if (newUsername.length <= 6) { 
          currentUser = newUsername; 
          await saveSetting("username", currentUser); 
          updateUsernameDisplay(); 
          showFeedback(usernameModal.feedbackText, "settings.username.feedback.saved", false); 
          setTimeout(() => closeModal(usernameModal.overlay), 500); 
      }
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
    const lang = languageSettings.ui;
    avatarStatus.text.textContent = isSupportedResolution ? supportedText[lang] || supportedText['id'] : notSupportedText[lang] || notSupportedText['id'];
    avatarStatus.text.className = isSupportedResolution ? "supported" : "not-supported";
    avatarStatus.helpText.classList.toggle("is-hidden", isSupportedResolution);
    const isAvatarFullShown = settingSwitches.avatarFullShow.checked; const isAvatarAnimationOn = settingSwitches.avatarAnimation.checked;
    const disableAnimationSwitches = !isAvatarFullShown || !isSupportedResolution;
    if (settingSwitches.avatarAnimation) { settingSwitches.avatarAnimation.disabled = disableAnimationSwitches; }
    if (settingSwitches.detectMouseStillness) { settingSwitches.detectMouseStillness.disabled = disableAnimationSwitches || !isAvatarAnimationOn; }
    setupAvatarHoverListeners(); checkResolutionAndToggleMessage();
  }
  
  function checkResolutionAndToggleMessage() {
    // Fungsi ini sengaja dikosongkan untuk menonaktifkan pemeriksaan resolusi.
  }
  
  function handleUpdatePin() {
      const newPin = pinSettings.input.value;
      if (!/^\d{4}$/.test(newPin)) {
          showFeedback(pinSettings.feedbackText, "settings.pin.feedback.error", true);
          return;
      }
  
      if (userPIN) {
          tempNewPIN = newPin;
          pinModalPurpose = 'update';
          const lang = languageSettings.ui;
          pinEnterModal.title.textContent = i18nData["pin.enter.confirmUpdate"][lang];
          pinEnterModal.label.textContent = i18nData["pin.enter.confirmUpdateLabel"][lang];
          openModal(pinEnterModal.overlay);
          pinEnterModal.input.focus();
      } else { 
          userPIN = newPin;
          saveSetting('userPIN', userPIN);
          showToast("settings.pin.feedback.saved");
          pinSettings.input.value = '';
          updateHiddenFeatureUI();
      }
  }
  
  function handleSaveInitialPin() {
      const newPin = createPinModal.input.value;
      if (!/^\d{4}$/.test(newPin)) {
          showFeedback(createPinModal.feedbackText, "settings.pin.feedback.error", true);
          return;
      }
      userPIN = newPin;
      saveSetting('userPIN', userPIN);
      
      showToast("settings.pin.feedback.saved");
      
      createPinModal.input.value = '';
      closeModal(createPinModal.overlay);
      
      settingSwitches.hiddenFeature.checked = true;
      updateHiddenFeatureUI();
  }
  
  function handleDisableFeature() {
      closeModal(confirmationModal.overlay);
      pinModalPurpose = 'disable';
      const lang = languageSettings.ui;
      pinEnterModal.title.textContent = i18nData["pin.enter.confirmDisable"][lang];
      pinEnterModal.label.textContent = i18nData["pin.enter.confirmDisableLabel"][lang];
      openModal(pinEnterModal.overlay);
      pinEnterModal.input.focus();
  }
  
  function handlePinSubmit() {
      const enteredPin = pinEnterModal.input.value;
      const lang = languageSettings.ui;
  
      if (pinModalPurpose === 'login') {
          if (enteredPin === userPIN) {
              pinEnterModal.feedbackText.classList.remove('show');
              pinEnterModal.input.value = '';
              closeModal(pinEnterModal.overlay);
              openModal(promptModal.overlay);
              updateStorageIndicator(); 
          } else {
              showFeedback(pinEnterModal.feedbackText, "settings.pin.feedback.wrong", true);
              pinEnterModal.input.value = '';
          }
      } else if (pinModalPurpose === 'update') {
          if (enteredPin === userPIN) {
              userPIN = tempNewPIN;
              saveSetting('userPIN', userPIN);
              tempNewPIN = null;
              
              pinEnterModal.feedbackText.classList.remove('show');
              pinEnterModal.input.value = '';
              closeModal(pinEnterModal.overlay);
  
              showToast("settings.hidden.pinUpdated");
              pinSettings.input.value = '';
          } else {
              showFeedback(pinEnterModal.feedbackText, "settings.pin.feedback.wrong", true);
              pinEnterModal.input.value = '';
          }
      } else if (pinModalPurpose === 'disable') {
          if (enteredPin === userPIN) {
              userPIN = null;
              prompts = [];
              saveSetting('userPIN', null);
              saveSetting('prompts', []);
              renderPrompts(); 
  
              pinEnterModal.feedbackText.classList.remove('show');
              pinEnterModal.input.value = '';
              closeModal(pinEnterModal.overlay);
  
              showToast("settings.hidden.disabled");
              updateHiddenFeatureUI();
          } else {
              showFeedback(pinEnterModal.feedbackText, "settings.pin.feedback.wrong", true);
              pinEnterModal.input.value = '';
          }
      }
  }
  
  function handleOpenAddPromptModal() {
    currentPromptId = null;
    const lang = languageSettings.ui;
    addEditPromptModal.title.textContent = i18nData["prompt.addTitle"][lang] || i18nData["prompt.addTitle"]["id"];
    addEditPromptModal.saveBtn.textContent = i18nData["settings.username.save"][lang] || i18nData["settings.username.save"]["id"];
    addEditPromptModal.textInput.value = '';
    addEditPromptModal.imageFileInput.value = '';
    
    addEditPromptModal.previewsContainer.classList.add('hidden');
    addEditPromptModal.imagePreviewSingle.classList.add('hidden');
    addEditPromptModal.imagePreviewSingle.src = '';
    addEditPromptModal.imageHelpText.style.display = 'none';

    openModal(addEditPromptModal.overlay);
    updateEditStorageIndicator();
}
  
    function handleEditPrompt(promptId) {
        const promptToEdit = prompts.find(p => p.id === promptId);
        if (!promptToEdit) return;
        currentPromptId = promptId;
        const lang = languageSettings.ui;
        
        addEditPromptModal.title.textContent = i18nData["prompt.editTitle"][lang] || i18nData["prompt.editTitle"]["id"];
        addEditPromptModal.saveBtn.textContent = i18nData["prompt.saveChanges"][lang] || i18nData["prompt.saveChanges"]["id"];
        addEditPromptModal.textInput.value = promptToEdit.text;
        addEditPromptModal.imageFileInput.value = '';

        addEditPromptModal.previewsContainer.classList.remove('hidden');
        addEditPromptModal.imagePreviewOld.src = promptToEdit.imageUrl;
        addEditPromptModal.imagePreviewNew.src = promptToEdit.imageUrl;
        addEditPromptModal.imagePreviewSingle.classList.add('hidden');
        addEditPromptModal.imageHelpText.style.display = 'block';
        
        openModal(addEditPromptModal.overlay);
        updateEditStorageIndicator();
    }
  
  function handleDeletePrompt(promptId) {
      confirmationModalPurpose = 'deletePrompt';
      currentPromptId = promptId;
      const lang = languageSettings.ui;
      confirmationModal.title.textContent = i18nData["prompt.delete.title"][lang];
      confirmationModal.text.textContent = i18nData["prompt.delete.text"][lang];
      openModal(confirmationModal.overlay);
  }
  
  async function confirmDelete() {
    try {
        const promptModalBody = promptModal.overlay.querySelector('.modal-body');
        const scrollPosition = promptModalBody.scrollTop;

        if (confirmationModalPurpose === 'deleteSelectedPrompts') {
            prompts = prompts.filter(p => !selectedPromptIds.includes(p.id));
        } else {
            prompts = prompts.filter(p => p.id !== currentPromptId);
        }
        
        await saveSetting('prompts', prompts);
        renderPrompts();
        promptModalBody.scrollTop = scrollPosition;

        if (confirmationModalPurpose === 'deleteSelectedPrompts') {
            toggleManageMode(false);
        }

        updateStorageIndicator();
        closeModal(confirmationModal.overlay);
        showToast("prompt.delete.success");
        if(!promptViewerModal.overlay.classList.contains('hidden')) {
            closeModal(promptViewerModal.overlay);
        }
    } catch (error) {
        console.error("Gagal menghapus prompt:", error);
        showInfoModal("info.attention.title", "Terjadi kesalahan saat mencoba menghapus prompt.");
    }
}
  
  async function handleSavePrompt() {
    const saveBtn = addEditPromptModal.saveBtn;
    const originalBtnText = saveBtn.textContent;
    const lang = languageSettings.ui;
    const isEditing = !!currentPromptId;

    saveBtn.disabled = true;
    saveBtn.textContent = i18nData["prompt.saving"][lang] || 'Menyimpan...';

    try {
        const file = addEditPromptModal.imageFileInput.files[0];
        const text = addEditPromptModal.textInput.value.trim();
        
        if (isEditing) {
            if (!text) {
                showInfoModal("info.attention.title", "prompt.edit.textRequired");
                return;
            }
        } else {
            if (!file || !text) {
                showInfoModal("info.attention.title", "prompt.add.fieldsRequired");
                return;
            }
        }

        const tempPrompts = JSON.parse(JSON.stringify(prompts));
        let newImageUrl = null;
        if (file) {
            try {
                newImageUrl = await readFileAsDataURL(file);
            } catch (fileError) {
                console.error("Error reading file:", fileError);
                showInfoModal("info.attention.title", "prompt.save.fileError");
                return;
            }
        }

        if (isEditing) {
            const promptIndex = tempPrompts.findIndex(p => p.id === currentPromptId);
            if (promptIndex === -1) return;
            
            tempPrompts[promptIndex].text = text;
            if (newImageUrl) {
                tempPrompts[promptIndex].imageUrl = newImageUrl;
            }
        } else {
            const newPromptData = { id: Date.now(), imageUrl: newImageUrl, text };
            tempPrompts.push(newPromptData);
        }

        const QUOTA_BYTES = 5 * 1024 * 1024;
        const finalSize = new Blob([JSON.stringify(tempPrompts)]).size;

        if (finalSize > QUOTA_BYTES) {
            showInfoModal("info.attention.title", "prompt.save.storageError");
            return;
        }
        
        await saveSetting('prompts', tempPrompts);

        prompts = tempPrompts;
        
        closeModal(addEditPromptModal.overlay);

        const promptModalBody = promptModal.overlay.querySelector('.modal-body');
        const scrollPosition = promptModalBody.scrollTop;

        renderPrompts();

        promptModalBody.scrollTop = scrollPosition;

        updateStorageIndicator();
        showToast(isEditing ? "prompt.edit.success" : "prompt.save.success");
        
        currentPromptId = null;

    } catch (error) {
        console.error("Gagal menyimpan prompt (unexpected error):", error);
        showInfoModal("info.attention.title", "prompt.save.fileError");
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = originalBtnText;
    }
}
  
  function handleAvatarDoubleClick() {
      if (themeModal.previewCheckbox && themeModal.previewCheckbox.checked) {
        return;
      }
      menu.container.classList.remove("show-menu");
      if (userPIN) {
          pinModalPurpose = 'login';
          const lang = languageSettings.ui;
          pinEnterModal.title.textContent = i18nData["pin.enter.title"][lang];
          pinEnterModal.label.textContent = i18nData["pin.enter.label"][lang];
          openModal(pinEnterModal.overlay);
          pinEnterModal.input.focus();
      } else {
          return;
      }
  }
  
  function updateHiddenFeatureUI() {
      const isEnabled = !!userPIN;
      settingSwitches.hiddenFeature.checked = isEnabled;
      const lang = languageSettings.ui;
  
      if (isEnabled) {
          pinSettings.container.classList.remove('hidden');
          pinSettings.updateBtn.textContent = i18nData["settings.hidden.updatePin"][lang];
      } else {
          pinSettings.container.classList.add('hidden');
          pinSettings.updateBtn.textContent = i18nData["settings.hidden.createPin"][lang];
      }
  }
  
  function updateManageModeUI() {
    const lang = languageSettings.ui;
    const selectCountFormat = i18nData["prompt.selectCount"][lang] || i18nData["prompt.selectCount"]["id"];
    promptModal.selectCount.textContent = selectCountFormat.replace('{count}', selectedPromptIds.length);

    if (selectedPromptIds.length === prompts.length && prompts.length > 0) {
        promptModal.selectAllBtn.textContent = i18nData["prompt.deselectAll"][lang] || i18nData["prompt.deselectAll"]["id"];
    } else {
        promptModal.selectAllBtn.textContent = i18nData["prompt.selectAll"][lang] || i18nData["prompt.selectAll"]["id"];
    }

    promptModal.deleteSelectedBtn.disabled = selectedPromptIds.length === 0;
    updateStorageIndicatorForDeletion();
}

function togglePromptSelection(promptId) {
    const idAsNumber = parseInt(promptId, 10);
    const itemElement = promptModal.grid.querySelector(`.prompt-item[data-id="${idAsNumber}"]`);
    
    const index = selectedPromptIds.indexOf(idAsNumber);
    if (index > -1) {
        selectedPromptIds.splice(index, 1);
        itemElement?.classList.remove('selected');
    } else {
        selectedPromptIds.push(idAsNumber);
        itemElement?.classList.add('selected');
    }
    updateManageModeUI();
}

function handleSelectAll() {
    const allPromptItems = promptModal.grid.querySelectorAll('.prompt-item:not(.add-prompt-item)');
    if (selectedPromptIds.length === prompts.length) {
        selectedPromptIds = [];
        allPromptItems.forEach(item => item.classList.remove('selected'));
    } else {
        selectedPromptIds = prompts.map(p => p.id);
        allPromptItems.forEach(item => item.classList.add('selected'));
    }
    updateManageModeUI();
}

function toggleManageMode(forceState = null) {
    isManageModeActive = forceState !== null ? forceState : !isManageModeActive;
    
    promptModal.content.classList.toggle('manage-mode', isManageModeActive);
    promptModal.manageBar.classList.toggle('hidden', !isManageModeActive);
    
    if (sortableInstance) {
        sortableInstance.option('disabled', isManageModeActive);
    }

    if (!isManageModeActive) {
        selectedPromptIds = [];
        promptModal.grid.querySelectorAll('.prompt-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        updateManageModeUI();
        updateStorageIndicator();
    } else {
        updateManageModeUI();
    }
}

function handleDeleteSelected() {
    if (selectedPromptIds.length === 0) return;
    confirmationModalPurpose = 'deleteSelectedPrompts';
    const lang = languageSettings.ui;
    confirmationModal.title.textContent = i18nData["prompt.delete.title"][lang] || i18nData["prompt.delete.title"]["id"];
    const textFormat = i18nData["prompt.delete.selectedText"][lang] || i18nData["prompt.delete.selectedText"]["id"];
    confirmationModal.text.textContent = textFormat.replace('{count}', selectedPromptIds.length);
    openModal(confirmationModal.overlay);
}
  /*
   * ===================================================================
   * D. INISIALISASI & EVENT LISTENERS
   * ===================================================================
   */
  
  function initializeDragAndDrop() {
      if (promptModal.grid) {
          sortableInstance = new Sortable(promptModal.grid, {
              animation: 150,
              ghostClass: 'sortable-ghost',
              chosenClass: 'sortable-chosen',
              filter: '.add-prompt-item',
              preventOnFilter: true,
              onMove: function (evt) {
                  return !evt.related.classList.contains('add-prompt-item');
              },
              onEnd: async function (evt) {
                  const movedItem = prompts.splice(evt.oldIndex, 1)[0];
                  prompts.splice(evt.newIndex, 0, movedItem);
                  await saveSetting('prompts', prompts);
              },
          });
      }
  }
  
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
      optionsContainer.addEventListener('click', async (e) => {
          const option = e.target.closest('.custom-option');
          if (option) {
              const newLang = option.getAttribute('data-value');
              languageSettings[type] = newLang;
              if (type === 'ui') { 
                  translateUI(newLang); 
                  updateUsernameDisplay(); 
                  updateAvatarStatus();
                  updateHiddenFeatureUI();
                  renderPrompts();
                  if (isManageModeActive) {
                      updateManageModeUI();
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
  
  document.addEventListener("DOMContentLoaded", async () => {
    const keysToLoad = ["username", "theme", "showSeconds", "menuBlur", "footerBlur", "avatarFullShow", "avatarAnimation", "detectMouseStillness", "languageSettings", "userPIN", "prompts"];
    const settings = await loadSettings(keysToLoad);
    currentUser = settings.username || "K1234";
    userPIN = settings.userPIN || null;
    prompts = settings.prompts || [];
    elements.toast = document.getElementById('toast-notification');
  
    if (settings.languageSettings) { languageSettings = { ...languageSettings, ...settings.languageSettings }; }
    else { const browserLang = getBrowserLanguage(); Object.keys(languageSettings).forEach(key => { if(key !== 'applyToAll') languageSettings[key] = browserLang; }); }
    
    ['ui', ...langDropdowns].forEach(setupDropdown);
    
    const shouldShowSeconds = settings.showSeconds !== false; settingSwitches.showSeconds.checked = shouldShowSeconds;
    const shouldUseMenuBlur = settings.menuBlur !== false; settingSwitches.menuBlur.checked = shouldUseMenuBlur;
    const shouldUseFooterBlur = settings.footerBlur !== false; settingSwitches.footerBlur.checked = shouldUseFooterBlur;
    const shouldShowAvatar = settings.avatarFullShow !== false; settingSwitches.avatarFullShow.checked = shouldShowAvatar;
    const shouldAnimateAvatar = settings.avatarAnimation !== false; settingSwitches.avatarAnimation.checked = shouldAnimateAvatar;
    const shouldDetectStillness = settings.detectMouseStillness !== false; settingSwitches.detectMouseStillness.checked = shouldDetectStillness;
    settingSwitches.applyToAll.checked = languageSettings.applyToAll;
    
    applyTheme(settings.theme || "system");
    applyShowSeconds(shouldShowSeconds); 
    applyMenuBlur(shouldUseMenuBlur); 
    applyFooterBlur(shouldUseFooterBlur); 
    applyAvatarFullShow(shouldShowAvatar); 
    applyAvatarAnimation(shouldAnimateAvatar);
  
    translateUI(languageSettings.ui);
    updateUsernameDisplay();
    updateApplyAllState(languageSettings.applyToAll);
    updateHiddenFeatureUI();
    renderPrompts();
    initializeDragAndDrop();
    
    updateOfflineStatus(); 
    updateClock(); 
    updateInfrequentElements(); 
    animationFrameId = requestAnimationFrame(animationLoop);
  
    function handleImageFileSelection(file) {
        if (file && file.type.startsWith('image/')) {

            // Cek jika file memiliki ukuran 0, yang kemungkinan besar karena path terlalu panjang
            if (file.size === 0) {
                // Gunakan pesan baru yang lebih informatif dan memberikan solusi
                showInfoModal("info.longPath.title", "info.longPath.text"); 
                return; // Hentikan eksekusi
            }

            const reader = new FileReader();
            
            reader.onerror = (error) => {
                console.error("FileReader Error: ", error);
                showInfoModal("info.attention.title", "prompt.save.fileError");
            };

            reader.onload = (e) => {
                if (currentPromptId === null) { // Mode Tambah
                    addEditPromptModal.previewsContainer.classList.add('hidden');
                    addEditPromptModal.imagePreviewSingle.src = e.target.result;
                    addEditPromptModal.imagePreviewSingle.classList.remove('hidden');
                } else { // Mode Edit
                    addEditPromptModal.imagePreviewSingle.classList.add('hidden');
                    addEditPromptModal.previewsContainer.classList.remove('hidden');
                    addEditPromptModal.imagePreviewNew.src = e.target.result;
                }
            };
            
            reader.readAsDataURL(file);
            
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            addEditPromptModal.imageFileInput.files = dataTransfer.files;

            updateEditStorageIndicator(file);
        } else if (file) {
            showInfoModal("info.attention.title", "prompt.dnd.notImage");
        }
    }

    if (addEditPromptModal.imageFileInput) {
        addEditPromptModal.imageFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                handleImageFileSelection(file);
            }
        });
    }

    // FIX: This is the new, more stable drag-and-drop handler
    function setupDragAndDrop(targetElement, onDropCallback, conditionCallback = () => true) {
        let dragCounter = 0;

        targetElement.addEventListener('dragenter', e => {
            e.preventDefault();
            e.stopPropagation();
            if (!e.dataTransfer.types.includes('Files')) return;

            dragCounter++;
            if (dragCounter === 1 && conditionCallback()) {
                targetElement.classList.add('drag-over');
            }
        });

        targetElement.addEventListener('dragleave', e => {
            e.preventDefault();
            e.stopPropagation();
            if (!e.dataTransfer.types.includes('Files')) return;

            dragCounter--;
            if (dragCounter === 0) {
                targetElement.classList.remove('drag-over');
            }
        });

        targetElement.addEventListener('dragover', e => {
            e.preventDefault();
            e.stopPropagation();
        });

        targetElement.addEventListener('drop', e => {
            e.preventDefault();
            e.stopPropagation();
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
        const condition = () => !isManageModeActive;
        setupDragAndDrop(promptModalContent, onDropOnMainGrid, condition);
    }
  
    document.body.addEventListener('click', (e) => {
      const target = e.target;
      if (target.matches('.prompt-menu-option')) {
          const action = target.dataset.action;
          const id = parseInt(target.closest('.prompt-item-menu').dataset.id, 10);
          
          closeAllPromptMenus();
          
          if (action === 'view-image') showFullImage(id);
          if (action === 'copy') copyPromptTextFromItem(id);
          if (action === 'edit') {
              handleEditPrompt(id);
          }
          if (action === 'delete') handleDeletePrompt(id);
      }
    });
  });
  
  window.addEventListener("click", (e) => {
      closeMenuOnClickOutside(e);
      document.querySelectorAll('.custom-select-options.show').forEach(options => {
          const container = options.closest('.custom-select-container');
          if (container && !container.contains(e.target)) { options.classList.remove('show'); options.previousElementSibling.classList.remove('open'); }
      });
      if (activePromptMenu && !activePromptMenu.contains(e.target) && !e.target.closest('.prompt-item-menu-btn')) {
          closeAllPromptMenus();
      }
  });
  window.addEventListener("online", updateOfflineStatus); window.addEventListener("offline", updateOfflineStatus);
  const debouncedResizeHandler = debounce(() => { updateAvatarStatus(); checkResolutionAndToggleMessage(); }, 250);
  window.addEventListener("resize", debouncedResizeHandler);
  
  window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
          if (activePromptMenu) {
              closeAllPromptMenus();
              return;
          }
  
          if (menu.container.classList.contains('show-menu')) {
              menu.container.classList.remove('show-menu');
              return;
          }
  
          const openSelects = document.querySelectorAll('.custom-select-options.show');
          if (openSelects.length > 0) {
              openSelects.forEach(options => {
                  options.classList.remove('show');
                  options.previousElementSibling.classList.remove('open');
              });
              return;
          }
  
          if (activeModalStack.length > 0) {
              const lastModal = activeModalStack[activeModalStack.length - 1];
              
              if (lastModal === promptModal.overlay && isManageModeActive) {
                  toggleManageMode(false);
                  return;
              }
  
              const closeButton = lastModal.querySelector('.close-btn');
              if (closeButton) {
                  closeButton.click();
              } else {
                  closeModal(lastModal);
              }
              return;
          }
      }
  });
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  if (menu.button) {
      menu.button.addEventListener("click", toggleMenu);
      menu.button.addEventListener("dblclick", handleAvatarDoubleClick);
  }
  
  // Event Listeners for Modals
  if (usernameModal.openBtn) usernameModal.openBtn.addEventListener("click", () => {
    menu.container.classList.remove("show-menu");
    usernameModal.input.value = currentUser;
    usernameModal.feedbackText.classList.remove('show');
    openModal(usernameModal.overlay);
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
    updateAvatarStatus();
  });
  if (otherSettingsModal.closeBtn) otherSettingsModal.closeBtn.addEventListener("click", () => closeModal(otherSettingsModal.overlay));
  
  if (aboutModal.openBtn) aboutModal.openBtn.addEventListener("click", () => {
    menu.container.classList.remove("show-menu");
    openModal(aboutModal.overlay);
  });
  if (aboutModal.closeBtn) aboutModal.closeBtn.addEventListener("click", () => closeModal(aboutModal.overlay));
  
  if (pinSettings.updateBtn) pinSettings.updateBtn.addEventListener('click', handleUpdatePin);
  if (pinSettings.input) pinSettings.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleUpdatePin(); });
  
  if (createPinModal.saveBtn) createPinModal.saveBtn.addEventListener('click', handleSaveInitialPin);
  if (createPinModal.input) createPinModal.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSaveInitialPin(); });
  if (createPinModal.closeBtn) createPinModal.closeBtn.addEventListener('click', () => { closeModal(createPinModal.overlay); settingSwitches.hiddenFeature.checked = false; });
  
  if (pinEnterModal.closeBtn) pinEnterModal.closeBtn.addEventListener("click", () => {
      closeModal(pinEnterModal.overlay);
      if (pinModalPurpose === 'disable') {
          settingSwitches.hiddenFeature.checked = true;
      }
  });
  if (pinEnterModal.submitBtn) pinEnterModal.submitBtn.addEventListener("click", handlePinSubmit);
  if (pinEnterModal.input) pinEnterModal.input.addEventListener("keydown", (e) => { if (e.key === "Enter") handlePinSubmit(); });
  
  if (promptModal.closeBtn) promptModal.closeBtn.addEventListener("click", () => {
    toggleManageMode(false);
    closeModal(promptModal.overlay);
  });
  if (promptModal.manageBtn) promptModal.manageBtn.addEventListener('click', () => toggleManageMode());
  if (promptModal.cancelManageBtn) promptModal.cancelManageBtn.addEventListener('click', () => toggleManageMode(false));
  if (promptModal.selectAllBtn) promptModal.selectAllBtn.addEventListener('click', handleSelectAll);
  if (promptModal.deleteSelectedBtn) promptModal.deleteSelectedBtn.addEventListener('click', handleDeleteSelected);
  
  if (promptViewerModal.closeBtn) promptViewerModal.closeBtn.addEventListener("click", () => { closeModal(promptViewerModal.overlay); });
  if (promptViewerModal.copyBtn) promptViewerModal.copyBtn.addEventListener("click", copyPromptTextFromViewer);
  if (promptViewerModal.deleteBtn) promptViewerModal.deleteBtn.addEventListener("click", () => handleDeletePrompt(currentPromptId));
  if (promptViewerModal.editBtn) promptViewerModal.editBtn.addEventListener("click", () => { closeModal(promptViewerModal.overlay); handleEditPrompt(currentPromptId); });
  
  if (addEditPromptModal.closeBtn) addEditPromptModal.closeBtn.addEventListener("click", () => { closeModal(addEditPromptModal.overlay); });
  if (addEditPromptModal.saveBtn) addEditPromptModal.saveBtn.addEventListener("click", handleSavePrompt);
  
  const handleCancelConfirmation = () => {
      closeModal(confirmationModal.overlay);
      if (confirmationModalPurpose === 'disableFeature') {
          settingSwitches.hiddenFeature.checked = true;
      }
  };
  if (confirmationModal.closeBtn) confirmationModal.closeBtn.addEventListener("click", handleCancelConfirmation);
  if (confirmationModal.cancelBtn) confirmationModal.cancelBtn.addEventListener("click", handleCancelConfirmation);
  if (confirmationModal.confirmBtn) confirmationModal.confirmBtn.addEventListener("click", () => {
      if (confirmationModalPurpose === 'disableFeature') {
          handleDisableFeature();
      } else {
          confirmDelete();
      }
  });
  
  if (infoModal.closeBtn) infoModal.closeBtn.addEventListener("click", () => closeModal(infoModal.overlay));

  if (howItWorksModal.openBtn) howItWorksModal.openBtn.addEventListener("click", () => openModal(howItWorksModal.overlay));
  if (howItWorksModal.closeBtn) howItWorksModal.closeBtn.addEventListener("click", () => closeModal(howItWorksModal.overlay));
  
  if (imageViewerModal.closeBtn) imageViewerModal.closeBtn.addEventListener("click", () => closeModal(imageViewerModal.overlay));
  if (imageViewerModal.overlay) imageViewerModal.overlay.addEventListener("click", (e) => { if (e.target === imageViewerModal.overlay) closeModal(imageViewerModal.overlay); });
  
  // Event Listeners for Settings
  if (themeModal.lightBtn) themeModal.lightBtn.addEventListener("click", async () => { applyTheme("light"); await saveSetting("theme", "light"); });
  if (themeModal.darkBtn) themeModal.darkBtn.addEventListener("click", async () => { applyTheme("dark"); await saveSetting("theme", "dark"); });
  if (themeModal.systemBtn) themeModal.systemBtn.addEventListener("click", async () => { applyTheme("system"); await saveSetting("theme", "system"); });
  if (themeModal.previewCheckbox) themeModal.previewCheckbox.addEventListener("change", () => {
      const isPreviewing = themeModal.previewCheckbox.checked;
      elements.body.classList.toggle("modal-open", !isPreviewing);
      themeModal.overlay.classList.toggle("preview-mode", isPreviewing);
      [usernameModal.openBtn, themeModal.openBtn, aboutModal.openBtn, otherSettingsModal.openBtn,].forEach((btn) => { if (btn) btn.disabled = isPreviewing; });
  });
  
  if (settingSwitches.applyToAll) { settingSwitches.applyToAll.addEventListener('change', async (e) => { const isChecked = e.target.checked; languageSettings.applyToAll = isChecked; updateApplyAllState(isChecked); await saveSetting('languageSettings', languageSettings); }); }
  if (settingSwitches.showSeconds) settingSwitches.showSeconds.addEventListener("change", async (e) => { applyShowSeconds(e.target.checked); await saveSetting("showSeconds", e.target.checked); });
  if (settingSwitches.menuBlur) settingSwitches.menuBlur.addEventListener("change", async (e) => { applyMenuBlur(e.target.checked); await saveSetting("menuBlur", e.target.checked); });
  if (settingSwitches.footerBlur) settingSwitches.footerBlur.addEventListener("change", async (e) => { applyFooterBlur(e.target.checked); await saveSetting("footerBlur", e.target.checked); });
  if (settingSwitches.avatarFullShow) settingSwitches.avatarFullShow.addEventListener("change", async (e) => { applyAvatarFullShow(e.target.checked); await saveSetting("avatarFullShow", e.target.checked); });
  if (settingSwitches.avatarAnimation) settingSwitches.avatarAnimation.addEventListener("change", async (e) => { applyAvatarAnimation(e.target.checked); await saveSetting("avatarAnimation", e.target.checked); });
  if (settingSwitches.detectMouseStillness) settingSwitches.detectMouseStillness.addEventListener("change", async (e) => { await saveSetting("detectMouseStillness", e.target.checked); setupAvatarHoverListeners(); });
  if (settingSwitches.hiddenFeature) {
      settingSwitches.hiddenFeature.addEventListener('change', (e) => {
          if (e.target.checked) {
              if (!userPIN) {
                  e.preventDefault();
                  openModal(createPinModal.overlay);
                  createPinModal.input.focus();
              }
          } else {
              e.preventDefault();
              confirmationModalPurpose = 'disableFeature';
              const lang = languageSettings.ui;
              confirmationModal.title.textContent = i18nData["settings.hidden.disableWarningTitle"][lang];
              confirmationModal.text.textContent = i18nData["settings.hidden.disableWarningText"][lang];
              openModal(confirmationModal.overlay);
          }
      });
  }