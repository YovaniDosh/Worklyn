export function registerEvents(elements, handlers) {
    const bindings = [
        [elements.addTaskButton, "click", handlers.handleAddTask],
        [elements.taskInput, "keydown", handlers.handleEnterKey],
        [elements.taskList, "click", handlers.handleTaskActions],
        [elements.searchInput, "input", handlers.handleSearchInput],
        [elements.sortSelect, "change", handlers.changeSort],
        [elements.themeToggle, "click", handlers.handleThemeToggle],
        [elements.exportTasksButton, "click", handlers.handleExportTasks],
        [elements.importTasksButton, "click", handlers.openImportFilePicker],
        [elements.importTasksInput, "change", handlers.handleImportFile],
        [elements.cancelImportButton, "click", () => handlers.closeImportModal()],
        [elements.confirmImportButton, "click", handlers.confirmImportTasks],
        [elements.cancelDeleteButton, "click", handlers.closeDeleteModal],
        [elements.confirmDeleteButton, "click", handlers.confirmDeleteTask],
        [elements.editTaskForm, "submit", handlers.handleEditSubmit],
        [elements.cancelEditButton, "click", () => handlers.closeEditModal()]
    ];

    bindings.forEach(([element, eventName, handler]) => {
        element.addEventListener(eventName, handler);
    });

    elements.filterButtons.forEach(button => {
        button.addEventListener("click", handlers.changeFilter);
    });
}
