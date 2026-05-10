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
import { createClient } from "@/lib/supabase/client"

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: CalendarDays, label: 'Events', href: '/dashboard/events' },
    { icon: ImageIcon, label: 'Galleries', href: '/dashboard/galleries' },
    { icon: QrCode, label: 'Quick Connect', href: '/dashboard/connect' },
]

const SidebarLayout = () => {
    const pathname = usePathname()
    const { open } = useSidebar()
    const supabase = createClient()


    return (
        <Sidebar collapsible="icon" className="overflow-hidden [&_span]:truncate  ">

            <SidebarHeader  >

                <Link href={'/'} className={`flex ${!open && "justify-center"}`}>
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

                        <Image src="/logoipsum-415.svg" width={20} height={20} alt="logo" loading="eager" />
                    )}
                </Link>
            </SidebarHeader>

            <SidebarContent className=" ">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="flex gap-1">
                            {navItems.map((item) => (
                                <SidebarMenuButton
                                    key={item.href}
                                    asChild
                                    isActive={pathname === item.href}
                                    tooltip={item.label}
                                    size={'lg'}
                                >
                                    <Link href={item.href} className={` flex ${!open && "justify-center"}`}>
                                        <item.icon className="size-4  " />
                                        {open && <span>{item.label}</span>}
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
                        <SidebarMenuButton tooltip="Logout" onClick={() => {
                            supabase.auth.signOut()
                            window.location.href = "/login"
                        }}>
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