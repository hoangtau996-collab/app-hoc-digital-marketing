# HỌC VIỆN P MARCOM — Khóa Học Digital Thực Chiến

Ứng dụng web học trực tuyến (SPA) đào tạo Digital Marketing cho cấp quản lý: 11 chuyên đề, bài kiểm tra trắc nghiệm và cấp Bằng Chứng Nhận hoàn thành.

> File này chỉ giới thiệu và hướng dẫn chạy dự án. Xem [PROJECT.md](PROJECT.md) để biết phạm vi, [ARCHITECTURE.md](ARCHITECTURE.md) để biết cấu trúc kỹ thuật.

## Bắt đầu nhanh

```bash
npm install
npm run dev
```

## Lệnh có sẵn

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Máy chủ phát triển Vite kèm HMR |
| `npm run build` | Đóng gói bản production vào `dist/` |
| `npm run preview` | Xem thử bản đã đóng gói |
| `npm run lint` | Chạy Oxlint |

## Công nghệ

| Thành phần | Phiên bản khai báo |
|---|---|
| React | ^19.2.7 |
| Vite | ^8.1.1 |
| Tailwind CSS | ^4.3.3 (qua `@tailwindcss/vite`) |
| Firebase | ^12.16.0 (Auth + Firestore) |
| lucide-react | ^1.26.0 |
| html2canvas | ^1.4.1 |
| jsPDF | ^4.2.1 |
| canvas-confetti | ^1.9.4 |
| Oxlint | ^1.71.0 |

## Biến môi trường

Ứng dụng đọc 7 biến cho Firebase. Chi tiết và cơ chế giá trị dự phòng: [DEPLOYMENT.md](DEPLOYMENT.md#biến-môi-trường).

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

## Tài liệu dự án

| Tài liệu | Nội dung |
|---|---|
| [PROJECT.md](PROJECT.md) | Mục tiêu, phạm vi, đối tượng người dùng |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Cấu trúc thư mục, luồng dữ liệu, thành phần |
| [SUMMARY.md](SUMMARY.md) | Tóm tắt hiện trạng |
| [DATABASE.md](DATABASE.md) | Firestore và localStorage |
| [API_INDEX.md](API_INDEX.md) | Danh mục hàm và module xuất khẩu |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Đóng gói và triển khai |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Quy ước đóng góp |
| [DECISION.md](DECISION.md) | Quyết định kỹ thuật và lý do |
| [CHANGELOG.md](CHANGELOG.md) | Lịch sử thay đổi |
| [TASK.md](TASK.md) | Việc đang làm |
| [TODO.md](TODO.md) | Việc tồn đọng |
| [AI_MEMORY.md](AI_MEMORY.md) | Ngữ cảnh bền vững cho trợ lý AI |
| [PROMPTS.md](PROMPTS.md) | Mẫu câu lệnh làm việc với AI |

## Kho mã

`https://github.com/hoangtau996-collab/app-hoc-digital-marketing` — nhánh chính `master`.

## Giấy phép

TODO — chưa xác định giấy phép cho dự án.
