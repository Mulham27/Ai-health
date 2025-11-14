"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { Label } from "@radix-ui/react-label";
import { Lock, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { api } from "../../lib/api"
import { z } from "zod"
import { toast } from "sonner"

const resetSchema = z.object({ 
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"), 
    confirmPassword: z.string().min(1, "Confirm password is required") 
}).refine((d) => d.password === d.confirmPassword, { 
    message: "Passwords do not match", 
    path: ["confirmPassword"] 
})

export function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({})
    const [touched, setTouched] = useState<{ password?: boolean; confirmPassword?: boolean }>({})
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token") || ""

    useEffect(() => {
        if (!token) {
            toast.error("Invalid reset link. Please request a new one.")
            navigate("/forgot-password")
        }
    }, [token, navigate])

    const validatePassword = (value: string) => {
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

    const handleBlur = (field: "password" | "confirmPassword") => {
        setTouched(prev => ({ ...prev, [field]: true }))
        if (field === "password") validatePassword(password)
        else if (field === "confirmPassword") validateConfirmPassword()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({ password: true, confirmPassword: true })
        setMessage("")

        const parsed = resetSchema.safeParse({ password, confirmPassword })
        if (!parsed.success) {
            const fe: { password?: string; confirmPassword?: string } = {}
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
            const res = await api.post("/auth/reset-password", { token, password })
            const msg = res.data?.message || "Password reset successfully."
            setMessage(msg)
            toast.success("Password reset successfully! Redirecting to login...")
            setTimeout(() => navigate("/login"), 2000)
        } catch (err: any) {
            const message = err?.response?.data?.error || "Invalid or expired link."
            setFieldErrors({ password: message, confirmPassword: message })
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    const isFormValid = password && confirmPassword && !fieldErrors.password && !fieldErrors.confirmPassword

    if (!token) {
        return null
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
            <div className="w-full max-w-md space-y-6">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl">Reset Password</CardTitle>
                        <CardDescription>Enter your new password below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {message && (
                                <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-800 text-sm">
                                    {message}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input 
                                        id="password" 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="Enter your new password"
                                        value={password} 
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            if (touched.password) validatePassword(e.target.value)
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

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input 
                                        id="confirmPassword" 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        placeholder="Re-enter your new password"
                                        value={confirmPassword} 
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value)
                                            if (touched.confirmPassword) validateConfirmPassword()
                                        }}
                                        onBlur={() => handleBlur("confirmPassword")}
                                        className={`pl-10 pr-12 h-11 ${fieldErrors.confirmPassword && touched.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
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
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link 
                                to="/login" 
                                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ResetPasswordPage
