export const APP = {
    NAME: "Worklyn",
    VERSION: "0.11.0"
};

export const FILTERS = {
    ALL: "all",
    PENDING: "pending",
    COMPLETED: "completed"
};

export const PRIORITIES = {
    HIGH: "high",
    MEDIUM: "medium",
    LOW: "low"
};

export const PRIORITY_LABELS = {
    [PRIORITIES.HIGH]: "Alta",
    [PRIORITIES.MEDIUM]: "Media",
    [PRIORITIES.LOW]: "Baja"
};

export const SORT_OPTIONS = {
    DEFAULT: "default",
    NAME: "name",
    PRIORITY: "priority",
    DATE: "date"
};

export const MESSAGES = {
    EMPTY_TASK: "Debes escribir una tarea.",
    NO_TASKS: "No se encontraron tareas.",
    NO_DATE: "Sin fecha",
    TASK_UNAVAILABLE: "La tarea ya no está disponible.",
    NO_CHANGES: "No se realizaron cambios."
};

export const ICONS = {
    COMPLETE: "✔",
    RESTORE: "↩",
    EDIT: "✏️",
    DELETE: "🗑"
};

export const CONFIG = {
    DEFAULT_PRIORITY: PRIORITIES.MEDIUM,
    STORAGE_KEY: "worklyn-tasks",
    LEGACY_STORAGE_KEY: "taskflow-tasks"
};

export const THEME = {
    LIGHT: "light",
    DARK: "dark",
    STORAGE_KEY: "worklyn-theme",
    LEGACY_STORAGE_KEY: "taskflow-theme"
};
