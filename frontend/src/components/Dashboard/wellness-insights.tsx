import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card.tsx";
import { Badge} from "../ui/badge.tsx";
import { Progress} from "../ui/progress.tsx";
import { Brain, Target, TrendingUp, Award } from "lucide-react"
import type { HealthEntry } from "../../types"

interface WellnessInsightsProps {
    entries: HealthEntry[]
}

export function WellnessInsights({ entries }: WellnessInsightsProps) {
    if (entries.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-primary" />
                        <span>Wellness Insights</span>
                    </CardTitle>
                    <CardDescription>AI-powered insights about your health patterns</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Start journaling to get personalized wellness insights!</p>
                </CardContent>
            </Card>
        )
    }

    // Calculate insights
    const recentEntries = entries.slice(0, 7)
    const averageMood = recentEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / recentEntries.length
    const averageEnergy = recentEntries.reduce((sum, entry) => sum + entry.energyScore, 0) / recentEntries.length
    const averageSleep = recentEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / recentEntries.length

    // Analyze sentiment distribution
    const sentimentCounts = recentEntries.reduce(
        (acc, entry) => {
            if (entry.aiAnalysis?.sentiment) {
                acc[entry.aiAnalysis.sentiment]++
            }
            return acc
        },
        { positive: 0, neutral: 0, negative: 0 },
    )

    const totalWithSentiment = Object.values(sentimentCounts).reduce((sum, count) => sum + count, 0)

    // Generate insights
    const insights = []

    if (averageMood >= 8) {
        insights.push({
            type: "positive",
            title: "Excellent Mood Trend",
            description: "Your mood has been consistently high this week. Keep up the great work!",
            icon: Award,
        })
    } else if (averageMood < 6) {
        insights.push({
            type: "attention",
            title: "Mood Support Needed",
            description:
                "Your mood has been lower recently. Consider reaching out for support or trying stress-relief activities.",
            icon: Target,
        })
    }

    if (averageEnergy >= 8) {
        insights.push({
            type: "positive",
            title: "High Energy Levels",
            description: "You've been maintaining great energy levels. Your current routine is working well!",
            icon: TrendingUp,
        })
    }

    if (averageSleep < 7) {
        insights.push({
            type: "attention",
            title: "Sleep Optimization",
            description:
                "You're averaging less than 7 hours of sleep. Consider improving your sleep routine for better wellness.",
            icon: Target,
        })
    } else if (averageSleep >= 8) {
        insights.push({
            type: "positive",
            title: "Great Sleep Habits",
            description: "You're getting excellent sleep! This is contributing to your overall wellness.",
            icon: Award,
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <span>Wellness Insights</span>
                </CardTitle>
                <CardDescription>AI-powered insights from your last {recentEntries.length} entries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{averageMood.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">Avg Mood</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{averageEnergy.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">Avg Energy</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{averageSleep.toFixed(1)}h</div>
                        <div className="text-xs text-muted-foreground">Avg Sleep</div>
                    </div>
                </div>

                {/* Sentiment Analysis */}
                {totalWithSentiment > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-foreground">Sentiment Distribution</h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Positive</span>
                                <div className="flex items-center space-x-2">
                                    <Progress value={(sentimentCounts.positive / totalWithSentiment) * 100} className="w-20 h-2" />
                                    <span className="text-sm font-medium">{sentimentCounts.positive}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Neutral</span>
                                <div className="flex items-center space-x-2">
                                    <Progress value={(sentimentCounts.neutral / totalWithSentiment) * 100} className="w-20 h-2" />
                                    <span className="text-sm font-medium">{sentimentCounts.neutral}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Negative</span>
                                <div className="flex items-center space-x-2">
                                    <Progress value={(sentimentCounts.negative / totalWithSentiment) * 100} className="w-20 h-2" />
                                    <span className="text-sm font-medium">{sentimentCounts.negative}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Insights */}
                {insights.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-foreground">Personalized Insights</h4>
                        <div className="space-y-3">
                            {insights.map((insight, index) => {
                                const Icon = insight.icon
                                return (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                                        <Icon className="w-5 h-5 text-primary mt-0.5" />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h5 className="text-sm font-medium text-foreground">{insight.title}</h5>
                                                <Badge variant={insight.type === "positive" ? "default" : "secondary"} className="text-xs">
                                                    {insight.type === "positive" ? "Great!" : "Focus Area"}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{insight.description}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
