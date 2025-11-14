import { Router } from "express";

const router = Router();

// GET /api/suggestions
router.get("/suggestions", (_req, res) => {
    const now = new Date();
    const suggestions = [
        { id: "s1", type: "mindfulness", content: "Try a 5-minute breathing exercise", priority: "medium", createdAt: now },
        { id: "s2", type: "sleep", content: "Avoid screens 30 minutes before bed", priority: "high", createdAt: now },
        { id: "s3", type: "exercise", content: "Take a 15-minute walk after lunch", priority: "low", createdAt: now },
    ];
    res.json(suggestions);
});

// GET /api/analytics/health
router.get("/analytics/health", (_req, res) => {
    const analytics = {
        userId: "demo",
        averageMood: 6.5,
        averageEnergy: 6.8,
        sleepTrend: "stable",
        activityTrend: "improving",
        improvementRate: 0.12,
        weeklyData: [
            { week: "2025-W35", mood: 6.2, energy: 6.4, sleep: 7.1, steps: 42000 },
            { week: "2025-W36", mood: 6.5, energy: 6.8, sleep: 7.0, steps: 45000 },
            { week: "2025-W37", mood: 6.7, energy: 7.1, sleep: 7.2, steps: 48000 },
        ],
    } as const;
    res.json(analytics);
});

export default router;


