"use client";

import { getFirebaseMessaging } from "@/lib/firebase";
import { onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function FCMListener() {
  useEffect(() => {
    let unsubscribe;

    async function init() {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

unsubscribe = onMessage(messaging, (payload) => {
  toast(
    ({ closeToast }) => (
      <div className="relative w-72 rounded-xl bg-slate-900 text-slate-100 p-4 shadow-2xl border-l-4 border-blue-500">
        {/* Close button */}
        <button
          onClick={closeToast}
          className="absolute top-2 right-2 text-slate-400 hover:text-white transition"
        >
          ✕
        </button>

        {/* Title */}
        <strong className="block text-sm font-semibold mb-1">
          {payload.notification?.title}
        </strong>

        {/* Body */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {payload.notification?.body}
        </p>
      </div>
    ),
    {
      icon: "🔔",
      autoClose: false, 
      closeOnClick: false,
      draggable: false,
      position: "top-right",
      hideProgressBar: true,
      className: "!bg-transparent !shadow-none",
    }
  );
});

    }

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return null;
}
