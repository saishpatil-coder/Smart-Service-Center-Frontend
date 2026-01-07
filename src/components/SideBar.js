"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useDashboard } from "@/context/DashBoardContext";
import { APP_NAME } from "@/constants/app";
import SidebarLoading from "./SideBarLoading";
import { cn } from "@/lib/utils"; // Standard shadcn/ui utility
import {
  LayoutDashboard,
  FilePlus,
  Menu,
  User,
  History,
  MessageSquare,
  ListChecks,
  Clock,
  ListOrdered,
  Tickets,
  Users,
  Wrench,
  Package,
  ChevronLeft,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { deleteFCMToken, logout } from "@/services/auth.service";
import { toast } from "react-toastify";

const SideBar = () => {
  const { user, loading, setUser } = useUser();
  const { collapsed, toggleSidebar } = useDashboard();
  const pathname = usePathname();
  const router = useRouter();
  if (loading) return <SidebarLoading />;
  if (!user) return null;
    const handleLogout = async () => {
      try {
        await deleteFCMToken();
        await logout();
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/login");
      } catch (error) {
        toast.error("Logout failed");
      }
    };

  // Configuration for Role-Based Navigation
  const menuConfig = {
    ADMIN: [
      { label: "Overview", icon: LayoutDashboard, href: "/dashboard/admin" },
      { label: "Inventory", icon: Package, href: "/dashboard/admin/inventory" },
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
      { label: "Services", icon: Wrench, href: "/dashboard/admin/services" },
      { label: "Mechanics", icon: Users, href: "/dashboard/admin/mechanics" },
      { label: "Severities", icon: ShieldAlert, href: "/dashboard/admin/severities" },
    ],
    MECHANIC: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard/mechanic",
      },
      {
        label: "My Tasks",
        icon: ListChecks,
        href: "/dashboard/mechanic/tasks",
      },
      { label: "History", icon: History, href: "/dashboard/mechanic/history" },
      { label: "Profile", icon: User, href: "/dashboard/mechanic/profile" },
    ],
    CLIENT: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/client" },
      {
        label: "Create Ticket",
        icon: FilePlus,
        href: "/dashboard/client/create-ticket",
      },
      {
        label: "Track Requests",
        icon: History,
        href: "/dashboard/client/tickets",
      },
      {
        label: "Feedback",
        icon: MessageSquare,
        href: "/dashboard/client/feedback",
      },
    ],
  };

  const menuItems = menuConfig[user.role] || [];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 ease-in-out z-50 flex flex-col shadow-sm",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-20 flex items-center px-6 mb-4 relative">
        {!collapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
            {APP_NAME}
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "absolute -right-3 top-12 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-blue-600 hover:shadow-md transition-all",
            collapsed && "right-6 top-7"
          )}
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative overflow-hidden",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 rounded-r-full" />
              )}

              <Icon
                size={22}
                className={cn(
                  "shrink-0 transition-transform group-hover:scale-110",
                  isActive
                    ? "text-blue-600"
                    : "text-slate-400 group-hover:text-slate-600"
                )}
              />

              {!collapsed && (
                <span className="font-semibold text-sm tracking-tight">
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <div className="absolute left-16 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[60] whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer (User Info) */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user.name}
              </p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                {user.role}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() =>{

            handleLogout()
          }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-bold">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
