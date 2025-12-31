"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Settings, Info } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-[#6CA8F7] text-white py-24 md:py-32 overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-white/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-6 items-center relative z-10">
        {/* LEFT CONTENT */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="space-y-2">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">
              Next-Gen Workshop
            </span>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase italic">
              Service <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                Center
              </span>
            </h1>
          </div>

          <p className="text-white/80 text-lg md:text-xl max-w-md font-medium leading-relaxed">
            Revolutionize your workshop operations. Manage, book, and track
            vehicle services with real-time intelligence and unmatched
            reliability.
          </p>

          {/* Buttons Row */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard/book"
              className="group flex items-center gap-2 bg-white text-slate-900 px-6 py-3.5 rounded-2xl font-bold transition-all hover:bg-slate-50 active:scale-95 shadow-xl shadow-blue-900/10"
            >
              <Calendar size={18} className="text-blue-600" />
              Book Service
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              href="/dashboard"
              className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold transition-all hover:bg-black active:scale-95 shadow-xl shadow-blue-900/20"
            >
              <Settings
                size={18}
                className="text-slate-400 group-hover:rotate-90 transition-transform"
              />
              Manage Fleet
            </Link>
          </div>

          {/* Learn More - Subtle Link */}
          <button className="flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm transition-colors group">
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <Info size={16} />
            </div>
            Learn how we optimize SLAs
          </button>
        </div>

        {/* RIGHT IMAGE (Enhanced Oval Geometry) */}
        <div className="hidden lg:flex justify-end animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <div className="relative group">
            {/* Glow Effect behind image */}
            <div className="absolute inset-0 bg-white/30 rounded-[200px] blur-2xl transform scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="w-[680px] h-[420px] rounded-[210px] overflow-hidden shadow-2xl border-4 border-white/10 transform translate-x-12 md:translate-x-24 rotate-[-2deg] group-hover:rotate-0 transition-transform duration-700">
              <img
                src="/assets/login-bg.jpg"
                alt="Smart Service Center Hub"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
