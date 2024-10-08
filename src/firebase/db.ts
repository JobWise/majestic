// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDr2Ur4QbqnBH6UwkSt92Dt4lhyG8OLWdw",
  authDomain: "majestic-b06a1.firebaseapp.com",
  projectId: "majestic-b06a1",
  storageBucket: "majestic-b06a1.appspot.com",
  messagingSenderId: "328584832960",
  appId: "1:328584832960:web:d9c5b6d649a87905fd4a25",
  measurementId: "G-69FDZB4VRF",
};

export const HIGH_SCORES_DB = "high_scores";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export default db;
