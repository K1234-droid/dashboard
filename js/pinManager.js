import { proceedWithHiddenDataExport } from './importExport.js';
import {
    pinSettings, userPIN, advancedPIN, createPinModal, createAdvancedPinModal,
    pinEnterModal, i18nData, prompts, advancedPrompts,
    setTempNewPIN, setPinModalPurpose, setUserPIN, setAdvancedPIN, setPrompts,
    setAdvancedPrompts, languageSettings, settingSwitches, confirmationModal,
    promptModal, advancedPromptModal, tempNewPIN, pinModalPurpose, setIsPromptSearchEnabled,
    setCharacterDataStale, isCharacterDataStale, isAdvancedGridStale, setIsAdvancedGridStale,
    setCachedIconDataUrls, isPromptGridStale, setIsPromptGridStale
} from './config.js';
import { openModal, closeModal, updateSecurityFeaturesUI, showLoadingModal, hideLoadingModal } from './ui.js';
import { saveSetting, deleteAllPrompts, clearHiddenData } from './storage.js';
import { showToast } from './utils.js';
import { renderPrompts, populateIconCacheIfNeeded, populateThumbnailCacheIfNeeded } from './promptManager.js';
import { renderAdvancedPrompts, reorderAdvancedPromptGrid } from './promptBuilder.js';
import { initializeData as reinitializeSearchData } from './search.js';

export function startPinUpdate(type) {
    const newPin = pinSettings.input.value;
    
    if (!/^\d{4}$/.test(newPin)) {
        showToast("settings.pin.feedback.error");
        return;
    }

    const otherPin = type === 'hidden' ? advancedPIN : userPIN;
    if (otherPin && newPin === otherPin) {
        showToast("pin.feedback.used");
        return;
    }

    setTempNewPIN(newPin);
    setPinModalPurpose(type === 'hidden' ? 'updateConfirmHidden' : 'updateConfirmAdvanced');
    
    const lang = languageSettings.ui;
    pinEnterModal.title.textContent = i18nData["pin.enter.confirmUpdate"][lang];
    pinEnterModal.label.textContent = i18nData["pin.enter.confirmUpdateLabel"][lang];
    
    pinEnterModal.input.value = '';
    
    openModal(pinEnterModal.overlay);
    pinEnterModal.input.focus();
}

export function handleSaveInitialPin() {
    const newPin = createPinModal.input.value;
    if (!/^\d{4}$/.test(newPin)) {
        showToast("settings.pin.feedback.error");
        return;
    }
    if (advancedPIN && newPin === advancedPIN) {
        showToast("pin.feedback.used");
        return;
    }

    createPinModal.input.blur();

    setUserPIN(newPin);
    saveSetting('userPIN', newPin);
    showToast("settings.pin.feedback.saved");
    createPinModal.input.value = '';
    closeModal(createPinModal.overlay);
    updateSecurityFeaturesUI();
}

export function handleSaveInitialAdvancedPin() {
    const newPin = createAdvancedPinModal.input.value;
    if (!/^\d{4}$/.test(newPin)) {
        showToast("settings.pin.feedback.error");
        return;
    }
    if (userPIN && newPin === userPIN) {
        showToast("pin.feedback.used");
        return;
    }

    createAdvancedPinModal.input.blur();

    setAdvancedPIN(newPin);
    saveSetting('advancedPIN', newPin);
    showToast("settings.pin.feedback.saved");
    createAdvancedPinModal.input.value = '';
    closeModal(createAdvancedPinModal.overlay);
    updateSecurityFeaturesUI();
}


export function handleDisableFeature(type) {
    closeModal(confirmationModal.overlay);
    setPinModalPurpose(type === 'hidden' ? 'disableConfirmHidden' : 'disableConfirmAdvanced');
    const lang = languageSettings.ui;
    pinEnterModal.title.textContent = i18nData["pin.enter.confirmDisable"][lang];
    pinEnterModal.label.textContent = i18nData["pin.enter.confirmDisableLabel"][lang];
    
    pinEnterModal.input.value = '';

    openModal(pinEnterModal.overlay);
    pinEnterModal.input.focus();
}

export async function handlePinSubmit() {
    const enteredPin = pinEnterModal.input.value;
    pinEnterModal.input.value = '';

    const resetModal = () => {
        closeModal(pinEnterModal.overlay);
    };
    
    const showError = () => {
        showToast("settings.pin.feedback.wrong");
    };

    switch (pinModalPurpose) {
        case 'loginHidden':
            if (enteredPin === userPIN) {
                pinEnterModal.input.blur();
                resetModal();
                showLoadingModal();
                setTimeout(async () => {
                    await populateThumbnailCacheIfNeeded();
                    if (isPromptGridStale) {
                        await renderPrompts();
                        setIsPromptGridStale(false);
                    }
                    hideLoadingModal();
                    openModal(promptModal.overlay);
                }, 50);
            } else { showError(); }
            break;

        case 'loginAdvanced':
            if (enteredPin === advancedPIN) {
                pinEnterModal.input.blur();
                resetModal();
                showLoadingModal();
                setTimeout(async () => {
                    await populateIconCacheIfNeeded();
                    if (isCharacterDataStale) {
                        renderAdvancedPrompts();
                        setCharacterDataStale(false);
                    }
                    if (isAdvancedGridStale) {
                        reorderAdvancedPromptGrid();
                        setIsAdvancedGridStale(false);
                    }
                    hideLoadingModal();
                    openModal(advancedPromptModal.overlay);
                }, 50);
            } else { showError(); }
            break;

        case 'loginChoice':
            if (enteredPin === userPIN) {
                pinEnterModal.input.blur();
                resetModal();
                showLoadingModal();
                setTimeout(async () => {
                    await populateThumbnailCacheIfNeeded();
                    if (isPromptGridStale) {
                        await renderPrompts();
                        setIsPromptGridStale(false);
                    }
                    hideLoadingModal();
                    openModal(promptModal.overlay);
                }, 50);
            } else if (enteredPin === advancedPIN) {
                pinEnterModal.input.blur();
                resetModal();
                showLoadingModal();
                setTimeout(async () => {
                    await populateIconCacheIfNeeded();
                    if (isCharacterDataStale) {
                        renderAdvancedPrompts();
                        setCharacterDataStale(false);
                    }
                    if (isAdvancedGridStale) {
                        reorderAdvancedPromptGrid();
                        setIsAdvancedGridStale(false);
                    }
                    hideLoadingModal();
                    openModal(advancedPromptModal.overlay);
                }, 50);
            } else {
                showError();
            }
            break;

        case 'updateConfirmHidden':
            if (enteredPin === userPIN) {
                pinEnterModal.input.blur();
                setUserPIN(tempNewPIN);
                await saveSetting('userPIN', userPIN);
                setTempNewPIN(null);
                resetModal();
                showToast("settings.hidden.pinUpdated");
                pinSettings.input.value = '';
            } else { showError(); }
            break;
        
        case 'updateConfirmAdvanced':
            if (enteredPin === advancedPIN) {
                pinEnterModal.input.blur();
                setAdvancedPIN(tempNewPIN);
                await saveSetting('advancedPIN', advancedPIN);
                setTempNewPIN(null);
                resetModal();
                showToast("settings.hidden.pinUpdated");
                pinSettings.input.value = '';
            } else { showError(); }
            break;

        case 'disableConfirmHidden':
            if (enteredPin === userPIN) {
                pinEnterModal.input.blur();
                await deleteAllPrompts();

                await Promise.all([
                    saveSetting('userPIN', null),
                    saveSetting('advancedPIN', null),
                    saveSetting('promptOrder', []),
                    saveSetting('advancedPrompts', []),
                    saveSetting('enablePopupFinder', false),
                    saveSetting('enablePromptSearch', false)
                ]);

                setUserPIN(null);
                setAdvancedPIN(null);
                setPrompts([]);
                setAdvancedPrompts([]);
                setCachedIconDataUrls({});

                setIsPromptSearchEnabled(false);
                
                renderPrompts();
                renderAdvancedPrompts();
                reinitializeSearchData();
                resetModal();
                showToast("settings.hidden.disabled");
                updateSecurityFeaturesUI();
            } else { showError(); }
            break;

        case 'disableConfirmAdvanced':
             if (enteredPin === advancedPIN) {
                pinEnterModal.input.blur();
                setAdvancedPIN(null);
                setAdvancedPrompts([]);
                await Promise.all([
                    saveSetting('advancedPIN', null),
                    saveSetting('advancedPrompts', [])
                ]);
                renderAdvancedPrompts();
                reinitializeSearchData();
                resetModal();
                showToast("settings.hidden.disabled");
                updateSecurityFeaturesUI();
            } else { showError(); }
            break;

        case 'confirmDeleteHiddenData':
            if (enteredPin === userPIN) {
                pinEnterModal.input.blur();
                resetModal();
                await clearHiddenData();
                showToast("data.delete.hidden.success");
                setTimeout(() => window.location.reload(), 1500);
            } else { 
                showError(); 
            }
            break;

        case 'exportHidden':
            if (enteredPin === userPIN) {
                pinEnterModal.input.blur();
                resetModal();
                proceedWithHiddenDataExport();
            } else { showError(); }
            break;

        case 'confirmEnablePopupFinder':
            if (enteredPin === userPIN) {
                pinEnterModal.input.blur();
                settingSwitches.enablePopupFinder.checked = true;
                await saveSetting("enablePopupFinder", true);
                resetModal();
                showToast("popup.success.enabled");
            } else { 
                showError(); 
            }
            break;

        case 'confirmDisablePopupFinder':
            if (enteredPin === userPIN) {
                pinEnterModal.input.blur();
                settingSwitches.enablePopupFinder.checked = false;
                await saveSetting("enablePopupFinder", false);
                resetModal();
                showToast("popup.success.disabled");
            } else { 
                showError(); 
            }
            break;

        case 'confirmEnablePromptSearch':
            if (enteredPin === userPIN) {
                pinEnterModal.input.blur();
                settingSwitches.enablePromptSearch.checked = true;
                await saveSetting("enablePromptSearch", true);
                setIsPromptSearchEnabled(true);
                resetModal();
                showToast("prompt.search.success.enabled");
                reinitializeSearchData();
            } else { 
                showError(); 
            }
            break;

        case 'confirmDisablePromptSearch':
            if (enteredPin === userPIN) {
                pinEnterModal.input.blur();
                settingSwitches.enablePromptSearch.checked = false;
                await saveSetting("enablePromptSearch", false);
                setIsPromptSearchEnabled(false);
                resetModal();
                showToast("prompt.search.success.disabled");
                reinitializeSearchData();
            } else { 
                showError(); 
            }
            break;
    }
}