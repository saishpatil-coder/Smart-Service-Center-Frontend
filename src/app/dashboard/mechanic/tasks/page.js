"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import api from "@/lib/axios";
import { Loader2, Inbox, RefreshCw, LayoutGrid, Hammer } from "lucide-react";
import { toast } from "react-toastify";
import TaskCard from "@/components/dash/mech/Task";
import { cn } from "@/lib/utils";

export default function MechanicActiveTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());
  const isMounted = useRef(true);

  // Sync tasks from backend [cite: 72, 323]
  const loadTasks = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await api.get("/mechanic/tasks/active");
      if (isMounted.current) setTasks(res.data.tasks || []);
    } catch (err) {
      toast.error("Sync failed. Connection to workshop interrupted.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handle START with Optimistic UI & Locking [cite: 192, 194]
  async function handleStartTask(id) {
    if (processingIds.has(id)) return; // Stop double clicks

    setProcessingIds((prev) => new Set(prev).add(id));

    // Optimistic Update: Assume success for instant mechanic feedback [cite: 194]
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "IN_PROGRESS" } : t))
    );

    try {
      await api.patch(`/mechanic/task/${id}/start`);
      toast.info("Task synchronized: In Progress");
    } catch (err) {
      toast.error("Handshake failed. Reverting task status.");
      loadTasks(true); // Revert to database state [cite: 74, 107]
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  // Handle COMPLETE with Inventory Check [cite: 131, 210, 215]
  async function handleCompleteTask(id) {
    if (processingIds.has(id)) return;

    setProcessingIds((prev) => new Set(prev).add(id));

    try {
      await api.patch(`/mechanic/task/${id}/complete`);
      toast.success("Task Logged: Awaiting Admin Audit");

      // Professional transition: Let the success message linger before removal [cite: 38, 41]
      setTimeout(() => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        loadTasks(true);
      }, 800);
    } catch (err) {
      toast.error("Completion log failed. Please check inventory logs.");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  if (loading) return <WorkshopSkeleton />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 px-6 animate-in fade-in duration-1000">
      <header className="flex items-end justify-between border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600">
            <Hammer size={14} className="animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Real-time Task Queue
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            Workshop <span className="text-slate-300">Floor</span>
          </h1>
        </div>

        <button
          onClick={() => loadTasks()}
          disabled={loading}
          className="group p-3 bg-white border border-slate-100 rounded-2xl hover:shadow-xl transition-all active:scale-90"
        >
          <RefreshCw
            size={18}
            className={cn("text-slate-900", loading && "animate-spin")}
          />
        </button>
      </header>

      {tasks.length === 0 ? (
        <EmptyQueueState />
      ) : (
        <div className="grid gap-6">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TaskCard
                task={task}
                isProcessing={processingIds.has(task.id)}
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

// Sub-components for cleaner UX logic [cite: 145, 146]

function WorkshopSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-10 animate-pulse">
      <div className="h-20 w-full bg-slate-50 rounded-[2rem]" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-slate-50 rounded-[2rem]" />
        ))}
      </div>
    </div>
  );
}

function EmptyQueueState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-100">
      <div className="p-6 bg-slate-50 rounded-full mb-6">
        <Inbox className="text-slate-200" size={48} />
      </div>
      <h3 className="text-xl font-black text-slate-900 italic tracking-tight">
        STATION CLEAR
      </h3>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
        Monitoring for new service requests...
      </p>
    </div>
  );
}
