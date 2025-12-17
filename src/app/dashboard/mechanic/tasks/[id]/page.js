"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import { Loader2, ArrowLeft, User, Phone, Mail, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MechanicTaskDetailsPage(props) {
  const router = useRouter();
  const params = use(props.params);
  const id = params.id;

  const [ticket, setTicket] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/mechanic/task/${id}`), // 👈 returns { ticket }
      api.get("/mechanic/inventory"),
    ])
      .then(([ticketRes, invRes]) => {
        setTicket(ticketRes.data.ticket);
        setInventory(invRes.data.items || []);
        console.log(ticketRes.data.ticket)
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function startWork() {
    await api.patch(`/mechanic/task/${id}/start`);
    // refresh();
  }

  async function completeWork() {
    await api.patch(`/mechanic/task/${id}/complete`);
    // refresh();
  }

  async function refresh() {
    const res = await api.get(`/mechanic/ticket/${id}`);
    setTicket(res.data.ticket);
  }

  async function addPartsUsed() {
    await api.post(`/mechanic/tasks/${id}/parts-used`, {
      items: selectedItems,
    });
    setSelectedItems([]);
    // refresh();
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  if (!ticket) return null;

  const statusColor = {
    ASSIGNED: "bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
  }[ticket.status];

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{ticket.title}</h1>
        <span
          className={`px-3 py-1 rounded-md text-sm font-semibold ${statusColor}`}
        >
          {ticket.status.replace("_", " ")}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700">{ticket.description}</p>

      {/* Ticket + Client Info */}
      <div className="grid grid-cols-2 gap-4 bg-white p-5 rounded-xl border text-sm">
        <p>
          <b>Service:</b> {ticket.service?.serviceTitle}
        </p>
        <p>
          <b>Severity:</b> {ticket.severityName}
        </p>

        <div className="col-span-2 border-t pt-3 space-y-1">
          <p className="font-semibold flex items-center gap-2">
            <User size={16} /> Client Info
          </p>
          <p className="flex items-center gap-2">
            <User size={14} /> {ticket.client?.name}
          </p>
          <p className="flex items-center gap-2">
            <Phone size={14} /> {ticket.client?.phone}
          </p>
          <p className="flex items-center gap-2">
            <Mail size={14} /> {ticket.client?.email}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {ticket.status === "ASSIGNED" && (
          <button
            onClick={startWork}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Start Work
          </button>
        )}

        {ticket.status === "IN_PROGRESS" && (
          <button
            onClick={completeWork}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Mark Completed
          </button>
        )}
      </div>

      {/* Used Parts */}
      {ticket.partsUsed?.length > 0 && (
        <div className="bg-white p-5 rounded-xl border">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Wrench size={18} /> Parts Used
          </h2>

          <ul className="space-y-2 text-sm">
            {ticket.partsUsed.map((p, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{p.name}</span>
                <span>
                  {p.quantity} × ₹{p.unitPrice}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Inventory */}
      {ticket.status != "COMPLETED" && (
        <div className="bg-white p-5 rounded-xl border">
          <h2 className="font-semibold mb-3">Add Parts Used</h2>

          <div className="space-y-3">
            this is inventory
            {inventory.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
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
                />
                <span className="flex-1">{item.name}</span>
                <input
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="w-20 border rounded px-2 py-1"
                  onChange={(e) =>
                    setSelectedItems((prev) =>
                      prev.map((i) =>
                        i.inventoryId === item.id
                          ? { ...i, quantity: Number(e.target.value) }
                          : i
                      )
                    )
                  }
                />
              </div>
            ))}
          </div>

          <button
            onClick={addPartsUsed}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add Parts
          </button>
        </div>
      )}
    </div>
  );
}
