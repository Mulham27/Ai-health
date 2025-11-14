"use client"

import { Link } from "react-router-dom"
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card.tsx";
import { DailyRecommendations } from "../components/Suggestions/daily-recomandations.tsx";
import { HealthInsights } from "../components/Ai/health-insights.tsx";
import { Brain, Heart, BarChart3, Users, Shield, Zap, ArrowRight, CheckCircle } from "lucide-react"
import { useHealthStore } from "../lib/store"

export function HomePage() {
    const { user } = useHealthStore()

    const features = [
        {
            icon: Brain,
            title: "AI Health Analysis",
            description: "Get personalized insights from your daily journal entries using advanced AI technology.",
        },
        {
            icon: BarChart3,
            title: "Health Analytics",
            description: "Track your mood, energy, and wellness trends with beautiful, easy-to-understand charts.",
        },
        {
            icon: Users,
            title: "Anonymous Community",
            description: "Connect with others on similar health journeys while maintaining complete privacy.",
        },
        {
            icon: Shield,
            title: "Privacy First",
            description: "Your health data is encrypted and secure. You control what you share and with whom.",
        },
    ]

    const benefits = [
        "Personalized health recommendations",
        "Daily motivation and reminders",
        "Trend analysis and insights",
        "Anonymous peer support",
        "Smart notifications",
        "Progress tracking",
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 health-gradient opacity-10" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
                            Your AI-Powered
                            <span className="text-transparent bg-clip-text health-gradient block">Health Assistant</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
                            Transform your daily health habits with personalized AI insights, track your wellness journey, and connect
                            with a supportive community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {user ? (
                                <Button size="lg" asChild>
                                    <Link to="/journal">
                                        Start Journaling
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button size="lg" asChild>
                                        <Link to="/signup">
                                            Get Started Free
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="lg" asChild>
                                        <Link to="/login">Sign In</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {user && (
                <section className="py-12 bg-card/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-8">
                            <DailyRecommendations />
                            <HealthInsights />
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="py-24 bg-card/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Powerful Features for Better Health</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to understand, track, and improve your daily wellness
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="mx-auto w-12 h-12 wellness-gradient rounded-xl flex items-center justify-center mb-4">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">{feature.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Why Choose HealthAI?</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Our AI-powered platform combines cutting-edge technology with human-centered design to help you build
                                lasting healthy habits.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-foreground">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 wellness-gradient opacity-20 rounded-2xl" />
                            <Card className="relative">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 health-gradient rounded-lg flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle>Daily Health Insight</CardTitle>
                                            <CardDescription>AI Analysis Result</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-2">Today's Entry:</p>
                                        <p className="text-foreground">
                                            "Feeling energetic today after a good night's sleep. Had a healthy breakfast and went for a
                                            morning walk."
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Mood Score</span>
                                            <span className="text-green-500 font-semibold">8.5/10</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Energy Level</span>
                                            <span className="text-blue-500 font-semibold">9.0/10</span>
                                        </div>
                                        <div className="p-3 bg-primary/10 rounded-lg">
                                            <p className="text-sm text-primary font-medium">
                                                💡 Keep up the great routine! Consider adding some stretching to maintain this energy level
                                                throughout the day.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-card">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Transform Your Health?</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Join thousands of users who are already improving their wellness with AI-powered insights and personalized
                        recommendations.
                    </p>
                    {!user && (
                        <Button size="lg" asChild>
                            <Link to="/signup">
                                Start Your Journey Today
                                <Heart className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    )}
                </div>
            </section>
        </div>
    )
}
