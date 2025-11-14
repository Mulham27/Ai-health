import express from "express";
import cors from "cors";
import { env } from "./config/env";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import miscRouter from "./routes/misc";

export function createApp() {
    const app = express();

    app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
    app.use(express.json());

    // Mount API routes under /api to match frontend baseURL
    app.use("/api/health", healthRouter);
    app.use("/api/auth", authRouter);
    app.use("/api", miscRouter);

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ error: "Not found" });
    });

    // Error handler
    app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
        const status = err.status || 500;
        const message = err.message || "Internal server error";
        const details = process.env.NODE_ENV !== "production" ? err.stack : undefined;
        res.status(status).json({ error: message, details });
    });

    return app;
}


