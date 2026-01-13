"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2, ListOrdered, Wrench, Clock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import QueueCard from "@/components/QueueCard";

export default function AssignmentQueuePage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadQueue() {
    try {
      const res = await api.get("/admin/assignment-queue");
      setTickets(res.data.tickets || []);
    } catch (error) {
      console.error("Error loading queue:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQueue();
  }, []);

  if (loading)
    return (
      <FullPageSkeleton/>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"></h1>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
          <ListOrdered />
        </div>
        Assignment Queue
      </h1>

      {tickets.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No tickets waiting for assignment.
        </p>
      )}

      <div className="space-y-4">
        {tickets.map((t) => (
          <QueueCard key={t.id} ticket={t} />
        ))}
      </div>
    </div>
  );
}
function formatTimeLeft(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;

  if (diff <= 0) return "Expired";

  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min left`;

  const hrs = Math.floor(mins / 60);
  return `${hrs} hrs left`;
}



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
            <ListOrdered /> 
          </div>
          Assignment Queue
        </h1>
      </div>
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