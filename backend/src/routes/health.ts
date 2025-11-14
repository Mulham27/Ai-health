import { Router } from "express";
import { z } from "zod";
import { HealthEntry } from "../models/HealthEntry";
import mongoose from "mongoose";

const router = Router();

// POST /api/health/analyze
router.post("/analyze", (req, res) => {
    const schema = z.object({ entryText: z.string().min(1) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const text = parsed.data.entryText.toLowerCase();
    const sentiment: "positive" | "neutral" | "negative" = text.includes("great") || text.includes("good")
        ? "positive"
        : text.includes("bad") || text.includes("tired")
        ? "negative"
        : "neutral";

    const analysis = {
        sentiment,
        keyTopics: ["wellness", "routine"],
        recommendations: sentiment === "negative"
            ? ["Take a short walk", "Hydrate well", "Try deep breathing"]
            : ["Keep up the good work", "Maintain sleep schedule"],
        confidenceScore: 0.8,
    } as const;

    res.json(analysis);
});

// POST /api/health/entries
router.post("/entries", async (req, res) => {
    const schema = z.object({
        userId: z.string().optional(),
        entryText: z.string().min(1),
        moodScore: z.number().min(0).max(10),
        energyScore: z.number().min(0).max(10),
        sleepHours: z.number().min(0).max(24),
        steps: z.number().int().nonnegative().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const userId = parsed.data.userId && mongoose.isValidObjectId(parsed.data.userId)
        ? new mongoose.Types.ObjectId(parsed.data.userId)
        : new mongoose.Types.ObjectId();

    const entry = await HealthEntry.create({
        userId,
        entryText: parsed.data.entryText,
        moodScore: parsed.data.moodScore,
        energyScore: parsed.data.energyScore,
        sleepHours: parsed.data.sleepHours,
        steps: parsed.data.steps,
    });
    res.status(201).json({
        id: entry.id,
        userId: entry.userId,
        entryText: entry.entryText,
        moodScore: entry.moodScore,
        energyScore: entry.energyScore,
        sleepHours: entry.sleepHours,
        steps: entry.steps,
        createdAt: entry.createdAt,
        aiAnalysis: entry.aiAnalysis,
    });
});

// GET /api/health/entries?limit=20
router.get("/entries", async (req, res) => {
    const limitParam = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const limit = limitParam ? Number(limitParam) : 20;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;
    const docs = await HealthEntry.find().sort({ createdAt: -1 }).limit(safeLimit).lean();
    const result = docs.map((d) => ({
        id: d._id.toString(),
        userId: d.userId,
        entryText: d.entryText,
        moodScore: d.moodScore,
        energyScore: d.energyScore,
        sleepHours: d.sleepHours,
        steps: d.steps,
        createdAt: d.createdAt,
        aiAnalysis: d.aiAnalysis,
    }));
    res.json(result);
});

export default router;


