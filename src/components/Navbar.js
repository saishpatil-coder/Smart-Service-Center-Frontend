"use client";

import { APP_NAME } from "@/constants/app";
import { useUser } from "@/context/UserContext";
import { logout } from "@/services/auth.service";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  History,
  Info,
  Home,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/useLogout";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { user, loading, setUser } = useUser();
  const router = useRouter();
  const {triggerLogout,loggingOut} = useLogout();

  const handleLogout = async () => {
    triggerLogout(setUser);
  };
  useEffect(()=>{
    console.log(user)
  },[user])

  const navigateToDashboard = () => {
    const role = user?.role?.toLowerCase();
    setOpenMenu(false);
    if (role === "admin") router.push("/dashboard/admin");
    else if (role === "mechanic") router.push("/dashboard/mechanic");
    else router.push("/dashboard/client");
  };

  return (
    <nav className="w-full z-50 bg-[#6CA8F7]/80 backdrop-blur-xl fixed top-0 border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* BRAND IDENTITY */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <span className="text-[#6CA8F7] font-black text-xl italic leading-none">
              S
            </span>
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase italic">
            {APP_NAME}
          </span>
        </Link>

        {/* MINIMALIST CENTER NAVIGATION */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink href="/" icon={<Home size={14} />} label="Home" />
          <NavLink href="/about" icon={<Info size={14} />} label="About" />
          <NavLink
            href="/timeline"
            icon={<History size={14} />}
            label="Ticket Timeline"
          />
        </div>

        {/* USER PROFILE / AUTH */}
        <div className="hidden md:flex items-center">
          {loading ? (
            <Loader2 />
          ) : !user ? (
            <Link
              href="/login"
              className="bg-white text-[#6CA8F7] px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/10 hover:bg-slate-50 transition-all active:scale-95"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpenMenu((prev) => !prev)}
                className="flex items-center gap-3 bg-white/10 border border-white/10 p-1 pr-4 rounded-xl hover:bg-white/20 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white text-[#6CA8F7] font-black flex items-center justify-center">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  {user?.name?.split(" ")[0]}
                </span>
                <ChevronDown
                  size={12}
                  className={cn(
                    "text-white/50 transition-transform duration-300",
                    openMenu && "rotate-180",
                  )}
                />
              </button>

              {/* MINIMAL DROPDOWN */}
              {openMenu && (
                <div className="absolute right-0 mt-4 w-60 bg-white shadow-2xl rounded-2xl p-2 z-50 animate-in fade-in zoom-in duration-200 border border-slate-100">
                  <div className="p-4 bg-slate-50 rounded-xl mb-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Role: {user?.role}
                    </p>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user?.name}
                    </p>
                  </div>

                  <button
                    onClick={navigateToDashboard}
                    className="w-full flex items-center gap-3 text-left text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg transition-all font-bold text-xs uppercase tracking-wider"
                  >
                    <LayoutDashboard size={16} className="text-slate-400" />{" "}
                    Dashboard
                  </button>

                  <button
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 text-left text-red-500 hover:bg-red-50 px-4 py-3 rounded-lg transition-all font-bold text-xs uppercase tracking-wider"
                  >
                    {loggingOut ? (
                      <Loader2 />
                    ) : (
                      <>
                        <LogOut size={16} className="text-red-300" /> Sign Out
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE TRIGGER */}
        <button
          className="md:hidden text-white bg-white/10 p-2 rounded-lg"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="bg-[#6CA8F7] px-6 py-8 md:hidden border-t border-white/10 space-y-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-white/70">
            <Link
              href="/"
              className="flex items-center gap-3 text-white"
              onClick={() => setOpen(false)}
            >
              <Home size={16} /> Home
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-3"
              onClick={() => setOpen(false)}
            >
              <Info size={16} /> About
            </Link>
            <Link
              href="/timeline"
              className="flex items-center gap-3"
              onClick={() => setOpen(false)}
            >
              <History size={16} /> Ticket Timeline
            </Link>
          </div>
          <div className="pt-6 border-t border-white/10">
            {loading ? (
              <Loader2 />
            ) : !user ? (
              <Link
              onClick={
                ()=>{
                  setOpen(false)
                }
              }
                href="/login"
                className="block w-full text-center bg-white text-[#6CA8F7] py-4 rounded-xl font-black uppercase tracking-widest text-xs"
              >
                Sign In
              </Link>
            ) : (
              <button
                onClick={navigateToDashboard}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                Open Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// Sub-component for clean desktop links
function NavLink({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-[10px] font-black text-white/70 uppercase tracking-[0.2em] hover:text-white transition-colors group"
    >
      <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        {icon}
      </span>
      {label}
    </Link>
  );
}
