"use client"

import type React from "react"

import { useState } from "react"
import { Button} from "../ui/button.tsx";
import { Textarea} from "../ui/textarea.tsx";
import { Label} from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card.tsx";
import { Slider } from "@radix-ui/react-slider";
import { Input} from "../ui/input.tsx";
import { Brain, Heart, Moon, Activity, Loader2 } from "lucide-react"
import { useHealthStore } from "../../lib/store"
import { localHealthService } from "../../services/localHealthService"
import type { HealthEntry } from "../../types"

interface JournalFormProps {
    onEntryAdded?: (entry: HealthEntry) => void
}

export function JournalForm({ onEntryAdded }: JournalFormProps) {
    const [entryText, setEntryText] = useState("")
    const [moodScore, setMoodScore] = useState([7])
    const [energyScore, setEnergyScore] = useState([7])
    const [sleepHours, setSleepHours] = useState("7.5")
    const [steps, setSteps] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { user, addEntry } = useHealthStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !entryText.trim()) return

        setIsSubmitting(true)

        try {
            // Get AI analysis
            const aiAnalysis = await localHealthService.analyzeEntry(entryText)

            // Create new entry
            const newEntry: HealthEntry = {
                id: Date.now().toString(),
                userId: user.id,
                entryText: entryText.trim(),
                moodScore: moodScore[0],
                energyScore: energyScore[0],
                sleepHours: Number.parseFloat(sleepHours),
                steps: steps ? Number.parseInt(steps) : undefined,
                createdAt: new Date(),
                aiAnalysis,
            }

            // Add to store
            addEntry(newEntry)
            onEntryAdded?.(newEntry)

            // Reset form
            setEntryText("")
            setMoodScore([7])
            setEnergyScore([7])
            setSleepHours("7.5")
            setSteps("")
        } catch (error) {
            console.error("Failed to create entry:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <span>Daily Health Journal</span>
                </CardTitle>
                <CardDescription>
                    Share how you're feeling today. Our AI will analyze your entry and provide personalized insights.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Journal Entry */}
                    <div className="space-y-2">
                        <Label htmlFor="entry">How are you feeling today?</Label>
                        <Textarea
                            id="entry"
                            placeholder="Describe your mood, energy level, sleep quality, activities, or anything else about your day..."
                            value={entryText}
                            onChange={(e) => setEntryText(e.target.value)}
                            className="min-h-[120px] resize-none"
                            required
                        />
                        <p className="text-xs text-muted-foreground">{entryText.length}/500 characters</p>
                    </div>

                    {/* Health Metrics */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Mood Score */}
                        <div className="space-y-3">
                            <Label className="flex items-center space-x-2">
                                <Heart className="w-4 h-4 text-red-500" />
                                <span>Mood Score: {moodScore[0]}/10</span>
                            </Label>
                            <Slider value={moodScore} onValueChange={setMoodScore} max={10} min={1} step={1} className="w-full" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Poor</span>
                                <span>Excellent</span>
                            </div>
                        </div>

                        {/* Energy Score */}
                        <div className="space-y-3">
                            <Label className="flex items-center space-x-2">
                                <Activity className="w-4 h-4 text-orange-500" />
                                <span>Energy Level: {energyScore[0]}/10</span>
                            </Label>
                            <Slider value={energyScore} onValueChange={setEnergyScore} max={10} min={1} step={1} className="w-full" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Exhausted</span>
                                <span>Energetic</span>
                            </div>
                        </div>
                    </div>

                    {/* Sleep and Steps */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="sleep" className="flex items-center space-x-2">
                                <Moon className="w-4 h-4 text-blue-500" />
                                <span>Sleep Hours</span>
                            </Label>
                            <Input
                                id="sleep"
                                type="number"
                                step="0.5"
                                min="0"
                                max="24"
                                value={sleepHours}
                                onChange={(e) => setSleepHours(e.target.value)}
                                placeholder="7.5"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="steps" className="flex items-center space-x-2">
                                <Activity className="w-4 h-4 text-green-500" />
                                <span>Steps (optional)</span>
                            </Label>
                            <Input
                                id="steps"
                                type="number"
                                min="0"
                                value={steps}
                                onChange={(e) => setSteps(e.target.value)}
                                placeholder="8000"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting || !entryText.trim()}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Analyzing with AI...
                            </>
                        ) : (
                            "Save Entry & Get AI Insights"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
