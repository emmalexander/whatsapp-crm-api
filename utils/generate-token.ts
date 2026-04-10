import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PRIVATE_KEY,
  ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
} from "../config/env.js";
import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

const generateTokens = async (id: string) => {
  try {
    const payload = { userId: id };

    const accessTokenSecret = ACCESS_TOKEN_PRIVATE_KEY || "access-token-secret";
    const refreshTokenSecret =
      REFRESH_TOKEN_PRIVATE_KEY || "refresh-token-secret";

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: ACCESS_EXPIRES_IN as any,
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: REFRESH_EXPIRES_IN as any,
    });

    // Ensure only one active refresh token per user (token rotation)
    const existingToken = await prisma.userToken.findUnique({
      where: {
        userId: id,
      },
    });
    if (existingToken) {
      await prisma.userToken.delete({ where: { id: existingToken.id } });
    }

    // Hash Token before adding to database
    // const salt = bcrypt.genSaltSync(10);
    // const hashedToken = bcrypt.hashSync(refreshToken, salt);

    await prisma.userToken.create({
      data: {
        userId: id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 30),
      },
    });

    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};

export default generateTokens;
