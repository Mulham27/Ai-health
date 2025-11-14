"use client"

import { useEffect, useState } from "react"
import { HealthMetricsCard } from "../components/Dashboard/health-metrics-card.tsx";
import { MoodEnergyChart } from "../components/Dashboard/mood-energy-chart.tsx";
import { SleepActivityChart } from "../components/Dashboard/sleep-activity-chart.tsx";
import { WellnessInsights } from "../components/Dashboard/wellness-insights.tsx";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Button} from "../components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@radix-ui/react-select";
import { Heart, Activity, Moon, TrendingUp, Calendar, RefreshCw } from "lucide-react"
import { useHealthStore } from "../lib/store"
import { localHealthService } from "../services/localHealthService"
import type { HealthAnalytics } from "../types"

export function DashboardPage() {
    const { user, entries } = useHealthStore()
    const [analytics, setAnalytics] = useState<HealthAnalytics | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [timeRange, setTimeRange] = useState("7")

    useEffect(() => {
        if (user && entries.length > 0) {
            loadAnalytics()
        }
    }, [user, entries])

    const loadAnalytics = async () => {
        setIsLoading(true)
        try {
            const data = await localHealthService.getAnalytics()
            setAnalytics(data)
        } catch (error) {
            console.error("Failed to load analytics:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Sign In Required</CardTitle>
                        <CardDescription>Please sign in to access your health dashboard.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    if (entries.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-foreground mb-2">No Data Yet</h2>
                        <p className="text-muted-foreground mb-6">
                            Start journaling to see your health analytics and personalized insights.
                        </p>
                        <Button asChild>
                            <a href="/journal">Start Journaling</a>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Calculate current metrics
    const recentEntries = entries.slice(0, Number.parseInt(timeRange))
    const averageMood = recentEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / recentEntries.length
    const averageEnergy = recentEntries.reduce((sum, entry) => sum + entry.energyScore, 0) / recentEntries.length
    const averageSleep = recentEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / recentEntries.length
    const totalSteps = recentEntries.reduce((sum, entry) => sum + (entry.steps || 0), 0)

    // Calculate trends (compare with previous period)
    const previousEntries = entries.slice(Number.parseInt(timeRange), Number.parseInt(timeRange) * 2)
    const previousMood =
        previousEntries.length > 0
            ? previousEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / previousEntries.length
            : averageMood
    const previousEnergy =
        previousEntries.length > 0
            ? previousEntries.reduce((sum, entry) => sum + entry.energyScore, 0) / previousEntries.length
            : averageEnergy

    const moodTrend = averageMood > previousMood ? "up" : averageMood < previousMood ? "down" : "stable"
    const energyTrend = averageEnergy > previousEnergy ? "up" : averageEnergy < previousEnergy ? "down" : "stable"

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Health Dashboard</h1>
                        <p className="text-muted-foreground">Track your wellness journey with AI-powered insights and analytics.</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select time range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Last 7 entries</SelectItem>
                                <SelectItem value="14">Last 14 entries</SelectItem>
                                <SelectItem value="30">Last 30 entries</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={loadAnalytics} disabled={isLoading}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <HealthMetricsCard
                        title="Average Mood"
                        value={`${averageMood.toFixed(1)}/10`}
                        description={`Based on ${recentEntries.length} entries`}
                        progress={(averageMood / 10) * 100}
                        trend={moodTrend}
                        trendValue={`${Math.abs(averageMood - previousMood).toFixed(1)} points`}
                        icon={Heart}
                        iconColor="text-red-500"
                    />

                    <HealthMetricsCard
                        title="Average Energy"
                        value={`${averageEnergy.toFixed(1)}/10`}
                        description={`Based on ${recentEntries.length} entries`}
                        progress={(averageEnergy / 10) * 100}
                        trend={energyTrend}
                        trendValue={`${Math.abs(averageEnergy - previousEnergy).toFixed(1)} points`}
                        icon={Activity}
                        iconColor="text-orange-500"
                    />

                    <HealthMetricsCard
                        title="Average Sleep"
                        value={`${averageSleep.toFixed(1)}h`}
                        description="Per night"
                        progress={Math.min((averageSleep / 9) * 100, 100)}
                        icon={Moon}
                        iconColor="text-blue-500"
                    />

                    <HealthMetricsCard
                        title="Total Steps"
                        value={totalSteps.toLocaleString()}
                        description={`Over ${recentEntries.length} days`}
                        progress={Math.min((totalSteps / (10000 * recentEntries.length)) * 100, 100)}
                        icon={TrendingUp}
                        iconColor="text-green-500"
                    />
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <MoodEnergyChart entries={entries} />
                    <SleepActivityChart entries={entries} />
                </div>

                {/* Wellness Insights */}
                <WellnessInsights entries={entries} />
            </div>
        </div>
    )
}
