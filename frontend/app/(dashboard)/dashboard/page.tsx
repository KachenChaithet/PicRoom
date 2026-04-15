import CreateEventSection from "@/components/dashboard/CreateEventSection"
import FeaturedEventCard from "@/components/dashboard/FeaturedEventCard"
import HostingStatistics from "@/components/dashboard/HostingStatistics"
import UpcomingEventCard from "@/components/dashboard/UpcomingEventCard"

const DashboardPage = () => {
    return (
        <div>
            <div className="">
                <h1 className="text-h1 text-primary">Your Gallery</h1>
                <p className="text-primary/80">Curation Suite for Host: kachen chiyathet</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-4 ">
                <div className="col-span-2">
                    <FeaturedEventCard
                        image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop"
                        location="Palace of Fine Arts • San Francisco, CA"
                        title="The Vernissage Gala 2024"
                        guestCount={242}
                        isLive
                    />
                </div>
                <div className="col-span-1  flex md:flex-col gap-4">
                    <div className="flex-1">
                        <UpcomingEventCard />
                    </div>
                    <div className="flex-1">
                        <HostingStatistics />
                    </div>
                </div>
            </div>

            <CreateEventSection />
        </div>
    )
}
export default DashboardPage