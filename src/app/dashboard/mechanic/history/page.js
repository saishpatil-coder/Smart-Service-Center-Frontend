"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import {
  Loader2,
  Wrench,
  Clock,
  CheckCircle2,
  PlayCircle,
  Check,
  Search,
  History,
  Filter,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/context/DashBoardContext";

export default function MechanicTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search } = useDashboard(); // Global search integration
  const router = useRouter();

  async function loadTasks() {
    try {
      const res = await api.get("/mechanic/tasks");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium">
          Loading your activity logs...
        </p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <History className="text-blue-600" size={32} />
            Task History
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Review your past assignments and performance logs.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
            Total Logs: {tasks.length}
          </span>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
          <div className="bg-slate-50 p-4 rounded-full mb-4">
            <Search className="text-slate-300" size={40} />
          </div>
          <h3 className="text-slate-900 font-bold text-lg">No records found</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            {search
              ? `No results for "${search}". Try a different keyword.`
              : "Your task history is currently empty."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task, index) => (
            <div
              key={task.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      )}
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
