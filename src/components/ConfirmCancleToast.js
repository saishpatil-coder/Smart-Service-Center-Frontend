"use client";
import { useState } from "react";
import { toast } from "react-toastify";

export function confirmCancel(onConfirm) {
  toast(
    ({ closeToast }) => {
      const [reason, setReason] = useState("");

      return (
        <div className="space-y-3">
          <p className="font-medium text-gray-900">
            Why are you cancelling this ticket?
          </p>

          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter cancellation reason..."
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={closeToast}
              className="px-3 py-1 text-sm rounded-md border"
            >
              No
            </button>

            <button
              onClick={() => {
                if (!reason.trim()) {
                  toast.error("Cancellation reason is required");
                  return;
                }
                closeToast();
                onConfirm(reason);
              }}
              className="px-3 py-1 text-sm rounded-md bg-red-600 text-white"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      );
    },
    {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    }
  );
}
