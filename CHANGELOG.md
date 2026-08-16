# CHANGELOG — Lịch sử thay đổi

Định dạng tham chiếu [Keep a Changelog](https://keepachangelog.com/vi/1.1.0/).

Dự án **chưa đánh số phiên bản**. Các mục dưới đây nhóm theo đợt làm việc, không phải theo bản phát hành.

TODO — chưa có quy ước đánh phiên bản; cân nhắc gắn thẻ Git khi phát hành.

---

## [Chưa phát hành] — 2026-08-11

### Thêm mới — Dải giới thiệu website & ứng dụng khác ở chân trang

- Thành phần mới `PartnerAppsBanner` gắn vào footer, ngay trên dòng bản quyền: **P MARCOM — Website Tổng** (`pmarcom.com`) đứng đầu, rồi **Định Hướng Nghề Nghiệp** — trắc nghiệm DISC & Holland Code (`career.pmarcom.com`), **P Healing — Tarot Online** (`healing.pmarcom.com`), **Xin Xăm — Luận Quẻ** (`xinxam.pmarcom.com`), **Capy Track — Tracking Công Việc** (`trackingtask.lethanhphong.vn`). Thẻ định hướng nghề đứng thứ hai vì gần với việc học viên tới đây để làm nhất.
- **Thẻ trang tổng KHÔNG dùng og:image của pmarcom.com.** Thẻ og của trang đó trỏ vào chính bìa "P MARCOM ACADEMY" — gần trùng ảnh bìa nằm ngay đầu trang chủ khoá học này, đặt xuống chân trang thì học viên gặp lại đúng thứ vừa cuộn qua và tưởng bấm vào là quay về chỗ cũ. Thay bằng ảnh sự kiện thật lấy từ chính trang đó, cắt 16:9, hợp với định vị "giải pháp truyền thông — sự kiện" mà site tự khai trong thẻ SEO.
- **Mở tab mới, không thay cửa sổ khoá học.** Học viên có thể đang dở một bài mà tiến độ chỉ ghi theo mốc, nên mọi liên kết đều `target="_blank"` kèm `rel="noopener noreferrer"` — thiếu `noopener` thì trang mở ra nắm được `window.opener` và đổi được địa chỉ tab khoá học.
- **Ảnh bìa SEO lấy từ chính các trang đó, nhưng để bản sao trong `public/apps/`** thay vì hotlink: riêng ba ảnh của ba ứng dụng con đã là 1,4 MB (615 + 148 + 643 KB). Bản trong repo thu về 760px ngang, JPEG q82, cả năm tệp còn ~295 KB, kèm `loading="lazy"` nên chỉ tải khi học viên cuộn tới chân trang. Đổi lại: các trang kia thay ảnh bìa thì phải tải lại thủ công.
- **Điện thoại vuốt ngang, rồi nở dần hai → ba → năm cột.** Năm ảnh 16:9 xếp dọc trên màn 360px là hơn 1.200px chiều cao — dài hơn cả phần nội dung phía trên. Nay là băng cuộn có điểm dừng, mỗi thẻ rộng 78% màn hình để luôn hở một mẩu thẻ kế bên làm tín hiệu vuốt. Bậc nở dần: 640px hai cột, 1.024px ba cột (năm thẻ thành 3 + 2), từ 1.280px mới xếp cả năm một hàng — dàn sớm hơn thì mỗi thẻ chỉ còn ~150px, tên vỡ ba dòng và chữ trên ảnh bìa co lại không đọc được.
- Ảnh của P Healing là ảnh vuông, hai ảnh còn lại 1200x630 và 1200x669 — ép chung khung 16:9 với `object-center` để năm thẻ thẳng hàng, phần bị xén chỉ là nền.
- Màu ô biểu tượng và chữ trên đó chọn tránh danh sách bị giao diện nền sáng ghi đè bằng `!important` trong `index.css`; hiệu ứng di chuột dùng `ring` thay `border` vì lý do tương tự.

---

## [Chưa phát hành] — 2026-08-06 (đợt 2)

### Thêm mới — 32 thuật ngữ Trade Marketing vào Từ Điển

- **Phát hiện lỗ hổng khi rà lại:** tab "Thuật Ngữ & Công Thức" hiện lên trong **mọi** bài học, kể cả bài khoá Trade — nhưng trong 121 mục của từ điển **không có một mục nào là thuật ngữ Trade**. POSM, sell-in, sell-out, OSA, SOS, JBP, SKU, shopper đều bằng 0. Học viên Trade mở tab đó ra chỉ thấy thuật ngữ Digital.
- Thêm nhóm **"Trade Marketing & Điểm Bán"** với 32 mục, nâng từ điển từ 121 lên 153. Chia theo bốn cụm: đối tượng (shopper, consumer, customer), kênh (GT, MT, HoReCa, EC), chỉ số (sell-in, sell-out, coverage, SOS, OSA, SKU, ROI chương trình, A&P, trade spend), và vận hành tại kệ (POSM, POP, planogram, facing, eye level, trưng bày thứ cấp, đầu kệ, mechanic, sampling, activation, store check, retail audit, nhà phân phối & DSR).
- **7 mục có công thức tính** kèm ví dụ số theo định dạng Việt Nam. Mục ROI chương trình đưa nguyên phép tính đối chứng: cùng một chương trình, tính đúng ra 0,2 lần còn tính nhầm theo tổng doanh thu ra 4,2 lần — sai gấp hơn hai mươi lần.
- Ví dụ số trong nhóm này đều là tình huống tính toán tự dựng để minh hoạ công thức, **không phải số liệu thị trường có thật** — đã ghi rõ trong chú thích đầu nhóm.

### Thay đổi — Mở rộng chiều sâu 16 bài khoá Trade Marketing

Nội dung khoá Trade tăng từ khoảng 30.000 lên **47.000 ký tự**, không thêm chuyên đề mới mà làm dày bài sẵn có. Phần thêm vào tập trung vào thứ người mới không tự tra được:

- **Chuyên đề 01:** một ngày làm việc thật của Trade Executive; ba hiểu nhầm về nghề; bảng ba đối tượng ba câu hỏi khác nhau; ngành hàng nào shopper tách xa consumer nhất; bốn điểm Brand và Trade va nhau kèm hướng trả lời câu phỏng vấn về xung đột giá.
- **Chuyên đề 02:** đường đi hàng hoá ở GT và MT và vì sao chi phí khác nhau; CVS như nhánh riêng; ba chỉ số riêng của kênh sàn; HoReCa như cửa vào ít người nhắm; gợi ý chọn kênh học sâu theo ngành hàng; **mẫu biên bản store check sáu cột** chép lại dùng được ngay, kèm ba lỗi làm hỏng buổi đi đầu tiên.
- **Chuyên đề 03:** bốn việc cụ thể của quản lý POSM và bốn lỗi POSM tốn tiền nhất; **bảng nhận mặt POSM chia ba nhóm** theo chỗ chúng chiếm (gắn kệ, chiếm sàn, bao phủ không gian) với tên gọi từng loại; công thức tỷ lệ tuân thủ; bảng mặt trái của sáu chỉ số (mỗi chỉ số bị làm đẹp bằng cách nào và kiểm chứng ra sao); **bài tính ROI đầy đủ bằng số cụ thể**; bốn thứ phải chốt trước khi chạy chương trình; phân biệt Nielsen với Kantar; nguồn dữ liệu miễn phí dùng được ngay; cách nói về khoảng trống công cụ khi phỏng vấn.
- **Chuyên đề 04:** thứ thực sự quyết định lên nấc (phạm vi chịu trách nhiệm, không phải số năm); hai nhánh rẽ sau nấc 4; cách đọc tin tuyển dụng cho đúng; bảng dịch từng yêu cầu tuyển dụng sang bằng chứng cần chuẩn bị; đặc thù nhịp làm việc của từng ngành; ba vị trí đường vòng vào Trade.
- **Chuyên đề 05:** mẫu bốn bước viết lại một hoạt động đã làm, kèm ví dụ một dòng hồ sơ trước và sau khi thêm số; bốn kỹ năng Excel cần học và không hơn; bảng tự chấm sáu khoảng trống; **khung Trade Plan bảy phần**; ba lỗi thường gặp khi tự viết; bản rút gọn 30 ngày cho người đã có lịch phỏng vấn; **bốn câu hỏi phỏng vấn hay gặp nhất kèm hướng trả lời**; ba câu nên hỏi ngược nhà tuyển dụng; ba thứ mang theo tới buổi phỏng vấn.
- **Thời lượng chuyên đề cập nhật theo lượng nội dung mới**: 40/45/55/40/50 phút thành 60/65/80/60/70 phút. Con số cũ giữ nguyên là nói sai với học viên về thời gian họ cần bỏ ra.

### Thêm mới — 16 câu chốt còn thiếu của khoá Digital Marketing

- Viết bổ sung `takeaway` cho đúng 16 bài mà `npm run check:content` đã chỉ ra ở đợt trước: `m1-s3`, `m2-s2`, `m3-s2`, `m4-s1`, `m4-s2`, `m5-s1`, `m6-s1`, `m6-s2`, `m7-s1`, `m7-s2`, `m8-s1`, `m9-s1`, `m10-s1`, `m10-s2`, `m11-s1`, `m11-s2`. Các bài này trước đây không hiện khối "Lưu ý cốt lõi cho Manager".
- Mỗi câu bám đúng nội dung bài và nêu **cái bẫy** của phần kiến thức đó chứ không tóm tắt lại. Ví dụ: bài công cụ nghiên cứu chốt ở chỗ số lưu lượng của Ahrefs là ước lượng dựng từ mô hình nên không được đưa vào báo cáo Ban Giám Đốc như số tuyệt đối; bài mô hình ghi nhận chuyển đổi chốt ở chỗ công cụ đo lường do bên thứ ba sở hữu và đã đổi hai lần.
- Chèn bằng script bám mốc chuỗi thay vì phân tích cú pháp rồi ghi lại cả tệp — ghi lại sẽ xoá sạch chú thích và định dạng gốc của 131KB dữ liệu khoá học.
- **Kết quả kiểm soát nội dung sau đợt này: 0 lỗi và 0 cảnh báo.** Cả 52 bài của hai khoá đều có câu chốt.

---

## [Chưa phát hành] — 2026-08-06

### Thêm mới — Khoá Trade Marketing hiện danh sách chuyên đề

- **Thanh bên đổi theo khoá đang xem.** Trước đây vào tab Trade Marketing thì thanh bên vẫn liệt kê 11 chuyên đề của khoá Digital; bấm vào bất kỳ mục nào là văng ngược về khoá chính. Nghĩa là suốt khoá nâng cao, học viên chỉ có nút "Bài trước / Bài sau" để đi từng bước một, muốn nhảy từ chuyên đề 1 sang chuyên đề 4 phải thoát hẳn ra lưới rồi vào lại.
  - `Sidebar.jsx` nhận thêm `tradeModules`, `selectedTradeModuleId`, `onSelectTradeModule`, `completedTradeModules`. Khi `activeTab === 'trade'` và khoá đã mở, cả ba khối danh sách (dải chọn nhanh trên điện thoại, danh sách mở rộng, danh sách máy tính) đổi sang dữ liệu khoá Trade.
  - Khoá Trade **không khoá tuần tự** giữa các chuyên đề — vào được khoá này nghĩa là đã tốt nghiệp khoá chính — nên nhánh Trade không gọi `getBlockingModule`, không hiện ổ khoá.
  - Thêm nút **"Khoá Digital Marketing"** vào nhóm Tiện Ích Trưởng Phòng. Bắt buộc phải có: từ khi thanh bên đổi sang danh sách Trade, không còn mục nào trỏ về khoá chính nữa, thiếu nút này là học viên kẹt lại trong khoá nâng cao (trước đây lối về duy nhất là bấm một chuyên đề bất kỳ trong danh sách khoá chính).
  - Số "11 Chuyên đề" viết cứng ở tiêu đề thanh bên nay đếm theo dữ liệu thật. Thêm bớt chuyên đề là số cũ lệch ngay mà không ai thấy.
- **Thẻ chuyên đề Trade liệt kê tên từng bài học**, ở cả trạng thái đã mở lẫn băng xem trước khi còn khoá. Tên bài mới nói được chuyên đề dạy gì; phần mô tả chỉ là câu chào. Với băng xem trước, đây chính là câu trả lời cho "mở khoá rồi được học gì".

### Thêm mới — Ảnh minh hoạ thực tế cho khoá Trade Marketing

- **22 ảnh chụp thật cho toàn bộ 16 bài của khoá Trade**, trước đó khoá này không có ảnh nào (`LESSON_PHOTOS` chỉ phủ 36 bài khoá Digital). Nay phủ 52/52 bài của cả hai khoá.
- **`LessonPhoto` nhận thêm dạng chùm ảnh** `{ gallery, note, photos: [{ label, ... }] }` bên cạnh dạng một ảnh cũ. Dùng khi một tấm không đủ để nhận mặt khái niệm, hoặc khi bài cần đặt hai vế cạnh nhau trong cùng một khung thay vì bắt học viên nhớ tấm trước rồi cuộn xuống xem tấm sau. Mỗi ảnh trong chùm tự ẩn riêng khi hỏng, không kéo cả chùm đi theo.
- **Trọng tâm là POSM** — khái niệm học viên phải gọi đúng tên khi đi store check, mà một tấm ảnh không nói hết. Bài `tm3-s2` (nơi định nghĩa POSM) có chùm 5 ảnh gọi tên năm dạng khác nhau về chi phí, vòng đời và cách đo tuân thủ: standee, kệ trưng bày riêng tại quầy thanh toán, dump bin, thẻ giá trên kệ, trưng bày theo mùa. Bài `tm3-s1` thêm ảnh trưng bày thứ cấp cho khối kiến thức POSM & Visual Merchandising.
- Ba bài khác dùng chùm ảnh để đặt hai vế cạnh nhau: shopper với consumer (`tm1-s2`), GT với MT (`tm2-s1`, dùng ảnh tạp hoá Đà Lạt và siêu thị Co.opmart), E-commerce với HoReCa (`tm2-s2`, dùng ảnh quán cà phê Tây Hồ).
- Toàn bộ ảnh lấy từ Wikimedia Commons, giấy phép tự do, ghi công đầy đủ ở trường `credit`, và **mỗi URL đã kiểm tra trả về HTTP 200** trước khi đưa vào.

### Thêm mới — Kiểm soát nội dung khoá học

- **`scripts/kiem-tra-noi-dung.mjs`** — chạy bằng `npm run check:content`, thêm `-- --net` để kiểm tra từng URL ảnh còn sống. Dự án không có kiểm thử tự động (xem [AI_MEMORY.md](AI_MEMORY.md)) nên đây là chốt chặn duy nhất cho các ràng buộc dữ liệu đã từng bị vi phạm thật:
  - `lessonsCount` / `quizCount` lệch với số phần tử thật (đã từng lệch ở 10/11 chuyên đề khoá chính).
  - `sectionId` trùng nhau giữa hai khoá. `LESSON_PHOTOS`, `LESSON_VISUALS` và `LESSON_CASES` đều tra theo `sectionId`, nên trùng id là kéo nhầm minh hoạ của khoá kia sang **mà không báo lỗi gì**.
  - Cú pháp `content` vượt ngoài thứ `LessonViewer` hiểu — bảng markdown và khối mã sẽ hiện ra nguyên ký tự thô trên màn hình học viên. Bắt luôn cả trường hợp số dấu `**` lẻ.
  - Quiz: đúng 4 lựa chọn, `correct` là số nguyên 0-3, không có hai lựa chọn trùng nội dung, id không lặp.
  - Ảnh: trỏ tới bài không tồn tại, thiếu `credit`, hoặc `credit` không ghi tên giấy phép (dùng ảnh Creative Commons mà thiếu ghi công là sai điều khoản, không phải lỗi hiển thị).
  - Phần kiểm tra mạng **lùi lại và thử lại khi gặp HTTP 429**. Wikimedia chặn theo tần suất, gọi liên tục 59 URL là bị trả 429 hàng loạt — một bài kiểm tra báo sai còn tệ hơn không kiểm tra, vì lần sau không ai tin nó nữa.
- **Kết quả chạy lần đầu: không có lỗi.** 16 chuyên đề, 52 bài, 75 câu hỏi, 59 tấm ảnh đều đạt.
- **Còn 16 cảnh báo, tất cả đều ở khoá Digital Marketing**: các bài `m1-s3`, `m2-s2`, `m3-s2`, `m4-s1`, `m4-s2`, `m5-s1`, `m6-s1`, `m6-s2`, `m7-s1`, `m7-s2`, `m8-s1`, `m9-s1`, `m10-s1`, `m10-s2`, `m11-s1`, `m11-s2` thiếu câu chốt `takeaway` nên không hiện khối "Lưu ý cốt lõi cho Manager". Khoá Trade không thiếu bài nào. Chưa tự viết bù vì đó là nội dung chuyên môn, cần chủ dự án duyệt — xem [TASK.md](TASK.md).

---

## [Chưa phát hành] — 2026-07-31

### Gỡ bỏ

- **Dải "Tin nóng từ nguồn quốc tế" kéo RSS.** Chủ dự án đánh giá không cần thiết. Sau khi bỏ đường dẫn ra trang ngoài, dải này chỉ còn là các tiêu đề tiếng Anh chưa biên tập nằm cạnh phần phân tích tiếng Việt — không đủ giá trị để chiếm chỗ đầu trang.
  - Gỡ component `GlobalNewsStrip` (104 dòng) khỏi `LiveNewsFeed.jsx`, gỡ chỗ gọi và icon `Globe` không còn dùng.
  - **Xoá luôn `api/news.js`.** Endpoint này sinh ra chỉ để phục vụ dải tin đó, giữ lại là mã chết. File vẫn nằm trong lịch sử git (commit `3edcc29`) nên lấy lại được nếu đổi ý.
  - Routine hằng tuần đã cập nhật: thêm ràng buộc chỉ được sửa `src/data/newsData.js` và `CHANGELOG.md`, cấm dựng lại dải tin, và `git status` phải liệt kê đúng hai file đó — có file thứ ba là agent đã đi quá phạm vi.

### Sửa lỗi — Hộp thoại không cuộn lên đầu được

- **Bài tin tức đọc đầy đủ trên laptop không đọc được từ trên xuống.** Mấy đoạn đầu bài bị khuất và không cuộn tới được.
  - Nguyên nhân là một lỗi kinh điển của flex: hộp ngoài vừa là vùng cuộn (`overflow-y-auto`) vừa canh giữa theo chiều dọc (`items-center`). Khi nội dung cao hơn màn hình, canh giữa đẩy phần tràn ra **đều cả hai đầu** — nhưng thanh cuộn không lùi lên số âm được, nên phần tràn ở trên vĩnh viễn không với tới.
  - Bản điện thoại né được nhờ `items-start`, còn từ `sm:` trở lên là `sm:items-center` — vì vậy lỗi **chỉ lộ ra trên màn hình rộng**, đúng như báo cáo.
  - Sửa bằng `my-auto` trên tấm nội dung: lề tự động còn chỗ trống thì canh giữa, hết chỗ thì tự về 0 và nội dung bắt đầu từ trên xuống. Giữ được cả hai hành vi mà không phải dựng lại cấu trúc.
- **Cùng lỗi đó có ở 9 hộp thoại khác**, đã rà và sửa hết: hồ sơ học viên, chứng nhận, đăng nhập, hoàn tất hồ sơ, nhắc học, khảo sát, hai hộp trong Từ điển số, và hộp xác nhận trong Bảng quản trị. Hai hộp dùng chiều cao cố định (`h-[94vh]`, `h-[92vh]`) tự cuộn bên trong nên không dính lỗi, giữ nguyên.

### Sửa lỗi — Hồ sơ học viên

- **Nút "Thấu hiểu & Sửa Hồ Sơ" tràn ra ngoài khung hộp thoại.** Khối tên và email bên trái thiếu `min-w-0`, mà một phần tử flex mặc định không co xuống dưới bề rộng nội dung của nó — nên nó giữ nguyên chiều ngang và đẩy nút văng hẳn ra ngoài mép. Có `truncate` bên trong cũng vô ích vì `truncate` chỉ chạy khi phần tử đã bị co lại. Thêm `min-w-0 flex-1`, cho hàng tiêu đề `flex-wrap`, và `pr-12` để chừa chỗ cho nút đóng đang nằm đè ở góc trên bên phải.
- **Học viên đổi ảnh đại diện nhưng hệ thống không ghi nhớ.** Ba nguyên nhân độc lập, sửa cả ba:
  - **Đồng bộ tiến độ học xoá ảnh trên máy chủ.** `buildStudentPayload` không mang theo `avatarUrl`, trong khi `recordStudentAccountToCloud` ghi ĐÈ cả hồ sơ chứ không ghi từng trường. Nên chỉ cần học viên học xong một bài là ảnh vừa đặt bị đặt về rỗng. Không ai lần ra được, vì thao tác làm mất ảnh lại là **học bài**, chẳng liên quan gì tới hồ sơ.
  - **Lỗi ghi `localStorage` chặn luôn bước đồng bộ lên máy chủ.** `handleUpdateUserProfile` ghi xuống máy trước, không bọc `try/catch`. Ảnh base64 vượt hạn mức lưu trữ làm lệnh ghi ném lỗi ngay tại dòng đó, hàm dừng, `recordStudentAccountToCloud` không bao giờ chạy — ảnh vừa không lưu ở máy vừa không lên máy chủ. Giao diện thì vẫn hiện ảnh vì `setCurrentUser` đã chạy trước, nên học viên tin là đã lưu. Nay gọi máy chủ TRƯỚC, và mỗi lệnh ghi xuống máy tự chịu trách nhiệm riêng.
  - **Không hề nén ảnh trước khi lưu.** Ảnh được nhúng thẳng dạng base64 vào hồ sơ, mà chuỗi base64 phình thêm ~33%. Trần cũ cho phép tải ảnh 3MB → chuỗi ~4MB, **luôn luôn vượt** trần 1MB mỗi tài liệu của Firestore. Nghĩa là với ảnh chụp từ điện thoại, việc lưu lên máy chủ chắc chắn hỏng. Nay thu nhỏ về 256×256 và nén JPEG trước khi lưu (`src/utils/avatarImage.js`), còn khoảng 40KB — an toàn ở cả `localStorage` lẫn Firestore, vẫn nét vì chỗ hiển thị lớn nhất chỉ là ô 56×56.
  - Cắt vuông ở giữa chứ không bóp méo, vì ô hiển thị là hình vuông còn ảnh người dùng chọn thường là khổ dọc chụp từ điện thoại. Ảnh PNG trong suốt được lót nền trắng trước khi chuyển sang JPEG, nếu không phần trong suốt sẽ thành đen kịt.
  - Xoá giá trị ô chọn tệp sau mỗi lần chọn, để học viên sửa ảnh rồi chọn lại đúng tệp đó vẫn kích hoạt được sự kiện.

### Thay đổi

- **Màn hình chào rút từ 3 giây xuống 1 giây, và chỉ chào một lần mỗi phiên.** Trước đây mỗi lần bấm F5 là chào lại từ đầu — học viên tải lại trang giữa buổi học phải ngồi chờ thêm 3 giây, mỗi lần.
  - Dấu "đã chào" lưu bằng **`sessionStorage`**, không phải `localStorage`. Đây là toàn bộ điểm mấu chốt: `sessionStorage` sống sót qua F5 nhưng mất khi đóng tab. Nhờ vậy F5 không chào lại, còn hôm sau mở lại thì vẫn thấy nhận diện thương hiệu một lần. Dùng `localStorage` thì poster chỉ hiện đúng một lần trong đời trên máy đó rồi thôi.
  - **Đánh dấu ngay lúc hiện, không đợi chạy hết giờ.** Đợi tới lúc kết thúc mới ghi thì học viên bấm F5 trong đúng một giây đó vẫn bị chào lại — hiếm, nhưng đúng là hành vi vừa được yêu cầu bỏ đi.
  - Hàm kiểm tra tách sang `src/utils/splashSession.js` thay vì để chung trong `SplashScreen.jsx`: file vừa xuất component vừa xuất hàm sẽ làm hỏng cơ chế nạp nóng lúc lập trình.
  - Truy cập kho lưu trữ bọc trong `try/catch` — trình duyệt ở chế độ ẩn danh ném lỗi khi đọc `sessionStorage`, và lỗi ở màn hình đầu tiên thì sập cả trang. Trường hợp xấu nhất là chào lại mỗi lần, vẫn chạy được.
  - Giữ nút Bỏ qua dù ở mức một giây gần như không kịp bấm: bấm bất kỳ đâu hoặc bấm phím bất kỳ cũng tắt được, và giữ đường thoát rẻ hơn việc gỡ đi rồi phải thêm lại.

### Sửa lỗi

- **Mục Tin tức không còn đường dẫn sang trang ngoài.** Học viên bấm vào là rời ứng dụng sang trang tiếng Anh không kiểm soát được. Gỡ nút "Bài gốc" trên thẻ tin, dòng "Mở bài gốc" trong cửa sổ chi tiết, và thẻ liên kết ở dải tin quốc tế; dải tin nay hiện đoạn tóm tắt đọc ngay tại chỗ.
  - Chặn thêm ở tầng dữ liệu: `api/news.js` **không còn trả đường dẫn bài gốc** về trình duyệt. Quy tắc nằm ở dữ liệu chứ không chỉ là lựa chọn hiển thị, nên sau này có sửa giao diện cũng không có gì để nối lại.
  - Trường `sourceUrl` giữ trong `newsData.js` làm dữ liệu truy xuất nguồn gốc và cờ phân biệt tin thật, nhưng không bao giờ được vẽ ra dưới dạng thẻ liên kết. Giao diện chỉ hiện **tên** nguồn dạng chữ.
- **Nguồn tin bị dồn về một báo.** 6 trong 8 tin thật cùng lấy từ PPC Land. Nay còn 2, tổng cộng **6 nguồn khác nhau**: PPC Land 2, Search Engine Journal 2, Marketing Dive 1, TikTok For Business 1, Search Engine Land 1, Digital Applied 1.
  - Tin TikTok chuyển sang **nguồn công bố chính thức** (`ads.tiktok.com`) thay vì báo viết lại. Vì đổi nguồn nên đã bỏ hai con số vốn là phân tích riêng của PPC Land, không có trên trang chính thức — không thể dẫn nguồn gốc mà lấy số qua trung gian.
  - Routine hằng tuần đã cập nhật: **tối đa 2 tin mỗi tên miền, tối thiểu 5 nguồn**, và `grep` đếm `target="_blank"` phải bằng 0. Vi phạm là không commit được.

---

## [Chưa phát hành] — 2026-07-30

### Sửa lỗi

- **Bản tin đứng yên ở 28/07/2026 dù dữ liệu có cập nhật.** Nguyên nhân không nằm ở nội dung mà ở chỗ lưu trữ: `App.jsx` hễ thấy `localStorage` có khoá `dmm_news_feed_v2` là trả về **nguyên xi** danh sách đã lưu, bỏ qua hoàn toàn file dữ liệu. Nghĩa là biên tập viên thêm tin mới rồi deploy cũng vô ích — mọi người đã từng mở ứng dụng đều bị đóng băng ở danh sách cũ vĩnh viễn.
  - Nay **hợp nhất theo `id`**: tin biên tập luôn đọc lại từ `newsData.js`, phần lưu trong máy chỉ giữ tin do người dùng tự nạp bằng nút Live. Khoá đổi sang `_v3` và tự dọn khoá `_v2` cũ.
- **Nhãn thời gian không tự già đi.** Mỗi tin lưu sẵn một chuỗi chữ như `'Vừa xong (Live Update)'` hay `'1 ngày trước'` ngay trong dữ liệu, nên tin đăng 28/07 vẫn khoe "Vừa xong" nhiều ngày sau, trong khi dòng ngày tuyệt đối ngay bên cạnh lại ghi 28/07 — **mâu thuẫn hiện trên cùng một thẻ**.
  - Gỡ toàn bộ 22 chuỗi ngày cứng khỏi dữ liệu. Nay chỉ lưu `publishedAt` dạng `dd/mm/yyyy`, nhãn tương đối được tính lúc vẽ giao diện (`src/utils/newsDate.js`). Tin nạp từ nút Live hiện "Vừa xong" trong giờ đầu rồi rơi về cách tính theo ngày, thay vì kẹt mãi.
- **Nút "Nạp Tin Cập Nhật Live Mới" bốc ngẫu nhiên nên ra lại tin vừa đọc.** Kho chỉ có 6 tin, bấm vài lần là trùng, người dùng tưởng nút hỏng. Nay chỉ bốc trong số tin **chưa có trong danh sách**, hiện số tin còn lại ngay trên nút và tự khoá khi hết.

### Thêm mới

- **Tám tin thật, biên tập tiếng Việt, có nguồn và ảnh bìa thật.** Mục Tin tức trước đây thuần mô phỏng đào tạo. Nay bổ sung nhóm tin biên tập lại từ bài báo có thật (Meta quý 2/2026, phí theo vị trí 2-5%, bộ tính năng TikTok quý 3, quy định CPSC, nghiên cứu AI Mode cắt 95% sản phẩm, điều khoản Google Ads 01/07, bộ máy quảng cáo OpenAI, nghiên cứu trại lừa đảo AI), mỗi tin kèm `sourceUrl` trỏ đúng bài gốc và ảnh bìa do chính bài đó đăng.
  - **Hai loại tin không được trộn lẫn.** Tin mô phỏng **tuyệt đối không** gắn `sourceUrl` hay ảnh thật — làm vậy là dựng chứng cứ giả. Cờ `isSimulated` gắn tự động lúc gộp mảng chứ không gõ tay từng tin, để không bao giờ xảy ra chuyện thêm tin mô phỏng mà quên đánh dấu.
  - Mỗi thẻ mang nhãn **TIN THẬT - CÓ NGUỒN** hoặc **MÔ PHỎNG ĐÀO TẠO**; cửa sổ chi tiết của tin mô phỏng nhắc lại bản chất ngay trong bài, vì người mở thẳng cửa sổ có thể không thấy băng ghi chú ở ngoài.
- **Ảnh bìa thật thay cho tranh SVG, có đường lùi.** Ảnh nằm trên máy chủ của báo nên có thể đổi đường dẫn hoặc bị chặn bất cứ lúc nào; `onError` chuyển sang tranh SVG dựng sẵn thay vì để ô ảnh vỡ. Dùng `referrerPolicy="no-referrer"` để giảm khả năng bị chặn hotlink.
- **Dải "Tin nóng từ nguồn quốc tế" tự cập nhật** — `api/news.js` kéo RSS từ PPC Land, Search Engine Land và Social Media Today, làm mới mỗi 30 phút.
  - **Chạy ở máy chủ vì các báo này không mở CORS**, trình duyệt gọi thẳng sẽ bị chặn.
  - **Không cài thư viện đọc RSS**: chỉ cần bốn trường nên vài biểu thức chính quy là đủ, thêm phụ thuộc là thêm bề mặt lỗi. Đổi lại mỗi nguồn được bọc riêng trong `try/catch` — một báo hỏng không kéo sập cả dải tin, và không kéo được nguồn nào thì dải tự ẩn thay vì bắn lỗi đỏ vào mặt học viên đang học bài.
  - Trình bày gọn dạng thẻ ngang và ghi rõ "tiêu đề nguyên văn tiếng Anh", cố ý để không lấn phần bản tin phân tích tiếng Việt bên dưới.

---

## [Chưa phát hành] — 2026-07-29

### Thêm mới

- **Trao đổi hai chiều giữa Ban Quản Trị và học viên, ngay trong khung chat Pipi.** Trước đây lời nhắn chỉ đi một chiều: học viên gửi xong là hết, Ban Quản Trị muốn trả lời phải thoát ra mở email hoặc gọi điện — và học viên không có cách nào biết mình đã được trả lời.
  - **Mỗi lượt trả lời là một tài liệu riêng** trong subcollection `support_messages/{id}/replies`, không phải phần tử trong một mảng trên tài liệu cha. Mảng thì mỗi lần thêm phải ghi lại toàn bộ tài liệu — hai người cùng trả lời một lúc là mất một lượt — và luật không soi được từng phần tử bên trong, tức là không chặn được việc mạo danh.
  - **Khung hội thoại dùng chung một thành phần** (`SupportThread.jsx`) cho cả hai phía. Dựng hai bản riêng thì chúng sẽ trôi khỏi nhau, mà đây đúng là chỗ không được phép lệch: hai bên phải nhìn thấy cùng một nội dung, cùng một thứ tự, thì mới nói chuyện được với nhau.
  - **Học viên**: nút Pipi hiện **chấm đỏ kèm số** khi có phản hồi chưa xem, bóng chào đổi hẳn nội dung thành "Ban Quản Trị đã trả lời bạn!", và bấm vào là mở thẳng hộp thư chứ không bắt tự mò xem chấm đỏ báo chuyện gì. Khung chat có thêm hai màn: **Hộp thư** (danh sách cuộc trao đổi) và **màn hội thoại** (nhắn tiếp được).
  - **Ban Quản Trị**: nút **"Trả lời trong app"** đặt trước nút email — học viên nhận phản hồi ngay trong Pipi, không phải đi mở hộp thư email. Mở cuộc trao đổi ra là tự đánh dấu đã đọc; bắt bấm thêm một nút nữa để nói điều hiển nhiên đó chỉ khiến bộ đếm chưa đọc trôi khỏi thực tế. Cuộc nào học viên vừa nhắn tiếp thì hiện dòng "đang chờ trả lời".
  - Gửi thành công là **vào thẳng cuộc trao đổi vừa mở**, để học viên thấy ngay lời mình vừa gửi nằm đúng chỗ sẽ nhận được câu trả lời.
- **Khảo sát nhu cầu học viên — 5 câu, hỏi ngay sau khi đăng ký, bắt buộc xong mới nhận bằng.** Mục đích: phân tệp học viên (chuyên viên / quản lý / chủ doanh nghiệp) để thiết kế khoá nâng cao "đo ni đóng giày" cho từng nhóm.
  - **Mỗi màn một câu, bấm đáp án là sang câu kế** (`SurveyModal.jsx`). Bảng này bật lên đúng lúc học viên đang muốn vào học; một biểu mẫu dài 5 câu hiện ra khi đó trông như một hàng rào, còn năm màn bấm một nhát thì không. Câu 1 có đáp án "Khác" mở ô ghi tay — và **bỏ trống ô đó thì chưa tính là trả lời xong**, vì bản ghi khi ấy chỉ nói được "không thuộc bốn nhóm kia", đúng thứ vô dụng nhất khi đi phân tệp.
  - **Lịch xuất hiện leo thang ba nấc**: sau khi đăng ký → mỗi lần đăng nhập → lúc bấm nhận Bằng Chứng Nhận. Hai nấc đầu bỏ qua được, nấc ba thì **không dựng nút "Bỏ qua" ra** (không vẽ nút rồi chặn). Chốt chặn phải nằm ở bước cấp bằng: đặt cả ba đều là lời mời thì bộ dữ liệu sẽ thủng đúng ở nhóm học viên đi tới cuối khoá — nhóm đáng phân tệp nhất.
  - **Mọi lối mở bằng gom về một hàm `requestCertificate()`** (Header, thanh menu, thanh dưới màn nhỏ, băng mời trong khoá Trade). Chặn ở bốn nơi riêng lẻ thì chỉ cần bỏ sót một nơi là cả chốt chặn vô nghĩa. Học viên bấm bằng nào thì sau khảo sát mở đúng bằng đó.
  - **Quản trị viên không bị hỏi** — khảo sát để phân tệp học viên, chặn Ban Quản Trị chỉ làm bẩn dữ liệu. Bảng khảo sát cũng hoãn 900ms mới bật, chờ `resolveAdminRole()` trả lời: bật ngay sẽ loé lên trên màn hình quản trị viên rồi tự tắt, trông như lỗi.
  - **Bộ câu hỏi nằm ở một nguồn khẳng định duy nhất** (`src/data/surveyQuestions.js`) — modal, cột trong Bảng Quản Trị và tiêu đề cột của tệp xuất đều đọc từ đó. Câu trả lời lưu theo **mã đáp án** chứ không theo nhãn hiển thị, nên sửa chữ trên màn hình không làm hỏng dữ liệu cũ; đổi hay xoá mã thì phải tăng `SURVEY_VERSION`, và số phiên bản đi kèm từng bản ghi.
  - **Lưu hai nơi, mỗi nơi một việc**: bản localStorage (`dmm_survey_<email>`) quyết định có hỏi hay không — đọc được ngay, không chờ mạng; bản trong hồ sơ Firestore để Ban Quản Trị đọc và xuất báo cáo. Hợp nhất chỉ theo **một chiều**: bản đám mây đã hoàn tất đè lên bản tại máy còn dở, không bao giờ ngược lại — nếu không, học viên vừa bấm xong câu cuối sẽ bị bắt làm lại từ đầu.
  - Khảo sát cất **trong** hồ sơ học viên chứ không mở collection riêng, nên **không cần thêm luật Firestore nào**: `canUpdateProfile()` vốn đã cho học viên sửa hồ sơ của chính mình. Kèm theo: Bảng Quản Trị đọc được ngay vì nó vốn đã đọc `students`, và xoá học viên là mất luôn khảo sát của họ, không sót bản ghi mồ côi.
- **Bảng Quản Trị đọc và xuất được toàn bộ khảo sát.** Thêm cột **Khảo Sát** (bấm vào mở đủ 5 câu trả lời của học viên đó, bản dở dang cũng xem được — biết họ dừng ở câu nào cũng là dữ liệu), bộ lọc **Đã làm / Chưa làm** kèm số đếm, và khung chi tiết ghi rõ thời điểm hoàn tất cùng số lần đã bỏ qua trước đó.
  - **Nút xuất CSV nay mang theo mọi thứ**: 10 cột hồ sơ + 5 cột câu trả lời + tình trạng khảo sát + số lần bỏ qua + thời điểm hoàn tất, thêm cả tiến độ khoá Trade vốn bị bỏ sót. Tiêu đề cột khảo sát đọc từ chính bộ câu hỏi nên sửa câu hỏi là tệp xuất tự khớp theo.
  - **Sửa một lỗi có sẵn ở hàm xuất CSV**: cột "Trạng Thái Tốt Nghiệp" trước đây không bọc nháy kép. Nay **mọi ô đều bọc** — nhãn đáp án khảo sát có dấu phẩy sẵn ("Facebook, Google, TikTok") và ô "Khác" thì học viên gõ gì cũng được; sót một ô là cả dòng lệch cột mà nhìn qua vẫn thấy bình thường. Số 11 ghi cứng trong hàm này cũng đã thay bằng `COURSE_MODULES.length`.
- **Hộp Thư Hỗ Trợ — học viên để lại lời nhắn từ khung chat Pipi, Ban Quản Trị nhận thông báo.** Trước đây học viên gặp trục trặc thì không có lối nào báo cho ai: Pipi chỉ tra được dữ liệu có sẵn trong app, và khi nó bí thì cuộc trò chuyện kết thúc ở đó.
  - **Nút "Nhắn Ban Quản Trị" nằm thường trực trên đầu khung chat** (`PipiChat.jsx`), không chôn sau một câu hỏi mà Pipi phải trả lời trúng mới hiện ra — đúng lúc học viên bí nhất lại là lúc không tìm thấy nút. Khung soạn là một chế độ của chính khung chat chứ không phải cửa sổ mới, nên đoạn hội thoại vừa rồi vẫn nằm đó và học viên không phải kể lại từ đầu.
  - **Pipi tự đề nghị chuyển lời** ở hai chỗ (`pipiBrain.js`): khi nhận ra ý định xin hỗ trợ ("cần hỗ trợ", "gặp admin", "báo lỗi", "khiếu nại"...), và ở câu trả lời `notfound` — câu hỏi Pipi không tra được mới đúng là câu cần người thật trả lời. Mẫu nhận ý định cố ý đòi diễn đạt rõ: bắt mỗi chữ "hỗ trợ" sẽ nuốt luôn những câu như "chỉ số nào hỗ trợ đo hiệu quả".
  - **Chuông thông báo trên thanh đầu trang** (`Header.jsx`), chỉ dựng cho quản trị viên, huy hiệu đỏ đếm số **chưa đọc** chứ không phải tổng số — tổng thì đứng yên nên nhìn mãi cũng không biết có việc mới. Có ở cả bản màn nhỏ vì quản trị viên hay trực bằng điện thoại. Kèm băng báo nổi khi có lời nhắn mới tới giữa phiên, chỉ báo khi con số **tăng** và bỏ qua lượt nạp đầu — không bỏ thì cứ mở trang là lại bị báo về lời nhắn cũ đã biết.
  - **Hộp thư đầy đủ** (`SupportInboxModal.jsx`): lọc theo `Chưa đọc / Đã đọc / Đã xử lý / Tất cả`, trả lời nhanh qua email hoặc gọi điện, đánh dấu đã đọc / đã xử lý / mở lại, xoá có hỏi lại. Nội dung giữ nguyên cách xuống dòng của người viết vì lời nhắn kể lỗi thường có danh sách bước.
  - **`null` và `[]` không được gộp**, ở cả kênh theo dõi lẫn giao diện: `null` là chưa đọc được (mất mạng, thiếu quyền, chưa deploy rules), `[]` là đọc được và hộp thư rỗng. Gộp lại thì lúc hỏng, màn hình báo "chưa có lời nhắn nào" trong khi có học viên đang chờ trả lời — nên trạng thái hỏng có màn riêng, nói thẳng nguyên nhân thường gặp.
  - Kênh theo dõi Firestore đặt ở `App.jsx` chứ không trong hộp thư: chuông trên Header cần đúng danh sách đó, mở hai kênh cho cùng một collection thì hai nơi lệch nhau đúng vào lúc có tin mới.
  - Năm hàm mới trong `src/firebase.js` — `sendSupportMessage()`, `listenToSupportMessages()`, `setSupportMessageStatus()`, `deleteSupportMessage()`, hằng `SUPPORT_MESSAGE_MAX`. Lược đồ collection: xem [DATABASE.md](DATABASE.md).

### Sửa lỗi

- **Học viên không đọc được phản hồi của Ban Quản Trị** (`listenToSupportReplies`). Truy vấn liệt kê lượt trả lời không có vế lọc nào, trong khi luật đọc là `isAdmin() || resource.data.threadEmail == myEmail()`. Với truy vấn liệt kê, Firestore **không lọc bớt tài liệu rồi trả về phần được phép** — nó xét xem bản thân truy vấn có bảo đảm mọi tài liệu trả về đều thoả luật không, và từ chối cả lệnh nếu không. Truy vấn không lọc thì với học viên không bảo đảm được gì → `permission-denied`.
  - Lỗi này **chỉ học viên gặp**, quản trị viên thì không — vế `isAdmin()` đúng vô điều kiện, không phụ thuộc truy vấn. Đúng kiểu lỗi mà người dựng tính năng không bao giờ tự thấy, vì họ luôn thử bằng tài khoản quản trị.
  - Sửa bằng cách lọc theo email **CHỦ cuộc trao đổi** (không phải email người đang xem): với học viên đó chính là email của họ nên khớp luật; với quản trị viên thì vế `isAdmin()` cho qua bất kể lọc gì. Một dạng truy vấn dùng được cho cả hai phía.
  - Không thêm `orderBy` kèm `where` vì cặp đó đòi chỉ mục ghép mà Firestore không tự tạo — sắp xếp tại máy, cùng cách đã dùng ở `listenToMySupportThreads()`.
- **Thông báo khi gửi lời nhắn hỏng đã nói sai nguyên nhân.** Gặp `permission-denied`, bản đầu hiện "Hãy đăng nhập lại rồi thử lần nữa" — trong khi nguyên nhân thật là luật `support_messages` chưa có trên máy chủ. Đăng nhập lại không sửa được luật, nên câu đó chỉ khiến học viên thử đi thử lại một việc vô ích rồi bỏ cuộc mà không ai biết hệ thống đang hỏng. Nay nói thẳng đây là lỗi cài đặt của hệ thống chứ không phải lỗi tài khoản, kèm mã lỗi để báo lại, và ghi ra console đúng khối rules còn thiếu cùng cách Publish.
- **Email trong lời nhắn lấy từ ID token, không lấy từ hồ sơ trong state.** Rules đối chiếu `request.resource.data.email` với `request.auth.token.email`; hồ sơ trong state lại ghép từ localStorage và Firestore nên có thể mang email cũ của người dùng trước trên máy dùng chung. Lệch một ký tự là máy chủ từ chối, mà thông báo hiện ra lại đổ cho quyền truy cập — lấy thẳng từ token thì cả lớp lỗi đó biến mất.
- **`diagnoseCloudAccess()` thêm bước "Đọc hộp thư hỗ trợ".** Phân biệt được hai việc mà nhìn giao diện không phân biệt nổi: hộp thư trống thật, với luật chưa deploy nên không đọc được — cả hai đều ra một màn hình trắng trơn. Quản trị viên tự xác nhận được bằng nút kiểm tra kết nối sẵn có trong Bảng Quản Trị.

### Bảo mật

- **Bịt lỗ chiếm chỗ hồ sơ học viên** (`firestore.rules`, `canCreateProfile`). Luật cũ chỉ soi **nội dung** tài liệu (`email` phải khớp email trong token) chứ không soi **chỗ đặt**, nên một tài khoản hợp lệ tạo được `students/<id_suy_từ_email_người_khác>` mang email của chính nó. Tài liệu đó chiếm sẵn chỗ của nạn nhân; tới lượt nạn nhân đăng ký, lệnh ghi trở thành `update` trên tài liệu của người khác và bị `canUpdateProfile()` từ chối — nạn nhân **vĩnh viễn không lưu được hồ sơ lên hệ thống**, và làm hàng loạt chỉ tốn một vòng lặp. Nay id tài liệu bắt buộc là id suy từ email của chính người gọi hoặc `uid` của họ. Quản trị viên vẫn đặt tuỳ ý vì còn phải cấp bằng thủ công cho người chưa có tài khoản.
  - ⚠️ **Phải deploy rules thì mới có tác dụng, và phải kiểm chứng ngay sau khi Publish** — phép dựng lại id dùng `replace()` của ngôn ngữ rules, lệch một ký tự là học viên mới không đăng ký được. Các bước kiểm chứng và cách hoàn nguyên: xem [DEPLOYMENT.md](DEPLOYMENT.md#security-rules--bắt-buộc-deploy).
- **Luật cho collection `support_messages`.** Phải đăng nhập mới gửi được và trường `email` bắt buộc khớp email trong ID token — thiếu điều kiện đó thì ai cũng gửi được lời nhắn mạo danh học viên khác. `status` lúc tạo ép cứng là `new` để người gửi không tự đánh dấu lời nhắn của mình là đã xử lý. Trần độ dài chặn **trong rules** chứ không chỉ ở ô nhập, vì lệnh ghi gửi thẳng thì không đi qua ô nhập. Khoảng nghỉ 20 giây giữa hai lần gửi chỉ chặn ở máy khách — nó ngăn bấm nhầm hai lần, **không** ngăn được người cố tình bơm rác.
- **Đã rà lại và xác nhận đang đúng:** khoá API và Email/Password của Firebase còn hiệu lực; `firestore.rules` trong kho mã **đã được deploy thật** (đọc `students` và `admins` khi chưa đăng nhập đều bị từ chối, `analytics` đọc công khai được — khớp đúng tệp rules); `.env` bị `.gitignore` chặn và không nằm trong lịch sử Git.

### Thay đổi

- **Quản trị viên xem được toàn bộ nội dung, không cổng khoá nào áp lên tài khoản này.** Ban Quản Trị phải soát được bài giảng, bài kiểm tra và mẫu bằng của mọi khoá để kiểm duyệt; bắt họ học lại từ đầu bằng chính tài khoản quản trị thì vừa vô nghĩa vừa làm bẩn số liệu tiến độ học viên.
  - **Khoá Trade Marketing mở sẵn** — `isTradeCourseUnlocked` nay là `isAdmin || đủ 11 chuyên đề khoá chính` (`App.jsx`). Cờ này chảy sang Sidebar, FeatureMenuBar, MobileBottomNav và cổng kết xuất ở tab `trade`, nên sửa một chỗ là mở đúng mọi lối vào — không chỗ nào còn tự tính lại điều kiện.
  - **Bằng Chứng Nhận cả hai khoá mở sẵn** — truyền `adminOverride` cho cả bằng khoá chính lẫn bằng khoá Trade. Dùng lại đúng cờ sẵn có của `CertificateModal` (vốn dựng cho việc quản trị viên cấp bằng thủ công) chứ không thêm nhánh điều kiện thứ hai.
  - **Băng mời nhận bằng trong tab Trade hiện ngay** (`TradeMarketingCourse.jsx`) — đây là lối duy nhất mở mẫu bằng khoá Trade ra xem trên màn đó; không mở thì quản trị viên vẫn không soát được nó.
  - Điều kiện đọc **`currentUser.role`**, thứ duy nhất được cấp sau khi máy chủ xác nhận (`resolveAdminRole`). Sửa localStorage không tự phong được quyền xem này vì `role` khi khôi phục phiên luôn khởi tạo lại là `'student'`. Học viên thường **không đổi gì**: mọi điều kiện cũ giữ nguyên.
  - `isAdmin` dời lên khai báo cùng chỗ với các cổng khoá thay vì nằm rải trong thân hàm — các cờ khoá đều phải hỏi tới nó.

---

## [Chưa phát hành] — 2026-07-28

### Thêm mới

- **Bảng Quản Trị chọn được khoá học khi cấp bằng.** Thêm ô chọn khoá ở thanh công cụ và trong cửa sổ tạo chứng nhận; áp dụng cho cả nút "Cấp Bằng" từng dòng, tạo thủ công lẫn cấp hàng loạt từ Excel/CSV. Danh sách khoá đọc thẳng từ `CERTIFICATE_COURSES` nên thêm khoá mới vào cấu hình đó là tự xuất hiện, không phải sửa hai nơi.
  - Dùng **một** state duy nhất cho cả ba lối cấp bằng. Tách thành nhiều lựa chọn riêng sẽ sinh ra cảnh chọn một đằng cấp một nẻo mà không ai nhận ra.
  - Tiến độ ghi vào **đúng trường của khoá**: khoá chính vào `completedModules`, khoá Trade vào `completedTradeModules`. Ghi nhầm trường sẽ khiến học viên bỗng dưng "tốt nghiệp" khoá chưa hề học. Đã kiểm chứng id hai khoá không trùng nhau (`module-*` và `trade-*`).
  - Bỏ danh sách id ghi cứng `'module-01'..'module-11'` trong hai hàm tạo bằng, đọc từ `COURSE_MODULES` / `TRADE_MODULES`. Danh sách ghi tay sai ngay khi khoá đổi cấu trúc và hoàn toàn không dùng được cho khoá Trade.
- **Bằng Chứng Nhận riêng cho khoá Trade Marketing Thực Chiến.** Cấp khi học viên đạt đủ **5/5 chuyên đề** khoá Trade, độc lập với bằng khoá chính — hai bằng có **mã xác thực khác nhau** và tên tệp khác nhau (`ChungNhan_PMARCOM_*` và `ChungNhan_PMARCOM_TRADE_*`). Khoá chính cố ý không đổi cách sinh mã, nếu không toàn bộ mã của những bằng đã cấp sẽ đổi theo.
  - Nội dung riêng của từng khoá (tên khoá, số bài kiểm tra, phạm vi kiến thức) tách khỏi template thành `CERTIFICATE_COURSES` trong `utils/certificateExport.js`. Trước đây ghi cứng trong template; nhân đôi template cho khoá thứ hai thì hai bản sẽ trôi khỏi nhau ngay lần sửa hoạ tiết đầu tiên.
  - Băng mời nhận bằng hiện ngay trên lưới chuyên đề trong tab Trade khi vừa đạt đủ, để học viên không phải đi tìm.
  - Điều kiện xét theo **id chuyên đề**, không theo độ dài mảng: tiến độ cũ lưu trong máy có thể còn id đã bị xoá, khiến đếm số lượng vẫn đủ trong khi thực tế còn chuyên đề chưa học.
  - Sửa kèm một lỗi chính tả có sẵn: dấu chấm cuối câu mô tả nằm sai vị trí so với ngoặc đơn. Đã đối chiếu từng ký tự để chắc chắn nội dung bằng khoá chính không đổi.
- **`firestore.rules` + `firebase.json` — lớp chặn phía máy chủ, chặn tự phong quản trị viên.** Trước đây kho mã **không có** rules nào, nghĩa là cơ sở dữ liệu chạy theo cấu hình mặc định trên Console và bất kỳ ai mở trang cũng đọc được toàn bộ hồ sơ học viên bằng vài dòng trong devtools. Mô hình mới: quyền quản trị = có bản ghi trong collection `admins`, và **chỉ quản trị viên hiện hành mới ghi được vào sổ đó**. Người ngoài không có quyền nên không tự đưa mình vào sổ quyền. Rules cũng chặn học viên tự ghi `role: 'admin'` vào hồ sơ của mình, chặn đọc hồ sơ người khác, chặn thổi số bộ đếm truy cập, và **từ chối mọi lệnh sửa/xoá bản ghi của Quản Trị Tối Cao** — chốt chặn này nay nằm ở máy chủ chứ không chỉ ở giao diện. ⚠️ **Phải deploy thì mới có tác dụng**, xem [DEPLOYMENT.md](DEPLOYMENT.md#security-rules--bắt-buộc-deploy).
- **Bốn hàm truy cập sổ phân quyền** (`src/firebase.js`) — `isAdminInCloud()`, `fetchAdminRosterFromCloud()`, `grantAdminInCloud()`, `revokeAdminInCloud()`. `isAdminInCloud` trả về ba trạng thái `true` / `false` / `null`, và nơi gọi bắt buộc phân biệt `false` (máy chủ nói không có quyền) với `null` (chưa hỏi được) — gộp hai cái làm một sẽ khiến quản trị viên mất quyền mỗi lần rớt mạng.
- **Phân quyền quản trị hai tầng** (`src/utils/adminRoles.js`) — tầng **Quản Trị Tối Cao** (`admin@pmarcom.edu.vn`) nằm cứng trong mã, không tài khoản nào thu hồi quyền hay xoá được; tầng **Quản Trị Viên** do quản trị viên khác nâng quyền, ghi ở `dmm_admin_emails` và thu hồi được. Lý do khoá cứng tầng trên: ứng dụng không có backend để khôi phục, nên nếu quyền cao nhất mà gỡ được thì chỉ một cú bấm nhầm là mất Bảng Quản Trị vĩnh viễn.
- **Bảng phân quyền ngay trong Bảng Quản Trị Học Viên** (`AdminDashboardModal.jsx`) — thêm cột **Phân Quyền** với huy hiệu ba mức, nút **Nâng Quyền** cho học viên, nút **Thu Hồi Quyền** cho quản trị viên thường, và **huy hiệu khoá** thay cho nút ở tài khoản Quản Trị Tối Cao (không vẽ nút ra chứ không phải vẽ rồi chặn). Kèm bộ lọc theo phân quyền, dòng quy tắc phân quyền hiển thị thường trực, và sắp xếp quyền cao nhất lên đầu bảng.
- **Tài khoản Quản Trị Tối Cao luôn hiển thị trong bảng** (`withRootAdmins`) — bản ghi thật của nó chỉ sinh ra sau lần đăng nhập đầu tiên trên từng máy, và `filterDeleted` có thể loại nó đi vì dữ liệu cũ. Không hiển thị thì quản trị viên không thấy được ai đang giữ quyền cao nhất.
- **`setStudentRoleInCloud()`** (`src/firebase.js`) — đồng bộ vai trò lên Firestore `students` + `registrations`. Đây là đường duy nhất để quyền cấp ở máy này có hiệu lực trên máy khác, vì sổ `dmm_admin_emails` chỉ nằm ở localStorage của một máy.
- **Khoá nâng cao Trade Marketing, mở sau khi tốt nghiệp khoá chính** — 5 chuyên đề, 16 bài học, 20 câu hỏi, tổng 230 phút (`src/data/tradeCourseData.js`). Nội dung chuyển từ tài liệu "Trade Marketing — Định hướng nghề nghiệp cho sinh viên" của Lê Thành Phong (7/2026) sang dạng chuyên đề chạy được trong ứng dụng: định nghĩa nghề và ba đối tượng shopper/consumer/customer, bốn kênh phân phối, sáu khối kiến thức cùng bộ chỉ số Trade, lộ trình nghề và dữ liệu tuyển dụng, sáu khoảng trống của người mới và kế hoạch 90 ngày.
- **Cổng khoá theo điều kiện bắt buộc** (`src/components/TradeMarketingCourse.jsx`) — chưa hoàn thành đủ 11 chuyên đề khoá chính thì khoá Trade hiện màn giải thích điều kiện, thanh tiến độ và nút dẫn thẳng tới chuyên đề còn dang dở, kèm phần xem trước 5 chuyên đề bên trong. Cố ý không giấu hẳn mục này: học viên cần biết có khoá nâng cao để có động lực học hết khoá chính.
- **Vẽ lại ảnh bìa chia sẻ `public/og-cover.png` theo bảng màu mới** — nền Egg Shell, thẻ trắng viền Indigo Dye, chip Rose Pink, tiêu đề navy, biểu đồ tăng trưởng chuyển từ Indigo sang Rose Pink, dải chuyển sắc ở chân thẻ. Bản cũ vẫn là tông xanh lá + vàng đồng vì là ảnh nướng sẵn, không ăn theo thang màu Tailwind như phần còn lại của app. Bìa dựng bằng GDI+ nên tái tạo lại được, số liệu trên bìa (11 chuyên đề, 36 bài học, 121 thuật ngữ, 55 câu hỏi) đọc từ dữ liệu thật. Chân bìa mang slogan chính thức **"Học thật - Chiến thật - Kết quả thật"** do chủ dự án cung cấp.
- **Bản tin thuật toán được viết lại thành bài viết đầy đủ** — từ 5 tin rút gọn lên **16 bài** (`src/data/newsData.js`), mỗi bài có nguồn tham chiếu, ngày đăng, thời lượng đọc, thẻ chủ đề, 2-3 số liệu chính, thân bài 3-4 phần phân tích, mục "cái giá nếu bỏ qua" và mốc thời gian áp dụng. Tổng 63 phần thân bài. Kho tin mô phỏng nâng từ 3 lên 6 mục, cùng cấu trúc.
- **14 tranh minh hoạ SVG nội tuyến cho tin tức** (`src/components/NewsIllustration.jsx`) — thay ảnh stock Unsplash trước đây. Mỗi tranh vẽ đúng nội dung bài: thuật toán phân bổ ngân sách, sức khoẻ gian hàng, tìm kiếm không nhấp chuột, nhân bản video bằng AI, xác thực tài khoản, hoa hồng liên kết, loại trừ từ khoá, bão hoà nội dung, tín hiệu dữ liệu, phát trực tiếp, đấu giá hiển thị, tự động hoá chăm sóc, nhãn nội dung AI, tốc độ trang. Cùng lý do kỹ thuật với `LessonIllustration`: không phát sinh yêu cầu mạng nên không vỡ ảnh, nét sắc ở mọi độ phân giải.
- **Cửa sổ đọc chi tiết bài viết** — thẻ tin giữ phần tóm tắt để lướt nhanh, toàn bộ thân bài, tác động, rủi ro và danh sách việc cần chỉ đạo chuyển vào cửa sổ riêng.
- **Băng ghi rõ đây là bản tin mô phỏng phục vụ đào tạo**, kèm nhắc đối chiếu thông báo chính thức của nền tảng trước khi áp dụng. Trường nguồn chỉ ghi tên kênh công bố, không kèm đường dẫn để tránh bị hiểu là trích dẫn thật.
- **Bổ sung 100 thuật ngữ cho Từ Điển Digital Marketing** — nâng từ 21 lên **121 thuật ngữ** (`src/data/glossaryData.js`). Mỗi mục đủ 7 trường: định nghĩa chuyên sâu, công thức (nếu là chỉ số đo được), ví dụ có số liệu Việt Nam và lưu ý cốt lõi cho Trưởng phòng.
  - Chỉ Số & KPIs: thêm 26 mục — CPC, ROI, MER, Break-even ROAS, LTV/CAC, Churn, Retention, RPR, ARPU, GMV, Frequency, Reach, Impressions, Engagement Rate, Bounce Rate, Session Duration, CPV, VTR, Hook Rate, CPI, SOV, Share of Search, NPS, CSAT, CAC Payback, Gross Margin.
  - Chiến Lược & Mô Hình: thêm 20 mục — STP, 4P, 7P, SWOT, PESTLE, 5 Áp Lực Porter, AIDA, See-Think-Do-Care, Customer Journey Map, Phễu TOFU/MOFU/BOFU, Buyer Persona, USP, Positioning Statement, Omnichannel, O2O, Growth Hacking, AARRR, Product-Market Fit, OKR, Always-on.
  - Kênh & Công Nghệ Số: thêm 18 mục — PPC, SEM, GDN, Performance Max, YouTube Ads, TikTok Ads, Zalo Ads/OA, Programmatic, Native Ads, Affiliate, KOL/KOC, Email Marketing, SMS Brandname/ZNS, ASO, Landing Page, Lookalike Audience, Quality Score, Backlink.
  - Sáng Tạo & Truyền Thông: thêm 14 mục — CTA, PAS, FAB, Storytelling, Content Pillar, Content Calendar, Tone of Voice, Key Visual, TVC, Seeding, Newsjacking, Brand Guideline, Creative Fatigue, Thumbnail & Tiêu đề.
- **Ba nhóm danh mục mới** trong bộ lọc: **Dữ Liệu & Đo Lường** (12 mục: GA4, GTM, Meta Pixel, CAPI, UTM, Attribution Model, MMM, Cohort Analysis, A/B Testing, First-party Data, CDP, CRM), **E-commerce & Sàn TMĐT** (6 mục: Quảng cáo sàn, Livestream Commerce, Flash Sale, Cart Abandonment, Tối ưu listing, Return Rate), **AI & Tự Động Hóa** (4 mục: Marketing Automation, AI Chatbot, Prompt Engineering, Predictive Analytics).
- **Dòng đếm kết quả** phía trên lưới thẻ ("Hiển thị X / 121 thuật ngữ") kèm nút **Xóa bộ lọc** hiện khi đang tìm kiếm hoặc lọc danh mục (`DigitalGlossary.jsx`).

### Thay đổi

- **Vẽ lại nhân vật trợ lý Pipi thành robot hiện đại — gỡ rủi ro bản quyền.** Tạo hình cũ là mèo máy đầu tròn xanh, mặt trắng, mũi đỏ có vạch dọc, râu mèo, vòng cổ kèm chuông. Chú thích trong mã khi đó ghi *"cố ý KHÔNG sao chép Doraemon"*, nhưng đúng tập hợp đặc điểm ấy chính là tạo hình Doraemon — nhân vật có bản quyền của Fujiko Pro. Chú thích phủ nhận không làm thay đổi bản chất của hình vẽ. Bản mới đổi hẳn hình khối (đầu vuông bo góc thay vì tròn), bỏ sạch chi tiết nhận dạng cũ, thay bằng kính che mặt tối màu với hai mắt phát sáng, ăng-ten, khối loa hai bên, và miệng là dải sóng âm khi đang trả lời. Bảng màu chuyển sang ngọc lục bảo cho khớp thương hiệu. Emoji 🔔 trong lời chào đổi thành 🤖 (`PipiChat.jsx`, `pipiBrain.js`).
  - Id gradient nay sinh theo `useId()` cho từng lần vẽ: nhiều `PipiAvatar` cùng nằm trên một trang (nút nổi, đầu khung chat, từng dòng trả lời) mà trùng id thì trình duyệt lấy định nghĩa đầu tiên cho tất cả.
- **Quyền quản trị chỉ còn cấp ở một chỗ duy nhất: sau khi Firebase Auth xác thực và máy chủ xác nhận** (`App.jsx`, `resolveAdminRole`). Ba nguồn cũ đều nằm trong localStorage và đều là đường tự phong: `dmm_active_user.role` (sửa một dòng là có nút Quản Trị ngay từ lần tải trang đầu), `dmm_users_db.role`, và sổ `dmm_admin_emails`. Cả ba nay hạ xuống làm **bộ nhớ đệm**, chỉ dùng khi không hỏi được máy chủ, và không tự sinh ra quyền cho email chưa từng được xác nhận. Đổi lại, nút Quản Trị xuất hiện chậm hơn khoảng một nhịp mạng sau khi tải trang.
- **Nhánh đăng nhập dự phòng không còn cấp quyền quản trị** (`AuthModal.jsx`, `App.jsx`). Bản ghi mồi trong `dmm_users_db` trước đây kèm `role: 'admin'` **và** mật khẩu đọc được ngay trong mã nguồn công khai — đây là đường chiếm quyền dễ nhất trong toàn ứng dụng, còn chẳng cần tự phong. Nay `handleLoginSuccess` gỡ bỏ mọi vai trò do phía đăng nhập gửi sang, và bản ghi mồi không còn trường `role`.
- **Chặn đăng ký bằng email của tài khoản Quản Trị Tối Cao** (`AuthModal.jsx`). Nếu tài khoản đó chưa tồn tại trên Firebase Auth thì bất kỳ ai cũng đăng ký chiếm chỗ để thành quản trị viên cao nhất. Chặn ở form chỉ là lớp cuối — biện pháp thật là tạo sẵn tài khoản trên Console, đã ghi thành việc bắt buộc trong [TODO.md](TODO.md#bảo-mật).
- **Nâng quyền / thu hồi quyền ghi lên máy chủ TRƯỚC, cập nhật giao diện SAU** (`AdminDashboardModal.jsx`). Nếu Firestore Rules từ chối thì dừng lại và báo lỗi nguyên văn, không hiện "đã nâng quyền" cho một thao tác chưa hề xảy ra. Bảng cũng đọc sổ phân quyền từ máy chủ để hiển thị huy hiệu, và báo rõ khi đang phải dùng bộ nhớ đệm.
- **`getUserProgressFromCloud()` dò theo cả uid lẫn id suy ra từ email.** Lệnh ghi lưu tài liệu theo email nhưng nơi gọi chỉ có uid, nên hầu hết tài khoản đọc ra chỗ trống — đó là lý do hồ sơ đám mây (gồm cả tiến độ học đã đồng bộ) gần như không bao giờ nạp được khi đăng nhập ở máy mới.
- **`recordStudentAccountToCloud()` chỉ ghi kèm `role` khi tài khoản là quản trị viên.** Cố ý không ghi `'student'`: hàm này chạy mỗi lần chính chủ lưu hồ sơ, mà một máy chưa biết mình vừa được nâng quyền sẽ gửi lên `role: 'student'` và xoá mất quyền vừa cấp. Việc hạ quyền đi bằng đường riêng, có chủ đích: `setStudentRoleInCloud()`.
- **`resolveUserRole()` tra sổ phân quyền trước tiên** (`App.jsx`) — tài khoản gốc luôn là quản trị viên, và người vừa được nâng quyền nhận đúng vai trò ngay lần đăng nhập kế tiếp mà không phải chờ Firestore trả lời.
- **Số liệu Bảng Quản Trị tách tài khoản quản trị khỏi học viên.** Trước đây "Tổng Học Viên" và "Tỷ Lệ Hoàn Thành" đếm cả quản trị viên — người không đi học nhưng vẫn bị tính vào mẫu số, làm tỷ lệ hoàn thành thấp giả tạo. Số lượng quản trị viên hiển thị riêng. Báo cáo CSV xuất thêm cột **Phân Quyền**.
- **Không xoá được tài khoản đang có quyền quản trị.** Quản Trị Tối Cao: tuyệt đối. Quản trị viên thường: phải thu hồi quyền trước — bắt đi qua hai bước để không ai xoá nhầm một người đang có quyền chỉ bằng một cú bấm. Quản trị viên cũng không tự thu hồi quyền của chính mình được, vì thao tác đó sẽ đá họ ra khỏi bảng ngay giữa chừng.
- **Tiến độ khoá Trade đồng bộ lên Firestore.** Thêm trường `completedTradeModules` vào hồ sơ học viên; đăng nhập trên máy mới sẽ hợp nhất tiến độ đám mây với tiến độ đang có tại máy thay vì ghi đè — học viên có thể đã học vài chuyên đề ở chế độ khách trước khi đăng nhập.
- **Gom việc dựng hồ sơ học viên gửi lên Firestore về một chỗ** (`buildStudentPayload`). Ghi dùng `merge: true` nên mỗi effect chỉ gửi phần dữ liệu nó sở hữu: effect khoá chính gửi `completedModules`, effect khoá Trade gửi `completedTradeModules`. Nhờ vậy không effect nào phải đọc state của effect kia — thứ vừa gây cảnh báo thiếu dependency vừa có nguy cơ ghi đè bằng giá trị cũ kẹt trong closure.
- **Thêm mục Trade vào thanh điều hướng đáy trên điện thoại**, đổi `justify-around` thành `justify-between` để bảy mục không tràn ngang trên máy hẹp. Trước đó mục này chỉ vào được qua thanh menu ngang.
- **Tinh gọn thanh menu.** Gỡ nhóm bốn nút Khóa học / Từ điển / Tin tức / Công cụ trong `Header.jsx` — chúng lặp y nguyên các mục của `FeatureMenuBar` ngay bên dưới, chiếm khoảng 330px và đẩy nút Quản Trị cùng nút tài khoản ra khỏi tầm nhìn. Các mục menu chuyển từ hai dòng sang **một dòng** (biểu tượng + nhãn + badge), phần mô tả dài chuyển sang thuộc tính `title` hiện khi di chuột. Nhãn rút ngắn: "Khóa Học Digital Thực Chiến" thành "Khoá Học", "Bộ Công Cụ Quản Lý" thành "Công Cụ", "Giấy Chứng Nhận" thành "Chứng Nhận" (sửa trong `translations.js` nên cả bản tiếng Anh cùng gọn theo). Tổng bề rộng từ hơn 1.400px xuống khoảng 1.036px, nằm gọn trong khung 1.280px.
- **Ô tên tài khoản trên Header nới từ 100px lên 150px** — tên "QUẢN TRỊ VIÊN ADMIN" trước đây bị cắt còn "QUẢN TRỊ VIÊN ...".
- **Phụ đề mục Từ Điển cập nhật từ "60+ Thuật ngữ" thành "121 thuật ngữ"** cho khớp số liệu thật.
- **Bản tin phân trang 5 tin mỗi lần**, kèm nút "Xem thêm 5 tin (còn N)" và dòng đếm kết quả. Đổi bộ lọc nền tảng thì quay lại trang đầu; bấm nạp tin mới thì nới thêm một ô hiển thị để tin vừa chèn không đẩy tin cuối trang ra khỏi tầm nhìn.
- **Khoá lưu bản tin đổi sang `dmm_news_feed_v2`** (`App.jsx`) — dữ liệu lưu theo khoá cũ thiếu tranh minh hoạ và thân bài, nếu không đổi khoá thì người dùng cũ sẽ mãi thấy bản tin rút gọn. Giao diện vẫn giữ đường lùi hiển thị `coverImage` cho dữ liệu cũ.
- **Mở rộng `ICON_MAP`** từ 20 lên 113 icon lucide-react để 121 thuật ngữ không dùng chung một biểu tượng mặc định. Hai icon trùng tên với biến toàn cục của JavaScript được nhập kèm bí danh: `Infinity as InfinityIcon`, `Image as ImageIcon`.
- **Mô tả đầu trang từ điển** đọc số lượng trực tiếp từ `GLOSSARY_ITEMS.length` thay vì ghi cứng "25+", nên không lệch khi thêm thuật ngữ sau này.

### Sửa lỗi

- **Số liệu hiển thị trộn sai đơn vị và đếm nhầm sự kiện.** Ba lỗi độc lập cùng làm các con số trên giao diện lệch khỏi thực tế:
  - `TRAFFIC_BASELINE` cộng thẳng vào số hiển thị mà không chỗ nào ghi rõ, nên "103 lượt" thực chất là 3 lượt thật. Nay ba mốc khởi điểm được gom về một khối có chú thích rõ ràng trong `src/firebase.js` (`TRAFFIC_BASELINE = 190`, `ENROLLED_BASELINE = 69`, `GRADUATE_BASELINE = 30`, chủ dự án ấn định 2026-07-28), đại diện cho phần hoạt động có trước khi hệ thống vận hành. Ràng buộc quan trọng: mốc **chỉ cộng ở tầng hiển thị**, tuyệt đối không ghi xuống Firestore — `reconcileGlobalStats()` ghi đè bằng số đếm thật, nên mốc lọt vào giá trị lưu trữ sẽ được cộng lại mỗi lần đối soát và số phình vô hạn. Bảng Quản Trị cố ý **không** cộng mốc cho học viên/tốt nghiệp vì phải khớp đúng số dòng trong bảng, và ghi rõ trang chủ đang hiện bao nhiêu để hai nơi lệch nhau không bị tưởng là lỗi.
  - `listenToRealTraffic` lấy `Math.max(số toàn cục của Cloud, số đếm riêng của máy này)` — hai đại lượng khác đơn vị. Một máy đã ghé 5 ngày sẽ hiện 5 kể cả khi toàn hệ thống mới có 3 lượt. Nay đọc được Cloud thì Cloud là đáp án duy nhất; số tại máy chỉ dùng khi mất kết nối. `App.jsx` cũng bỏ `Math.max` với giá trị cũ — kẹp theo giá trị lớn nhất từng thấy khiến con số không bao giờ giảm được nữa, kể cả sau khi đối soát cho đúng.
  - `recordRealStudentEnrollment()` được gọi trong effect **lúc tải trang**, nên bộ đếm "học viên ghi danh" thực chất đếm lượt khách lần đầu vào web. `totalEnrolled` từng lên 9 trong khi máy chủ gần như chưa có hồ sơ nào. Nay chỉ cộng khi hồ sơ **đã ghi thành công** lên Firestore.
- **Số học viên đạt chứng nhận nay là số đếm thật.** Bộ đếm cộng dồn luôn trôi: cộng cả lần thất bại, cộng lại khi học viên đổi máy hoặc xoá localStorage, và không bao giờ trừ khi quản trị viên xoá học viên. Thêm `fetchStudentsFromCloudOnly()` (đọc `students` thuần từ máy chủ, **không** trộn localStorage) và `reconcileGlobalStats()` ghi đè bằng con số đếm thật; Bảng Quản Trị chạy đối soát mỗi lần mở. Chỉ ghi khi đọc được máy chủ — `null` (không đọc được) khác `[]` (máy chủ rỗng), lẫn hai thứ này sẽ đặt số liệu toàn hệ thống về 0. Rules mở cho quản trị viên ghi giá trị tuỳ ý vào `analytics`, người thường vẫn chỉ được cộng tối đa 1. Bỏ dấu `+` sau các con số ở trang Tổng Quan — "0+ Đạt chứng nhận" vừa sai vừa khó hiểu.
- **Gỡ số liệu vận hành khỏi hồ sơ cá nhân học viên** (`UserProfileModal`) — dòng "Real-Time Web Traffic / Đạt chứng nhận" không thuộc về trang hồ sơ cá nhân và không nói lên điều gì về việc học của họ. Số liệu vẫn còn ở Bảng Quản Trị và trang Tổng Quan.
- **Đăng ký báo "thành công" kể cả khi hồ sơ không lên được máy chủ.** `recordStudentAccountToCloud()` nuốt lỗi Firestore, nên học viên đăng ký qua nhánh dự phòng vẫn thấy "🎉 Đăng ký thành công" trong khi hồ sơ chỉ nằm ở localStorage máy họ — quản trị viên không bao giờ thấy, và không ai biết là đã mất. Nay hàm trả kết quả, `AuthModal` chờ và báo đúng sự thật: *"Tài khoản đã tạo TẠM trên thiết bị này, nhưng CHƯA đăng ký lên hệ thống"*.
- **Thêm nút "Kiểm Tra Cloud" trong Bảng Quản Trị** (`diagnoseCloudAccess`) — chạy từng bước cấu hình → phiên đăng nhập → sổ phân quyền → đọc danh sách, **không nuốt lỗi**, in mã lỗi Firebase nguyên văn kèm chỉ dẫn hỏng ở đâu. Cần thiết vì thiết kế "mọi lệnh Cloud đều có nhánh dự phòng localStorage trong `try/catch` rỗng" khiến *bị từ chối quyền* và *chưa có dữ liệu* hiện ra giống hệt nhau.
- **Bịt máy dò email trong Firestore Rules.** Bản rules đầu tiên đặt `resource == null` ngoài điều kiện `signedIn()`, nên người lạ đọc thử `students/<email_đã_chuẩn_hoá>` sẽ nhận `404` nếu email chưa đăng ký và `403` nếu đã đăng ký — đủ để rà xem một người có học ở đây không mà không cần tài khoản nào. Nay bắt buộc đăng nhập trước.

- **Màn đăng nhập báo sai nguyên nhân, khiến lỗi cấu hình bị hiểu nhầm thành lỗi mật khẩu.** `AuthModal` hiện chung một câu "Email hoặc mật khẩu không chính xác" cho **mọi** kiểu thất bại — thiếu biến môi trường Firebase, chưa bật phương thức Email/Password, mất mạng, tài khoản bị khoá. Người dùng gõ lại mật khẩu bao nhiêu lần cũng không qua được vì mật khẩu chưa bao giờ là vấn đề. Nay mỗi mã lỗi Firebase có câu diễn giải riêng. Lưu ý khi so khớp mã lỗi: Firebase gắn thêm đuôi mô tả vào mã (`auth/api-key-not-valid.-please-pass-a-valid-api-key.`) nên phải so theo **tiền tố**, khớp chính xác sẽ trượt hết.
- **Thiếu cấu hình Firebase thì ứng dụng hỏng âm thầm.** Mọi giá trị dự phòng trong `src/firebase.js` là chuỗi giữ chỗ, không phải cấu hình thật. Nay `missingFirebaseEnv` / `isFirebaseConfigured` liệt kê đúng biến còn thiếu, ghi `console.error` khi nạp trang, và `AuthModal` hiện băng cảnh báo trước khi người dùng kịp gõ. Thêm [.env.example](.env.example) kèm hướng dẫn lấy từng giá trị ở đâu trong Firebase Console.
- **Học viên mới trên máy dùng chung thừa hưởng tiến độ của người trước.** Effect nạp lại `completedModules` khi đổi tài khoản chỉ gọi `setCompletedModules` **khi tìm thấy dữ liệu đã lưu**. Tài khoản vừa tạo chưa có bản ghi nào thì state giữ nguyên tiến độ người trước, rồi effect lưu ghi tiến độ đó sang khoá của họ **và** đẩy lên hồ sơ Firestore của họ. Một người chưa học buổi nào có thể "tốt nghiệp" ngay. Nay effect nạp luôn gán state, payload gửi lên đám mây dùng giá trị vừa nạp thay vì biến state còn cũ trong closure, và effect lưu bỏ qua đúng một lượt ngay sau khi đổi tài khoản để không phát sinh lượt ghi nhầm trung gian.
- **Điều kiện tốt nghiệp đếm theo độ dài mảng.** `completedModules.length === COURSE_MODULES.length` cho kết quả sai khi dữ liệu tiến độ cũ còn chứa id chuyên đề đã bị xoá. Đã đổi sang đối chiếu theo id.
- **Đáp án đúng chưa bao giờ nằm ở vị trí thứ ba hoặc thứ tư.** Trong 55 câu của khoá chính, 20 câu có đáp án ở vị trí một và 35 câu ở vị trí hai — học viên đoán trong hai lựa chọn đầu là vượt ngưỡng đạt 66%. `QuizComponent` nay xáo thứ tự lựa chọn ở tầng hiển thị, hạt giống lấy từ id câu hỏi nên thứ tự cố định giữa các lần mở. Phân bố mới: 12/18/15/10. Xáo ở tầng hiển thị thay vì sửa 55 câu trong tệp dữ liệu để dữ liệu gốc vẫn dễ soát, đồng thời mọi câu hỏi thêm sau này tự động được bảo vệ. Khoá lưu kết quả đổi sang `dmm_quiz_results_v2_*` vì bản cũ ghi đáp án theo thứ tự gốc, đọc bằng thứ tự mới sẽ tô sáng nhầm ô — bài đã làm sẽ hiện lại như chưa làm, nhưng tiến độ hoàn thành chuyên đề lưu ở chỗ khác nên không mất.
- **Tài khoản quản trị mất nút vào Bảng Quản Trị.** Listener `onAuthStateChanged` trong `App.jsx` dựng lại đối tượng `currentUser` từ một danh sách trường ghi cứng nhưng **bỏ sót `role`**, rồi ghi đè luôn bản trong `localStorage`. Hệ quả: mở trang thì nút Quản Trị hiện lên chớp nhoáng (bộ khởi tạo state đọc đúng role), tới khi Firebase trả lời thì role thành `undefined` và nút biến mất — đồng thời role trong máy bị xoá nên những lần tải sau cũng mất. Nay cả bộ khởi tạo lẫn listener dùng chung `resolveUserRole`, có tra thêm sổ `dmm_users_db` theo email nên máy nào đã bị xoá mất role vẫn khôi phục được quyền.
- **Mục cuối thanh menu bị cắt mất.** Bảy mục xếp hai dòng (tiêu đề + phụ đề) chiếm hơn 1.400px, tràn khỏi khung 1.280px, "Giấy Chứng Nhận" nằm ngoài tầm nhìn mà không có dấu hiệu nào cho biết còn nội dung bên phải.
- **Ảnh bìa không hiện được trên Zalo, WhatsApp, Viber, LINE vì URL để tương đối.** Các trình quét này không chạy JavaScript và không phân giải `/og-cover.png`, nên bỏ qua ảnh và chỉ hiện tiêu đề trống. Toàn bộ URL nay ghi tuyệt đối theo tên miền thật `https://academy.pmarcom.com`.
- **`canonical` và `og:url` trỏ về `https://pmarcom.edu.vn` — tên miền không tồn tại** (DNS trả về Non-existent domain). Đây là lỗi nặng nhất: một số trình quét phân giải ảnh tương đối dựa trên `og:url`, tức là chúng đi tìm ảnh ở một tên miền chết. Với Google, canonical trỏ sang tên miền không tồn tại còn làm hỏng việc lập chỉ mục. Đã đổi sang `https://academy.pmarcom.com/`.
- **Gỡ đoạn script ghi đè `canonical` và `og:url` bằng `window.location.href`.** Ghi chú của nó nói là để phục vụ trình quét WhatsApp và LinkedIn, nhưng các trình quét mạng xã hội không chạy JavaScript nên chưa bao giờ nhận được gì. Ngược lại Googlebot có dựng JavaScript, nên đoạn này biến mọi URL có tham số theo dõi thành canonical của chính nó, làm loãng tín hiệu xếp hạng.
- **`og-cover.png` thật ra là tệp JPEG mang đuôi `.png`** trong khi thẻ `og:image:type` khai báo `image/png`. Bản vẽ lại là PNG thật nên phần khai báo nay khớp với nội dung tệp.
- **Ảnh bìa vuông 1024x1024 nhưng khai báo 1200x630** — sai tỷ lệ khiến trình quét mạng xã hội cắt hoặc chèn viền. Bản mới đúng 1200x630, đồng thời nhẹ hơn: 64 KB thay vì 581 KB (dưới ngưỡng 600 KB của WhatsApp).
- **Đổi tên tệp thành `og-cover-v2.png` thay vì gắn `?v=` vào sau.** Zalo và một số trình quét cũ chuẩn hoá mất phần query rồi lấy lại bản cũ trong bộ nhớ đệm; đổi hẳn tên tệp thì chúng buộc phải tải lại.
- **Bổ sung thẻ ảnh kiểu cũ** `link[rel=image_src]` và microdata `itemprop=image` cho Viber cùng các phiên bản Zalo, LINE đời trước không đọc `og:image`; thêm khối JSON-LD `EducationalOrganization` cho Google.

---

## [Chưa phát hành] — 2026-07-27

### Quy trình

- **Chốt nguyên tắc làm việc Context tối thiểu** — đọc tài liệu trước, chỉ mở mã nguồn khi tài liệu không đủ, chỉ mở đúng module liên quan, chỉ xuất patch/diff, giải thích dưới 10 dòng, xong việc thì cập nhật `CHANGELOG.md` và `TASK.md`. Ghi tại [AI_MEMORY.md](AI_MEMORY.md#nguyên-tắc-context-tối-thiểu).
- **Lập bộ tài liệu AI Workspace** — 14 tệp Markdown ở thư mục gốc: `README`, `PROJECT`, `SUMMARY`, `AI_MEMORY`, `TASK`, `TODO`, `CHANGELOG`, `DECISION`, `CONTRIBUTING`, `ARCHITECTURE`, `PROMPTS`, `API_INDEX`, `DATABASE`, `DEPLOYMENT`. Không đụng mã nguồn.

### Thêm mới

- **Trợ lý Pipi** thay ô tìm kiếm "Tra cứu bài học / Thuật ngữ", kèm **nút nổi góc phải** có hiệu ứng (trôi nhẹ, vòng sóng lan, chớp mắt, bóng chào định kỳ). Tra thuật ngữ, tìm bài học và tính ROAS / CPA / CPL / CTR / CVR / CPM / ngân sách. Chạy hoàn toàn tại máy, không gọi API.

- **Tranh minh hoạ chuyên đề** — 11 tranh khái niệm SVG nội tuyến, mỗi chuyên đề một tranh, kèm chú thích (`LessonIllustration.jsx`).
- **Popup nhắc học** — nhắc quay lại khi học viên nghỉ quá 2 ngày; hiển thị số ngày nghỉ, tiến độ và chuyên đề kế tiếp chưa học (`StudyReminderModal.jsx`, `utils/studyReminder.js`).
- **Sơ đồ số liệu cho từng bài** — 36 sơ đồ, bộ kết xuất dữ liệu-hoá 5 kiểu `compare / bars / flow / funnel / stats` (`LessonVisual.jsx`, `data/lessonVisuals.js`).
- **16 bài học chuyên sâu** có dẫn chứng số liệu tính được, bổ sung vào cả 11 chuyên đề.
- **22 câu hỏi kiểm tra**, nâng từ 3 lên 5 câu mỗi chuyên đề.
- **Hoạ tiết trang trí Bằng Chứng Nhận** — vàng đồng và xanh ngọc bích: khung viền đôi, bốn góc mạch điện, dải phân cách có hạt kim cương.
- **Mã xác thực riêng theo học viên** — `PMC-<năm>-XXXX-XXXX`, sinh bằng hàm băm, tất định.
- **Tự động đẩy mã lên GitHub** sau mỗi phiên làm việc (`.claude/hooks/auto-push.sh`).
- **Chỉ số lượt truy cập hôm nay** trên bảng quản trị.

### Thay đổi

- **Đổi bộ màu toàn ứng dụng** sang Indigo Dye `#6495ED` + Rose Pink `#FFDAE9` + Egg Shell `#F0EAD6`, nền sáng làm mặc định. Thực hiện bằng cách **định nghĩa lại thang màu Tailwind** trong `@theme` (`src/index.css`) nên khoảng 1.330 lượt dùng lớp `emerald-*` / `amber-*` / `teal-*` đổi theo mà không phải sửa 26 tệp; kèm ánh xạ 90 mã hex nền tối sang navy. **Bằng Chứng Nhận được miễn trừ** — vẫn giữ tông trắng + vàng đồng vì in ra giấy.
- **Bỏ chữ "(MIỄN PHÍ)"** ở nhãn trị giá khoá học; ba ô "CHỈ CÒN 39 SUẤT" nay bấm được và dẫn thẳng tới đăng ký học viên (người đã đăng nhập thì vào thẳng Chuyên đề 01).
- **Trợ lý Pipi chỉ còn một lối vào** — nút nổi góc phải; đã bỏ nút trùng trong thanh menu.
- **Rà soát tương phản toàn bộ 11 màn** sau khi đổi màu (tổng quan, bài học, bài kiểm tra, từ điển, tin tức, công cụ, chứng nhận, quản trị, Pipi, và 2 màn ở chế độ tối) bằng phép đo tỉ lệ tương phản WCAG. Không còn chỗ nào dưới ngưỡng.
- **Bằng Chứng Nhận chuyển sang nền trắng**, bỏ con dấu logo ở chân bằng, tên người ký chỉ còn xuất hiện một lần dưới dạng chữ ký vàng.
- **Bản xem trước chứng nhận** đổi sang bảng màu cố định khớp template xuất file, không còn phụ thuộc giao diện sáng/tối.
- **Công thức đếm lượt truy cập** — từ "mỗi lần tải trang" sang "một khách một ngày", mốc khởi điểm từ 500 xuống 100, ngày chốt theo giờ Việt Nam. Dùng document mới `traffic_daily_v3`, số liệu cũ không mang sang.
- **Nút In Bằng** in từ ảnh đã dựng thay vì gọi `window.print()` trên toàn trang.
- **Tên tệp tải về** bỏ dấu tiếng Việt.
- `README.md` thay bản mẫu Vite mặc định bằng tài liệu thật của dự án.

### Sửa lỗi

- **Gradient nền tối không đổi theo giao diện sáng.** Quy tắc nền sáng chỉ bắt `from-emerald-950/900`, bỏ sót 13 chỗ dùng `via-` và `to-` với điểm dừng tối (`via-emerald-950`, `to-teal-950`, `to-slate-950`…). Các thẻ đó giữ nguyên nền tối trên giao diện sáng khiến chữ chìm — rõ nhất ở thẻ hồ sơ học viên trên thanh menu. Gradient nằm ở `background-image` nên `background-color` không đè được, phải tắt riêng.

- **Xoá học viên trong bảng quản trị không có tác dụng, F5 là dữ liệu quay lại.** Ba nguyên nhân cộng lại: (a) `SAMPLE_STUDENTS` luôn được trộn lại ở cả `loadStudentsList` lẫn listener realtime nên học viên mẫu không thể xoá; (b) lệnh xoá chỉ chạm Firestore `students` theo đúng một `studentId`, bỏ sót `registrations` và bỏ sót tài liệu mang id suy từ email; (c) sau khi xoá, mã ghi **danh sách hiển thị đã trộn dữ liệu mẫu** ngược vào `dmm_users_db`, khiến học viên mẫu bám vĩnh viễn. Nay thêm cơ chế bia mộ `dmm_deleted_students` làm chốt chặn cuối, cùng `deleteStudentEverywhere()` quét đủ 4 kho.
- **Tải Bằng Chứng Nhận hỏng hoàn toàn.** html2canvas 1.4.1 ném lỗi `Attempting to parse an unsupported color function "oklab"` khi gặp `oklch()` / `color-mix()` do Tailwind v4 sinh ra. Cả PNG, PDF lẫn nút dành cho iPad đều chết cùng một chỗ. Đã tách template xuất file dùng màu hex nội tuyến.
- **PDF bị cắt mất phần dưới.** Công thức chiều cao không kẹp vào khổ A4: khung 814×674 cho ra chiều cao 245,92 mm trên trang 210 mm, mất 14,6% phía dưới gồm chữ ký và mã xác thực.
- **`recordRealTrafficVisit()` treo vĩnh viễn** do `await setDoc(...)` không bao giờ resolve khi offline, khiến bộ đếm đứng im.
- **`lessonsCount` sai ở 10/11 chuyên đề** — giao diện ghi 3 bài nhưng chỉ có 1–2; chuyên đề 05 và 09 ghi 4 bài mà chỉ có 1.
- **Sơ đồ minh hoạ lặp ở mọi bài** — `VisualDiagram` nhận `sectionId` nhưng không dùng, chỉ lọc theo `moduleId`.
- **`recordStudentAccountToCloud` được gọi ở 3 chỗ trong `App.jsx` nhưng chưa import** — mỗi lần lưu/tải tiến độ đều ném `ReferenceError`, hồ sơ học viên không đồng bộ lên Firestore.
- **Watermark logo hiện thành khối chữ nhật sáng viền cứng** trên Bằng Chứng Nhận.
- **Góc trang trí cắt ngang chữ** ở chân Bằng Chứng Nhận.
- **Mũi tên trong tranh chuyên đề 01 chỉ ra ngoài** thay vì cắm vào tâm bia.
- **Số liệu ảo cứng trong mã** — `501` ở ba chỗ hiển thị và `158421` làm giá trị mặc định.

### Gỡ bỏ

- **Tài khoản dùng thử** `hocvien@pmarcom.edu.vn`. Gỡ khỏi dữ liệu mồi, chặn ở cả đăng nhập lẫn đăng ký, dọn khỏi localStorage của máy đã chạy bản cũ, xoá dòng gợi ý trong thông báo lỗi và các chuỗi dịch liên quan.
- Hàm `fillQuickDemo` và `fillAdminDemo` (mã chết, không nút nào gọi).
- Con dấu tròn "CERTIFIED" ở chân Bằng Chứng Nhận.

### Bảo mật

- **Chặn học viên vào Bảng Quản Trị.** Trước đây không có kiểm tra quyền ở bất kỳ tầng nào: nút hiện với mọi người kể cả khách chưa đăng nhập, và ai bấm cũng xem/xuất được danh sách học viên kèm tên, email, số điện thoại. Kèm theo đó, bộ làm sạch `currentUser` trong App.jsx nuốt mất trường `role` nên không tầng nào phân biệt được admin. Nay giữ lại `role` và chặn ở 3 tầng: ẩn nút, guard hàm mở, và modal tự từ chối hiển thị. **Lưu ý:** `role` đọc từ localStorage nên đây là rào chắn giao diện, không thay thế được Firestore Security Rules.

- **Bỏ lưu mật khẩu dạng chữ thường trong localStorage.** Nhánh đăng nhập dự phòng (`dmm_users_db`) trước đây ghi thẳng mật khẩu học viên xuống đĩa. Nay dùng SHA-256 kèm muối ngẫu nhiên riêng từng bản ghi (`utils/localCredentials.js`). Bản ghi cũ vẫn đăng nhập được và **tự nâng cấp sang muối + băm ngay lần đăng nhập kế tiếp**, trường `password` bị xoá khỏi bản ghi. Trên trang chạy http thuần (không có Web Crypto), tài khoản mới sẽ không lưu phần mật khẩu — mất khả năng đăng nhập offline nhưng không để lộ mật khẩu.
- Thêm `.env` và `.env.*` vào `.gitignore`. Bắt buộc phải có trước khi bật hook tự động đẩy mã, vì script dùng `git add -A` nên tệp `.env` chứa khoá thật sẽ bị đẩy thẳng lên kho công khai.

---

## Trước 2026-07-27

TODO — lịch sử trước mốc này chưa được tổng hợp. Kho mã có 78 commit, phần lớn mang thông điệp tự động dạng `chore: tự động lưu ...` nên không đủ chi tiết để dựng lại changelog. Commit thủ công gần nhất có nội dung rõ ràng: `b018e0c feat: Instantly update profile and close modal to return to home page upon clicking Save Changes`.
