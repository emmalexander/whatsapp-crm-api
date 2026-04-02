import type {Request, Response, NextFunction } from "express";

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction): void => {
    try {
        let error: any = { ...err };
        error.message = err?.message;

        console.error(err);

        // Mongoose bad ObjectId
        if(err.name === 'CastError'){
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404;
        }

        // Mongoose duplicate key
        if(err?.code === 11000){
            const message = 'Duplicate field value entered';
            error = new Error(message) as any;
            error.statusCode = 400;
        }

        // Mongoose validation error
        if(err.name === 'ValidationError'){
            const messages = Object.values(err.errors as Record<string, { message?: string }>).map((val) => val?.message || String(val));
            error = new Error(messages.join(', '));
            error.statusCode = 400;
        }

        if(err?.name === "TypeError"){
            const message = 'Sorry an unexpected error occurred';
            error = new Error(message) as any;
            error.statusCode = 400;
        }
    
        res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server Error'});
    } catch(error){
        next(error);
    }
}

export default errorMiddleware;