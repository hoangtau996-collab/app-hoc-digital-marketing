/**
 * Chốt chặn quyền quản trị cho các hàm máy chủ.
 *
 * ĐỌC KỸ TRƯỚC KHI SỬA — đây là ranh giới bảo mật thật của phần admin.
 *
 * Mọi hàm trong `api/admin/` đều chạy bằng khoá dịch vụ, tức là có TOÀN QUYỀN
 * trên dữ liệu học viên: đổi email bất kỳ ai, xoá bất kỳ ai. Firestore Rules
 * KHÔNG áp dụng cho khoá dịch vụ — nó đi vòng qua mọi luật. Nghĩa là nếu hàm
 * này để lọt một người ngoài, họ có nhiều quyền hơn cả khi ngồi trước giao diện
 * quản trị.
 *
 * Vì vậy quyền được xác minh theo đúng hai bước, không được bỏ bước nào:
 *
 *   1. Kiểm tra ID token do Firebase ký. Token này máy khách không tự làm giả
 *      được — chữ ký kiểm bằng khoá công khai của Google.
 *   2. Đối chiếu email TRONG TOKEN với sổ `admins` trên Firestore. Không đọc
 *      email từ thân yêu cầu, không tin bất cứ trường nào máy khách gửi lên:
 *      chúng sửa được bằng một dòng lệnh trong devtools.
 */
import { adminAuth, adminDb } from './admin.js';

const cleanEmail = (v) => String(v || '').trim().toLowerCase();

/**
 * Trả về `{ ok: true, email }` nếu người gọi là quản trị viên,
 * hoặc `{ ok: false, status, message }` để nơi gọi trả thẳng về máy khách.
 *
 * Thông báo từ chối cố ý chung chung. Nói rõ "bạn đã đăng nhập nhưng không có
 * quyền" là xác nhận cho người dò rằng token của họ hợp lệ — thông tin đó không
 * giúp gì người dùng thật, chỉ giúp người đang thăm dò.
 */
/**
 * Chỉ cần đang đăng nhập, không cần quyền quản trị.
 *
 * Trả về email LẤY TỪ ID TOKEN — đây là điểm mấu chốt. Hàm gọi nó (thư chào
 * mừng, thư chúc mừng tốt nghiệp) chỉ được phép gửi cho chính người đang đăng
 * nhập. Nếu đọc email từ thân yêu cầu thì bất kỳ ai cũng bắt máy chủ gửi thư
 * tới địa chỉ bất kỳ, dưới danh nghĩa Học Viện — biến ứng dụng thành công cụ
 * phát tán thư rác và kéo cả tên miền xuống hố.
 */
export async function requireSignedIn(req) {
  const header = String(req.headers?.authorization || '');
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

  if (!token) {
    return { ok: false, status: 401, message: 'Thiếu thông tin xác thực.' };
  }

  try {
    const decoded = await adminAuth().verifyIdToken(token);
    const email = cleanEmail(decoded.email);
    if (!email) {
      return { ok: false, status: 403, message: 'Tài khoản không có email hợp lệ.' };
    }
    return { ok: true, email, uid: decoded.uid, name: decoded.name || '' };
  } catch (e) {
    console.warn('ID token không hợp lệ:', e?.code || e?.message);
    return { ok: false, status: 401, message: 'Phiên đăng nhập đã hết hạn.' };
  }
}

export async function requireAdmin(req) {
  const header = String(req.headers?.authorization || '');
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

  if (!token) {
    return { ok: false, status: 401, message: 'Thiếu thông tin xác thực.' };
  }

  let decoded;
  try {
    decoded = await adminAuth().verifyIdToken(token);
  } catch (e) {
    console.warn('ID token không hợp lệ:', e?.code || e?.message);
    return { ok: false, status: 401, message: 'Phiên đăng nhập đã hết hạn. Đăng nhập lại rồi thử lại.' };
  }

  const email = cleanEmail(decoded.email);
  if (!email) {
    return { ok: false, status: 403, message: 'Không đủ quyền thực hiện thao tác này.' };
  }

  try {
    const snap = await adminDb().collection('admins').doc(email).get();
    if (!snap.exists) {
      console.warn('Từ chối thao tác quản trị cho tài khoản ngoài sổ admins:', email);
      return { ok: false, status: 403, message: 'Không đủ quyền thực hiện thao tác này.' };
    }
  } catch (e) {
    // Không đọc được sổ phân quyền thì TỪ CHỐI, không cho qua.
    //
    // Đây là lựa chọn có chủ đích: mất kết nối Firestore mà vẫn cho chạy tiếp
    // nghĩa là chỉ cần làm Firestore không trả lời được là ai cũng thành quản
    // trị viên. Thà một quản trị viên thật phải thử lại còn hơn.
    console.error('Không đọc được sổ admins, từ chối thao tác:', e);
    return { ok: false, status: 503, message: 'Chưa xác minh được quyền. Vui lòng thử lại sau ít phút.' };
  }

  return { ok: true, email };
}
