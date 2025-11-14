"use client"

import { useState, useEffect } from "react"
import { PostCard } from "./post-card"
import { Button} from "../ui/button.tsx";
import { Input} from "../ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@radix-ui/react-select";
import { Search, Filter, TrendingUp, Clock, Heart } from "lucide-react"
import type { CommunityPost } from "../../types"

interface CommunityFeedProps {
    posts: CommunityPost[]
    onLike?: (postId: string) => void
    onReply?: (postId: string) => void
}

export function CommunityFeed({ posts, onLike, onReply }: CommunityFeedProps) {
    const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>(posts)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("recent")

    useEffect(() => {
        let filtered = [...posts]

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter((post) => post.content.toLowerCase().includes(searchTerm.toLowerCase()))
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "popular":
                    return b.likes - a.likes
                case "discussed":
                    return b.replies.length - a.replies.length
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
        })

        setFilteredPosts(filtered)
    }, [posts, searchTerm, sortBy])

    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
                <p className="text-muted-foreground">Be the first to share with the community!</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search community posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recent">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>Most Recent</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="popular">
                            <div className="flex items-center space-x-2">
                                <Heart className="w-4 h-4" />
                                <span>Most Liked</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="discussed">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4" />
                                <span>Most Discussed</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredPosts.length} of {posts.length} posts
                </p>
            </div>

            {/* Post Feed */}
            <div className="space-y-6">
                {filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} onLike={onLike} onReply={onReply} />
                ))}
            </div>

            {filteredPosts.length === 0 && posts.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No posts match your search.</p>
                    <Button variant="outline" onClick={() => setSearchTerm("")} className="mt-4">
                        Clear Search
                    </Button>
                </div>
            )}
        </div>
    )
}
