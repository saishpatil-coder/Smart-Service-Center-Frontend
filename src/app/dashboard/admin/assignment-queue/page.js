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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
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


