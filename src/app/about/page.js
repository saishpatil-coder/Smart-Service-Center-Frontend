"use client";

import {
  Target,
  Cpu,
  ShieldCheck,
  BarChart4,
  Globe,
  Workflow,
} from "lucide-react";
import { APP_NAME } from "@/constants/app";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();
  return (
    <div className="bg-white min-h-screen">
      {/* 1. VISIONARY HERO */}
      <section className="pt-32 pb-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              The Digital Standard
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic">
              Workshop <br />{" "}
              <span className="text-blue-600">Intelligence.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
              {APP_NAME} was founded to eliminate the "black box" of vehicle
              servicing. By integrating real-time tracking with automated
              logistics, we provide a level of transparency previously reserved
              for elite racing teams.
            </p>
          </div>
        </div>
      </section>

      {/* 2. THE THREE PILLARS */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12">
          <AboutCard
            icon={<Target className="text-blue-600" />}
            title="SLA Accountability"
            desc="Every ticket is bound by a strict Service Level Agreement. Our system monitors acceptance and assignment windows in real-time, escalating urgent requests to management automatically."
          />
          <AboutCard
            icon={<Cpu className="text-emerald-600" />}
            title="Smart Resource Logic"
            desc="We don't just assign mechanics; we match skills. Our algorithm routes your vehicle to a technician based on specific bay availability and historical resolution speed for your car model."
          />
          <AboutCard
            icon={<BarChart4 className="text-purple-600" />}
            title="Financial Clarity"
            desc="With direct inventory linkage, every nut, bolt, and liter of oil used is logged via the technician's console, ensuring your invoice is an exact reflection of the work performed."
          />
        </div>
      </section>

      {/* 3. TECHNICAL SPECIFICATIONS (Informatory Grid) */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-2">
              <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest">
                Our Infrastructure
              </h2>
              <p className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                Engineered for Reliability.
              </p>
            </div>
            <p className="text-slate-500 font-medium max-w-sm text-sm">
              We leverage modern technology stacks to ensure your data is secure
              and your service is fast.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SpecItem title="Real-time Status Sync" label="Operational" />
            <SpecItem title="Automated Stock Triage" label="Inventory" />
            <SpecItem title="Role-Based Secure Access" label="Security" />
            <SpecItem title="Escalation Monitoring" label="Management" />
            <SpecItem title="Consolidated Billing" label="Finance" />
            <SpecItem title="Live Service Timeline" label="Client Experience" />
          </div>
        </div>
      </section>

      {/* 4. OUR COMMITMENT */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center space-y-8">
        <div className="w-20 h-20 bg-blue-100 rounded-[2rem] flex items-center justify-center mx-auto mb-10 rotate-3">
          <ShieldCheck size={40} className="text-blue-600" />
        </div>
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
          Bridging the gap between <br /> technician and driver.
        </h3>
        <p className="text-slate-500 font-medium leading-relaxed">
          Our goal is simple: To ensure you never have to wonder about the
          status of your vehicle again. Through the {APP_NAME} portal, you have
          the same view of the workshop as our Lead Admin. Total transparency,
          total trust.
        </p>
        <div className="pt-10 flex flex-wrap justify-center gap-4">
          <button
          onClick={()=>{
            router.push("/timeline")
          }}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">
            View Our Methodology
          </button>
          <button
          onClick={()=>{
            router.push("/login");
          }}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
            Create Your First Ticket
          </button>
        </div>
      </section>
    </div>
  );
}

/* --- HELPER COMPONENTS --- */

function AboutCard({ icon, title, desc }) {
  return (
    <div className="p-10 rounded-[2.5rem] border border-slate-100 bg-white shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-500">
        {icon}
      </div>
      <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">
        {title}
      </h4>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function SpecItem({ title, label }) {
  return (
    <div className="flex items-center justify-between p-6 bg-white border border-slate-200/60 rounded-2xl group hover:border-blue-600 transition-colors">
      <span className="text-sm font-bold text-slate-800">{title}</span>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-all">
        {label}
      </span>
    </div>
  );
}
