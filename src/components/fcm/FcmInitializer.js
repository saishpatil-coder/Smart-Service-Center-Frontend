"use client";

import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import api from "@/lib/axios";

export async function registerFCMTokenAfterLogin() {
  console.log("FCM registering !!!")
  if (typeof window === "undefined") {
    console.log("windows not compatible");
    return;
  }

  // 1. Prevent redundant hits in the same session
  const alreadySent = localStorage.getItem("fcm_sent");
  if (alreadySent){
    console.log("already sent");
    return;
  }

  try {
    const existingToken = localStorage.getItem("fcm_token");

    // CASE 1: Token exists in LocalStorage
    if (existingToken) {
      console.log("Syncing existing FCM token to backend...");
      await api.post("/users/save-fcm-token", {
        token: existingToken,
        deviceInfo: navigator.userAgent,
      });
      localStorage.setItem("fcm_sent", "true"); // Mark as synced
      return;
    }
    console.log("no existing token creating new ")

    // CASE 2: New Token Generation
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return;
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) return;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (token) {
      localStorage.setItem("fcm_token", token);
      await api.post("/users/save-fcm-token", {
        token,
        deviceInfo: navigator.userAgent,
      });
      localStorage.setItem("fcm_sent", "true");
      console.log("New FCM token registered successfully");
    }
  } catch (error) {
    console.error("FCM Registration Error:", error);
  }
}
