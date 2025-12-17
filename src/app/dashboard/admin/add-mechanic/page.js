"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { CheckCircle, AlertCircle, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { addMechanic } from "@/services/admin.service";
import { toast } from "sonner";

export default function AddMechanicPage() {
  const [data, setData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!data.name || !data.email || !data.mobile || !data.password) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (data.mobile.length < 10) {
      setErrorMsg("Mobile number must be 10 digits.");
      return;
    }

    try {
      setLoading(true);

      const res = await addMechanic(data.name, data.email, data.mobile, data.password);
            toast(res.message || "Mechanic Added successfully!", { type: "success" });

      setSuccessMsg("Mechanic added successfully!");
      setData({ name: "", email: "", mobile: "", password: "" });
    } catch (err) {
      console.log("error"  ,err)
      const message = err?.response?.data?.message || "Failed to add mechanic.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <UserPlus size={28} className="text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Add New Mechanic</h1>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-white border shadow-md rounded-xl p-8 w-full max-w-lg
          transition-all
        "
      >
        {/* InputS */}
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Mechanic Full Name"
            className="w-full p-3 border rounded-lg bg-gray-50 outline-blue-500"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />

          <Input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg bg-gray-50 outline-blue-500"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          <Input
            type="number"
            placeholder="Mobile Number"
            className="w-full p-3 border rounded-lg bg-gray-50 outline-blue-500"
            value={data.mobile}
            onChange={(e) => setData({ ...data, mobile: e.target.value })}
          />

          <Input
            type="password"
            placeholder="Create Password"
            className="w-full p-3 border rounded-lg bg-gray-50 outline-blue-500"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>

        {/* SUCCESS MESSAGE */}
        {successMsg && (
          <div
            className="
              mt-5 p-3 rounded-lg flex items-center gap-3 
              bg-green-100 border border-green-300 text-green-700
            "
          >
            <CheckCircle size={20} />
            {successMsg}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div
            className="
              mt-5 p-3 rounded-lg flex items-center gap-3 
              bg-red-100 border border-red-300 text-red-700
            "
          >
            <AlertCircle size={20} />
            {errorMsg}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="
            mt-6 w-full py-3 rounded-lg shadow bg-blue-600 text-white 
            font-semibold hover:bg-blue-700 transition disabled:opacity-60
          "
        >
          {loading ? "Adding Mechanic..." : "Add Mechanic"}
        </button>
      </form>
    </div>
  );
}
