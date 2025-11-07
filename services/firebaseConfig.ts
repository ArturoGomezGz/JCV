// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpjNJHCv8wOjkKraM3POWbjItdsZeHWX4",
  authDomain: "jalisco-como-vamos-89dd9.firebaseapp.com",
  projectId: "jalisco-como-vamos-89dd9",
  storageBucket: "jalisco-como-vamos-89dd9.firebasestorage.app",
  messagingSenderId: "309613219005",
  appId: "1:309613219005:web:c494f0fe3910472e8a3bd4",
  measurementId: "G-DGBKE8THXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Note: Analytics is disabled for React Native compatibility
// For React Native analytics, use @react-native-firebase/analytics instead

export { app, auth, db };
export default app;