"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { Label } from "@radix-ui/react-label";
import { Mail, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react"
import { api } from "../../lib/api"
import { z } from "zod"
import { toast } from "sonner"

const emailSchema = z.string().min(1, "Email is required").email("Please enter a valid email address")

export function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({})
    const [touched, setTouched] = useState<{ email?: boolean }>({})
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const validateEmail = (value: string) => {
        const result = emailSchema.safeParse(value)
        if (!result.success) {
            setFieldErrors({ email: result.error.errors[0]?.message })
        } else {
            setFieldErrors({})
        }
    }

    const handleBlur = () => {
        setTouched({ email: true })
        validateEmail(email)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({ email: true })
        setSuccess(false)

        const result = emailSchema.safeParse(email)
        if (!result.success) {
            setFieldErrors({ email: result.error.errors[0]?.message })
            toast.error("Please enter a valid email address")
            return
        }
        setFieldErrors({})
        setIsLoading(true)

        try {
            const res = await api.post("/auth/forgot-password", { email })
            const msg = res.data?.message || "If that email exists, a reset email has been sent."
            setSuccess(true)
            toast.success("Reset link sent! Check your email.")
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate("/login")
            }, 3000)
        } catch (err: any) {
            const status = err?.response?.status
            const errorData = err?.response?.data?.error
            
            if (status === 404 || errorData?.includes("not found") || errorData?.includes("doesn't exist")) {
                const errorMsg = "No account found with this email address"
                setFieldErrors({ email: errorMsg })
                toast.error(errorMsg)
            } else {
                const message = errorData || "Something went wrong. Please try again."
                setFieldErrors({ email: message })
                toast.error(message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const isFormValid = email && !fieldErrors.email

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
            <div className="w-full max-w-md space-y-6">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl">Forgot Password</CardTitle>
                        <CardDescription>
                            Enter your email address and we'll send you a link to reset your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-md bg-green-50 border border-green-200">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-green-800">
                                                Reset link sent!
                                            </p>
                                            <p className="text-sm text-green-700 mt-1">
                                                Check your email for instructions. Redirecting to login...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    onClick={() => navigate("/login")}
                                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md"
                                >
                                    Go to Login
                                </Button>
                            </div>
                        ) : (
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
                                                if (touched.email) validateEmail(e.target.value)
                                            }}
                                            onBlur={handleBlur}
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

                                <Button 
                                    type="submit" 
                                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md" 
                                    disabled={isLoading || !isFormValid}
                                >
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </form>
                        )}

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

export default ForgotPasswordPage
