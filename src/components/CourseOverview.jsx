import React, { useState } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { 
  CheckCircle2, 
  PlayCircle, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Users, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';

export default function CourseOverview({ 
  modules, 
  onSelectModule, 
  completedModules,
  searchQuery
}) {
  const [partFilter, setPartFilter] = useState('all');

  const filteredModules = modules.filter(m => {
    const matchesSearch = searchQuery === '' || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (partFilter === 'part1') return ['module-01', 'module-02', 'module-03', 'module-04'].includes(m.id);
    if (partFilter === 'part2') return ['module-05', 'module-06', 'module-07', 'module-08'].includes(m.id);
    if (partFilter === 'part3') return ['module-09', 'module-10', 'module-11'].includes(m.id);

    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* Hero Banner matching the poster style */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-emerald-500/30 p-6 md:p-10 bg-glow-radial shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <PMarcomLogo className="w-5 h-5" showText={false} /> HỌC VIỆN P MARCOM • CHƯƠNG TRÌNH ĐÀO TẠO THỰC CHUYÊN SÂU
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
            HỌC VIỆN P MARCOM <br />
            <span className="text-gradient-emerald">TRƯỞNG PHÒNG DIGITAL MARKETING</span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Chương trình đào tạo với hệ thống <strong className="text-emerald-300 font-semibold">kiến thức bài bản</strong>, <strong className="text-emerald-300 font-semibold">tư duy thực chiến</strong>, mang lại <strong className="text-emerald-300 font-semibold">hiệu quả ngay với doanh nghiệp</strong> trong quá trình chuyển đổi số. Tích hợp trắc nghiệm tình huống thực tế và bản tin cập nhật thuật toán Meta, TikTok, Google liên tục.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-emerald-900/50">
            <div className="bg-[#0b1411]/80 p-3 rounded-xl border border-emerald-900/40">
              <div className="text-emerald-400 font-bold text-lg">11 Chuyên đề</div>
              <div className="text-[11px] text-slate-400">Chuẩn hóa cho Manager</div>
            </div>
            <div className="bg-[#0b1411]/80 p-3 rounded-xl border border-emerald-900/40">
              <div className="text-emerald-400 font-bold text-lg">33 Quiz Tình Huống</div>
              <div className="text-[11px] text-slate-400">Kiểm tra & Giải thích</div>
            </div>
            <div className="bg-[#0b1411]/80 p-3 rounded-xl border border-emerald-900/40">
              <div className="text-emerald-400 font-bold text-lg">Real-time Feed</div>
              <div className="text-[11px] text-slate-400">Cập nhật Meta/TikTok/Google</div>
            </div>
            <div className="bg-[#0b1411]/80 p-3 rounded-xl border border-emerald-900/40">
              <div className="text-amber-400 font-bold text-lg">Chứng Chỉ</div>
              <div className="text-[11px] text-slate-400">Hoàn thành khóa học</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs by Part (1/3, 2/3, 3/3) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setPartFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              partFilter === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/50'
                : 'bg-[#0d1713] text-slate-400 hover:text-white border border-emerald-900/40'
            }`}
          >
            Tất cả 11 Chuyên đề
          </button>
          <button
            onClick={() => setPartFilter('part1')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              partFilter === 'part1'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/50'
                : 'bg-[#0d1713] text-slate-400 hover:text-white border border-emerald-900/40'
            }`}
          >
            Nội dung đào tạo (1/3)
          </button>
          <button
            onClick={() => setPartFilter('part2')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              partFilter === 'part2'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/50'
                : 'bg-[#0d1713] text-slate-400 hover:text-white border border-emerald-900/40'
            }`}
          >
            Nội dung đào tạo (2/3)
          </button>
          <button
            onClick={() => setPartFilter('part3')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              partFilter === 'part3'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/50'
                : 'bg-[#0d1713] text-slate-400 hover:text-white border border-emerald-900/40'
            }`}
          >
            Nội dung đào tạo (3/3)
          </button>
        </div>

        <div className="text-xs text-slate-400">
          Hiển thị <strong className="text-emerald-400">{filteredModules.length}</strong> chuyên đề
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredModules.map((mod) => {
          const isCompleted = completedModules.includes(mod.id);

          return (
            <div
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-emerald-900/40 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Bar */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-3xl font-black text-emerald-400 tracking-tighter group-hover:scale-110 transition duration-300">
                    {mod.number}.
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      {mod.badge}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đã Đạt
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition mb-1">
                  {mod.title}
                </h3>
                <p className="text-xs text-emerald-400/80 font-medium mb-3">
                  ({mod.subtitle})
                </p>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {mod.description}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 mt-4 border-t border-emerald-900/30 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" /> {mod.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> {mod.quizCount} Quiz
                  </span>
                </div>

                <span className="flex items-center gap-1 text-emerald-400 font-bold group-hover:translate-x-1 transition">
                  Vào Học <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
