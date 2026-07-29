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
| `role` | string | `'admin'` hoặc vắng mặt. `recordStudentAccountToCloud()` **chỉ ghi khi bằng `'admin'`** — ghi cả `'student'` sẽ khiến máy chưa biết mình vừa được nâng quyền xoá mất quyền vừa cấp. Hạ quyền đi bằng `setStudentRoleInCloud()` |
| `createdAt` | string (ISO) | |
| `updatedAt` | string (ISO) | |

### Collection `registrations`

Ghi **cùng payload** với `students`, cùng id tài liệu. Đây là bản sao chủ ý trong `recordStudentAccountToCloud()`.

TODO — chưa rõ vì sao cần hai collection cùng nội dung; cần xác nhận với chủ dự án trước khi gộp.

### Collection `admins` — sổ phân quyền

Id tài liệu: **email đã chuẩn hoá về chữ thường** (ví dụ `admin@pmarcom.edu.vn`). Có bản ghi = có quyền quản trị.

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `email` | string | Chính là id tài liệu, lưu lại cho dễ đọc |
| `grantedBy` | string | Email của quản trị viên đã cấp quyền |
| `grantedAt` | string (ISO) | Thời điểm cấp |

Đây là **nguồn khẳng định duy nhất** của quyền quản trị. `dmm_admin_emails` trong localStorage chỉ là bộ nhớ đệm của collection này.

Ràng buộc do [firestore.rules](firestore.rules) áp đặt ở phía máy chủ:

- Đọc bản ghi của chính mình: mọi tài khoản đã đăng nhập. Liệt kê cả sổ: chỉ quản trị viên.
- Tạo bản ghi mới: **chỉ quản trị viên hiện hành**. Đây là điều chặn người ngoài tự phong — không có quyền thì không ghi được vào sổ quyền.
- Ngoại lệ mồi lần đầu: tài khoản gốc tự tạo bản ghi của chính nó khi sổ còn rỗng.
- Sửa/xoá bản ghi của tài khoản gốc: **không ai được phép**, kể cả quản trị viên khác.

### Collection `support_messages` — hộp thư hỗ trợ

Id tài liệu: **do Firestore tự sinh**. Cố ý không đặt theo email — một học viên gửi được nhiều lời nhắn, đặt id theo email thì lần sau ghi đè mất lần trước.

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `name` | string | Tên học viên lúc gửi, tối đa 120 ký tự |
| `email` | string | **Bắt buộc khớp email trong ID token** — rules chặn ở máy chủ |
| `phone` | string | Lấy từ hồ sơ, để Ban Quản Trị gọi lại |
| `message` | string | Nội dung, 1–2000 ký tự (trần khớp `SUPPORT_MESSAGE_MAX` trong `src/firebase.js`) |
| `status` | string | `new` → `read` → `done`. Lúc tạo bắt buộc là `new` |
| `createdAt` | string (ISO) | Dùng để sắp xếp — một trường nên Firestore tự lo chỉ mục |
| `createdAtServer` | timestamp | `serverTimestamp()`, mốc thời gian không giả được từ máy khách |
| `handledBy` | string | Email quản trị viên đã đổi trạng thái |
| `handledAt` | string (ISO) | Thời điểm đổi trạng thái |

Ràng buộc do [firestore.rules](firestore.rules) áp đặt ở phía máy chủ:

- Gửi: **phải đăng nhập**, và `email` phải khớp email trong ID token. Không có điều kiện này thì ai cũng gửi được lời nhắn mạo danh học viên khác.
- `status` lúc tạo ép cứng là `new`: người gửi không tự đánh dấu lời nhắn của mình là đã xử lý, nếu không nó sẽ không bao giờ nổi lên trong bộ đếm chưa đọc.
- Độ dài `message` chặn **trong rules**, không chỉ ở ô nhập — giới hạn trên giao diện chỉ ràng buộc người dùng ô nhập đó.
- Đọc: quản trị viên đọc tất cả; học viên chỉ đọc lại lời nhắn của chính mình.
- Sửa trạng thái và xoá: **chỉ quản trị viên**. Học viên không sửa lại được lời nhắn đã gửi.

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
| `reconciledAt` | string (ISO) | Lần đối soát gần nhất với dữ liệu thật |

**Giá trị lưu ở đây là SỐ THẬT, không bao gồm mốc khởi điểm.** Ba mốc hiển thị (`TRAFFIC_BASELINE = 190`, `ENROLLED_BASELINE = 69`, `GRADUATE_BASELINE = 30` trong `src/firebase.js`, chủ dự án ấn định 2026-07-28) chỉ được cộng ở **tầng hiển thị**. Ghi mốc xuống Firestore sẽ khiến mỗi lần đối soát cộng thêm một lần nữa và số phình lên vô hạn.

**Đây là bộ nhớ đệm, không phải nguồn sự thật.** Nguồn đúng là đếm trực tiếp trên collection `students`, nhưng chỉ quản trị viên đọc được toàn bộ collection đó, nên trang công khai buộc phải đọc con số đã lưu sẵn ở đây.

Hai đường ghi:

- **Cộng dồn** (`increment(1)`) khi có sự kiện thật — đăng ký thành công lên máy chủ, hoặc học viên đạt 11/11. Cho cảm giác realtime nhưng **trôi dần**: cộng cả lần thất bại, cộng lại khi học viên đổi máy, và không trừ khi quản trị viên xoá học viên.
- **Đối soát** (`reconcileGlobalStats`) — Bảng Quản Trị đếm thật trên `students` rồi ghi đè giá trị chính xác, mỗi lần mở bảng. Firestore Rules chỉ cho quản trị viên ghi giá trị tuỳ ý; người thường chỉ được cộng tối đa 1.

Lỗi đã sửa: `recordRealStudentEnrollment()` từng được gọi trong effect **lúc tải trang**, nên `totalEnrolled` thực chất đếm lượt khách lần đầu vào web. Có lúc nó lên 9 trong khi máy chủ gần như chưa có hồ sơ học viên nào.

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
| `dmm_deleted_students` | Danh sách email học viên đã bị quản trị viên xoá ("bia mộ"). Lọc ở mọi đường đọc để bản ghi còn sót ở kho khác không quay lại |
| `dmm_admin_emails` | Email các tài khoản **được nâng quyền** quản trị. Không chứa tài khoản Quản Trị Tối Cao — danh sách đó nằm cứng trong `utils/adminRoles.js` nên không sửa được từ trình duyệt |
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

Rules nằm ở [firestore.rules](firestore.rules) trong kho mã. **Phải deploy thì mới có tác dụng** — xem [DEPLOYMENT.md](DEPLOYMENT.md#security-rules--bắt-buộc-deploy).

Vì ứng dụng không có backend, đây là lớp bảo vệ duy nhất. Mô hình quyền:

| Dữ liệu | Khách | Học viên đã đăng nhập | Quản trị viên |
|---|---|---|---|
| `admins` (sổ quyền) | — | đọc bản ghi của chính mình | đọc cả sổ, cấp quyền cho người khác |
| `admins/admin@pmarcom.edu.vn` | — | — | **không sửa, không xoá được** |
| `students`, `registrations` | — | đọc/sửa hồ sơ của chính mình, **không được ghi trường `role`** | đọc/sửa/xoá tất cả |
| `analytics` | đọc, cộng tối đa 1 mỗi lần ghi | như khách | như khách |
| Collection khác | đóng | đóng | đóng |

Điểm mấu chốt: danh tính lấy từ `request.auth.token.email` — email nằm trong ID token do Firebase Auth ký, **không phải** thứ trình duyệt tự khai. Người dùng sửa được localStorage nhưng không ký được token, nên không tự đưa mình vào sổ `admins`, và không đọc được hồ sơ của người khác.

Điều rules **không** làm được: chặn ai đó bật giao diện quản trị trên máy của họ. Đó là giới hạn cố hữu của ứng dụng chạy trong trình duyệt — sửa được cả mã JavaScript đang chạy. Nhưng giao diện giả sẽ không có dữ liệu, vì mọi lệnh đọc đều bị máy chủ từ chối.

Rủi ro còn lại, xem [TODO.md](TODO.md#bảo-mật):

- Tài khoản quản trị `admin@pmarcom.edu.vn` có mật khẩu nằm cứng trong mã nguồn (nay không còn cấp quyền, nhưng vẫn nên đổi).
- Tài khoản đó **phải được tạo sẵn trên Firebase Auth**, nếu không người khác đăng ký chiếm chỗ là thành Quản Trị Tối Cao.
