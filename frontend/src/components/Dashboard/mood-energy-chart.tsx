"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card.tsx";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart.tsx";
import type { HealthEntry } from "../../types"

interface MoodEnergyChartProps {
    entries: HealthEntry[]
}

export function MoodEnergyChart({ entries }: MoodEnergyChartProps) {
    // Process entries to create chart data
    const chartData = entries
        .slice(-14) // Last 14 entries
        .reverse()
        .map((entry, index) => ({
            day: `Day ${index + 1}`,
            date: new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            mood: entry.moodScore,
            energy: entry.energyScore,
        }))

    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Mood & Energy Trends</CardTitle>
                    <CardDescription>Track your mood and energy levels over time</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">No data available. Start journaling to see your trends!</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mood & Energy Trends</CardTitle>
                <CardDescription>Your mood and energy levels over the last {chartData.length} entries</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        mood: {
                            label: "Mood Score",
                            color: "hsl(var(--chart-1))",
                        },
                        energy: {
                            label: "Energy Level",
                            color: "hsl(var(--chart-2))",
                        },
                    }}
                    className="h-[300px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="date" className="text-xs" />
                            <YAxis domain={[0, 10]} className="text-xs" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="mood"
                                stroke="var(--color-mood)"
                                strokeWidth={2}
                                dot={{ fill: "var(--color-mood)", strokeWidth: 2, r: 4 }}
                                name="Mood Score"
                            />
                            <Line
                                type="monotone"
                                dataKey="energy"
                                stroke="var(--color-energy)"
                                strokeWidth={2}
                                dot={{ fill: "var(--color-energy)", strokeWidth: 2, r: 4 }}
                                name="Energy Level"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
