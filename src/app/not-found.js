"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import {
  ArrowLeft,
  LayoutDashboard,
  Home,
  ShieldAlert,
  Wrench,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const router = useRouter();
  const { user } = useUser();

  // Dynamic role-based destination
  const dashboardHref = user
    ? `/dashboard/${user.role.toLowerCase()}`
    : "/login";

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-6 font-sans selection:bg-blue-100 pt-10">
      {/* Structural Minimalist Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="max-w-3xl w-full relative z-10">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* THE "MICRO-SPEC" VISUAL */}
          <div className="relative group">
            <div className="absolute -inset-8 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-slate-900 italic uppercase">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 shadow-xl shadow-blue-900/10">
                Blueprint Error
              </span>
            </div>
          </div>

          {/* MESSAGING */}
          <div className="space-y-4 max-w-lg">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Lost in the <br />{" "}
              <span className="text-blue-600">Assembly Line.</span>
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">
              The resource you are attempting to access is currently
              decommissioned or has been relocated within the service
              infrastructure.
            </p>
          </div>

          {/* PRIMARY ACTIONS: ROLE-AWARE & ELEGANT */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            {/* GO BACK */}
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 w-full sm:w-auto"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>

            {/* ROLE-BASED DASHBOARD */}
            {user && (
              <Link
                href={dashboardHref}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95 w-full sm:w-auto"
              >
                {user?.role === "ADMIN" ? (
                  <ShieldAlert size={16} />
                ) : user?.role === "MECHANIC" ? (
                  <Wrench size={16} />
                ) : (
                  <UserCircle size={16} />
                )}
                {user ? `${user.role} Console` : "Access Console"}
              </Link>
            )}

            {/* PUBLIC HOME */}
            <Link
              href="/"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95 w-full sm:w-auto"
            >
              <Home size={16} />
              Home Base
            </Link>
          </div>

          {/* SECONDARY DIAGNOSTICS */}
          <div className="pt-12 flex flex-wrap justify-center gap-x-12 gap-y-4">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                System Status
              </span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900">
                  All Nodes Operational
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Latency
              </span>
              <span className="text-xs font-bold text-slate-900">
                12ms Response
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
