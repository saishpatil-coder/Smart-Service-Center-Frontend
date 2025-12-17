"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import api from "@/lib/axios";


export default function AddServiceForm() {
  const [severities, setSeverities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    serviceTitle: "",
    type: "REPAIR",
    severityId: "",
    defaultExpectedHours: "",
    defaultCost: "",
    description: "",
  });

  useEffect(() => {
    api.get("/admin/severities").then((res) => {
      setSeverities(res.data.severities || []);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.serviceTitle || !form.severityId) {
      toast.warning("Please fill all required fields");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating service...");

    try {
      await api.post("/admin/services", {
        ...form,
        severityId: Number(form.severityId),
      });

      toast.success("Service added successfully", {
        id: toastId,
        description: "The service is now available for assignment.",
      });

      setForm({
        serviceTitle: "",
        type: "REPAIR",
        severityId: "",
        defaultExpectedHours: "",
        defaultCost: "",
        description: "",
      });
    } catch (err) {
      toast.error("Failed to add service", {
        id: toastId,
        description:
          err.response?.data?.message || "Something went wrong on the server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
        <Toaster/>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Add New Service</h2>
        <p className="mt-1 text-sm text-gray-500">
          Define a service and link it with a severity level.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Service Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Title
            </label>
            <input
              name="serviceTitle"
              value={form.serviceTitle}
              onChange={handleChange}
              required
              placeholder="e.g. Engine Oil Change"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Type & Severity */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Service Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="REPAIR">Repair</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="MODIFICATION">Modification</option>
                <option value="ACCIDENTAL">Accidental</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Severity Level
              </label>
              <select
                name="severityId"
                value={form.severityId}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select severity</option>
                {severities.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — Priority {s.priority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SLA & Cost */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expected Completion (Hours)
              </label>
              <input
                type="number"
                name="defaultExpectedHours"
                value={form.defaultExpectedHours}
                onChange={handleChange}
                placeholder="Optional"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Cost (₹)
              </label>
              <input
                type="number"
                step="0.01"
                name="defaultCost"
                value={form.defaultCost}
                onChange={handleChange}
                placeholder="Optional"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Short description for admins & mechanics"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              disabled={loading}
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
