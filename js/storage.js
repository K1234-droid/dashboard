import { languageSettings, i18nData, promptModal, addEditPromptModal, prompts, currentPromptId, selectedPromptIds } from './config.js';
import { formatBytes } from './utils.js';

export async function saveSetting(key, value) {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.set({ [key]: value });
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

export async function loadSettings(keys) {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        return new Promise((resolve) => {
            chrome.storage.local.get(keys, (result) => resolve(result));
        });
    } else {
        const settings = {};
        for (const key of keys) {
            const value = localStorage.getItem(key);
            if (value !== null) {
                try {
                    settings[key] = JSON.parse(value);
                } catch (e) {
                    settings[key] = value;
                }
            }
        }
        return Promise.resolve(settings);
    }
}

// =================== TAMBAHAN UNTUK MEMPERBAIKI ERROR ===================
/**
 * Mendapatkan beberapa pengaturan sekaligus. Ini adalah alias untuk loadSettings
 * untuk memenuhi permintaan impor dari modul lain.
 * @param {string[]} keys - Array dari kunci pengaturan yang ingin diambil.
 * @returns {Promise<Object>} Sebuah promise yang resolve dengan objek pengaturan.
 */
export async function getAllSettings(keys) {
    return loadSettings(keys);
}
// =======================================================================

export async function updateStorageIndicator() {
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

export async function updateEditStorageIndicator(newFile = null) {
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

export async function updateStorageIndicatorForDeletion() {
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