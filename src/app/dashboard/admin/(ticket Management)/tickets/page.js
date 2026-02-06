"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

import { Loader2 } from "lucide-react";

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

  // Data State
  const [tickets, setTickets] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  // Loading States
  const [loading, setLoading] = useState(true); // Initial load or filter change
  const [isFetchingNext, setIsFetchingNext] = useState(false); // Background scroll load

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [status, setStatus] = useState("ALL");

  // Debounce Search
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Sentinel for Infinite Scroll
  const observerTarget = useRef(null);

  // 1. Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 2. Main Data Fetching Function
  const fetchTickets = useCallback(
    async (pageNum, currentStatus, currentSearch) => {
      try {
        const isFirstPage = pageNum === 1;

        // Set appropriate loading state
        if (isFirstPage) {
          setLoading(true);
        } else {
          setIsFetchingNext(true);
        }

        const res = await api.get("/admin/tickets", {
          params: {
            page: pageNum,
            limit: 10,
            status: currentStatus,
            search: currentSearch,
          },
        });

        const newTickets = res.data.tickets || [];
        const totalPages = res.data.totalPages || 1;
        const totalCount = res.data.totalItems || 0;

        setTotalItems(totalCount);
        setHasMore(pageNum < totalPages);

        setTickets((prev) => {
          if (isFirstPage) return newTickets;

          // Append new tickets, filtering out any accidental duplicates by ID
          const existingIds = new Set(prev.map((t) => t.id));
          const uniqueNewTickets = newTickets.filter(
            (t) => !existingIds.has(t.id),
          );
          return [...prev, ...uniqueNewTickets];
        });
      } catch (err) {
        console.error("Failed to load tickets:", err);
      } finally {
        setLoading(false);
        setIsFetchingNext(false);
      }
    },
    [],
  );

  // 3. Effect: Trigger Reset on Filter/Search Change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    // Immediately fetch page 1
    fetchTickets(1, status, debouncedSearch);
  }, [status, debouncedSearch, fetchTickets]);

  // 4. Effect: Trigger Fetch on Page Increment (Scroll)
  useEffect(() => {
    if (page > 1) {
      fetchTickets(page, status, debouncedSearch);
    }
  }, [page, fetchTickets]); // Removed status/search to avoid double-fetching (handled by Effect #3)

  // 5. Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          !isFetchingNext
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, isFetchingNext]);

  const handleStatusChange = (newStatus) => {
    if (status === newStatus) return;
    setStatus(newStatus);
    // Page reset is handled by Effect #3
  };

  // Initial Full Page Loading (Skeleton)
  if (loading && page === 1) {
    // return <FullPageSkeleton />;
    // Fallback if skeleton component isn't available
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-8">
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
          {isFetchingNext && (
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
                disabled={loading && page === 1}
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
        <div className="grid gap-4">
          {tickets.length === 0 && !loading ? (
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

        {/* Infinite Scroll Sentinel & Loader */}
        <div
          ref={observerTarget}
          className="h-24 flex items-center justify-center w-full"
        >
          {isFetchingNext && (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Loader2 className="animate-spin" size={24} />
              <span className="text-xs font-medium uppercase tracking-widest">
                Loading more...
              </span>
            </div>
          )}

          {!hasMore && tickets.length > 0 && (
            <p className="text-xs text-slate-300 font-bold uppercase tracking-[0.2em]">
              End of list
            </p>
          )}
        </div>
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

