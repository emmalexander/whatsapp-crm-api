import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_PRIVATE_KEY } from "../config/env.js";

import User from '../models/user.model.js';

import type { Request, Response, NextFunction } from "express";


const authorize = async (req: any, res: Response, next: NextFunction)=>{
    try {
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) return res.status(401).json({message: 'Unauthorized'});

        const accessSecret = ACCESS_TOKEN_PRIVATE_KEY || 'access-token-secret';

        const decoded = jwt.verify(token, accessSecret) as jwt.JwtPayload & { userId: string };

        const user = await User.findById(decoded.userId);

        if(!user) return res.status(401).json({message: 'Unathorized'});

        req.user = user;
        next();
    }catch(error: Error | any){
        res.status(401).json({message: "Unauthorized", error: error.message});
    }
}

export default authorize;