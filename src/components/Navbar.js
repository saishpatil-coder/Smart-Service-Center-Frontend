"use client";

import { APP_NAME } from "@/constants/app";
import { useUser } from "@/context/UserContext";
import { logout } from "@/services/auth.service";
import { Pointer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const {user,loading,setUser} = useUser();
  const router = useRouter()

  const handleLogout = async ()=>{
    await logout();
    setUser(null);
    router.push("/login");
  }

  return (
    <nav className="w-full z-50 bg-[#6CA8F7] shadow-md fixed">
      {/* MAIN NAV */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white tracking-wide">
          {APP_NAME}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-lg text-white font-medium">
          <Link href="/">Home</Link>
          <Link href="/book">Book</Link>
          <Link href="/track">Track</Link>
          <Link href="/contact">Contact</Link>
        </div>

        {/* Login Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link
                onClick={() => setOpen(false)}
                href="/login"
                className="text-white font-medium hover:underline"
              >
                Login
              </Link>

              <Link
                onClick={() => setOpen(false)}
                href="/register"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              {/* Avatar Button */}
              <button
                onClick={() => setOpenMenu((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold flex items-center justify-center shadow-md hover:scale-105 transition"
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </button>

              {/* Dropdown Menu */}
              {openMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white shadow-lg rounded-lg p-4 z-50 animate-in fade-in zoom-in">
                  {/* User Info Block */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <h3 className="text-gray-800 font-semibold">
                        {user?.name || "User"}
                      </h3>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <span className="mt-3 inline-block text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-700 font-semibold">
                    {user?.role || "CLIENT"}
                  </span>

                  <hr className="my-3" />

                  {/* Go to Dashboard */}
                  <button
                    style={{
                      cursor: Pointer,
                    }}
                    onClick={() => {
                      const role = user?.role?.toLowerCase();

                      if (role === "admin") router.push("/dashboard/admin");
                      else if (role === "mechanic")
                        router.push("/dashboard/mechanic");
                      else router.push("/dashboard/client");
                    }}
                    className="w-full text-left text-blue-600 hover:bg-blue-50 px-2 py-2 rounded-md transition font-medium"
                  >
                    Go to Dashboard
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:bg-red-50 px-2 py-2 rounded-md transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="bg-[#6CA8F7] px-6 pb-4 md:hidden text-white space-y-4">
          <Link href="/" className="block">
            Home
          </Link>
          <Link href="/book" className="block">
            Book
          </Link>
          <Link href="/track" className="block">
            Track
          </Link>
          <Link href="/contact" className="block">
            Contact
          </Link>

          {!user ? (
            <>
              <Link
                onClick={() => setOpen(false)}
                href="/login"
                className="text-white font-medium hover:underline"
              >
                Login
              </Link>

              <Link
                onClick={() => setOpen(false)}
                href="/register"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              {/* Avatar Button */}
              <button
                onClick={() => setOpenMenu((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold flex items-center justify-center shadow-md hover:scale-105 transition"
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </button>

              {/* Dropdown Menu */}
              {openMenu && (
                <div className="absolute right-0 mt-3 w-52 bg-white shadow-lg rounded-lg p-4 z-50 animate-in fade-in zoom-in">
                  {/* User Info Block */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <h3 className="text-gray-800 font-semibold">
                        {user?.name || "User"}
                      </h3>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <span className="mt-3 inline-block text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-700 font-semibold">
                    {user?.role || "CLIENT"}
                  </span>

                  {/* Go to Dashboard */}
                  <button
                    style={{
                      cursor: Pointer,
                    }}
                    onClick={() => {
                      const role = user?.role?.toLowerCase();

                      if (role === "admin") router.push("/dashboard/admin");
                      else if (role === "mechanic")
                        router.push("/dashboard/mechanic");
                      else router.push("/dashboard/client");
                    }}
                    className="w-full text-left text-blue-600 hover:bg-blue-50 px-2 py-2 rounded-md transition font-medium"
                  >
                    Go to Dashboard
                  </button>

                  <hr className="my-3" />

                  {/* Actions */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:bg-red-50 px-2 py-2 rounded-md transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
