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
    setActiveModalStack,
    userPIN,
    advancedPIN,
    feedbackTimeout,
    setFeedbackTimeout,
    dataManagement,
    progressModal,
    loadingModal,
    setIsBlockingModalActive,
    updateModal,
    footerSearch,
    searchEngine
} from './config.js';
import { saveSetting } from './storage.js';
import { showToast } from './utils.js';
import { closeAllBookmarkMenus, closeAllMainBookmarkMenus_main, closeAllContainerBookmarkMenus_main } from './bookmark.js';

let hoverTimeout;

// --- Modals and Menus ---
export function toggleMenu(event) {
    event.stopPropagation();
    if (footerSearch.resultsContainer) {
        footerSearch.resultsContainer.classList.remove('show');
    }
    closeAllBookmarkMenus();
    closeAllMainBookmarkMenus_main();
    closeAllContainerBookmarkMenus_main();
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
    closeModal(themeModal.overlay);
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

export function updateSearchEngineDisplay() {
    const trigger = document.getElementById(`search-engine-select`);
    if (!trigger) return;
    const optionsContainer = trigger.nextElementSibling;
    const selectedTextSpan = trigger.querySelector('span:first-child');
    const selectedOption = optionsContainer.querySelector(`[data-value="${searchEngine}"]`);
    if (selectedOption) {
        selectedTextSpan.textContent = selectedOption.textContent;
        const i18nKey = selectedOption.getAttribute('data-i18n-key');
        if (i18nKey) {
            selectedTextSpan.setAttribute('data-i18n-key', i18nKey);
        }
        optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
        selectedOption.classList.add('selected');
    }
}

export function updateMainPageSwitchesState() {
    if (!settingSwitches.showContent) return;
    const isMasterContentOn = settingSwitches.showContent.checked;
    const childSwitches = [
        settingSwitches.showGreeting,
        settingSwitches.showDescription,
        settingSwitches.showDate,
        settingSwitches.showTime
    ];
    childSwitches.forEach(switchEl => {
        if (switchEl) {
            switchEl.disabled = !isMasterContentOn;
        }
    });
    updateClockSwitchesState();
    updateBookmarkDropdownState();
    updateLanguageControlsState();
    const isSearchBarEnabled = settingSwitches.enableSearchBar.checked;
    const isBookmarkEnabled = settingSwitches.showBookmark.checked;
    const bookmarkSearchSwitchContainer = settingSwitches.enableBookmarkSearch?.closest('.switch-container');
    const isBookmarkSearchDisabled = !isBookmarkEnabled;

    if (settingSwitches.enableBookmarkSearch) {
        settingSwitches.enableBookmarkSearch.disabled = isBookmarkSearchDisabled;
        if (bookmarkSearchSwitchContainer) {
            bookmarkSearchSwitchContainer.classList.toggle('disabled', isBookmarkSearchDisabled);
        }
    }
    const historySearchSwitchContainer = settingSwitches.enableHistorySearch?.closest('.switch-container');
    const historyHelpText1 = document.getElementById('enable-history-search-help-text');
    const historyHelpText2 = document.querySelectorAll('#settings-panel-data .setting-help-text[data-i18n-key="settings.search.enableHistoryHelp2"]')[0];
    const isHistorySearchDisabled = !isSearchBarEnabled;
    if (settingSwitches.enableHistorySearch) {
        settingSwitches.enableHistorySearch.disabled = isHistorySearchDisabled;
        if (historySearchSwitchContainer) {
            historySearchSwitchContainer.classList.toggle('disabled', isHistorySearchDisabled);
        }
        if (historyHelpText1) {
             historyHelpText1.classList.toggle('disabled', isHistorySearchDisabled);
        }
        if (historyHelpText2) {
             historyHelpText2.classList.toggle('disabled', isHistorySearchDisabled);
        }
        if (isHistorySearchDisabled && settingSwitches.enableHistorySearch.checked) {
            settingSwitches.enableHistorySearch.checked = false;
            saveSetting("enableHistorySearch", false);
            showToast("toast.historyDisabled"); 
        }
    }
    const searchEngineContainer = document.getElementById('search-engine-select')?.closest('.switch-container');
    if (searchEngineContainer) {
        searchEngineContainer.classList.toggle('disabled', !isSearchBarEnabled);
    }
    const searchActionContainer = document.getElementById('search-open-action-select')?.closest('.switch-container');
    if (searchActionContainer) {
        searchActionContainer.classList.toggle('disabled', !isSearchBarEnabled);
    }
}

export function adjustSeparatorWidth() {
    if (!elements.greetingText || !elements.infoSeparator || !settingSwitches.showDescription || !settingSwitches.showGreeting) return;
    const isDescriptionHidden = !settingSwitches.showDescription.checked;
    const isGreetingVisible = settingSwitches.showGreeting.checked;
    if (isDescriptionHidden && isGreetingVisible) {
        setTimeout(() => {
            const greetingWidth = elements.greetingText.getBoundingClientRect().width;
            if (greetingWidth > 0) {
                elements.infoSeparator.style.width = `${greetingWidth}px`;
            }
        }, 0); 
    } else {
        elements.infoSeparator.style.width = '';
    }
}

export function updateClockSwitchesState() {
    if (!settingSwitches.showTime || !settingSwitches.showSeconds || !settingSwitches.showContent) return;
    const isContentEnabled = settingSwitches.showContent.checked;
    const isTimeEnabled = settingSwitches.showTime.checked;
    settingSwitches.showSeconds.disabled = !isContentEnabled || !isTimeEnabled;
    applyShowSeconds(settingSwitches.showSeconds.checked);
}

export function updateBookmarkDropdownState() {
    if (!settingSwitches.showBookmark) return;
    const isBookmarkEnabled = settingSwitches.showBookmark.checked;
    const entireSwitchContainer = document.getElementById('bookmark-open-action-select')?.closest('.switch-container');
    
    if (entireSwitchContainer) {
        entireSwitchContainer.classList.toggle('disabled', !isBookmarkEnabled);
    }
}

export function updateLanguageControlsState() {
    if (!settingSwitches.showGreeting || !settingSwitches.showDescription || !settingSwitches.showDate || !settingSwitches.applyToAll || !settingSwitches.showContent) return;
    const isMasterContentOn = settingSwitches.showContent.checked;
    const isGreetingOn = settingSwitches.showGreeting.checked;
    const isDescriptionOn = settingSwitches.showDescription.checked;
    const isDateOn = settingSwitches.showDate.checked;
    const greetingLangContainer = document.getElementById('lang-container-greeting');
    const descriptionLangContainer = document.getElementById('lang-container-description');
    const dateLangContainer = document.getElementById('lang-container-date');
    const applyAllSwitchContainer = settingSwitches.applyToAll.closest('.switch-container');
    if (greetingLangContainer) {
        greetingLangContainer.classList.toggle('disabled', !isMasterContentOn || !isGreetingOn);
    }
    if (descriptionLangContainer) {
        descriptionLangContainer.classList.toggle('disabled', !isMasterContentOn || !isDescriptionOn);
    }
    if (dateLangContainer) {
        dateLangContainer.classList.toggle('disabled', !isMasterContentOn || !isDateOn);
    }
    const allSubSwitchesOff = !isGreetingOn && !isDescriptionOn && !isDateOn;
    if (applyAllSwitchContainer) {
        const shouldDisableApplyAll = !isMasterContentOn || allSubSwitchesOff;
        applyAllSwitchContainer.classList.toggle('disabled', shouldDisableApplyAll);
        settingSwitches.applyToAll.disabled = shouldDisableApplyAll;
    }
}

export function updateSeparatorVisibility() {
    if (!elements.infoSeparator || !settingSwitches.showContent) return;
    const isContentMasterOn = settingSwitches.showContent.checked;
    const isGreetingOn = settingSwitches.showGreeting.checked;
    const isDescriptionOn = settingSwitches.showDescription.checked;
    const isDateOn = settingSwitches.showDate.checked;
    const isTimeOn = settingSwitches.showTime.checked;
    const isContentAbove = isGreetingOn || isDescriptionOn;
    const isContentBelow = isDateOn || isTimeOn;
    const shouldShow = isContentMasterOn && isContentAbove && isContentBelow;
    elements.body.classList.toggle("separator-hidden", !shouldShow);
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

export function applyEnableAnimation(show) {
    elements.body.classList.toggle("animations-disabled", !show);
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

export function applyShowGreeting(show) { const isContentOn = settingSwitches.showContent ? settingSwitches.showContent.checked : true; elements.body.classList.toggle("greeting-hidden", !(show && isContentOn)); updateSeparatorVisibility(); adjustSeparatorWidth(); }
export function applyShowDescription(show) { const isContentOn = settingSwitches.showContent ? settingSwitches.showContent.checked : true; elements.body.classList.toggle("description-hidden", !(show && isContentOn)); updateSeparatorVisibility(); adjustSeparatorWidth(); }
export function applyShowDate(show) { const isContentOn = settingSwitches.showContent ? settingSwitches.showContent.checked : true; elements.body.classList.toggle("date-hidden", !(show && isContentOn)); updateSeparatorVisibility(); }
export function applyShowTime(show) { const isContentOn = settingSwitches.showContent ? settingSwitches.showContent.checked : true; elements.body.classList.toggle("time-hidden", !(show && isContentOn)); updateSeparatorVisibility(); }
export function applyShowSeconds(show) { const isContentOn = settingSwitches.showContent ? settingSwitches.showContent.checked : true; const isTimeEnabled = settingSwitches.showTime ? settingSwitches.showTime.checked : true; const shouldShowSeconds = show && isTimeEnabled && isContentOn; elements.body.classList.toggle("seconds-hidden", !shouldShowSeconds); }
export function applyMenuBlur(show) { elements.body.classList.toggle("menu-blur-disabled", !show); }
export function applyBookmarkBlur(show) { elements.body.classList.toggle("bookmark-blur-disabled", !show); }
export function applyShowSearchBar(show) { elements.body.classList.toggle("search-bar-hidden", !show); }

export function applyShowBookmark(show) {
    const isBookmarkSwitchOn = show;
    elements.body.classList.toggle("bookmark-hidden", !isBookmarkSwitchOn);
    elements.mainPageBookmarkContainer?.classList.toggle("hidden", !isBookmarkSwitchOn);
}

export function applyFooterBlur(show) { elements.body.classList.toggle("footer-blur-disabled", !show); }
export function applyShowContent(show) { elements.body.classList.toggle("content-off", !show); }

export function updateSecurityFeaturesUI() {
    const isHiddenEnabled = !!userPIN;
    const isAdvancedEnabled = !!advancedPIN;
    const lang = languageSettings.ui;
    const manageHiddenContainer = document.getElementById('manage-hidden-data-container');
    const popupFinderHelpText = document.getElementById('enable-popup-finder-help-text');
    const promptSearchContainer = document.getElementById('enable-prompt-search-container');

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
    if (settingSwitches.enablePromptSearch) {
        const isDisabled = !isHiddenEnabled;
        settingSwitches.enablePromptSearch.disabled = isDisabled; //

        if (promptSearchContainer) {
            promptSearchContainer.classList.toggle('disabled', isDisabled); //
        }

        if (isDisabled) {
            settingSwitches.enablePromptSearch.checked = false;
            saveSetting("enablePromptSearch", false);
            const event = new CustomEvent('promptSearchDisabledByUI');
            document.dispatchEvent(event); 
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