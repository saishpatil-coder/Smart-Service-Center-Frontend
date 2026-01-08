"use client";

import Link from "next/link";
import { APP_NAME } from "@/constants/app";
import { Linkedin, Twitter, Facebook, Mail, Phone, MapPin, LinkedinIcon, TwitterIcon, FacebookIcon } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-3 overflow-hidden relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Top Section: Compact Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
          {/* Brand & Social */}
          <div className="col-span-2 md:col-span-1 space-y-1">
            <Link
              href="/"
              className="text-lg font-black tracking-tighter uppercase italic text-blue-500"
            >
              {APP_NAME}
            </Link>
            <div className="flex gap-1">
              <MicroSocial icon={<LinkedinIcon size={12} />} />
              <MicroSocial icon={<TwitterIcon size={12} />} />
              <MicroSocial icon={<FacebookIcon size={12} />} />
            </div>
          </div>

          {/* Micro Portals */}
          <div className="space-y-1">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-600">
              Portals
            </h4>
            <div className="flex flex-col gap-1.5">
              <MicroLink href="/dashboard/admin" label="Admin" />
              <MicroLink href="/dashboard/mechanic" label="Mechanic" />
              <MicroLink href="/dashboard/client" label="Client" />
            </div>
          </div>

          {/* Micro Nav */}
          <div className="space-y-2">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-600">
              Company
            </h4>
            <div className="flex flex-col gap-1.5">
              <MicroLink href="/about" label="About" />
              <MicroLink href="/book" label="Booking" />
              <MicroLink href="/track" label="Track" />
            </div>
          </div>

          {/* Micro Contact */}
          <div className="space-y-2">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-600">
              Support
            </h4>
            <div className="flex flex-col gap-1.5 text-[10px] text-slate-500 font-bold">
              <p className="truncate">ops@sscms.com</p>
              <p>+91 800 123 4567</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Ultra Tight */}
        <div className="pt-2 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em]">
            © {currentYear} {APP_NAME}
          </p>
          <div className="flex gap-4 text-[8px] font-black uppercase tracking-widest text-slate-500">
            <Link
              href="/privacy"
              className="hover:text-blue-500 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-blue-500 transition-colors"
            >
              Terms
            </Link>
            <Link href="/sla" className="hover:text-blue-500 transition-colors">
              SLA
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function MicroLink({ href, label }) {
  return (
    <Link
      href={href}
      className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors"
    >
      {label}
    </Link>
  );
}

function MicroSocial({ icon }) {
  return (
    <button className="text-slate-500 hover:text-blue-500 transition-all">
      {icon}
    </button>
  );
}
