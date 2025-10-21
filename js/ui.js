import {
    elements,
    usernameModal,
    themeModal,
    aboutModal,
    otherSettingsModal,
    infoModal,
    activeModalStack,
    currentUser,
    setCurrentUser,
    languageSettings,
    i18nData,
    menu,
    pinSettings,
    settingSwitches,
    avatarStatus,
    setActiveModalStack,
    userPIN,
    advancedPIN,
    feedbackTimeout,
    setFeedbackTimeout,
    dataManagement,
    progressModal,
    loadingModal,
    setIsBlockingModalActive,
    updateModal
} from './config.js';
import { saveSetting } from './storage.js';
import { showToast } from './utils.js';

let hoverTimeout;

// --- Modals and Menus ---
export function toggleMenu(event) {
    event.stopPropagation();
    menu.container.classList.toggle("show-menu");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export function closeMenuOnClickOutside(event) {
    if (menu.container && menu.container.classList.contains("show-menu")) {
        if (!menu.popup.contains(event.target)) {
            menu.container.classList.remove("show-menu");
        }
    }
}

export function openModal(overlay) {
    if (!overlay) return;

    const baseZIndex = 101;
    overlay.style.zIndex = baseZIndex + activeModalStack.length;

    overlay.classList.remove("hidden");
    const newStack = [...activeModalStack, overlay];
    setActiveModalStack(newStack);
    
    const modalBody = overlay.querySelector(".modal-body");
    if (modalBody) modalBody.scrollTop = 0;
    
    elements.body.classList.add("modal-open");
}

export function closeModal(overlay) {
    if (overlay) {
        overlay.classList.add("hidden");
        const newStack = activeModalStack.filter(modal => modal !== overlay);
        setActiveModalStack(newStack);
    }
    if (activeModalStack.length === 0) {
        elements.body.classList.remove("modal-open");
    }
}

export function closeThemeModal() {
    if (themeModal.overlay) {
        themeModal.overlay.classList.add("hidden");
        themeModal.overlay.classList.remove("preview-mode");
        const newStack = activeModalStack.filter(modal => modal !== themeModal.overlay);
        setActiveModalStack(newStack);

        if (themeModal.previewCheckbox) themeModal.previewCheckbox.checked = false;
        [usernameModal.openBtn, themeModal.openBtn, aboutModal.openBtn, otherSettingsModal.openBtn, updateModal.checkBtn].forEach((btn) => {
            if (btn) btn.disabled = false;
        });
    }
    if (activeModalStack.length === 0) {
        elements.body.classList.remove("modal-open");
    }
}

export function showInfoModal(titleKey, messageKey) {
    const lang = languageSettings.ui;
    const translatedTitle = i18nData[titleKey]?.[lang] || titleKey;
    const translatedMessage = i18nData[messageKey]?.[lang] || messageKey;
    infoModal.title.textContent = translatedTitle;
    infoModal.text.textContent = translatedMessage;
    openModal(infoModal.overlay);
}

// --- Feedback and Display Updates ---
export function showFeedback(modalFeedbackElement, messageKey, isError = false) {
    clearTimeout(feedbackTimeout);
    const lang = languageSettings.ui;
    const message = i18nData[messageKey]?.[lang] || i18nData[messageKey]?.['id'] || '';
    modalFeedbackElement.textContent = message;
    modalFeedbackElement.className = 'feedback-text show';
    modalFeedbackElement.classList.toggle('error', isError);
    modalFeedbackElement.classList.toggle('success', !isError);
    const newTimeout = setTimeout(() => {
        modalFeedbackElement.classList.remove('show');
    }, 3000);
    setFeedbackTimeout(newTimeout);
}

export function updateUsernameDisplay() {
    const lang = languageSettings.ui;
    const template = i18nData["footer.account"]?.[lang] || i18nData["footer.account"]?.['id'];
    if (template) {
        const message = template.replace('{value}', currentUser);
        if (elements.accountMessage) {
            elements.accountMessage.textContent = message;
            elements.accountMessage.setAttribute('data-i18n-value', currentUser);
        }
        // Jika footer info disetel sebagai toast, tampilkan perubahan username juga
        if (document.body.classList.contains('footer-info-as-toast')) {
            showToast('footer.account', currentUser);
        }
    }
}

export async function handleSaveUsername() {
    usernameModal.input.blur();
    let newUsername = usernameModal.input.value.trim();
    if (newUsername.length === 0) { newUsername = "K1234"; }
    
    if (newUsername.length <= 6) {
        setCurrentUser(newUsername);
        await saveSetting("username", currentUser);
        updateUsernameDisplay();
        showFeedback(usernameModal.feedbackText, "settings.username.feedback.saved", false);
        setTimeout(() => closeModal(usernameModal.overlay), 500);
    } else {
        showFeedback(usernameModal.feedbackText, "settings.username.feedback.error", true);
    }
}

export function applyShowFooter(show) {
    elements.body.classList.toggle("footer-hidden", !show);
    handleFooterInfoSwitchState();
    updateAvatarStatus();
}

export function applyShowFooterInfo(show) {
    const isFooterOn = settingSwitches.showFooter ? settingSwitches.showFooter.checked : false;
    elements.body.classList.toggle("footer-info-as-toast", !show || !isFooterOn);
}

export function applyEnableAnimation(show) {
    elements.body.classList.toggle("animations-disabled", !show);
    updateAvatarStatus();
}

// --- Apply Settings ---
export function applyTheme(theme) {
    elements.body.classList.remove("dark-theme", "light-theme");
    [themeModal.lightBtn, themeModal.darkBtn, themeModal.systemBtn].forEach((btn) => {
        if (btn) btn.classList.remove("active");
    });

    if (theme === "dark") {
        elements.body.classList.add("dark-theme");
        if (themeModal.darkBtn) themeModal.darkBtn.classList.add("active");
    } else if (theme === "light") {
        elements.body.classList.add("light-theme");
        if (themeModal.lightBtn) themeModal.lightBtn.classList.add("active");
    } else {
        if (themeModal.systemBtn) themeModal.systemBtn.classList.add("active");
    }
}

export function applyShowSeconds(show) { elements.body.classList.toggle("seconds-hidden", !show); }
export function applyMenuBlur(show) { elements.body.classList.toggle("menu-blur-disabled", !show); }
export function applyFooterBlur(show) { elements.body.classList.toggle("footer-blur-disabled", !show); }

export function applyShowCredit(show) {
    updateAvatarStatus();
}

export function applyAvatarFullShow(show) {
    const avatarFull = document.querySelector(".avatar-full");
    if (avatarFull) { avatarFull.classList.toggle("hidden", !show); }
    elements.body.classList.toggle("avatar-hidden", !show);
    updateAvatarStatus();
}

export function applyAvatarAnimation(show) {
    elements.body.classList.toggle("avatar-animation-disabled", !show);
    updateAvatarStatus();
}

// --- Avatar Logic ---
const avatar = document.querySelector(".avatar-full");
const handleSimpleMouseEnter = () => avatar.classList.add('is-zoomed');
const handleSimpleMouseLeave = () => avatar.classList.remove('is-zoomed');
const handleStillnessMouseEnter = () => { hoverTimeout = setTimeout(() => avatar.classList.add('is-zoomed'), 300); };
const handleStillnessMouseMove = () => { clearTimeout(hoverTimeout); hoverTimeout = setTimeout(() => avatar.classList.add('is-zoomed'), 300); };
const handleStillnessMouseLeave = () => { clearTimeout(hoverTimeout); avatar.classList.remove('is-zoomed'); };

export function setupAvatarHoverListeners() {
    avatar.removeEventListener('mouseenter', handleSimpleMouseEnter);
    avatar.removeEventListener('mouseleave', handleSimpleMouseLeave);
    avatar.removeEventListener('mouseenter', handleStillnessMouseEnter);
    avatar.removeEventListener('mousemove', handleStillnessMouseMove);
    avatar.removeEventListener('mouseleave', handleStillnessMouseLeave);
    avatar.classList.remove('is-zoomed');

    const isAnimationFeatureEnabled = !settingSwitches.avatarAnimation.disabled && settingSwitches.avatarAnimation.checked;
    settingSwitches.detectMouseStillness.disabled = !isAnimationFeatureEnabled;

    if (isAnimationFeatureEnabled) {
        const isStillnessDetectionEnabled = settingSwitches.detectMouseStillness.checked;
        if (isStillnessDetectionEnabled) {
            avatar.addEventListener('mouseenter', handleStillnessMouseEnter);
            avatar.addEventListener('mousemove', handleStillnessMouseMove);
            avatar.addEventListener('mouseleave', handleStillnessMouseLeave);
        } else {
            avatar.addEventListener('mouseenter', handleSimpleMouseEnter);
            avatar.addEventListener('mouseleave', handleSimpleMouseLeave);
        }
    }
}

export function updateAvatarStatus() {
    if (!avatarStatus.text || !avatarStatus.helpText) return;
    
    const isSupportedResolution = window.innerWidth > 930;
    const isCreditSupportedResolution = window.innerWidth >= 865;
    const supportedText = { id: "Iya", en: "Yes", jp: "はい" };
    const notSupportedText = { id: "Tidak", en: "No", jp: "いいえ" };
    const lang = languageSettings.ui;
    const stillnessHelpText = document.getElementById('detect-mouse-stillness-help-text');

    avatarStatus.text.textContent = isSupportedResolution ? supportedText[lang] || supportedText['id'] : notSupportedText[lang] || notSupportedText['id'];
    avatarStatus.text.className = isSupportedResolution ? "supported" : "not-supported";
    avatarStatus.helpText.classList.toggle("is-hidden", isSupportedResolution);

    const isAvatarFullShown = settingSwitches.avatarFullShow.checked;
    const areGlobalAnimationsEnabled = settingSwitches.enableAnimation ? settingSwitches.enableAnimation.checked : true;
    const isAvatarAnimationOn = settingSwitches.avatarAnimation.checked;
    const disableAnimationSwitches = !isAvatarFullShown || !isSupportedResolution || !areGlobalAnimationsEnabled;

    if (settingSwitches.avatarAnimation) { 
        settingSwitches.avatarAnimation.disabled = disableAnimationSwitches;
    }
    
    if (settingSwitches.detectMouseStillness) { 
        const isStillnessDisabled = disableAnimationSwitches || !isAvatarAnimationOn;
        settingSwitches.detectMouseStillness.disabled = isStillnessDisabled;
        
        if (stillnessHelpText) {
            stillnessHelpText.classList.toggle('disabled', isStillnessDisabled);
        }
    }
    
    if (settingSwitches.showCredit) { 
        const isFooterHidden = settingSwitches.showFooter && !settingSwitches.showFooter.checked;
        settingSwitches.showCredit.disabled = !isAvatarFullShown || !isCreditSupportedResolution || isFooterHidden;
    }

    if (elements.creditText) {
        const isCreditSwitchOn = settingSwitches.showCredit.checked;
        const isFooterOn = settingSwitches.showFooter ? settingSwitches.showFooter.checked : false;
        elements.creditText.classList.toggle('visible', isAvatarFullShown && isCreditSwitchOn && isCreditSupportedResolution && isFooterOn);
    }
    
    setupAvatarHoverListeners();
    checkResolutionAndToggleMessage();
}

export function checkResolutionAndToggleMessage() {
}

export function handleFooterInfoSwitchState() {
    if (!settingSwitches.showFooterInfo || !settingSwitches.showFooter) return;

    const isMobileView = window.innerWidth <= 410;
    const isFooterHidden = !settingSwitches.showFooter.checked;
    const shouldBeDisabled = isMobileView || isFooterHidden;
    settingSwitches.showFooterInfo.disabled = shouldBeDisabled;
    const effectiveState = shouldBeDisabled ? false : settingSwitches.showFooterInfo.checked;

    applyShowFooterInfo(effectiveState);
}

export function updateSecurityFeaturesUI() {
    const isHiddenEnabled = !!userPIN;
    const isAdvancedEnabled = !!advancedPIN;
    const lang = languageSettings.ui;
    const manageHiddenContainer = document.getElementById('manage-hidden-data-container');
    const popupFinderHelpText = document.getElementById('enable-popup-finder-help-text');

    if (manageHiddenContainer) {
        manageHiddenContainer.classList.toggle('disabled', !isHiddenEnabled);
        dataManagement.importHiddenDataBtn.disabled = !isHiddenEnabled;
        dataManagement.exportHiddenDataBtn.disabled = !isHiddenEnabled;
    }

    settingSwitches.hiddenFeature.checked = isHiddenEnabled;

    settingSwitches.continueFeature.checked = isAdvancedEnabled;
    settingSwitches.continueFeature.disabled = !isHiddenEnabled;

    if (isHiddenEnabled || isAdvancedEnabled) {
        pinSettings.container.classList.remove('hidden');
        pinSettings.updateBtn.textContent = i18nData["settings.hidden.updatePin"][lang] || "Update PIN";
    } else {
        pinSettings.container.classList.add('hidden');
    }
    if (settingSwitches.enablePopupFinder) {
        const isDisabled = !isHiddenEnabled;
        settingSwitches.enablePopupFinder.disabled = isDisabled;

        if (popupFinderHelpText) {
            popupFinderHelpText.classList.toggle('disabled', isDisabled);
        }

        if (isDisabled) {
            settingSwitches.enablePopupFinder.checked = false;
            saveSetting("enablePopupFinder", false);
        }
    }
}

export function showLoadingModal() {
    setIsBlockingModalActive(true);
    const lang = languageSettings.ui;
    loadingModal.title.textContent = i18nData["loading.title"]?.[lang] || "Reading Data";
    loadingModal.text.textContent = i18nData["loading.message"]?.[lang] || "Please wait...";
    loadingModal.overlay.classList.remove('hidden');
    elements.body.classList.add("modal-open");
}

export function hideLoadingModal() {
    loadingModal.overlay.classList.add('hidden');
    if (activeModalStack.length === 0) {
        elements.body.classList.remove("modal-open");
    }
    setIsBlockingModalActive(false);
}

export function showProgressModal(titleKey, messageKey) {
    setIsBlockingModalActive(true);
    const lang = languageSettings.ui;
    progressModal.title.textContent = i18nData[titleKey]?.[lang] || titleKey;
    progressModal.text.textContent = i18nData[messageKey]?.[lang] || messageKey;
    progressModal.bar.style.width = '0%';
    progressModal.percentage.textContent = '0%';
    
    progressModal.overlay.classList.remove('hidden');
    elements.body.classList.add("modal-open");
}

export function updateProgress(percent) {
    const p = Math.min(100, Math.max(0, Math.round(percent)));
    if (progressModal.bar) progressModal.bar.style.width = `${p}%`;
    if (progressModal.percentage) progressModal.percentage.textContent = `${p}%`;
}

export function hideProgressModal() {
    setIsBlockingModalActive(false);
    if (progressModal.overlay) progressModal.overlay.classList.add('hidden');

    if (progressModal.bar) progressModal.bar.style.width = '0%';
    if (progressModal.percentage) progressModal.percentage.textContent = '0%';

    if (activeModalStack.length === 0) {
        elements.body.classList.remove("modal-open");
    }
}