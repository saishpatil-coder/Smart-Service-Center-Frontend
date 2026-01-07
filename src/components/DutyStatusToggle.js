"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { Power, Loader2, Zap } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function DutyStatusToggle({ status, onChange }) {
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  console.log("status : ",status)

  // Internal state for smooth, immediate animation
  const [localActive, setLocalActive] = useState(status === "ACTIVE");

  // Keep local state in sync if parent status changes externally
  useEffect(() => {
    setLocalActive(status === "ACTIVE");
  }, [status]);

  const handleStatusChange = async (targetStatus) => {
    const isTargetActive = targetStatus === "ACTIVE";
    if (localActive === isTargetActive || loading) return;

    // 1. Optimistic Update: Move the toggle immediately for better UX
    setLocalActive(isTargetActive);
    setLoading(true);

    try {
      if (isTargetActive) {
        await api.patch("/mechanic/punch-in");
        toast.success("SYSTEM INITIALIZED: On Duty");
      } else {
        await api.patch("/mechanic/punch-out");
        toast.info("SYSTEM STANDBY: Off Duty");
      }

      // 2. Update Global Context so other components know the status changed
      setUser((prev) => ({ ...prev, status: targetStatus }));

      // 3. Trigger parent refresh (loadDashboard)
      if (onChange) onChange();
    } catch (error) {
      // Rollback on failure
      setLocalActive(!isTargetActive);
      toast.error("PROTOCOL ERROR: Link failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* Outer Chassis */}
      <div className="relative flex items-center bg-slate-300/50 backdrop-blur-sm rounded-2xl p-1.5 w-[260px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-white/20">
        {/* The Sliding Core */}
        <div
          className={cn(
            "absolute inset-y-1.5 rounded-xl transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) shadow-xl flex items-center justify-center overflow-hidden",
            localActive
              ? "bg-emerald-500 left-1.5 w-[124px]"
              : "bg-slate-700 left-[132px] w-[124px]"
          )}
        >
          {localActive && (
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-emerald-600">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] animate-pulse" />
            </div>
          )}
        </div>

        {/* ON DUTY ACTION */}
        <button
          disabled={loading}
          onClick={() => handleStatusChange("ACTIVE")}
          className={cn(
            "relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:cursor-not-allowed",
            localActive ? "text-white" : "text-slate-500 hover:text-slate-700"
          )}
        >
          {loading && localActive ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Zap
              size={14}
              className={cn(
                "transition-transform",
                localActive && "fill-current"
              )}
            />
          )}
          <span>On Duty</span>
        </button>

        {/* OFF DUTY ACTION */}
        <button
          disabled={loading}
          onClick={() => handleStatusChange("OFF_DUTY")}
          className={cn(
            "relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:cursor-not-allowed",
            !localActive ? "text-white" : "text-slate-500 hover:text-slate-700"
          )}
        >
          {loading && !localActive ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Power
              size={14}
              className={cn(
                "transition-transform",
                !localActive && "text-red-400"
              )}
            />
          )}
          <span>Off Duty</span>
        </button>
      </div>


    </div>
  );
}
