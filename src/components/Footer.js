"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full text-white bg-gradient-to-br from-[#5FA0F5] to-[#4D8EE2] pt-16 pb-10">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Logo + Description */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-wide">
            Smart Vehicle Services
          </h2>
          <p className="mt-4 text-white/85 text-sm leading-6">
            A seamless platform to book, track, and manage all your vehicle
            service needs with ease and transparency.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <Link href="#" className="hover:scale-110 transition">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:scale-110 transition">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:scale-110 transition">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:scale-110 transition">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Section: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-white/85">
            <li>
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-white transition">
                Book Service
              </Link>
            </li>
            <li>
              <Link href="/track" className="hover:text-white transition">
                Track Service
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Our Services</h3>
          <ul className="space-y-3 text-white/85">
            <li>General Maintenance</li>
            <li>Vehicle Repair</li>
            <li>Pick-up & Drop</li>
            <li>Service History</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-3 text-white/85 text-sm">
            <li>Email: support@smartvehicle.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Location: Pune, Maharashtra</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 mt-12 pt-6 text-center">
        <p className="text-white/80 text-sm">
          © {new Date().getFullYear()} Smart Vehicle Services • All Rights
          Reserved
        </p>
      </div>
    </footer>
  );
}
