# PROMPTS — Mẫu câu lệnh làm việc với AI

Các mẫu dưới đây gắn với đặc thù của **dự án này**. Ngữ cảnh nền mà trợ lý cần biết trước: [AI_MEMORY.md](AI_MEMORY.md).

---

## Nguyên tắc chung khi ra lệnh

1. **Nêu rõ ràng buộc.** Ví dụ: "không đụng vào mã nguồn", "chỉ sửa phần xuất file", "giữ nguyên bản xem trước".
2. **Yêu cầu kiểm chứng, không chấp nhận suy đoán.** Dự án không có kiểm thử tự động nên mặc định phải chạy thật rồi mới báo xong.
3. **Việc lớn thì chia cụm.** Sinh khối nội dung quá lớn trong một lượt từng làm đứt luồng phản hồi.

---

## Thêm nội dung khoá học

```
Bổ sung <N> bài học vào chuyên đề <số>.
Ràng buộc:
- Chỉ dùng cú pháp trình kết xuất hiểu: ###, ####, *, 1., **đậm**. Không bảng, không khối mã.
- Cập nhật lessonsCount cho khớp số bài thực tế.
- Số liệu minh hoạ phải ghi rõ "số liệu giả định".
- Mỗi bài mới phải có sơ đồ tương ứng trong lessonVisuals.js.
Làm từng cụm 2-3 chuyên đề, ghi xuống đĩa sau mỗi cụm.
```

## Thêm câu hỏi kiểm tra

```
Nâng bài kiểm tra chuyên đề <số> lên <N> câu.
Mỗi câu đúng 4 lựa chọn, có trường explanation.
Cập nhật quizCount. Kiểm chứng lại bằng cách render thật trên trình duyệt.
```

## Sửa Bằng Chứng Nhận

```
Sửa <mô tả thay đổi> trên Bằng Chứng Nhận.
Bắt buộc:
- Sửa cả template xuất file (utils/certificateExport.js) VÀ bản xem trước
  (CertificateModal.jsx) để hai bên không lệch nhau.
- Chỉ dùng màu hex nội tuyến, không dùng lớp Tailwind trong template xuất file.
- Không dùng SVG hay radial-gradient (html2canvas dựng kém).
- Render thật rồi cho tôi xem ảnh kết quả trước khi kết luận là xong.
```

## Sửa lỗi

```
<Mô tả hiện tượng>.
Trước khi sửa, hãy xác định nguyên nhân gốc và cho tôi xem bằng chứng
(log lỗi, số đo, hoặc ảnh render). Nêu rõ lỗi này có sẵn từ trước hay
mới phát sinh. Đừng sửa triệu chứng.
```

## Rà soát trước khi triển khai

```
Rà soát các thay đổi trên nhánh hiện tại.
Tập trung vào: rò rỉ khoá bí mật, lỗi khiến chức năng hỏng âm thầm,
và chỗ bản xem trước lệch với kết quả thật.
Không đề xuất tái cấu trúc ngoài phạm vi.
```

## Viết tài liệu

```
Cập nhật <tên tệp>.md theo hiện trạng mã nguồn.
Ràng buộc:
- Không sửa mã nguồn.
- Không suy đoán. Chỗ nào chưa đủ thông tin thì ghi TODO.
- Mỗi tệp chỉ chứa đúng chức năng của nó.
- Liên kết chéo sang tệp liên quan.
```

---

## Câu lệnh nên tránh

| Câu lệnh | Vì sao có vấn đề |
|---|---|
| "Làm cho đẹp hơn" | Không có tiêu chí nghiệm thu, kết quả sẽ tuỳ hứng |
| "Sửa hết lỗi trong dự án" | Quá rộng; nên chỉ đích danh khu vực |
| "Viết lại toàn bộ dữ liệu khoá học trong một lần" | Khối quá lớn, dễ đứt luồng phản hồi và mất trắng |
| "Chụp DOM bài học thành ảnh" | Sẽ hỏng do màu Tailwind v4; xem [AI_MEMORY.md](AI_MEMORY.md) |

---

## Nhắc lại: điều không được tự quyết

Trợ lý phải hỏi thay vì tự chọn khi gặp: nơi triển khai, nội dung Security Rules, giấy phép dự án, lộ trình bàn giao. Danh sách đầy đủ: [TODO.md](TODO.md#cần-làm-rõ-với-chủ-dự-án).
