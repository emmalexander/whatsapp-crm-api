// import { Router } from "express";
// import authorize from "../middlewares/auth.middleware.js";
// import { createTask, 
//     createTaskList, 
//     getUserTaskLists, 
//     updateATaskList, 
//     updateATask, 
//     deleteTask, 
//     deleteTaskList, 
//     getUserTasksByStatus, 
//     getUserTasks, 
//     addTaskToFavorite, 
//     removeTaskFromFavorite, 
//     getPendingTasks, 
//     getInProgressTasks, 
//     getCompletedTasks, 
//     updateATaskStatus,
//     searchTasks
// } from "../controllers/task.controller.js";

// const taskRouter = Router();

// // /api/v1/tasks/

// // MARK: Tasks

// taskRouter.post('/', authorize, createTask);

// taskRouter.get('/status/:status', authorize, getUserTasksByStatus);

// taskRouter.get('/search', authorize, searchTasks);

// taskRouter.post('/favorites/add/:id', authorize, addTaskToFavorite);

// taskRouter.post('/favorites/remove/:id', authorize, removeTaskFromFavorite);

// taskRouter.get('/pending', authorize, getPendingTasks);

// taskRouter.get('/in-progress', authorize, getInProgressTasks);

// taskRouter.get('/completed', authorize, getCompletedTasks);

// taskRouter.get('/', authorize, getUserTasks);

// taskRouter.put('/:id', authorize, updateATask);

// taskRouter.patch('/status/:id', authorize, updateATaskStatus);

// taskRouter.delete('/:id', authorize, deleteTask);

// // MARK: TaskLists

// taskRouter.post('/lists', authorize, createTaskList);

// taskRouter.get('/lists', authorize, getUserTaskLists);

// taskRouter.put('/lists/:id', authorize, updateATaskList);

// taskRouter.delete('/lists/:id', authorize, deleteTaskList);

// export default taskRouter;