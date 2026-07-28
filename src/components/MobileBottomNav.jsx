import React from 'react';
import { BookOpen, Flame, Wrench, Award, Sparkles, User, GraduationCap, Lock } from 'lucide-react';

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  onOpenCertificate,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal,
  isTradeCourseUnlocked = false
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden glass-panel border-t border-emerald-900/60 p-1 px-1.5 bg-[#0e1526]/95 backdrop-blur-lg">
      {/* justify-between + px nhỏ: thêm mục thứ 7 nên phải bỏ khoảng đệm thừa
          của justify-around, nếu không hàng nút tràn ngang trên máy hẹp. */}
      <div className="flex items-center justify-between">
        
        {/* Tab 1: Course */}
        <button
          onClick={() => setActiveTab('course')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeTab === 'course'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px]">Khóa Học</span>
        </button>

        {/* Tab 2: Trade Marketing (khoá nâng cao) */}
        <button
          onClick={() => setActiveTab('trade')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeTab === 'trade'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isTradeCourseUnlocked ? <GraduationCap className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span className="text-[10px]">Trade</span>
        </button>

        {/* Tab 3: Glossary */}
        <button
          onClick={() => setActiveTab('glossary')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeTab === 'glossary'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-[10px]">Từ Điển</span>
        </button>

        {/* Tab 3: News */}
        <button
          onClick={() => setActiveTab('news')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition relative ${
            activeTab === 'news'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Flame className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-1" />
          </div>
          <span className="text-[10px]">Tin Live</span>
        </button>

        {/* Tab 4: Tools */}
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeTab === 'tools'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span className="text-[10px]">Công Cụ</span>
        </button>

        {/* Tab 5: User Account / Login */}
        {currentUser ? (
          <button
            onClick={onOpenProfileModal}
            className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-emerald-400 font-bold"
          >
            <User className="w-4 h-4" />
            <span className="text-[10px] truncate max-w-[50px]">{currentUser.name ? currentUser.name.split(' ')[0] : 'Tài Khoản'}</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span className="text-[10px]">Đăng Nhập</span>
          </button>
        )}

        {/* Tab 6: Certificate */}
        <button
          onClick={onOpenCertificate}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-amber-400 hover:text-amber-300 transition"
        >
          <Award className="w-4 h-4" />
          <span className="text-[10px]">Bằng Cấp</span>
        </button>

      </div>
    </div>
  );
}
