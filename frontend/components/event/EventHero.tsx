import Image from "next/image"

type EventHeroProps = {
    image: string,
    name: string,
    date: string,
    location: string,
    isLive?: boolean
}

const EventHero = ({ date, image, location, name, isLive }: EventHeroProps) => {
    
    return (
        <div className="relative w-full h-[40vh]">
            <Image src={image} alt={name} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-6 left-6 text-white space-y-2">
                {isLive && (
                    <span className="text-xs font-semibold tracking-widest text-green-400">
                        LIVE GALLERY
                    </span>
                )}
                <h1 className="text-4xl font-bold">{name}</h1>
                <div className="flex items-center gap-4 text-sm text-white/80">
                    <span>📅 {date}</span>
                    <span>📍 {location}</span>
                </div>
            </div>
        </div>
    )
}
export default EventHero