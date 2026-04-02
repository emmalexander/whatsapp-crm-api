import { config } from "dotenv";

config({path: `.env.${ process.env.NODE_ENV || 'development' }.local`});

export const { 
    PORT, 
    NODE_ENV, 
    DB_URI,
    ARCJET_KEY, ARCJET_ENV,
    QSTASH_URL, QSTASH_TOKEN,
    SERVER_URL,
    EMAIL_PASSWORD,
    EMAIL
} = process.env;

export const ACCESS_TOKEN_PRIVATE_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY || "access-token-secret";
export const REFRESH_TOKEN_PRIVATE_KEY = process.env.REFRESH_TOKEN_PRIVATE_KEY || "refresh-token-secret";
export const ACCESS_EXPIRES_IN = process.env.ACCESS_EXPIRES_IN || "15m";
export const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || "30d";