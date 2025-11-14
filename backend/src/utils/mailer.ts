import nodemailer from "nodemailer";
import { env } from "../config/env";

export const mailer = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
});

export async function sendPasswordResetEmail(toEmail: string, resetUrl: string) {
    const from = env.MAIL_FROM ?? env.SMTP_USER ?? "no-reply@example.com";
    const subject = "Reset your password";
    const text = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;
    const html = `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset your password</a></p>`;

    await mailer.sendMail({ from, to: toEmail, subject, text, html });
}


