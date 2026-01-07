"use client";

import React, { useEffect, useState } from "react";
import { Edit2, Save, X, AlertCircle, Clock } from "lucide-react";
import { toast } from "react-toastify";
import { fetchSeverities, updateSeverity } from "@/services/severity.service";

export default function SeverityManager() {
  const [severities, setSeverities] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadSeverities();
  }, []);

  const loadSeverities = async () => {
    try {
      const res = await fetchSeverities();
      setSeverities(res.data.severities);
    } catch (error) {
      toast.error("Failed to load severities");
    }
  };

  const handleEditClick = (sev) => {
    setEditingId(sev.id);
    setEditForm(sev);
  };

  const handleSave = async () => {
    try {
      await updateSeverity(editingId, editForm);
      toast.success("Severity updated successfully");
      setEditingId(null);
      loadSeverities();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">System Severities</h1>
        <p className="text-sm text-slate-500">
          Manage SLA timings, priorities, and visual indicators.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-semibold">Priority & Name</th>
              <th className="px-4 py-3 font-semibold">SLA (Accept/Assign)</th>
              <th className="px-4 py-3 font-semibold">Description</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {severities.map((sev) => (
              <tr
                key={sev.id}
                className="group hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-4 py-4">
                  {editingId === sev.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        className="w-16 p-1 border rounded text-sm"
                        value={editForm.priority}
                        onChange={(e) =>
                          setEditForm({ ...editForm, priority: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        className="w-32 p-1 border rounded text-sm font-bold"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                        P{sev.priority}
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: sev.color }}
                        />
                        <span className="font-bold text-slate-700">
                          {sev.name}
                        </span>
                      </div>
                    </div>
                  )}
                </td>

                <td className="px-4 py-4">
                  {editingId === sev.id ? (
                    <div className="flex items-center gap-2 text-xs">
                      <input
                        type="number"
                        className="w-16 p-1 border rounded"
                        value={editForm.max_accept_minutes}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            max_accept_minutes: e.target.value,
                          })
                        }
                      />
                      <span>/</span>
                      <input
                        type="number"
                        className="w-16 p-1 border rounded"
                        value={editForm.max_assign_minutes}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            max_assign_minutes: e.target.value,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {sev.max_accept_minutes}m
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertCircle size={14} /> {sev.max_assign_minutes}m
                      </span>
                    </div>
                  )}
                </td>

                <td className="px-4 py-4">
                  {editingId === sev.id ? (
                    <textarea
                      className="w-full p-2 border rounded text-sm"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm text-slate-500 max-w-xs truncate">
                      {sev.description}
                    </p>
                  )}
                </td>

                <td className="px-4 py-4 text-right">
                  {editingId === sev.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleSave}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-sm"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <input
                        type="color"
                        disabled
                        value={sev.color}
                        className="w-8 h-8 rounded cursor-default border-none bg-transparent"
                      />
                      <button
                        onClick={() => handleEditClick(sev)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
