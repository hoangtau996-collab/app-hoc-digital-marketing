/**
 * Phép thử sống chết đơn giản nhất có thể: KHÔNG import gì cả.
 *
 * Mục đích duy nhất là tách đôi câu hỏi "vì sao hàm máy chủ trả về 500":
 *   - ping chạy được  -> hạ tầng hàm của Vercel ổn, lỗi nằm ở phần import của
 *                        hàm kia (gần như chắc chắn là firebase-admin)
 *   - ping cũng chết  -> Vercel không dựng được hàm nào cho dự án này, phải xem
 *                        lại cấu hình build chứ không phải mã nguồn
 *
 * Không có phép thử này thì mỗi lần đoán sai phải chờ trọn một vòng deploy mới
 * biết. Giữ lại trong kho mã, nó vô hại và lần sau còn dùng.
 */
export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    message: 'Hàm máy chủ đang sống.',
    node: process.version,
    time: new Date().toISOString()
  });
}
