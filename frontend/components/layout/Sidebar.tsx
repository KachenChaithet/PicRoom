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
import Link from "next/link"

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
        <Sidebar collapsible="icon" className="overflow-hidden [&_span]:truncate ">

            <SidebarHeader className="">

                <Link href={'/'}>
                    {open ? (
                        <Image
                            src="/logoipsum-custom-logo.svg"
                            width={120}
                            height={32}
                            alt="logo"
                            loading="eager"
                            style={{ width: "120px", height: "32px" }}
                        />
                    ) : (

                        <Image src="/logoipsum-415.svg" width={30} height={30} alt="logo" loading="eager" />
                    )}
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuButton
                                    key={item.href}
                                    asChild
                                    isActive={pathname === item.href}
                                    tooltip={item.label}
                                    size={'lg'}
                                >
                                    <Link href={item.href}>
                                        <item.icon className="size-6!  " />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
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