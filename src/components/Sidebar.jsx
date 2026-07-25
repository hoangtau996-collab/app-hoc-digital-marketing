import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  Flame, 
  Wrench, 
  BookOpen, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function Sidebar({ 
  modules, 
  selectedModuleId, 
  onSelectModule, 
  completedModules, 
  activeTab, 
  setActiveTab 
}) {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4 lg:space-y-6">
      
      {/* Mobile Quick Horizontal Module Scroller (Visible only on mobile/tablet) */}
      <div className="block lg:hidden glass-panel rounded-2xl p-3 border border-emerald-900/40">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> CHỌN NHANH CHUYÊN ĐỀ
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
            {modules.map((mod) => {
              const isCompleted = completedModules.includes(mod.id);
              const isSelected = activeTab === 'course' && selectedModuleId === mod.id;

              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveTab('course');
                    onSelectModule(mod.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : isCompleted
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-[#0d1713] text-slate-300 border border-emerald-900/40'
                  }`}
                >
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
            {modules.map((mod) => {
              const isCompleted = completedModules.includes(mod.id);
              const isSelected = activeTab === 'course' && selectedModuleId === mod.id;

              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveTab('course');
                    onSelectModule(mod.id);
                    setIsMobileExpanded(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-emerald-600 text-slate-950 font-bold'
                      : 'bg-[#0b1411] text-slate-300 border border-emerald-950'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
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
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>DANH SÁCH CHUYÊN ĐỀ</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            11 Chuyên đề
          </span>
        </div>

        {/* Modules List */}
        <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
          {modules.map((mod) => {
            const isCompleted = completedModules.includes(mod.id);
            const isSelected = activeTab === 'course' && selectedModuleId === mod.id;

            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveTab('course');
                  onSelectModule(mod.id);
                }}
                className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-900/80 to-teal-950 border border-emerald-500/50 text-white shadow-md'
                    : 'bg-[#0b1411]/60 hover:bg-emerald-950/40 text-slate-300 border border-emerald-950/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : isSelected
                      ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : mod.number}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold truncate group-hover:text-emerald-300 transition">
                      {mod.number}. {mod.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {mod.subtitle}
                    </p>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 text-slate-500 transition group-hover:translate-x-0.5 ${
                  isSelected ? 'text-emerald-400' : ''
                }`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Feature Shortcuts */}
      <div className="hidden lg:block glass-panel rounded-2xl p-4 border border-emerald-900/40 space-y-3">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Tiện Ích Trưởng Phòng
        </h4>

        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => setActiveTab('news')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeTab === 'news'
                ? 'bg-emerald-950 border-emerald-500 text-white'
                : 'bg-[#0a120f] border-emerald-900/30 text-slate-300 hover:border-emerald-700/50'
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
                ? 'bg-emerald-950 border-emerald-500 text-white'
                : 'bg-[#0a120f] border-emerald-900/30 text-slate-300 hover:border-emerald-700/50'
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
