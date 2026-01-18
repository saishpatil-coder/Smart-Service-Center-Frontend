"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Ticket,
  Package,
  AlertTriangle,
  IndianRupee,
  Zap,
  Trophy,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import LoadingDashboard from "@/components/Loading";
import { Leaderboard } from "@/components/dash/admin/LeaderBoard";

// const TIMEFRAMES = [
//   { label: "All Time", value: "all" },
//   { label: "Last 24h", value: "24h" },
//   { label: "Last 7 Days", value: "7d" },
//   { label: "Monthly", value: "30d" },
// ];

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#6366f1",
];

// export default function AdminDashboard() {
//   const [timeframe, setTimeframe] = useState("all");
//   const { user, loading: authLoading } = useUser();
//   const router = useRouter();

//   const [data, setData] = useState(null);
//   const [dataLoading, setDataLoading] = useState(true);

//   useEffect(() => {
//     if (!authLoading && user?.role !== "ADMIN") {
//       router.replace("/unauthorized");
//     }
//   }, [authLoading, user, router]);

//   useEffect(() => {
//     setDataLoading(true);
//     api
//       .get(`/admin/dashboard/industry-stats?timeframe=${timeframe}`)
//       .then((res) => setData(res.data))
//       .catch((err) => console.error("Dashboard sync failed:", err))
//       .finally(() => setDataLoading(false));
//   }, [timeframe]);

//   const processedData = useMemo(() => {
//     if (!data) return { statusData: [], mechanicData: [] };

//     const statusData = (data.statusStats || []).map((s) => ({
//       name: s.status?.replace("_", " ") || "N/A",
//       value: Number(s.count || 0),
//     }));

//     const mechanicData = (data.leaderboard || []).map((m) => ({
//       name: m.name || "Unknown",
//       resolved: Number(m.resolved || 0),
//       efficiency: parseFloat(m.efficiency || 0),
//     }));

//     return { statusData, mechanicData };
//   }, [data]);

//   if (authLoading || !user) return <LoadingDashboard />;
//   if (dataLoading || !data) return <DashboardSkeleton />;

//   return (
//     <div className="max-w-[1600px] mx-auto space-y-8 pb-12 px-4 animate-in fade-in duration-700">
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//         <div className="flex flex-col gap-1">
//           <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
//             <History className="text-blue-600" size={32} /> Executive Control
//           </h1>
//           <p className="text-slate-500 font-medium italic">
//             Last Updated: {new Date(data.lastUpdated).toLocaleString()}
//           </p>
//         </div>

//         <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit border border-slate-200">
//           {TIMEFRAMES.map((t) => (
//             <button
//               key={t.value}
//               onClick={() => setTimeframe(t.value)}
//               className={cn(
//                 "px-4 py-2 rounded-xl text-xs font-bold transition-all",
//                 timeframe === t.value
//                   ? "bg-white text-blue-600 shadow-sm"
//                   : "text-slate-500 hover:text-slate-900"
//               )}
//             >
//               {t.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* KPI GRID */}
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
//         <KPICard
//           title="Revenue"
//           value={`₹${(data.metrics?.revenue ?? 0).toLocaleString()}`}
//           trend="Total"
//           icon={<IndianRupee size={20} />}
//           color="blue"
//         />
//         <KPICard
//           title="Throughput"
//           value={data.metrics?.ticketThroughput ?? 0}
//           trend="Tickets"
//           icon={<Ticket size={20} />}
//           color="indigo"
//         />
//         <KPICard
//           title="Avg Efficiency"
//           value={`${parseFloat(data.metrics?.avgEfficiency || 0).toFixed(1)}%`}
//           trend="SLA Compliance"
//           icon={<Zap size={20} />}
//           color="emerald"
//         />
//         <KPICard
//           title="Risk Level"
//           value={data.metrics?.riskLevel ?? 0}
//           trend="Breached/Escalated"
//           icon={<AlertTriangle size={20} />}
//           color="amber"
//           isAlert={data.metrics?.riskLevel > 0}
//         />
//         <KPICard
//           title="Inventory"
//           value={data.inventory?.length || 0}
//           trend="Low Stock Items"
//           icon={<Package size={20} />}
//           color="red"
//           isAlert={data.inventory?.length > 0}
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* PIE CHART */}
//         <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
//           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 font-mono">
//             Workload Distribution
//           </h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={processedData.statusData}
//                   innerRadius={60}
//                   outerRadius={80}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {processedData.statusData.map((_, index) => (
//                     <Cell
//                       key={index}
//                       fill={COLORS[index % COLORS.length]}
//                       stroke="none"
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{
//                     borderRadius: "12px",
//                     border: "none",
//                     boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* BAR CHART */}
//         <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
//           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 font-mono">
//             <Trophy size={16} className="text-amber-500" /> Mechanic Efficiency
//             Leaderboard
//           </h3>
//           <div className="h-[340px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={processedData.mechanicData} layout="vertical">
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   horizontal={true}
//                   vertical={false}
//                   stroke="#f1f5f9"
//                 />
//                 <XAxis type="number" hide />
//                 <YAxis
//                   dataKey="name"
//                   type="category"
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fontSize: 11, fill: "#64748b", fontWeight: 700 }}
//                   width={120}
//                 />
//                 <Tooltip
//                   cursor={{ fill: "#f8fafc" }}
//                   contentStyle={{ borderRadius: "12px", border: "none" }}
//                   formatter={(value, name) => [
//                     name === "efficiency" ? `${value}%` : value,
//                     name === "efficiency" ? "Efficiency" : "Resolved",
//                   ]}
//                 />
//                 <Bar
//                   dataKey="efficiency"
//                   fill="#3b82f6"
//                   radius={[0, 6, 6, 0]}
//                   barSize={20}
//                   name="Efficiency"
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function KPICard({ title, value, trend, icon, color, isAlert }) {
//   const themes = {
//     blue: "bg-blue-50 text-blue-600",
//     emerald: "bg-emerald-50 text-emerald-600",
//     indigo: "bg-indigo-50 text-indigo-600",
//     amber: "bg-amber-50 text-amber-600",
//     red: "bg-red-50 text-red-600",
//   };

//   return (
//     <div
//       className={cn(
//         "p-6 rounded-3xl bg-white border transition-all duration-300 hover:shadow-lg",
//         isAlert ? "border-red-200 bg-red-50/20" : "border-slate-200"
//       )}
//     >
//       <div className="flex justify-between items-start mb-4">
//         <div className={cn("p-2.5 rounded-xl shadow-inner", themes[color])}>
//           {icon}
//         </div>
//         <span
//           className={cn(
//             "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
//             isAlert ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
//           )}
//         >
//           {trend}
//         </span>
//       </div>
//       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//         {title}
//       </p>
//       <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
//         {value}
//       </h2>
//     </div>
//   );
// }

// function DashboardSkeleton() {
//   return (
//     <div className="p-8 space-y-8 animate-pulse max-w-[1600px] mx-auto">
//       <div className="h-10 w-64 bg-slate-100 rounded-xl mb-6" />
//       <div className="grid grid-cols-5 gap-6">
//         {[1, 2, 3, 4, 5].map((i) => (
//           <div
//             key={i}
//             className="h-32 bg-slate-50 rounded-3xl border border-slate-100"
//           />
//         ))}
//       </div>
//       <div className="grid grid-cols-3 gap-8 pt-4">
//         <div className="col-span-1 h-80 bg-slate-50 rounded-3xl" />
//         <div className="col-span-2 h-80 bg-slate-50 rounded-3xl" />
//       </div>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import api from "@/lib/axios";
// import {
//   IndianRupee,
//   Ticket,
//   Zap,
//   AlertTriangle,
//   Package,
//   History,
//   Trophy,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { ResponsiveContainer } from "recharts";
const TIMEFRAMES = [
  { label: "All Time", value: "all" },
  { label: "Last 24h", value: "24h" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Monthly", value: "30d" },
];

// --- REUSABLE INDEPENDENT LOADER CARD ---
const AsyncStatCard = ({
  title,
  endpoint,
  timeframe,
  icon,
  color,
  formatter,
}) => {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`${endpoint}?timeframe=${timeframe}`)
      .then((res) => setValue(res.data.value))
      .catch(() => setValue("Error"))
      .finally(() => setLoading(false));
  }, [endpoint, timeframe]);

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm min-h-[140px]">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-xl", color)}>{icon}</div>
        {loading && (
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {title}
      </p>
      {loading ? (
        <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-md mt-1" />
      ) : (
        <h2 className="text-2xl font-black text-slate-900 mt-1">
          {formatter ? formatter(value) : value}
        </h2>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState("all");

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12 px-4">
      {/* Header & Timeframe Switcher remains the same */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <History className="text-blue-600" /> Dashboard
          </h1>
        </div>
        <TimeframeSwitcher current={timeframe} onChange={setTimeframe} />
      </div>

      {/* INDEPENDENT KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <AsyncStatCard
          title="Revenue"
          endpoint="/admin/dashboard/revenue"
          timeframe={timeframe}
          icon={<IndianRupee size={20} />}
          color="bg-blue-50 text-blue-600"
          formatter={(v) => `₹${Number(v).toLocaleString()}`}
        />
        <AsyncStatCard
          title="Throughput"
          endpoint="/admin/dashboard/throughput"
          timeframe={timeframe}
          icon={<Ticket size={20} />}
          color="bg-indigo-50 text-indigo-600"
        />
        <AsyncStatCard
          title="Efficiency"
          endpoint="/admin/dashboard/efficiency"
          timeframe={timeframe}
          icon={<Zap size={20} />}
          color="bg-emerald-50 text-emerald-600"
          formatter={(v) => `${parseFloat(v).toFixed(1)}%`}
        />
        <AsyncStatCard
          title="Risk Level"
          endpoint="/admin/dashboard/risk"
          timeframe={timeframe}
          icon={<AlertTriangle size={20} />}
          color="bg-amber-50 text-amber-600"
        />
        <AsyncStatCard
          title="Low Stock"
          endpoint="/admin/dashboard/inventory-count"
          timeframe={timeframe}
          icon={<Package size={20} />}
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* Charts can also be their own Async Components... */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <AsyncPieChart timeframe={timeframe} />
        <Leaderboard timeframe={timeframe} />
      </div>
    </div>
  );
}// --- HELPERS ---
const TimeframeSwitcher = ({ current, onChange }) => (
  <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit border border-slate-200">
    {TIMEFRAMES.map((t) => (
      <button
        key={t.value}
        onClick={() => onChange(t.value)}
        className={cn(
          "px-4 py-2 rounded-xl text-xs font-bold transition-all",
          current === t.value
            ? "bg-white text-blue-600 shadow-sm"
            : "text-slate-500 hover:text-slate-900"
        )}
      >
        {t.label}
      </button>
    ))}
  </div>
);
// --- INDEPENDENT PIE CHART ---
const AsyncPieChart = ({ timeframe }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/dashboard/status-distribution?timeframe=${timeframe}`)
      .then(res => setData(res.data.value))
      .finally(() => setLoading(false));
  }, [timeframe]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 font-mono">Workload Distribution</h3>
      <div className="h-64 flex items-center justify-center">
        {loading ? (
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
