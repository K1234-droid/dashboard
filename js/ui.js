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
    setFeedbackTimeout
} from './config.js';
import { saveSetting } from './storage.js';
import { setupAvatarHoverListeners as mainSetupAvatarListeners } from './main.js';

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
        [usernameModal.openBtn, themeModal.openBtn, aboutModal.openBtn, otherSettingsModal.openBtn].forEach((btn) => {
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
    if (elements.accountMessage && template) {
        elements.accountMessage.textContent = template.replace('{value}', currentUser);
        elements.accountMessage.setAttribute('data-i18n-value', currentUser);
    }
}

export async function handleSaveUsername() {
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
    const supportedText = { id: "Iya", en: "Yes", jp: "はい" };
    const notSupportedText = { id: "Tidak", en: "No", jp: "いいえ" };
    const lang = languageSettings.ui;

    avatarStatus.text.textContent = isSupportedResolution ? supportedText[lang] || supportedText['id'] : notSupportedText[lang] || notSupportedText['id'];
    avatarStatus.text.className = isSupportedResolution ? "supported" : "not-supported";
    avatarStatus.helpText.classList.toggle("is-hidden", isSupportedResolution);

    const isAvatarFullShown = settingSwitches.avatarFullShow.checked;
    const isAvatarAnimationOn = settingSwitches.avatarAnimation.checked;
    const disableAnimationSwitches = !isAvatarFullShown || !isSupportedResolution;

    if (settingSwitches.avatarAnimation) { settingSwitches.avatarAnimation.disabled = disableAnimationSwitches; }
    if (settingSwitches.detectMouseStillness) { settingSwitches.detectMouseStillness.disabled = disableAnimationSwitches || !isAvatarAnimationOn; }
    
    mainSetupAvatarListeners();
    checkResolutionAndToggleMessage();
}

export function checkResolutionAndToggleMessage() {
    // This function was intentionally left empty in the original script.
    // It's included here to prevent "not defined" errors.
}

export function updateSecurityFeaturesUI() {
    const isHiddenEnabled = !!userPIN;
    const isAdvancedEnabled = !!advancedPIN;
    const lang = languageSettings.ui;

    // Hidden Feature Switch
    settingSwitches.hiddenFeature.checked = isHiddenEnabled;

    // Continue Feature Switch
    settingSwitches.continueFeature.checked = isAdvancedEnabled;
    settingSwitches.continueFeature.disabled = !isHiddenEnabled;

    // PIN Settings Container
    if (isHiddenEnabled || isAdvancedEnabled) {
        pinSettings.container.classList.remove('hidden');
        pinSettings.updateBtn.textContent = i18nData["settings.hidden.updatePin"][lang] || "Update PIN";
    } else {
        pinSettings.container.classList.add('hidden');
    }
}