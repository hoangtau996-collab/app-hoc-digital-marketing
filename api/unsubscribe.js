/**
 * Huỷ nhận thư thông báo — mở từ đường dẫn cuối mỗi lá thư.
 *
 * KHÔNG ĐÒI ĐĂNG NHẬP, cố ý. Người bấm vào đây đang ở trong hộp thư, thường
 * trên điện thoại, và mục đích của họ là bớt phiền. Bắt họ đăng nhập trước là
 * dựng thêm rào ngay lúc họ đang khó chịu — và kết quả không phải là họ đăng
 * nhập, mà là họ bấm "Báo spam". Một khi Gmail đánh dấu tên miền là spam thì
 * thư đặt lại mật khẩu của học viên thật cũng rơi vào hộp thư rác.
 *
 * Thay cho đăng nhập là CHỮ KÝ trong đường dẫn: mỗi email có một mã HMAC riêng.
 * Không có nó thì ai cũng sửa email trên thanh địa chỉ để huỷ nhận thư thay
 * người khác.
 *
 * CHỈ TẮT THƯ THÔNG BÁO. Thư đặt lại mật khẩu không đọc cờ này — người đã huỷ
 * nhận tin tức vẫn có quyền lấy lại tài khoản của mình.
 */
import { adminDb } from './_lib/admin.js';
import { verifyUnsubscribeToken } from './_lib/mailer.js';

const cleanEmail = (v) => String(v || '').trim().toLowerCase();
const toDocId = (email) => cleanEmail(email).replace(/[^a-z0-9]/g, '_');

/** Trang trả lời, viết thẳng HTML vì đây là trang tĩnh nằm ngoài ứng dụng React. */
function page(title, body, tone = 'ok') {
  const color = tone === 'ok' ? '#047857' : '#b91c1c';
  return `<!doctype html>
<html lang="vi"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title} — Học Viện P MARCOM</title>
</head>
<body style="margin:0;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;background:#f1f5f9;">
  <div style="max-width:520px;margin:48px auto;padding:32px 28px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;">
    <div style="font-size:13px;font-weight:800;color:#064e3b;letter-spacing:.5px;">HỌC VIỆN P MARCOM</div>
    <h1 style="font-size:20px;margin:14px 0 12px;color:${color};">${title}</h1>
    <div style="font-size:15px;line-height:1.7;color:#334155;">${body}</div>
    <div style="margin-top:24px;">
      <a href="https://academy.pmarcom.com" style="display:inline-block;padding:11px 22px;background:#059669;color:#fff;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700;">Về trang khoá học</a>
    </div>
  </div>
</body></html>`;
}

export default async function handler(req, res) {
  const email = cleanEmail(req.query?.email);
  const token = String(req.query?.token || '');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return res.status(400).send(
      page(
        'Đường dẫn không hợp lệ',
        '<p>Đường dẫn huỷ nhận thư này không đúng hoặc đã bị sửa. Bạn hãy mở lại đường dẫn trực tiếp từ thư chúng tôi gửi, hoặc nhắn cho Ban Quản Trị qua khung trò chuyện trong trang khoá học.</p>',
        'error'
      )
    );
  }

  try {
    // Ghi cờ vào CẢ HAI kho hồ sơ. Bảng Quản Trị hợp nhất dữ liệu từ hai nơi
    // này, sót một nơi thì lúc gửi thông báo sẽ đọc trúng bản chưa có cờ và
    // người đã huỷ nhận vẫn tiếp tục nhận thư — đúng thứ khiến họ bấm báo spam.
    const patch = { emailOptOut: true, emailOptOutAt: new Date().toISOString() };
    const docId = toDocId(email);
    const db = adminDb();
    await Promise.all([
      db.collection('students').doc(docId).set(patch, { merge: true }),
      db.collection('registrations').doc(docId).set(patch, { merge: true })
    ]);

    console.log('Đã huỷ nhận thư thông báo cho', email);

    return res.status(200).send(
      page(
        'Đã huỷ nhận thư thông báo',
        `<p>Từ nay <strong>${email}</strong> sẽ không nhận thư thông báo và tin tức từ Học Viện nữa.</p>
         <p>Bạn <strong>vẫn nhận được</strong> thư đặt lại mật khẩu khi cần lấy lại tài khoản — đó là thư phục vụ tài khoản, không phải tin tức.</p>
         <p style="color:#64748b;font-size:14px;">Đổi ý lúc nào cũng được: nhắn cho Ban Quản Trị qua khung trò chuyện trong trang khoá học.</p>`
      )
    );
  } catch (e) {
    console.error('Không ghi được cờ huỷ nhận thư:', e);
    return res.status(500).send(
      page(
        'Chưa huỷ được',
        '<p>Hệ thống đang gặp sự cố nên chưa ghi nhận được yêu cầu của bạn. Vui lòng thử lại sau ít phút, hoặc nhắn cho Ban Quản Trị qua khung trò chuyện trong trang khoá học.</p>',
        'error'
      )
    );
  }
}
