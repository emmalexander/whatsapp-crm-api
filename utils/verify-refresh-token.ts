import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_PRIVATE_KEY } from "../config/env.js";
import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

const verifyRefreshToken = async (refreshToken: string) => {
  const privateKey = REFRESH_TOKEN_PRIVATE_KEY || "refresh-token-secret";

  // BCrypt Compare here
  //const isRefreshTokenValid = bcrypt.compareSync(refreshToken, user.password);
  const tokenRecord = await prisma.userToken.findFirst({
    where: {
      token: refreshToken,
    },
  });
  if (!tokenRecord) {
    throw new Error("Invalid refresh token");
  }

  const decoded = jwt.verify(refreshToken, privateKey) as jwt.JwtPayload & {
    userId: string;
  };
  if (!decoded || !decoded.userId) {
    throw new Error("Invalid refresh token");
  }

  return decoded;
};

export default verifyRefreshToken;
