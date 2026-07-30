import React, { useState, useEffect } from 'react';
import {
  Flame,
  RefreshCw,
  AlertTriangle,
  CheckSquare,
  Sparkles,
  Clock,
  BookOpen,
  ChevronDown,
  CalendarClock,
  ShieldAlert,
  Newspaper,
  Info,
  BadgeCheck,
  FlaskConical,
  ExternalLink,
  Globe,
  X
} from 'lucide-react';
import { LIVE_NEWS_SIMULATOR_POOL } from '../data/newsData';
import NewsIllustration from './NewsIllustration';
import { relativeNewsDate, compareNewsRecency, todayVnDate } from '../utils/newsDate';

const PAGE_SIZE = 5;

const CATEGORIES = ['All', 'Meta Ads', 'TikTok Shop & Ads', 'Google Ads & SEO', 'AI Marketing'];

/**
 * Ảnh đầu bài.
 *
 * Tin thật dùng đúng ảnh bìa mà bài báo gốc đăng, kèm dòng ghi công nguồn ảnh.
 * Ảnh nằm trên máy chủ của báo nên có thể đổi đường dẫn hoặc bị chặn bất cứ lúc
 * nào; khi đó `onError` chuyển sang tranh SVG dựng sẵn thay vì để ô ảnh vỡ.
 * Tin mô phỏng không có ảnh thật nên luôn dùng tranh SVG.
 */
function NewsCover({ news }) {
  const [imageFailed, setImageFailed] = useState(false);

  // Đổi tin thì phải cho ảnh cơ hội tải lại, nếu không một tin lỗi ảnh sẽ kéo
  // theo mọi tin sau đó cùng dùng lại component này đều nhảy thẳng vào tranh.
  useEffect(() => {
    setImageFailed(false);
  }, [news.id]);

  const realImage = news.image?.url;

  if (realImage && !imageFailed) {
    return (
      <figure className="rounded-xl overflow-hidden border border-emerald-900/40 bg-[#101a2e] shadow-lg">
        <img
          src={realImage}
          alt={news.title}
          className="w-full h-44 object-cover block"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
        <figcaption className="px-3.5 py-2 text-[11px] text-slate-400 border-t border-emerald-900/50 bg-[#0a1120] flex items-center gap-1.5">
          <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          {news.image.credit || 'Ảnh từ bài viết gốc'}
        </figcaption>
      </figure>
    );
  }

  if (news.illustration) return <NewsIllustration name={news.illustration} />;

  // Dữ liệu cũ lưu trong máy còn dùng trường coverImage, giữ đường lùi cuối.
  if (news.coverImage) {
    return (
      <div className="w-full h-44 rounded-xl overflow-hidden border border-emerald-900/40">
        <img src={news.coverImage} alt={news.title} className="w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }

  return null;
}

/**
 * Dải tin quốc tế kéo thẳng từ RSS qua /api/news.
 *
 * Đây là tiêu đề nguyên văn tiếng Anh, chưa qua biên tập, nên trình bày gọn
 * dạng thẻ ngang và ghi rõ bản chất — cố ý để không lấn phần bản tin phân tích
 * tiếng Việt bên dưới.
 *
 * Chạy `npm run dev` bằng Vite thì không có hàm máy chủ nên lời gọi này hỏng.
 * Đó là chuyện bình thường ở máy lập trình, không phải sự cố: dải tin tự ẩn đi
 * thay vì bắn lỗi ra màn hình.
 */
function GlobalNewsStrip() {
  const [state, setState] = useState({ status: 'loading', items: [], fetchedAt: null });

  useEffect(() => {
    let alive = true;
    fetch('/api/news')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        if (!alive) return;
        setState({
          status: data.items?.length ? 'ready' : 'empty',
          items: data.items || [],
          fetchedAt: data.fetchedAt || null
        });
      })
      .catch(() => alive && setState({ status: 'empty', items: [], fetchedAt: null }));
    return () => {
      alive = false;
    };
  }, []);

  if (state.status === 'empty') return null;

  const updatedAt = state.fetchedAt
    ? new Date(state.fetchedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Tin nóng từ nguồn quốc tế</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            TỰ CẬP NHẬT
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          {state.status === 'loading'
            ? 'Đang lấy tin...'
            : `Tiêu đề nguyên văn tiếng Anh${updatedAt ? ` - lấy lúc ${updatedAt}` : ''}`}
        </span>
      </div>

      {state.status === 'loading' ? (
        <div className="flex gap-3 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-64 h-36 shrink-0 rounded-2xl bg-[#152037]/70 border border-emerald-900/40 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {state.items.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-64 shrink-0 snap-start rounded-2xl overflow-hidden bg-[#152037]/70 border border-emerald-900/40 hover:border-emerald-500/60 transition group"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-24 object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                  <Newspaper className="w-3 h-3" />
                  {item.source}
                  {item.publishedAt && <span className="text-slate-500 font-normal">- {item.publishedAt}</span>}
                </div>
                <p className="text-xs text-slate-200 font-semibold leading-snug line-clamp-3 group-hover:text-white">
                  {item.title}
                </p>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Mở bài gốc
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

/* Nhãn phân biệt tin có nguồn kiểm chứng với kịch bản mô phỏng đào tạo */
function OriginBadge({ news }) {
  if (news.sourceUrl) {
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
        <BadgeCheck className="w-3 h-3" /> TIN THẬT - CÓ NGUỒN
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700 flex items-center gap-1">
      <FlaskConical className="w-3 h-3" /> MÔ PHỎNG ĐÀO TẠO
    </span>
  );
}

/* Dải số liệu chính, dùng chung cho thẻ tin và cửa sổ chi tiết */
function KeyNumbers({ items, compact = false }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className={`grid gap-2 ${items.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {items.map((n, idx) => (
        <div
          key={idx}
          className="p-2.5 rounded-xl bg-[#152037]/70 border border-emerald-900/50 text-center"
        >
          <div className={`font-black text-emerald-300 ${compact ? 'text-sm' : 'text-base md:text-lg'}`}>
            {n.value}
          </div>
          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{n.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function LiveNewsFeed({ newsList, onAddNewNews }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSimulating, setIsSimulating] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openNews, setOpenNews] = useState(null);

  const filteredNews = newsList
    .filter((n) => selectedCategory === 'All' || n.category === selectedCategory)
    .slice()
    .sort(compareNewsRecency);
  const visibleNews = filteredNews.slice(0, visibleCount);
  const remaining = filteredNews.length - visibleNews.length;

  // Đổi bộ lọc thì quay lại trang đầu, nếu không người dùng đang ở trang 4 sẽ
  // thấy một danh sách ngắn hơn số tin thật của nhóm vừa chọn.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory]);

  // Khoá cuộn nền khi mở cửa sổ chi tiết
  useEffect(() => {
    if (!openNews) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openNews]);

  // Đã nạp hết kho tin mô phỏng hay chưa. Bản trước bốc ngẫu nhiên nên bấm vài
  // lần là ra lại đúng tin vừa đọc, người dùng tưởng nút hỏng.
  const usedTitles = new Set(newsList.map((n) => n.title));
  const unusedPool = LIVE_NEWS_SIMULATOR_POOL.filter((n) => !usedTitles.has(n.title));
  const poolExhausted = unusedPool.length === 0;

  const handleFetchNewUpdate = () => {
    if (poolExhausted) return;
    setIsSimulating(true);
    setTimeout(() => {
      const pick = unusedPool[Math.floor(Math.random() * unusedPool.length)];
      const newItem = {
        ...pick,
        id: `news-live-${Date.now()}`,
        // Ngày đăng đặt bằng hôm nay và ghi mốc nhận tin, để nhãn thời gian
        // già đi theo ngày thay vì kẹt ở 'Vừa xong' mãi mãi.
        publishedAt: todayVnDate(),
        receivedAt: Date.now(),
        isSimulated: true,
        isHot: true
      };
      onAddNewNews(newItem);
      // Tin mới chèn lên đầu danh sách nên phải nới ô hiển thị, nếu không tin
      // cuối trang hiện tại bị đẩy khuất và người dùng tưởng nút không chạy.
      setVisibleCount((c) => c + 1);
      setIsSimulating(false);
    }, 800);
  };

  return (
    <div className="space-y-8">

      {/* Header Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden bg-glow-radial">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-400 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              LIVE PLATFORM ALGORITHM UPDATES
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              BẢN TIN THUẬT TOÁN META, TIKTOK, GOOGLE
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Cập nhật biến động thuật toán quảng cáo và chính sách nền tảng. Mỗi tin kèm ảnh minh hoạ,
              số liệu chính, phân tích chi tiết và danh sách việc cần chỉ đạo ngay cho Trưởng phòng Digital.
            </p>
          </div>

          <button
            onClick={handleFetchNewUpdate}
            disabled={isSimulating || poolExhausted}
            title={poolExhausted ? 'Đã nạp hết kho tin mô phỏng' : undefined}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold flex items-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-950/60 transition cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>
              {poolExhausted
                ? 'Đã nạp hết kho tin mô phỏng'
                : `Nạp Tin Mô Phỏng (còn ${unusedPool.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Ghi chú bản chất dữ liệu: bản tin gồm hai loại, phải nói rõ loại nào là loại nào */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#152037]/70 border border-emerald-900/50 text-[11px] md:text-xs text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Bản tin gồm hai loại, đọc nhãn trên từng thẻ.</strong>{' '}
          Thẻ gắn nhãn <strong className="text-emerald-400">TIN THẬT - CÓ NGUỒN</strong> được biên tập lại từ bài
          báo có thật, kèm ảnh bìa và đường dẫn tới bài gốc để tự đối chiếu. Thẻ gắn nhãn{' '}
          <strong className="text-slate-300">MÔ PHỎNG ĐÀO TẠO</strong> là kịch bản dựng để luyện phản xạ ra quyết
          định, số liệu chưa kiểm chứng. Dù đọc loại nào, hãy đối chiếu thông báo chính thức của nền tảng trước
          khi áp dụng vào chiến dịch thật.
        </p>
      </div>

      {/* Dải tin quốc tế tự cập nhật */}
      <GlobalNewsStrip />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-emerald-900/40">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-[#18243d] text-slate-400 hover:text-white border border-emerald-900/40'
            }`}
          >
            {cat === 'All' ? 'Tất cả nền tảng' : cat}
          </button>
        ))}
      </div>

      {/* Đếm kết quả */}
      <div className="flex items-center justify-between text-xs text-slate-400 -mt-4">
        <span>
          Hiển thị <strong className="text-emerald-400">{visibleNews.length}</strong> / {filteredNews.length} tin
          {selectedCategory !== 'All' && <> thuộc nhóm <strong className="text-slate-300">{selectedCategory}</strong></>}
        </span>
        <span className="hidden sm:inline">Mỗi lần tải {PAGE_SIZE} tin</span>
      </div>

      {/* News Stream List */}
      <div className="space-y-6">
        {visibleNews.map((news) => (
          <article
            key={news.id}
            className="glass-panel rounded-2xl p-5 md:p-6 border border-emerald-900/40 hover:border-emerald-500/40 transition duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

              {/* Ảnh đầu bài: ảnh thật của bài báo, hoặc tranh SVG */}
              <div className="lg:col-span-2">
                <NewsCover news={news} />
              </div>

              {/* Nội dung tóm tắt */}
              <div className="lg:col-span-3 space-y-3">

                {/* Hàng nhãn */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {news.category}
                    </span>
                    <OriginBadge news={news} />
                    {news.isHot && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 flex items-center gap-1">
                        <Flame className="w-3 h-3 animate-pulse" /> ĐỘT BIẾN HOT
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {relativeNewsDate(news.publishedAt, news.receivedAt)}
                  </span>
                </div>

                {/* Tiêu đề */}
                <h3 className="text-base md:text-lg font-bold text-white leading-snug">
                  {news.title}
                </h3>

                {/* Siêu dữ liệu bài viết */}
                <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-[11px] text-slate-400">
                  {news.source && (
                    <span className="flex items-center gap-1.5">
                      <Newspaper className="w-3.5 h-3.5 text-emerald-400" />
                      {news.source}
                    </span>
                  )}
                  {news.publishedAt && (
                    <span className="flex items-center gap-1.5">
                      <CalendarClock className="w-3.5 h-3.5 text-emerald-400" />
                      {news.publishedAt}
                    </span>
                  )}
                  {news.readTime && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {news.readTime}
                    </span>
                  )}
                </div>

                {/* Đoạn dẫn */}
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {news.summary}
                </p>

                {/* Số liệu chính */}
                <KeyNumbers items={news.keyNumbers} compact />

                {/* Thẻ chủ đề */}
                {Array.isArray(news.tags) && news.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {news.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#18243d] text-slate-400 border border-emerald-900/40"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setOpenNews(news)}
                    className="px-4 py-2.5 rounded-xl bg-[#1a2742] border border-emerald-900/60 hover:border-emerald-500 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Đọc phân tích đầy đủ &amp; việc cần làm</span>
                  </button>

                  {news.sourceUrl && (
                    <a
                      href={news.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#152037] border border-emerald-900/60 hover:border-emerald-500 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Bài gốc</span>
                    </a>
                  )}
                </div>

              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Tải thêm */}
      {remaining > 0 && (
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="px-6 py-3 rounded-2xl bg-[#18243d] border border-emerald-900/60 hover:border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
            <span>Xem thêm {Math.min(PAGE_SIZE, remaining)} tin (còn {remaining})</span>
          </button>
        </div>
      )}

      {remaining === 0 && filteredNews.length > PAGE_SIZE && (
        <p className="text-center text-xs text-slate-400">Đã hiển thị hết {filteredNews.length} tin của nhóm này.</p>
      )}

      {filteredNews.length === 0 && (
        <div className="text-center py-12 glass-panel rounded-2xl border border-emerald-900/40 space-y-3">
          <Newspaper className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-sm font-bold text-white">Chưa có tin nào trong nhóm này</h4>
          <p className="text-xs text-slate-400">Chọn nhóm khác hoặc bấm Nạp Tin Cập Nhật Live Mới.</p>
        </div>
      )}

      {/* CỬA SỔ CHI TIẾT BÀI VIẾT */}
      {openNews && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setOpenNews(null)}
        >
          <div
            className="relative w-full max-w-3xl my-4 glass-panel rounded-3xl border border-emerald-500/40 p-5 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenNews(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer z-10"
              aria-label="Đóng bài viết"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Đầu bài */}
            <div className="space-y-3 pr-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {openNews.category}
                </span>
                <OriginBadge news={openNews} />
                {openNews.isHot && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 flex items-center gap-1">
                    <Flame className="w-3 h-3" /> ĐỘT BIẾN HOT
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">
                  {relativeNewsDate(openNews.publishedAt, openNews.receivedAt)}
                </span>
              </div>

              <h3 className="text-lg sm:text-2xl font-black text-white leading-snug">
                {openNews.title}
              </h3>

              <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-[11px] text-slate-400 border-b border-emerald-900/40 pb-4">
                {openNews.source && (
                  <span className="flex items-center gap-1.5">
                    <Newspaper className="w-3.5 h-3.5 text-emerald-400" />
                    {openNews.sourceUrl ? 'Nguồn: ' : 'Nguồn tham chiếu: '}
                    {openNews.source}
                  </span>
                )}
                {openNews.sourceUrl && (
                  <a
                    href={openNews.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Mở bài gốc
                  </a>
                )}
                {openNews.publishedAt && (
                  <span className="flex items-center gap-1.5">
                    <CalendarClock className="w-3.5 h-3.5 text-emerald-400" />
                    {openNews.publishedAt}
                  </span>
                )}
                {openNews.readTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    {openNews.readTime}
                  </span>
                )}
              </div>
            </div>

            {/* Ảnh đầu bài */}
            <NewsCover news={openNews} />

            {/* Tin mô phỏng phải nhắc lại bản chất ngay trong bài, vì người đọc
                mở thẳng cửa sổ chi tiết có thể không thấy băng ghi chú ở ngoài */}
            {!openNews.sourceUrl && (
              <p className="text-[11px] text-slate-400 flex items-start gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <FlaskConical className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Tin mô phỏng theo kịch bản đào tạo. Số liệu trong bài dùng để luyện phản xạ ra quyết định,
                  không phải số liệu đã kiểm chứng. Đối chiếu thông báo chính thức của nền tảng trước khi áp dụng.
                </span>
              </p>
            )}

            {/* Đoạn dẫn */}
            <p className="text-sm text-slate-200 leading-relaxed font-medium bg-[#152037]/60 p-4 rounded-xl border border-emerald-950">
              {openNews.summary}
            </p>

            {/* Số liệu chính */}
            <KeyNumbers items={openNews.keyNumbers} />

            {/* Mốc áp dụng */}
            {openNews.deadline && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-900/50 text-xs text-rose-300 font-bold">
                <CalendarClock className="w-4 h-4 shrink-0" />
                {openNews.deadline}
              </div>
            )}

            {/* Thân bài */}
            {Array.isArray(openNews.content) && openNews.content.length > 0 && (
              <div className="space-y-4">
                {openNews.content.map((sec, idx) => (
                  <section key={idx} className="space-y-1.5">
                    <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-950 border border-emerald-800 text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      {sec.heading}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-7">
                      {sec.body}
                    </p>
                  </section>
                ))}
              </div>
            )}

            {/* Tác động và rủi ro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/40 text-xs text-amber-200 space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Tác động tới Trưởng phòng:
                </div>
                <p className="leading-relaxed">{openNews.impact}</p>
              </div>

              {openNews.ifIgnored && (
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/40 text-xs text-rose-200 space-y-1">
                  <div className="font-bold text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Cái giá nếu bỏ qua:
                  </div>
                  <p className="leading-relaxed">{openNews.ifIgnored}</p>
                </div>
              )}
            </div>

            {/* Việc cần làm */}
            {Array.isArray(openNews.actionChecklist) && openNews.actionChecklist.length > 0 && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/40 space-y-2">
                <div className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4" /> Hành động chỉ đạo ngay:
                </div>
                <ul className="space-y-1.5">
                  {openNews.actionChecklist.map((act, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => setOpenNews(null)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition cursor-pointer"
              >
                Đã Nắm Thông Tin
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
