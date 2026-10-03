import { CONFIG } from "./constants.js";
import { normalizeTask } from "./taskValidation.js";

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
