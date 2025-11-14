"use client"

import { Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";
import { Badge} from "../ui/badge.tsx";
import { Button } from "../ui/button.tsx";
import { Apple, Moon, Activity, Brain, Heart, CheckCircle, X, Lightbulb, Target } from "lucide-react"
import type { Suggestion } from "../../types"

interface SuggestionCardProps {
    suggestion: Suggestion
    onAccept?: (suggestionId: string) => void
    onDismiss?: (suggestionId: string) => void
}

export function SuggestionCard({ suggestion, onAccept, onDismiss }: SuggestionCardProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case "nutrition":
                return Apple
            case "sleep":
                return Moon
            case "exercise":
                return Activity
            case "mindfulness":
                return Brain
            default:
                return Heart
        }
    }

    const getIconColor = (type: string) => {
        switch (type) {
            case "nutrition":
                return "text-green-500"
            case "sleep":
                return "text-blue-500"
            case "exercise":
                return "text-orange-500"
            case "mindfulness":
                return "text-purple-500"
            default:
                return "text-red-500"
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            case "medium":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            default:
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        }
    }

    const Icon = getIcon(suggestion.type)

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon className={`w-5 h-5 ${getIconColor(suggestion.type)}`} />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-medium capitalize">{suggestion.type} Recommendation</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getPriorityColor(suggestion.priority)} variant="secondary">
                                    {suggestion.priority} priority
                                </Badge>
                                <Lightbulb className="w-3 h-3 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed">{suggestion.content}</p>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">AI-powered suggestion</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDismiss?.(suggestion.id)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => onAccept?.(suggestion.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Try This
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
