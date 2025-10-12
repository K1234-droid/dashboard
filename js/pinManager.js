import { proceedWithHiddenDataExport } from './importExport.js';
import {
    pinSettings, userPIN, advancedPIN, createPinModal, createAdvancedPinModal,
    pinEnterModal, i18nData, prompts, advancedPrompts,
    setTempNewPIN, setPinModalPurpose, setUserPIN, setAdvancedPIN, setPrompts,
    setAdvancedPrompts, languageSettings, settingSwitches, confirmationModal,
    promptModal, advancedPromptModal, tempNewPIN, pinModalPurpose
} from './config.js';
import { showFeedback, openModal, closeModal, updateSecurityFeaturesUI } from './ui.js';
import { saveSetting, deleteAllPrompts } from './storage.js';
import { showToast } from './utils.js';
import { renderPrompts } from './promptManager.js';
import { renderAdvancedPrompts } from './promptBuilder.js';

export function startPinUpdate(type) {
    const newPin = pinSettings.input.value;
    
    if (!/^\d{4}$/.test(newPin)) {
        showFeedback(pinSettings.feedbackText, "settings.pin.feedback.error", true);
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
    pinEnterModal.feedbackText.classList.remove('show');
    
    openModal(pinEnterModal.overlay);
    pinEnterModal.input.focus();
}

export function handleSaveInitialPin() {
    const newPin = createPinModal.input.value;
    if (!/^\d{4}$/.test(newPin)) {
        showFeedback(createPinModal.feedbackText, "settings.pin.feedback.error", true);
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
        showFeedback(createAdvancedPinModal.feedbackText, "settings.pin.feedback.error", true);
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
    pinEnterModal.feedbackText.classList.remove('show');

    openModal(pinEnterModal.overlay);
    pinEnterModal.input.focus();
}

export async function handlePinSubmit() {
    const enteredPin = pinEnterModal.input.value;
    pinEnterModal.input.value = '';

    const resetModal = () => {
        pinEnterModal.feedbackText.classList.remove('show');
        closeModal(pinEnterModal.overlay);
    };
    
    const showError = () => {
        showFeedback(pinEnterModal.feedbackText, "settings.pin.feedback.wrong", true);
    };

    switch (pinModalPurpose) {
        case 'loginHidden':
            if (enteredPin === userPIN) {
                pinEnterModal.input.blur();
                resetModal();
                openModal(promptModal.overlay);
            } else { showError(); }
            break;

        case 'loginAdvanced':
            if (enteredPin === advancedPIN) {
                pinEnterModal.input.blur();
                resetModal();
                openModal(advancedPromptModal.overlay);
            } else { showError(); }
            break;

        case 'loginChoice':
            if (enteredPin === userPIN) {
                pinEnterModal.input.blur();
                resetModal();
                openModal(promptModal.overlay);
            } else if (enteredPin === advancedPIN) {
                pinEnterModal.input.blur();
                resetModal();
                openModal(advancedPromptModal.overlay);
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
                    saveSetting('enablePopupFinder', false)
                ]);

                setUserPIN(null);
                setAdvancedPIN(null);
                setPrompts([]);
                setAdvancedPrompts([]);
                
                renderPrompts();
                renderAdvancedPrompts();
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
                resetModal();
                showToast("settings.hidden.disabled");
                updateSecurityFeaturesUI();
            } else { showError(); }
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

        case 'disableConfirmAdvanced':
    }
}