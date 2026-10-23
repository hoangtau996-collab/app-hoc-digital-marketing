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
 * Quy mọi tin về MỘT trục thời gian duy nhất để so sánh.
 *
 * Tin nạp bằng nút Live có `receivedAt` chính xác tới mili giây. Tin biên tập
 * chỉ có ngày đăng, quy về 0 giờ ngày đó. Nhờ vậy tin vừa bấm Live hôm nay vẫn
 * đứng trên tin biên tập cùng ngày — nó mới hơn thật — nhưng tin bấm Live từ
 * tuần trước thì nằm đúng chỗ của tuần trước.
 */
function mocTin(t) {
  if (typeof t?.receivedAt === 'number' && Number.isFinite(t.receivedAt)) {
    return t.receivedAt;
  }
  const d = parseVnDate(t?.publishedAt);
  return d ? d.getTime() : 0;
}

/**
 * So sánh để xếp tin mới lên đầu.
 *
 * BẢN TRƯỚC SO TRÊN HAI TRỤC RỜI NHAU và đó là một lỗi nặng: nó xét `receivedAt`
 * trước, coi tin không có mốc ấy như `0`. Mà tin biên tập — toàn bộ tin thật do
 * quy trình tự động đăng — không bao giờ có `receivedAt`. Kết quả: BẤT KỲ tin
 * nào từng nạp bằng nút Live đều vĩnh viễn đứng trên MỌI tin thật, kể cả khi nó
 * đã cũ hàng tháng.
 *
 * Triệu chứng nhìn thấy đúng bằng triệu chứng của lỗi localStorage ngày trước:
 * đầu bản tin đứng yên ở một ngày cũ, tin mới đổ về mỗi sáng nhưng bị đẩy xuống
 * dưới nên người dùng tưởng quy trình tự động đã chết. Máy chủ vẫn chạy đúng,
 * chỉ có thứ tự hiển thị nói dối.
 */
export function compareNewsRecency(a, b) {
  return mocTin(b) - mocTin(a);
}
