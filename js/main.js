import {
    elements, menu, usernameModal, themeModal, otherSettingsModal, aboutModal,
    pinSettings, createPinModal, createAdvancedPinModal, pinEnterModal, promptModal, promptViewerModal,
    addEditPromptModal, confirmationModal, infoModal, howItWorksModal, imageViewerModal,
    updatePinChoiceModal, advancedPromptModal, addEditAdvancedPromptModal, advancedPromptViewerModal,
    settingSwitches, i18nData, userPIN, advancedPIN, prompts, advancedPrompts,
    currentUser, setCurrentUser, setUserPIN, setAdvancedPIN, setPrompts, setAdvancedPrompts, languageSettings, setLanguageSettings,
    activeModalStack, activePromptMenu, confirmationModalPurpose, setConfirmationModalPurpose,
    isManageModeActive, isAdvancedManageModeActive, isSearchModeActive, isAdvancedSearchModeActive,
    currentPromptId, setAnimationFrameId, setSortableInstance, setAdvancedSortableInstance, setPinModalPurpose, currentAdvancedPromptId,
    dataManagement, confirmationMergeReplaceModal
} from './config.js';

import { debounce, getBrowserLanguage } from './utils.js';
import { loadSettings, saveSetting, updateEditStorageIndicator } from './storage.js';
import { translateUI, updateClock, updateInfrequentElements, animationLoop, handleVisibilityChange, updateOfflineStatus } from './core.js';
import {
    toggleMenu, closeMenuOnClickOutside, openModal, closeModal, closeThemeModal, showInfoModal,
    handleSaveUsername, applyTheme, applyShowSeconds, applyMenuBlur, applyFooterBlur,
    applyAvatarFullShow, applyAvatarAnimation, updateAvatarStatus, updateUsernameDisplay,
    updateSecurityFeaturesUI, checkResolutionAndToggleMessage, setupAvatarHoverListeners as mainSetupAvatarListeners, showFeedback,
    applyShowCredit, applyShowFooter, applyShowFooterInfo
} from './ui.js';
import { startPinUpdate, handleSaveInitialPin, handleSaveInitialAdvancedPin, handleDisableFeature, handlePinSubmit } from './pinManager.js';
import {
    renderPrompts, handleOpenAddPromptModal, handleEditPrompt, handleDeletePrompt,
    copyPromptTextFromViewer, showFullImage, copyPromptTextFromItem,
    handleSavePrompt, confirmDelete, closeAllPromptMenus, toggleManageMode,
    handleSelectAll, handleDeleteSelected, updateManageModeUI,
    toggleSearchMode, handleSearchInput
} from './promptManager.js';
import {
    renderAdvancedPrompts, toggleAdvancedManageMode, handleAdvancedSelectAll, 
    handleAdvancedDeleteSelected, toggleAdvancedSearchMode, handleAdvancedSearchInput, 
    updateAdvancedManageModeUI, handleOpenAddAdvancedPromptModal, handleSaveAdvancedPrompt,
    copyAdvancedPromptText, handleDeleteAdvancedPrompt, handleEditAdvancedPrompt,
    copyAdvancedPromptTextFromViewer, confirmAdvancedDelete, handleCharacterSearchInput,
    copyAdvancedCharacterText
} from './promptBuilder.js';
import {
    exportUserData, exportHiddenData, importUserData, importHiddenData,
    handleMerge, handleReplace
} from './importExport.js';

// Expose setupAvatarHoverListeners to be callable from ui.js
export const setupAvatarHoverListeners = mainSetupAvatarListeners;

// ===================================================================
// D. INISIALISASI & EVENT LISTENERS
// ===================================================================

function handleSettingsTabSwitch(activeTab) {
    if (pinSettings.input) {
        pinSettings.input.value = '';
    }
    if (pinSettings.feedbackText) {
        pinSettings.feedbackText.classList.remove('show');
    }

    const tabs = [otherSettingsModal.generalTab, otherSettingsModal.displayTab, otherSettingsModal.dataTab, otherSettingsModal.otherTab];
    const panels = [otherSettingsModal.generalPanel, otherSettingsModal.displayPanel, otherSettingsModal.dataPanel, otherSettingsModal.otherPanel];
    
    tabs.forEach(tab => tab.classList.remove('active'));
    panels.forEach(panel => panel.classList.remove('active'));

    switch (activeTab) {
        case 'display':
            otherSettingsModal.displayTab.classList.add('active');
            otherSettingsModal.displayPanel.classList.add('active');
            break;
        case 'data':
            otherSettingsModal.dataTab.classList.add('active');
            otherSettingsModal.dataPanel.classList.add('active');
            break;
        case 'other':
            otherSettingsModal.otherTab.classList.add('active');
            otherSettingsModal.otherPanel.classList.add('active');
            break;
        case 'general':
        default:
            otherSettingsModal.generalTab.classList.add('active');
            otherSettingsModal.generalPanel.classList.add('active');
            break;
    }
    const modalBody = otherSettingsModal.overlay.querySelector('.modal-body');
    if (modalBody) {
        modalBody.scrollTop = 0;
    }
}

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
                const newPrompts = [...prompts];
                const movedItem = newPrompts.splice(evt.oldIndex, 1)[0];
                newPrompts.splice(evt.newIndex, 0, movedItem);
                setPrompts(newPrompts);
                await saveSetting('prompts', newPrompts);
            },
        });
        setSortableInstance(sortable);
    }
    if (advancedPromptModal.grid) {
        const advancedSortable = new Sortable(advancedPromptModal.grid, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            filter: '.add-prompt-item',
            preventOnFilter: true,
            onMove: function (evt) {
                return !evt.related.classList.contains('add-prompt-item');
            },
            onEnd: async function(evt) {
                const newAdvancedPrompts = [...advancedPrompts];
                const movedItem = newAdvancedPrompts.splice(evt.oldIndex, 1)[0];
                newAdvancedPrompts.splice(evt.newIndex, 0, movedItem);
                setAdvancedPrompts(newAdvancedPrompts);
                await saveSetting('advancedPrompts', newAdvancedPrompts);
            },
        });
        setAdvancedSortableInstance(advancedSortable);
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
                updateSecurityFeaturesUI();
                renderPrompts();
                renderAdvancedPrompts();
                if (isManageModeActive) {
                    updateManageModeUI();
                }
                if (isAdvancedManageModeActive) {
                    updateAdvancedManageModeUI();
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

function handleAvatarDoubleClick() {
    if (themeModal.previewCheckbox && themeModal.previewCheckbox.checked) {
      return;
    }
    menu.container.classList.remove("show-menu");
    
    const isHiddenEnabled = !!userPIN;
    const isAdvancedEnabled = !!advancedPIN;
    const lang = languageSettings.ui;

    if (!isHiddenEnabled && !isAdvancedEnabled) return;

    let purpose = '';
    if (isHiddenEnabled && isAdvancedEnabled) {
        purpose = 'loginChoice';
    } else if (isHiddenEnabled) {
        purpose = 'loginHidden';
    } else if (isAdvancedEnabled) {
        purpose = 'loginAdvanced';
    }

    setPinModalPurpose(purpose);
    pinEnterModal.title.textContent = i18nData["pin.enter.title"][lang];
    pinEnterModal.label.textContent = i18nData["pin.enter.label"][lang];
    
    pinEnterModal.input.value = '';
    pinEnterModal.feedbackText.classList.remove('show');
    
    openModal(pinEnterModal.overlay);
    pinEnterModal.input.focus();
}

document.addEventListener("DOMContentLoaded", async () => {
    const keysToLoad = ["username", "theme", "showSeconds", "menuBlur", "footerBlur", "avatarFullShow", "avatarAnimation", "detectMouseStillness", "languageSettings", "userPIN", "prompts", "advancedPIN", "advancedPrompts", "showCredit", "showFooter", "showFooterInfo", "enablePopupFinder"];
    const settings = await loadSettings(keysToLoad);
    
    setCurrentUser(settings.username || "K1234");
    setUserPIN(settings.userPIN || null);
    setAdvancedPIN(settings.advancedPIN || null);
    setPrompts(settings.prompts || []);
    setAdvancedPrompts(settings.advancedPrompts || []);
    
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
    const shouldShowCredit = settings.showCredit !== false; settingSwitches.showCredit.checked = shouldShowCredit;
    const shouldShowFooter = settings.showFooter !== false; settingSwitches.showFooter.checked = shouldShowFooter;
    const shouldShowFooterInfo = settings.showFooterInfo !== false && shouldShowFooter;
    settingSwitches.applyToAll.checked = languageSettings.applyToAll;
    settingSwitches.showFooterInfo.checked = shouldShowFooterInfo;

    const shouldEnablePopupFinder = settings.enablePopupFinder === true;
    if (settingSwitches.enablePopupFinder) {
        settingSwitches.enablePopupFinder.checked = shouldEnablePopupFinder;
    }

    applyTheme(settings.theme || "system");
    applyShowSeconds(shouldShowSeconds);
    applyMenuBlur(shouldUseMenuBlur);
    applyFooterBlur(shouldUseFooterBlur);
    applyAvatarFullShow(shouldShowAvatar);
    applyAvatarAnimation(shouldAnimateAvatar);
    applyShowCredit(shouldShowCredit);
    applyShowFooter(shouldShowFooter);
    applyShowFooterInfo(shouldShowFooterInfo);

    if (shouldShowFooter) {
        applyShowFooterInfo(shouldShowFooterInfo);
    }

    translateUI(languageSettings.ui);
    updateUsernameDisplay();
    updateApplyAllState(languageSettings.applyToAll);
    updateSecurityFeaturesUI();
    renderPrompts();
    renderAdvancedPrompts();
    initializeDragAndDrop();

    updateOfflineStatus();
    updateClock();
    updateInfrequentElements();
    
    setAnimationFrameId(requestAnimationFrame(animationLoop));

    // Listener untuk memperbarui UI Prompt Builder saat karakter diubah
    document.addEventListener('characterPromptsUpdated', () => {
        renderAdvancedPrompts();
    });

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
        const condition = () => !isManageModeActive && !isSearchModeActive;
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
            if (action === 'copy-advanced') copyAdvancedPromptText(id);
            if (action === 'copy-char-advanced') copyAdvancedCharacterText(id);
            if (action === 'edit-advanced') handleEditAdvancedPrompt(id);
            if (action === 'delete-advanced') handleDeleteAdvancedPrompt(id);
        }
    });
    if (addEditAdvancedPromptModal.searchInput) {
        addEditAdvancedPromptModal.searchInput.addEventListener('input', handleCharacterSearchInput);
    }

    // Import and Export Data
    if (otherSettingsModal.dataTab) {
        otherSettingsModal.dataTab.addEventListener('click', () => handleSettingsTabSwitch('data'));
    }

    if (dataManagement.exportUserDataBtn) dataManagement.exportUserDataBtn.addEventListener('click', exportUserData);
    if (dataManagement.importUserDataBtn) dataManagement.importUserDataBtn.addEventListener('click', importUserData);
    if (dataManagement.exportHiddenDataBtn) dataManagement.exportHiddenDataBtn.addEventListener('click', exportHiddenData);
    if (dataManagement.importHiddenDataBtn) dataManagement.importHiddenDataBtn.addEventListener('click', importHiddenData);

    // Listener untuk modal konfirmasi Gabung/Ganti
    if (confirmationMergeReplaceModal.closeBtn) confirmationMergeReplaceModal.closeBtn.addEventListener('click', () => closeModal(confirmationMergeReplaceModal.overlay));
    if (confirmationMergeReplaceModal.mergeBtn) confirmationMergeReplaceModal.mergeBtn.addEventListener('click', handleMerge);
    if (confirmationMergeReplaceModal.replaceBtn) confirmationMergeReplaceModal.replaceBtn.addEventListener('click', handleReplace);

    document.querySelector('.footer').classList.add('footer-visible');
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

window.addEventListener("resize", () => {
    updateAvatarStatus();
    checkResolutionAndToggleMessage();
});

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

            if (lastModal === promptModal.overlay) {
                if (isSearchModeActive) {
                    toggleSearchMode(false);
                    return;
                }
                if (isManageModeActive) {
                    toggleManageMode(false);
                    return;
                }
            }
            
            if (lastModal === advancedPromptModal.overlay) {
                if (isAdvancedSearchModeActive) {
                    toggleAdvancedSearchMode(false);
                    return;
                }
                if (isAdvancedManageModeActive) {
                    toggleAdvancedManageMode(false);
                    return;
                }
            }

            if (lastModal === addEditAdvancedPromptModal.overlay) {
                if (addEditAdvancedPromptModal.searchInput && addEditAdvancedPromptModal.searchInput.value !== '') {
                    addEditAdvancedPromptModal.searchInput.value = '';
                    handleCharacterSearchInput();
                    return;
                }
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
    pinSettings.input.value = '';
    pinSettings.feedbackText.classList.remove('show');
    handleSettingsTabSwitch('general');
});
if (otherSettingsModal.closeBtn) otherSettingsModal.closeBtn.addEventListener("click", () => closeModal(otherSettingsModal.overlay));

if (otherSettingsModal.generalTab) {
    otherSettingsModal.generalTab.addEventListener('click', () => handleSettingsTabSwitch('general'));
}
if (otherSettingsModal.displayTab) {
    otherSettingsModal.displayTab.addEventListener('click', () => handleSettingsTabSwitch('display'));
}
if (otherSettingsModal.otherTab) {
    otherSettingsModal.otherTab.addEventListener('click', () => handleSettingsTabSwitch('other'));
}

if (aboutModal.openBtn) aboutModal.openBtn.addEventListener("click", () => {
    menu.container.classList.remove("show-menu");
    openModal(aboutModal.overlay);
});
if (aboutModal.closeBtn) aboutModal.closeBtn.addEventListener("click", () => closeModal(aboutModal.overlay));

const handleUpdatePinClick = () => {
    const newPin = pinSettings.input.value;
    if (!/^\d{4}$/.test(newPin)) {
        showFeedback(pinSettings.feedbackText, "settings.pin.feedback.error", true);
        return;
    }

    if (userPIN && advancedPIN) {
        updatePinChoiceModal.advancedBtn.disabled = false;
        openModal(updatePinChoiceModal.overlay);
    } else if (userPIN) {
        startPinUpdate('hidden');
    } else if (advancedPIN) {
        startPinUpdate('advanced');
    }
};

if (pinSettings.updateBtn) pinSettings.updateBtn.addEventListener('click', handleUpdatePinClick);
if (pinSettings.input) pinSettings.input.addEventListener('keydown', (e) => { 
    if (e.key === 'Enter') handleUpdatePinClick();
});


if (updatePinChoiceModal.closeBtn) updatePinChoiceModal.closeBtn.addEventListener('click', () => closeModal(updatePinChoiceModal.overlay));
if (updatePinChoiceModal.hiddenBtn) updatePinChoiceModal.hiddenBtn.addEventListener('click', () => {
    closeModal(updatePinChoiceModal.overlay);
    startPinUpdate('hidden');
});
if (updatePinChoiceModal.advancedBtn) updatePinChoiceModal.advancedBtn.addEventListener('click', () => {
    closeModal(updatePinChoiceModal.overlay);
    startPinUpdate('advanced');
});

if (createPinModal.saveBtn) createPinModal.saveBtn.addEventListener('click', handleSaveInitialPin);
if (createPinModal.input) createPinModal.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSaveInitialPin(); });
if (createPinModal.closeBtn) createPinModal.closeBtn.addEventListener('click', () => { closeModal(createPinModal.overlay); settingSwitches.hiddenFeature.checked = false; });

if (createAdvancedPinModal.saveBtn) createAdvancedPinModal.saveBtn.addEventListener('click', handleSaveInitialAdvancedPin);
if (createAdvancedPinModal.input) createAdvancedPinModal.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSaveInitialAdvancedPin(); });
if (createAdvancedPinModal.closeBtn) createAdvancedPinModal.closeBtn.addEventListener('click', () => { closeModal(createAdvancedPinModal.overlay); settingSwitches.continueFeature.checked = false; });

if (pinEnterModal.closeBtn) pinEnterModal.closeBtn.addEventListener("click", () => {
    closeModal(pinEnterModal.overlay);
    if (confirmationModalPurpose === 'disableHiddenFeature' || confirmationModalPurpose === 'disableContinueFeature') {
        updateSecurityFeaturesUI();
    }
});
if (pinEnterModal.submitBtn) pinEnterModal.submitBtn.addEventListener("click", handlePinSubmit);
if (pinEnterModal.input) pinEnterModal.input.addEventListener("keydown", (e) => { if (e.key === "Enter") handlePinSubmit(); });

if (promptModal.closeBtn) promptModal.closeBtn.addEventListener("click", () => {
    toggleManageMode(false);
    toggleSearchMode(false);
    closeModal(promptModal.overlay);
});

if (promptModal.manageBtn) promptModal.manageBtn.addEventListener('click', () => toggleManageMode());
if (promptModal.cancelManageBtn) promptModal.cancelManageBtn.addEventListener('click', () => toggleManageMode(false));
if (promptModal.selectAllBtn) promptModal.selectAllBtn.addEventListener('click', handleSelectAll);
if (promptModal.deleteSelectedBtn) promptModal.deleteSelectedBtn.addEventListener('click', handleDeleteSelected);
if (promptModal.searchBtn) promptModal.searchBtn.addEventListener('click', () => toggleSearchMode());
if (promptModal.cancelSearchBtn) promptModal.cancelSearchBtn.addEventListener('click', () => toggleSearchMode(false));
if (promptModal.searchInput) promptModal.searchInput.addEventListener('input', handleSearchInput);

// --- Advanced Prompt Modal Listeners ---
if (advancedPromptModal.closeBtn) advancedPromptModal.closeBtn.addEventListener("click", () => {
    toggleAdvancedManageMode(false);
    toggleAdvancedSearchMode(false);
    closeModal(advancedPromptModal.overlay);
});
if (advancedPromptModal.manageBtn) advancedPromptModal.manageBtn.addEventListener('click', () => toggleAdvancedManageMode());
if (advancedPromptModal.cancelManageBtn) advancedPromptModal.cancelManageBtn.addEventListener('click', () => toggleAdvancedManageMode(false));
if (advancedPromptModal.selectAllBtn) advancedPromptModal.selectAllBtn.addEventListener('click', handleAdvancedSelectAll);
if (advancedPromptModal.deleteSelectedBtn) advancedPromptModal.deleteSelectedBtn.addEventListener('click', handleAdvancedDeleteSelected);
if (advancedPromptModal.searchBtn) advancedPromptModal.searchBtn.addEventListener('click', () => toggleAdvancedSearchMode());
if (advancedPromptModal.cancelSearchBtn) advancedPromptModal.cancelSearchBtn.addEventListener('click', () => toggleAdvancedSearchMode(false));
if (advancedPromptModal.searchInput) advancedPromptModal.searchInput.addEventListener('input', handleAdvancedSearchInput);


if (promptViewerModal.closeBtn) promptViewerModal.closeBtn.addEventListener("click", () => { closeModal(promptViewerModal.overlay); });
if (promptViewerModal.copyBtn) promptViewerModal.copyBtn.addEventListener("click", copyPromptTextFromViewer);
if (promptViewerModal.deleteBtn) promptViewerModal.deleteBtn.addEventListener("click", () => handleDeletePrompt(currentPromptId));
if (promptViewerModal.editBtn) promptViewerModal.editBtn.addEventListener("click", () => { closeModal(promptViewerModal.overlay); handleEditPrompt(currentPromptId); });

if (advancedPromptViewerModal.closeBtn) advancedPromptViewerModal.closeBtn.addEventListener("click", () => { closeModal(advancedPromptViewerModal.overlay); });
if (advancedPromptViewerModal.copyBtn) advancedPromptViewerModal.copyBtn.addEventListener("click", () => copyAdvancedPromptTextFromViewer(currentAdvancedPromptId));
if (advancedPromptViewerModal.deleteBtn) advancedPromptViewerModal.deleteBtn.addEventListener("click", () => handleDeleteAdvancedPrompt(currentAdvancedPromptId));
if (advancedPromptViewerModal.editBtn) advancedPromptViewerModal.editBtn.addEventListener("click", () => { closeModal(advancedPromptViewerModal.overlay); handleEditAdvancedPrompt(currentAdvancedPromptId); });

if (addEditPromptModal.closeBtn) addEditPromptModal.closeBtn.addEventListener("click", () => { closeModal(addEditPromptModal.overlay); });
if (addEditPromptModal.saveBtn) addEditPromptModal.saveBtn.addEventListener("click", handleSavePrompt);

if (addEditAdvancedPromptModal.closeBtn) addEditAdvancedPromptModal.closeBtn.addEventListener("click", () => { closeModal(addEditAdvancedPromptModal.overlay); });
if (addEditAdvancedPromptModal.saveBtn) addEditAdvancedPromptModal.saveBtn.addEventListener("click", handleSaveAdvancedPrompt);

const handleCancelConfirmation = () => {
    closeModal(confirmationModal.overlay);
    if (confirmationModalPurpose === 'disableHiddenFeature') {
        settingSwitches.hiddenFeature.checked = true;
    } else if (confirmationModalPurpose === 'disableContinueFeature') {
        settingSwitches.continueFeature.checked = true;
    }
};
if (confirmationModal.closeBtn) confirmationModal.closeBtn.addEventListener("click", handleCancelConfirmation);
if (confirmationModal.cancelBtn) confirmationModal.cancelBtn.addEventListener("click", handleCancelConfirmation);
if (confirmationModal.confirmBtn) confirmationModal.confirmBtn.addEventListener("click", () => {
    const purpose = confirmationModalPurpose;
    if (purpose === 'disableHiddenFeature') {
        handleDisableFeature('hidden');
    } else if (purpose === 'disableContinueFeature') {
        handleDisableFeature('advanced');
    } else if (purpose === 'deletePrompt' || purpose === 'deleteSelectedPrompts') {
        confirmDelete();
    } else if (purpose === 'deleteAdvancedPrompt' || purpose === 'deleteSelectedAdvancedPrompts') {
        confirmAdvancedDelete();
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
if (settingSwitches.showCredit) settingSwitches.showCredit.addEventListener("change", async (e) => { applyShowCredit(e.target.checked); await saveSetting("showCredit", e.target.checked); });
if (settingSwitches.showFooter) {
    settingSwitches.showFooter.addEventListener("change", async (e) => {
        applyShowFooter(e.target.checked);
        await saveSetting("showFooter", e.target.checked);
        // Panggil updateOfflineStatus untuk segera merefleksikan perubahan
        updateOfflineStatus();
    });
}
if (settingSwitches.showFooterInfo) {
    settingSwitches.showFooterInfo.addEventListener("change", async (e) => {
        applyShowFooterInfo(e.target.checked);
        await saveSetting("showFooterInfo", e.target.checked);
        // Panggil updateOfflineStatus untuk segera merefleksikan perubahan
        updateOfflineStatus();
    });
}
if (settingSwitches.enablePopupFinder) {
    settingSwitches.enablePopupFinder.addEventListener("change", async (e) => {
        await saveSetting("enablePopupFinder", e.target.checked);
    });
}
if (settingSwitches.hiddenFeature) {
    settingSwitches.hiddenFeature.addEventListener('change', (e) => {
        if (e.target.checked) {
            if (!userPIN) {
                e.preventDefault();
                createPinModal.input.value = '';
                createPinModal.feedbackText.classList.remove('show');
                openModal(createPinModal.overlay);
                createPinModal.input.focus();
            }
        } else {
            e.preventDefault();
            setConfirmationModalPurpose('disableHiddenFeature');
            const lang = languageSettings.ui;
            confirmationModal.title.textContent = i18nData["settings.hidden.disableWarningTitle"][lang];
            confirmationModal.text.textContent = i18nData[advancedPIN ? "settings.hidden.disableWarningText_extended" : "settings.hidden.disableWarningText"][lang];
            openModal(confirmationModal.overlay);
        }
    });
}
if (settingSwitches.continueFeature) {
    settingSwitches.continueFeature.addEventListener('change', (e) => {
        if (e.target.checked) {
            if (!advancedPIN) {
                e.preventDefault();
                createAdvancedPinModal.input.value = '';
                createAdvancedPinModal.feedbackText.classList.remove('show');
                openModal(createAdvancedPinModal.overlay);
                createAdvancedPinModal.input.focus();
            }
        } else {
            e.preventDefault();
            setConfirmationModalPurpose('disableContinueFeature');
            const lang = languageSettings.ui;
            confirmationModal.title.textContent = i18nData["settings.continue.disableWarningTitle"][lang];
            confirmationModal.text.textContent = i18nData["settings.continue.disableWarningText"][lang];
            openModal(confirmationModal.overlay);
        }
    });
}