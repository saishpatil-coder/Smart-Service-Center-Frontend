"use client";

import { getFirebaseMessaging } from "@/lib/firebase";
import { onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { BellRing, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function FCMListener() {
  useEffect(() => {
    let unsubscribe;

    async function init() {
      // Initialize Firebase Messaging only on the client side [cite: 77]
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      unsubscribe = onMessage(messaging, (payload) => {
        // Log for debugging during the Sankey Arise final phase [cite: 64, 76]
        console.log("Foreground message received:", payload);

        // UI Logic: Choose icon based on notification type [cite: 68]
        const type = payload.data?.type || "INFO";

        toast(
          ({ closeToast }) => (
            <div className="relative w-80 rounded-2xl bg-slate-900 text-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-l-4 border-blue-600 animate-in slide-in-from-right-4 duration-500">
              <div className="flex gap-4">
                <div className="mt-1">
                  {type === "URGENT" ? (
                    <ShieldAlert
                      className="text-red-500 animate-pulse"
                      size={20}
                    />
                  ) : type === "SUCCESS" ? (
                    <CheckCircle2 className="text-emerald-500" size={20} />
                  ) : (
                    <BellRing className="text-blue-500" size={20} />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <strong className="text-[11px] font-black uppercase tracking-widest text-white/90">
                      {payload.notification?.title || "System Update"}
                    </strong>
                    <button
                      onClick={closeToast}
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      <span className="text-xs font-black">✕</span>
                    </button>
                  </div>

                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
                    {payload.notification?.body}
                  </p>

                  {/* Action Link for SLA/Tickets [cite: 15, 28] */}
                  {payload.data?.ticketId && (
                    <div className="mt-3 flex justify-end">
                      <button className="text-[9px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-[0.2em] transition-all">
                        Inspect Record →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ),
          {
            autoClose: 10000,
            closeOnClick: false,
            draggable: true,
            position: "top-right",
            className: "!bg-transparent !shadow-none !p-0",
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
