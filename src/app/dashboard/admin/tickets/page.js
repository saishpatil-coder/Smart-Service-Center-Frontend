"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import {
  Loader2,
  Ticket,
  Search,
  FilterX,
  LayoutGrid,
  List,
} from "lucide-react";
import TicketCard from "@/components/TickerCard";
import { useDashboard } from "@/context/DashBoardContext";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  "ALL",
  "PENDING",
  "ACCEPTED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export default function AllTicketsPage() {
  const { search } = useDashboard(); // Using global search from Topbar
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);

  async function loadTickets() {
    try {
      setLoading(true);
      const res = await api.get("/admin/tickets");
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  // Professional Filter Logic: Combines Status + Global Search
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesStatus = status === "ALL" || t.status === status;
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.clientName?.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [status, tickets, search]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 size={40} className="animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium animate-pulse">
          Syncing ticket database...
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
              <Ticket size={24} />
            </div>
            Ticket Master List
          </h1>
          <p className="text-slate-500 mt-1 font-medium ml-14 md:ml-14">
            Monitoring{" "}
            <span className="text-blue-600 font-bold">{tickets.length}</span>{" "}
            total service requests
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm">
          {/* View Toggle Placeholder */}
          <button className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
            <List size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* Segmented Filter Control */}

      <div className="flex flex-col gap-6">
        <div className="overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm">
            {STATUS_FILTERS.map((s) => {
              const isActive = status === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    "px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {s.replace("_", " ")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-slate-500 font-medium">
            Showing{" "}
            <span className="text-slate-900 font-bold">
              {filteredTickets.length}
            </span>{" "}
            results
            {status !== "ALL" && (
              <span>
                {" "}
                for status <b className="text-blue-600">{status}</b>
              </span>
            )}
          </p>
          {search && (
            <button
              onClick={() => setStatus("ALL")}
              className="text-blue-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Tickets Grid/List */}
        <div className="grid gap-4">
          {filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <FilterX size={40} className="text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg">
                No tickets match your criteria
              </h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
                Try adjusting your filters or search query to find the ticket
                you're looking for.
              </p>
            </div>
          ) : (
            filteredTickets.map((t) => (
              <div
                key={t.id}
                className="animate-in fade-in slide-in-from-bottom-3 duration-500"
              >
                <TicketCard ticket={t} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
