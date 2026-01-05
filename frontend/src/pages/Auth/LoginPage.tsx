"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { Heart, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useHealthStore } from "../../lib/store"
import { api } from "../../lib/api"
import { z } from "zod"
import { toast } from "sonner"

const loginSchema = z.object({ 
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"), 
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters") 
})

export function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
    const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({})
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { setUser } = useHealthStore()

    const validateField = (field: "email" | "password", value: string) => {
        const result = loginSchema.shape[field].safeParse(value)
        if (!result.success) {
            setFieldErrors(prev => ({ ...prev, [field]: result.error.errors[0]?.message }))
        } else {
            setFieldErrors(prev => {
                const next = { ...prev }
                delete next[field]
                return next
            })
        }
    }

    const handleBlur = (field: "email" | "password") => {
        setTouched(prev => ({ ...prev, [field]: true }))
        if (field === "email") validateField("email", email)
        if (field === "password") validateField("password", password)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({ email: true, password: true })
        
        const parsed = loginSchema.safeParse({ email, password })
        if (!parsed.success) {
            const fe: { email?: string; password?: string } = {}
            for (const issue of parsed.error.issues) {
                const path = issue.path[0] as "email" | "password" | undefined
                if (path) fe[path] = issue.message
            }
            setFieldErrors(fe)
            toast.error("Please fix the errors below")
            return
        }
        setFieldErrors({})
        setIsLoading(true)

        try {
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
            toast.success("Welcome back! Signed in successfully")
            navigate("/")
        } catch (err: any) {
            const status = err?.response?.status
            const errorData = err?.response?.data?.error || "Invalid credentials. Please try again."
            
            // Show specific error messages
            if (status === 401) {
                const errorMsg = typeof errorData === "string" ? errorData : "Invalid email or password"
                setFieldErrors({ 
                    email: errorMsg.includes("email") ? errorMsg : undefined,
                    password: errorMsg.includes("password") || errorMsg.includes("credentials") ? errorMsg : undefined
                })
                toast.error(errorMsg)
            } else if (status === 400) {
                const errorMsg = typeof errorData === "string" ? errorData : "Please check your input"
                setFieldErrors({ email: errorMsg })
                toast.error(errorMsg)
            } else {
                setFieldErrors({ email: errorData, password: errorData })
                toast.error(errorData)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const isFormValid = email && password && !fieldErrors.email && !fieldErrors.password

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome back
                    </h2>
                    <p className="text-muted-foreground">Sign in to continue your health journey</p>
                </div>

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl">Sign In</CardTitle>
                        <CardDescription>Enter your credentials to access your health dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            if (touched.email) validateField("email", e.target.value)
                                        }}
                                        onBlur={() => handleBlur("email")}
                                        className={`pl-10 h-11 ${fieldErrors.email && touched.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    />
                                </div>
                                {fieldErrors.email && touched.email && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {fieldErrors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            if (touched.password) validateField("password", e.target.value)
                                        }}
                                        onBlur={() => handleBlur("password")}
                                        className={`pl-10 pr-12 h-11 ${fieldErrors.password && touched.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {fieldErrors.password && touched.password && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {fieldErrors.password}
                                    </p>
                                )}
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md" 
                                disabled={isLoading || !isFormValid}
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>

                        <div className="mt-6 space-y-2 text-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                                    Sign up
                                </Link>
                            </p>
                            <p className="text-sm">
                                <Link to="/forgot-password" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
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
