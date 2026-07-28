# API_INDEX — Danh mục hàm và module xuất khẩu

> Dự án **không có API HTTP**. Đây là danh mục các hàm được `export` trong mã nguồn. Lược đồ dữ liệu: [DATABASE.md](DATABASE.md).

## `src/firebase.js`

### Đối tượng nền

| Tên | Kiểu | Ghi chú |
|---|---|---|
| `auth` | Auth | Thực thể Firebase Auth |
| `db` | Firestore | Thực thể Cloud Firestore |
| `TRAFFIC_BASELINE` | number | `100` — mốc khởi điểm hiển thị lượt truy cập |

### Hồ sơ và tiến độ học viên

| Hàm | Tham số | Trả về | Tác dụng |
|---|---|---|---|
| `recordStudentAccountToCloud(studentData)` | object | `Promise<void>` | Ghi hồ sơ vào `students` và `registrations`, đồng thời sao lưu vào `dmm_users_db` |
| `saveUserProgressToCloud(userId, progressData)` | string, object | `Promise<void>` | Lưu tiến độ học viên lên Firestore |
| `getUserProgressFromCloud(userId, email?)` | string, string | `Promise<object\|null>` | Đọc hồ sơ và tiến độ. Dò theo **cả** uid lẫn id suy ra từ email, vì lệnh ghi lưu theo email |
| `getAllRegisteredStudentsFromCloud()` | — | `Promise<Array>` | Lấy toàn bộ học viên (dùng cho bảng quản trị) |
| `listenToAllStudentsFromCloud(callback)` | function | `unsubscribe` | Theo dõi realtime danh sách học viên |
| `setStudentRoleInCloud(email, role)` | string, string | `Promise<void>` | Ghi vai trò lên `students` + `registrations` (dữ liệu hiển thị, không phải căn cứ cấp quyền) |
| `deleteStudentEverywhere(studentId, email)` | string, string | `Promise<void>` | Xoá học viên khỏi cả 4 kho: Firestore `students`, `registrations`, Realtime DB qua REST, và `dmm_users_db` |

### Sổ phân quyền quản trị (collection `admins`)

Nguồn khẳng định quyền quản trị. Ranh giới thật do [firestore.rules](firestore.rules) áp đặt ở phía máy chủ.

| Hàm | Tham số | Trả về | Tác dụng |
|---|---|---|---|
| `isAdminInCloud(email)` | string | `Promise<boolean\|null>` | Email này có quyền không. **`null` = chưa hỏi được**, phải phân biệt với `false` |
| `fetchAdminRosterFromCloud()` | — | `Promise<Array\|null>` | Toàn bộ sổ. Chỉ quản trị viên đọc được |
| `grantAdminInCloud(email, byEmail)` | string, string | `Promise<void>` | Cấp quyền. **Ném lỗi** nếu máy chủ từ chối |
| `revokeAdminInCloud(email)` | string | `Promise<void>` | Thu hồi quyền. Máy chủ từ chối với tài khoản gốc |

### Thống kê lượt truy cập

| Hàm | Tham số | Trả về | Tác dụng |
|---|---|---|---|
| `getVietnamDateKey(now?)` | number | `string` | Khoá ngày `YYYY-MM-DD` theo giờ Việt Nam (UTC+7) |
| `recordRealTrafficVisit()` | — | `Promise<number>` | Ghi 1 lượt/khách/ngày; trả về số hiển thị ngay, **không chờ Cloud** |
| `listenToRealTraffic(callback)` | function | `unsubscribe` | Theo dõi realtime; callback nhận `{ totalViews, todayViews, daily }` |

### Thống kê học viên

| Hàm | Tham số | Trả về | Tác dụng |
|---|---|---|---|
| `recordRealStudentEnrollment()` | — | `Promise<number>` | Tăng `totalEnrolled` |
| `recordRealStudentGraduate()` | — | `Promise<number>` | Tăng `totalGraduates`, có chống đếm trùng |
| `listenToRealStats(callback)` | function | `unsubscribe` | Theo dõi realtime `{ totalEnrolled, totalGraduates }` |

### Xuất lại từ Firebase SDK

`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`, `onAuthStateChanged`, `updateProfile`, `doc`, `setDoc`, `getDoc`, `onSnapshot`, `deleteDoc`.

## `src/utils/certificateExport.js`

| Tên | Kiểu | Ghi chú |
|---|---|---|
| `CERT_WIDTH` / `CERT_HEIGHT` | number | `1400` × `990` — tỉ lệ A4 ngang |
| `isIOSorIPad` | boolean | Nhận diện iOS/iPadOS để đổi cách tải file |
| `slugifyName(name)` | function | Bỏ dấu tiếng Việt để đặt tên file |
| `makeVerifyCode(seed, year?)` | function | Mã xác thực `PMC-<năm>-XXXX-XXXX`, hàm băm FNV-1a, Crockford Base32 |
| `certificateDecorHtml({ scale })` | function | Hoạ tiết trang trí (khung, góc mạch điện) |
| `certificateDividerHtml({ scale })` | function | Dải phân cách có hạt kim cương |
| `renderCertificateCanvas(options)` | async function | Dựng bằng ngoài màn hình rồi chụp, trả về `<canvas>` |

`renderCertificateCanvas` nhận: `studentName`, `totalModules`, `issueDate`, `verifyCode`, `logoSrc`, `scale`.

## `src/utils/adminRoles.js`

Quy tắc phân quyền phía giao diện + **bộ nhớ đệm** của collection `admins`. Nguồn khẳng định nằm ở máy chủ, xem `isAdminInCloud()` bên trên và [firestore.rules](firestore.rules).

| Tên | Kiểu | Ghi chú |
|---|---|---|
| `ROOT_ADMIN_EMAILS` | array&lt;string&gt; | Email các tài khoản **Quản Trị Tối Cao**, nằm cứng trong mã |
| `ROOT_ADMIN_PROFILES` | array&lt;object&gt; | Hồ sơ hiển thị của tài khoản gốc, dùng khi chưa có bản ghi thật |
| `normalizeEmail(email)` | function | Cắt khoảng trắng và chuyển thường |
| `isRootAdmin(email)` | function | Có phải Quản Trị Tối Cao không |
| `getGrantedAdminEmails()` | function | Email đã được nâng quyền tại máy này |
| `getAdminEmails()` | function | Tài khoản gốc + tài khoản được nâng quyền |
| `isAdminEmail(email)` | function | Có quyền quản trị không |
| `replaceAdminCache(emails)` | function | Ghi đè bộ nhớ đệm bằng sổ vừa đọc từ máy chủ |
| `getAccountRole(account, roster?)` | function | `'root'` \| `'admin'` \| `'student'`. `roster` là `Set` email đọc từ máy chủ — truyền vào thì nó là căn cứ duy nhất |
| `isAdminAccount(account, roster?)` | function | Vai trò khác `'student'` |
| `grantAdmin(email)` | function | Ghi bộ nhớ đệm. Trả về `{ ok, message }` |
| `revokeAdmin(email)` | function | Xoá khỏi bộ nhớ đệm. **Luôn từ chối với Quản Trị Tối Cao** |
| `canDeleteAccount(account, roster?)` | function | Quản Trị Tối Cao: không bao giờ. Quản trị viên thường: phải thu hồi quyền trước |

## `src/utils/deletedStudents.js`

| Tên | Kiểu | Ghi chú |
|---|---|---|
| `getDeletedStudents()` | function | Danh sách email đã xoá ("bia mộ") |
| `isStudentDeleted(email)` | function | Đã bị xoá chưa |
| `markStudentDeleted(email)` | function | Ghi bia mộ |
| `unmarkStudentDeleted(email)` | function | Khôi phục học viên đã xoá |
| `filterDeleted(list)` | function | Lọc bỏ bản ghi đã xoá khỏi một danh sách |

## `src/utils/studyReminder.js`

| Tên | Kiểu | Ghi chú |
|---|---|---|
| `IDLE_DAYS_THRESHOLD` | number | `2` — số ngày nghỉ thì nhắc |
| `SNOOZE_DAYS` | number | `1` — thời gian tạm hoãn |
| `markStudyActivity(now?)` | function | Đánh dấu có hoạt động học |
| `getLastStudyAt()` | function | Mốc học gần nhất, `null` nếu chưa từng học |
| `getIdleDays(now?)` | function | Số ngày đã nghỉ, `null` nếu chưa từng học |
| `snoozeReminder(now?, days?)` | function | Tạm hoãn nhắc |
| `shouldRemind({ hasUser, completedCount, totalModules, now })` | function | Quyết định có hiện popup không |
| `resetStudyReminder()` | function | Xoá mốc thời gian, dùng cho kiểm thử |

## Dữ liệu tĩnh

| Module | Xuất khẩu |
|---|---|
| `data/courseData.js` | `COURSE_MODULES` |
| `data/lessonVisuals.js` | `LESSON_VISUALS` |
| `data/glossaryData.js` | `GLOSSARY_CATEGORIES`, `GLOSSARY_ITEMS` |
| `data/newsData.js` | `INITIAL_NEWS_ITEMS`, `LIVE_NEWS_SIMULATOR_POOL` |
| `data/toolsData.js` | `INDUSTRY_BENCHMARKS`, `STAFF_ROLES` |
| `data/translations.js` | `TRANSLATIONS` |

## Thành phần React

Mỗi tệp trong `src/components/` xuất mặc định một thành phần cùng tên. Vai trò từng thành phần: [ARCHITECTURE.md](ARCHITECTURE.md#thành-phần-giao-diện).

TODO — chưa có tài liệu kiểu dữ liệu cho props của từng thành phần (dự án dùng JavaScript thuần, không có PropTypes hay TypeScript).
