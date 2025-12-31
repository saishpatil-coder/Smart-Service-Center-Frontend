"use client";

import Link from "next/link";
import { APP_NAME } from "@/constants/app";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Wrench,
  UserCircle,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter uppercase italic text-blue-400"
            >
              {APP_NAME}
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Revolutionizing workshop management through integrated SLA
              tracking, real-time inventory intelligence, and technician
              efficiency metrics. [cite: 105-125, 205-246]
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon icon={<Linkedin size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Facebook size={18} />} />
            </div>
          </div>

          {/* Platform Gateways (Role-Based) */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              System Portals
            </h4>
            <ul className="space-y-4">
              <FooterLink
                href="/dashboard/admin"
                icon={<ShieldCheck size={14} />}
                label="Admin Control Plane"
              />
              <FooterLink
                href="/dashboard/mechanic"
                icon={<Wrench size={14} />}
                label="Technician Bay"
              />
              <FooterLink
                href="/dashboard/client"
                icon={<UserCircle size={14} />}
                label="Client Dashboard"
              />
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Navigation
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-300">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-400 transition-colors"
                >
                  Engineering & About
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="hover:text-blue-400 transition-colors"
                >
                  Book a Service
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="hover:text-blue-400 transition-colors"
                >
                  Track Request Status
                </Link>
              </li>
              <li>
                <Link
                  href="/inventory"
                  className="hover:text-blue-400 transition-colors"
                >
                  Inventory Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Connect
            </h4>
            <ul className="space-y-4">
              <ContactItem icon={<Mail size={16} />} text="ops@sscms.com" />
              <ContactItem
                icon={<Phone size={16} />}
                text="+91 (800) 123-4567"
              />
              <ContactItem
                icon={<MapPin size={16} />}
                text="Tech Hub, Sector 5, Industrial Area"
              />
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            © {currentYear} {APP_NAME}. All Technical Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/sla" className="hover:text-white transition-colors">
              SLA Agreement
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label, icon }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-blue-400 transition-all"
      >
        <span className="p-1.5 bg-white/5 rounded-lg group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
          {icon}
        </span>
        {label}
      </Link>
    </li>
  );
}

function ContactItem({ icon, text }) {
  return (
    <li className="flex items-start gap-3 text-sm font-medium text-slate-400">
      <div className="mt-1 text-blue-500">{icon}</div>
      <span>{text}</span>
    </li>
  );
}

function SocialIcon({ icon }) {
  return (
    <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
      {icon}
    </button>
  );
}
