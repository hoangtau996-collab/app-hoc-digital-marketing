/**
 * Quản trị viên đổi email của một học viên.
 *
 * Dùng khi học viên gõ sai email lúc đăng ký và không còn đăng nhập được để tự
 * sửa. Ban Quản Trị gọi điện theo số điện thoại trong hồ sơ, xác minh đúng
 * người, rồi đổi hộ.
 *
 * ĐỔI EMAIL KHÔNG PHẢI ĐỔI MỘT Ô — đây là phần dễ làm hỏng nhất trong tệp này.
 * Hồ sơ trên Firestore đặt mã tài liệu SUY RA TỪ EMAIL (`a_b_gmail_com`), nên
 * đổi email ở Firebase Auth mà không dời tài liệu thì:
 *   - học viên đăng nhập được nhưng hồ sơ đọc ra chỗ trống -> mất sạch tiến độ
 *   - Bảng Quản Trị hiện hai dòng cho cùng một người
 *   - tiến độ cũ nằm lại vĩnh viễn dưới mã cũ, không ai tìm ra
 *
 * Vì vậy phải dời trọn bộ, theo đúng thứ tự dưới đây.
 *
 * THỨ TỰ CÓ Ý NGHĨA: dời dữ liệu Firestore TRƯỚC, đổi Firebase Auth SAU CÙNG.
 * Nếu làm ngược, khi bước Firestore hỏng giữa chừng thì học viên đã mang email
 * mới nhưng dữ liệu vẫn nằm ở email cũ — hỏng nặng hơn lúc chưa làm gì. Còn
 * theo thứ tự này, hỏng ở đâu thì học viên vẫn đăng nhập được bằng email cũ.
 */
import { adminAuth, adminDb } from '../_lib/admin.js';
import { requireAdmin } from '../_lib/requireAdmin.js';

const cleanEmail = (v) => String(v || '').trim().toLowerCase();
const toDocId = (email) => cleanEmail(email).replace(/[^a-z0-9]/g, '_');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Phương thức không được hỗ trợ.' });
  }

  const guard = await requireAdmin(req);
  if (!guard.ok) {
    return res.status(guard.status).json({ ok: false, message: guard.message });
  }

  const oldEmail = cleanEmail(req.body?.oldEmail);
  const newEmail = cleanEmail(req.body?.newEmail);

  if (!oldEmail || !newEmail) {
    return res.status(400).json({ ok: false, message: 'Thiếu email cũ hoặc email mới.' });
  }
  if (oldEmail === newEmail) {
    return res.status(400).json({ ok: false, message: 'Email mới trùng email cũ, không có gì để đổi.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    return res.status(400).json({ ok: false, message: 'Địa chỉ email mới không hợp lệ.' });
  }

  const db = adminDb();
  const auth = adminAuth();

  try {
    // --- Kiểm tra trước, sửa sau ---
    let user;
    try {
      user = await auth.getUserByEmail(oldEmail);
    } catch (e) {
      if (e?.code === 'auth/user-not-found') {
        return res.status(404).json({
          ok: false,
          message: `Không tìm thấy tài khoản đăng nhập của ${oldEmail}. Có thể học viên này chỉ tồn tại trong dữ liệu, chưa từng đăng nhập được.`
        });
      }
      throw e;
    }

    // Email mới đã có người dùng chưa. Bỏ qua bước này thì lệnh đổi sẽ hỏng ở
    // giữa chừng, sau khi dữ liệu Firestore đã dời xong — trạng thái tệ nhất.
    try {
      const taken = await auth.getUserByEmail(newEmail);
      if (taken.uid !== user.uid) {
        return res.status(409).json({
          ok: false,
          message: `Email ${newEmail} đã thuộc về một tài khoản khác. Không thể gán cho hai người.`
        });
      }
    } catch (e) {
      if (e?.code !== 'auth/user-not-found') throw e;
      // Không ai dùng -> đúng như mong muốn, đi tiếp.
    }

    const oldId = toDocId(oldEmail);
    const newId = toDocId(newEmail);
    const moved = [];

    // --- 1. Dời hồ sơ ở `students` và `registrations` ---
    for (const col of ['students', 'registrations']) {
      const oldRef = db.collection(col).doc(oldId);
      const snap = await oldRef.get();
      if (!snap.exists) continue;

      const data = { ...snap.data(), email: newEmail, updatedAt: new Date().toISOString() };
      // `merge: true` chứ không ghi đè: nếu vì lý do nào đó tài liệu ở mã mới đã
      // tồn tại (học viên từng đăng ký hụt bằng email này), ta bổ sung chứ không
      // xoá trắng thứ đang có.
      await db.collection(col).doc(newId).set(data, { merge: true });
      await oldRef.delete();
      moved.push(col);
    }

    // --- 2. Dời quyền quản trị nếu có ---
    const adminRef = db.collection('admins').doc(oldEmail);
    const adminSnap = await adminRef.get();
    if (adminSnap.exists) {
      await db.collection('admins').doc(newEmail).set(
        { ...adminSnap.data(), email: newEmail },
        { merge: true }
      );
      await adminRef.delete();
      moved.push('admins');
    }

    // --- 3. Dời lịch sử hỗ trợ ---
    //
    // Không bỏ qua được: các lời nhắn lọc theo trường `email`, và luật Firestore
    // cho học viên đọc lại lời nhắn của chính mình cũng so theo trường đó. Bỏ
    // sót thì học viên mất toàn bộ lịch sử trao đổi với Ban Quản Trị.
    try {
      const threads = await db.collection('support_messages').where('email', '==', oldEmail).get();
      for (const doc of threads.docs) {
        await doc.ref.update({ email: newEmail });
        const replies = await doc.ref.collection('replies').where('threadEmail', '==', oldEmail).get();
        for (const r of replies.docs) {
          await r.ref.update({ threadEmail: newEmail });
        }
      }
      if (!threads.empty) moved.push(`support_messages (${threads.size})`);
    } catch (e) {
      // Không để hỏng ở đây chặn cả thao tác: hồ sơ và tiến độ học quan trọng
      // hơn lịch sử chat, và học viên vẫn mở được cuộc trao đổi mới.
      console.warn('Không dời được lịch sử hỗ trợ:', e);
    }

    // --- 4. Cuối cùng mới đổi tài khoản đăng nhập ---
    //
    // `emailVerified: false` là cố ý: địa chỉ mới do quản trị viên gõ vào, chưa
    // ai chứng minh học viên thật sự sở hữu nó. Đánh dấu đã xác minh ở đây là
    // tự tay dựng lên một sự thật không có thật.
    await auth.updateUser(user.uid, { email: newEmail, emailVerified: false });

    console.log(`Quản trị viên ${guard.email} đổi email ${oldEmail} -> ${newEmail}`);

    return res.status(200).json({
      ok: true,
      message: `Đã đổi email của học viên từ ${oldEmail} sang ${newEmail}.`,
      moved
    });
  } catch (e) {
    console.error('Lỗi khi đổi email học viên:', e);
    return res.status(500).json({
      ok: false,
      message: `Không đổi được email (${e?.code || 'lỗi không rõ'}). Dữ liệu có thể đã dời một phần — kiểm tra lại trên Bảng Quản Trị trước khi thử lần nữa.`
    });
  }
}
