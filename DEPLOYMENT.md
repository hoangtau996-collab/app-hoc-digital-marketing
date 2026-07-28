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
3. **Security Rules** — tệp `firestore.rules` trong kho mã. **Phải deploy thì mới có tác dụng**, xem ngay bên dưới.

### Security Rules — bắt buộc deploy

`firestore.rules` là **lớp bảo vệ duy nhất** của dự án. Ứng dụng chạy hoàn toàn trong trình duyệt nên không có chỗ nào khác đặt được ranh giới quyền: chưa deploy tệp này thì cơ sở dữ liệu vẫn chạy theo cấu hình cũ trên Console, và bất kỳ ai mở trang web cũng đọc được toàn bộ hồ sơ học viên bằng vài dòng lệnh trong devtools.

**Cách 1 — dán vào Console (nhanh nhất).**

1. Mở `firestore.rules` trong kho mã, chọn hết (`Ctrl+A`) rồi copy.
2. Firebase Console → **Firestore Database** → tab **Rules**.
3. Chọn hết nội dung đang có trong ô soạn thảo rồi **dán đè** — phải thay toàn bộ, không phải chèn thêm vào cuối.
4. Bấm **Publish**.

⚠️ Ô soạn thảo đó chỉ nhận **nội dung rules**. Dán lệnh terminal (`npx ...`) vào sẽ báo `Unexpected 'npx'`.

**Cách 2 — dòng lệnh.** Chạy trong terminal, ở thư mục gốc dự án:

```bash
npx firebase-tools login
npx firebase-tools use <project-id>          # ví dụ: pmarcomacademy
npx firebase-tools deploy --only firestore:rules
```

`firebase.json` trong kho mã đã trỏ sẵn tới `firestore.rules`. Không cần cài `firebase-tools` vào `package.json` vì đây là việc thỉnh thoảng mới chạy.

### Mồi tài khoản quản trị đầu tiên

Rules dùng collection `admins` làm sổ phân quyền: id tài liệu là email chữ thường, có bản ghi nghĩa là có quyền. Sổ rỗng thì **không ai** cấp quyền được cho ai — vì chỉ quản trị viên mới ghi được vào sổ quyền. Phải có bản ghi đầu tiên thì vòng lặp đó mới mở ra.

**Việc này tự động.** Rules mở đúng một ngoại lệ: tài khoản gốc tự tạo bản ghi của chính nó. `App.jsx` (`resolveAdminRole`) gọi bước mồi ngay lần đầu tài khoản gốc đăng nhập mà chưa có trong sổ. Bạn chỉ cần **đăng nhập lại bằng `admin@pmarcom.edu.vn` sau khi publish rules**.

Nếu muốn kiểm tra hoặc tạo tay: Firestore Database → Start collection → Collection ID `admins` → Document ID là email chữ thường (`admin@pmarcom.edu.vn`) → thêm trường `email` (string) là chính email đó.

### Việc phải kiểm tra ngay: tài khoản gốc trên Firebase Auth

Quyền quản trị nay **chỉ cấp cho phiên đăng nhập Firebase Auth thật**. Kéo theo hai việc bắt buộc:

- **`admin@pmarcom.edu.vn` phải tồn tại trong Authentication → Users, với mật khẩu mạnh.** Nếu tài khoản này chưa được tạo, bất kỳ ai cũng có thể đăng ký chiếm email đó và trở thành Quản Trị Tối Cao. Ứng dụng đã chặn đăng ký email này ở form (`AuthModal.jsx`), nhưng chặn ở trình duyệt thì vòng qua được — tạo sẵn tài khoản mới là biện pháp thật.
- **Mật khẩu `admin` viết trong `AuthModal.jsx` không còn cấp quyền gì**, nhưng vẫn nên đổi. Xem [TODO.md](TODO.md#bảo-mật).

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
