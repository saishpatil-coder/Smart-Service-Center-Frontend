"use client";

import SideBar from "@/components/SideBar";
import DashboardTopbar from "@/components/dash/TopBar";
import { useDashboard } from "@/context/DashBoardContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardMainWrapper({ children }) {
  const { collapsed ,setSearch} = useDashboard()

  const pathname = usePathname()
   useEffect(() => {
     setSearch("");
   }, [pathname]);

  return (
    <div className="flex">
      <SideBar/>
      <main className={`w-full min-h-screen bg-gray-50 p-5 pt-5 transition-all ${collapsed ? "ml-20" : "ml-74"} `}>
        <DashboardTopbar/>
        {children}
      </main>
    </div>
  );
}
