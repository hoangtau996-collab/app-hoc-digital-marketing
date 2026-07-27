# SUMMARY — Tóm tắt hiện trạng

Cập nhật: **2026-07-27**

## Một câu

Ứng dụng web học Digital Marketing 11 chuyên đề, chạy hoàn toàn phía client bằng React + Vite, dữ liệu lưu trên Firebase, cấp Bằng Chứng Nhận xuất PNG/PDF.

## Quy mô

| Hạng mục | Số lượng |
|---|---|
| Chuyên đề | 11 |
| Bài học | 36 |
| Câu hỏi kiểm tra | 55 (5 câu/chuyên đề) |
| Tranh minh hoạ chuyên đề | 11 |
| Sơ đồ số liệu | 36 (mỗi bài một sơ đồ) |
| Thành phần React | 19 |
| Tệp dữ liệu tĩnh | 6 |
| Commit trên `master` | 78 |

## Tình trạng kỹ thuật

| Mục | Trạng thái |
|---|---|
| Build | Thành công |
| Lint | Chạy được, còn cảnh báo mức `warning` (biến `catch` không dùng, import thừa) |
| Kiểm thử tự động | **Chưa có** |
| CI/CD | **Chưa có** |
| Cấu hình triển khai | **Chưa có trong kho mã** |
| Firestore Security Rules | **Chưa có trong kho mã** |
| Kích thước gói JS | Vượt ngưỡng cảnh báo 500 kB |

## Chức năng đang chạy

- Đăng ký, đăng nhập qua Firebase Auth, có dự phòng localStorage.
- Học 36 bài, mỗi bài có sơ đồ số liệu riêng; mỗi chuyên đề có tranh minh hoạ riêng.
- Bài kiểm tra 5 câu mỗi chuyên đề, hiển thị toàn bộ câu cùng lúc, có giải thích đáp án.
- Bằng Chứng Nhận nền trắng, khổ A4 ngang, mã xác thực riêng theo từng học viên, xuất PNG và PDF, in trực tiếp.
- Thống kê lượt truy cập cộng dồn theo ngày, mốc khởi điểm 100.
- Popup nhắc quay lại học khi nghỉ quá 2 ngày.
- Từ điển thuật ngữ, bản tin thuật toán, bộ công cụ quản lý, cố vấn chiến lược.
- Giao diện sáng/tối, song ngữ Việt/Anh.

## Rủi ro nổi bật

Chi tiết và cách xử lý: [TODO.md](TODO.md).

1. **Mật khẩu lưu dạng chữ thường** trong `dmm_users_db` ở localStorage (nhánh dự phòng offline).
2. **Tài khoản quản trị nằm cứng trong mã nguồn** với mật khẩu yếu.
3. **Không có Security Rules trong kho mã** — ứng dụng không có backend nên đây là lớp bảo vệ duy nhất.
4. **Giá trị Firebase dự phòng là chuỗi giữ chỗ** — quên đặt biến môi trường thì ứng dụng vẫn chạy nhưng hỏng âm thầm.
5. **Không có kiểm thử tự động** — mọi thay đổi phải kiểm tra thủ công.

## Đã sửa gần đây

Xem [CHANGELOG.md](CHANGELOG.md) để biết chi tiết. Đáng chú ý: chức năng tải Bằng Chứng Nhận trước đây **hỏng hoàn toàn**; `lessonsCount` sai ở 10/11 chuyên đề; sơ đồ minh hoạ bị lặp ở mọi bài trong cùng chuyên đề; `recordStudentAccountToCloud` được gọi nhưng chưa import.

## Việc đang làm

Xem [TASK.md](TASK.md).
