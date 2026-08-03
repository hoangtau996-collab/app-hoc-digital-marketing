/**
 * Sổ phân quyền quản trị.
 *
 * Hai tầng quyền, cố ý không bằng nhau:
 *
 *   1. QUẢN TRỊ TỐI CAO (root) — danh sách nằm cứng trong mã nguồn. KHÔNG tài
 *      khoản nào thu hồi hay xoá được, kể cả một quản trị viên khác, kể cả
 *      chính nó. Đây là chốt chặn để hệ thống không bao giờ rơi vào cảnh không
 *      còn ai giữ quyền quản trị: nếu quyền cao nhất mà thu hồi được thì chỉ
 *      cần một cú bấm nhầm là mất bảng quản trị vĩnh viễn, vì ứng dụng không có
 *      backend để khôi phục.
 *
 *   2. Quản trị viên được nâng quyền — do một quản trị viên cấp cho tài khoản
 *      khác, ghi vào localStorage `dmm_admin_emails` và đồng bộ lên Firestore.
 *      Tầng này thu hồi được.
 *
 * NGUỒN KHẲNG ĐỊNH NẰM Ở MÁY CHỦ, KHÔNG PHẢI Ở ĐÂY.
 *
 * Sổ trong localStorage chỉ là BỘ NHỚ ĐỆM của câu trả lời gần nhất từ collection
 * `admins` trên Firestore. Nó tồn tại để quản trị viên không mất quyền mỗi lần
 * rớt mạng — chứ không để tự sinh ra quyền. Ai sửa `dmm_admin_emails` trong
 * devtools cũng chỉ lừa được giao diện trên máy họ: mọi lệnh đọc dữ liệu học
 * viên đều bị Firestore Rules chặn ở phía máy chủ, nên bảng hiện ra rỗng.
 *
 * Xem `firestore.rules` để biết ranh giới thật, và `App.jsx` (`resolveAdminRole`)
 * để biết quyền được cấp ở đâu: chỉ sau khi có phiên đăng nhập Firebase Auth
 * thật và máy chủ xác nhận.
 */

const LS_KEY = 'dmm_admin_emails';
const USERS_DB_KEY = 'dmm_users_db';

/**
 * Email của các tài khoản quản trị cao nhất — bất khả xâm phạm.
 *
 * PHẢI KHỚP `rootAdminEmails()` trong firestore.rules. Danh sách ở đây chỉ điều
 * khiển giao diện; ranh giới thật nằm ở rules trên máy chủ. Sửa một bên mà quên
 * bên kia sẽ ra đúng kiểu hỏng khó chịu nhất: giao diện quản trị mở ra bình
 * thường nhưng mọi lệnh đọc bị từ chối, nên bảng hiện lên rỗng trơn và không
 * chỗ nào nói vì sao.
 *
 * Và rules KHÔNG tự lên máy chủ theo lệnh deploy — phải dán tay trong Firebase
 * Console (xem DEPLOYMENT.md).
 */
export const ROOT_ADMIN_EMAILS = ['admin@pmarcom.edu.vn', 'pmarcomvn@gmail.com'];

/**
 * Hồ sơ hiển thị của tài khoản gốc. Cần đến vì bản ghi thật của tài khoản này
 * chỉ sinh ra sau lần đăng nhập đầu tiên trên từng máy; thiếu nó thì Bảng Quản
 * Trị không hiển thị được chính người đang giữ quyền cao nhất.
 */
export const ROOT_ADMIN_PROFILES = [
  {
    id: 'admin-master-01',
    email: 'admin@pmarcom.edu.vn',
    name: 'QUẢN TRỊ VIÊN ADMIN',
    phone: '0999999999',
    industry: 'Ban Quản Trị Học Viện',
    role: 'admin',
    completedModules: [],
    createdAt: 'Tài khoản gốc'
  },
  {
    id: 'admin-master-02',
    email: 'pmarcomvn@gmail.com',
    name: 'P MARCOM',
    phone: 'Chưa cập nhật',
    industry: 'Ban Quản Trị Học Viện',
    role: 'admin',
    completedModules: [],
    createdAt: 'Tài khoản gốc'
  }
];

export const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

export function isRootAdmin(email) {
  const key = normalizeEmail(email);
  return Boolean(key) && ROOT_ADMIN_EMAILS.includes(key);
}

/** Bộ nhớ đệm: các email máy chủ đã xác nhận là quản trị viên (không gồm tài khoản gốc). */
export function getGrantedAdminEmails() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeEmail).filter((e) => e && !ROOT_ADMIN_EMAILS.includes(e));
  } catch (e) {
    return [];
  }
}

/** Toàn bộ email đang có quyền quản trị: tài khoản gốc + tài khoản được nâng. */
export function getAdminEmails() {
  return [...ROOT_ADMIN_EMAILS, ...getGrantedAdminEmails()];
}

/** Theo bộ nhớ đệm tại máy. KHÔNG dùng làm căn cứ cấp quyền — xem chú thích đầu tệp. */
export function isAdminEmail(email) {
  const key = normalizeEmail(email);
  return Boolean(key) && getAdminEmails().includes(key);
}

/** Ghi đè bộ nhớ đệm bằng sổ vừa đọc từ máy chủ. */
export function replaceAdminCache(emails) {
  if (!Array.isArray(emails)) return;
  const granted = emails.map(normalizeEmail).filter((e) => e && !ROOT_ADMIN_EMAILS.includes(e));
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(granted));
  } catch (e) { /* hết chỗ lưu thì thôi, lần sau hỏi lại máy chủ */ }
}

/**
 * Vai trò hiệu lực của một tài khoản: 'root' | 'admin' | 'student'.
 *
 * Nhận vào cả object hồ sơ lẫn chuỗi email.
 *
 * `roster` là sổ phân quyền vừa đọc từ Firestore (một Set các email). Truyền vào
 * thì nó là căn cứ duy nhất — đó là câu trả lời của máy chủ. Bỏ trống thì rơi về
 * bộ nhớ đệm tại máy, chỉ dùng khi chưa hỏi được máy chủ.
 */
export function getAccountRole(account, roster) {
  const email = normalizeEmail(typeof account === 'string' ? account : account?.email);
  if (isRootAdmin(email)) return 'root';
  if (roster instanceof Set) return roster.has(email) ? 'admin' : 'student';
  if (isAdminEmail(email)) return 'admin';
  if (account && typeof account === 'object' && account.role === 'admin') return 'admin';
  return 'student';
}

export function isAdminAccount(account, roster) {
  return getAccountRole(account, roster) !== 'student';
}

/**
 * Ghi vai trò vào sổ tài khoản tại máy. Cần bước này vì `resolveUserRole` trong
 * App.jsx còn tra `dmm_users_db` khi khôi phục phiên đăng nhập; bỏ qua thì bản
 * ghi cũ trong sổ đó vẫn khai vai trò lỗi thời.
 */
function writeRoleToUsersDb(email, role) {
  const key = normalizeEmail(email);
  if (!key) return;
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return;
    let changed = false;
    const next = list.map((u) => {
      if (normalizeEmail(u?.email) !== key) return u;
      changed = true;
      return { ...u, role };
    });
    if (changed) localStorage.setItem(USERS_DB_KEY, JSON.stringify(next));
  } catch (e) { /* sổ hỏng thì bỏ qua, quyền vẫn nằm ở dmm_admin_emails */ }
}

/**
 * Nâng một tài khoản lên Quản Trị Viên.
 * Trả về { ok, message } để nơi gọi hiển thị nguyên văn lý do khi bị từ chối.
 */
export function grantAdmin(email) {
  const key = normalizeEmail(email);
  if (!key) {
    return { ok: false, message: 'Tài khoản không có email hợp lệ nên không thể nâng quyền.' };
  }
  if (isRootAdmin(key)) {
    return { ok: false, message: `${key} vốn đã là Quản Trị Tối Cao của hệ thống.` };
  }

  const granted = getGrantedAdminEmails();
  if (!granted.includes(key)) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify([...granted, key]));
    } catch (e) {
      return { ok: false, message: `Không ghi được sổ phân quyền tại máy: ${e.message}` };
    }
  }
  writeRoleToUsersDb(key, 'admin');
  return { ok: true, message: `Đã nâng ${key} lên Quản Trị Viên.` };
}

/**
 * Thu hồi quyền quản trị.
 *
 * Đây là chốt chặn quan trọng nhất của tệp: tài khoản Quản Trị Tối Cao luôn bị
 * từ chối, không có tham số nào bỏ qua được.
 */
export function revokeAdmin(email) {
  const key = normalizeEmail(email);
  if (!key) {
    return { ok: false, message: 'Tài khoản không có email hợp lệ.' };
  }
  if (isRootAdmin(key)) {
    return {
      ok: false,
      message: `Không thể thu hồi quyền của ${key}. Đây là tài khoản Quản Trị Tối Cao — không tài khoản nào, kể cả quản trị viên khác, được phép gỡ quyền quản trị cao nhất.`
    };
  }

  try {
    localStorage.setItem(LS_KEY, JSON.stringify(getGrantedAdminEmails().filter((e) => e !== key)));
  } catch (e) {
    return { ok: false, message: `Không ghi được sổ phân quyền tại máy: ${e.message}` };
  }
  writeRoleToUsersDb(key, 'student');
  return { ok: true, message: `Đã thu hồi quyền quản trị của ${key}.` };
}

/**
 * Tài khoản có được phép xoá khỏi hệ thống không.
 *
 * Quản Trị Tối Cao: không bao giờ. Quản trị viên thường: phải thu hồi quyền
 * trước — bắt đi qua hai bước để không ai xoá nhầm một người đang có quyền chỉ
 * bằng một cú bấm.
 */
export function canDeleteAccount(account, roster) {
  const role = getAccountRole(account, roster);
  if (role === 'root') {
    return {
      ok: false,
      message: 'Không thể xoá tài khoản Quản Trị Tối Cao của hệ thống.'
    };
  }
  if (role === 'admin') {
    return {
      ok: false,
      message: 'Hãy thu hồi quyền quản trị của tài khoản này trước khi xoá.'
    };
  }
  return { ok: true, message: '' };
}
