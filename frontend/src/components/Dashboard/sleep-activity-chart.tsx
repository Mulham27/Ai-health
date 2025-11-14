"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card.tsx";
import { ChartContainer, ChartTooltip, ChartTooltipContent} from "../ui/chart.tsx";
import type { HealthEntry } from "../../types"

interface SleepActivityChartProps {
    entries: HealthEntry[]
}

export function SleepActivityChart({ entries }: SleepActivityChartProps) {
    // Process entries to create chart data
    const chartData = entries
        .slice(-7) // Last 7 entries
        .reverse()
        .map((entry) => ({
            date: new Date(entry.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
            sleep: entry.sleepHours,
            steps: entry.steps ? Math.round(entry.steps / 1000) : 0, // Convert to thousands
        }))

    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Sleep & Activity</CardTitle>
                    <CardDescription>Your sleep hours and daily steps</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">No data available. Start journaling to see your activity!</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sleep & Activity</CardTitle>
                <CardDescription>Sleep hours and daily steps over the last week</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        sleep: {
                            label: "Sleep Hours",
                            color: "hsl(var(--chart-3))",
                        },
                        steps: {
                            label: "Steps (thousands)",
                            color: "hsl(var(--chart-4))",
                        },
                    }}
                    className="h-[300px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="date" className="text-xs" />
                            <YAxis className="text-xs" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="sleep" fill="var(--color-sleep)" name="Sleep Hours" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="steps" fill="var(--color-steps)" name="Steps (k)" radius={[2, 2, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
