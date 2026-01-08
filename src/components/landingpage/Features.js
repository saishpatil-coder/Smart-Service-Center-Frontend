"use client";

import {
  Send,
  ShieldCheck,
  Wrench,
  Clock,
  CheckCircle2,
  CreditCard,
  Info,
} from "lucide-react";

export default function ServiceMethodology() {
  const workflow = [
    {
      id: "01",
      title: "Digital In-Take",
      icon: <Send className="text-[#6CA8F7]" />,
      description:
        "Your request is logged into our cloud infrastructure, initializing SLA tracking immediately.",
      detail: "Timestamped Entry",
    },
    {
      id: "02",
      title: "Admin Triage",
      icon: <ShieldCheck className="text-emerald-500" />,
      description:
        "Command Center reviews severity and validates parts before moving to the priority queue.",
      detail: "Vetted by Managers",
    },
    {
      id: "03",
      title: "Resource Allocation",
      icon: <Wrench className="text-purple-500" />,
      description:
        "The system identifies the best-suited technician and assigns a specific service bay.",
      detail: "Expert Matching",
    },
    {
      id: "04",
      title: "Active Technical Phase",
      icon: <Clock className="text-amber-500" />,
      description:
        "Mechanics clock-in and log parts in real-time, auto-decrementing inventory levels.",
      detail: "Live Resource Log",
    },
    {
      id: "05",
      title: "Quality Certification",
      icon: <CheckCircle2 className="text-indigo-500" />,
      description:
        "All tasks are validated against the initial request before certifying the vehicle for release.",
      detail: "Digital Seal",
    },
    {
      id: "06",
      title: "Financial Settlement",
      icon: <CreditCard className="text-slate-900" />,
      description:
        "A transparent consolidated invoice is generated for secure digital payment and release.",
      detail: "Automated Invoicing",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-[10px] font-black text-[#6CA8F7] uppercase tracking-[0.4em]">
            System Architecture
          </h2>
          <p className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Our Six-Stage <br />{" "}
            <span className="text-[#6CA8F7]">Technical Lifecycle.</span>
          </p>
        </div>

        {/* Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workflow.map((step) => (
            <div
              key={step.id}
              className="group p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <span className="text-4xl font-black text-[#6CA8F7]/10 group-hover:text-[#6CA8F7]/20 transition-colors">
                  {step.id}
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter mb-4">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                {step.description}
              </p>

              <div className="pt-6 border-t border-slate-100 flex items-center gap-2">
                <Info size={14} className="text-[#6CA8F7]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {step.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
