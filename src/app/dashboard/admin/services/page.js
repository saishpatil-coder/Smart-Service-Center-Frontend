"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useDashboard } from "@/context/DashBoardContext";

export default function ServicesPage() {
    const {search} = useDashboard();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("TITLE");

  useEffect(() => {
    api
      .get("/admin/services")
      .then((res) => {
        setServices(res.data.services || []);
      })
      .catch(() => {
        toast.error("Failed to load services");
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Sorted services (derived state)
  const sortedServices = useMemo(() => {
    const data = [...services];

    switch (sortBy) {
      case "SEVERITY":
        return data.sort(
          (a, b) => (a.Severity?.priority || 0) - (b.Severity?.priority || 0)
        );

      case "COST":
        return data.sort(
          (a, b) => Number(a.defaultCost || 0) - Number(b.defaultCost || 0)
        );

      case "TYPE":
        return data.sort((a, b) => a.type.localeCompare(b.type));

      case "TITLE":
      default:
        return data.sort((a, b) =>
          a.serviceTitle.localeCompare(b.serviceTitle)
        );
    }
  }, [services, sortBy]);


  const filteredServices = useMemo(() => {
    return sortedServices.filter((service) =>
      service.serviceTitle.toLowerCase().includes(search.toLowerCase())
    );
  }, [sortedServices, search]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Services</h1>
          <p className="text-sm text-gray-500">
            Manage all available vehicle services
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="TITLE">Sort by Title</option>
            <option value="SEVERITY">Sort by Severity</option>
            <option value="TYPE">Sort by Type</option>
            <option value="COST">Sort by Cost</option>
          </select>

          {/* Add Button */}
          <Link
            href="/dashboard/admin/services/add"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Service
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">SLA (hrs)</th>
              <th className="px-4 py-3">Cost (₹)</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  Loading services...
                </td>
              </tr>
            ) : sortedServices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No services found
                </td>
              </tr>
            ) : (
              filteredServices.map((service, index) => (
                <tr key={service.id} className="border-t hover:bg-gray-50">
                  {/* Numbering */}
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {service.serviceTitle}
                  </td>

                  <td className="px-4 py-3">{service.type}</td>

                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: service.Severity?.color || "#999",
                        }}
                      />
                      {service.Severity?.name}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {service.defaultExpectedHours ?? "—"}
                  </td>

                  <td className="px-4 py-3">
                    {service.defaultCost ? `₹${service.defaultCost}` : "—"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        service.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
