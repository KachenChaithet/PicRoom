'use client'

import Image from "next/image"
import { LayoutDashboard, CalendarDays, Image as ImageIcon, User, LogOut, QrCode } from "lucide-react"
import { usePathname } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupContent,
    SidebarFooter,
    useSidebar,
} from "../ui/sidebar"

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: CalendarDays, label: 'Events', href: '/dashboard/events' },
    { icon: ImageIcon, label: 'Galleries', href: '/dashboard/galleries' },
    { icon: QrCode, label: 'Quick Connect', href: '/dashboard/connect' },
]

const SidebarLayout = () => {
    const pathname = usePathname()
    const { open } = useSidebar()

    return (
        <Sidebar collapsible="icon" className="overflow-hidden" >
            <SidebarHeader className="p-4">
                {open ? (
                    <Image src="/logoipsum-custom-logo.svg" width={120} height={32} alt="logo" />

                ) : (

                    <Image src="/logoipsum-415.svg" width={32} height={32} alt="logo" />
                )}
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                        tooltip={item.label}
                                        size="lg"
                                        className="overflow-hidden"
                                    >
                                        <a href={item.href}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Logout">
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default SidebarLayout