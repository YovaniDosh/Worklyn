import {
    ICONS,
    MESSAGES,
    PRIORITY_LABELS
} from "./constants.js";

import {
    formatDate,
    isOverdue
} from "./dateUtils.js";

function escapeHTML(value = "") {
    const characters = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };

    return String(value).replace(
        /[&<>"']/g,
        character => characters[character]
    );
}

export function getPriorityText(priority) {
    return (
        PRIORITY_LABELS[priority]
        ??
        PRIORITY_LABELS.medium
    );
}

export function createTaskHTML(task) {
    const safeId =
        escapeHTML(task.id);

    const safeText =
        escapeHTML(task.text);

    const safePriority =
        escapeHTML(task.priority);

    const priorityText =
        escapeHTML(
            getPriorityText(task.priority)
        );

    const dueDate =
        escapeHTML(
            formatDate(task.dueDate)
        );

    const completedClass =
        task.completed
            ? "completed"
            : "";

    const overdueClass =
        isOverdue(task)
            ? "overdue"
            : "";

    const completeLabel =
        task.completed
            ? `Restaurar tarea: ${safeText}`
            : `Completar tarea: ${safeText}`;

    const completeIcon =
        task.completed
            ? ICONS.RESTORE
            : ICONS.COMPLETE;

    return `
        <li class="task-item ${overdueClass}">
            <div class="task-content">
                <span
                    class="task-text ${completedClass}"
                    data-id="${safeId}"
                    tabindex="0"
                >
                    ${safeText}
                </span>

                <span class="priority ${safePriority}">
                    ${priorityText}
                </span>

                <div class="task-date">
                    ${dueDate}
                </div>
            </div>

            <div class="task-actions">
                <button
                    class="complete-button"
                    type="button"
                    data-id="${safeId}"
                    aria-label="${completeLabel}"
                >
                    ${completeIcon}
                </button>

                <button
                    class="edit-button"
                    type="button"
                    data-id="${safeId}"
                    aria-label="Editar tarea: ${safeText}"
                >
                    ${ICONS.EDIT}
                </button>

                <button
                    class="delete-button"
                    type="button"
                    data-id="${safeId}"
                    aria-label="Eliminar tarea: ${safeText}"
                >
                    ${ICONS.DELETE}
                </button>
            </div>
        </li>
    `;
}

export function renderTasks(
    taskList,
    tasks
) {
    if (!taskList) {
        return;
    }

    if (!tasks.length) {
        taskList.innerHTML = `
            <li class="empty-message">
                ${MESSAGES.NO_TASKS}
            </li>
        `;

        return;
    }

    taskList.innerHTML =
        tasks
            .map(createTaskHTML)
            .join("");
}

export function updateCounter(
    taskCounter,
    visibleTasks,
    totalTasks
) {
    if (!taskCounter) {
        return;
    }

    const taskWord =
        totalTasks === 1
            ? "tarea"
            : "tareas";

    taskCounter.textContent =
        visibleTasks === totalTasks
            ? `${totalTasks} ${taskWord}`
            : `Mostrando ${visibleTasks} de ${totalTasks} ${taskWord}`;
}

export function updateActiveFilter(
    filterButtons,
    currentFilter
) {
    filterButtons.forEach(button => {
        const isActive =
            button.dataset.filter
            ===
            currentFilter;

        button.classList.toggle(
            "active",
            isActive
        );

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );
    });
}

export function renderStats(
    container,
    stats
) {
    if (!container) {
        return;
    }

    const cards = [
        {
            label: "Total",
            value: stats.total
        },
        {
            label: "Pendientes",
            value: stats.pending
        },
        {
            label: "Completadas",
            value: stats.completed
        },
        {
            label: "Vencidas",
            value: stats.overdue
        },
        {
            label: "Alta prioridad",
            value: stats.highPriority
        }
    ];

    container.innerHTML = `
        <div class="stats-grid">
            ${cards
                .map(card => `
                    <article class="stat-card">
                        <span>${card.label}</span>
                        <strong>${card.value}</strong>
                    </article>
                `)
                .join("")}
        </div>
    `;
}