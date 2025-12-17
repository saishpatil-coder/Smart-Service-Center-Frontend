"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import { Loader2, User, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MechanicDetailsPage(props) {
    const router = useRouter();
  const params = use(props.params);
  const id = params.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/admin/mechanics/${id}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  const { mechanic, tasks } = data;

  return (
    <div className="space-y-8 max-w-6xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={18} /> Back
      </button>
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-gray-800">Mechanic Details</h1>

      {/* MECHANIC PROFILE CARD */}
      <div className="bg-white p-6 rounded-xl shadow border flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
            {mechanic.name.charAt(0)}
          </div>

          <div>
            <h2 className="text-lg font-semibold">{mechanic.name}</h2>
            <p className="text-sm text-gray-500">{mechanic.email}</p>
            <p className="text-sm text-gray-500">{mechanic.mobile}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="px-3 py-1 rounded-md bg-green-100 text-green-700 text-sm font-semibold">
            {mechanic.status}
          </span>

          <p className="text-sm text-gray-500 mt-2">
            Active Tasks: <b>{mechanic.assignedCount}</b>
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<CheckCircle className="text-green-600" />}
          label="Total Tasks"
          value={tasks.length}
        />
        <StatCard
          icon={<Clock className="text-blue-600" />}
          label="Completed Tasks"
          value={tasks.filter((t) => t.completedAt).length}
        />
        <StatCard
          icon={<User className="text-purple-600" />}
          label="Joined"
          value={new Date(mechanic.createdAt).toLocaleDateString()}
        />
      </div>

      {/* TASK HISTORY */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Task History</h2>

        {tasks.length === 0 && (
          <p className="text-gray-500">No tasks assigned yet.</p>
        )}

        {tasks.map((task) => (
          <TaskCard key={task.taskId} task={task} />
        ))}
      </div>
    </div>
  );
}


function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}


function TaskCard({ task }) {
  const { ticket, startedAt, completedAt } = task;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{ticket.title}</h3>
          <p className="text-sm text-gray-500">
            {ticket.serviceTitle} • {ticket.severityName}
          </p>
          <p className="text-sm text-gray-500">Client: {ticket.clientName}</p>
        </div>

        <span
          className={`px-3 py-1 rounded-md text-xs font-semibold ${
            ticket.status === "COMPLETED"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {ticket.status}
        </span>
      </div>

      {/* Timeline */}
      <div className="mt-4 text-sm text-gray-600 space-y-1">
        <p>📅 Created: {new Date(ticket.createdAt).toLocaleString()}</p>
        {startedAt && <p>▶️ Started: {new Date(startedAt).toLocaleString()}</p>}
        {completedAt && (
          <p>✅ Completed: {new Date(completedAt).toLocaleString()}</p>
        )}
      </div>

      <div className="mt-3 text-right font-semibold text-gray-800">
        ₹ {ticket.cost}
      </div>
    </div>
  );
}
