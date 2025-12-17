"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2, Wrench, Clock, CheckCircle2, PlayCircle, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MechanicTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function loadTasks() {
    try {
      const res = await api.get("/mechanic/tasks");
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



  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  return (
    <div
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-gray-800">Task History</h1>

      {tasks.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          No active tasks assigned.
        </p>
      )}

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

function TaskCard({ task }) {
  const statusColor = {
    ASSIGNED: "bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
  }[task.status];
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/dashboard/mechanic/tasks/${task.id}`)}
      className="bg-white p-5 rounded-xl shadow border flex justify-between items-center cursor-pointer hover:shadow-md transition"
    >
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

            <span className="flex items-center gap-1">
              <Clock size={12} />
              {task.expectedCompletionHours} hrs
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {task.status === "ASSIGNED" && (
          <p className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <PlayCircle size={18} /> ASSIGNED
          </p>
        )}

        {task.status === "IN_PROGRESS" && (
          <p className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            <CheckCircle2 size={18} /> IN PROGRESS
          </p>
        )}
        {task.status === "COMPLETED" && (
          <p className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            <Check size={18} /> COMPLETED
          </p>
        )}
      </div>
    </div>
  );
}
