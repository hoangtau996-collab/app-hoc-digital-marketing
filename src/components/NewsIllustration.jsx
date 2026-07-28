import React from 'react';

/**
 * Ảnh minh hoạ cho từng bài viết trong Bản tin thuật toán, vẽ bằng SVG nội tuyến.
 *
 * Cùng lý do với LessonIllustration: không phát sinh yêu cầu mạng nên không bao
 * giờ vỡ ảnh, nét sắc ở mọi độ phân giải, mỗi hình dưới 2KB. Trước đây mục tin
 * tức trỏ tới ảnh stock Unsplash - vừa phụ thuộc mạng ngoài, vừa là ảnh chung
 * chung không nói lên nội dung bài.
 *
 * Mỗi tin khai báo trường `illustration` trỏ tới một khoá trong SCENES.
 */

const G1 = '#4a7ce4'; // xanh Indigo đậm
const G2 = '#6495ED'; // xanh Indigo
const A1 = '#ea4c8b'; // hồng đậm
const A2 = '#FFDAE9'; // hồng nhạt
const T1 = '#3a85dd'; // xanh lam phụ
const INK = '#17233d';
const MUTE = '#94a3b8';

/* Nền chung: khung bo góc, lưới mờ, quầng sáng */
function Scene({ children, caption }) {
  return (
    <figure className="rounded-xl overflow-hidden border border-emerald-900/40 bg-[#101a2e] shadow-lg">
      <svg viewBox="0 0 640 200" className="w-full h-auto block" role="img" aria-label={caption}>
        <defs>
          <linearGradient id="ni-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#111b2f" />
            <stop offset="100%" stopColor="#182440" />
          </linearGradient>
          <linearGradient id="ni-em" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={G1} />
            <stop offset="100%" stopColor={G2} />
          </linearGradient>
          <linearGradient id="ni-am" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={A1} />
            <stop offset="100%" stopColor={A2} />
          </linearGradient>
          <pattern id="ni-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke={G1} strokeOpacity="0.10" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="640" height="200" fill="url(#ni-bg)" />
        <rect width="640" height="200" fill="url(#ni-grid)" />
        <circle cx="72" cy="26" r="88" fill={G1} opacity="0.07" />
        <circle cx="576" cy="184" r="78" fill={A1} opacity="0.06" />
        {children}
      </svg>
      <figcaption className="px-3.5 py-2 text-[11px] text-slate-400 border-t border-emerald-900/50 bg-[#0a1120]">
        {caption}
      </figcaption>
    </figure>
  );
}

/* Khung điện thoại dọc, dùng lại ở vài cảnh */
const Phone = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-34" y="-62" width="68" height="124" rx="10" fill="#0c1526" stroke={G1} strokeWidth="2" />
    <rect x="-12" y="-58" width="24" height="4" rx="2" fill={G1} opacity="0.6" />
    {children}
  </g>
);

const SCENES = {
  /* Thuật toán tự phân bổ ngân sách: bộ não máy chia tiền vào các cột */
  'ai-budget': (
    <g>
      <rect x="52" y="62" width="96" height="76" rx="14" fill="#0c1526" stroke={G2} strokeWidth="2" />
      <path
        d="M84 92c0-9 7-15 16-15s16 6 16 15c6 3 9 8 9 14 0 10-9 17-19 17h-12c-10 0-19-7-19-17 0-6 3-11 9-14z"
        fill="url(#ni-em)"
        opacity="0.9"
      />
      <path d="M100 88v36M88 100h24M88 112h24" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.65" />
      <text x="100" y="152" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Máy học</text>

      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M152 ${88 + i * 12} C 210 ${88 + i * 12}, 240 ${74 + i * 26}, 288 ${74 + i * 26}`}
          fill="none"
          stroke={T1}
          strokeWidth="2"
          strokeDasharray="5 4"
          opacity="0.75"
        />
      ))}

      <rect x="300" y="108" width="44" height="56" rx="6" fill={G1} opacity="0.55" />
      <rect x="356" y="76" width="44" height="88" rx="6" fill={G2} opacity="0.8" />
      <rect x="412" y="44" width="44" height="120" rx="6" fill="url(#ni-am)" />
      <rect x="468" y="96" width="44" height="68" rx="6" fill={G1} opacity="0.5" />
      <path d="M296 168h224" stroke={G1} strokeWidth="2" opacity="0.5" />
      <text x="322" y="184" fill={MUTE} fontSize="10" fontWeight="700" textAnchor="middle">Nhóm A</text>
      <text x="378" y="184" fill={MUTE} fontSize="10" fontWeight="700" textAnchor="middle">Nhóm B</text>
      <text x="434" y="184" fill={A2} fontSize="10" fontWeight="700" textAnchor="middle">Nhóm C</text>
      <text x="490" y="184" fill={MUTE} fontSize="10" fontWeight="700" textAnchor="middle">Nhóm D</text>
      <rect x="404" y="20" width="60" height="18" rx="9" fill={A1} opacity="0.85" />
      <text x="434" y="33" fill="#fff" fontSize="10" fontWeight="800" textAnchor="middle">TỰ ĐỘNG</text>
    </g>
  ),

  /* Sức khoẻ gian hàng quyết định lượng hiển thị */
  'shop-health': (
    <g>
      <path d="M96 132a68 68 0 0 1 136 0" fill="none" stroke={G1} strokeWidth="14" opacity="0.22" strokeLinecap="round" />
      <path d="M96 132a68 68 0 0 1 96-63" fill="none" stroke="url(#ni-em)" strokeWidth="14" strokeLinecap="round" />
      <circle cx="164" cy="132" r="7" fill={A2} />
      <path d="M164 132 L206 92" stroke={A1} strokeWidth="4" strokeLinecap="round" />
      <text x="164" y="162" fill="#e2e8f0" fontSize="15" fontWeight="800" textAnchor="middle">4.5 / 5.0</text>
      <text x="164" y="180" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Điểm sức khoẻ gian hàng</text>

      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d="M0 -9 L2.6 -2.8 L9 -2.8 L4 1.4 L6 8 L0 4.2 L-6 8 L-4 1.4 L-9 -2.8 L-2.6 -2.8 Z"
          transform={`translate(${118 + i * 23} 44)`}
          fill={i < 4 ? A1 : '#31405e'}
        />
      ))}

      <rect x="300" y="40" width="228" height="128" rx="12" fill="#0c1526" stroke={G1} strokeWidth="2" opacity="0.9" />
      <text x="318" y="64" fill={MUTE} fontSize="11" fontWeight="700">Lượt hiển thị tự nhiên</text>
      <path d="M318 142 L360 122 L402 128 L444 96 L486 116 L510 150" fill="none" stroke={A1} strokeWidth="3" strokeLinecap="round" />
      <path d="M318 142 L360 122 L402 128 L444 96 L486 116 L510 150 L510 156 L318 156 Z" fill={A1} opacity="0.12" />
      <circle cx="510" cy="150" r="5" fill={A1} />
      <path d="M496 168 l14 -8 -3 10 z" fill={A1} opacity="0.8" />
      <text x="452" y="184" fill={A2} fontSize="11" fontWeight="800">Bị bóp 50%</text>
    </g>
  ),

  /* Tìm kiếm không nhấp chuột: AI trả lời ngay đầu trang */
  'zero-click': (
    <g>
      <rect x="60" y="34" width="330" height="30" rx="15" fill="#0c1526" stroke={G2} strokeWidth="2" />
      <circle cx="84" cy="49" r="7" fill="none" stroke={G2} strokeWidth="2.5" />
      <path d="M89 54l7 7" stroke={G2} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="104" y="44" width="150" height="9" rx="4.5" fill={G2} opacity="0.45" />

      <rect x="60" y="78" width="330" height="62" rx="10" fill={G1} opacity="0.16" stroke={G2} strokeWidth="2" />
      <path d="M82 96l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" fill={A1} />
      <text x="104" y="102" fill={A2} fontSize="11" fontWeight="800">CÂU TRẢ LỜI AI</text>
      <rect x="104" y="110" width="262" height="7" rx="3.5" fill={G2} opacity="0.5" />
      <rect x="104" y="122" width="212" height="7" rx="3.5" fill={G2} opacity="0.34" />

      {[0, 1].map((i) => (
        <g key={i} opacity="0.35">
          <rect x="60" y={154 + i * 22} width="132" height="7" rx="3.5" fill={G2} />
          <rect x="200" y={154 + i * 22} width="80" height="7" rx="3.5" fill={G2} opacity="0.55" />
        </g>
      ))}
      <text x="298" y="180" fill={MUTE} fontSize="10" fontWeight="700">Kết quả tự nhiên bị đẩy xuống</text>

      <rect x="424" y="52" width="152" height="112" rx="12" fill="#0c1526" stroke={G1} strokeWidth="2" />
      <text x="500" y="76" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Lượt nhấp tự nhiên</text>
      <rect x="452" y="90" width="30" height="58" rx="4" fill={G2} opacity="0.8" />
      <rect x="494" y="118" width="30" height="30" rx="4" fill={A1} opacity="0.85" />
      <path d="M448 148h96" stroke={G1} strokeWidth="2" opacity="0.5" />
      <text x="467" y="162" fill={MUTE} fontSize="10" fontWeight="700" textAnchor="middle">Trước</text>
      <text x="509" y="162" fill={A2} fontSize="10" fontWeight="800" textAnchor="middle">-35%</text>
    </g>
  ),

  /* Một nội dung gốc nhân bản thành nhiều video quảng cáo */
  'ai-video': (
    <g>
      <rect x="56" y="56" width="88" height="106" rx="8" fill="#0c1526" stroke={G2} strokeWidth="2" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="72" y={78 + i * 18} width={56 - i * 8} height="7" rx="3.5" fill={G2} opacity={0.5 - i * 0.08} />
      ))}
      <text x="100" y="180" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">1 bài gốc</text>

      <circle cx="212" cy="108" r="26" fill={G1} opacity="0.2" stroke={G2} strokeWidth="2" />
      <path d="M204 100l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" transform="translate(8 -4)" fill={A1} />
      <text x="212" y="152" fill={A2} fontSize="10" fontWeight="800" textAnchor="middle">AI</text>

      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M240 108 C 268 108, 276 ${52 + i * 38}, 300 ${52 + i * 38}`}
          fill="none"
          stroke={T1}
          strokeWidth="2"
          strokeDasharray="5 4"
          opacity="0.6"
        />
      ))}

      {[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <g key={i} transform={`translate(${310 + col * 78} ${44 + row * 66})`}>
            <rect width="62" height="56" rx="7" fill={G1} opacity={i === 1 ? 0.85 : 0.4} stroke={i === 1 ? A1 : G2} strokeWidth={i === 1 ? 2 : 1} />
            <path d="M26 20l14 8-14 8z" fill={i === 1 ? A2 : '#cbd5e1'} opacity="0.9" />
          </g>
        );
      })}
      <text x="466" y="186" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">10 biến thể video trong 60 giây</text>
    </g>
  ),

  /* Xác thực tài khoản và bảo mật dữ liệu quảng cáo */
  'account-security': (
    <g>
      <path d="M164 34l64 22v46c0 34-26 58-64 68-38-10-64-34-64-68V56z" fill={G1} opacity="0.2" stroke={G2} strokeWidth="2.5" />
      <rect x="142" y="94" width="44" height="34" rx="6" fill="url(#ni-em)" />
      <path d="M152 94v-10a12 12 0 0 1 24 0v10" fill="none" stroke={A2} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="164" cy="110" r="4.5" fill={INK} />
      <text x="164" y="180" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Xác thực hai lớp</text>

      <rect x="286" y="44" width="252" height="112" rx="12" fill="#0c1526" stroke={G1} strokeWidth="2" />
      {[
        { y: 72, label: 'Xác minh doanh nghiệp', ok: true },
        { y: 102, label: 'Xác thực tên miền', ok: true },
        { y: 132, label: 'Khai báo nguồn dữ liệu', ok: false },
      ].map((row) => (
        <g key={row.y}>
          <circle cx="312" cy={row.y} r="10" fill={row.ok ? G1 : A1} opacity="0.9" />
          {row.ok ? (
            <path d={`M307 ${row.y}l4 4 7-8`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d={`M308 ${row.y - 4}l8 8M316 ${row.y - 4}l-8 8`} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          )}
          <rect x="332" y={row.y - 5} width={row.ok ? 150 : 176} height="9" rx="4.5" fill={row.ok ? G2 : A1} opacity={row.ok ? 0.42 : 0.55} />
        </g>
      ))}
      <text x="412" y="180" fill={A2} fontSize="11" fontWeight="800" textAnchor="middle">Thiếu 1 mục là khoá tài khoản</text>
    </g>
  ),

  /* Hoa hồng liên kết và mạng lưới người bán hàng */
  'affiliate-commission': (
    <g>
      <circle cx="128" cy="100" r="34" fill={G1} opacity="0.22" stroke={G2} strokeWidth="2" />
      <circle cx="128" cy="88" r="11" fill={G2} />
      <path d="M112 116c0-11 7-18 16-18s16 7 16 18z" fill={G2} opacity="0.85" />
      <text x="128" y="156" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Nhà bán hàng</text>

      {[46, 100, 154].map((y, i) => (
        <g key={y}>
          <path d={`M164 100 C 208 100, 216 ${y}, 258 ${y}`} fill="none" stroke={T1} strokeWidth="2" strokeDasharray="5 4" opacity="0.7" />
          <circle cx="278" cy={y} r="20" fill={G1} opacity={0.3 + i * 0.12} stroke={G2} strokeWidth="1.5" />
          <circle cx="278" cy={y - 5} r="6" fill={A2} opacity="0.9" />
          <path d={`M269 ${y + 10}c0-6 4-10 9-10s9 4 9 10z`} fill={A2} opacity="0.75" />
        </g>
      ))}
      <text x="278" y="190" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Mạng lưới KOC</text>

      <circle cx="452" cy="100" r="54" fill="url(#ni-am)" opacity="0.9" />
      <text x="452" y="112" fill={INK} fontSize="34" fontWeight="900" textAnchor="middle">15%</text>
      <text x="452" y="176" fill={A2} fontSize="11" fontWeight="800" textAnchor="middle">Hoa hồng mặc định mới</text>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${540 + (i % 2) * 22} ${72 + i * 30})`}>
          <ellipse rx="13" ry="5" fill={A1} opacity="0.8" />
          <rect x="-13" y="-7" width="26" height="7" fill={A1} opacity="0.55" />
          <ellipse cy="-7" rx="13" ry="5" fill={A2} />
        </g>
      ))}
    </g>
  ),

  /* Loại trừ từ khoá thương hiệu, chặn chi tiêu trùng lặp */
  'keyword-exclusion': (
    <g>
      <path d="M92 46h216l-78 74v58l-60 26v-84z" fill={G1} opacity="0.18" stroke={G2} strokeWidth="2.5" strokeLinejoin="round" />
      {[
        { y: 62, w: 150, x: 118 },
        { y: 82, w: 118, x: 134 },
      ].map((r) => (
        <rect key={r.y} x={r.x} y={r.y} width={r.w} height="9" rx="4.5" fill={G2} opacity="0.5" />
      ))}
      <g transform="translate(160 108)">
        <rect x="-42" y="-11" width="96" height="22" rx="6" fill={A1} opacity="0.28" stroke={A1} strokeWidth="1.5" />
        <text x="6" y="5" fill={A2} fontSize="11" fontWeight="800" textAnchor="middle">tên thương hiệu</text>
        <path d="M-46 -14 L60 14" stroke={A1} strokeWidth="3" strokeLinecap="round" />
      </g>
      <text x="200" y="190" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Phễu từ khoá PMax</text>

      <rect x="366" y="48" width="196" height="104" rx="12" fill="#0c1526" stroke={G1} strokeWidth="2" />
      <text x="388" y="74" fill={MUTE} fontSize="11" fontWeight="700">Ngân sách trùng lặp</text>
      <rect x="388" y="88" width="152" height="16" rx="8" fill={G1} opacity="0.28" />
      <rect x="388" y="88" width="112" height="16" rx="8" fill="url(#ni-em)" />
      <text x="388" y="128" fill={A2} fontSize="19" fontWeight="900">-20%</text>
      <text x="452" y="128" fill={MUTE} fontSize="11" fontWeight="700">chi phí tiết kiệm</text>
      <text x="464" y="176" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Không mua lại khách vốn đã có</text>
    </g>
  ),

  /* Bão hoà nội dung: lưới mẫu quảng cáo và đường hiệu quả đi xuống */
  'creative-fatigue': (
    <g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        return (
          <rect
            key={i}
            x={56 + col * 54}
            y={54 + row * 58}
            width="44"
            height="48"
            rx="7"
            fill={G1}
            opacity={0.7 - i * 0.07}
            stroke={G2}
            strokeWidth="1"
          />
        );
      })}
      <text x="160" y="188" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Cùng một bộ nội dung chạy quá lâu</text>

      <rect x="304" y="40" width="256" height="126" rx="12" fill="#0c1526" stroke={G1} strokeWidth="2" />
      <path d="M328 74 L376 82 L424 98 L472 122 L520 146" fill="none" stroke={A1} strokeWidth="3" strokeLinecap="round" />
      <circle cx="520" cy="146" r="5" fill={A1} />
      <text x="330" y="66" fill={A2} fontSize="11" fontWeight="800">CTR giảm dần</text>
      <path d="M328 148 L376 140 L424 128 L472 112 L520 92" fill="none" stroke={G2} strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" />
      <circle cx="520" cy="92" r="5" fill={G2} />
      <text x="432" y="86" fill={MUTE} fontSize="11" fontWeight="700">Tần suất tăng</text>
      <text x="432" y="184" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Dấu hiệu phải thay nội dung mới</text>
    </g>
  ),

  /* Dữ liệu chuyển đổi: trình duyệt mất tín hiệu, máy chủ bù lại */
  'data-signal': (
    <g>
      <rect x="56" y="52" width="150" height="106" rx="10" fill="#0c1526" stroke={G2} strokeWidth="2" />
      <rect x="56" y="52" width="150" height="22" rx="10" fill={G1} opacity="0.35" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={72 + i * 14} cy="63" r="4" fill={i === 0 ? A1 : G2} opacity="0.8" />
      ))}
      <g transform="translate(131 116)">
        <circle r="26" fill={A1} opacity="0.16" stroke={A1} strokeWidth="2" />
        <circle r="12" fill="none" stroke={A2} strokeWidth="2.5" strokeDasharray="4 3" />
        <path d="M-20 -20 L20 20" stroke={A1} strokeWidth="3" strokeLinecap="round" />
      </g>
      <text x="131" y="180" fill={A2} fontSize="11" fontWeight="800" textAnchor="middle">Trình duyệt chặn cookie</text>

      <path d="M222 104h56" stroke={T1} strokeWidth="2" strokeDasharray="5 4" opacity="0.4" />
      <path d="M268 98l12 6-12 6z" fill={T1} opacity="0.4" />

      <g transform="translate(300 44)">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(0 ${i * 34})`}>
            <rect width="88" height="26" rx="6" fill={G1} opacity="0.55" stroke={G2} strokeWidth="1.5" />
            <circle cx="16" cy="13" r="4" fill={A2} />
            <rect x="30" y="9" width="44" height="7" rx="3.5" fill="#cbd5e1" opacity="0.5" />
          </g>
        ))}
      </g>
      <text x="344" y="186" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Máy chủ gửi thẳng</text>

      <path d="M396 104 C 430 104, 434 100, 466 100" fill="none" stroke={G2} strokeWidth="2.5" strokeDasharray="6 4" />
      <circle cx="500" cy="100" r="42" fill={G1} opacity="0.2" stroke={G2} strokeWidth="2" />
      <path d="M482 100l12 12 24-26" fill="none" stroke={A2} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="500" y="166" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Khôi phục tín hiệu</text>
    </g>
  ),

  /* Bán hàng phát trực tiếp */
  'livestream': (
    <g>
      <Phone x={128} y={100} s={1.15}>
        <rect x="-28" y="-46" width="56" height="72" rx="6" fill={G1} opacity="0.3" />
        <circle cx="0" cy="-16" r="11" fill={G2} />
        <path d="M-15 8c0-10 7-16 15-16s15 6 15 16z" fill={G2} opacity="0.85" />
        <rect x="-26" y="34" width="52" height="14" rx="7" fill="url(#ni-am)" />
        <text x="0" y="44" fill={INK} fontSize="9" fontWeight="900" textAnchor="middle">MUA NGAY</text>
      </Phone>
      <g transform="translate(128 26)">
        <rect x="-26" y="-10" width="52" height="20" rx="10" fill={A1} />
        <circle cx="-14" cy="0" r="4" fill="#fff" />
        <text x="6" y="4" fill="#fff" fontSize="10" fontWeight="900" textAnchor="middle">LIVE</text>
      </g>

      {[
        { x: 226, y: 48, w: 128 },
        { x: 244, y: 84, w: 152 },
        { x: 226, y: 120, w: 110 },
      ].map((b) => (
        <g key={b.y}>
          <rect x={b.x} y={b.y} width={b.w} height="24" rx="12" fill={G1} opacity="0.28" stroke={G2} strokeWidth="1" />
          <circle cx={b.x + 14} cy={b.y + 12} r="6" fill={G2} opacity="0.8" />
          <rect x={b.x + 26} y={b.y + 8} width={b.w - 42} height="7" rx="3.5" fill="#cbd5e1" opacity="0.4" />
        </g>
      ))}
      <text x="290" y="176" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Bình luận chốt đơn theo thời gian thực</text>

      <rect x="428" y="46" width="146" height="118" rx="12" fill="#0c1526" stroke={G1} strokeWidth="2" />
      <text x="501" y="70" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Doanh thu / 1.000 view</text>
      <rect x="450" y="118" width="26" height="32" rx="4" fill={G1} opacity="0.5" />
      <rect x="486" y="98" width="26" height="52" rx="4" fill={G2} opacity="0.75" />
      <rect x="522" y="82" width="26" height="68" rx="4" fill="url(#ni-am)" />
      <path d="M446 150h108" stroke={G1} strokeWidth="2" opacity="0.5" />
      <text x="535" y="168" fill={A2} fontSize="11" fontWeight="800" textAnchor="middle">Cao nhất</text>
    </g>
  ),

  /* Biến động giá thầu và chi phí hiển thị */
  'cpm-auction': (
    <g>
      <rect x="56" y="40" width="252" height="128" rx="12" fill="#0c1526" stroke={G1} strokeWidth="2" />
      <text x="78" y="64" fill={MUTE} fontSize="11" fontWeight="700">Chi phí hiển thị theo tuần</text>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={80 + i * 38}
          y={148 - (26 + i * 14)}
          width="24"
          height={26 + i * 14}
          rx="4"
          fill={i >= 4 ? 'url(#ni-am)' : G1}
          opacity={i >= 4 ? 1 : 0.45 + i * 0.08}
        />
      ))}
      <path d="M76 148h216" stroke={G1} strokeWidth="2" opacity="0.5" />
      <text x="266" y="80" fill={A2} fontSize="16" fontWeight="900" textAnchor="middle">+28%</text>

      <g transform="translate(430 100)">
        <circle r="62" fill={G1} opacity="0.12" stroke={G2} strokeWidth="2" strokeDasharray="6 5" />
        {[0, 1, 2, 3].map((i) => {
          const a = (Math.PI * 2 * i) / 4 - Math.PI / 2;
          return (
            <g key={i} transform={`translate(${Math.cos(a) * 62} ${Math.sin(a) * 62})`}>
              <circle r="15" fill={i === 0 ? A1 : G2} opacity={i === 0 ? 0.95 : 0.6} />
              <text y="4" fill={i === 0 ? '#fff' : INK} fontSize="10" fontWeight="900" textAnchor="middle">
                {i === 0 ? 'Bạn' : 'ĐT'}
              </text>
            </g>
          );
        })}
        <text y="5" fill={MUTE} fontSize="11" fontWeight="800" textAnchor="middle">Cùng đấu</text>
        <text y="20" fill={MUTE} fontSize="11" fontWeight="800" textAnchor="middle">một tệp</text>
      </g>
      <text x="430" y="188" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Càng nhiều nhà quảng cáo, giá thầu càng leo</text>
    </g>
  ),

  /* Dữ liệu sở hữu và tự động hoá chăm sóc */
  'crm-automation': (
    <g>
      <g transform="translate(112 100)">
        <ellipse cy="-42" rx="46" ry="15" fill={G2} opacity="0.85" />
        <path d="M-46 -42v70c0 8 21 15 46 15s46-7 46-15v-70" fill={G1} opacity="0.4" />
        <ellipse cy="-14" rx="46" ry="15" fill="none" stroke={G2} strokeWidth="1.5" opacity="0.7" />
        <ellipse cy="14" rx="46" ry="15" fill="none" stroke={G2} strokeWidth="1.5" opacity="0.5" />
      </g>
      <text x="112" y="186" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Dữ liệu khách hàng sở hữu</text>

      {[52, 100, 148].map((y) => (
        <path
          key={y}
          d={`M162 100 C 200 100, 208 ${y}, 246 ${y}`}
          fill="none"
          stroke={T1}
          strokeWidth="2"
          strokeDasharray="5 4"
          opacity="0.65"
        />
      ))}

      {[
        { y: 52, label: 'Chào mừng' },
        { y: 100, label: 'Bỏ giỏ hàng' },
        { y: 148, label: 'Sau mua' },
      ].map((row) => (
        <g key={row.y} transform={`translate(258 ${row.y - 16})`}>
          <rect width="150" height="32" rx="8" fill={G1} opacity="0.35" stroke={G2} strokeWidth="1.5" />
          <path d="M14 10h22v13H14z" fill="none" stroke={A2} strokeWidth="2" />
          <path d="M14 10l11 8 11-8" fill="none" stroke={A2} strokeWidth="2" strokeLinejoin="round" />
          <text x="48" y="21" fill="#cbd5e1" fontSize="11" fontWeight="700">{row.label}</text>
        </g>
      ))}

      <path d="M420 100h32" stroke={T1} strokeWidth="2" strokeDasharray="5 4" opacity="0.55" />
      <path d="M446 94l12 6-12 6z" fill={T1} opacity="0.55" />
      <circle cx="524" cy="100" r="46" fill="url(#ni-am)" opacity="0.9" />
      <text x="524" y="94" fill={INK} fontSize="17" fontWeight="900" textAnchor="middle">Tự động</text>
      <text x="524" y="112" fill={INK} fontSize="17" fontWeight="900" textAnchor="middle">24/7</text>
    </g>
  ),

  /* Nội dung do AI tạo phải gắn nhãn minh bạch */
  'ai-label': (
    <g>
      <rect x="70" y="44" width="196" height="120" rx="12" fill="#0c1526" stroke={G2} strokeWidth="2" />
      <rect x="88" y="62" width="160" height="66" rx="8" fill={G1} opacity="0.3" />
      <path d="M152 82l5 11 11 5-11 5-5 11-5-11-11-5 11-5z" fill={A1} />
      <rect x="88" y="138" width="106" height="9" rx="4.5" fill={G2} opacity="0.45" />
      <g transform="translate(196 150)">
        <rect x="-8" y="-12" width="76" height="22" rx="11" fill={A1} opacity="0.9" />
        <text x="30" y="3" fill="#fff" fontSize="10" fontWeight="900" textAnchor="middle">TẠO BỞI AI</text>
      </g>

      <path d="M292 104h44" stroke={T1} strokeWidth="2" strokeDasharray="5 4" opacity="0.5" />
      <path d="M330 98l12 6-12 6z" fill={T1} opacity="0.5" />

      <rect x="360" y="44" width="212" height="120" rx="12" fill="#0c1526" stroke={G1} strokeWidth="2" />
      <text x="382" y="70" fill={MUTE} fontSize="11" fontWeight="700">Yêu cầu tuân thủ</text>
      {[
        { y: 96, label: 'Gắn nhãn hiển thị rõ' },
        { y: 124, label: 'Lưu bản gốc để đối chiếu' },
      ].map((row) => (
        <g key={row.y}>
          <circle cx="392" cy={row.y} r="9" fill={G1} opacity="0.9" />
          <path d={`M387 ${row.y}l4 4 7-8`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="410" y={row.y + 4} fill="#cbd5e1" fontSize="11" fontWeight="700">{row.label}</text>
        </g>
      ))}
      <text x="466" y="156" fill={A2} fontSize="11" fontWeight="800" textAnchor="middle">Vi phạm: gỡ nội dung, hạn chế phân phối</text>
    </g>
  ),

  /* Tốc độ tải trang và trải nghiệm người dùng */
  'page-speed': (
    <g>
      <g transform="translate(140 98)">
        <path d="M-70 26a70 70 0 0 1 140 0" fill="none" stroke={G1} strokeWidth="15" opacity="0.2" strokeLinecap="round" />
        <path d="M-70 26a70 70 0 0 1 46-66" fill="none" stroke={A1} strokeWidth="15" strokeLinecap="round" />
        <path d="M-24 -40a70 70 0 0 1 94 66" fill="none" stroke="url(#ni-em)" strokeWidth="15" strokeLinecap="round" />
        <circle cx="0" cy="26" r="8" fill={A2} />
        <path d="M0 26 L34 -22" stroke={A1} strokeWidth="4" strokeLinecap="round" />
      </g>
      <text x="140" y="160" fill="#e2e8f0" fontSize="15" fontWeight="800" textAnchor="middle">200 ms</text>
      <text x="140" y="180" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Ngưỡng phản hồi tương tác</text>

      <rect x="286" y="40" width="126" height="128" rx="12" fill="#0c1526" stroke={G1} strokeWidth="2" />
      <text x="349" y="64" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Trang chậm</text>
      <rect x="306" y="80" width="86" height="9" rx="4.5" fill={A1} opacity="0.6" />
      <rect x="306" y="98" width="60" height="9" rx="4.5" fill={A1} opacity="0.35" />
      <text x="349" y="138" fill={A2} fontSize="20" fontWeight="900" textAnchor="middle">-7%</text>
      <text x="349" y="156" fill={MUTE} fontSize="10" fontWeight="700" textAnchor="middle">chuyển đổi / giây trễ</text>

      <rect x="428" y="40" width="146" height="128" rx="12" fill="#0c1526" stroke={G2} strokeWidth="2" />
      <text x="501" y="64" fill={MUTE} fontSize="11" fontWeight="700" textAnchor="middle">Sau tối ưu</text>
      <rect x="450" y="80" width="102" height="9" rx="4.5" fill={G2} opacity="0.65" />
      <rect x="450" y="98" width="102" height="9" rx="4.5" fill={G2} opacity="0.45" />
      <text x="501" y="138" fill="#e2e8f0" fontSize="20" fontWeight="900" textAnchor="middle">1.8s</text>
      <text x="501" y="156" fill={MUTE} fontSize="10" fontWeight="700" textAnchor="middle">thời gian tải mục tiêu</text>
    </g>
  ),
};

const CAPTIONS = {
  'ai-budget': 'Thuật toán tự phân bổ ngân sách giữa các nhóm quảng cáo theo thời gian thực',
  'shop-health': 'Điểm sức khoẻ gian hàng quyết định lượng hiển thị tự nhiên được cấp',
  'zero-click': 'Câu trả lời AI chiếm đầu trang, kết quả tự nhiên mất lượt nhấp',
  'ai-video': 'Một nội dung gốc được AI nhân thành nhiều biến thể video quảng cáo',
  'account-security': 'Chuỗi xác thực tài khoản quảng cáo: thiếu một mắt xích là bị khoá',
  'affiliate-commission': 'Cơ chế hoa hồng liên kết và mạng lưới người bán hàng trung gian',
  'keyword-exclusion': 'Loại trừ từ khoá thương hiệu để không trả tiền mua lại khách sẵn có',
  'creative-fatigue': 'Tần suất tăng, hiệu quả giảm: dấu hiệu bộ nội dung đã bão hoà',
  'data-signal': 'Trình duyệt chặn tín hiệu, máy chủ gửi thẳng dữ liệu chuyển đổi bù lại',
  'livestream': 'Phiên phát trực tiếp: bình luận, chốt đơn và doanh thu trên mỗi nghìn lượt xem',
  'cpm-auction': 'Nhiều nhà quảng cáo cùng đấu một tệp khiến chi phí hiển thị leo thang',
  'crm-automation': 'Dữ liệu sở hữu chạy thành các luồng chăm sóc tự động',
  'ai-label': 'Nội dung do AI tạo phải gắn nhãn minh bạch trước khi phân phối',
  'page-speed': 'Tốc độ phản hồi trang và cái giá phải trả bằng tỷ lệ chuyển đổi',
};

export default function NewsIllustration({ name }) {
  const scene = SCENES[name];
  if (!scene) return null;
  return <Scene caption={CAPTIONS[name] || ''}>{scene}</Scene>;
}
