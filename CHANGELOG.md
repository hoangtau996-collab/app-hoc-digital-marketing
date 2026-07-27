# CHANGELOG — Lịch sử thay đổi

Định dạng tham chiếu [Keep a Changelog](https://keepachangelog.com/vi/1.1.0/).

Dự án **chưa đánh số phiên bản**. Các mục dưới đây nhóm theo đợt làm việc, không phải theo bản phát hành.

TODO — chưa có quy ước đánh phiên bản; cân nhắc gắn thẻ Git khi phát hành.

---

## [Chưa phát hành] — 2026-07-27

### Quy trình

- **Chốt nguyên tắc làm việc Context tối thiểu** — đọc tài liệu trước, chỉ mở mã nguồn khi tài liệu không đủ, chỉ mở đúng module liên quan, chỉ xuất patch/diff, giải thích dưới 10 dòng, xong việc thì cập nhật `CHANGELOG.md` và `TASK.md`. Ghi tại [AI_MEMORY.md](AI_MEMORY.md#nguyên-tắc-context-tối-thiểu).
- **Lập bộ tài liệu AI Workspace** — 14 tệp Markdown ở thư mục gốc: `README`, `PROJECT`, `SUMMARY`, `AI_MEMORY`, `TASK`, `TODO`, `CHANGELOG`, `DECISION`, `CONTRIBUTING`, `ARCHITECTURE`, `PROMPTS`, `API_INDEX`, `DATABASE`, `DEPLOYMENT`. Không đụng mã nguồn.

### Thêm mới

- **Tranh minh hoạ chuyên đề** — 11 tranh khái niệm SVG nội tuyến, mỗi chuyên đề một tranh, kèm chú thích (`LessonIllustration.jsx`).
- **Popup nhắc học** — nhắc quay lại khi học viên nghỉ quá 2 ngày; hiển thị số ngày nghỉ, tiến độ và chuyên đề kế tiếp chưa học (`StudyReminderModal.jsx`, `utils/studyReminder.js`).
- **Sơ đồ số liệu cho từng bài** — 36 sơ đồ, bộ kết xuất dữ liệu-hoá 5 kiểu `compare / bars / flow / funnel / stats` (`LessonVisual.jsx`, `data/lessonVisuals.js`).
- **16 bài học chuyên sâu** có dẫn chứng số liệu tính được, bổ sung vào cả 11 chuyên đề.
- **22 câu hỏi kiểm tra**, nâng từ 3 lên 5 câu mỗi chuyên đề.
- **Hoạ tiết trang trí Bằng Chứng Nhận** — vàng đồng và xanh ngọc bích: khung viền đôi, bốn góc mạch điện, dải phân cách có hạt kim cương.
- **Mã xác thực riêng theo học viên** — `PMC-<năm>-XXXX-XXXX`, sinh bằng hàm băm, tất định.
- **Tự động đẩy mã lên GitHub** sau mỗi phiên làm việc (`.claude/hooks/auto-push.sh`).
- **Chỉ số lượt truy cập hôm nay** trên bảng quản trị.

### Thay đổi

- **Bằng Chứng Nhận chuyển sang nền trắng**, bỏ con dấu logo ở chân bằng, tên người ký chỉ còn xuất hiện một lần dưới dạng chữ ký vàng.
- **Bản xem trước chứng nhận** đổi sang bảng màu cố định khớp template xuất file, không còn phụ thuộc giao diện sáng/tối.
- **Công thức đếm lượt truy cập** — từ "mỗi lần tải trang" sang "một khách một ngày", mốc khởi điểm từ 500 xuống 100, ngày chốt theo giờ Việt Nam. Dùng document mới `traffic_daily_v3`, số liệu cũ không mang sang.
- **Nút In Bằng** in từ ảnh đã dựng thay vì gọi `window.print()` trên toàn trang.
- **Tên tệp tải về** bỏ dấu tiếng Việt.
- `README.md` thay bản mẫu Vite mặc định bằng tài liệu thật của dự án.

### Sửa lỗi

- **Tải Bằng Chứng Nhận hỏng hoàn toàn.** html2canvas 1.4.1 ném lỗi `Attempting to parse an unsupported color function "oklab"` khi gặp `oklch()` / `color-mix()` do Tailwind v4 sinh ra. Cả PNG, PDF lẫn nút dành cho iPad đều chết cùng một chỗ. Đã tách template xuất file dùng màu hex nội tuyến.
- **PDF bị cắt mất phần dưới.** Công thức chiều cao không kẹp vào khổ A4: khung 814×674 cho ra chiều cao 245,92 mm trên trang 210 mm, mất 14,6% phía dưới gồm chữ ký và mã xác thực.
- **`recordRealTrafficVisit()` treo vĩnh viễn** do `await setDoc(...)` không bao giờ resolve khi offline, khiến bộ đếm đứng im.
- **`lessonsCount` sai ở 10/11 chuyên đề** — giao diện ghi 3 bài nhưng chỉ có 1–2; chuyên đề 05 và 09 ghi 4 bài mà chỉ có 1.
- **Sơ đồ minh hoạ lặp ở mọi bài** — `VisualDiagram` nhận `sectionId` nhưng không dùng, chỉ lọc theo `moduleId`.
- **`recordStudentAccountToCloud` được gọi ở 3 chỗ trong `App.jsx` nhưng chưa import** — mỗi lần lưu/tải tiến độ đều ném `ReferenceError`, hồ sơ học viên không đồng bộ lên Firestore.
- **Watermark logo hiện thành khối chữ nhật sáng viền cứng** trên Bằng Chứng Nhận.
- **Góc trang trí cắt ngang chữ** ở chân Bằng Chứng Nhận.
- **Mũi tên trong tranh chuyên đề 01 chỉ ra ngoài** thay vì cắm vào tâm bia.
- **Số liệu ảo cứng trong mã** — `501` ở ba chỗ hiển thị và `158421` làm giá trị mặc định.

### Gỡ bỏ

- **Tài khoản dùng thử** `hocvien@pmarcom.edu.vn`. Gỡ khỏi dữ liệu mồi, chặn ở cả đăng nhập lẫn đăng ký, dọn khỏi localStorage của máy đã chạy bản cũ, xoá dòng gợi ý trong thông báo lỗi và các chuỗi dịch liên quan.
- Hàm `fillQuickDemo` và `fillAdminDemo` (mã chết, không nút nào gọi).
- Con dấu tròn "CERTIFIED" ở chân Bằng Chứng Nhận.

### Bảo mật

- Thêm `.env` và `.env.*` vào `.gitignore`. Bắt buộc phải có trước khi bật hook tự động đẩy mã, vì script dùng `git add -A` nên tệp `.env` chứa khoá thật sẽ bị đẩy thẳng lên kho công khai.

---

## Trước 2026-07-27

TODO — lịch sử trước mốc này chưa được tổng hợp. Kho mã có 78 commit, phần lớn mang thông điệp tự động dạng `chore: tự động lưu ...` nên không đủ chi tiết để dựng lại changelog. Commit thủ công gần nhất có nội dung rõ ràng: `b018e0c feat: Instantly update profile and close modal to return to home page upon clicking Save Changes`.
