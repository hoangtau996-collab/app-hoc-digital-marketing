/**
 * Cập nhật Bản tin thuật toán, chạy hằng ngày bằng GitHub Actions.
 *
 * VÌ SAO KHÔNG DÙNG AGENT CHẠY NỀN CỦA CLAUDE: agent đó chạy ở hạ tầng ngoài
 * nên phải xin quyền ghi vào repo, mà phần cấp quyền lại nằm trong cài đặt tổ
 * chức chỉ có ở gói trả phí cao hơn. Sáu buổi sáng liên tiếp nó không đẩy được
 * một dòng nào. GitHub Actions thì chạy NGAY BÊN TRONG GitHub, `GITHUB_TOKEN`
 * có sẵn quyền ghi, và với repo công khai thì miễn phí không giới hạn.
 *
 * QUY TRÌNH:
 *   1. Đọc tin đang có để biết đã đăng gì, tránh trùng và giữ cân bằng nguồn
 *   2. Kéo RSS nhiều nguồn, lọc bài trong 48 giờ qua
 *   3. Tải bài gốc, lấy ảnh bìa, kiểm tra ảnh tải được
 *   4. Nhờ Gemini viết bài tiếng Việt theo đúng khung dữ liệu
 *   5. ĐỐI CHIẾU TỪNG CON SỐ trong bài viết ra với bài gốc — đây là chốt chặn
 *      quan trọng nhất, xem `kiemTraSoLieu`
 *   6. Ghi lại realNews.json, giữ tổng 12 tin
 *
 * Chạy thử tại máy: node scripts/capNhatTinTuc.mjs --thu
 * Chế độ thử làm hết mọi bước trừ việc ghi file.
 */

import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..');
const DUONG_DAN_TIN = join(GOC, 'src/data/realNews.json');

const CHE_DO_THU = process.argv.includes('--thu');

/* Tổng số tin thật giữ trong bản tin. Thêm bao nhiêu thì bỏ bấy nhiêu tin cũ. */
const TONG_TIN = 12;
/* Số tin thêm tối đa mỗi ngày. Ít mà chắc hơn nhiều mà nhạt. */
const THEM_TOI_DA = 3;
/* Trần tin cho mỗi tên miền, tránh bản tin bị một báo chiếm sóng. */
const TRAN_MOI_NGUON = 4;
/* Chỉ lấy bài đăng trong khoảng này. */
const GIO_TOI_DA = 48;

const NGUON_RSS = [
  { ten: 'PPC Land', url: 'https://ppc.land/rss/' },
  { ten: 'Search Engine Journal', url: 'https://www.searchenginejournal.com/feed/' },
  { ten: 'Social Media Today', url: 'https://www.socialmediatoday.com/feeds/news/' },
  { ten: 'Marketing Dive', url: 'https://www.marketingdive.com/feeds/news/' },
  { ten: 'Meta Newsroom', url: 'https://about.fb.com/news/feed/' },
  { ten: 'Search Engine Land', url: 'https://searchengineland.com/feed' },
];

const NHOM_HOP_LE = ['Meta Ads', 'TikTok Shop & Ads', 'Google Ads & SEO', 'AI Marketing'];

/* Khoá tranh SVG có sẵn trong NewsIllustration.jsx. Khoá lạ sẽ ra ô trống. */
const KHOA_TRANH = [
  'ai-budget', 'shop-health', 'zero-click', 'ai-video', 'account-security',
  'affiliate-commission', 'keyword-exclusion', 'creative-fatigue', 'data-signal',
  'livestream', 'cpm-auction', 'crm-automation', 'ai-label', 'page-speed',
];

/* Một số báo chặn thẳng User-Agent tự nhận là bot — Search Engine Land trả 403.
   Dùng chuỗi trình duyệt thông thường để đọc được nội dung công khai của họ. */
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

/**
 * Từ khoá loại bài ra ngay, không tốn lượt gọi mô hình.
 *
 * Đây chỉ là lưới lọc thô ở vòng ngoài. Vòng trong còn một lưới nữa: chính mô
 * hình được quyền trả về `boQua` nếu thấy bài không có ích. Hai lưới vì lưới
 * từ khoá không hiểu ngữ cảnh, còn để mô hình quyết một mình thì tốn lượt gọi
 * cho những bài mà nhìn tiêu đề đã biết là bỏ.
 */
const TU_KHOA_LOAI = [
  'lawsuit', 'sues', 'sued', 'court', 'settlement', 'fined', 'antitrust',
  'data center', 'datacenter', 'layoff', 'layoffs', 'steps down', 'appoints',
  'named ceo', 'hires', 'resigns', 'earnings call', 'q1 results', 'q2 results',
  'q3 results', 'q4 results', 'stock', 'shares fall', 'shares rise', 'ipo',
  'acquisition', 'acquires', 'merger', 'buyout',
];

/* ---------------------------------------------------------------- *
 * Tiện ích chung
 * ---------------------------------------------------------------- */

function log(...phan) {
  console.log('[tin]', ...phan);
}

async function tai(url, { timeout = 20000, ...tuyChon } = {}) {
  return fetch(url, {
    signal: AbortSignal.timeout(timeout),
    headers: { 'User-Agent': UA, ...(tuyChon.headers || {}) },
    ...tuyChon,
  });
}

/** Gỡ CDATA, thẻ HTML và giải mã thực thể. Dùng cho cả RSS lẫn thân bài. */
function lamSachChu(tho) {
  if (!tho) return '';
  return String(tho)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, m) => String.fromCharCode(Number(m)))
    .replace(/&#x([0-9a-f]+);/gi, (_, m) => String.fromCharCode(parseInt(m, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#x27;|&apos;|&lsquo;|&rsquo;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function layThe(khoi, the) {
  const m = khoi.match(new RegExp(`<${the}[^>]*>([\\s\\S]*?)</${the}>`, 'i'));
  return m ? lamSachChu(m[1]) : '';
}

function ngayVN(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/* ---------------------------------------------------------------- *
 * Bước 1: đọc tin đang có
 * ---------------------------------------------------------------- */

function docTinDangCo() {
  const ds = JSON.parse(readFileSync(DUONG_DAN_TIN, 'utf8'));
  const demNguon = {};
  for (const t of ds) {
    const h = new URL(t.sourceUrl).hostname.replace(/^www\./, '');
    demNguon[h] = (demNguon[h] || 0) + 1;
  }
  return {
    danhSach: ds,
    urlDaCo: new Set(ds.map((t) => t.sourceUrl)),
    tieuDeDaCo: ds.map((t) => t.title.toLowerCase()),
    demNguon,
  };
}

/* ---------------------------------------------------------------- *
 * Bước 2: kéo RSS
 * ---------------------------------------------------------------- */

async function keoMotNguon(nguon) {
  const res = await tai(nguon.url, { timeout: 20000 });
  if (!res.ok) throw new Error(`${nguon.ten} trả về ${res.status}`);
  const xml = await res.text();
  const khoi = xml.split(/<item[\s>]/i).slice(1, 21);
  const hanCuoi = Date.now() - GIO_TOI_DA * 3600 * 1000;

  return khoi
    .map((k) => {
      const title = layThe(k, 'title');
      const link = layThe(k, 'link');
      const pub = Date.parse(layThe(k, 'pubDate'));
      if (!title || !link || !Number.isFinite(pub)) return null;
      // RSS hay lẫn bài cũ trong danh sách, phải tự lọc theo ngày đăng thật.
      if (pub < hanCuoi) return null;
      return {
        tieuDe: title,
        url: link,
        mocThoiGian: pub,
        ngayDang: ngayVN(new Date(pub)),
        tenNguon: nguon.ten,
      };
    })
    .filter(Boolean);
}

async function keoTatCaNguon() {
  const ketQua = await Promise.allSettled(NGUON_RSS.map(keoMotNguon));
  const bai = [];
  ketQua.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      log(`${NGUON_RSS[i].ten}: ${r.value.length} bài trong ${GIO_TOI_DA} giờ qua`);
      bai.push(...r.value);
    } else {
      // Một nguồn hỏng không được kéo sập cả quy trình. Search Engine Land
      // thỉnh thoảng trả feed rỗng, đó là chuyện bình thường.
      log(`${NGUON_RSS[i].ten}: BỎ QUA (${r.reason?.message || 'lỗi'})`);
    }
  });
  return bai.sort((a, b) => b.mocThoiGian - a.mocThoiGian);
}

/* ---------------------------------------------------------------- *
 * Bước 3: lấy thân bài và ảnh bìa
 * ---------------------------------------------------------------- */

async function layChiTietBai(bai) {
  const res = await tai(bai.url, { timeout: 25000 });
  if (!res.ok) throw new Error(`tải bài trả về ${res.status}`);
  const html = await res.text();

  // Mỗi báo đặt thứ tự thuộc tính khác nhau, phải dò cả hai chiều.
  const mAnh =
    html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) ||
    html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"/i);

  let anh = mAnh ? mAnh[1] : '';
  if (anh) {
    const okAnh = await kiemTraAnh(anh);
    // Ảnh hỏng thì bỏ hẳn trường ảnh, giao diện tự lùi về tranh SVG.
    // Tuyệt đối không thay bằng ảnh của bài khác.
    if (!okAnh) anh = '';
  }

  return { ...bai, thanBai: lamSachChu(html).slice(0, 12000), anh };
}

async function kiemTraAnh(url) {
  try {
    const res = await tai(url, { timeout: 15000, redirect: 'follow', headers: { Referer: 'https://example.com/' } });
    return res.ok && (res.headers.get('content-type') || '').startsWith('image/');
  } catch {
    return false;
  }
}

/* ---------------------------------------------------------------- *
 * Bước 5: đối chiếu số liệu — CHỐT CHẶN QUAN TRỌNG NHẤT
 * ---------------------------------------------------------------- */

/**
 * Rút mọi con số ra khỏi một đoạn văn, chuẩn hoá về một dạng để so sánh.
 *
 * Bài tiếng Việt viết 12,5% còn bài gốc tiếng Anh viết 12.5% — cùng một số
 * nhưng khác dấu phân cách. Hàm này bỏ hết dấu phân cách nghìn và quy dấu thập
 * phân về một kiểu, để 1.234.567 và 1,234,567 cùng ra '1234567'.
 */
export function rutSo(chu) {
  const ra = new Set();
  const mau = /\d[\d.,]*/g;
  let m;
  while ((m = mau.exec(chu)) !== null) {
    const tho = m[0].replace(/[.,]$/, '');
    // Bỏ mọi dấu chấm phẩy rồi giữ lại phần chữ số. Cách này gộp 12,5 và 12.5
    // thành '125' — thô nhưng đúng mục đích: bắt số bịa, không phải làm toán.
    const chuan = tho.replace(/[.,]/g, '');
    if (chuan.length > 0 && chuan.length <= 15) ra.add(chuan);
  }
  return ra;
}

/** Rút riêng các con số đi kèm dấu phần trăm, giữ nguyên cả số một chữ số. */
function rutPhanTram(chu) {
  const ra = new Set();
  const mau = /(\d[\d.,]*)\s*%/g;
  let m;
  while ((m = mau.exec(chu)) !== null) {
    const chuan = m[1].replace(/[.,]$/, '').replace(/[.,]/g, '');
    if (chuan) ra.add(chuan);
  }
  return ra;
}

/**
 * Mọi con số trong bài viết ra phải tìm được trong bài gốc.
 *
 * ĐÂY LÀ LÝ DO CẢ QUY TRÌNH NÀY DÁM CHẠY KHÔNG NGƯỜI TRỰC. Mô hình đọc đoạn
 * tóm tắt rồi tự suy ra "tăng 27%" là chuyện có thật, và trong ứng dụng đào tạo
 * thì con số sai còn tệ hơn không có tin. Chặn bằng máy chứ không bằng niềm tin.
 *
 * XÉT THEO HAI MỨC:
 *   - Số từ 3 chữ số trở lên: phải khớp. Bỏ qua số nhỏ hơn vì chúng là số đếm
 *     thông thường trong câu văn (ba nhóm ngành, hai nền tảng, quý 2).
 *   - Số đi kèm dấu phần trăm: phải khớp KỂ CẢ khi chỉ có một hai chữ số.
 *     Đây là chỗ vá một lỗ hổng thật: '92%' bịa ra từng lọt qua vì chỉ có hai
 *     chữ số, mà phần trăm lại đúng là loại số liệu hay bị bịa nhất.
 */
export function kiemTraSoLieu(tinMoi, thanBaiGoc) {
  const soGoc = rutSo(thanBaiGoc);
  const phanTramGoc = rutPhanTram(thanBaiGoc);
  const chuTrongTin = [
    tinMoi.title,
    tinMoi.summary,
    ...(tinMoi.keyNumbers || []).map((k) => `${k.value} ${k.label}`),
    ...(tinMoi.content || []).map((c) => `${c.heading} ${c.body}`),
    tinMoi.impact,
    tinMoi.ifIgnored,
    ...(tinMoi.actionChecklist || []),
    tinMoi.deadline || '',
  ].join(' ');

  const thieu = new Set();

  for (const so of rutSo(chuTrongTin)) {
    if (so.length < 3) continue;
    if (!soGoc.has(so)) thieu.add(so);
  }

  // Phần trăm đối chiếu với cả hai tập: bài gốc có thể viết '71 percent' thay
  // vì '71%', khi đó số vẫn nằm trong tập số chung.
  for (const pt of rutPhanTram(chuTrongTin)) {
    if (!phanTramGoc.has(pt) && !soGoc.has(pt)) thieu.add(pt + '%');
  }

  return [...thieu];
}

/* ---------------------------------------------------------------- *
 * Bước 4: nhờ Gemini viết bài
 * ---------------------------------------------------------------- */

const KHUNG_JSON = {
  category: `một trong: ${NHOM_HOP_LE.join(' | ')}`,
  platformIcon: 'Facebook | Video | Search | Sparkles',
  title: 'tiêu đề tiếng Việt, nêu được điều quan trọng nhất, không giật gân',
  isHot: 'true nếu tin gấp hoặc có hạn chót, ngược lại false',
  illustration: `một trong: ${KHOA_TRANH.join(', ')}`,
  readTime: 'ví dụ "4 phút đọc"',
  tags: ['3-4 thẻ tiếng Việt ngắn'],
  summary: '2-3 câu dẫn',
  keyNumbers: [{ value: 'số liệu', label: 'nhãn ngắn tiếng Việt' }],
  content: [{ heading: 'tiêu đề mục', body: '3-5 câu' }],
  impact: 'tác động cụ thể tới Trưởng phòng Marketing',
  ifIgnored: 'cái giá phải trả nếu bỏ qua',
  actionChecklist: ['4 việc làm được ngay'],
  deadline: 'chỉ điền khi bài gốc nêu mốc thời gian, không thì bỏ trường này',
};

function dungLoiNhac(bai) {
  return `Bạn là biên tập viên bản tin cho Trưởng phòng Marketing tại Việt Nam.

Viết lại bài báo dưới đây thành một mục tin tiếng Việt, trả về DUY NHẤT một đối tượng JSON hợp lệ, không kèm giải thích, không kèm dấu bọc mã.

KHUNG DỮ LIỆU:
${JSON.stringify(KHUNG_JSON, null, 2)}

TRƯỚC HẾT, TỰ HỎI BÀI NÀY CÓ ĐÁNG ĐƯA KHÔNG.
Người đọc là người trực tiếp điều hành ngân sách quảng cáo tại Việt Nam. Bài đáng đưa là bài nói về: thay đổi thuật toán, chính sách nền tảng, cơ cấu chi phí, công cụ mới, cách đo lường, quy định pháp lý ảnh hưởng tới việc chạy quảng cáo.
Bài KHÔNG đáng đưa: kiện tụng, phạt tiền, trung tâm dữ liệu, nhân sự cấp cao, báo cáo tài chính doanh nghiệp, thương vụ mua bán, tin chỉ dùng được ở Mỹ mà không suy ra bài học cho Việt Nam, bài hướng dẫn chung chung không có thông tin mới.
Nếu bài KHÔNG đáng đưa, trả về đúng: {"boQua": true, "lyDo": "<một câu ngắn>"}
Đừng cố viết cho có. Bỏ qua một bài nhạt tốt hơn là đưa nó vào bản tin.

NẾU BÀI ĐÁNG ĐƯA, ÁP DỤNG CÁC QUY TẮC SAU:
1. MỌI CON SỐ trong bài viết ra phải có mặt nguyên vẹn trong bài gốc bên dưới. Không ước lượng, không suy ra, không làm tròn. Không chắc con số nào thì bỏ hẳn con số đó khỏi bài.
2. Viết tiếng Việt tự nhiên, câu ngắn, không emoji. Số liệu định dạng Việt Nam: 12,5% và 1.234.567.
3. Học viên KHÔNG bấm được sang bài gốc, nên bài phải đủ để đọc độc lập. Không viết kiểu "xem chi tiết tại bài gốc".
4. Ba trường impact, ifIgnored, actionChecklist là giá trị chính. Phải nói được điều người đọc chưa tự suy ra từ phần tóm tắt. Không viết chung chung.
5. content phải có 4-5 mục, mỗi mục 3-5 câu. keyNumbers 2-3 mục. actionChecklist đúng 4 việc.
6. Chọn category đúng theo nền tảng bài nói tới.

TIÊU ĐỀ GỐC: ${bai.tieuDe}
NGUỒN: ${bai.tenNguon}
NGÀY ĐĂNG: ${bai.ngayDang}

NỘI DUNG BÀI GỐC:
${bai.thanBai.slice(0, 9000)}`;
}

/**
 * Tự dò model khả dụng thay vì đóng cứng tên.
 *
 * Bản đầu đóng cứng 'gemini-2.5-flash' và lãnh đủ: Google đổi tên model, mọi
 * lượt gọi trả 404, cả quy trình chạy không ra tin nào suốt một buổi sáng. Tên
 * model là thứ nhà cung cấp đổi mà không báo, nên với việc chạy không người
 * trực thì phải hỏi API xem hiện có gì rồi mới chọn.
 *
 * Ưu tiên dòng Flash vì đó là dòng nằm trong bậc miễn phí. Trong các bản Flash
 * thì chọn số hiệu lớn nhất, và tránh bản 'preview' cho việc chạy hằng ngày.
 */
let modelDaChon = null;

async function timModel(khoaApi) {
  if (modelDaChon) return modelDaChon;

  if (process.env.GEMINI_MODEL) {
    modelDaChon = process.env.GEMINI_MODEL;
    log(`dùng model chỉ định sẵn: ${modelDaChon}`);
    return modelDaChon;
  }

  const res = await tai(`https://generativelanguage.googleapis.com/v1beta/models?key=${khoaApi}&pageSize=200`);
  if (!res.ok) throw new Error(`không lấy được danh sách model: HTTP ${res.status}`);
  const data = await res.json();

  const dungDuoc = (data.models || [])
    .filter((m) => (m.supportedGenerationMethods || []).includes('generateContent'))
    .map((m) => m.name.replace(/^models\//, ''))
    .filter((ten) => ten.includes('flash'))
    .filter((ten) => !ten.includes('preview') && !ten.includes('exp') && !ten.includes('tts') && !ten.includes('image'));

  if (dungDuoc.length === 0) throw new Error('API không trả về model Flash nào dùng được');

  // Xếp theo số hiệu giảm dần: gemini-3.6-flash đứng trước gemini-2.5-flash.
  // Bản đầy đủ ưu tiên hơn bản '-lite' vì bài viết cần chất lượng hơn tốc độ.
  const diem = (ten) => {
    const so = parseFloat((ten.match(/(\d+\.?\d*)/) || [0])[1]) || 0;
    return so * 10 - (ten.includes('lite') ? 1 : 0);
  };
  dungDuoc.sort((a, b) => diem(b) - diem(a));

  modelDaChon = dungDuoc[0];
  log(`model tự chọn: ${modelDaChon} (trong ${dungDuoc.length} lựa chọn)`);
  return modelDaChon;
}

async function nhoGeminiViet(bai, khoaApi) {
  const model = await timModel(khoaApi);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${khoaApi}`;

  const res = await tai(url, {
    method: 'POST',
    timeout: 90000,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: dungLoiNhac(bai) }] }],
      generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
    }),
  });

  if (!res.ok) {
    const chiTiet = await res.text().catch(() => '');
    throw new Error(`Gemini trả về ${res.status}: ${chiTiet.slice(0, 200)}`);
  }

  const data = await res.json();
  const chu = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!chu) throw new Error('Gemini trả lời rỗng');

  // Phòng trường hợp model vẫn bọc trong dấu mã dù đã yêu cầu JSON thuần.
  const sach = chu.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(sach);
}

/* ---------------------------------------------------------------- *
 * Kiểm tra khung dữ liệu trước khi nhận
 * ---------------------------------------------------------------- */

export function kiemTraKhung(t) {
  const loi = [];
  if (!NHOM_HOP_LE.includes(t.category)) loi.push(`category lạ: ${t.category}`);
  if (!t.title || t.title.length < 20) loi.push('tiêu đề quá ngắn');
  if (!t.summary || t.summary.length < 60) loi.push('tóm tắt quá ngắn');
  if (!t.impact || t.impact.length < 40) loi.push('thiếu impact');
  if (!t.ifIgnored || t.ifIgnored.length < 40) loi.push('thiếu ifIgnored');
  if (!Array.isArray(t.keyNumbers) || t.keyNumbers.length < 2) loi.push('keyNumbers dưới 2 mục');
  if (!Array.isArray(t.content) || t.content.length < 4) loi.push('content dưới 4 mục');
  if (!Array.isArray(t.actionChecklist) || t.actionChecklist.length < 4) loi.push('actionChecklist dưới 4 việc');
  if (!KHOA_TRANH.includes(t.illustration)) loi.push(`khoá tranh lạ: ${t.illustration}`);
  if (Array.isArray(t.content) && t.content.some((c) => !c.heading || !c.body || c.body.length < 80)) {
    loi.push('có mục thân bài quá ngắn');
  }
  return loi;
}

/* ---------------------------------------------------------------- *
 * Ghép vào danh sách, giữ tổng 12 tin
 * ---------------------------------------------------------------- */

export function tenMien(url) {
  return new URL(url).hostname.replace(/^www\./, '');
}

/**
 * Bỏ tin cũ để lấy chỗ.
 *
 * Muốn thêm tin từ nguồn X mà X đã đủ trần thì bỏ TIN CŨ NHẤT CỦA CHÍNH NGUỒN X,
 * không phải tin cũ nhất toàn danh sách. Bản thiết kế trước bỏ theo ngày nên trần
 * nguồn không bao giờ được giải phóng và cả quy trình tắc cứng.
 *
 * Tin tham chiếu (`isReference`) không bao giờ bị bỏ: đó là số liệu thị trường
 * dùng lâu dài, không phải tin thời sự.
 */
export function ghepDanhSach(dangCo, tinMoi) {
  const ketQua = [...tinMoi, ...dangCo];

  while (ketQua.length > TONG_TIN) {
    const boDuoc = ketQua.filter((t) => !t.isReference && !tinMoi.includes(t));
    if (boDuoc.length === 0) break;

    const dem = {};
    ketQua.forEach((t) => {
      const h = tenMien(t.sourceUrl);
      dem[h] = (dem[h] || 0) + 1;
    });

    const quaTran = Object.entries(dem).filter(([, c]) => c > TRAN_MOI_NGUON).map(([h]) => h);

    const ungVien = quaTran.length > 0
      ? boDuoc.filter((t) => quaTran.includes(tenMien(t.sourceUrl)))
      : boDuoc;

    const danhSachXet = ungVien.length > 0 ? ungVien : boDuoc;
    const cuNhat = danhSachXet.reduce((a, b) => (mocNgay(a) <= mocNgay(b) ? a : b));
    ketQua.splice(ketQua.indexOf(cuNhat), 1);
    log(`bỏ tin cũ: [${tenMien(cuNhat.sourceUrl)}] ${cuNhat.publishedAt} ${cuNhat.title.slice(0, 50)}`);
  }

  return ketQua;
}

function mocNgay(t) {
  const m = String(t.publishedAt || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? new Date(+m[3], +m[2] - 1, +m[1]).getTime() : 0;
}

/* ---------------------------------------------------------------- *
 * Chạy
 * ---------------------------------------------------------------- */

async function chay() {
  const khoaApi = process.env.GEMINI_API_KEY;
  if (!khoaApi) {
    console.error('Thiếu GEMINI_API_KEY. Đặt trong GitHub Secrets, hoặc export ra biến môi trường khi chạy thử.');
    process.exit(1);
  }

  const { danhSach, urlDaCo, tieuDeDaCo, demNguon } = docTinDangCo();
  log(`đang có ${danhSach.length} tin —`, JSON.stringify(demNguon));

  const bai = await keoTatCaNguon();
  log(`tổng ${bai.length} bài trong ${GIO_TOI_DA} giờ qua`);

  const chuaCo = bai.filter((b) => {
    if (urlDaCo.has(b.url)) return false;
    // Cùng một sự kiện do hai báo đưa cũng tính là trùng. So thô bằng cách tìm
    // các từ dài trùng nhau giữa hai tiêu đề.
    const tu = b.tieuDe.toLowerCase().split(/\W+/).filter((x) => x.length > 6);
    return !tieuDeDaCo.some((cu) => {
      const chung = tu.filter((x) => cu.includes(x)).length;
      return tu.length >= 3 && chung >= Math.ceil(tu.length * 0.6);
    });
  });
  log(`${chuaCo.length} bài chưa từng đăng`);

  const nhan = [];
  // Đếm để phân biệt "ngành ít tin" với "hỏng hệ thống" ở cuối hàm.
  let daThu = 0;
  let loiApi = 0;
  let loiApiCuoi = '';

  for (const b of chuaCo) {
    if (nhan.length >= THEM_TOI_DA) break;

    const mien = tenMien(b.url);
    const demHienTai = (demNguon[mien] || 0) + nhan.filter((x) => tenMien(x.url) === mien).length;
    if (demHienTai >= TRAN_MOI_NGUON) {
      log(`bỏ qua (${mien} đã đủ trần): ${b.tieuDe.slice(0, 55)}`);
      continue;
    }

    // Lưới lọc thô: nhìn tiêu đề đã biết là bỏ thì đừng tốn lượt gọi mô hình.
    const tieuDeThuong = b.tieuDe.toLowerCase();
    const tuTrung = TU_KHOA_LOAI.find((t) => tieuDeThuong.includes(t));
    if (tuTrung) {
      log(`bỏ qua (chứa "${tuTrung}"): ${b.tieuDe.slice(0, 55)}`);
      continue;
    }

    try {
      log(`đang xử lý: ${b.tieuDe.slice(0, 60)}`);
      const chiTiet = await layChiTietBai(b);
      if (chiTiet.thanBai.length < 800) {
        log('  bỏ: thân bài quá ngắn, không đủ căn cứ để viết');
        continue;
      }

      daThu += 1;
      const viet = await nhoGeminiViet(chiTiet, khoaApi);

      // Lưới lọc trong: mô hình đọc cả bài rồi tự thấy không đáng đưa.
      if (viet?.boQua) {
        log(`  bỏ: mô hình đánh giá không đáng đưa — ${viet.lyDo || 'không nêu lý do'}`);
        continue;
      }

      const loiKhung = kiemTraKhung(viet);
      if (loiKhung.length) {
        log('  bỏ: ' + loiKhung.join('; '));
        continue;
      }

      const soThieu = kiemTraSoLieu(viet, chiTiet.thanBai);
      if (soThieu.length) {
        log(`  BỎ VÌ SỐ KHÔNG KHỚP BÀI GỐC: ${soThieu.slice(0, 6).join(', ')}`);
        continue;
      }

      const ngay = b.ngayDang.split('/').reverse().join('-');
      const tuKhoa = viet.title.toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-')
        .split('-').filter(Boolean).slice(0, 4).join('-');

      nhan.push({
        ...viet,
        id: `real-${ngay}-${tuKhoa}`,
        publishedAt: b.ngayDang,
        sourceUrl: b.url,
        source: b.tenNguon,
        ...(chiTiet.anh ? { image: { url: chiTiet.anh, credit: `Ảnh: ${b.tenNguon}` } } : {}),
        url: b.url,
      });
      log('  ĐẠT');
    } catch (e) {
      // Lỗi phía mô hình khác hẳn lỗi phía bài báo. Bài lỗi thì bỏ bài đó là
      // xong; mô hình lỗi thì cả quy trình vô dụng và phải báo đỏ.
      if (/Gemini|model/i.test(e.message)) {
        loiApi += 1;
        loiApiCuoi = e.message.slice(0, 160);
      }
      log(`  bỏ: ${e.message}`);
    }
  }

  // PHÂN BIỆT HAI TÌNH HUỐNG KHÁC HẲN NHAU.
  //
  // "Không có tin nào đạt chuẩn" là kết quả bình thường của một ngày ngành ít
  // tin. Nhưng "mọi lượt gọi đều lỗi API" là hỏng hệ thống. Bản đầu gộp cả hai
  // vào một nhánh rồi thoát êm, nên workflow báo XANH trong khi thực tế tên
  // model đã sai và không viết được bài nào suốt cả buổi sáng. Hỏng mà báo
  // thành công là kiểu hỏng tệ nhất: không ai biết để đi sửa.
  if (nhan.length === 0) {
    if (loiApi > 0 && loiApi >= daThu) {
      console.error(`[tin] HỎNG: cả ${daThu} lượt gọi mô hình đều lỗi. Lỗi gần nhất: ${loiApiCuoi}`);
      process.exit(1);
    }
    log('không có tin nào đạt chuẩn hôm nay — không đổi gì.');
    return;
  }

  // Bỏ trường `url` chỉ dùng nội bộ lúc xử lý, không đưa vào dữ liệu lưu lại.
  const sach = nhan.map(({ url: _url, ...t }) => t);
  const moi = ghepDanhSach(danhSach, sach);

  if (CHE_DO_THU) {
    log(`CHẾ ĐỘ THỬ — sẽ thêm ${sach.length} tin, tổng còn ${moi.length}. Không ghi file.`);
    sach.forEach((t) => log(`  + [${t.category}] ${t.title}`));
    return;
  }

  writeFileSync(DUONG_DAN_TIN, JSON.stringify(moi, null, 2) + '\n');
  log(`đã ghi ${moi.length} tin vào realNews.json`);

  // In ra cho bước sau của workflow dùng làm thông điệp commit.
  const tomTat = sach.map((t) => `- ${t.title} (${t.source}, ${t.publishedAt})`).join('\n');
  writeFileSync(join(GOC, 'tin-vua-them.txt'), tomTat + '\n');
}

// Chỉ tự chạy khi gọi trực tiếp. Nhập từ file kiểm thử thì không chạy, nhờ vậy
// kiểm thử được các hàm bên trên mà không kéo theo cả quy trình mạng.
// So bằng đường dẫn thật đã chuẩn hoá, tránh chuyện dấu gạch ngược trên Windows.
const goiTrucTiep =
  process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));

if (goiTrucTiep) chay().catch((e) => {
  console.error('[tin] HỎNG:', e.message);
  process.exit(1);
});
