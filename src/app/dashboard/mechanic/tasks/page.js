"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2, Inbox, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import TaskCard from "@/components/dash/mech/Task";

export default function MechanicActiveTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track which task is currently "leaving" the UI
  const [finishingTaskId, setFinishingTaskId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  async function loadTasks(isSilent = false) {
    if (!isSilent) setLoading(true);
    try {
      const res = await api.get("/mechanic/tasks/active");
      setTasks(res.data.tasks || []);
    } catch (err) {
      toast.error("Failed to sync your task list");
    } finally {
      setLoading(false);
      setFinishingTaskId(null); // Reset UI state
      setStatusMessage("");
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function completeTask(id, title) {
    setFinishingTaskId(id);
    setStatusMessage(`Completing "${title}"...`);

    try {
      await api.patch(`/mechanic/task/${id}/complete`);

      // STAGE 2: Show success before fetching next
      setStatusMessage("Success! Synchronizing your next tasks...");

      // Brief pause so the mechanic can actually read the status
      setTimeout(() => {
        loadTasks(true);
      }, 3200);
    } catch (err) {
      toast.error("Failed to complete task");
      setFinishingTaskId(null);
    }
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium">
          Preparing your workspace...
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Workshop Floor
        </h1>
        {finishingTaskId && (
          <div className="flex items-center gap-2 text-blue-600 animate-pulse">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {statusMessage}
            </span>
          </div>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center">
          <Inbox className="text-slate-300 mb-4" size={48} />
          <h3 className="text-slate-900 font-bold text-lg">All caught up!</h3>
          <p className="text-slate-500 text-sm">
            New tickets will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="relative transition-all duration-500 animate-in fade-in slide-in-from-bottom-6"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TaskCard
                task={task}
                isFinishing={finishingTaskId === task.id}
                onStart={() =>
                  api
                    .patch(`/mechanic/task/${task.id}/start`)
                    .then(() => loadTasks(true))
                }
                onComplete={() => completeTask(task.id, task.title)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
