"use client";

import { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  UserPlus,
  Loader2,
  Mail,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { addMechanic } from "@/services/admin.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AddMechanicPage() {
  const [data, setData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const validateForm = () => {
    if (!data.name || !data.email || !data.mobile || !data.password) {
      setErrorMsg("All fields are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setErrorMsg("Please enter a valid email address.");
      return false;
    }
    if (data.mobile.length < 10) {
      setErrorMsg("Mobile number must be at least 10 digits.");
      return false;
    }
    if (data.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await addMechanic(
        data.name,
        data.email,
        data.mobile,
        data.password
      );

      toast.success(res.message || "Mechanic onboarded successfully!");
      setData({ name: "", email: "", mobile: "", password: "" });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to add mechanic.";
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 text-blue-600">
          <div className="p-2 bg-blue-50 rounded-lg">
            <UserPlus size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Onboard Mechanic
          </h1>
        </div>
        <p className="text-slate-500 font-medium">
          Create a new account for technician access to the workshop portal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FORM */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="relative group">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <input
                    type="tel"
                    placeholder="9876543210"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                    value={data.mobile}
                    onChange={(e) =>
                      setData({ ...data, mobile: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="mechanic@workshop.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                System Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ERROR DISPLAY */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={18} />
                <p className="font-medium">{errorMsg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Onboarding...
                </>
              ) : (
                "Complete Onboarding"
              )}
            </button>
          </div>
        </form>

        {/* SIDEBAR INFO */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
            <ShieldCheck className="text-blue-400 mb-4" size={32} />
            <h3 className="text-lg font-bold mb-2">Access Control</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Onboarding a mechanic creates a unique profile in the system. They
              will be able to:
            </p>
            <ul className="mt-4 space-y-3">
              {[
                "View assigned tickets",
                "Update repair status",
                "Request spare parts",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs font-medium"
                >
                  <div className="w-1 h-1 bg-blue-400 rounded-full" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h4 className="text-blue-900 font-bold text-sm mb-2 italic flex items-center gap-2">
              <CheckCircle size={16} /> Admin Note
            </h4>
            <p className="text-blue-700 text-[11px] leading-relaxed">
              Ensure the mobile number is correct as it will be used for SMS
              notifications regarding urgent assignments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
