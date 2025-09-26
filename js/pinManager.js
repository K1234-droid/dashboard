import { proceedWithHiddenDataExport } from './ImportExport.js';
import {
    pinSettings, userPIN, advancedPIN, createPinModal, createAdvancedPinModal,
    pinEnterModal, i18nData, prompts, advancedPrompts,
    setTempNewPIN, setPinModalPurpose, setUserPIN, setAdvancedPIN, setPrompts,
    setAdvancedPrompts, languageSettings, settingSwitches, confirmationModal,
    promptModal, advancedPromptModal, tempNewPIN, pinModalPurpose
} from './config.js';
import { showFeedback, openModal, closeModal, updateSecurityFeaturesUI } from './ui.js';
import { saveSetting } from './storage.js';
import { showToast } from './utils.js';
import { renderPrompts } from './promptManager.js';
import { updateStorageIndicator } from './storage.js';
import { renderAdvancedPrompts } from './promptBuilder.js';

export function startPinUpdate(type) { // type is 'hidden' or 'advanced'
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
    
    // Membersihkan input PIN dan pesan feedback saat modal dibuka
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
    setAdvancedPIN(newPin);
    saveSetting('advancedPIN', newPin);
    showToast("settings.pin.feedback.saved");
    createAdvancedPinModal.input.value = '';
    closeModal(createAdvancedPinModal.overlay);
    updateSecurityFeaturesUI();
}


export function handleDisableFeature(type) { // 'hidden' or 'advanced'
    closeModal(confirmationModal.overlay);
    setPinModalPurpose(type === 'hidden' ? 'disableConfirmHidden' : 'disableConfirmAdvanced');
    const lang = languageSettings.ui;
    pinEnterModal.title.textContent = i18nData["pin.enter.confirmDisable"][lang];
    pinEnterModal.label.textContent = i18nData["pin.enter.confirmDisableLabel"][lang];
    
    // Membersihkan input PIN dan pesan feedback saat modal dibuka
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
                resetModal();
                openModal(promptModal.overlay);
                updateStorageIndicator();
            } else { showError(); }
            break;

        case 'loginAdvanced':
            if (enteredPin === advancedPIN) {
                resetModal();
                openModal(advancedPromptModal.overlay);
            } else { showError(); }
            break;

        case 'loginChoice':
            if (enteredPin === userPIN) {
                resetModal();
                openModal(promptModal.overlay);
                updateStorageIndicator();
            } else if (enteredPin === advancedPIN) {
                resetModal();
                openModal(advancedPromptModal.overlay);
            } else {
                showError();
            }
            break;

        case 'updateConfirmHidden':
            if (enteredPin === userPIN) {
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
                setUserPIN(null);
                setPrompts([]);
                setAdvancedPIN(null);
                setAdvancedPrompts([]);
                await Promise.all([
                    saveSetting('userPIN', null),
                    saveSetting('prompts', []),
                    saveSetting('advancedPIN', null),
                    saveSetting('advancedPrompts', [])
                ]);
                renderPrompts();
                renderAdvancedPrompts(); // <--- PERBAIKAN DI SINI
                resetModal();
                showToast("settings.hidden.disabled");
                updateSecurityFeaturesUI();
            } else { showError(); }
            break;

        case 'disableConfirmAdvanced':
             if (enteredPin === advancedPIN) {
                setAdvancedPIN(null);
                setAdvancedPrompts([]);
                await Promise.all([
                    saveSetting('advancedPIN', null),
                    saveSetting('advancedPrompts', [])
                ]);
                renderAdvancedPrompts(); // <--- DAN DI SINI
                resetModal();
                showToast("settings.hidden.disabled");
                updateSecurityFeaturesUI();
            } else { showError(); }
            break;

        case 'exportHidden':
            if (enteredPin === userPIN) {
                resetModal();
                proceedWithHiddenDataExport(); // Panggil fungsi ekspor setelah PIN benar
            } else { showError(); }
            break;

        case 'disableConfirmAdvanced':
    }
}