"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import {
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
import { Leaderboard } from "@/components/dash/admin/LeaderBoard";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#6366f1",
];

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
