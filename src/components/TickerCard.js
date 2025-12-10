"use client";

import Image from "next/image";
import { Clock, AlertTriangle, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TicketCard({ ticket }) {
  const {
    title,
    description,
    imageUrl,
    severityName,
    status,
    createdAt,
    expectedCompletionHours,
    slaAcceptDeadline,
    slaAssignDeadline,
  } = ticket;

  /* ------------------------------
        STATUS COLORS
  ------------------------------- */
  const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ACCEPTED: "bg-blue-100 text-blue-700",
    ASSIGNED: "bg-purple-100 text-purple-700",
    IN_PROGRESS: "bg-indigo-100 text-indigo-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  }[status];

  const severityColor = {
    ACCIDENTAL: "bg-red-100 text-red-700",
    CRITICAL: "bg-orange-100 text-orange-700",
    MAJOR: "bg-yellow-100 text-yellow-700",
    MINOR: "bg-blue-100 text-blue-700",
  }[severityName];

  /* ------------------------------
        PROGRESS (fake for now)
  ------------------------------- */
  const progress =
    status === "COMPLETED"
      ? 100
      : status === "IN_PROGRESS"
      ? 65
      : status === "ASSIGNED"
      ? 30
      : 0;

  /* ------------------------------
        SLA TIME CALCULATIONS
  ------------------------------- */
function timeLeft(deadline) {
  const now = new Date();
  const target = new Date(deadline);

  const diffMs = target - now;

  if (diffMs <= 0) return "0 minutes";

  const diffMinutes = Math.ceil(diffMs / (1000 * 60));

  if (diffMinutes < 60) {
    return `${diffMinutes} minutes`;
  }

  const diffHours = Math.ceil(diffMinutes / 60);

  return `${diffHours} hours`;
}


const acceptTimeLeft = slaAcceptDeadline ? timeLeft(slaAcceptDeadline) : null;
const assignTimeLeft = slaAssignDeadline ? timeLeft(slaAssignDeadline) : null;


  /* ------------------------------ */

  return (
    <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* Image */}
        <div className="w-16 h-16 rounded-lg bg-gray-100 border overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              width={64}
              height={64}
              alt="ticket"
              className="object-cover h-full w-full"
            />
          ) : (
            <Wrench className="text-gray-400" size={28} />
          )}
        </div>

        {/* Info */}
        <div>
          <h2 className="font-semibold text-lg">{title}</h2>
          <p className="text-sm text-gray-500 truncate max-w-md">
            {description || "No description"}
          </p>

          <div className="flex items-center gap-3 mt-1">
            <span
              className={cn(
                "px-2 py-1 rounded-md text-xs font-semibold",
                severityColor
              )}
            >
              {severityName}
            </span>

            <div className="flex items-center text-gray-500 text-xs gap-1">
              <Clock size={12} />
              {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* SLA Messages */}
          <div className="mt-2 text-xs text-gray-600 space-y-1">
            {acceptTimeLeft !== null && (
              <p>
                🕒 Will be accepted in <b>{acceptTimeLeft} </b>
              </p>
            )}
            {assignTimeLeft !== null && (
              <p>
                🛠️ Will be assigned in <b>{assignTimeLeft}</b>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-48">
        <span
          className={cn(
            "px-3 py-1 rounded-md text-xs font-semibold float-right mb-2",
            statusColor
          )}
        >
          {status.replace("_", " ")}
        </span>

        <p className="text-xs text-gray-500 mb-1">Progress</p>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-xs text-gray-500 mt-2 text-right">
          Est. {expectedCompletionHours} hrs
        </p>
      </div>
    </div>
  );
}
