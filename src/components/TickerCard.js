"use client";

import Image from "next/image";
import { Clock, Wrench, AlertTriangle, X, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";

function timeLeft(deadline) {
  const diff = new Date(deadline) - new Date();
  if (diff <= 0) return null;
  const mins = Math.ceil(diff / 60000);
  return mins < 60 ? `${mins}m` : `${Math.ceil(mins / 60)}h`;
}

export default function TicketCard({ ticket }) {
  const { user } = useUser();
  const router = useRouter();
  const [cancelling, setCanceling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");


  const {
    id,
    title,
    description,
    imageUrl,
    severityName,
    status,
    createdAt,
    expectedCompletionHours,
    slaAcceptDeadline,
    slaAssignDeadline,
    isEscalated,
  } = ticket;

  // Refined color palette for production
  const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-blue-50 text-blue-700 border-blue-200",
    ASSIGNED: "bg-purple-50 text-purple-700 border-purple-200",
    IN_PROGRESS: "bg-indigo-50 text-indigo-700 border-indigo-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-slate-50 text-slate-600 border-slate-200",
  }[status];

  const acceptLeft = status === "PENDING" ? timeLeft(slaAcceptDeadline) : null;
  const assignLeft = status === "ACCEPTED" ? timeLeft(slaAssignDeadline) : null;

  const handleNavigate = () => {
    if(showCancelModal)return ;
    const path =
      user.role === "ADMIN"
        ? `/dashboard/admin/tickets/${id}`
        : `/dashboard/client/tickets/${id}`;
    router.push(path);
  };
  
  async function handleCancel() {
    if (!cancelReason.trim()) {
      toast.error("Cancellation reason is required");
      return;
    }

    try {
      setCanceling(true);

      await api.patch(
        user.role === "ADMIN"
          ? `/admin/ticket/${id}/cancel`
          : `/client/ticket/${id}/cancel`,
        { reason: cancelReason }
      );

      toast.success("Ticket cancelled successfully");

      // close modal & reset state
      setShowCancelModal(false);
      setCancelReason("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel ticket");
    } finally {
      setCanceling(false);
    }
  }

  return (
    <div
      onClick={handleNavigate}
      className="group relative bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-5 flex-1 min-w-0">
        {/* Image/Icon Wrapper */}
        <div className="relative w-14 h-14 shrink-0 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
          {imageUrl ? (
            <Image src={imageUrl} fill className="object-cover" alt="ticket" />
          ) : (
            <Wrench className="text-slate-400 w-6 h-6" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="font-semibold text-slate-900 truncate">{title}</h2>
            {isEscalated && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                <AlertTriangle size={10} /> Escalated
              </span>
            )}
          </div>

          <p className="text-sm text-slate-500 line-clamp-1 mb-2">
            {description || "No description provided"}
          </p>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock size={14} /> {new Date(createdAt).toLocaleDateString()}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded capitalize">
              {severityName.toLowerCase()}
            </span>

            {/* SLA Badges */}
            {!isEscalated && (acceptLeft || assignLeft) && (
              <span className="text-blue-600 animate-pulse">
                •{" "}
                {acceptLeft
                  ? `Accept in ${acceptLeft}`
                  : `Assign in ${assignLeft}`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-end gap-3 ml-4 shrink-0">
        <div
          className={cn(
            "px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-tight",
            statusStyles
          )}
        >
          {status.replace("_", " ")}
        </div>

        {expectedCompletionHours && status !== "COMPLETED" && (
          <span className="text-[11px] text-slate-400 font-medium">
            Est: {expectedCompletionHours}h
          </span>
        )}

        {(status === "PENDING" || status === "ACCEPTED") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowCancelModal(true);
            }}
            disabled={cancelling}
            className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <X size={14} /> Cancel
          </button>
        )}

        {/* Subtle Arrow on hover */}
        <ChevronRight
          className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
          size={18}
        />
      </div>
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="text-red-600" size={20} />
              Cancel Ticket
            </h3>

            <p className="text-sm text-slate-500">
              Please provide a reason for cancelling this ticket. This will be
              visible to the client.
            </p>

            <textarea
              rows={4}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>

              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {cancelling ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}