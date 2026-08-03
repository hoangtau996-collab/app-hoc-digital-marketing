/**
 * Thư tự động gửi cho chính học viên đang đăng nhập.
 *
 * Hai loại:
 *   'welcome'    — sau khi hoàn tất đăng ký, kèm hướng dẫn bắt đầu học
 *   'graduation' — sau khi đạt đủ 11/11 chuyên đề, kèm lời mời nhận bằng
 *
 * BA CHỐT CHẶN, đọc kỹ trước khi sửa:
 *
 * 1. EMAIL LẤY TỪ ID TOKEN, không bao giờ từ thân yêu cầu. Đây là đường dẫn mà
 *    ứng dụng phía trình duyệt gọi được, nên nếu nhận email do máy khách khai
 *    thì bất kỳ ai cũng bắt máy chủ gửi thư tới địa chỉ bất kỳ dưới danh nghĩa
 *    Học Viện. Hậu quả không dừng ở vài lá thư rác: tên miền bị đánh dấu spam
 *    thì thư đặt lại mật khẩu của học viên thật cũng chìm theo.
 *
 * 2. GỬI ĐÚNG MỘT LẦN CHO MỖI LOẠI, chốt bằng cờ trên Firestore chứ không phải
 *    localStorage. Nơi gọi ở giao diện chạy lại mỗi lần tải trang và mỗi lần
 *    tiến độ đổi; chốt tại máy là học viên đổi máy hay xoá trình duyệt sẽ nhận
 *    lại thư "chúc mừng tốt nghiệp" thêm lần nữa.
 *
 * 3. TÔN TRỌNG CỜ HUỶ NHẬN. Người đã bấm huỷ nhận thư thông báo thì không nhận
 *    cả hai loại này. Chúng là thư chúc mừng, không phải thư phục vụ tài khoản
 *    — khác với thư đặt lại mật khẩu, thứ vẫn phải gửi trong mọi trường hợp.
 */
import { adminDb } from './_lib/admin.js';
import { requireSignedIn } from './_lib/requireAdmin.js';
import { sendEmail, wrapEmail, emailButton, unsubscribeUrl, SITE_URL } from './_lib/mailer.js';

const toDocId = (email) => String(email || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');

/** Tên cờ đánh dấu đã gửi, theo từng loại thư. */
const SENT_FLAG = {
  welcome: 'welcomeEmailSentAt',
  graduation: 'graduationEmailSentAt'
};

function buildEmail(type, { name, email }) {
  const optOut = unsubscribeUrl(email);
  const who = name ? name : 'bạn';

  if (type === 'welcome') {
    return {
      subject: 'Chào mừng bạn đến với Học Viện P MARCOM',
      optOutUrl: optOut,
      html: wrapEmail({
        heading: `Chào mừng ${who}!`,
        bodyHtml: `
          <p style="margin:0 0 12px;">Tài khoản học viên của bạn đã sẵn sàng. Toàn bộ khoá học
            <strong>Digital Thực Chiến</strong> được tài trợ 100% học phí — bạn không phải trả gì thêm.</p>
          <p style="margin:0 0 12px;"><strong>Bắt đầu thế nào:</strong></p>
          <ol style="margin:0 0 12px;padding-left:20px;">
            <li style="margin-bottom:6px;">Học lần lượt 11 chuyên đề, mỗi chuyên đề có bài kiểm tra ngắn cuối bài.</li>
            <li style="margin-bottom:6px;">Đạt bài kiểm tra thì chuyên đề tiếp theo mở ra.</li>
            <li style="margin-bottom:6px;">Xong đủ 11 chuyên đề, bạn nhận Giấy Chứng Nhận mang tên mình.</li>
          </ol>
          ${emailButton('Bắt đầu học ngay', SITE_URL)}
          <p style="margin:0 0 12px;">Gặp trục trặc hay cần hỗ trợ, bấm khung trò chuyện ở góc màn hình trong
            trang khoá học — Ban Quản Trị sẽ trả lời trực tiếp ở đó.</p>
        `,
        footerNote: 'Bạn nhận thư này vì vừa tạo tài khoản học viên tại Học Viện P MARCOM.',
        optOutUrl: optOut
      })
    };
  }

  return {
    subject: 'Chúc mừng bạn đã hoàn thành khoá học!',
    optOutUrl: optOut,
    html: wrapEmail({
      heading: `Chúc mừng ${who} đã hoàn thành 11/11 chuyên đề!`,
      bodyHtml: `
        <p style="margin:0 0 12px;">Bạn vừa hoàn thành toàn bộ khoá <strong>Digital Thực Chiến</strong> của
          Học Viện P MARCOM. Không nhiều người đi hết chặng này — chúc mừng bạn.</p>
        <p style="margin:0 0 12px;"><strong>Giấy Chứng Nhận của bạn đã sẵn sàng.</strong> Vào trang khoá học,
          mở mục <strong>Chứng Nhận</strong> để xem và tải về bản in.</p>
        ${emailButton('Nhận Giấy Chứng Nhận', SITE_URL)}
        <p style="margin:0 0 12px;">Khoá nâng cao <strong>Trade Marketing</strong> cũng vừa mở khoá cho bạn —
          vào trang khoá học là thấy ngay trên thanh menu.</p>
      `,
      footerNote: 'Bạn nhận thư này vì vừa hoàn thành khoá học tại Học Viện P MARCOM.',
      optOutUrl: optOut
    })
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Phương thức không được hỗ trợ.' });
  }

  const type = String(req.body?.type || '');
  if (!SENT_FLAG[type]) {
    return res.status(400).json({ ok: false, message: 'Loại thư không hợp lệ.' });
  }

  const who = await requireSignedIn(req);
  if (!who.ok) {
    return res.status(who.status).json({ ok: false, message: who.message });
  }

  const flag = SENT_FLAG[type];
  const docId = toDocId(who.email);

  try {
    const db = adminDb();
    const ref = db.collection('students').doc(docId);
    const snap = await ref.get();
    const data = snap.exists ? snap.data() : null;

    if (data?.[flag]) {
      // Đã gửi rồi. Trả về ok để nơi gọi không coi là lỗi rồi thử lại mãi.
      return res.status(200).json({ ok: true, sent: false, reason: 'da-gui-truoc-do' });
    }

    if (data?.emailOptOut === true) {
      return res.status(200).json({ ok: true, sent: false, reason: 'da-huy-nhan-thu' });
    }

    const { subject, html, optOutUrl } = buildEmail(type, {
      name: data?.name || who.name || '',
      email: who.email
    });

    const result = await sendEmail({ to: who.email, subject, html, optOutUrl });

    if (!result.ok) {
      // KHÔNG đặt cờ khi gửi hỏng. Đặt cờ ở đây là học viên vĩnh viễn mất lá
      // thư đó, vì lần sau nơi gọi sẽ thấy cờ và bỏ qua.
      console.error(`Không gửi được thư ${type} cho ${who.email}:`, result);
      return res.status(502).json({ ok: false, message: result.message || 'Không gửi được thư.' });
    }

    // `merge: true` và tạo tài liệu nếu chưa có: học viên đăng nhập bằng Google
    // có thể chưa có hồ sơ trên Firestore vào đúng lúc thư chào mừng được gửi.
    await ref.set({ [flag]: new Date().toISOString(), email: who.email }, { merge: true });

    console.log(`Đã gửi thư ${type} cho ${who.email}`);
    return res.status(200).json({ ok: true, sent: true });
  } catch (e) {
    console.error(`Lỗi khi gửi thư ${type}:`, e);
    return res.status(500).json({ ok: false, message: 'Hệ thống đang gặp sự cố nên chưa gửi được thư.' });
  }
}
