import express from "express";
import cors from "cors";

import { PORT } from "../config/env.js";
//import { createRequire } from 'module';
import cookieParser from "cookie-parser";
//const require = createRequire(import.meta.url);
//const { cookieParser } = require('cookie-parser');

import authRouter from "../routes/auth.routes.js";
import userRouter from "../routes/user.routes.js";
import tasksRouter from "../routes/task.routes.js";
import connectToDatabase from "../database/mongodb.js";
import errorMiddleware from "../middlewares/error.middleware.js";
import arcjetMiddleware from "../middlewares/arcjet.middleware.js";


// import workflowRouter from "./routes/workflow.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', tasksRouter);
// app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);


app.get("/", (req, res)=>{
    res.send('Welcome to Task Manager API');
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(Number(PORT), "0.0.0.0", async ()=>{
        console.log(`Task Manager APP is running on http://localhost:${PORT}`);
        await connectToDatabase();
    });
}

export default app;