"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { register } from "@/services/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Loader2, User, Phone, Mail, Lock, ShieldCheck } from "lucide-react";
import { APP_NAME } from "@/constants/app";

export function RegisterForm({ className, ...props }) {
  const [data, setData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!data.name || !data.mobile || !data.email || !data.password) {
      return setError("All credentials required.");
    }
    if (data.password !== data.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (data.mobile.length < 10) {
      return setError("Enter a valid 10-digit mobile number.");
    }

    setSubmitting(true);

    try {
      const res = await register(
        data.name,
        data.mobile,
        data.email,
        data.password,
        "CLIENT"
      );
      toast.success("Account initialized. Please log in.");
      router.push("/login");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Registration sequence failed.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col py-7 gap-6 w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700",
        className
      )}
      {...props}
    >
      <FieldGroup className="space-y-6">
        <div className="flex flex-col items-center gap-2 text-center mb-4">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">
            New Account
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Join the {APP_NAME} ecosystem
          </p>
        </div>

        {/* Responsive Grid Wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Full Name */}
          <Field className="space-y-1.5">
            <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <User size={12} /> Full Name
            </FieldLabel>
            <Input
              id="name"
              placeholder="John Doe"
              className="rounded-xl border-slate-200 h-11 text-sm"
              value={data.name}
              onChange={(e) =>
                setData({ ...data, name: e.target.value }) || setError("")
              }
              required
            />
          </Field>

          {/* Mobile */}
          <Field className="space-y-1.5">
            <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Phone size={12} /> Mobile
            </FieldLabel>
            <Input
              id="mobile"
              type="tel"
              placeholder="9876543210"
              className="rounded-xl border-slate-200 h-11 text-sm"
              value={data.mobile}
              onChange={(e) =>
                setData({ ...data, mobile: e.target.value }) || setError("")
              }
              required
            />
          </Field>

          {/* Email - Spans Full Width on MD */}
          <Field className="space-y-1.5 md:col-span-2">
            <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Mail size={12} /> Email Address
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="rounded-xl border-slate-200 h-11 text-sm"
              value={data.email}
              onChange={(e) =>
                setData({ ...data, email: e.target.value }) || setError("")
              }
              required
            />
          </Field>

          {/* Password */}
          <Field className="space-y-1.5">
            <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Lock size={12} /> Password
            </FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              className="rounded-xl border-slate-200 h-11 text-sm"
              value={data.password}
              onChange={(e) =>
                setData({ ...data, password: e.target.value }) || setError("")
              }
              required
            />
          </Field>

          {/* Confirm Password */}
          <Field className="space-y-1.5">
            <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <ShieldCheck size={12} /> Confirm
            </FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••"
              className="rounded-xl border-slate-200 h-11 text-sm"
              value={data.confirmPassword}
              onChange={(e) =>
                setData({ ...data, confirmPassword: e.target.value }) ||
                setError("")
              }
              required
            />
          </Field>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Initialize Account"
            )}
          </Button>

          <FieldSeparator className="opacity-50" />

          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-slate-900 underline underline-offset-4 hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </FieldGroup>
    </form>
  );
}
