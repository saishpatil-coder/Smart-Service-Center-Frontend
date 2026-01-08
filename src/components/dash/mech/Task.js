"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Loader2,
  PlayCircle,
  Wrench,
  ChevronRight,
} from "lucide-react";

export default function TaskCard({ task, onStart, onComplete, isFinishing }) {
  const router = useRouter();
  const isInProgress = task.status === "IN_PROGRESS";
  const isPending = task.status === "PENDING";

  return (
    <div
      onClick={() =>
        !isFinishing && router.push(`/dashboard/mechanic/tasks/${task.id}`)
      }
      className={cn(
        "group relative bg-white rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer",
        "hover:border-slate-300 hover:shadow-md",
        isFinishing
          ? "scale-[0.98] border-emerald-500 bg-emerald-50/30"
          : "border-slate-200 shadow-sm",
        isInProgress && !isFinishing && "border-blue-400 ring-4 ring-blue-500/5"
      )}
    >
      {/* SUCCESS OVERLAY: Enhanced with smoother transition */}
      {isFinishing && (
        <div className="absolute inset-0 z-20 bg-emerald-600/95 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in zoom-in-95 duration-300">
          <div className="bg-white/20 p-3 rounded-full mb-3">
            <CheckCircle2 size={32} className="animate-bounce" />
          </div>
          <p className="font-bold text-lg tracking-tight">Job Completed!</p>
          <p className="text-xs text-emerald-100/80">
            Updating workshop floor...
          </p>
        </div>
      )}

      <div className="p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-4 items-center flex-1 w-full">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
              isInProgress
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-500"
            )}
          >
            <Wrench size={20} />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {task.title}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                  isInProgress
                    ? "bg-blue-50 text-blue-700 border-blue-100"
                    : "bg-amber-50 text-amber-700 border-amber-100"
                )}
              >
                {task.status.replace("_", " ")}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                #{task.id.slice(-6)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isInProgress ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <PlayCircle size={18} /> Start
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-100"
            >
              <CheckCircle2 size={18} /> Complete
            </button>
          )}
          <ChevronRight
            className="hidden sm:block text-slate-300 group-hover:text-slate-400 transition-colors"
            size={20}
          />
        </div>
      </div>
    </div>
  );
}
