"use client";

import { useEffect, useRef } from "react";
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import api from "@/lib/axios";

// export default function FCMInitializer() {
//   const initialized = useRef(false);

//   useEffect(() => {
//     if (initialized.current) return;
//     initialized.current = true;

//     async function init() {
//       const messaging = await getFirebaseMessaging();
//       if (!messaging) return;

//       const permission = await Notification.requestPermission();
//       if (permission !== "granted") return;

//       const token = await getToken(messaging, {
//         vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//       });

//       if (token) {
//         await api.post("/users/save-fcm-token", { token });
//       }
//     }

//     init();
//   }, []);

//   return null;
// }


export async function registerFCMTokenAfterLogin() {
  // HARD STOP ON SERVER
  if (typeof window === "undefined") return;
  const alreadySent = sessionStorage.getItem("fcm_sent");
  if (alreadySent) {
    console.log("FCM token already sent in this session");
    return;
  }

  const existingToken = localStorage.getItem("fcm_token");

  // CASE 1: Token already exists → just send to backend
  console.log("Existing token : ",existingToken?.split(0,5)||null)
  if (existingToken) {
    console.log("Token available sending it to backend")
    await api.post("/users/save-fcm-token", {
      token: existingToken,
      deviceInfo: navigator.userAgent,
    });
    return;
  }

  // CASE 2: Generate new token
  console.log("generating new token")
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  });
      console.log("vapid ",process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY);


  if (!token) return;

  // Save everywhere
  localStorage.setItem("fcm_token", token);
console.log("sending token to backend ")
  await api.post("/users/save-fcm-token", {
    token,
    deviceInfo: navigator.userAgent,

  });
    sessionStorage.setItem("fcm_sent", "true");

}
