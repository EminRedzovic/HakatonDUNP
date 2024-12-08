import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAaF00xIAxD0dZQJkp4ux5G38buhFVKuJ8",
  authDomain: "hakatondunp-c19a1.firebaseapp.com",
  projectId: "hakatondunp-c19a1",
  storageBucket: "hakatondunp-c19a1.firebasestorage.app",
  messagingSenderId: "705859805429",
  appId: "1:705859805429:web:2fffb42f3eaa7da60de5bc",
  measurementId: "G-JQPVQ9K0P3",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const userCollection = collection(db, "users");

export const uploadImageToStorage = async (file) => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.name}_${Date.now()}`); // Kreirajte jedinstveni naziv za fajl

    // Upload fajla u Storage
    await uploadBytes(storageRef, file);

    // Dobijanje URL-a za download
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (err) {
    console.error("Greška prilikom upload-a slike:", err);
    throw err;
  }
};
