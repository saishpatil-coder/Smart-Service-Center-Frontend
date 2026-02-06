import {
  Clock,
  FilePlus,
  History,
  Info,
  LayoutDashboard,
  ListChecks,
  ListOrdered,
  ShieldAlert,
  Tickets,
  User,
  Users,
} from "lucide-react";

export const APP_NAME = "CCSCMS";
export const statusStyles = {
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ASSIGNED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  DEFAULT: "bg-slate-50 text-slate-700 border-slate-200",
};

export const menuConfig = {
  ADMIN: [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard/admin" },
    { label: "Pending", icon: Clock, href: "/dashboard/admin/pending-tickets" },
    {
      label: "Queue",
      icon: ListOrdered,
      href: "/dashboard/admin/assignment-queue",
    },
    { label: "All Tickets", icon: Tickets, href: "/dashboard/admin/tickets" },
    { label: "Mechanics", icon: Users, href: "/dashboard/admin/mechanics" },
    { label: "Inventory", icon: History, href: "/dashboard/admin/inventory" },
    { label: "Services", icon: ListChecks, href: "/dashboard/admin/services" },
    {
      label: "Severities",
      icon: ShieldAlert,
      href: "/dashboard/admin/severities",
    },
  ],
  MECHANIC: [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/mechanic" },
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
