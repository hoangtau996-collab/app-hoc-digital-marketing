# TASK — Việc đang làm

Việc **chưa bắt đầu** nằm ở [TODO.md](TODO.md). Việc **đã xong** nằm ở [CHANGELOG.md](CHANGELOG.md).

Cập nhật: **2026-08-11**

---

## Đang làm

| Việc | Trạng thái | Ghi chú |
|---|---|---|
| Đọc lại nội dung mới viết cho khoá Trade | Chờ chủ dự án duyệt | Đã bổ sung ~17.000 ký tự vào 16 bài sẵn có và 32 thuật ngữ Trade vào Từ Điển. Nội dung do trợ lý soạn dựa trên tài liệu gốc, chưa qua kiểm duyệt chuyên môn — nên đọc lại phần bảng lương, mẫu store check và khung Trade Plan trước khi mở cho học viên |
| — | — | Ngoài mục trên, không có việc nào đang chạy. Nhiệm vụ tiếp theo áp dụng [Nguyên tắc Context tối thiểu](AI_MEMORY.md#nguyên-tắc-context-tối-thiểu) |

## Chờ phản hồi từ chủ dự án

Các mục dưới đây bị chặn vì thiếu thông tin, không phải vì thiếu thời gian:

| Việc | Cần biết gì |
|---|---|
| Ghi lại Firestore Security Rules | Nội dung rules đang áp dụng trên Firebase Console |
| Điền giấy phép vào [README.md](README.md) | Chọn giấy phép nào |
| Dựng lại [CHANGELOG.md](CHANGELOG.md) phần trước 2026-07-27 | 78 commit phần lớn là thông điệp tự động, không đủ chi tiết |
| Gộp `students` và `registrations` | Vì sao ban đầu tách hai collection cùng nội dung |

## Vừa hoàn thành trong phiên gần nhất

Chi tiết đầy đủ ở [CHANGELOG.md](CHANGELOG.md).

- **Dải giới thiệu website & ứng dụng khác ở chân trang** — P MARCOM (trang tổng), P Healing (Tarot), Xin Xăm — Luận Quẻ, Capy Track (tracking công việc), Định Hướng Nghề Nghiệp (DISC & Holland Code). Mở tab mới nên không đá học viên ra khỏi bài đang học; ảnh bìa để bản sao trong `public/apps/` (~295 KB cho cả năm) và tải trễ; điện thoại vuốt ngang, màn rộng năm cột. Thẻ P MARCOM dùng ảnh sự kiện thay og:image vì og:image của site trùng bìa Academy ở đầu trang chủ.
- **Thêm 32 thuật ngữ Trade vào Từ Điển** (121 lên 153 mục) — vá lỗ hổng tab "Thuật Ngữ & Công Thức" hiện trong bài khoá Trade mà không có mục nào của khoá đó.
- **Mở rộng chiều sâu 16 bài khoá Trade** — nội dung từ ~30.000 lên 47.000 ký tự: mẫu biên bản store check, bảng nhận mặt POSM ba nhóm, bài tính ROI bằng số cụ thể, khung Trade Plan bảy phần, bốn câu phỏng vấn hay gặp. Thời lượng chuyên đề cập nhật theo.
- **Viết 16 câu chốt còn thiếu của khoá Digital** — `npm run check:content` nay báo 0 lỗi, 0 cảnh báo; cả 52 bài của hai khoá đều có "Lưu ý cốt lõi cho Manager".
- **Khoá Trade Marketing hiện danh sách chuyên đề riêng** — thanh bên đổi theo khoá đang xem thay vì luôn liệt kê 11 chuyên đề khoá Digital; thêm nút quay về khoá chính; thẻ chuyên đề liệt kê tên từng bài.
- **22 ảnh chụp thật cho 16 bài khoá Trade**, trọng tâm là POSM: chùm 5 ảnh gọi tên standee, kệ trưng bày riêng, dump bin, thẻ giá trên kệ và trưng bày theo mùa. `LessonPhoto` nhận thêm dạng chùm ảnh. Phủ ảnh nay đạt 52/52 bài của cả hai khoá.
- **Thêm `npm run check:content`** — chốt chặn cho các ràng buộc dữ liệu khoá học. Chạy lần đầu: không có lỗi.
- **Sửa lỗi học viên mới thừa hưởng tiến độ của người trước trên máy dùng chung** — kèm sửa điều kiện tốt nghiệp đếm theo độ dài mảng.
- **Xáo thứ tự lựa chọn bài kiểm tra** — 55 câu khoá chính trước đây không có câu nào đáp án đúng ở vị trí 3 hoặc 4; phân bố mới 12/18/15/10.
- **Đồng bộ tiến độ khoá Trade lên Firestore** và thêm mục Trade vào thanh điều hướng đáy trên điện thoại.
- **Sửa lỗi tài khoản quản trị mất nút vào Bảng Quản Trị** — listener đăng nhập dựng lại `currentUser` thiếu trường `role` rồi ghi đè localStorage, làm mất quyền vĩnh viễn. Nay có bộ phân giải dùng chung, khôi phục được cả những máy đã bị xoá role.
- **Tinh gọn thanh menu** — gỡ nhóm nút điều hướng trùng lặp trên Header, các mục chuyển sang một dòng và rút ngắn nhãn; tổng bề rộng từ hơn 1.400px xuống khoảng 1.036px nên không còn bị cắt mục cuối.
- **Thêm khoá nâng cao Trade Marketing** — 5 chuyên đề / 16 bài / 20 câu hỏi, khoá lại cho tới khi học viên hoàn thành đủ 11 chuyên đề khoá chính. Tiến độ lưu riêng theo từng tài khoản.
- **Sửa thẻ chia sẻ để ảnh bìa hiện được trên Zalo, Facebook, WhatsApp, Viber, LINE** — chuyển toàn bộ URL sang tuyệt đối theo tên miền thật `academy.pmarcom.com`, gỡ đoạn script ghi đè canonical, bổ sung thẻ ảnh kiểu cũ và JSON-LD.
- **Xác nhận địa chỉ triển khai** — `https://academy.pmarcom.com/` trên Vercel, đã ghi vào [DEPLOYMENT.md](DEPLOYMENT.md) và gỡ khỏi danh sách chờ phản hồi.
- **Vẽ lại ảnh bìa chia sẻ theo bảng màu mới** — từ tông xanh lá + vàng đồng sang Egg Shell + Indigo Dye + Rose Pink, mang slogan "Học thật - Chiến thật - Kết quả thật"; kèm sửa ba lỗi có sẵn: tệp JPEG mang đuôi `.png`, ảnh vuông trong khi khai báo 1200x630, và dung lượng 581 KB.
- **Viết lại mục Tin tức** — 16 bài viết đầy đủ (nguồn, số liệu chính, thân bài, rủi ro nếu bỏ qua), 14 tranh minh hoạ SVG nội tuyến thay ảnh stock, cửa sổ đọc chi tiết và phân trang 5 tin mỗi lần.
- **Bổ sung 100 thuật ngữ cho Từ Điển Digital Marketing** — nâng từ 21 lên 121 mục, thêm 3 nhóm danh mục (Dữ Liệu & Đo Lường, E-commerce & Sàn TMĐT, AI & Tự Động Hóa), mở rộng `ICON_MAP` lên 113 icon và thêm dòng đếm kết quả kèm nút xóa bộ lọc.
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
