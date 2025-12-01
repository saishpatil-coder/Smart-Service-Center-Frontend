"use client";

import { useState } from "react";
import Link from "next/link";
import { APP_NAME } from "@/constants/app";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-[#6CA8F7] shadow-md">
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
          <Link
            href="/login"
            className="text-white font-medium hover:underline"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold"
          >
            Sign Up
          </Link>
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

          <Link href="/login" className="block mt-4 font-medium">
            Login
          </Link>

          <Link
            href="/register"
            className="block bg-white text-blue-600 w-full text-center py-2 rounded-lg font-semibold"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
