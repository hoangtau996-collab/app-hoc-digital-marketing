import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Newspaper, 
  Wrench, 
  Bot, 
  Award, 
  Search,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function FeatureMenuBar({
  activeTab,
  setActiveTab,
  onSelectModule,
  onOpenCertificate,
  passedCount,
  totalModules,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal,
  t
}) {
  const textDict = t || {
    menuCourseTitle: "Khóa Học Trưởng Phòng",
    menuCourseSub: "11 Chuyên đề thực chiến",
    menuGlossaryTitle: "Từ Điển Digital",
    menuGlossarySub: "60+ Thuật ngữ chuyên sâu",
    menuNewsTitle: "Tin Tức Meta/TikTok",
    menuNewsSub: "Cập nhật thuật toán Live",
    menuToolsTitle: "Bộ Công Cụ Quản Lý",
    menuToolsSub: "Tính ngân sách, ROI & Team",
    menuAiTitle: "Trợ Lý AI Chiến Lược",
    menuAiSub: "Tư vấn Kế hoạch Marcom",
    menuCertTitle: "Giấy Chứng Nhận",
    searchPlaceholder: "Tra cứu bài học / Thuật ngữ..."
  };

  const MENU_ITEMS = [
    {
      id: 'course',
      title: textDict.menuCourseTitle,
      subtitle: textDict.menuCourseSub,
      icon: BookOpen,
      badge: 'Main',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      action: () => {
        setActiveTab('course');
        onSelectModule(null);
      }
    },
    {
      id: 'glossary',
      title: textDict.menuGlossaryTitle,
      subtitle: textDict.menuGlossarySub,
      icon: Sparkles,
      badge: 'Hot',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      action: () => setActiveTab('glossary')
    },
    {
      id: 'news',
      title: textDict.menuNewsTitle,
      subtitle: textDict.menuNewsSub,
      icon: Newspaper,
      badge: 'Live',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      action: () => setActiveTab('news')
    },
    {
      id: 'tools',
      title: textDict.menuToolsTitle,
      subtitle: textDict.menuToolsSub,
      icon: Wrench,
      badge: 'Pro',
      badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      action: () => setActiveTab('tools')
    },
    {
      id: 'cert',
      title: textDict.menuCertTitle,
      subtitle: `${passedCount}/${totalModules} ${textDict.passedModulesCount || 'Đã Đạt'}`,
      icon: Award,
      badge: `${passedCount}/${totalModules}`,
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      action: onOpenCertificate
    }
  ];

  return (
    <div className="w-full bg-[#0a1410]/95 backdrop-blur-lg border-b border-emerald-900/50 py-2.5 px-3 sm:px-6 sticky top-[60px] z-30 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Swappable Horizontal Feature Menu Row */}
        <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          
          {/* STUDENT PROFILE / ACCOUNT BUTTON ON MENU BAR */}
          {currentUser ? (
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left transition shrink-0 border border-amber-400/60 bg-gradient-to-r from-amber-500/20 via-emerald-950 to-teal-950 hover:brightness-125 text-white shadow-lg cursor-pointer group"
              title="Tuỳ chỉnh thông tin cá nhân học viên & hình nền"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center shadow shrink-0 overflow-hidden">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  currentUser && typeof currentUser.name === 'string' && currentUser.name.trim() ? currentUser.name.trim().charAt(0).toUpperCase() : 'U'
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wide truncate max-w-[120px] sm:max-w-[160px]">
                    {currentUser && typeof currentUser.name === 'string' && currentUser.name.trim() ? currentUser.name : 'HỌC VIÊN'}
                  </span>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 uppercase border border-amber-400">
                    Hồ Sơ
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium whitespace-nowrap">
                  ⚙️ Tuỳ chỉnh thông tin & Hình nền
                </p>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-left transition shrink-0 border border-emerald-500 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white shadow-lg cursor-pointer"
            >
              <div className="p-1 rounded-lg bg-white/20 text-white">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold whitespace-nowrap">🔑 Đăng Ký / Đăng Nhập</div>
                <p className="text-[10px] text-emerald-100 font-medium">Tạo hồ sơ học viên ngay</p>
              </div>
            </button>
          )}

          {/* MAIN MENU ITEMS */}
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition shrink-0 border cursor-pointer group ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md font-bold' 
                    : 'glass-panel hover:bg-emerald-950/40 text-slate-300 hover:text-white border-emerald-900/40'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition ${
                  isActive ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400 group-hover:scale-110'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold whitespace-nowrap">{item.title}</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${item.badgeBg}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[10px] opacity-80 whitespace-nowrap hidden sm:block">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tra cứu bài học / Thuật ngữ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#070d0a] border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none transition shadow-inner"
          />
        </div>

      </div>
    </div>
  );
}
