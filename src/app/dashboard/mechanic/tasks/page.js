"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import { Loader2, Inbox, RefreshCw, LayoutGrid } from "lucide-react";
import { toast } from "react-toastify";
import TaskCard from "@/components/dash/mech/Task";
import { cn } from "@/lib/utils";

export default function MechanicActiveTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finishingTaskId, setFinishingTaskId] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());

  const loadTasks = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await api.get("/mechanic/tasks/active");
      setTasks(res.data.tasks || []);
    } catch (err) {
      toast.error("Sync failed. Please pull to refresh.");
    } finally {
      setLoading(false);
      setFinishingTaskId(null);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handle START with Optimistic UI
  async function handleStartTask(id) {
    if (processingIds.has(id)) return;

    // Optimistic Update: Change status locally first
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "IN_PROGRESS" } : t))
    );
    setProcessingIds((prev) => new Set(prev).add(id));

    try {
      await api.patch(`/mechanic/task/${id}/start`);
    } catch (err) {
      toast.error("Could not start task");
      loadTasks(true); // Revert on failure
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  // Handle COMPLETE with UI Feedback
  async function handleCompleteTask(id) {
    setFinishingTaskId(id);

    try {
      await api.patch(`/mechanic/task/${id}/complete`);

      // Reduce the delay: 1.5s is usually the "sweet spot" for
      // users to register success without feeling stuck.
      setTimeout(() => {
        // Filter it out locally immediately for instant feedback
        setTasks((prev) => prev.filter((t) => t.id !== id));
        loadTasks(true);
      }, 1500);
    } catch (err) {
      toast.error("Completion failed");
      setFinishingTaskId(null);
    }
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Loader2 className="animate-spin text-blue-600" size={24} />
        </div>
        <p className="text-slate-400 text-sm font-medium">
          Loading your queue...
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 px-4">
      <header className="flex items-end justify-between border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <LayoutGrid size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Mechanic Portal
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Workshop Floor
          </h1>
        </div>

        <button
          onClick={() => loadTasks(true)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          title="Refresh List"
        >
          <RefreshCw
            size={20}
            className={cn("text-slate-400", loading && "animate-spin")}
          />
        </button>
      </header>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl">
          <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
            <Inbox className="text-slate-300" size={32} />
          </div>
          <h3 className="text-slate-900 font-bold">Queue Empty</h3>
          <p className="text-slate-500 text-sm max-w-[200px] text-center mt-1">
            Enjoy the breather! New tickets will pop up here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskCard
                task={task}
                isFinishing={finishingTaskId === task.id}
                onStart={() => handleStartTask(task.id)}
                onComplete={() => handleCompleteTask(task.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
