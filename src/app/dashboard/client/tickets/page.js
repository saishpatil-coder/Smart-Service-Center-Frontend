"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import { Loader2, Search, FilterX, Inbox } from "lucide-react";
import TicketCard from "@/components/TickerCard";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/context/DashBoardContext";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage , setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const {search} = useDashboard();

useEffect(() => {
  setCurrentPage(1);
}, [statusFilter, search]);

useEffect(() => {
  let mounted = true;

  api
    .get("/client/tickets")
    .then((res) => {
      if (mounted) setTickets(res.data.tickets || []);
    })
    .catch((err) => console.error("Fetch error:", err))
    .finally(() => mounted && setLoading(false));

  return () => {
    mounted = false;
  };
}, []);


  // Derived state with Search + Filter
const filteredTickets = useMemo(() => {
  const normalizedSearch = search.toLowerCase();

  return tickets.filter((ticket) => {
    const matchesStatus =
      statusFilter === "ALL" || ticket.status === statusFilter;

    const title = ticket.title?.toLowerCase() || "";
    const id = ticket.id?.toLowerCase() || "";

    const matchesSearch =
      !normalizedSearch ||
      title.includes(normalizedSearch) ||
      id.includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });
}, [tickets, statusFilter, search]);

const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);

const paginatedTickets = useMemo(() => {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return filteredTickets.slice(start, end);
}, [filteredTickets, currentPage]);

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
        </div>
        <p className="text-sm text-slate-500">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} –{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredTickets.length)} of{" "}
          {filteredTickets.length} tickets
        </p>

        {/* Ticket List Area */}
        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center px-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
              {search ? (
                <FilterX className="text-slate-300" size={32} />
              ) : (
                <Inbox className="text-slate-300" size={32} />
              )}
            </div>
            <h3 className="text-slate-900 font-bold text-lg">
              No tickets found
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm mt-1">
              {search
                ? `We couldn't find any results for "${search}". Try adjusting your search.`
                : "It looks like you don't have any tickets in this category yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {paginatedTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

const STATUS_FILTERS = [
  { id: "ALL", label: "All Tickets" },
  { id: "PENDING", label: "Pending" },
  { id: "ACCEPTED", label: "Accepted" },
  { id: "ASSIGNED", label: "Assigned" },
  { id: "IN_PROGRESS", label: "Active" },
  { id: "COMPLETED", label: "Resolved" },
  { id: "CANCELLED", label: "Cancelled" },
];

const TicketStatusTabs = React.memo(function TicketStatusTabs({
  value,
  onChange,
}) {
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
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50",
            )}
          >
            {status.label}
          </button>
        );
      })}
    </div>
  );
});

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      {/* Prev Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange((p) => Math.max(p - 1, 1))}
        className={cn(
          "px-3 py-1.5 rounded-lg text-sm font-medium border",
          currentPage === 1
            ? "text-slate-400 border-slate-200 cursor-not-allowed"
            : "text-slate-700 border-slate-300 hover:bg-slate-100",
        )}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "w-9 h-9 rounded-lg text-sm font-semibold transition",
            currentPage === page
              ? "bg-blue-600 text-white"
              : "text-slate-600 hover:bg-slate-100",
          )}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange((p) => Math.min(p + 1, totalPages))}
        className={cn(
          "px-3 py-1.5 rounded-lg text-sm font-medium border",
          currentPage === totalPages
            ? "text-slate-400 border-slate-200 cursor-not-allowed"
            : "text-slate-700 border-slate-300 hover:bg-slate-100",
        )}
      >
        Next
      </button>
    </div>
  );
}
