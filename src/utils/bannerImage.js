/**
 * Chuẩn bị ảnh bìa trước khi lưu.
 *
 * Cùng bài toán với `avatarImage.js` nhưng khắc nghiệt hơn nhiều, vì ảnh bìa
 * rộng gần gấp bảy lần ảnh đại diện mà trần lưu trữ thì vẫn thế.
 *
 * VÌ SAO PHẢI NÉN CHỦ ĐỘNG: ảnh lưu dưới dạng chuỗi base64 nhúng thẳng vào tài
 * liệu Firestore, không tải lên kho tệp. Chuỗi base64 phình khoảng 33% so với
 * tệp gốc, mà tài liệu Firestore có trần CỨNG 1MB. Một ảnh bìa 1742x631 xuất
 * thẳng từ Canva thường nặng 1,5-3MB, tức base64 khoảng 2-4MB — Firestore từ
 * chối, và nó từ chối ở tầng máy chủ nên giao diện đã kịp hiện ảnh lên rồi mới
 * báo hỏng.
 *
 * Vì vậy hàm ở đây không nén một lần rồi hy vọng: nó nén, ĐO, rồi hạ chất lượng
 * và thu nhỏ tiếp cho tới khi thật sự lọt hạn mức. Xem `compressUnderBudget`.
 *
 * CẮT THEO TỈ LỆ KHUNG chứ không bóp méo. Khung ảnh bìa cố định ở 1742:631
 * (xem `.app-cover` trong index.css). Ảnh quản trị viên chọn có thể là khổ
 * vuông hay khổ dọc; bóp cho vừa thì chữ trong ảnh giãn ra trông như lỗi in.
 * Cắt giữa giữ đúng phần thiết kế hay đặt nội dung chính.
 */

/** Tỉ lệ khung ảnh bìa. PHẢI khớp `aspect-ratio` của `.app-cover` trong index.css. */
export const BANNER_ASPECT_W = 1742;
export const BANNER_ASPECT_H = 631;
const BANNER_RATIO = BANNER_ASPECT_W / BANNER_ASPECT_H;

/**
 * Bề ngang tối đa sau khi thu nhỏ.
 *
 * 1600 chứ không phải 1742 của khung gốc: khung hiển thị rộng nhất là 1216px
 * (giới hạn `max-w-7xl`), nên 1600 đã dư cho cả màn hình mật độ điểm ảnh gấp
 * đôi ở kích thước thật. Mỗi pixel thêm nữa chỉ làm chuỗi base64 dài ra.
 */
const MAX_WIDTH = 1600;

/**
 * Trần dung lượng CHUỖI BASE64 của một ảnh, tính bằng byte.
 *
 * 700KB chứ không phải sát 1MB: tài liệu Firestore còn chứa cả chú thích alt,
 * thứ tự, mốc thời gian và tên trường. Chừa 300KB để một bản ghi hơi dài hơn
 * bình thường cũng không đẩy cả tài liệu vượt trần — lỗi đó chỉ lộ ra lúc lưu,
 * đúng lúc người dùng tưởng đã xong việc.
 */
const MAX_ENCODED_BYTES = 700 * 1024;

/** Trần dung lượng TỆP GỐC được nhận. Chỉ để chặn tệp quá lớn làm treo trình duyệt. */
export const MAX_SOURCE_BYTES = 20 * 1024 * 1024;

/** Các nấc chất lượng JPEG sẽ thử lần lượt, từ đẹp nhất xuống. */
const QUALITY_STEPS = [0.86, 0.78, 0.7, 0.62, 0.54, 0.46];

/** Các nấc bề ngang sẽ thử khi hạ chất lượng vẫn chưa đủ. */
const WIDTH_STEPS = [MAX_WIDTH, 1280, 1024, 860];

/** Độ dài thật (byte) của phần dữ liệu trong một chuỗi data URL base64. */
export function encodedByteLength(dataUrl) {
  const base64 = String(dataUrl || '').split(',')[1] || '';
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

/** Đổi byte sang chuỗi đọc được, dùng trong thông báo cho người dùng. */
export function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

/**
 * Vẽ ảnh vào canvas đúng tỉ lệ khung, cắt giữa.
 *
 * Cắt phần thừa của CHIỀU DÀI HƠN so với khung: ảnh quá cao thì cắt trên dưới,
 * ảnh quá rộng thì cắt hai bên. Cả hai đều giữ tâm ảnh.
 */
function drawCropped(img, targetWidth) {
  const targetHeight = Math.round(targetWidth / BANNER_RATIO);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  // Nền trắng: ảnh PNG trong suốt chuyển sang JPEG mà không có nền sẽ ra nền
  // đen, khác hẳn thứ quản trị viên nhìn thấy lúc chọn tệp.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.imageSmoothingQuality = 'high';

  const sourceRatio = img.naturalWidth / img.naturalHeight;
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;

  if (sourceRatio > BANNER_RATIO) {
    // Ảnh rộng hơn khung -> cắt bớt hai bên.
    sw = Math.round(img.naturalHeight * BANNER_RATIO);
    sx = Math.round((img.naturalWidth - sw) / 2);
  } else if (sourceRatio < BANNER_RATIO) {
    // Ảnh cao hơn khung -> cắt bớt trên dưới.
    sh = Math.round(img.naturalWidth / BANNER_RATIO);
    sy = Math.round((img.naturalHeight - sh) / 2);
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
  return canvas;
}

/**
 * Nén cho tới khi lọt hạn mức, hoặc chịu thua và nói thẳng.
 *
 * Thử hết các nấc chất lượng ở bề ngang lớn nhất trước, rồi mới hạ bề ngang —
 * theo thứ tự đó vì với ảnh bìa nhiều chi tiết, giảm chất lượng JPEG ít lộ hơn
 * là giảm độ phân giải. Chữ trong ảnh mờ đi thấy ngay, còn nhiễu nén thì không.
 */
function compressUnderBudget(img) {
  let lastAttempt = null;

  for (const width of WIDTH_STEPS) {
    // Không phóng to ảnh nhỏ hơn khung: kéo lên chỉ làm tệp nặng thêm mà không
    // thêm được chi tiết nào.
    const effectiveWidth = Math.min(width, img.naturalWidth || width);
    const canvas = drawCropped(img, effectiveWidth);

    for (const quality of QUALITY_STEPS) {
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      const size = encodedByteLength(dataUrl);
      lastAttempt = { dataUrl, size, width: effectiveWidth, quality };
      if (size <= MAX_ENCODED_BYTES) return lastAttempt;
    }
  }

  return lastAttempt;
}

/**
 * Đọc tệp ảnh, cắt theo khung ảnh bìa rồi nén, trả về
 * `{ dataUrl, width, height, bytes }`.
 *
 * Ném lỗi có nội dung tiếng Việt đọc được — nơi gọi hiện nguyên văn, vì mọi lý
 * do thất bại ở đây đều là thứ quản trị viên tự xử lý được (chọn tệp khác, xuất
 * lại ảnh nhỏ hơn).
 */
export function prepareBannerFile(file) {
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
      reject(new Error(`Ảnh gốc quá lớn (${formatBytes(file.size)}). Vui lòng chọn tệp dưới 20MB.`));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    // Giải phóng ngay khi xong, dù thành công hay thất bại. Không gọi thì mỗi
    // lần thử ảnh là một khối bộ nhớ bị giữ lại tới khi tải lại trang.
    const cleanup = () => URL.revokeObjectURL(objectUrl);

    img.onload = () => {
      try {
        const best = compressUnderBudget(img);
        if (!best) {
          reject(new Error('Không xử lý được ảnh này. Vui lòng thử một tệp khác.'));
          return;
        }
        if (best.size > MAX_ENCODED_BYTES) {
          // Đã hạ tới nấc thấp nhất mà vẫn quá khổ. Rất hiếm, nhưng nói rõ
          // thay vì lưu một ảnh chắc chắn sẽ bị máy chủ từ chối.
          reject(new Error(
            `Ảnh này quá nặng để lưu (${formatBytes(best.size)} sau khi nén, trần là ${formatBytes(MAX_ENCODED_BYTES)}). ` +
            'Hãy xuất lại ảnh ở kích thước nhỏ hơn hoặc giảm chi tiết nền.'
          ));
          return;
        }
        resolve({
          dataUrl: best.dataUrl,
          width: best.width,
          height: Math.round(best.width / BANNER_RATIO),
          bytes: best.size
        });
      } catch (e) {
        reject(new Error(`Không xử lý được ảnh: ${e.message}`));
      } finally {
        cleanup();
      }
    };

    img.onerror = () => {
      cleanup();
      reject(new Error('Không đọc được tệp ảnh. Tệp có thể đã hỏng.'));
    };

    img.src = objectUrl;
  });
}
