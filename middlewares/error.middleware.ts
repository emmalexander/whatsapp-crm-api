import type { Request, Response, NextFunction } from "express";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    let error: any = { ...err };
    error.message = err?.message;

    //console.error(`Error: NAME: ${err.name}`);
    console.error(err);

    if (err?.name === "TypeError") {
      const message = "Sorry an unexpected error occurred";
      error = new Error(message) as any;
      error.statusCode = 400;
    }

    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message || "Server Error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
