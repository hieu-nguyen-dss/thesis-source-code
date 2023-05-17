import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDirKvqyXr2iUOlpBw2Cxh6UWKDpgytGLE",
  authDomain: "thesis-cb596.firebaseapp.com",
  databaseURL: "https://thesis-cb596-default-rtdb.firebaseio.com",
  projectId: "thesis-cb596",
  storageBucket: "thesis-cb596.appspot.com",
  messagingSenderId: "549352775571",
  appId: "1:549352775571:web:4fafac3aecac0a7cf19266",
  measurementId: "G-TVD05D4YET",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
const firebaseDb = getDatabase(app);
if (window.location.hostname === "localhost") {
  // auth.useEmulator('http://localhost:9099');
  // db.useEmulator('localhost', '8080');
}

export { firebaseDb, db, auth, storage, provider };
