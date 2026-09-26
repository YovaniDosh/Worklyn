import { CONFIG, PRIORITIES } from "./constants.js";

function normalizeTask(task) {
    return {
        id:
            typeof task.id === "string"
                ? task.id
                : crypto.randomUUID(),

        text:
            typeof task.text === "string"
                ? task.text.trim()
                : "",

        completed:
            typeof task.completed === "boolean"
                ? task.completed
                : false,

        priority:
            Object.values(PRIORITIES).includes(task.priority)
                ? task.priority
                : CONFIG.DEFAULT_PRIORITY,

        createdAt:
            typeof task.createdAt === "string"
                ? task.createdAt
                : new Date().toISOString(),

        dueDate:
            typeof task.dueDate === "string"
                ? task.dueDate
                : ""
    };
}

export function saveTasks(tasks) {
    if (!Array.isArray(tasks)) {
        return false;
    }

    try {
        localStorage.setItem(
            CONFIG.STORAGE_KEY,
            JSON.stringify(tasks)
        );

        return true;
    } catch (error) {
        console.error(
            "Error al guardar las tareas:",
            error
        );

        return false;
    }
}

export function loadTasks() {
    try {
        const storedTasks =
            localStorage.getItem(CONFIG.STORAGE_KEY)
            ?? localStorage.getItem(CONFIG.LEGACY_STORAGE_KEY);

        if (!storedTasks) {
            return [];
        }

        const parsedTasks =
            JSON.parse(storedTasks);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        return parsedTasks
            .filter(
                task =>
                    task
                    &&
                    typeof task === "object"
            )
            .map(normalizeTask)
            .filter(task => task.text);
    } catch (error) {
        console.error(
            "Error al cargar las tareas:",
            error
        );

        return [];
    }
}
