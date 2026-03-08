import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA9Gmtlg_QUqGpVm9_Bb_ODFsX3DOiaDZo",
    authDomain: "nihal-b7aa2.firebaseapp.com",
    projectId: "nihal-b7aa2",
    storageBucket: "nihal-b7aa2.firebasestorage.app",
    messagingSenderId: "835252028313",
    appId: "1:835252028313:web:5e3fa18ec7ee2ea4480908",
    measurementId: "G-PBEV70C5X9"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Services and Export them for use in other files
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;