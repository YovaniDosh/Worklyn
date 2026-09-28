import express from "express";

import {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/", getTasks);
router.post("/", createTask);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;