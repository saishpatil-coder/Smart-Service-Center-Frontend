"use client";

import {
  ShieldCheck,
  Settings2,
  Zap,
  Users2,
  BarChart3,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AboutUsPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 1. VISIONARY HERO */}
      <section className="relative pt-32 pb-24 bg-[#6CA8F7] overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            The Digital Blueprint
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8 uppercase italic">
            Engineering <br /> Workshop <br /> Precision.
          </h1>
          <p className="max-w-2xl text-xl text-blue-50/80 font-medium leading-relaxed">
            We are redefining vehicle maintenance through an integrated
            ecosystem that balances client transparency with high-velocity
            workshop operations.
          </p>
        </div>
      </section>

      {/* 2. THE CORE PILLARS (System Architecture) */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          <Pillar
            icon={<Zap className="text-blue-600" />}
            title="SLA Integrity"
            desc="Our system calculates priority snapshots at ticket creation, ensuring strict adherence to acceptance and assignment deadlines."
          />
          <Pillar
            icon={<Cpu className="text-emerald-600" />}
            title="Dynamic Inventory"
            desc="Integrated parts tracking that automatically decrements stock levels as mechanics log resources during active tasks."
          />
          <Pillar
            icon={<BarChart3 className="text-purple-600" />}
            title="Efficiency Metrics"
            desc="Real-time data aggregation monitors technician resolution speeds and workshop throughput for continuous optimization."
          />
        </div>
      </section>

      {/* 3. TECHNICAL SPECIFICATIONS (Model-Driven Insights) */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
              Built on <br /> Robust Logic.
            </h2>
            <div className="space-y-4">
              <SpecItem
                title="Tiered Severity Engine"
                detail="Customized priority levels (Low to Critical) define maximum wait times and escalation protocols."
              />
              <SpecItem
                title="PostgreSQL Integrity"
                detail="Leveraging JSONB for complex technical logs and strict UUID primary keys for secure data cross-referencing."
              />
              <SpecItem
                title="Role-Based Ecosystem"
                detail="Dedicated control planes for Administrators, Technicians, and Clients to ensure data security."
              />
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-blue-500/10 rounded-[3rem] blur-2xl group-hover:bg-blue-500/20 transition-all duration-700" />
            <div className="relative bg-slate-900 rounded-[2.5rem] p-10 border border-white/10 shadow-2xl">
              <div className="flex gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <code className="text-blue-400 text-sm font-mono leading-relaxed block overflow-x-auto whitespace-pre">
                {`// System Heartbeat
Ticket.belongsTo(Service);
Service.belongsTo(Severity);
MechanicTask.belongsTo(User, { as: 'mechanic' });`}
              </code>
              <p className="mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                Live Database Architecture
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-24 text-center px-6">
        <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-4">
          Join the Network
        </h3>
        <p className="text-4xl font-black text-slate-900 tracking-tight mb-10">
          Experience the future of service management.
        </p>
        <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-slate-200">
          Get Started Now
        </button>
      </section>
    </div>
  );
}

function Pillar({ icon, title, desc }) {
  return (
    <div className="space-y-6 p-8 rounded-[2rem] border border-slate-100 hover:border-blue-100 transition-all group hover:bg-slate-50/50">
      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed font-medium">
          {desc}
        </p>
      </div>
    </div>
  );
}

function SpecItem({ title, detail }) {
  return (
    <div className="flex gap-4 items-start p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
      <ShieldCheck className="text-blue-600 mt-1 shrink-0" size={20} />
      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 font-medium">{detail}</p>
      </div>
    </div>
  );
}
