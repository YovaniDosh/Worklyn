import {
    isValidTaskText,
    isValidPriority,
    isValidCompleted,
    isValidCreatedAt,
    isValidDueDate
} from "./taskValidation.js";

function isValidTask(task){

    if( !task || typeof task !== "object" || Array.isArray(task) )
    {
        return false;
    }

    return (
        typeof task.id === "string"
        && task.id.trim() !== ""
        && isValidTaskText(task.text)
        && isValidCompleted(task.completed)
        && isValidPriority(task.priority)
        && isValidCreatedAt(task.createdAt)
        && isValidDueDate(task.dueDate)
    );
}

function hasUniqueIds(tasks){
    const taskIds = tasks.map(task => task.id);
    return (
        new Set(taskIds).size === taskIds.length
    )
}

export function validateImportData(data)
{
    if( !data || typeof data !== "object" || Array.isArray(data))
    {
        return {
            valid: false,
            error:  "El archivo no contiene un respaldo válido"
        };
    }

    if (!Array.isArray(data.tasks)) {
        return {
            valid: false,
            error: "El archivo no contiene una lista de tareas."
        };
    }

    if(
        data.taskCount !== undefined
        && data.taskCount !== data.tasks.length
    )
    {
        return {
            valid: false,
            error: "La cantidad de tareas del archivo no coincide."
        };
    }

    if(!data.tasks.every(isValidTask)){
        return {
            valid: false,
            error: "Una o más tareas contienen datos inválidos."
        };
    }

    if(!hasUniqueIds(data.tasks)){
        return {
            valid: false,
            error: "El archivo contiene identificadores duplicados."
        };
    }

    return {
        valid: true,
        tasks: data.tasks
    }
}

export async function readTasksFile(file)
{
    if(!(file instanceof File))
    {
        throw new Error(
            "No se seleccionó un archivo válido"
        );
    }

    if(
        file.type
        && file.type !== "application/json"
    ){
        throw new Error(
            "Selecciona un archivo en formato JSON"
        );
    }

    const fileContent = 
        await file.text();
    
    let data;

    try {
        data = JSON.parse(fileContent);
    } catch {
        throw new Error(
            "El archivo JSON no se puede interpretar"
        );
    }

    const validation = validateImportData(data);
    if (!validation.valid){
        throw new Error(
            validation.error
        );
    }

    return validation.tasks;
}
