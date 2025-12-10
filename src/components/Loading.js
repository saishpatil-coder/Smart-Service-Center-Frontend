"use client";

export default function LoadingDashboard() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-6 animate-pulse">
        {/* Title Skeleton */}
        <div className="h-8 bg-gray-200 rounded-md w-1/3 mx-auto"></div>

        {/* Card Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>

          <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>

        {/* Large Chart/Card Skeleton */}
        <div className="p-8 rounded-xl bg-white shadow-sm border border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-48 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
