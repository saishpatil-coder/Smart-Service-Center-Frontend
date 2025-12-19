"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, PlayCircle, Wrench } from "lucide-react";

export default function TaskCard({ task, onStart, onComplete, isFinishing }) {
  const isInProgress = task.status === "IN_PROGRESS";
const router = useRouter();
  return (
    <div
    onClick={()=>{
        router.push(`/dashboard/mechanic/tasks/${task.id}`);
    }}
      className={cn(
        "group relative bg-white rounded-3xl border transition-all duration-500 overflow-hidden",
        isFinishing
          ? "scale-[0.98] border-emerald-500 bg-emerald-50/30"
          : "border-slate-200 shadow-sm",
        isInProgress &&
          !isFinishing &&
          "border-blue-400 shadow-blue-500/5 shadow-xl"
      )}
    >
      {/* SUCCESS OVERLAY: This is the critical part for UX */}
      {isFinishing && (
        <div className="absolute inset-0 z-20 bg-emerald-600/90 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
          <CheckCircle2 size={40} className="mb-2 animate-bounce" />
          <p className="font-bold text-lg">Task Finalized!</p>
          <p className="text-xs text-emerald-100 opacity-80">
            Updating your task queue...
          </p>
        </div>
      )}

      <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-5 items-center flex-1">
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-inner",
              isInProgress
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-400"
            )}
          >
            <Wrench size={24} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
              {task.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                  isInProgress
                    ? "bg-blue-50 text-blue-700 border-blue-100"
                    : "bg-amber-50 text-amber-700 border-amber-100"
                )}
              >
                {task.status.replace("_", " ")}
              </span>
              <span className="text-xs text-slate-400 font-medium italic">
                Ref: #{task.id.slice(-6)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 shrink-0">
          {!isInProgress ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
              className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              <PlayCircle size={18} /> Start Work
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-200"
            >
              <CheckCircle2 size={18} /> Complete Job
            </button>
          )}
        </div>
      </div>
    </div>
  );
}