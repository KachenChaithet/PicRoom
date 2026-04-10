import { Bell, Settings } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const NavbarLayout = () => {
    return (
        <nav className="h-16 bg-neutral-200 flex items-center justify-between px-6" >
            <Image src={'/logoipsum-custom-logo.svg'} width={120} height={32} alt="logo" />
            <ul className="flex items-center gap-6">
                <li>Events</li>
                <li>Galleries</li>
                <li>Analytics</li>
            </ul>
            <div className="flex items-center gap-6">
                <Bell className="h-5 w-5 text-muted-foreground cursor-pointer" />
                <Settings className="h-5 w-5 text-muted-foreground cursor-pointer" />
                <Avatar>
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback>TC</AvatarFallback>
                </Avatar>
            </div>
        </nav>
    )
}
export default NavbarLayout