import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  Flame, 
  Wrench, 
  BookOpen, 
  Sparkles,
  ChevronDown,
  GraduationCap,
  Lock
} from 'lucide-react';
import { getBlockingModule } from '../utils/moduleGating';

export default function Sidebar({
  modules,
  selectedModuleId,
  onSelectModule,
  completedModules,
  activeTab,
  setActiveTab,
  isTradeCourseUnlocked = false,
  tradePassedCount = 0,
  tradeTotalModules = 0,
  // Danh sách chuyên đề khoá nâng cao. Truyền vào để khi học viên đang ở tab
  // Trade thì thanh bên đổi sang danh sách của đúng khoá đó — trước đây nó vẫn
  // liệt kê 11 chuyên đề khoá Digital, bấm vào là văng ngược về khoá chính.
  tradeModules = [],
  selectedTradeModuleId = null,
  onSelectTradeModule = () => {},
  completedTradeModules = [],
  // Quản trị viên thấy mọi chuyên đề đang mở: khoá tuần tự là để học viên học
  // đúng thứ tự, không phải để giấu nội dung với Ban Quản Trị.
  isAdmin = false
}) {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  /* Đang xem khoá nào thì thanh bên liệt kê chuyên đề của đúng khoá đó. */
  const isTradeView = activeTab === 'trade' && isTradeCourseUnlocked && tradeModules.length > 0;

  const listModules = isTradeView ? tradeModules : modules;
  const listCompleted = isTradeView ? completedTradeModules : completedModules;
  const listSelectedId = isTradeView ? selectedTradeModuleId : selectedModuleId;
  const listTab = isTradeView ? 'trade' : 'course';

  const handleSelect = (id) => {
    setActiveTab(listTab);
    if (isTradeView) onSelectTradeModule(id);
    else onSelectModule(id);
  };

  /* Khoá Trade KHÔNG khoá tuần tự giữa các chuyên đề: vào được khoá này nghĩa
     là đã tốt nghiệp khoá chính, muốn học chuyên đề nào trước cũng được. Nên
     hàm dò chuyên đề đang chặn chỉ chạy cho khoá chính. */
  const blockerOf = (id) =>
    isTradeView ? null : getBlockingModule(modules, id, completedModules, isAdmin);

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4 lg:space-y-6">
      
      {/* Mobile Quick Horizontal Module Scroller (Visible only on mobile/tablet) */}
      <div className="block lg:hidden glass-panel rounded-2xl p-3 border border-emerald-900/40">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            {isTradeView ? <GraduationCap className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
            {isTradeView ? 'CHỌN NHANH CHUYÊN ĐỀ TRADE' : 'CHỌN NHANH CHUYÊN ĐỀ'}
          </span>
          <button 
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="text-[11px] text-slate-400 font-medium flex items-center gap-1 hover:text-emerald-400"
          >
            {isMobileExpanded ? 'Thu gọn' : 'Xem danh sách đầy đủ'}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMobileExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Horizontal Touch Scroll Pills */}
        {!isMobileExpanded ? (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {listModules.map((mod) => {
              const isCompleted = listCompleted.includes(mod.id);
              const isSelected = activeTab === listTab && listSelectedId === mod.id;
              const isLocked = !!blockerOf(mod.id);

              return (
                <button
                  key={mod.id}
                  onClick={() => handleSelect(mod.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                      : isCompleted
                      ? 'glass-panel text-emerald-400 border border-emerald-500/50'
                      : isLocked
                      ? 'glass-panel text-slate-400 border border-slate-700/60'
                      : 'glass-panel text-slate-200 hover:text-emerald-400 border border-emerald-900/40'
                  }`}
                >
                  {isLocked && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
                  <span>{mod.number}.</span>
                  <span className="truncate max-w-[120px]">{mod.title}</span>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        ) : (
          /* Expanded vertical list on mobile when toggled */
          <div className="space-y-1.5 mt-2 max-h-[300px] overflow-y-auto pr-1">
            {listModules.map((mod) => {
              const isCompleted = listCompleted.includes(mod.id);
              const isSelected = activeTab === listTab && listSelectedId === mod.id;
              const isLocked = !!blockerOf(mod.id);

              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    handleSelect(mod.id);
                    // Chuyên đề còn khoá thì giữ danh sách mở, để học viên thấy
                    // ngay chuyên đề nào đang chặn thay vì bị đóng lại.
                    if (!isLocked) setIsMobileExpanded(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-emerald-600 text-slate-950 font-bold'
                      : isLocked
                      ? 'bg-slate-900/30 text-slate-400 border border-slate-700/60'
                      : 'bg-emerald-950/20 text-slate-200 border border-emerald-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isLocked && <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    <span className="font-bold">{mod.number}.</span>
                    <span className="truncate">{mod.title}</span>
                  </div>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Sidebar Navigation (Hidden on mobile) */}
      <div className="hidden lg:block glass-panel rounded-2xl p-4 border border-emerald-900/40 shadow-xl">
        
        <div className="flex items-center justify-between pb-3 border-b border-emerald-900/40 mb-3">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
            {isTradeView ? <GraduationCap className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            <span>{isTradeView ? 'CHUYÊN ĐỀ TRADE MARKETING' : 'DANH SÁCH CHUYÊN ĐỀ'}</span>
          </div>
          {/* Đếm theo dữ liệu thật. Số 11 từng viết cứng ở đây, thêm bớt chuyên
              đề là lệch ngay mà không ai thấy. */}
          <span className="text-xs text-slate-400 font-medium shrink-0">
            {listModules.length} Chuyên đề
          </span>
        </div>

        {/* Modules List */}
        <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
          {listModules.map((mod) => {
            const isCompleted = listCompleted.includes(mod.id);
            const isSelected = activeTab === listTab && listSelectedId === mod.id;
            const blocker = blockerOf(mod.id);
            const isLocked = !!blocker;

            return (
              <button
                key={mod.id}
                onClick={() => handleSelect(mod.id)}
                title={isLocked ? `Cần đạt bài kiểm tra Chuyên đề ${blocker.number}` : undefined}
                className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-md border border-emerald-400'
                    : isLocked
                    ? 'glass-panel text-slate-400 border border-slate-700/60'
                    : 'glass-panel text-slate-200 hover:text-emerald-400 border border-emerald-900/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : isSelected
                      ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                      : isLocked
                      ? 'bg-slate-900/50 text-amber-400 border border-slate-700/60'
                      : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      mod.number
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold truncate transition ${
                      isLocked ? '' : 'group-hover:text-emerald-400'
                    }`}>
                      {mod.number}. {mod.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {isLocked ? `Cần đạt Chuyên đề ${blocker.number} trước` : mod.subtitle}
                    </p>
                  </div>
                </div>

                {isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition group-hover:translate-x-0.5 ${
                    isSelected ? 'text-emerald-300' : ''
                  }`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Feature Shortcuts */}
      <div className="hidden lg:block glass-panel rounded-2xl p-4 border border-emerald-900/40 space-y-3">
        <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Tiện Ích Trưởng Phòng
        </h4>

        <div className="grid grid-cols-1 gap-2">
          {/* Lối về khoá chính. Bắt buộc phải có từ khi thanh bên đổi sang
              danh sách chuyên đề Trade: lúc đó không còn mục nào trong danh
              sách trỏ về khoá Digital nữa, thiếu nút này là học viên kẹt lại
              trong khoá nâng cao. */}
          <button
            onClick={() => setActiveTab('course')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeTab === 'course'
                ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
                : 'bg-emerald-950/20 border-emerald-900/30 text-slate-200 hover:border-emerald-500/50'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold">Khoá Digital Marketing</div>
              <div className="text-[10px] text-slate-400">
                {completedModules.length}/{modules.length} chuyên đề khoá chính
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('trade')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeTab === 'trade'
                ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
                : 'bg-emerald-950/20 border-emerald-900/30 text-slate-200 hover:border-emerald-500/50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
              isTradeCourseUnlocked
                ? 'bg-emerald-900/40 border-emerald-700/40 text-emerald-400'
                : 'bg-slate-900/60 border-slate-700/40 text-slate-500'
            }`}>
              {isTradeCourseUnlocked ? <GraduationCap className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-bold">Khoá Trade Marketing</div>
              <div className="text-[10px] text-slate-400">
                {isTradeCourseUnlocked
                  ? `${tradePassedCount}/${tradeTotalModules} chuyên đề nâng cao`
                  : 'Mở sau khi tốt nghiệp khoá chính'}
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('glossary')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeTab === 'glossary'
                ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
                : 'bg-emerald-950/20 border-emerald-900/30 text-slate-200 hover:border-emerald-500/50'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold">Từ Điển Thuật Ngữ Marketing</div>
              <div className="text-[10px] text-slate-400">CPM, ROAS, CAC, SOSTAC...</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeTab === 'news'
                ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
                : 'bg-emerald-950/20 border-emerald-900/30 text-slate-200 hover:border-emerald-500/50'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center text-emerald-400">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold">Bản Tin Meta/TikTok/Google</div>
              <div className="text-[10px] text-slate-400">Cập nhật thuật toán Live</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeTab === 'tools'
                ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
                : 'bg-emerald-950/20 border-emerald-900/30 text-slate-200 hover:border-emerald-500/50'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center text-emerald-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold">Bộ Công Cụ Ngân Sách & Team</div>
              <div className="text-[10px] text-slate-400">Calculator thực chiến</div>
            </div>
          </button>
        </div>
      </div>

    </aside>
  );
}
