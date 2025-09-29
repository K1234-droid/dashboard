import { elements, languageSettings, i18nData, supportedLangs, toastTimeout, setToastTimeout } from './config.js';

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function getBrowserLanguage() {
    const browserLangs = navigator.languages || [navigator.language];
    for (const lang of browserLangs) {
        const primaryCode = lang.split('-')[0].toLowerCase();
        if (supportedLangs.includes(primaryCode)) {
            return primaryCode;
        }
    }
    return 'en';
}

export function showToast(messageKey, value = null) {
    if (!elements.toast) return;
    clearTimeout(toastTimeout);
    const lang = languageSettings.ui;
    let message = i18nData[messageKey]?.[lang] || i18nData[messageKey]?.['id'] || messageKey;
    
    if (message && value !== null) {
        message = message.replace('{value}', value);
    }

    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    const newTimeout = setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000); // Durasi toast diperpanjang sedikit
    setToastTimeout(newTimeout);
}

/**
 * Membaca file sebagai Data URL menggunakan Promise.
 * @param {File} file - File yang akan dibaca.
 * @returns {Promise<string>} Sebuah Promise yang akan resolve dengan Data URL file.
 */
export function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}