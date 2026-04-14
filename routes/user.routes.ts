import { Router } from "express";
import {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRoute = Router();

// Path: api/v1/users/ (GET)
userRoute.get("/all", getUsers);

// Path: api/v1/users/ (GET)
userRoute.get("/", authorize, getUser);

userRoute.put("/", authorize, updateUser);

userRoute.delete("/", authorize, deleteUser);

export default userRoute;
