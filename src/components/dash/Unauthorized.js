"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  const { user } = useUser();
  const router = useRouter();

  const role = user?.role || "CLIENT";

  const redirectPath = !role
    ? "/"
    : role === "ADMIN"
    ? "/dashboard/admin"
    : role === "MECHANIC"
    ? "/dashboard/mechanic"
    : "/dashboard/client";

  const buttonLabel = !role
    ? "Go Back to Home"
    : role === "ADMIN"
    ? "Go to Admin Dashboard"
    : role === "MECHANIC"
    ? "Go to Mechanic Dashboard"
    : "Go to Client Dashboard";

  return (
    <div className="min-h-[calc(100vh-164px)] flex items-center justify-center bg-gradient-to-br from-red-50 to-red-200 px-4">
      <div className="relative p-[2px] rounded-2xl bg-gradient-to-br from-red-400/60 via-pink-400/60 to-red-600/60 shadow-2xl animate-borderGlow">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-10 max-w-md text-center shadow-xl">
          {/* Animated Icon Ring */}
          <div className="relative flex justify-center mb-6">
            <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 blur-xl opacity-30 animate-pulse"></div>

            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center shadow-md border border-red-300/50 relative z-10">
              <ShieldAlert
                className="text-red-600"
                size={45}
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* ROLE BADGE */}
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold tracking-wide mb-3 shadow-sm">
            ROLE: {role}
          </span>

          {/* TITLE */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Access Restricted
          </h1>

          {/* MESSAGE */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            You don’t have permission to view this page. Please navigate back to
            your authorized dashboard.
          </p>

          {/* BUTTON */}
          <button
            onClick={() => router.push(redirectPath)}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold shadow-lg hover:shadow-red-300 transition-all duration-200 hover:scale-[1.02]"
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes borderGlow {
          0% {
            filter: drop-shadow(0 0 4px rgba(255, 0, 0, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(255, 0, 0, 0.5));
          }
          100% {
            filter: drop-shadow(0 0 4px rgba(255, 0, 0, 0.3));
          }
        }
        .animate-borderGlow {
          animation: borderGlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
