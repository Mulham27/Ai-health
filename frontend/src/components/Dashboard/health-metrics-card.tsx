import { Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";
import { Progress} from "../ui/progress.tsx";
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface HealthMetricsCardProps {
    title: string
    value: string | number
    description: string
    progress?: number
    trend?: "up" | "down" | "stable"
    trendValue?: string
    icon: LucideIcon
    iconColor: string
}

export function HealthMetricsCard({
                                      title,
                                      value,
                                      description,
                                      progress,
                                      trend,
                                      trendValue,
                                      icon: Icon,
                                      iconColor,
                                  }: HealthMetricsCardProps) {
    const getTrendIcon = () => {
        switch (trend) {
            case "up":
                return <TrendingUp className="w-4 h-4 text-green-500" />
            case "down":
                return <TrendingDown className="w-4 h-4 text-red-500" />
            default:
                return <Minus className="w-4 h-4 text-muted-foreground" />
        }
    }

    const getTrendColor = () => {
        switch (trend) {
            case "up":
                return "text-green-500"
            case "down":
                return "text-red-500"
            default:
                return "text-muted-foreground"
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${iconColor}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
                {progress !== undefined && (
                    <div className="mt-3">
                        <Progress value={progress} className="h-2" />
                    </div>
                )}
                {trend && trendValue && (
                    <div className="flex items-center space-x-1 mt-2">
                        {getTrendIcon()}
                        <span className={`text-xs font-medium ${getTrendColor()}`}>{trendValue}</span>
                        <span className="text-xs text-muted-foreground">from last week</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
