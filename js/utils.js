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
    }, 3000);
    setToastTimeout(newTimeout);
}

export function dataURLToBlob(dataurl) {
    return new Promise((resolve, reject) => {
        try {
            const arr = dataurl.split(',');
            const mimeMatch = arr[0].match(/:(.*?);/);
            if (!mimeMatch) {
                throw new Error("Invalid Data URL format");
            }
            const mime = mimeMatch[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            resolve(new Blob([u8arr], {type:mime}));
        } catch (error) {
            reject(error);
        }
    });
}

export function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
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

/**
 * Mengubah ukuran gambar menggunakan Canvas.
 * @param {Blob|File} file - File gambar yang akan diubah ukurannya.
 * @param {number} maxWidth - Lebar maksimum gambar hasil.
 * @param {number} maxHeight - Tinggi maksimum gambar hasil.
 * @returns {Promise<Blob>} Promise yang resolve dengan Blob gambar yang sudah diubah ukurannya.
 */
export function resizeImage(file, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.onerror = reject;
        img.onload = () => {
            let { width, height } = img;

            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Canvas to Blob conversion failed'));
                }
            }, file.type || 'image/png', 0.9);
        };
        img.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function isValidURL(string) {
    try {
        new URL(string);
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "ftp:";
    } catch (_) {
        try {
            const urlWithProtocol = `https://${string}`;
            new URL(urlWithProtocol);
            const url = new URL(urlWithProtocol);
            return url.hostname.includes('.');
        } catch (e) {
            return false;
        }
    }
}