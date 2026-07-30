/**
 * Khởi tạo Firebase Admin SDK cho các hàm chạy trên máy chủ Vercel.
 *
 * VÌ SAO CẦN GÓI `firebase-admin` (gói duy nhất thêm mới cho phần này):
 * chỉ quyền quản trị mới sinh được mã đặt lại mật khẩu mà KHÔNG gửi thư của
 * Firebase. Đó chính là điều ta cần — lấy mã, tự ghép link dưới tên miền
 * academy.pmarcom.com, rồi tự gửi thư mang thương hiệu Học Viện. SDK phía trình
 * duyệt không làm được việc này, và cũng không được phép làm.
 *
 * TỆP NÀY CHỈ CHẠY TRÊN MÁY CHỦ. Thư mục `api/` không bao giờ được đóng gói vào
 * JavaScript gửi xuống trình duyệt, nên khoá dịch vụ không lọt ra ngoài. Tuyệt
 * đối không import tệp này từ bất cứ đâu trong `src/`.
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let cachedApp = null;

/**
 * Đọc khoá dịch vụ từ biến môi trường.
 *
 * Nhận cả hai dạng — JSON thô và JSON đã mã hoá base64 — vì ô nhập biến môi
 * trường của Vercel hay làm hỏng chuỗi nhiều dòng: ký tự xuống dòng trong
 * `private_key` bị nuốt là khoá thành vô dụng, mà thông báo lỗi thì chỉ nói
 * "Invalid PEM formatted message", không nói vì sao.
 */
function readServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error(
      'Thiếu biến môi trường FIREBASE_SERVICE_ACCOUNT. ' +
        'Khai báo trên Vercel: Project Settings → Environment Variables.'
    );
  }

  const text = raw.trim().startsWith('{')
    ? raw
    : Buffer.from(raw, 'base64').toString('utf8');

  const parsed = JSON.parse(text);

  // Dán JSON nhiều dòng vào ô của Vercel thường biến "\n" thật thành hai ký tự
  // "\" và "n". Khôi phục lại, nếu không khoá riêng không dùng được.
  if (parsed.private_key && parsed.private_key.includes('\\n')) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  }

  return parsed;
}

export function getAdminApp() {
  if (cachedApp) return cachedApp;
  const existing = getApps();
  cachedApp = existing.length
    ? existing[0]
    : initializeApp({ credential: cert(readServiceAccount()) });
  return cachedApp;
}

export const adminAuth = () => getAuth(getAdminApp());
export const adminDb = () => getFirestore(getAdminApp());
