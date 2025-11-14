import { Card, CardContent, CardHeader} from "../ui/card.tsx";
import { Badge} from "../ui/badge.tsx";
import { Heart, Activity, Moon, TrendingUp, Brain, Calendar } from "lucide-react"
import type { HealthEntry } from "../../types"

interface EntryCardProps {
    entry: HealthEntry
}

export function EntryCard({ entry }: EntryCardProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(new Date(date))
    }

    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case "positive":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "negative":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            default:
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 8) return "text-green-500"
        if (score >= 6) return "text-yellow-500"
        return "text-red-500"
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(entry.createdAt)}</span>
                    </div>
                    {entry.aiAnalysis && (
                        <Badge className={getSentimentColor(entry.aiAnalysis.sentiment)}>{entry.aiAnalysis.sentiment}</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Journal Text */}
                <div className="p-3 bg-muted rounded-lg">
                    <p className="text-foreground leading-relaxed">{entry.entryText}</p>
                </div>

                {/* Health Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <div>
                            <p className="text-xs text-muted-foreground">Mood</p>
                            <p className={`font-semibold ${getScoreColor(entry.moodScore)}`}>{entry.moodScore}/10</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-orange-500" />
                        <div>
                            <p className="text-xs text-muted-foreground">Energy</p>
                            <p className={`font-semibold ${getScoreColor(entry.energyScore)}`}>{entry.energyScore}/10</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Moon className="w-4 h-4 text-blue-500" />
                        <div>
                            <p className="text-xs text-muted-foreground">Sleep</p>
                            <p className="font-semibold text-foreground">{entry.sleepHours}h</p>
                        </div>
                    </div>

                    {entry.steps && (
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <div>
                                <p className="text-xs text-muted-foreground">Steps</p>
                                <p className="font-semibold text-foreground">{entry.steps.toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Analysis */}
                {entry.aiAnalysis && (
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Brain className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">AI Insights</span>
                        </div>

                        {/* Key Topics */}
                        {entry.aiAnalysis.keyTopics.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {entry.aiAnalysis.keyTopics.map((topic, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {topic}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Recommendations */}
                        {entry.aiAnalysis.recommendations.length > 0 && (
                            <div className="space-y-2">
                                {entry.aiAnalysis.recommendations.map((recommendation, index) => (
                                    <div key={index} className="p-3 bg-primary/10 rounded-lg">
                                        <p className="text-sm text-primary font-medium">💡 {recommendation}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
