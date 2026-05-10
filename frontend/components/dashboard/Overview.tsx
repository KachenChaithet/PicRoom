import { Calendar } from "lucide-react"
import { Card, CardContent } from "../ui/card"

const Overview = () => {
    return (
        <div className="grid grid-cols-4 gap-6">
            <Card >
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="">
                            <p>Total Events</p>
                            <p className="text-h2">24</p>
                            <p className="">+20.1% from last month</p>
                        </div>

                    </div>
                </CardContent>
            </Card>
            <Card >
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="">
                            <p>Total Photos</p>
                            <p className="text-h2">24</p>
                            <p className="">+20.1% from last month</p>
                        </div>

                    </div>
                </CardContent>
            </Card>
            <Card >
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="">
                            <p>Total Guests</p>
                            <p className="text-h2">24</p>
                            <p className="">+20.1% from last month</p>
                            
                        </div>

                    </div>
                </CardContent>
            </Card>
            <Card >
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="">
                            <p>Storage Used</p>
                            <p className="text-h2">24</p>
                            <p className="">+20.1% from last month</p>
                        </div>

                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
export default Overview