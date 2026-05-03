"use client"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

const UsernameModal = ({ open, onOpenChange }: { open?: boolean, onOpenChange?: (open: boolean) => void }) => {
    const [username, setUsername] = useState("")
    const [show, setShow] = useState(false)


    useEffect(() => {
        const stored = localStorage.getItem("username")

        if (!stored) {
            setShow(true)

        }
    }, [])
    const handleSubmit = () => {
        localStorage.setItem("username", username)
        setShow(false)
        onOpenChange?.(false)
    }
    return (
        <Dialog open={open === true || show} onOpenChange={(val) => {
            setShow(val)
            onOpenChange?.(val)
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Input your name</DialogTitle>
                </DialogHeader>
                <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your name"
                />
                <Button onClick={handleSubmit}>Enter</Button>
            </DialogContent>
        </Dialog>
    )
}
export default UsernameModal