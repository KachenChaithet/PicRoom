"use client"
import Image from "next/image"
import { Badge } from "../ui/badge"
import React, { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, ArrowRight, BadgeCheck, Camera, Check, Plus, X } from "lucide-react"
import { Input } from "../ui/input"
import * as faceapi from "face-api.js"
import axios from "axios"

const photos = [
    { id: 1, src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200", height: 300 },
    { id: 2, src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600", height: 450 },
    { id: 3, src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900", height: 350 },
    { id: 4, src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800", height: 500 },
    { id: 5, src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600", height: 280 },
    { id: 6, src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400", height: 420 },
    { id: 7, src: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=600", height: 320 },
    { id: 8, src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200", height: 480 },
    { id: 9, src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", height: 500 },
    { id: 10, src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", height: 500 },
    { id: 11, src: "/IMG20250815092059.jpg", height: 500 },
    { id: 12, src: "/IMG20250928002212.jpg", height: 500 },
    { id: 13, src: "/IMG20250815150258.jpg", height: 500 },
    { id: 14, src: "/IMG20250214135630.jpg", height: 500 },
    { id: 15, src: "/IMG20240104104957.jpg", height: 500 },
    { id: 16, src: "/IMG20231218123200.jpg ", height: 500 },
    { id: 17, src: "/MS_Musk_Elon_CloseUp.jpg ", height: 500 },
    { id: 18, src: "/b34f22f0-3c7a-11f0-a0e7-01d93af84155.jpg ", height: 500 },
]

type FaceGroup = {
    descriptors: Float32Array[]
    photoIds: number[]
}
const RecentSouvenirs = () => {
    const [tab, setTab] = useState<'gallery' | 'upload'>('gallery')
    const [selected, setSelected] = useState<number | null>(null)
    const prev = () => setSelected(i => i !== null ? (i - 1 + visiblePhotos.length) % visiblePhotos.length : null)
    const next = () => setSelected(i => i !== null ? (i + 1) % visiblePhotos.length : null)

    const [groups, setGroups] = useState<Map<number, FaceGroup>>(new Map())
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
    const [isIndexing, setIsIndexing] = useState(false)

    const visiblePhotos = selectedGroup !== null
        ? photos.filter(photo =>
            groups.get(selectedGroup)?.photoIds.includes(photo.id)
        )
        : photos



    const [preview, setPreview] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])
    const previewRef = useRef<string[]>([]) // กัน preview get ค่า mount จาก render 1 


    const upload = useRef<HTMLInputElement>(null)

    const onSubmit = async () => {
        if (files.length === 0) return
        const formData = new FormData()
        files.forEach(file => formData.append("files", file))

        try {
            const res = await axios.post("http://localhost:8000/detect", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 60000,
                onUploadProgress: (e) => {
                    const percent = Math.round((e.loaded * 100) / (e.total ?? 1))
                    console.log(`${percent}%`) // เปลี่ยนเป็น setState ถ้าอยาก show progress bar
                },
            })

            // แปลง response → Map<number, FaceGroup>
            const newGroups = new Map<number, FaceGroup>()
            res.data.groups.forEach((group: any, index: number) => {
                newGroups.set(index, {
                    descriptors: [new Float32Array(group.descriptor_rep)],
                    photoIds: group.photo_ids.map((filename: string) => {
                        // map filename กลับเป็น photo.id
                        const photo = photos.find(p => p.src.endsWith(filename) || p.src.includes(filename))
                        return photo?.id ?? -1
                    }).filter((id: number) => id !== -1),
                })
            })

            setGroups(newGroups)
            console.log(groups);
            
            setFiles([])
            preview.forEach(url => URL.revokeObjectURL(url))
            setPreview([])
            setTab('gallery') // กลับไป gallery อัตโนมัติ (mobile)
        } catch (err) {
            console.error(err)
        }
    }

    const removeImage = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
        setPreview(prev => {
            URL.revokeObjectURL(prev[index])
            const next = prev.filter((_, i) => i !== index)
            previewRef.current = next
            return next
        })
    }


console.log(groups);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setPreview(prev => {
            const next = [...prev, ...urls]
            previewRef.current = next
            return next
        })
        e.target.value = ""
    }

    // shorthand keyboard
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") setSelected(i => i !== null ? (i - 1 + visiblePhotos.length) % visiblePhotos.length : null)
            if (e.key === "ArrowRight") setSelected(i => i !== null ? (i + 1) % visiblePhotos.length : null)

            if (e.key === "Escape") setSelected(null)

        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [])

    // remove url revoke
    useEffect(() => {
        return () => {
            console.log("unmount cleanup, revoking:", previewRef.current)
            previewRef.current.forEach(url => URL.revokeObjectURL(url))
        }
    }, [])




    return (
        <div className="grid md:grid-cols-3 gap-10">

            {/* gallery */}
            <div className="col-span-2 order-2 md:order-1">
                {isIndexing && (
                    <span className="text-xs text-muted-foreground animate-pulse">
                        กำลังจำแนกใบหน้า...
                    </span>
                )}
                <div className="flex gap-2 flex-wrap my-2">
                    <button
                        onClick={() => setSelectedGroup(null)}
                        className={`px-3 py-1 rounded-full text-sm border ${selectedGroup === null ? 'bg-primary text-white' : ''}`}
                    >
                        All
                    </button>
                    {Array.from(groups.entries()).map(([gId, group]) => (
                        <button
                            key={gId}
                            onClick={() => setSelectedGroup(gId)}
                            className={`px-3 py-1 rounded-full text-sm border ${selectedGroup === gId ? 'bg-primary text-white' : ''}`}
                        >
                            Person {gId + 1} ({group.photoIds.length})
                        </button>
                    ))}
                </div>
                <div className="flex justify-between">
                    <h1 className="text-h2 text-primary">Recent Souvenirs</h1>
                    <div className="space-x-4 flex  place-items-center">
                        <Badge className="rounded-sm" variant={'secondary'}>{photos.length} Photos</Badge>
                        <Badge className="rounded-sm" variant={'secondary'}>8 Contributors</Badge>
                    </div>
                </div>

                <div className=" columns-2 gap-4">
                    {visiblePhotos.map((photo, index) => (
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

            {/* upload dasktop*/}
            <div className="space-y-4 order-1 md:order-2  hidden md:block">

                <div className="space-y-2">
                    <h1 className="text-h2">Contribute</h1>
                    <p className="max-w-80">Join the curation. Every photo shared becomes a part of the official digital heirloom for the Wedding Gala.</p>
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
                                    <p className="text-xs">LIVE REACTIONS</p>
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
                            <Button size={'lg'} className="rounded-full font-semibold" onClick={onSubmit}>UPLOAD ALL</Button>
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
                <Input type="file" className="hidden" ref={upload} multiple onChange={handleChange} />
            </div>

            {/* tab mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t flex md:hidden">
                <button
                    onClick={() => setTab('gallery')}
                    className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-medium transition-colors
                        ${tab === 'gallery' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                    <Camera className="size-5" />
                    Gallery
                </button>
                <button
                    onClick={() => setTab('upload')}
                    className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-medium transition-colors
                        ${tab === 'upload' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                    <Plus className="size-5" />
                    Upload
                </button>
            </div>

            {/* upload mobile  */}
            <div className={`fixed inset-x-0 bottom-16 z-30 bg-background rounded-t-3xl border-t shadow-xl transition-transform duration-300 md:hidden
                 ${tab === 'upload' ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <div className="p-4 max-h-[80vh] overflow-y-auto space-y-4">
                    <h1 className="text-h2">Contribute</h1>
                    {files.length === 0 ? (
                        <div className="flex justify-end gap-2">
                            <Button size={'lg'} variant={'ghost'} onClick={() => setTab('gallery')}>Cancle</Button>
                            <Button size={'lg'} onClick={() => upload.current?.click()}>Upload</Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Button className="rounded-full w-full" variant={'outline'} onClick={() => upload.current?.click()}>
                                <Plus /> ADD MORE FILES
                            </Button>
                            <p>{files.length} memories selected</p>
                            <div className="grid grid-cols-3 gap-2">
                                {files.map((file, i) => (
                                    <div key={i} className="relative">
                                        <img src={preview[i]} className="w-full h-24 object-cover rounded-xl" />
                                        <span
                                            className="absolute top-1 right-1 bg-primary text-white rounded-full p-1"
                                            onClick={() => removeImage(i)}
                                        >
                                            <X className="size-3" />
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Button size={'lg'} className="rounded-full font-semibold w-full">UPLOAD ALL</Button>
                            <button className="text-xs font-semibold w-full" onClick={() => {
                                setFiles([])
                                setTab('gallery')
                                preview.forEach(url => URL.revokeObjectURL(url))
                                setPreview([])
                            }}>CANCEL</button>
                        </div>
                    )}
                </div>
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
                    <img
                        src={visiblePhotos[selected].src}
                        className="object-contain max-h-screen max-w-screen "
                        onClick={(e) => e.stopPropagation()}

                    />
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