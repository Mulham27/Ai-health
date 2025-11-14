import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
    userId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });
    const token = auth.slice("Bearer ".length);
    try {
        const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
        req.userId = payload.sub;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}


