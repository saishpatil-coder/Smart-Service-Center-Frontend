"use client";

export default function SidebarLoading() {
  return (
    <div   className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-white border-r shadow-sm p-6 animate-pulse">
      {/* LOGO / TITLE SKELETON */}
      <div className="w-32 h-6 bg-gray-200 rounded mb-8"></div>

      {/* MENU ITEMS */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
          <div className="w-28 h-4 bg-gray-200 rounded"></div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
          <div className="w-36 h-4 bg-gray-200 rounded"></div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
