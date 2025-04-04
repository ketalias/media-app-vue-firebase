import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDaNV_9WpgE4PX8jh83c6h9SBxCQZGrDVE",
  authDomain: "interactive-album.firebaseapp.com",
  projectId: "interactive-album",
  storageBucket: "interactive-album.firebasestorage.app",
  messagingSenderId: "141954034172",
  appId: "1:141954034172:web:d4ee95ff35a2b42e52aa79",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
