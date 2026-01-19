"use client";

import Link from "next/link";
import { ArrowRight, History, LayoutDashboard, Info, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function Hero() {
  let {user , loading} = useUser();
  return (
    <section className="relative bg-[#6CA8F7] text-white pt-22 pb-10 md:pt-38 md:pb-32 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 px-6 items-center relative z-10">
        {/* LEFT CONTENT */}
        <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
              <span className="w-8 h-[1px] bg-white/40"></span>
              Operational Excellence
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase italic">
              Smart <br />
              <span className="text-blue-100/50">Service</span>
            </h1>
          </div>

          <p className="text-white/80 text-lg md:text-xl max-w-sm font-medium leading-relaxed">
            A high-precision ecosystem for vehicle maintenance tracking and
            resource management.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {loading ? (
              <Loader2 />
            ) : (
              <Link
                href={`${
                  !user ? "/login" : `/dashboard/${user.role.toLowerCase()}`
                } `}
                className="group flex items-center gap-3 bg-white text-[#6CA8F7] px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:bg-blue-50 active:scale-95 shadow-2xl shadow-blue-900/20"
              >
                <LayoutDashboard size={16} />
                Open Console
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            )}

            <Link
              href="/timeline"
              className="flex items-center gap-2 text-white/60 hover:text-white font-black text-xs uppercase tracking-widest transition-colors"
            >
              <History size={16} />
              View Timeline
            </Link>
          </div>
        </div>

        {/* RIGHT CONTENT (Modernized Oval) */}
        <div className="hidden lg:flex justify-end animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <div className="relative group">
            <div className="absolute inset-0 bg-white/20 rounded-[200px] blur-3xl transform scale-110 opacity-50" />
            <div className="w-[600px] h-[400px] rounded-[200px] overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-[-2deg] group-hover:rotate-0 transition-transform duration-700">
              <img
                src="/assets/login-bg.jpg"
                alt="Service Hub"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
