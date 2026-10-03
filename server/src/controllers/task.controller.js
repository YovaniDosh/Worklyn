import Task from "../models/task.model.js";
import mongoose from "mongoose";

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching tasks"
        });
    }
};

export const createTask = async (req, res) => {
    try {
        const { title, description, priority, status, dueDate, category } =
            req.body;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const newTask = await Task.create({
            title,
            description,
            priority,
            status,
            dueDate,
            category
        });

        res.status(201).json({
            success: true,
            data: newTask
        });
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid task data",
            });
        }

        console.error("Error creating task:", error);

        return res.status(500).json({
            success: false,
            message: "Error creating task"
        });
    }
};

export const getTaskById = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({
            success: false,
            message: "Invalid task ID"
        });
    }

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error) {

        console.error("Error fetching task:", error);

        res.status(500).json({
            success: false,
            message: "Error fetching task"
        });

    }
};

export const updateTask = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({
            success: false,
            message: "Invalid task ID"
        })
    }

    try {
        const allowedFields = [
            "title",
            "description",
            "priority",
            "status",
            "dueDate",
            "category"
        ];

        const updates = Object.fromEntries(
            allowedFields
                .filter(field =>
                    Object.prototype.hasOwnProperty.call(req.body, field)
                )
                .map(field => [field, req.body[field]])
        );

         if(Object.keys(updates).length === 0){
            return res.status(400).json({
                success: false,
                message: "No valid fields to update"
            });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid task data"
            });
        }

        console.error("Error updating task:", error);

        return res.status(500).json({
            success: false,
            message: "Error updating task"
        })
    }
};

export const deleteTask = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({
            success: false,
            message: "Invalid task ID"
        })
    }

    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error) {

        console.error("Error deleting task:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting task"
        });

    }
};