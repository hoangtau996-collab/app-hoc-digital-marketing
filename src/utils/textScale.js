/**
 * BA MỨC CỠ CHỮ CỦA NÚT A- / A / A+
 *
 * Để ở tệp riêng chứ không nằm trong App.jsx vì Header.jsx cũng cần mảng này
 * để dựng nút. Cho Header nhập thẳng từ App.jsx sẽ thành vòng lặp nhập khẩu
 * (App nhập Header, Header nhập App) — trình gói vẫn chạy được nhưng thứ tự
 * khởi tạo phụ thuộc vào may rủi, và hỏng thì rất khó lần ra.
 *
 * `value` được nhân với cỡ chữ mặc định của trình duyệt qua biến CSS
 * `--app-text-scale`; cơ chế và lý do chọn trần 1.12 ghi ở index.css, mục
 * "GỐC QUY CHIẾU: TẤT CẢ ĐỀU LÀ REM, KHÔNG CÒN PX".
 */
export const TEXT_SCALES = [
  { value: 0.92, label: 'A-', title: 'Cỡ chữ nhỏ' },
  { value: 1, label: 'A', title: 'Cỡ chữ vừa (mặc định)' },
  { value: 1.12, label: 'A+', title: 'Cỡ chữ lớn' },
];

/** Hệ số hợp lệ thì giữ, rác thì trả về mặc định. Dùng khi đọc localStorage:
 *  người dùng sửa tay hoặc bản cũ ghi giá trị khác đều rơi về 1 thay vì đẩy
 *  một `NaN` vào biến CSS rồi làm hỏng cỡ chữ của cả ứng dụng. */
export function normalizeTextScale(raw) {
  const value = parseFloat(raw);
  return TEXT_SCALES.some(s => s.value === value) ? value : 1;
}
