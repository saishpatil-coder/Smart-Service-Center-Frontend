"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { APP_NAME } from "@/constants/app";

export default function LoginPage() {
  return (
    // Added pt-32 to account for the fixed navbar height
    <div className="flex flex-col pt-25 gap-2 min-h-screen bg-white">
      <div className="flex flex-col gap-7 p-6 md:p-10">
        <div className="flex justify-center gap-2">
          <a href="/" className="flex items-center gap-3 group">
            <div className="bg-slate-900 text-white flex size-10 items-center justify-center rounded-xl shadow-lg transition-transform group-hover:rotate-3">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">
              {APP_NAME}
            </span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
