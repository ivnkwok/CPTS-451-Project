// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFvSnqc2xedkRusKBf4-Q5ct6R17HOSH0",
  authDomain: "dining-hall-management-system.firebaseapp.com",
  projectId: "dining-hall-management-system",
  storageBucket: "dining-hall-management-system.firebasestorage.app",
  messagingSenderId: "230489900448",
  appId: "1:230489900448:web:10fab1bc279486234f90c5",
  measurementId: "G-BJGQVSKGR0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { analytics, auth };