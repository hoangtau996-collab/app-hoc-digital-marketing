import React from 'react';
import { 
  Award, 
  Sparkles, 
  Flame, 
  Search, 
  CheckCircle2, 
  Zap, 
  Newspaper, 
  Wrench,
  BookOpen
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  passedCount, 
  totalModules, 
  newsFeed,
  onOpenCertificate,
  searchQuery,
  setSearchQuery
}) {
  const overallProgress = Math.round((passedCount / totalModules) * 100);
  const latestNews = newsFeed[0];

  return (
    <header className="sticky top-0 z-40 bg-[#070d0a]/90 backdrop-blur-md border-b border-emerald-900/40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Course Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('course')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/50 border border-emerald-400/30">
            {/* Chess Knight / Strategy Icon */}
            <span className="text-xl font-black text-slate-950">♟</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                E-LEARNING MANAGER
              </span>
              <span className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                <Flame className="w-3 h-3 animate-pulse" /> Live Updating
              </span>
            </div>
            <h1 className="text-base font-bold text-white tracking-wide">
              TRƯỞNG PHÒNG DIGITAL MARKETING
            </h1>
          </div>
        </div>

        {/* Live Ticker Banner */}
        {latestNews && (
          <div 
            onClick={() => setActiveTab('news')}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 hover:border-emerald-500/50 transition cursor-pointer text-xs text-slate-300 max-w-md truncate group"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400 shrink-0">
              [{latestNews.category}]
            </span>
            <span className="truncate text-slate-200 group-hover:text-emerald-300">
              {latestNews.title}
            </span>
          </div>
        )}

        {/* Search & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Search Box */}
          <div className="relative flex-1 md:w-48 lg:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm chuyên đề, bài học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1713] border border-emerald-900/50 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Quick Nav Tabs */}
          <div className="flex items-center bg-[#0d1713] p-1 rounded-lg border border-emerald-900/40">
            <button
              onClick={() => setActiveTab('course')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                activeTab === 'course' 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Khóa học</span>
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition relative ${
                activeTab === 'news' 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tin tức Live</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping absolute top-1 right-1" />
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                activeTab === 'tools' 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Công cụ</span>
            </button>
          </div>

          {/* Certificate Progress Button */}
          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-medium transition"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">Chứng chỉ</span>
            <span className="bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-amber-800">
              {passedCount}/{totalModules}
            </span>
          </button>

        </div>

      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-900 h-1 mt-3 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </header>
  );
}
