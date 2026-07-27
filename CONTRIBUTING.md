# CONTRIBUTING — Quy ước đóng góp

## Chuẩn bị

```bash
npm install
npm run dev
```

Yêu cầu Node.js đủ mới để chạy Vite 8. TODO — chưa khai báo `engines` trong `package.json`, chưa chốt phiên bản Node tối thiểu.

## Trước khi commit

```bash
npm run lint     # Oxlint
npm run build    # phải build thành công
```

Dự án chưa có kiểm thử tự động, nên **bắt buộc kiểm tra thủ công trên trình duyệt** phần tính năng đã đụng vào.

## Quy ước mã nguồn

Rút ra từ mã hiện có, không phải quy định áp từ ngoài:

- **JavaScript thuần + JSX**, không dùng TypeScript.
- **Tailwind CSS v4** cho phần tạo kiểu; các lớp dùng chung nằm ở `src/index.css`.
- Thành phần đặt tên **PascalCase**, mỗi tệp `export default` một thành phần.
- State dùng chung tập trung ở `App.jsx` rồi truyền xuống bằng props. Không dùng Context.
- Chú thích trong mã viết bằng **tiếng Việt**, giải thích *vì sao* chứ không mô tả lại *cái gì*.

### Bẫy Tailwind cần tránh

Tên lớp phải là **chuỗi tĩnh**. Trình quét của Tailwind không sinh ra lớp ghép động:

```jsx
// SAI — Tailwind không sinh ra lớp này
<span className={`text-${color}-300`} />

// ĐÚNG — ánh xạ sang chuỗi đầy đủ, xem bảng TONE trong LessonVisual.jsx
const TONE = { emerald: { text: 'text-emerald-300' } };
```

## Thêm nội dung bài học

Nội dung nằm ở `src/data/courseData.js`, cấu trúc mỗi chuyên đề:

```js
{
  id, number, title, subtitle, description, icon, badge,
  duration, lessonsCount, quizCount,
  sections: [{ id, title, content, takeaway? }],
  quiz: [{ id, question, options[4], correct, explanation }]
}
```

Quy tắc bắt buộc:

1. `lessonsCount` phải bằng `sections.length`, `quizCount` phải bằng `quiz.length`. Hai số này từng lệch ở 10/11 chuyên đề — xem [CHANGELOG.md](CHANGELOG.md).
2. `sections[].id` theo mẫu `m<số chuyên đề>-s<số bài>`; `quiz[].id` theo mẫu `q<số chuyên đề>_<số câu>`.
3. `quiz[].options` phải đúng **4 lựa chọn**; `correct` là chỉ số từ 0 đến 3.
4. `content` chỉ được dùng cú pháp mà trình kết xuất hiểu — xem [ARCHITECTURE.md](ARCHITECTURE.md#trình-kết-xuất-markdown-rút-gọn). Không có bảng, không có khối mã.
5. Số liệu minh hoạ không kiểm chứng được phải ghi rõ **"số liệu giả định"** để học viên không nhầm là dữ liệu thị trường thật.

## Thêm sơ đồ cho bài học

Khai báo trong `src/data/lessonVisuals.js`, khoá là `sectionId`:

```js
'm1-s4': {
  kind: 'stats',              // compare | bars | flow | funnel | stats
  title: '📊 Tiêu đề sơ đồ',
  badge: 'Nhãn góc phải',
  items: [ /* hoặc steps / stages tuỳ kind */ ],
  footnote: 'Ghi chú tuỳ chọn',
}
```

Ràng buộc theo từng `kind`:

| `kind` | Mảng dữ liệu | Trường bắt buộc |
|---|---|---|
| `compare` | `items` | `label` |
| `bars` | `items` | `label`, `percent` |
| `flow` | `steps` | `label` |
| `funnel` | `stages` | `label`, `value`, `raw` |
| `stats` | `items` | `label`, `value` |

Màu chỉ được dùng: `emerald`, `amber`, `teal`, `rose`, `sky`.

## Thêm tranh minh hoạ chuyên đề

Khai báo trong `SCENES` và `CAPTIONS` của `src/components/LessonIllustration.jsx`, khoá là `moduleId`. Vẽ bằng SVG nội tuyến trong khung `viewBox="0 0 640 200"`. Không dùng ảnh ngoài — lý do tại [DECISION.md](DECISION.md#adr-003).

## Git

- Nhánh chính: `master`.
- Kho mã có hook tự động commit và đẩy sau mỗi phiên làm việc — xem [DEPLOYMENT.md](DEPLOYMENT.md#tự-động-đẩy-mã-lên-github). Nếu bạn làm việc thủ công, lưu ý hook có thể đã commit thay bạn.

TODO — chưa có quy ước thông điệp commit thống nhất; lịch sử hiện lẫn lộn giữa commit thủ công và commit tự động dạng `chore: tự động lưu ...`.

## Những chỗ dễ sai

| Khu vực | Cạm bẫy |
|---|---|
| Xuất Bằng Chứng Nhận | html2canvas 1.4.1 **không đọc được** `oklch()` và `color-mix()` của Tailwind v4. Template xuất file phải dùng màu hex nội tuyến. Xem [DECISION.md](DECISION.md#adr-001) |
| Bản xem trước chứng nhận | Phải khớp bảng màu với template xuất file, nếu không sẽ xem một đằng tải một nẻo |
| Ghi Firestore | Không `await` lệnh ghi rồi mới cập nhật giao diện — khi offline Promise treo vô hạn. Xem [DECISION.md](DECISION.md#adr-002) |
| Thống kê truy cập | Đếm 1 lượt/khách/ngày, không đếm mỗi lần tải trang |
| `<StrictMode>` | `useEffect` chạy hai lần khi dev; phần đếm cần cờ chặn lặp |
