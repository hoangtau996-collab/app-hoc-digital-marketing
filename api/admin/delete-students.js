/**
 * Xoá học viên — xoá thật, kể cả tài khoản đăng nhập.
 *
 * VÌ SAO CẦN HÀM NÀY THAY VÌ DÙNG `deleteStudentEverywhere` Ở PHÍA TRÌNH DUYỆT:
 * hàm cũ chỉ xoá dữ liệu trong Firestore và localStorage, KHÔNG đụng tới tài
 * khoản trên Firebase Auth — mà phía trình duyệt cũng không có quyền làm việc
 * đó. Hệ quả: học viên bị "xoá" vẫn đăng nhập lại được như thường, và hồ sơ tự
 * sinh lại từ đầu. Quản trị viên xoá 20 người, hôm sau thấy đủ 20 người quay
 * lại mà không hiểu vì sao.
 *
 * ĐÂY LÀ THAO TÁC KHÔNG HOÀN TÁC ĐƯỢC. Tiến độ học, kết quả trắc nghiệm, khảo
 * sát đầu vào và lịch sử hỗ trợ đều mất vĩnh viễn. Giao diện phải hỏi lại cho
 * thật rõ trước khi gọi tới đây.
 *
 * Xử lý TỪNG học viên một và báo cáo riêng từng người, thay vì dừng cả mẻ khi
 * gặp lỗi đầu tiên: xoá hàng loạt mà hỏng ở người thứ ba trong hai mươi người
 * thì quản trị viên không có cách nào biết ai đã xoá, ai chưa.
 */
import { adminAuth, adminDb } from '../_lib/admin.js';
import { requireAdmin } from '../_lib/requireAdmin.js';

const cleanEmail = (v) => String(v || '').trim().toLowerCase();
const toDocId = (email) => cleanEmail(email).replace(/[^a-z0-9]/g, '_');

/** Trần số lượng mỗi lần gọi. Hàm máy chủ của Vercel có giới hạn thời gian chạy. */
const MAX_PER_REQUEST = 50;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Phương thức không được hỗ trợ.' });
  }

  const guard = await requireAdmin(req);
  if (!guard.ok) {
    return res.status(guard.status).json({ ok: false, message: guard.message });
  }

  const emails = Array.isArray(req.body?.emails)
    ? [...new Set(req.body.emails.map(cleanEmail).filter(Boolean))]
    : [];

  if (!emails.length) {
    return res.status(400).json({ ok: false, message: 'Chưa chọn học viên nào để xoá.' });
  }
  if (emails.length > MAX_PER_REQUEST) {
    return res.status(400).json({
      ok: false,
      message: `Mỗi lần xoá tối đa ${MAX_PER_REQUEST} học viên. Bạn đang chọn ${emails.length} — hãy chia thành nhiều đợt.`
    });
  }

  // Quản trị viên không tự xoá chính mình. Không phải để chiều chuộng: xoá tài
  // khoản đang đăng nhập sẽ làm hỏng phiên ngay giữa chừng, và nếu đó là quản
  // trị viên duy nhất thì không còn ai vào được Bảng Quản Trị nữa.
  if (emails.includes(guard.email)) {
    return res.status(400).json({
      ok: false,
      message: 'Bạn đang chọn cả tài khoản của chính mình. Bỏ chọn tài khoản đó rồi thử lại.'
    });
  }

  const db = adminDb();
  const auth = adminAuth();
  const results = [];

  for (const email of emails) {
    const docId = toDocId(email);
    const detail = { email, firestore: false, authAccount: false, error: '' };

    // --- Dữ liệu Firestore ---
    try {
      for (const col of ['students', 'registrations']) {
        await db.collection(col).doc(docId).delete();
      }
      // Sổ phân quyền: xoá luôn, nếu không thì email này vẫn còn quyền quản trị
      // và chỉ cần đăng ký lại là có ngay Bảng Quản Trị.
      await db.collection('admins').doc(email).delete();

      const threads = await db.collection('support_messages').where('email', '==', email).get();
      for (const doc of threads.docs) {
        const replies = await doc.ref.collection('replies').get();
        for (const r of replies.docs) await r.ref.delete();
        await doc.ref.delete();
      }
      detail.firestore = true;
    } catch (e) {
      detail.error = `Firestore: ${e?.code || e?.message || e}`;
    }

    // --- Tài khoản đăng nhập ---
    try {
      const user = await auth.getUserByEmail(email);
      await auth.deleteUser(user.uid);
      detail.authAccount = true;
    } catch (e) {
      if (e?.code === 'auth/user-not-found') {
        // Không có tài khoản đăng nhập là chuyện bình thường: học viên có thể
        // được nhập từ tệp CSV mà chưa bao giờ tự đăng ký. Không tính là lỗi.
        detail.authAccount = true;
      } else {
        detail.error = `${detail.error ? detail.error + '; ' : ''}Auth: ${e?.code || e?.message || e}`;
      }
    }

    results.push(detail);
  }

  const done = results.filter((r) => r.firestore && r.authAccount && !r.error);
  const failed = results.filter((r) => !(r.firestore && r.authAccount && !r.error));

  console.log(`Quản trị viên ${guard.email} xoá ${done.length}/${emails.length} học viên.`);

  return res.status(200).json({
    ok: failed.length === 0,
    deleted: done.map((r) => r.email),
    failed,
    message: failed.length
      ? `Đã xoá ${done.length}/${emails.length} học viên. ${failed.length} trường hợp lỗi — xem chi tiết bên dưới.`
      : `Đã xoá vĩnh viễn ${done.length} học viên, gồm cả tài khoản đăng nhập.`
  });
}
