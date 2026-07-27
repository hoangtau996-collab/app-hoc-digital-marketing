# TASK — Việc đang làm

Việc **chưa bắt đầu** nằm ở [TODO.md](TODO.md). Việc **đã xong** nằm ở [CHANGELOG.md](CHANGELOG.md).

Cập nhật: **2026-07-27**

---

## Đang làm

| Việc | Trạng thái | Ghi chú |
|---|---|---|
| — | — | Ngoài mục trên, không có việc nào đang chạy. Nhiệm vụ tiếp theo áp dụng [Nguyên tắc Context tối thiểu](AI_MEMORY.md#nguyên-tắc-context-tối-thiểu) |

## Chờ phản hồi từ chủ dự án

Các mục dưới đây bị chặn vì thiếu thông tin, không phải vì thiếu thời gian:

| Việc | Cần biết gì |
|---|---|
| Hoàn thiện [DEPLOYMENT.md](DEPLOYMENT.md) | Ứng dụng đang triển khai ở đâu, bằng cách nào |
| Ghi lại Firestore Security Rules | Nội dung rules đang áp dụng trên Firebase Console |
| Điền giấy phép vào [README.md](README.md) | Chọn giấy phép nào |
| Dựng lại [CHANGELOG.md](CHANGELOG.md) phần trước 2026-07-27 | 78 commit phần lớn là thông điệp tự động, không đủ chi tiết |
| Gộp `students` và `registrations` | Vì sao ban đầu tách hai collection cùng nội dung |

## Vừa hoàn thành trong phiên gần nhất

Chi tiết đầy đủ ở [CHANGELOG.md](CHANGELOG.md).

- **Rà soát tương phản 11 màn sau khi đổi màu** — đo theo chuẩn WCAG, sửa lỗi gradient tối sót lại.
- **Chặn học viên truy cập Bảng Quản Trị** — sửa lỗi leo thang đặc quyền, vá 3 tầng.
- **Thêm trợ lý Pipi** — nút nổi góc phải, tra thuật ngữ / tìm bài / tính chỉ số.
- **Sửa lỗi xoá học viên không có tác dụng** — quét đủ 4 kho lưu trữ, thêm cơ chế bia mộ chặn dữ liệu mẫu quay lại.
- **Bỏ lưu mật khẩu dạng chữ thường trong localStorage** — mục ưu tiên cao nhất của [TODO.md](TODO.md#bảo-mật). Dùng SHA-256 + muối, bản ghi cũ tự nâng cấp khi đăng nhập.
- Chốt quy trình làm việc **Context tối thiểu**, ghi vào [AI_MEMORY.md](AI_MEMORY.md#nguyên-tắc-context-tối-thiểu).
- Lập bộ tài liệu AI Workspace: 14 tệp Markdown ở thư mục gốc.
- Bổ sung 16 bài học chuyên sâu và 22 câu hỏi, nâng lên 36 bài / 55 câu.
- Dựng 36 sơ đồ số liệu và 11 tranh minh hoạ chuyên đề.
- Thêm popup nhắc học sau 2 ngày lơ là.
- Đổi Bằng Chứng Nhận sang nền trắng kèm hoạ tiết vàng đồng và xanh ngọc bích.
- Sửa 3 lỗi có sẵn: `lessonsCount` sai ở 10/11 chuyên đề, sơ đồ lặp ở mọi bài, `recordStudentAccountToCloud` chưa import.

## Quy ước dùng file này

- Một việc chỉ nằm ở **một** trong ba file: TASK (đang làm) / TODO (chưa bắt đầu) / CHANGELOG (đã xong).
- Khi bắt đầu một việc trong TODO, chuyển nó sang đây.
- Khi xong, chuyển sang CHANGELOG kèm mô tả kết quả thực tế.
