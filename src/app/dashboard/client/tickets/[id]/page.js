"use client";

import { useEffect, useState,use } from "react";
import api from "@/lib/axios";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import TicketTimeline from "@/components/TicketTimeline";
import { useRouter } from "next/navigation";


export default function TicketDetailsPage(props) {
  const router = useRouter();
  const param = use(props.params);
  const id = param.id;
  function timeLeft(deadline) {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return "Expired";
  
    const mins = Math.ceil(diff / 60000);
    return mins < 60 ? `${mins} min` : `${Math.ceil(mins / 60)} hrs`;
  }

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/client/ticket/${id}`)
      .then((res) => setTicket(res.data.ticket))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  if (!ticket) return null;

  const acceptLeft =
    ticket.status === "PENDING" && !ticket.isEscalated
      ? timeLeft(ticket.slaAcceptDeadline)
      : null;

  const assignLeft =
    ticket.status === "ACCEPTED" && !ticket.isEscalated
      ? timeLeft(ticket.slaAssignDeadline)
      : null;

  const statusColor =
    ticket.status === "CANCELLED"
      ? "bg-red-100 text-red-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="max-w-4xl space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={18} /> Back
      </button>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{ticket.title}</h1>
        <span
          className={`px-3 py-1 rounded-md text-sm font-semibold ${statusColor}`}
        >
          {ticket.status}
        </span>
      </div>

      {/* Image */}
      {ticket.imageUrl && (
        <div className="w-72 h-72 rounded-xl overflow-hidden border">
          <Image
            src={ticket.imageUrl}
            width={300}
            height={300}
            alt="ticket"
            className="object-cover"
          />
        </div>
      )}

      {/* Description */}
      <p className="text-gray-700">{ticket.description}</p>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-4 text-sm bg-white p-4 rounded-xl border">
        <p>
          <b>Severity:</b> {ticket.severityName}
        </p>

        <p>
          <b>Cost:</b> ₹{ticket.cost}
        </p>

        <p className="col-span-2">
          <b>Created:</b> {new Date(ticket.createdAt).toLocaleString()}
        </p>

        {ticket.status === "CANCELLED" && (
          <p className="col-span-2 text-red-600 font-medium">
            This ticket was cancelled
          </p>
        )}
      </div>

      {/* SLA */}
      <div className="text-sm space-y-1">
        {ticket.isEscalated && (
          <p className="text-red-600 flex items-center gap-1">
            <AlertTriangle size={16} /> Ticket Escalated
          </p>
        )}

        {acceptLeft && (
          <p>
            🕒 Will be accepted in <b>{acceptLeft}</b>
          </p>
        )}

        {assignLeft && (
          <p>
            🛠️ Will be assigned in <b>{assignLeft}</b>
          </p>
        )}
      </div>

      {/* Timeline */}
      <TicketTimeline ticket={ticket} />
    </div>
  );
}
