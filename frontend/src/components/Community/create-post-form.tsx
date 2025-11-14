"use client"

import type React from "react"

import { useState } from "react"
import { Button} from "../ui/button.tsx";
import { Textarea} from "../ui/textarea.tsx";
import { Label} from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card.tsx";
import { Switch} from "@radix-ui/react-switch";
import { AlertDialog , AlertDialogDescription} from "@radix-ui/react-alert-dialog";
import { Users, Shield, Send, AlertCircle } from "lucide-react"
import { useHealthStore } from "../../lib/store"
import type { CommunityPost } from "../../types"

interface CreatePostFormProps {
    onPostCreated?: (post: CommunityPost) => void
}

export function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
    const [content, setContent] = useState("")
    const [isAnonymous, setIsAnonymous] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { user } = useHealthStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !content.trim()) return

        setIsSubmitting(true)

        try {
            // Create new post
            const newPost: CommunityPost = {
                id: Date.now().toString(),
                userId: user.id,
                content: content.trim(),
                isAnonymous,
                likes: 0,
                replies: [],
                createdAt: new Date(),
            }

            onPostCreated?.(newPost)
            setContent("")
        } catch (error) {
            console.error("Failed to create post:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!user) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <AlertDialog>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDialogDescription>Please sign in to participate in the community discussions.</AlertDialogDescription>
                    </AlertDialog>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>Share with the Community</span>
                </CardTitle>
                <CardDescription>
                    Share your health journey, ask questions, or offer support to others. Your privacy is protected.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="content">What's on your mind?</Label>
                        <Textarea
                            id="content"
                            placeholder="Share your thoughts, experiences, questions, or offer support to others in the community..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[120px] resize-none"
                            maxLength={1000}
                            required
                        />
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">{content.length}/1000 characters</p>
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Shield className="w-5 h-5 text-primary" />
                            <div>
                                <Label htmlFor="anonymous" className="text-sm font-medium">
                                    Post Anonymously
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Your identity will be hidden from other community members
                                </p>
                            </div>
                        </div>
                        <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                    </div>

                    {/* Community Guidelines */}
                    <AlertDialog>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDialogDescription className="text-xs">
                            Please be respectful and supportive. Share experiences, not medical advice. Report inappropriate content.
                        </AlertDialogDescription>
                    </AlertDialog>

                    <Button type="submit" className="w-full" disabled={isSubmitting || !content.trim()}>
                        {isSubmitting ? (
                            "Posting..."
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Share Post
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
