# TODO — Việc tồn đọng

Việc **đang làm** nằm ở [TASK.md](TASK.md). File này chỉ liệt kê việc chưa bắt đầu.

Mỗi mục đều xuất phát từ quan sát thực tế trên mã nguồn, không phải đề xuất suy đoán.

---

## Bảo mật

Mức ưu tiên cao nhất.

- [x] ~~**Mật khẩu lưu dạng chữ thường trong localStorage.**~~ Đã xử lý bằng SHA-256 + muối, kèm nâng cấp bản ghi cũ. Xem [CHANGELOG.md](CHANGELOG.md).
- [ ] **⚠️ VIỆC PHẢI LÀM TRƯỚC TIÊN: deploy `firestore.rules` và tạo sẵn tài khoản `admin@pmarcom.edu.vn` trên Firebase Auth.** Rules đã nằm trong kho mã nhưng **chưa deploy thì chưa chặn được gì** — cơ sở dữ liệu vẫn chạy theo cấu hình cũ trên Console. Và nếu tài khoản gốc chưa tồn tại trên Firebase Auth, bất kỳ ai cũng đăng ký chiếm email đó để thành Quản Trị Tối Cao. Các bước cụ thể: [DEPLOYMENT.md](DEPLOYMENT.md#security-rules--bắt-buộc-deploy).
- [ ] **Mật khẩu quản trị vẫn đọc được trong mã nguồn.** `admin@pmarcom.edu.vn` / `admin` viết thẳng trong `AuthModal.jsx`. Bản ghi này **không còn cấp quyền quản trị** (quyền nay do máy chủ xác nhận), nhưng vẫn nên đổi mật khẩu và cân nhắc gỡ hẳn nhánh đăng nhập dự phòng.
- [ ] **Cân nhắc chuyển sang Firebase Auth custom claim.** Mô hình `admins` hiện tại tốn một lượt đọc tài liệu cho mỗi lần rules kiểm tra quyền. Custom claim gọn hơn nhưng cần Cloud Functions (gói Blaze) để đặt claim nên chưa làm.
- [x] ~~**Vai trò admin đọc từ localStorage nên sửa tay được.**~~ Đã xử lý. Quyền quản trị nay chỉ cấp sau khi có phiên Firebase Auth thật **và** máy chủ xác nhận qua collection `admins`; ba nguồn cũ (`dmm_active_user.role`, `dmm_users_db.role`, `dmm_admin_emails`) hạ xuống làm bộ nhớ đệm cho lúc mất mạng. Còn lại một giới hạn không gỡ được: người dùng vẫn bật được **giao diện** quản trị trên máy họ bằng cách sửa mã JavaScript đang chạy — nhưng bảng sẽ rỗng vì mọi lệnh đọc bị rules từ chối. Xem [CHANGELOG.md](CHANGELOG.md).
- [x] ~~**Đưa Firestore Security Rules vào kho mã.**~~ Đã có [firestore.rules](firestore.rules) và `firebase.json`. Vẫn **phải deploy** — xem mục đầu danh sách này.
- [x] ~~**Rà soát quyền ghi `analytics`.**~~ Rules giới hạn mỗi lần ghi chỉ được cộng tối đa 1 vào `totalVisits` / `totalEnrolled` / `totalGraduates`, và cấm xoá tài liệu.

## Kiểm thử

- [ ] **Chưa có bộ kiểm thử tự động.** Chưa có script `test` trong `package.json`. Ưu tiên phủ trước hai module logic thuần đã tách sẵn: `utils/studyReminder.js` và phần `makeVerifyCode` của `utils/certificateExport.js`.
- [ ] **Chưa có kiểm thử hồi quy cho chức năng xuất Bằng Chứng Nhận** — đây là chỗ từng hỏng hoàn toàn mà không ai phát hiện.

## Triển khai

- [ ] **Chưa có cấu hình triển khai trong kho mã.** Cần xác nhận nơi triển khai rồi đưa cấu hình vào. Xem [DEPLOYMENT.md](DEPLOYMENT.md).
- [ ] **Chưa có CI.** Tối thiểu nên chạy `npm run lint` và `npm run build` trên mỗi lần đẩy mã.
- [ ] **Chưa có `.env.example`.** Người mới không biết cần khai báo biến nào.
- [ ] **Giá trị Firebase dự phòng là chuỗi giữ chỗ.** Quên đặt biến môi trường thì ứng dụng vẫn chạy nhưng hỏng âm thầm. Cân nhắc báo lỗi rõ ràng khi thiếu cấu hình thay vì im lặng rơi về dự phòng.
- [x] ~~**Xác nhận tên miền chính thức.**~~ Là `https://academy.pmarcom.com/` trên Vercel, chủ dự án xác nhận 2026-07-28. `index.html` đã trỏ đúng, đã ghi vào [DEPLOYMENT.md](DEPLOYMENT.md).

## Hiệu năng

- [ ] **Gói JS chính vượt 500 kB sau rút gọn.** Chủ yếu do Firebase SDK, html2canvas và jsPDF. Hướng xử lý: nạp động html2canvas và jsPDF vì chúng chỉ cần khi bấm tải Bằng Chứng Nhận.

## Lỗi đã phát hiện, chưa sửa

- [ ] **Khối đồng bộ Realtime Database là mã chết.** `src/firebase.js` có một `/**` lạc ngay trước phần khai báo endpoint, nuốt trọn `activeProjectId`, `PUBLIC_SYNC_URL`, `PUBLIC_SYNC_URL_ALT` vào trong block comment. Mọi tham chiếu tới chúng ném `ReferenceError` nhưng đều nằm trong `try/catch` nên bị nuốt im lặng — **tính năng "Zero-Config Global Sync" chưa từng chạy**. Tôi cố ý **không** tự sửa: gỡ comment ra sẽ lập tức bắt đầu `PUT` hồ sơ học viên (tên, email, số điện thoại) lên một URL Realtime Database công khai mà chưa rõ Security Rules. Cần bạn xác nhận có muốn bật không, và rules ra sao.

- [x] ~~**Tiến độ khoá Trade Marketing chưa đồng bộ lên Firestore.**~~ Đã thêm trường `completedTradeModules` vào hồ sơ học viên, ghi khi tiến độ Trade đổi và hợp nhất lại khi đăng nhập máy mới. Xem [CHANGELOG.md](CHANGELOG.md).
- [x] ~~**Effect nạp tiến độ khoá chính để người dùng mới thừa hưởng tiến độ người trước.**~~ Effect nạp nay luôn gán state kể cả khi tài khoản chưa có bản ghi, và effect lưu bỏ qua đúng một lượt ngay sau khi đổi tài khoản. Xem [CHANGELOG.md](CHANGELOG.md).
- [x] ~~**55 câu hỏi khoá chính không bao giờ có đáp án đúng ở vị trí 3 hoặc 4.**~~ Đã xáo thứ tự lựa chọn ở tầng hiển thị trong `QuizComponent`; phân bố mới là 12/18/15/10. Xem [CHANGELOG.md](CHANGELOG.md).

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
