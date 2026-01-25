"use client";

import { useEffect } from "react";
import { getFirebaseMessaging } from "@/lib/firebase";
import { onMessage } from "firebase/messaging";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function FCMListener() {
  const router = useRouter();
  const { user } = useUser(); // get role

  useEffect(() => {
    let unsubscribe;

    async function init() {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      unsubscribe = onMessage(messaging, (payload) => {
        const type = payload?.data?.type || "info";
        const ticketId = payload?.data?.ticketId || null;

        const title = payload?.notification?.title || "Notification";
        const body =
          payload?.notification?.body || "You have a new notification";

        const role = user?.role?.toLowerCase(); // client | admin | mechanic

        // 🔹 Navigation handler (only if ticketId exists)
        const handleNavigation = () => {
          if (!ticketId || !role) return;

          if (role === "client") {
            router.push(`/dashboard/client/tickets/${ticketId}`);
          } else if (role === "mechanic") {
            router.push(`/dashboard/mechanic/tasks/${ticketId}`);
          } else {
            router.push(`/dashboard/admin/tickets/${ticketId}`);
          }
        };

        // 🔹 Toast rendering
        const content = (
          <div
            onClick={() => ticketId && handleNavigation()}
            className={ticketId ? "cursor-pointer" : ""}
          >
            <strong className="block text-sm">{title}</strong>
            <p className="text-xs text-gray-300 mt-1">{body}</p>

            {ticketId && (
              <p className="text-[10px] mt-2 text-blue-400 font-bold">
                Click to open ticket →
              </p>
            )}
          </div>
        );

        // 🔹 Type based toast
        if (type === "security") {
          toast.warning(content, getToastOptions(8000));
        } else if (type === "critical") {
          toast.error(content, getToastOptions(12000));
        } else {
          toast.info(content, getToastOptions(5000));
        }
      });
    }

    init();
    return () => unsubscribe?.();
  }, [router, user?.role]);

  return null;
}

// 🔹 Common toast options
function getToastOptions(time) {
  return {
    position: "top-right",
    autoClose: time,
    closeOnClick: true,
    draggable: true,
  };
}
