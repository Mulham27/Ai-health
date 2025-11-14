"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { AlertDialog, AlertDialogDescription} from "@radix-ui/react-alert-dialog";
import { Heart, Mail, Lock, User, AlertCircle } from "lucide-react"
import { useHealthStore } from "../../lib/store"
import { api } from "../../lib/api"
import { z } from "zod"
import { toast } from "sonner"

export function SignupPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({})
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { setUser } = useHealthStore()
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const schema = z.object({
                name: z.string().min(1),
                email: z.string().email(),
                password: z.string().min(6),
                confirmPassword: z.string().min(6),
            }).refine((data) => data.password === data.confirmPassword, {
                message: "Passwords do not match",
                path: ["confirmPassword"],
            })

            const parsed = schema.safeParse({ name, email, password, confirmPassword })
            if (!parsed.success) {
                const fe: { name?: string; email?: string; password?: string; confirmPassword?: string } = {}
                for (const issue of parsed.error.issues) {
                    const path = issue.path[0] as keyof typeof fe | undefined
                    if (path) fe[path] = issue.message
                }
                setFieldErrors(fe)
                setError("Please fix the errors below")
                return
            }
            setFieldErrors({})

            const response = await api.post("/auth/register", { name, email, password })
            const { token, user } = response.data
            localStorage.setItem("auth-token", token)
            setUser({
                id: user.id,
                email: user.email,
                name: user.name,
                preferences: {
                    notifications: true,
                    reminderTime: "09:00",
                    goals: [],
                    privacyLevel: "private",
                },
                createdAt: new Date(),
            })
            toast.success("Account created. Welcome to HealthAI")
            navigate("/")
        } catch (err: any) {
            const status = err?.response?.status
            const payload = err?.response?.data
            // Map backend zod errors to field-level messages when available
            if (payload?.error?.fieldErrors) {
                const fe: { name?: string; email?: string; password?: string; confirmPassword?: string } = {}
                const fieldErrors = payload.error.fieldErrors
                if (Array.isArray(fieldErrors.name) && fieldErrors.name[0]) fe.name = fieldErrors.name[0]
                if (Array.isArray(fieldErrors.email) && fieldErrors.email[0]) fe.email = fieldErrors.email[0]
                if (Array.isArray(fieldErrors.password) && fieldErrors.password[0]) fe.password = fieldErrors.password[0]
                setFieldErrors(fe)
                setError("Please fix the errors below")
            } else if (status === 409) {
                // Email already in use
                setFieldErrors({ email: payload?.error || "Email already in use" })
                setError("Please fix the errors below")
            } else {
                const message = payload?.error || "Registration failed. Please try again."
                setError(message)
                toast.error(message)
            }
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
                    <h2 className="text-3xl font-bold text-foreground">Join HealthAI</h2>
                    <p className="mt-2 text-muted-foreground">Start your personalized health journey today</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create Account</CardTitle>
                        <CardDescription>Sign up to get AI-powered health insights and recommendations</CardDescription>
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
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                {fieldErrors.name && <p className="text-sm text-destructive">{fieldErrors.name}</p>}
                            </div>

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
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                {fieldErrors.password && <p className="text-sm text-destructive">{fieldErrors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                {fieldErrors.confirmPassword && <p className="text-sm text-destructive">{fieldErrors.confirmPassword}</p>}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading || !name || !email || !password || !confirmPassword}>
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/login" className="font-medium text-primary hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
