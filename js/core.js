import { showToast } from './utils.js';
import { elements, connectionStatus, languageSettings, i18nData, localeMap, currentUser, lastUpdatedHour, animationFrameId, setAnimationFrameId, setLastUpdatedHour } from './config.js';
import { updateUsernameDisplay, updateAvatarStatus } from './ui.js';
import { renderPrompts } from './promptManager.js';
import { renderAdvancedPrompts } from './promptBuilder.js';

export function translateUI(lang) {
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
    
    const placeholderText = i18nData["prompt.search.placeholder"]?.[lang] || i18nData["prompt.search.placeholder"]?.['id'] || '';
    
    const searchInput = document.getElementById('prompt-search-input');
    if (searchInput) {
        searchInput.placeholder = placeholderText;
    }
    
    const advancedSearchInput = document.getElementById('advanced-prompt-search-input');
    if (advancedSearchInput) {
        advancedSearchInput.placeholder = placeholderText;
    }

    const charSearchInput = document.getElementById('character-search-input');
    const charPlaceholderText = i18nData["character.search.placeholder"]?.[lang] || i18nData["character.search.placeholder"]?.['id'] || '';
    if (charSearchInput) {
        charSearchInput.placeholder = charPlaceholderText;
    }
}

export function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    if (elements.timeMain) elements.timeMain.textContent = `${hours}:${minutes}`;
    if (elements.timeSeconds && !elements.body.classList.contains('seconds-hidden')) {
        const seconds = String(now.getSeconds()).padStart(2, "0");
        elements.timeSeconds.textContent = `:${seconds}`;
    }
}

export function updateInfrequentElements() {
    const now = new Date();
    const hour = now.getHours();
    
    const greetingLang = languageSettings.greeting;
    let greetingKey;
    if (hour >= 5 && hour < 11) greetingKey = "greeting.morning";
    else if (hour >= 11 && hour < 15) greetingKey = "greeting.afternoon";
    else if (hour >= 15 && hour < 18) greetingKey = "greeting.evening";
    else greetingKey = "greeting.night";
    if (elements.greeting) {
        elements.greeting.textContent = i18nData[greetingKey]?.[greetingLang] || i18nData[greetingKey]?.['id'];
    }
    
    const descLang = languageSettings.description;
    const descKey = (hour >= 23 || hour < 4) ? "description.night" : "description.day";
    if (elements.description) {
        elements.description.textContent = i18nData[descKey]?.[descLang] || i18nData[descKey]?.['id'];
    }
    
    const dateLang = languageSettings.date;
    const dateLocale = localeMap[dateLang] || 'id-ID';
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (elements.date) {
        elements.date.textContent = now.toLocaleDateString(dateLocale, dateOptions);
    }
}

export function animationLoop() {
    setAnimationFrameId(requestAnimationFrame(animationLoop));
    updateClock();
    const currentHour = new Date().getHours();
    if (currentHour !== lastUpdatedHour) {
        updateInfrequentElements();
        setLastUpdatedHour(currentHour);
    }
}

export function handleVisibilityChange() {
    if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
    } else {
        setLastUpdatedHour(-1); // Force update on return
        setAnimationFrameId(requestAnimationFrame(animationLoop));
    }
}

async function checkRealInternetConnection() {
    try {
        await fetch(`https://www.google.com/favicon.ico?_=${new Date().getTime()}`, { method: "HEAD", mode: "no-cors", cache: "no-store" });
        return true;
    } catch (error) {
        return false;
    }
}

let isInitialCheck = true;
let footerMessageTimeout;

export async function updateOfflineStatus() {
    clearTimeout(footerMessageTimeout);
    const useToast = document.body.classList.contains('footer-info-as-toast');

    if (connectionStatus.offlineMessage) connectionStatus.offlineMessage.classList.remove("show");
    if (connectionStatus.loadingMessage) connectionStatus.loadingMessage.classList.remove("show");
    if (elements.accountMessage) elements.accountMessage.classList.remove("show");

    const showOfflineState = (isInitial = false) => {
        if (useToast) {
            // Jika ini adalah pengecekan awal saat offline, tampilkan pesan offline dahulu
            if (isInitial) {
                showToast('footer.offline'); // Tampilkan "Anda sedang offline"
                // Setelah 2 detik, tampilkan pesan username
                footerMessageTimeout = setTimeout(() => {
                    showToast('footer.account', currentUser);
                }, 2000);
            } else {
                // Untuk kejadian offline berikutnya, cukup tampilkan status offline
                showToast('footer.offline');
            }
        } else {
            // Logika fallback untuk footer non-toast
            if (connectionStatus.offlineMessage) connectionStatus.offlineMessage.classList.add("show");
            if (connectionStatus.loadingMessage) connectionStatus.loadingMessage.classList.remove("show");
            if (elements.accountMessage) elements.accountMessage.style.display = "none";

            footerMessageTimeout = setTimeout(() => {
                if (connectionStatus.offlineMessage) connectionStatus.offlineMessage.classList.remove("show");
                if (elements.accountMessage) elements.accountMessage.style.display = "inline";
            }, 2000);
        }
    };
    
    const showOnlineState = () => {
        if (useToast) {
            showToast('footer.account', currentUser);
        } else {
            if (connectionStatus.offlineMessage) connectionStatus.offlineMessage.classList.remove("show");
            if (connectionStatus.loadingMessage) connectionStatus.loadingMessage.classList.remove("show");
            if (elements.accountMessage) elements.accountMessage.style.display = "inline";
        }
    };

    if (!navigator.onLine) {
        // --- OFFLINE (Browser yakin sedang offline) ---
        showOfflineState(isInitialCheck);
    } else {
        // --- ONLINE (Browser mengira online, perlu verifikasi) ---
        if (useToast) {
            showToast('footer.checking');
        } else {
            if (connectionStatus.loadingMessage) connectionStatus.loadingMessage.classList.add("show");
            if (connectionStatus.offlineMessage) connectionStatus.offlineMessage.classList.remove("show");
            if (elements.accountMessage) elements.accountMessage.style.display = "none";
        }
        
        const isTrulyOnline = await checkRealInternetConnection();
        
        if (isTrulyOnline) {
            // Koneksi terkonfirmasi, tampilkan status online
            showOnlineState();
        } else {
            // Gagal verifikasi, berarti sebenarnya offline
            showOfflineState(isInitialCheck);
        }
    }

    // Tandai bahwa pengecekan awal sudah selesai
    isInitialCheck = false;
}