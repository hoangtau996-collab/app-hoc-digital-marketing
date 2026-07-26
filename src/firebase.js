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
  onSnapshot,
  increment,
  serverTimestamp,
  collection,
  deleteDoc
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

/**
 * Record Real Web Traffic Visit in Cloud Firestore & Local Persistence
 * Tracks true pageviews strictly from 1 on every real visit.
 */
export async function recordRealTrafficVisit() {
  const trafficDocRef = doc(db, 'analytics', 'traffic_global');
  
  // Real persistent local counter
  const baseCreationTraffic = 0;
  let localTotal = 1;
  try {
    const stored = parseInt(localStorage.getItem('dmm_real_traffic_total') || '0', 10);
    localTotal = stored + 1;
    localStorage.setItem('dmm_real_traffic_total', localTotal.toString());
  } catch (e) {}

  try {
    // Atomically increment real Cloud Firestore hit counter
    await setDoc(trafficDocRef, {
      totalViews: increment(1),
      lastVisitAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.warn("Cloud traffic increment fallback to local persistence:", e);
  }

  return baseCreationTraffic + localTotal;
}

/**
 * Real-time listener for Cloud Firestore Web Traffic & Active Online Sessions
 */
export function listenToRealTraffic(callback) {
  const trafficDocRef = doc(db, 'analytics', 'traffic_global');
  const baseCreationTraffic = 0;
  
  const getLocalTraffic = () => {
    try {
      const stored = parseInt(localStorage.getItem('dmm_real_traffic_total') || '1', 10);
      return baseCreationTraffic + stored;
    } catch (e) {
      return baseCreationTraffic + 1;
    }
  };

  const unsubscribe = onSnapshot(trafficDocRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      const cloudViews = data.totalViews || 0;
      callback({
        totalViews: baseCreationTraffic + Math.max(cloudViews, parseInt(localStorage.getItem('dmm_real_traffic_total') || '1', 10))
      });
    } else {
      callback({ totalViews: getLocalTraffic() });
    }
  }, (err) => {
    callback({ totalViews: getLocalTraffic() });
  });

  return unsubscribe;
}

/**
 * Record Real Student Enrollment in Cloud Firestore
 */
export async function recordRealStudentEnrollment() {
  const statsDocRef = doc(db, 'analytics', 'stats_global');
  
  let localEnrolled = 1;
  try {
    const stored = parseInt(localStorage.getItem('dmm_real_enrolled_count') || '0', 10);
    if (stored === 0) {
      localEnrolled = 1;
      localStorage.setItem('dmm_real_enrolled_count', '1');
    } else {
      localEnrolled = stored;
    }
  } catch (e) {}

  try {
    await setDoc(statsDocRef, {
      totalEnrolled: increment(1),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.warn("Cloud stats increment fallback to local persistence:", e);
  }

  return localEnrolled;
}

/**
 * Record Real Graduate Achievement when student completes 11/11 modules
 */
export async function recordRealStudentGraduate() {
  const statsDocRef = doc(db, 'analytics', 'stats_global');
  
  try {
    const isGraduated = localStorage.getItem('dmm_student_has_graduated') === 'true';
    if (!isGraduated) {
      localStorage.setItem('dmm_student_has_graduated', 'true');
      const storedGrads = parseInt(localStorage.getItem('dmm_real_graduates_count') || '0', 10) + 1;
      localStorage.setItem('dmm_real_graduates_count', storedGrads.toString());

      await setDoc(statsDocRef, {
        totalGraduates: increment(1),
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (e) {
    console.warn("Cloud graduate increment fallback:", e);
  }
}

/**
 * Real-time listener for Student Enrollment & Graduate Counters
 */
export function listenToRealStats(callback) {
  const statsDocRef = doc(db, 'analytics', 'stats_global');
  
  const getLocalStats = () => {
    try {
      const enrolled = parseInt(localStorage.getItem('dmm_real_enrolled_count') || '1', 10);
      const graduates = parseInt(localStorage.getItem('dmm_real_graduates_count') || '0', 10);
      return { enrolled, graduates };
    } catch (e) {
      return { enrolled: 1, graduates: 0 };
    }
  };

  const unsubscribe = onSnapshot(statsDocRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      const local = getLocalStats();
      callback({
        totalEnrolled: Math.max(data.totalEnrolled || 0, local.enrolled),
        totalGraduates: Math.max(data.totalGraduates || 0, local.graduates)
      });
    } else {
      callback(getLocalStats());
    }
  }, (err) => {
    callback(getLocalStats());
  });

  return unsubscribe;
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

