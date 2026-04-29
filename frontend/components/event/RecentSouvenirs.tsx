"use client"
import Image from "next/image"
import { Badge } from "../ui/badge"
import React, { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, ArrowRight, BadgeCheck, Camera, Check, EllipsisVertical, Plus, X } from "lucide-react"
import { Input } from "../ui/input"
import * as faceapi from "face-api.js"
import axios from "axios"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Spinner } from "../ui/spinner"


type status = "pending" | "done" | "processing"
interface Photos {
    id: number
    cloudinary_public_id: string
    uploaded_at: string
    room_id: number
    cloudinary_url: string
    filename: string
    status: status
    username: string
}

interface Groups {
    cluster_id: number
    urls: string[]
}



const RecentSouvenirs = () => {
    const [tab, setTab] = useState<'gallery' | 'upload'>('gallery')
    const [photos, setPhotos] = useState<Photos[]>([])
    const [selected, setSelected] = useState<number | null>(null)
    const [username, setUsername] = useState("guest")
    const prev = () => setSelected(i => i !== null ? (i - 1 + visiblePhotos.length) % visiblePhotos.length : null)
    const next = () => setSelected(i => i !== null ? (i + 1) % visiblePhotos.length : null)


    const FetchPhotos = async () => {
        const res = await axios.get("http://localhost:8000/image/room/5")

        setPhotos(res.data)
    }




    const [groups, setGroups] = useState<Groups[] | []>([])
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
    const [isIndexing, setIsIndexing] = useState(false)
    const [loading, setLoading] = useState(false)

    const FetchGroups = async () => {
        const res = await axios.get("http://localhost:8000/image/room/5/groups")
        console.log(res.data.clusters);

        setGroups(res.data.clusters)
    }

    const selectedUrls = new Set(
        groups.find(g => g.cluster_id === selectedGroup)?.urls || []
    )

    const visiblePhotos = selectedGroup !== null
        ? photos.filter(photo => selectedUrls.has(photo.cloudinary_url))
        : photos


    const [preview, setPreview] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])
    const previewRef = useRef<string[]>([]) // กัน preview get ค่า mount จาก render 1 


    const upload = useRef<HTMLInputElement>(null)

    const onSubmit = async () => {
        if (files.length === 0) return
        setLoading(true)
        const formData = new FormData()
        files.forEach(file => formData.append("files", file))
        formData.append("room_id", "2")
        formData.append("username", username)
        try {
            const res = await axios.post("http://localhost:8000/image/upload", formData)

            setFiles([])
            setPreview([])
            FetchPhotos()
            setTab("gallery")
            preview.forEach(url => URL.revokeObjectURL(url))

        } catch (err) {
            console.error(err)
            alert('error')
        } finally {
            setLoading(false)

        }
    }

    const removeImagePreview = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
        setPreview(prev => {
            URL.revokeObjectURL(prev[index])
            const next = prev.filter((_, i) => i !== index)
            previewRef.current = next
            return next
        })
    }



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

    const handleDeleteImage = async (id: number) => {
        setLoading(true)
        try {
            await axios.delete(`http://localhost:8000/image/${id}`)
            setFiles([])
            setPreview([])
            FetchPhotos()
            FetchGroups()
            setSelected(null)
        } catch (error) {
            console.error(error)
            alert('error')
        } finally {
            setLoading(false)

        }
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
    }, [visiblePhotos.length])

    // remove url revoke
    useEffect(() => {
        return () => {
            console.log("unmount cleanup, revoking:", previewRef.current)
            previewRef.current.forEach(url => URL.revokeObjectURL(url))
        }
    }, [])


    useEffect(() => {
        setUsername(localStorage.getItem("username") ?? "guest")
        FetchPhotos()
        FetchGroups()
    }, [])



    return (
        <div className="grid md:grid-cols-3 gap-10">
            {loading && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                    <div className="text-neutral-200 px-6 py-4 rounded-xl shadow">
                        <Spinner />
                    </div>
                </div>
            )}

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
                    {groups.map((group) => (
                        <button
                            key={group.cluster_id}
                            onClick={() => setSelectedGroup(group.cluster_id)}
                            className={`px-3 py-1 rounded-full text-sm border ${selectedGroup === group.cluster_id ? 'bg-primary text-white' : ''}`}
                        >
                            Person {group.cluster_id + 1} ({group.urls.length})
                        </button>
                    ))}
                </div>
                <div className="flex justify-between">
                    <h1 className="text-h2 text-primary">Recent Souvenirs</h1>
                    <div className="space-x-4 flex  place-items-center">
                        <Badge className="rounded-sm" variant={'secondary'}>{photos.length} Photos</Badge>
                        <Badge className="rounded-sm" variant={'secondary'}>{groups.length} Contributors</Badge>
                    </div>
                </div>

                <div className=" columns-2 gap-4">
                    {visiblePhotos.map((photo, index) => (
                        <div key={photo.id} className="mb-3 break-inside-avoid">
                            <img
                                onClick={() => setSelected(index)}
                                src={photo.cloudinary_url}
                                alt=""
                                className="w-full rounded-lg object-cover"
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
                                        onClick={() => removeImagePreview(i)}
                                    >
                                        <X className="size-4" />
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button size={'lg'} className="rounded-full font-semibold" onClick={onSubmit} disabled={loading}> {loading ? "Uploading..." : "UPLOAD ALL"}</Button>
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
                                            onClick={() => removeImagePreview(i)}
                                        >
                                            <X className="size-3" />
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Button size={'lg'} className="rounded-full font-semibold w-full" onClick={onSubmit} disabled={loading} > {loading ? "Uploading..." : "UPLOAD ALL"}</Button>
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

            {/* show full screen */}
            {selected !== null && (
                <div
                    className="bg-black/90 z-50 fixed   inset-0 flex items-center justify-center"
                    onClick={() => setSelected(null)}
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="absolute right-4 top-4 text-neutral-200" variant={'ghost'}>
                                <EllipsisVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            side="bottom"
                            sideOffset={8}
                        >
                            <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => handleDeleteImage(visiblePhotos[selected].id)}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        onClick={(e) => { e.stopPropagation(); prev() }}
                        variant={'outline'}
                        className="absolute left-4 "
                    >
                        <ArrowLeft />
                    </Button>
                    <img
                        src={visiblePhotos[selected].cloudinary_url}
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