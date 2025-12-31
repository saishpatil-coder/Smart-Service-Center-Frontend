// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import api from "@/lib/axios";
// import { AlertTriangle, Clock, Loader2, Loader2Icon, Ticket } from "lucide-react";

// import { useUser } from "@/context/UserContext";
// import LoadingDashboard from "@/components/Loading";
// import TicketCard from "@/components/TickerCard";

// export default function ClientDashboardPage() {
//   const { user, loading: authLoading } = useUser();
//   const router = useRouter();
//   const [tickets, setTickets] = useState([]);
//   const [ticketLoading, setTicketLoading] = useState(true);

//   /* ------------------ ROLE PROTECTION ------------------ */
//   useEffect(() => {
//     if (!authLoading && user && user.role !== "CLIENT") {
//       router.replace("/unauthorized");
//     }
//   }, [authLoading, user, router]);

//   /* ------------------ FETCH TICKETS ------------------ */
//   useEffect(() => {
//     if (!user) return;

//     api
//       .get("/client/tickets")
//       .then((res) => {
//         setTickets(res.data.tickets || []);
//       })
//       .catch((err) => {
//         console.error("FETCH TICKETS ERROR:", err);
//       })
//       .finally(() => {
//         setTicketLoading(false);
//       });
//   }, [user]);

//   /* ------------------ GLOBAL LOADING ------------------ */
//   if (authLoading || !user) {
//     return <LoadingDashboard />;
//   }

//   if (ticketLoading) {
//     return (
//       <div className="flex justify-center py-24">
//         <Loader2Icon className="animate-spin text-blue-600" size={32} />
//       </div>
//     );
//   }

//   /* ------------------ DERIVED STATS ------------------ */
//   const totalTickets = tickets.length;

//   const activeTickets = tickets.filter(
//     (t) => !["COMPLETED", "CANCELLED"].includes(t.status)
//   ).length;

//   const escalatedTickets = tickets.filter((t) => t.isEscalated).length;

//   const recentTickets = tickets.slice(0, 4); // latest 4 (already sorted DESC)

//   /* ------------------ UI ------------------ */
//   return (
//     <div className="space-y-8 max-w-6xl">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-800">
//           Welcome, {user.name} 👋
//         </h1>
//         <p className="text-gray-500 text-sm">
//           Track and manage your service requests
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <StatCard
//           icon={<Ticket className="text-blue-600" />}
//           label="Total Tickets"
//           value={totalTickets}
//         />
//         <StatCard
//           icon={<Clock className="text-orange-600" />}
//           label="Active Tickets"
//           value={activeTickets}
//         />
//         <StatCard
//           icon={<AlertTriangle className="text-red-600" />}
//           label="Escalated"
//           value={escalatedTickets}
//         />
//       </div>

//       {/* Last Ticket */}
//       {/* Recent Tickets */}
//       <div className="bg-white p-6 rounded-xl shadow border space-y-4">
//         <div className="flex items-center justify-between">
//           <h2 className="font-semibold text-lg">Recent Tickets</h2>

//           <button
//             onClick={() => router.push("/dashboard/client/tickets")}
//             className="text-sm font-medium text-blue-600 hover:underline"
//           >
//             View all →
//           </button>
//         </div>

//         {recentTickets.length === 0 ? (
//           <p className="text-gray-500 text-sm">No tickets created yet.</p>
//         ) : (
//           <div className="space-y-3">
//             {recentTickets.map((ticket) => (
//               <TicketCard key={ticket.id} ticket={ticket} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// /* ------------------ STAT CARD ------------------ */
// function StatCard({ icon, label, value }) {
//   return (
//     <div className="bg-white p-5 rounded-xl shadow border flex items-center gap-4">
//       <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
//       <div>
//         <p className="text-sm text-gray-500">{label}</p>
//         <p className="text-xl font-bold">{value}</p>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  AlertTriangle,
  ChevronRight,
  Clock,
  Loader2,
  Loader2Icon,
  Ticket,
} from "lucide-react";

import { useUser } from "@/context/UserContext";
import LoadingDashboard from "@/components/Loading";
import TicketCard from "@/components/TickerCard";
import { cn } from "@/lib/utils";

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

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            You have{" "}
            <span className="text-blue-600 font-semibold">
              {activeTickets} active
            </span>{" "}
            service requests.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/client/create-ticket")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm"
        >
          + New Request
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<Ticket className="text-blue-600" size={20} />}
          label="Total Tickets"
          value={totalTickets}
          color="blue"
        />
        <StatCard
          icon={<Clock className="text-orange-600" size={20} />}
          label="Active Progress"
          value={activeTickets}
          color="orange"
        />
        <StatCard
          icon={<AlertTriangle className="text-red-600" size={20} />}
          label="Urgent Escalations"
          value={escalatedTickets}
          color="red"
        />
      </div>

      {/* Recent Activity Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Recent Activity
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-widest font-bold">
              Latest 4
            </span>
          </h2>

          <button
            onClick={() => router.push("/dashboard/client/tickets")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            View History <ChevronRight size={16} />
          </button>
        </div>

        {recentTickets.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-slate-500">
              No tickets found. Need help with something?
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recentTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colorMap = {
    blue: "bg-blue-50 group-hover:bg-blue-100 text-blue-600",
    orange: "bg-orange-50 group-hover:bg-orange-100 text-orange-600",
    red: "bg-red-50 group-hover:bg-red-100 text-red-600",
  };

  return (
    <div className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </p>
        </div>
        <div
          className={cn("p-3 rounded-xl transition-colors", colorMap[color])}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}