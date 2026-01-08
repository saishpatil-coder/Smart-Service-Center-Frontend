"use client";

import SideBar from "@/components/SideBar";
import DashboardTopbar from "@/components/dash/TopBar";
import { registerFCMTokenAfterLogin } from "@/components/fcm/FcmInitializer";
import FCMListener from "@/components/fcm/FcmListener";
import { APP_NAME } from "@/constants/app";
import { useDashboard } from "@/context/DashBoardContext";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardMainWrapper({ children }) {
  const { collapsed ,setSearch} = useDashboard()
  let {user} = useUser();

  const pathname = usePathname()
   useEffect(() => {
     setSearch("");
   }, [pathname]);

   useEffect(() => {
     if (!user) return;

     console.log("registering fcm token");
     registerFCMTokenAfterLogin();
   }, [user]);


  return (

    <div className="flex min-h-screen bg-slate-50/50">
      
      {/* Sidebar is fixed inside its own component. 
        We just need to ensure the main area respects its width.
      */}
      <SideBar />
      <FCMListener/>

      <div
        className={`
          flex flex-col flex-1 transition-all duration-300 ease-in-out
          ${collapsed ? "ml-20" : "ml-64"}
        `}
      >
        {/* Topbar stays at the top. 
          The 'sticky' class inside Topbar will handle the scroll behavior. 
        */}
        <DashboardTopbar />

        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* Animation Wrapper: Optional but professional. 
             Ensures content fades in smoothly.
          */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>

        {/* Optional Footer for Versioning/Support */}
        <footer className="py-6 px-8 text-center text-xs text-slate-400 border-t border-slate-100">
          © 2025 {APP_NAME} Internal Portal • v1.0.4
        </footer>
      </div>
    </div>
  );
}

