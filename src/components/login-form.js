"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { Loader2, KeyRound, Mail } from "lucide-react";
import { APP_NAME } from "@/constants/app";

export function LoginForm({ className, ...props }) {
  const [data, setData] = useState({ email: "", password: "" });
  const { setUser } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!data.email || !data.password) {
      return setError("Credentials required.");
    }

    setSubmitting(true);

    try {
      let response = await login(data.email, data.password);
      toast.success(response.message || "Access Granted");
      setUser(response.user);
      console.log("Taking you to ",user.role," Dashboard");
      router.push(`/dashboard/${response.user.role.toLowerCase()}`);
    } catch (err) {
      const message = err.response?.data?.message || "Authentication failed.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700",
        className
      )}
      {...props}
    >
      <FieldGroup className="spac">
        {/* Title */}
        <div className="flex flex-col items-center gap-2 text-center mb-4">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">
            Login to Your Account
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Identity verification required
          </p>
        </div>

        {/* Email */}
        <Field className="space-y-2">
          <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Mail size={12} /> Email Address
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="admin@sscms.com"
            className="rounded-xl border-slate-200 focus:ring-slate-900 h-12 font-medium"
            value={data.email}
            onChange={(e) =>
              setData({ ...data, email: e.target.value }) || setError("")
            }
            required
          />
        </Field>

        {/* Password - FORGOT PASSWORD REMOVED */}
        <Field className="space-y-2">
          <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <KeyRound size={12} /> Password
          </FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="rounded-xl border-slate-200 focus:ring-slate-900 h-12"
            value={data.password}
            onChange={(e) =>
              setData({ ...data, password: e.target.value }) || setError("")
            }
            required
          />
        </Field>

        {/* Error message */}
        {error && (
          <div className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl text-center animate-in shake duration-300">
            {error}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={submitting}
          className="h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          {submitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Authenticate"
          )}
        </Button>

        <FieldSeparator className="opacity-50" />

        {/* Bottom Text */}
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            New to {APP_NAME}?{" "} <br />
            <Link
              href="/register"
              className="text-slate-900 underline underline-offset-4 hover:text-blue-600 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </FieldGroup>
    </form>
  );
}
