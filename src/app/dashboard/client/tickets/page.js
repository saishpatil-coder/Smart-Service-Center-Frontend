"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
import TicketCard from "@/components/TickerCard";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    api
      .get("/client/tickets")
      .then((res) => {
        setTickets(res.data.tickets || []);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ DERIVED STATE (correct place)
  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter === "ALL") return true;
    return ticket.status === statusFilter;
  });

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <TicketStatusFilter value={statusFilter} onChange={setStatusFilter} />

      {/* Ticket List */}
      {filteredTickets.length === 0 ? (
        <p className="text-sm text-gray-500">
          No tickets found for selected filter
        </p>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}

const STATUS_FILTERS = [
  "ALL",
  "PENDING",
  "ACCEPTED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

function TicketStatusFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_FILTERS.map((status) => {
        const active = value === status;

        return (
          <button
            key={status}
            onClick={() => onChange(status)}
            className={`px-3 py-1 rounded-full text-sm border transition
              ${
                active
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
          >
            {status}
          </button>
        );
      })}
    </div>
  );
}
