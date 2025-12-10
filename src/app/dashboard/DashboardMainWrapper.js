"use client";

import { useSidebar } from "@/context/SidebarContext";
import SideBar from "@/components/SideBar";
import DashboardTopbar from "@/components/dash/TopBar";

export default function DashboardMainWrapper({ children }) {
  const { collapsed } = useSidebar();
  return (
    <div className="flex">
      <SideBar/>
      <main className={`w-full min-h-screen bg-gray-50 p-8 pt-10 transition-all ${collapsed ? "ml-20" : "ml-74"} `}>
        <DashboardTopbar/>
        {children}
      </main>
    </div>
  );
}
