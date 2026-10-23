import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  BrainCircuit,
  Compass,
  Eye,
  Heart,
  Mail,
  MousePointerClick,
  PenTool,
  Search,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { HomeNews, HomeGlossary, HomeToolkit } from './HomeLiveSections';
import { HOME_PHOTOS } from '../data/homePhotos';

/*
  TRANG CHỦ HỌC VIỆN — địa chỉ `/`.

  Trang này KHÔNG liệt kê chuyên đề. Bản cũ dồn 11 thẻ chuyên đề, bộ lọc ba
  phần, bốn ô thống kê và hai huy hiệu giá nhấp nháy vào màn đầu tiên — người
  mới vào chưa kịp hiểu vì sao nên học đã bị bắt chọn học bài nào. Ở đây chỉ
  làm một việc: cho thấy Marketing và Digital Marketing quan trọng tới đâu, rồi
  mời vào học. Danh sách chuyên đề vẫn nguyên ở `/digital-marketing`.

  Màu không dùng lớp Tailwind (`text-white`, `bg-slate-900`...): index.css có
  hàng loạt quy tắc `!important` ép lại các lớp đó ở giao diện sáng, và ép
  theo kiểu "thẻ tối thành thẻ sáng" — đúng cho thẻ bài học nhưng phá bố cục
  của một trang trình bày. Toàn bộ màu nằm ở nhóm lớp `.home-*` trong index.css.
*/

/* SỐ LIỆU THỊ TRƯỜNG — chỉ dùng số đã công bố, ghi nguồn ngay dưới số.
   Cập nhật khi có báo cáo năm mới: DataReportal ra bản "Digital <năm>" vào
   tháng 2, e-Conomy SEA ra vào tháng 11. Đổi số thì đổi luôn dòng nguồn. */
const MARKET_STATS = [
  {
    value: 85.6, decimals: 1, unit: 'triệu',
    label: 'người Việt dùng internet',
    note: '84,2% dân số',
    source: 'DataReportal, Digital 2026 (10/2025)',
  },
  {
    value: 79.0, decimals: 1, unit: 'triệu',
    label: 'danh tính mạng xã hội',
    note: '77,6% dân số',
    source: 'DataReportal, Digital 2026 (10/2025)',
  },
  {
    value: 39, decimals: 0, unit: 'tỷ USD',
    label: 'quy mô kinh tế số Việt Nam 2025',
    note: 'Tăng 17% so với 2024',
    source: 'e-Conomy SEA 2025 (ước tính)',
  },
  {
    value: 25, decimals: 0, unit: 'tỷ USD', prefix: 'Hơn ',
    label: 'thương mại điện tử 2025',
    note: 'Khoảng 2/3 kinh tế số',
    source: 'e-Conomy SEA 2025 (ước tính)',
  },
];

const WHY_MARKETING = [
  { icon: Target, photo: 'why-demand', title: 'Tạo ra nhu cầu', text: 'Sản phẩm tốt mà không ai biết tới thì cũng như chưa tồn tại.' },
  { icon: Heart, photo: 'why-trust', title: 'Xây dựng niềm tin', text: 'Thương hiệu mạnh khiến khách chọn bạn mà không cần mặc cả.' },
  { icon: TrendingUp, photo: 'why-revenue', title: 'Kéo doanh thu', text: 'Một chiến dịch đúng là một kênh bán hàng chạy suốt 24/7.' },
  { icon: Compass, photo: 'why-strategy', title: 'Định hướng kinh doanh', text: 'Marketing mang tiếng nói khách hàng vào bàn chiến lược.' },
];

const COMPARE_ROWS = [
  { label: 'Đo lường', old: 'Ước lượng, khó biết ai đã xem', next: 'Đếm từng lượt xem, lượt nhấp, đơn hàng' },
  { label: 'Nhắm mục tiêu', old: 'Phủ rộng theo khu vực', next: 'Theo độ tuổi, sở thích, hành vi' },
  { label: 'Ngân sách', old: 'Chi lớn, trả trước', next: 'Bắt đầu nhỏ, tăng dần theo hiệu quả' },
  { label: 'Tối ưu', old: 'Hết chiến dịch mới biết kết quả', next: 'Điều chỉnh ngay trong ngày' },
  { label: 'Tương tác', old: 'Một chiều', next: 'Hai chiều, phản hồi tức thì' },
];

/* `photo` là khoá trong data/homePhotos.js, cùng thứ tự với chặng. */
const JOURNEY_PHOTOS = ['journey-awareness', 'journey-interest', 'journey-consideration', 'journey-purchase', 'journey-loyalty'];

const JOURNEY = [
  { stage: 'Nhận biết', ask: '“Thương hiệu này là ai?”', channels: ['Mạng xã hội', 'Video ngắn', 'KOL / KOC'], metrics: 'Reach, lượt xem' },
  { stage: 'Quan tâm', ask: '“Nó có hợp với mình không?”', channels: ['Content', 'SEO', 'Fanpage'], metrics: 'CTR, thời gian xem' },
  { stage: 'Cân nhắc', ask: '“So với lựa chọn khác thì sao?”', channels: ['Review', 'Livestream', 'Remarketing'], metrics: 'Lượt lưu, thêm vào giỏ' },
  { stage: 'Mua hàng', ask: '“Mua ở đâu cho tiện?”', channels: ['Sàn TMĐT', 'Website', 'Chat bán hàng'], metrics: 'Tỷ lệ chuyển đổi, CPA' },
  { stage: 'Trung thành', ask: '“Có nên quay lại và giới thiệu?”', channels: ['Email', 'Zalo OA', 'CRM'], metrics: 'Tỷ lệ mua lại, LTV' },
];

const ECOSYSTEM = [
  { icon: Search, title: 'SEO & SEM', text: 'Xuất hiện đúng lúc khách đang tìm.' },
  { icon: Share2, title: 'Social Media', text: 'Nơi khách dành nhiều giờ nhất mỗi ngày.' },
  { icon: PenTool, title: 'Content', text: 'Lý do để khách dừng lướt và ở lại.' },
  { icon: MousePointerClick, title: 'Quảng cáo trả phí', text: 'Tăng tốc, nhắm chính xác, đo từng đồng.' },
  { icon: Mail, title: 'Email & CRM', text: 'Giữ chân khách cũ, rẻ hơn tìm khách mới.' },
  { icon: BrainCircuit, title: 'Data & AI', text: 'Biến dữ liệu thành quyết định nhanh hơn.' },
];

const ORBIT_CHANNELS = ['Social', 'Search', 'Video', 'E-commerce', 'Email', 'AI'];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const formatVi = (n, decimals) =>
  n.toLocaleString('vi-VN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/*
  Hiện dần từng khối khi cuộn tới. Lớp ẩn ban đầu chỉ được gắn khi trình duyệt
  có IntersectionObserver — thiếu nó mà vẫn ẩn thì cả trang trắng trơn.
*/
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) return;

    root.classList.add('home-reveal-ready');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.15 }
    );
    root.querySelectorAll('.home-reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

/* Đếm số từ 0 khi ô số liệu cuộn vào tầm nhìn. Giá trị mặc định là SỐ THẬT,
   để máy không chạy được hiệu ứng vẫn thấy đúng con số. */
function CountUp({ value, decimals }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) return;

    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / 1400);
        const eased = 1 - Math.pow(1 - p, 3);
        setShown(value * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      setShown(0);
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });

    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);

  return <span ref={ref}>{formatVi(shown, decimals)}</span>;
}

/*
  Ảnh chụp thật từ Wikimedia Commons (data/homePhotos.js).

  Ảnh hỏng thì ẨN HẲN khung, không để ô vỡ — cùng cách LessonPhoto làm.
  Giấy phép CC BY / CC BY-SA bắt buộc ghi tác giả, giấy phép và đường dẫn
  nguồn, nên dòng ghi công luôn đi kèm ảnh và bấm được về trang gốc.
*/
function HomePhoto({ id, label, className = '' }) {
  const photo = HOME_PHOTOS[id];
  const [failed, setFailed] = useState(false);
  if (!photo || failed) return null;

  return (
    <figure className={`home-photo ${className}`}>
      <img
        src={photo.url}
        alt={photo.caption}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
      {label && <span className="home-photo-label">{label}</span>}
      <figcaption>
        <a href={photo.source} target="_blank" rel="noopener noreferrer" title={photo.credit} onClick={(e) => e.stopPropagation()}>
          {photo.credit}
        </a>
      </figcaption>
    </figure>
  );
}

function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="home-reveal max-w-2xl mx-auto text-center space-y-3 mb-8 sm:mb-10">
      <p className="home-eyebrow">{eyebrow}</p>
      <h2 className="home-h2">{title}</h2>
      {sub && <p className="home-muted text-sm sm:text-base">{sub}</p>}
    </div>
  );
}

export default function HomeLanding({
  onStartLearning,
  startLabel = 'Bắt đầu học ngay',
  onOpenCourse,
  onRegisterCTA,
  totalModules = 11,
  trafficStats = { totalTraffic: 0, totalEnrolled: 0, totalGraduates: 0 },
  newsFeed = [],
  onOpenNews,
  onOpenAllNews,
  onOpenTerm,
  onOpenGlossary,
  onOpenTool,
  onOpenAllTools,
}) {
  const rootRef = useReveal();
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(() => !prefersReducedMotion());

  // Hành trình tự chạy qua từng chặng cho tới khi người xem tự bấm chọn.
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => setStep((s) => (s + 1) % JOURNEY.length), 4500);
    return () => clearInterval(id);
  }, [autoPlay]);

  // Ảnh của mỗi chặng chỉ dựng khi chặng đó được chọn, nên chuyển chặng là
  // khung ảnh trắng một nhịp trong lúc tải. Tải trước cả năm ảnh khi trang đã
  // yên, để không giành băng thông với ảnh bìa và phần đầu trang.
  useEffect(() => {
    const id = setTimeout(() => {
      JOURNEY_PHOTOS.forEach((key) => {
        const url = HOME_PHOTOS[key]?.url;
        if (url) new Image().src = url;
      });
    }, 3000);
    return () => clearTimeout(id);
  }, []);

  const pickStep = (i) => {
    setAutoPlay(false);
    setStep(i);
  };

  const current = JOURNEY[step];

  return (
    <div ref={rootRef} className="home">

      {/* 1. HERO */}
      <section className="home-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-6 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <p className="home-eyebrow inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Học Viện P MARCOM
            </p>
            <h1 className="home-h1">
              Marketing không phải chi phí.
              <span className="home-gradient-text block">Đó là động cơ tăng trưởng.</span>
            </h1>
            <p className="home-muted text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
              Khách hàng của bạn đang ở trên điện thoại. Digital Marketing giúp gặp đúng người,
              đúng lúc, và đo được từng đồng ngân sách.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <button type="button" onClick={onStartLearning} className="home-btn home-btn-primary">
                {startLabel} <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={onOpenCourse} className="home-btn home-btn-ghost">
                Xem lộ trình {totalModules} chuyên đề
              </button>
            </div>
          </div>

          {/* Quỹ đạo kênh quanh khách hàng: hình hoá ý "mọi kênh xoay quanh
              khách hàng" mà không cần thêm một câu chữ nào. */}
          <div className="flex justify-center" aria-hidden="true">
            <div className="home-orbit">
              <div className="home-orbit-ring home-orbit-ring-outer" />
              <div className="home-orbit-ring home-orbit-ring-inner" />
              <div className="home-orbit-spin">
                {ORBIT_CHANNELS.map((name, i) => (
                  <div
                    key={name}
                    className="home-orbit-item"
                    style={{ '--a': `${(360 / ORBIT_CHANNELS.length) * i}deg` }}
                  >
                    <div className="home-orbit-counter">
                      <span className="home-orbit-chip">{name}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="home-orbit-core">
                <Users className="w-7 h-7" />
                <span>Khách hàng</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 2. SỐ LIỆU THỊ TRƯỜNG */}
        <section className="home-section">
          <SectionHead
            eyebrow="Thị trường không chờ ai"
            title="Người Việt đã sống trên môi trường số"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {MARKET_STATS.map((s) => (
              <div key={s.label} className="home-reveal home-card home-stat">
                <div className="home-stat-value">
                  {s.prefix}<CountUp value={s.value} decimals={s.decimals} />
                  <span className="home-stat-unit"> {s.unit}</span>
                </div>
                <p className="home-stat-label">{s.label}</p>
                <p className="home-stat-note">{s.note}</p>
                <p className="home-source">{s.source}</p>
              </div>
            ))}
          </div>
          <p className="home-source text-center mt-4">
            Nguồn: DataReportal – Digital 2026: Vietnam; Google, Temasek, Bain &amp; Company – e-Conomy SEA 2025.
          </p>
        </section>

        {/* TIN TỨC LIVE — ngay sau số liệu thị trường: số liệu nói thị trường
            lớn, bản tin cho thấy nó đang chuyển động từng ngày. */}
        <HomeNews newsFeed={newsFeed} onOpenNews={onOpenNews} onOpenAllNews={onOpenAllNews} />

        {/* 3. VÌ SAO MARKETING QUAN TRỌNG */}
        <section className="home-section">
          <SectionHead
            eyebrow="Vì sao Marketing quan trọng"
            title="Bán hàng là kết quả. Marketing là nguyên nhân."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {WHY_MARKETING.map(({ icon: Icon, photo, title, text }) => (
              <div key={title} className="home-reveal home-card home-why">
                <HomePhoto id={photo} className="home-why-photo" />
                <div className="home-why-body">
                  <span className="home-icon"><Icon className="w-5 h-5" /></span>
                  <h3 className="home-h3">{title}</h3>
                  <p className="home-muted text-sm">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. TRUYỀN THỐNG VÀ DIGITAL */}
        <section className="home-section">
          <SectionHead
            eyebrow="Truyền thống và Digital"
            title="Cùng một ngân sách, khác ở chỗ biết rõ nó đi đâu"
          />
          <div className="home-reveal grid grid-cols-2 gap-3 sm:gap-5 mb-4 sm:mb-5">
            <HomePhoto id="compare-traditional" label="Truyền thống" className="home-compare-photo is-old" />
            <HomePhoto id="compare-digital" label="Digital" className="home-compare-photo" />
          </div>
          <div className="home-reveal home-card home-compare">
            <div className="home-compare-head">
              <span />
              <span>Truyền thống</span>
              <span className="home-compare-digital">Digital</span>
            </div>
            {COMPARE_ROWS.map((r) => (
              <div key={r.label} className="home-compare-row">
                <span className="home-compare-label">{r.label}</span>
                <span className="home-compare-old">{r.old}</span>
                <span className="home-compare-new">{r.next}</span>
              </div>
            ))}
          </div>
          <p className="home-muted text-sm text-center mt-4">
            Digital không thay thế kênh truyền thống. Nó giúp mọi kênh đều đo được.
          </p>
        </section>

        {/* 5. HÀNH TRÌNH KHÁCH HÀNG SỐ */}
        <section className="home-section">
          <SectionHead
            eyebrow="Hành trình khách hàng số"
            title="Mỗi chặng một câu hỏi, mỗi câu hỏi một kênh trả lời"
          />
          <div className="home-reveal">
            <div className="home-journey" role="tablist" aria-label="Các chặng hành trình khách hàng">
              {JOURNEY.map((j, i) => (
                <button
                  key={j.stage}
                  type="button"
                  role="tab"
                  aria-selected={i === step}
                  onClick={() => pickStep(i)}
                  className={`home-journey-step ${i === step ? 'is-active' : ''} ${i < step ? 'is-past' : ''}`}
                >
                  <span className="home-journey-dot">{i + 1}</span>
                  <span className="home-journey-name">{j.stage}</span>
                </button>
              ))}
            </div>
            <div key={step} className="home-card home-journey-panel" role="tabpanel">
              <HomePhoto id={JOURNEY_PHOTOS[step]} className="home-journey-photo" />
              <div className="home-journey-content">
                <p className="home-label">Chặng {step + 1} · {current.stage}</p>
                <p className="home-journey-ask">{current.ask}</p>
                <div className="flex flex-wrap gap-2">
                  {current.channels.map((c) => (
                    <span key={c} className="home-chip">{c}</span>
                  ))}
                </div>
                <p className="home-muted text-sm">
                  Chỉ số cần theo dõi: <strong className="home-strong">{current.metrics}</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. HỆ SINH THÁI KÊNH */}
        <section className="home-section">
          <SectionHead
            eyebrow="Hệ sinh thái Digital Marketing"
            title="Sáu mảnh ghép của một chiến lược hoàn chỉnh"
          />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {ECOSYSTEM.map(({ icon: Icon, title, text }) => (
              <div key={title} className="home-reveal home-card home-eco">
                <span className="home-icon home-icon-accent"><Icon className="w-5 h-5" /></span>
                <div>
                  <h3 className="home-h3">{title}</h3>
                  <p className="home-muted text-sm">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <HomeGlossary onOpenTerm={onOpenTerm} onOpenGlossary={onOpenGlossary} />

        <HomeToolkit onOpenTool={onOpenTool} onOpenAllTools={onOpenAllTools} />

        {/* 7. LỜI MỜI CUỐI TRANG — chỗ duy nhất nhắc tới giá, đúng như đã chốt:
            một lời kêu gọi đăng ký, không lặp lại khắp trang. */}
        <section className="home-section pb-12 sm:pb-16">
          <div className="home-reveal home-cta">
            <div className="space-y-4 text-center max-w-2xl mx-auto">
              <h2 className="home-h2">Biến hiểu biết thành kỹ năng</h2>
              <p className="home-muted text-sm sm:text-base">
                {totalModules} chuyên đề từ nền tảng tới chiến lược, trắc nghiệm tình huống thực tế
                và chứng nhận khi hoàn thành.
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-1">
                <button type="button" onClick={onStartLearning} className="home-btn home-btn-primary">
                  {startLabel} <ArrowRight className="w-4 h-4" />
                </button>
                <button type="button" onClick={onRegisterCTA} className="home-btn home-btn-offer">
                  {/* Bọc một span: nút là inline-flex, để rời thì chữ và thẻ
                      <s> thành ba ô flex riêng và vỡ dòng lung tung. */}
                  <span>Giá trị <s>2.999.999 VNĐ</s> · Chỉ còn 39 suất</span>
                </button>
              </div>
            </div>

            <div className="home-cta-stats">
              <div>
                <Eye className="w-4 h-4" />
                <strong>{(trafficStats?.totalTraffic || 0).toLocaleString('vi-VN')}</strong>
                <span>lượt truy cập</span>
              </div>
              <div>
                <Users className="w-4 h-4" />
                <strong>{(trafficStats?.totalEnrolled || 0).toLocaleString('vi-VN')}</strong>
                <span>học viên</span>
              </div>
              <div>
                <Award className="w-4 h-4" />
                <strong>{(trafficStats?.totalGraduates || 0).toLocaleString('vi-VN')}</strong>
                <span>đạt chứng nhận</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
