import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string, fallback?: string) {
    const value = process.env[key] ?? fallback;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(process.env.PORT ?? 4000),
    MONGODB_URI: requireEnv("MONGODB_URI", "mongodb://127.0.0.1:27017/ai_health"),
    JWT_SECRET: requireEnv("JWT_SECRET", "dev-secret-change-me"),
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? "*",
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    SMTP_SECURE: process.env.SMTP_SECURE === "true" ? true : false,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    MAIL_FROM: process.env.MAIL_FROM,
};


