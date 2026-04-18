import EventHero from "@/components/event/EventHero"
import RecentSouvenirs from "@/components/event/RecentSouvenirs"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { notFound } from "next/navigation"
import Loading from "./loading"

type PageProps = {
    params: Promise<{ key: string }>
}

const EventPage = async ({ params }: PageProps) => {
    const { key } = await params
    if (key !== 'Hee') notFound()
    return (
        <div className="space-y-4">
            <EventHero
                image="https://images.unsplash.com/photo-1653821355226-6def361cc7ab?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                date="June 14, 2024"
                location="The Grand Conservatory, Florence"
                name="The Wedding Gala"
                isLive

            />
            <div className="p-4">
                <RecentSouvenirs />


            </div>

        // </div>
    )
}
export default EventPage 