import Image from "next/image"
import { Card } from "../ui/card"
import { Button } from "../ui/button"

interface FeaturedEventCardProps {
    image: string
    title: string
    location: string
    isLive?: boolean
    guestCount?: number
}


const FeaturedEventCard = ({ image, location, title, guestCount, isLive }: FeaturedEventCardProps) => {
    return (
        <Card className="relative overflow-hidden aspect-video max-w-5xl max-h-600 group">
            <Image
                src={image}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105 "
                alt="featured event"
            />
            {/* dark gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

            {/* bottom content */}
            <div className="absolute bottom-0 left-0 p-5 flex flex-col gap-2">
                {/* live badge */}
                <div className="flex items-center gap-2">
                    {isLive && (
                        <span className="bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded">
                            LIVE NOW
                        </span>
                    )}
                    <span className="text-white/70 text-sm">{guestCount} Guests Active</span>
                </div>

                {/* title */}
                <h2 className="text-white text-2xl font-semibold">{title}</h2>
                <p className="text-white/70 text-sm">{location}</p>

                {/* buttons */}
                <div className="flex gap-2 mt-1">
                    <Button variant="secondary" size="sm">View Live Wall</Button>
                    <Button variant="default" size="sm" className="text-white border-white/40 hover:bg-white/10">
                        Manage Guests
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default FeaturedEventCard