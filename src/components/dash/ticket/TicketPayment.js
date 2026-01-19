"use client";

import React from "react";
import {
  CreditCard,
  ShieldCheck,
  XCircle,
  ChevronRight,
  IndianRupee,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function TicketPayment({ ticket, isAdmin }) {
  const router = useRouter();
  const isPaid = ticket?.isPaid;
  const isCompleted = ticket?.status === "COMPLETED";

  // 1. Admin View: Financial Audit Card
  if (isAdmin) {
    return (
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
            <span className="text-lg font-black text-slate-900 flex items-center gap-1">
              <IndianRupee size={16} /> {ticket.cost || 0}
            </span>
          </div>

          <div
            className={cn(
              "flex items-center justify-between p-3 rounded-xl border",
              isPaid
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-red-50 border-red-100 text-red-700",
            )}
          >
            <div className="flex items-center gap-2">
              {isPaid ? <ShieldCheck size={18} /> : <XCircle size={18} />}
              <div className="leading-none">
                <p className="text-[10px] font-black uppercase tracking-tighter opacity-70">
                  Payment Status
                </p>
                <p className="text-xs font-bold">
                  {isPaid ? "TRANSACTION CLEARED" : "OUTSTANDING DUES"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Client View: Payment CTA (Only shows when completed)
  if (!isAdmin && isCompleted) {
    return (
      <div
        className={cn(
          "rounded-3xl p-7 text-white shadow-2xl border transition-all duration-300",
          isPaid
            ? "bg-emerald-600 border-emerald-500 shadow-emerald-100"
            : "bg-blue-600 border-blue-500 shadow-blue-100",
        )}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-xl">
            {isPaid ? <CheckCircle2 size={24} /> : <IndianRupee size={24} />}
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
            {isPaid ? "Task Finalized" : "Action Required"}
          </span>
        </div>

        <h3 className="text-2xl font-black italic mb-6 leading-tight">
          {isPaid
            ? "Service fully settled. Thank you for choosing us!"
            : "Work is complete. Please settle the invoice."}
        </h3>

        {!isPaid && (
          <button
            onClick={() => router.push("/dashboard/client/tickets/invoice")}
            className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Pay Now <ChevronRight size={18} />
          </button>
        )}
      </div>
    );
  }

  // 3. Fallback: If neither condition is met (e.g., Client ticket is still pending)
  return null;
}
