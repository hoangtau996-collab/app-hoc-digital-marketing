import React, { useState } from 'react';
import { 
  Flame, 
  RefreshCw, 
  Filter, 
  Zap, 
  CheckSquare, 
  AlertTriangle, 
  ExternalLink,
  Sparkles,
  Search,
  Video,
  Globe
} from 'lucide-react';
import { LIVE_NEWS_SIMULATOR_POOL } from '../data/newsData';

export default function LiveNewsFeed({ newsList, onAddNewNews }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSimulating, setIsSimulating] = useState(false);

  const filteredNews = newsList.filter(n => 
    selectedCategory === 'All' || n.category === selectedCategory
  );

  const handleFetchNewUpdate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Pick a random item from pool
      const randomItem = LIVE_NEWS_SIMULATOR_POOL[Math.floor(Math.random() * LIVE_NEWS_SIMULATOR_POOL.length)];
      const newItem = {
        ...randomItem,
        id: `news-${Date.now()}`,
        date: "Vừa xong (Live Stream)",
        isHot: true
      };
      onAddNewNews(newItem);
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
              Cập nhật biến động thuật toán quảng cáo và chính sách nền tảng thời gian thực. Giúp Trưởng phòng Digital điều chỉnh chiến lược ngân sách kịp thời trước các đợt bóp tương tác.
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-emerald-900/40">
        {['All', 'Meta Ads', 'TikTok Shop & Ads', 'Google Ads & SEO', 'AI Marketing'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-[#0d1713] text-slate-400 hover:text-white border border-emerald-900/40'
            }`}
          >
            {cat === 'All' ? 'Tất cả nền tảng' : cat}
          </button>
        ))}
      </div>

      {/* News Stream List */}
      <div className="space-y-6">
        {filteredNews.map((news) => (
          <div 
            key={news.id}
            className="glass-panel rounded-2xl p-6 border border-emerald-900/40 space-y-4 hover:border-emerald-500/40 transition duration-300"
          >
            {/* Top Metadata */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {news.category}
                </span>
                {news.isHot && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 flex items-center gap-1">
                    <Flame className="w-3 h-3 animate-pulse" /> ĐỘT BIẾN HOT
                  </span>
                )}
              </div>

              <span className="text-xs text-slate-400 font-mono">
                {news.date}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base md:text-lg font-bold text-white leading-snug">
              {news.title}
            </h3>

            {/* News Cover Image Illustration */}
            {news.coverImage && (
              <div className="w-full h-44 sm:h-56 rounded-xl overflow-hidden border border-emerald-900/40 relative group">
                <img 
                  src={news.coverImage} 
                  alt={news.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070d0a] via-transparent to-transparent opacity-60" />
                <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-emerald-300 border border-emerald-800/60 backdrop-blur-sm">
                  📷 Ảnh gốc minh họa bài đăng
                </span>
              </div>
            )}

            {/* Summary */}
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-[#0b1411]/60 p-4 rounded-xl border border-emerald-950">
              {news.summary}
            </p>

            {/* Manager Takeaway Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* Impact */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/40 text-xs text-amber-200 space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Tác động tới Trưởng phòng:
                </div>
                <p className="leading-relaxed">{news.impact}</p>
              </div>

              {/* Checklist */}
              {Array.isArray(news.actionChecklist) && news.actionChecklist.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-xs text-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4" /> Hành động chỉ đạo ngay:
                  </div>
                  <ul className="space-y-1 list-disc list-inside">
                    {news.actionChecklist.map((act, idx) => (
                      <li key={idx} className="text-slate-300">{act}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
