/**
 * Ghi nhớ đã chào trong phiên làm việc hiện tại.
 *
 * VÌ SAO LÀ `sessionStorage` CHỨ KHÔNG PHẢI `localStorage`: đây là toàn bộ điểm
 * mấu chốt. `sessionStorage` sống sót qua F5 nhưng mất khi đóng tab. Nhờ vậy
 * học viên bấm tải lại giữa buổi học không phải xem lại màn hình chào, còn hôm
 * sau mở lại thì vẫn thấy nhận diện thương hiệu một lần.
 *
 * Dùng `localStorage` sẽ khiến poster chỉ hiện đúng một lần trong đời trên máy
 * đó rồi thôi. Còn không lưu gì cả thì quay về đúng vấn đề cũ: F5 là chào lại.
 *
 * VÌ SAO TÁCH RA KHỎI `SplashScreen.jsx`: file vừa xuất component vừa xuất hàm
 * thường sẽ làm hỏng cơ chế nạp nóng lúc lập trình.
 */

const SEEN_KEY = 'pmarcom_splash_seen_session';

/**
 * Phiên này đã chào chưa.
 *
 * Bọc trong try/catch vì trình duyệt ở chế độ ẩn danh hoặc chặn cookie sẽ ném
 * lỗi khi truy cập kho lưu trữ. Lỗi ở đây không được phép làm sập trang, nên
 * trường hợp xấu nhất là chào lại mỗi lần — vẫn chạy được.
 */
export function shouldShowSplash() {
  try {
    return sessionStorage.getItem(SEEN_KEY) !== '1';
  } catch (e) {
    return true;
  }
}

export function markSplashSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch (e) {}
}
