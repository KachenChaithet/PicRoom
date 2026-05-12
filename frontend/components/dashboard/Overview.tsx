import { Calendar, TrendingUp } from "lucide-react"
import { Badge } from "../ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import MiniCard from "./Card/MiniCard"

const data = [
    { title: "Total Events", value: 24, percent: 12.5 },
    { title: "Total Photos", value: 24, percent: 12.5 },
    { title: "Total Guests", value: 24, percent: 12.5 },
    { title: "Storage Used", value: 24, percent: 12.5 },
]
const Overview = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {data.map((d, i) => (
                <MiniCard
                    key={i}
                    percent={d.percent}
                    title={d.title}
                    value={d.value}
                />
            ))}


        </div>
    )
}
export default Overview