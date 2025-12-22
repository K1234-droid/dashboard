import {
    elements, usernameModal, themeModal, aboutModal, otherSettingsModal, infoModal, activeModalStack, currentUser, setCurrentUser,
    languageSettings, i18nData, menu, pinSettings, settingSwitches, setActiveModalStack, userPIN, feedbackTimeout,
    setFeedbackTimeout, dataManagement, progressModal, loadingModal, setIsBlockingModalActive, updateModal, footerSearch, searchEngine,
    colorScheme, setColorScheme, customThemeOverrides, setCustomThemeOverrides, mainPageTodoContainer,
    activeHeaderMenu, setActiveHeaderMenu
} from './config.js';
import { saveSetting, loadSettings, clearWallpaperCache, getWallpaperFromCache } from './storage.js';
import { showToast } from './utils.js';
import { closeAllBookmarkMenus, closeAllMainBookmarkMenus_main, closeAllContainerBookmarkMenus_main } from './bookmark.js';
import { applyShowTodoList, closeAllTodoMenus, closeAllContainerTodoMenus_main } from './todoList.js';

let hoverTimeout;
let currentWallpaperUrl = null;

export function isAdvancedModalSmallMode() {
    const isSmallScreen = window.matchMedia("(max-width: 1060px)").matches;
    const isVeryShortScreen = window.matchMedia("(max-height: 435px)").matches;
    return isSmallScreen || isVeryShortScreen;
}

export async function applyCustomBackground(imageBlob) {
    if (!imageBlob) return;
    if (currentWallpaperUrl) URL.revokeObjectURL(currentWallpaperUrl);
    currentWallpaperUrl = URL.createObjectURL(imageBlob);

    try {
        await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = currentWallpaperUrl;
        });
    } catch (error) {
        console.error("Failed to pre-load background image:", error);
    }

    elements.body.style.setProperty('--custom-background-image', `url(${currentWallpaperUrl})`);
    elements.body.classList.add('custom-background-active');
    updateCustomThemeSettingsVisibility();

    if (themeModal.uploadBackgroundBtn) {
        themeModal.uploadBackgroundBtn.style.backgroundImage = `url(${currentWallpaperUrl})`;
        themeModal.uploadBackgroundBtn.classList.add('has-background');
        themeModal.removeBackgroundBtn.classList.remove('hidden');
    }
}

export async function removeCustomBackground() {
    await saveSetting("customBackground", false);
    await clearWallpaperCache();

    if (currentWallpaperUrl) {
        URL.revokeObjectURL(currentWallpaperUrl);
        currentWallpaperUrl = null;
    }

    elements.body.classList.remove('custom-background-active');
    updateCustomThemeSettingsVisibility();

    setTimeout(() => {
        elements.body.style.removeProperty('--custom-background-image');
    }, 500);

    if (themeModal.uploadBackgroundBtn) {
        themeModal.uploadBackgroundBtn.style.backgroundImage = '';
        themeModal.uploadBackgroundBtn.classList.remove('has-background');
        themeModal.removeBackgroundBtn.classList.add('hidden');
    }
    showToast("toast.backgroundRemoved");
}

// --- Modals and Menus ---
export function toggleMenu(event) {
    event.stopPropagation();
    if (footerSearch.resultsContainer) {
        footerSearch.resultsContainer.classList.remove('show');
    }
    closeAllBookmarkMenus();
    closeAllMainBookmarkMenus_main();
    closeAllContainerBookmarkMenus_main();
    closeAllTodoMenus();
    closeAllContainerTodoMenus_main();
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
    const slideInModals = [
        "other-settings-modal-overlay",
        "theme-modal-overlay",
        "about-modal-overlay"
    ];

    if (slideInModals.includes(overlay.id)) {
        overlay.classList.add("modal-slide-right");
    }

    overlay.classList.remove("hidden");
    const newStack = [...activeModalStack, overlay];
    setActiveModalStack(newStack);

    const modalBody = overlay.querySelector(".modal-body");
    if (modalBody) modalBody.scrollTop = 0;

    elements.body.classList.add("modal-open");
}

export function closeModal(overlay) {
    if (overlay) {
        overlay.querySelectorAll('input, textarea').forEach(input => input.blur());
        overlay.classList.add("hidden");
        const newStack = activeModalStack.filter(modal => modal !== overlay);
        setActiveModalStack(newStack);
        if (overlay.querySelector('.modal-header .prompt-item-menu.show')) {
            const menuEl = overlay.querySelector('.modal-header .prompt-item-menu');
            if (menuEl) {
                menuEl.classList.remove('show');
                if (activeHeaderMenu === menuEl) {
                    setActiveHeaderMenu(null);
                }
            }
        }
    }

    if (activeModalStack.length === 0) {
        elements.body.classList.remove("modal-open");
        document.body.focus({ preventScroll: true });
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
        settingSwitches.showTime,
        settingSwitches.showUsername
    ];
    childSwitches.forEach(switchEl => {
        if (switchEl) {
            switchEl.disabled = !isMasterContentOn;
        }
    });
    if (settingSwitches.showUsername) {
        const isGreetingOn = settingSwitches.showGreeting.checked;
        settingSwitches.showUsername.disabled = !isMasterContentOn || !isGreetingOn;
    }
    updateClockSwitchesState();
    updateBookmarkDropdownState();
    updateLanguageControlsState();
    const isSearchBarEnabled = settingSwitches.enableSearchBar.checked;
    const isBookmarkEnabled = settingSwitches.showBookmark.checked;
    const bookmarkSearchSwitchContainer = settingSwitches.enableBookmarkSearch?.closest('.switch-container');
    if (settingSwitches.enableBookmarkSearch) {
        settingSwitches.enableBookmarkSearch.disabled = !isBookmarkEnabled;
        if (bookmarkSearchSwitchContainer) {
            bookmarkSearchSwitchContainer.classList.toggle('disabled', !isBookmarkEnabled);
        }
    }

    const bookmarkPopupFinderSwitchContainer = settingSwitches.enableBookmarkPopupFinder?.closest('.switch-container');
    if (settingSwitches.enableBookmarkPopupFinder) {
        settingSwitches.enableBookmarkPopupFinder.disabled = !isBookmarkEnabled;
        if (bookmarkPopupFinderSwitchContainer) {
            bookmarkPopupFinderSwitchContainer.classList.toggle('disabled', !isBookmarkEnabled);
        }
    }

    const isShortcutCtrlDDisabled = !isBookmarkEnabled;
    const shortcutCtrlDContainer = settingSwitches.enableShortcutCtrlD?.closest('.switch-container');
    const shortcutCtrlDHelpText = document.getElementById('enable-shortcut-ctrl-d-help-text');
    if (settingSwitches.enableShortcutCtrlD) {
        settingSwitches.enableShortcutCtrlD.disabled = isShortcutCtrlDDisabled;
        if (shortcutCtrlDContainer) {
            shortcutCtrlDContainer.classList.toggle('disabled', isShortcutCtrlDDisabled);
        }
        if (shortcutCtrlDHelpText) {
            shortcutCtrlDHelpText.classList.toggle('disabled', isShortcutCtrlDDisabled);
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
    if (elements.greetingUsername) {
        elements.greetingUsername.textContent = ` ${currentUser}`;
    }
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
        showToast("settings.username.feedback.saved");
        setTimeout(() => closeModal(usernameModal.overlay), 500);
    } else {
        showToast("settings.username.feedback.error");
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

    applyColorScheme(colorScheme, true);
    updateFavicon();
}

export async function applyColorScheme(scheme, calledFromApplyTheme = false) {
    document.documentElement.classList.remove("monochrome-scheme");

    elements.body.classList.remove("monochrome-scheme");
    [themeModal.schemeDefaultBtn, themeModal.schemeMonochromeBtn].forEach((btn) => {
        if (btn) btn.classList.remove("active");
    });

    if (scheme === "monochrome") {
        document.documentElement.classList.add("monochrome-scheme");
        elements.body.classList.add("monochrome-scheme");
        if (themeModal.schemeMonochromeBtn) themeModal.schemeMonochromeBtn.classList.add("active");
        setColorScheme('monochrome');

        try {
            localStorage.setItem('colorScheme', 'monochrome');
        } catch (e) {
            console.error('Failed to save scheme to localStorage:', e);
        }

    } else {
        if (themeModal.schemeDefaultBtn) themeModal.schemeDefaultBtn.classList.add("active");
        setColorScheme('default');

        try {
            localStorage.removeItem('colorScheme');
        } catch (e) {
            console.error('Failed to remove scheme from localStorage:', e);
        }
    }

    if (!calledFromApplyTheme) {
        const settings = await loadSettings(['customBackground']);
        if (settings.customBackground === true) {
            const wallpaperBlob = await getWallpaperFromCache();
            if (wallpaperBlob) {
                applyCustomBackground(wallpaperBlob);
            }
        }
    }
    updateFavicon();
}

export function updateFavicon() {
    const isDarkClass = elements.body.classList.contains('dark-theme');
    const isLightClass = elements.body.classList.contains('light-theme');
    const isMonochrome = document.documentElement.classList.contains('monochrome-scheme');

    let isDark = false;
    if (isDarkClass) {
        isDark = true;
    } else if (isLightClass) {
        isDark = false;
    } else {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    let faviconPath = 'favicon.ico';
    if (isMonochrome) {
        if (isDark) {
            faviconPath = 'assets/icons/favicon_darkmode_monochrome.ico';
        } else {
            faviconPath = 'assets/icons/favicon_lightmode_monochrome.ico';
        }
    } else {
        if (isDark) {
            faviconPath = 'assets/icons/favicon_darkmode_default.ico';
        }
    }

    const faviconLink = document.getElementById('favicon-link');
    if (faviconLink) {
        faviconLink.href = faviconPath;
    }
}

if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        updateFavicon();
    });
}

export function applyShowGreeting(show) {
    const isContentOn = settingSwitches.showContent ? settingSwitches.showContent.checked : true;
    elements.body.classList.toggle("greeting-hidden", !(show && isContentOn));
    updateSeparatorVisibility();
    adjustSeparatorWidth();
    if (settingSwitches.showUsername) {
        applyShowUsername(settingSwitches.showUsername.checked);
    }
}

export function applyShowUsername(show) {
    const isContentOn = settingSwitches.showContent ? settingSwitches.showContent.checked : true;
    const isGreetingOn = settingSwitches.showGreeting ? settingSwitches.showGreeting.checked : true;
    elements.body.classList.toggle("username-hidden", !(show && isContentOn && isGreetingOn));
}

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
    const lang = languageSettings.ui;
    const manageHiddenContainer = document.getElementById('manage-hidden-data-container');
    const popupFinderHelpText = document.getElementById('enable-popup-finder-help-text');
    const promptSearchHelpText = document.getElementById('enable-search-help-text');
    const promptSearchContainer = document.getElementById('enable-prompt-search-container');
    const accessTip = elements.hiddenFeatureAccessTip;

    if (manageHiddenContainer) {
        manageHiddenContainer.classList.toggle('disabled', !isHiddenEnabled);
        dataManagement.importHiddenDataBtn.disabled = !isHiddenEnabled;
        dataManagement.exportHiddenDataBtn.disabled = !isHiddenEnabled;
    }

    settingSwitches.hiddenFeature.checked = isHiddenEnabled;

    if (isHiddenEnabled) {
        pinSettings.container.classList.remove('hidden');
        if (accessTip) accessTip.classList.add('hidden');
        pinSettings.updateBtn.textContent = i18nData["settings.hidden.updatePin"][lang] || "Update PIN";
    } else {
        pinSettings.container.classList.add('hidden');
        if (accessTip) accessTip.classList.remove('hidden');
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
        settingSwitches.enablePromptSearch.disabled = isDisabled;

        if (promptSearchContainer) {
            promptSearchContainer.classList.toggle('disabled', isDisabled);
        }

        if (promptSearchHelpText) {
            promptSearchHelpText.classList.toggle('disabled', isDisabled);
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

export function updateCustomThemeSettingsVisibility() {
    const isCustomBg = elements.body.classList.contains('custom-background-active');

    if (themeModal.infoSectionThemeContainer) {
        themeModal.infoSectionThemeContainer.classList.toggle('hidden', !isCustomBg);
    }
    if (themeModal.footerThemeContainer) {
        themeModal.footerThemeContainer.classList.toggle('hidden', !isCustomBg);
    }
    if (themeModal.shadowThemeContainer) {
        themeModal.shadowThemeContainer.classList.toggle('hidden', !isCustomBg);
    }
}

export function applyThemeOverrides() {
    const overrides = customThemeOverrides;
    elements.body.classList.remove('info-force-light', 'info-force-dark', 'footer-force-light', 'footer-force-dark',
        'info-overlay-force-light', 'info-overlay-force-dark'
    );

    if (overrides.infoSection === 'light') {
        elements.body.classList.add('info-force-dark');
    } else if (overrides.infoSection === 'dark') {
        elements.body.classList.add('info-force-light');
    }

    if (overrides.footer === 'light') {
        elements.body.classList.add('footer-force-light');
    } else if (overrides.footer === 'dark') {
        elements.body.classList.add('footer-force-dark');
    }

    if (overrides.shadow === 'light') {
        elements.body.classList.add('info-overlay-force-light');
    } else if (overrides.shadow === 'dark') {
        elements.body.classList.add('info-overlay-force-dark');
    }
}

export function updateThemeOverrideButtons() {
    if (themeModal.infoSectionThemeDefaultBtn) {
        [themeModal.infoSectionThemeDefaultBtn, themeModal.infoSectionThemeLightBtn, themeModal.infoSectionThemeDarkBtn].forEach(btn => btn.classList.remove('active'));
        const infoSetting = customThemeOverrides.infoSection;

        if (infoSetting === 'light') themeModal.infoSectionThemeLightBtn.classList.add('active');
        else if (infoSetting === 'dark') themeModal.infoSectionThemeDarkBtn.classList.add('active');
        else themeModal.infoSectionThemeDefaultBtn.classList.add('active');
    }

    if (themeModal.footerThemeDefaultBtn) {
        [themeModal.footerThemeDefaultBtn, themeModal.footerThemeLightBtn, themeModal.footerThemeDarkBtn].forEach(btn => btn.classList.remove('active'));
        const footerSetting = customThemeOverrides.footer;

        if (footerSetting === 'light') themeModal.footerThemeLightBtn.classList.add('active');
        else if (footerSetting === 'dark') themeModal.footerThemeDarkBtn.classList.add('active');
        else themeModal.footerThemeDefaultBtn.classList.add('active');
    }

    if (themeModal.shadowThemeDefaultBtn) {
        [themeModal.shadowThemeDefaultBtn, themeModal.shadowThemeLightBtn, themeModal.shadowThemeDarkBtn].forEach(btn => btn.classList.remove('active'));
        const shadowSetting = customThemeOverrides.shadow;

        if (shadowSetting === 'light') themeModal.shadowThemeLightBtn.classList.add('active');
        else if (shadowSetting === 'dark') themeModal.shadowThemeDarkBtn.classList.add('active');
        else themeModal.shadowThemeDefaultBtn.classList.add('active');
    }
}