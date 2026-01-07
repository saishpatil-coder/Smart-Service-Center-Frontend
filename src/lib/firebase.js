"use client";
import { initializeApp} from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDfwlhGxakIe-QnlRA7ng77lI-V_xwr4to",
  authDomain: "ccsms-1d901.firebaseapp.com",
  projectId: "ccsms-1d901",
  storageBucket: "ccsms-1d901.appspot.com", // ✅ REQUIRED
  messagingSenderId: "391509479402",
  appId: "1:391509479402:web:d684bc38fbbf0fb3442c93",
};

// ✅ SAFE initialization
export const app = initializeApp(firebaseConfig)
export async function getFirebaseMessaging() {
  if (typeof window === "undefined") return null;

  const supported = await isSupported();
  if (!supported) {
    console.log("Firebase messaging not supported");
    return null;
  };

  return getMessaging(app);
}