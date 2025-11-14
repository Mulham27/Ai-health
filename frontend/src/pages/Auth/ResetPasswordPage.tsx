"use client"

import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { Label } from "@radix-ui/react-label";
import { AlertDialog, AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { Lock } from "lucide-react"
import { api } from "../../lib/api"
import { z } from "zod"
import { toast } from "sonner"

export function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({})
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const token = params.get("token") || ""
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setIsLoading(true)
        try {
            const schema = z.object({ password: z.string().min(6), confirmPassword: z.string().min(6) })
                .refine((d) => d.password === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] })
            const parsed = schema.safeParse({ password, confirmPassword })
            if (!parsed.success) {
                const fe: { password?: string; confirmPassword?: string } = {}
                for (const issue of parsed.error.issues) {
                    const path = issue.path[0] as keyof typeof fe | undefined
                    if (path) fe[path] = issue.message
                }
                setFieldErrors(fe)
                setError("Please fix the errors below")
                return
            }
            setFieldErrors({})
            const res = await api.post("/auth/reset-password", { token, password })
            const msg = res.data?.message || "Password reset successfully."
            setMessage(msg)
            toast.success(msg)
            setTimeout(() => navigate("/login"), 1200)
        } catch (err: any) {
            const message = err?.response?.data?.error || "Invalid or expired link."
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
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>Enter your new password below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {(error || message) && (
                                <AlertDialog>
                                    <AlertDialogDescription>{error || message}</AlertDialogDescription>
                                </AlertDialog>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
                                </div>
                                {fieldErrors.password && <p className="text-sm text-destructive">{fieldErrors.password}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" required />
                                </div>
                                {fieldErrors.confirmPassword && <p className="text-sm text-destructive">{fieldErrors.confirmPassword}</p>}
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading || !password || !confirmPassword}>{isLoading ? "Resetting..." : "Reset Password"}</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ResetPasswordPage


