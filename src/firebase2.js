// src/firebase2.js
import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your Firebase config object

const firebaseConfig = {
  apiKey: "AIzaSyBwM0ssSsjAuORzrODoOa0ZVEs8KN7qYJE",
  authDomain: "new-project-bc394.firebaseapp.com",
  projectId: "new-project-bc394",
  storageBucket: "new-project-bc394.appspot.com",
  messagingSenderId: "410359477740",
  appId: "1:410359477740:web:d5c7494a91a2bc010f7cc9",
};
// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const storage = getStorage(app);
const db = getFirestore(app);

export { app, storage, db };
