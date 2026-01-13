"use client";
// app/dashboard/loading.js
export default function Loading() {
  return (
    <div className="flex items-center gap-3 p-6 bg-blue-50/50 rounded-2xl animate-pulse">
      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
        Syncing System Blueprint...
      </span>
    </div>
  );
}