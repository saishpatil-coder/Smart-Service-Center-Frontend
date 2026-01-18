"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllMechanics, deleteMechanic } from "@/services/admin.service";
import {
  Trash2,
  Loader2,
  Users,
  UserPlus,
  Phone,
  Mail,
  ShieldCheck,
  Search,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { cn } from "@/lib/utils";

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  async function loadMechanics() {
    try {
      const res = await getAllMechanics();
      setMechanics(res.data || []);
    } catch (err) {
      toast.error("Failed to load mechanics database");
    } finally {
      setLoading(false);
    }
  }

  const filteredMechanics = useMemo(() => {
    return mechanics.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mechanics, searchQuery]);


  useEffect(() => {
    loadMechanics();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <Toaster richColors position="top-right" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Users size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Workshop Team
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Manage and monitor technician performance
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/admin/mechanics/add"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 font-bold text-sm"
        >
          <UserPlus size={18} />
          Add Technician
        </Link>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="relative group max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-sm font-medium"
        />
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-500 font-medium italic">
            Loading technician directory...
          </p>
        </div>
      ) : filteredMechanics.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
          <div className="bg-white p-4 rounded-full w-fit mx-auto shadow-sm mb-4">
            <Users size={48} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No technicians found
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
            Try adjusting your search query or add a new team member.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMechanics.map((m) => (
            <div
              key={m.id}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden"
            >
              {/* Status Ribbon */}
              <div
                className={cn(
                  "absolute top-0 right-0 h-1 w-24",
                  m.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
                )}
              />

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xl border-2 border-white shadow-sm">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {m.name}
                      </h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        Technical Staff
                      </p>
                    </div>
                  </div>

                  {/* <button
                    disabled={deletingId === m.id}
                    onClick={() => handleDelete(m.id, m.name)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                  >
                    {deletingId === m.id ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 p-2 rounded-lg">
                    <Mail size={16} className="text-slate-400" />
                    <span className="truncate font-medium">{m.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 p-2 rounded-lg">
                    <Phone size={16} className="text-slate-400" />
                    <span className="font-medium">{m.mobile}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border",
                        m.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-red-50 text-red-700 border-red-100"
                      )}
                    >
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          m.status === "ACTIVE"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        )}
                      />
                      {m.status}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                      <ShieldCheck size={12} /> Certified
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/admin/mechanics/${m.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:gap-2 transition-all"
                  >
                    View Performance <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
