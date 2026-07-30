/**
 * "Quên mật khẩu" — sinh link đặt lại rồi tự gửi thư mang thương hiệu Học Viện.
 *
 * VÌ SAO KHÔNG DÙNG THƯ CÓ SẴN CỦA FIREBASE: thư đó gửi từ
 * `noreply@hr-project-b982a.firebaseapp.com` và đường dẫn bên trong cũng mang
 * tên miền đó. Học viên vừa học ở academy.pmarcom.com nhận được một lá thư
 * tiếng Anh, người gửi lạ, link lạ — đúng mọi dấu hiệu của thư lừa đảo mà chính
 * chúng ta vẫn dạy họ phải cảnh giác. Ở đây ta chỉ mượn Firebase phần SINH MÃ,
 * còn link và thư thì tự làm.
 *
 * BA QUY TẮC BẢO MẬT ĐƯỢC CÀI SẴN, ĐỌC KỸ TRƯỚC KHI SỬA:
 *
 * 1. Trả lời GIỐNG HỆT NHAU dù email có tồn tại hay không. Trả lời khác nhau là
 *    biến trang này thành công cụ dò email: gửi thử vài nghìn địa chỉ là biết
 *    ai đang là học viên. Vì vậy tuyệt đối không thêm nhánh báo "email không
 *    tồn tại", dù nó có vẻ thân thiện hơn.
 *
 * 2. Có khoảng nghỉ giữa hai lần gửi cho cùng một email, lưu trên Firestore chứ
 *    không trong bộ nhớ. Hàm máy chủ chạy nhiều bản song song, biến trong bộ
 *    nhớ mỗi bản một giá trị nên không chặn được gì.
 *
 * 3. Tài khoản đăng nhập bằng Google VẪN nhận được thư, nhưng là thư giải thích
 *    họ không có mật khẩu. Cách này vừa không lộ thông tin ở phần trả lời, vừa
 *    không bỏ mặc người dùng thật ngồi chờ một lá thư không bao giờ tới.
 */
import { adminAuth, adminDb } from './_lib/admin.js';
import { sendEmail, wrapEmail, emailButton, SITE_URL } from './_lib/mailer.js';

/** Khoảng nghỉ tối thiểu giữa hai lần gửi cho cùng một email (giây). */
const COOLDOWN_SECONDS = 60;

/** Câu trả lời duy nhất gửi về trình duyệt, cho mọi trường hợp. */
const NEUTRAL_REPLY =
  'Nếu email này có tài khoản tại Học Viện, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu. ' +
  'Vui lòng kiểm tra hộp thư, kể cả mục Thư rác.';

const cleanEmail = (v) => String(v || '').trim().toLowerCase();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Phương thức không được hỗ trợ.' });
  }

  const email = cleanEmail(req.body?.email);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, message: 'Địa chỉ email không hợp lệ.' });
  }

  try {
    // --- Khoảng nghỉ giữa hai lần gửi ---
    const throttleRef = adminDb().collection('email_throttle').doc(email.replace(/[^a-z0-9]/g, '_'));
    const throttleSnap = await throttleRef.get();
    const lastSentAt = throttleSnap.exists ? Number(throttleSnap.data()?.lastSentAt || 0) : 0;
    const waited = (Date.now() - lastSentAt) / 1000;

    if (lastSentAt && waited < COOLDOWN_SECONDS) {
      // Vẫn trả về câu trung lập: nói "bạn vừa yêu cầu rồi" là gián tiếp xác
      // nhận email này có tài khoản.
      return res.status(200).json({ ok: true, message: NEUTRAL_REPLY });
    }

    // --- Tài khoản này đăng nhập bằng cách nào ---
    let userRecord = null;
    try {
      userRecord = await adminAuth().getUserByEmail(email);
    } catch (e) {
      if (e?.code === 'auth/user-not-found') {
        // Không có tài khoản: không gửi gì cả, nhưng trả lời y hệt.
        return res.status(200).json({ ok: true, message: NEUTRAL_REPLY });
      }
      throw e;
    }

    const providers = (userRecord.providerData || []).map((p) => p.providerId);
    const hasPassword = providers.includes('password');
    const hasGoogle = providers.includes('google.com');

    let subject;
    let html;

    if (hasPassword) {
      // Sinh mã đặt lại NHƯNG KHÔNG để Firebase gửi thư. Link Firebase trả về
      // mang tên miền firebaseapp.com; ta chỉ lấy phần `oobCode` bên trong rồi
      // ghép lại dưới tên miền của Học Viện. Mã vẫn do Firebase cấp và Firebase
      // kiểm tra, nên không có gì bị làm yếu đi ở đây.
      const firebaseLink = await adminAuth().generatePasswordResetLink(email);
      const oobCode = new URL(firebaseLink).searchParams.get('oobCode');

      if (!oobCode) {
        console.error('Không tách được oobCode từ link Firebase:', firebaseLink);
        return res.status(500).json({ ok: false, message: 'Hệ thống chưa tạo được liên kết. Vui lòng báo Ban Quản Trị.' });
      }

      const resetUrl = `${SITE_URL}/doi-mat-khau?oobCode=${encodeURIComponent(oobCode)}`;

      subject = 'Đặt lại mật khẩu tài khoản Học Viện P MARCOM';
      html = wrapEmail({
        heading: 'Đặt lại mật khẩu của bạn',
        bodyHtml: `
          <p style="margin:0 0 12px;">Chào bạn,</p>
          <p style="margin:0 0 12px;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản
            <strong>${email}</strong> tại Học Viện P MARCOM.</p>
          ${emailButton('Tạo mật khẩu mới', resetUrl)}
          <p style="margin:0 0 12px;">Nút không bấm được? Sao chép đường dẫn sau vào trình duyệt:</p>
          <p style="margin:0 0 12px;word-break:break-all;"><a href="${resetUrl}" style="color:#047857;">${resetUrl}</a></p>
          <p style="margin:0 0 12px;">Liên kết chỉ dùng được <strong>một lần</strong> và hết hạn sau <strong>một giờ</strong>.</p>
        `,
        footerNote:
          'Nếu bạn không yêu cầu đổi mật khẩu, hãy bỏ qua thư này — tài khoản của bạn vẫn an toàn và không có gì thay đổi.'
      });
    } else if (hasGoogle) {
      subject = 'Tài khoản của bạn đăng nhập bằng Google';
      html = wrapEmail({
        heading: 'Tài khoản này không dùng mật khẩu',
        bodyHtml: `
          <p style="margin:0 0 12px;">Chào bạn,</p>
          <p style="margin:0 0 12px;">Bạn vừa yêu cầu đặt lại mật khẩu cho <strong>${email}</strong>.
            Tài khoản này đăng nhập bằng <strong>Google</strong> nên không có mật khẩu riêng tại Học Viện —
            không có gì để đặt lại.</p>
          ${emailButton('Vào học bằng tài khoản Google', SITE_URL)}
          <p style="margin:0 0 12px;">Ở màn hình đăng nhập, bấm nút <strong>"Đăng nhập bằng Google (Gmail)"</strong>
            và chọn đúng địa chỉ này.</p>
        `,
        footerNote: 'Nếu bạn không yêu cầu điều này, hãy bỏ qua thư — không có thay đổi nào trên tài khoản của bạn.'
      });
    } else {
      return res.status(200).json({ ok: true, message: NEUTRAL_REPLY });
    }

    const sent = await sendEmail({ to: email, subject, html });

    // Chỉ tính khoảng nghỉ khi thư THẬT SỰ đi được. Ghi mốc lúc gửi hỏng sẽ
    // khoá người dùng lại 60 giây vì một lỗi không phải của họ.
    if (sent.ok) {
      await throttleRef.set({ lastSentAt: Date.now(), email }, { merge: true });
    } else {
      console.error('Không gửi được thư đặt lại mật khẩu cho', email, sent);
    }

    return res.status(200).json({ ok: true, message: NEUTRAL_REPLY });
  } catch (e) {
    console.error('Lỗi khi xử lý yêu cầu quên mật khẩu:', e);
    return res.status(500).json({
      ok: false,
      message: 'Hệ thống đang gặp sự cố nên chưa gửi được thư. Vui lòng thử lại sau ít phút.'
    });
  }
}
