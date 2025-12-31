"use client";

import { APP_NAME } from "@/constants/app";
import { useUser } from "@/context/UserContext";
import { logout } from "@/services/auth.service";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { user, loading, setUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setOpenMenu(false);
    router.push("/login");
  };

  const navigateToDashboard = () => {
    const role = user?.role?.toLowerCase();
    setOpenMenu(false);
    if (role === "admin") router.push("/dashboard/admin");
    else if (role === "mechanic") router.push("/dashboard/mechanic");
    else router.push("/dashboard/client");
  };

  return (
    <nav className="w-full z-50 bg-[#6CA8F7]/95 backdrop-blur-md shadow-lg fixed top-0 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-black text-white tracking-tighter uppercase italic hover:opacity-90 transition-opacity"
        >
          {APP_NAME}
        </Link>

        {/* DESKTOP LINKS - Cleaned & Categorized */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black text-white uppercase tracking-[0.2em]">
          <Link href="/" className="hover:text-blue-100 transition-colors">
            Home
          </Link>
          <Link href="/book" className="hover:text-blue-100 transition-colors">
            Book Service
          </Link>
          <Link href="/track" className="hover:text-blue-100 transition-colors">
            Track Status
          </Link>
        </div>

        {/* AUTH ACTIONS */}
        <div className="hidden md:flex items-center gap-5">
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-white text-xs font-black uppercase tracking-widest hover:text-blue-50 transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-white text-blue-600 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpenMenu((prev) => !prev)}
                className="flex items-center gap-3 bg-white/10 border border-white/20 pl-2 pr-4 py-1.5 rounded-2xl hover:bg-white/20 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-blue-600 font-black flex items-center justify-center shadow-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {user?.name?.split(" ")[0]}
                </span>
                <ChevronDown
                  size={14}
                  className={cn(
                    "text-white/70 transition-transform duration-300",
                    openMenu && "rotate-180"
                  )}
                />
              </button>

              {/* DROPDOWN */}
              {openMenu && (
                <div className="absolute right-0 mt-4 w-64 bg-white shadow-2xl rounded-3xl p-2 z-50 animate-in fade-in zoom-in duration-200 border border-slate-100">
                  <div className="p-4 bg-slate-50 rounded-2xl mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Authenticated as
                    </p>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user?.name}
                    </p>
                    <span className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-lg bg-blue-600 text-white font-black uppercase tracking-tighter">
                      {user?.role}
                    </span>
                  </div>

                  <button
                    onClick={navigateToDashboard}
                    className="w-full flex items-center gap-3 text-left text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider"
                  >
                    <LayoutDashboard size={16} /> Control Center
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 text-left text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider mt-1"
                  >
                    <LogOut size={16} /> Terminate Session
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE TRIGGER */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="bg-[#6CA8F7] px-6 py-8 md:hidden border-t border-white/10 space-y-6 animate-in slide-in-from-top">
          <div className="flex flex-col gap-4 text-xs font-black uppercase tracking-[0.2em] text-white">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/book" onClick={() => setOpen(false)}>
              Book Service
            </Link>
            <Link href="/track" onClick={() => setOpen(false)}>
              Track Status
            </Link>
          </div>
          <div className="pt-6 border-t border-white/10">
            {!user ? (
              <Link
                href="/login"
                className="block w-full text-center bg-white text-blue-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                Login / Register
              </Link>
            ) : (
              <button
                onClick={navigateToDashboard}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <LayoutDashboard size={18} /> Open Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
