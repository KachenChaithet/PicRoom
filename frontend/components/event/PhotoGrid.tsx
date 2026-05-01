import { Badge } from "../ui/badge"

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
const PhotoGrid = ({ photos, onSelect }: {
    photos: Photos[],
    onSelect: (index: number) => void
}) => {
    const leftCol = photos.map((p, i) => ({ ...p, originalIndex: i })).filter((_, i) => i % 2 === 0)
    const rightCol = photos.map((p, i) => ({ ...p, originalIndex: i })).filter((_, i) => i % 2 === 1)
    return (
        <>
            <div className="flex justify-between">
                <h1 className="text-h2 text-primary">Recent Souvenirs</h1>
                <div className="space-x-4 flex  place-items-center">
                    <Badge className="rounded-sm" variant={'secondary'}>{photos.length} Photos</Badge>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    {leftCol.map((photo, i) => (
                        <img key={photo.id} src={photo.cloudinary_url} onClick={() => onSelect(photo.originalIndex)} className="w-full rounded-lg object-cover" />
                    ))}
                </div>
                <div className="flex flex-col gap-4 flex-1">
                    {rightCol.map((photo, i) => (
                        <img key={photo.id} src={photo.cloudinary_url} onClick={() => onSelect(photo.originalIndex)} className="w-full rounded-lg object-cover" />
                    ))}
                </div>
            </div>
        </>
    )
}
export default PhotoGrid