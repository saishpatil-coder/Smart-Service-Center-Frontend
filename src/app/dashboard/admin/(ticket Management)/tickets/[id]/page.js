// "use client";

// import { useEffect, useState, use } from "react";
// import api from "@/lib/axios";
// import {
//   Loader2,
//   AlertTriangle,
//   ArrowLeft,
//   Calendar,
//   User,
//   Wrench,
//   IndianRupee,
//   Clock,
//   ShieldCheck,
//   ExternalLink,
//   CreditCard,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";
// import Image from "next/image";
// import TicketTimeline from "@/components/TicketTimeline";
// import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";
// import TicketNotFound from "@/components/dash/ticket/TicketNotFound";
// import LoadingTicket from "@/components/dash/ticket/LoadingTicket";
// import { statusStyles } from "@/constants/app";

// export default function AdminTicketDetailsPage(props) {
//   const router = useRouter();
//   const param = use(props.params);
//   const id = param.id;

//   const [ticket, setTicket] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     setError(false);
//     async function load() {
//       try {
//         const res = await api.get(`/admin/ticket/${id}`);
//         setTicket(res.data.ticket);
//       } catch (err) {
//         setError(true);
//         console.error("Admin Fetch Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [id]);

//   if (loading) return <LoadingTicket />;
//   if (error || !ticket) return <TicketNotFound />;

//   return (
//     <div className="max-w-6xl mx-auto space-y-8 pb-12 px-4">
//       {/* Top Navigation Bar */}
//       <div className="flex items-center justify-between">
//         <button
//           onClick={() => router.back()}
//           className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
//         >
//           <ArrowLeft
//             size={18}
//             className="group-hover:-translate-x-1 transition-transform"
//           />
//           Back to Ticket Console
//         </button>
//         <div className="flex items-center gap-4">
//           <span className="text-xs text-slate-400 font-mono hidden md:block">
//             Record ID: {ticket.id}
//           </span>
//           {/* Action: Mark as Paid manually if needed */}
//           {!ticket.isPaid && ticket.status === "COMPLETED" && (
//             <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
//               Pay Now
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main Content Column */}
//         <div className="lg:col-span-2 space-y-6">


//           <TicketTimeline ticket={ticket} />
//         </div>

//         {/* Sidebar Insights */}
//         <div className="space-y-6">
//           {/* NEW: Financial & Payment Reconciliation Card */}
//           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="p-4 bg-slate-900 text-white flex items-center gap-2">
//               <CreditCard size={18} className="text-blue-400" />
//               <h3 className="font-bold text-xs uppercase tracking-widest">
//                 Financial Audit
//               </h3>
//             </div>
//             <div className="p-5 space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-xs text-slate-500 font-medium uppercase">
//                   Service Fee
//                 </span>
//                 <span className="text-lg font-black text-slate-900 flex items-center">
//                   <IndianRupee size={16} /> {ticket.cost || 0}
//                 </span>
//               </div>

//               <div className="pt-4 border-t border-slate-100">
//                 <div
//                   className={cn(
//                     "flex items-center justify-between p-3 rounded-xl border",
//                     ticket.isPaid
//                       ? "bg-emerald-50 border-emerald-100 text-emerald-700"
//                       : "bg-red-50 border-red-100 text-red-700",
//                   )}
//                 >
//                   <div className="flex items-center gap-2">
//                     {ticket.isPaid ? (
//                       <ShieldCheck size={18} />
//                     ) : (
//                       <XCircle size={18} />
//                     )}
//                     <div className="leading-none">
//                       <p className="text-[10px] font-black uppercase tracking-tighter">
//                         Status
//                       </p>
//                       <p className="text-xs font-bold">
//                         {ticket.isPaid
//                           ? "TRANSACTION CLEARED"
//                           : "OUTSTANDING DUES"}
//                       </p>
//                     </div>
//                   </div>
//                   {ticket.isPaid && (
//                     <div className="text-right">
//                       <p className="text-[10px] font-black uppercase tracking-tighter">
//                         Method
//                       </p>
//                       <p className="text-xs font-bold">
//                         {ticket.paymentMethod || "ONLINE"}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stakeholder View */}
//           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
//               <User size={18} className="text-blue-600" />
//               <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
//                 Stakeholder View
//               </h3>
//             </div>
//             <div className="p-5 space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                   Client Account
//                 </label>
//                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center group cursor-pointer hover:bg-white transition-all">
//                   <div className="min-w-0">
//                     <p className="text-sm font-bold text-slate-900 truncate">
//                       {ticket.client?.name || "Anonymous"}
//                     </p>
//                     <p className="text-[10px] text-slate-500 truncate">
//                       {ticket.client?.email || "N/A"}
//                     </p>
//                   </div>
//                   <ExternalLink size={14} className="text-blue-400 shrink-0" />
//                 </div>
//               </div>


//               <div className="space-y-2">
//                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                   Assigned Technician
//                 </label>
//                 {ticket.mechanic ? (
//                   <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center group cursor-pointer hover:bg-white transition-all">
//                     <div className="min-w-0">
//                       <p className="text-sm font-bold text-slate-900 truncate">
//                         {ticket.mechanic.name}
//                       </p>
//                       <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">
//                         Active Duty
//                       </p>
//                     </div>
//                     <ExternalLink
//                       size={14}
//                       className="text-emerald-400 shrink-0"
//                     />
//                   </div>
//                 ) : (
//                   <div className="bg-slate-50 p-3 rounded-xl border border-dashed border-slate-300 text-center">
//                     <p className="text-xs text-slate-400 italic font-medium">
//                       Technician not assigned
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* SLA Tracking */}
//           <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200 space-y-4 relative overflow-hidden">
//             <div className="flex items-center gap-2 text-blue-400 relative z-10">
//               <Clock size={18} />
//               <h3 className="font-bold text-xs uppercase tracking-widest">
//                 SLA Performance
//               </h3>
//             </div>

//             <div className="space-y-4 relative z-10">
//               <div className="flex justify-between items-end border-b border-white/10 pb-2">
//                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
//                   Log Created
//                 </span>
//                 <span className="text-xs font-mono">
//                   {new Date(ticket.createdAt).toLocaleDateString()}
//                 </span>
//               </div>

//               {ticket.status === "COMPLETED" ? (
//                 <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
//                   <p className="text-[9px] text-emerald-400 font-bold uppercase mb-1 tracking-widest">
//                     Resolution Timestamp
//                   </p>
//                   <p className="text-xs font-bold">
//                     {new Date(ticket.completedAt).toLocaleString()}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
//                   <p className="text-[9px] text-blue-400 font-bold uppercase mb-1 tracking-widest">
//                     Target Deadline
//                   </p>
//                   <p className="text-xs font-bold">
//                     {new Date(ticket.expectedCompletionAt).toLocaleString()}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import TicketDetailsView from "@/components/dash/ticket/TicketDetails";
import { useUser } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";

function page(props) {
  const param = use(props.params);
  const id = param.id;
  const { user, loading } = useUser();
  const [role, setRole] = useState(null);
  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  return <div>{loading ? <Loader2 /> : <TicketDetailsView id={id} role={role} />}</div>;
}

export default page;
