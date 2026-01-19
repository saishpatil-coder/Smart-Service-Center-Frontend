"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import TicketTimeline from "@/components/TicketTimeline";
import { useRouter } from "next/navigation";
import TicketMessaging from "@/components/dash/TicketMessaging";
import TicketFeedback from "@/components/dash/TicketFeedback";
import TicketNotFound from "@/components/dash/ticket/TicketNotFound";
import LoadingTicket from "@/components/dash/ticket/LoadingTicket";
import TicketHeader from "./TicketHeader";
import TicketNavigation from "./TicketNavigation";
import TicketCancelled from "./TicketCancelled";
import TicketPayment from "./TicketPayment";
import Metadata from "./Metadata";

export default function TicketDetailsView({ id, role = "client" }) {
  console.log(role);
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState("");
  const [acceptTimeLeftStr, setAcceptTimeLeftStr] = useState(null);

  const isAdmin = role === "ADMIN";

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const endpoint = isAdmin
          ? `/admin/ticket/${id}`
          : `/client/ticket/${id}`;
        const res = await api.get(endpoint);
        setTicket(res.data.ticket);
      } catch (err) {
        setError(true);
        console.error(`${role} Fetch Error:`, err);
      } finally {
        setLoading(false);
      }
    }
    role && load();
  }, [id, isAdmin, role]);

  // Countdown Logic
  useEffect(() => {
    if (!ticket) return;

    const calculate = () => {
      const isPending = ticket.status === "PENDING";
      const isAccepted = ticket.status === "ACCEPTED";

      if (isAccepted && ticket.slaAssignDeadline) {
        const diff = new Date(ticket.slaAssignDeadline) - new Date();
        setTimeLeftStr(formatTime(diff));
      }

      if (isPending && ticket.slaAcceptDeadline) {
        const diff = new Date(ticket.slaAcceptDeadline) - new Date();
        setAcceptTimeLeftStr(formatTime(diff));
      }
    };

    const formatTime = (diff) => {
      if (diff <= 0) return "SLA Breached";
      const mins = Math.ceil(diff / 60000);
      return mins < 60
        ? `${mins}m remaining`
        : `${Math.floor(mins / 60)}h remaining`;
    };

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [ticket]);

  if (loading) return <LoadingTicket />;
  if (error || !ticket) return <TicketNotFound />;

  return (
    <div className="max-w-7xl mx-auto space-y-2 px-4 md:px-8 mt-6">
      <TicketNavigation router={router} id={id} isAdmin={isAdmin} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <TicketHeader
            ticket={ticket}
            timeLeftStr={timeLeftStr}
            acceptTimeLeftStr={acceptTimeLeftStr}
          />
          <TicketTimeline ticket={ticket} />
          {ticket.status === "COMPLETED" && (
            <TicketFeedback ticketId={ticket.id} />
          )}
          {ticket.status !== "PENDING" &&
            ticket.status !== "ASSIGNED" &&
            ticket.status !== "ACCEPTED" &&
            ticket.status !== "CANCELLED" && (
              <TicketMessaging ticketId={ticket.id} status={ticket.status} />
            )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 self-start">
          <TicketCancelled ticket={ticket} />
          <TicketPayment ticket={ticket} isAdmin={isAdmin} />
          <Metadata ticket={ticket} isAdmin={isAdmin} />
        </aside>
      </div>
    </div>
  );
}
