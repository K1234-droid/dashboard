import {
    languageSettings, i18nData, prompts, promptModal, importModal,
    isExportModeActive, selectedExportIds, promptsToImport, selectedImportIds, activeHeaderMenu,
    setPrompts, setIsExportModeActive, setSelectedExportIds, setPromptsToImport,
    setSelectedImportIds, setActiveHeaderMenu, sortableInstance, isManageModeActive, setIsManageModeActive, isSearchModeActive, setIsSearchModeActive
} from './config.js';
import { openModal, closeModal, showInfoModal } from './ui.js';
import { showToast, readFileAsDataURL } from './utils.js';
import { saveSetting, updateStorageIndicator } from './storage.js';
import { renderPrompts } from './promptManager.js';

// --- Menu Management ---
export function showHeaderContextMenu(event) {
    closeAllHeaderMenus();
    const btn = event.currentTarget;
    const menuEl = btn.nextElementSibling;
    if (!menuEl) return;

    document.body.appendChild(menuEl);
    menuEl.style.position = 'fixed';
    menuEl.style.zIndex = '102';
    menuEl.classList.add('show');

    const btnRect = btn.getBoundingClientRect();
    const menuHeight = menuEl.offsetHeight;
    const windowHeight = window.innerHeight;

    if (btnRect.bottom + menuHeight + 4 > windowHeight) {
        menuEl.style.top = `${btnRect.top - menuHeight - 4}px`;
    } else {
        menuEl.style.top = `${btnRect.bottom + 4}px`;
    }

    const menuWidth = menuEl.offsetWidth;
    let menuLeft = btnRect.right - menuWidth;
    if (menuLeft < 0) menuLeft = btnRect.left;
    menuEl.style.left = `${menuLeft}px`;

    setActiveHeaderMenu(menuEl);
}

export function closeAllHeaderMenus() {
    if (activeHeaderMenu) {
        activeHeaderMenu.classList.remove('show');
        const originalContainer = document.getElementById('prompt-header-menu-container');
        if (originalContainer) {
            originalContainer.appendChild(activeHeaderMenu);
        }
        setActiveHeaderMenu(null);
    }
}

// --- Import Logic ---
export function handleOpenImportModal() {
    closeAllHeaderMenus();
    setPromptsToImport([]);
    setSelectedImportIds([]);
    importModal.fileInput.value = '';
    importModal.previewList.innerHTML = '';
    importModal.importBtn.disabled = true;
    importModal.previewContainer.classList.add('hidden');
    importModal.dropzone.classList.remove('hidden');
    updateImportStorageIndicator();
    openModal(importModal.overlay);
}

async function parseAndValidateFile(file) {
    if (!file || file.type !== 'application/json') {
        showInfoModal("info.attention.title", "import.error.notJson");
        return null;
    }

    try {
        const fileContent = await file.text();
        const data = JSON.parse(fileContent);

        if (!Array.isArray(data) || data.some(p => typeof p.text !== 'string' || typeof p.imageUrl !== 'string')) {
            showInfoModal("info.attention.title", "import.error.invalidFormat");
            return null;
        }
        return data.map(p => ({ ...p, importId: `import_${Date.now()}_${Math.random()}` }));
    } catch (error) {
        console.error("Error parsing JSON file:", error);
        showInfoModal("info.attention.title", "import.error.parseError");
        return null;
    }
}

export async function handleImportFileSelect(file) {
    const importedData = await parseAndValidateFile(file);
    if (importedData) {
        setPromptsToImport(importedData);
        setSelectedImportIds([]);
        renderImportPreview();
        importModal.dropzone.classList.add('hidden');
        importModal.previewContainer.classList.remove('hidden');
        importModal.importBtn.disabled = true;
    }
}

function renderImportPreview() {
    importModal.previewList.innerHTML = '';
    const lang = languageSettings.ui;

    promptsToImport.forEach(p => {
        const isDuplicate = prompts.some(existing => existing.text === p.text && existing.imageUrl === p.imageUrl);

        const listItem = document.createElement('div');
        listItem.className = 'import-preview-item';
        if (isDuplicate) listItem.classList.add('disabled');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = p.importId;
        checkbox.dataset.id = p.importId;
        checkbox.disabled = isDuplicate;
        checkbox.addEventListener('change', () => toggleImportSelection(p.importId));

        const label = document.createElement('label');
        label.htmlFor = p.importId;
        label.className = 'import-item-label';

        const img = document.createElement('img');
        img.src = p.imageUrl;
        img.alt = 'Preview';
        img.className = 'import-item-img';
        label.appendChild(img);

        const text = document.createElement('span');
        text.className = 'import-item-text';
        text.textContent = p.text;
        label.appendChild(text);

        listItem.appendChild(checkbox);
        listItem.appendChild(label);

        if (isDuplicate) {
            const duplicateBadge = document.createElement('span');
            duplicateBadge.className = 'import-item-badge';
            duplicateBadge.textContent = i18nData["import.badge.duplicate"][lang] || "Duplicate";
            listItem.appendChild(duplicateBadge);
        }

        importModal.previewList.appendChild(listItem);
    });
    updateImportStorageIndicator();
}

function toggleImportSelection(importId) {
    const currentSelected = [...selectedImportIds];
    const index = currentSelected.indexOf(importId);
    if (index > -1) {
        currentSelected.splice(index, 1);
    } else {
        currentSelected.push(importId);
    }
    setSelectedImportIds(currentSelected);
    updateImportStorageIndicator();
    importModal.importBtn.disabled = currentSelected.length === 0;
}

export function updateImportStorageIndicator() {
    const lang = languageSettings.ui;
    try {
        const promptsData = JSON.stringify(prompts || []);
        const currentBytes = new Blob([promptsData]).size;
        const totalBytes = 5 * 1024 * 1024;
        let finalBytes = currentBytes;

        const promptsToActuallyImport = promptsToImport.filter(p => selectedImportIds.includes(p.importId));
        if (promptsToActuallyImport.length > 0) {
            const tempCombined = [...prompts, ...promptsToActuallyImport];
            finalBytes = new Blob([JSON.stringify(tempCombined)]).size;
        }

        const finalPercentage = (finalBytes / totalBytes) * 100;
        const isSizeChanging = promptsToActuallyImport.length > 0;

        let textToShow;
        if (isSizeChanging) {
            const format = i18nData["prompt.storage.preview"][lang] || "{current} &rarr; {after} / {total}";
            textToShow = format.replace("{current}", new Intl.NumberFormat().format(currentBytes))
                               .replace("{after}", new Intl.NumberFormat().format(finalBytes))
                               .replace("{total}", "5 MB");
        } else {
            const format = i18nData["prompt.storage.status"][lang] || "{current} / {total}";
            textToShow = format.replace("{current}", new Intl.NumberFormat().format(currentBytes))
                               .replace("{total}", "5 MB");
        }

        importModal.storageText.innerHTML = textToShow;
        importModal.storageBar.style.width = `${Math.min(finalPercentage, 100)}%`;
        importModal.storageBar.classList.remove('warning', 'danger');

        if (finalPercentage > 100) {
            importModal.storageBar.classList.add('danger');
            importModal.importBtn.disabled = true;
            const errorText = i18nData["import.error.noSpace"][lang] || "Not enough space";
            importModal.storageText.innerHTML += ` <span class="danger-text">(${errorText})</span>`;
        } else {
            if (finalPercentage > 95) importModal.storageBar.classList.add('danger');
            else if (finalPercentage > 80) importModal.storageBar.classList.add('warning');
            importModal.importBtn.disabled = selectedImportIds.length === 0;
        }

    } catch (e) {
        console.error("Failed to calculate import storage preview:", e);
        if (importModal.storageText) {
            importModal.storageText.textContent = i18nData["prompt.storage.error"][lang] || "Failed to load info";
        }
    }
}

export async function handleImportConfirm() {
    const promptsToActuallyImport = promptsToImport
        .filter(p => selectedImportIds.includes(p.importId))
        .map(({ text, imageUrl }) => ({ id: Date.now() + Math.random(), text, imageUrl }));

    if (promptsToActuallyImport.length === 0) return;

    const newPrompts = [...prompts, ...promptsToActuallyImport];
    const finalSize = new Blob([JSON.stringify(newPrompts)]).size;
    const totalBytes = 5 * 1024 * 1024;

    if (finalSize > totalBytes) {
        showInfoModal("info.attention.title", "import.error.noSpaceOnConfirm");
        return;
    }

    setPrompts(newPrompts);
    await saveSetting('prompts', prompts);
    renderPrompts();
    updateStorageIndicator();
    closeModal(importModal.overlay);
    showToast("import.success");
}


// --- Export Logic ---
export function toggleExportMode(forceState = null) {
    const newExportState = forceState !== null ? forceState : !isExportModeActive;

    if (isManageModeActive || isSearchModeActive) {
        setIsManageModeActive(false);
        setIsSearchModeActive(false);
        promptModal.content.classList.remove('manage-mode', 'search-mode');
        promptModal.manageContent.classList.add('hidden');
        promptModal.searchContent.classList.add('hidden');
    }

    setIsExportModeActive(newExportState);
    promptModal.content.classList.toggle('export-mode', newExportState);
    if (sortableInstance) sortableInstance.option('disabled', newExportState);

    if (newExportState) {
        closeAllHeaderMenus();
        setSelectedExportIds([]);
        promptModal.exportContent.classList.remove('hidden');
        promptModal.actionBar.classList.remove('hidden');
        updateExportModeUI();
    } else {
        promptModal.actionBar.classList.add('hidden');
        setTimeout(() => promptModal.exportContent.classList.add('hidden'), 300);
        setSelectedExportIds([]);
        promptModal.grid.querySelectorAll('.prompt-item.selected').forEach(item => item.classList.remove('selected'));
    }
    renderPrompts();
}

export function updateExportModeUI() {
    const lang = languageSettings.ui;
    const selectCountFormat = i18nData["prompt.selectCount"][lang] || "Select ({count})";
    promptModal.exportSelectCount.textContent = selectCountFormat.replace('{count}', selectedExportIds.length);

    promptModal.exportSelectAllBtn.textContent = (selectedExportIds.length === prompts.length && prompts.length > 0)
        ? (i18nData["prompt.deselectAll"][lang] || "Deselect All")
        : (i18nData["prompt.selectAll"][lang] || "Select All");

    promptModal.exportBtn.disabled = selectedExportIds.length === 0;
}

export function handleSelectAllForExport() {
    if (selectedExportIds.length === prompts.length) {
        setSelectedExportIds([]);
    } else {
        setSelectedExportIds(prompts.map(p => p.id));
    }
    renderPrompts();
    updateExportModeUI();
}

export function handleExportSelected() {
    const promptsToExport = prompts.filter(p => selectedExportIds.includes(p.id))
                                   .map(({ text, imageUrl }) => ({ text, imageUrl })); // Export without ID

    if (promptsToExport.length === 0) return;

    const jsonString = JSON.stringify(promptsToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const date = new Date();
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    a.href = url;
    a.download = `prompts_export_${dateString}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast("export.success");
    toggleExportMode(false);
}