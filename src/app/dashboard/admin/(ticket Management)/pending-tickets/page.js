"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Zap,
  ShieldAlert,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getPendingTickets } from "@/services/admin.service";

export default function PendingTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadTickets() {
    try {
      // Pass page to your service: getPendingTickets(page)
      const res = await getPendingTickets(page);
      setTickets(res.data.tickets || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error loading tickets:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, [page]);

  if (loading) return;
  <div className="flex justify-center items-center h-64">
    <Loader2 className="animate-spin text-gray-500" size={32} />
  </div>;

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-20 px-4">
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-3">
            <Zap className="text-blue-600 fill-blue-600" size={32} />
            Pending <span className="text-slate-300">Triage</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Page {page} of {totalPages}
          </p>
        </div>
      </div>

      {loading ? (
        <PendingTicketsSkeleton />
      ) : tickets.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid gap-4">
            {tickets.map((t, index) => (
              <PendingTicketCard key={t.id} ticket={t} />
            ))}
          </div>

          {/* PAGINATION CONTROLS */}
          <div className="flex items-center justify-center gap-4 pt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "w-10 h-10 rounded-xl font-black transition-all",
                    page === i + 1
                      ? "bg-slate-900 text-white"
                      : "bg-white border border-slate-100 text-slate-400 hover:border-slate-300"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function PendingTicketCard({ ticket }) {
  const { id, title, description, severityName, imageUrl, slaAcceptDeadline } =
    ticket;

  const severityStyles =
    {
      ACCIDENTAL: "border-red-500 text-red-600 bg-red-50",
      CRITICAL: "border-orange-500 text-orange-600 bg-orange-50",
      MAJOR: "border-amber-500 text-amber-600 bg-amber-50",
      MINOR: "border-blue-500 text-blue-600 bg-blue-50",
    }[severityName] || "border-slate-200 text-slate-600 bg-slate-50";

  const { label: timeLeft, isUrgent } = formatTimeLeft(slaAcceptDeadline);
  const [view, setView] = useState(false);

  return (
    <div className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300">
      <div className="flex items-center gap-6 w-full">
        {/* ENHANCED IMAGE BOX */}
        <div className="relative w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 group-hover:scale-105 transition-transform">
          {imageUrl ? (
            <Image src={imageUrl} fill alt="ticket" className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-300">
              <AlertTriangle size={32} />
            </div>
          )}
        </div>

        {/* CORE DETAILS */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "text-[9px] font-black px-2 py-0.5 rounded-full uppercase border",
                severityStyles
              )}
            >
              {severityName}
            </span>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
              ID: {id.split("-")[0]}
            </span>
          </div>
          <h2 className="font-black text-xl text-slate-900 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-400 font-bold max-w-xl truncate uppercase tracking-tighter">
            {description}
          </p>
        </div>

        {/* SLA COUNTER SECTION */}
        <div
          className={cn(
            "px-6 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[140px] border-2",
            isUrgent
              ? "border-red-100 bg-red-50 text-red-600 animate-pulse"
              : "border-blue-50 bg-blue-50/30 text-blue-600"
          )}
        >
          <span className="text-[8px] font-black uppercase tracking-[0.2em] mb-1">
            Acceptance SLA
          </span>
          <div className="flex items-center gap-1.5 font-black text-sm italic">
            <Clock size={14} />
            {timeLeft}
          </div>
        </div>

        {/* ACTION */}
        <Link href={`/dashboard/admin/pending-tickets/${id}`}>
          <button
            onClick={() => {
              setView(true);
            }}
            disabled={view}
            className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all active:scale-95 group-hover:translate-x-1 shadow-lg shadow-slate-200"
          >
            {view ? <Loader2 /> : <ChevronRight size={20} />} view
          </button>
        </Link>
      </div>
    </div>
  );
}

/* ------------------- UI Helpers -------------------- */

function PendingTicketsSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-10 p-10 animate-pulse">
      <div className="h-16 w-80 bg-slate-100 rounded-2xl" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-50 rounded-[2rem]" />
        ))}
      </div>
    </div>
  );
}

function formatTimeLeft(deadline) {
  const diff = new Date(deadline) - new Date();
  if (diff <= 0) return { label: "BREACHED", isUrgent: true };

  const mins = Math.floor(diff / 60000);
  const isUrgent = mins < 15; // Mark red if under 15 mins

  if (mins < 60) return { label: `${mins}m Remaining`, isUrgent };
  const hrs = Math.floor(mins / 60);
  return { label: `${hrs}h Remaining`, isUrgent: false };
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] animate-in fade-in zoom-in duration-500">
      <div className="relative mb-4">
        <ShieldAlert className="text-slate-200" size={64} />
        <Zap
          className="text-blue-400 absolute -top-2 -right-2 animate-pulse"
          size={24}
        />
      </div>
      <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
        Queue Fully Synchronized
      </p>
      <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-tighter">
        No pending tickets require triage at this time.
      </p>
    </div>
  );
}