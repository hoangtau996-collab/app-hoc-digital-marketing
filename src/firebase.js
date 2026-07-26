import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot 
} from 'firebase/firestore';

// Default Firebase Configuration for P MARCOM Academy
// Support environment variables VITE_FIREBASE_* with fallback defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD-PMarcomAcademyKeyDemo2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pmarcom-academy.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pmarcom-academy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pmarcom-academy.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "889200000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:889200000000:web:pmarcom001"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Save student progress to Cloud Firestore
 */
export async function saveUserProgressToCloud(userId, progressData) {
  if (!userId) return;
  try {
    const userDocRef = doc(db, 'students', userId);
    await setDoc(userDocRef, {
      ...progressData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log("🟢 Progress synced to Firebase Cloud for user:", userId);
  } catch (e) {
    console.warn("Cloud sync saved locally (Offline or Auth fallback)", e);
  }
}

/**
 * Fetch student progress from Cloud Firestore
 */
export async function getUserProgressFromCloud(userId) {
  if (!userId) return null;
  try {
    const userDocRef = doc(db, 'students', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (e) {
    console.warn("Failed to fetch cloud progress, fallback to cache", e);
  }
  return null;
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  onSnapshot
};
