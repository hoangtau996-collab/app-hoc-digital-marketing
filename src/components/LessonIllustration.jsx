import React from 'react';

/**
 * Ảnh minh hoạ đầu mỗi chuyên đề, vẽ bằng SVG nội tuyến.
 *
 * Vì sao không dùng file ảnh: SVG nội tuyến không phát sinh yêu cầu mạng nên
 * không bao giờ vỡ ảnh khi rớt mạng, nét sắc ở mọi độ phân giải, và nặng chưa
 * tới 2KB mỗi hình thay vì hàng trăm KB ảnh bitmap.
 *
 * Khác với sơ đồ trong LessonVisual (biểu diễn số liệu của từng bài), đây là
 * tranh khái niệm cho cả chuyên đề.
 */

const G1 = '#10b981'; // ngọc lục bảo
const G2 = '#34d399';
const A1 = '#f59e0b'; // vàng đồng
const A2 = '#fcd34d';
const T1 = '#14b8a6';
const INK = '#0b1f18';

/* Nền chung: khung bo góc, lưới mờ, quầng sáng */
function Scene({ children, caption }) {
  return (
    <figure className="my-4 rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#06140e] shadow-xl">
      <svg viewBox="0 0 640 200" className="w-full h-auto block" role="img" aria-label={caption}>
        <defs>
          <linearGradient id="li-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#07160f" />
            <stop offset="100%" stopColor="#0a2018" />
          </linearGradient>
          <linearGradient id="li-em" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={G1} />
            <stop offset="100%" stopColor={G2} />
          </linearGradient>
          <linearGradient id="li-am" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={A1} />
            <stop offset="100%" stopColor={A2} />
          </linearGradient>
          <pattern id="li-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke={G1} strokeOpacity="0.10" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="640" height="200" fill="url(#li-bg)" />
        <rect width="640" height="200" fill="url(#li-grid)" />
        <circle cx="70" cy="30" r="90" fill={G1} opacity="0.07" />
        <circle cx="580" cy="180" r="80" fill={A1} opacity="0.06" />
        {children}
      </svg>
      <figcaption className="px-4 py-2 text-[11px] text-slate-400 border-t border-emerald-900/50 bg-[#04100b]">
        {caption}
      </figcaption>
    </figure>
  );
}

/* Người que dùng lại nhiều nơi */
const Person = ({ x, y, s = 1, c = G2 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx="0" cy="-14" r="8" fill={c} />
    <path d="M-11 12c0-9 5-15 11-15s11 6 11 15z" fill={c} opacity="0.85" />
  </g>
);

const SCENES = {
  /* 01 - Mục tiêu: bia bắn và mũi tên */
  'module-01': (
    <g>
      <circle cx="200" cy="100" r="62" fill="none" stroke={G1} strokeWidth="3" opacity="0.5" />
      <circle cx="200" cy="100" r="42" fill="none" stroke={G2} strokeWidth="3" opacity="0.7" />
      <circle cx="200" cy="100" r="22" fill="none" stroke={A1} strokeWidth="3" />
      <circle cx="200" cy="100" r="7" fill={A2} />
      {/* Mũi tên cắm VÀO tâm bia: đầu nhọn phải ở phía tâm, không phải ở điểm xuất phát */}
      <path d="M334 38 L218 95" stroke={A1} strokeWidth="4" strokeLinecap="round" />
      <path d="M204 101 l17 -2 -6 -12 z" fill={A2} />
      <path d="M334 38 l-2 14 14-2 z" fill={A1} opacity="0.55" />
      <rect x="380" y="118" width="34" height="46" rx="5" fill={G1} opacity="0.75" />
      <rect x="424" y="92" width="34" height="72" rx="5" fill={G2} opacity="0.85" />
      <rect x="468" y="60" width="34" height="104" rx="5" fill="url(#li-am)" />
      <text x="380" y="182" fill="#94a3b8" fontSize="11" fontWeight="700">Nhận biết</text>
      <text x="466" y="182" fill="#94a3b8" fontSize="11" fontWeight="700">Doanh thu</text>
    </g>
  ),

  /* 02 - Đẩy & Kéo: hai vòng xoay ngược chiều */
  'module-02': (
    <g>
      <path d="M150 100a55 55 0 1 1 16 39" fill="none" stroke={G1} strokeWidth="5" strokeLinecap="round" />
      <path d="M166 139 l-3 -20 20 6 z" fill={G2} />
      <text x="205" y="106" fill={G2} fontSize="13" fontWeight="800">INBOUND</text>
      <text x="205" y="124" fill="#64748b" fontSize="10">Khách tự tìm đến</text>
      <path d="M490 100a55 55 0 1 0 -16 39" fill="none" stroke={A1} strokeWidth="5" strokeLinecap="round" />
      <path d="M474 139 l3 -20 -20 6 z" fill={A2} />
      <text x="330" y="106" fill={A2} fontSize="13" fontWeight="800" textAnchor="end">OUTBOUND</text>
      <text x="330" y="124" fill="#64748b" fontSize="10" textAnchor="end">Chủ động tìm khách</text>
      <circle cx="320" cy="100" r="16" fill="url(#li-em)" opacity="0.9" />
    </g>
  ),

  /* 03 - Ngân sách: túi tiền và ba cột phân bổ */
  'module-03': (
    <g>
      <path d="M150 78h70l14 24v52a10 10 0 0 1-10 10h-78a10 10 0 0 1-10-10v-52z" fill={G1} opacity="0.28" stroke={G1} strokeWidth="2" />
      <circle cx="185" cy="122" r="16" fill="url(#li-am)" />
      <text x="185" y="127" fill={INK} fontSize="14" fontWeight="900" textAnchor="middle">₫</text>
      <rect x="300" y="52" width="220" height="20" rx="10" fill={G1} opacity="0.85" />
      <rect x="300" y="82" width="150" height="20" rx="10" fill={T1} opacity="0.85" />
      <rect x="300" y="112" width="70" height="20" rx="10" fill="url(#li-am)" />
      <text x="530" y="67" fill="#94a3b8" fontSize="11" fontWeight="700">70%</text>
      <text x="460" y="97" fill="#94a3b8" fontSize="11" fontWeight="700">20%</text>
      <text x="380" y="127" fill="#94a3b8" fontSize="11" fontWeight="700">10%</text>
      <text x="300" y="158" fill="#64748b" fontSize="10">Cốt lõi · Tiềm năng · Thử nghiệm</text>
    </g>
  ),

  /* 04 - Nhân sự: sơ đồ tổ chức */
  'module-04': (
    <g>
      <Person x={320} y={58} s={1.15} c={A2} />
      <path d="M320 74v18M200 110v-18h240v18" fill="none" stroke={G1} strokeWidth="2" opacity="0.6" />
      <Person x={200} y={130} c={G2} />
      <Person x={320} y={130} c={G2} />
      <Person x={440} y={130} c={G2} />
      <text x="320" y="42" fill={A2} fontSize="11" fontWeight="800" textAnchor="middle">TRƯỞNG PHÒNG</text>
      <text x="200" y="162" fill="#94a3b8" fontSize="10" textAnchor="middle">Quảng cáo</text>
      <text x="320" y="162" fill="#94a3b8" fontSize="10" textAnchor="middle">Nội dung</text>
      <text x="440" y="162" fill="#94a3b8" fontSize="10" textAnchor="middle">Dữ liệu</text>
    </g>
  ),

  /* 05 - Nghiên cứu: kính lúp soi biểu đồ */
  'module-05': (
    <g>
      <rect x="150" y="60" width="200" height="100" rx="10" fill={G1} opacity="0.12" stroke={G1} strokeWidth="1.5" />
      <polyline points="168,140 205,112 240,124 275,86 312,98 334,74" fill="none" stroke="url(#li-em)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="275" cy="86" r="5" fill={A2} />
      <circle cx="420" cy="96" r="44" fill="none" stroke={A1} strokeWidth="6" />
      <circle cx="420" cy="96" r="38" fill={A2} opacity="0.10" />
      <path d="M452 128 L500 168" stroke={A1} strokeWidth="10" strokeLinecap="round" />
      <text x="420" y="101" fill={A2} fontSize="16" fontWeight="900" textAnchor="middle">?</text>
    </g>
  ),

  /* 06 - Khách hàng: thẻ chân dung và insight */
  'module-06': (
    <g>
      <rect x="160" y="48" width="150" height="106" rx="12" fill={G1} opacity="0.14" stroke={G1} strokeWidth="1.5" />
      <Person x={235} y={92} s={1.25} c={G2} />
      <rect x="186" y="118" width="98" height="7" rx="3.5" fill={G2} opacity="0.55" />
      <rect x="200" y="132" width="70" height="7" rx="3.5" fill={G2} opacity="0.35" />
      <path d="M360 70h150a10 10 0 0 1 10 10v42a10 10 0 0 1-10 10H392l-20 20v-20h-12a10 10 0 0 1-10-10V80a10 10 0 0 1 10-10z" fill={A1} opacity="0.18" stroke={A1} strokeWidth="1.5" />
      <text x="378" y="96" fill={A2} fontSize="11" fontWeight="800">INSIGHT</text>
      <rect x="378" y="106" width="110" height="6" rx="3" fill={A2} opacity="0.5" />
      <rect x="378" y="118" width="78" height="6" rx="3" fill={A2} opacity="0.3" />
    </g>
  ),

  /* 07 - Sáng tạo: bóng đèn và các mẫu thông điệp */
  'module-07': (
    <g>
      <path d="M250 62a34 34 0 0 1 34 34c0 14-8 21-12 28h-44c-4-7-12-14-12-28a34 34 0 0 1 34-34z" fill={A1} opacity="0.28" stroke={A1} strokeWidth="2" />
      <rect x="234" y="128" width="32" height="7" rx="3.5" fill={A2} />
      <rect x="238" y="140" width="24" height="6" rx="3" fill={A2} opacity="0.7" />
      <path d="M250 78v26M240 92h20" stroke={A2} strokeWidth="3" strokeLinecap="round" />
      <rect x="350" y="56" width="82" height="52" rx="8" fill={G1} opacity="0.22" stroke={G1} strokeWidth="1.5" />
      <rect x="446" y="56" width="82" height="52" rx="8" fill={T1} opacity="0.22" stroke={T1} strokeWidth="1.5" />
      <rect x="398" y="118" width="82" height="52" rx="8" fill={A1} opacity="0.22" stroke={A1} strokeWidth="1.5" />
      <text x="391" y="86" fill={G2} fontSize="10" fontWeight="800" textAnchor="middle">HOOK</text>
      <text x="487" y="86" fill={T1} fontSize="10" fontWeight="800" textAnchor="middle">STORY</text>
      <text x="439" y="148" fill={A2} fontSize="10" fontWeight="800" textAnchor="middle">OFFER</text>
    </g>
  ),

  /* 08 - Lan truyền: mạng lưới lan toả */
  'module-08': (
    <g>
      <g stroke={G1} strokeWidth="1.5" opacity="0.45" fill="none">
        <path d="M320 100L220 56M320 100L220 144M320 100L430 60M320 100L430 140M430 60L510 40M430 60L512 84M430 140L510 122M430 140L512 164" />
      </g>
      <circle cx="320" cy="100" r="20" fill="url(#li-am)" />
      <text x="320" y="105" fill={INK} fontSize="12" fontWeight="900" textAnchor="middle">K</text>
      {[[220, 56], [220, 144], [430, 60], [430, 140]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="11" fill={G2} opacity="0.9" />
      ))}
      {[[510, 40], [512, 84], [510, 122], [512, 164]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="7" fill={T1} opacity="0.75" />
      ))}
    </g>
  ),

  /* 09 - Kế hoạch: biểu đồ Gantt ba chặng */
  'module-09': (
    <g>
      <rect x="150" y="46" width="340" height="118" rx="10" fill={G1} opacity="0.10" stroke={G1} strokeWidth="1.5" />
      <line x1="150" y1="72" x2="490" y2="72" stroke={G1} strokeOpacity="0.25" />
      <rect x="166" y="84" width="96" height="16" rx="8" fill={T1} opacity="0.9" />
      <rect x="230" y="108" width="130" height="16" rx="8" fill={G2} opacity="0.9" />
      <rect x="330" y="132" width="144" height="16" rx="8" fill="url(#li-am)" />
      <text x="166" y="66" fill="#94a3b8" fontSize="10">Ngày 1</text>
      <text x="310" y="66" fill="#94a3b8" fontSize="10">Ngày 45</text>
      <text x="446" y="66" fill="#94a3b8" fontSize="10">Ngày 90</text>
      <text x="506" y="95" fill={T1} fontSize="10" fontWeight="700">Dựng nền</text>
      <text x="506" y="119" fill={G2} fontSize="10" fontWeight="700">Kiểm định</text>
      <text x="506" y="143" fill={A2} fontSize="10" fontWeight="700">Nhân rộng</text>
    </g>
  ),

  /* 10 - Đo lường: đồng hồ đo và cột chỉ số */
  'module-10': (
    <g>
      <path d="M180 132a70 70 0 0 1 140 0" fill="none" stroke={G1} strokeWidth="12" strokeOpacity="0.22" strokeLinecap="round" />
      <path d="M180 132a70 70 0 0 1 108 -54" fill="none" stroke="url(#li-em)" strokeWidth="12" strokeLinecap="round" />
      <line x1="250" y1="132" x2="292" y2="88" stroke={A1} strokeWidth="4" strokeLinecap="round" />
      <circle cx="250" cy="132" r="7" fill={A2} />
      <text x="250" y="160" fill={G2} fontSize="13" fontWeight="900" textAnchor="middle">ROAS 3.6x</text>
      <rect x="378" y="118" width="26" height="42" rx="4" fill={G1} opacity="0.7" />
      <rect x="414" y="96" width="26" height="64" rx="4" fill={T1} opacity="0.8" />
      <rect x="450" y="72" width="26" height="88" rx="4" fill={G2} opacity="0.9" />
      <rect x="486" y="52" width="26" height="108" rx="4" fill="url(#li-am)" />
      <text x="378" y="178" fill="#64748b" fontSize="9">T1</text>
      <text x="486" y="178" fill="#64748b" fontSize="9">T4</text>
    </g>
  ),

  /* 11 - Tư vấn: cặp tài liệu và danh sách chẩn đoán */
  'module-11': (
    <g>
      <rect x="150" y="72" width="130" height="88" rx="10" fill={A1} opacity="0.20" stroke={A1} strokeWidth="2" />
      <path d="M192 72V60a10 10 0 0 1 10-10h26a10 10 0 0 1 10 10v12" fill="none" stroke={A1} strokeWidth="2.5" />
      <line x1="150" y1="106" x2="280" y2="106" stroke={A1} strokeWidth="2" opacity="0.6" />
      <rect x="206" y="98" width="18" height="16" rx="3" fill={A2} />
      <g>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(330 ${64 + i * 34})`}>
            <circle cx="10" cy="10" r="10" fill={G1} opacity="0.9" />
            <path d="M5 10l4 4 7-8" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="30" y="4" width={150 - i * 34} height="7" rx="3.5" fill={G2} opacity="0.55" />
            <rect x="30" y="15" width={110 - i * 24} height="6" rx="3" fill={G2} opacity="0.3" />
          </g>
        ))}
      </g>
    </g>
  ),
};

const CAPTIONS = {
  'module-01': 'Mục tiêu Digital: từ kỳ vọng kinh doanh tới bộ chỉ số đo được',
  'module-02': 'Hai chiều tiếp cận: Inbound kéo khách tới, Outbound chủ động tìm khách',
  'module-03': 'Ngân sách Marketing và nguyên tắc phân bổ 70 / 20 / 10',
  'module-04': 'Bộ máy phòng Digital Marketing và phân vai chuyên môn',
  'module-05': 'Nghiên cứu thị trường: soi dữ liệu để tìm ra cơ hội thật',
  'module-06': 'Chân dung khách hàng và hành trình đào sâu tới Insight',
  'module-07': 'Sáng tạo thông điệp theo cấu trúc Hook - Story - Offer',
  'module-08': 'Cơ chế lan truyền: hệ số K quyết định chiến dịch có tự lan hay không',
  'module-09': 'Lộ trình 90 ngày chia ba chặng: dựng nền, kiểm định, nhân rộng',
  'module-10': 'Đo lường hiệu quả và theo dõi chỉ số qua từng tháng',
  'module-11': 'Tư vấn và chẩn đoán: kiểm tra từng lớp trước khi kê đơn',
};

export default function LessonIllustration({ moduleId }) {
  const scene = SCENES[moduleId];
  if (!scene) return null;
  return <Scene caption={CAPTIONS[moduleId] || ''}>{scene}</Scene>;
}
