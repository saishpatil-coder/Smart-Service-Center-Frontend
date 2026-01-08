"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import SideBar from "@/components/SideBar";
import DashboardTopbar from "@/components/dash/TopBar";
import { registerFCMTokenAfterLogin } from "@/components/fcm/FcmInitializer";
import FCMListener from "@/components/fcm/FcmListener";
import { APP_NAME } from "@/constants/app";
import { useDashboard } from "@/context/DashBoardContext";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

export default function DashboardMainWrapper({ children }) {
  const { collapsed, setSearch } = useDashboard();
  const { user } = useUser();
  const pathname = usePathname();

  // 1. Reset search context on route change
  useEffect(() => {
    setSearch("");
  }, [pathname, setSearch]);

  // 2. Optimized Notification Registration
  useEffect(() => {
    if (user?.id) {
      const timer = setTimeout(() => {
        registerFCMTokenAfterLogin();
      }, 1000); // Slight delay to ensure auth cookies are fully settled
      return () => clearTimeout(timer);
    }
  }, [user?.id]);

  // 3. Dynamic Layout Constants
  const sidebarWidth = collapsed ? "80px" : "260px";

  return (
    <div className="flex min-h-screen bg-slate-50/50 selection:bg-blue-100">
      {/* Real-time Listeners */}
      <SideBar />
      <FCMListener />

      <div
        style={{ marginLeft: sidebarWidth }}
        className="flex flex-col flex-1 transition-all duration-300 ease-in-out min-w-0"
      >
        <DashboardTopbar />

        {/* Dynamic Breadcrumbs Area */}
        <div className="px-4 md:px-8 lg:px-10 pt-6">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="hover:text-blue-600 cursor-pointer">Portal</span>
            <span>/</span>
            <span className="text-slate-900 italic">
              {pathname.split("/").pop()?.replace("-", " ")}
            </span>
          </nav>
        </div>

        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-[1600px] w-full mx-auto">
          {/* Main Content Animation */}
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out">
            {children}
          </div>
        </main>

        <footer className="py-8 px-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} {APP_NAME} Infrastructure
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                Network Active
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-300 uppercase">
              v1.0.4-LTS
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
