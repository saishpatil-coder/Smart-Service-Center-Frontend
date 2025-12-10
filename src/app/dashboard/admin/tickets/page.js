"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2, Ticket } from "lucide-react";
import TicketCard from "@/components/TickerCard";

const statuses = [
  "ALL",
  "PENDING",
  "ACCEPTED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export default function AllTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);

  async function loadTickets() {
    try {
      const res = await api.get("/admin/tickets");
      setTickets(res.data.tickets || []);
      setFiltered(res.data.tickets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (status === "ALL") {
      setFiltered(tickets);
    } else {
      setFiltered(tickets.filter((t) => t.status === status));
    }
  }, [status, tickets]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Ticket className="text-blue-600" /> All Tickets
      </h1>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-md border transition ${
              status === s
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Tickets */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No tickets found.</p>
        ) : (
          filtered.map((t) => <TicketCard key={t.id} ticket={t} />)
        )}
      </div>
    </div>
  );
}
