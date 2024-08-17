import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzW0",
  authDomain: "inv682.firebaseapp.com",
  projectId: "invo682",
  storageBucket: "incppspot.com",
  messagingSenderId: "527687",
  appId: "1:52738836068785dbb9801a",
  measurementId: "G-EL"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(app);
export const db = getFirestore(app);
