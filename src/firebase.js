import { initializeApp } from 'firebase/app';
import { filterDeleted } from './utils/deletedStudents';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
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
  deleteDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  where
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

/* ============================================================
   ĐĂNG NHẬP BẰNG TÀI KHOẢN GOOGLE (Gmail)

   Chỉ xin đúng hai thông tin cơ bản Google cho sẵn: email và tên hiển thị.
   KHÔNG thêm scope nào khác — app xin scope nhạy cảm (đọc Gmail, Drive...) sẽ bị
   Google bắt đi qua quy trình xét duyệt, và trước khi duyệt xong thì số người
   đăng nhập được bị giới hạn cứng.

   Google KHÔNG trả về SỐ ĐIỆN THOẠI và NGÀNH NGHỀ — hai trường bắt buộc của hồ
   sơ học viên. Vì vậy sau lần đăng nhập Google đầu tiên, ứng dụng chặn lại ở
   bước "Hoàn tất hồ sơ" (CompleteProfileModal, mở bởi chốt chặn trong App.jsx).
   Bỏ bước đó thì Bảng Quản Trị đầy học viên không có số liên lạc.
   ============================================================ */

/**
 * Trình duyệt nhúng bên trong ứng dụng khác (Zalo, Facebook, Instagram, TikTok).
 *
 * Cần biết vì hai lẽ, và cả hai đều không sửa được bằng mã nguồn:
 *   1. Cửa sổ popup gần như luôn bị chặn trong webview nhúng.
 *   2. Bản thân Google TỪ CHỐI đăng nhập từ webview nhúng, báo "This browser or
 *      app may not be secure" — kể cả khi đã chuyển sang phương án chuyển trang.
 *
 * Việc duy nhất chữa được là mở link bằng trình duyệt thật. Giao diện phải nói
 * thẳng điều đó ra, thay vì để học viên bấm đi bấm lại một nút không bao giờ chạy.
 */
export function isInAppBrowser() {
  const ua = String(typeof navigator !== 'undefined' ? navigator.userAgent : '');
  return /FBAN|FBAV|FB_IAB|Instagram|Zalo|TikTok|MicroMessenger|Line\//i.test(ua);
}

function buildGoogleProvider() {
  const provider = new GoogleAuthProvider();
  // `select_account` để Google luôn hỏi chọn tài khoản.
  //
  // Không có tham số này thì Google tự đăng nhập bằng tài khoản đang mở sẵn trên
  // trình duyệt. Trên máy dùng chung — đúng bối cảnh của nhiều học viên — người
  // thứ hai bấm đăng nhập sẽ vào thẳng tài khoản của người thứ nhất mà không hề
  // thấy màn hình chọn, rồi học và nhận bằng dưới tên người khác.
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
}

/**
 * Đăng nhập bằng tài khoản Google.
 *
 * Trả về một trong ba dạng:
 *   { ok: true, user }      -> xong, đã có phiên đăng nhập
 *   { ok: false, pending }  -> đang chuyển sang trang Google, trang này sắp bị
 *                              rời khỏi; nơi gọi KHÔNG được báo lỗi
 *   { ok: false, code }     -> hỏng thật, có mã lỗi để diễn giải
 *
 * Ưu tiên popup, chỉ lùi về chuyển trang khi popup không mở được. Cố ý theo thứ
 * tự này: `authDomain` (hr-project-b982a.firebaseapp.com) khác tên miền chạy app
 * (academy.pmarcom.com), nên phương án chuyển trang phải mượn bộ nhớ của bên thứ
 * ba — thứ mà Safari và Chrome ẩn danh chặn thẳng. Ở những trình duyệt đó,
 * chuyển trang đi rồi quay về sẽ mất phiên đăng nhập, còn popup thì vẫn chạy.
 *
 * `auth/popup-closed-by-user` KHÔNG lùi về chuyển trang: người dùng chủ động đóng
 * cửa sổ, đá họ sang trang Google là làm ngược ý.
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, buildGoogleProvider());
    return { ok: true, user: result.user };
  } catch (e) {
    const code = String(e?.code || '');
    const popupUnavailable =
      code.startsWith('auth/popup-blocked') ||
      code.startsWith('auth/operation-not-supported-in-this-environment');

    if (popupUnavailable) {
      try {
        await signInWithRedirect(auth, buildGoogleProvider());
        return { ok: false, pending: true };
      } catch (e2) {
        console.warn('Không mở được cả popup lẫn trang đăng nhập Google:', e2);
        return { ok: false, code: String(e2?.code || ''), error: e2 };
      }
    }

    return { ok: false, code, error: e };
  }
}

/**
 * Nhận kết quả của lần đăng nhập bằng cách chuyển trang, gọi một lần lúc app khởi động.
 *
 * Cần thiết dù `onAuthStateChanged` vốn đã tự chạy khi đăng nhập thành công: đây
 * là chỗ DUY NHẤT lấy được LỖI của lần chuyển trang đó. Không gọi thì khi Google
 * từ chối, học viên quay về đúng màn hình cũ, không có phiên đăng nhập và không
 * một dòng giải thích nào — nhìn y hệt như bấm nhầm nút.
 */
/* ============================================================
   ĐỔI MẬT KHẨU

   Đi bằng thư đặt lại mật khẩu, KHÔNG đổi thẳng trong ứng dụng.

   Firebase có hàm updatePassword() đổi thẳng, nhưng nó đòi phiên đăng nhập còn
   "mới" — đăng nhập từ sáng, chiều mới đổi là bị từ chối bằng
   `auth/requires-recent-login`, và cách chữa là bắt học viên nhập lại mật khẩu
   cũ ngay giữa chừng. Với người không nhớ nổi mật khẩu cũ — tức đúng nhóm cần
   đổi mật khẩu nhất — đường đó tắc.

   Thư đặt lại thì không có trạng thái nào để hỏng: bấm một nút, mở hộp thư, đặt
   mật khẩu mới. Chạy được cả khi học viên đã quên sạch mật khẩu cũ.

   Nội dung và tên người gửi của thư sửa ở Firebase Console → Authentication →
   Templates. Mặc định thư đến từ `noreply@hr-project-b982a.firebaseapp.com`,
   nhìn không giống thư của học viện — nên sửa lại.
   ============================================================ */

/**
 * Tài khoản đang đăng nhập vào bằng những cách nào.
 *
 * Cần biết vì giao diện đổi mật khẩu chỉ có nghĩa với tài khoản CÓ mật khẩu.
 * Học viên đăng nhập bằng Google không hề có mật khẩu nào ở hệ thống này —
 * đưa cho họ ô đổi mật khẩu là mời họ đi làm một việc không tồn tại, rồi tự
 * hỏi vì sao không được.
 */
export function getSignInMethods() {
  const providers = Array.isArray(auth.currentUser?.providerData)
    ? auth.currentUser.providerData
    : [];
  return {
    isSignedIn: Boolean(auth.currentUser),
    hasPassword: providers.some((p) => p?.providerId === 'password'),
    hasGoogle: providers.some((p) => p?.providerId === 'google.com')
  };
}

/* Hàm gửi thư đặt lại mật khẩu bằng `sendPasswordResetEmail` của Firebase ĐÃ
   BỊ GỠ KHỎI TỆP NÀY — cố ý, và đừng thêm lại.

   Nó gửi lá thư do Firebase soạn: tiếng Anh, người gửi
   `noreply@hr-project-b982a.firebaseapp.com`, link cũng mang tên miền đó. Học
   viên vừa học ở academy.pmarcom.com nhận được lá thư như vậy sẽ nghĩ là lừa
   đảo — và họ suy luận đúng theo mọi hướng dẫn an toàn thông tin.

   Đường duy nhất còn lại: `src/utils/requestPasswordReset.js`, gọi hàm máy chủ
   `/api/forgot-password`. Ở đó ta chỉ mượn Firebase phần sinh mã, còn người
   gửi, nội dung và tên miền của link đều do Học Viện quyết.

   Bài học đắt: hai đường từng cùng tồn tại, nút ở màn hình đăng nhập dùng đường
   mới còn nút trong Hồ Sơ vẫn lặng lẽ dùng đường cũ. Không ai phát hiện cho tới
   khi có người nhận được lá thư xấu và hỏi lại. */

export async function consumeGoogleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    return { ok: true, user: result?.user || null };
  } catch (e) {
    console.warn('Đăng nhập Google (chuyển trang) thất bại:', e);
    return { ok: false, code: String(e?.code || ''), error: e };
  }
}

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
  //
  // Trả về kết quả thay vì nuốt lỗi. Nơi gọi ở màn đăng ký PHẢI biết hồ sơ có
  // lên được máy chủ không: trước đây ghi hỏng vẫn báo "Đăng ký thành công",
  // học viên yên tâm bỏ đi còn hồ sơ chỉ nằm ở localStorage máy họ — quản trị
  // viên không bao giờ thấy, và không ai biết là đã mất.
  try {
    await setDoc(doc(db, 'students', safeId), payload, { merge: true });
    await setDoc(doc(db, 'registrations', safeId), payload, { merge: true });
    if (studentData.id && studentData.id !== safeId) {
      await setDoc(doc(db, 'students', studentData.id), payload, { merge: true });
    }
    console.log("🟢 Đã ghi hồ sơ học viên lên Firestore:", cleanEmail);
    return { ok: true };
  } catch (e) {
    console.warn("Không ghi được hồ sơ học viên lên Firestore:", e);
    return { ok: false, code: e?.code || '', message: e?.message || String(e) };
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
 * Ghi bản khảo sát đầu vào của học viên lên Firestore.
 *
 * Cất TRONG hồ sơ học viên (`students` + `registrations`) chứ không mở
 * collection riêng. Ba cái lợi, đều thật:
 *   1. Không cần thêm luật nào — `canUpdateProfile()` đã cho học viên sửa hồ sơ
 *      của chính mình, miễn không đụng vào `role`.
 *   2. Bảng Quản Trị và tệp xuất đọc được ngay, vì chúng vốn đã đọc collection
 *      `students`. Tách ra là phải ghép hai nguồn theo email — thêm một chỗ để
 *      lệch nhau.
 *   3. Xoá học viên là mất luôn khảo sát của họ, không sót lại bản ghi mồ côi.
 *
 * `email` gửi kèm trong patch và lấy từ ID TOKEN, không lấy từ tham số: rules
 * đối chiếu `request.resource.data.email` với email trong token, nên hồ sơ mang
 * email cũ (máy dùng chung) sẽ bị từ chối. Cùng lý do với sendSupportMessage().
 *
 * KHÔNG await Firestore (xem DECISION.md ADR-002): mất kết nối thì lệnh ghi bị
 * xếp vào hàng đợi offline và Promise treo vô thời hạn. Bản tại máy đã ghi xong
 * trước đó nên học viên không bị hỏi lại, và màn hình không đứng sau khi bấm.
 */
export async function saveSurveyToCloud(email, survey) {
  const cleanEmail = cleanEmailKey(auth.currentUser?.email || email);
  if (!cleanEmail || !survey) return { ok: false, message: 'Thiếu email hoặc dữ liệu khảo sát.' };

  const safeId = cleanEmail.replace(/[^a-z0-9]/g, '_');
  const patch = {
    email: cleanEmail,
    survey: {
      answers: survey.answers || {},
      // KHÔNG tự điền mốc thời gian khi nơi gọi để trống. Bản trả lời dở dang
      // cũng đi qua hàm này, mà `completedAt` chính là dấu hiệu phân biệt "đã
      // xong" với "đang dở" ở cả `hasCompletedSurvey()` lẫn Bảng Quản Trị —
      // điền bừa vào là bản dở dang bỗng được tính như đã hoàn tất.
      completedAt: survey.completedAt || '',
      skips: Number.isFinite(survey.skips) ? survey.skips : 0,
      version: Number.isFinite(survey.version) ? survey.version : 0
    },
    updatedAt: new Date().toISOString()
  };

  for (const col of ['students', 'registrations']) {
    try {
      setDoc(doc(db, col, safeId), patch, { merge: true }).catch((e) => {
        console.warn(`Không ghi được khảo sát vào ${col}:`, e);
      });
    } catch (e) { /* kho này hỏng thì kho còn lại vẫn chạy */ }
  }

  return { ok: true };
}

/* ============================================================
   HỘP THƯ HỖ TRỢ (collection `support_messages`)

   Học viên gửi lời nhắn từ khung chat Pipi; quản trị viên đọc và xử lý trong
   Hộp Thư Hỗ Trợ. Id tài liệu do Firestore tự sinh — cố ý không đặt theo email:
   một học viên gửi được nhiều lời nhắn, đặt id theo email thì lần sau ghi đè
   mất lần trước.

   RANH GIỚI THẬT NẰM Ở `firestore.rules`:
     - Phải đăng nhập mới gửi được, và trường `email` bắt buộc khớp email trong
       ID token. Không có điều kiện đó thì bất kỳ ai cũng gửi được lời nhắn mạo
       danh học viên khác, hoặc bơm rác vào hộp thư từ một vòng lặp.
     - Chỉ quản trị viên liệt kê được cả hộp thư. Học viên chỉ đọc lại được lời
       nhắn của chính mình.
     - Độ dài `message` bị chặn ngay trong rules chứ không chỉ ở giao diện: giới
       hạn ở ô nhập chỉ là phép lịch sự, người gửi thẳng lệnh ghi thì không đi
       qua ô đó.
   ============================================================ */

const SUPPORT_COLLECTION = 'support_messages';

/** Trần độ dài lời nhắn. Phải khớp con số trong firestore.rules. */
export const SUPPORT_MESSAGE_MAX = 2000;

/** Khoảng nghỉ tối thiểu giữa hai lần gửi, tính bằng mili-giây. */
const SUPPORT_COOLDOWN_MS = 20000;
const LS_SUPPORT_LAST_SENT = 'dmm_support_last_sent';

/**
 * Gửi một lời nhắn hỗ trợ.
 *
 * Trả về `{ ok, message }` để nơi gọi hiển thị nguyên văn lý do khi bị từ chối,
 * thay vì nuốt lỗi rồi báo "đã gửi" — học viên tưởng đã kêu được cứu còn Ban
 * Quản Trị không bao giờ thấy.
 *
 * Khoảng nghỉ giữa hai lần gửi chặn ở phía máy khách, và chỉ ở phía máy khách:
 * nó ngăn người dùng thật bấm nhầm hai lần, KHÔNG ngăn được người cố tình bơm
 * rác. Chặn thật cần luật theo nhịp ở máy chủ, thứ Firestore Rules không làm
 * được nếu không dựng thêm hạ tầng — xem TODO.md.
 */
export async function sendSupportMessage({ name, email, phone, message }) {
  const body = String(message || '').trim();

  if (!auth.currentUser) {
    return { ok: false, message: 'Bạn cần đăng nhập tài khoản học viên thì Ban Quản Trị mới biết ai đang cần hỗ trợ.' };
  }

  // Email lấy từ PHIÊN ĐĂNG NHẬP, không lấy từ hồ sơ nơi gọi truyền vào.
  //
  // Rules đối chiếu `request.resource.data.email` với email trong ID token
  // (`request.auth.token.email`). Hồ sơ trong state của ứng dụng lại ghép từ
  // localStorage và Firestore, nên nó có thể mang email cũ của người dùng
  // trước trên máy dùng chung — lệch một ký tự là máy chủ từ chối, và thông báo
  // hiện ra sẽ đổ lỗi cho quyền truy cập trong khi nguyên nhân thật là hai
  // email không khớp nhau. Lấy thẳng từ token thì cả lớp lỗi đó biến mất.
  const cleanEmail = cleanEmailKey(auth.currentUser.email || email);
  if (!cleanEmail) {
    return { ok: false, message: 'Tài khoản không có email hợp lệ nên không gửi được lời nhắn.' };
  }
  if (!body) {
    return { ok: false, message: 'Bạn chưa nhập nội dung cần hỗ trợ.' };
  }
  if (body.length > SUPPORT_MESSAGE_MAX) {
    return { ok: false, message: `Lời nhắn tối đa ${SUPPORT_MESSAGE_MAX} ký tự. Bạn rút gọn giúp mình nhé.` };
  }

  try {
    const last = Number(localStorage.getItem(LS_SUPPORT_LAST_SENT) || 0);
    const waited = Date.now() - last;
    if (Number.isFinite(last) && last > 0 && waited < SUPPORT_COOLDOWN_MS) {
      const left = Math.ceil((SUPPORT_COOLDOWN_MS - waited) / 1000);
      return { ok: false, message: `Bạn vừa gửi một lời nhắn rồi. Chờ ${left} giây nữa nhé.` };
    }
  } catch (e) { /* localStorage bị chặn thì bỏ qua khoảng nghỉ */ }

  const payload = {
    name: String(name || '').trim().slice(0, 120) || cleanEmail.split('@')[0].toUpperCase(),
    email: cleanEmail,
    phone: String(phone || '').trim().slice(0, 40),
    message: body,
    status: 'new',
    createdAt: new Date().toISOString(),
    createdAtServer: serverTimestamp()
  };

  try {
    const ref = await addDoc(collection(db, SUPPORT_COLLECTION), payload);
    try {
      localStorage.setItem(LS_SUPPORT_LAST_SENT, String(Date.now()));
    } catch (e) { /* hết chỗ lưu thì thôi */ }
    return { ok: true, id: ref.id, message: 'Đã gửi lời nhắn tới Ban Quản Trị.' };
  } catch (e) {
    // `permission-denied` ở ĐÂY gần như luôn có một nguyên nhân: collection
    // `support_messages` chưa có luật trên máy chủ, nên rơi vào nhánh từ chối
    // mặc định ở cuối firestore.rules. Người dùng đã đăng nhập rồi (kiểm tra ở
    // đầu hàm) và email đã lấy thẳng từ token, nên hai khả năng còn lại đều đã
    // bị loại trừ trước khi tới đây.
    //
    // Vì vậy KHÔNG bảo họ "đăng nhập lại": đăng nhập lại không sửa được luật
    // trên máy chủ, chỉ khiến người dùng thử đi thử lại một việc vô ích rồi bỏ
    // cuộc mà không ai biết hệ thống đang hỏng. Nói đúng việc cần làm, và ghi
    // nguyên nhân kỹ thuật ra console cho người quản trị.
    if (e?.code === 'permission-denied') {
      console.error(
        'Firestore từ chối ghi vào `support_messages`.\n' +
          'Nguyên nhân gần như chắc chắn: firestore.rules trên máy chủ chưa có khối ' +
          '`match /support_messages/{msgId}`, nên lệnh ghi rơi vào nhánh từ chối mặc định.\n' +
          'Cách sửa: Firebase Console -> Firestore Database -> Rules -> dán đè toàn bộ ' +
          'nội dung firestore.rules trong kho mã -> Publish. Xem DEPLOYMENT.md.',
        e
      );
      return {
        ok: false,
        code: 'permission-denied',
        message:
          'Hệ thống chưa mở kênh hỗ trợ nên máy chủ chưa nhận lời nhắn. ' +
          'Đây là lỗi cài đặt của hệ thống, KHÔNG phải do tài khoản của bạn — ' +
          'đăng nhập lại cũng không hết. Vui lòng báo Ban Quản Trị kèm mã lỗi: permission-denied.'
      };
    }

    console.warn('Không gửi được lời nhắn hỗ trợ:', e);
    return {
      ok: false,
      code: e?.code || '',
      message: `Không gửi được lời nhắn (${e?.code || 'lỗi không rõ'}). Kiểm tra đường truyền rồi thử lại.`
    };
  }
}

/**
 * Theo dõi hộp thư theo thời gian thực. Chỉ quản trị viên đọc được (theo rules).
 *
 * Gọi lại với `null` khi KHÔNG đọc được, khác hẳn `[]` là đọc được và hộp thư
 * đang rỗng. Nơi gọi bắt buộc phân biệt hai trường hợp — gộp lại thì lúc mất
 * quyền hay rớt mạng, giao diện sẽ báo "không có lời nhắn nào" trong khi thực
 * tế có học viên đang chờ trả lời.
 *
 * Giới hạn 300 bản ghi mới nhất: hộp thư chỉ để xử lý việc đang tồn, không phải
 * kho lưu trữ. Sắp theo `createdAt` dạng chuỗi ISO nên so sánh chữ cũng ra đúng
 * thứ tự thời gian, và một trường thì Firestore tự lo chỉ mục.
 */
export function listenToSupportMessages(callback) {
  try {
    const q = query(
      collection(db, SUPPORT_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(300)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => {
        console.warn('Không đọc được hộp thư hỗ trợ:', err);
        callback(null);
      }
    );
  } catch (e) {
    console.warn('Không mở được kênh theo dõi hộp thư hỗ trợ:', e);
    callback(null);
    return () => {};
  }
}

/**
 * Đổi trạng thái một lời nhắn: 'new' -> 'read' -> 'done'.
 *
 * Có await và có trả kết quả: quản trị viên bấm "đã xử lý" mà máy chủ từ chối
 * thì phải biết ngay, nếu không lời nhắn sẽ bật lại thành chưa đọc ở lần tải
 * sau và không ai hiểu vì sao.
 */
export async function setSupportMessageStatus(id, status, handledByEmail) {
  if (!id || !['new', 'read', 'done'].includes(status)) {
    return { ok: false, message: 'Trạng thái không hợp lệ.' };
  }
  try {
    await updateDoc(doc(db, SUPPORT_COLLECTION, id), {
      status,
      handledBy: cleanEmailKey(handledByEmail) || 'unknown',
      handledAt: new Date().toISOString()
    });
    return { ok: true };
  } catch (e) {
    console.warn('Không đổi được trạng thái lời nhắn:', e);
    return { ok: false, code: e?.code || '', message: e?.message || String(e) };
  }
}

/* ---------- Trao đổi qua lại trong một cuộc hỗ trợ ---------- */

/**
 * Theo dõi các cuộc trao đổi CỦA CHÍNH học viên đang đăng nhập.
 *
 * Bắt buộc lọc `where('email','==',...)`. Không phải để cho gọn: Firestore chỉ
 * chấp nhận lệnh liệt kê khi bản thân truy vấn bảo đảm mọi tài liệu trả về đều
 * thoả luật (xem firestore.rules). Bỏ vế lọc là máy chủ từ chối cả lệnh, chứ
 * không phải trả về ít hơn.
 *
 * Không dùng `orderBy` ở đây, cố ý: ghép `where` với `orderBy` trên hai trường
 * khác nhau đòi một chỉ mục ghép mà Firestore không tự tạo — lệnh sẽ hỏng bằng
 * `failed-precondition` kèm một đường link phải bấm vào Console. Số cuộc trao
 * đổi của một học viên đếm trên đầu ngón tay nên sắp xếp tại máy là đủ.
 */
export function listenToMySupportThreads(email, callback) {
  const key = cleanEmailKey(email);
  if (!key) {
    callback([]);
    return () => {};
  }
  try {
    const q = query(collection(db, SUPPORT_COLLECTION), where('email', '==', key), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const rows = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        rows.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
        callback(rows);
      },
      (err) => {
        console.warn('Không đọc được cuộc trao đổi của học viên:', err);
        callback(null);
      }
    );
  } catch (e) {
    console.warn('Không mở được kênh theo dõi cuộc trao đổi:', e);
    callback(null);
    return () => {};
  }
}

/**
 * Theo dõi các lượt trả lời của một cuộc trao đổi, cũ trước mới sau.
 *
 * BẮT BUỘC truyền `threadEmail` — email của người mở cuộc trao đổi, KHÔNG phải
 * email người đang xem. Đây là chỗ đã từng hỏng, và hỏng theo kiểu chỉ học viên
 * gặp còn quản trị viên thì không:
 *
 * Luật đọc là `isAdmin() || resource.data.threadEmail == myEmail()`. Với truy
 * vấn liệt kê, Firestore không lọc bớt tài liệu rồi trả về phần được phép — nó
 * xét xem BẢN THÂN TRUY VẤN có bảo đảm mọi tài liệu trả về đều thoả luật không,
 * và từ chối cả lệnh nếu không. Truy vấn cũ không có vế lọc nào, nên với học
 * viên nó không bảo đảm được gì -> permission-denied; còn quản trị viên vẫn qua
 * vì vế `isAdmin()` đúng vô điều kiện, không phụ thuộc truy vấn.
 *
 * Lọc theo email CHỦ cuộc trao đổi thì một dạng truy vấn dùng được cho cả hai:
 * với học viên, `threadEmail` chính là email của họ nên khớp luật; với quản trị
 * viên, vế `isAdmin()` cho qua bất kể lọc gì.
 *
 * Không dùng `orderBy`, cùng lý do với listenToMySupportThreads(): ghép `where`
 * với `orderBy` trên hai trường khác nhau đòi một chỉ mục ghép mà Firestore
 * không tự tạo. Sắp xếp tại máy vì một cuộc trao đổi chỉ có vài lượt.
 */
export function listenToSupportReplies(threadId, threadEmail, callback) {
  const key = cleanEmailKey(threadEmail);
  if (!threadId || !key) {
    callback([]);
    return () => {};
  }
  try {
    const q = query(
      collection(db, SUPPORT_COLLECTION, threadId, 'replies'),
      where('threadEmail', '==', key),
      limit(200)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const rows = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        rows.sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
        callback(rows);
      },
      (err) => {
        console.warn('Không đọc được các lượt trả lời:', err);
        callback(null);
      }
    );
  } catch (e) {
    console.warn('Không mở được kênh theo dõi lượt trả lời:', e);
    callback(null);
    return () => {};
  }
}

/**
 * Gửi một lượt trả lời vào cuộc trao đổi.
 *
 * `from` do NƠI GỌI truyền vào, nhưng máy chủ mới là bên quyết định: rules chỉ
 * chấp nhận `from: 'admin'` khi người gửi thật sự có tên trong sổ quản trị. Nói
 * cách khác, tham số này khai báo ý định chứ không cấp danh nghĩa.
 *
 * Cập nhật luôn tài liệu cha để hai bên biết có gì mới:
 *   - quản trị viên trả lời -> `studentUnread = true`, và `status` chuyển sang
 *     'read' vì rõ ràng là đã đọc rồi mới trả lời được;
 *   - học viên trả lời      -> `status = 'new'` để nổi lại trong bộ đếm chưa
 *     đọc, và `studentUnread = false`.
 */
export async function sendSupportReply(threadId, { from, text, threadEmail, authorName }) {
  const body = String(text || '').trim();
  if (!threadId) return { ok: false, message: 'Thiếu mã cuộc trao đổi.' };
  if (!auth.currentUser) {
    return { ok: false, message: 'Phiên đăng nhập đã hết hạn. Đăng nhập lại rồi gửi tiếp nhé.' };
  }
  if (!body) return { ok: false, message: 'Bạn chưa nhập nội dung.' };
  if (body.length > SUPPORT_MESSAGE_MAX) {
    return { ok: false, message: `Nội dung tối đa ${SUPPORT_MESSAGE_MAX} ký tự.` };
  }

  const isFromAdmin = from === 'admin';
  const now = new Date().toISOString();

  try {
    await addDoc(collection(db, SUPPORT_COLLECTION, threadId, 'replies'), {
      from: isFromAdmin ? 'admin' : 'student',
      text: body,
      threadEmail: cleanEmailKey(threadEmail),
      authorEmail: cleanEmailKey(auth.currentUser.email),
      authorName: String(authorName || '').trim().slice(0, 120),
      createdAt: now,
      createdAtServer: serverTimestamp()
    });
  } catch (e) {
    console.warn('Không gửi được lượt trả lời:', e);
    if (e?.code === 'permission-denied') {
      console.error(
        'Firestore từ chối ghi vào `support_messages/{id}/replies`.\n' +
          'Nguyên nhân gần như chắc chắn: firestore.rules trên máy chủ chưa có khối ' +
          '`match /support_messages/{msgId}/replies/{replyId}`.\n' +
          'Cách sửa: Firebase Console -> Firestore Database -> Rules -> dán đè toàn bộ ' +
          'nội dung firestore.rules trong kho mã -> Publish. Xem DEPLOYMENT.md.',
        e
      );
      return {
        ok: false,
        code: 'permission-denied',
        message: 'Hệ thống chưa mở kênh trao đổi hai chiều. Đây là lỗi cài đặt, không phải do tài khoản của bạn — vui lòng báo Ban Quản Trị kèm mã: permission-denied.'
      };
    }
    return { ok: false, code: e?.code || '', message: `Không gửi được (${e?.code || 'lỗi không rõ'}).` };
  }

  // Cập nhật tài liệu cha là việc PHỤ. Hỏng ở đây thì lượt trả lời vẫn còn
  // nguyên và hai bên vẫn đọc được nhau — chỉ có huy hiệu "chưa đọc" là lỗi
  // thời. Không để nó kéo cả lệnh gửi thành thất bại.
  try {
    await updateDoc(doc(db, SUPPORT_COLLECTION, threadId), {
      lastReplyAt: now,
      lastReplyFrom: isFromAdmin ? 'admin' : 'student',
      studentUnread: isFromAdmin,
      status: isFromAdmin ? 'read' : 'new'
    });
  } catch (e) {
    console.warn('Đã gửi lượt trả lời nhưng không cập nhật được trạng thái cuộc trao đổi:', e);
  }

  return { ok: true };
}

/** Học viên đã xem lượt trả lời mới nhất — tắt huy hiệu đỏ trên nút Pipi. */
export async function markThreadSeenByStudent(threadId) {
  if (!threadId) return { ok: false };
  try {
    await updateDoc(doc(db, SUPPORT_COLLECTION, threadId), { studentUnread: false });
    return { ok: true };
  } catch (e) {
    console.warn('Không đánh dấu được là đã xem:', e);
    return { ok: false, code: e?.code || '' };
  }
}

/** Xoá hẳn một lời nhắn. Chỉ quản trị viên (theo rules). */
export async function deleteSupportMessage(id) {
  if (!id) return { ok: false, message: 'Thiếu mã lời nhắn.' };
  try {
    await deleteDoc(doc(db, SUPPORT_COLLECTION, id));
    return { ok: true };
  } catch (e) {
    console.warn('Không xoá được lời nhắn:', e);
    return { ok: false, code: e?.code || '', message: e?.message || String(e) };
  }
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

  // Phân biệt được HAI việc mà nhìn giao diện không phân biệt nổi: hộp thư
  // trống thật, với luật `support_messages` chưa deploy nên không đọc được.
  // Cả hai đều ra một màn hình trắng trơn nếu không hỏi thẳng máy chủ như đây.
  try {
    const snapshot = await getDocs(collection(db, SUPPORT_COLLECTION));
    add('Đọc hộp thư hỗ trợ', true, `${snapshot.size} lời nhắn trên máy chủ`);
  } catch (e) {
    add(
      'Đọc hộp thư hỗ trợ',
      false,
      e.code === 'permission-denied'
        ? 'permission-denied — firestore.rules trên máy chủ chưa có khối support_messages. Publish lại rules (xem DEPLOYMENT.md).'
        : `${e.code || ''} ${e.message}`
    );
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

/* ============================================================
   MỐC KHỞI ĐIỂM HIỂN THỊ

   Ba con số cộng thêm vào số đo được, do chủ dự án ấn định (2026-07-28).

   ĐỌC KỸ TRƯỚC KHI SỬA:

   1. Đây KHÔNG phải số đo. Chúng là hằng số cộng vào lúc hiển thị, đại diện cho
      phần hoạt động có trước khi hệ thống này vận hành (học viên đã học và bằng
      đã cấp ngoài ứng dụng). Đừng đọc chúng như dữ liệu thống kê.

   2. Chỉ cộng Ở TẦNG HIỂN THỊ. Tuyệt đối không ghi mốc xuống Firestore:
      reconcileGlobalStats() ghi đè `stats_global` bằng con số đếm thật, nên nếu
      mốc lọt vào giá trị lưu trữ thì mỗi lần đối soát sẽ cộng thêm một lần nữa,
      và số sẽ phình lên vô hạn.

   3. Bảng Quản Trị KHÔNG cộng mốc cho học viên/tốt nghiệp — nó là công cụ vận
      hành, phải khớp đúng số dòng trong bảng. Cộng mốc vào đó sẽ thành "69 học
      viên" trong khi danh sách chỉ có 3 dòng.
   ============================================================ */

/** Mốc lượt truy cập web. */
export const TRAFFIC_BASELINE = 190;

/** Mốc học viên đã tham gia. */
export const ENROLLED_BASELINE = 69;

/** Mốc học viên đã được cấp bằng. */
export const GRADUATE_BASELINE = 30;

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

      // Cloud là con số TOÀN CỤC, số đếm tại máy là con số CỦA RIÊNG MÁY NÀY.
      // Hai đại lượng khác nhau, không được trộn.
      //
      // Bản cũ lấy `Math.max(cloudTotal, readLocalTraffic())` với lý do "để số
      // không tụt lùi". Nhưng một máy đã ghé 5 ngày sẽ hiện 5 kể cả khi toàn hệ
      // thống mới có 3 lượt — con số hiện ra không phải toàn cục cũng chẳng phải
      // của máy. Đã đọc được Cloud thì Cloud là đáp án duy nhất.
      callback({
        totalViews: TRAFFIC_BASELINE + cloudTotal,
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
/**
 * Cộng 1 vào số học viên ghi danh.
 *
 * CHỈ gọi khi hồ sơ học viên đã ghi thành công lên Firestore. Trước đây hàm này
 * được gọi trong effect lúc tải trang, nên nó đếm lượt khách lần đầu vào web
 * chứ không đếm người đăng ký — `totalEnrolled` từng lên 9 trong khi máy chủ
 * gần như chưa có hồ sơ nào.
 *
 * Đây chỉ là bộ đếm cho cảm giác realtime giữa hai lần đối soát. Con số đúng do
 * `reconcileGlobalStats()` ghi đè, đếm thẳng trên collection `students`.
 */
export async function recordRealStudentEnrollment() {
  try {
    await setDoc(doc(db, 'analytics', 'stats_global'), {
      totalEnrolled: increment(1),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.warn("Không cộng được số ghi danh lên Cloud:", e);
  }
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
 * Đọc collection `students` THUẦN TỪ MÁY CHỦ, không trộn localStorage.
 *
 * Khác `getAllRegisteredStudentsFromCloud()` ở chỗ đó, và khác biệt này là thiết
 * yếu khi đối soát số liệu: hàm kia hợp nhất dữ liệu máy chủ với dữ liệu máy
 * hiện tại nên không phân biệt được "máy chủ có 3 học viên" với "máy này có 3
 * học viên trong localStorage".
 *
 * Trả về `null` khi KHÔNG đọc được (mất mạng, thiếu quyền) — khác hẳn `[]` là
 * đọc được và máy chủ đang rỗng. Nơi gọi bắt buộc phân biệt hai trường hợp,
 * nếu không sẽ ghi đè số liệu toàn hệ thống bằng số 0.
 */
export async function fetchStudentsFromCloudOnly() {
  try {
    const snapshot = await getDocs(collection(db, 'students'));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn('Không đọc được collection students từ máy chủ:', e);
    return null;
  }
}

/**
 * Ghi ĐÈ số liệu học viên bằng con số đếm được từ dữ liệu thật.
 *
 * Vì sao cần: `totalEnrolled` và `totalGraduates` là bộ đếm cộng dồn, mà bộ đếm
 * cộng dồn thì trôi. Chúng cộng cả những lần đăng ký thất bại, cộng lại từ đầu
 * khi học viên xoá localStorage hoặc đổi trình duyệt, và không bao giờ trừ đi
 * khi quản trị viên xoá một học viên. Có lúc `totalEnrolled` đã lên 9 trong khi
 * máy chủ gần như chưa có hồ sơ nào.
 *
 * Nguồn đúng duy nhất là đếm trực tiếp trên collection `students`. Chỉ quản trị
 * viên đọc được toàn bộ collection đó, nên chỉ quản trị viên đối soát được — và
 * Firestore Rules cũng chỉ cho quản trị viên ghi giá trị tuỳ ý vào đây.
 *
 * Chỉ gọi khi ĐÃ đọc được danh sách từ Cloud. Gọi lúc chỉ có dữ liệu localStorage
 * sẽ ghi đè số liệu toàn hệ thống bằng số của riêng một máy.
 */
export async function reconcileGlobalStats({ totalEnrolled, totalGraduates }) {
  if (!Number.isFinite(totalEnrolled) || !Number.isFinite(totalGraduates)) return;
  try {
    await setDoc(doc(db, 'analytics', 'stats_global'), {
      totalEnrolled,
      totalGraduates,
      reconciledAt: new Date().toISOString(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log(`🟢 Đã đối soát số liệu: ${totalEnrolled} học viên, ${totalGraduates} tốt nghiệp`);
    return { ok: true };
  } catch (e) {
    console.warn('Không đối soát được số liệu toàn cục:', e);
    return { ok: false, code: e?.code || '', message: e?.message || String(e) };
  }
}

/**
 * Real-time listener for Student Enrollment & Graduate Counters
 */
export function listenToRealStats(callback) {
  try {
    const statsDocRef = doc(db, 'analytics', 'stats_global');
    
    // Dự phòng khi chưa đọc được Cloud: chỉ còn mốc khởi điểm.
    //
    // Bản cũ đọc `dmm_real_enrolled_count` / `dmm_real_graduates_count` từ
    // localStorage rồi lấy `Math.max` với số của Cloud — lại là trộn số toàn cục
    // với số của riêng một máy, y như lỗi ở bộ đếm truy cập. Hai khoá localStorage
    // đó là tàn dư của bộ đếm cũ, không phản ánh toàn hệ thống nên bỏ hẳn.
    const baselineOnly = () => callback({
      totalEnrolled: ENROLLED_BASELINE,
      totalGraduates: GRADUATE_BASELINE
    });

    const unsubscribe = onSnapshot(statsDocRef, (snapshot) => {
      if (!snapshot.exists()) {
        baselineOnly();
        return;
      }
      const data = snapshot.data();
      // Mốc cộng Ở ĐÂY, tầng hiển thị. Giá trị lưu trên Firestore vẫn là số thật.
      callback({
        totalEnrolled: ENROLLED_BASELINE + (Number(data.totalEnrolled) || 0),
        totalGraduates: GRADUATE_BASELINE + (Number(data.totalGraduates) || 0)
      });
    }, () => baselineOnly());

    return unsubscribe;
  } catch (e) {
    console.warn("listenToRealStats error", e);
    callback({ totalEnrolled: ENROLLED_BASELINE, totalGraduates: GRADUATE_BASELINE });
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

