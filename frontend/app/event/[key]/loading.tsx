// loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
    return (
        <div className="space-y-4">
            <Skeleton className="w-full h-64" />

            <div className="p-4 grid md:grid-cols-3 gap-10">
                <div className="col-span-2 columns-2 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="w-full mb-3 rounded-lg" style={{ height: 300 }} />
                    ))}
                </div>

                <div className="space-y-4">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-48 w-full rounded-2xl" />
                </div>
            </div>
        </div>
    )
}
export default Loading