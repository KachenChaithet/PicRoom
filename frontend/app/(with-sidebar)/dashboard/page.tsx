import CreateEventSection from "@/components/dashboard/CreateEventSection"
import FeaturedEventCard from "@/components/dashboard/Card/FeaturedEventCard"
import HostingStatistics from "@/components/dashboard/HostingStatistics"
import Overview from "@/components/dashboard/Overview"
import RoomCard from "@/components/dashboard/Card/RoomCard"
import UpcomingEventCard from "@/components/dashboard/UpcomingEventCard"
import { createClient } from "@/lib/supabase/server"

const EventCard = [
    {
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop",
        location: "Palace of Fine Arts • San Francisco, CA",
        title: "The Vernissage Gala 2024",
        guestCount: 242,
        isLive: true,
        date: "2024-06-15"
    },
   
]
const DashboardPage = async () => {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    return (
        <div>

            <Overview />
            <div className="mt-4">

                {EventCard.length === 1 ? (
                    <FeaturedEventCard
                        {...EventCard[0]}
                    />
                ) : (
                    <div className={`${EventCard.length > 1 && "grid grid-cols-1 md:grid-cols-2 gap-2  border p-2 rounded-2xl"}`}>
                        {EventCard.map((e, i) => (
                            <RoomCard
                                key={i}
                                date={e.date}
                                image={e.image}
                                location={e.location}
                                title={e.title}
                                guestCount={e.guestCount}
                                isLive={e.isLive}
                            />
                        ))}
                    </div>
                )}
            </div>
            <CreateEventSection />

        </div>
    )
}
export default DashboardPage