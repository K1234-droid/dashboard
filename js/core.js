import { showToast } from './utils.js';
import { elements, connectionStatus, languageSettings, i18nData, localeMap, currentUser, lastUpdatedHour, animationFrameId, setAnimationFrameId, setLastUpdatedHour, CURRENT_VERSION, GITHUB_OWNER, GITHUB_REPO, updateModal } from './config.js';
import { updateUsernameDisplay, openModal } from './ui.js';
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
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = translation;
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

    const bookmarkSearchInput = document.getElementById('bookmark-search-input');
    if (bookmarkSearchInput) {
        bookmarkSearchInput.placeholder = placeholderText;
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
    if (elements.greetingText) {
        elements.greetingText.textContent = i18nData[greetingKey]?.[greetingLang] || i18nData[greetingKey]?.['id'];
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
        setLastUpdatedHour(-1);
        setAnimationFrameId(requestAnimationFrame(animationLoop));
    }
}

/**
 * Checks for a real internet connection by fetching a resource.
 * Includes retry logic to handle temporary network fluctuations.
 * @param {number} retries - The number of times to try before failing.
 * @param {number} delay - The delay in milliseconds between retries.
 * @returns {Promise<boolean>} - True if a connection is established, false otherwise.
 */
async function checkRealInternetConnection(retries = 2, delay = 500) {
    for (let i = 0; i < retries; i++) {
        if (!navigator.onLine) {
            return false;
        }

        try {
            await fetch(`https://www.google.com/favicon.ico?_=${new Date().getTime()}`, {
                method: "HEAD",
                mode: "no-cors",
                cache: "no-store",
                signal: AbortSignal.timeout(2500)
            });
            return true;
        } catch (error) {
            console.log(`Connection check attempt ${i + 1} failed.`, error.name);
            if (i < retries - 1) {
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }
    return false;
}

let isInitialCheck = true;
let footerMessageTimeout;

export async function updateOfflineStatus() {
    clearTimeout(footerMessageTimeout);

    const showOfflineState = (isInitial = false) => {
        if (isInitial) {
            showToast('footer.offline');
            footerMessageTimeout = setTimeout(() => {
                showToast('footer.account', currentUser);
            }, 2000);
        } else {
            showToast('footer.offline');
        }
    };

    const showOnlineState = () => {
        showToast('footer.account', currentUser);
    };

    if (!navigator.onLine) {
        showOfflineState(isInitialCheck);
    } else {
        if (isInitialCheck) {
            showToast('footer.checking');
        }
        
        const isTrulyOnline = await checkRealInternetConnection();
        
        if (isTrulyOnline) {
            showOnlineState();
        } else {
            showOfflineState(isInitialCheck);
        }
    }

    isInitialCheck = false;
}

/**
 * Mengonversi string teks dengan Markdown sederhana (bold, list) menjadi HTML.
 * @param {string} text - Teks mentah dari catatan rilis.
 * @returns {string} - String yang sudah diformat sebagai HTML.
 */
function parseReleaseNotes(text) {
    if (!text) {
        const lang = languageSettings.ui;
        const message = i18nData['update.noReleaseNotes']?.[lang] || i18nData['update.noReleaseNotes']?.['id'];
        return `<p>${message}</p>`;
    }

    const lines = text.trim().split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        if (line.trim().startsWith('* ')) {
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            html += `<li>${line.trim().substring(2)}</li>`;
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            if (line.trim()) {
                html += `<p>${line}</p>`;
            }
        }
    });

    if (inList) {
        html += '</ul>';
    }

    return html;
}

/**
 * Memeriksa rilis terbaru dari GitHub dan menampilkan modal jika ada pembaruan.
 * @param {boolean} isManual - True jika pemeriksaan dipicu oleh pengguna secara manual.
 */
export async function checkForUpdates(isManual = false) {
    if (isManual) {
        if (!navigator.onLine) {
            showToast('update.offlineError');
            return;
        }
        showToast('update.checking');
    }

    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`);
        if (!response.ok) {
            throw new Error(`GitHub API returned status ${response.status}`);
        }
        const data = await response.json();
        const latestVersion = data.tag_name;

        if (latestVersion && latestVersion !== CURRENT_VERSION) {
            const lang = languageSettings.ui;
            updateModal.versionInfo.textContent = (i18nData['update.versionInfo']?.[lang] || '').replace('{version}', latestVersion);
            updateModal.releaseNotes.innerHTML = parseReleaseNotes(data.body);
            updateModal.downloadBtn.href = data.html_url;
            openModal(updateModal.overlay);
        } else if (isManual) {
            showToast('update.uptodate');
        }
    } catch (error) {
        console.error('Update check failed:', error);
        if (isManual) {
            showToast('update.error');
        }
    }
}