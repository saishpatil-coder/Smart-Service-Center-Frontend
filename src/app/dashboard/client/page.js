"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { AlertTriangle, Clock, Loader2, Loader2Icon, Ticket } from "lucide-react";

import { useUser } from "@/context/UserContext";
import LoadingDashboard from "@/components/Loading";
import TicketCard from "@/components/TickerCard";

export default function ClientDashboardPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [ticketLoading, setTicketLoading] = useState(true);

  /* ------------------ ROLE PROTECTION ------------------ */
  useEffect(() => {
    if (!authLoading && user && user.role !== "CLIENT") {
      router.replace("/unauthorized");
    }
  }, [authLoading, user, router]);

  /* ------------------ FETCH TICKETS ------------------ */
  useEffect(() => {
    if (!user) return;

    api
      .get("/client/tickets")
      .then((res) => {
        setTickets(res.data.tickets || []);
      })
      .catch((err) => {
        console.error("FETCH TICKETS ERROR:", err);
      })
      .finally(() => {
        setTicketLoading(false);
      });
  }, [user]);

  /* ------------------ GLOBAL LOADING ------------------ */
  if (authLoading || !user) {
    return <LoadingDashboard />;
  }

  if (ticketLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2Icon className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  /* ------------------ DERIVED STATS ------------------ */
  const totalTickets = tickets.length;

  const activeTickets = tickets.filter(
    (t) => !["COMPLETED", "CANCELLED"].includes(t.status)
  ).length;

  const escalatedTickets = tickets.filter((t) => t.isEscalated).length;

  const recentTickets = tickets.slice(0, 4); // latest 4 (already sorted DESC)

  /* ------------------ UI ------------------ */
  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user.name} 👋
        </h1>
        <p className="text-gray-500 text-sm">
          Track and manage your service requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Ticket className="text-blue-600" />}
          label="Total Tickets"
          value={totalTickets}
        />
        <StatCard
          icon={<Clock className="text-orange-600" />}
          label="Active Tickets"
          value={activeTickets}
        />
        <StatCard
          icon={<AlertTriangle className="text-red-600" />}
          label="Escalated"
          value={escalatedTickets}
        />
      </div>

      {/* Last Ticket */}
      {/* Recent Tickets */}
      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Recent Tickets</h2>

          <button
            onClick={() => router.push("/dashboard/client/tickets")}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View all →
          </button>
        </div>

        {recentTickets.length === 0 ? (
          <p className="text-gray-500 text-sm">No tickets created yet.</p>
        ) : (
          <div className="space-y-3">
            {recentTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


/* ------------------ STAT CARD ------------------ */
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
