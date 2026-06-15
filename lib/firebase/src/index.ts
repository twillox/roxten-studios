import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFMvIFGiU3GzJCIuUF4E37GwtZ6Hv3RDA",
  authDomain: "roxten-studios.firebaseapp.com",
  projectId: "roxten-studios",
  storageBucket: "roxten-studios.firebasestorage.app",
  messagingSenderId: "390135535276",
  appId: "1:390135535276:web:dda05b5eacecabd6053109",
  measurementId: "G-54XL73W5N7"
};

// Initialize Firebase only once
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
