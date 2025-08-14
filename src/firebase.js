import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, collection, addDoc, setDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDo2dPzhu3xbfYidYcGsm2zN4gYxI4nQDI",
  authDomain: "gpa-calculator-865b3.firebaseapp.com",
  projectId: "gpa-calculator-865b3",
  storageBucket: "gpa-calculator-865b3.firebasestorage.app",
  messagingSenderId: "411597084474",
  appId: "1:411597084474:web:50b9fdcebf52ddf247a203",
  measurementId: "G-ZZKCCRTE5V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    collection,
    addDoc,
    setDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy
 }