import {
    FILTERS,
    PRIORITIES,
    SORT_OPTIONS
} from "./constants.js";

const PRIORITY_ORDER = {
    [PRIORITIES.HIGH]: 1,
    [PRIORITIES.MEDIUM]: 2,
    [PRIORITIES.LOW]: 3
};

function normalizeText(text = "") {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export function filterTasks(
    tasks,
    searchText,
    currentFilter
) {
    const normalizedSearch =
        normalizeText(searchText.trim());

    return tasks.filter(task => {
        const matchesSearch =
            normalizeText(task.text)
                .includes(normalizedSearch);

        const matchesFilter =
            currentFilter === FILTERS.ALL
            ||
            (
                currentFilter === FILTERS.PENDING
                &&
                !task.completed
            )
            ||
            (
                currentFilter === FILTERS.COMPLETED
                &&
                task.completed
            );

        return matchesSearch && matchesFilter;
    });
}

function sortByName(firstTask, secondTask) {
    return firstTask.text.localeCompare(
        secondTask.text,
        "es",
        { sensitivity: "base" }
    );
}

function sortByPriority(firstTask, secondTask) {
    return (
        PRIORITY_ORDER[firstTask.priority]
        -
        PRIORITY_ORDER[secondTask.priority]
    );
}

function sortByDate(firstTask, secondTask) {
    if (!firstTask.dueDate && !secondTask.dueDate) {
        return 0;
    }

    if (!firstTask.dueDate) {
        return 1;
    }

    if (!secondTask.dueDate) {
        return -1;
    }

    return firstTask.dueDate.localeCompare(
        secondTask.dueDate
    );
}

export function sortTasks(tasks, sortOption) {
    const sortedTasks = [...tasks];

    switch (sortOption) {
        case SORT_OPTIONS.NAME:
            return sortedTasks.sort(sortByName);

        case SORT_OPTIONS.PRIORITY:
            return sortedTasks.sort(sortByPriority);

        case SORT_OPTIONS.DATE:
            return sortedTasks.sort(sortByDate);

        default:
            return sortedTasks;
    }
}
