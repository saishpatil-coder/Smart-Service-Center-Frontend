"use client";

import { useDashboard } from "@/context/DashBoardContext";

export default function SidebarLoading() {
  const { collapsed } = useDashboard();

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-white border-r shadow-sm p-4 transition-all duration-300 animate-pulse z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* LOGO / HEADER SKELETON */}
      <div
        className={`h-6 bg-gray-200 rounded mb-10 ${
          collapsed ? "w-10 mx-auto" : "w-32"
        }`}
      ></div>

      {/* MENU ITEMS */}
      <div className="space-y-8">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-4"
            }`}
          >
            {/* ICON SKELETON */}
            <div className="min-w-[24px] w-6 h-6 bg-gray-300 rounded-lg shadow-sm"></div>

            {/* TEXT SKELETON - Hidden when collapsed */}
            {!collapsed && (
              <div
                className={`h-4 bg-gray-200 rounded transition-opacity duration-300 ${
                  item % 2 === 0 ? "w-24" : "w-32"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* BOTTOM SECTION SKELETON */}
      <div className="absolute bottom-8 left-0 w-full px-4">
        <div
          className={`h-10 bg-gray-100 rounded-xl ${
            collapsed ? "w-10 mx-auto" : "w-full"
          }`}
        ></div>
      </div>
    </div>
  );
}
