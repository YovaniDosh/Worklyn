// Punto de entrada de la aplicación

import { saveTasks, loadTasks } from "./storage.js";
import { CONFIG,FILTERS, MESSAGES,SORT_OPTIONS } from "./constants.js";
import { renderTasks, updateCounter, updateActiveFilter,renderStats } from "./ui.js";
import { filterTasks, sortTasks } from "./filters.js";
import { createTask, addTask, deleteTask, toggleTask, updateTaskText, findTaskIndex } from "./tasks.js";
import { applyTheme, loadTheme, saveTheme, toggleTheme} from "./theme.js";
import { calculateStats } from "./stats.js";
import { showToast } from "./toast.js";
import { registerEvents } from "./events.js";
import { debounce } from "./debounce.js";
import { exportTasks } from "./export.js";
import { readTasksFile } from "./import.js";

// ===============================
// REFERENCIAS DEL DOM
// ===============================

const filterButtons =             document.querySelectorAll(".filter-button");
const taskInput =                 document.getElementById("taskInput");
const prioritySelect =            document.getElementById("prioritySelect");
const dateInput =                 document.getElementById("dateInput");
const addTaskButton =             document.getElementById("addTaskButton");
const searchInput =               document.getElementById("searchInput");
const taskList =                  document.getElementById("taskList");
const taskCounter =               document.getElementById("taskCounter");
const statsContainer =            document.getElementById("statsContainer");
const themeToggle =               document.getElementById("themeToggle");
const sortSelect =                document.getElementById("sortSelect");
const deleteModal =               document.getElementById("deleteModal");
const deleteModalMessage =        document.getElementById("deleteModalMessage");
const cancelDeleteButton =        document.getElementById("cancelDeleteButton");
const confirmDeleteButton =       document.getElementById("confirmDeleteButton");
const toastContainer =            document.getElementById("toastContainer");
const editModal =                 document.getElementById("editModal");
const editTaskForm =              document.getElementById("editTaskForm");
const editTaskInput =             document.getElementById("editTaskInput");
const cancelEditButton =          document.getElementById("cancelEditButton");
const saveEditButton =            document.getElementById("saveEditButton");
const exportTasksButton =         document.getElementById("exportTasksButton");
const importTasksInput =          document.getElementById("importTasksInput");
const importTasksButton =         document.getElementById("importTasksButton");
const importModal =               document.getElementById("importModal");
const importModalDescription =    document.getElementById("importModalDescription");
const cancelImportButton =        document.getElementById("cancelImportButton");
const confirmImportButton =       document.getElementById("confirmImportButton");


// ===============================
// ESTADO DE LA APLICACIÓN
// ===============================

let tasks = loadTasks();
let currentFilter = FILTERS.ALL;
let currentSort = SORT_OPTIONS.DEFAULT;
let currentTheme = loadTheme();
let taskIdToDelete = null;
let taskIdToEdit = null;
let editTriggerElement = null;
let deleteTriggerButton = null;
let pendingImportedTasks = null;
let importTriggerElement = null;

const handleSearchInput =
    debounce(
        refreshTaskView,
        300
    );

// ===============================
// INICIALIZACIÓN
// ===============================

init();

function init() {
    registerEvents(
        {
            addTaskButton,
            taskInput,
            taskList,
            searchInput,
            filterButtons,
            sortSelect,
            themeToggle,
            exportTasksButton,
            importTasksInput,
            importTasksButton,
            importModal,
            cancelImportButton,
            confirmImportButton,
            cancelDeleteButton,
            confirmDeleteButton,
            deleteModal,
            editTaskForm,
            cancelEditButton,
            editModal
        },
        {
            handleAddTask,
            handleEnterKey,
            handleTaskActions,
            handleSearchInput,
            changeFilter,
            changeSort,
            handleThemeToggle,
            handleExportTasks,
            openImportFilePicker,
            handleImportFile,
            confirmImportTasks,
            closeImportModal,
            handleImportModalClick,
            closeDeleteModal,
            confirmDeleteTask,
            handleDeleteModalClick,
            handleEditModalClick,
            handleModalKeydown,
            handleEditSubmit,
            closeEditModal
        }
    );

    applyTheme(
        currentTheme,
        themeToggle
    );

    updateActiveFilter(
        filterButtons,
        currentFilter
    );

    refreshUI();
}
// ===============================
// ACTUALIZAR INTERFAZ
// ===============================

function refreshTaskView() {
    const filteredTasks = filterTasks(
        tasks,
        searchInput.value,
        currentFilter
    );

    const sortedTasks = sortTasks(
        filteredTasks,
        currentSort
    );

    renderTasks(
        taskList,
        sortedTasks
    );

    updateCounter(
        taskCounter,
        sortedTasks.length,
        tasks.length
    );
}

function refreshStats() {
    renderStats(
        statsContainer,
        calculateStats(tasks)
    );
}

function refreshUI() {
    refreshTaskView();
    refreshStats();
}
// ===============================
// FUNCIONES
// ===============================


function handleAddTask() {

    const taskText = taskInput.value.trim();

    if (!taskText) {

        notify(
            MESSAGES.EMPTY_TASK,
            "error"
        );

        taskInput.focus();

        return;

    }

    const task = createTask(

        taskText,

        prioritySelect.value,

        dateInput.value

    );

    addTask(tasks, task);

    persistAndRefresh();

    notify(
        "Tarea creada correctamente."
    );

    clearInput();

}

function getOpenModal()
{
    if(
        deleteModal.classList.contains(
            "open"
        )
    ) {
        return deleteModal;
    }

    if(
        editModal.classList.contains(
            "open"
        )
    ) {
        return editModal;
    }
    
    if (
    importModal.classList.contains("open"))
    {
        return importModal;
    }

        return null;
    }

function trapModalFocus(
    event,
    modal
)
{
    const focusableElements = modal.querySelectorAll(
        [
            "button:not([disabled])",
            "input:not([disabled])",
            "select:not([disabled])",
            "textarea:not([disabled])",
            "a[href]",
            "[tabindex]:not([tabindex='-1'])"
        ].join(",")
    );

    if(!focusableElements.length)
    {
        return;
    }

    const firstElement =
        focusableElements[0];

    const lastElement =
        focusableElements[
            focusableElements.length - 1
        ];

    if (
        event.shiftKey
        &&
        document.activeElement
        ===
        firstElement
    ) {
        event.preventDefault();

        lastElement.focus();

        return;
    }

    if (
        !event.shiftKey
        &&
        document.activeElement
        ===
        lastElement
    ) {
        event.preventDefault();

        firstElement.focus();
    }

}

function handleEnterKey(event){

    if(event.key === "Enter"){

        event.preventDefault();

        handleAddTask();

    }

}

function handleTaskActions(event) {

    const button =
        event.target.closest(
            "button[data-id]"
        );

    if (!button) {
        return;
    }

    const id =
        button.dataset.id;

    const index =
        findTaskIndex(tasks, id);

    if (index === -1) {
        return;
    }

    if (
        button.classList.contains(
            "complete-button"
        )
    ) {

        handleToggleTask(id);

        return;
    }

    if (
        button.classList.contains(
            "edit-button"
        )
    ) {

        openEditModal(
            id,
            button
        );

        return;
    }

    if (
        button.classList.contains(
            "delete-button"
        )
    ) {

        handleDeleteTask(
            id,
            button
        );
    }

}

function handleToggleTask(id)
{
    const index = findTaskIndex(tasks, id);

    if(index === -1)
    {
        return;
    }
    const wasCompleted = tasks[index].completed;
    const taskText = tasks[index].text;

    toggleTask(tasks, id);

    persistAndRefresh();

    notify(
        wasCompleted
            ? `Tarea "${taskText}" restaurada.`
            : `Tarea "${taskText}" completada.`
    );
}

function handleDeleteTask(
    id,
    triggerButton
)
{
    const index = findTaskIndex(tasks, id);

    if(index === -1)
    {
        return;
    }

    taskIdToDelete = id;

    deleteTriggerButton =
        triggerButton;

    deleteModalMessage.textContent =
        `¿Deseas eliminar la tarea "${tasks[index].text}"?`;

    openDeleteModal();
}

function openDeleteModal() {

    deleteModal.classList.add(
        "open"
    );

    deleteModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

    confirmDeleteButton.focus();

}

function closeDeleteModal(
    restoreFocus = true
) {

    deleteModal.classList.remove(
        "open"
    );

    deleteModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

    if (
        restoreFocus
        &&
        deleteTriggerButton?.isConnected
    ) {
        deleteTriggerButton.focus();
    }

    taskIdToDelete = null;
    deleteTriggerButton = null;
}

function confirmDeleteTask() {

    if (!taskIdToDelete) {

        return;

    }

    const idToDelete =
        taskIdToDelete;

    const index =
        findTaskIndex(
            tasks,
            idToDelete
        );

    if (index === -1) {

        closeDeleteModal(false);

        return;

    }

    const deletedTaskText =
        tasks[index].text;

    confirmDeleteButton.disabled =
        true;

    deleteTask(
        tasks,
        idToDelete
    );

    closeDeleteModal(false);

    persistAndRefresh();

    confirmDeleteButton.disabled =
        false;

    notify(
        `Tarea "${deletedTaskText}" eliminada.`,
        "info"
    );

    taskInput.focus();

}

function handleDeleteModalClick(event)
{
    if(
        event.target.hasAttribute(
            "data-close-modal"
        )
    ){
        closeDeleteModal();
    }
}

function handleEditModalClick(event)
{
    if(
        event.target.hasAttribute(
            "data-close-edit-modal"
        )
    ) {
        closeEditModal();
    }
}

function handleModalKeydown(event) {
    const openModal =
        getOpenModal();

    if (!openModal) {
        return;
    }

    if (event.key === "Escape") {
        event.preventDefault();

    if (openModal === deleteModal) {
        closeDeleteModal();
    } else if (openModal === editModal) {
        closeEditModal();
    } else {
        closeImportModal();
    }

        return;
    }

    if (event.key === "Tab") {
        trapModalFocus(
            event,
            openModal
        );
    }
}

function closeEditModal(
    restoreFocus = true
) {

    editModal.classList.remove(
        "open"
    );

    editModal.hidden = true;

    editModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

    editTaskForm.reset();

    taskIdToEdit = null;

    if (
        restoreFocus
        &&
        editTriggerElement?.isConnected
    ) {
        editTriggerElement.focus();
    }

    editTriggerElement = null;

}

function openEditModal(
    id,
    triggerElement
) {

    const index =
        findTaskIndex(tasks, id);

    if (index === -1) {
        return;
    }

    taskIdToEdit = id;
    editTriggerElement = triggerElement;

    editTaskInput.value =
        tasks[index].text;

    editModal.hidden = false;

    editModal.setAttribute(
        "aria-hidden",
        "false"
    );

    editModal.classList.add(
        "open"
    );

    document.body.classList.add(
        "modal-open"
    );

    requestAnimationFrame(() => {

        editTaskInput.focus();
        editTaskInput.select();

    });

}

function clearInput() {

    taskInput.value = "";

    dateInput.value = "";

    prioritySelect.value = CONFIG.DEFAULT_PRIORITY;
    
    taskInput.focus();

}

function changeFilter(event){

    currentFilter = event.currentTarget.dataset.filter;

    updateActiveFilter(
        filterButtons,
        currentFilter
    );

    refreshTaskView();
}

function changeSort(event)
{
    currentSort = event.target.value;
    refreshTaskView();
}

function handleThemeToggle() {

    currentTheme =
        toggleTheme(currentTheme);

    applyTheme(
        currentTheme,
        themeToggle
    );

    saveTheme(currentTheme);

}

function persistAndRefresh() {

    saveTasks(tasks);

    refreshUI();
}

function notify(
    message,
    type = "success"
) {

    showToast(
        toastContainer,
        message,
        type
    );

}

function handleEditSubmit(event) {

    event.preventDefault();

    if (!taskIdToEdit) {

        return;

    }

    const index =
        findTaskIndex(
            tasks,
            taskIdToEdit
        );

    if (index === -1) {

        closeEditModal(false);

        notify(
            MESSAGES.TASK_UNAVAILABLE,
            "error"
        );

        return;

    }

    const normalizedText =
        editTaskInput.value.trim();

    if (!normalizedText) {

        notify(
            MESSAGES.EMPTY_TASK,
            "error"
        );

        editTaskInput.focus();

        return;

    }

    const previousText =
        tasks[index].text;

    if (
        normalizedText
        ===
        previousText
    ) {

        notify(
            MESSAGES.NO_CHANGES,
            "info"
        );

        editTaskInput.focus();

        return;

    }

    saveEditButton.disabled = true;

    updateTaskText(
        tasks,
        taskIdToEdit,
        normalizedText
    );

    closeEditModal(false);

    persistAndRefresh();

    saveEditButton.disabled = false;

    notify(
        `Tarea "${previousText}" actualizada correctamente.`
    );

    taskInput.focus();

}

function handleExportTasks() {
    const exported =
        exportTasks(tasks);

    if (!exported) {
        notify(
            "No fue posible exportar las tareas.",
            "error"
        );

        return;
    }

    notify(
        `${tasks.length} tareas exportadas correctamente.`
    );
}

function openImportFilePicker() {
    importTasksInput.value = "";
    importTasksInput.click();
}

async function handleImportFile(event) {
    const [file] =
        event.target.files;

    if (!file) {
        return;
    }

    try {
        pendingImportedTasks =
            await readTasksFile(file);

        importTriggerElement =
            importTasksButton;

        importModalDescription.textContent =
            pendingImportedTasks.length === 1
                ? "Se encontró 1 tarea. La importación reemplazará las tareas actuales."
                : `Se encontraron ${pendingImportedTasks.length} tareas. La importación reemplazará las tareas actuales.`;

        openImportModal();
    } catch (error) {
        pendingImportedTasks = null;

        notify(
            error.message
                || "No fue posible importar el archivo.",
            "error"
        );
    } finally {
        importTasksInput.value = "";
    }
}

function openImportModal() {
    importModal.hidden = false;

    importModal.setAttribute(
        "aria-hidden",
        "false"
    );

    importModal.classList.add(
        "open"
    );

    document.body.classList.add(
        "modal-open"
    );

    confirmImportButton.focus();
}

function closeImportModal(
    restoreFocus = true
) {
    importModal.classList.remove(
        "open"
    );

    importModal.hidden = true;

    importModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

    if (
        restoreFocus
        && importTriggerElement?.isConnected
    ) {
        importTriggerElement.focus();
    }

    pendingImportedTasks = null;
    importTriggerElement = null;
}

function confirmImportTasks() {
    if (!pendingImportedTasks) {
        return;
    }

    const importedTasks =
        pendingImportedTasks;

    confirmImportButton.disabled = true;

    const saved =
        saveTasks(importedTasks);

    if (!saved) {
        confirmImportButton.disabled = false;

        notify(
            "No fue posible guardar las tareas importadas.",
            "error"
        );

        return;
    }

    tasks = importedTasks;

    closeImportModal(false);

    confirmImportButton.disabled = false;

    refreshUI();

    notify(
        tasks.length === 1
            ? "1 tarea importada correctamente."
            : `${tasks.length} tareas importadas correctamente.`
    );

    taskInput.focus();
}

function handleImportModalClick(event) {
    if (
        event.target.hasAttribute(
            "data-close-import-modal"
        )
    ) {
        closeImportModal();
    }
}
