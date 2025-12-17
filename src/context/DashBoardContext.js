"use client";

import { createContext, useContext, useEffect, useState } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [collapsed, setCollapsed] = useState(true);
  const [search, setSearch] = useState("");

  // sidebar persistence (optional, you already had this)
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored !== null) setCollapsed(stored === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <DashboardContext.Provider
      value={{
        collapsed,
        toggleSidebar,
        search,
        setSearch,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  }
  return ctx;
}
