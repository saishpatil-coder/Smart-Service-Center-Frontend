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
} from "lucide-react";
import Image from "next/image";
import TicketTimeline from "@/components/TicketTimeline";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TicketDetailsPage(props) {
  const router = useRouter();
  const params = use(props.params);
  const id = params.id;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  function timeLeft(deadline) {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return "Expired";
    const mins = Math.ceil(diff / 60000);
    return mins < 60 ? `${mins}m` : `${Math.ceil(mins / 60)}h`;
  }

  useEffect(() => {
    api
      .get(`/client/ticket/${id}`)
      .then((res) => setTicket(res.data.ticket))
      .catch((err) => console.error("Error fetching ticket:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium italic">
          Loading ticket details...
        </p>
      </div>
    );

  if (!ticket)
    return (
      <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-slate-500">Ticket not found or has been removed.</p>
      </div>
    );

  const isPending = ticket.status === "PENDING";
  const isAccepted = ticket.status === "ACCEPTED";
  const statusStyles = {
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    DEFAULT: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const currentStatusStyle =
    statusStyles[ticket.status] || statusStyles.DEFAULT;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4">
      {/* Navigation & Actions */}
      <nav className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Dashboard
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Details (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                  currentStatusStyle
                )}
              >
                {ticket.status.replace("_", " ")}
              </span>
              {ticket.isEscalated && (
                <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full animate-pulse border border-red-100">
                  <AlertTriangle size={14} /> Escalated
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {ticket.title}
            </h1>
          </header>

          {ticket.imageUrl && (
            <div className="relative aspect-video w-full max-h-[400px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
              <Image
                src={ticket.imageUrl}
                fill
                alt="Issue Evidence"
                className="object-contain"
              />
            </div>
          )}

          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              Problem Description
            </h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {ticket.description || "No additional description provided."}
            </p>
          </section>

          {/* Timeline Component Embedded Here */}
          <TicketTimeline ticket={ticket} />
        </div>

        {/* Right Column: Meta & Sidebar (1/3) */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">
              Request Summary
            </h3>

            <div className="space-y-4">
              <MetaItem
                icon={<Tag size={16} />}
                label="Severity"
                value={ticket.severityName}
              />
              <MetaItem
                icon={<BadgeIndianRupee size={16} />}
                label="Estimated Cost"
                value={`₹${ticket.cost}`}
              />
              <MetaItem
                icon={<Calendar size={16} />}
                label="Created On"
                value={new Date(ticket.createdAt).toLocaleDateString(
                  undefined,
                  { dateStyle: "medium" }
                )}
              />
            </div>

            {/* SLA Deadlines */}
            {(isPending || isAccepted) && !ticket.isEscalated && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="bg-blue-50/50 rounded-xl p-4 flex items-start gap-3">
                  <div className="mt-1">
                    <Loader2 className="animate-spin text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                      Next Milestone
                    </p>
                    <p className="text-sm text-blue-700">
                      {isPending
                        ? `Will be accepted in ${timeLeft(
                            ticket.slaAcceptDeadline
                          )}`
                        : `Will be assigned in ${timeLeft(
                            ticket.slaAssignDeadline
                          )}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {ticket.status === "CANCELLED" && (
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-red-600">
                  This request was cancelled
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function MetaItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-400">{icon}</div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800 capitalize">
          {value}
        </p>
      </div>
    </div>
  );
}
