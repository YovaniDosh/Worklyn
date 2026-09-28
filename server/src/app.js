import "dotenv/config";
import express from "express";

import { connectDB } from "./config/db.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Worklyn API is running"
    });
});

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Worklyn API running on http://localhost:${PORT}`);
    });
};

startServer();