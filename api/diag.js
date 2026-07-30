/**
 * Chẩn đoán hàm máy chủ, từng bước một, KHÔNG nuốt lỗi.
 *
 * Vì sao cần: `api/forgot-password.js` import firebase-admin ở đầu tệp, nên khi
 * gói đó hỏng thì cả module chết TRƯỚC khi chạy dòng đầu tiên — Vercel chỉ trả
 * về `500 FUNCTION_INVOCATION_FAILED`, không kèm lý do. Nhìn từ ngoài, lỗi này
 * giống hệt lỗi sai khoá, sai biến môi trường, hay sai quyền.
 *
 * Tệp này nạp firebase-admin bằng `await import()` bên TRONG try/catch, nên bắt
 * được lỗi và đọc ra nguyên văn.
 *
 * KHÔNG BAO GIỜ IN RA GIÁ TRỊ BÍ MẬT. Chỉ báo có hay không và độ dài. Đây là
 * đường dẫn công khai, ai cũng gọi được — in khoá ra đây là công khai nó cho cả
 * thế giới. Xoá tệp này sau khi sửa xong sự cố.
 */
export default async function handler(req, res) {
  const steps = [];
  const add = (label, ok, detail) => steps.push({ label, ok, detail });

  add('Node đang chạy', true, process.version);

  // Biến môi trường: chỉ báo CÓ/KHÔNG và độ dài, tuyệt đối không in giá trị.
  for (const name of ['RESEND_API_KEY', 'FIREBASE_SERVICE_ACCOUNT', 'EMAIL_FROM', 'SITE_URL']) {
    const v = process.env[name];
    add(`Biến ${name}`, Boolean(v), v ? `có, dài ${v.length} ký tự` : 'CHƯA KHAI BÁO');
  }

  // Nạp firebase-admin — nghi phạm số một.
  let adminAppModule = null;
  try {
    adminAppModule = await import('firebase-admin/app');
    add('Nạp gói firebase-admin', true, 'thành công');
  } catch (e) {
    add('Nạp gói firebase-admin', false, `${e?.code || ''} ${e?.message || String(e)}`);
  }

  // Đọc và bóc khoá dịch vụ.
  let serviceAccount = null;
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT || '';
    const text = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
    serviceAccount = JSON.parse(text);
    add(
      'Đọc khoá dịch vụ',
      true,
      `project_id=${serviceAccount.project_id}, có private_key=${Boolean(serviceAccount.private_key)}`
    );
  } catch (e) {
    add('Đọc khoá dịch vụ', false, e?.message || String(e));
  }

  // Khởi tạo thật và gọi một lệnh đọc. Đây mới là bước chứng minh khoá dùng được.
  if (adminAppModule && serviceAccount) {
    try {
      if (serviceAccount.private_key?.includes('\\n')) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      const app = adminAppModule.getApps().length
        ? adminAppModule.getApps()[0]
        : adminAppModule.initializeApp({ credential: adminAppModule.cert(serviceAccount) });

      const { getAuth } = await import('firebase-admin/auth');
      // Hỏi một email chắc chắn không tồn tại: nếu khoá hợp lệ thì máy chủ trả
      // về đúng lỗi `user-not-found`, tức là đã nói chuyện được với Firebase.
      try {
        await getAuth(app).getUserByEmail('khong-ton-tai-9k3x@example.com');
        add('Gọi Firebase Auth bằng khoá', true, 'gọi được (bất ngờ: email thử lại tồn tại)');
      } catch (e) {
        const code = String(e?.code || '');
        add(
          'Gọi Firebase Auth bằng khoá',
          code.includes('user-not-found'),
          code.includes('user-not-found') ? 'khoá hợp lệ, máy chủ trả lời bình thường' : `${code} ${e?.message}`
        );
      }
    } catch (e) {
      add('Khởi tạo Firebase Admin', false, `${e?.code || ''} ${e?.message || String(e)}`);
    }
  }

  return res.status(200).json({ ok: true, steps });
}
