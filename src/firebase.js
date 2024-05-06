import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA4iXFLaa0OiMwdTFbtRCGrJHtE96hVwW0",
  authDomain: "invoice-app-91682.firebaseapp.com",
  projectId: "invoice-app-91682",
  storageBucket: "invoice-app-91682.appspot.com",
  messagingSenderId: "527388360687",
  appId: "1:527388360687:web:062df6b17ff085dbb9801a",
  measurementId: "G-PZFFM7M7EL"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(app);
export const db = getFirestore(app);