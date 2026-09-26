import { MESSAGES } from "./constants.js";

function createLocalDate(dateString) {
    if (
        typeof dateString !== "string"
        ||
        !dateString
    ) {
        return null;
    }

    const parts =
        dateString
            .split("-")
            .map(Number);

    if (
        parts.length !== 3
        ||
        parts.some(Number.isNaN)
    ) {
        return null;
    }

    const [year, month, day] = parts;

    const date = new Date(
        year,
        month - 1,
        day
    );

    const isValidDate =
        date.getFullYear() === year
        &&
        date.getMonth() === month - 1
        &&
        date.getDate() === day;

    return isValidDate
        ? date
        : null;
}

export function isValidDateString(dateString) {
    return createLocalDate(dateString) !== null;
}

export function formatDate(dateString) {
    const date = createLocalDate(dateString);

    if (!date) {
        return MESSAGES.NO_DATE;
    }

    return new Intl.DateTimeFormat(
        "es",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    ).format(date);
}

export function isOverdue(task) {
    if (
        task.completed
        ||
        !task.dueDate
    ) {
        return false;
    }

    const dueDate =
        createLocalDate(task.dueDate);

    if (!dueDate) {
        return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return dueDate < today;
}
