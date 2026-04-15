import { Card } from "../ui/card"

const HostingStatistics = () => {
    return (
        <Card className="p-4 bg-primary text-white h-full">
            <h1 className="text-h2">Hosting Statistics</h1>
            <div className="flex flex-col  md:flex-row gap-20  items-center">
                <p className="flex flex-col">
                    Photos
                    <span className="font-semibold text-h2">12.4k</span>
                </p>
                <p className="flex flex-col">
                    Event
                    <span className="font-semibold text-h2">48</span>
                </p>
            </div>

        </Card>
    )
}
export default HostingStatistics