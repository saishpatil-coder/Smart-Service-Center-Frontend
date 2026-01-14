"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import {
  Loader2,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Wrench,
  PlayCircle,
  CheckCircle2,
  PackagePlus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import TicketMessaging from "@/components/dash/TicketMessaging";
import TicketFeedback from "@/components/dash/TicketFeedback";

export default function MechanicTaskDetailsPage(props) {
  const router = useRouter();
  const params = use(props.params);
  const id = params.id;

  const [ticket, setTicket] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    try {
      const [ticketRes, invRes] = await Promise.all([
        api.get(`/mechanic/task/${id}`),
        api.get("/mechanic/inventory"),
      ]);
      setTicket(ticketRes.data.ticket);
      console.log(ticketRes.data.ticket);
      setInventory(invRes.data.items || []);
    } catch (err) {
      toast.error("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleStatusUpdate = async (action) => {
    setProcessing(true);
    try {
      await api.patch(`/mechanic/task/${id}/${action}`);
      toast.success(
        `Task status updated to ${
          action === "start" ? "In Progress" : "Completed"
        }`
      );
      await fetchData();
    } catch (err) {
      toast.error("Failed to update task status");
    } finally {
      setProcessing(false);
    }
  };

const addPartsUsed = async () => {
  if (selectedItems.length === 0) return toast.warning("Select parts first");

  // Final safety check before submission
  const overStock = selectedItems.find((item) => {
    const invItem = inventory.find((i) => i.id === item.inventoryId);
    return item.quantity > (invItem?.quantity || 0);
  });

  if (overStock) {
    return toast.error(`Not enough stock for ${overStock.name}`);
  }

  setProcessing(true);
  try {
    await api.post(`/mechanic/tasks/${id}/parts-used`, {
      items: selectedItems,
    });
    toast.success("Parts updated successfully");
    setSelectedItems([]);
    await fetchData();
  } catch (err) {
    toast.error("Failed to update parts");
  } finally {
    setProcessing(false);
  }
};

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading task details...
        </p>
      </div>
    );

  if (!ticket) return null;

  const isInProgress = ticket.status === "IN_PROGRESS";
  const isCompleted = ticket.status === "COMPLETED";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4">
      {/* Navigation */}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Workshop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Ticket & Client Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {ticket.title}
                  </h1>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {ticket.description}
                  </p>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                    ticket.status === "ASSIGNED" &&
                      "bg-amber-50 text-amber-700 border-amber-200",
                    ticket.status === "IN_PROGRESS" &&
                      "bg-blue-50 text-blue-700 border-blue-200",
                    ticket.status === "COMPLETED" &&
                      "bg-emerald-50 text-emerald-700 border-emerald-200"
                  )}
                >
                  {ticket.status.replace("_", " ")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Service Type
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {ticket.service?.serviceTitle}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Priority
                  </p>
                  <p className="text-sm font-bold text-red-600">
                    {ticket.severityName}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-blue-100 bg-blue-50/30 space-y-4">
                <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                  <User size={18} /> Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<User size={14} />}
                    label="Name"
                    value={ticket.client?.name}
                  />
                  <InfoItem
                    icon={<Phone size={14} />}
                    label="Phone"
                    value={ticket.client?.phone}
                  />
                  <div className="md:col-span-2">
                    <InfoItem
                      icon={<Mail size={14} />}
                      label="Email"
                      value={ticket.client?.email}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-wrap gap-4 shadow-sm">
            {ticket.status === "ASSIGNED" && (
              <button
                disabled={processing}
                onClick={() => handleStatusUpdate("start")}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all active:scale-95 disabled:opacity-50"
              >
                {processing ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <PlayCircle size={20} />
                )}
                Clock In / Start Repair
              </button>
            )}

            {isInProgress && (
              <button
                disabled={processing}
                onClick={() => handleStatusUpdate("complete")}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {processing ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <CheckCircle2 size={20} />
                )}
                Finish Job & Submit
              </button>
            )}

            {isCompleted && (
              <div className="w-full flex items-center justify-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-bold">
                <CheckCircle2 size={20} /> Work Completed
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Parts & Inventory */}
        <div className="lg:col-span-5 space-y-6">
          {/* Currently Logged Parts */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Wrench size={18} /> Parts Logged
              </h3>
              <span className="bg-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">
                {ticket.partsUsed?.length || 0} Items
              </span>
            </div>
            <div className="p-6">
              {ticket.partsUsed?.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {ticket.partsUsed.map((p, idx) => (
                    <li
                      key={idx}
                      className="py-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          {p.quantity} Units Used
                        </p>
                      </div>
                      <p className="font-black text-slate-900">
                        ₹{(p.quantity * p.unitPrice).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-slate-400 py-4 text-sm italic">
                  No parts logged yet.
                </p>
              )}
            </div>
          </div>

          {/* Add New Parts */}
          {!isCompleted && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <PackagePlus size={18} /> Inventory List
                </h3>
              </div>
              <div className="max-h-72 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {inventory.map((item) => {
                  // Find if this item is in the selectedItems array to get its current quantity
                  const selectedItem = selectedItems.find(
                    (i) => i.inventoryId === item.id
                  );

                  return (
                    <InventoryRow
                      key={item.id}
                      item={item}
                      stock={item.quantity}
                      isSelected={!!selectedItem}
                      // Pass the quantity from selectedItems state, or default to 1
                      currentQty={selectedItem ? selectedItem.quantity : 1}
                      onToggle={(checked) => {
                        if (checked) {
                          if (item.quantity <= 0)
                            return toast.error("Out of stock");
                          setSelectedItems((prev) => [
                            ...prev,
                            {
                              inventoryId: item.id,
                              name: item.name,
                              quantity: 1,
                              unit: item.unit,
                              unitPrice: item.unitPrice,
                            },
                          ]);
                        } else {
                          setSelectedItems((prev) =>
                            prev.filter((i) => i.inventoryId !== item.id)
                          );
                        }
                      }}
                      onQtyChange={(val) => {
                        // Validation logic
                        let finalQty = val;
                        if (val > item.quantity) {
                          finalQty = item.quantity;
                          toast.warn(`Only ${item.quantity} units in stock`);
                        } else if (val < 0) {
                          finalQty = 0;
                        }

                        setSelectedItems((prev) =>
                          prev.map((i) =>
                            i.inventoryId === item.id
                              ? { ...i, quantity: finalQty }
                              : i
                          )
                        );
                      }}
                    />
                  );
                })}
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <button
                  disabled={selectedItems.length === 0 || processing}
                  onClick={addPartsUsed}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  <ShoppingCart size={18} /> Update Job Sheet (
                  {selectedItems.length})
                </button>
              </div>
            </div>
          )}
          <TicketFeedback ticketId={ticket.id} />
          <TicketMessaging ticketId={ticket.id} status={ticket.status} />
        </div>
      </div>
    </div>
  );
}function InventoryRow({
  item,
  stock,
  isSelected,
  currentQty,
  onToggle,
  onQtyChange,
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border transition-all",
        isSelected
          ? "border-blue-200 bg-blue-50"
          : "border-slate-100 hover:bg-slate-50",
        stock <= 0 && "opacity-60 grayscale pointer-events-none"
      )}
    >
      <input
        type="checkbox"
        disabled={stock <= 0}
        checked={isSelected}
        onChange={(e) => onToggle(e.target.checked)}
        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-800 truncate">
            {item.name}
          </p>
          {stock <= 5 && stock > 0 && (
            <span className="text-[9px] bg-amber-100 text-amber-700 px-1 rounded">
              Low Stock
            </span>
          )}
        </div>
        <p className="text-[10px] font-bold text-slate-400">
          ₹{item.unitPrice} / {item.unit} •{" "}
          <span className="text-blue-600">{stock} available</span>
        </p>
      </div>
      {isSelected && (
        <div className="flex flex-col items-end gap-1">
          <input
            type="number"
            max={stock}
            // Use the prop passed from the parent state
            value={currentQty}
            className="w-16 border border-blue-200 rounded-lg px-2 py-1 text-sm font-bold bg-white text-center"
            onChange={(e) => onQtyChange(Number(e.target.value))}
            // Prevents typing letters or decimals
            onKeyDown={(e) =>
              ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()
            }
          />
        </div>
      )}
    </div>
  );
}
// ... (InfoItem remains the same)
function InfoItem({ icon, label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
        {icon} {label}
      </p>
      <p className="text-sm font-semibold text-slate-700">{value || "—"}</p>
    </div>
  );
}
