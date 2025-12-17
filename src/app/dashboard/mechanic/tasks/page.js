"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2, Wrench, Clock, CheckCircle2, PlayCircle } from "lucide-react";

export default function MechanicActiveTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    try {
      const res = await api.get("/mechanic/tasks/active");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function startWork(id) {
    await api.patch(`/mechanic/task/${id}/start`);
    loadTasks();
  }

  async function completeTask(id) {
    await api.patch(`/mechanic/task/${id}/complete`);
    loadTasks();
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Active Tasks</h1>

      {tasks.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          No active tasks assigned.
        </p>
      )}

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          startWork={startWork}
          completeTask={completeTask}
        />
      ))}
    </div>
  );
}
import { useRouter } from "next/navigation";

function TaskCard({ task, startWork, completeTask }) {
  const router = useRouter();

  const statusColor = {
    ASSIGNED: "bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
  }[task.status];

  return (
    <div
      onClick={() => router.push(`/dashboard/mechanic/tasks/${task.id}`)}
      className="bg-white p-5 rounded-xl shadow border flex justify-between items-center cursor-pointer hover:ring-2 hover:ring-blue-200"
    >
      {/* LEFT */}
      <div className="flex gap-4 items-center">
        <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center">
          <Wrench className="text-blue-600" size={28} />
        </div>

        <div>
          <h2 className="text-lg font-semibold">{task.title}</h2>
          <p className="text-sm text-gray-500">{task.description}</p>

          <div className="flex gap-3 mt-2 text-xs text-gray-600">
            <span className={`${statusColor} px-2 py-1 rounded-md`}>
              {task.status.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div
        className="flex gap-3"
        onClick={(e) => e.stopPropagation()} // 👈 prevent redirect
      >
        {task.status === "ASSIGNED" && (
          <button
            onClick={() => startWork(task.id)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Start Work
          </button>
        )}

        {task.status === "IN_PROGRESS" && (
          <button
            onClick={() => completeTask(task.id)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Mark Completed
          </button>
        )}
      </div>
    </div>
  );
}
