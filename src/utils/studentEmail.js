/**
 * Yêu cầu máy chủ gửi thư tự động cho chính học viên đang đăng nhập.
 *
 * KHÔNG BAO GIỜ NÉM LỖI RA NGOÀI, và không có nơi gọi nào chờ kết quả. Đây là
 * việc phụ: thư chào mừng không gửi được thì học viên vẫn vào học bình thường,
 * còn thư chúc mừng tốt nghiệp không tới thì tấm bằng vẫn nằm sẵn trong ứng
 * dụng. Để một lá thư hỏng chặn đường đăng ký hay chặn màn hình chúc mừng là
 * đánh đổi sai.
 *
 * Máy chủ tự lo chuyện gửi trùng: nó đánh dấu trên Firestore sau mỗi lần gửi,
 * nên gọi bao nhiêu lần cũng chỉ ra đúng một lá thư. Nhờ vậy nơi gọi không phải
 * tự nhớ đã gửi hay chưa — thứ mà nếu nhớ bằng localStorage thì học viên đổi
 * máy sẽ nhận lại thư "chúc mừng tốt nghiệp" thêm lần nữa.
 */
import { auth } from '../firebase';

async function requestStudentEmail(type) {
  const user = auth.currentUser;
  // Không có phiên Firebase thì máy chủ cũng không xác thực được — đây là
  // trường hợp thật, không phải lỗi: nhánh đăng ký dự phòng tại máy không tạo
  // phiên nào cả.
  if (!user) return;

  try {
    const token = await user.getIdToken();
    await fetch('/api/student-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type })
    });
  } catch (e) {
    console.warn(`Không gửi được thư tự động (${type}):`, e);
  }
}

/** Thư chào mừng, gọi sau khi hồ sơ học viên đã hoàn tất. */
export function sendWelcomeEmail() {
  return requestStudentEmail('welcome');
}

/** Thư chúc mừng, gọi khi học viên vừa đạt đủ 11/11 chuyên đề. */
export function sendGraduationEmail() {
  return requestStudentEmail('graduation');
}
