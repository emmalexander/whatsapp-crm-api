import nodemailer from "nodemailer";
import { EMAIL_PASSWORD, EMAIL } from "./env.js";

export const accountEmail = EMAIL;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: accountEmail,
        pass: EMAIL_PASSWORD
    }
});

export default transporter;