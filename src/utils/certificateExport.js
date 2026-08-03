import html2canvas from 'html2canvas';

/**
 * Dựng file bằng chứng nhận P MARCOM ACADEMY.
 *
 * Toàn bộ phần đồ hoạ — khung viền vàng, logo, huy hiệu, con dấu công ty và chữ
 * ký Founder — nằm sẵn trong file ảnh template `public/cert-template.jpg`.
 * Code ở đây CHỈ phủ 4 thông tin động lên trên: họ tên học viên, tên khoá học,
 * ngày cấp và mã xác thực.
 *
 * Cố ý không dựng lại đồ hoạ bằng CSS như bản trước:
 *  - logo / huy hiệu / con dấu / chữ ký là tài sản thương hiệu, không vẽ lại;
 *  - html2canvas 1.4.1 dựng SVG và radial-gradient rất kém, hoạ tiết hay mất nét.
 *
 * Đánh đổi: template BẮT BUỘC phải là file ảnh có thật trong `public/`. Thiếu
 * file thì hàm render ném lỗi có thông báo rõ ràng, thay vì âm thầm xuất ra một
 * tấm bằng trắng trơn.
 */

/** Template dùng chung cho MỌI khoá học. Đổi mẫu bằng = thay đúng file này. */
export const CERT_TEMPLATE_SRC = '/cert-template.jpg';

/** Bề ngang khung dựng (px). Chiều cao suy ra từ tỉ lệ thật của file template. */
export const CERT_WIDTH = 1400;

export const isIOSorIPad = typeof navigator !== 'undefined' && (
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
);

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// Dấu thanh/dấu phụ tiếng Việt sau khi normalize('NFD'). Viết bằng RegExp +
// chuỗi escape thay vì regex literal: đặt thẳng ký tự tổ hợp vào source sẽ ra
// một dải ký tự vô hình, editor hoặc công cụ format rất dễ làm hỏng.
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

/** Bỏ dấu tiếng Việt để tên file không bị vỡ trên Windows/iOS. */
export function slugifyName(name) {
  const slug = String(name || '')
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return slug || 'HocVien';
}

/* ==========================================================================
   TOẠ ĐỘ CÁC Ô CHỮ ĐỘNG  —  sửa bố cục thì sửa DUY NHẤT ở khối này
   ==========================================================================
   Mọi con số là TỈ LỆ 0..1 so với kích thước tấm bằng, đo trên file template
   gốc. Dùng tỉ lệ chứ không dùng px để bản xem trước (khung hẹp) và file xuất
   (khung 1400px) ăn chung một bộ số, không thể lệch nhau.

     left / right : mép trái, mép phải của ô chữ (chữ căn giữa trong ô này)
     baseline     : đáy chữ — canh sát ngay TRÊN nét kẻ chấm in sẵn của template
     size         : cỡ chữ, tính theo phần trăm CHIỀU CAO tấm bằng
     maxShrink    : tên/tên khoá quá dài thì được thu nhỏ tối đa còn bao nhiêu

   Nếu chữ bị lệch so với nét kẻ chấm: chỉnh `baseline` (xuống = tăng số),
   chỉnh `left`/`right` để dịch ngang. Không cần đụng vào phần code bên dưới.
*/
// Màu lấy từ chính file template (lấy trung bình vùng phẳng của ruy băng và
// đường cong đỏ), không phải bảng màu tự chọn.
const MAROON = '#6b1b22';   // đỏ mận của ruy băng — dùng cho tên học viên
const INK = '#4a4441';      // xám ấm, cùng tông với các dòng chữ in sẵn
const MUTED = '#9a9086';    // xám nhạt, dành cho mã xác thực

const SERIF = "Georgia,'Times New Roman','Noto Serif',serif";
const SANS = "'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";

/*
  Số đo lấy bằng cách quét pixel trên file template 4200×3150, không ước lượng
  bằng mắt. Vị trí thật của các nét kẻ chấm in sẵn:
    - nét kẻ họ tên   : y=1820,  x=415..2532
    - nét kẻ tên khoá : y=2175,  x=415..2532
    - nét kẻ ngày cấp : y=2732,  x=233..843
  `baseline` đặt cao hơn nét kẻ vài chục px để chữ ngồi trên nét, không đè lên.
*/
export const CERT_LAYOUT = {
  // Nét kẻ chấm thứ nhất — dưới "THIS CERTIFICATE IS PROUDLY PRESENTED TO"
  name: {
    left: 0.0988, right: 0.6029, baseline: 0.5676,
    size: 0.038, letterSpacing: 0.04,
    family: SERIF, weight: 700, color: MAROON, maxShrink: 0.5,
  },
  // Nét kẻ chấm thứ hai — dưới "FOR SUCCESSFULLY COMPLETING THE COURSE"
  course: {
    left: 0.0988, right: 0.6029, baseline: 0.6822,
    size: 0.023, letterSpacing: 0.06,
    family: SANS, weight: 700, color: INK, maxShrink: 0.55,
  },
  // Nét kẻ chấm dưới nhãn "DATE" ở chân bằng
  date: {
    left: 0.0555, right: 0.2007, baseline: 0.8610,
    size: 0.0165, letterSpacing: 0.02,
    family: SANS, weight: 600, color: INK, maxShrink: 0.7,
  },
  // Mã xác thực: in nhỏ, căn trái, ngay dưới nét kẻ ngày cấp.
  // Vùng này trống tới tận khung viền vàng nên không đè vào chữ ký/con dấu.
  code: {
    left: 0.0555, right: 0.3200, baseline: 0.8984, align: 'left',
    size: 0.0108, letterSpacing: 0.05,
    family: SANS, weight: 600, color: MUTED, maxShrink: 0.8,
  },
};

// Bảng chữ Crockford Base32 (bỏ I, L, O, U) để mã đọc/đánh máy lại không bị nhầm.
const CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function fnv1a(str, seed) {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Mã xác thực riêng cho từng học viên, sinh theo hàm băm nên:
 *  - mỗi người một mã khác nhau,
 *  - cùng một người tải lại bao nhiêu lần vẫn ra đúng mã cũ.
 *
 * Nên truyền seed là email/ID tài khoản để mã không đổi khi học viên sửa lại họ tên.
 */
export function makeVerifyCode(seed, year = new Date().getFullYear()) {
  const norm = String(seed || 'hoc-vien').trim().toLowerCase().replace(/\s+/g, ' ');
  const a = fnv1a(norm, 0x811c9dc5);
  const b = fnv1a(`${norm}|pmarcom`, 0x9dc5811c);

  let out = '';
  for (let i = 0; i < 4; i++) out += CODE_ALPHABET[(a >>> (i * 5)) & 31];
  for (let i = 0; i < 4; i++) out += CODE_ALPHABET[(b >>> (i * 5)) & 31];

  return `PMC-${year}-${out.slice(0, 4)}-${out.slice(4)}`;
}

/**
 * Nội dung riêng của từng khoá trên tấm bằng.
 *
 * Template mới chỉ có một nét kẻ dành cho tên khoá, nên mỗi khoá chỉ cần khai
 * báo tên hiển thị và hậu tố đặt tên file. Thêm khoá thứ ba về sau: khai báo
 * thêm một mục ở đây là tự động dùng chung template, không phải sửa gì khác.
 */
export const CERTIFICATE_COURSES = {
  main: {
    key: 'main',
    title: 'KHÓA HỌC DIGITAL THỰC CHIẾN',
    fileTag: 'PMARCOM',
  },
  trade: {
    key: 'trade',
    title: 'TRADE MARKETING THỰC CHIẾN',
    fileTag: 'PMARCOM_TRADE',
  },
};

export const getCertificateCourse = (key) => CERTIFICATE_COURSES[key] || CERTIFICATE_COURSES.main;

/* ---------- Nạp file template ---------- */

let templateCache = null;

/**
 * Nạp ảnh template một lần, giữ lại kích thước thật để suy ra tỉ lệ khung dựng.
 *
 * Cố ý KHÔNG nhúng thành data URL qua canvas như cách thường làm với ảnh trong
 * html2canvas. File template là 4200×3150, mà Safari trên iOS chặn canvas có
 * cạnh quá 4096px — đẩy qua canvas là hỏng đúng nhóm iPad/iPhone mà app có hẳn
 * một nút tải riêng. Chưa kể mỗi lần dựng lại tốn thêm ~50MB bộ nhớ và một lần
 * nén JPEG chồng lên ảnh đã nén.
 *
 * Thay vào đó chỉ cần `decode()` trước: ảnh vào cache trình duyệt, nên bản sao
 * DOM mà html2canvas tạo ra lấy được ngay, không bị trắng nền. Ảnh cùng origin
 * (nằm trong public/) nên cũng không vướng CORS.
 */
async function loadTemplate(src) {
  if (templateCache && templateCache.src === src) return templateCache;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;

  try {
    await img.decode();
  } catch (e) {
    throw new Error(
      `Không đọc được file mẫu bằng chứng nhận "${src}". ` +
      'Hãy đặt file ảnh template vào thư mục public/ với đúng tên này rồi thử lại.'
    );
  }

  const width = img.naturalWidth;
  const height = img.naturalHeight;
  if (!width || !height) {
    throw new Error(`File mẫu bằng chứng nhận "${src}" bị lỗi, không đọc được kích thước.`);
  }

  templateCache = { src, width, height, ratio: width / height };
  return templateCache;
}

/* ---------- Đo và co chữ cho vừa ô ---------- */

let measureCtx = null;

/**
 * Đo bề ngang chuỗi chữ. Canvas không áp dụng letter-spacing nên phải cộng tay
 * phần giãn cách, nếu không tên dài sẽ tưởng là vừa rồi tràn ra ngoài nét kẻ.
 */
function measureText(text, { family, weight }, fontPx, letterSpacingPx) {
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
  measureCtx.font = `${weight} ${fontPx}px ${family}`;
  const gaps = Math.max(0, text.length - 1);
  return measureCtx.measureText(text).width + gaps * letterSpacingPx;
}

/**
 * Cỡ chữ và giãn cách thực tế của một ô, đã thu nhỏ nếu chữ dài hơn bề ngang ô
 * (không nhỏ hơn ngưỡng `maxShrink`).
 *
 * Xuất ra ngoài để bản xem trước trong CertificateModal dùng chung đúng phép
 * tính này với file xuất — tên dài co lại ở file tải về thì trên màn hình cũng
 * co y hệt, hai bên không thể lệch nhau.
 *
 * @param {number} boxWidthPx  bề ngang ô chữ, tính bằng px
 * @param {number} certHeightPx chiều cao tấm bằng đang dựng, tính bằng px
 */
export function certFieldMetrics(text, spec, boxWidthPx, certHeightPx) {
  const value = String(text ?? '');
  const trackingRatio = spec.letterSpacing || 0;
  const basePx = spec.size * certHeightPx;
  const minPx = basePx * (spec.maxShrink ?? 0.5);

  let fontPx = basePx;
  while (fontPx > minPx) {
    if (measureText(value, spec, fontPx, fontPx * trackingRatio) <= boxWidthPx) break;
    fontPx -= 1;
  }

  return { fontPx, letterSpacingPx: fontPx * trackingRatio };
}

/* ---------- Dựng markup ---------- */

/**
 * Một ô chữ động, định vị tuyệt đối theo tỉ lệ tấm bằng.
 *
 * Dùng `bottom` + `line-height:1` để đáy chữ bám đúng nét kẻ chấm in sẵn, thay
 * vì canh theo `top` — cỡ chữ co lại khi tên dài thì chữ vẫn nằm đúng trên nét
 * kẻ chứ không trôi lên.
 */
function textBlock(text, spec, W, H) {
  const value = String(text ?? '').trim();
  if (!value) return '';

  const boxLeft = spec.left * W;
  const boxWidth = (spec.right - spec.left) * W;
  const { fontPx, letterSpacingPx } = certFieldMetrics(value, spec, boxWidth, H);

  return `
    <div style="position:absolute;
      left:${boxLeft.toFixed(1)}px;
      width:${boxWidth.toFixed(1)}px;
      bottom:${((1 - spec.baseline) * H).toFixed(1)}px;
      text-align:${spec.align || 'center'};
      font-family:${spec.family};
      font-weight:${spec.weight};
      font-size:${fontPx.toFixed(1)}px;
      letter-spacing:${letterSpacingPx.toFixed(2)}px;
      color:${spec.color};
      line-height:1;
      white-space:nowrap;
    ">${escapeHtml(value)}</div>
  `;
}

function buildMarkup({ studentName, courseTitle, issueDate, verifyCode, templateUrl, W, H }) {
  const name = String(studentName || 'HỌC VIÊN').trim().toUpperCase();

  return `
    <img src="${templateUrl}" alt="" style="position:absolute;top:0;left:0;width:${W}px;height:${H}px;display:block;" />
    ${textBlock(name, CERT_LAYOUT.name, W, H)}
    ${textBlock(courseTitle, CERT_LAYOUT.course, W, H)}
    ${textBlock(issueDate, CERT_LAYOUT.date, W, H)}
    ${textBlock(verifyCode, CERT_LAYOUT.code, W, H)}
  `;
}

/**
 * Dựng bằng ngoài màn hình rồi chụp lại ở độ phân giải cao.
 * Trả về <canvas> đúng tỉ lệ của file template, không phụ thuộc kích thước trình duyệt.
 */
export async function renderCertificateCanvas({
  studentName,
  issueDate,
  verifyCode = makeVerifyCode(studentName),
  templateSrc = CERT_TEMPLATE_SRC,
  scale = isIOSorIPad ? 2 : 3,
  course = 'main',
} = {}) {
  const tpl = await loadTemplate(templateSrc);

  const W = CERT_WIDTH;
  const H = Math.round(CERT_WIDTH / tpl.ratio);

  // Chờ webfont để chữ không bị fallback sang font hệ thống lúc chụp.
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try { await document.fonts.ready; } catch (e) { /* không chặn việc xuất file */ }
  }

  const node = document.createElement('div');
  node.setAttribute('aria-hidden', 'true');
  node.style.cssText = [
    'position:absolute',
    'left:-20000px',
    'top:0',
    `width:${W}px`,
    `height:${H}px`,
    'background:#ffffff',
    'overflow:hidden',
    'box-sizing:border-box',
    'pointer-events:none',
    'z-index:-1',
  ].join(';');
  node.innerHTML = buildMarkup({
    studentName,
    courseTitle: getCertificateCourse(course).title,
    issueDate,
    verifyCode,
    templateUrl: tpl.src,
    W,
    H,
  });

  document.body.appendChild(node);
  try {
    return await html2canvas(node, {
      scale,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: false,
      logging: false,
      width: W,
      height: H,
      windowWidth: W,
      windowHeight: H,
      scrollX: 0,
      scrollY: 0,
    });
  } finally {
    node.remove();
  }
}
