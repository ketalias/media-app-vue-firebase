import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const env = import.meta.env || process.env;

const firebaseConfig = {
  apiKey: env.VUE_APP_FIREBASE_API_KEY,
  authDomain: env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VUE_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
