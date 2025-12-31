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

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  // 1. Role Protection
  useEffect(() => {
    if (!authLoading && user?.role !== "ADMIN") {
      router.replace("/unauthorized");
    }
  }, [authLoading, user, router]);

  // 2. Data Fetching
  useEffect(() => {
    if (user?.role === "ADMIN") {
      api
        .get("/admin/dashboard/industry-stats")
        .then((res) => setData(res.data))
        .catch((err) => console.error("Dashboard sync failed:", err))
        .finally(() => setDataLoading(false));
    }
  }, [user]);

  // 3. Process Chart Data specifically for your new JSON structure
  const processedData = useMemo(() => {
    if (!data) return { statusData: [], mechanicData: [] };

    // Format Status Stats for Pie Chart
    const statusData = (data.statusStats || []).map((s) => ({
      name: s.status?.replace("_", " ") || "N/A",
      value: Number(s.count || 0), // Cast string "11" to Number
    }));

    // Format Leaderboard for Bar Chart
    const mechanicData = (data.leaderboard || []).map((m) => ({
      name: m.mechanic?.name || "Unknown",
      resolved: Number(m.resolvedTickets || 0),
      avgTime: parseFloat(Number(m.avgResolutionTime || 0).toFixed(1)), // Round long decimals
    }));

    return { statusData, mechanicData };
  }, [data]);

  if (authLoading || !user) return <LoadingDashboard />;
  if (dataLoading || !data) return <DashboardSkeleton />;

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12 px-4 animate-in fade-in duration-700">
      {/* HEADER  */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <History className="text-blue-600" size={32} /> Executive Control
        </h1>
        <p className="text-slate-500 font-medium italic">
          Last Updated:{" "}
          {data.lastUpdated
            ? new Date(data.lastUpdated).toLocaleString()
            : "Syncing..."}
        </p>
      </div>

      {/* KPI GRID - Mapped to your "metrics" object  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Revenue"
          value={`₹${(data.metrics?.revenue ?? 0).toLocaleString()}`}
          trend="Total"
          icon={<IndianRupee className="text-blue-600" />}
          color="blue"
        />
        <KPICard
          title="Avg Order"
          value={`₹${Math.round(
            data.metrics?.avgOrderValue ?? 0
          ).toLocaleString()}`}
          trend="Per Job"
          icon={<TrendingUp className="text-emerald-600" />}
          color="emerald"
        />
        <KPICard
          title="Throughput"
          value={data.metrics?.ticketThroughput ?? 0}
          trend="Total Tickets"
          icon={<Ticket className="text-indigo-600" />}
          color="indigo"
        />
        <KPICard
          title="Risk Level"
          value={data.metrics?.riskLevel ?? 0}
          trend="Escalations"
          icon={
            <AlertTriangle
              className={cn(
                data.metrics?.riskLevel > 0 ? "text-red-600" : "text-amber-600"
              )}
            />
          }
          color="amber"
          isAlert={data.metrics?.riskLevel > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PIE CHART - Workload  */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 font-mono">
            Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processedData.statusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {processedData.statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BAR CHART - Mechanics  */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 font-mono">
            <Trophy size={16} className="text-amber-500" /> Technician
            Leaderboard
          </h3>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData.mechanicData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748b", fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: "12px", border: "none" }}
                />
                <Bar
                  dataKey="resolved"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- UI Helpers --- */

function KPICard({ title, value, trend, icon, color, isAlert }) {
  const themes = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div
      className={cn(
        "p-6 rounded-3xl bg-white border transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50",
        isAlert ? "border-red-200 bg-red-50/30" : "border-slate-200"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-2xl shadow-inner", themes[color])}>
          {icon}
        </div>
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider",
            isAlert ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
          )}
        >
          {trend}
        </span>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
        {title}
      </p>
      <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
        {value}
      </h2>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8 animate-pulse max-w-[1600px] mx-auto">
      <div className="h-10 w-64 bg-slate-100 rounded-xl mb-6" />
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-slate-50 rounded-3xl border border-slate-100"
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-8 pt-4">
        <div className="col-span-1 h-80 bg-slate-50 rounded-3xl" />
        <div className="col-span-2 h-80 bg-slate-50 rounded-3xl" />
      </div>
    </div>
  );
}
