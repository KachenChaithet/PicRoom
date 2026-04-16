import NavbarLayout from "@/components/layout/Navbar"
import SidebarLayout from "@/components/layout/Sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (

        <TooltipProvider >

            <SidebarProvider >
                <SidebarLayout />
                <SidebarInset>
                    <NavbarLayout />
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}

export default Layout
