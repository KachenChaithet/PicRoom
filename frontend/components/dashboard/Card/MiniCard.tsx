import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
interface MiniCardProps {
    title: string
    value: number
    percent: number
}
const MiniCard = ({ percent, title, value }: MiniCardProps) => {
    return (
        <Card className="@container/card ">
            <CardHeader>
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-h1 font-semibold">{value}</CardTitle>
                <CardAction>
                    <Badge variant="outline">
                        <TrendingUp />
                        +{percent}%
                    </Badge>

                </CardAction>

            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    Trending up this month <TrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                    Visitors for the last 6 months
                </div>
            </CardFooter>

        </Card>
    )
}
export default MiniCard