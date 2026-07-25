import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Flame, 
  Wrench, 
  Award, 
  BookOpen, 
  Sparkles,
  BarChart2
} from 'lucide-react';

export default function Sidebar({ 
  modules, 
  selectedModuleId, 
  onSelectModule, 
  completedModules, 
  activeTab, 
  setActiveTab 
}) {
  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      
      {/* Navigation Card */}
      <div className="glass-panel rounded-2xl p-4 border border-emerald-900/40 shadow-xl">
        
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
        <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
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

      {/* Live Feature Shortcuts */}
      <div className="glass-panel rounded-2xl p-4 border border-emerald-900/40 space-y-3">
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

      {/* Course Banner Quote */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-teal-950/50 to-[#070d0a] border border-emerald-800/40 relative overflow-hidden">
        <div className="text-2xl font-black text-emerald-500/10 absolute right-2 bottom-0 pointer-events-none select-none">
          CHESS
        </div>
        <p className="text-xs text-slate-300 italic leading-relaxed">
          "Trưởng phòng Digital Marketing không phải là người chạy Ads giỏi nhất, mà là người làm chủ chiến lược, ngân sách và bộ máy nhân sự."
        </p>
      </div>

    </aside>
  );
}
