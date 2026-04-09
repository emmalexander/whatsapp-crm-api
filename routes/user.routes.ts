// import { Router } from "express";
// import { getUser, getUsers, updateUser} from "../controllers/user.controller.js";
// import authorize from "../middlewares/auth.middleware.js";

// const userRoute = Router();

// // Path: api/v1/users/ (GET)
// //userRoute.get('/', getUsers);

// // Path: api/v1/users/ (GET)
// userRoute.get('/', authorize, getUser);

// userRoute.post('/', (req, res)=> res.send({title : 'CREATE new user'}));

// userRoute.put('/', authorize, updateUser);

// userRoute.delete('/', (req, res)=> res.send({title : 'DELETE a user'}));

// export default userRoute;