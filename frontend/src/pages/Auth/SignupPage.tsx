"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { Heart, Mail, Lock, User, AlertCircle } from "lucide-react"
import { useHealthStore } from "../../lib/store"
import { api } from "../../lib/api"
import { z } from "zod"
import { toast } from "sonner"

const signupSchema = z.object({
    name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export function SignupPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({})
    const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; password?: boolean; confirmPassword?: boolean }>({})
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { setUser } = useHealthStore()

    const validateField = (field: "name" | "email" | "password", value: string) => {
        if (field === "name") {
            const result = z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters").safeParse(value)
            if (!result.success) {
                setFieldErrors(prev => ({ ...prev, name: result.error.errors[0]?.message }))
            } else {
                setFieldErrors(prev => {
                    const next = { ...prev }
                    delete next.name
                    return next
                })
            }
        } else if (field === "email") {
            const result = z.string().min(1, "Email is required").email("Please enter a valid email address").safeParse(value)
            if (!result.success) {
                setFieldErrors(prev => ({ ...prev, email: result.error.errors[0]?.message }))
            } else {
                setFieldErrors(prev => {
                    const next = { ...prev }
                    delete next.email
                    return next
                })
            }
        } else if (field === "password") {
            const result = z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters").safeParse(value)
            if (!result.success) {
                setFieldErrors(prev => ({ ...prev, password: result.error.errors[0]?.message }))
            } else {
                setFieldErrors(prev => {
                    const next = { ...prev }
                    delete next.password
                    return next
                })
            }
            // Re-validate confirm password if it's been touched
            if (touched.confirmPassword && confirmPassword) {
                if (value !== confirmPassword) {
                    setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }))
                } else {
                    setFieldErrors(prev => {
                        const next = { ...prev }
                        delete next.confirmPassword
                        return next
                    })
                }
            }
        }
    }

    const validateConfirmPassword = () => {
        if (password !== confirmPassword) {
            setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }))
        } else {
            setFieldErrors(prev => {
                const next = { ...prev }
                delete next.confirmPassword
                return next
            })
        }
    }

    const handleBlur = (field: "name" | "email" | "password" | "confirmPassword") => {
        setTouched(prev => ({ ...prev, [field]: true }))
        if (field === "name") validateField("name", name)
        else if (field === "email") validateField("email", email)
        else if (field === "password") validateField("password", password)
        else if (field === "confirmPassword") validateConfirmPassword()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({ name: true, email: true, password: true, confirmPassword: true })

        const parsed = signupSchema.safeParse({ name, email, password, confirmPassword })
        if (!parsed.success) {
            const fe: { name?: string; email?: string; password?: string; confirmPassword?: string } = {}
            for (const issue of parsed.error.issues) {
                const path = issue.path[0] as keyof typeof fe | undefined
                if (path) fe[path] = issue.message
            }
            setFieldErrors(fe)
            toast.error("Please fix the errors below")
            return
        }
        setFieldErrors({})
        setIsLoading(true)

        try {
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
            toast.success("Account created successfully! Welcome to HealthAI")
            navigate("/")
        } catch (err: any) {
            const status = err?.response?.status
            const payload = err?.response?.data
            if (payload?.error?.fieldErrors) {
                const fe: { name?: string; email?: string; password?: string; confirmPassword?: string } = {}
                const fieldErrors = payload.error.fieldErrors
                if (Array.isArray(fieldErrors.name) && fieldErrors.name[0]) fe.name = fieldErrors.name[0]
                if (Array.isArray(fieldErrors.email) && fieldErrors.email[0]) fe.email = fieldErrors.email[0]
                if (Array.isArray(fieldErrors.password) && fieldErrors.password[0]) fe.password = fieldErrors.password[0]
                setFieldErrors(fe)
                toast.error("Please fix the errors below")
            } else if (status === 409) {
                setFieldErrors({ email: payload?.error || "Email already in use" })
                toast.error("This email is already registered")
            } else {
                const message = payload?.error || "Registration failed. Please try again."
                toast.error(message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const isFormValid = name && email && password && confirmPassword && 
        !fieldErrors.name && !fieldErrors.email && !fieldErrors.password && !fieldErrors.confirmPassword

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Join HealthAI
                    </h2>
                    <p className="text-muted-foreground">Start your personalized health journey today</p>
                </div>

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl">Create Account</CardTitle>
                        <CardDescription>Sign up to get AI-powered health insights and recommendations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value)
                                            if (touched.name) validateField("name", e.target.value)
                                        }}
                                        onBlur={() => handleBlur("name")}
                                        className={`pl-10 h-11 ${fieldErrors.name && touched.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    />
                                </div>
                                {fieldErrors.name && touched.name && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {fieldErrors.name}
                                    </p>
                                )}
                            </div>

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
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            if (touched.password) validateField("password", e.target.value)
                                        }}
                                        onBlur={() => handleBlur("password")}
                                        className={`pl-10 h-11 ${fieldErrors.password && touched.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    />
                                </div>
                                {fieldErrors.password && touched.password && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {fieldErrors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Re-enter your password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value)
                                            if (touched.confirmPassword) validateConfirmPassword()
                                        }}
                                        onBlur={() => handleBlur("confirmPassword")}
                                        className={`pl-10 h-11 ${fieldErrors.confirmPassword && touched.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    />
                                </div>
                                {fieldErrors.confirmPassword && touched.confirmPassword && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {fieldErrors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md" 
                                disabled={isLoading || !isFormValid}
                            >
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
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
