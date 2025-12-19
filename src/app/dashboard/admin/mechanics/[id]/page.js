"use client";

import { useEffect, useState, useMemo, use } from "react";
import api from "@/lib/axios";
import {
  Loader2,
  User,
  Clock,
  CheckCircle,
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  Briefcase,
  ExternalLink,
  Search,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MechanicDetailsPage(props) {
  const router = useRouter();
  const params = use(props.params);
  const id = params.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api
      .get(`/admin/mechanics/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching mechanic:", err))
      .finally(() => setLoading(false));
  }, [id]);

  // Derived filtered tasks for better UX
  const filteredTasks = useMemo(() => {
    if (!data?.tasks) return [];
    return data.tasks.filter(
      (t) =>
        t.ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.ticket.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">
          Analyzing performance data...
        </p>
      </div>
    );
  }

  const { mechanic, tasks } = data;
  const completedTasks = tasks.filter((t) => t.completedAt).length;
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 px-4">
      {/* NAVIGATION */}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Mechanics
      </button>

      {/* PROFILE HEADER CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-blue-200">
                {mechanic.name.charAt(0)}
              </div>
              <div
                className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white w-6 h-6 rounded-full"
                title="Account Active"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {mechanic.name}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                  {mechanic.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                <p className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                  <Mail size={14} className="text-slate-400" /> {mechanic.email}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                  <Phone size={14} className="text-slate-400" />{" "}
                  {mechanic.mobile}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 border-l border-slate-100 pl-6 h-full">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Efficiency Score
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900">
                {completionRate}%
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">
              <span className="text-blue-600 font-bold">
                {mechanic.assignedCount}
              </span>{" "}
              Active Work Orders
            </p>
          </div>
        </div>
      </div>

      {/* KEY PERFORMANCE INDICATORS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<Briefcase className="text-blue-600" size={20} />}
          label="Total Assigned"
          value={tasks.length}
          color="blue"
        />
        <StatCard
          icon={<CheckCircle className="text-emerald-600" size={20} />}
          label="Completed Jobs"
          value={completedTasks}
          color="emerald"
        />
        <StatCard
          icon={<Calendar className="text-purple-600" size={20} />}
          label="Tenure Since"
          value={new Date(mechanic.createdAt).toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
          })}
          color="purple"
        />
      </div>

      {/* TASK HISTORY SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Technical Log History
            </h2>
          </div>

          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Filter by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="p-2 space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="py-20 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">
                No work orders match your search.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard key={task.taskId} task={task} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const bgColors = {
    blue: "bg-blue-50",
    emerald: "bg-emerald-50",
    purple: "bg-purple-50",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 group hover:border-blue-200 transition-colors">
      <div
        className={cn(
          "p-4 rounded-xl transition-transform group-hover:scale-110 duration-300",
          bgColors[color]
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-900 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  const { ticket, startedAt, completedAt } = task;
  const isCompleted = ticket.status === "COMPLETED";

  return (
    <div className="group bg-white p-4 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {ticket.title}
            </h3>
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                isCompleted
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-blue-50 text-blue-700 border-blue-100"
              )}
            >
              {ticket.status}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 flex items-center gap-2">
            {ticket.serviceTitle}
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="text-slate-400 uppercase">
              {ticket.severityName}
            </span>
          </p>
          <p className="text-xs text-slate-400 font-medium tracking-tight">
            Client: {ticket.clientName}
          </p>
        </div>

        <div className="flex items-center gap-8 text-right">
          <div className="hidden sm:grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-medium text-slate-500 border-r border-slate-100 pr-8">
            <span className="text-slate-400">Assigned:</span>{" "}
            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            {startedAt && (
              <>
                <span className="text-slate-400">Started:</span>{" "}
                <span>{new Date(startedAt).toLocaleDateString()}</span>
              </>
            )}
            {completedAt && (
              <>
                <span className="text-emerald-500 font-bold">Closed:</span>{" "}
                <span>{new Date(completedAt).toLocaleDateString()}</span>
              </>
            )}
          </div>

          <div className="flex flex-col items-end">
            <p className="text-lg font-black text-slate-900 flex items-center gap-1">
              <IndianRupee size={14} className="text-slate-400" /> {ticket.cost}
            </p>
            <button className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1 hover:underline">
              View Ticket <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
