"use client"
import Image from "next/image"
import { Badge } from "../ui/badge"
import { useState } from "react"
import { Button } from "../ui/button"

const RecentSouvenirs = () => {
    const [selected, setSelected] = useState<number | null>(null)
    const prev = () => setSelected(i => i !== null ? (i - 1 + photos.length) % photos.length : null)
    const next = () => setSelected(i => i !== null ? (i + 1) % photos.length : null)
    const photos = [
        { id: 1, src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400", height: 300 },
        { id: 2, src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400", height: 450 },
        { id: 3, src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400", height: 350 },
        { id: 4, src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400", height: 500 },
        { id: 5, src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400", height: 280 },
        { id: 6, src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400", height: 420 },
        { id: 7, src: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=400", height: 320 },
        { id: 8, src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400", height: 480 },
    ]
    return (
        <div className="grid grid-cols-3 gap-10">
            <div className="col-span-2 ">
                <div className="flex justify-between">
                    <h1 className="text-h2 text-primary">Recent Souvenirs</h1>
                    <div className="space-x-4">
                        <Badge className="rounded-sm" variant={'secondary'}>428 Photos</Badge>
                        <Badge className="rounded-sm" variant={'secondary'}>12 Contributors</Badge>
                    </div>
                </div>

                <div className=" columns-2 gap-4">
                    {photos.map((photo, index) => (
                        <div key={photo.id} className="mb-3 break-inside-avoid">
                            <img
                                onClick={() => setSelected(index)}
                                src={photo.src}
                                alt=""
                                className="w-full rounded-lg object-cover"
                                style={{ height: photo.height }}
                            />
                        </div>
                    ))}
                </div>
            </div>


            <div className="">
                <div className="">

                    <h1 className="text-h2">Contribute</h1>
                    <p className="max-w-80">Join the curation. Evenry photo shared becomes a part of the official digital heirloom for the Wedding Gala.</p>
                </div>
            </div>

            {selected !== null && (
                <div
                    className="bg-black/90 z-50 fixed inset-0 flex items-center justify-center"
                    onClick={() => setSelected(null)}
                >
                    <Button
                        onClick={(e) => { e.stopPropagation(); prev() }}
                    >
                        prev
                    </Button>
                    <img src={photos[selected].src} className="object-contain" />
                    <Button
                        onClick={(e) => { e.stopPropagation(); next() }}


                    >
                        next
                    </Button>


                </div>
            )}
        </div>
    )
}
export default RecentSouvenirs