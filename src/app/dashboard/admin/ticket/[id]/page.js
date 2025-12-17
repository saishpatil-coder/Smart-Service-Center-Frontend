"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import {
  Loader2,
  Clock,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function AdminTicketDetails(props) {
  const router = useRouter();
  const param = use(props.params);
  const id = param.id;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [canceling, setCanceling] = useState(false);

  // Editable fields
  const [expectedCost, setExpectedCost] = useState("");
  const [expectedHours, setExpectedHours] = useState("");

  async function loadTicket() {
    try {
      const res = await api.get(`/admin/ticket/${id}`);
      setTicket(res.data.ticket);
      setExpectedCost(res.data.ticket.expectedCost || "");
      setExpectedHours(res.data.ticket.expectedCompletionHours || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTicket();
  }, []);

  // Accept Ticket → also saves edits
async function handleAccept() {
  setAccepting(true);

  try {
    await toast.promise(
      api.patch(`/admin/ticket/${id}/accept`, {
        expectedCost,
        expectedCompletionHours: expectedHours,
      }),
      {
        loading: "Accepting ticket...",
        success: "Ticket accepted successfully!",
        error: "Error accepting ticket.",
      }
    );

    router.push("/dashboard/admin/pending-tickets");
  } catch (err) {
    console.error(err);
  } finally {
    setAccepting(false);
  }
}

async function handleCancel() {
  setCanceling(true);

  try {
    await toast.promise(api.patch(`/admin/ticket/${id}/cancel`), {
      loading: "Canceling ticket...",
      success: "Ticket canceled successfully!",
      error: "Error canceling ticket.",
    });

    router.push("/dashboard/admin/pending-tickets");
  } catch (err) {
    console.error(err);
  } finally {
    setCanceling(false);
  }
}

  if (loading)
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Ticket Details
      </h1>

      {/* CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 space-y-8">
        {/* TOP SECTION */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {ticket.title}
            </h2>
            <p className="text-gray-600 mt-1">{ticket.description}</p>
          </div>

          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 shadow-sm">
            {ticket.severityName}
          </span>
        </div>

        {/* IMAGE */}
        {ticket.imageUrl && (
          <div className="w-72 h-72 rounded-xl overflow-hidden shadow-md border mx-auto">
            <Image
              src={ticket.imageUrl}
              width={400}
              height={400}
              alt="ticket"
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* SLA BOX */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl shadow-inner border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Clock size={18} /> SLA Information
          </h3>

          <div className="space-y-2 text-gray-700">
            <p>
              <b>Accept Before:</b>{" "}
              {new Date(ticket.slaAcceptDeadline).toLocaleString()}
            </p>

            <p>
              <b>Assign Deadline:</b>{" "}
              {new Date(ticket.slaAssignDeadline).toLocaleString()}
            </p>

            <p>
              <b>Expected Completion:</b>{" "}
              {ticket.expectedCompletionAt
                ? new Date(ticket.expectedCompletionAt).toLocaleString()
                : "—"}
            </p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between items-center pt-4">
          {/* Cancel */}
          <button
            onClick={handleCancel}
            disabled={canceling}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl hover:bg-red-700 transition shadow-md disabled:opacity-50"
          >
            <XCircle size={18} />
            {canceling ? "Cancelling…" : "Cancel Ticket"}
          </button>

          {/* Accept */}
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-md disabled:opacity-50 font-semibold text-lg"
          >
            {accepting && <Loader2 className="animate-spin" size={20} />}
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
