"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function AddInventoryItem() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: 0,
    unitPrice: "",
    unit: "piece",
    minStock: 5,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.sku || !form.category || !form.unitPrice) {
      toast.warning("Please fill all required fields");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Adding inventory item...");

    try {
      await api.post("/admin/inventory", {
        ...form,
        quantity: Number(form.quantity),
        minStock: Number(form.minStock),
        unitPrice: Number(form.unitPrice),
      });

      toast.success("Inventory item added", {
        id: toastId,
      });

      setForm({
        name: "",
        sku: "",
        category: "",
        quantity: 0,
        unitPrice: "",
        unit: "piece",
        minStock: 5,
      });
    } catch (err) {
      toast.error("Failed to add item", {
        id: toastId,
        description: err.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">
          Add Inventory Item
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Add a new spare part or consumable to inventory
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Item Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {/* SKU & Category */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SKU
              </label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Initial Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="piece">Piece</option>
                <option value="liter">Liter</option>
                <option value="kg">Kg</option>
              </select>
            </div>
          </div>

          {/* Price & Min Stock */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Stock Alert
              </label>
              <input
                type="number"
                name="minStock"
                value={form.minStock}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
