"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card.tsx";
import { Progress} from "../ui/progress.tsx";
import { Badge } from "../ui/badge.tsx";
import { Brain, AlertTriangle, CheckCircle, Lightbulb, Target, Calendar } from "lucide-react"
import { useHealthStore } from "../../lib/store"
import type { HealthEntry } from "../../types"

interface HealthInsight {
    id: string
    type: "positive" | "warning" | "neutral" | "goal"
    title: string
    description: string
    confidence: number
    actionable: boolean
    relatedMetric: string
}

export function HealthInsights() {
    const { entries } = useHealthStore()
    const [insights, setInsights] = useState<HealthInsight[]>([])

    useEffect(() => {
        if (entries.length > 0) {
            generateInsights(entries)
        }
    }, [entries])

    const generateInsights = (entries: HealthEntry[]) => {
        const recentEntries = entries.slice(0, 7)
        const insights: HealthInsight[] = []

        if (recentEntries.length < 3) {
            insights.push({
                id: "consistency",
                type: "goal",
                title: "Build a Consistent Habit",
                description:
                    "Try to journal daily for better AI insights. Consistency helps us understand your patterns better.",
                confidence: 90,
                actionable: true,
                relatedMetric: "frequency",
            })
            setInsights(insights)
            return
        }

        // Analyze mood trends
        const moodScores = recentEntries.map((e) => e.moodScore)
        const moodTrend =
            moodScores.slice(0, 3).reduce((sum, score) => sum + score, 0) / 3 -
            moodScores.slice(-3).reduce((sum, score) => sum + score, 0) / 3

        if (moodTrend > 1) {
            insights.push({
                id: "mood-improving",
                type: "positive",
                title: "Mood is Trending Upward",
                description: `Your mood has improved by ${moodTrend.toFixed(1)} points over recent entries. Keep up whatever you're doing!`,
                confidence: 85,
                actionable: false,
                relatedMetric: "mood",
            })
        } else if (moodTrend < -1) {
            insights.push({
                id: "mood-declining",
                type: "warning",
                title: "Mood Needs Attention",
                description: `Your mood has declined by ${Math.abs(moodTrend).toFixed(1)} points recently. Consider stress management techniques.`,
                confidence: 80,
                actionable: true,
                relatedMetric: "mood",
            })
        }

        // Analyze sleep patterns
        const sleepHours = recentEntries.map((e) => e.sleepHours)
        const avgSleep = sleepHours.reduce((sum, hours) => sum + hours, 0) / sleepHours.length

        if (avgSleep < 7) {
            insights.push({
                id: "sleep-insufficient",
                type: "warning",
                title: "Sleep Optimization Needed",
                description: `You're averaging ${avgSleep.toFixed(1)} hours of sleep. Aim for 7-9 hours for optimal health.`,
                confidence: 95,
                actionable: true,
                relatedMetric: "sleep",
            })
        } else if (avgSleep >= 8) {
            insights.push({
                id: "sleep-excellent",
                type: "positive",
                title: "Excellent Sleep Habits",
                description: `Great job maintaining ${avgSleep.toFixed(1)} hours of sleep on average. This supports your overall wellness.`,
                confidence: 90,
                actionable: false,
                relatedMetric: "sleep",
            })
        }

        // Analyze energy levels
        const energyScores = recentEntries.map((e) => e.energyScore)
        const avgEnergy = energyScores.reduce((sum, score) => sum + score, 0) / energyScores.length

        if (avgEnergy < 6 && avgSleep < 7) {
            insights.push({
                id: "energy-sleep-correlation",
                type: "neutral",
                title: "Energy-Sleep Connection",
                description:
                    "Your low energy levels may be related to insufficient sleep. Better sleep could boost your energy.",
                confidence: 75,
                actionable: true,
                relatedMetric: "energy",
            })
        }

        // Analyze sentiment patterns
        const sentiments = recentEntries.filter((e) => e.aiAnalysis?.sentiment).map((e) => e.aiAnalysis!.sentiment)

        const positiveDays = sentiments.filter((s) => s === "positive").length
        const negativeDays = sentiments.filter((s) => s === "negative").length

        if (positiveDays > negativeDays * 2) {
            insights.push({
                id: "positive-outlook",
                type: "positive",
                title: "Maintaining Positive Outlook",
                description: `${positiveDays} out of ${sentiments.length} recent entries show positive sentiment. You're doing great!`,
                confidence: 80,
                actionable: false,
                relatedMetric: "sentiment",
            })
        }

        // Goal-based insights
        if (entries.length >= 7) {
            insights.push({
                id: "consistency-achievement",
                type: "goal",
                title: "Consistency Goal Progress",
                description: `You've journaled ${entries.length} times! Consistent tracking is key to understanding your health patterns.`,
                confidence: 100,
                actionable: false,
                relatedMetric: "consistency",
            })
        }

        setInsights(insights)
    }

    const getInsightIcon = (type: string) => {
        switch (type) {
            case "positive":
                return CheckCircle
            case "warning":
                return AlertTriangle
            case "goal":
                return Target
            default:
                return Lightbulb
        }
    }

    const getInsightColor = (type: string) => {
        switch (type) {
            case "positive":
                return "text-green-500"
            case "warning":
                return "text-yellow-500"
            case "goal":
                return "text-blue-500"
            default:
                return "text-purple-500"
        }
    }

    const getBadgeVariant = (type: string) => {
        switch (type) {
            case "positive":
                return "default"
            case "warning":
                return "destructive"
            case "goal":
                return "secondary"
            default:
                return "outline"
        }
    }

    if (entries.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-primary" />
                        <span>AI Health Insights</span>
                    </CardTitle>
                    <CardDescription>Start journaling to get personalized AI insights about your health patterns</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No insights available yet. Create your first journal entry!</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <span>AI Health Insights</span>
                </CardTitle>
                <CardDescription>Personalized insights based on your {entries.length} journal entries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {insights.map((insight) => {
                    const Icon = getInsightIcon(insight.type)
                    return (
                        <div key={insight.id} className="p-4 bg-muted rounded-lg space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    <Icon className={`w-5 h-5 mt-0.5 ${getInsightColor(insight.type)}`} />
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
                                            <Badge variant={getBadgeVariant(insight.type)} className="text-xs">
                                                {insight.type}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>

                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs text-muted-foreground">Confidence:</span>
                                                <Progress value={insight.confidence} className="w-16 h-2" />
                                                <span className="text-xs font-medium">{insight.confidence}%</span>
                                            </div>

                                            {insight.actionable && (
                                                <Badge variant="outline" className="text-xs">
                                                    <Target className="w-3 h-3 mr-1" />
                                                    Actionable
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {insights.length === 0 && (
                    <div className="text-center py-8">
                        <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Keep journaling to unlock more personalized insights!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
