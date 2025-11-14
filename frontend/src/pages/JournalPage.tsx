"use client"

import { useState } from "react"
import { JournalForm } from "../components/Journal/journal-form.tsx"
import { EntryList} from "../components/Journal/entry-list.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger} from "../components/ui/tabs.tsx";
import { BookOpen, List, TrendingUp, Brain } from "lucide-react"
import { useHealthStore } from "../lib/store"
import type { HealthEntry } from "../types"

export function JournalPage() {
    const { user, entries } = useHealthStore()
    const [activeTab, setActiveTab] = useState("write")

    const handleEntryAdded = (entry: HealthEntry) => {
        // Switch to entries tab after adding an entry
        setActiveTab("entries")
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Sign In Required</CardTitle>
                        <CardDescription>Please sign in to access your health journal.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    const recentEntries = entries.slice(0, 3)
    const averageMood = entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.moodScore, 0) / entries.length : 0
    const averageEnergy =
        entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.energyScore, 0) / entries.length : 0

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Health Journal</h1>
                    <p className="text-muted-foreground">
                        Track your daily wellness and get AI-powered insights to improve your health journey.
                    </p>
                </div>

                {/* Quick Stats */}
                {entries.length > 0 && (
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-2">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    <span className="text-2xl font-bold text-foreground">{entries.length}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Average Mood</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                    <span className="text-2xl font-bold text-foreground">{averageMood.toFixed(1)}/10</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Average Energy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-2">
                                    <Brain className="w-5 h-5 text-orange-500" />
                                    <span className="text-2xl font-bold text-foreground">{averageEnergy.toFixed(1)}/10</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="write" className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Write Entry</span>
                        </TabsTrigger>
                        <TabsTrigger value="entries" className="flex items-center space-x-2">
                            <List className="w-4 h-4" />
                            <span>View Entries ({entries.length})</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="write" className="space-y-6">
                        <JournalForm onEntryAdded={handleEntryAdded} />

                        {/* Recent Entries Preview */}
                        {recentEntries.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Recent Entries</CardTitle>
                                    <CardDescription>Your latest journal entries</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {recentEntries.map((entry) => (
                                        <div key={entry.id} className="p-4 bg-muted rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                                                <div className="flex items-center space-x-4 text-sm">
                                                    <span>Mood: {entry.moodScore}/10</span>
                                                    <span>Energy: {entry.energyScore}/10</span>
                                                </div>
                                            </div>
                                            <p className="text-foreground line-clamp-2">{entry.entryText}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="entries">
                        <EntryList />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
