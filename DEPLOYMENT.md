# DEPLOYMENT — Đóng gói và triển khai

## Trạng thái hiện tại

**Địa chỉ chạy thật: <https://academy.pmarcom.com/>** — chủ dự án xác nhận ngày 2026-07-28.

Hạ tầng là **Vercel**: bản ghi DNS của `academy.pmarcom.com` trỏ tới `vercel-dns-017.com`. Việc triển khai chạy tự động theo commit, không qua bước thủ công nào.

Kho mã có `vercel.json` với **hai mục đích**: chuyển tiếp đường `/__/auth/*` sang Firebase (xem mục "Tên miền đăng nhập" bên dưới), và trả `index.html` cho mọi đường dẫn còn lại để địa chỉ tĩnh của từng chuyên đề / tin / công cụ hoạt động (xem "Địa chỉ tĩnh" bên dưới). Mọi thiết lập khác — biến môi trường, tên miền, nhánh deploy — vẫn chỉ tồn tại trên bảng điều khiển Vercel, không được ghi lại trong kho mã.

**THỨ TỰ CÁC LUẬT TRONG `rewrites` LÀ THỨ TỰ XÉT** — Vercel dùng luật khớp đầu tiên. Luật bắt-tất-cả `/(.*)` phải nằm CUỐI mảng; đẩy nó lên trên là nuốt luôn `/__/auth/*` và đăng nhập Google chết ngay. Tệp tĩnh (`/assets/*`, `/pmarcom-logo.jpg`) không bị ảnh hưởng vì Vercel kiểm tra tệp có thật trước khi xét `rewrites`.

TODO — cân nhắc đưa nốt các thiết lập còn lại vào `vercel.json` để chúng bám theo kho mã.

### `firebase-admin` phải ở nhánh 13 — ĐỪNG nâng lên 14

`package.json` ghim `"firebase-admin": "^13.10.0"`. Đây là ràng buộc bắt buộc, không phải ngại nâng cấp.

Nhánh 14 kéo theo `jwks-rsa@4`, gói này lại kéo `jose@6`. Mà `jose@6` là gói **chỉ chạy dạng ESM** (không có bản CommonJS), trong khi `jwks-rsa@4` vẫn nạp nó bằng `require()`. Hai thứ đó không chạy cùng nhau trong hàm máy chủ của Vercel:

```
ERR_REQUIRE_ESM require() of ES Module .../jose/dist/webapi/index.js
from .../jwks-rsa/src/utils.js not supported
```

Nhánh 13 dùng `jwks-rsa@3 → jose@4`, và `jose@4` có bản CommonJS nên không vấn đề gì.

**Vì sao cái bẫy này khó thấy:** lỗi chỉ nổ khi gọi `initializeApp()` lúc chạy thật trên máy chủ. Chạy `npm run build` vẫn xanh, `npm install` không cảnh báo gì, thử nạp module ở máy cũng bình thường — vì ở máy không ai gọi `initializeApp()`. Triệu chứng duy nhất nhìn thấy được là `500 FUNCTION_INVOCATION_FAILED` **ở mọi lệnh gọi**, kể cả lệnh GET lẽ ra phải trả `405`. Nhìn vào rất giống sai khoá hoặc thiếu biến môi trường, và đó là hướng chẩn đoán sai đã tốn một vòng deploy ngày 2026-07-30.

Nếu buộc phải nâng nhánh 14 sau này, kiểm tra lại `npm ls jose` — phải ra bản có `"type": "commonjs"`.

### Phiên bản Node

`package.json` khai `"engines": { "node": "22.x" }`. Nhánh `firebase-admin@13` chỉ đòi Node >= 18, nên đây không còn là ràng buộc bắt buộc — nhưng cứ giữ: production đã chạy Node 22 ổn định (xác nhận qua `/api/ping`), và ghim trong kho mã thì thiết lập đi theo dự án thay vì nằm rời trên bảng điều khiển Vercel.

### Khi hàm máy chủ trả về 500 mà không rõ lý do

Vercel chỉ trả về `500 FUNCTION_INVOCATION_FAILED`, không kèm nguyên nhân. Nếu lỗi xảy ra lúc **nạp module** thì mọi lệnh gọi đều 500 — kể cả lệnh GET lẽ ra phải trả `405` — và nhìn từ ngoài không phân biệt được với sai khoá hay thiếu biến môi trường.

Cách gỡ đã dùng ngày 2026-07-30, lấy lại từ lịch sử git khi cần:

```bash
git show 60d56b1:api/ping.js > api/ping.js   # không import gì -> hạ tầng hàm có chạy không
git show 60d56b1:api/diag.js > api/diag.js   # nạp firebase-admin trong try/catch -> đọc lỗi nguyên văn
```

`/api/diag` chính là thứ chỉ ra được `ERR_REQUIRE_ESM` mô tả ở trên; không có nó thì chỉ thấy một con số 500 trống rỗng.

**Xoá lại ngay sau khi sửa xong** (đã xoá cùng ngày). Chúng là đường dẫn công khai không đòi xác thực, và `/api/diag` còn khởi tạo Firebase Admin rồi gọi máy chủ ở mỗi lần được gọi — để lâu là mở sẵn một chỗ cho người ngoài bơm tải. Cả hai chỉ báo có/không và độ dài biến môi trường, **không bao giờ in giá trị**; giữ nguyên tính chất đó nếu phải dựng lại.

### Biến môi trường của hàm máy chủ

Khai trên Vercel, **không có tiền tố `VITE_`** — Vite nhúng mọi biến có tiền tố đó vào JavaScript gửi xuống trình duyệt, đặt sai tên là công khai khoá cho cả thế giới.

| Biến | Bắt buộc | Ghi chú |
|---|---|---|
| `RESEND_API_KEY` | có | Khoá gửi thư của Resend |
| `FIREBASE_SERVICE_ACCOUNT` | có | JSON khoá dịch vụ, dạng thô hoặc base64 |
| `EMAIL_FROM` | có | `Học Viện P MARCOM <admin@mail.pmarcom.com>` |
| `SITE_URL` | không | Mặc định `https://academy.pmarcom.com` |

Tên miền gửi thư là `mail.pmarcom.com`, **không phải** `academy.pmarcom.com`: `academy` là một bản ghi CNAME trỏ sang Vercel, mà tên đã có CNAME thì theo chuẩn DNS không được có thêm bản ghi TXT — trong khi SPF bắt buộc phải là TXT đặt đúng tại tên đó.

### Tên miền đăng nhập (custom auth domain)

`VITE_FIREBASE_AUTH_DOMAIN` trên production là **`academy.pmarcom.com`**, không phải `hr-project-b982a.firebaseapp.com` như giá trị Firebase cấp sẵn. Hai lý do, cả hai đều thật:

1. **Học viên nhìn thấy tên miền này.** Màn hình đăng nhập của Google hiện dòng "Tiếp tục tới …" kèm đúng giá trị `authDomain`. Để nguyên chuỗi `hr-project-b982a.firebaseapp.com` thì người dùng đang ở `academy.pmarcom.com` bỗng bị hỏi có muốn trao quyền cho một tên miền lạ hoắc không — đúng dấu hiệu của một trang lừa đảo.
2. **Luồng đăng nhập bằng chuyển trang cần nó.** Khi `authDomain` khác tên miền đang chạy app, quá trình đăng nhập phải mượn bộ nhớ của bên thứ ba — thứ Safari và Chrome ẩn danh chặn thẳng, khiến học viên chuyển sang trang Google rồi quay về tay trắng. Cho `academy.pmarcom.com` tự phục vụ đường auth thì không còn bên thứ ba nào.

Cơ chế: `vercel.json` chuyển tiếp `/__/auth/*` về `hr-project-b982a.firebaseapp.com`. Firebase phục vụ sẵn các đường đó, ta chỉ mượn lại dưới tên miền của mình.

**Ba thứ phải khớp nhau, thiếu một là hỏng toàn bộ đăng nhập Google:**

| Nơi khai báo | Giá trị |
|---|---|
| `vercel.json` → `rewrites[0].destination` | `https://hr-project-b982a.firebaseapp.com/__/auth/:path*` |
| Vercel → Environment Variables → `VITE_FIREBASE_AUTH_DOMAIN` | `academy.pmarcom.com` |
| Google Cloud → Google Auth Platform → Clients → Authorized redirect URIs | `https://academy.pmarcom.com/__/auth/handler` |

Sót dòng thứ ba thì Google từ chối bằng `redirect_uri_mismatch` — hỏng ngay và hỏng với mọi học viên.

**Tệp `.env` ở máy lập trình giữ nguyên `hr-project-b982a.firebaseapp.com`.** Cố ý khác production: `localhost` không có proxy nào chuyển tiếp `/__/auth/*`, khai tên miền thật vào đó là hỏng đăng nhập khi chạy `npm run dev`.

**Cách quay lui** khi có sự cố: đổi `VITE_FIREBASE_AUTH_DOMAIN` trên Vercel về `hr-project-b982a.firebaseapp.com` rồi deploy lại. Không mất dữ liệu, không ai phải đăng nhập lại. `vercel.json` để nguyên cũng không sao — nó chỉ thành đường chuyển tiếp không ai đi qua.

### Tên miền phải sửa tay khi thay đổi

`index.html` ghi cứng `https://academy.pmarcom.com` ở các thẻ chia sẻ mạng xã hội (canonical, `og:url`, ba thẻ `og:image`, `twitter:image`, `linkedin:image`, `link[rel=image_src]`, `itemprop=image` và khối JSON-LD). Bắt buộc phải tuyệt đối vì trình quét của Zalo, WhatsApp, Viber và LINE không chạy JavaScript nên không phân giải được đường dẫn tương đối. Đổi tên miền thì phải sửa hết các chỗ đó cùng lúc.

## Đóng gói

```bash
npm install
npm run build     # xuất ra thư mục dist/
npm run preview   # xem thử bản đã đóng gói
```

Kết quả là trang tĩnh trong `dist/`, phục vụ được bằng bất kỳ static host nào — **với điều kiện host đó trả `index.html` cho đường dẫn không khớp tệp nào** (xem mục kế tiếp). Đừng xoá rewrite nào trong `vercel.json` khi dọn cấu hình: một luật lo đăng nhập, một luật lo điều hướng.

`dist/` đã nằm trong `.gitignore`.

## Địa chỉ tĩnh của từng chuyên đề, tin, thuật ngữ, công cụ

Mỗi màn hình có một địa chỉ dán gửi được, bảng dịch nằm trong `src/utils/appRoutes.js`:

| Địa chỉ | Mở ra |
|---|---|
| `/khoa-hoc`, `/khoa-hoc/module-01` | Khoá Digital Marketing (khoá chính) |
| `/khoa-hoc/module-01/m1-s2` | Một bài học cụ thể — mở ra là cuộn thẳng tới bài đó |
| `/trade-marketing`, `/trade-marketing/trade-01` | Khoá Trade Marketing |
| `/thuat-ngu`, `/thuat-ngu/roas` | Từ điển thuật ngữ |
| `/ban-tin`, `/ban-tin/<id tin>` | Bản tin thuật toán |
| `/cong-cu`, `/cong-cu/roas` | Bộ công cụ Trưởng phòng |
| `/` | Trang chủ — mở đúng tổng quan khoá chính |
| `/chuyen-de/...` | Tên cũ của khoá chính, vẫn mở được |
| `/doi-mat-khau` | Trang đặt lại mật khẩu (xử lý ở `main.jsx`) |

**Địa chỉ bài học chạy hai chiều.** Cả một chuyên đề nằm trên một trang cuộn, nên bài học là một vị trí trong trang chứ không phải màn hình riêng: mở liên kết thì trang cuộn thẳng tới bài đó, và ngược lại cuộn tới bài nào thì thanh địa chỉ đổi theo bài đó. Chiều thứ hai là thứ khiến 36 địa chỉ này dùng được mà không phải thêm nút nào — không có nó thì địa chỉ tồn tại nhưng chỉ lấy được bằng cách tự gõ tay định danh `m4-s2`. Việc cuộn dùng `replaceState` nên không đẩy thêm mục vào lịch sử: cuộn hết một chuyên đề bốn bài vẫn chỉ cần bấm Lùi một lần để ra.

Khoá Trade dùng chung component hiển thị nhưng không bật phần này, nên địa chỉ khoá Trade dừng ở tầng chuyên đề.

Một màn hình có thể có nhiều lối vào hợp lệ, nhưng **địa chỉ ứng dụng tự sinh ra luôn là dạng chuẩn ở cột trái**. Riêng `/` được giữ nguyên khi người dùng đang đứng sẵn ở đó: trang chủ phải giữ được địa chỉ trang chủ, và index.html khai `canonical` tuyệt đối trỏ về `/` nên cỗ máy tìm kiếm vẫn gom `/` với `/khoa-hoc` về một mối.

Ứng dụng chỉ có **một** tệp `index.html`, không sinh trang tĩnh riêng cho từng địa chỉ. Máy chủ phải trả `index.html` cho mọi đường dẫn, rồi JavaScript mới đọc đường dẫn đó ra màn hình tương ứng. Thiếu luật bắt-tất-cả thì gõ thẳng `/chuyen-de/module-01` hoặc bấm F5 giữa bài học là nhận 404 trước khi JavaScript kịp chạy.

Định danh trên địa chỉ dùng thẳng `id` trong dữ liệu, cùng những id đang lưu trong Firestore và localStorage tiến độ học. **Đổi id là vừa làm chết liên kết đã gửi đi, vừa làm mất tiến độ học viên** — hai hậu quả này đi cùng nhau, không tách rời được.

Đây **chưa phải SEO**: nội dung vẫn dựng bằng JavaScript nên trình quét của Facebook/Zalo chỉ đọc được các thẻ `og:` tĩnh dùng chung trong `index.html`. Chia sẻ một chuyên đề hay một tin đều hiện cùng một ảnh và cùng một mô tả. Muốn khác đi thì phải prerender lúc build — việc riêng, chưa làm.

### Cảnh báo kích thước gói

Bản build hiện phát cảnh báo: gói JavaScript chính vượt 500 kB sau khi rút gọn (phần lớn đến từ Firebase SDK, html2canvas và jsPDF). Ứng dụng vẫn chạy được. Hướng xử lý: xem [TODO.md](TODO.md#hiệu-năng).

## Biến môi trường

**Project Firebase chính thức: `hr-project-b982a`** (chủ dự án xác nhận 2026-07-28).

### Sự cố đã xảy ra — đọc trước khi khai báo lại

Trong một thời gian dài, Vercel trỏ tới project cũ `pmarcomacademy` với **hai giá trị bị rụng ký tự đầu**:

| Trường | Giá trị sai trên Vercel | Đúng ra |
|---|---|---|
| `apiKey` | `IzaSyDlHrCSBN…` (38 ký tự) | `AIzaSyDlHrCSBN…` — mọi khoá Firebase bắt đầu bằng `AIza`, dài 39 ký tự |
| `appId` | `770143242528:web:…` | `1:770143242528:web:…` |

Dấu vết của việc bôi đen thiếu khi copy từ Console. Khoá sai một ký tự thì Firebase từ chối **toàn bộ**, mã lỗi `auth/api-key-not-valid`.

Điều khiến sự cố này sống sót lâu đến vậy: **mọi lệnh gọi Firebase đều có nhánh dự phòng localStorage và đều bọc trong `try/catch` rỗng**, nên ứng dụng hỏng mà vẫn trông như chạy bình thường. Học viên vẫn đăng ký được, admin vẫn mở được Bảng Quản Trị, danh sách vẫn cập nhật tức thì — nhưng tất cả chỉ nằm trong localStorage của **riêng trình duyệt đó**. Mỗi máy một cơ sở dữ liệu riêng, không máy nào thấy dữ liệu của máy nào.

Vì vậy sau khi khai báo biến, **bắt buộc phải kiểm tra thật**: đăng ký một tài khoản trên máy A rồi mở Bảng Quản Trị trên máy B xem có thấy không. Thấy dữ liệu trên cùng một máy **không chứng minh được điều gì**.

Cách kiểm tra nhanh định dạng trước khi dán:

- `apiKey` phải dài đúng **39** ký tự và bắt đầu bằng `AIza`
- `appId` phải bắt đầu bằng `1:` và chứa đúng `messagingSenderId` ở giữa

`src/firebase.js` đọc 7 biến. Vite chỉ nạp biến có tiền tố `VITE_`.

| Biến | Bắt buộc |
|---|---|
| `VITE_FIREBASE_API_KEY` | có |
| `VITE_FIREBASE_AUTH_DOMAIN` | có |
| `VITE_FIREBASE_PROJECT_ID` | có |
| `VITE_FIREBASE_STORAGE_BUCKET` | có |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | có |
| `VITE_FIREBASE_APP_ID` | có |
| `VITE_FIREBASE_MEASUREMENT_ID` | có |

### Cảnh báo về giá trị dự phòng

Mỗi biến đều có giá trị dự phòng viết sẵn trong `src/firebase.js`. Các giá trị này là **chuỗi giữ chỗ, không phải cấu hình thật**, ví dụ khoá API dự phòng là `"AIzaSyD-PMarcomAcademyKeyDemo2026"`.

Hệ quả: nếu triển khai mà **quên** đặt biến môi trường, ứng dụng vẫn khởi động bình thường nhưng mọi thao tác Firebase thất bại. Triệu chứng dễ nhận nhất là **đăng nhập báo `auth/api-key-not-valid`** — trước đây màn đăng nhập lại hiển thị "Email hoặc mật khẩu không chính xác", khiến người dùng đi tìm sai chỗ hoàn toàn.

Nay có hai lớp báo động:

- `src/firebase.js` ghi `console.error` liệt kê đúng những biến còn thiếu, ngay khi nạp trang.
- `AuthModal` hiện băng cảnh báo vàng **trước khi** người dùng kịp gõ mật khẩu, và thông báo lỗi đăng nhập nói đúng nguyên nhân thay vì đổ cho mật khẩu.

Sau khi triển khai vẫn phải kiểm tra thực tế rằng đăng nhập chạy được và dữ liệu có lên Firestore.

### Tệp `.env`

Chép [.env.example](.env.example) thành `.env` rồi điền giá trị thật:

```bash
cp .env.example .env
```

Giá trị lấy ở **Firebase Console → ⚙️ Project settings → General → Your apps → SDK setup and configuration → Config**. Tên trường trong đoạn `firebaseConfig` hiện ra ánh xạ 1-1 với các biến `VITE_FIREBASE_*`, đã ghi đối chiếu trong `.env.example`.

Vite nạp biến **lúc đóng gói**, nên sửa `.env` xong phải khởi động lại `npm run dev`. Trên Vercel thì khai báo ở Project Settings → Environment Variables rồi deploy lại.

`.gitignore` chặn `.env` và `.env.*` nhưng chừa `.env.example`.

## Firebase

Cần bật trên Firebase Console:

1. **Authentication** — phương thức Email/Password.
2. **Cloud Firestore** — các collection và document mô tả tại [DATABASE.md](DATABASE.md).
3. **Security Rules** — tệp `firestore.rules` trong kho mã. **Phải deploy thì mới có tác dụng**, xem ngay bên dưới.

### Security Rules — bắt buộc deploy

`firestore.rules` là **lớp bảo vệ duy nhất** của dự án. Ứng dụng chạy hoàn toàn trong trình duyệt nên không có chỗ nào khác đặt được ranh giới quyền: chưa deploy tệp này thì cơ sở dữ liệu vẫn chạy theo cấu hình cũ trên Console, và bất kỳ ai mở trang web cũng đọc được toàn bộ hồ sơ học viên bằng vài dòng lệnh trong devtools.

**Cách 1 — dán vào Console (nhanh nhất).**

1. Mở `firestore.rules` trong kho mã, chọn hết (`Ctrl+A`) rồi copy.
2. Firebase Console → **Firestore Database** → tab **Rules**.
3. Chọn hết nội dung đang có trong ô soạn thảo rồi **dán đè** — phải thay toàn bộ, không phải chèn thêm vào cuối.
4. Bấm **Publish**.

⚠️ Ô soạn thảo đó chỉ nhận **nội dung rules**. Dán lệnh terminal (`npx ...`) vào sẽ báo `Unexpected 'npx'`.

**Cách 2 — dòng lệnh.** Chạy trong terminal, ở thư mục gốc dự án:

```bash
npx firebase-tools login                      # mở trình duyệt để đăng nhập Google
npx firebase-tools deploy --only firestore:rules
```

`firebase.json` đã trỏ sẵn tới `firestore.rules`, và `.firebaserc` đã ghi sẵn project `hr-project-b982a` nên **không cần** bước `use <project-id>` nữa. Không cài `firebase-tools` vào `package.json` vì đây là việc thỉnh thoảng mới chạy.

⚠️ Bước `login` **bắt buộc phải chạy trong terminal mở được trình duyệt**. Phiên trợ lý AI không tự chạy được bước này — không có trình duyệt để hoàn tất OAuth — nên việc Publish rules luôn phải do người thật bấm.

#### Lần deploy sắp tới — hai thay đổi phải kiểm chứng ngay sau khi Publish

**Cập nhật 2026-07-29: đã Publish.** Hai phần đầu đã kiểm chứng qua hành vi thật của ứng dụng; phần thứ ba vẫn **chưa ai thử**, xem mục 3.

1. **`support_messages`** — collection mới của Hộp Thư Hỗ Trợ. Kiểm chứng: đăng nhập bằng một tài khoản học viên, mở khung chat Pipi, bấm **Nhắn Ban Quản Trị**, gửi thử một dòng. Lời nhắn phải hiện trong Hộp Thư (chuông trên thanh đầu trang, chỉ quản trị viên thấy) kèm huy hiệu đỏ.

2. **`support_messages/{msgId}/replies`** — trao đổi hai chiều. Kiểm chứng tiếp ngay sau bước 1: ở tài khoản quản trị bấm **Trả lời trong app**, gửi một dòng; rồi quay lại tài khoản học viên — nút Pipi phải hiện **chấm đỏ**, mở ra thấy đúng lời vừa gửi, và nhắn tiếp được. Khối này còn cần luật `list` mới trên `support_messages` (học viên liệt kê cuộc trao đổi của chính mình) — thiếu nó thì hộp thư phía học viên luôn báo "Chưa đọc được hộp thư" dù lời nhắn gửi đi bình thường.

3. **Ràng buộc id tài liệu khi tạo hồ sơ** (`canCreateProfile`). Phần này dùng `myEmail().replace('[^a-z0-9]', '_')` để dựng lại đúng id mà `recordStudentAccountToCloud()` sinh ra ở phía JavaScript. **Lệch một ký tự là học viên mới không đăng ký được.** Kiểm chứng bắt buộc: đăng ký một tài khoản thử với email có dấu chấm trong phần tên (ví dụ `kiem.tra.01@gmail.com`) và xác nhận:
   - Form báo **"🎉 Đăng ký tài khoản học viên P MARCOM thành công"**, KHÔNG phải câu "hồ sơ CHƯA lưu lên hệ thống".
   - Tài khoản đó xuất hiện trong Bảng Quản Trị.

   Nếu hỏng, hoàn nguyên vế `&& (docId == myDocId() || docId == request.auth.uid)` trong `canCreateProfile()` rồi Publish lại — phần còn lại của rules không phụ thuộc vào nó.

### Mồi tài khoản quản trị đầu tiên

Rules dùng collection `admins` làm sổ phân quyền: id tài liệu là email chữ thường, có bản ghi nghĩa là có quyền. Sổ rỗng thì **không ai** cấp quyền được cho ai — vì chỉ quản trị viên mới ghi được vào sổ quyền. Phải có bản ghi đầu tiên thì vòng lặp đó mới mở ra.

**Việc này tự động.** Rules mở đúng một ngoại lệ: tài khoản gốc tự tạo bản ghi của chính nó. `App.jsx` (`resolveAdminRole`) gọi bước mồi ngay lần đầu tài khoản gốc đăng nhập mà chưa có trong sổ. Bạn chỉ cần **đăng nhập lại bằng `admin@pmarcom.edu.vn` sau khi publish rules**.

Nếu muốn kiểm tra hoặc tạo tay: Firestore Database → Start collection → Collection ID `admins` → Document ID là email chữ thường (`admin@pmarcom.edu.vn`) → thêm trường `email` (string) là chính email đó.

### Việc phải kiểm tra ngay: tài khoản gốc trên Firebase Auth

Quyền quản trị nay **chỉ cấp cho phiên đăng nhập Firebase Auth thật**. Kéo theo hai việc bắt buộc:

- **`admin@pmarcom.edu.vn` phải tồn tại trong Authentication → Users, với mật khẩu mạnh.** Nếu tài khoản này chưa được tạo, bất kỳ ai cũng có thể đăng ký chiếm email đó và trở thành Quản Trị Tối Cao. Ứng dụng đã chặn đăng ký email này ở form (`AuthModal.jsx`), nhưng chặn ở trình duyệt thì vòng qua được — tạo sẵn tài khoản mới là biện pháp thật.
- **Mật khẩu `admin` viết trong `AuthModal.jsx` không còn cấp quyền gì**, nhưng vẫn nên đổi. Xem [TODO.md](TODO.md#bảo-mật).

## Tài nguyên tĩnh

`public/` được sao chép nguyên trạng vào `dist/`:

- `pmarcom-logo.jpg` — logo, dùng cho favicon và Bằng Chứng Nhận
- `og-cover.png` — ảnh xem trước khi chia sẻ mạng xã hội (1200×630)
- `favicon.svg`, `icons.svg`

`index.html` có sẵn thẻ Open Graph và Twitter Card, kèm một đoạn script tự chuyển đường dẫn ảnh xem trước sang dạng tuyệt đối theo tên miền đang chạy.

TODO — thẻ `<link rel="canonical">` đang trỏ cứng `https://pmarcom.edu.vn`; cần xác nhận đây có phải tên miền chính thức không.

## Tự động đẩy mã lên GitHub

Kho mã có hook Claude Code tại `.claude/settings.json`, chạy `.claude/hooks/auto-push.sh` ở hai sự kiện `Stop` và `SessionEnd`: tự động commit toàn bộ thay đổi và đẩy lên `origin/master`.

Đây là **công cụ hỗ trợ phát triển, không phải quy trình triển khai**. Chi tiết cách hoạt động và cơ chế an toàn: [DECISION.md](DECISION.md#adr-004).
