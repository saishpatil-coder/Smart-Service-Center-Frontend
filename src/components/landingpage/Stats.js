"use client";

import { Zap, Cpu, ShieldCheck, Activity, Lock, Server } from "lucide-react";

export default function SystemSpecs() {
  const specs = [
    {
      title: "SLA Control Engine",
      desc: "Automated tracking of acceptance and assignment deadlines based on service severity levels.",
      label: "Management",
      icon: <Zap size={18} />,
    },
    {
      title: "Inventory Intelligence",
      desc: "Dynamic stock decrementing as parts are logged by technicians during active service tasks.",
      label: "Logistics",
      icon: <Cpu size={18} />,
    },
    {
      title: "Role-Based Security",
      desc: "Tiered access planes for Administrators, Technicians, and Clients via secure authentication.",
      label: "Security",
      icon: <ShieldCheck size={18} />,
    },
  ];

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-[#6CA8F7] uppercase tracking-[0.4em]">
              The Infrastructure
            </h2>
            <p className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Built for <br />{" "}
              <span className="text-slate-400">Precision.</span>
            </p>
          </div>
          <p className="text-slate-500 font-medium max-w-sm text-sm leading-relaxed">
            Our platform leverages a high-performance database architecture to
            ensure sub-millisecond synchronization across all service bays.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {specs.map((spec, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:border-[#6CA8F7] transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#6CA8F7] group-hover:bg-blue-50 transition-all mb-6">
                {spec.icon}
              </div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {spec.title}
                </h4>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">
                  {spec.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {spec.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Technical Footer Label */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-wrap gap-8 items-center justify-center opacity-40">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <Server size={14} /> PostgreSQL Stack
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <Activity size={14} /> Real-time Sync
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <Lock size={14} /> AES-256 Encryption
          </div>
        </div>
      </div>
    </section>
  );
}
