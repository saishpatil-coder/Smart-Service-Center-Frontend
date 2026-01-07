importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
);
const firebaseConfig = {
  apiKey: "AIzaSyDfwlhGxakIe-QnlRA7ng77lI-V_xwr4to",
  authDomain: "ccsms-1d901.firebaseapp.com",
  projectId: "ccsms-1d901",
  storageBucket: "ccsms-1d901.appspot.com", // ✅ REQUIRED
  messagingSenderId: "391509479402",
  appId: "1:391509479402:web:d684bc38fbbf0fb3442c93",
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();