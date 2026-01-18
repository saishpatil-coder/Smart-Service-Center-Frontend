"use client";

import { getFirebaseMessaging } from "@/lib/firebase";
import { onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { BellRing, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function FCMListener() {
  const router = useRouter();
  const { user } = useUser(); // Get live user state

  useEffect(() => {
    let unsubscribe;

    async function init() {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      unsubscribe = onMessage(messaging, (payload) => {
        // 1. Extract raw data
        const type = payload.data?.type || "INFO";
        const ticketId = payload.data?.ticketId;

        // 2. Determine Role at the MOMENT the message arrives
        const role = user?.role?.toLowerCase() || "client";

        // 3. Centralized Navigation Logic
        const handleNavigation = (closeToast) => {
          if (!ticketId) return;

          // Route branching based on SSCMS architecture
          if (role === "client") {
            router.push(`/dashboard/client/tickets/${ticketId}`);
          } else if (role === "mechanic") {
            router.push(`/dashboard/mechanic/tasks/${ticketId}`);
          } else {
            router.push(`/dashboard/admin/tickets/${ticketId}`);
          }

          closeToast();
        };

        toast(
          ({ closeToast }) => (
            <div
              onClick={() =>
                type === "REDIRECT" && handleNavigation(closeToast)
              }
              className={`relative w-80 rounded-2xl bg-slate-900 text-white p-5 shadow-2xl border-l-4 transition-all duration-300 ${
                type === "REDIRECT"
                  ? "border-red-500 cursor-pointer hover:bg-slate-800"
                  : type === "SUCCESS"
                  ? "border-emerald-500"
                  : "border-blue-600"
              } animate-in slide-in-from-right-4`}
            >
              <div className="flex gap-4">
                <div className="mt-1">
                  {type === "REDIRECT" ? (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        closeToast();
                      }}
                      className="text-slate-500 hover:text-white p-1"
                    >
                      <span className="text-xs font-black">✕</span>
                    </button>
                  </div>

                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
                    {payload.notification?.body}
                  </p>

                  {ticketId && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigation(closeToast);
                        }}
                        className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                          type === "REDIRECT"
                            ? "text-red-400 hover:text-red-300"
                            : "text-blue-400 hover:text-blue-300"
                        }`}
                      >
                        {type === "REDIRECT" ? "Fix Now" : "Inspect"}
                        <ArrowRight size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ),
          {
            autoClose: type === "REDIRECT" ? 12000 : 7000,
            closeOnClick: false,
            draggable: true,
            position: "top-right",
            className: "!bg-transparent !shadow-none !p-0",
          },
        );
      });
    }

    init();
    return () => unsubscribe?.();
  }, [router, user]); // Re-subscribe if user state changes

  return null;
}
