import {
    languageSettings, i18nData, todoList, setTodoList,
    todoListModal, activeTodoMenu, setActiveTodoMenu,
    confirmationModal, setConfirmationModalPurpose, isTodoManageModeActive,
    setIsTodoManageModeActive, selectedTodoIds, setSelectedTodoIds,
    isTodoSearchModeActive, setIsTodoSearchModeActive, todoSortableInstance,
    confirmationModalPurpose, setTodoSortableInstance, todoModal,
    mainPageTodoContainer, settingSwitches, elements, isDraggingTodo, localeMap
} from './config.js';
import { openModal, closeModal, showInfoModal } from './ui.js';
import { showToast, log } from './utils.js';
import { saveSetting } from './storage.js';
import { markSearchDataAsStale } from './search.js';

let currentTodoId = null;
let activeContainerTodoMenu = null;

// --- Rendering ---
export function renderMainPageTodoList() {
    if (!mainPageTodoContainer.container) return;

    mainPageTodoContainer.container.innerHTML = '';
    const lang = languageSettings.ui;

    const viewportHeight = window.innerHeight;
    
    let maxItems = 5; 

    if (viewportHeight <= 380) {
        maxItems = 1;
    } else if (viewportHeight <= 440) { 
        maxItems = 2;
    } else if (viewportHeight <= 500) { 
        maxItems = 3;
    } else if (viewportHeight <= 555) { 
        maxItems = 4;
    }

    const description = document.createElement('p');
    description.className = 'main-page-todo-description';
    description.setAttribute('data-i18n-key', 'todo.main.description');
    description.textContent = i18nData["todo.main.description"]?.[lang] || "Daftar tugas";

    mainPageTodoContainer.container.appendChild(description);

    const listContainer = document.createElement('div');
    listContainer.className = 'main-page-todo-list';
    mainPageTodoContainer.container.appendChild(listContainer);

    const itemsToShow = todoList.filter(item => !item.completed).slice(0, maxItems);
    itemsToShow.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'todo-item-main';
        itemEl.dataset.id = item.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-item-checkbox';
        checkbox.checked = item.completed;
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            toggleTodoItemCompleted(item.id, e.target.checked);
        });

        const textContainer = document.createElement('div');
        textContainer.className = 'todo-item-text-container';
        
        const name = document.createElement('p');
        name.textContent = item.title;
        name.className = 'todo-item-name';

        itemEl.appendChild(checkbox);
        itemEl.appendChild(textContainer);
        textContainer.appendChild(name);

        if (item.dueDate) {
            const dateEl = document.createElement('p');
            dateEl.className = 'todo-item-date-main';
            
            const d = new Date(item.dueDate);
            const currentLang = languageSettings.ui;
            const locale = localeMap[currentLang] || 'default';

            dateEl.textContent = d.toLocaleString(locale, { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric', 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: false
            });
            
            textContainer.appendChild(dateEl);
        }
        
        if(item.completed) {
            itemEl.classList.add('completed');
        }

        itemEl.addEventListener('click', (e) => {
             if (e.target.type !== 'checkbox') {
                handleOpenEditTodoModal(item.id);
             }
        });

        itemEl.style.position = 'relative';

        const menuBtn = document.createElement('button');
        menuBtn.className = 'bookmark-menu-btn-main todo-menu-btn-main'; 
        menuBtn.innerHTML = '&#8942;';
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showMainPageTodoContextMenu(e, item.id);
        });

        const menuContainer = document.createElement('div');
        menuContainer.className = 'bookmark-item-menu';
        menuContainer.dataset.id = item.id;
        menuContainer.innerHTML = `
            <button class="bookmark-menu-option" data-action="edit" data-i18n-key="todo.menu.edit">${i18nData["todo.menu.edit"][lang]}</button>
            <button class="bookmark-menu-option" data-action="delete" data-i18n-key="todo.menu.delete">${i18nData["todo.menu.delete"][lang]}</button>
        `;

        itemEl.appendChild(menuBtn);
        itemEl.appendChild(menuContainer);
        
        listContainer.appendChild(itemEl);
    });

    if (itemsToShow.length === 0) {
        const noItems = document.createElement('p');
        noItems.className = 'main-page-todo-no-items';
        noItems.setAttribute('data-i18n-key', 'todo.main.noItems');
        noItems.textContent = i18nData["todo.main.noItems"]?.[lang] || "Tidak ada tugas.";
        listContainer.appendChild(noItems);
    }

    const controls = document.createElement('div');
    controls.className = 'main-page-todo-controls';
    
    const addBtn = document.createElement('button');
    addBtn.className = 'bookmark-add-btn todo-add-btn-main';
    addBtn.innerHTML = '<span>+</span>';
    addBtn.onclick = handleOpenAddTodoModal;
    addBtn.setAttribute('data-tooltip', i18nData['todo.add']?.[lang] || 'Tambah Daftar Tugas');
    addBtn.setAttribute('data-i18n-key', 'todo.add');

    controls.appendChild(addBtn);

    if (todoList.length > 0) {
        const moreBtn = document.createElement('button');
        moreBtn.className = 'bookmark-more-btn todo-more-btn-main';
        moreBtn.innerHTML = '&#8942;';
        moreBtn.onclick = () => openModal(todoListModal.overlay);
        moreBtn.setAttribute('data-tooltip', i18nData['todo.open']?.[lang] || 'Lihat To-do');
        moreBtn.setAttribute('data-i18n-key', 'todo.open');
        controls.appendChild(moreBtn);
    }

    mainPageTodoContainer.container.appendChild(controls);
}

async function toggleTodoItemCompleted(id, isCompleted) {
    const itemIndex = todoList.findIndex(t => t.id === id);
    if (itemIndex > -1) {
        const newTodoList = [...todoList];
        newTodoList[itemIndex] = { ...newTodoList[itemIndex], completed: isCompleted };
        setTodoList(newTodoList);
        await saveSetting('todoList', newTodoList);
        renderMainPageTodoList();
        if (isTodoSearchModeActive) {
            handleSearchInput();
        } else {
            renderTodoModalGrid();
        }
    }
}

function createTodoModalItem(item, lang) {
    const itemEl = document.createElement('div');
    itemEl.className = 'todo-item';
    itemEl.dataset.id = item.id;
    if (item.completed) {
        itemEl.classList.add('completed');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-item-checkbox-modal';
    checkbox.checked = item.completed;
    checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        toggleTodoItemCompleted(item.id, e.target.checked);
    });
    
    const textContainer = document.createElement('div');
    textContainer.className = 'todo-item-text-container-modal';

    const name = document.createElement('p');
    name.textContent = item.title;
    name.className = 'todo-item-name-modal';

    const description = document.createElement('p');
    description.textContent = item.description;
    description.className = 'todo-item-description-modal';

    textContainer.appendChild(name);
    if (item.description) {
        textContainer.appendChild(description);
    }

    if (item.dueDate) {
        const dateEl = document.createElement('p');
        dateEl.className = 'todo-item-date-modal'; 
        
        const d = new Date(item.dueDate);
        const currentLang = languageSettings.ui;
        const locale = localeMap[currentLang] || 'default';

        dateEl.textContent = d.toLocaleString(locale, { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: false
        });
        
        if (item.description) {
            dateEl.style.marginTop = '2px';
        }

        textContainer.appendChild(dateEl);
    }

    const menuBtn = document.createElement('button');
    menuBtn.className = 'bookmark-menu-btn todo-menu-btn';
    menuBtn.innerHTML = '&#8942;';
    menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showTodoContextMenu(e, item.id);
    });

    itemEl.addEventListener('click', (e) => {
        if (isDraggingTodo) {
            return;
        }
        if (isTodoManageModeActive) {
            if (e.target.type !== 'checkbox') {
                e.preventDefault();
                toggleTodoSelection(item.id);
            }
            return;
        }
        if (e.target.type !== 'checkbox' && !e.target.closest('.todo-menu-btn')) {
            handleOpenEditTodoModal(item.id);
        }
    });
    
    itemEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (isTodoManageModeActive) {
             toggleTodoSelection(item.id);
        } else {
            const menuBtn = itemEl.querySelector('.todo-menu-btn');
            if (menuBtn) menuBtn.click();
        }
    });

    const menuContainer = document.createElement('div');
    menuContainer.className = 'bookmark-item-menu';
    menuContainer.dataset.id = item.id;
    menuContainer.innerHTML = `
        <button class="bookmark-menu-option" data-action="edit" data-i18n-key="todo.menu.edit">${i18nData["todo.menu.edit"][lang]}</button>
        <button class="bookmark-menu-option" data-action="delete" data-i18n-key="todo.menu.delete">${i18nData["todo.menu.delete"][lang]}</button>
    `;

    itemEl.appendChild(checkbox);
    itemEl.appendChild(textContainer);
    itemEl.appendChild(menuBtn);
    itemEl.appendChild(menuContainer);
    return itemEl;
}

export function renderTodoModalGrid(todosToRender = todoList) {
    if (!todoListModal.grid) return;
    todoListModal.grid.innerHTML = '';
    const lang = languageSettings.ui;
    
    const incompleteTodos = todosToRender.filter(item => !item.completed);
    const completedTodos = todosToRender.filter(item => item.completed);

    incompleteTodos.forEach(item => {
        const itemEl = createTodoModalItem(item, lang);
        todoListModal.grid.appendChild(itemEl);
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'bookmark-item add-bookmark-item';
    addBtn.innerHTML = '<span>+</span>';
    addBtn.onclick = handleOpenAddTodoModal;
    addBtn.setAttribute('data-tooltip', i18nData['todo.add']?.[lang] || 'Tambah To-do');

    if (incompleteTodos.length > 0) {
        addBtn.style.display = 'none';
    } else {
        addBtn.style.display = '';
    }

    todoListModal.grid.appendChild(addBtn);

    if (completedTodos.length > 0) {
        const completedHeader = document.createElement('h3');
        completedHeader.className = 'todo-completed-header';
        completedHeader.setAttribute('data-i18n-key', 'todo.completedTitle');
        completedHeader.textContent = i18nData["todo.completedTitle"]?.[lang] || "Tugas Selesai";
        todoListModal.grid.appendChild(completedHeader);
        
        completedTodos.forEach(item => {
            const itemEl = createTodoModalItem(item, lang);
            todoListModal.grid.appendChild(itemEl);
        });
    }
}

// --- Context Menu ---
export function showTodoContextMenu(event, todoId) {
    closeAllTodoMenus();
    currentTodoId = todoId;

    const triggerElement = event.currentTarget;
    const itemContainer = triggerElement.closest('.todo-item');
    if (!itemContainer) return;

    const menuEl = itemContainer.querySelector('.bookmark-item-menu');
    if (!menuEl) return;

    menuEl._originalParent = itemContainer;
    document.body.appendChild(menuEl);
    
    menuEl.style.position = 'fixed';
    menuEl.style.zIndex = '102';
    menuEl.classList.add('show');

    const triggerRect = triggerElement.getBoundingClientRect();
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

function showContainerTodoContextMenu(event) {
    closeAllTodoMenus();

    const menuEl = document.getElementById('todo-container-context-menu');
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

    if (top + menuHeight > windowHeight) top = windowHeight - menuHeight - 8;
    if (left + menuWidth > windowWidth) left = windowWidth - menuWidth - 8;

    menuEl.style.top = `${top}px`;
    menuEl.style.left = `${left}px`;
    activeContainerTodoMenu = menuEl;
}

function closeContainerTodoContextMenu() {
    const menuEl = document.getElementById('todo-container-context-menu');
    if (menuEl && menuEl.classList.contains('show')) {
        menuEl.classList.remove('show');
        menuEl.style.top = '';
        menuEl.style.left = '';
        activeContainerTodoMenu = null;
    }
}

export function closeAllContainerTodoMenus_main() {
    closeContainerTodoContextMenu();
}

export function showMainPageTodoContextMenu(event, todoId) {
    closeAllTodoMenus();
    currentTodoId = todoId;

    const triggerElement = event.currentTarget;
    const itemContainer = triggerElement.closest('.todo-item-main');
    if (!itemContainer) return;

    const menuEl = itemContainer.querySelector('.bookmark-item-menu');
    if (!menuEl) return;

    menuEl._originalParent = itemContainer;
    document.body.appendChild(menuEl);

    menuEl.style.position = 'fixed';
    menuEl.style.zIndex = '106';
    menuEl.classList.add('show');

    const triggerRect = triggerElement.getBoundingClientRect();
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

// --- CRUD & Actions ---
export function handleOpenAddTodoModal() {
    currentTodoId = null;
    const lang = languageSettings.ui;
    todoModal.title.textContent = i18nData["todo.addTitle"]?.[lang];
    todoModal.saveBtn.textContent = i18nData["settings.username.save"]?.[lang];
    todoModal.titleInput.value = '';
    todoModal.descriptionInput.value = '';
    todoModal.dateTimeInput.value = '';
    openModal(todoModal.overlay);
    todoModal.titleInput.focus();
}

function handleOpenEditTodoModal(id) {
    const item = todoList.find(t => t.id === id);
    if (!item) return;
    currentTodoId = id;
    const lang = languageSettings.ui;
    todoModal.title.textContent = i18nData["todo.editTitle"]?.[lang];
    todoModal.saveBtn.textContent = i18nData["prompt.saveChanges"]?.[lang];
    todoModal.titleInput.value = item.title;
    todoModal.descriptionInput.value = item.description || '';
    
    if (item.dueDate) {
        const localDate = new Date(item.dueDate);
        const year = localDate.getFullYear();
        const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
        const day = localDate.getDate().toString().padStart(2, '0');
        const hours = localDate.getHours().toString().padStart(2, '0');
        const minutes = localDate.getMinutes().toString().padStart(2, '0');
        
        todoModal.dateTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    } else {
        todoModal.dateTimeInput.value = '';
    }
    
    openModal(todoModal.overlay);
    todoModal.titleInput.focus();
}

export async function handleSaveTodo() {
    let title = todoModal.titleInput.value.trim();
    let description = todoModal.descriptionInput.value.trim();
    
    const localDateVal = todoModal.dateTimeInput.value;
    const dueDate = localDateVal ? new Date(localDateVal).toISOString() : null; 
    
    const isEditing = currentTodoId !== null;

    if (!title) {
        showInfoModal("info.attention.title", "todo.error.titleRequired");
        return;
    }

    let tempTodoList = [...todoList];
    if (isEditing) {
        const idToEdit = Number(currentTodoId);
        const index = tempTodoList.findIndex(t => Number(t.id) === idToEdit);
        if (index > -1) {
            tempTodoList[index] = { ...tempTodoList[index], title, description, dueDate };
        }
    } else {
        const newItem = { id: Date.now(), title, description, completed: false, dueDate };
        tempTodoList.unshift(newItem);
    }

    setTodoList(tempTodoList);
    await saveSetting('todoList', todoList);
    
    closeModal(todoModal.overlay);
    renderMainPageTodoList();

    if (isTodoSearchModeActive) {
        handleSearchInput();
    } else {
        renderTodoModalGrid();
    }
    
    showToast(isEditing ? "todo.edit.success" : "todo.save.success");
    markSearchDataAsStale();
    currentTodoId = null;
    todoModal.titleInput.blur();
    todoModal.descriptionInput.blur();
    todoModal.dateTimeInput.blur();
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
    } else if (confirmationModalPurpose === 'deleteTodo') {
        idToDeleteSet.add(Number(currentTodoId));
    } else if (confirmationModalPurpose === 'deleteTodoListData') {
        todoList.forEach(item => idToDeleteSet.add(Number(item.id)));
    }
    
    const tempTodoList = todoList.filter(t => !idToDeleteSet.has(Number(t.id)));
    
    setTodoList(tempTodoList);
    await saveSetting('todoList', todoList);
    
    closeModal(confirmationModal.overlay);
    renderMainPageTodoList();

    if (isTodoSearchModeActive) {
        handleSearchInput();
    } else {
        renderTodoModalGrid();
    }

    if (tempTodoList.length === 0 && !isTodoSearchModeActive && !isTodoManageModeActive) {
        renderTodoModalGrid();
    }
    
    if (confirmationModalPurpose === 'deleteTodoListData') {
        showToast("data.delete.todo.success");
        setTimeout(() => window.location.reload(), 1500);
    } else {
        showToast("todo.delete.success");
    }
    
    markSearchDataAsStale();

    if (confirmationModalPurpose === 'deleteSelectedTodos') {
        toggleManageMode(false);
    }
}

// --- Manage & Search Mode ---
export function updateManageModeUI() {
    const lang = languageSettings.ui;
    const selectCountFormat = i18nData["prompt.selectCount"][lang] || i18nData["prompt.selectCount"]["id"];
    todoListModal.selectCount.textContent = selectCountFormat.replace('{count}', selectedTodoIds.length);

    const allVisibleItems = Array.from(todoListModal.grid.querySelectorAll('.todo-item:not(.add-bookmark-item)'));
    const allVisibleIds = allVisibleItems.map(item => parseInt(item.dataset.id, 10));

    if (allVisibleIds.length > 0 && allVisibleIds.every(id => selectedTodoIds.includes(id))) {
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
    const allItems = todoListModal.grid.querySelectorAll('.todo-item:not(.add-bookmark-item)');
    const allVisibleIds = Array.from(allItems).map(item => parseInt(item.dataset.id, 10));
    
    const allAreSelected = allVisibleIds.length > 0 && allVisibleIds.every(id => selectedTodoIds.includes(id));

    if (allAreSelected) {
        setSelectedTodoIds(selectedTodoIds.filter(id => !allVisibleIds.includes(id)));
        allItems.forEach(item => item.classList.remove('selected'));
    } else {
        const newSelectedIds = new Set([...selectedTodoIds, ...allVisibleIds]);
        setSelectedTodoIds(Array.from(newSelectedIds));
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
        todoListModal.manageContent.scrollLeft = 0;
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
    confirmationModal.title.textContent = i18nData["todo.delete.selectedTitle"][lang];
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
        todoListModal.noResultsMessage.classList.add('hidden');
    }
}

export function handleSearchInput() {
    const searchTerm = todoListModal.searchInput.value.toLowerCase().trim();
    const filtered = todoList.filter(t => 
        t.title.toLowerCase().includes(searchTerm) || 
        (t.description && t.description.toLowerCase().includes(searchTerm))
    );
    renderTodoModalGrid(filtered);

    if (filtered.length === 0 && searchTerm.length > 0) {
        todoListModal.noResultsMessage.classList.remove('hidden');
    } else {
        todoListModal.noResultsMessage.classList.add('hidden');
    }
}

// --- Initialization ---
export function initializeTodoList() {
    renderMainPageTodoList();
    renderTodoModalGrid();
    
    if (settingSwitches.showTodoList) {
        applyShowTodoList(settingSwitches.showTodoList.checked);
    }

    todoModal.saveBtn.addEventListener('click', handleSaveTodo);
    todoModal.closeBtn.addEventListener('click', () => {
        closeModal(todoModal.overlay);
        currentTodoId = null;
    });
    todoModal.titleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
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

    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('.bookmark-menu-option');
    
        if (!target || !activeTodoMenu || !activeTodoMenu.contains(target)) {
            return;
        }
    
        const action = target.dataset.action;
        closeAllTodoMenus();
    
        if (action === 'edit') {
            handleOpenEditTodoModal(currentTodoId);
        } else if (action === 'delete') {
            handleDeleteTodo();
        }
    });
    
    window.addEventListener("click", (e) => {
        if (activeTodoMenu && !activeTodoMenu.contains(e.target) && !e.target.closest('.todo-menu-btn')) {
            closeAllTodoMenus();
        }
        if (activeContainerTodoMenu && !activeContainerTodoMenu.contains(e.target)) {
            closeContainerTodoContextMenu();
        }
    });

    const mainContainer = mainPageTodoContainer.container;
    if (mainContainer) {
        mainContainer.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.todo-item-main') || e.target.closest('.main-page-todo-controls')) {
                return;
            }
            e.preventDefault();
            showContainerTodoContextMenu(e);
        });

        const containerMenu = document.getElementById('todo-container-context-menu');
        if (containerMenu) {
            containerMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                const target = e.target.closest('.bookmark-menu-option');
                if (!target) return;

                const action = target.dataset.action;
                closeContainerTodoContextMenu();

                if (action === 'add-new') {
                    handleOpenAddTodoModal();
                } else if (action === 'view-all') {
                    openModal(todoListModal.overlay);
                }
            });
        }
    }
    
    const manageContent = todoListModal.manageContent;
    if (manageContent) {
        manageContent.addEventListener('wheel', (e) => {
            if (isTodoManageModeActive) {
                e.preventDefault();
                manageContent.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }
}

export function applyShowTodoList(show) {
    elements.body.classList.toggle("todo-list-visible", show);

    if (mainPageTodoContainer.container) {
        mainPageTodoContainer.container.classList.toggle("hidden", !show);
    }

    const infoSection = document.querySelector('.info-section');
    if (!infoSection) return;
    const isMobileLayout = window.innerWidth <= 930;

    if (show && !isMobileLayout) { 
        const todoWidth = mainPageTodoContainer.container?.offsetWidth || 280;
        const rightMargin = 10;
        const gap = 0;
        
    } else {
        infoSection.style.right = '';
    }
}