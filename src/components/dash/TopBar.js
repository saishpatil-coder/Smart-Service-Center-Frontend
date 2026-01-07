"use client";

import React, { useEffect, useState, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Search,
  Bell,
  Settings,
  HelpCircle,
  Command,
  X,
  CheckCheck,
  Trash2,
} from "lucide-react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteAllNotifications,
  deleteNotification,
} from "@/services/notification.service";
import { deleteFCMToken, logout } from "@/services/auth.service";
import { toast } from "react-toastify";
import { useDashboard } from "@/context/DashBoardContext";

export default function DashboardTopbar() {
  const { user, setUser } = useUser();
  const { search, setSearch } = useDashboard();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close on Click Outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard Shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("topbar-search")?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getNotifications()
      .then((res) => setNotifications(res.data.notifications))
      .catch(() => toast.error("Failed to load notifications"))
      .finally(() => setLoading(false));
  }, [user]);

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

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 shadow-md px-4 md:px-8 flex items-center justify-between transition-all border-b border-white/10">
      {/* LEFT: Branding */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-1 bg-white/30 rounded-full hidden md:block" />
        <div className="flex flex-col">
          <h2 className="text-[10px] font-bold text-blue-100 uppercase tracking-widest leading-none mb-1 opacity-80">
            System Portal
          </h2>
          <p className="text-lg font-extrabold text-white tracking-tight">
            Dashboard
          </p>
        </div>
      </div>

      {/* MIDDLE: Search Bar */}
      <div className="flex-1 max-w-lg px-8 hidden sm:block">
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors"
          />
          <input
            id="topbar-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search resources..."
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 py-2.5 pl-10 pr-12 rounded-xl text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 px-1.5 py-1 rounded bg-black/20 border border-white/10 text-[9px] font-bold text-white/60 uppercase">
            <Command size={10} /> K
          </div>
        </div>
      </div>

      {/* RIGHT: User Actions */}
      <div className="flex items-center gap-3">
        {/* Help & Notifications */}
        <div className="flex items-center gap-1 md:gap-2 mr-2 border-r border-white/20 pr-3">
          <button className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-all">
            <HelpCircle size={20} />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full transition-all relative ${
                isOpen
                  ? "bg-white/20 text-white"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-blue-600">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown - Improved positioning and shadow */}
            {isOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-150 origin-top-right">
                <div className="flex justify-between items-center px-4 py-4 bg-gray-50/50 border-b">
                  <h3 className="font-bold text-gray-800 text-sm">
                    Notifications
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        await markAllAsRead();
                        setNotifications((n) =>
                          n.map((i) => ({ ...i, isRead: true }))
                        );
                      }}
                      className="text-[11px] text-blue-600 font-bold hover:underline"
                    >
                      Mark all read
                    </button>
                    <button
                      onClick={async () => {
                        await deleteAllNotifications();
                        setNotifications([]);
                      }}
                      className="text-[11px] text-red-500 font-bold hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-[350px] overflow-y-auto">
                  {loading ? (
                    <div className="p-8 text-center text-gray-400 animate-pulse text-sm">
                      Loading...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                      <div className="bg-gray-100 p-3 rounded-full mb-3">
                        <Bell size={24} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">
                        All caught up!
                      </p>
                      <p className="text-xs text-gray-400">
                        No new notifications to show.
                      </p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`group relative px-4 py-4 flex gap-3 transition-colors border-b last:border-0 hover:bg-gray-50
                        ${!n.isRead ? "bg-blue-50/40" : "bg-white"}`}
                      >
                        <div
                          className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                            !n.isRead ? "bg-blue-500" : "bg-transparent"
                          }`}
                        />
                        <div
                          className="flex-1"
                          onClick={async () => {
                            if (!n.isRead) {
                              await markAsRead(n.id);
                              setNotifications((prev) =>
                                prev.map((x) =>
                                  x.id === n.id ? { ...x, isRead: true } : x
                                )
                              );
                            }
                          }}
                        >
                          <p
                            className={`text-sm leading-tight ${
                              !n.isRead
                                ? "font-bold text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await deleteNotification(n.id);
                            setNotifications((prev) =>
                              prev.filter((x) => x.id !== n.id)
                            );
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden xl:block">
            <p className="text-xs font-black text-white leading-none">
              {user.name}
            </p>
            <p className="text-[9px] font-bold text-blue-200 uppercase mt-1 tracking-widest opacity-80">
              {user.role}
            </p>
          </div>

          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-lg group-hover:rotate-3 transition-transform">
              <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-white to-blue-50 flex items-center justify-center text-blue-700 font-black text-sm border border-blue-100">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-10 lg:w-auto lg:px-4 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95"
            title="Sign Out"
          >
            <LogOut size={18} />
            <span className="hidden lg:inline ml-2 text-xs font-bold">
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
