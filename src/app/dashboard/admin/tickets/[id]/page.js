"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import {
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  User,
  Wrench,
  IndianRupee,
  Clock,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import TicketTimeline from "@/components/TicketTimeline";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TicketDetailsPage(props) {
  const router = useRouter();
  const param = use(props.params);
  const id = param.id;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/admin/ticket/${id}`)
      .then((res) => setTicket(res.data.ticket))
      .catch((err) => console.error("Admin Fetch Error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading administrative data...
        </p>
      </div>
    );

  if (!ticket)
    return (
      <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
        <p className="text-slate-500 font-medium">
          Ticket system record not found.
        </p>
      </div>
    );

  const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-blue-50 text-blue-700 border-blue-200",
    ASSIGNED: "bg-purple-50 text-purple-700 border-purple-200",
    IN_PROGRESS: "bg-indigo-50 text-indigo-700 border-indigo-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Ticket Console
        </button>
        <div className="flex gap-2">
          {/* Placeholder for Admin Actions like Re-assign or Cancel */}
          <span className="text-xs text-slate-400 font-mono">
            Record ID: {ticket.id}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <header className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span
                  className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                    statusStyles[ticket.status]
                  )}
                >
                  {ticket.status}
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {ticket.title}
                </h1>
              </div>
              {ticket.isEscalated && (
                <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl animate-pulse shadow-lg shadow-red-200">
                  <AlertTriangle size={18} />
                  <span className="text-sm font-bold uppercase">Escalated</span>
                </div>
              )}
            </div>

            <p className="text-slate-600 leading-relaxed text-lg">
              {ticket.description || "No problem description provided."}
            </p>

            {ticket.imageUrl && (
              <div className="relative group overflow-hidden rounded-2xl border border-slate-200 aspect-video w-full bg-slate-50">
                <Image
                  src={ticket.imageUrl}
                  fill
                  alt="Visual evidence"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
          </header>

          <TicketTimeline ticket={ticket} />
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          {/* Entity Linkage Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Stakeholder View
              </h3>
            </div>

            <div className="p-5 space-y-6">
              {/* Client Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <User size={12} /> Primary Client
                </label>
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex justify-between items-center group cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {ticket.client?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {ticket.client?.email || "N/A"}
                    </p>
                  </div>
                  <ExternalLink
                    size={14}
                    className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              {/* Mechanic Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Wrench size={12} /> Assigned Technician
                </label>
                {ticket.mechanic ? (
                  <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex justify-between items-center group cursor-pointer hover:bg-emerald-50 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {ticket.mechanic.name}
                      </p>
                      <p className="text-xs text-emerald-600 font-medium italic">
                        Certified Personnel
                      </p>
                    </div>
                    <ExternalLink
                      size={14}
                      className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50 p-3 rounded-xl border border-dashed border-slate-300 text-center">
                    <p className="text-xs text-slate-400 italic">
                      No technician assigned yet
                    </p>
                  </div>
                )}
              </div>

              {/* Financial Summary */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Base Cost
                  </label>
                  <p className="text-lg font-black text-slate-900 flex items-center gap-1">
                    <IndianRupee size={16} /> {ticket.cost}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Severity
                  </label>
                  <p className="text-sm font-bold text-red-600 capitalize">
                    {ticket.severityName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Time Compliance Card */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-blue-400">
              <Clock size={18} />
              <h3 className="font-bold text-sm uppercase tracking-widest">
                SLA Compliance
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/10 pb-2">
                <span className="text-xs text-slate-400 font-medium">
                  Ticket Created
                </span>
                <span className="text-xs font-mono">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>

              {ticket.status === "COMPLETED" ? (
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1">
                    Final Resolution
                  </p>
                  <p className="text-sm font-bold">
                    {new Date(ticket.completedAt).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                  <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">
                    Target Completion
                  </p>
                  <p className="text-sm font-bold">
                    {new Date(ticket.expectedCompletionAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
