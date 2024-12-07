import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

export const getMyProfile = async (setMyProfile) => {
  const data = await getDocs(userCollection);
  const filteredData = data.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  const myProfile = filteredData.filter(
    (user) => user.email === auth.currentUser.email
  );

  setMyProfile(myProfile);
};
