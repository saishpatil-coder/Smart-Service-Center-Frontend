"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useDashboard } from "@/context/DashBoardContext";
import { APP_NAME } from "@/constants/app";
import SidebarLoading from "./SideBarLoading";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FilePlus,
  Menu,
  User,
  History,
  ListChecks,
  Clock,
  ListOrdered,
  Tickets,
  Users,
  ChevronLeft,
  LogOut,
  ShieldAlert,
  Info,
  Loader2,
} from "lucide-react";
import { deleteFCMToken, logout } from "@/services/auth.service";
import { toast } from "react-toastify";

const SideBar = () => {
  const { user, loading, setUser } = useUser();
  const { collapsed, toggleSidebar } = useDashboard();
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // NEW: State to track if a link has been clicked and we are waiting for the route
  const [navigatingTo, setNavigatingTo] = useState(null);

  // Reset navigating state when the pathname actually changes
  useEffect(() => {
    setNavigatingTo(null);
  }, [pathname]);

  if (loading) return <SidebarLoading />;
  if (!user) return null;

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await deleteFCMToken();
      sessionStorage.removeItem("fcm_sent");
      await logout();
      setUser(null);
      toast.success("Identity Disconnected");
      router.push("/login");
    } catch (error) {
      toast.error("Logout interruption");
    }finally{
      setLoggingOut(false);
    }
  };

  const menuConfig = {
    ADMIN: [
      { label: "Overview", icon: LayoutDashboard, href: "/dashboard/admin" },
      {
        label: "Pending",
        icon: Clock,
        href: "/dashboard/admin/pending-tickets",
      },
      {
        label: "Queue",
        icon: ListOrdered,
        href: "/dashboard/admin/assignment-queue",
      },
      { label: "All Tickets", icon: Tickets, href: "/dashboard/admin/tickets" },
      { label: "Mechanics", icon: Users, href: "/dashboard/admin/mechanics" },
      { label: "Inventory", icon: History, href: "/dashboard/admin/inventory" },

      {
        label: "Severities",
        icon: ShieldAlert,
        href: "/dashboard/admin/severities",
      },
    ],
    MECHANIC: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard/mechanic",
      },
      {
        label: "Active Tasks",
        icon: ListChecks,
        href: "/dashboard/mechanic/tasks",
      },
      { label: "History", icon: History, href: "/dashboard/mechanic/history" },
      { label: "Profile", icon: User, href: "/dashboard/mechanic/profile" },
    ],
    CLIENT: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/client" },
      {
        label: "New Request",
        icon: FilePlus,
        href: "/dashboard/client/create-ticket",
      },
      { label: "My History", icon: History, href: "/dashboard/client/tickets" },
      { label: "Service Map", icon: Info, href: "/about" },
    ],
  };

  const menuItems = menuConfig[user.role] || [];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-slate-100 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-50 flex flex-col shadow-2xl shadow-slate-200/50",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="h-24 flex items-center px-6 mb-2 relative">
        <Link
          href="/"
          className="flex items-center gap-3 group overflow-hidden"
        >
          {!collapsed && (
            <>
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shrink-0">
                <span className="text-white font-black text-xl italic leading-none">
                  S
                </span>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter uppercase italic animate-in fade-in slide-in-from-left-4 duration-500">
                {APP_NAME}
              </span>
            </>
          )}
        </Link>

        <button
          onClick={toggleSidebar}
          className={cn(
            "absolute -right-1 top-10 text-black rounded-full p-1.5 transition-all shadow-xl active:scale-90 z-30 bg-white border border-slate-100",
            collapsed && "right-6"
          )}
        >
          {collapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto custom-scrollbar">
        <p
          className={cn(
            "px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 transition-opacity",
            collapsed && "opacity-0"
          )}
        >
          Management
        </p>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const isPending = navigatingTo === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => {
                if (!isActive) setNavigatingTo(item.href);
              }}
              className={cn(
                "group flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 relative",
                isActive
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-900",
                isPending && "opacity-70 cursor-wait"
              )}
            >
              {/* Show Spinner if this specific route is loading */}
              {isPending ? (
                <Loader2
                  size={20}
                  className="shrink-0 animate-spin text-blue-500"
                />
              ) : (
                <Icon
                  size={20}
                  className={cn(
                    "shrink-0 transition-transform group-hover:scale-110 duration-300",
                    isActive
                      ? "text-blue-400"
                      : "text-slate-400 group-hover:text-slate-900"
                  )}
                />
              )}

              {!collapsed && (
                <span className="font-black text-[11px] uppercase tracking-widest animate-in fade-in duration-500">
                  {item.label}
                  {isPending && "..."}
                </span>
              )}

              {collapsed && (
                <div className="absolute left-14 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-2 transition-all z-[60] shadow-xl">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 bg-slate-50/50 border-t border-slate-100 space-y-3">
        {!collapsed && (
          <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div
              className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center text-white font-black text-xs italic shadow-inner",
                user.role === "ADMIN"
                  ? "bg-blue-600"
                  : user.role === "MECHANIC"
                  ? "bg-emerald-600"
                  : "bg-purple-600"
              )}
            >
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tighter">
                {user.name}
              </p>
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                {user.role} Account
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all group",
            collapsed && "justify-center"
          )}
        >
          {loggingOut ? (
            <Loader2 size={20} className="shrink-0 animate-spin text-red-500" />
          ) : (
            <>
              <LogOut
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              {!collapsed && (
                <span className="text-[11px] font-black uppercase tracking-widest">
                  Terminate Session
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
