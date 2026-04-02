import aj from '../config/arcjet.js';

import type { Request, Response, NextFunction } from "express";

const arcjetMiddleware = async (req: any, res: Response, next: NextFunction)=>{
    try{
        const decision = await aj.protect(req, {requested: 1});

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) return res.status(429).json({error: 'Rate limit exceeded'});
            if(decision.reason.isBot()) return res.status(403).json({error: 'Bot detected'});

            return res.status(403).json({error: 'Access denied'});
        }

        next();
    } catch(error){
        console.log(`Arcjet Middleware Error: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;