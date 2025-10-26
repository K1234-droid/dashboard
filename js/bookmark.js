import {
    elements, languageSettings, i18nData, bookmarks, setBookmarks,
    bookmarkModal, bookmarkListModal, activeBookmarkMenu, setActiveBookmarkMenu,
    confirmationModal, setConfirmationModalPurpose, isBookmarkManageModeActive,
    setIsBookmarkManageModeActive, selectedBookmarkIds, setSelectedBookmarkIds,
    isBookmarkSearchModeActive, setIsBookmarkSearchModeActive, bookmarkSortableInstance,
    confirmationModalPurpose, bookmarkOpenAction
} from './config.js';
import { openModal, closeModal, showInfoModal } from './ui.js';
import { showToast } from './utils.js';
import { saveSetting } from './storage.js';
import { markSearchDataAsStale } from './search.js';

let currentBookmarkId = null;
let activeMainBookmarkMenu = null;
let activeContainerBookmarkMenu = null;

// --- Rendering ---
function getFavicon(url) {
    try {
        let validatedUrl = url;
        if (!/^https?:\/\//i.test(validatedUrl)) {
            validatedUrl = 'https://' + validatedUrl;
        }
        const urlObject = new URL(validatedUrl);
        const domain = urlObject.hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (error) {
        return '../assets/images/avatar-logo-small.webp';
    }
}

export function renderMainPageBookmarks() {
    if (!elements.mainPageBookmarkContainer) return;
    elements.mainPageBookmarkContainer.innerHTML = '';
    const lang = languageSettings.ui;

    const contextMenuMain = document.getElementById('bookmark-context-menu-main');
    if (contextMenuMain) {
        contextMenuMain.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = e.target.closest('.bookmark-menu-option');
            if (!target) return;

            const action = target.dataset.action;
            closeAllMainBookmarkMenus();
            
            if (action === 'copy-link') {
                handleCopyLink();
            } else if (action === 'edit') {
                handleOpenEditBookmarkModal(currentBookmarkId);
            } else if (action === 'delete') {
                handleDeleteBookmark();
            }
        });
    }
    closeAllMainBookmarkMenus();

    const bookmarksToShow = bookmarks;

    bookmarksToShow.forEach(bookmark => {
        const wrapper = document.createElement('div');
        wrapper.className = 'bookmark-controls-main-wrapper';
        wrapper.dataset.id = bookmark.id;
        
        const item = document.createElement('a');
        item.className = 'bookmark-item-main';
        item.href = bookmark.url;
        item.target = bookmarkOpenAction === 'newTab' ? '_blank' : '_self';
        item.rel = 'noopener noreferrer';
        item.dataset.id = bookmark.id;
        item.style.position = 'relative';

        const img = document.createElement('img');
        img.src = getFavicon(bookmark.url);
        img.alt = bookmark.name;
        img.className = 'bookmark-icon';
        img.onerror = function() { this.src = '../assets/images/avatar-logo-small.webp'; };

        const name = document.createElement('p');
        name.textContent = bookmark.name;
        name.className = 'bookmark-name';

        const menuBtn = document.createElement('button');
        menuBtn.className = 'bookmark-menu-btn-main';
        menuBtn.innerHTML = '&#8942;';
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showMainBookmarkContextMenu(e, bookmark.id);
        });
        
        item.appendChild(img);
        item.appendChild(name);
        item.appendChild(menuBtn);
        
        elements.mainPageBookmarkContainer.appendChild(item);
    });

    if (bookmarks.length > 0) {
        const controlContainer = document.createElement('div');
        controlContainer.className = 'bookmark-controls-main'; 
        const addBtn = document.createElement('button');
        addBtn.className = 'bookmark-add-btn';
        addBtn.innerHTML = '<span>+</span>';
        addBtn.onclick = handleOpenAddBookmarkModal;
        addBtn.setAttribute('data-tooltip', i18nData['bookmark.add']?.[lang] || 'Add Bookmark');
        const moreBtn = document.createElement('button');
        moreBtn.className = 'bookmark-more-btn';
        moreBtn.innerHTML = '&#8942;';
        moreBtn.onclick = () => openModal(bookmarkListModal.overlay);
        moreBtn.setAttribute('data-tooltip', i18nData['bookmark.title']?.[lang] || 'Bookmarks');
        controlContainer.appendChild(addBtn);
        controlContainer.appendChild(moreBtn);
        elements.mainPageBookmarkContainer.appendChild(controlContainer);
    } else {
        const addBtn = document.createElement('button');
        addBtn.className = 'bookmark-add-btn';
        addBtn.innerHTML = '<span>+</span>';
        addBtn.onclick = handleOpenAddBookmarkModal;
        addBtn.setAttribute('data-tooltip', i18nData['bookmark.add']?.[lang] || 'Add Bookmark');
        elements.mainPageBookmarkContainer.appendChild(addBtn);
    }
}

export function renderBookmarkModalGrid(bookmarksToRender = bookmarks) {
    if (!bookmarkListModal.grid) return;
    bookmarkListModal.grid.innerHTML = '';
    const lang = languageSettings.ui;
    
    bookmarkListModal.noResultsMessage.classList.toggle('hidden', bookmarksToRender.length > 0 || bookmarks.length === 0);

    bookmarksToRender.forEach(bookmark => {
        const item = document.createElement('a');
        item.className = 'bookmark-item';
        item.href = bookmark.url;
        item.target = bookmarkOpenAction === 'newTab' ? '_blank' : '_self';
        item.rel = 'noopener noreferrer';
        item.dataset.id = bookmark.id;

        const img = document.createElement('img');
        img.src = getFavicon(bookmark.url);
        img.alt = bookmark.name;
        img.className = 'bookmark-icon';
        img.onerror = function() { this.src = '../assets/images/avatar-logo-small.webp'; };

        const name = document.createElement('p');
        name.textContent = bookmark.name;
        name.className = 'bookmark-name';

        const menuBtn = document.createElement('button');
        menuBtn.className = 'bookmark-menu-btn';
        menuBtn.innerHTML = '&#8942;';
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showBookmarkContextMenu(e, bookmark.id);
        });

        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const menuBtn = item.querySelector('.bookmark-menu-btn');
            if (menuBtn) {
                menuBtn.click();
            }
        });
        
        item.addEventListener('click', (e) => {
            if (isBookmarkManageModeActive) {
                e.preventDefault();
                if (!e.target.closest('.bookmark-menu-btn')) {
                    toggleBookmarkSelection(bookmark.id);
                }
            }
        });

        const menuContainer = document.createElement('div');
        menuContainer.className = 'bookmark-item-menu';
        menuContainer.innerHTML = `
            <button class="bookmark-menu-option" data-action="copy-link">${i18nData["bookmark.menu.copyLink"][lang]}</button>
            <button class="bookmark-menu-option" data-action="edit">${i18nData["bookmark.menu.edit"][lang]}</button>
            <button class="bookmark-menu-option" data-action="delete">${i18nData["bookmark.menu.delete"][lang]}</button>
        `;

        item.appendChild(img);
        item.appendChild(name);
        item.appendChild(menuBtn);
        item.appendChild(menuContainer);
        bookmarkListModal.grid.appendChild(item);
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'bookmark-item add-bookmark-item';
    addBtn.innerHTML = '<span>+</span>';
    addBtn.onclick = handleOpenAddBookmarkModal;
    addBtn.setAttribute('data-tooltip', i18nData['bookmark.add']?.[lang] || 'Add Bookmark');
    bookmarkListModal.grid.appendChild(addBtn);
}

// --- Context Menu ---
export function showBookmarkContextMenu(event, bookmarkId) {
    closeAllBookmarkMenus();
    currentBookmarkId = bookmarkId;

    const triggerElement = event.currentTarget;
    const itemContainer = triggerElement.closest('.bookmark-item');
    if (!itemContainer) return;

    const menuEl = itemContainer.querySelector('.bookmark-item-menu');
    if (!menuEl) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    menuEl._originalParent = itemContainer;
    document.body.appendChild(menuEl);

    menuEl.style.position = 'fixed';
    menuEl.style.zIndex = '102';
    menuEl.classList.add('show');

    const menuHeight = menuEl.offsetHeight;
    const windowHeight = window.innerHeight;
    if (triggerRect.bottom + menuHeight + 4 > windowHeight) {
        menuEl.style.top = `${triggerRect.top - menuHeight - 4}px`;
    } else {
        menuEl.style.top = `${triggerRect.bottom + 4}px`;
    }

    const menuWidth = menuEl.offsetWidth;
    let menuLeft = triggerRect.right - menuWidth;

    if (menuLeft < 0) {
        menuLeft = triggerRect.left;
    }

    menuEl.style.left = `${menuLeft}px`;
    setActiveBookmarkMenu(menuEl);
}

export function closeAllBookmarkMenus() {
    if (activeBookmarkMenu) {
        if (activeBookmarkMenu._originalParent) {
            activeBookmarkMenu.style.position = '';
            activeBookmarkMenu.style.zIndex = '';
            activeBookmarkMenu.style.top = '';
            activeBookmarkMenu.style.left = '';
            activeBookmarkMenu.classList.remove('show');
            activeBookmarkMenu._originalParent.appendChild(activeBookmarkMenu);
        }
        setActiveBookmarkMenu(null);
    }
}

export function closeAllMainBookmarkMenus_main() {
    closeAllMainBookmarkMenus();
}

function showMainBookmarkContextMenu(event, bookmarkId) {
    closeAllMainBookmarkMenus();
    currentBookmarkId = bookmarkId;

    const triggerElement = event.currentTarget;
    const menuEl = document.getElementById('bookmark-context-menu-main');
    if (!menuEl) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    
    if (menuEl.parentElement !== document.body) {
        document.body.appendChild(menuEl);
    }
    
    menuEl.style.position = 'fixed';
    menuEl.style.zIndex = '106';
    menuEl.classList.add('show');

    const menuHeight = menuEl.offsetHeight;
    const menuWidth = menuEl.offsetWidth;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    let top = triggerRect.bottom + 4;
    let left = triggerRect.right - menuWidth;

    if (top + menuHeight > windowHeight) {
        top = triggerRect.top - menuHeight - 4;
    }
    if (left < 0) {
        left = triggerRect.left;
    }
    if (left + menuWidth > windowWidth) {
        left = windowWidth - menuWidth - 8;
    }

    menuEl.style.top = `${top}px`;
    menuEl.style.left = `${left}px`;
    activeMainBookmarkMenu = menuEl;
}

function closeAllMainBookmarkMenus() {
    const menuEl = document.getElementById('bookmark-context-menu-main');
    if (menuEl && menuEl.classList.contains('show')) {
        menuEl.classList.remove('show');
        menuEl.style.top = '';
        menuEl.style.left = '';
        activeMainBookmarkMenu = null;
    }
}

function showContainerBookmarkContextMenu(event) {
    closeAllMainBookmarkMenus();
    closeAllBookmarkMenus();
    
    const menuEl = document.getElementById('bookmark-container-context-menu');
    if (!menuEl) return;
    
    if (menuEl.parentElement !== document.body) {
        document.body.appendChild(menuEl);
    }
    
    menuEl.style.position = 'fixed';
    menuEl.style.zIndex = '106';
    menuEl.classList.add('show');

    const { clientX: mouseX, clientY: mouseY } = event;
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const menuWidth = menuEl.offsetWidth;
    const menuHeight = menuEl.offsetHeight;

    let top = mouseY;
    let left = mouseX;

    if (top + menuHeight > windowHeight) {
        top = windowHeight - menuHeight - 8;
    }
    if (left + menuWidth > windowWidth) {
        left = windowWidth - menuWidth - 8;
    }
    
    menuEl.style.top = `${top}px`;
    menuEl.style.left = `${left}px`;
    activeContainerBookmarkMenu = menuEl;
}

function closeContainerBookmarkContextMenu() {
    const menuEl = document.getElementById('bookmark-container-context-menu');
    if (menuEl && menuEl.classList.contains('show')) {
        menuEl.classList.remove('show');
        menuEl.style.top = '';
        menuEl.style.left = '';
        activeContainerBookmarkMenu = null;
    }
}

export function closeAllContainerBookmarkMenus_main() {
    closeContainerBookmarkContextMenu();
}

// --- CRUD & Actions ---

function handleOpenAddBookmarkModal() {
    currentBookmarkId = null;
    const lang = languageSettings.ui;
    bookmarkModal.title.textContent = i18nData["bookmark.addTitle"]?.[lang];
    bookmarkModal.saveBtn.textContent = i18nData["settings.username.save"]?.[lang];
    bookmarkModal.nameInput.value = '';
    bookmarkModal.urlInput.value = '';
    openModal(bookmarkModal.overlay);
    bookmarkModal.nameInput.focus();
}

function handleOpenEditBookmarkModal(id) {
    const bookmark = bookmarks.find(b => b.id === id);
    if (!bookmark) return;
    currentBookmarkId = id;
    const lang = languageSettings.ui;
    bookmarkModal.title.textContent = i18nData["bookmark.editTitle"]?.[lang];
    bookmarkModal.saveBtn.textContent = i18nData["prompt.saveChanges"]?.[lang];
    bookmarkModal.nameInput.value = bookmark.name;
    bookmarkModal.urlInput.value = bookmark.url;
    openModal(bookmarkModal.overlay);
    bookmarkModal.nameInput.focus();
}

export async function handleSaveBookmark() {
    let name = bookmarkModal.nameInput.value.trim();
    let url = bookmarkModal.urlInput.value.trim();
    const isEditing = currentBookmarkId !== null;

    if (!url) {
        showInfoModal("info.attention.title", "bookmark.error.urlRequired");
        return;
    }
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    try {
        new URL(url);
    } catch (error) {
        showInfoModal("info.attention.title", "bookmark.error.urlInvalid");
        return;
    }
    if (!name) {
        name = new URL(url).hostname;
    }
    const urlExists = bookmarks.some(b => 
        b.url.toLowerCase() === url.toLowerCase() && 
        (isEditing ? b.id !== currentBookmarkId : true)
    );

    if (urlExists) {
        showInfoModal("info.attention.title", "bookmark.error.urlExists");
        return;
    }

    let tempBookmarks = [...bookmarks];
    if (isEditing) {
        const index = tempBookmarks.findIndex(b => b.id === currentBookmarkId);
        if (index > -1) {
            tempBookmarks[index] = { ...tempBookmarks[index], name, url };
        }
    } else {
        const newBookmark = { id: Date.now(), name, url };
        tempBookmarks.push(newBookmark);
    }

    setBookmarks(tempBookmarks);
    await saveSetting('bookmarks', bookmarks);
    
    closeModal(bookmarkModal.overlay);
    renderMainPageBookmarks();
    renderBookmarkModalGrid();
    showToast(isEditing ? "bookmark.edit.success" : "bookmark.save.success");
    markSearchDataAsStale();
}

function handleDeleteBookmark() {
    setConfirmationModalPurpose('deleteBookmark');
    const lang = languageSettings.ui;
    confirmationModal.title.textContent = i18nData["bookmark.delete.title"][lang];
    confirmationModal.text.textContent = i18nData["bookmark.delete.text"][lang];
    openModal(confirmationModal.overlay);
}

export async function confirmDeleteBookmark() {
    let tempBookmarks;
    if (confirmationModalPurpose === 'deleteSelectedBookmarks') {
        tempBookmarks = bookmarks.filter(b => !selectedBookmarkIds.includes(b.id));
    } else {
        tempBookmarks = bookmarks.filter(b => b.id !== currentBookmarkId);
    }
    
    setBookmarks(tempBookmarks);
    await saveSetting('bookmarks', bookmarks);
    
    closeModal(confirmationModal.overlay);
    renderMainPageBookmarks();
    renderBookmarkModalGrid();
    showToast("bookmark.delete.success");
    markSearchDataAsStale();

    if (confirmationModalPurpose === 'deleteSelectedBookmarks') {
        toggleManageMode(false);
    }
}

async function handleCopyLink() {
    const bookmark = bookmarks.find(b => b.id === currentBookmarkId);
    if (bookmark) {
        try {
            await navigator.clipboard.writeText(bookmark.url);
            showToast("bookmark.copy.link.success");
        } catch (err) {
            console.error('Gagal menyalin link: ', err);
        }
    }
}

// --- Manage & Search Mode ---
export function updateManageModeUI() {
    const lang = languageSettings.ui;
    const selectCountFormat = i18nData["prompt.selectCount"][lang] || i18nData["prompt.selectCount"]["id"];
    bookmarkListModal.selectCount.textContent = selectCountFormat.replace('{count}', selectedBookmarkIds.length);

    if (selectedBookmarkIds.length === bookmarks.length && bookmarks.length > 0) {
        bookmarkListModal.selectAllBtn.textContent = i18nData["prompt.deselectAll"][lang] || i18nData["prompt.deselectAll"]["id"];
    } else {
        bookmarkListModal.selectAllBtn.textContent = i18nData["prompt.selectAll"][lang] || i18nData["prompt.selectAll"]["id"];
    }

    bookmarkListModal.deleteSelectedBtn.disabled = selectedBookmarkIds.length === 0;
}

export function toggleBookmarkSelection(bookmarkId) {
    const idAsNumber = parseInt(bookmarkId, 10);
    const itemElement = bookmarkListModal.grid.querySelector(`.bookmark-item[data-id="${idAsNumber}"]`);
    
    let currentSelectedIds = [...selectedBookmarkIds];
    const index = currentSelectedIds.indexOf(idAsNumber);

    if (index > -1) {
        currentSelectedIds.splice(index, 1);
        itemElement?.classList.remove('selected');
    } else {
        currentSelectedIds.push(idAsNumber);
        itemElement?.classList.add('selected');
    }
    setSelectedBookmarkIds(currentSelectedIds);
    updateManageModeUI();
}

export function handleSelectAll() {
    const allItems = bookmarkListModal.grid.querySelectorAll('.bookmark-item:not(.add-bookmark-item)');
    if (selectedBookmarkIds.length === bookmarks.length) {
        setSelectedBookmarkIds([]);
        allItems.forEach(item => item.classList.remove('selected'));
    } else {
        const renderedIds = Array.from(allItems).map(item => parseInt(item.dataset.id, 10));
        setSelectedBookmarkIds(renderedIds);
        allItems.forEach(item => item.classList.add('selected'));
    }
    updateManageModeUI();
}

function handleDirectBarSwap(outgoingContent, incomingContent, onComplete) {
    outgoingContent.style.opacity = '0';
    setTimeout(() => {
        outgoingContent.classList.add('hidden');
        outgoingContent.style.opacity = '1';
        incomingContent.classList.remove('hidden');
        incomingContent.style.opacity = '0';
        void incomingContent.offsetWidth;
        incomingContent.style.opacity = '1';
        if (onComplete) onComplete();
    }, 200);
}

export function toggleManageMode(forceState = null) {
    const newManageState = forceState !== null ? forceState : !isBookmarkManageModeActive;
    if (newManageState && isBookmarkSearchModeActive) {
        bookmarkListModal.searchInput.value = '';
        renderBookmarkModalGrid();
        setIsBookmarkSearchModeActive(false);
        setIsBookmarkManageModeActive(true);
        bookmarkListModal.content.classList.remove('search-mode');
        bookmarkListModal.content.classList.add('manage-mode');
        handleDirectBarSwap(bookmarkListModal.searchContent, bookmarkListModal.manageContent, () => {
            if (bookmarkSortableInstance) bookmarkSortableInstance.option('disabled', true);
            updateManageModeUI();
        });
        return;
    }
    setIsBookmarkManageModeActive(newManageState);
    bookmarkListModal.content.classList.toggle('manage-mode', newManageState);
    if (bookmarkSortableInstance) bookmarkSortableInstance.option('disabled', newManageState);

    if (newManageState) {
        bookmarkListModal.searchContent.classList.add('hidden');
        bookmarkListModal.manageContent.classList.remove('hidden');
        bookmarkListModal.actionBar.classList.remove('hidden');
        updateManageModeUI();
    } else {
        bookmarkListModal.searchInput.value = '';
        renderBookmarkModalGrid();
        bookmarkListModal.actionBar.classList.add('hidden');
        setTimeout(() => bookmarkListModal.manageContent.classList.add('hidden'), 300);
        setSelectedBookmarkIds([]);
        bookmarkListModal.grid.querySelectorAll('.bookmark-item.selected').forEach(item => item.classList.remove('selected'));
        updateManageModeUI();
    }
}

export function handleDeleteSelected() {
    if (selectedBookmarkIds.length === 0) return;
    setConfirmationModalPurpose('deleteSelectedBookmarks');
    const lang = languageSettings.ui;
    confirmationModal.title.textContent = i18nData["prompt.delete.title"][lang];
    const textFormat = i18nData["bookmark.delete.selectedText"][lang];
    confirmationModal.text.textContent = textFormat.replace('{count}', selectedBookmarkIds.length);
    openModal(confirmationModal.overlay);
}

export function toggleSearchMode(forceState = null) {
    const newSearchState = forceState !== null ? forceState : !isBookmarkSearchModeActive;
    if (newSearchState && isBookmarkManageModeActive) {
        setSelectedBookmarkIds([]);
        bookmarkListModal.grid.querySelectorAll('.bookmark-item.selected').forEach(item => item.classList.remove('selected'));
        setIsBookmarkManageModeActive(false);
        setIsBookmarkSearchModeActive(true);
        bookmarkListModal.content.classList.remove('manage-mode');
        bookmarkListModal.content.classList.add('search-mode');
        handleDirectBarSwap(bookmarkListModal.manageContent, bookmarkListModal.searchContent, () => {
            if (bookmarkSortableInstance) bookmarkSortableInstance.option('disabled', true);
            bookmarkListModal.searchInput.focus();
        });
        return;
    }
    setIsBookmarkSearchModeActive(newSearchState);
    bookmarkListModal.content.classList.toggle('search-mode', newSearchState);
    if (bookmarkSortableInstance) bookmarkSortableInstance.option('disabled', newSearchState);

    if (newSearchState) {
        bookmarkListModal.manageContent.classList.add('hidden');
        bookmarkListModal.searchContent.classList.remove('hidden');
        bookmarkListModal.actionBar.classList.remove('hidden');
        bookmarkListModal.searchInput.focus();
    } else {
        bookmarkListModal.actionBar.classList.add('hidden');
        setTimeout(() => bookmarkListModal.searchContent.classList.add('hidden'), 300);
        bookmarkListModal.searchInput.value = '';
        renderBookmarkModalGrid();
    }
}

export function handleSearchInput() {
    const searchTerm = bookmarkListModal.searchInput.value.toLowerCase().trim();
    const filtered = bookmarks.filter(b => b.name.toLowerCase().includes(searchTerm) || b.url.toLowerCase().includes(searchTerm));
    renderBookmarkModalGrid(filtered);
}


// --- Initialization ---

export function initializeBookmarks() {
    renderMainPageBookmarks();
    renderBookmarkModalGrid();
    
    bookmarkModal.saveBtn.addEventListener('click', handleSaveBookmark);
    bookmarkModal.closeBtn.addEventListener('click', () => closeModal(bookmarkModal.overlay));
    bookmarkModal.urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSaveBookmark();
        }
    });

    bookmarkListModal.closeBtn.addEventListener('click', () => {
        toggleManageMode(false);
        toggleSearchMode(false);
        closeModal(bookmarkListModal.overlay);
    });
    bookmarkListModal.manageBtn.addEventListener('click', () => toggleManageMode());
    bookmarkListModal.cancelManageBtn.addEventListener('click', () => toggleManageMode(false));
    bookmarkListModal.selectAllBtn.addEventListener('click', handleSelectAll);
    bookmarkListModal.deleteSelectedBtn.addEventListener('click', handleDeleteSelected);
    bookmarkListModal.searchBtn.addEventListener('click', () => toggleSearchMode());
    bookmarkListModal.cancelSearchBtn.addEventListener('click', () => toggleSearchMode(false));
    bookmarkListModal.searchInput.addEventListener('input', handleSearchInput);

    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('.bookmark-menu-option');
        if (!target) return;

        const action = target.dataset.action;
        closeAllBookmarkMenus();

        if (action === 'copy-link') {
            handleCopyLink();
        } else if (action === 'edit') {
            handleOpenEditBookmarkModal(currentBookmarkId);
        } else if (action === 'delete') {
            handleDeleteBookmark();
        }
        closeContainerBookmarkContextMenu();
    });

    const mainContainer = elements.mainPageBookmarkContainer;

    if (mainContainer) {
        mainContainer.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.bookmark-item-main') || e.target.closest('.bookmark-add-btn') || e.target.closest('.bookmark-more-btn')) {
                return;
            }

            e.preventDefault();
            showContainerBookmarkContextMenu(e);
        });

        const containerMenu = document.getElementById('bookmark-container-context-menu');
        if (containerMenu) {
            containerMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                const target = e.target.closest('.bookmark-menu-option');
                if (!target) return;

                const action = target.dataset.action;
                closeContainerBookmarkContextMenu();
                
                if (action === 'add-new') {
                    handleOpenAddBookmarkModal();
                } else if (action === 'view-all') {
                    openModal(bookmarkListModal.overlay);
                }
            });
        }
    }

    document.body.addEventListener('click', (e) => {
        if (activeMainBookmarkMenu && !activeMainBookmarkMenu.contains(e.target) && !e.target.closest('.bookmark-menu-btn-main')) {
            closeAllMainBookmarkMenus();
        }
        if (activeContainerBookmarkMenu && !activeContainerBookmarkMenu.contains(e.target)) {
            closeContainerBookmarkContextMenu();
        }
    });
}