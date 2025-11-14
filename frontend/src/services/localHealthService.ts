import type { AIAnalysis, Suggestion, HealthAnalytics } from "../types"

// Mock AI analysis for offline development
const generateMockAIAnalysis = (entryText: string): AIAnalysis => {
    const positiveWords = ["good", "great", "happy", "energetic", "motivated", "peaceful", "excited", "accomplished"]
    const negativeWords = ["tired", "stressed", "anxious", "sad", "overwhelmed", "exhausted", "frustrated", "worried"]

    const text = entryText.toLowerCase()
    const hasPositive = positiveWords.some((word) => text.includes(word))
    const hasNegative = negativeWords.some((word) => text.includes(word))

    let sentiment: "positive" | "neutral" | "negative" = "neutral"
    if (hasPositive && !hasNegative) sentiment = "positive"
    else if (hasNegative && !hasPositive) sentiment = "negative"

    // Generate contextual recommendations based on entry content
    const recommendations = []

    if (text.includes("tired") || text.includes("exhausted")) {
        recommendations.push("Consider going to bed 30 minutes earlier tonight for better energy tomorrow")
    }

    if (text.includes("stressed") || text.includes("anxious")) {
        recommendations.push("Try a 5-minute breathing exercise to help manage stress levels")
    }

    if (text.includes("energetic") || text.includes("motivated")) {
        recommendations.push("Great energy today! Consider channeling it into a physical activity you enjoy")
    }

    if (text.includes("sleep") && (text.includes("bad") || text.includes("poor"))) {
        recommendations.push("Poor sleep can affect your entire day. Try establishing a consistent bedtime routine")
    }

    // Default recommendations if none match
    if (recommendations.length === 0) {
        const defaultRecs = [
            "Stay hydrated throughout the day - aim for 8 glasses of water",
            "Take a 10-minute walk to boost your mood and energy",
            "Practice gratitude by writing down 3 things you're thankful for",
            "Consider doing some light stretching to improve your physical wellbeing",
        ]
        recommendations.push(defaultRecs[Math.floor(Math.random() * defaultRecs.length)])
    }

    return {
        sentiment,
        keyTopics: ["mood", "energy", "sleep"],
        recommendations,
        confidenceScore: 0.85,
    }
}

// Enhanced suggestion generation based on user patterns
const generatePersonalizedSuggestions = (): Suggestion[] => {
    const suggestionPool = [
        {
            type: "nutrition" as const,
            content:
                "Start your day with a protein-rich breakfast to maintain steady energy levels throughout the morning. Try eggs, Greek yogurt, or a protein smoothie.",
            priority: "high" as const,
        },
        {
            type: "mindfulness" as const,
            content:
                "Practice the 4-7-8 breathing technique when feeling stressed: inhale for 4 counts, hold for 7, exhale for 8. This activates your parasympathetic nervous system.",
            priority: "medium" as const,
        },
        {
            type: "sleep" as const,
            content:
                "Create a wind-down routine 1 hour before bed: dim lights, avoid screens, and try reading or gentle stretching to signal your body it's time to rest.",
            priority: "high" as const,
        },
        {
            type: "exercise" as const,
            content:
                "Take a 15-minute walk after meals to aid digestion and boost your mood. Even light movement can significantly impact your energy levels.",
            priority: "medium" as const,
        },
        {
            type: "nutrition" as const,
            content:
                "Stay hydrated by keeping a water bottle nearby. Dehydration can cause fatigue, headaches, and difficulty concentrating.",
            priority: "medium" as const,
        },
        {
            type: "mindfulness" as const,
            content:
                "Try the 5-4-3-2-1 grounding technique when anxious: notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
            priority: "low" as const,
        },
        {
            type: "sleep" as const,
            content:
                "Keep your bedroom cool (65-68°F) and dark for optimal sleep quality. Consider blackout curtains or an eye mask if needed.",
            priority: "medium" as const,
        },
        {
            type: "exercise" as const,
            content:
                "Incorporate micro-workouts into your day: 10 squats while coffee brews, calf raises while brushing teeth, or desk stretches every hour.",
            priority: "low" as const,
        },
        {
            type: "general" as const,
            content:
                "Practice the 'two-minute rule': if a task takes less than 2 minutes, do it immediately. This reduces mental clutter and stress.",
            priority: "low" as const,
        },
        {
            type: "nutrition" as const,
            content:
                "Include omega-3 rich foods in your diet like salmon, walnuts, or chia seeds to support brain health and mood regulation.",
            priority: "medium" as const,
        },
    ]

    // Randomly select 3-4 suggestions
    const shuffled = suggestionPool.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 3)

    return selected.map((suggestion, index) => ({
        id: `suggestion-${Date.now()}-${index}`,
        ...suggestion,
        createdAt: new Date(),
    }))
}

export const localHealthService = {
    async analyzeEntry(entryText: string): Promise<AIAnalysis> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))
        return generateMockAIAnalysis(entryText)
    },

    async getSuggestions(): Promise<Suggestion[]> {
        await new Promise((resolve) => setTimeout(resolve, 800))
        return generatePersonalizedSuggestions()
    },

    async getAnalytics(): Promise<HealthAnalytics> {
        await new Promise((resolve) => setTimeout(resolve, 800))
        return {
            userId: "mock-user",
            averageMood: 7.2,
            averageEnergy: 6.8,
            sleepTrend: "improving",
            activityTrend: "stable",
            improvementRate: 15,
            weeklyData: [
                { week: "Week 1", mood: 6.5, energy: 6.0, sleep: 7.2, steps: 8500 },
                { week: "Week 2", mood: 7.0, energy: 6.5, sleep: 7.5, steps: 9200 },
                { week: "Week 3", mood: 7.2, energy: 6.8, sleep: 7.8, steps: 9800 },
                { week: "Week 4", mood: 7.5, energy: 7.2, sleep: 8.0, steps: 10200 },
            ],
        }
    },
}
