/**
 * Thu nhỏ ảnh đại diện trước khi lưu.
 *
 * VÌ SAO BẮT BUỘC PHẢI CÓ BƯỚC NÀY: ảnh đại diện được lưu dưới dạng chuỗi
 * base64 nhúng thẳng vào hồ sơ, chứ không phải tải lên kho lưu trữ tệp rồi giữ
 * đường dẫn. Chuỗi base64 phình khoảng 33% so với tệp gốc, và nó phải chui lọt
 * qua hai cái cổng hẹp:
 *
 *   - `localStorage` của trình duyệt: tổng dung lượng thường chỉ 5MB cho CẢ tên
 *     miền. Ứng dụng còn phải chứa tiến độ học, danh sách học viên, bản tin.
 *   - Tài liệu Firestore: trần cứng 1MB mỗi tài liệu.
 *
 * Bản trước cho phép tải ảnh tới 3MB. Một tấm ảnh 3MB thành chuỗi base64 khoảng
 * 4MB — vượt cả hai cổng. Kết quả là học viên chọn ảnh, thấy ảnh hiện lên ngay
 * trên màn hình, bấm lưu, rồi tải lại trang thì ảnh biến mất mà không có lấy
 * một dòng báo lỗi.
 *
 * Sau khi thu nhỏ về 256x256 và nén, ảnh còn khoảng 20-40KB — an toàn ở cả hai
 * nơi, và vẫn nét trên màn hình mật độ điểm ảnh cao vì chỗ hiển thị lớn nhất
 * chỉ là ô 56x56.
 */

/** Cạnh ảnh sau khi thu nhỏ, tính bằng điểm ảnh. */
const AVATAR_SIZE = 256;

/** Chất lượng nén JPEG. 0,82 là ngưỡng gần như không thấy khác biệt bằng mắt. */
const JPEG_QUALITY = 0.82;

/** Trần dung lượng TỆP GỐC được nhận. Chỉ để chặn tệp quá lớn làm treo trình duyệt. */
export const MAX_SOURCE_BYTES = 8 * 1024 * 1024;

/**
 * Đọc tệp ảnh, cắt vuông ở giữa rồi thu nhỏ, trả về chuỗi data URL.
 *
 * Cắt vuông ở giữa chứ không bóp méo: ô hiển thị là hình vuông, mà ảnh người
 * dùng chọn thường là khổ dọc chụp từ điện thoại. Bóp cho vừa sẽ làm khuôn mặt
 * bẹp lại.
 */
export function resizeAvatarFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Chưa chọn tệp ảnh.'));
      return;
    }
    if (!file.type || !file.type.startsWith('image/')) {
      reject(new Error('Tệp vừa chọn không phải ảnh.'));
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      reject(new Error('Ảnh gốc quá lớn, vui lòng chọn tệp dưới 8MB.'));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    // Giải phóng ngay khi xong, dù thành công hay thất bại. Không gọi thì mỗi
    // lần thử ảnh là một khối bộ nhớ bị giữ lại tới khi tải lại trang.
    const cleanup = () => URL.revokeObjectURL(objectUrl);

    img.onload = () => {
      try {
        const side = Math.min(img.naturalWidth, img.naturalHeight);
        const sx = (img.naturalWidth - side) / 2;
        const sy = (img.naturalHeight - side) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = AVATAR_SIZE;
        canvas.height = AVATAR_SIZE;

        const ctx = canvas.getContext('2d');
        // Nền trắng: ảnh PNG có phần trong suốt khi chuyển sang JPEG sẽ thành
        // đen kịt nếu không lót nền trước.
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
        ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);

        const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        cleanup();

        if (!dataUrl || dataUrl.length < 32) {
          reject(new Error('Không xử lý được ảnh này, vui lòng thử tệp khác.'));
          return;
        }
        resolve(dataUrl);
      } catch (err) {
        cleanup();
        reject(new Error('Không xử lý được ảnh này, vui lòng thử tệp khác.'));
      }
    };

    img.onerror = () => {
      cleanup();
      reject(new Error('Không đọc được tệp ảnh, có thể tệp đã hỏng.'));
    };

    img.src = objectUrl;
  });
}
