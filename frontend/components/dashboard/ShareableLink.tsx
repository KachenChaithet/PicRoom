"use client"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

const ShareableLink = ({ url }: { url: string }) => {
    const [copied, setCopied] = useState(false)

    const copy = async () => {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground mb-2">
                SHAREABLE LINK
            </p>
            <div className="flex items-center gap-2">
                <Input value={url} readOnly className="flex-1" />
                <Button size="icon" onClick={copy} className="bg-primary">
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </Button>
            </div>
        </div>
    )
}

export default ShareableLink
