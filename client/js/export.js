import { APP } from "./constants.js";

export function exportTasks(
    tasks,
    filename = "worklyn-tasks.json"
) {
    if (!Array.isArray(tasks)) {
        return false;
    }

    const exportData = {
        app: APP.NAME,
        exportedAt:
            new Date().toISOString(),
        taskCount:
            tasks.length,
        tasks
    };

    const jsonContent =
        JSON.stringify(
            exportData,
            null,
            2
        );

    const file =
        new Blob(
            [jsonContent],
            {
                type:
                    "application/json"
            }
        );

    const fileUrl =
        URL.createObjectURL(file);

    const downloadLink =
        document.createElement("a");

    downloadLink.href =
        fileUrl;

    downloadLink.download =
        filename;

    document.body.appendChild(
        downloadLink
    );

    downloadLink.click();
    
    setTimeout(() => {
    URL.revokeObjectURL(fileUrl);
    }, 0);

    downloadLink.remove();

    return true;
}
