import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "studio-4117260523-fd45d",
  appId: "1:140769365056:web:44f8dfca2ff3def7d863a5",
  storageBucket: "studio-4117260523-fd45d.firebasestorage.app",
  apiKey: "AIzaSyBMko01AALhv6LaCTMD_7IdL9c1jGht3Mg",
  authDomain: "studio-4117260523-fd45d.firebaseapp.com",
  messagingSenderId: "140769365056",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
