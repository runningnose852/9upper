import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApDhIihQJUnsdr3gdaLn3Kjp2Bci3mS4k",
  authDomain: "upper-62ea8.firebaseapp.com",
  projectId: "upper-62ea8",
  storageBucket: "upper-62ea8.firebasestorage.app",
  messagingSenderId: "1002149966282",
  appId: "1:1002149966282:web:c5828d31809c31d8dd9f33",
};

// Prevent re-initializing in Next.js
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);