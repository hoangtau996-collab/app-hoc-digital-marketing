import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ChevronRight,
  Filter,
  GitCompare,
  Globe,
  PieChart,
  PlayCircle,
  Radio,
  Repeat,
  Search,
  Users,
  Wrench,
} from 'lucide-react';
import NewsIllustration from './NewsIllustration';
import { GLOSSARY_ITEMS } from '../data/glossaryData';
import { relativeNewsDate } from '../utils/newsDate';
import { safeDiv, num } from '../utils/toolFormat';

/*
  BA MỤC "SỐNG" CỦA TRANG CHỦ: tin tức, thuật ngữ, công cụ tính.

  Đều là cửa ngõ dẫn sang trang đầy đủ (`/ban-tin`, `/thuat-ngu`, `/cong-cu`),
  không chép lại nội dung các trang đó. Mỗi mục chỉ lấy đúng phần đủ để người
  xem muốn bấm vào: 3 tin, 1 thuật ngữ trong ngày, 1 máy tính.

  Màu theo nhóm lớp `.home-*` trong index.css, cùng lý do ghi ở HomeLanding.
*/

/* ---------------------------------------------------------------------------
   TIN TỨC LIVE
   --------------------------------------------------------------------------- */

/* Chỉ lấy tin THẬT (có `sourceUrl`). Tin mô phỏng do nút Live sinh ra chỉ nằm
   trong máy người bấm và là kịch bản đào tạo — đưa ra mặt tiền trang chủ thì
   người mới vào tưởng đó là tin thị trường. */
const pickRealNews = (feed, n) => (feed || []).filter((x) => x && x.sourceUrl).slice(0, n);

function HomeNewsImage({ news }) {
  const [failed, setFailed] = useState(false);
  const url = news.image?.url;

  if (url && !failed) {
    return (
      <img
        src={url}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="home-news-img"
      />
    );
  }
  // Ảnh báo gốc hỏng thì dùng tranh vẽ sẵn của tin, giống trang Bản Tin.
  return (
    <div className="home-news-fallback">
      {news.illustration ? <NewsIllustration name={news.illustration} /> : <Radio className="w-8 h-8" />}
    </div>
  );
}

export function HomeNews({ newsFeed, onOpenNews, onOpenAllNews }) {
  const items = pickRealNews(newsFeed, 3);
  if (items.length === 0) return null;

  return (
    <section className="home-section">
      <div className="home-reveal flex flex-wrap items-end justify-between gap-3 mb-6 sm:mb-8">
        <div className="space-y-2">
          <p className="home-eyebrow inline-flex items-center gap-2">
            <span className="home-live-dot" /> Bản tin thuật toán · Live
          </p>
          <h2 className="home-h2">Thị trường thay đổi mỗi ngày</h2>
        </div>
        <button type="button" onClick={onOpenAllNews} className="home-link">
          Xem tất cả bản tin <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
        {items.map((news) => (
          <button
            key={news.id}
            type="button"
            onClick={() => onOpenNews(news.id)}
            className="home-reveal home-card home-news-card"
          >
            <div className="home-news-media">
              <HomeNewsImage news={news} />
              <span className="home-news-badge">{news.category}</span>
            </div>
            <div className="home-news-body">
              <h3 className="home-h3 home-clamp-3">{news.title}</h3>
              <p className="home-news-meta">
                {news.source} · {relativeNewsDate(news.publishedAt, news.receivedAt)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   THƯ VIỆN THUẬT NGỮ
   --------------------------------------------------------------------------- */

/* Thuật ngữ hay gặp nhất khi đọc báo cáo quảng cáo. Định danh phải có thật
   trong glossaryData — id nào không còn thì tự bị lọc bỏ, không ra chip chết. */
const POPULAR_TERM_IDS = ['roas', 'cpa', 'ctr', 'cpm', 'ltv', 'cac', 'aov', 'seo', 'retargeting', 'kol-koc', 'marketing-funnel', 'aida'];

/* Bỏ dấu để gõ "chuyen doi" vẫn ra "Chuyển đổi". */
const fold = (s) =>
  String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

/* Thuật ngữ của ngày: đổi theo ngày lịch của máy, mọi người cùng ngày thấy
   cùng một thuật ngữ. */
const termOfToday = () => {
  const d = new Date();
  const dayNumber = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  return GLOSSARY_ITEMS[dayNumber % GLOSSARY_ITEMS.length];
};

/* Tên ngắn cho chip: "ROAS (Return on Ad Spend)" → "ROAS". */
const shortTerm = (term) => String(term).split(' (')[0];

export function HomeGlossary({ onOpenTerm, onOpenGlossary }) {
  const [query, setQuery] = useState('');
  const today = useMemo(termOfToday, []);
  const popular = useMemo(
    () => POPULAR_TERM_IDS.map((id) => GLOSSARY_ITEMS.find((g) => g.id === id)).filter(Boolean),
    []
  );

  const results = useMemo(() => {
    const q = fold(query.trim());
    if (q.length < 2) return [];
    const inTerm = GLOSSARY_ITEMS.filter((g) => fold(g.term).includes(q));
    const inDef = GLOSSARY_ITEMS.filter((g) => !inTerm.includes(g) && fold(g.shortDef).includes(q));
    return [...inTerm, ...inDef].slice(0, 6);
  }, [query]);

  return (
    <section className="home-section">
      <div className="home-reveal max-w-2xl mx-auto text-center space-y-3 mb-8 sm:mb-10">
        <p className="home-eyebrow">Thư viện thuật ngữ</p>
        <h2 className="home-h2">Nói cùng một ngôn ngữ với đội Marketing</h2>
        <p className="home-muted text-sm sm:text-base">
          {GLOSSARY_ITEMS.length} thuật ngữ, mỗi thuật ngữ kèm công thức, ví dụ và lưu ý thực chiến.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-4 sm:gap-5">
        <div className="home-reveal home-card p-5 sm:p-7 space-y-5">
          <label className="home-search">
            <Search className="w-5 h-5 shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tra nhanh: ROAS, chuyển đổi, phễu…"
              aria-label="Tra cứu thuật ngữ"
            />
          </label>

          {query.trim().length >= 2 && (
            <ul className="home-search-results">
              {results.length === 0 && <li className="home-muted text-sm px-3 py-2">Chưa có thuật ngữ khớp.</li>}
              {results.map((g) => (
                <li key={g.id}>
                  <button type="button" onClick={() => onOpenTerm(g.id)}>
                    <strong>{g.term}</strong>
                    <span>{g.shortDef}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-3">
            <p className="home-label">Hay gặp nhất</p>
            <div className="flex flex-wrap gap-2">
              {popular.map((g) => (
                <button key={g.id} type="button" onClick={() => onOpenTerm(g.id)} className="home-chip home-chip-btn">
                  {shortTerm(g.term)}
                </button>
              ))}
            </div>
          </div>

          <button type="button" onClick={onOpenGlossary} className="home-link">
            <BookOpen className="w-4 h-4" /> Mở toàn bộ từ điển <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {today && (
          <div className="home-reveal home-card home-term-today">
            <p className="home-label">Thuật ngữ của ngày</p>
            <h3 className="home-term-title">{today.term}</h3>
            <p className="home-muted text-sm">{today.shortDef}</p>
            {today.formula && <p className="home-formula">{today.formula}</p>}
            <button type="button" onClick={() => onOpenTerm(today.id)} className="home-btn home-btn-ghost self-start">
              Xem ví dụ & lưu ý <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   CÔNG CỤ TÍNH
   --------------------------------------------------------------------------- */

/* Nhãn khớp `MANAGER_TOOLS` trong ManagerTools.jsx; id là địa chỉ `/cong-cu/<id>`.
   Thêm công cụ mới bên đó thì thêm dòng ở đây, không thì nó không có thẻ. */
const TOOL_CARDS = [
  { id: 'budget', icon: PieChart, label: 'Phân Bổ Ngân Sách', text: 'Chia ngân sách theo kênh và mục tiêu.' },
  { id: 'roas', icon: Calculator, label: 'Hòa Vốn ROAS', text: 'Ngưỡng ROAS tối thiểu để không lỗ.' },
  { id: 'funnel', icon: Filter, label: 'Ngân Sách Ngược Phễu', text: 'Từ mục tiêu doanh số tính ra ngân sách.' },
  { id: 'ltv', icon: Repeat, label: 'LTV / CAC', text: 'Giá trị khách hàng so với chi phí có khách.' },
  { id: 'market', icon: Globe, label: 'TAM / SAM / SOM', text: 'Quy mô thị trường có thể chiếm được.' },
  { id: 'attribution', icon: GitCompare, label: 'Đối Chiếu ROAS Đa Kênh', text: 'So hiệu quả giữa các kênh quảng cáo.' },
  { id: 'video', icon: PlayCircle, label: 'Chẩn Đoán Video Ads', text: 'Tìm chỗ video quảng cáo đang hụt.' },
  { id: 'staff', icon: Users, label: 'Định Biên Nhân Sự', text: 'Ước tính đội ngũ cần cho khối lượng việc.' },
];

/* Ô nhập tiền: hiện dấu chấm ngăn nghìn khi gõ, lưu giá trị là số. */
function MoneyInput({ label, value, onChange, suffix }) {
  return (
    <label className="home-field">
      <span className="home-label">{label}</span>
      <span className="home-input-wrap">
        <input
          inputMode="numeric"
          value={value ? num(value) : ''}
          onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, '')) || 0)}
          placeholder="0"
        />
        <span className="home-input-suffix">{suffix}</span>
      </span>
    </label>
  );
}

export function HomeToolkit({ onOpenTool, onOpenAllTools }) {
  // Số mặc định là VÍ DỤ GIẢ ĐỊNH để máy tính có kết quả ngay khi mở trang.
  const [spend, setSpend] = useState(10000000);
  const [revenue, setRevenue] = useState(35000000);
  const [margin, setMargin] = useState(40);

  const roas = safeDiv(revenue, spend);
  const breakEven = safeDiv(100, margin);
  const profit = revenue * (margin / 100) - spend;
  const hasInput = spend > 0 && revenue > 0 && margin > 0;
  const verdict = !hasInput ? 'idle' : profit > 0 ? 'win' : profit < 0 ? 'loss' : 'even';

  // Thanh so sánh: lấy mốc lớn hơn trong hai số làm 100%, chừa 15% khoảng thở.
  const scale = Math.max(roas, breakEven, 0.01) * 1.15;

  return (
    <section className="home-section">
      <div className="home-reveal flex flex-wrap items-end justify-between gap-3 mb-6 sm:mb-8">
        <div className="space-y-2">
          <p className="home-eyebrow">Bộ công cụ tính</p>
          <h2 className="home-h2">Chiến dịch này lãi hay lỗ?</h2>
        </div>
        <button type="button" onClick={onOpenAllTools} className="home-link">
          <Wrench className="w-4 h-4" /> Mở bộ công cụ <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-4 sm:gap-5">
        {/* MÁY TÍNH ROAS & HOÀ VỐN chạy ngay tại chỗ */}
        <div className="home-reveal home-card p-5 sm:p-7 space-y-5">
          <div className="grid sm:grid-cols-3 gap-3">
            <MoneyInput label="Chi phí quảng cáo" value={spend} onChange={setSpend} suffix="VNĐ" />
            <MoneyInput label="Doanh thu từ quảng cáo" value={revenue} onChange={setRevenue} suffix="VNĐ" />
            <MoneyInput label="Biên lợi nhuận gộp" value={margin} onChange={(v) => setMargin(Math.min(v, 100))} suffix="%" />
          </div>

          <div className="space-y-3">
            <div className="home-bar-row">
              <span>ROAS thực tế</span>
              <div className="home-bar"><i style={{ width: `${Math.min(100, (roas / scale) * 100)}%` }} /></div>
              <strong>{num(roas, 2)}x</strong>
            </div>
            <div className="home-bar-row">
              <span>ROAS hoà vốn</span>
              <div className="home-bar home-bar-accent"><i style={{ width: `${Math.min(100, (breakEven / scale) * 100)}%` }} /></div>
              <strong>{num(breakEven, 2)}x</strong>
            </div>
          </div>

          <div className={`home-verdict is-${verdict}`}>
            {verdict === 'idle' && 'Nhập đủ ba ô để xem kết quả.'}
            {verdict !== 'idle' && (
              <>
                <span>{verdict === 'win' ? 'Có lãi' : verdict === 'loss' ? 'Đang lỗ' : 'Hoà vốn'}</span>
                <strong>{profit >= 0 ? '+' : '−'}{num(Math.abs(profit))} VNĐ</strong>
                <em>lợi nhuận gộp sau chi phí quảng cáo</em>
              </>
            )}
          </div>

          <p className="home-source">
            ROAS = Doanh thu ÷ Chi phí quảng cáo. ROAS hoà vốn = 1 ÷ Biên lợi nhuận gộp. Số mặc định là ví dụ giả định.
          </p>
        </div>

        {/* LƯỚI CÔNG CỤ ĐẦY ĐỦ */}
        <div className="grid grid-cols-2 gap-3">
          {TOOL_CARDS.map(({ id, icon: Icon, label, text }) => (
            <button key={id} type="button" onClick={() => onOpenTool(id)} className="home-reveal home-card home-tool">
              <span className="home-icon"><Icon className="w-5 h-5" /></span>
              <strong>{label}</strong>
              <span className="home-muted">{text}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
