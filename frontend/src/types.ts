export interface User {
    id: string
    email: string
    name: string
    avatar?: string
    preferences: UserPreferences
    createdAt: Date
}

export interface UserPreferences {
    notifications: boolean
    reminderTime: string
    goals: string[]
    privacyLevel: "private" | "anonymous" | "public"
}

export interface HealthEntry {
    id: string
    userId: string
    entryText: string
    moodScore: number
    energyScore: number
    sleepHours: number
    steps?: number
    createdAt: Date
    aiAnalysis?: AIAnalysis
}

export interface AIAnalysis {
    sentiment: "positive" | "neutral" | "negative"
    keyTopics: string[]
    recommendations: string[]
    confidenceScore: number
}

export interface Suggestion {
    id: string
    type: "nutrition" | "exercise" | "sleep" | "mindfulness" | "general"
    content: string
    priority: "low" | "medium" | "high"
    createdAt: Date
}

export interface CommunityPost {
    id: string
    userId: string
    content: string
    isAnonymous: boolean
    likes: number
    replies: CommunityReply[]
    createdAt: Date
}

export interface CommunityReply {
    id: string
    userId: string
    content: string
    isAnonymous: boolean
    createdAt: Date
}

export interface HealthAnalytics {
    userId: string
    averageMood: number
    averageEnergy: number
    sleepTrend: "improving" | "stable" | "declining"
    activityTrend: "improving" | "stable" | "declining"
    improvementRate: number
    weeklyData: WeeklyData[]
}

export interface WeeklyData {
    week: string
    mood: number
    energy: number
    sleep: number
    steps: number
}
