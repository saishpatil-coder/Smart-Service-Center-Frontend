"use client";

import Image from "next/image";
import { Clock, Wrench, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { confirmCancel } from "./ConfirmCancleToast";
import { useUser } from "@/context/UserContext";
function timeLeft(deadline) {
  const diff = new Date(deadline) - new Date();
  if (diff <= 0) return null;

  const mins = Math.ceil(diff / 60000);
  return mins < 60 ? `${mins} min` : `${Math.ceil(mins / 60)} hrs`;
}

export default function TicketCard({ ticket }) {
  const {user} = useUser();
  const router = useRouter();
  const [cancelling , setCanceling] = useState(false)

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

  const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ACCEPTED: "bg-blue-100 text-blue-700",
    ASSIGNED: "bg-purple-100 text-purple-700",
    IN_PROGRESS: "bg-indigo-100 text-indigo-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  }[status];

  const acceptLeft = status === "PENDING" ? timeLeft(slaAcceptDeadline) : null;

  const assignLeft = status === "ACCEPTED" ? timeLeft(slaAssignDeadline) : null;



async function handleCancelConfirmed() {
  setCanceling(true);

  try { 
    await toast.promise(api.patch(`/client/ticket/${id}/cancel`), {
      loading: "Canceling ticket...",
      success: "Ticket cancelled successfully",
      error: "Failed to cancel ticket",
    });

    router.push("/dashboard/client/track");
  } catch (err) {
    console.error(err);
  } finally {
    setCanceling(false);
  }
}

function handleCancel() {
  confirmCancel(handleCancelConfirmed);
}


  return (
    <div
      onClick={() => {
        if(user.role == "ADMIN"){
          if(status == "PENDING"){
            router.push(`/dashboard/admin/ticket/${id}`);
          }else{
            router.push(`/dashboard/admin/tickets/${id}`);
          }
        }else{
          router.push(`/dashboard/client/tickets/${id}`);
        }
      }}
      className="bg-white border rounded-xl p-5 flex justify-between hover:shadow-md transition cursor-pointer"
    >
      {/* LEFT */}
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <Image src={imageUrl} width={64} height={64} alt="ticket" />
          ) : (
            <Wrench className="text-gray-400" />
          )}
        </div>

        <div>
          <h2 className="font-semibold text-lg">{title}</h2>
          <p className="text-sm text-gray-500 max-w-md truncate">
            {description || "No description"}
          </p>

          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="px-2 py-1 bg-gray-100 rounded">
              {severityName}
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              <Clock size={12} />
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* SLA / Escalation */}
          <div className="mt-2 text-xs space-y-1">
            {isEscalated && (
              <p className="text-red-600 font-semibold flex items-center gap-1">
                <AlertTriangle size={14} /> Escalated
              </p>
            )}

            {!isEscalated && acceptLeft && (
              <p>
                🕒 Will be accepted in <b>{acceptLeft}</b>
              </p>
            )}

            {!isEscalated && assignLeft && (
              <p>
                🛠️ Will be assigned in <b>{assignLeft}</b>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="text-right w-44 flex flex-col items-end justify-between">
        <span
          className={cn(
            "inline-block px-3 py-1 rounded-md text-xs font-semibold",
            statusColor
          )}
        >
          {status.replace("_", " ")}
        </span>

        {expectedCompletionHours && status !== "COMPLETED" && (
          <p className="text-xs text-gray-500">
            Est. {expectedCompletionHours} hrs
          </p>
        )}

        {(status === "PENDING" || status === "ACCEPTED") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancel();
            }}
            disabled={cancelling}
            className="text-xs text-red-600 flex items-center gap-1 hover:underline"
          >
            <X size={12} /> Cancel
          </button>
        )}
      </div>
    </div>
  );
}
