"use client";
import DutyStatusToggle from "@/components/DutyStatusToggle";
import LoadingDashboard from "@/components/Loading";
import { useUser } from "@/context/UserContext";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import
  {
    Check,
    CheckCircle2,
    ChevronRight,
    Clock,
    PlayCircle,
    Radio,
    ShieldCheck,
    Wrench,
    Zap
  } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MechanicDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const { user, loading} = useUser();
  const router = useRouter();
  /* ------------------ ROLE PROTECTION ------------------ */
  useEffect(() => {
    if (!loading && user && user.role !== "MECHANIC") {
      router.replace("/unauthorized");
    }
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  async function loadDashboard() {
    try {
      const [summaryRes, tasksRes] = await Promise.allSettled([
        api.get("/mechanic/dashboard/summary"),
        api.get("/mechanic/tasks"),
      ]);
      console.log("sumamry : ",summaryRes);
      console.log("taskdata : ",tasksRes);
      setSummary(summaryRes.value.data.summary );
      setTasks(tasksRes.value.data.tasks );
    } catch (error) {
      console.error("Critical: Dashboard Data Fetch Failed", error);
    }
  }

  useEffect(()=>{
    console.log("Loading dashboard")
    loadDashboard()
  },[user])
  if (loading || !user) return <LoadingDashboard />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION: Command Center Style */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1 top-0">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              OPERATIONS <span className="text-blue-600 italic">TERMINAL</span>
            </h1>
          </div>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
            Mechanic ID: {user.id?.slice(0, 8) || "UNIT-00"}{" "}
            <span className="h-1 w-1 rounded-full bg-slate-300" />{" "}
            {user.status == "ACTIVE" ? "System Online" : "System Offline"}
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
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
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

function TaskCard({ task }) {
  const router = useRouter();

  const statusConfig = {
    ASSIGNED: {
      color: "bg-amber-50 text-amber-700 border-amber-100",
      icon: <PlayCircle size={16} />,
      label: "New Assignment",
    },
    IN_PROGRESS: {
      color: "bg-blue-50 text-blue-700 border-blue-100",
      icon: <CheckCircle2 size={16} />,
      label: "Currently Active",
    },
    COMPLETED: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
      icon: <Check size={16} />,
      label: "Job Completed",
    },
  };

  const currentStatus = statusConfig[task.status] || statusConfig.ASSIGNED;

  return (
    <div
      onClick={() => router.push(`/dashboard/mechanic/tasks/${task.id}`)}
      className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <div className="flex gap-5 items-center flex-1 min-w-0">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
            task.status === "COMPLETED"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-blue-50 text-blue-600"
          )}
        >
          <Wrench
            size={24}
            className="group-hover:rotate-12 transition-transform"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
            {task.title}
          </h2>
          <p className="text-sm text-slate-500 line-clamp-1 mb-2 font-medium">
            {task.description || "No additional notes provided."}
          </p>

          <div className="flex flex-wrap gap-4 items-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span
              className={cn(
                "px-2.5 py-1 rounded-lg border flex items-center gap-1.5",
                currentStatus.color
              )}
            >
              {currentStatus.icon}
              {currentStatus.label}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
              <Clock size={14} className="text-slate-400" />
              Est: {task.expectedCompletionHours} hrs
            </span>
            {task.createdAt && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            Reference
          </p>
          <p className="text-sm font-mono font-bold text-slate-900">
            #{task.id.slice(-6).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
