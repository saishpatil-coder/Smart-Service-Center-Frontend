"use client";

import React from "react";
import { useUser } from "@/context/UserContext";
import SidebarLoading from "./SideBarLoading";
import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";
import { APP_NAME } from "@/constants/app";
import {
  LayoutDashboard,
  FilePlus,
  Search,
  UserPlus,
  Menu,
  User,
  History,
  MessageSquare,
  ListChecks,
  BarChart3Icon,
  Clock,
  ListOrdered,
  Tickets,
} from "lucide-react";

const SideBar = () => {
  const { user, loading } = useUser();

  // While user is loading → show nothing or a loader
  if (loading || !user) <SidebarLoading />;

  // If no user at all → redirect to login

  // Determine which sidebar to render
  const menu = user
    ? user.role === "ADMIN"
      ? [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard/admin",
  },
  {
    label: "Stats",
    icon: BarChart3Icon,
    href: "/dashboard/admin/stats",
  },
  {
    label: "Add Mechanic",
    icon: UserPlus,
    href: "/dashboard/admin/add-mechanic",
  },
  {
    label: "Pending Tickets",
    icon: Clock,
    href: "/dashboard/admin/pending-tickets",
  },
  {
    label: "Assignment Queue",
    icon: ListOrdered,
    href: "/dashboard/admin/assignment-queue",
  },
  {
    label: "All Tickets",
    icon: Tickets,
    href: "/dashboard/admin/tickets",
  }
]
      : user.role === "MECHANIC"
      ? [
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

          {
            label: "Task History",
            icon: History,
            href: "/dashboard/mechanic/history",
          },

          {
            label: "Profile",
            icon: User,
            href: "/dashboard/mechanic/profile",
          },
        ]
      : [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard/client",
  },

  {
    label: "Create Ticket",
    icon: FilePlus,
    href: "/dashboard/client/create-ticket",
  },

  {
    label: "Track Requests",
    icon: Search,
    href: "/dashboard/client/track",
  },

  {
    label: "History",
    icon: History,
    href: "/dashboard/client/history",
  },

  {
    label: "Feedback",
    icon: MessageSquare,
    href: "/dashboard/client/feedback",
  },

  {
    label: "Profile",
    icon: User,
    href: "/dashboard/client/profile",
  },
]
    : [];
  const { collapsed, toggleSidebar } = useSidebar();

  const width = collapsed ? "w-20" : "w-74";

  return (
    <aside
      className={`
        fixed left-0 h-screen top-10
        bg-white border-r shadow-sm p-4 transition-all
        ${width}
      `}
    >
      <h2
        className={`
          text-xl flex align-center font-bold text-blue-600 mb-6 transition-opacity
          ${collapsed ? "opacity-0 hidden" : "opacity-100"}
        `}
      >
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-3 px-3 py-1 rounded-lg hover:bg-blue-50"
        >
          <Menu size={20} className="" />
        </button>
        <p className="py-1">{APP_NAME}</p>
      </h2>

      <nav className="space-y-3">
        {collapsed && (
          <button
            onClick={toggleSidebar}
            className="flex items-center p-3 gap-3 text-blue-600 px-3 rounded-lg hover:bg-blue-50"
          >
            <Menu size={20} className="" />
          </button>
        )}
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50"
            >
              <Icon size={20} className="text-blue-600" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};


export default SideBar;