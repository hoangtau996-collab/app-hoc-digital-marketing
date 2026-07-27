# DATABASE — Lược đồ dữ liệu

> Danh mục hàm truy cập dữ liệu nằm ở [API_INDEX.md](API_INDEX.md).

Dự án dùng **Cloud Firestore** làm kho chính và **localStorage** làm lớp bền vững kiêm dự phòng khi Cloud không sẵn sàng.

## Cloud Firestore

### Collection `students`

Id tài liệu: `studentData.id` nếu có, hoặc email đã chuẩn hoá (`[^a-z0-9]` thay bằng `_`).

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `id` | string | Id học viên |
| `name` | string | Viết hoa toàn bộ |
| `phone` | string | Mặc định `"Chưa cập nhật"` |
| `email` | string | Đã chuyển thường và cắt khoảng trắng |
| `industry` | string | Mặc định `"Kinh doanh"` |
| `avatarUrl` | string | Có thể rỗng |
| `coverBg` | string | Mặc định `"emerald"` |
| `completedModules` | array&lt;string&gt; | Danh sách id chuyên đề đã đạt |
| `createdAt` | string (ISO) | |
| `updatedAt` | string (ISO) | |

### Collection `registrations`

Ghi **cùng payload** với `students`, cùng id tài liệu. Đây là bản sao chủ ý trong `recordStudentAccountToCloud()`.

TODO — chưa rõ vì sao cần hai collection cùng nội dung; cần xác nhận với chủ dự án trước khi gộp.

### Document `analytics/traffic_daily_v3`

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `totalVisits` | number | Tăng dần bằng `increment(1)`, mỗi khách mỗi ngày một lần |
| `daily` | map&lt;string, number&gt; | Khoá dạng `YYYY-MM-DD` theo giờ Việt Nam (UTC+7) |
| `lastVisitAt` | timestamp | `serverTimestamp()` |

Số hiển thị trên giao diện = `TRAFFIC_BASELINE (100)` + giá trị lớn hơn giữa `totalVisits` và số đếm cục bộ.

### Document `analytics/stats_global`

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `totalEnrolled` | number | Số học viên ghi danh |
| `totalGraduates` | number | Số học viên đạt 11/11 |

## localStorage

### Khoá cố định

| Khoá | Nội dung |
|---|---|
| `dmm_active_user` | Học viên đang đăng nhập (JSON) |
| `dmm_users_db` | Danh sách tài khoản dự phòng khi offline (JSON) |
| `dmm_completed_modules` | Tiến độ khi chưa đăng nhập |
| `dmm_student_name` | Tên hiển thị trên Bằng Chứng Nhận |
| `dmm_language` | `vi` hoặc `en` |
| `dmm_theme` | `light` / `dark` / `system` |
| `dmm_news_feed` | Bản tin đã lưu |
| `dmm_remembered_email` | Email ghi nhớ ở màn đăng nhập |
| `dmm_remember_me_choice` | `'true'` / `'false'` |
| `dmm_traffic_total_v3` | Số lượt truy cập theo ngày đếm tại máy |
| `dmm_traffic_last_date_v3` | Ngày cuối đã tính lượt (`YYYY-MM-DD`, giờ VN) |
| `dmm_real_enrolled_count` | Bản sao cục bộ của `totalEnrolled` |
| `dmm_real_graduates_count` | Bản sao cục bộ của `totalGraduates` |
| `dmm_student_has_graduated` | Cờ chống đếm trùng khi tốt nghiệp |
| `dmm_last_study_at` | Mốc thời gian học gần nhất (epoch ms) |
| `dmm_study_reminder_snoozed_until` | Thời điểm hết tạm hoãn nhắc học (epoch ms) |

### Khoá động

| Mẫu khoá | Nội dung |
|---|---|
| `dmm_completed_modules_<userId>` | Tiến độ theo từng tài khoản |
| `dmm_quiz_results_<moduleId>` | Kết quả bài kiểm tra của một chuyên đề |

## Dữ liệu tĩnh trong mã

Không nằm trong cơ sở dữ liệu, đóng gói cùng ứng dụng:

| Tệp | Xuất khẩu | Quy mô |
|---|---|---|
| `data/courseData.js` | `COURSE_MODULES` | 11 chuyên đề, 36 bài học, 55 câu hỏi |
| `data/lessonVisuals.js` | `LESSON_VISUALS` | 36 sơ đồ |
| `data/glossaryData.js` | `GLOSSARY_CATEGORIES`, `GLOSSARY_ITEMS` | |
| `data/newsData.js` | `INITIAL_NEWS_ITEMS`, `LIVE_NEWS_SIMULATOR_POOL` | |
| `data/toolsData.js` | `INDUSTRY_BENCHMARKS`, `STAFF_ROLES` | |
| `data/translations.js` | `TRANSLATIONS` | vi / en |

## Bảo mật

**Chưa có tệp Firestore Security Rules trong kho mã.** Vì ứng dụng không có backend, mọi ràng buộc ghi/đọc phụ thuộc hoàn toàn vào rules cấu hình trên Firebase Console.

TODO — cần đưa `firestore.rules` vào kho mã và ghi lại nội dung rules đang áp dụng.

Rủi ro đã ghi nhận, xem [TODO.md](TODO.md#bảo-mật):

- Cơ chế dự phòng `dmm_users_db` lưu **mật khẩu dạng chữ thường** trong localStorage.
- Tài khoản quản trị `admin@pmarcom.edu.vn` có mật khẩu nằm cứng trong mã nguồn.
