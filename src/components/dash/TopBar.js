"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { LogOut, Search, Circle, Menu } from "lucide-react";
import { logout } from "@/services/auth.service";

export default function DashboardTopbar() {
  const { user, setUser } = useUser();
  const router = useRouter();

  if (!user) return null;

  const firstLetter = user.name?.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <div
      className="
        w-full h-16 
        bg-linear-to-r from-blue-600 to-blue-500
        shadow-lg rounded-xl 
        flex items-center justify-between 
        px-6 mb-6
        text-white
      "
    >

      {/* LEFT PART – Dashboard Status + Heading */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold tracking-wide">Dashboard</h2>


      </div>

      {/* MIDDLE – Search Bar (Optional) */}
      <div className="hidden md:flex items-center bg-white/20 px-3 py-1 rounded-lg w-80">
        <Search size={18} className="text-white/80" />
        <input
          type="text"
          placeholder="Search ticket/job..."
          className="bg-transparent outline-none ml-2 text-sm placeholder-white/70 text-white w-full"
        />
      </div>

      {/* RIGHT PART – User Info */}
      <div className="flex items-center gap-5">
        {/* Role Badge */}
        <span
          className="
            text-xs px-3 py-1 rounded-full 
            bg-white/20 text-white font-medium
            border border-white/30
          "
        >
          {user.role}
        </span>

        {/* User Name */}
        <span className="font-medium">{user.name}</span>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold shadow-md">
          {firstLetter}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-white font-semibold shadow"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
