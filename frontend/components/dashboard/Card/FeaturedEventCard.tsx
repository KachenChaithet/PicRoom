import Image from "next/image"
import { Card, CardContent } from "../../ui/card"
import { Button } from "../../ui/button"
import { Calendar, Settings } from "lucide-react"
import { Table, TableBody, TableCell, TableRow } from "../../ui/table"
import Link from "next/link"
import { UploadActivityChart } from "../Charts&Graphs/UploadActivityChart"

interface FeaturedEventCardProps {
    image: string
    title: string
    location: string
    date: string
    isLive?: boolean
    guestCount?: number
}

const FeaturedEventCard = ({ image, location, title, guestCount, isLive, date }: FeaturedEventCardProps) => {
    return (
        <>
            <Card className=" overflow-hidden w-full  ">
                <div className="relative h-140 ">
                    <Image src={image} alt={title} fill className="object-cover brightness-75 " />
                    <div className="absolute  bottom-4 left-4  p-4 flex justify-center items-center bg-primary/70 border border-primary">
                        <span className="text-h2 text-muted">{title}</span>
                    </div>
                </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <p className="text-h2">Detail</p>
                    <Card>
                        <Table>
                            <TableBody>
                                <TableRow >
                                    <TableCell className="text-muted-foreground font-semibold">Location</TableCell>
                                    <TableCell className="font-semibold">{location}</TableCell>
                                </TableRow>
                                <TableRow >
                                    <TableCell className="text-muted-foreground font-semibold">guestCount</TableCell>
                                    <TableCell className="font-semibold">{guestCount}</TableCell>
                                </TableRow>
                                <TableRow >
                                    <TableCell className="text-muted-foreground font-semibold">date</TableCell>
                                    <TableCell className="font-semibold">{date}</TableCell>
                                </TableRow>
                                <TableRow >
                                    <TableCell className="text-muted-foreground font-semibold">url</TableCell>
                                    <TableCell className="font-semibold">
                                        <Link href={'/dashbaord/event'} className="text-primary">http://localhost:3000/dashboard</Link>
                                    </TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </Card>
                </div>
                <div className="">
                    <p>Ingest pipeline</p>
                    <UploadActivityChart />
                </div>
            </div>
        </>
    )
}

export default FeaturedEventCard