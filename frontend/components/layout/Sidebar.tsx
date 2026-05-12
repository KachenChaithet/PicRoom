'use client'

import Image from "next/image"
import {
    LayoutDashboard,
    CalendarDays,
    Image as ImageIcon,
    LogOut,
    QrCode
} from "lucide-react"
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
        <Sidebar
            variant="inset"
            collapsible="icon"
            className="overflow-hidden border-r"
        >
            {/* HEADER */}
            <SidebarHeader>
                <Link
                    href="/"
                    className={`flex items-center ${!open ? "justify-center" : ""
                        }`}
                >
                    {open ? (
                        <Image
                            src="/logoipsum-custom-logo.svg"
                            width={120}
                            height={32}
                            alt="logo"
                        />
                    ) : (
                        <Image
                            src="/logoipsum-415.svg"
                            width={24}
                            height={24}
                            alt="logo"
                        />
                    )}
                </Link>
            </SidebarHeader>

            {/* NAV */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="flex flex-col gap-1">
                            {navItems.map((item) => {
                                const active = pathname === item.href

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.label}
                                            isActive={active}
                                            size="lg"
                                        >
                                            <Link href={item.href} className={`flex items-center ${!open && "justify-center"}`}>
                                                <item.icon className="size-4" />

                                                {open && <span>{item.label}</span>}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Logout"
                            onClick={async () => {
                                await supabase.auth.signOut()
                                window.location.href = "/login"
                            }}
                            className="text-muted-foreground hover:bg-muted"
                        >
                            <LogOut className="size-4" />
                            {open && <span>Logout</span>}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar >
    )
}

export default SidebarLayout