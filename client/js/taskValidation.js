import { CONFIG, PRIORITIES } from "./constants.js";
import { isValidDateString } from "./dateUtils.js";

const VALID_PRIORITIES = Object.values(PRIORITIES);

export function isValidTaskText(value) {
    return (
        typeof value === "string"
        && value.trim() !== ""
        && value.length <= 120
    );
}

export function isValidPriority(value) {
    return VALID_PRIORITIES.includes(value);
}

export function isValidCompleted(value) {
    return typeof value === "boolean";
}

export function isValidCreatedAt(value) {
    return (
        typeof value === "string"
        && value.trim() !== ""
        && !Number.isNaN(Date.parse(value))
    );
}

export function isValidDueDate(value) {
    return (
        value === ""
        || value === null
        || (
            typeof value === "string"
            && isValidDateString(value)
        )
    );
}

export function normalizeTask(task) {
    return {
        id:
            typeof task.id === "string" && task.id.trim() !== ""
                ? task.id
                : crypto.randomUUID(),

        text:
            isValidTaskText(task.text)
                ? task.text.trim()
                : "",

        completed:
            isValidCompleted(task.completed)
                ? task.completed
                : false,

        priority:
            isValidPriority(task.priority)
                ? task.priority
                : CONFIG.DEFAULT_PRIORITY,

        createdAt:
            isValidCreatedAt(task.createdAt)
                ? task.createdAt
                : new Date().toISOString(),

        dueDate:
            isValidDueDate(task.dueDate)
                ? task.dueDate ?? ""
                : ""
    };
}