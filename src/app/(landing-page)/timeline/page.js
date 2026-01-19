"use client";

import {
  Send,
  ShieldCheck,
  Wrench,
  Clock,
  CheckCircle2,
  CreditCard,
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ServiceProcessPage() {
  const workflow = [
    {
      id: "01",
      title: "Digital In-Take",
      icon: <Send className="text-blue-600" />,
      description:
        "Your request is logged into our cloud infrastructure with high-resolution evidence and technical descriptions. This initializes the SLA tracking immediately.",
      detail: "Timestamped & Geotagged",
    },
    {
      id: "02",
      title: "Administrative Triage",
      icon: <ShieldCheck className="text-emerald-600" />,
      description:
        "Our Command Center reviews the severity. We validate parts availability and cost estimates before moving your vehicle to the priority queue.",
      detail: "Vetted by Workshop Managers",
    },
    {
      id: "03",
      title: "Resource Allocation",
      icon: <Wrench className="text-purple-600" />,
      description:
        "The system identifies the best-suited technician for your specific vehicle model. If all bays are full, your ticket is held in a smart queue until a bay opens.",
      detail: "Expert-to-Task Matching",
    },
    {
      id: "04",
      title: "Active Technical Phase",
      icon: <Clock className="text-amber-600" />,
      description:
        "The mechanic clocks into your job. Every part used is scanned and decremented from our inventory in real-time to ensure billing accuracy.",
      detail: "Real-time Resource Logging",
    },
    {
      id: "05",
      title: "Quality Certification",
      icon: <CheckCircle2 className="text-indigo-600" />,
      description:
        "Once the technician marks the job as complete, the system runs a final check on all logged tasks and parts before certifying the vehicle for release.",
      detail: "Digital Completion Seal",
    },
    {
      id: "06",
      title: "Financial Settlement",
      icon: <CreditCard className="text-slate-900" />,
      description:
        "A consolidated transparent invoice is generated. Upon secure digital payment, the vehicle release code is issued to the client.",
      detail: "Automated GST Invoicing",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Informatory Header */}
      <section className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-6">
            Operational Standards
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-8">
            The Science of <br />{" "}
            <span className="text-blue-500">Service.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
            Transparency isn't just a word—it's our architecture. We've
            digitized the traditional workshop to give you a real-time window
            into your vehicle's health.
          </p>
        </div>
      </section>

      {/* The Step-by-Step Methodology */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workflow.map((step) => (
            <div
              key={step.id}
              className="group relative p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <span className="text-4xl font-black text-slate-200 group-hover:text-blue-100 transition-colors">
                  {step.id}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                {step.description}
              </p>

              <div className="pt-6 border-t border-slate-100 flex items-center gap-2">
                <Info size={14} className="text-blue-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {step.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}
