import {
    elements, menu, usernameModal, themeModal, otherSettingsModal, aboutModal,
    pinSettings, createPinModal, pinEnterModal, promptModal, promptViewerModal,
    addEditPromptModal, confirmationModal, infoModal, howItWorksModal, imageViewerModal,
    settingSwitches, i18nData, userPIN, prompts,
    currentUser, setCurrentUser, setUserPIN, setPrompts, languageSettings, setLanguageSettings,
    activeModalStack, activePromptMenu, confirmationModalPurpose, setConfirmationModalPurpose,
    isManageModeActive, currentPromptId, setAnimationFrameId, setSortableInstance, setPinModalPurpose, pinModalPurpose
} from './config.js';

import { debounce, getBrowserLanguage } from './utils.js';
import { loadSettings, saveSetting, updateEditStorageIndicator } from './storage.js';
import { translateUI, updateClock, updateInfrequentElements, animationLoop, handleVisibilityChange, updateOfflineStatus } from './core.js';
import {
    toggleMenu, closeMenuOnClickOutside, openModal, closeModal, closeThemeModal, showInfoModal,
    handleSaveUsername, applyTheme, applyShowSeconds, applyMenuBlur, applyFooterBlur,
    applyAvatarFullShow, applyAvatarAnimation, updateAvatarStatus, updateUsernameDisplay,
    updateHiddenFeatureUI, checkResolutionAndToggleMessage, setupAvatarHoverListeners
} from './ui.js';
import { handleUpdatePin, handleSaveInitialPin, handleDisableFeature, handlePinSubmit } from './pinManager.js';
import {
    renderPrompts, handleOpenAddPromptModal, handleEditPrompt, handleDeletePrompt,
    copyPromptTextFromViewer, showFullImage, copyPromptTextFromItem,
    handleSavePrompt, confirmDelete, closeAllPromptMenus, toggleManageMode,
    handleSelectAll, handleDeleteSelected, updateManageModeUI
} from './promptManager.js';


// ===================================================================
// D. INISIALISASI & EVENT LISTENERS
// ===================================================================

function initializeDragAndDrop() {
    if (promptModal.grid) {
        const sortable = new Sortable(promptModal.grid, {
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
                const newPrompts = [...prompts];
                newPrompts.splice(evt.newIndex, 0, movedItem);
                setPrompts(newPrompts);
                await saveSetting('prompts', prompts);
            },
        });
        // CORRECTED: Use the setter to update the shared state
        setSortableInstance(sortable);
    }
}

const langDropdowns = ['greeting', 'description', 'date'];
function updateApplyAllState(isApplied) {
    langDropdowns.forEach(type => {
        const container = document.getElementById(`lang-container-${type}`);
        if (container) {
            container.classList.toggle('disabled', isApplied);
            if (isApplied) {
                const newLangSettings = { ...languageSettings, [type]: languageSettings.ui };
                setLanguageSettings(newLangSettings);
            }
            updateDropdownDisplay(type);
        }
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
        document.querySelectorAll('.custom-select-options.show').forEach(openOption => { if (openOption !== optionsContainer) { openOption.classList.remove('show'); openOption.previousElementSibling.classList.remove('open'); } });
        const isShown = optionsContainer.classList.toggle('show'); trigger.classList.toggle('open', isShown);
    });
    optionsContainer.addEventListener('click', async (e) => {
        const option = e.target.closest('.custom-option');
        if (option) {
            const newLang = option.getAttribute('data-value');
            const newLangSettings = { ...languageSettings, [type]: newLang };
            setLanguageSettings(newLangSettings);

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

// ADDED: This function was missing and is now defined here
function handleAvatarDoubleClick() {
    if (themeModal.previewCheckbox && themeModal.previewCheckbox.checked) {
      return;
    }
    menu.container.classList.remove("show-menu");
    if (userPIN) {
        setPinModalPurpose('login');
        const lang = languageSettings.ui;
        pinEnterModal.title.textContent = i18nData["pin.enter.title"][lang] || "Enter PIN";
        pinEnterModal.label.textContent = i18nData["pin.enter.label"][lang] || "4-Digit PIN";
        openModal(pinEnterModal.overlay);
        pinEnterModal.input.focus();
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const keysToLoad = ["username", "theme", "showSeconds", "menuBlur", "footerBlur", "avatarFullShow", "avatarAnimation", "detectMouseStillness", "languageSettings", "userPIN", "prompts"];
    const settings = await loadSettings(keysToLoad);
    
    // CORRECTED: Use setters to modify state
    setCurrentUser(settings.username || "K1234");
    setUserPIN(settings.userPIN || null);
    setPrompts(settings.prompts || []);
    
    if (settings.languageSettings) {
        setLanguageSettings({ ...languageSettings, ...settings.languageSettings });
    } else {
        const browserLang = getBrowserLanguage();
        const newSettings = { ...languageSettings };
        Object.keys(newSettings).forEach(key => { if (key !== 'applyToAll') newSettings[key] = browserLang; });
        setLanguageSettings(newSettings);
    }

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
    
    // CORRECTED: Use setter
    setAnimationFrameId(requestAnimationFrame(animationLoop));

    function handleImageFileSelection(file) {
        if (file && file.type.startsWith('image/')) {
            if (file.size === 0) {
                showInfoModal("info.longPath.title", "info.longPath.text");
                return;
            }
            const reader = new FileReader();
            reader.onerror = (error) => {
                console.error("FileReader Error: ", error);
                showInfoModal("info.attention.title", "prompt.save.fileError");
            };
            reader.onload = (e) => {
                if (currentPromptId === null) {
                    addEditPromptModal.previewsContainer.classList.add('hidden');
                    addEditPromptModal.imagePreviewSingle.src = e.target.result;
                    addEditPromptModal.imagePreviewSingle.classList.remove('hidden');
                } else {
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

    function setupDragAndDrop(targetElement, onDropCallback, conditionCallback = () => true) {
        let dragCounter = 0;
        targetElement.addEventListener('dragenter', e => {
            e.preventDefault(); e.stopPropagation();
            if (!e.dataTransfer.types.includes('Files')) return;
            dragCounter++;
            if (dragCounter === 1 && conditionCallback()) {
                targetElement.classList.add('drag-over');
            }
        });
        targetElement.addEventListener('dragleave', e => {
            e.preventDefault(); e.stopPropagation();
            if (!e.dataTransfer.types.includes('Files')) return;
            dragCounter--;
            if (dragCounter === 0) {
                targetElement.classList.remove('drag-over');
            }
        });
        targetElement.addEventListener('dragover', e => {
            e.preventDefault(); e.stopPropagation();
        });
        targetElement.addEventListener('drop', e => {
            e.preventDefault(); e.stopPropagation();
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
            if (action === 'edit') handleEditPrompt(id);
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

window.addEventListener("online", updateOfflineStatus);
window.addEventListener("offline", updateOfflineStatus);
const debouncedResizeHandler = debounce(() => { updateAvatarStatus(); checkResolutionAndToggleMessage(); }, 250);
window.addEventListener("resize", debouncedResizeHandler);

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (activePromptMenu) { closeAllPromptMenus(); return; }
        if (menu.container.classList.contains('show-menu')) { menu.container.classList.remove('show-menu'); return; }
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
    if (confirmationModalPurpose === 'disable') {
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

if (settingSwitches.applyToAll) { settingSwitches.applyToAll.addEventListener('change', async (e) => { const isChecked = e.target.checked; const newLangSettings = { ...languageSettings, applyToAll: isChecked }; setLanguageSettings(newLangSettings); updateApplyAllState(isChecked); await saveSetting('languageSettings', languageSettings); }); }
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
            setConfirmationModalPurpose('disableFeature');
            const lang = languageSettings.ui;
            confirmationModal.title.textContent = i18nData["settings.hidden.disableWarningTitle"][lang];
            confirmationModal.text.textContent = i18nData["settings.hidden.disableWarningText"][lang];
            openModal(confirmationModal.overlay);
        }
    });
}