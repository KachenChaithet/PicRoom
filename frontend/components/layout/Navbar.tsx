import { Bell, Settings } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { SidebarTrigger } from "../ui/sidebar"

const NavbarLayout = () => {
    return (
        <nav className="h-16 bg-neutral-200 flex items-center justify-between px-6" >
            <SidebarTrigger />

            <div className="flex items-center gap-6">
                <Bell className="h-5 w-5 text-muted-foreground cursor-pointer" />
                <Settings className="h-5 w-5 text-muted-foreground cursor-pointer" />
                <Avatar>
                    <AvatarFallback>TC</AvatarFallback>
                </Avatar>
            </div>
        </nav>
    )
}
export default NavbarLayout