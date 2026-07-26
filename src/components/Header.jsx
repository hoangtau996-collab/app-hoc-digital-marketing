import React, { useState } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { 
  Award, 
  Flame, 
  Search, 
  BookOpen, 
  Newspaper, 
  Wrench,
  X,
  User,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Eye,
  Tag
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  passedCount, 
  totalModules, 
  newsFeed,
  onOpenCertificate,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal,
  theme = 'system',
  setTheme = () => {},
  trafficStats
}) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const overallProgress = Math.round((passedCount / totalModules) * 100);
  const latestNews = newsFeed[0];

  return (
    <header className="sticky top-0 z-40 bg-[#070d0a]/95 backdrop-blur-md border-b border-emerald-900/40 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo & Course Title */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('course')}>
          <PMarcomLogo className="w-10 h-10 sm:w-11 sm:h-11" showText={false} />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/60 uppercase tracking-wider">
                HỌC VIỆN P MARCOM
              </span>
              
              {/* Course Value Tag Header */}
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Tag className="w-3 h-3 text-amber-400" /> Trị Giá: 2.999.999 VNĐ (MIỄN PHÍ)
              </span>

              {/* Real Traffic Counter */}
              {trafficStats && (
                <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700/60">
                  <Eye className="w-3 h-3 text-teal-400" /> {trafficStats.totalTraffic.toLocaleString('vi-VN')} Lượt Xem Real-Time
                </span>
              )}
            </div>
            <h1 className="text-sm sm:text-base md:text-lg font-black text-white tracking-wide truncate max-w-[200px] sm:max-w-none mt-0.5">
              HỌC VIỆN P MARCOM
            </h1>
          </div>
        </div>

        {/* Desktop Search & Controls */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative w-40 lg:w-52">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm bài học..."
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
              onClick={() => setActiveTab('glossary')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                activeTab === 'glossary' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Từ điển
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

          {/* Theme Customization Toggle Button */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="Tuỳ chỉnh Giao diện: Sáng / Tối / Mặc định hệ thống"
              className="p-2 rounded-lg bg-[#0d1713] border border-emerald-900/50 hover:border-emerald-500 text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              {theme === 'light' && <Sun className="w-4 h-4 text-amber-400" />}
              {theme === 'dark' && <Moon className="w-4 h-4 text-emerald-400" />}
              {theme === 'system' && <Monitor className="w-4 h-4 text-teal-400" />}
            </button>

            {/* Dropdown Menu */}
            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl glass-panel border border-emerald-500/40 p-1.5 shadow-2xl z-50 space-y-1">
                <button
                  onClick={() => { setTheme('light'); setShowThemeMenu(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    theme === 'light' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:bg-emerald-950'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sáng (Light)</span>
                </button>
                <button
                  onClick={() => { setTheme('dark'); setShowThemeMenu(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    theme === 'dark' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:bg-emerald-950'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tối (Dark)</span>
                </button>
                <button
                  onClick={() => { setTheme('system'); setShowThemeMenu(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    theme === 'system' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:bg-emerald-950'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5 text-teal-400" />
                  <span>Hệ thống (Auto)</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-medium transition shrink-0 cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Chứng chỉ</span>
            <span className="bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-amber-800">
              {passedCount}/{totalModules}
            </span>
          </button>

          {/* User Account / Auth Button */}
          {currentUser ? (
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700 hover:border-emerald-500 text-emerald-300 text-xs font-bold transition shrink-0 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <span className="truncate max-w-[100px]">{currentUser.name}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-md shadow-emerald-950"
            >
              <User className="w-4 h-4" />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>

        {/* Mobile Header Right Action Icons */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Quick Theme toggle icon for mobile */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
            className="w-8 h-8 rounded-lg bg-[#0d1713] border border-emerald-900/50 flex items-center justify-center text-slate-300"
            title="Tuỳ chỉnh giao diện"
          >
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-400" />}
            {theme === 'dark' && <Moon className="w-4 h-4 text-emerald-400" />}
            {theme === 'system' && <Monitor className="w-4 h-4 text-teal-400" />}
          </button>

          {currentUser ? (
            <button
              onClick={onOpenProfileModal}
              className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-600 flex items-center justify-center text-emerald-400 font-bold text-xs"
            >
              {currentUser.name.charAt(0)}
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
            </button>
          )}

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

