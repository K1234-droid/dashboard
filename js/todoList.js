import {
    elements, languageSettings, i18nData, todos, setTodos,
    todoListModal, todoModal, mainPageTodoContainer, activeTodoMenu, setActiveTodoMenu,
    confirmationModal, setConfirmationModalPurpose, isTodoManageModeActive,
    setIsTodoManageModeActive, selectedTodoIds, setSelectedTodoIds,
    isTodoSearchModeActive, setIsTodoSearchModeActive, todoSortableInstance,
    setTodoSortableInstance, confirmationModalPurpose
} from './config.js';
import { openModal, closeModal, showInfoModal } from './ui.js';
import { showToast, log } from './utils.js';
import { saveSetting } from './storage.js';

let currentTodoId = null;
let activeMainTodoMenu = null;

// --- Rendering ---

function getLocaleDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const lang = languageSettings.date;
        const locale = lang === 'ja' ? 'ja-JP' : lang === 'en' ? 'en-US' : 'id-ID';
        return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
        return dateString; // Fallback
    }
}

/**
 * Merender daftar To-do di halaman utama (maksimal 5).
 */
export function renderMainPageTodos() {
    if (!mainPageTodoContainer.container) return;

    mainPageTodoContainer.list.innerHTML = '';
    mainPageTodoContainer.controls.innerHTML = '';
    const lang = languageSettings.ui;

    // Ambil 5 todo pertama (atau semua jika kurang dari 5)
    const todosToShow = todos.slice(0, 5);

    todosToShow.forEach(todo => {
        const item = document.createElement('div');
        item.className = 'todo-item-main'; // Akan menggunakan style yang mirip dengan bookmark-item-main
        item.dataset.id = todo.id;
        item.style.position = 'relative';

        const textContainer = document.createElement('div');
        textContainer.className = 'todo-item-text-container';

        const title = document.createElement('p');
        title.textContent = todo.title;
        title.className = 'todo-item-title';

        const date = document.createElement('p');
        date.textContent = getLocaleDate(todo.date);
        date.className = 'todo-item-date';

        textContainer.appendChild(title);
        if (todo.date) {
            textContainer.appendChild(date);
        }
        
        const menuBtn = document.createElement('button');
        menuBtn.className = 'todo-menu-btn-main'; // Mirip dengan bookmark-menu-btn-main
        menuBtn.innerHTML = '&#8942;';
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showMainTodoContextMenu(e, todo.id);
        });
        
        item.appendChild(textContainer);
        item.appendChild(menuBtn);
        
        mainPageTodoContainer.list.appendChild(item);
    });

    // Tambahkan tombol Kontrol
    const addBtn = document.createElement('button');
    addBtn.className = 'todo-add-btn'; // Mirip dengan bookmark-add-btn
    addBtn.innerHTML = '<span>+</span>';
    addBtn.onclick = handleOpenAddTodoModal;
    addBtn.setAttribute('data-tooltip', i18nData['todo.add']?.[lang] || 'Tambah To-do');

    mainPageTodoContainer.controls.appendChild(addBtn);

    // Hanya tampilkan tombol "Lainnya" jika ada lebih dari 5 to-do
    if (todos.length > 5) {
        const moreBtn = document.createElement('button');
        moreBtn.className = 'todo-more-btn'; // Mirip dengan bookmark-more-btn
        moreBtn.innerHTML = '&#8942;';
        moreBtn.onclick = () => openModal(todoListModal.overlay);
        moreBtn.setAttribute('data-tooltip', i18nData['todo.open']?.[lang] || 'Lihat Semua');
        mainPageTodoContainer.controls.appendChild(moreBtn);
    } else if (todos.length > 0 && todos.length <= 5) {
        // Tampilkan tombol "Lihat Semua" jika ada item tapi tidak lebih dari 5
        const moreBtn = document.createElement('button');
        moreBtn.className = 'todo-more-btn';
        moreBtn.innerHTML = '&#8942;';
        moreBtn.onclick = () => openModal(todoListModal.overlay);
        moreBtn.setAttribute('data-tooltip', i18nData['todo.open']?.[lang] || 'Lihat Semua');
        mainPageTodoContainer.controls.appendChild(moreBtn);
    }
}

/**
 * Merender semua item To-do di dalam modal.
 */
export function renderTodoModalGrid(todosToRender = todos) {
    if (!todoListModal.grid) return;
    todoListModal.grid.innerHTML = '';
    const lang = languageSettings.ui;
    
    todoListModal.noResultsMessage.classList.toggle('hidden', todosToRender.length > 0 || todos.length === 0);

    todosToRender.forEach(todo => {
        const item = document.createElement('div');
        item.className = 'todo-item'; // Style baru untuk di modal
        item.dataset.id = todo.id;

        const title = document.createElement('p');
        title.textContent = todo.title;
        title.className = 'todo-item-title-modal';

        const description = document.createElement('p');
        description.textContent = todo.description;
        description.className = 'todo-item-description-modal';

        const date = document.createElement('p');
        date.textContent = getLocaleDate(todo.date);
        date.className = 'todo-item-date-modal';

        const menuBtn = document.createElement('button');
        menuBtn.className = 'todo-menu-btn'; // Mirip dengan bookmark-menu-btn
        menuBtn.innerHTML = '&#8942;';
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showTodoContextMenu(e, todo.id);
        });

        item.appendChild(title);
        item.appendChild(description);
        if (todo.date) {
            item.appendChild(date);
        }
        item.appendChild(menuBtn);

        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            menuBtn.click();
        });
        
        item.addEventListener('click', (e) => {
            if (isTodoManageModeActive) {
                e.preventDefault();
                if (!e.target.closest('.todo-menu-btn')) {
                    toggleTodoSelection(todo.id);
                }
            } else if (!e.target.closest('.todo-menu-btn')) {
                // Opsional: Buka edit modal saat diklik
                handleOpenEditTodoModal(todo.id);
            }
        });

        const menuContainer = document.createElement('div');
        menuContainer.className = 'todo-item-menu'; // Mirip dengan bookmark-item-menu
        menuContainer.innerHTML = `
            <button class="todo-menu-option" data-action="edit">${i18nData["bookmark.menu.edit"][lang]}</button>
            <button class="todo-menu-option" data-action="delete">${i18nData["bookmark.menu.delete"][lang]}</button>
        `;

        item.appendChild(menuContainer);
        todoListModal.grid.appendChild(item);
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'todo-item add-todo-item'; // Mirip dengan add-bookmark-item
    addBtn.innerHTML = '<span>+</span>';
    addBtn.onclick = handleOpenAddTodoModal;
    addBtn.setAttribute('data-tooltip', i18nData['todo.add']?.[lang] || 'Tambah To-do');
    todoListModal.grid.appendChild(addBtn);
}

// --- Context Menu ---
function showTodoContextMenu(event, todoId) {
    closeAllTodoMenus();
    currentTodoId = todoId;

    const triggerElement = event.currentTarget;
    const itemContainer = triggerElement.closest('.todo-item');
    if (!itemContainer) return;

    const menuEl = itemContainer.querySelector('.todo-item-menu');
    if (!menuEl) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    menuEl._originalParent = itemContainer;
    document.body.appendChild(menuEl);

    menuEl.style.position = 'fixed';
    menuEl.style.zIndex = '102';
    menuEl.classList.add('show');

    // Atur posisi
    const menuHeight = menuEl.offsetHeight;
    const windowHeight = window.innerHeight;
    if (triggerRect.bottom + menuHeight + 4 > windowHeight) {
        menuEl.style.top = `${triggerRect.top - menuHeight - 4}px`;
    } else {
        menuEl.style.top = `${triggerRect.bottom + 4}px`;
    }

    const menuWidth = menuEl.offsetWidth;
    let menuLeft = triggerRect.right - menuWidth;
    if (menuLeft < 0) menuLeft = triggerRect.left;
    menuEl.style.left = `${menuLeft}px`;

    setActiveTodoMenu(menuEl);
}

export function closeAllTodoMenus() {
    if (activeTodoMenu) {
        if (activeTodoMenu._originalParent) {
            activeTodoMenu.style.position = '';
            activeTodoMenu.style.zIndex = '';
            activeTodoMenu.style.top = '';
            activeTodoMenu.style.left = '';
            activeTodoMenu.classList.remove('show');
            activeTodoMenu._originalParent.appendChild(activeTodoMenu);
        }
        setActiveTodoMenu(null);
    }
}

function showMainTodoContextMenu(event, todoId) {
    closeAllMainTodoMenus();
    currentTodoId = todoId;

    const triggerElement = event.currentTarget;
    const menuEl = document.getElementById('todo-context-menu-main');
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

    if (top + menuHeight > windowHeight) top = triggerRect.top - menuHeight - 4;
    if (left < 0) left = triggerRect.left;
    if (left + menuWidth > windowWidth) left = windowWidth - menuWidth - 8;

    menuEl.style.top = `${top}px`;
    menuEl.style.left = `${left}px`;
    activeMainTodoMenu = menuEl;
}

export function closeAllMainTodoMenus() {
    const menuEl = document.getElementById('todo-context-menu-main');
    if (menuEl && menuEl.classList.contains('show')) {
        menuEl.classList.remove('show');
        menuEl.style.top = '';
        menuEl.style.left = '';
        activeMainTodoMenu = null;
    }
}

// --- CRUD & Actions ---

export function handleOpenAddTodoModal() {
    currentTodoId = null;
    const lang = languageSettings.ui;
    todoModal.title.textContent = i18nData["todo.addTitle"]?.[lang];
    todoModal.saveBtn.textContent = i18nData["settings.username.save"]?.[lang];
    todoModal.titleInput.value = '';
    todoModal.descriptionInput.value = '';
    todoModal.dateInput.value = '';
    openModal(todoModal.overlay);
    todoModal.titleInput.focus();
}

function handleOpenEditTodoModal(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    currentTodoId = id;
    const lang = languageSettings.ui;
    todoModal.title.textContent = i18nData["todo.editTitle"]?.[lang];
    todoModal.saveBtn.textContent = i18nData["prompt.saveChanges"]?.[lang];
    todoModal.titleInput.value = todo.title;
    todoModal.descriptionInput.value = todo.description;
    todoModal.dateInput.value = todo.date || '';
    openModal(todoModal.overlay);
    todoModal.titleInput.focus();
}

export async function handleSaveTodo() {
    let title = todoModal.titleInput.value.trim();
    let description = todoModal.descriptionInput.value.trim();
    let date = todoModal.dateInput.value;
    const isEditing = currentTodoId !== null;

    if (!title) {
        showInfoModal("info.attention.title", "todo.error.titleRequired");
        return;
    }

    let tempTodos = [...todos];
    if (isEditing) {
        const idToEdit = Number(currentTodoId);
        const index = tempTodos.findIndex(t => Number(t.id) === idToEdit);
        if (index > -1) {
            tempTodos[index] = { ...tempTodos[index], id: idToEdit, title, description, date };
        }
    } else {
        const newTodo = { id: Date.now(), title, description, date };
        tempTodos.push(newTodo);
    }

    setTodos(tempTodos);
    await saveSetting('todos', todos);
    
    closeModal(todoModal.overlay);
    renderMainPageTodos();
    renderTodoModalGrid();
    showToast(isEditing ? "todo.edit.success" : "todo.save.success");
    currentTodoId = null;
    todoModal.titleInput.blur();
    todoModal.descriptionInput.blur();
}

function handleDeleteTodo() {
    setConfirmationModalPurpose('deleteTodo');
    const lang = languageSettings.ui;
    confirmationModal.title.textContent = i18nData["todo.delete.title"][lang];
    confirmationModal.text.textContent = i18nData["todo.delete.text"][lang];
    openModal(confirmationModal.overlay);
}

export async function confirmDeleteTodo() {
    const idToDeleteSet = new Set();

    if (confirmationModalPurpose === 'deleteSelectedTodos') {
        selectedTodoIds.forEach(id => idToDeleteSet.add(Number(id)));
    } else {
        idToDeleteSet.add(Number(currentTodoId));
    }
    
    const tempTodos = todos.filter(t => !idToDeleteSet.has(Number(t.id)));
    
    setTodos(tempTodos);
    await saveSetting('todos', todos);
    
    closeModal(confirmationModal.overlay);
    renderMainPageTodos();
    renderTodoModalGrid();
    showToast("todo.delete.success");

    if (confirmationModalPurpose === 'deleteSelectedTodos') {
        toggleManageMode(false);
    }
}

// --- Manage & Search Mode ---
export function updateManageModeUI() {
    const lang = languageSettings.ui;
    const selectCountFormat = i18nData["prompt.selectCount"][lang] || i18nData["prompt.selectCount"]["id"];
    todoListModal.selectCount.textContent = selectCountFormat.replace('{count}', selectedTodoIds.length);

    if (selectedTodoIds.length === todos.length && todos.length > 0) {
        todoListModal.selectAllBtn.textContent = i18nData["prompt.deselectAll"][lang] || i18nData["prompt.deselectAll"]["id"];
    } else {
        todoListModal.selectAllBtn.textContent = i18nData["prompt.selectAll"][lang] || i18nData["prompt.selectAll"]["id"];
    }

    todoListModal.deleteSelectedBtn.disabled = selectedTodoIds.length === 0;
}

export function toggleTodoSelection(todoId) {
    const idAsNumber = parseInt(todoId, 10);
    const itemElement = todoListModal.grid.querySelector(`.todo-item[data-id="${idAsNumber}"]`);
    
    let currentSelectedIds = [...selectedTodoIds];
    const index = currentSelectedIds.indexOf(idAsNumber);

    if (index > -1) {
        currentSelectedIds.splice(index, 1);
        itemElement?.classList.remove('selected');
    } else {
        currentSelectedIds.push(idAsNumber);
        itemElement?.classList.add('selected');
    }
    setSelectedTodoIds(currentSelectedIds);
    updateManageModeUI();
}

export function handleSelectAll() {
    const allItems = todoListModal.grid.querySelectorAll('.todo-item:not(.add-todo-item)');
    if (selectedTodoIds.length === todos.length) {
        setSelectedTodoIds([]);
        allItems.forEach(item => item.classList.remove('selected'));
    } else {
        const renderedIds = Array.from(allItems).map(item => parseInt(item.dataset.id, 10));
        setSelectedTodoIds(renderedIds);
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
    const newManageState = forceState !== null ? forceState : !isTodoManageModeActive;
    if (newManageState && isTodoSearchModeActive) {
        todoListModal.searchInput.value = '';
        renderTodoModalGrid();
        setIsTodoSearchModeActive(false);
        setIsTodoManageModeActive(true);
        todoListModal.content.classList.remove('search-mode');
        todoListModal.content.classList.add('manage-mode');
        handleDirectBarSwap(todoListModal.searchContent, todoListModal.manageContent, () => {
            if (todoSortableInstance) todoSortableInstance.option('disabled', true);
            updateManageModeUI();
        });
        return;
    }
    setIsTodoManageModeActive(newManageState);
    todoListModal.content.classList.toggle('manage-mode', newManageState);
    if (todoSortableInstance) todoSortableInstance.option('disabled', newManageState);

    if (newManageState) {
        todoListModal.searchContent.classList.add('hidden');
        todoListModal.manageContent.classList.remove('hidden');
        todoListModal.actionBar.classList.remove('hidden');
        updateManageModeUI();
    } else {
        todoListModal.searchInput.value = '';
        renderTodoModalGrid();
        todoListModal.actionBar.classList.add('hidden');
        setTimeout(() => todoListModal.manageContent.classList.add('hidden'), 300);
        setSelectedTodoIds([]);
        todoListModal.grid.querySelectorAll('.todo-item.selected').forEach(item => item.classList.remove('selected'));
        updateManageModeUI();
    }
}

export function handleDeleteSelected() {
    if (selectedTodoIds.length === 0) return;
    setConfirmationModalPurpose('deleteSelectedTodos');
    const lang = languageSettings.ui;
    confirmationModal.title.textContent = i18nData["todo.delete.title"][lang];
    const textFormat = i18nData["todo.delete.selectedText"][lang];
    confirmationModal.text.textContent = textFormat.replace('{count}', selectedTodoIds.length);
    openModal(confirmationModal.overlay);
}

export function toggleSearchMode(forceState = null) {
    const newSearchState = forceState !== null ? forceState : !isTodoSearchModeActive;
    if (newSearchState && isTodoManageModeActive) {
        setSelectedTodoIds([]);
        todoListModal.grid.querySelectorAll('.todo-item.selected').forEach(item => item.classList.remove('selected'));
        setIsTodoManageModeActive(false);
        setIsTodoSearchModeActive(true);
        todoListModal.content.classList.remove('manage-mode');
        todoListModal.content.classList.add('search-mode');
        handleDirectBarSwap(todoListModal.manageContent, todoListModal.searchContent, () => {
            if (todoSortableInstance) todoSortableInstance.option('disabled', true);
            todoListModal.searchInput.focus();
        });
        return;
    }
    setIsTodoSearchModeActive(newSearchState);
    todoListModal.content.classList.toggle('search-mode', newSearchState);
    if (todoSortableInstance) todoSortableInstance.option('disabled', newSearchState);

    if (newSearchState) {
        todoListModal.manageContent.classList.add('hidden');
        todoListModal.searchContent.classList.remove('hidden');
        todoListModal.actionBar.classList.remove('hidden');
        todoListModal.searchInput.focus();
    } else {
        todoListModal.actionBar.classList.add('hidden');
        setTimeout(() => todoListModal.searchContent.classList.add('hidden'), 300);
        todoListModal.searchInput.value = '';
        renderTodoModalGrid();
    }
}

export function handleSearchInput() {
    const searchTerm = todoListModal.searchInput.value.toLowerCase().trim();
    const filtered = todos.filter(t => 
        t.title.toLowerCase().includes(searchTerm) || 
        t.description.toLowerCase().includes(searchTerm)
    );
    renderTodoModalGrid(filtered);
}

// --- Initialization ---

export function initializeTodos() {
    renderMainPageTodos();
    renderTodoModalGrid();
    
    todoModal.saveBtn.addEventListener('click', handleSaveTodo);
    todoModal.closeBtn.addEventListener('click', () => {
        closeModal(todoModal.overlay);
        currentTodoId = null;
    });
    todoModal.titleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            todoModal.descriptionInput.focus();
        }
    });

    todoListModal.closeBtn.addEventListener('click', () => {
        toggleManageMode(false);
        toggleSearchMode(false);
        closeModal(todoListModal.overlay);
    });

    if (todoListModal.addBtn) {
        todoListModal.addBtn.addEventListener('click', handleOpenAddTodoModal);
    }

    todoListModal.manageBtn.addEventListener('click', () => toggleManageMode());
    todoListModal.cancelManageBtn.addEventListener('click', () => toggleManageMode(false));
    todoListModal.selectAllBtn.addEventListener('click', handleSelectAll);
    todoListModal.deleteSelectedBtn.addEventListener('click', handleDeleteSelected);
    todoListModal.searchBtn.addEventListener('click', () => toggleSearchMode());
    todoListModal.cancelSearchBtn.addEventListener('click', () => toggleSearchMode(false));
    todoListModal.searchInput.addEventListener('input', handleSearchInput);

    // Listener untuk menu opsi di modal
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('.todo-menu-option');
        if (!target) return;

        const action = target.dataset.action;
        closeAllTodoMenus();

        if (action === 'edit') {
            handleOpenEditTodoModal(currentTodoId);
        } else if (action === 'delete') {
            handleDeleteTodo();
        }
    });

    // Listener untuk menu opsi di halaman utama
    const contextMenuMain = document.getElementById('todo-context-menu-main');
    if (contextMenuMain) {
        contextMenuMain.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = e.target.closest('.todo-menu-option');
            if (!target) return;
            const action = target.dataset.action;
            closeAllMainTodoMenus();
            if (action === 'edit') handleOpenEditTodoModal(currentTodoId);
            else if (action === 'delete') handleDeleteTodo();
        });
    }

    // Menutup menu saat klik di luar
    document.body.addEventListener('click', (e) => {
        if (activeMainTodoMenu && !activeMainTodoMenu.contains(e.target) && !e.target.closest('.todo-menu-btn-main')) {
            closeAllMainTodoMenus();
        }
        if (activeTodoMenu && !activeTodoMenu.contains(e.target) && !e.target.closest('.todo-menu-btn')) {
            closeAllTodoMenus();
        }
    });
}