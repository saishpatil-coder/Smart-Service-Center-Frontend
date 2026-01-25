import { statusStyles } from "@/constants/app";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import Image from "next/image";
import React from "react";

function TicketHeader({ ticket, timeLeftStr, acceptTimeLeftStr }) {
  return (
    <header className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                statusStyles[ticket.status],
              )}
            >
              {ticket.status}
            </span>
            {/* NEW: Payment Status Badge */}
            {ticket.status !== "CANCELLED" && (
              <span
                className={cn(
                  "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border flex items-center gap-1",
                  ticket.isPaid
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-500 border-slate-300",
                )}
              >
                {ticket.isPaid ? (
                  <CheckCircle2 size={10} />
                ) : (
                  <Clock size={10} />
                )}
                {ticket.isPaid ? "Payment Done" : "Awaiting payment"}
              </span>
            )}
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
      {timeLeftStr && (
        <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
          <Clock size={14} /> {timeLeftStr}
        </span>
      )}
      {acceptTimeLeftStr && (
        <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
          <Clock size={14} /> {acceptTimeLeftStr}
        </span>
      )}

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
  );
}

export default TicketHeader;
