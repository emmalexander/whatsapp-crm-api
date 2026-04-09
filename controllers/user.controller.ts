// import User from "../models/user.model.js";
// import TaskList from "../models/task-list.model.js";

// import type { Request, Response, NextFunction } from "express";

// export const getUsers = async (req: Request, res: Response, next: NextFunction)=> {
//     try {
//         const users = await User.find();

//         res.status(200).json({success: true, data: users});
//     } catch (error){
//         next(error);
//     }
// }

// export const getUser = async (req: any, res: Response, next: NextFunction)=> {
//     try {
//         const user = await User.findById(req.user._id,).select("-password -emailVerificationOTP -resetPasswordOTP -emailVerificationOTPExpires -updatedAt -lastVerificationResend -__v");

//         if(!user){
//             const error = new Error("User not found");
//             res.statusCode = 404;
//             throw error;
//         }

//         const userTaskLists = await TaskList.find({userId: user._id}).select("-__v").populate('tasks')??[];

//         const userData = {
//             user: user,
//             taskLists: userTaskLists,
//         };

//         res.status(200).json({success: true, data: userData});
//     } catch (error){
//         next(error);
//     }
// }

// export const updateUser = async (req: any, res: Response, next: NextFunction)=> {
//     try {
//         const user = await User.findById(req.user._id,).select("-password");

//         const update = req.body;

//         if(!user){
//             const error = new Error("User not found");
//             res.statusCode = 404;
//             throw error;
//         }

//         Object.assign(user, update);
//         await user.save();

//         res.status(200).json({success: true, message: "User updated successfully"});
//     } catch (error){
//         next(error);
//     }
// }

// export const deleteUser = async (req: any, res: Response, next: NextFunction)=> {
//     try {
//         const userId = req.user._id;

//         const user = await User.findByIdAndDelete(userId);

//         if(!user){
//             const error = new Error("User not found");
//             res.statusCode = 404;
//             throw error;
//         }

//         res.status(200).json({success: true, message: "User deleted successfully"});
//     } catch (error){
//         next(error);
//     }
// }