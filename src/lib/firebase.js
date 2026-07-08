import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyBL-ZUEdXE_KH5Ut2AgNH9IrnrqApuAAPc",
  authDomain: "ulhiyath.firebaseapp.com",
  databaseURL: "https://ulhiyath-default-rtdb.firebaseio.com",
  projectId: "ulhiyath",
  storageBucket: "ulhiyath.firebasestorage.app",
  messagingSenderId: "93809898437",
  appId: "1:93809898437:web:d81308b9858178a41c11ac"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
