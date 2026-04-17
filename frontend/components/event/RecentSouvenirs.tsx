"use client"
import Image from "next/image"
import { Badge } from "../ui/badge"
import React, { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, ArrowRight, BadgeCheck, Camera, Check, Plus, X } from "lucide-react"
import { Input } from "../ui/input"

const photos = [
    { id: 1, src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200", height: 300 },
    { id: 2, src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600", height: 450 },
    { id: 3, src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900", height: 350 },
    { id: 4, src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800", height: 500 },
    { id: 5, src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600", height: 280 },
    { id: 6, src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400", height: 420 },
    { id: 7, src: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=600", height: 320 },
    { id: 8, src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200", height: 480 },
]
const RecentSouvenirs = () => {
    const [selected, setSelected] = useState<number | null>(null)
    const prev = () => setSelected(i => i !== null ? (i - 1 + photos.length) % photos.length : null)
    const next = () => setSelected(i => i !== null ? (i + 1) % photos.length : null)

    const [preview, setPreview] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])

    const upload = useRef<HTMLInputElement>(null)
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev()
            if (e.key === "ArrowRight") next()
            if (e.key === "Escape") setSelected(null)

        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [])

    const removeImage = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
        setPreview(prev => {
            URL.revokeObjectURL(prev[index])
            return prev.filter((_, i) => i !== index)
        })
    }
    console.log(files);
    console.log(preview);

    const handleChage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.files
        if (!input) return

        const newFiles = Array.from(input)

        const filtered = newFiles.filter(file =>
            !files.some(f =>
                f.name === file.name && f.size === file.size
            )
        )
        const urls = filtered.map(file =>
            URL.createObjectURL(file)
        )
        setFiles(prev => [...prev, ...filtered])
        setPreview(prev => [...prev, ...urls])
        e.target.value = ""
    }
    return (
        <div className="grid md:grid-cols-3 gap-10">

            {/* gallery */}
            <div className="col-span-2 order-2 md:order-1">
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

            {/* upload */}
            <div className="space-y-4 order-1 md:order-2  ">

                <div className="space-y-2">
                    <h1 className="text-h2">Contribute</h1>
                    <p className="max-w-80">Join the curation. Evenry photo shared becomes a part of the official digital heirloom for the Wedding Gala.</p>
                </div>
                {files.length === 0 ? (
                    <div className="space-y-4">

                        <div
                            className="border-dashed max-w-100 h-48 border-2 rounded-2xl flex items-center justify-center flex-col gap-2 cursor-pointer"
                            onClick={() => upload.current?.click()}
                        >
                            <span className="p-4 bg-primary text-white rounded-full">
                                <Camera />
                            </span>
                            <div className="text-center">
                                <h1 className="text-h3">Tap or drag to add</h1>
                                <p>High resolution JPG or PNG</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="font-semibold">EVENT STATS</h1>
                            <div className="flex gap-4">
                                <div className="max-w-50 border p-4 rounded-4xl">
                                    <h1 className="text-h2">1.2k</h1>
                                    <p className="text-xs">VIEWS</p>
                                </div>
                                <div className="max-w-50 border p-4 rounded-4xl">
                                    <h1 className="text-h2">82</h1>
                                    <p className="text-xs">LIVEREACTIONS</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-green-100 max-w-80 flex gap-2 rounded-4xl">
                            <BadgeCheck className="text-green-600 " />
                            <p className="text-xs">This gallery is moderated by the event organizers.</p>
                        </div>
                    </div>
                ) : (
                    <div className="border p-4 rounded-2xl space-y-4">
                        <div className="bg-primary/10 rounded-2xl p-4 flex items-start gap-2">
                            <Camera className="size-10" />

                            <p className="font-medium text-primary">
                                Add photos to your collection. You can upload images in multiple batches — feel free to come back anytime and add more.
                            </p>
                        </div>
                        <div className="bg-primary/10 rounded-2xl p-4 flex items-start gap-2 flex-col">
                            <h1 className="text-h2 text-primary">Review Your Uploads</h1>
                            <Button className="rounded-full" variant={'outline'} onClick={() => upload.current?.click()}>
                                <Plus /> ADD MORE FILES
                            </Button>
                            <p className="">
                                {files.length} memories selected for the gallery.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full justify-items-center ">
                            {files.map((file, i) => (
                                <div className="p-2 bg-primary/10 relative rounded-2xl" key={i}>
                                    <img
                                        key={i}
                                        src={preview[i]}
                                        className="w-34 h-34 object-cover rounded"
                                    />
                                    <h1 className="w-32 truncate text-sm">{file.name}</h1>
                                    <span className="absolute bottom-8 left-4 bg-green-300 rounded-full p-2 ">
                                        <Check className="size-4" />
                                    </span>
                                    <span
                                        className="absolute top-4 right-4 bg-primary text-white rounded-full p-2 "
                                        onClick={() => removeImage(i)}
                                    >
                                        <X className="size-4" />
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button size={'lg'} className="rounded-full font-semibold">UPLOAD ALL</Button>
                            <button
                                className="text-xs font-semibold"
                                onClick={() => {
                                    setFiles([]);
                                    preview.forEach(url => URL.revokeObjectURL(url))
                                    setPreview([])
                                }}
                            >CANCEL</button>



                        </div>


                    </div>

                )}
                <Input type="file" className="hidden" ref={upload} multiple onChange={handleChage} />
            </div>

            {selected !== null && (
                <div
                    className="bg-black/90 z-50 fixed inset-0 flex items-center justify-center"
                    onClick={() => setSelected(null)}
                >
                    <Button
                        onClick={(e) => { e.stopPropagation(); prev() }}
                        variant={'outline'}
                        className="absolute left-4 "
                    >
                        <ArrowLeft />
                    </Button>
                    <img src={photos[selected].src} className="object-contain max-h-screen max-w-screen " />
                    <Button
                        onClick={(e) => { e.stopPropagation(); next() }}
                        variant={'outline'}
                        className="absolute right-4"
                    >
                        <ArrowRight />
                    </Button>


                </div>
            )}
        </div>
    )
}
export default RecentSouvenirs