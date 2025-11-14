import { Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";
import { Users, MessageCircle, Heart, TrendingUp } from "lucide-react"
import type { CommunityPost } from "../../types"

interface CommunityStatsProps {
    posts: CommunityPost[]
}

export function CommunityStats({ posts }: CommunityStatsProps) {
    const totalPosts = posts.length
    const totalReplies = posts.reduce((sum, post) => sum + post.replies.length, 0)
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0)
    const activeMembers = new Set(posts.map((post) => post.userId)).size

    const stats = [
        {
            title: "Active Members",
            value: activeMembers,
            icon: Users,
            color: "text-blue-500",
        },
        {
            title: "Total Posts",
            value: totalPosts,
            icon: MessageCircle,
            color: "text-green-500",
        },
        {
            title: "Total Replies",
            value: totalReplies,
            icon: TrendingUp,
            color: "text-orange-500",
        },
        {
            title: "Total Likes",
            value: totalLikes,
            icon: Heart,
            color: "text-red-500",
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <Icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
