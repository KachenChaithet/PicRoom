import { CheckCircle, Download, Mail } from "lucide-react"
import ShareableLink from "./ShareableLink"
import SouvenirQRCode from "./SouvenirQRCode"

interface EventSuccessData {
    shareableUrl: string
    qrDownloadUrl?: string
}

const EventSuccessBanner = ({ data }: { data: EventSuccessData }) => {
    if (!data) return
    const handleDownloadQR = () => { /* download logic */ }
    const handleInviteEmail = () => { /* open email client */ }

    return (
        <div className="bg-green-50 rounded-2xl p-6 flex md:flex-row flex-col gap-6 items-center">
            {/* Left — QR */}
            <SouvenirQRCode url={data.shareableUrl} />

            {/* Right — content */}
            <div className="flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-2">
                    <CheckCircle className="size-5 text-green-600" />
                    <h2 className="font-bold text-lg">Event Successfully Created!</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                    Your unique souvenir key is live. Share this link with your guests
                    to start collecting memories.
                </p>

                <ShareableLink url={data.shareableUrl} />

                <div className="flex gap-4">
                    <button onClick={handleDownloadQR} className="flex items-center gap-2 text-sm text-primary">
                        <Download className="size-4" /> Download QR Kit
                    </button>
                    <button onClick={handleInviteEmail} className="flex items-center gap-2 text-sm text-primary">
                        <Mail className="size-4" /> Invite via Email
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EventSuccessBanner