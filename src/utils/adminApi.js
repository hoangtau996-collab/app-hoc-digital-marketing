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
