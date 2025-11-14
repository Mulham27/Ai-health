"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { AlertDialog , AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { Heart, Mail, Lock, AlertCircle } from "lucide-react"
import { useHealthStore } from "../../lib/store"
import { api } from "../../lib/api"
import { z } from "zod"
import { toast } from "sonner"

export function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { setUser } = useHealthStore()
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const schema = z.object({ email: z.string().email(), password: z.string().min(6) })
            const parsed = schema.safeParse({ email, password })
            if (!parsed.success) {
                const fe: { email?: string; password?: string } = {}
                for (const issue of parsed.error.issues) {
                    const path = issue.path[0] as "email" | "password" | undefined
                    if (path) fe[path] = issue.message
                }
                setFieldErrors(fe)
                setError("Please fix the errors below")
                return
            }
            setFieldErrors({})

            const response = await api.post("/auth/login", { email, password })
            const { token, user } = response.data
            localStorage.setItem("auth-token", token)
            setUser({
                id: user.id,
                email: user.email,
                name: user.name,
                preferences: {
                    notifications: true,
                    reminderTime: "09:00",
                    goals: ["Better Sleep", "More Energy"],
                    privacyLevel: "private",
                },
                createdAt: new Date(),
            })
            toast.success("Signed in successfully")
            navigate("/")
        } catch (err: any) {
            const message = err?.response?.data?.error || "Invalid credentials. Please try again."
            setError(message)
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 health-gradient rounded-xl flex items-center justify-center mb-4">
                        <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
                    <p className="mt-2 text-muted-foreground">Sign in to continue your health journey</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>Enter your credentials to access your health dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <AlertDialog>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDialogDescription>{error}</AlertDialogDescription>
                                </AlertDialog>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                {fieldErrors.password && <p className="text-sm text-destructive">{fieldErrors.password}</p>}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading || !email || !password}>
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link to="/signup" className="font-medium text-primary hover:underline">
                                    Sign up
                                </Link>
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                <Link to="/forgot-password" className="font-medium text-primary hover:underline">
                                    Forgot your password?
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
