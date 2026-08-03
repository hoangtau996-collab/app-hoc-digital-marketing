/**
 * Hàm định dạng số và phép chia an toàn dùng chung cho toàn bộ Bộ công cụ.
 *
 * Vì sao nằm ở utils chứ không nằm cạnh component: trộn hàm tiện ích với
 * component trong cùng một tệp làm hỏng Fast Refresh của Vite — sửa một dòng
 * trong công cụ là cả trang tải lại và mất hết số đang nhập dở.
 *
 * Vì sao dùng chung một tệp: trước đây ManagerTools và MarketingFormulaTools
 * mỗi bên tự viết một hàm định dạng tiền, nên chuyển tab là kiểu hiển thị số
 * đổi theo dù vẫn trong cùng một màn hình.
 */

/**
 * Chia có chặn lỗi, trả về 0 thay vì Infinity hoặc NaN.
 *
 * Người dùng xoá trắng một ô nhập là chuyện xảy ra liên tục, và khi đó mẫu số
 * bằng 0. Không chặn thì màn hình in thẳng chữ "Infinity" hoặc "NaN" ra cho
 * người dùng đọc — lỗi này từng có thật ở công cụ tính ngưỡng hoà vốn.
 */
export const safeDiv = (a, b) => (!b || !isFinite(a / b) ? 0 : a / b);

/** Tiền Việt, làm tròn tới đồng. */
export const vnd = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
    .format(Math.round(v || 0));

/** Số thường theo định dạng Việt Nam: dấu chấm ngăn nghìn, dấu phẩy thập phân. */
export const num = (v, d = 0) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: d }).format(v || 0);

/** Nhận vào dạng thập phân (0,42) và trả ra chuỗi phần trăm ("42%"). */
export const pct = (v, d = 1) => `${num((v || 0) * 100, d)}%`;
