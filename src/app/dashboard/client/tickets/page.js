"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import { Loader2, Search, FilterX, Inbox } from "lucide-react";
import TicketCard from "@/components/TickerCard";
import { cn } from "@/lib/utils";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api
      .get("/client/tickets")
      .then((res) => setTickets(res.data.tickets || []))
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Derived state with Search + Filter
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === "ALL" || ticket.status === statusFilter;
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [tickets, statusFilter, searchQuery]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-400 font-medium animate-pulse">
          Retrieving your tickets...
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Support History
        </h1>
        <p className="text-slate-500 text-sm">
          View and manage all your submitted service requests.
        </p>
      </div>

      {/* Control Bar: Search + Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TicketStatusTabs value={statusFilter} onChange={setStatusFilter} />

          <div className="relative w-full md:w-72 group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by title or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Ticket List Area */}
        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center px-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
              {searchQuery ? (
                <FilterX className="text-slate-300" size={32} />
              ) : (
                <Inbox className="text-slate-300" size={32} />
              )}
            </div>
            <h3 className="text-slate-900 font-bold text-lg">
              No tickets found
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm mt-1">
              {searchQuery
                ? `We couldn't find any results for "${searchQuery}". Try adjusting your search.`
                : "It looks like you don't have any tickets in this category yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const STATUS_FILTERS = [
  { id: "ALL", label: "All Tickets" },
  { id: "PENDING", label: "Pending" },
  { id: "IN_PROGRESS", label: "Active" },
  { id: "COMPLETED", label: "Resolved" },
  { id: "CANCELLED", label: "Cancelled" },
];

function TicketStatusTabs({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl w-fit border border-slate-200/50">
      {STATUS_FILTERS.map((status) => {
        const active = value === status.id;
        return (
          <button
            key={status.id}
            onClick={() => onChange(status.id)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap",
              active
                ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            )}
          >
            {status.label}
          </button>
        );
      })}
    </div>
  );
}
