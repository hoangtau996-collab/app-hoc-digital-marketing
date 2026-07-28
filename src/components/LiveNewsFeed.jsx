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
  X
} from 'lucide-react';
import { LIVE_NEWS_SIMULATOR_POOL } from '../data/newsData';
import NewsIllustration from './NewsIllustration';

const PAGE_SIZE = 5;

const CATEGORIES = ['All', 'Meta Ads', 'TikTok Shop & Ads', 'Google Ads & SEO', 'AI Marketing'];

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

  const filteredNews = newsList.filter(
    (n) => selectedCategory === 'All' || n.category === selectedCategory
  );
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

  const handleFetchNewUpdate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const randomItem =
        LIVE_NEWS_SIMULATOR_POOL[Math.floor(Math.random() * LIVE_NEWS_SIMULATOR_POOL.length)];
      const newItem = {
        ...randomItem,
        id: `news-${Date.now()}`,
        date: 'Vừa xong (Live Stream)',
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
              Cập nhật biến động thuật toán quảng cáo và chính sách nền tảng. Mỗi tin kèm tranh minh hoạ,
              số liệu chính, phân tích chi tiết và danh sách việc cần chỉ đạo ngay cho Trưởng phòng Digital.
            </p>
          </div>

          <button
            onClick={handleFetchNewUpdate}
            disabled={isSimulating}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold flex items-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-950/60 transition cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Nạp Tin Cập Nhật Live Mới</span>
          </button>
        </div>
      </div>

      {/* Ghi chú bản chất dữ liệu: bản tin mô phỏng phục vụ đào tạo */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#152037]/70 border border-emerald-900/50 text-[11px] md:text-xs text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Đây là bản tin mô phỏng phục vụ đào tạo.</strong>{' '}
          Nội dung được biên soạn theo các kịch bản thay đổi thuật toán có thật để luyện phản xạ ra quyết định.
          Trước khi áp dụng vào chiến dịch thật, hãy đối chiếu với thông báo chính thức của nền tảng.
        </p>
      </div>

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

              {/* Tranh minh hoạ */}
              <div className="lg:col-span-2">
                {news.illustration ? (
                  <NewsIllustration name={news.illustration} />
                ) : news.coverImage ? (
                  // Dữ liệu cũ lưu trong máy còn dùng ảnh ngoài, giữ đường lùi để không vỡ giao diện
                  <div className="w-full h-44 rounded-xl overflow-hidden border border-emerald-900/40">
                    <img
                      src={news.coverImage}
                      alt={news.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}
              </div>

              {/* Nội dung tóm tắt */}
              <div className="lg:col-span-3 space-y-3">

                {/* Hàng nhãn */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {news.category}
                    </span>
                    {news.isHot && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 flex items-center gap-1">
                        <Flame className="w-3 h-3 animate-pulse" /> ĐỘT BIẾN HOT
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{news.date}</span>
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

                <button
                  onClick={() => setOpenNews(news)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1a2742] border border-emerald-900/60 hover:border-emerald-500 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Đọc phân tích đầy đủ &amp; việc cần làm</span>
                </button>

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
                {openNews.isHot && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 flex items-center gap-1">
                    <Flame className="w-3 h-3" /> ĐỘT BIẾN HOT
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">{openNews.date}</span>
              </div>

              <h3 className="text-lg sm:text-2xl font-black text-white leading-snug">
                {openNews.title}
              </h3>

              <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-[11px] text-slate-400 border-b border-emerald-900/40 pb-4">
                {openNews.source && (
                  <span className="flex items-center gap-1.5">
                    <Newspaper className="w-3.5 h-3.5 text-emerald-400" />
                    Nguồn tham chiếu: {openNews.source}
                  </span>
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

            {/* Tranh minh hoạ */}
            {openNews.illustration && <NewsIllustration name={openNews.illustration} />}

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
