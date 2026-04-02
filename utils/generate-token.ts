import jwt from "jsonwebtoken";
import UserToken from "../models/user-token.model.js";
import { ACCESS_TOKEN_PRIVATE_KEY, REFRESH_TOKEN_PRIVATE_KEY, ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN } from "../config/env.js";

const generateTokens = async (user: { _id: string | import('mongoose').Types.ObjectId }) => {
    try {
        const payload = { userId: user._id?.toString() };

        const accessTokenSecret = ACCESS_TOKEN_PRIVATE_KEY || "access-token-secret";
        const refreshTokenSecret = REFRESH_TOKEN_PRIVATE_KEY || "refresh-token-secret";

        const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: ACCESS_EXPIRES_IN as any });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: REFRESH_EXPIRES_IN as any });

        // Ensure only one active refresh token per user (token rotation)
        const existingToken = await UserToken.findOne({ userId: user._id });
        if (existingToken) {
            await existingToken.deleteOne();
        }

        await new UserToken({ userId: user._id, token: refreshToken }).save();

        return { accessToken, refreshToken };
    } catch (err) {
        throw err;
    }
};

export default generateTokens;