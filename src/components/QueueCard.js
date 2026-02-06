"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Wrench,
  Clock,
  ChevronUp,
  Hash,
  Save,
  AlertTriangle,
  Edit,
  Edit3,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { escalateTicket, savePriorityOfTicket } from "@/services/admin.service";

export default function QueueCard({ ticket, onRefresh }) {
  const {
    id,
    title,
    description,
    severityName,
    severityColor,
    imageUrl,
    slaAssignDeadline,
    createdAt,
    priority,
    isEscalated,
    status,
  } = ticket;
  console.log(ticket);
  const router = useRouter();

  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const [newPriority, setNewPriority] = useState(priority || 0);
  const [submitting, setSubmitting] = useState(false);
  // QueueCard.js
  const handleEscalate = async () => {
    setSubmitting(true);
    try {
      await escalateTicket(ticket.id);
      toast.success("Ticket Escalated");
      onRefresh && onRefresh();
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Escalation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSavePriority = async () => {
    setSubmitting(true);
    try {
      await savePriorityOfTicket(id, newPriority);
      toast.success("Priority Rank Updated");
      setIsEditingPriority(false);
      onRefresh && onRefresh();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update priority");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "flex justify-between p-5 bg-white rounded-xl border shadow-sm hover:shadow-md transition relative overflow-hidden",
        isEscalated
          ? "border-l-4 border-l-red-500 bg-red-50/20"
          : "border-slate-200",
      )}
    >
      {/* Left: Original Info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center flex-shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              width={64}
              height={64}
              alt="ticket"
              className="object-cover w-full h-full"
            />
          ) : (
            <Wrench className="text-gray-400" size={28} />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg leading-none">{title}</h2>
            {/* Status & Escalation Badges */}
            <div className="flex gap-1">
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                  status === "PENDING"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700",
                )}
              >
                {status}
              </span>
              {isEscalated && (
                <span className="flex items-center gap-0.5 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded animate-pulse">
                  <AlertTriangle size={10} /> ESCALATED
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500 max-w-md truncate mt-1">
            {description}
          </p>

          <div className="flex items-center gap-3 mt-2">
            {/* Severity from DB */}
            <span
              className="px-2 py-1 rounded-md text-xs font-semibold"
              style={{
                backgroundColor: `${severityColor}20`,
                color: severityColor,
              }}
            >
              {severityName}
            </span>

            <span className="flex items-center text-xs text-blue-600 gap-1 font-medium">
              <Clock size={12} />
              {formatTimeLeft(slaAssignDeadline)}
            </span>
          </div>
        </div>
      </div>
      {/* Right: Actions & Custom Priority */}
      <div className="flex flex-col items-end justify-between min-w-[160px] pl-4 border-l border-slate-100">
        <div className="text-right space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Entry Log: {new Date(createdAt).toLocaleDateString()}
          </p>

          {/* Priority/Rank Editor Container */}
          <div className="flex items-center justify-end">
            {isEditingPriority ? (
              <div className="flex items-center gap-1 bg-blue-50 p-1 rounded-lg border border-blue-200 animate-in slide-in-from-right-2 duration-200">
                <input
                  type="number"
                  className="w-14 bg-transparent pl-2 text-xs font-black text-blue-700 outline-none"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSavePriority()}
                  autoFocus
                />
                <button
                  disabled={submitting}
                  onClick={handleSavePriority}
                  className="bg-blue-600 text-white p-1 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Check size={14} />
                  )}
                </button>
              </div>
            ) : (
              <div
                className="group flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-50 cursor-pointer transition-all"
                onClick={() => setIsEditingPriority(true)}
              >
                <Hash
                  size={12}
                  className="text-slate-400 group-hover:text-blue-500"
                />
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">
                  Priority{" "}
                  <span className="text-blue-600 ml-1">{priority || 0}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-2 mt-4">
          {!isEscalated && (
            <button
              disabled={submitting}
              onClick={handleEscalate}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95 shadow-sm"
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <>
                  <ChevronUp size={14} strokeWidth={3} />
                  Escalate
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setIsEditingPriority(true)}
            className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-90 group"
            title="Edit Priority"
          >
            <Edit3
              size={14}
              className="group-hover:rotate-12 transition-transform"
            />
          </button>
        </div>
      </div>{" "}
    </div>
  );
}

function formatTimeLeft(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;
  if (diff <= 0) return "Expired";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m left`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h left`;
}
