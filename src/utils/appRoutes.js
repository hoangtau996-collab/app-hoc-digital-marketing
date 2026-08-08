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
  course: 'digital-marketing',
  trade: 'trade-marketing',
  glossary: 'thuat-ngu',
  news: 'ban-tin',
  tools: 'cong-cu',
};

const TAB_BY_SEGMENT = Object.fromEntries(
  Object.entries(TAB_SEGMENTS).map(([tab, segment]) => [segment, tab])
);

/**
 * Địa chỉ phụ: NHẬN VÀO thì hiểu, nhưng không bao giờ được sinh ra.
 *
 * Khoá chính đã đổi tên đường dẫn hai lần và CẢ HAI TÊN CŨ ĐỀU ĐÃ LÊN TRANG
 * THẬT, nên cả hai đều có thể đang nằm trong tin nhắn ai đó đã gửi đi:
 *
 *   `/chuyen-de/...`  tên đầu tiên, đặt theo tên gọi "chuyên đề" trong bài;
 *   `/khoa-hoc/...`   tên thứ hai, quá chung khi học viện có nhiều khoá —
 *                     đứng cạnh `/trade-marketing` thì không rõ là khoá nào.
 *
 * Tên hiện tại `/digital-marketing` gọi thẳng tên khoá, đối xứng với
 * `/trade-marketing`. Hai tên cũ giữ sống ở đây đúng theo nguyên tắc ghi ở đầu
 * tệp — chi phí là ba dòng, còn cái giá của việc bỏ đi là những liên kết đã
 * gửi lặng lẽ chết mà không ai biết để báo.
 */
const SEGMENT_ALIASES = {
  'chuyen-de': 'course',
  'khoa-hoc': 'course',
};

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
 * @returns {{tab: string, itemId: string|null, subId: string|null} | null}
 *   `null` nghĩa là KHÔNG NHẬN RA địa chỉ này. Cố ý phân biệt với trang chủ để
 *   nơi gọi còn dọn thanh địa chỉ: gõ nhầm `/khoahoc` mà lặng lẽ hiện trang chủ
 *   dưới đúng cái địa chỉ sai đó thì người dùng lưu dấu trang lại lần nữa, và
 *   lần sau vẫn sai.
 *
 * Đoạn thứ ba (`subId`) đọc cho MỌI khu vực chứ không riêng khoá học, dù hiện
 * chỉ khoá học dùng tới. Tầng này không biết khu vực nào có mấy tầng con —
 * việc đó thuộc về nơi nắm dữ liệu. Khu vực không dùng thì trả `subId` về null
 * ở đó, rồi `buildPath` tự dọn đoạn thừa khỏi thanh địa chỉ.
 */
export function parseRoute(pathname) {
  const parts = String(pathname || '/')
    .split('/')
    .filter(Boolean);

  if (parts.length === 0) return { ...HOME_ROUTE };

  const segment = decodeSegment(parts[0]);
  const tab = TAB_BY_SEGMENT[segment] || SEGMENT_ALIASES[segment];
  if (!tab) return null;

  return {
    tab,
    itemId: parts[1] ? decodeSegment(parts[1]) : null,
    subId: parts[2] ? decodeSegment(parts[2]) : null,
  };
}

/**
 * Dựng đường dẫn từ trạng thái điều hướng. Nghịch đảo của `parseRoute`.
 *
 * Tổng quan khoá chính ra `/digital-marketing` chứ không ra `/`, dù `/` cũng
 * mở đúng trang đó. Có hai lý do:
 *
 *   1. Khoá chính phải gọi được TÊN CỦA CHÍNH NÓ. Trả về `/` thì bấm vào tab
 *      Digital Marketing chỉ thấy tên miền trần — khoá lớn nhất của học viện
 *      thành khoá duy nhất không có gì để sao chép gửi đi.
 *   2. Địa chỉ ứng dụng SINH RA là địa chỉ chuẩn. `/` vẫn mở đúng trang và
 *      `writeHistory` bên App.jsx cố ý KHÔNG viết đè nó khi người dùng đang
 *      đứng sẵn ở đó — trang chủ giữ nguyên là trang chủ.
 *
 * Việc `/` và `/digital-marketing` cùng mở một trang không làm loãng tín hiệu
 * xếp hạng: index.html khai canonical tuyệt đối trỏ về `/`, nên cỗ máy tìm
 * kiếm gom cả hai về một mối. Đó cũng là lý do canonical phải là thẻ TĨNH —
 * xem ghi chú "ĐÃ GỠ" trong index.html.
 */
export function buildPath(route) {
  const segment = TAB_SEGMENTS[route?.tab];

  // Tab không nhận ra thì VỨT LUÔN cả `itemId` chứ không chỉ đổi tab về mặc
  // định: định danh luôn thuộc về đúng một tab, ghép nó vào tab khác chỉ tạo
  // ra thứ trông như địa chỉ thật mà không mở được gì — ví dụ `/digital-marketing/roas`.
  if (!segment) return '/';

  const itemId = route?.itemId || null;
  if (!itemId) return `/${segment}`;

  // Đoạn thứ ba chỉ được viết ra khi đã có đoạn thứ hai. `/digital-marketing//m1-s2` là
  // địa chỉ vô nghĩa: không có chuyên đề thì bài học không thuộc về đâu cả.
  const subId = route?.subId || null;
  const base = `/${segment}/${encodeURIComponent(itemId)}`;
  return subId ? `${base}/${encodeURIComponent(subId)}` : base;
}

/** Hai trạng thái điều hướng có trỏ về cùng một màn hình không. */
export function isSameRoute(a, b) {
  return (
    (a?.tab || null) === (b?.tab || null) &&
    (a?.itemId || null) === (b?.itemId || null) &&
    (a?.subId || null) === (b?.subId || null)
  );
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
