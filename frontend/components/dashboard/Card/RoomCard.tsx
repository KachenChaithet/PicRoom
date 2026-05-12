import Image from "next/image"
import { Card, CardContent } from "../../ui/card"
import { Calendar, Link, Settings } from "lucide-react"

interface RoomCardProps {
    image: string
    title: string
    location: string
    date: string
    isLive?: boolean
    guestCount?: number
}
const RoomCard = ({ date, image, location, title, guestCount, isLive }: RoomCardProps) => {
    return (
        <div className=" overflow-hidden w-full border rounded-2xl border-muted bg-accent  ">
            <div className="relative h-48 ">
                <Image src={image} alt={title} fill className="object-cover brightness-75 " />
            </div>
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-lg">{title}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                            <Calendar className="size-3" />
                            <p>{date}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 text-muted-foreground">
                        <Settings className="size-4 cursor-pointer hover:text-foreground" />
                        <Link className="size-4 cursor-pointer hover:text-foreground" />
                    </div>
                </div>

                <div className="flex gap-8 pt-2">
                    <div>
                        <p className="text-xs text-muted-foreground font-mono">OBJECT_COUNT</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-mono">AUTH_ID</p>
                    </div>
                </div>
            </CardContent>
        </div>
    )
}
export default RoomCard