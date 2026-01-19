"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  Plus,
  Settings2,
  ArrowUpDown,
  MoreHorizontal,
  Edit3,
  EyeOff,
  Eye,
  Wrench,
  SearchX,
} from "lucide-react";
import { useDashboard } from "@/context/DashBoardContext";

export default function ServicesPage() {
  const { search } = useDashboard();
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
        toast.error("Failed to load services database");
      })
      .finally(() => setLoading(false));
  }, []);

  const sortedServices = useMemo(() => {
    const data = [...services];
    const sortMap = {
      SEVERITY: (a, b) =>
        (a.Severity?.priority || 0) - (b.Severity?.priority || 0),
      COST: (a, b) => Number(a.defaultCost || 0) - Number(b.defaultCost || 0),
      TYPE: (a, b) => a.type.localeCompare(b.type),
      TITLE: (a, b) => a.serviceTitle.localeCompare(b.serviceTitle),
    };
    return data.sort(sortMap[sortBy] || sortMap.TITLE);
  }, [services, sortBy]);

  const filteredServices = useMemo(() => {
    return sortedServices.filter(
      (service) =>
        service.serviceTitle.toLowerCase().includes(search.toLowerCase()) ||
        service.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [sortedServices, search]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Wrench size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Service Directory
            </h1>
          </div>
          <p className="text-sm text-slate-500 font-medium ml-11">
            Configure vehicle repair types, costs, and SLA thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3 ml-11 md:ml-0">
          <div className="relative">
            <Settings2
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="TITLE">Sort by Title</option>
              <option value="SEVERITY">By Priority</option>
              <option value="TYPE">By Category</option>
              <option value="COST">By Pricing</option>
            </select>
          </div>

          <Link
            href="/dashboard/admin/services/add"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Plus size={18} />
            Add Service
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  #
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Service Details
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Category
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Priority
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  SLA
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Base Cost
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="bg-slate-50 p-4 rounded-full mb-4">
                        <SearchX size={40} className="text-slate-300" />
                      </div>
                      <h3 className="text-slate-900 font-bold text-lg">
                        No services found
                      </h3>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto">
                        We couldn't find any services matching "{search}". Try a
                        different term or create a new one.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service, index) => (
                  <tr
                    key={service.id}
                    className="group hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {service.serviceTitle}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                          ID: {service.id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-bold uppercase tracking-tighter">
                        {service.type}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full shadow-sm"
                          style={{
                            backgroundColor: service.Severity?.color || "#999",
                          }}
                        />
                        <span className="text-sm font-semibold text-slate-700">
                          {service.Severity?.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-slate-700">
                        {service.defaultExpectedHours || "0"}
                        <span className="text-[10px] text-slate-400 ml-0.5 italic">
                          hrs
                        </span>
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-extrabold text-slate-900">
                        {service.defaultCost ? `₹${service.defaultCost}` : "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title={service.isActive ? "Deactivate" : "Activate"}
                        >
                          {service.isActive ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-6 py-5">
          <div className="h-4 bg-slate-100 rounded-md w-full" />
        </td>
      ))}
    </tr>
  );
}
