import html2canvas from 'html2canvas';

/**
 * Bản dựng riêng cho việc XUẤT FILE bằng chứng nhận.
 *
 * Lý do phải tách khỏi DOM đang hiển thị: html2canvas 1.4.1 chỉ đọc được
 * rgb/rgba/hsl/hsla, trong khi Tailwind v4 sinh ra oklch() và color-mix()
 * cho gần như mọi màu. Chụp thẳng DOM Tailwind => màu bị nuốt, ra file lỗi.
 *
 * Template dưới đây dùng 100% màu hex/rgba nội tuyến, kích thước cố định
 * theo tỉ lệ A4 ngang nên file tải về luôn giống hệt nhau trên mọi thiết bị.
 */

// A4 ngang: 297 x 210 mm (tỉ lệ 1.4143)
export const CERT_WIDTH = 1400;
export const CERT_HEIGHT = 990;

const BG = '#ffffff';

let logoDataUrlCache = null;

export const isIOSorIPad = typeof navigator !== 'undefined' && (
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
);

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/** Bỏ dấu tiếng Việt để tên file không bị vỡ trên Windows/iOS. */
export function slugifyName(name) {
  const slug = String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return slug || 'HocVien';
}

/**
 * Nhúng logo thành data URL. html2canvas hay bỏ qua ảnh chưa nằm sẵn trong
 * cache của iframe clone, nên inline sẵn là chắc ăn nhất.
 */
async function getLogoDataUrl(src) {
  if (logoDataUrlCache) return logoDataUrlCache;
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img, 0, 0);
    logoDataUrlCache = c.toDataURL('image/png');
    return logoDataUrlCache;
  } catch (e) {
    // Ảnh khác origin / chặn CORS: dùng URL gốc, html2canvas vẫn có cơ hội tải được.
    return src;
  }
}

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

/** Tên dài thì thu nhỏ cỡ chữ để không tràn khung. */
function nameFontSize(name) {
  const len = name.length;
  if (len > 38) return 28;
  if (len > 30) return 34;
  if (len > 22) return 42;
  return 52;
}

function buildMarkup({ studentName, totalModules, issueDate, verifyCode, logoSrc }) {
  const name = escapeHtml(String(studentName || 'HỌC VIÊN').trim().toUpperCase());
  const fs = nameFontSize(name);

  return `
    <div style="position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,rgba(255,255,255,0) 0%,#10b981 20%,#d97706 50%,#10b981 80%,rgba(255,255,255,0) 100%);"></div>

    <div style="position:relative;width:100%;height:100%;box-sizing:border-box;padding:52px 76px 46px 76px;display:flex;flex-direction:column;align-items:center;text-align:center;">

      <!-- Hai spacer 0.55 : 1 kẹp khối nội dung, giữ nó cân giữa nhưng trọng tâm
           hơi cao — nếu không có, bỏ con dấu đi sẽ để lại một mảng trắng hoác
           giữa phần mô tả và chân bằng. -->
      <div style="flex:0.55 1 0;"></div>

      <div style="width:104px;height:104px;border-radius:24px;overflow:hidden;border:2px solid #d97706;background:#ffffff;">
        <img src="${logoSrc}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
      </div>

      <div style="margin-top:18px;display:inline-block;padding:8px 22px;border-radius:999px;background:#ecfdf5;border:1px solid #10b981;color:#047857;font-size:13px;font-weight:800;letter-spacing:3px;line-height:1;">
        &#9670;&nbsp; CERTIFICATE OF COMPLETION &nbsp;&#9670;
      </div>

      <div style="margin-top:20px;color:#b45309;font-size:23px;font-weight:800;letter-spacing:5px;line-height:1.2;white-space:nowrap;">
        CHỨNG NHẬN HOÀN THÀNH KHÓA HỌC
      </div>

      <div style="margin-top:10px;color:#047857;font-size:52px;font-weight:900;letter-spacing:1.5px;line-height:1.15;white-space:nowrap;">
        KHÓA HỌC DIGITAL THỰC CHIẾN
      </div>

      <div style="margin-top:22px;width:240px;height:2px;background:linear-gradient(90deg,rgba(255,255,255,0) 0%,#10b981 50%,rgba(255,255,255,0) 100%);"></div>

      <div style="margin-top:26px;color:#64748b;font-size:16px;font-style:italic;line-height:1.2;">
        Chứng nhận cấp cho Học viên:
      </div>

      <div style="margin-top:14px;max-width:1120px;padding:0 44px 14px 44px;border-bottom:2px solid #10b981;color:#0f172a;font-size:${fs}px;font-weight:900;letter-spacing:2px;line-height:1.25;word-break:break-word;">
        ${name}
      </div>

      <div style="margin-top:28px;max-width:1060px;color:#334155;font-size:16px;line-height:1.8;">
        Đã hoàn tất xuất sắc toàn bộ <strong style="color:#047857;font-weight:800;">${escapeHtml(totalModules)} Chuyên đề đào tạo thực chiến</strong>
        và vượt qua <strong style="color:#047857;font-weight:800;">33 bài tập kiểm tra đánh giá năng lực quản lý Digital Marketing</strong>
        tại <strong style="color:#b45309;font-weight:800;">HỌC VIỆN P MARCOM</strong>
        <span style="color:#64748b;">(Bao gồm Goals, Budgeting, Staffing, Campaign Creative, Planning &amp; Effectiveness).</span>
      </div>

      <div style="flex:1 1 0;min-height:24px;"></div>

      <div style="width:100%;padding-top:26px;border-top:1px solid #e2e8f0;display:flex;align-items:flex-end;justify-content:space-between;">

        <div style="text-align:left;">
          <div style="color:#047857;font-size:14px;font-weight:800;letter-spacing:0.5px;line-height:1.4;">
            &#9878;&nbsp; BẢO CHỨNG BỞI P MARCOM
          </div>
          <div style="margin-top:7px;color:#64748b;font-size:14px;line-height:1.6;">
            Mã xác thực: <strong style="color:#0f172a;font-weight:800;">${escapeHtml(verifyCode)}</strong>
          </div>
          <div style="color:#64748b;font-size:14px;line-height:1.6;">
            Ngày cấp: <strong style="color:#0f172a;font-weight:800;">${escapeHtml(issueDate)}</strong>
          </div>
        </div>

        <div style="text-align:right;">
          <div style="color:#b45309;font-size:12px;font-weight:800;letter-spacing:2.5px;line-height:1.4;">
            HỘI ĐỒNG THẨM ĐỊNH ACADEMY
          </div>
          <div style="margin-top:8px;display:inline-block;padding:0 12px 8px 12px;border-bottom:1px solid #d97706;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-weight:700;font-size:32px;color:#b45309;line-height:1.25;">
            Lê Thành Phong
          </div>
          <div style="margin-top:9px;color:#0f172a;font-size:14px;font-weight:800;letter-spacing:1.5px;line-height:1.4;">
            LÊ THÀNH PHONG
          </div>
          <div style="margin-top:2px;color:#047857;font-size:13px;font-weight:700;line-height:1.4;">
            Founder &amp; CEO Lê Thành Phong
          </div>
        </div>

      </div>
    </div>
  `;
}

/**
 * Dựng bằng ngoài màn hình rồi chụp lại ở độ phân giải cao.
 * Trả về <canvas> đúng tỉ lệ A4 ngang, không phụ thuộc kích thước trình duyệt.
 */
export async function renderCertificateCanvas({
  studentName,
  totalModules,
  issueDate,
  verifyCode = makeVerifyCode(studentName),
  logoSrc = '/pmarcom-logo.jpg',
  scale = isIOSorIPad ? 2 : 3,
} = {}) {
  const logo = await getLogoDataUrl(logoSrc);

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
    `width:${CERT_WIDTH}px`,
    `height:${CERT_HEIGHT}px`,
    `background:${BG}`,
    'border:1px solid #e2e8f0',
    'border-radius:24px',
    'overflow:hidden',
    'box-sizing:border-box',
    "font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
    'color:#0f172a',
    'pointer-events:none',
    'z-index:-1',
  ].join(';');
  node.innerHTML = buildMarkup({ studentName, totalModules, issueDate, verifyCode, logoSrc: logo });

  document.body.appendChild(node);
  try {
    return await html2canvas(node, {
      scale,
      backgroundColor: BG,
      useCORS: true,
      allowTaint: false,
      logging: false,
      width: CERT_WIDTH,
      height: CERT_HEIGHT,
      windowWidth: CERT_WIDTH,
      windowHeight: CERT_HEIGHT,
      scrollX: 0,
      scrollY: 0,
    });
  } finally {
    node.remove();
  }
}
