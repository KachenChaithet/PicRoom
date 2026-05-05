"use client"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import axios from "axios"

const UsernameModal = ({ open, onOpenChange, onComplete, roomSlug }: {
    open?: boolean,
    onOpenChange?: (open: boolean) => void,
    onComplete?: (name: string) => void,
    roomSlug: string

}) => {
    const [username, setUsername] = useState("")
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem(`picroom-${roomSlug}`)

        if (!stored) {
            setShow(true)
        }
    }, [])
    const handleSubmit = async () => {
        try {
            const existingId = localStorage.getItem(`picroom-${roomSlug}`)
            if (!username.trim()) return
            setLoading(true)

            if (existingId) {
                const res = await axios.patch(`http://localhost:8000/guest/${existingId}`, {
                    name: username
                })
                alert(`username:${res.data.name}`)
                onComplete?.(res.data.name)
                setShow(false)
                onOpenChange?.(false)
            }
            else {
                const res = await axios.post(`http://localhost:8000/guest/${roomSlug}/auth`, {
                    name: username
                })
                localStorage.setItem(`picroom-${roomSlug}`, res.data.id)
                onComplete?.(res.data.name)
                setShow(false)
                onOpenChange?.(false)
            }
        } catch (error) {
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }

    }
    return (
        <Dialog open={open === true || show} onOpenChange={(val) => {
            setShow(val)
            onOpenChange?.(val)
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Input your name</DialogTitle>
                    <DialogDescription className="text-body-sm text-muted-foreground">
                        Please enter your username to continue.
                    </DialogDescription>
                </DialogHeader>
                <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your name"
                />
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "loading..." : "Enter"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
export default UsernameModal