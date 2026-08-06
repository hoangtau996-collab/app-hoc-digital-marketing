/**
 * Bản đồ hai chiều giữa ĐƯỜNG DẪN TRÌNH DUYỆT và TRẠNG THÁI ĐIỀU HƯỚNG.
 *
 * Trước tệp này ứng dụng chỉ có đúng một địa chỉ là `/`: chuyên đề đang học,
 * tin đang đọc hay công cụ đang mở đều nằm trong state React. Hệ quả là đóng
 * tab thì mất chỗ đang đứng, và gửi liên kết cho đồng nghiệp thì họ rơi về
 * trang chủ rồi phải tự mò lại. Mọi thứ ở đây chỉ nhằm một việc: biến trạng
 * thái đó thành một địa chỉ dán được vào tin nhắn.
 *
 * TỆP NÀY THUẦN HÀM — không đụng `window`, không gọi React. Nhờ vậy quy tắc
 * đường dẫn kiểm thử được riêng, còn phần đồng bộ lịch sử duyệt web (App.jsx)
 * chỉ còn phải lo đúng chuyện đẩy hay thay mục lịch sử.
 *
 * ĐỔI CHUỖI TRONG `TAB_SEGMENTS` LÀ ĐỔI ĐỊA CHỈ CÔNG KHAI: mọi liên kết đã gửi
 * đi trước đó sẽ chết. Cần đổi thì phải khai báo luật chuyển hướng cho địa chỉ
 * cũ ở tầng máy chủ (`vercel.json`), đừng đổi lặng lẽ.
 *
 * Định danh trên đường dẫn dùng thẳng `id` có sẵn trong dữ liệu (`module-01`,
 * `trade-01`, `roas`, `real-2026-07-30-meta-q2`...). CỐ Ý không sinh slug tiếng
 * Việt riêng: những id này đang được lưu trong Firestore và localStorage tiến
 * độ học, đặt thêm tên mới cho chúng ở đây là mở đường cho hai hệ định danh
 * lệch nhau — và lệch ở tầng tiến độ học thì học viên mất bài.
 */

/**
 * Tiền tố đường dẫn của từng tab.
 *
 * Khoá phải khớp đúng giá trị `activeTab` bên App.jsx; thêm tab mới mà quên
 * khai báo ở đây thì tab đó không có địa chỉ riêng và im lặng rơi về `/`.
 */
export const TAB_SEGMENTS = {
  course: 'chuyen-de',
  trade: 'trade-marketing',
  glossary: 'thuat-ngu',
  news: 'ban-tin',
  tools: 'cong-cu',
};

const TAB_BY_SEGMENT = Object.fromEntries(
  Object.entries(TAB_SEGMENTS).map(([tab, segment]) => [segment, tab])
);

/** Màn hình mặc định: tổng quan khoá Digital Marketing, tức địa chỉ `/`. */
export const HOME_ROUTE = { tab: 'course', itemId: null };

/** Tên từng khu vực, dùng cho tiêu đề tab trình duyệt và dấu trang. */
export const TAB_TITLES = {
  course: 'Khoá Digital Marketing',
  trade: 'Khoá Trade Marketing',
  glossary: 'Từ Điển Thuật Ngữ',
  news: 'Bản Tin Thuật Toán',
  tools: 'Bộ Công Cụ Trưởng Phòng',
};

const SITE_TITLE = 'HỌC VIỆN P MARCOM';

/** Tiêu đề trang chủ — giữ trùng khít thẻ `<title>` tĩnh trong index.html. */
export const HOME_DOCUMENT_TITLE = `${SITE_TITLE} | Khóa Học Digital Thực Chiến`;

/**
 * Địa chỉ hỏng không phải lý do để làm sập ứng dụng: `decodeURIComponent` ném
 * lỗi với chuỗi phần trăm không hợp lệ (`/ban-tin/%E0`), mà lỗi đó xảy ra ngay
 * lúc dựng lần đầu thì học viên chỉ thấy màn hình trắng.
 */
const decodeSegment = (raw) => {
  try {
    return decodeURIComponent(raw);
  } catch (e) {
    return raw;
  }
};

/**
 * Đọc đường dẫn thành trạng thái điều hướng.
 *
 * @param {string} pathname Phần đường dẫn, không gồm query và hash.
 * @returns {{tab: string, itemId: string|null} | null}
 *   `null` nghĩa là KHÔNG NHẬN RA địa chỉ này. Cố ý phân biệt với trang chủ để
 *   nơi gọi còn dọn thanh địa chỉ: gõ nhầm `/khoahoc` mà lặng lẽ hiện trang chủ
 *   dưới đúng cái địa chỉ sai đó thì người dùng lưu dấu trang lại lần nữa, và
 *   lần sau vẫn sai.
 */
export function parseRoute(pathname) {
  const parts = String(pathname || '/')
    .split('/')
    .filter(Boolean);

  if (parts.length === 0) return { ...HOME_ROUTE };

  const tab = TAB_BY_SEGMENT[decodeSegment(parts[0])];
  if (!tab) return null;

  return { tab, itemId: parts[1] ? decodeSegment(parts[1]) : null };
}

/**
 * Dựng đường dẫn từ trạng thái điều hướng. Nghịch đảo của `parseRoute`.
 *
 * Tổng quan khoá chính là `/` chứ không phải `/chuyen-de`: đó là trang chủ,
 * và trang chủ có hai địa chỉ là tự chia đôi tín hiệu xếp hạng của chính mình.
 */
export function buildPath(route) {
  const tab = TAB_SEGMENTS[route?.tab] ? route.tab : HOME_ROUTE.tab;
  const itemId = route?.itemId || null;

  if (tab === 'course' && !itemId) return '/';

  const segment = TAB_SEGMENTS[tab];
  return itemId ? `/${segment}/${encodeURIComponent(itemId)}` : `/${segment}`;
}

/** Hai trạng thái điều hướng có trỏ về cùng một màn hình không. */
export function isSameRoute(a, b) {
  return (a?.tab || null) === (b?.tab || null) && (a?.itemId || null) === (b?.itemId || null);
}

/**
 * Tiêu đề tab trình duyệt cho một màn hình.
 *
 * CHỈ đổi `document.title`, tuyệt đối không đụng `canonical` hay `og:url` —
 * xem ghi chú "ĐÃ GỠ" trong index.html. Hai thứ đó khác nhau: tiêu đề là thứ
 * người dùng thấy trên tab và trong dấu trang, còn canonical là tuyên bố với
 * cỗ máy tìm kiếm về địa chỉ chuẩn của nội dung, ghi đè lúc chạy sẽ tự làm
 * loãng tín hiệu xếp hạng.
 *
 * @param {{tab: string, itemId: string|null}} route
 * @param {string} [itemLabel] Tên mục đang mở, nơi gọi tra từ dữ liệu.
 */
export function buildDocumentTitle(route, itemLabel) {
  const tab = TAB_SEGMENTS[route?.tab] ? route.tab : HOME_ROUTE.tab;

  if (tab === 'course' && !route?.itemId) return HOME_DOCUMENT_TITLE;

  const section = TAB_TITLES[tab];
  return itemLabel ? `${itemLabel} | ${section} — ${SITE_TITLE}` : `${section} | ${SITE_TITLE}`;
}
