import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDo2dPzhu3xbfYidYcGsm2zN4gYxI4nQDI",
  authDomain: "gpa-calculator-865b3.firebaseapp.com",
  projectId: "gpa-calculator-865b3",
  storageBucket: "gpa-calculator-865b3.firebasestorage.app",
  messagingSenderId: "411597084474",
  appId: "1:411597084474:web:50b9fdcebf52ddf247a203",
  measurementId: "G-ZZKCCRTE5V",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
