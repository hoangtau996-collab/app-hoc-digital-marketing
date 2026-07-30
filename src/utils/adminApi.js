/**
 * Gọi các hàm quản trị chạy trên máy chủ (`api/admin/*`).
 *
 * Mọi lệnh đều kèm ID token của phiên đăng nhập hiện tại. Máy chủ tự kiểm chữ
 * ký của token rồi đối chiếu email trong đó với sổ `admins` — xem
 * `api/_lib/requireAdmin.js`. Nghĩa là phía trình duyệt KHÔNG cần và KHÔNG NÊN
 * tự kết luận ai là quản trị viên: bật giao diện quản trị bằng devtools thì
 * được, nhưng mọi lệnh gửi lên vẫn bị máy chủ từ chối.
 *
 * `getIdToken(true)` — buộc lấy token mới thay vì dùng bản còn trong bộ nhớ:
 * quyền vừa bị thu hồi mà token cũ còn hạn thì lệnh vẫn lọt qua. Với thao tác
 * xoá vĩnh viễn thì một nhịp mạng thêm là cái giá quá rẻ.
 */
import { auth } from '../firebase';

async function callAdminApi(path, payload) {
  const user = auth.currentUser;
  if (!user) {
    return { ok: false, message: 'Phiên đăng nhập đã hết hạn. Đăng nhập lại rồi thử lại.' };
  }

  let token;
  try {
    token = await user.getIdToken(true);
  } catch (e) {
    console.warn('Không lấy được ID token:', e);
    return { ok: false, message: 'Không xác thực được phiên đăng nhập. Đăng nhập lại rồi thử lại.' };
  }

  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    return { ok: Boolean(data.ok), status: res.status, ...data };
  } catch (e) {
    console.warn(`Không gọi được ${path}:`, e);
    return { ok: false, message: 'Không kết nối được máy chủ. Kiểm tra đường truyền rồi thử lại.' };
  }
}

/** Đổi email đăng nhập của một học viên, kèm dời toàn bộ dữ liệu sang mã mới. */
export function updateStudentEmail(oldEmail, newEmail) {
  return callAdminApi('/api/admin/update-student-email', { oldEmail, newEmail });
}

/**
 * Xoá vĩnh viễn danh sách học viên, gồm cả tài khoản đăng nhập.
 *
 * Trả về `{ ok, deleted, failed, message }`. Nơi gọi PHẢI đọc `failed`: xoá
 * hàng loạt hỏng giữa chừng mà chỉ nhìn `ok` thì quản trị viên không biết ai đã
 * xoá, ai còn.
 */
export function deleteStudentsPermanently(emails) {
  return callAdminApi('/api/admin/delete-students', { emails });
}

/** Trần người nhận mỗi đợt gửi. Phải khớp `BATCH_LIMIT` trong api/_lib/mailer.js. */
export const NOTIFY_BATCH_SIZE = 100;

/**
 * Gửi thư thông báo, tự chia thành nhiều đợt.
 *
 * Chia nhỏ ở PHÍA NÀY chứ không dồn cho máy chủ: hàm máy chủ của Vercel có giới
 * hạn thời gian chạy, gửi nghìn thư trong một lệnh sẽ bị cắt giữa chừng và
 * không ai biết nó dừng ở người thứ mấy. Chia đợt thì mỗi đợt có kết quả riêng,
 * và hỏng đợt nào biết đợt đó.
 *
 * `onProgress` để giao diện báo tiến độ. Gửi 300 thư mà màn hình đứng im thì
 * quản trị viên sẽ bấm lại lần nữa, và học viên nhận thư hai lần.
 */
export async function sendNotification({ subject, message, emails, onProgress }) {
  const list = [...new Set((emails || []).map((e) => String(e || '').trim().toLowerCase()).filter(Boolean))];
  if (!list.length) return { ok: false, message: 'Chưa chọn người nhận.' };

  let sent = 0;
  let skippedOptOut = 0;
  const errors = [];

  for (let i = 0; i < list.length; i += NOTIFY_BATCH_SIZE) {
    const chunk = list.slice(i, i + NOTIFY_BATCH_SIZE);
    const res = await callAdminApi('/api/admin/send-notification', { subject, message, emails: chunk });

    if (res.ok) {
      sent += Number(res.sent) || 0;
      skippedOptOut += Number(res.skippedOptOut) || 0;
    } else {
      errors.push(res.message || 'Lỗi không rõ');
    }

    if (onProgress) onProgress({ done: Math.min(i + chunk.length, list.length), total: list.length, sent });
  }

  if (errors.length) {
    return {
      ok: false,
      sent,
      skippedOptOut,
      message: `Đã gửi ${sent}/${list.length} thư rồi gặp lỗi: ${errors[0]}`
    };
  }

  return {
    ok: true,
    sent,
    skippedOptOut,
    message:
      `Đã gửi ${sent} thư.` +
      (skippedOptOut ? ` Bỏ qua ${skippedOptOut} người đã huỷ nhận thư thông báo.` : '')
  };
}
