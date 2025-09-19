import {
    pinSettings, userPIN, createPinModal, pinEnterModal, i18nData, prompts,
    setTempNewPIN, setPinModalPurpose, setUserPIN, setPrompts, languageSettings,
    settingSwitches, confirmationModal, promptModal, tempNewPIN, pinModalPurpose
} from './config.js';
import { showFeedback, openModal, closeModal, updateHiddenFeatureUI } from './ui.js';
import { saveSetting } from './storage.js';
import { showToast } from './utils.js';
import { renderPrompts } from './promptManager.js';
import { updateStorageIndicator } from './storage.js';

export function handleUpdatePin() {
    const newPin = pinSettings.input.value;
    if (!/^\d{4}$/.test(newPin)) {
        showFeedback(pinSettings.feedbackText, "settings.pin.feedback.error", true);
        return;
    }

    if (userPIN) {
        setTempNewPIN(newPin);
        setPinModalPurpose('update');
        const lang = languageSettings.ui;
        pinEnterModal.title.textContent = i18nData["pin.enter.confirmUpdate"][lang];
        pinEnterModal.label.textContent = i18nData["pin.enter.confirmUpdateLabel"][lang];
        openModal(pinEnterModal.overlay);
        pinEnterModal.input.focus();
    } else {
        setUserPIN(newPin);
        saveSetting('userPIN', newPin);
        showToast("settings.pin.feedback.saved");
        pinSettings.input.value = '';
        updateHiddenFeatureUI();
    }
}

export function handleSaveInitialPin() {
    const newPin = createPinModal.input.value;
    if (!/^\d{4}$/.test(newPin)) {
        showFeedback(createPinModal.feedbackText, "settings.pin.feedback.error", true);
        return;
    }
    setUserPIN(newPin);
    saveSetting('userPIN', newPin);
    
    showToast("settings.pin.feedback.saved");
    
    createPinModal.input.value = '';
    closeModal(createPinModal.overlay);
    
    settingSwitches.hiddenFeature.checked = true;
    updateHiddenFeatureUI();
}

export function handleDisableFeature() {
    closeModal(confirmationModal.overlay);
    setPinModalPurpose('disable');
    const lang = languageSettings.ui;
    pinEnterModal.title.textContent = i18nData["pin.enter.confirmDisable"][lang];
    pinEnterModal.label.textContent = i18nData["pin.enter.confirmDisableLabel"][lang];
    openModal(pinEnterModal.overlay);
    pinEnterModal.input.focus();
}

export function handlePinSubmit() {
    const enteredPin = pinEnterModal.input.value;
    const lang = languageSettings.ui;

    if (pinModalPurpose === 'login') {
        if (enteredPin === userPIN) {
            pinEnterModal.feedbackText.classList.remove('show');
            pinEnterModal.input.value = '';
            closeModal(pinEnterModal.overlay);
            openModal(promptModal.overlay);
            updateStorageIndicator();
        } else {
            showFeedback(pinEnterModal.feedbackText, "settings.pin.feedback.wrong", true);
            pinEnterModal.input.value = '';
        }
    } else if (pinModalPurpose === 'update') {
        if (enteredPin === userPIN) {
            setUserPIN(tempNewPIN);
            saveSetting('userPIN', userPIN);
            setTempNewPIN(null);
            
            pinEnterModal.feedbackText.classList.remove('show');
            pinEnterModal.input.value = '';
            closeModal(pinEnterModal.overlay);

            showToast("settings.hidden.pinUpdated");
            pinSettings.input.value = '';
        } else {
            showFeedback(pinEnterModal.feedbackText, "settings.pin.feedback.wrong", true);
            pinEnterModal.input.value = '';
        }
    } else if (pinModalPurpose === 'disable') {
        if (enteredPin === userPIN) {
            setUserPIN(null);
            setPrompts([]);
            saveSetting('userPIN', null);
            saveSetting('prompts', []);
            renderPrompts();

            pinEnterModal.feedbackText.classList.remove('show');
            pinEnterModal.input.value = '';
            closeModal(pinEnterModal.overlay);

            showToast("settings.hidden.disabled");
            updateHiddenFeatureUI();
        } else {
            showFeedback(pinEnterModal.feedbackText, "settings.pin.feedback.wrong", true);
            pinEnterModal.input.value = '';
        }
    }
}