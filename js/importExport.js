import { saveSetting, getAllSettings } from './storage.js';
import { showToast } from './utils.js';
import {
    userPIN, advancedPIN, setPinModalPurpose, languageSettings,
    i18nData, pinEnterModal, infoModal, confirmationMergeReplaceModal,
    setTempImportData, tempImportData, prompts, advancedPrompts,
    setPrompts, setAdvancedPrompts, setUserPIN, setAdvancedPIN,
    currentUser
} from './config.js';
import { openModal, closeModal, showInfoModal, updateSecurityFeaturesUI } from './ui.js';
import { renderPrompts } from './promptManager.js';
import { renderAdvancedPrompts } from './promptBuilder.js';

// Fungsi untuk membuat dan mengunduh file
function downloadJSON(data, filename) {
    try {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('export.success');
    } catch (error) {
        console.error('Export failed:', error);
        showToast('export.failed');
    }
}

// Fungsi untuk memicu dialog pembukaan file
function triggerImport(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                callback(data);
            } catch (error) {
                console.error('Import failed:', error);
                showInfoModal('info.attention.title', 'import.failed');
            }
        }
    };
    input.click();
}

// =================== LOGIKA EKSPOR ===================

export async function exportUserData() {
    const settingsToExport = await getAllSettings([
        'username', 'theme', 'showSeconds', 'menuBlur', 'footerBlur',
        'avatarFullShow', 'avatarAnimation', 'detectMouseStillness',
        'languageSettings', 'showCredit'
    ]);
    
    // Membuat format tanggal YYYY-MM-DD
    const now = new Date();
    const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    // Menggabungkan semua bagian menjadi nama file
    const filename = `${currentUser}_${dateString}_user-settings.json`;
    
    downloadJSON({ type: 'userData', data: settingsToExport }, filename);
}

export function exportHiddenData() {
    // Memerlukan konfirmasi PIN sebelum melanjutkan
    if (!userPIN) {
        // Jika tidak ada PIN utama, tidak ada yang bisa diekspor
        showInfoModal('info.attention.title', 'settings.hidden.disabled');
        return;
    }
    setPinModalPurpose('exportHidden');
    const lang = languageSettings.ui;
    pinEnterModal.title.textContent = i18nData["pin.enter.confirmExport"][lang];
    pinEnterModal.label.textContent = i18nData["pin.enter.confirmExportLabel"][lang];
    pinEnterModal.input.value = '';
    pinEnterModal.feedbackText.classList.remove('show');
    openModal(pinEnterModal.overlay);
    pinEnterModal.input.focus();
}

// Dipanggil dari pinManager setelah PIN benar
export async function proceedWithHiddenDataExport() {
    const settingsToExport = await getAllSettings(['userPIN', 'advancedPIN', 'prompts', 'advancedPrompts']);
    
    // Membuat format tanggal YYYY-MM-DD
    const now = new Date();
    const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Menggabungkan semua bagian menjadi nama file
    const filename = `${currentUser}_${dateString}_hidden-features-backup.json`;
    
    downloadJSON({ type: 'hiddenData', data: settingsToExport }, filename);
}

// =================== LOGIKA IMPOR ===================

export function importUserData() {
    triggerImport(async (imported) => {
        if (imported.type !== 'userData' || !imported.data) {
            showInfoModal('info.attention.title', 'import.failed');
            return;
        }
        for (const key in imported.data) {
            await saveSetting(key, imported.data[key]);
        }
        showToast('import.success');
        // Reload halaman untuk menerapkan semua pengaturan
        setTimeout(() => window.location.reload(), 1000);
    });
}

export function importHiddenData() {
    triggerImport((imported) => {
        if (imported.type !== 'hiddenData' || !imported.data) {
            showInfoModal('info.attention.title', 'import.failed');
            return;
        }
        // Simpan data impor sementara dan buka modal konfirmasi
        setTempImportData(imported.data);
        openModal(confirmationMergeReplaceModal.overlay);
    });
}

async function applyImportedData(data, replace = false) {
    let finalPrompts = replace ? data.prompts || [] : [...prompts];
    let finalAdvancedPrompts = replace ? data.advancedPrompts || [] : [...advancedPrompts];

    if (!replace) {
        // Logika penggabungan (merge)
        if (data.prompts) {
            const existingPromptIds = new Set(prompts.map(p => p.id));
            const newPrompts = data.prompts.filter(p => !existingPromptIds.has(p.id));
            finalPrompts.push(...newPrompts);
        }
        if (data.advancedPrompts) {
            const existingAdvancedIds = new Set(advancedPrompts.map(p => p.id));
            const newAdvanced = data.advancedPrompts.filter(p => !existingAdvancedIds.has(p.id));
            finalAdvancedPrompts.push(...newAdvanced);
        }
    }

    // Periksa kuota penyimpanan sebelum menyimpan (dengan perhitungan yang lebih akurat)
    const QUOTA_BYTES = 5 * 1024 * 1024;
    const dataToEstimate = {
        userPIN: data.userPIN || userPIN,
        advancedPIN: data.advancedPIN || advancedPIN,
        prompts: finalPrompts,
        advancedPrompts: finalAdvancedPrompts
    };
    const finalSize = new Blob([JSON.stringify(dataToEstimate)]).size;

    if (finalSize > QUOTA_BYTES) {
        showInfoModal("info.attention.title", "prompt.save.storageError");
        return false; // Kembalikan status gagal
    }
    
    // Terapkan dan simpan data
    setUserPIN(data.userPIN || userPIN);
    setAdvancedPIN(data.advancedPIN || advancedPIN);
    setPrompts(finalPrompts);
    setAdvancedPrompts(finalAdvancedPrompts);

    await saveSetting('userPIN', data.userPIN || userPIN);
    await saveSetting('advancedPIN', data.advancedPIN || advancedPIN);
    await saveSetting('prompts', finalPrompts);
    await saveSetting('advancedPrompts', finalAdvancedPrompts);

    renderPrompts();
    renderAdvancedPrompts();
    updateSecurityFeaturesUI();

    showToast(replace ? 'import.replaced' : 'import.merged');
    return true; // Kembalikan status sukses
}


export async function handleMerge() {
    if (tempImportData) {
        const success = await applyImportedData(tempImportData, false);
        if (success) {
            closeModal(confirmationMergeReplaceModal.overlay);
            setTempImportData(null);
        }
    }
}

export async function handleReplace() {
    if (tempImportData) {
        const success = await applyImportedData(tempImportData, true);
        if (success) {
            closeModal(confirmationMergeReplaceModal.overlay);
            setTempImportData(null);
        }
    }
}