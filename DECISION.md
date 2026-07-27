# DECISION — Quyết định kỹ thuật và lý do

Chỉ ghi các quyết định **đọc được từ mã nguồn** kèm lý do đã xác minh. Quyết định chưa rõ lý do được đánh dấu TODO thay vì suy đoán.

---

## ADR-001

**Template xuất Bằng Chứng Nhận tách riêng, dùng màu hex nội tuyến**

**Bối cảnh.** Bản đầu chụp thẳng DOM đang hiển thị bằng html2canvas.

**Vấn đề.** html2canvas 1.4.1 chỉ phân tích được `rgb / rgba / hsl / hsla`, trong khi Tailwind v4 sinh ra `oklch()` và `color-mix(in oklab, …)` cho gần như mọi màu. Lệnh chụp **ném lỗi** `Attempting to parse an unsupported color function "oklab"`, khiến toàn bộ chức năng tải bằng không hoạt động chứ không chỉ sai màu.

**Quyết định.** Dựng một template riêng ngoài màn hình, kích thước cố định 1400×990 (đúng tỉ lệ A4 ngang), toàn bộ màu viết dạng hex/rgba nội tuyến, không dùng lớp Tailwind.

**Hệ quả.**
- Ảnh xuất ra giống nhau trên mọi thiết bị, không phụ thuộc kích thước màn hình hay giao diện sáng/tối.
- Phải giữ đồng bộ bảng màu giữa template xuất file và bản xem trước, nếu không lại tái diễn cảnh xem một đằng tải một nẻo.
- Hoạ tiết trang trí chỉ được dùng `div` + `linear-gradient` + `transform`; **không dùng SVG hay `radial-gradient`** vì html2canvas dựng hai thứ đó rất kém.

---

## ADR-002

**Không `await` lệnh ghi Firestore trên đường đi của giao diện**

**Bối cảnh.** `recordRealTrafficVisit()` ban đầu `await setDoc(...)` rồi mới trả số để hiển thị.

**Vấn đề.** Khi không kết nối được máy chủ, Firestore xếp lệnh ghi vào hàng đợi offline và Promise của `setDoc()` **treo vô thời hạn** chứ không reject. Hàm không bao giờ resolve, bộ đếm trên giao diện đứng im vĩnh viễn.

**Quyết định.** Bắn lệnh ghi rồi đi tiếp (`.catch()` để nuốt lỗi), trả ngay số đếm lấy từ localStorage.

**Hệ quả.** Giao diện luôn phản hồi tức thì. Firestore tự gửi lại khi có mạng. Đổi lại, mã gọi không biết được lệnh ghi đã tới máy chủ hay chưa.

---

## ADR-003

**Minh hoạ bằng SVG nội tuyến, không dùng tệp ảnh**

**Quyết định.** Toàn bộ tranh minh hoạ (`LessonIllustration.jsx`) và sơ đồ (`LessonVisual.jsx`) vẽ bằng SVG nội tuyến hoặc `div` có kiểu, không tải tệp ảnh ngoài.

**Lý do.**
- Không phát sinh yêu cầu mạng nên không bao giờ vỡ ảnh khi rớt mạng.
- Nét sắc ở mọi độ phân giải.
- Mỗi hình dưới 2 KB thay vì hàng trăm KB ảnh bitmap.
- Sơ đồ số liệu đọc thẳng từ dữ liệu khai báo, sửa số là hình đổi theo.

---

## ADR-004

**Tự động commit và đẩy mã sau mỗi phiên làm việc**

**Quyết định.** Hook Claude Code ở `.claude/settings.json` chạy `.claude/hooks/auto-push.sh` tại hai sự kiện `Stop` và `SessionEnd`.

**Cơ chế an toàn đã cài trong script.**
- Không có thay đổi và không có commit tồn đọng thì thoát im lặng, không tạo commit rỗng.
- Đặt `GIT_TERMINAL_PROMPT=0` để git báo lỗi ngay thay vì treo chờ hộp thoại mật khẩu.
- Nếu đẩy hỏng thì **giữ nguyên commit ở máy** và báo lý do; **không tự rebase hay merge** vì làm ngầm rất dễ mất mã.
- Thêm `.env` và `.env.*` vào `.gitignore` trước khi bật, vì script dùng `git add -A`.

**Đánh đổi.** Mọi thay đổi lên thẳng `master`, không có bước xem lại trước khi đẩy. Script cũng không kiểm tra build trước khi đẩy, nên mã đang dở vẫn có thể lên kho.

---

## ADR-005

**Đếm lượt truy cập theo ngày, mốc khởi điểm 100**

**Bối cảnh.** Bản cũ cộng 1 mỗi lần tải trang, mốc khởi điểm 500.

**Vấn đề.** Khách bấm F5 hai mươi lần là cộng hai mươi lượt. Con số phồng lên vô nghĩa, không dùng để xem tỉ lệ khách ghé thăm được. Bản cũ còn lấy `Math.max` giữa số toàn cục trên Cloud và số của riêng một máy — hai đại lượng khác bản chất.

**Quyết định.** Một lượt = một khách trong một ngày. Ngày chốt theo giờ Việt Nam (UTC+7). Công thức hiển thị: `100 + tổng lượt cộng dồn`. Firestore lưu thêm map `daily` để dựng được biểu đồ theo ngày.

**Hệ quả.** Dùng document Firestore mới `traffic_daily_v3`, số liệu cũ không mang sang. Cách đếm dựa vào localStorage nên khách xoá cookie, dùng chế độ ẩn danh hoặc đổi máy sẽ được tính là lượt mới — giới hạn chung của mọi cách đếm phía trình duyệt.

---

## ADR-006

**Mã xác thực Bằng Chứng Nhận sinh bằng hàm băm**

**Quyết định.** Mã dạng `PMC-<năm>-XXXX-XXXX`, sinh bằng FNV-1a rồi mã hoá Crockford Base32 (bỏ các ký tự I, L, O, U dễ đọc nhầm). Hạt giống ưu tiên **email tài khoản**, không dùng tên.

**Lý do.** Dùng email làm hạt giống thì học viên sửa lại họ tên trên bằng, mã vẫn giữ nguyên. Hàm băm cho kết quả tất định nên tải lại bao nhiêu lần cũng ra đúng mã cũ mà không cần lưu trữ gì thêm.

**Đã kiểm chứng.** 200.000 email giả lập cho ra 200.000 mã khác nhau, không va chạm.

---

## ADR-007

**Bỏ tài khoản dùng thử**

**Quyết định.** Tài khoản `hocvien@pmarcom.edu.vn / 123` bị gỡ khỏi dữ liệu mồi, chặn ở cả đường đăng nhập lẫn đăng ký, và **dọn khỏi localStorage ngay khi mở form đăng nhập**.

**Lý do phải dọn localStorage.** Máy nào từng chạy bản cũ vẫn còn tài khoản đó kèm mật khẩu trong `dmm_users_db`. Chỉ xoá dữ liệu mồi trong mã là không đủ.

---

## Quyết định chưa rõ lý do

| Quyết định | Ghi chú |
|---|---|
| Ghi trùng dữ liệu vào cả `students` lẫn `registrations` | TODO — chưa rõ vì sao cần hai collection cùng nội dung |
| Không dùng thư viện router | TODO — chưa rõ là chủ ý hay do phạm vi ban đầu nhỏ |
| Tài khoản quản trị nằm cứng trong mã | TODO — cần xác nhận đây là giải pháp tạm hay lâu dài. Xem [TODO.md](TODO.md#bảo-mật) |
