"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader} from "../ui/card.tsx";
import { Button} from "../ui/button.tsx";
import { Badge } from "../ui/badge.tsx";
import { Avatar, AvatarFallback } from "../ui/avatar.tsx";
import { Heart, MessageCircle, Clock, User, Shield } from "lucide-react"
import type { CommunityPost } from "../../types"

interface PostCardProps {
    post: CommunityPost
    onLike?: (postId: string) => void
    onReply?: (postId: string) => void
    showReplies?: boolean
}

export function PostCard({ post, onLike, onReply, showReplies = true }: PostCardProps) {
    const [isLiked, setIsLiked] = useState(false)
    const [localLikes, setLocalLikes] = useState(post.likes)

    const handleLike = () => {
        setIsLiked(!isLiked)
        setLocalLikes(isLiked ? localLikes - 1 : localLikes + 1)
        onLike?.(post.id)
    }

    const formatTimeAgo = (date: Date) => {
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return "Just now"
        if (diffInHours < 24) return `${diffInHours}h ago`
        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 7) return `${diffInDays}d ago`
        return `${Math.floor(diffInDays / 7)}w ago`
    }

    const getAvatarColor = (isAnonymous: boolean) => {
        return isAnonymous ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Avatar className={getAvatarColor(post.isAnonymous)}>
                            <AvatarFallback>
                                {post.isAnonymous ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                {post.isAnonymous ? "Anonymous Member" : "Community Member"}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimeAgo(post.createdAt)}</span>
                                {post.isAnonymous && (
                                    <Badge variant="secondary" className="text-xs">
                                        Anonymous
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Post Content */}
                <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLike}
                            className={`flex items-center space-x-2 ${
                                isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                            <span>{localLikes}</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onReply?.(post.id)}
                            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.replies.length}</span>
                        </Button>
                    </div>
                </div>

                {/* Replies */}
                {showReplies && post.replies.length > 0 && (
                    <div className="space-y-3 pl-4 border-l-2 border-muted">
                        {post.replies.slice(0, 3).map((reply) => (
                            <div key={reply.id} className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Avatar className={`w-6 h-6 ${getAvatarColor(reply.isAnonymous)}`}>
                                        <AvatarFallback className="text-xs">
                                            {reply.isAnonymous ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-medium text-foreground">
                    {reply.isAnonymous ? "Anonymous" : "Member"}
                  </span>
                                    <span className="text-xs text-muted-foreground">{formatTimeAgo(reply.createdAt)}</span>
                                </div>
                                <p className="text-sm text-foreground pl-8">{reply.content}</p>
                            </div>
                        ))}
                        {post.replies.length > 3 && (
                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                                View {post.replies.length - 3} more replies
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
