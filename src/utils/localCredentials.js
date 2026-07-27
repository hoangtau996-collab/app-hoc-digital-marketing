/**
 * Băm mật khẩu cho nhánh đăng nhập dự phòng lưu tại máy (dmm_users_db).
 *
 * Vì sao cần: trước đây bản ghi dự phòng lưu thẳng mật khẩu dạng chữ thường
 * trong localStorage. Rủi ro thật không nằm ở chỗ ai đó giả mạo phiên đăng nhập
 * (localStorage vốn người dùng sửa được, nhánh dự phòng không phải hàng rào bảo
 * mật), mà nằm ở chỗ ĐỂ LỘ MẬT KHẨU của học viên — nhiều người dùng lại cùng
 * một mật khẩu cho email và ngân hàng.
 *
 * Dùng SHA-256 kèm muối ngẫu nhiên riêng cho từng bản ghi.
 */

const SALT_BYTES = 16;

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** crypto.subtle chỉ có ở ngữ cảnh bảo mật (https hoặc localhost). */
function hasWebCrypto() {
  return typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function';
}

export function makeSalt() {
  const bytes = new Uint8Array(SALT_BYTES);
  crypto.getRandomValues(bytes);
  return toHex(bytes.buffer);
}

export async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
}

/**
 * Tạo thông tin đăng nhập để lưu tại máy.
 * Trả về null khi trình duyệt không cho dùng Web Crypto (trang chạy trên http
 * thuần). Khi đó KHÔNG lưu gì cả — thà mất khả năng đăng nhập offline cho tài
 * khoản đó còn hơn ghi mật khẩu dạng chữ thường xuống đĩa.
 */
export async function createCredential(password) {
  if (!hasWebCrypto()) return null;
  const salt = makeSalt();
  return { salt, hash: await hashPassword(password, salt) };
}

/**
 * Đối chiếu mật khẩu với một bản ghi trong dmm_users_db.
 *
 * Trả về:
 *   { ok, needsUpgrade }
 *   - needsUpgrade = true khi bản ghi còn ở định dạng cũ (mật khẩu chữ thường)
 *     và đối chiếu đúng -> phía gọi nên nâng cấp bản ghi ngay.
 */
export async function verifyCredential(password, record) {
  if (!record) return { ok: false, needsUpgrade: false };

  // Định dạng cũ: mật khẩu nằm thẳng trong bản ghi.
  if (typeof record.password === 'string') {
    return { ok: record.password === password, needsUpgrade: record.password === password };
  }

  if (!record.salt || !record.hash || !hasWebCrypto()) {
    return { ok: false, needsUpgrade: false };
  }

  const hash = await hashPassword(password, record.salt);
  return { ok: hash === record.hash, needsUpgrade: false };
}

/** Bỏ trường mật khẩu cũ và gắn thông tin đã băm. */
export function upgradeRecord(record, credential) {
  const { password, ...rest } = record;
  return credential ? { ...rest, ...credential } : rest;
}
