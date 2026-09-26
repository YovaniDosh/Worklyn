import { isOverdue } from "./dateUtils.js";

const INITIAL_STATS = {
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
    highPriority: 0
};

export function calculateStats(tasks) {
    if (!Array.isArray(tasks)) {
        return { ...INITIAL_STATS };
    }

    return tasks.reduce(
        (stats, task) => {
            stats.total++;

            if (task.completed) {
                stats.completed++;
            } else {
                stats.pending++;
            }

            if (isOverdue(task)) {
                stats.overdue++;
            }

            if (task.priority === "high") {
                stats.highPriority++;
            }

            return stats;
        },
        { ...INITIAL_STATS }
    );
}