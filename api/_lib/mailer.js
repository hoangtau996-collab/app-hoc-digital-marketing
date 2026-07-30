/**
 * Gửi thư qua Resend, và khung HTML dùng chung cho mọi thư của Học Viện.
 *
 * Gọi thẳng REST API bằng `fetch` thay vì cài gói `resend`: chỉ cần đúng một
 * lệnh POST, thêm một gói nữa vào hàm máy chủ chỉ làm nó khởi động chậm hơn.
 *
 * KHOÁ API CHỈ NẰM Ở ĐÂY, PHÍA MÁY CHỦ. Nếu khoá này lọt vào mã nguồn trình
 * duyệt thì bất kỳ ai cũng gửi thư được dưới danh nghĩa pmarcom.com. Hậu quả
 * nặng hơn một hoá đơn: tên miền bị đánh dấu spam thì thư đặt lại mật khẩu của
 * học viên thật cũng rơi vào hộp thư rác.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/** Địa chỉ gửi. Đổi ở đây và trên Vercel, đừng rải ra nhiều chỗ. */
export const MAIL_FROM = process.env.EMAIL_FROM || 'Học Viện P MARCOM <admin@mail.pmarcom.com>';

/** Địa chỉ web chính thức, dùng để ghép mọi đường dẫn trong thư. */
export const SITE_URL = process.env.SITE_URL || 'https://academy.pmarcom.com';

/**
 * Bọc nội dung vào khung thư có nhận diện Học Viện.
 *
 * Toàn bộ định dạng viết thẳng bằng thuộc tính `style` trên từng thẻ, cố ý:
 * Gmail và Outlook cắt bỏ thẻ <style> ở đầu thư, nên CSS gom một chỗ sẽ mất
 * sạch và thư hiện ra trần trụi. Đây là chỗ duy nhất trong dự án nên viết như
 * vậy — không phải thói quen xấu lan sang phần web.
 */
export function wrapEmail({ heading, bodyHtml, footerNote = '' }) {
  return `<!doctype html>
<html lang="vi">
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr>
          <td style="background:#064e3b;padding:20px 28px;">
            <div style="color:#ffffff;font-size:17px;font-weight:800;letter-spacing:.5px;">HỌC VIỆN P MARCOM</div>
            <div style="color:#6ee7b7;font-size:12px;margin-top:2px;">Khóa Học Digital Thực Chiến</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;">
            <h1 style="margin:0 0 16px;font-size:19px;line-height:1.4;color:#0f172a;">${heading}</h1>
            <div style="font-size:14px;line-height:1.7;color:#334155;">${bodyHtml}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:12px;line-height:1.6;color:#64748b;">
            ${footerNote}
            <div style="margin-top:8px;">
              Thư này gửi từ hệ thống Học Viện P MARCOM —
              <a href="${SITE_URL}" style="color:#047857;">academy.pmarcom.com</a>
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Nút bấm trong thư, dựng bằng bảng chứ không phải thẻ <a> có padding.
 *
 * Outlook trên Windows dựng HTML bằng bộ máy của Word, nó bỏ qua padding trên
 * thẻ <a> — nút sẽ co lại thành một dòng chữ gạch chân. Bảng thì Outlook hiểu.
 */
export function emailButton(label, url) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0;">
    <tr><td style="background:#059669;border-radius:10px;">
      <a href="${url}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">${label}</a>
    </td></tr>
  </table>`;
}

/**
 * Gửi một lá thư.
 *
 * Trả về `{ ok, id, message }` và KHÔNG ném lỗi ra ngoài: nơi gọi cần phân biệt
 * "gửi được" với "không gửi được" để trả lời học viên cho đúng, chứ không phải
 * để sập cả hàm.
 */
export async function sendEmail({ to, subject, html, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Thiếu biến môi trường RESEND_API_KEY — không gửi được thư nào.');
    return { ok: false, message: 'Hệ thống gửi thư chưa được cấu hình.' };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {})
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // Ghi nguyên văn phản hồi của Resend ra log. Hai lỗi hay gặp nhất đều có
      // cách sửa hoàn toàn khác nhau, mà nhìn giao diện thì giống hệt:
      //   - 403 domain chưa xác minh -> phải thêm bản ghi DNS
      //   - 401 khoá sai            -> phải khai lại RESEND_API_KEY
      console.error('Resend từ chối gửi thư:', res.status, JSON.stringify(data));
      return { ok: false, status: res.status, message: data?.message || 'Không gửi được thư.' };
    }

    return { ok: true, id: data?.id };
  } catch (e) {
    console.error('Lỗi mạng khi gọi Resend:', e);
    return { ok: false, message: 'Không kết nối được dịch vụ gửi thư.' };
  }
}
