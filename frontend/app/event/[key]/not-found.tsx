import { Button } from "@/components/ui/button"
import { Flag, Home } from "lucide-react"
import Link from "next/link"

const Notfound = () => {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 ">
            <div className="space-y-2">

                <h2 className="tracking-widest text-sm  text-center">PICROOM</h2>
                <div className="relative flex justify-center items-center">
                    <span className="absolute font-bold text-[20rem] text-primary/10 select-none leading-none">404</span>
                    <span className="relative text-[8rem] font-bold text-primary leading-none">
                        404
                    </span>
                </div>
                <p className="text-xl font-semibold mt-4 w-70 text-center">This memory hasn't been captured yet.</p>
                <p className="font-medium w-90 text-center">The page you're looking for doesn't exist or has been moved to a new collection.</p>
            </div>
            <div className="space-x-2">
                <Button size={'lg'} className="rounded-full font-semibold" asChild>
                    <Link href={'/dashboard'}>
                        <Home />
                        Return to Home
                    </Link>
                </Button>
                <Button size={'lg'} variant={'link'} className="rounded-full font-semibold">
                    <Flag />
                    Return to Home
                </Button>
            </div>

        </div>
    )
}
export default Notfound