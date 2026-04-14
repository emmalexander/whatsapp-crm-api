import express from "express";
import cors from "cors";

import { PORT } from "../config/env.js";

import cookieParser from "cookie-parser";
import { connectDB, disconnectDB } from "../config/db.js";

import authRouter from "../routes/auth.routes.js";
import userRouter from "../routes/user.routes.js";
// import tasksRouter from "../routes/task.routes.js";
// import connectToDatabase from "../database/mongodb.js";
import errorMiddleware from "../middlewares/error.middleware.js";
// import arcjetMiddleware from "../middlewares/arcjet.middleware.js";

// import workflowRouter from "./routes/workflow.routes.js";

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
// app.use('/api/v1/tasks', tasksRouter);
// app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to Whatsapp CRM API");
});

const server = app.listen(Number(PORT), async () => {
  console.log(`Whatsapp CRM API is running on http://localhost:${PORT}`);
  //await connectToDatabase();
});

// Handle unhandled promise rejections  (e.g database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", (err) => {
  console.log("SIGTERM Received, Shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

export default app;
