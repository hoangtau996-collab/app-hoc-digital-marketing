/**
 * Yêu cầu gửi thư đặt lại mật khẩu.
 *
 * ĐÂY LÀ ĐƯỜNG DUY NHẤT được phép dùng trong toàn ứng dụng. Có hai nơi cần nó —
 * nút "Quên mật khẩu?" ở màn hình đăng nhập và nút trong Hồ Sơ Học Viên — nên
 * gom về một hàm thay vì chép đôi.
 *
 * VÌ SAO KHÔNG GỌI `sendPasswordResetEmail` CỦA FIREBASE cho gọn: hàm đó gửi lá
 * thư do Firebase soạn, người gửi là `noreply@hr-project-b982a.firebaseapp.com`
 * và đường dẫn bên trong cũng mang tên miền đó. Học viên vừa học ở
 * academy.pmarcom.com nhận được một lá thư tiếng Anh, người gửi lạ, link lạ —
 * đúng mọi dấu hiệu của thư lừa đảo. Hàm máy chủ `/api/forgot-password` mượn
 * Firebase phần sinh mã, còn người gửi, nội dung và tên miền của link đều do
 * Học Viện quyết.
 *
 * Đã từng có lúc hai đường cùng tồn tại trong ứng dụng, và nút trong Hồ Sơ vẫn
 * lặng lẽ phát ra lá thư xấu kia. Nếu sau này cần thêm nơi thứ ba, gọi hàm này.
 */
export async function requestPasswordReset(email) {
  const target = String(email || '').trim();
  if (!target) {
    return { ok: false, message: 'Chưa có địa chỉ email để gửi.' };
  }

  try {
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: target })
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.ok) {
      return { ok: true, message: data.message };
    }
    return {
      ok: false,
      message: data.message || 'Không gửi được thư. Vui lòng thử lại sau ít phút.'
    };
  } catch (e) {
    console.warn('Không gọi được /api/forgot-password:', e);
    return {
      ok: false,
      message: 'Không kết nối được máy chủ. Kiểm tra đường truyền rồi thử lại.'
    };
  }
}
