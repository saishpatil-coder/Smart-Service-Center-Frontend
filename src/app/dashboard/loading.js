"use client";
// Example: src/app/dashboard/loading.js
export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
      {/* Signature Blue Spinner */}
      <div className="w-10 h-10 border-4 border-[#6CA8F7]/20 border-t-[#6CA8F7] rounded-full animate-spin" />

      <div className="flex flex-col items-center gap-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6CA8F7] animate-pulse">
          Synchronizing Console
        </p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Fetching real-time service data...
        </p>
      </div>
    </div>
  );
}
