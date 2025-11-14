
"use client"

import { useState, useEffect } from "react"
import { SuggestionCard } from "./suggestion-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card.tsx";
import { Button} from "../ui/button.tsx";
import { Badge} from "../ui/badge.tsx";
import { Brain, RefreshCw, Sparkles, TrendingUp } from "lucide-react"
import { useHealthStore } from "../../lib/store"
import { localHealthService } from "../../services/localHealthService"

export function DailyRecommendations() {
    const { user, suggestions, setSuggestions } = useHealthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [acceptedSuggestions, setAcceptedSuggestions] = useState<string[]>([])

    useEffect(() => {
        if (user && suggestions.length === 0) {
            loadSuggestions()
        }
    }, [user])

    const loadSuggestions = async () => {
        setIsLoading(true)
        try {
            const newSuggestions = await localHealthService.getSuggestions()
            setSuggestions(newSuggestions)
        } catch (error) {
            console.error("Failed to load suggestions:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAcceptSuggestion = (suggestionId: string) => {
        setAcceptedSuggestions([...acceptedSuggestions, suggestionId])
        // In a real app, this would track the user's acceptance and potentially adjust future recommendations
    }

    const handleDismissSuggestion = (suggestionId: string) => {
        setSuggestions(suggestions.filter((s) => s.id !== suggestionId))
    }

    const activeSuggestions = suggestions.filter((s) => !acceptedSuggestions.includes(s.id))

    if (!user) {
        return null
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-primary" />
                        <div>
                            <CardTitle>Daily AI Recommendations</CardTitle>
                            <CardDescription>Personalized suggestions based on your health patterns and goals</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="flex items-center space-x-1">
                            <Sparkles className="w-3 h-3" />
                            <span>AI Powered</span>
                        </Badge>
                        <Button variant="outline" size="sm" onClick={loadSuggestions} disabled={isLoading}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                            <Brain className="w-5 h-5 animate-pulse" />
                            <span>AI is analyzing your health patterns...</span>
                        </div>
                    </div>
                ) : activeSuggestions.length > 0 ? (
                    <div className="space-y-4">
                        {activeSuggestions.map((suggestion) => (
                            <SuggestionCard
                                key={suggestion.id}
                                suggestion={suggestion}
                                onAccept={handleAcceptSuggestion}
                                onDismiss={handleDismissSuggestion}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">All caught up!</h3>
                        <p className="text-muted-foreground mb-4">
                            You've reviewed all current recommendations. Check back later for new suggestions.
                        </p>
                        <Button variant="outline" onClick={loadSuggestions}>
                            Check for New Recommendations
                        </Button>
                    </div>
                )}

                {acceptedSuggestions.length > 0 && (
                    <div className="pt-4 border-t border-border">
                        <h4 className="text-sm font-medium text-foreground mb-2">
                            Accepted Recommendations ({acceptedSuggestions.length})
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            Great job taking action on your health! Keep tracking your progress in your journal.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
