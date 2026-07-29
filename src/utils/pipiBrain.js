import { COURSE_MODULES } from '../data/courseData';
import { GLOSSARY_ITEMS } from '../data/glossaryData';
import { INDUSTRY_BENCHMARKS } from '../data/toolsData';

/**
 * Bộ não của Pipi - trợ lý tra cứu trong ứng dụng.
 *
 * Chạy hoàn toàn tại máy, KHÔNG gọi API bên ngoài. Lý do: dự án chưa cấu hình
 * khoá API cho mô hình ngôn ngữ nào, và AIStrategyAdvisor sẵn có cũng chạy
 * logic cục bộ. Pipi vì thế là trợ lý tra cứu theo luật, không phải AI sinh
 * ngôn ngữ - nó tra đúng dữ liệu có thật trong app thay vì bịa câu trả lời.
 *
 * Tách khỏi giao diện để kiểm chứng được bằng test.
 */

/* ---------- Tiện ích so khớp tiếng Việt ---------- */

export function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Đọc số kèm đơn vị tiếng Việt: "50 triệu", "1,2 tỷ", "300k", "2.500" */
export function parseNumbers(text) {
  const out = [];
  const re = /(\d[\d.,]*)\s*(ty|tỷ|trieu|triệu|nghin|nghìn|ngan|ngàn|k|tr|m)?/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    let raw = m[1];
    // "2.500" là 2500, còn "1,2" là 1.2
    if (/,/.test(raw)) raw = raw.replace(/\./g, '').replace(',', '.');
    else if (/\.\d{3}(\D|$)/.test(raw + ' ')) raw = raw.replace(/\./g, '');
    let n = parseFloat(raw);
    if (!Number.isFinite(n)) continue;
    const unit = normalize(m[2] || '');
    if (unit === 'ty') n *= 1e9;
    else if (unit === 'trieu' || unit === 'tr' || unit === 'm') n *= 1e6;
    else if (unit === 'nghin' || unit === 'ngan' || unit === 'k') n *= 1e3;
    out.push(n);
  }
  return out;
}

const vnd = (n) =>
  Number.isFinite(n) ? n.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' đ' : '—';
const num = (n, d = 2) =>
  Number.isFinite(n) ? Number(n.toFixed(d)).toLocaleString('vi-VN') : '—';

/* ---------- Máy tính chỉ số ---------- */

const CALCULATORS = [
  {
    id: 'roas',
    keys: ['roas', 'ty suat doanh thu', 'tren chi phi quang cao'],
    need: 2,
    hint: 'Ví dụ: "tính ROAS doanh thu 800 triệu chi phí 300 triệu"',
    run: ([a, b]) => {
      const [revenue, cost] = a >= b ? [a, b] : [b, a];
      const roas = revenue / cost;
      return {
        title: 'ROAS — Tỷ suất doanh thu trên chi phí quảng cáo',
        lines: [
          `Công thức: ROAS = Doanh thu ÷ Chi phí quảng cáo`,
          `${vnd(revenue)} ÷ ${vnd(cost)} = **${num(roas)}x**`,
          roas >= 3
            ? 'Mức này thường được coi là khoẻ với đa số ngành.'
            : roas >= 1
              ? 'Có lãi trên chi phí quảng cáo, nhưng cần đối chiếu biên lợi nhuận gộp mới biết lãi thật.'
              : 'Đang lỗ ngay trên chi phí quảng cáo.',
          'Lưu ý: đây là ROAS nền tảng. Đừng cộng ROAS của Meta và Google lại — sẽ bị ghi nhận trùng (Chuyên đề 10).',
        ],
      };
    },
  },
  {
    id: 'cpa',
    keys: ['cpa', 'cpl', 'cac', 'chi phi moi don', 'chi phi mot don', 'chi phi khach hang'],
    need: 2,
    hint: 'Ví dụ: "CPA chi phí 300 triệu 200 đơn"',
    run: ([a, b]) => {
      const [cost, conv] = a >= b ? [a, b] : [b, a];
      return {
        title: 'CPA / CPL — Chi phí cho mỗi chuyển đổi',
        lines: [
          'Công thức: CPA = Chi phí ÷ Số chuyển đổi',
          `${vnd(cost)} ÷ ${num(conv, 0)} = **${vnd(cost / conv)}** mỗi chuyển đổi`,
          'So sánh với lợi nhuận gộp mỗi đơn: nếu CPA vượt lợi nhuận gộp thì mỗi khách mới đang làm bạn lỗ (Chuyên đề 11).',
        ],
      };
    },
  },
  {
    id: 'ctr',
    keys: ['ctr', 'ty le nhap', 'ty le click'],
    need: 2,
    hint: 'Ví dụ: "CTR 3500 click 500000 hiển thị"',
    run: ([a, b]) => {
      const [imp, clicks] = a >= b ? [a, b] : [b, a];
      return {
        title: 'CTR — Tỷ lệ nhấp',
        lines: [
          'Công thức: CTR = Lượt bấm ÷ Lượt hiển thị × 100',
          `${num(clicks, 0)} ÷ ${num(imp, 0)} × 100 = **${num((clicks / imp) * 100)}%**`,
          'CTR thấp mà Hook Rate cao thì lỗi nằm ở lời kêu gọi hành động, không phải ở mở đầu (Chuyên đề 07).',
        ],
      };
    },
  },
  {
    id: 'cvr',
    keys: ['cvr', 'ty le chuyen doi'],
    need: 2,
    hint: 'Ví dụ: "CVR 42 đơn 3500 click"',
    run: ([a, b]) => {
      const [clicks, conv] = a >= b ? [a, b] : [b, a];
      return {
        title: 'CVR — Tỷ lệ chuyển đổi',
        lines: [
          'Công thức: CVR = Số chuyển đổi ÷ Lượt bấm × 100',
          `${num(conv, 0)} ÷ ${num(clicks, 0)} × 100 = **${num((conv / clicks) * 100)}%**`,
          'CTR tốt nhưng CVR thấp nghĩa là đứt gãy xảy ra sau cú bấm — kiểm tra trang đích (Chuyên đề 07).',
        ],
      };
    },
  },
  {
    id: 'cpm',
    keys: ['cpm', 'chi phi nghin hien thi'],
    need: 2,
    hint: 'Ví dụ: "CPM 30 triệu 500000 hiển thị"',
    run: ([a, b]) => {
      const [imp, cost] = a >= b ? [a, b] : [b, a];
      return {
        title: 'CPM — Chi phí trên 1.000 lượt hiển thị',
        lines: [
          'Công thức: CPM = Chi phí ÷ Lượt hiển thị × 1.000',
          `${vnd(cost)} ÷ ${num(imp, 0)} × 1.000 = **${vnd((cost / imp) * 1000)}**`,
        ],
      };
    },
  },
  {
    id: 'budget',
    keys: ['ngan sach', 'tinh nguoc', 'can bao nhieu tien', 'du toan'],
    need: 3,
    hint: 'Ví dụ: "ngân sách mục tiêu 3 tỷ, giá trị đơn 20 triệu, tỷ lệ chốt 12%, CPL 180k"',
    run: (nums, raw) => {
      const [revenue, aov, ...rest] = nums;
      // tỷ lệ chốt bắt từ dấu %
      const pct = (raw.match(/(\d[\d.,]*)\s*%/) || [])[1];
      const closeRate = pct ? parseFloat(pct.replace(',', '.')) / 100 : 0.1;
      const cpl = rest.find((n) => n < aov) ?? 200000;
      const orders = revenue / aov;
      const leads = orders / closeRate;
      const budget = leads * cpl;
      return {
        title: 'Tính ngược ngân sách từ mục tiêu doanh thu',
        lines: [
          `1. Số đơn cần: ${vnd(revenue)} ÷ ${vnd(aov)} = **${num(orders, 0)} đơn**`,
          `2. Khách tiềm năng cần: ${num(orders, 0)} ÷ ${num(closeRate * 100, 0)}% = **${num(leads, 0)} khách**`,
          `3. Ngân sách quảng cáo: ${num(leads, 0)} × ${vnd(cpl)} = **${vnd(budget)}**`,
          `Chiếm ${num((budget / revenue) * 100, 1)}% doanh thu mục tiêu. Nhớ cộng thêm chi phí vận hành (Chuyên đề 03).`,
        ],
      };
    },
  },
];

/* ---------- Các bộ tra cứu ---------- */

function findGlossary(q) {
  const nq = normalize(q);
  const items = Array.isArray(GLOSSARY_ITEMS) ? GLOSSARY_ITEMS : [];
  const scored = items
    .map((it) => {
      const term = normalize(it.term || '');
      // "ROAS (Return on Ad Spend)" -> tách lấy phần trước ngoặc để khớp mã ngắn
      const short = normalize(String(it.term || '').split('(')[0]);
      const id = normalize(it.id || '');
      let score = 0;
      if (term && nq.includes(term)) score = 100 + term.length;
      else if (short && nq.includes(short)) score = 90 + short.length;
      else if (id && new RegExp(`(^| )${id}($| |\\?)`).test(nq)) score = 85;
      else if (term && term.includes(nq) && nq.length >= 3) score = 50;
      return { it, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((x) => x.it);
}

// Từ phổ thông không mang nội dung. Không loại ra thì câu ngoài phạm vi như
// "thời tiết hôm nay thế nào" cũng vớ được một chuyên đề bất kỳ.
const STOPWORDS = new Set([
  'nao', 'the', 'nay', 'hom', 'cua', 'cho', 'duoc', 'khong', 'minh', 'ban',
  'gi', 'la', 'va', 'voi', 'tren', 'trong', 'mot', 'cac', 'nhu', 'thi', 'noi',
  'bai', 'hoc', 'tim', 'xem', 'giup', 'toi', 'sao', 'ra', 'co', 'khi', 've',
]);

function findLessons(q) {
  const nq = normalize(q);
  const words = nq
    .split(' ')
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
  if (!words.length) return [];
  const hits = [];
  for (const mod of COURSE_MODULES) {
    // Khớp ở tiêu đề/mô tả chuyên đề nặng hơn hẳn khớp trong thân bài. Nếu để
    // ngang nhau, một chuyên đề dài nhắc thoáng qua từ khoá sẽ vượt mặt đúng
    // chuyên đề mang tên từ khoá đó.
    const modText = normalize(`${mod.title} ${mod.subtitle} ${mod.description} ${mod.badge}`);
    let score = words.reduce((s, w) => s + (modText.includes(w) ? 12 : 0), 0);
    let bestSection = null;
    for (const sec of mod.sections || []) {
      const secText = normalize(`${sec.title} ${sec.content}`);
      const secScore = words.reduce((s, w) => s + (secText.includes(w) ? 1 : 0), 0);
      if (secScore > 0 && (!bestSection || secScore > bestSection.score)) {
        bestSection = { title: sec.title, score: secScore };
      }
      score += Math.min(secScore, 6);   // chặn trần để bài dài không thắng bằng số lượng
    }
    // Cần khớp đủ mạnh mới tính là kết quả. Không có ngưỡng thì câu ngoài
    // phạm vi như "thời tiết hôm nay" cũng vớ được một chuyên đề bất kỳ.
    if (score >= 12) hits.push({ mod, score, bestSection });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 3);
}

/* ---------- Điểm vào chính ---------- */

export function askPipi(question) {
  const raw = String(question || '').trim();
  const q = normalize(raw);

  if (!q) {
    return { kind: 'empty', title: 'Bạn muốn hỏi gì nào?', lines: [], actions: [] };
  }

  if (/^(hi|hello|chao|xin chao|alo|hey)\b/.test(q)) {
    return {
      kind: 'greeting',
      title: 'Chào bạn! Mình là Pipi 🤖',
      lines: [
        'Mình giúp được ba việc trong khoá học này:',
        '**Tra thuật ngữ** — hỏi "ROAS là gì", "CAC nghĩa là gì"',
        '**Tìm bài học** — hỏi "bài nào nói về ngân sách"',
        '**Tính toán** — hỏi "tính ROAS doanh thu 800 triệu chi phí 300 triệu"',
      ],
      actions: [],
    };
  }

  // Chỉ nhận là câu hỏi trợ giúp khi diễn đạt rõ ràng. Trước đây bắt mỗi chữ
  // "giup" nên câu "tính ROAS giúp mình" bị hiểu nhầm thành xin trợ giúp.
  if (/(pipi lam duoc gi|ban lam duoc gi|lam duoc nhung gi|huong dan su dung|^help$|^giup gi)/.test(q)) {
    return {
      kind: 'help',
      title: 'Pipi làm được gì',
      lines: [
        '**Tra thuật ngữ** từ Từ điển Digital của khoá học.',
        '**Tìm bài học** trong 11 chuyên đề và chỉ đúng chuyên đề chứa nội dung đó.',
        '**Tính chỉ số**: ROAS, CPA, CPL, CTR, CVR, CPM và tính ngược ngân sách.',
        'Mình chỉ trả lời dựa trên dữ liệu có thật trong app, không bịa thêm.',
      ],
      actions: [],
    };
  }

  // Xin gặp người thật.
  //
  // Đặt TRƯỚC các nhánh tra cứu vì đây là ý định dứt khoát: người đã nói "cần
  // hỗ trợ" thì trả về một định nghĩa trong từ điển là trả lời lạc đề. Bù lại
  // phải diễn đạt rõ mới nhận — chỉ bắt mỗi chữ "ho tro" sẽ nuốt luôn những câu
  // như "chỉ số nào hỗ trợ đo hiệu quả".
  if (/(can ho tro|xin ho tro|nho ho tro|ho tro voi|can giup do|gap nguoi that|gap admin|gap ban quan tri|gap giang vien|lien he|de lai loi nhan|gui loi nhan|nhan tin cho|bao loi|khieu nai|phan anh)/.test(q)) {
    return {
      kind: 'support',
      title: 'Để mình chuyển lời tới Ban Quản Trị',
      lines: [
        'Việc này mình không tự giải quyết được, nhưng **Ban Quản Trị Học Viện** thì có.',
        'Bấm nút bên dưới rồi viết nội dung cần hỗ trợ — lời nhắn sẽ hiện ngay trong hộp thư của Ban Quản Trị kèm tên, email và số điện thoại của bạn.',
      ],
      actions: [{ type: 'support', label: '✉️ Nhắn Ban Quản Trị' }],
    };
  }

  const nums = parseNumbers(raw);
  const asksDefinition = /(la gi|nghia la|dinh nghia|y nghia|hieu the nao|giai thich)/.test(q);
  const asksLesson = /(bai nao|bai hoc nao|chuyen de nao|hoc o dau|tim bai|noi ve|o dau noi)/.test(q);

  const glossaryHits = findGlossary(raw);
  const lessonHits = findLessons(raw);

  const answerGlossary = () => {
    const t = glossaryHits[0];
    return {
      kind: 'glossary',
      title: String(t.term || ''),
      lines: [
        t.shortDef || t.definition || 'Xem chi tiết trong Từ điển Digital.',
        ...(t.formula ? [`**Công thức:** ${t.formula}`] : []),
        ...(glossaryHits.length > 1
          ? [`Liên quan: ${glossaryHits.slice(1).map((x) => x.term).join(', ')}`]
          : []),
      ],
      actions: [{ type: 'openTab', tab: 'glossary', label: 'Mở Từ Điển' }],
    };
  };

  const answerLesson = () => {
    const top = lessonHits[0];
    return {
      kind: 'lesson',
      title: `Chuyên đề ${top.mod.number}: ${top.mod.title}`,
      lines: [
        top.mod.subtitle,
        ...(top.bestSection ? [`Nội dung khớp nhất: **${top.bestSection.title}**`] : []),
        ...(lessonHits.length > 1
          ? [`Cũng có nhắc tới ở: ${lessonHits.slice(1).map((l) => `Chuyên đề ${l.mod.number}`).join(', ')}`]
          : []),
      ],
      actions: [
        { type: 'openModule', id: top.mod.id, label: `Vào học Chuyên đề ${top.mod.number}` },
        ...(lessonHits.length > 1 ? [{ type: 'search', query: raw, label: 'Xem tất cả kết quả' }] : []),
      ],
    };
  };

  // 1. Hỏi định nghĩa thì tra từ điển trước, dù câu có chứa tên chỉ số.
  //    "ROAS là gì" phải ra định nghĩa, không phải máy tính ROAS.
  if (asksDefinition && glossaryHits.length) return answerGlossary();

  // 2. Hỏi tìm bài học thì tra bài trước, dù câu có chứa từ khoá máy tính.
  //    "bài nào nói về ngân sách" phải ra chuyên đề, không phải máy tính ngân sách.
  if (asksLesson && lessonHits.length) return answerLesson();

  // 3. Ý định tính toán: chọn máy tính khớp DÀI NHẤT, không lấy cái đầu tiên.
  //    Trước đây "ngân sách ... CPL 180k" bị máy tính CPA cướp mất vì chữ "cpl".
  let best = null;
  for (const c of CALCULATORS) {
    for (const k of c.keys) {
      if (q.includes(k) && (!best || k.length > best.keyLen)) best = { calc: c, keyLen: k.length };
    }
  }
  if (best) {
    const calc = best.calc;
    if (nums.length >= calc.need) {
      const res = calc.run(nums, raw);
      return {
        kind: 'calc',
        title: res.title,
        lines: res.lines,
        actions: [{ type: 'openTab', tab: 'tools', label: 'Mở Bộ Công Cụ' }],
      };
    }
    // Chưa đủ số: nếu từ điển có mục khớp thì trả định nghĩa còn hữu ích hơn.
    if (glossaryHits.length) return answerGlossary();
    return {
      kind: 'calc-need-input',
      title: `Mình cần thêm số để tính ${calc.id.toUpperCase()}`,
      lines: [`Bạn cho mình đủ ${calc.need} con số nhé.`, calc.hint],
      actions: [],
    };
  }

  if (glossaryHits.length) return answerGlossary();
  if (lessonHits.length) return answerLesson();

  return {
    kind: 'notfound',
    title: 'Mình chưa tìm thấy nội dung khớp',
    lines: [
      `Không có mục nào trong khoá học khớp với "${raw}".`,
      'Thử hỏi theo cách khác, ví dụ: "ROAS là gì", "bài nào nói về nhân sự", "tính CPA chi phí 300 triệu 200 đơn".',
      'Mình chỉ tra trong dữ liệu của khoá học nên không trả lời được câu ngoài phạm vi — nhưng mình chuyển lời tới Ban Quản Trị được.',
    ],
    // Đây là chỗ Pipi bí. Đưa lối gặp người thật ngay tại đây thay vì để học
    // viên bỏ cuộc: câu hỏi không tra được mới đúng là câu cần người trả lời.
    actions: [
      { type: 'search', query: raw, label: 'Tìm bằng bộ lọc khoá học' },
      { type: 'support', label: '✉️ Nhắn Ban Quản Trị' },
    ],
  };
}

/** Gợi ý bấm nhanh hiển thị lúc mở khung chat. */
export const PIPI_SUGGESTIONS = [
  'ROAS là gì?',
  'Bài nào nói về ngân sách?',
  'Tính CPA chi phí 300 triệu 200 đơn',
  'Pipi giúp được gì?',
  'Mình cần hỗ trợ',
];

export const PIPI_BENCHMARK_COUNT = Array.isArray(INDUSTRY_BENCHMARKS)
  ? INDUSTRY_BENCHMARKS.length
  : Object.keys(INDUSTRY_BENCHMARKS || {}).length;
