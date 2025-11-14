"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { Label } from "@radix-ui/react-label";
import { AlertDialog, AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { Mail } from "lucide-react"
import { api } from "../../lib/api"
import { z } from "zod"
import { toast } from "sonner"

export function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({})
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setIsLoading(true)
        try {
            const schema = z.object({ email: z.string().email() })
            const parsed = schema.safeParse({ email })
            if (!parsed.success) {
                setFieldErrors({ email: parsed.error.issues[0]?.message || "Invalid email" })
                setError("Please enter a valid email")
                return
            }
            setFieldErrors({})
            const res = await api.post("/auth/forgot-password", { email })
            const msg = res.data?.message || "If that email exists, a reset email has been sent."
            setMessage(msg)
            toast.success(msg)
        } catch (err: any) {
            const message = err?.response?.data?.error || "Something went wrong. Please try again."
            setError(message)
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Forgot Password</CardTitle>
                        <CardDescription>Enter your email to receive a reset link</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {(error || message) && (
                                <AlertDialog>
                                    <AlertDialogDescription>{error || message}</AlertDialogDescription>
                                </AlertDialog>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                                </div>
                                {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading || !email}>{isLoading ? "Sending..." : "Send Reset Link"}</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ForgotPasswordPage


