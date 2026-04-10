import NavbarLayout from "@/components/layout/Navbar"
import SidebarLayout from "@/components/layout/Sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <SidebarLayout />
            <div className="flex flex-col flex-1 min-w-0">
                <NavbarLayout />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}

export default Layout