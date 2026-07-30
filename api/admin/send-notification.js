/**
 * Quản trị viên gửi thư thông báo cho học viên.
 *
 * Dùng cho các thay đổi vận hành: đổi lịch, mở chuyên đề mới, nhắc hạn nhận
 * bằng, thông báo bảo trì.
 *
 * BỐN QUY TẮC ĐƯỢC CÀI CỨNG, đọc kỹ trước khi sửa:
 *
 * 1. MỖI NGƯỜI MỘT THƯ RIÊNG. Nhét cả danh sách vào chung một trường `to` cho
 *    nhanh là phát tán toàn bộ danh sách học viên cho từng người nhận — và
 *    không thu hồi được.
 *
 * 2. LOẠI NGƯỜI ĐÃ HUỶ NHẬN, ngay tại máy chủ chứ không trông vào giao diện.
 *    Gửi tiếp cho người đã bấm huỷ là con đường nhanh nhất để bị báo spam, mà
 *    tên miền bị đánh dấu spam thì thư đặt lại mật khẩu cũng chìm theo.
 *
 * 3. GỬI TỪNG ĐỢT TỐI ĐA 100. Hàm máy chủ Vercel có giới hạn thời gian chạy;
 *    một lệnh gửi nghìn thư sẽ bị cắt giữa chừng và không ai biết nó dừng ở
 *    người thứ mấy. Giao diện lặp từng đợt và tự cộng dồn kết quả.
 *
 * 4. NỘI DUNG DO QUẢN TRỊ VIÊN GÕ ĐƯỢC LỌC THẺ HTML. Không lọc thì một lần dán
 *    nội dung từ Word là kéo theo cả rổ thẻ rác làm vỡ bố cục thư, còn thẻ
 *    <script> thì tuy vô hại trong hộp thư nhưng sẽ khiến bộ lọc thư rác đánh
 *    giá xấu cả tên miền.
 */
import { adminDb } from '../_lib/admin.js';
import { requireAdmin } from '../_lib/requireAdmin.js';
import { sendEmailBatch, wrapEmail, emailButton, unsubscribeUrl, SITE_URL, BATCH_LIMIT } from '../_lib/mailer.js';

const cleanEmail = (v) => String(v || '').trim().toLowerCase();

/**
 * Chuyển nội dung quản trị viên gõ thành HTML an toàn.
 *
 * Chỉ giữ xuống dòng và chữ đậm/nghiêng đơn giản; mọi thứ khác bị thoát thành
 * chữ thường. Cố ý hẹp: đây là ô nhập của người không phải lập trình viên, mở
 * rộng thêm chỉ tạo thêm cách làm vỡ thư.
 */
function toSafeHtml(text) {
  const escaped = String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .split(/\n{2,}/)
    .map((para) => `<p style="margin:0 0 12px;">${para.replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Phương thức không được hỗ trợ.' });
  }

  const guard = await requireAdmin(req);
  if (!guard.ok) {
    return res.status(guard.status).json({ ok: false, message: guard.message });
  }

  const subject = String(req.body?.subject || '').trim();
  const message = String(req.body?.message || '').trim();
  const requested = Array.isArray(req.body?.emails) ? req.body.emails.map(cleanEmail).filter(Boolean) : [];

  if (!subject) return res.status(400).json({ ok: false, message: 'Chưa nhập tiêu đề thư.' });
  if (!message) return res.status(400).json({ ok: false, message: 'Chưa nhập nội dung thư.' });
  if (subject.length > 150) {
    return res.status(400).json({ ok: false, message: 'Tiêu đề tối đa 150 ký tự — dài hơn sẽ bị hộp thư cắt mất.' });
  }
  if (!requested.length) {
    return res.status(400).json({ ok: false, message: 'Chưa chọn người nhận.' });
  }
  if (requested.length > BATCH_LIMIT) {
    return res.status(400).json({
      ok: false,
      message: `Mỗi đợt tối đa ${BATCH_LIMIT} người nhận. Giao diện cần chia nhỏ trước khi gửi.`
    });
  }

  const unique = [...new Set(requested)];

  try {
    // Đọc cờ huỷ nhận từ máy chủ, không tin danh sách gửi lên.
    //
    // Bảng danh sách ở giao diện quản trị có thể đã cũ vài phút — đúng khoảng
    // thời gian một học viên vừa bấm huỷ nhận. Kiểm lại ngay trước khi gửi là
    // chỗ duy nhất chắc chắn đúng.
    const db = adminDb();
    const snaps = await Promise.all(
      unique.map((e) => db.collection('students').doc(e.replace(/[^a-z0-9]/g, '_')).get())
    );

    const optedOut = [];
    const recipients = unique.filter((email, i) => {
      if (snaps[i].exists && snaps[i].data()?.emailOptOut === true) {
        optedOut.push(email);
        return false;
      }
      return true;
    });

    if (!recipients.length) {
      return res.status(200).json({
        ok: true,
        sent: 0,
        skippedOptOut: optedOut.length,
        message: `Không gửi thư nào: cả ${optedOut.length} người trong danh sách đều đã huỷ nhận thư thông báo.`
      });
    }

    const messages = recipients.map((email) => {
      const optOut = unsubscribeUrl(email);
      return {
        to: email,
        subject,
        optOutUrl: optOut,
        html: wrapEmail({
          heading: subject,
          bodyHtml: `${toSafeHtml(message)}${emailButton('Vào trang khoá học', SITE_URL)}`,
          footerNote: 'Thư này gửi tới bạn vì bạn đang là học viên của Học Viện P MARCOM.',
          optOutUrl: optOut
        })
      };
    });

    const result = await sendEmailBatch(messages);

    if (!result.ok) {
      return res.status(502).json({ ok: false, message: result.message || 'Dịch vụ gửi thư từ chối lệnh gửi.' });
    }

    console.log(
      `Quản trị viên ${guard.email} gửi thông báo "${subject}" tới ${recipients.length} học viên` +
        (optedOut.length ? `, bỏ qua ${optedOut.length} người đã huỷ nhận.` : '.')
    );

    return res.status(200).json({
      ok: true,
      sent: recipients.length,
      skippedOptOut: optedOut.length,
      message:
        `Đã gửi ${recipients.length} thư.` +
        (optedOut.length ? ` Bỏ qua ${optedOut.length} người đã huỷ nhận thư thông báo.` : '')
    });
  } catch (e) {
    console.error('Lỗi khi gửi thư thông báo:', e);
    return res.status(500).json({
      ok: false,
      message: `Không gửi được thư (${e?.code || 'lỗi không rõ'}). Vui lòng thử lại sau ít phút.`
    });
  }
}
