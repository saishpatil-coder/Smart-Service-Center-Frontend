"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import LoadingDashboard from "@/components/Loading";
import {
  Wrench,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle,
  Radio,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import DutyStatusToggle from "@/components/DutyStatusToggle";

export default function MechanicDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const { user, loading } = useUser();
  const router = useRouter();
  console.log(user)

  useEffect(() => {
    if (!loading && user?.role !== "MECHANIC") {
      router.replace("/unauthorized");
    }
  }, [loading, user]);

  useEffect(() => {
    if (user) loadDashboard();
  }, [user]);

  async function loadDashboard() {
    try {
      const [summaryRes, tasksRes] = await Promise.all([
        api.get("/mechanic/dashboard/summary"),
        api.get("/mechanic/tasks"),
      ]);
      setSummary(summaryRes.data.summary);
      setTasks(tasksRes.data.tasks);
    } catch (error) {
      console.error("Critical: Dashboard Data Fetch Failed", error);
    }
  }

  if (loading || !user) return <LoadingDashboard />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION: Command Center Style */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              OPERATIONS <span className="text-blue-600 italic">TERMINAL</span>
            </h1>
          </div>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
            Mechanic ID: {user.id?.slice(0, 8) || "UNIT-00"}{" "}
            <span className="h-1 w-1 rounded-full bg-slate-300" /> System Online
          </p>
        </div>

        <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          <DutyStatusToggle status={user.status} onChange={loadDashboard} />
        </div>
      </header>

      {/* STATS GRID: High-Density Industrial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<Zap size={22} />}
          label="Assigned Load"
          value={summary?.totalAssigned || 0}
          color="blue"
          subLabel="Total tickets in queue"
        />
        <StatCard
          icon={<Clock size={22} />}
          label="Active Duty"
          value={summary?.inProgress || 0}
          color="amber"
          subLabel="Live working sessions"
        />
        <StatCard
          icon={<ShieldCheck size={22} />}
          label="Daily Output"
          value={summary?.completedToday || 0}
          color="emerald"
          subLabel="Successfully closed today"
        />
      </div>

      {/* TASK LIST: The "Manifest" */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
            <Radio size={14} className="text-blue-500" /> Live Task Manifest
          </h2>
          <div className="h-[1px] flex-1 bg-slate-100 mx-4" />
          <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
            COUNT: {tasks.length}
          </span>
        </div>

        <div className="grid gap-4">
          {tasks.length === 0 ? (
            <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center">
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                No Active Operations Assigned
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <ManifestItem
                key={task.id}
                task={task}
                onClick={() =>
                  router.push(`/dashboard/mechanic/task/${task.ticketId}`)
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// SUB-COMPONENTS
function StatCard({ icon, label, value, color, subLabel }) {
  const themes = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };

  return (
    <div className="group bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "p-4 rounded-2xl transition-transform group-hover:scale-110",
            themes[color]
          )}
        >
          {icon}
        </div>
        <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight size={14} className="text-slate-400" />
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-4xl font-black text-slate-900">{value}</h3>
        <span className="text-[10px] font-bold text-slate-400 lowercase">
          {subLabel}
        </span>
      </div>
    </div>
  );
}

function ManifestItem({ task, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between"
    >
      <div className="flex items-center gap-6">
        <div
          className={cn(
            "w-14 h-14 rounded-xl flex flex-col items-center justify-center border-2 transition-all group-hover:rotate-2",
            task.Ticket?.isEscalated
              ? "bg-red-50 border-red-200 text-red-600"
              : "bg-slate-50 border-slate-200 text-slate-600"
          )}
        >
          <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">
            Rank
          </span>
          <span className="text-xl font-black">{task.Ticket?.priority}</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors capitalize text-lg">
              {task.Ticket?.title}
            </h4>
            {task.Ticket?.isEscalated && (
              <div className="flex items-center gap-1 bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded tracking-tighter animate-pulse">
                CRITICAL
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <Wrench size={10} /> {task.Ticket?.client?.name}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-200" />
            <span className="flex items-center gap-1">
              <Clock size={10} /> ID: {task.ticketId?.slice(0, 6)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div
          className={cn(
            "px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase border",
            task.Ticket?.status === "IN_PROGRESS"
              ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
              : "bg-white text-slate-600 border-slate-200"
          )}
        >
          {task.Ticket?.status}
        </div>
        <ChevronRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}
