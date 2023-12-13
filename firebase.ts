import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZfe29hLXyIp2PTg7l3xvpeISKid7jX4c",
  authDomain: "codeshare-99d89.firebaseapp.com",
  projectId: "codeshare-99d89",
  storageBucket: "codeshare-99d89.appspot.com",
  messagingSenderId: "710112511028",
  appId: "1:710112511028:web:27f9946d2add91692cb661",
  measurementId: "G-0C151HPN0F"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);