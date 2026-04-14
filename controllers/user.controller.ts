import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      omit: {
        password: true,
        emailVerificationOTP: true,
        resetPasswordOTP: true,
        emailVerificationOTPExpires: true,
        updatedAt: true,
        lastVerificationResend: true,
      },
    });

    if (!user) {
      const error = new Error("User not found");
      res.statusCode = 404;
      throw error;
    }

    const userData = {
      user: user,
    };

    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      omit: {
        password: true,
      },
    });

    const update = req.body;

    if (!user) {
      const error = new Error("User not found");
      res.statusCode = 404;
      throw error;
    }

    Object.assign(user, update);

    await prisma.user.update({
      where: { id: req.user.id },
      data: user,
    });

    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      const error = new Error("User not found");
      res.statusCode = 404;
      throw error;
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const forceDeleteUser = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      const error = new Error("User not found");
      res.statusCode = 404;
      throw error;
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
