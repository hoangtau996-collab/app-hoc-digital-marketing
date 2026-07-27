# TODO — Việc tồn đọng

Việc **đang làm** nằm ở [TASK.md](TASK.md). File này chỉ liệt kê việc chưa bắt đầu.

Mỗi mục đều xuất phát từ quan sát thực tế trên mã nguồn, không phải đề xuất suy đoán.

---

## Bảo mật

Mức ưu tiên cao nhất.

- [x] ~~**Mật khẩu lưu dạng chữ thường trong localStorage.**~~ Đã xử lý bằng SHA-256 + muối, kèm nâng cấp bản ghi cũ. Xem [CHANGELOG.md](CHANGELOG.md).
- [ ] **Tài khoản quản trị nằm cứng trong mã.** `admin@pmarcom.edu.vn` với mật khẩu `admin` viết thẳng trong `AuthModal.jsx`. Băm khi lưu xuống localStorage đã xử lý, nhưng **mật khẩu vẫn đọc được trong mã nguồn**. Cần chuyển sang tài khoản Firebase Auth thật kèm custom claim.
- [ ] **Đưa Firestore Security Rules vào kho mã.** Ứng dụng không có backend nên rules là lớp bảo vệ duy nhất. Hiện chưa có `firestore.rules`. Xem [DATABASE.md](DATABASE.md#bảo-mật).
- [ ] **Rà soát quyền ghi `analytics`.** Bộ đếm truy cập ghi trực tiếp từ trình duyệt bằng `increment(1)`; cần rules chặn ghi tuỳ tiện.

## Kiểm thử

- [ ] **Chưa có bộ kiểm thử tự động.** Chưa có script `test` trong `package.json`. Ưu tiên phủ trước hai module logic thuần đã tách sẵn: `utils/studyReminder.js` và phần `makeVerifyCode` của `utils/certificateExport.js`.
- [ ] **Chưa có kiểm thử hồi quy cho chức năng xuất Bằng Chứng Nhận** — đây là chỗ từng hỏng hoàn toàn mà không ai phát hiện.

## Triển khai

- [ ] **Chưa có cấu hình triển khai trong kho mã.** Cần xác nhận nơi triển khai rồi đưa cấu hình vào. Xem [DEPLOYMENT.md](DEPLOYMENT.md).
- [ ] **Chưa có CI.** Tối thiểu nên chạy `npm run lint` và `npm run build` trên mỗi lần đẩy mã.
- [ ] **Chưa có `.env.example`.** Người mới không biết cần khai báo biến nào.
- [ ] **Giá trị Firebase dự phòng là chuỗi giữ chỗ.** Quên đặt biến môi trường thì ứng dụng vẫn chạy nhưng hỏng âm thầm. Cân nhắc báo lỗi rõ ràng khi thiếu cấu hình thay vì im lặng rơi về dự phòng.
- [ ] **Xác nhận tên miền chính thức.** `index.html` đang trỏ cứng `https://pmarcom.edu.vn` ở thẻ canonical.

## Hiệu năng

- [ ] **Gói JS chính vượt 500 kB sau rút gọn.** Chủ yếu do Firebase SDK, html2canvas và jsPDF. Hướng xử lý: nạp động html2canvas và jsPDF vì chúng chỉ cần khi bấm tải Bằng Chứng Nhận.

## Lỗi đã phát hiện, chưa sửa

- [ ] **Khối đồng bộ Realtime Database là mã chết.** `src/firebase.js` có một `/**` lạc ngay trước phần khai báo endpoint, nuốt trọn `activeProjectId`, `PUBLIC_SYNC_URL`, `PUBLIC_SYNC_URL_ALT` vào trong block comment. Mọi tham chiếu tới chúng ném `ReferenceError` nhưng đều nằm trong `try/catch` nên bị nuốt im lặng — **tính năng "Zero-Config Global Sync" chưa từng chạy**. Tôi cố ý **không** tự sửa: gỡ comment ra sẽ lập tức bắt đầu `PUT` hồ sơ học viên (tên, email, số điện thoại) lên một URL Realtime Database công khai mà chưa rõ Security Rules. Cần bạn xác nhận có muốn bật không, và rules ra sao.

## Chất lượng mã

- [ ] **Cảnh báo lint còn tồn đọng** — biến `catch (e)` không dùng và import thừa ở nhiều tệp.
- [ ] **`App.jsx` quá lớn**, giữ toàn bộ state dùng chung. Cân nhắc tách theo nhóm chức năng nếu tiếp tục mở rộng.
- [ ] **Trùng dữ liệu giữa `students` và `registrations`.** Cần xác nhận có chủ ý không trước khi gộp. Xem [DATABASE.md](DATABASE.md#collection-registrations).
- [ ] **Quy ước thông điệp commit.** Lịch sử hiện lẫn commit thủ công và commit tự động dạng `chore: tự động lưu ...`.

## Nội dung

- [ ] **Mã xác thực Bằng Chứng Nhận chưa tra cứu được.** Mã sinh ra tất định nhưng không có trang nào để đối chiếu tính xác thực.
- [ ] **Rà soát độ phủ bản dịch tiếng Anh.** `TRANSLATIONS` có cả hai ngôn ngữ nhưng phần lớn nội dung khoá học chỉ có tiếng Việt.
- [ ] **Nội dung khoá học nằm cứng trong mã.** Sửa một dòng chữ cũng phải đóng gói và triển khai lại.

## Cần làm rõ với chủ dự án

- [ ] Giấy phép của dự án.
- [ ] Lộ trình và các mốc bàn giao. Xem [PROJECT.md](PROJECT.md#mốc-thời-gian).
- [ ] Phiên bản Node tối thiểu (`engines` trong `package.json`).
- [ ] Có cần trang tra cứu Bằng Chứng Nhận công khai không.
