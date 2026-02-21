import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Remove the getAnalytics import

const firebaseConfig = {
  apiKey: "AIzaSyBa5hsgwMhsOgCQcjrl5w5tcgjqY1v56lE",
  authDomain: "food-delivery--app-6358b.firebaseapp.com",
  projectId: "food-delivery--app-6358b",
  storageBucket: "food-delivery--app-6358b.firebasestorage.app",
  messagingSenderId: "1036835573933",
  appId: "1:1036835573933:web:c98fec89db666aaa45b624",
  measurementId: "G-7W5ZMQSPK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export only what we use (Auth)
export const auth = getAuth(app);