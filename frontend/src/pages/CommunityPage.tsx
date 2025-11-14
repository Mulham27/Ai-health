"use client"

import { useState, useEffect } from "react"
import { CreatePostForm } from "../components/Community/create-post-form.tsx";
import { CommunityFeed } from "../components/Community/community-feed.tsx";
import { CommunityStats } from "../components/Community/community-stats.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger} from "../components/ui/tabs.tsx";
import { AlertDialog, AlertDialogDescription} from "@radix-ui/react-alert-dialog";
import { Plus, MessageCircle, Shield, Info } from "lucide-react"
import type { CommunityPost } from "../types"

export function CommunityPage() {
    const [posts, setPosts] = useState<CommunityPost[]>([])
    const [activeTab, setActiveTab] = useState("feed")

    // Mock community posts for demo
    useEffect(() => {
        const mockPosts: CommunityPost[] = [
            {
                id: "1",
                userId: "user1",
                content:
                    "Just wanted to share that I've been consistently sleeping 8 hours for the past week and my energy levels have improved dramatically! Small changes really do make a big difference. Anyone else notice how sleep affects their mood?",
                isAnonymous: true,
                likes: 12,
                replies: [
                    {
                        id: "r1",
                        userId: "user2",
                        content:
                            "Yes! I've been tracking my sleep too and noticed the same thing. What time do you usually go to bed?",
                        isAnonymous: false,
                        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    },
                    {
                        id: "r2",
                        userId: "user3",
                        content: "Sleep is so underrated. I started a bedtime routine and it's been a game changer.",
                        isAnonymous: true,
                        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
                    },
                ],
                createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
            },
            {
                id: "2",
                userId: "user2",
                content:
                    "Having a tough week with anxiety. My mood scores have been lower than usual. Does anyone have tips for managing stress during busy periods? I've been trying meditation but struggling to stay consistent.",
                isAnonymous: false,
                likes: 8,
                replies: [
                    {
                        id: "r3",
                        userId: "user4",
                        content:
                            "I find that even 5 minutes of deep breathing helps when I can't do a full meditation session. Be gentle with yourself during tough times.",
                        isAnonymous: true,
                        createdAt: new Date(Date.now() - 30 * 60 * 1000),
                    },
                ],
                createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            },
            {
                id: "3",
                userId: "user3",
                content:
                    "Celebrating a small win today! I managed to go for a 20-minute walk during my lunch break instead of scrolling on my phone. It's amazing how much better I feel when I move my body, even just a little bit.",
                isAnonymous: true,
                likes: 15,
                replies: [],
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
            {
                id: "4",
                userId: "user4",
                content:
                    "Question for the community: How do you all handle days when your energy is really low but you still have responsibilities? I'm learning to be more compassionate with myself but it's challenging.",
                isAnonymous: false,
                likes: 6,
                replies: [
                    {
                        id: "r4",
                        userId: "user1",
                        content:
                            "I try to break tasks into smaller chunks and celebrate completing each one. Sometimes just doing 10% is better than doing nothing.",
                        isAnonymous: true,
                        createdAt: new Date(Date.now() - 45 * 60 * 1000),
                    },
                    {
                        id: "r5",
                        userId: "user5",
                        content: "Rest is productive too! I've learned that pushing through exhaustion often makes things worse.",
                        isAnonymous: false,
                        createdAt: new Date(Date.now() - 20 * 60 * 1000),
                    },
                ],
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            },
        ]
        setPosts(mockPosts)
    }, [])

    const handlePostCreated = (newPost: CommunityPost) => {
        setPosts([newPost, ...posts])
        setActiveTab("feed")
    }

    const handleLike = (postId: string) => {
        setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
    }

    const handleReply = (postId: string) => {
        // In a real app, this would open a reply form
        console.log("Reply to post:", postId)
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Community Support</h1>
                    <p className="text-muted-foreground">
                        Connect with others on their health journey. Share experiences, ask questions, and offer support.
                    </p>
                </div>

                {/* Community Guidelines */}
                <AlertDialog>
                    <Info className="h-4 w-4" />
                    <AlertDialogDescription>
                        <strong>Community Guidelines:</strong> Be respectful and supportive. Share personal experiences, not medical
                        advice. Your privacy is protected - you can post anonymously. Report any inappropriate content.
                    </AlertDialogDescription>
                </AlertDialog>

                {/* Community Stats */}
                <div className="mb-8">
                    <CommunityStats posts={posts} />
                </div>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="feed" className="flex items-center space-x-2">
                            <MessageCircle className="w-4 h-4" />
                            <span>Community Feed</span>
                        </TabsTrigger>
                        <TabsTrigger value="create" className="flex items-center space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Create Post</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="feed">
                        <CommunityFeed posts={posts} onLike={handleLike} onReply={handleReply} />
                    </TabsContent>

                    <TabsContent value="create">
                        <CreatePostForm onPostCreated={handlePostCreated} />
                    </TabsContent>
                </Tabs>

                {/* Privacy Notice */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-sm">
                            <Shield className="w-4 h-4" />
                            <span>Privacy & Safety</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-xs">
                            Your privacy is our priority. Anonymous posts cannot be traced back to you. We moderate content to ensure
                            a safe, supportive environment. If you're experiencing a mental health crisis, please contact a healthcare
                            professional immediately.
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
