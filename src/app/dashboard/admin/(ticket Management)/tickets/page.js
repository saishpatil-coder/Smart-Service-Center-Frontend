"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import {
  Ticket,
  FilterX,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  RotateCw,
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
  const { search } = useDashboard();
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Subtle loading for page changes

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000); // 400ms delay

    return () => clearTimeout(timer);
  }, [search]);

  const loadTickets = useCallback(
    async (isInitial = false) => {
      try {
        isInitial ? setLoading(true) : setRefreshing(true);

        const res = await api.get("/admin/tickets", {
          params: {
            page: currentPage,
            limit: 10,
            status: status,
            search: debouncedSearch, // If your backend handles search, pass it here
          },
        });

        setTickets(res.data.tickets || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalItems(res.data.totalItems || 0);
      } catch (err) {
        console.error("Failed to load tickets:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentPage, status, debouncedSearch],
  );

  useEffect(() => {
    loadTickets(true);
  }, [currentPage, status,debouncedSearch]); // Re-fetch when page or status changes

  // Reset to page 1 when status changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  if (loading) return <FullPageSkeleton />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
              <Ticket size={24} />
            </div>
            Ticket Master List
          </h1>
          <p className="text-slate-500 mt-1 font-medium ml-14">
            Monitoring{" "}
            <span className="text-blue-600 font-bold">{totalItems}</span> total
            service requests
          </p>
        </div>

        <div className="flex items-center gap-4">
          {refreshing && (
            <RotateCw size={18} className="animate-spin text-blue-600" />
          )}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
              <List size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex flex-col gap-6">
        <div className="overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                disabled={refreshing}
                onClick={() => handleStatusChange(s)}
                className={cn(
                  "px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap disabled:opacity-50",
                  status === s
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-500 hover:bg-slate-50",
                )}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets Grid */}
        <div
          className={cn(
            "grid gap-4 transition-opacity",
            refreshing ? "opacity-50" : "opacity-100",
          )}
        >
          {tickets.length === 0 ? (
            <NoResults status={status} />
          ) : (
            tickets.map((t) => (
              <div
                key={t.id}
                className="animate-in fade-in slide-in-from-bottom-3 duration-500"
              >
                <TicketCard ticket={t} />
              </div>
            ))
          )}
        </div>

        {/* Industry Standard Pagination Footer */}
        {totalItems > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-slate-200 gap-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {(currentPage - 1) * 10 + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-900">
                {Math.min(currentPage * 10, totalItems)}
              </span>{" "}
              of <span className="font-bold text-slate-900">{totalItems}</span>{" "}
              tickets
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || refreshing}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Logic to show only a few page numbers if totalPages is huge
                  if (
                    totalPages > 5 &&
                    Math.abs(pageNum - currentPage) > 1 &&
                    pageNum !== 1 &&
                    pageNum !== totalPages
                  ) {
                    if (pageNum === 2 || pageNum === totalPages - 1)
                      return <span key={pageNum}>...</span>;
                    return null;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={refreshing}
                      className={cn(
                        "w-10 h-10 rounded-lg text-sm font-bold transition-all",
                        currentPage === pageNum
                          ? "bg-blue-600 text-white shadow-md"
                          : "hover:bg-slate-100 text-slate-600",
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages || refreshing}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for Empty State
const NoResults = ({ status }) => (
  <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center">
    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
      <FilterX size={40} className="text-slate-300" />
    </div>
    <h3 className="text-slate-900 font-bold text-lg">No tickets found</h3>
    <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
      No tickets match the {status !== "ALL" ? `"${status}"` : ""} criteria.
    </p>
  </div>
);

const TicketSkeleton = () => (
  <div className="w-full bg-white border border-slate-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 animate-pulse">
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-6 bg-slate-100 rounded-lg" />
        <div className="w-32 h-6 bg-slate-100 rounded-lg" />
      </div>
      <div className="w-full h-8 bg-slate-50 rounded-xl" />
      <div className="flex gap-4">
        <div className="w-24 h-4 bg-slate-50 rounded" />
        <div className="w-24 h-4 bg-slate-50 rounded" />
      </div>
    </div>
    <div className="w-full md:w-32 h-12 bg-slate-900/5 rounded-xl" />
  </div>
);

const FullPageSkeleton = () => (
  <div className="max-w-7xl mx-auto space-y-8 pb-12 px-4">
    {/* Header Skeleton */}
    <div className="flex justify-between items-end">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
            <Ticket size={24} />
          </div>
          Ticket Master List
        </h1>
        <div className="h-10 w-64 bg-slate-100 rounded-xl" />
        <div className="h-4 w-48 bg-slate-50 rounded-lg ml-14" />
      </div>
      <div className="h-10 w-24 bg-slate-100 rounded-xl" />
    </div>

    {/* Filter Bar Skeleton */}
    <div className="flex gap-2 p-1 bg-white border border-slate-100 rounded-2xl w-fit">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="px-8 py-4 bg-slate-50 rounded-xl" />
      ))}
    </div>

    {/* Results Count Skeleton */}
    <div className="h-4 w-32 bg-slate-50 rounded" />

    {/* List Skeleton */}
    <div className="grid gap-4">
      {[1, 2, 3, 4].map((i) => (
        <TicketSkeleton key={i} />
      ))}
    </div>
  </div>
);
