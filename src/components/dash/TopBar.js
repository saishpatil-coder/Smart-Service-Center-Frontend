"use client";

import React from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Search,
  Bell,
  Settings,
  HelpCircle,
  Command,
} from "lucide-react";
import { logout } from "@/services/auth.service";
import { toast } from "react-toastify";
import { useDashboard } from "@/context/DashBoardContext";
import { cn } from "@/lib/utils";

export default function DashboardTopbar() {
  const { user, setUser } = useUser();
  const { search, setSearch } = useDashboard();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 px-6 flex items-center justify-between transition-all rounded-b-2xl md:rounded-none">
      {/* LEFT: Context Branding */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-[10px] font-bold text-blue-100 uppercase tracking-[0.2em] leading-none mb-1">
            System Portal
          </h2>
          <p className="text-lg font-bold text-white tracking-tight">
            Dashboard
          </p>
        </div>
      </div>

      {/* MIDDLE: Integrated Search Bar */}
      <div className="flex-1 max-w-md px-8 hidden sm:block">
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <Search
              size={16}
              className="text-white/70 group-focus-within:text-white transition-colors"
            />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search tickets or jobs..."
            className="w-full bg-white/10 border border-white/20 py-2 pl-10 pr-10 rounded-xl text-sm placeholder:text-white/60 text-white focus:outline-none focus:bg-white/20 focus:ring-4 focus:ring-white/10 focus:border-white/40 transition-all shadow-inner"
          />
          {/* Subtle Keyboard Shortcut Hint */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/20 border border-white/10 text-[10px] text-white/50">
            <Command size={10} /> K
          </div>
        </div>
      </div>

      {/* RIGHT: User Actions */}
      <div className="flex items-center gap-2">
        {/* Utility Icons (Desktop) */}
        <div className="hidden md:flex items-center gap-1 border-r border-white/20 pr-4 mr-2">
          <button
            title="Help"
            className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <HelpCircle size={18} />
          </button>
          <button
            title="Notifications"
            className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-all relative"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
          </button>
        </div>

        {/* User Info & Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden xl:block">
            <p className="text-xs font-bold text-white leading-none">
              {user.name}
            </p>
            <p className="text-[10px] font-medium text-blue-200 uppercase mt-1 tracking-wider">
              {user.role}
            </p>
          </div>

          <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer">
            <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 bg-red-500/20 hover:bg-red-500 border border-red-500/30 px-3 py-1.5 rounded-lg text-white font-bold text-xs transition-all shadow-sm active:translate-y-0.5"
          >
            <LogOut
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
