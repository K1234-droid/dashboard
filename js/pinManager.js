import { proceedWithHiddenDataExport } from './importExport.js';
import {
    pinSettings, userPIN, createPinModal,
    pinEnterModal, i18nData, prompts, advancedPrompts,
    setTempNewPIN, setPinModalPurpose, setUserPIN, setPrompts,
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

    setTempNewPIN(newPin);
    setPinModalPurpose('updateConfirmHidden');
    
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
    createPinModal.input.blur();
    setUserPIN(newPin);
    saveSetting('userPIN', newPin);
    showToast("settings.pin.feedback.saved");
    createPinModal.input.value = '';
    closeModal(createPinModal.overlay);
    updateSecurityFeaturesUI();
}

export function handleDisableFeature(type) {
    closeModal(confirmationModal.overlay);
    setPinModalPurpose('disableConfirmHidden');
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

        case 'disableConfirmHidden':
            if (enteredPin === userPIN) {
                pinEnterModal.input.blur();
                await deleteAllPrompts();

                await Promise.all([
                    saveSetting('userPIN', null),
                    saveSetting('promptOrder', []),
                    saveSetting('advancedPrompts', []),
                    saveSetting('enablePopupFinder', false),
                    saveSetting('enablePromptSearch', false)
                ]);

                setUserPIN(null);
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