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

- **Trợ lý Pipi** thay ô tìm kiếm "Tra cứu bài học / Thuật ngữ", kèm **nút nổi góc phải** có hiệu ứng (trôi nhẹ, vòng sóng lan, chớp mắt, bóng chào định kỳ). Tra thuật ngữ, tìm bài học và tính ROAS / CPA / CPL / CTR / CVR / CPM / ngân sách. Chạy hoàn toàn tại máy, không gọi API.

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

- **Đổi bộ màu toàn ứng dụng** sang Indigo Dye `#6495ED` + Rose Pink `#FFDAE9` + Egg Shell `#F0EAD6`, nền sáng làm mặc định. Thực hiện bằng cách **định nghĩa lại thang màu Tailwind** trong `@theme` (`src/index.css`) nên khoảng 1.330 lượt dùng lớp `emerald-*` / `amber-*` / `teal-*` đổi theo mà không phải sửa 26 tệp; kèm ánh xạ 90 mã hex nền tối sang navy. **Bằng Chứng Nhận được miễn trừ** — vẫn giữ tông trắng + vàng đồng vì in ra giấy.
- **Bỏ chữ "(MIỄN PHÍ)"** ở nhãn trị giá khoá học; ba ô "CHỈ CÒN 39 SUẤT" nay bấm được và dẫn thẳng tới đăng ký học viên (người đã đăng nhập thì vào thẳng Chuyên đề 01).
- **Trợ lý Pipi chỉ còn một lối vào** — nút nổi góc phải; đã bỏ nút trùng trong thanh menu.
- **Rà soát tương phản toàn bộ 11 màn** sau khi đổi màu (tổng quan, bài học, bài kiểm tra, từ điển, tin tức, công cụ, chứng nhận, quản trị, Pipi, và 2 màn ở chế độ tối) bằng phép đo tỉ lệ tương phản WCAG. Không còn chỗ nào dưới ngưỡng.
- **Bằng Chứng Nhận chuyển sang nền trắng**, bỏ con dấu logo ở chân bằng, tên người ký chỉ còn xuất hiện một lần dưới dạng chữ ký vàng.
- **Bản xem trước chứng nhận** đổi sang bảng màu cố định khớp template xuất file, không còn phụ thuộc giao diện sáng/tối.
- **Công thức đếm lượt truy cập** — từ "mỗi lần tải trang" sang "một khách một ngày", mốc khởi điểm từ 500 xuống 100, ngày chốt theo giờ Việt Nam. Dùng document mới `traffic_daily_v3`, số liệu cũ không mang sang.
- **Nút In Bằng** in từ ảnh đã dựng thay vì gọi `window.print()` trên toàn trang.
- **Tên tệp tải về** bỏ dấu tiếng Việt.
- `README.md` thay bản mẫu Vite mặc định bằng tài liệu thật của dự án.

### Sửa lỗi

- **Gradient nền tối không đổi theo giao diện sáng.** Quy tắc nền sáng chỉ bắt `from-emerald-950/900`, bỏ sót 13 chỗ dùng `via-` và `to-` với điểm dừng tối (`via-emerald-950`, `to-teal-950`, `to-slate-950`…). Các thẻ đó giữ nguyên nền tối trên giao diện sáng khiến chữ chìm — rõ nhất ở thẻ hồ sơ học viên trên thanh menu. Gradient nằm ở `background-image` nên `background-color` không đè được, phải tắt riêng.

- **Xoá học viên trong bảng quản trị không có tác dụng, F5 là dữ liệu quay lại.** Ba nguyên nhân cộng lại: (a) `SAMPLE_STUDENTS` luôn được trộn lại ở cả `loadStudentsList` lẫn listener realtime nên học viên mẫu không thể xoá; (b) lệnh xoá chỉ chạm Firestore `students` theo đúng một `studentId`, bỏ sót `registrations` và bỏ sót tài liệu mang id suy từ email; (c) sau khi xoá, mã ghi **danh sách hiển thị đã trộn dữ liệu mẫu** ngược vào `dmm_users_db`, khiến học viên mẫu bám vĩnh viễn. Nay thêm cơ chế bia mộ `dmm_deleted_students` làm chốt chặn cuối, cùng `deleteStudentEverywhere()` quét đủ 4 kho.
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

- **Chặn học viên vào Bảng Quản Trị.** Trước đây không có kiểm tra quyền ở bất kỳ tầng nào: nút hiện với mọi người kể cả khách chưa đăng nhập, và ai bấm cũng xem/xuất được danh sách học viên kèm tên, email, số điện thoại. Kèm theo đó, bộ làm sạch `currentUser` trong App.jsx nuốt mất trường `role` nên không tầng nào phân biệt được admin. Nay giữ lại `role` và chặn ở 3 tầng: ẩn nút, guard hàm mở, và modal tự từ chối hiển thị. **Lưu ý:** `role` đọc từ localStorage nên đây là rào chắn giao diện, không thay thế được Firestore Security Rules.

- **Bỏ lưu mật khẩu dạng chữ thường trong localStorage.** Nhánh đăng nhập dự phòng (`dmm_users_db`) trước đây ghi thẳng mật khẩu học viên xuống đĩa. Nay dùng SHA-256 kèm muối ngẫu nhiên riêng từng bản ghi (`utils/localCredentials.js`). Bản ghi cũ vẫn đăng nhập được và **tự nâng cấp sang muối + băm ngay lần đăng nhập kế tiếp**, trường `password` bị xoá khỏi bản ghi. Trên trang chạy http thuần (không có Web Crypto), tài khoản mới sẽ không lưu phần mật khẩu — mất khả năng đăng nhập offline nhưng không để lộ mật khẩu.
- Thêm `.env` và `.env.*` vào `.gitignore`. Bắt buộc phải có trước khi bật hook tự động đẩy mã, vì script dùng `git add -A` nên tệp `.env` chứa khoá thật sẽ bị đẩy thẳng lên kho công khai.

---

## Trước 2026-07-27

TODO — lịch sử trước mốc này chưa được tổng hợp. Kho mã có 78 commit, phần lớn mang thông điệp tự động dạng `chore: tự động lưu ...` nên không đủ chi tiết để dựng lại changelog. Commit thủ công gần nhất có nội dung rõ ràng: `b018e0c feat: Instantly update profile and close modal to return to home page upon clicking Save Changes`.
