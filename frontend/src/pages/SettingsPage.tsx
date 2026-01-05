"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button.tsx"
import { Input } from "../components/ui/input.tsx"
import { Label } from "@radix-ui/react-label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.tsx"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar.tsx"
import { useHealthStore } from "../lib/store"
import { api } from "../lib/api"
import { toast } from "sonner"
import { User, Camera, Save, ArrowLeft } from "lucide-react"
import { z } from "zod"

const profileSchema = z.object({
    name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
})

export function SettingsPage() {
    const { user, setUser } = useHealthStore()
    const navigate = useNavigate()
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [avatar, setAvatar] = useState(user?.avatar || "")
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({})
    const [isLoading, setIsLoading] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    if (!user) {
        navigate("/login")
        return null
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB")
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                setAvatarPreview(result)
                setAvatar(result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const parsed = profileSchema.safeParse({ name, email })
        if (!parsed.success) {
            const fe: { name?: string; email?: string } = {}
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
            // In a real app, you'd have a PATCH /api/auth/me endpoint
            // For now, we'll just update the local store
            const updatedUser = {
                ...user,
                name,
                email,
                avatar: avatar || user.avatar,
            }
            setUser(updatedUser)
            toast.success("Profile updated successfully")
        } catch (err: any) {
            const message = err?.response?.data?.error || "Failed to update profile"
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Settings
                    </h1>
                </div>

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Profile Settings</CardTitle>
                        <CardDescription>Update your profile information and avatar</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                        <AvatarImage src={avatarPreview || avatar || undefined} alt={name} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                                            {getInitials(name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-md"
                                    >
                                        <Camera className="h-4 w-4" />
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-sm text-muted-foreground text-center">
                                    Click the camera icon to upload a new avatar
                                </p>
                            </div>

                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value)
                                        if (fieldErrors.name) {
                                            setFieldErrors((prev) => {
                                                const next = { ...prev }
                                                delete next.name
                                                return next
                                            })
                                        }
                                    }}
                                    className={`h-11 ${fieldErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                />
                                {fieldErrors.name && (
                                    <p className="text-sm text-destructive">{fieldErrors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (fieldErrors.email) {
                                            setFieldErrors((prev) => {
                                                const next = { ...prev }
                                                delete next.email
                                                return next
                                            })
                                        }
                                    }}
                                    className={`h-11 ${fieldErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                />
                                {fieldErrors.email && (
                                    <p className="text-sm text-destructive">{fieldErrors.email}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setName(user.name)
                                        setEmail(user.email)
                                        setAvatar(user.avatar || "")
                                        setAvatarPreview(null)
                                        setFieldErrors({})
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                    disabled={isLoading}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

