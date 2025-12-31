"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Settings,
  RotateCcw,
  LayoutDashboard,
  SearchX,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />

      <div className="max-w-2xl w-full relative z-10 text-center">
        {/* The "Broken Machine" Visual */}
        <div className="relative inline-block mb-12">
          <div className="relative z-10 bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-900/10 border border-white flex flex-col items-center">
            <div className="flex gap-4 mb-4">
              <Settings
                className="text-blue-600 animate-[spin_8s_linear_infinite]"
                size={48}
              />
              <div className="relative">
                <Wrench className="text-slate-300 -rotate-45" size={48} />
                <AlertTriangle
                  className="absolute -top-2 -right-2 text-red-500 animate-bounce"
                  size={24}
                />
              </div>
            </div>

            <h1 className="text-9xl font-black bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tighter leading-none">
              404
            </h1>
          </div>

          {/* Decorative "Gear" shadow */}
          <Settings
            className="absolute -bottom-6 -left-6 text-slate-200/50 -z-10"
            size={120}
          />
        </div>

        {/* Messaging */}
        <div className="space-y-4 mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Lost in the Service Bay?
          </h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
            The page you requested seems to be missing from our digital
            blueprint. It might be under construction, moved to a different
            workshop, or perhaps it was a faulty ticket number.
          </p>
        </div>

        {/* Smart Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
          >
            <RotateCcw
              size={20}
              className="group-hover:-rotate-180 transition-transform duration-500"
            />
            Go Back
          </button>

          <Link
            href="/"
            className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
          >
            <LayoutDashboard size={20} />
            Service Dashboard
          </Link>
        </div>

        {/* Quick Links for a "Smart" experience */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
            Direct Diagnostics
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <QuickLink href="/dashboard/client/tickets" label="Track Tickets" />
            <QuickLink
              href="/dashboard/admin/inventory"
              label="Inventory Search"
            />
            <QuickLink href="/support" label="Contact Supervisor" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ href, label }) {
  return (
    <Link
      href={href}
      className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5"
    >
      <SearchX size={12} />
      {label}
    </Link>
  );
}
