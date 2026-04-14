import bcrypt from "bcryptjs";

import type { Request, Response, NextFunction } from "express";

import transporter, { accountEmail } from "../config/nodemailer.js";
import { emailTemplates } from "../utils/email-template.js";
import generateTokens from "../utils/generate-token.js";
import verifyRefreshToken from "../utils/verify-refresh-token.js";
import { prisma } from "../config/db.js";

const create6DigitOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const OTP_LIFETIME_MINUTES = 10;

const sendEmail = async (to: string, subject: string, html: string) => {
  if (!to) throw new Error("Recipient email is required");

  if (process.env.NODE_ENV === "test") {
    console.log(`[TEST] Email send skipped to ${to} subject ${subject}`);
    return;
  }

  const mailOptions = {
    from: accountEmail,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

//MARK: Send OTP Email
const sendOTPEmail = async (
  to: string,
  userName: string,
  otp: string,
  type: "verification" | "reset",
) => {
  const template = emailTemplates.find((t: any) =>
    t.label.includes(`${type} otp`),
  );
  if (!template) throw new Error(`OTP template for ${type} not found`);

  const mailInfo = {
    userName,
    otp,
    expiryMinutes: OTP_LIFETIME_MINUTES,
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  await sendEmail(to, subject, message);
};

// MARK: Sign Up
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firstName, middleName, lastName, phoneNumber, email, password } =
      req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      const error: any = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const otp = create6DigitOTP();
    const otpExpires = new Date(Date.now() + OTP_LIFETIME_MINUTES * 60 * 1000);

    // Create a new User
    const newUser = await prisma.user.create({
      data: {
        firstName,
        middleName,
        lastName,
        phoneNumber,
        email,
        password: hashPassword,
        isEmailVerified: false,
        emailVerificationOTP: otp,
        emailVerificationOTPExpires: otpExpires,
      },
    });

    const createdUserId = newUser.id;

    const newUserWithOutPassword = await prisma.user.findUnique({
      where: { id: createdUserId },
      omit: {
        password: true,
        emailVerificationOTP: true,
        resetPasswordOTP: true,
      },
    });

    await sendOTPEmail(email, firstName, otp, "verification");

    res.status(201).json({
      success: true,
      message:
        "User created successfully. Please verify your email using the OTP sent to your inbox.",
      data: {
        user: newUserWithOutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

// MARK: Verify Email
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      const error: any = new Error("Email and OTP are required");
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    //const user = await User.findOne({ email });

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (user.isEmailVerified) {
      return res
        .status(200)
        .json({ success: true, message: "Email already verified" });
    }

    if (
      !user.emailVerificationOTP ||
      !user.emailVerificationOTPExpires ||
      user.emailVerificationOTP !== otp
    ) {
      const error: any = new Error("Invalid verification code");
      error.statusCode = 400;
      throw error;
    }

    if (new Date() > user.emailVerificationOTPExpires) {
      const error: any = new Error("Verification code has expired");
      error.statusCode = 400;
      throw error;
    }

    user.isEmailVerified = true;
    user.emailVerificationOTP = null as any;
    user.emailVerificationOTPExpires = null as any;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });

    const userWithoutPassword = await prisma.user.findUnique({
      where: { id: user.id },
      omit: {
        password: true,
        emailVerificationOTP: true,
        resetPasswordOTP: true,
      },
    });
    const { accessToken, refreshToken } = await generateTokens(user.id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: { user: userWithoutPassword, accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

// MARK: Resend Verification Code
export const resendVerificationCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    if (!email) {
      const error: any = new Error("Email is required");
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (user.isEmailVerified) {
      return res
        .status(200)
        .json({ success: true, message: "Email already verified" });
    }

    // Check cooldown: 1 minute
    if (
      user.lastVerificationResend &&
      Date.now() - user.lastVerificationResend.getTime() < 60000
    ) {
      const error: any = new Error(
        "Please wait 1 minute before requesting another verification code",
      );
      error.statusCode = 429;
      throw error;
    }

    const otp = create6DigitOTP();
    const otpExpires = new Date(Date.now() + OTP_LIFETIME_MINUTES * 60 * 1000);

    user.emailVerificationOTP = otp;
    user.emailVerificationOTPExpires = otpExpires;
    user.lastVerificationResend = new Date();

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });

    await sendOTPEmail(email, user.firstName, otp, "verification");

    res.status(200).json({
      success: true,
      message: "Verification code resent to your email",
    });
  } catch (error) {
    next(error);
  }
};

// MARK: Request Password Reset
export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    if (!email) {
      const error: any = new Error("Email is required");
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const otp = create6DigitOTP();
    const otpExpires = new Date(Date.now() + OTP_LIFETIME_MINUTES * 60 * 1000);

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = otpExpires;

    await prisma.user.update({
      where: { id: user.id },
      data: user,
    });

    await sendOTPEmail(email, user.firstName, otp, "reset");

    res
      .status(200)
      .json({ success: true, message: "Password reset code sent to email" });
  } catch (error) {
    next(error);
  }
};

// MARK: Verify Password Reset
export const verifyPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      const error: any = new Error("Email, OTP, and new password are required");
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (
      !user.resetPasswordOTP ||
      !user.resetPasswordOTPExpires ||
      user.resetPasswordOTP !== otp
    ) {
      const error: any = new Error("Invalid password reset code");
      error.statusCode = 400;
      throw error;
    }

    if (new Date() > user.resetPasswordOTPExpires) {
      const error: any = new Error("Password reset code has expired");
      error.statusCode = 400;
      throw error;
    }

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(newPassword, salt);
    user.resetPasswordOTP = null as any;
    user.resetPasswordOTPExpires = null as any;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

// MARK: Sign In
export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      const error: any = new Error("User does not exist");
      error.statusCode = 404;
      throw error;
    }

    if (!user.isEmailVerified) {
      const error: any = new Error(
        "Email not verified. Please verify your email before signing in.",
      );
      error.statusCode = 403;
      throw error;
    }

    const userWithoutPassword = await prisma.user.findUnique({
      where: { id: user.id },
      omit: {
        password: true,
        emailVerificationOTP: true,
        resetPasswordOTP: true,
        emailVerificationOTPExpires: true,
        updatedAt: true,
        lastVerificationResend: true,
      },
    });

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      const error: any = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }

    const { accessToken, refreshToken } = await generateTokens(user.id);

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        user: userWithoutPassword,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

//MARK: Refresh Token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      const error: any = new Error("Refresh token is required");
      error.statusCode = 400;
      throw error;
    }

    const decoded = await verifyRefreshToken(refreshToken);
    if (!decoded || !decoded.userId) {
      const error: any = new Error("Invalid refresh token");
      error.statusCode = 401;
      throw error;
    }

    const tokens = await generateTokens(decoded.userId);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

// MARK: Sign Out
export const signOut = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    const user = req.user;

    if (!refreshToken) {
      const error: any = new Error("Refresh token is required");
      error.statusCode = 400;
      throw error;
    }

    const tokenRecord = await prisma.userToken.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!tokenRecord) {
      return res.status(200).json({
        success: true,
        message: "Already signed out or token has been revoked",
      });
    }

    await prisma.userToken.delete({
      where: {
        userId: user.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};
