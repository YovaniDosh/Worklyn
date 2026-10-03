import mongoose from "mongoose";

import {
    TASK_PRIORITIES,
    TASK_STATUSES,
    TASK_DEFAULTS
} from "../constants/task.constants.js";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 120
    },
    description: {
        type: String,
        trim: true,
        default: "",
        maxlength: 1000
    },
    priority: {
        type: String,
        enum: Object.values(TASK_PRIORITIES),
        default: TASK_DEFAULTS.PRIORITY
    },
    status: {
        type: String,
        enum: Object.values(TASK_STATUSES),
        default: TASK_DEFAULTS.STATUS
    },
    dueDate: {
        type: Date,
        default: null
    },
    category: {
        type: String,
        trim: true,
        default: TASK_DEFAULTS.CATEGORY,
        maxlength: 50
    }
},
{
    timestamps: true
}
);

const Task = mongoose.model("Task", taskSchema);

export default Task;