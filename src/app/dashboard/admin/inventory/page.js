"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  Plus,
  Package,
  Edit2,
  Check,
  X,
  Loader2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stock editing states
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/inventory");
      setItems(res.data.items || []);
    } catch (error) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (item) => {
    const newQuantity = Number(editValue);
    if (isNaN(newQuantity) || editValue === "")
      return toast.error("Invalid quantity");
    if (newQuantity < 0)
      return toast.error("Quantity cannot be negative");
    try {
      setIsUpdating(true);
      const response = await api.patch(`/admin/inventory/${item.id}`, {
        ...item,
        quantity: newQuantity,
      });

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? response.data.item : i))
      );
      toast.success("Stock updated");
      setEditingId(null);
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api.delete(`/admin/inventory/${itemId}`);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Item removed");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase italic">
            <Package className="text-blue-600" size={30} />
            Inventory <span className="text-slate-300">Control</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Global Asset Monitoring
          </p>
        </div>
        <Link
          href="/dashboard/admin/inventory/add"
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-black transition-all shadow-lg shadow-slate-200"
        >
          <Plus size={18} /> ADD NEW ITEM
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-6 py-4">Item Details</th>
              <th className="px-6 py-4">Current Stock</th>
              <th className="px-6 py-4">Min. Required</th>
              <th className="px-6 py-4">Unit Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-slate-300"
                    size={32}
                  />
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isEditing = editingId === item.id;
                const isLowStock = item.quantity <= item.minStock;

                return (
                  <tr
                    key={item.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase">
                        SKU: {item.sku} • {item.category}
                      </p>
                    </td>

                    {/* CURRENT STOCK COLUMN */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            className="w-20 rounded-lg border-2 border-blue-500 px-2 py-1 text-sm font-bold"
                            value={editValue}
                            onChange={(e) => {
                              // Prevent negative values
                              if (e.target.value >= 0) setEditValue(e.target.value);
                              if (e.target.value === "") setEditValue("");
                              if (e.target.value === "-") {
                                toast.error("Quantity cannot be negative");
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateStock(item)}
                            disabled={isUpdating}
                            className="text-blue-600 p-1"
                          >
                            {isUpdating ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Check size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-slate-300 p-1"
                          >
                            {
                              isUpdating ? null : <X size={18} />
                            }
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/btn">
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase border transition-all",
                              isLowStock
                                ? "bg-red-50 border-red-200 text-red-600 shadow-sm shadow-red-100"
                                : "bg-emerald-50 border-emerald-100 text-emerald-600"
                            )}
                          >
                            {item.quantity} {item.unit}
                          </span>
                          <button
                          disabled={isEditing}
                            onClick={() => {
                              setEditingId(item.id);
                              setEditValue(item.quantity);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-blue-600"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* NEW MIN STOCK COLUMN */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">
                          {item.minStock} {item.unit}
                        </span>
                        {isLowStock && (
                          <div className="flex items-center gap-1 text-[9px] font-black text-red-500 uppercase tracking-tighter bg-red-50 px-1.5 py-0.5 rounded">
                            <AlertCircle size={10} /> Reorder
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-700">
                      ₹{Number(item.unitPrice).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-200 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
