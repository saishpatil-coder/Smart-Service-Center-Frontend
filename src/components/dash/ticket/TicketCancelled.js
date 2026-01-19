import React from "react";
import { XCircle, AlertTriangle } from "lucide-react";

function TicketCancelled({ ticket }) {
  // Guard clause: If status isn't CANCELLED, don't render anything
  if (ticket?.status !== "CANCELLED") return null;

  return (
    <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-red-900 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-red-100 rounded-xl text-red-600">
          <XCircle size={20} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-red-600">
          Voided Request
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-[10px] text-red-400 uppercase font-black tracking-wider">
            Terminated By
          </p>
          <p className="text-sm font-bold">{ticket.cancelledBy || "System"}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-red-400 uppercase font-black tracking-wider">
            Timestamp
          </p>
          <p className="text-sm font-bold">
            {ticket.cancelledAt
              ? new Date(ticket.cancelledAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "N/A"}
          </p>
        </div>

        <div className="md:col-span-2 space-y-1 pt-2 border-t border-red-100">
          <p className="text-[10px] text-red-400 uppercase font-black tracking-wider">
            Reason for Cancellation
          </p>
          <p className="text-sm font-medium italic leading-relaxed">
            "{ticket.cancellationReason || "No reason provided."}"
          </p>
        </div>
      </div>
    </div>
  );
}

export default TicketCancelled;
