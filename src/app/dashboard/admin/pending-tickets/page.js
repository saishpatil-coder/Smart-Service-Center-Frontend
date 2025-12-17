"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PendingTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  

  async function loadTickets() {
    try {
      const res = await api.get("/admin/pending-tickets");
      setTickets(res.data.tickets || []);
      console.log(res.data.tickets[0])
    } catch (err) {
      console.error("Error loading tickets:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Clock className="text-blue-600" /> Pending Tickets
      </h1>

      {tickets.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No pending tickets available.
        </p>
      )}

      <div className="space-y-4">
        {tickets.map((t) => (
          <PendingTicketCard key={t.id} ticket={t} />
        ))}
      </div>
    </div>
  );
}

function PendingTicketCard({ ticket }) {
  const {
    id,
    title,
    description,
    severityName,
    imageUrl,
    createdAt,
    slaAcceptDeadline,
  } = ticket;

  const severityColor = {
    ACCIDENTAL: "bg-red-100 text-red-700",
    CRITICAL: "bg-orange-100 text-orange-700",
    MAJOR: "bg-yellow-100 text-yellow-700",
    MINOR: "bg-blue-100 text-blue-700",
  }[severityName];

  const timeLeft = formatTimeLeft(slaAcceptDeadline);

  return (
    <div className="flex items-center justify-between p-5 bg-white rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        {/* Image */}
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              width={64}
              height={64}
              alt="ticket"
              className="object-cover w-full h-full"
            />
          ) : (
            <AlertTriangle className="text-gray-400" size={28} />
          )}
        </div>

        {/* Details */}
        <div>
          <h2 className="font-semibold text-lg">{title}</h2>
          <p className="text-sm text-gray-500 max-w-md truncate">
            {description}
          </p>

          {/* Severity + Time Left */}
          <div className="flex items-center gap-3 mt-1">
            <span
              className={cn(
                "px-2 py-1 text-xs rounded-md font-semibold",
                severityColor
              )}
            >
              {severityName}
            </span>

            <div className="flex items-center text-xs text-blue-600 gap-1">
              <Clock size={12} />
              {timeLeft}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT ACTION */}
      <Link href={`/dashboard/admin/ticket/${ticket.id}`}>
        <button className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          View <ChevronRight size={16} />
        </button>
      </Link>
    </div>
  );
}

/* ------------------- Utility: SLA countdown -------------------- */
function formatTimeLeft(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  console.log("NOW",now.toLocaleString())
  console.log("END",end.toLocaleString())

  const diff = end - now;

  if (diff <= 0) return "Expired";

  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min left`;

  const hrs = Math.floor(mins / 60);
  return `${hrs} hrs left`;
}
