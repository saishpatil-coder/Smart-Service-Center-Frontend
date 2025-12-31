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
  CreditCard,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import TicketTimeline from "@/components/TicketTimeline";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminTicketDetailsPage(props) {
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
      <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed mx-4">
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
    <div className="max-w-6xl mx-auto space-y-8 pb-12 px-4">
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
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-mono hidden md:block">
            Record ID: {ticket.id}
          </span>
          {/* Action: Mark as Paid manually if needed */}
          {!ticket.isPaid && ticket.status === "COMPLETED" && (
            <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <header className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                      statusStyles[ticket.status]
                    )}
                  >
                    {ticket.status}
                  </span>
                  {/* NEW: Payment Status Badge */}
                  <span
                    className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border flex items-center gap-1",
                      ticket.isPaid
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-300"
                    )}
                  >
                    {ticket.isPaid ? (
                      <CheckCircle2 size={10} />
                    ) : (
                      <Clock size={10} />
                    )}
                    {ticket.isPaid ? "Payment Verified" : "Awaiting Settlement"}
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
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
          {/* NEW: Financial & Payment Reconciliation Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center gap-2">
              <CreditCard size={18} className="text-blue-400" />
              <h3 className="font-bold text-xs uppercase tracking-widest">
                Financial Audit
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium uppercase">
                  Service Fee
                </span>
                <span className="text-lg font-black text-slate-900 flex items-center">
                  <IndianRupee size={16} /> {ticket.cost || 0}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border",
                    ticket.isPaid
                      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                      : "bg-red-50 border-red-100 text-red-700"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {ticket.isPaid ? (
                      <ShieldCheck size={18} />
                    ) : (
                      <XCircle size={18} />
                    )}
                    <div className="leading-none">
                      <p className="text-[10px] font-black uppercase tracking-tighter">
                        Status
                      </p>
                      <p className="text-xs font-bold">
                        {ticket.isPaid
                          ? "TRANSACTION CLEARED"
                          : "OUTSTANDING DUES"}
                      </p>
                    </div>
                  </div>
                  {ticket.isPaid && (
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-tighter">
                        Method
                      </p>
                      <p className="text-xs font-bold">
                        {ticket.paymentMethod || "ONLINE"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stakeholder View */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <User size={18} className="text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Stakeholder View
              </h3>
            </div>
            <div className="p-5 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Client Account
                </label>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center group cursor-pointer hover:bg-white transition-all">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {ticket.client?.name || "Anonymous"}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {ticket.client?.email || "N/A"}
                    </p>
                  </div>
                  <ExternalLink size={14} className="text-blue-400 shrink-0" />
                </div>
              </div>
              {ticket.status === "CANCELLED" && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                  <p>
                    <b>Cancelled By:</b> {ticket.cancelledBy}
                  </p>
                  <p>
                    <b>Reason:</b> {ticket.cancellationReason}
                  </p>
                  <p>
                    <b>Cancelled At:</b>{" "}
                    {new Date(ticket.cancelledAt).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Assigned Technician
                </label>
                {ticket.mechanic ? (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center group cursor-pointer hover:bg-white transition-all">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {ticket.mechanic.name}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">
                        Active Duty
                      </p>
                    </div>
                    <ExternalLink
                      size={14}
                      className="text-emerald-400 shrink-0"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50 p-3 rounded-xl border border-dashed border-slate-300 text-center">
                    <p className="text-xs text-slate-400 italic font-medium">
                      Technician not assigned
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SLA Tracking */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200 space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2 text-blue-400 relative z-10">
              <Clock size={18} />
              <h3 className="font-bold text-xs uppercase tracking-widest">
                SLA Performance
              </h3>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end border-b border-white/10 pb-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Log Created
                </span>
                <span className="text-xs font-mono">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>

              {ticket.status === "COMPLETED" ? (
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  <p className="text-[9px] text-emerald-400 font-bold uppercase mb-1 tracking-widest">
                    Resolution Timestamp
                  </p>
                  <p className="text-xs font-bold">
                    {new Date(ticket.completedAt).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                  <p className="text-[9px] text-blue-400 font-bold uppercase mb-1 tracking-widest">
                    Target Deadline
                  </p>
                  <p className="text-xs font-bold">
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
