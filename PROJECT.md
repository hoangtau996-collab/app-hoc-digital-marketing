# PROJECT — Bối cảnh và phạm vi

> Mục tiêu, đối tượng, phạm vi của dự án. Cấu trúc kỹ thuật nằm ở [ARCHITECTURE.md](ARCHITECTURE.md); hiện trạng nằm ở [SUMMARY.md](SUMMARY.md).

## Sản phẩm

Nền tảng học trực tuyến của **HỌC VIỆN P MARCOM**, đào tạo Digital Marketing ở cấp quản lý (định hướng vai trò Trưởng phòng Digital Marketing).

Toàn bộ giao diện mặc định bằng **tiếng Việt**, có cơ chế song ngữ Việt / Anh qua `TRANSLATIONS` (mức độ phủ: xem [TODO.md](TODO.md)).

## Đối tượng người dùng

Ba nhóm được nhận diện trực tiếp từ mã nguồn:

| Vai trò | Cách nhận biết trong mã | Quyền |
|---|---|---|
| Khách vãng lai | `currentUser === null` | Xem tổng quan, từ điển, tin tức, bộ công cụ. **Không** vào được bài học và bài kiểm tra |
| Học viên | có `currentUser` | Học 11 chuyên đề, làm bài kiểm tra, nhận Bằng Chứng Nhận |
| Quản trị viên | bản ghi có `role: 'admin'` | Mở `AdminDashboardModal`, quản lý danh sách học viên, cấp bằng thủ công |

## Phạm vi chức năng hiện có

1. **Đăng ký / đăng nhập** — Firebase Auth (email + mật khẩu), có cơ chế dự phòng bằng `localStorage` khi Cloud không sẵn sàng.
2. **Học 11 chuyên đề** — tổng 36 bài học, mỗi bài có nội dung Markdown rút gọn, sơ đồ số liệu và tranh minh hoạ.
3. **Bài kiểm tra** — 5 câu trắc nghiệm mỗi chuyên đề, tổng 55 câu; có giải thích đáp án.
4. **Bằng Chứng Nhận** — mở khoá khi đạt đủ 11/11 chuyên đề; xuất PNG và PDF khổ A4 ngang, mã xác thực riêng theo từng học viên.
5. **Thống kê lượt truy cập** — cộng dồn lượt khách/ngày, mốc khởi điểm 100.
6. **Nhắc học** — popup nhắc quay lại khi học viên nghỉ quá 2 ngày.
7. **Tiện ích kèm theo** — từ điển thuật ngữ, bản tin thuật toán, bộ công cụ tính ngân sách và nhân sự, cố vấn chiến lược.

## Ngoài phạm vi hiện tại

Các mục dưới đây **không tồn tại** trong mã nguồn tại thời điểm lập tài liệu:

- Thanh toán, đăng ký gói trả phí.
- Video bài giảng (nội dung hiện ở dạng văn bản và đồ hoạ SVG).
- Kiểm thử tự động.
- Backend riêng — ứng dụng nói trực tiếp với Firebase từ trình duyệt.
- Quy trình CI/CD.

## Ràng buộc đã biết

- **Không có backend trung gian**: mọi quy tắc phân quyền phụ thuộc Firestore Security Rules. Xem [DATABASE.md](DATABASE.md#bảo-mật) và [TODO.md](TODO.md).
- **Dữ liệu khoá học nằm cứng trong mã** (`src/data/courseData.js`), sửa nội dung phải sửa mã và đóng gói lại.
- **Cơ chế dự phòng localStorage** khiến dữ liệu có thể lệch giữa các thiết bị. Xem [DECISION.md](DECISION.md).

## Mốc thời gian

TODO — chưa có tài liệu về lộ trình, thời hạn hay các mốc bàn giao.
