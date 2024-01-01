import Bottombar from "@/components/SharedCompo/Bottombar"
import LeftSidebar from "@/components/SharedCompo/LeftSidebar"
import Topbar from "@/components/SharedCompo/Topbar"
import { Outlet } from "react-router-dom"

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
        <Topbar />
        <LeftSidebar />

        <section className="flex flex-1 h-full">
            <Outlet />
        </section>

        <Bottombar />
    </div>
  )
}

export default RootLayout