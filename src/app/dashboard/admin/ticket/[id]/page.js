"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import {
  Loader2,
  Clock,
  XCircle,
  ArrowLeft,
  CheckCircle2,
  IndianRupee,
  Timer,
  AlertCircle,
  User,
  Wrench,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

export default function AdminTicketDetails(props) {
  const router = useRouter();
  const param = use(props.params);
  const id = param.id;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [canceling, setCanceling] = useState(false);

  async function loadTicket() {
    try {
      const res = await api.get(`/admin/ticket/${id}`);
      setTicket(res.data.ticket);
    } catch (err) {
      toast.error("Failed to load ticket records");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTicket();
  }, []);

  async function handleAccept() {
    setAccepting(true);
    try {
      await toast.promise(
        api.patch(`/admin/ticket/${id}/accept`),
        {
          loading: "Processing acceptance...",
          success: "Ticket moved to assignment queue",
          error: "Action failed. Check permissions.",
        }
      );
      router.push("/dashboard/admin/pending-tickets");
    } catch (err) {
      console.error(err);
    } finally {
      setAccepting(false);
    }
  }

  async function handleCancel() {
    setCanceling(true);
    try {
      await toast.promise(api.patch(`/admin/ticket/${id}/cancel`), {
        loading: "Canceling ticket...",
        success: "Ticket marked as cancelled",
        error: "Cancellation failed",
      });
      router.push("/dashboard/admin/pending-tickets");
    } catch (err) {
      console.error(err);
    } finally {
      setCanceling(false);
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-slate-500 font-medium">Fetching secure record...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 px-4">
      {/* Navigation */}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Pending Queue
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Ticket Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100">
                    {ticket.severityName}
                  </span>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">{ticket.title}</h1>
                </div>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Subject Description</label>
                <p className="text-slate-600 leading-relaxed font-medium">{ticket.description}</p>
              </div>

              {ticket.imageUrl && (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                  <Image src={ticket.imageUrl} fill alt="Ticket attachment" className="object-contain p-2" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Admin Review & Actions */}
        <aside className="lg:col-span-5 space-y-6">
          {/* Service Specs Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="text-blue-600" size={18} /> Service Parameters
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Base Labor</p>
                <p className="text-lg font-black text-slate-900 flex items-center gap-1">
                  <Timer size={16} className="text-slate-400" /> {ticket.expectedCompletionHours || "—"}h
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Est. Cost</p>
                <p className="text-lg font-black text-slate-900 flex items-center gap-1">
                  <IndianRupee size={16} className="text-slate-400" /> {ticket.expectedCost || "—"}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
               <InfoRow label="Client" value={ticket.client?.name} icon={<User size={14}/>} />
               <InfoRow label="Service Type" value={ticket.serviceTitle} icon={<Wrench size={14}/>} />
               <InfoRow label="Created On" value={new Date(ticket.createdAt).toLocaleDateString()} icon={<Calendar size={14}/>} />
            </div>
          </div>

          {/* SLA Status Card */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200 space-y-5">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
                <Clock size={16} /> SLA Targets
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Accept Before</span>
                <span className="text-xs font-bold">{new Date(ticket.slaAcceptDeadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Assign Deadline</span>
                <span className="text-xs font-bold">{new Date(ticket.slaAssignDeadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
            </div>
          </div>

          {/* Final Actions */}
          <div className="space-y-3 pt-4">
            <button
              onClick={handleAccept}
              disabled={accepting || canceling}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
            >
              {accepting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
              Accept Ticket
            </button>

            <button
              onClick={handleCancel}
              disabled={accepting || canceling}
              className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
            >
              {canceling ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
              Decline & Cancel
            </button>
          </div>
        </aside>
        </div>
      </div>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-2">
        {icon} {label}
      </span>
      <span className="text-xs font-bold text-slate-800">{value || "—"}</span>
    </div>
  );
}