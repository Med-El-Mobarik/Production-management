import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwQYU2X7g7yd8hlAyJ_B80ImYk8moBK7I",
  authDomain: "erratby-ad3f0.firebaseapp.com",
  projectId: "erratby-ad3f0",
  storageBucket: "erratby-ad3f0.appspot.com",
  messagingSenderId: "768459061126",
  appId: "1:768459061126:web:6d78e8152b0b440eb51e07",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
