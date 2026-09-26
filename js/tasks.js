import { CONFIG } from "./constants.js";

export function createTask(
    text,
    priority = CONFIG.DEFAULT_PRIORITY,
    dueDate = ""
) {
    return {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
        priority,
        createdAt: new Date().toISOString(),
        dueDate
    };
}

export function addTask(tasks, task) {
    tasks.push(task);
}

export function deleteTask(tasks, id) {
    const index = findTaskIndex(tasks, id);

    if (index === -1) {
        return false;
    }

    tasks.splice(index, 1);

    return true;
}

export function toggleTask(tasks, id) {
    const task =
        tasks.find(task => task.id === id);

    if (!task) {
        return false;
    }

    task.completed = !task.completed;

    return true;
}

export function updateTaskText(
    tasks,
    id,
    newText
) {
    const task =
        tasks.find(task => task.id === id);

    if (!task) {
        return false;
    }

    task.text = newText.trim();

    return true;
}

export function findTaskIndex(tasks, id) {
    return tasks.findIndex(
        task => task.id === id
    );
}