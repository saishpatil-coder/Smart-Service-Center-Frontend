"use client";

import { useEffect, useState } from "react";
import { getAllMechanics, deleteMechanic } from "@/services/admin.service";
import {
  Trash2,
  Loader2,
  Users,
  UserPlus,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "sonner";



export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  async function loadMechanics() {
    try {
      const res = await getAllMechanics();
      setMechanics(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

async function handleDelete(id) {
  toast.warning("Delete mechanic?", {
    description: "This action cannot be undone.",
    action: {
      label: "Delete",
      onClick: async () => {
        try {
          setDeletingId(id);
          await deleteMechanic(id);
          setMechanics((prev) => prev.filter((m) => m.id !== id));
          toast.success("Mechanic deleted successfully");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete mechanic");
        } finally {
          setDeletingId("");
        }
      },
    },
  });
}

  useEffect(() => {
    loadMechanics();
  }, []);

  return (
    <div className="space-y-8">
      <Toaster richColors position="top-right" />{/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Mechanics</h1>
        </div>

        <Link
          href="/dashboard/admin/add-mechanic"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          <UserPlus size={20} />
          Add Mechanic
        </Link>
      </div>
      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={36} />
        </div>
      )}
      {/* EMPTY STATE */}
      {!loading && mechanics.length === 0 && (
        <div className="text-center py-16 bg-white shadow rounded-xl">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No mechanics found.</p>
          <p className="text-gray-400 text-sm mt-1">
            Add new mechanics to start assigning tickets.
          </p>
        </div>
      )}
      {/* MECHANICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mechanics.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-xl shadow-md border hover:shadow-lg transition-all relative"
          >
            {/* Clickable Area */}
            <Link
              href={`/dashboard/admin/mechanics/${m.id}`}
              className="block p-6"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  {m.name}
                </h2>

                <p className="flex items-center gap-2 text-gray-600 text-sm">
                  <Mail size={16} /> {m.email}
                </p>

                <p className="flex items-center gap-2 text-gray-600 text-sm">
                  <Phone size={16} /> {m.mobile}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-700">
                    <ShieldCheck size={14} /> MECHANIC
                  </span>

                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-md ${
                      m.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Joined on {new Date(m.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>

            {/* Delete Button (absolute so it doesn’t trigger link) */}
            <button
              disabled={deletingId === m.id}
              onClick={() => handleDelete(m.id)}
              className="absolute top-4 right-4 text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
            >
              {deletingId === m.id ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Trash2 size={20} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
