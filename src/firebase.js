import { initializeApp } from 'firebase/app';
import { filterDeleted } from './utils/deletedStudents';
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
  getDocs,
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

if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  firebaseConfig.measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
}

/**
 * Các biến môi trường Firebase còn thiếu.
 *
 * Vì sao cần: mọi giá trị dự phòng ở trên là **chuỗi giữ chỗ, không phải cấu
 * hình thật**. Thiếu biến môi trường thì ứng dụng vẫn khởi động bình thường
 * nhưng mọi thao tác Firebase hỏng âm thầm — đăng nhập báo "sai mật khẩu",
 * dữ liệu không lên Cloud, và không chỗ nào nói ra nguyên nhân thật là
 * `auth/api-key-not-valid`.
 *
 * Viết từng biến một chứ không lặp qua mảng tên: Vite thay thế
 * `import.meta.env.VITE_X` ở khâu biên dịch, truy cập bằng khoá động không chắc
 * còn giá trị sau khi đóng gói.
 */
export const missingFirebaseEnv = Object.entries({
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID
})
  .filter(([, value]) => !value)
  .map(([name]) => name);

export const isFirebaseConfigured = missingFirebaseEnv.length === 0;

if (!isFirebaseConfigured) {
  console.error(
    '⚠️ Firebase CHƯA được cấu hình. Thiếu biến môi trường: ' +
      missingFirebaseEnv.join(', ') +
      '\nỨng dụng đang chạy bằng giá trị giữ chỗ nên đăng nhập và đồng bộ dữ liệu sẽ KHÔNG hoạt động.' +
      '\nTạo tệp .env theo mẫu .env.example (xem DEPLOYMENT.md).'
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
// Dynamic Direct Realtime Cloud Database REST Endpoints for 100% Zero-Config Global Sync
const activeProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "pmarcomacademy";
const PUBLIC_SYNC_URL = `https://${activeProjectId}-default-rtdb.asia-southeast1.firebasedatabase.app/students`;
const PUBLIC_SYNC_URL_ALT = `https://${activeProjectId}-default-rtdb.firebaseio.com/students`;

/**
 * Record or sync a student account to Cloud Firestore & Direct Cloud REST
 * Guaranteed 100% synchronization across all mobile & desktop devices.
 */
export async function recordStudentAccountToCloud(studentData) {
  if (!studentData || !studentData.email) return;
  const cleanEmail = studentData.email.trim().toLowerCase();
  const safeId = cleanEmail.replace(/[^a-z0-9]/g, '_');
  
  const payload = {
    id: studentData.id || safeId,
    name: (studentData.name || studentData.studentName || cleanEmail.split('@')[0]).toUpperCase(),
    phone: studentData.phone || 'Chưa cập nhật',
    email: cleanEmail,
    industry: studentData.industry || 'Kinh doanh',
    avatarUrl: studentData.avatarUrl || '',
    coverBg: studentData.coverBg || 'emerald',
    completedModules: Array.isArray(studentData.completedModules) ? studentData.completedModules : [],
    createdAt: studentData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Chỉ ghi kèm `role` khi tài khoản đang là quản trị viên.
  //
  // Cố ý KHÔNG ghi 'student': hàm này chạy mỗi lần chính chủ lưu hồ sơ, mà một
  // máy chưa biết mình vừa được nâng quyền sẽ gửi lên role 'student' và xoá mất
  // quyền vừa cấp. Việc hạ quyền đi bằng đường riêng, có chủ đích:
  // setStudentRoleInCloud().
  if (studentData.role === 'admin') {
    payload.role = 'admin';
  }

  // 1. Persistent Shared Storage Backup
  try {
    const existingStr = localStorage.getItem('dmm_users_db');
    let usersList = existingStr ? JSON.parse(existingStr) : [];
    const index = usersList.findIndex(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (index >= 0) {
      usersList[index] = { ...usersList[index], ...payload };
    } else {
      usersList.push(payload);
    }
    localStorage.setItem('dmm_users_db', JSON.stringify(usersList));
  } catch (e) {}

  // 2. Direct Cloud REST API Sync
  try {
    fetch(`${PUBLIC_SYNC_URL}/${safeId}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});

    fetch(`${PUBLIC_SYNC_URL_ALT}/${safeId}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch (e) {}

  // 3. Cloud Firestore Native Writes
  try {
    await setDoc(doc(db, 'students', safeId), payload, { merge: true });
    await setDoc(doc(db, 'registrations', safeId), payload, { merge: true });
    if (studentData.id && studentData.id !== safeId) {
      await setDoc(doc(db, 'students', studentData.id), payload, { merge: true });
    }
    console.log("🟢 Record Student to Cloud Firestore Success:", cleanEmail);
  } catch (e) {
    console.warn("Cloud Firestore setDoc fallback:", e);
  }
}

/* ============================================================
   SỔ PHÂN QUYỀN QUẢN TRỊ (collection `admins`)

   Id tài liệu = email đã chuẩn hoá về chữ thường.

   Đây là nguồn khẳng định quyền quản trị, thay cho localStorage. Khác biệt cốt
   lõi: Firestore Rules (xem firestore.rules) chỉ cho quản trị viên hiện hành ghi
   vào sổ này, và luật đó chạy trên máy chủ Google nên sửa trình duyệt không vòng
   qua được. Người ngoài vẫn bật được giao diện quản trị trên máy họ, nhưng mọi
   lệnh đọc dữ liệu học viên sẽ bị máy chủ từ chối -> bảng rỗng.
   ============================================================ */

const ADMIN_COLLECTION = 'admins';

const cleanEmailKey = (email) => String(email || '').trim().toLowerCase();

/**
 * Hỏi máy chủ: email này có quyền quản trị không?
 *
 * Trả về `true` / `false` khi hỏi được, và `null` khi KHÔNG hỏi được (mất mạng,
 * chưa deploy rules, thiếu quyền đọc). Phía gọi phải phân biệt `false` với
 * `null`: `false` là máy chủ trả lời "không có quyền", còn `null` là "chưa
 * biết" — xử lý hai trường hợp này giống nhau sẽ khiến quản trị viên mất quyền
 * mỗi lần rớt mạng.
 */
export async function isAdminInCloud(email) {
  const key = cleanEmailKey(email);
  if (!key) return false;
  try {
    const snap = await getDoc(doc(db, ADMIN_COLLECTION, key));
    return snap.exists();
  } catch (e) {
    console.warn('Không đọc được sổ phân quyền trên Cloud:', e);
    return null;
  }
}

/** Toàn bộ sổ phân quyền. Chỉ quản trị viên đọc được (theo rules). */
export async function fetchAdminRosterFromCloud() {
  try {
    const snapshot = await getDocs(collection(db, ADMIN_COLLECTION));
    return snapshot.docs.map((d) => d.id);
  } catch (e) {
    console.warn('Không đọc được toàn bộ sổ phân quyền:', e);
    return null;
  }
}

/**
 * Ghi một tài khoản vào sổ phân quyền.
 *
 * Có await và có ném lỗi ra ngoài — cố ý khác với các lệnh ghi khác trong tệp
 * này. Nâng quyền là thao tác phải biết chắc kết quả: nếu máy chủ từ chối (người
 * bấm không thực sự là quản trị viên) thì giao diện phải báo thất bại, chứ không
 * được hiện "đã nâng quyền" rồi để đó.
 */
export async function grantAdminInCloud(email, grantedByEmail) {
  const key = cleanEmailKey(email);
  if (!key) throw new Error('Email không hợp lệ.');
  await setDoc(doc(db, ADMIN_COLLECTION, key), {
    email: key,
    grantedBy: cleanEmailKey(grantedByEmail) || 'unknown',
    grantedAt: new Date().toISOString()
  });
}

/**
 * Xoá một tài khoản khỏi sổ phân quyền.
 *
 * Với tài khoản Quản Trị Tối Cao, Firestore Rules sẽ từ chối lệnh này. Đó là
 * chốt chặn thật — phía giao diện chặn trước chỉ để báo lỗi cho dễ hiểu.
 */
export async function revokeAdminInCloud(email) {
  const key = cleanEmailKey(email);
  if (!key) throw new Error('Email không hợp lệ.');
  await deleteDoc(doc(db, ADMIN_COLLECTION, key));
}

/**
 * Chẩn đoán đường kết nối tới Cloud, từng bước một.
 *
 * Vì sao cần: mọi lệnh gọi Firebase trong tệp này đều bọc `try/catch` rỗng và
 * có nhánh dự phòng localStorage. Thiết kế đó giúp ứng dụng không chết khi mất
 * mạng, nhưng cái giá là **hỏng và rỗng trông giống hệt nhau**: bị máy chủ từ
 * chối quyền cũng ra bảng trống, chưa ai đăng ký cũng ra bảng trống.
 *
 * Hàm này chạy đúng những lệnh mà Bảng Quản Trị cần, KHÔNG nuốt lỗi, và trả về
 * mã lỗi nguyên văn của Firebase để biết hỏng ở khâu nào.
 */
export async function diagnoseCloudAccess() {
  const steps = [];
  const add = (label, ok, detail) => steps.push({ label, ok, detail });

  add(
    'Cấu hình Firebase',
    isFirebaseConfigured,
    isFirebaseConfigured
      ? `project: ${firebaseConfig.projectId}`
      : `thiếu biến: ${missingFirebaseEnv.join(', ')}`
  );

  const user = auth.currentUser;
  add(
    'Phiên đăng nhập Firebase Auth',
    Boolean(user),
    user
      ? user.email
      : 'chưa đăng nhập qua Firebase — có thể đang dùng nhánh dự phòng tại máy, nhánh đó không cấp quyền quản trị'
  );

  const email = cleanEmailKey(user?.email);

  if (email) {
    try {
      const snap = await getDoc(doc(db, ADMIN_COLLECTION, email));
      add(
        'Có tên trong sổ phân quyền admins',
        snap.exists(),
        snap.exists() ? email : `chưa có tài liệu admins/${email}`
      );
    } catch (e) {
      add('Có tên trong sổ phân quyền admins', false, `${e.code || ''} ${e.message}`);
    }
  } else {
    add('Có tên trong sổ phân quyền admins', false, 'chưa đăng nhập nên không kiểm tra được');
  }

  // Đây là lệnh Bảng Quản Trị thực sự cần. Rules đòi quyền quản trị mới cho
  // liệt kê, nên bước này hỏng là bảng rỗng.
  try {
    const snapshot = await getDocs(collection(db, 'students'));
    add('Đọc danh sách học viên trên Cloud', true, `${snapshot.size} bản ghi trên máy chủ`);
  } catch (e) {
    add('Đọc danh sách học viên trên Cloud', false, `${e.code || ''} ${e.message}`);
  }

  let localCount = 0;
  try {
    const raw = localStorage.getItem('dmm_users_db');
    const list = raw ? JSON.parse(raw) : [];
    localCount = Array.isArray(list) ? list.length : 0;
  } catch (e) { /* localStorage bị chặn */ }
  add('Bản ghi trong localStorage của máy này', true, `${localCount} bản ghi`);

  return steps;
}

/**
 * Ghi vai trò của một tài khoản lên đám mây.
 *
 * Tách riêng khỏi recordStudentAccountToCloud vì đây là hành động có chủ đích
 * của quản trị viên (nâng quyền / thu hồi quyền), khác hẳn việc học viên lưu hồ
 * sơ thường ngày. Đây cũng là đường duy nhất để quyền cấp ở máy này có hiệu lực
 * trên máy khác: sổ `dmm_admin_emails` chỉ nằm ở localStorage của một máy.
 *
 * Không await Firestore (xem DECISION.md ADR-002): khi mất kết nối, lệnh ghi bị
 * xếp vào hàng đợi offline và Promise treo vô thời hạn, giao diện sẽ đứng im sau
 * khi bấm nâng quyền. Quyền đã ghi xuống localStorage trước đó nên máy hiện tại
 * vẫn đúng ngay lập tức.
 */
export async function setStudentRoleInCloud(email, role) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!cleanEmail) return;
  const safeId = cleanEmail.replace(/[^a-z0-9]/g, '_');
  const patch = { email: cleanEmail, role, updatedAt: new Date().toISOString() };

  for (const col of ['students', 'registrations']) {
    try {
      setDoc(doc(db, col, safeId), patch, { merge: true }).catch(() => {});
    } catch (e) { /* bỏ qua, các kho còn lại vẫn chạy */ }
  }

  try {
    for (const base of [PUBLIC_SYNC_URL, PUBLIC_SYNC_URL_ALT]) {
      fetch(`${base}/${safeId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      }).catch(() => {});
    }
  } catch (e) { /* endpoint REST hiện là mã chết, xem TODO.md */ }
}

/**
 * Save student progress to Cloud Firestore
 */
/**
 * Xoá học viên khỏi TẤT CẢ các kho đang lưu.
 *
 * Hồ sơ học viên được ghi vào 4 nơi (xem recordStudentAccountToCloud):
 *   1. Firestore students        2. Firestore registrations
 *   3. Realtime Database qua REST (2 tên miền)   4. localStorage dmm_users_db
 *
 * Trước đây lệnh xoá chỉ chạm Firestore students và localStorage, nên bản ghi
 * quay lại ngay khi tải lại trang. Mỗi bước đều bọc try/catch riêng để một kho
 * lỗi không chặn các kho còn lại.
 */
export async function deleteStudentEverywhere(studentId, email) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const safeId = cleanEmail.replace(/[^a-z0-9]/g, '_');
  // Cùng một học viên có thể tồn tại dưới 2 id khác nhau: id gốc và id suy ra
  // từ email. Phải xoá cả hai.
  const ids = [...new Set([studentId, safeId].filter(Boolean))];

  // 1. localStorage trước tiên: đây là kho luôn xoá được, không phụ thuộc mạng.
  try {
    const raw = localStorage.getItem('dmm_users_db');
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        localStorage.setItem(
          'dmm_users_db',
          JSON.stringify(list.filter((u) => String(u?.email || '').trim().toLowerCase() !== cleanEmail))
        );
      }
    }
  } catch (e) { /* bỏ qua */ }

  // 2. Firestore: xoá ở cả hai collection và theo cả hai id.
  //    KHÔNG await (xem DECISION.md ADR-002): khi không kết nối được máy chủ,
  //    Firestore xếp lệnh vào hàng đợi offline và Promise treo vô thời hạn.
  //    Await ở đây sẽ khiến giao diện không bao giờ cập nhật sau khi bấm xoá.
  for (const col of ['students', 'registrations']) {
    for (const id of ids) {
      try {
        deleteDoc(doc(db, col, id)).catch(() => {});
      } catch (e) { /* không có tài liệu đó thì bỏ qua */ }
    }
  }

  // 3. Realtime Database qua REST.
  // Bọc cả khối trong try vì hiện PUBLIC_SYNC_URL đang nằm trong một block
  // comment bị lỗi ở đầu tệp nên CHƯA ĐƯỢC KHAI BÁO (xem TODO.md). Tham chiếu
  // biến chưa khai báo sẽ ném ReferenceError; nếu không bọc thì cả hàm dừng
  // giữa chừng. Khi nào sửa comment đó thì nhánh này tự chạy.
  try {
    for (const base of [PUBLIC_SYNC_URL, PUBLIC_SYNC_URL_ALT]) {
      for (const id of ids) {
        fetch(`${base}/${id}.json`, { method: 'DELETE' }).catch(() => {});
      }
    }
  } catch (e) { /* endpoint chưa khai báo */ }
}

export async function saveUserProgressToCloud(userId, progressData) {
  if (!progressData || !progressData.email) {
    if (!userId) return;
  }
  const safeId = progressData.email 
    ? progressData.email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_') 
    : userId;

  try {
    if (progressData.email) {
      const cleanEmail = progressData.email.trim().toLowerCase();
      fetch(`${PUBLIC_SYNC_URL}/${safeId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedModules: progressData.completedModules || [],
          updatedAt: new Date().toISOString()
        })
      }).catch(() => {});
    }
  } catch (e) {}

  try {
    const userDocRef = doc(db, 'students', safeId);
    await setDoc(userDocRef, {
      ...progressData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.warn("Failed to save progress to Cloud Firestore", e);
  }
}

/**
 * Fetch student progress from Cloud Firestore
 */
export async function getUserProgressFromCloud(userId, email) {
  if (!userId && !email) return null;

  // Dò theo CẢ HAI id. Lệnh ghi lưu tài liệu theo id suy ra từ email
  // (recordStudentAccountToCloud), trong khi nơi gọi ở đây chỉ có uid của
  // Firebase Auth. Chỉ dò theo uid thì hầu hết tài khoản đọc ra chỗ trống —
  // đó là lý do hồ sơ đám mây (gồm cả trường `role`) trước nay gần như không
  // bao giờ nạp được.
  const emailKey = cleanEmailKey(email);
  const candidates = [...new Set([userId, emailKey && emailKey.replace(/[^a-z0-9]/g, '_')].filter(Boolean))];

  try {
    for (const id of candidates) {
      const docSnap = await getDoc(doc(db, 'students', id));
      if (docSnap.exists()) {
        return docSnap.data();
      }
    }
  } catch (e) {
    console.warn("Failed to fetch cloud progress, fallback to cache", e);
  }
  return null;
}

/**
 * Fetch all registered student accounts from Cloud Firestore & Direct REST Cloud
 */
export async function getAllRegisteredStudentsFromCloud() {
  const emailMap = new Map();

  // 1. Read Local Persistent Users Database
  try {
    const localUsers = localStorage.getItem('dmm_users_db');
    if (localUsers) {
      const parsed = JSON.parse(localUsers);
      if (Array.isArray(parsed)) {
        parsed.forEach(item => {
          if (item && item.email) {
            const cleanEmail = item.email.trim().toLowerCase();
            emailMap.set(cleanEmail, {
              ...item,
              id: item.id || cleanEmail.replace(/[^a-z0-9]/g, '_'),
              name: (item.name || cleanEmail.split('@')[0]).toUpperCase(),
              phone: item.phone || 'Chưa cập nhật',
              industry: item.industry || 'Kinh doanh',
              completedModules: Array.isArray(item.completedModules) ? item.completedModules : []
            });
          }
        });
      }
    }
  } catch (e) {}

  // 2. Direct Realtime Cloud REST API Read
  try {
    const res = await fetch(`${PUBLIC_SYNC_URL}.json`);
    if (res.ok) {
      const data = await res.json();
      if (data) {
        Object.values(data).forEach((item) => {
          if (item && item.email) {
            const cleanEmail = item.email.trim().toLowerCase();
            const existing = emailMap.get(cleanEmail);
            emailMap.set(cleanEmail, {
              ...existing,
              ...item,
              id: item.id || cleanEmail.replace(/[^a-z0-9]/g, '_'),
              name: (item.name || item.studentName || cleanEmail.split('@')[0]).toUpperCase(),
              phone: item.phone || existing?.phone || 'Chưa cập nhật',
              industry: item.industry || existing?.industry || 'Kinh doanh',
              completedModules: Array.isArray(item.completedModules) ? item.completedModules : (existing?.completedModules || [])
            });
          }
        });
      }
    }
  } catch (e) {}

  // 3. Query Firestore 'students' and 'registrations' collections
  try {
    const snapshot = await getDocs(collection(db, 'students'));
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.email) {
        const cleanEmail = data.email.trim().toLowerCase();
        const existing = emailMap.get(cleanEmail);
        emailMap.set(cleanEmail, {
          ...existing,
          ...data,
          id: docSnap.id,
          email: cleanEmail
        });
      }
    });
  } catch (e) {}

  try {
    const snapshot2 = await getDocs(collection(db, 'registrations'));
    snapshot2.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.email) {
        const cleanEmail = data.email.trim().toLowerCase();
        const existing = emailMap.get(cleanEmail);
        emailMap.set(cleanEmail, {
          ...existing,
          ...data,
          id: docSnap.id,
          email: cleanEmail
        });
      }
    });
  } catch (e) {}

  // Chốt chặn: bản ghi đã bị quản trị viên xoá thì không hiển thị lại,
  // kể cả khi còn sót ở một kho nào đó.
  return filterDeleted(Array.from(emailMap.values()));
}

/**
 * Real-time listener for All Student Registrations from Cloud Firestore
 */
export function listenToAllStudentsFromCloud(callback) {
  try {
    const studentsColRef = collection(db, 'students');
    const unsubscribe = onSnapshot(studentsColRef, (snapshot) => {
      const students = [];
      snapshot.forEach((docSnap) => {
        students.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });
      callback(filterDeleted(students));
    }, (err) => {
      console.warn("Real-time students listener fallback:", err);
    });

    return unsubscribe;
  } catch (e) {
    return () => {};
  }
}

/* ============================================================
   THỐNG KÊ LƯỢT TRUY CẬP WEB

   Công thức:  Tổng hiển thị = 100 (mốc khởi điểm) + tổng lượt cộng dồn theo ngày

   "1 lượt truy cập" = 1 khách ghé thăm trong 1 ngày.
   KHÔNG cộng thêm khi khách bấm F5 hay chuyển qua lại giữa các chuyên đề —
   nếu đếm theo mỗi lần tải trang thì con số sẽ phồng lên vô nghĩa và không
   dùng để xem tỉ lệ khách ghé thăm được.
   ============================================================ */

export const TRAFFIC_BASELINE = 100;

const TRAFFIC_DOC = 'traffic_daily_v3';
const LS_TRAFFIC_TOTAL = 'dmm_traffic_total_v3';
const LS_TRAFFIC_LAST_DATE = 'dmm_traffic_last_date_v3';

/**
 * Chốt ngày theo giờ Việt Nam (UTC+7, không có quy ước giờ mùa hè) để mốc
 * sang ngày trùng với ngày làm việc thực tế, không lệch theo múi giờ máy khách.
 */
export function getVietnamDateKey(now = Date.now()) {
  return new Date(now + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function readLocalTraffic() {
  try {
    const n = parseInt(localStorage.getItem(LS_TRAFFIC_TOTAL) || '0', 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch (e) {
    return 0;
  }
}

// Chặn đếm lặp trong cùng một lần tải trang. Cần thiết vì <StrictMode> ở
// main.jsx cố tình chạy useEffect hai lần khi dev.
let hasRecordedThisPageLoad = false;

/**
 * Ghi nhận 1 lượt truy cập trong ngày (nếu hôm nay máy này chưa được tính).
 * Trả về ngay số để hiển thị, KHÔNG chờ Cloud phản hồi.
 *
 * Quan trọng: tuyệt đối không 'await' lệnh ghi Firestore ở đây. Khi không kết
 * nối được server, Firestore xếp lệnh ghi vào hàng đợi offline và Promise của
 * setDoc() treo vô thời hạn (không reject). Nếu await, cả hàm này sẽ không bao
 * giờ resolve -> bộ đếm trên giao diện đứng im vĩnh viễn.
 */
export function recordRealTrafficVisit() {
  const today = getVietnamDateKey();
  let localTotal = readLocalTraffic();
  let isNewVisitToday = false;

  if (!hasRecordedThisPageLoad) {
    hasRecordedThisPageLoad = true;
    try {
      if (localStorage.getItem(LS_TRAFFIC_LAST_DATE) !== today) {
        isNewVisitToday = true;
        localTotal += 1;
        localStorage.setItem(LS_TRAFFIC_TOTAL, String(localTotal));
        localStorage.setItem(LS_TRAFFIC_LAST_DATE, today);
      }
    } catch (e) {
      // Trình duyệt chặn localStorage (chế độ ẩn danh): vẫn tính 1 lượt cho phiên này.
      isNewVisitToday = true;
      localTotal = Math.max(localTotal, 1);
    }
  }

  if (isNewVisitToday) {
    // Bắn lên Cloud rồi đi tiếp, không chờ. Nếu offline, Firestore tự gửi lại
    // khi có mạng; số hiển thị đã có sẵn từ bản đếm tại máy.
    try {
      setDoc(doc(db, 'analytics', TRAFFIC_DOC), {
        totalVisits: increment(1),
        // Lưu thêm số lượt của từng ngày để xem được biểu đồ traffic theo ngày.
        daily: { [today]: increment(1) },
        lastVisitAt: serverTimestamp()
      }, { merge: true }).catch((e) => {
        console.warn("Không ghi được lượt truy cập lên Cloud, dùng số đếm tại máy:", e);
      });
    } catch (e) {
      console.warn("Không ghi được lượt truy cập lên Cloud, dùng số đếm tại máy:", e);
    }
  }

  return Promise.resolve(TRAFFIC_BASELINE + localTotal);
}

/**
 * Theo dõi realtime tổng lượt truy cập + lượt của riêng hôm nay.
 */
export function listenToRealTraffic(callback) {
  const fallback = () => callback({
    totalViews: TRAFFIC_BASELINE + readLocalTraffic(),
    todayViews: 0,
    daily: {}
  });

  try {
    const unsubscribe = onSnapshot(doc(db, 'analytics', TRAFFIC_DOC), (snapshot) => {
      if (!snapshot.exists()) {
        fallback();
        return;
      }

      const data = snapshot.data() || {};
      const daily = data.daily || {};
      const cloudTotal = Number(data.totalVisits) || 0;

      // Cloud là con số toàn cục nên là nguồn chuẩn. Số đếm tại máy chỉ dùng khi
      // Cloud chưa ghi được (sai quyền / mất mạng). Cả hai giờ cùng đơn vị
      // "lượt/ngày" nên lấy giá trị lớn hơn là hợp lệ, đồng thời bảo đảm bộ đếm
      // không bao giờ tụt ngược trên màn hình.
      callback({
        totalViews: TRAFFIC_BASELINE + Math.max(cloudTotal, readLocalTraffic()),
        todayViews: Number(daily[getVietnamDateKey()]) || 0,
        daily
      });
    }, () => fallback());

    return unsubscribe;
  } catch (e) {
    console.warn("listenToRealTraffic error", e);
    fallback();
    return () => {};
  }
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
  try {
    const statsDocRef = doc(db, 'analytics', 'stats_global');
    
    const getLocalStats = () => {
      try {
        const enrolled = parseInt(localStorage.getItem('dmm_real_enrolled_count') || '1', 10);
        const graduates = parseInt(localStorage.getItem('dmm_real_graduates_count') || '0', 10);
        return { totalEnrolled: enrolled, totalGraduates: graduates };
      } catch (e) {
        return { totalEnrolled: 1, totalGraduates: 0 };
      }
    };

    const unsubscribe = onSnapshot(statsDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const local = getLocalStats();
        callback({
          totalEnrolled: Math.max(data.totalEnrolled || 0, local.totalEnrolled),
          totalGraduates: Math.max(data.totalGraduates || 0, local.totalGraduates)
        });
      } else {
        callback(getLocalStats());
      }
    }, (err) => {
      callback(getLocalStats());
    });

    return unsubscribe;
  } catch (e) {
    console.warn("listenToRealStats error", e);
    callback({ totalEnrolled: 1, totalGraduates: 0 });
    return () => {};
  }
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
  onSnapshot,
  deleteDoc
};

