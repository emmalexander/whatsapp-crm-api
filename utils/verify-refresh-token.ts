// import UserToken from "../models/user-token.model.js";
// import jwt from "jsonwebtoken";
// import { REFRESH_TOKEN_PRIVATE_KEY } from "../config/env.js";

// const verifyRefreshToken = async (refreshToken: string) => {
//     const privateKey = REFRESH_TOKEN_PRIVATE_KEY || "refresh-token-secret";

//     const tokenRecord = await UserToken.findOne({ token: refreshToken });
//     if (!tokenRecord) {
//         throw new Error("Invalid refresh token");
//     }

//     const decoded = jwt.verify(refreshToken, privateKey) as jwt.JwtPayload & { userId: string };
//     if (!decoded || !decoded.userId) {
//         throw new Error("Invalid refresh token");
//     }

//     return decoded;
// };

// export default verifyRefreshToken;