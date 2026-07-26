import React, { useState } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { 
  Award, 
  Flame, 
  Search, 
  BookOpen, 
  Newspaper, 
  Wrench,
  X
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const overallProgress = Math.round((passedCount / totalModules) * 100);
  const latestNews = newsFeed[0];

  return (
    <header className="sticky top-0 z-40 bg-[#070d0a]/95 backdrop-blur-md border-b border-emerald-900/40 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo & Course Title */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('course')}>
          <PMarcomLogo className="w-10 h-10 sm:w-11 sm:h-11" showText={false} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/60 uppercase tracking-wider">
                HỌC VIỆN P MARCOM
              </span>
              <span className="hidden sm:flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                <Flame className="w-3 h-3 animate-pulse" /> Live Feed
              </span>
            </div>
            <h1 className="text-sm sm:text-base md:text-lg font-black text-white tracking-wide truncate max-w-[200px] sm:max-w-none mt-0.5">
              HỌC VIỆN P MARCOM
            </h1>
          </div>
        </div>

        {/* Desktop Live Ticker Banner */}
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

        {/* Desktop Search & Controls */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative w-48 lg:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm chuyên đề, bài học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1713] border border-emerald-900/50 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex items-center bg-[#0d1713] p-1 rounded-lg border border-emerald-900/40">
            <button
              onClick={() => setActiveTab('course')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                activeTab === 'course' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Khóa học
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                activeTab === 'news' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" /> Tin tức
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                activeTab === 'tools' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" /> Công cụ
            </button>
          </div>

          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-medium transition shrink-0"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Chứng chỉ</span>
            <span className="bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-amber-800">
              {passedCount}/{totalModules}
            </span>
          </button>
        </div>

        {/* Mobile Header Right Action Icons */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="w-8 h-8 rounded-lg bg-[#0d1713] border border-emerald-900/50 flex items-center justify-center text-slate-300"
          >
            {showMobileSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 border border-amber-500/40 text-amber-300 text-xs font-bold"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{passedCount}/{totalModules}</span>
          </button>
        </div>

      </div>

      {/* Collapsible Mobile Search Input */}
      {showMobileSearch && (
        <div className="mt-2 pt-2 border-t border-emerald-900/40 lg:hidden">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm chuyên đề, bài học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1713] border border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-900 h-1 mt-2.5 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </header>
  );
}
