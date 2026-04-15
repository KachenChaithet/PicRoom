import { ArrowRight, MagnetIcon } from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"

const UpcomingEventCard = () => {
    return (
        <Card className="p-4 flex flex-col gap-3 h-full">
            <div className="flex justify-between items-center">
                <span className="bg-primary/10 p-3 rounded-full text-primary">
                    <MagnetIcon className="size-5" />
                </span>
                <Badge variant="secondary">Upcoming</Badge>
            </div>
            <div>
                <h2 className="font-semibold text-base">Morgenstern Wedding</h2>
                <span className="text-sm text-muted-foreground">October 12, 2024 • Lake Como</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-primary cursor-pointer hover:opacity-70 transition-opacity">
                <span className="text-sm font-medium">Complete Setup</span>
                <ArrowRight className="size-4" />
            </div>
        </Card>
    )
}
export default UpcomingEventCard