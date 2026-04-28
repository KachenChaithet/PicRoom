import EventHero from "@/components/event/EventHero"
import RecentSouvenirs from "@/components/event/RecentSouvenirs"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { notFound } from "next/navigation"
import Loading from "./loading"
import axios from "axios"
import UsernameModal from "@/components/event/UsernameModal"

type PageProps = {
    params: Promise<{ key: string }>
}

const EventPage = async ({ params }: PageProps) => {
    const { key } = await params

    let room
    try {
        const res = await axios.get(`http://localhost:8000/rooms/${key}`)
        room = res.data
    } catch (error) {
        notFound()
    }
    return (
        <div className="space-y-4">
            <UsernameModal/>
            <EventHero
                image={room.background_image_url}
                date={room.date}
                location={room.location}
                name={room.name}
                isLive

            />
            <div className="p-4">
                <RecentSouvenirs />


            </div>

        </div>
    )
}
export default EventPage 