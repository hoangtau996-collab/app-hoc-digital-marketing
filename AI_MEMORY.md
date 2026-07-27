# AI_MEMORY — Ngữ cảnh bền vững cho trợ lý AI

Những điều một trợ lý AI cần biết trước khi sửa dự án này, mà **đọc mã nguồn không thấy ngay** — chủ yếu là các cạm bẫy đã thực sự gây hỏng và cách tránh.

Mẫu câu lệnh làm việc: [PROMPTS.md](PROMPTS.md). Quy ước mã: [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Quy tắc chung của dự án

1. **Ngôn ngữ**: giao diện và chú thích trong mã dùng **tiếng Việt**.
2. **Tự động đẩy mã**: hook chạy khi kết thúc phiên sẽ commit và đẩy lên `origin/master`. Không cần đề nghị người dùng push thủ công.
3. **Không có kiểm thử tự động**: mọi thay đổi phải tự kiểm chứng bằng cách chạy thật trên trình duyệt, không suy đoán.

## Cạm bẫy đã thực sự gây hỏng

Mỗi mục dưới đây tương ứng một lỗi đã xảy ra, không phải giả thuyết.

### 1. html2canvas không đọc được màu của Tailwind v4

html2canvas 1.4.1 chỉ hiểu `rgb / rgba / hsl / hsla`. Tailwind v4 sinh `oklch()` và `color-mix(in oklab, …)`. Chụp thẳng DOM Tailwind sẽ **ném lỗi**, không phải chỉ sai màu.

→ Mọi thứ đưa qua html2canvas phải dùng **màu hex nội tuyến**. Xem `utils/certificateExport.js`.

Cũng vì html2canvas: **không dùng SVG hay `radial-gradient`** trong template xuất file. Chỉ dùng `div` + `linear-gradient` + `transform`.

### 2. `await setDoc()` treo vô hạn khi offline

Firestore xếp lệnh ghi vào hàng đợi offline và Promise **không bao giờ resolve, cũng không reject**.

→ Không `await` lệnh ghi Firestore trên đường đi của giao diện. Bắn đi rồi `.catch()`, trả ngay giá trị lấy từ localStorage.

### 3. Bản xem trước phải khớp bản xuất file

Đã có lần bản xem trước nền đen còn file tải về nền trắng. Sửa một bên phải sửa cả bên kia.

→ Chứng nhận: sửa `utils/certificateExport.js` thì phải sửa cả phần xem trước trong `CertificateModal.jsx`.
→ Hoạ tiết dùng chung hàm `certificateDecorHtml()` và `certificateDividerHtml()` để không lệch.

### 4. Tên lớp Tailwind không được ghép động

`text-${color}-300` sẽ không được sinh ra. Dùng bảng ánh xạ sang chuỗi tĩnh — xem `TONE` trong `LessonVisual.jsx`.

### 5. `<StrictMode>` chạy `useEffect` hai lần khi dev

Bất kỳ đoạn đếm hay ghi nhận nào cũng cần cờ chặn lặp. Xem `hasRecordedThisPageLoad` trong `firebase.js`.

### 6. Số đếm hiển thị không được tụt lùi

Trộn số cục bộ và số trên Cloud phải dùng `Math.max`, và hai số phải **cùng đơn vị**. Lỗi cũ là lấy max giữa số toàn cục và số của riêng một máy.

### 7. Cổng 5199 có thể bị dự án khác chiếm

Trên máy phát triển hiện tại từng có một dự án khác (ứng dụng Tarot) chạy ở cổng 5199. Nếu chạy `vite --strictPort` mà thấy giao diện lạ thì đổi cổng.

## Ràng buộc dữ liệu khoá học

Trong `data/courseData.js`:

- `lessonsCount` phải bằng `sections.length`, `quizCount` phải bằng `quiz.length`. Hai số này **từng lệch ở 10/11 chuyên đề**.
- `quiz[].options` đúng 4 lựa chọn, `correct` là chỉ số 0–3.
- `content` chỉ dùng được `###`, `####`, `*`, `-`, `1.`, `**đậm**`. **Không có bảng, không có khối mã.**
- Số liệu minh hoạt không kiểm chứng được phải ghi rõ **"số liệu giả định"**.

## Kích thước phản hồi

Khi sinh khối lượng nội dung lớn (ví dụ viết lại toàn bộ dữ liệu khoá học), **chia nhỏ thành nhiều lượt và ghi xuống đĩa sau mỗi cụm**. Sinh một khối vài chục nghìn ký tự trong một lượt từng làm đứt luồng phản hồi và mất trắng kết quả.

## Điều KHÔNG được suy đoán

Các câu hỏi sau chưa có câu trả lời trong kho mã. Nếu cần, phải hỏi chủ dự án:

- Ứng dụng đang triển khai ở đâu.
- Nội dung Firestore Security Rules đang áp dụng.
- Vì sao ghi trùng dữ liệu vào cả `students` lẫn `registrations`.
- Giấy phép của dự án.
- Lộ trình và các mốc bàn giao.

## Lịch sử quyết định

Lý do đằng sau các lựa chọn kỹ thuật: [DECISION.md](DECISION.md). Đọc file đó trước khi định thay đổi cách xuất Bằng Chứng Nhận, cách đếm lượt truy cập, hay cách sinh mã xác thực.
