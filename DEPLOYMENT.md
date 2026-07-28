# DEPLOYMENT — Đóng gói và triển khai

## Trạng thái hiện tại

**Địa chỉ chạy thật: <https://academy.pmarcom.com/>** — chủ dự án xác nhận ngày 2026-07-28.

Hạ tầng là **Vercel**: bản ghi DNS của `academy.pmarcom.com` trỏ tới `vercel-dns-017.com`. Việc triển khai chạy tự động theo commit, không qua bước thủ công nào.

**Kho mã không chứa bất kỳ tệp cấu hình triển khai nào** — không có `vercel.json`, `netlify.toml`, `firebase.json`, `Dockerfile` hay thư mục `.github/`. Nghĩa là dự án đang dùng cấu hình mặc định Vercel tự dò cho Vite, và mọi thiết lập (biến môi trường, tên miền, nhánh deploy) chỉ tồn tại trên bảng điều khiển Vercel, không được ghi lại trong kho mã.

TODO — cân nhắc thêm `vercel.json` để thiết lập bám theo kho mã thay vì chỉ nằm trên bảng điều khiển.

### Tên miền phải sửa tay khi thay đổi

`index.html` ghi cứng `https://academy.pmarcom.com` ở các thẻ chia sẻ mạng xã hội (canonical, `og:url`, ba thẻ `og:image`, `twitter:image`, `linkedin:image`, `link[rel=image_src]`, `itemprop=image` và khối JSON-LD). Bắt buộc phải tuyệt đối vì trình quét của Zalo, WhatsApp, Viber và LINE không chạy JavaScript nên không phân giải được đường dẫn tương đối. Đổi tên miền thì phải sửa hết các chỗ đó cùng lúc.

## Đóng gói

```bash
npm install
npm run build     # xuất ra thư mục dist/
npm run preview   # xem thử bản đã đóng gói
```

Kết quả là trang tĩnh trong `dist/`, phục vụ được bằng bất kỳ static host nào. Vì là SPA không dùng router, không cần cấu hình rewrite.

`dist/` đã nằm trong `.gitignore`.

### Cảnh báo kích thước gói

Bản build hiện phát cảnh báo: gói JavaScript chính vượt 500 kB sau khi rút gọn (phần lớn đến từ Firebase SDK, html2canvas và jsPDF). Ứng dụng vẫn chạy được. Hướng xử lý: xem [TODO.md](TODO.md#hiệu-năng).

## Biến môi trường

`src/firebase.js` đọc 7 biến. Vite chỉ nạp biến có tiền tố `VITE_`.

| Biến | Bắt buộc |
|---|---|
| `VITE_FIREBASE_API_KEY` | có |
| `VITE_FIREBASE_AUTH_DOMAIN` | có |
| `VITE_FIREBASE_PROJECT_ID` | có |
| `VITE_FIREBASE_STORAGE_BUCKET` | có |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | có |
| `VITE_FIREBASE_APP_ID` | có |
| `VITE_FIREBASE_MEASUREMENT_ID` | có |

### Cảnh báo về giá trị dự phòng

Mỗi biến đều có giá trị dự phòng viết sẵn trong `src/firebase.js`. Các giá trị này là **chuỗi giữ chỗ, không phải cấu hình thật**, ví dụ khoá API dự phòng là `"AIzaSyD-PMarcomAcademyKeyDemo2026"`.

Hệ quả: nếu triển khai mà **quên** đặt biến môi trường, ứng dụng vẫn khởi động bình thường nhưng mọi thao tác Firebase sẽ thất bại âm thầm và rơi về nhánh dự phòng localStorage. Sau khi triển khai phải kiểm tra thực tế rằng dữ liệu có lên Firestore.

### Tệp `.env`

Kho mã hiện **không có** tệp `.env` nào. `.gitignore` đã chặn `.env` và `.env.*` (trừ `.env.example`).

TODO — chưa có `.env.example`; nên bổ sung để người mới biết cần khai báo những gì.

## Firebase

Cần bật trên Firebase Console:

1. **Authentication** — phương thức Email/Password.
2. **Cloud Firestore** — các collection và document mô tả tại [DATABASE.md](DATABASE.md).
3. **Security Rules** — chưa có trong kho mã, xem [DATABASE.md](DATABASE.md#bảo-mật).

## Tài nguyên tĩnh

`public/` được sao chép nguyên trạng vào `dist/`:

- `pmarcom-logo.jpg` — logo, dùng cho favicon và Bằng Chứng Nhận
- `og-cover.png` — ảnh xem trước khi chia sẻ mạng xã hội (1200×630)
- `favicon.svg`, `icons.svg`

`index.html` có sẵn thẻ Open Graph và Twitter Card, kèm một đoạn script tự chuyển đường dẫn ảnh xem trước sang dạng tuyệt đối theo tên miền đang chạy.

TODO — thẻ `<link rel="canonical">` đang trỏ cứng `https://pmarcom.edu.vn`; cần xác nhận đây có phải tên miền chính thức không.

## Tự động đẩy mã lên GitHub

Kho mã có hook Claude Code tại `.claude/settings.json`, chạy `.claude/hooks/auto-push.sh` ở hai sự kiện `Stop` và `SessionEnd`: tự động commit toàn bộ thay đổi và đẩy lên `origin/master`.

Đây là **công cụ hỗ trợ phát triển, không phải quy trình triển khai**. Chi tiết cách hoạt động và cơ chế an toàn: [DECISION.md](DECISION.md#adr-004).
