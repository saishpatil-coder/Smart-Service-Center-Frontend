"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
import TicketCard from "@/components/TickerCard";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTickets() {
    try {
      const res = await api.get("/client/tickets");
      setTickets(res.data.tickets || []);
      console.log(res.data.tickets)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Tickets</h1>

      {tickets.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          No tickets created yet.
        </p>
      )}

      {tickets.map((t) => (
        <TicketCard key={t.id} ticket={t} />
      ))}
    </div>
  );
}
