/**
 * Tính nhãn thời gian hiển thị cho bản tin.
 *
 * VÌ SAO CẦN FILE NÀY: trước đây mỗi tin lưu sẵn một chuỗi chữ như
 * 'Vừa xong (Live Update)' hay '1 ngày trước' ngay trong dữ liệu. Chuỗi đó
 * không tự già đi, nên tin đăng 28/07 vẫn khoe 'Vừa xong' sau đó nhiều ngày,
 * trong khi dòng ngày tuyệt đối ngay bên cạnh lại ghi 28/07 — mâu thuẫn hiện
 * trên cùng một thẻ. Nay chỉ lưu `publishedAt` dạng dd/mm/yyyy, còn nhãn tương
 * đối được tính lúc vẽ giao diện.
 */

/** Đổi 'dd/mm/yyyy' thành Date lúc 0h. Trả về null nếu chuỗi không hợp lệ. */
export function parseVnDate(text) {
  if (typeof text !== 'string') return null;
  const m = text.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const d = new Date(year, month - 1, day);
  // Chặn ngày không tồn tại kiểu 31/02: Date tự nhảy sang tháng sau, so lại để loại.
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
    return null;
  }
  return d;
}

/** Định dạng Date thành 'dd/mm/yyyy'. */
export function formatVnDate(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Ngày hôm nay dạng 'dd/mm/yyyy'. */
export function todayVnDate() {
  return formatVnDate(new Date());
}

/**
 * Nhãn tương đối để hiện trên thẻ tin.
 *
 * `receivedAt` (mốc mili giây) chỉ có ở tin vừa nạp bằng nút Live. Trong giờ
 * đầu tiên tin đó hiện 'Vừa xong', sau đó rơi về cách tính theo ngày như mọi
 * tin khác thay vì kẹt ở 'Vừa xong' vĩnh viễn.
 */
export function relativeNewsDate(publishedAt, receivedAt) {
  if (typeof receivedAt === 'number' && Number.isFinite(receivedAt)) {
    const minutes = Math.floor((Date.now() - receivedAt) / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
  }

  const published = parseVnDate(publishedAt);
  if (!published) return publishedAt || '';

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const days = Math.round((startOfToday - published) / 86400000);

  if (days < 0) return 'Sắp áp dụng';
  if (days === 0) return 'Hôm nay';
  if (days === 1) return 'Hôm qua';
  if (days < 7) return `${days} ngày trước`;
  if (days < 14) return 'Tuần trước';
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  if (days < 60) return 'Tháng trước';
  return `${Math.floor(days / 30)} tháng trước`;
}

/**
 * So sánh để xếp tin mới lên đầu.
 *
 * Tin nạp bằng nút Live luôn đứng trên tin biên tập cùng ngày, vì người dùng
 * vừa bấm nút xong thì phải thấy ngay kết quả ở đầu danh sách.
 */
export function compareNewsRecency(a, b) {
  const ar = typeof a.receivedAt === 'number' ? a.receivedAt : 0;
  const br = typeof b.receivedAt === 'number' ? b.receivedAt : 0;
  if (ar !== br) return br - ar;

  const ad = parseVnDate(a.publishedAt);
  const bd = parseVnDate(b.publishedAt);
  if (ad && bd && ad.getTime() !== bd.getTime()) return bd - ad;
  return 0;
}
