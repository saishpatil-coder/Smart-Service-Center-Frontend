// "use client";

// import Image from "next/image";
// import { Clock, Wrench, AlertTriangle, X } from "lucide-react";
// import { cn } from "@/lib/utils";
// import api from "@/lib/axios";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { confirmCancel } from "./ConfirmCancleToast";
// import { useUser } from "@/context/UserContext";
// function timeLeft(deadline) {
//   const diff = new Date(deadline) - new Date();
//   if (diff <= 0) return null;

//   const mins = Math.ceil(diff / 60000);
//   return mins < 60 ? `${mins} min` : `${Math.ceil(mins / 60)} hrs`;
// }

// export default function TicketCard({ ticket }) {
//   const {user} = useUser();
//   const router = useRouter();
//   const [cancelling , setCanceling] = useState(false)

//   const {
//     id,
//     title,
//     description,
//     imageUrl,
//     severityName,
//     status,
//     createdAt,
//     expectedCompletionHours,
//     slaAcceptDeadline,
//     slaAssignDeadline,
//     isEscalated,
//   } = ticket;

//   const statusColor = {
//     PENDING: "bg-yellow-100 text-yellow-700",
//     ACCEPTED: "bg-blue-100 text-blue-700",
//     ASSIGNED: "bg-purple-100 text-purple-700",
//     IN_PROGRESS: "bg-indigo-100 text-indigo-700",
//     COMPLETED: "bg-green-100 text-green-700",
//     CANCELLED: "bg-red-100 text-red-700",
//   }[status];

//   const acceptLeft = status === "PENDING" ? timeLeft(slaAcceptDeadline) : null;

//   const assignLeft = status === "ACCEPTED" ? timeLeft(slaAssignDeadline) : null;
// console.log(ticket)


// async function handleCancelConfirmed() {
//   setCanceling(true);

//   try { 
//     await toast.promise(api.patch(`/client/ticket/${id}/cancel`), {
//       loading: "Canceling ticket...",
//       success: "Ticket cancelled successfully",
//       error: "Failed to cancel ticket",
//     });

//     router.push("/dashboard/client/track");
//   } catch (err) {
//     console.error(err);
//   } finally {
//     setCanceling(false);
//   }
// }

// function handleCancel() {
//   confirmCancel(handleCancelConfirmed);
// }


//   return (
//     <div
//       onClick={() => {
//         if(user.role == "ADMIN"){
//           if(status == "PENDING"){
//             router.push(`/dashboard/admin/ticket/${id}`);
//           }else{
//             router.push(`/dashboard/admin/tickets/${id}`);
//           }
//         }else{
//           router.push(`/dashboard/client/tickets/${id}`);
//         }
//       }}
//       className="bg-white border rounded-xl p-5 flex justify-between hover:shadow-md transition cursor-pointer"
//     >
//       {/* LEFT */}
//       <div className="flex gap-4">
//         <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
//           {imageUrl ? (
//             <Image src={imageUrl} width={64} height={64} alt="ticket" />
//           ) : (
//             <Wrench className="text-gray-400" />
//           )}
//         </div>

//         <div>
//           <h2 className="font-semibold text-lg">{title}</h2>
//           <p className="text-sm text-gray-500 max-w-md truncate">
//             {description || "No description"}
//           </p>

//           <div className="flex items-center gap-3 mt-2 text-xs">
//             <span className="px-2 py-1 bg-gray-100 rounded">
//               {severityName}
//             </span>
//             <span className="flex items-center gap-1 text-gray-500">
//               <Clock size={12} />
//               {new Date(createdAt).toLocaleDateString()}
//             </span>
//           </div>

//           {/* SLA / Escalation */}
//           <div className="mt-2 text-xs space-y-1">
//             {isEscalated && (
//               <p className="text-red-600 font-semibold flex items-center gap-1">
//                 <AlertTriangle size={14} /> Escalated
//               </p>
//             )}

//             {!isEscalated && acceptLeft && (
//               <p>
//                 🕒 Will be accepted in <b>{acceptLeft}</b>
//               </p>
//             )}

//             {!isEscalated && assignLeft && (
//               <p>
//                 🛠️ Will be assigned in <b>{assignLeft}</b>
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* RIGHT */}
//       <div className="text-right w-44 flex flex-col items-end justify-between">
//         <span
//           className={cn(
//             "inline-block px-3 py-1 rounded-md text-xs font-semibold",
//             statusColor
//           )}
//         >
//           {status.replace("_", " ")}
//         </span>

//         {expectedCompletionHours && status !== "COMPLETED" && (
//           <p className="text-xs text-gray-500">
//             Est. {expectedCompletionHours} hrs
//           </p>
//         )}

//         {(status === "PENDING" || status === "ACCEPTED") && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleCancel();
//             }}
//             disabled={cancelling}
//             className="text-xs text-red-600 flex items-center gap-1 hover:underline"
//           >
//             <X size={12} /> Cancel
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { Clock, Wrench, AlertTriangle, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { confirmCancel } from "./ConfirmCancleToast";
import { useUser } from "@/context/UserContext";

function timeLeft(deadline) {
  const diff = new Date(deadline) - new Date();
  if (diff <= 0) return null;
  const mins = Math.ceil(diff / 60000);
  return mins < 60 ? `${mins}m` : `${Math.ceil(mins / 60)}h`;
}

export default function TicketCard({ ticket }) {
  const { user } = useUser();
  const router = useRouter();
  const [cancelling, setCanceling] = useState(false);

  const {
    id,
    title,
    description,
    imageUrl,
    severityName,
    status,
    createdAt,
    expectedCompletionHours,
    slaAcceptDeadline,
    slaAssignDeadline,
    isEscalated,
  } = ticket;

  // Refined color palette for production
  const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-blue-50 text-blue-700 border-blue-200",
    ASSIGNED: "bg-purple-50 text-purple-700 border-purple-200",
    IN_PROGRESS: "bg-indigo-50 text-indigo-700 border-indigo-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-slate-50 text-slate-600 border-slate-200",
  }[status];

  const acceptLeft = status === "PENDING" ? timeLeft(slaAcceptDeadline) : null;
  const assignLeft = status === "ACCEPTED" ? timeLeft(slaAssignDeadline) : null;

  const handleNavigate = () => {
    const path =
      user.role === "ADMIN"
        ? `/dashboard/admin/tickets/${id}`
        : `/dashboard/client/tickets/${id}`;
    router.push(path);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-5 flex-1 min-w-0">
        {/* Image/Icon Wrapper */}
        <div className="relative w-14 h-14 shrink-0 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
          {imageUrl ? (
            <Image src={imageUrl} fill className="object-cover" alt="ticket" />
          ) : (
            <Wrench className="text-slate-400 w-6 h-6" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="font-semibold text-slate-900 truncate">{title}</h2>
            {isEscalated && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                <AlertTriangle size={10} /> Escalated
              </span>
            )}
          </div>

          <p className="text-sm text-slate-500 line-clamp-1 mb-2">
            {description || "No description provided"}
          </p>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock size={14} /> {new Date(createdAt).toLocaleDateString()}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded capitalize">
              {severityName.toLowerCase()}
            </span>

            {/* SLA Badges */}
            {!isEscalated && (acceptLeft || assignLeft) && (
              <span className="text-blue-600 animate-pulse">
                •{" "}
                {acceptLeft
                  ? `Accept in ${acceptLeft}`
                  : `Assign in ${assignLeft}`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-end gap-3 ml-4 shrink-0">
        <div
          className={cn(
            "px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-tight",
            statusStyles
          )}
        >
          {status.replace("_", " ")}
        </div>

        {expectedCompletionHours && status !== "COMPLETED" && (
          <span className="text-[11px] text-slate-400 font-medium">
            Est: {expectedCompletionHours}h
          </span>
        )}

        {(status === "PENDING" || status === "ACCEPTED") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              confirmCancel(handleCancelConfirmed);
            }}
            disabled={cancelling}
            className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <X size={14} /> Cancel
          </button>
        )}

        {/* Subtle Arrow on hover */}
        <ChevronRight
          className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
          size={18}
        />
      </div>
    </div>
  );
}