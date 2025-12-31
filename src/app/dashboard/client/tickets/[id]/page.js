"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import {
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  BadgeIndianRupee,
  Tag,
  Wrench,
  Package,
  User,
  Clock,
  ChevronRight,
  FileText,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
import TicketTimeline from "@/components/TicketTimeline";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TicketDetailsPage(props) {
  const router = useRouter();
  const params = use(props.params);
  const id = params.id;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function timeLeft(deadline) {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return "Expired";
    const mins = Math.ceil(diff / 60000);
    return mins < 60 ? `${mins}m` : `${Math.ceil(mins / 60)}h`;
  }

  useEffect(() => {
    setLoading(true);
    api
      .get(`/client/ticket/${id}`)
      .then((res) => {
        if (res.data?.ticket) {
          setTicket(res.data.ticket);
          console.log(res.data.ticket)
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching ticket:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium italic">Synchronizing request data...</p>
      </div>
  );

  if (error || !ticket) return (
      <div className="max-w-2xl mx-auto mt-20 text-center space-y-4">
        <AlertTriangle size={32} className="mx-auto text-red-600" />
        <h2 className="text-xl font-bold text-slate-900">Unable to load ticket</h2>
        <button onClick={() => router.back()} className="text-blue-600 font-bold hover:underline">
          Return to Dashboard
        </button>
      </div>
  );

  const isPending = ticket.status === "PENDING"; 
  const isAccepted = ticket.status === "ACCEPTED"; 
  const isCompleted = ticket.status === "COMPLETED"; 
  const needsPayment = isCompleted && !ticket.isPaid; // Logic for unpaid jobs

  const statusStyles = {
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ASSIGNED: "bg-purple-50 text-purple-700 border-purple-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    DEFAULT: "bg-slate-50 text-slate-700 border-slate-200",
  };

  const currentStatusStyle = statusStyles[ticket.status] || statusStyles.DEFAULT;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 px-4 animate-in fade-in duration-500">
      <nav>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  currentStatusStyle
                )}
              >
                {ticket.status?.replace("_", " ") || "UNKNOWN"}
              </span>
              {ticket.isPaid && (
                <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                  <CheckCircle2 size={14} /> Fully Paid
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              {ticket.title}
            </h1>
          </header>

          {ticket.imageUrl && (
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
              <Image
                src={ticket.imageUrl}
                fill
                alt="Service Evidence"
                className="object-contain p-4"
              />
            </div>
          )}

          <section className="bg-white rounded-3xl p-8 border border-slate-200">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
              Problem Description
            </h3>
            <p className="text-slate-700 text-lg font-medium whitespace-pre-wrap">
              {ticket.description || "No notes provided."}
            </p>
          </section>

          <TicketTimeline ticket={ticket} />
        </div>
        {ticket.status === "CANCELLED" && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
            <p>
              <b>Cancelled By:</b> {ticket.cancelledBy}
            </p>
            <p>
              <b>Reason:</b> {ticket.cancellationReason}
            </p>
            <p>
              <b>Cancelled At:</b>{" "}
              {new Date(ticket.cancelledAt).toLocaleString()}
            </p>
          </div>
        )}

        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          {/* DYNAMIC BILLING CTA */}
          {needsPayment ? (
            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-2xl shadow-blue-200 space-y-4 border border-blue-500">
              <div className="flex items-center gap-2 opacity-80 uppercase tracking-widest text-[10px] font-black">
                <FileText size={18} /> Payment Required
              </div>
              <h3 className="text-xl font-bold leading-tight italic">
                Your vehicle is ready. Please settle the dues to release.
              </h3>
              <button
                onClick={() => router.push("/dashboard/client/tickets/invoice")}
                className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                Proceed to Payment <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            isCompleted &&
            ticket.isPaid && (
              <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-100 space-y-4 border border-emerald-500">
                <div className="flex items-center gap-2 opacity-80 uppercase tracking-widest text-[10px] font-black">
                  <CheckCircle2 size={18} /> Transaction Cleared
                </div>
                <h3 className="text-xl font-bold leading-tight italic">
                  Service finalized and paid in full. Thank you!
                </h3>
              </div>
            )
          )}

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">
              Job Parameters
            </h3>
            <div className="space-y-6">
              <MetaItem
                icon={<Tag size={16} />}
                label="Service"
                value={ticket.serviceTitle || ticket.severityName}
              />
              <MetaItem
                icon={<BadgeIndianRupee size={16} />}
                label="Labor Fee"
                value={`₹${ticket.cost || 0}`}
              />
              <MetaItem
                icon={<Calendar size={16} />}
                label="Date"
                value={new Date(ticket.createdAt).toLocaleDateString()}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MetaItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 bg-slate-50 rounded-xl text-slate-400">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-800 capitalize leading-none">{value || "N/A"}</p>
      </div>
    </div>
  );
}