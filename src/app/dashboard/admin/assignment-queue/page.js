"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2, ListOrdered, Wrench, Clock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <ListOrdered className="text-blue-600" /> Assignment Queue
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

function QueueCard({ ticket }) {
  const {
    title,
    description,
    severityName,
    severityPriority,
    imageUrl,
    slaAssignDeadline,
    createdAt,
  } = ticket;

  const severityColor = {
    ACCIDENTAL: "bg-red-100 text-red-700",
    CRITICAL: "bg-orange-100 text-orange-700",
    MAJOR: "bg-yellow-100 text-yellow-700",
    MINOR: "bg-blue-100 text-blue-700",
  }[severityName];

  return (
    <div className="flex justify-between p-5 bg-white rounded-xl border shadow-sm hover:shadow-md transition">
      {/* Left */}
      <div className="flex items-center gap-4">
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
            <Wrench className="text-gray-400" size={28} />
          )}
        </div>

        <div>
          <h2 className="font-semibold text-lg">{title}</h2>
          <p className="text-sm text-gray-500 max-w-md truncate">
            {description}
          </p>

          <div className="flex items-center gap-3 mt-1">
            <span
              className={cn(
                "px-2 py-1 rounded-md text-xs font-semibold",
                severityColor
              )}
            >
              {severityName}
            </span>

            <span className="flex items-center text-xs text-blue-600 gap-1">
              <Clock size={12} />
              {formatTimeLeft(slaAssignDeadline)}
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="text-right">
        <p className="text-xs text-gray-400">
          Created: {new Date(createdAt).toLocaleString()}
        </p>
        <p className="text-xs text-gray-400">Priority: #{severityPriority}</p>
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
