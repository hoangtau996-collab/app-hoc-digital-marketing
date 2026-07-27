# ARCHITECTURE — Cấu trúc kỹ thuật

> Danh mục hàm chi tiết nằm ở [API_INDEX.md](API_INDEX.md); lược đồ dữ liệu nằm ở [DATABASE.md](DATABASE.md).

## Kiểu kiến trúc

Ứng dụng một trang (SPA) thuần client, **không có backend riêng**. Trình duyệt gọi thẳng Firebase Auth và Cloud Firestore. Toàn bộ định tuyến là chuyển đổi state trong React, không dùng thư viện router.

```
Trình duyệt
   └── React 19 (Vite)
         ├── State cục bộ trong App.jsx  ──► localStorage (bền vững + dự phòng)
         └── src/firebase.js             ──► Firebase Auth
                                         └─► Cloud Firestore
```

## Cây thư mục

```
src/
├── App.jsx                 Thành phần gốc: toàn bộ state chia sẻ, điều phối tab và modal
├── main.jsx                Điểm khởi động, bọc <StrictMode> và ErrorBoundary
├── index.css               Tailwind v4 + lớp tuỳ biến + quy tắc giao diện sáng
├── App.css                 CSS còn lại từ mẫu Vite
├── firebase.js             Toàn bộ giao tiếp Firebase + thống kê truy cập
├── components/             19 thành phần giao diện
├── data/                   Dữ liệu tĩnh (khoá học, từ điển, tin tức, công cụ, ngôn ngữ)
└── utils/                  Logic thuần, không phụ thuộc React
```

## Điều hướng state

`App.jsx` giữ toàn bộ state dùng chung và truyền xuống bằng props. Không dùng Context hay thư viện quản lý state.

State chính:

| State | Vai trò |
|---|---|
| `activeTab` | Tab đang mở: `course` / `news` / `tools` / … |
| `selectedModuleId` | `null` = màn tổng quan, chuỗi = đang xem chuyên đề |
| `currentUser` | Học viên đang đăng nhập, `null` nếu là khách |
| `completedModules` | Mảng id chuyên đề đã đạt |
| `trafficStats` | Số liệu lượt truy cập và học viên |
| `isCertOpen` / `isAuthOpen` / `isProfileOpen` / `isAdminOpen` / `isReminderOpen` | Trạng thái các modal |

## Thành phần giao diện

### Khung ứng dụng

| Thành phần | Vai trò |
|---|---|
| `Header` | Thanh trên: tìm kiếm, chuyển tab, ngôn ngữ, giao diện sáng/tối, lượt truy cập |
| `Sidebar` | Danh sách 11 chuyên đề và tiện ích |
| `FeatureMenuBar` | Dải nút truy cập nhanh các khu vực |
| `MobileBottomNav` | Điều hướng dưới cùng cho màn hình nhỏ |
| `PMarcomLogo` | Logo dùng lại nhiều nơi |

### Học tập

| Thành phần | Vai trò |
|---|---|
| `CourseOverview` | Màn tổng quan: banner, số liệu, lưới chuyên đề |
| `LessonViewer` | Trình đọc bài học; tự phân tích Markdown rút gọn |
| `LessonIllustration` | Tranh khái niệm SVG, tra theo `moduleId` |
| `LessonVisual` | Sơ đồ số liệu, tra theo `sectionId` |
| `QuizComponent` | Bài kiểm tra trắc nghiệm, hiển thị toàn bộ câu cùng lúc |

### Modal

| Thành phần | Vai trò |
|---|---|
| `AuthModal` | Đăng ký và đăng nhập |
| `CertificateModal` | Xem trước và xuất Bằng Chứng Nhận |
| `UserProfileModal` | Hồ sơ học viên |
| `AdminDashboardModal` | Bảng quản trị học viên |
| `StudyReminderModal` | Nhắc quay lại học |

### Tiện ích

| Thành phần | Vai trò |
|---|---|
| `DigitalGlossary` | Từ điển thuật ngữ |
| `LiveNewsFeed` | Bản tin thuật toán |
| `ManagerTools` | Công cụ tính ngân sách và nhân sự |
| `AIStrategyAdvisor` | Cố vấn chiến lược |

## Trình kết xuất Markdown rút gọn

`LessonViewer` tự phân tích chuỗi `content` của mỗi bài. **Chỉ hỗ trợ** các cú pháp sau:

| Cú pháp | Kết quả |
|---|---|
| `### ` | Tiêu đề cấp 4 |
| `#### ` | Tiêu đề cấp 5 |
| `* ` hoặc `- ` | Gạch đầu dòng |
| `1. ` | Danh sách đánh số |
| `**đậm**` | Chữ đậm |

Không hỗ trợ bảng, khối mã, trích dẫn, liên kết. Viết sai cú pháp sẽ hiển thị ra văn bản thô. Xem [CONTRIBUTING.md](CONTRIBUTING.md#thêm-nội-dung-bài-học).

## Hai lớp minh hoạ

Hai lớp tách biệt, không trùng vai trò:

| Lớp | Tệp | Khoá tra | Nội dung |
|---|---|---|---|
| Tranh khái niệm | `LessonIllustration.jsx` | `moduleId` | 11 tranh SVG, một tranh cho cả chuyên đề |
| Sơ đồ số liệu | `LessonVisual.jsx` + `data/lessonVisuals.js` | `sectionId` | 36 sơ đồ, mỗi bài học một sơ đồ |

`LessonVisual` là bộ kết xuất dữ liệu-hoá với 5 kiểu: `compare`, `bars`, `flow`, `funnel`, `stats`. Thêm sơ đồ mới chỉ cần khai báo thêm một mục trong `LESSON_VISUALS`.

**Ràng buộc Tailwind:** tên lớp phải là chuỗi tĩnh. `LessonVisual` dùng bảng `TONE` ánh xạ tên màu sang chuỗi lớp đầy đủ; không được ghép động kiểu `text-${color}-300` vì trình quét Tailwind sẽ không sinh ra lớp đó.

## Lớp utils

| Tệp | Vai trò |
|---|---|
| `utils/certificateExport.js` | Dựng và xuất Bằng Chứng Nhận (PNG/PDF), sinh mã xác thực |
| `utils/studyReminder.js` | Logic ngưỡng thời gian cho popup nhắc học |

Cả hai đều là logic thuần, không phụ thuộc React, nên kiểm chứng được độc lập.

## Luồng dữ liệu quan trọng

### Tiến độ học

```
QuizComponent đạt chuẩn
   └─► App.completedModules
         ├─► localStorage `dmm_completed_modules_<userId>`
         └─► saveUserProgressToCloud() ─► Firestore
```

### Xuất Bằng Chứng Nhận

```
CertificateModal
   └─► renderCertificateCanvas()   dựng node A4 ngoài màn hình (1400×990, màu hex nội tuyến)
         └─► html2canvas ─► <canvas>
               ├─► toDataURL('image/png')  ─► tải PNG
               └─► jsPDF.addImage()        ─► tải PDF A4 ngang
```

Template xuất file **cố định kích thước và dùng màu hex nội tuyến**, không tái sử dụng DOM Tailwind. Lý do tại [DECISION.md](DECISION.md#adr-001).

## Xử lý lỗi

`main.jsx` bọc ứng dụng trong một ErrorBoundary dạng class. Ngoài ra, hầu hết lời gọi Firebase và `localStorage` đều nằm trong `try/catch` và có nhánh dự phòng cục bộ.

## Kiểm thử

TODO — dự án chưa có bộ kiểm thử tự động, chưa có `test` trong `package.json`.
