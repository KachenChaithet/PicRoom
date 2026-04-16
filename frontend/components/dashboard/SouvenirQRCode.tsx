import { QRCodeSVG } from 'qrcode.react'

const SouvenirQRCode = ({ url }: { url: string }) => (
    <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4">
        <QRCodeSVG value={url} size={140} fgColor="#3D2B6B" />
        <span className="text-xs font-semibold tracking-widest text-muted-foreground">
            SCAN TO JOIN
        </span>
    </div>
)

export default SouvenirQRCode