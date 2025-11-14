import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { env } from "../config/env";
import { authMiddleware, AuthRequest } from "../utils/authMiddleware";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/mailer";

const router = Router();

const registerSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1).optional(),
    password: z.string().min(6),
});

router.post("/register", async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { email, name, password } = parsed.data;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, passwordHash });

    const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

router.post("/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { email, password } = parsed.data;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
    const user = await User.findById(req.userId).select("email name");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ id: user.id, email: user.email, name: user.name });
});

// POST /api/auth/forgot-password
const forgotSchema = z.object({ email: z.string().email() });
router.post("/forgot-password", async (req, res) => {
    const parsed = forgotSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { email } = parsed.data;
    const user = await User.findOne({ email });
    if (!user) {
        // Return 200 to prevent user enumeration
        return res.json({ message: "If that email exists, a reset email has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    user.resetPasswordToken = token;
    user.resetPasswordExpiresAt = expires;
    await user.save();

    const baseUrl = req.headers.origin || req.headers.referer || "http://localhost:5173";
    const resetUrl = `${baseUrl.replace(/\/$/, "")}/#/reset-password?token=${token}`;
    try {
        await sendPasswordResetEmail(email, resetUrl);
    } catch (e) {
        // Do not expose email errors to avoid enumeration
    }
    res.json({ message: "If that email exists, a reset email has been sent." });
});

// POST /api/auth/reset-password
const resetSchema = z.object({
    token: z.string().min(10),
    password: z.string().min(6),
});
router.post("/reset-password", async (req, res) => {
    const parsed = resetSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { token, password } = parsed.data;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await user.save();

    res.json({ message: "Password has been reset successfully." });
});

export default router;


