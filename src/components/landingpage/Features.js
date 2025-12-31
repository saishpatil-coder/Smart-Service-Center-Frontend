"use client";

import { Ticket, Wrench, Package, ShieldCheck } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Smart Ticketing",
      desc: "Automated SLA tracking and escalation for high-priority vehicle repairs.",
      icon: <Ticket className="text-blue-600" />,
    },
    {
      title: "Technician Dispatch",
      desc: "Intelligent assignment logic based on mechanic workload and expertise.",
      icon: <Wrench className="text-emerald-600" />,
    },
    {
      title: "Inventory Intelligence",
      desc: "Real-time parts tracking with automated low-stock critical alerts.",
      icon: <Package className="text-amber-600" />,
    },
    {
      title: "SLA Integrity",
      desc: "Guaranteed turnaround times with built-in escalation monitoring.",
      icon: <ShieldCheck className="text-indigo-600" />,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] mb-4">
            Core Infrastructure
          </h2>
          <p className="text-4xl font-black text-slate-900 tracking-tight">
            Everything you need to run a high-output workshop.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {f.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
