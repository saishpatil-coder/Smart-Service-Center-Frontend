"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import {
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  BadgeIndianRupee,
  Tag,
  Wrench,
  Clock,
  ChevronRight,
  FileText,
  CheckCircle2,
  ShieldAlert,
  Info,
} from "lucide-react";
import Image from "next/image";
import TicketTimeline from "@/components/TicketTimeline";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import TicketMessaging from "@/components/dash/TicketMessaging";
import TicketFeedback from "@/components/dash/TicketFeedback";

export default function TicketDetailsPage(props) {
  const router = useRouter();
  const params = use(props.params);
  const id = params.id;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/client/ticket/${id}`)
      .then((res) => {
        if (res.data?.ticket) {
          setTicket(res.data.ticket);
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching ticket:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Update countdown every minute
  useEffect(() => {
    if (!ticket || ticket.status !== "PENDING") return;

    const calculate = () => {
      const deadline = ticket.slaAssignDeadline;
      if (!deadline) return;
      const diff = new Date(deadline) - new Date();
      if (diff <= 0) {
        setTimeLeftStr("SLA Breached");
      } else {
        const mins = Math.ceil(diff / 60000);
        setTimeLeftStr(
          mins < 60
            ? `${mins}m remaining`
            : `${Math.floor(mins / 60)}h remaining`
        );
      }
    };

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [ticket]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 bg-slate-50/50">
        <div className="relative flex items-center justify-center">
          <Loader2
            className="animate-spin text-blue-600 relative z-10"
            size={48}
          />
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl animate-pulse opacity-50" />
        </div>
        <p className="text-slate-500 font-bold tracking-tight">
          Retrieving Service History...
        </p>
      </div>
    );

  if (error || !ticket)
    return (
      <div className="max-w-md mx-auto mt-32 text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-xl">
        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-red-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Ticket not found
        </h2>
        <p className="text-slate-500 mb-8">
          This record might have been archived or deleted.
        </p>
        <button
          onClick={() => router.back()}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          Go Back
        </button>
      </div>
    );

  const statusStyles = {
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ASSIGNED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    DEFAULT: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-8 mt-6">
      {/* Navigation & Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition-all"
        >
          <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
            <ArrowLeft size={20} />
          </div>
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                  statusStyles[ticket.status] || statusStyles.DEFAULT
                )}
              >
                {ticket.status?.replace("_", " ")}
              </span>

              {ticket.isEscalated && ticket.status === "ASSIGNED" && (
                <span className="flex items-center gap-1.5 text-[10px] font-black text-red-600 bg-red-50 px-4 py-1.5 rounded-full border border-red-100 uppercase tracking-widest animate-pulse">
                  <ShieldAlert size={14} /> Escalated
                </span>
              )}

              {ticket.status === "PENDING" && timeLeftStr && (
                <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
                  <Clock size={14} /> {timeLeftStr}
                </span>
              )}
            </div>

            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {ticket.title}
            </h1>
          </header>

          {ticket.imageUrl && (
            <div className="group relative aspect-video w-full rounded-[40px] overflow-hidden border border-slate-200 bg-slate-100 shadow-2xl transition-transform hover:scale-[1.01]">
              <Image
                src={ticket.imageUrl}
                fill
                alt="Service Evidence"
                className="object-contain p-6"
                priority
              />
            </div>
          )}

          <section className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10">
              <FileText size={120} />
            </div>
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Info size={14} /> Problem Context
            </h3>
            <p className="text-slate-700 text-xl font-medium leading-relaxed relative z-10">
              {ticket.description || "No specific details provided."}
            </p>
          </section>

          <TicketTimeline ticket={ticket} />
          <TicketFeedback ticketId={ticket.id} />

          <TicketMessaging ticketId={ticket.id} status={ticket.status} />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 self-start">
          {/* Status Alerts */}
          {ticket.isEscalated && ticket.status === "ASSIGNED" && (
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-6 text-white shadow-xl shadow-red-100 border border-red-500">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert size={24} className="text-red-200" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Priority Escalated
                </span>
              </div>
              <p className="font-bold text-sm text-red-50 leading-relaxed">
                Our management is actively overseeing this request to ensure a
                faster resolution.
              </p>
            </div>
          )}

          {ticket.status === "COMPLETED" && (
            <div
              className={cn(
                "rounded-3xl p-7 text-white shadow-2xl border transition-all",
                ticket.isPaid
                  ? "bg-emerald-600 border-emerald-500 shadow-emerald-200"
                  : "bg-blue-600 border-blue-500 shadow-blue-200"
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-xl">
                  {ticket.isPaid ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <BadgeIndianRupee size={24} />
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                  {ticket.isPaid ? "Task Finalized" : "Action Required"}
                </span>
              </div>
              <h3 className="text-2xl font-black italic mb-6 leading-tight">
                {ticket.isPaid
                  ? "Service fully settled. Thank you for choosing us!"
                  : "Work is complete. Please settle the invoice."}
              </h3>
              {!ticket.isPaid && (
                <button
                  onClick={() =>
                    router.push("/dashboard/client/tickets/invoice")
                  }
                  className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  Pay Now <ChevronRight size={18} />
                </button>
              )}
            </div>
          )}

          {ticket.status === "CANCELLED" && (
            <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800">
              <div className="flex items-center gap-2 text-red-400 mb-4">
                <AlertTriangle size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Voided Request
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black">
                    By
                  </p>
                  <p className="text-sm font-bold">{ticket.cancelledBy}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black">
                    Reason
                  </p>
                  <p className="text-sm font-medium italic">
                    "{ticket.cancellationReason}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Job Meta Table */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 border-b border-slate-50 pb-4">
              Service Metadata
            </h3>
            <div className="grid grid-cols-1 gap-8">
              <MetaItem
                icon={<Tag className="text-blue-500" size={20} />}
                label="Service Type"
                value={ticket.serviceTitle || ticket.severityName}
              />
              <MetaItem
                icon={
                  <BadgeIndianRupee className="text-emerald-500" size={20} />
                }
                label="Estimated Cost"
                value={`₹${ticket.cost || "Pending"}`}
              />
              <MetaItem
                icon={<Calendar className="text-purple-500" size={20} />}
                label="Logged Date"
                value={new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
              <MetaItem
                icon={<Wrench className="text-slate-600" size={20} />}
                label="Ticket ID"
                value={id.slice(0, 8).toUpperCase()}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MetaItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-5 group">
      <div className="p-4 bg-slate-50 rounded-[20px] group-hover:bg-white group-hover:shadow-md transition-all border border-transparent group-hover:border-slate-100">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-base font-black text-slate-900 leading-none">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
