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
  Award,
  Eye,
  Tag,
  Gift,
  Activity,
  Lock
} from 'lucide-react';
import { getBlockingModule } from '../utils/moduleGating';

export default function CourseOverview({ 
  modules, 
  onSelectModule, 
  completedModules,
  searchQuery,
  onRegisterCTA = () => {},
  // Mặc định là 0 hết. App.jsx luôn truyền trafficStats xuống; nếu component
  // được dùng lại ở chỗ khác mà quên truyền thì hiện 0 là trung thực nhất —
  // chưa biết số thì đừng hiện số nào cả.
  trafficStats = {
    totalTraffic: 0,
    todayTraffic: 0,
    totalEnrolled: 0,
    totalGraduates: 0,
    onlineActive: 1
  }
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
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-emerald-500/30 p-6 md:p-10 bg-glow-radial shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-3 flex-wrap relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <PMarcomLogo className="w-5 h-5" showText={false} /> HỌC VIỆN P MARCOM • CHƯƠNG TRÌNH ĐÀO TẠO THỰC CHUYÊN SÂU
          </div>

          {/* Special Course Value Badge — bấm vào dẫn tới đăng ký học viên */}
          <button
            type="button"
            onClick={onRegisterCTA}
            title="Đăng ký học viên ngay"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 border border-amber-400/60 text-amber-300 text-xs font-extrabold shadow-lg animate-pulse hover:brightness-125 hover:scale-[1.02] transition cursor-pointer"
          >
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Giá Trị Khóa Học: <span className="line-through text-slate-400 font-semibold">2.999.999 VNĐ</span></span>
            <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase text-[10px]">CHỈ CÒN 39 SUẤT • ĐĂNG KÝ NGAY</span>
          </button>
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
            HỌC VIỆN P MARCOM <br />
            <span className="text-gradient-emerald">KHÓA HỌC DIGITAL THỰC CHIẾN</span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Chương trình đào tạo với hệ thống <strong className="text-emerald-300 font-semibold">kiến thức bài bản</strong>, <strong className="text-emerald-300 font-semibold">tư duy thực chiến</strong>, mang lại <strong className="text-emerald-300 font-semibold">hiệu quả ngay với doanh nghiệp</strong> trong quá trình chuyển đổi số. Tích hợp trắc nghiệm tình huống thực tế và bản tin cập nhật thuật toán Meta, TikTok, Google liên tục.
          </p>
        </div>

        {/* Real-time Web Traffic & Completion Stats Dashboard Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 border-t border-emerald-900/50 relative z-10">
          
          {/* Stat 1: Total Cumulative Web Traffic Counter */}
          <div className="glass-panel p-3.5 rounded-2xl border border-teal-500/30 shadow-lg relative overflow-hidden group hover:border-teal-400 transition">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-extrabold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-teal-400" /> Tổng Lượt Truy Cập Web
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {(trafficStats?.totalTraffic || 0).toLocaleString('vi-VN')}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Cộng dồn lượt khách ghé thăm mỗi ngày
            </div>
          </div>

          {/* Stat 2: Certified Graduates */}
          <div className="glass-panel p-3.5 rounded-2xl border border-amber-500/30 shadow-lg group hover:border-amber-400 transition">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Đạt Chứng Nhận
              </span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            {/* Bỏ dấu "+" phía sau: con số nay là số đếm thật trên máy chủ,
                không phải ước lượng làm tròn lên. "0+ Đạt chứng nhận" vừa sai
                vừa khó hiểu. */}
            <div className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
              {(trafficStats?.totalGraduates || 0).toLocaleString('vi-VN')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Hoàn thành 11/11 chuyên đề
            </div>
          </div>

          {/* Stat 3: Total Enrolled Students */}
          <div className="glass-panel p-3.5 rounded-2xl border border-emerald-500/30 shadow-lg group hover:border-emerald-400 transition">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Học Viên Tham Gia
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {(trafficStats?.totalEnrolled || 0).toLocaleString('vi-VN')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Quản lý & Trưởng phòng Digital
            </div>
          </div>

          {/* Stat 4: Course Value Showcase */}
          <div className="glass-panel p-3.5 rounded-2xl border border-amber-400/50 shadow-lg group hover:border-amber-400 transition bg-gradient-to-br from-amber-950/30 to-emerald-950/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-400" /> Giá Trị Đào Tạo
              </span>
              <button
                type="button"
                onClick={onRegisterCTA}
                title="Đăng ký học viên ngay"
                className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 uppercase animate-bounce hover:brightness-110 cursor-pointer"
              >
                CHỈ CÒN 39 SUẤT
              </button>
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-400 tracking-tight">
              2.999.999 VNĐ
            </div>
            <button
              type="button"
              onClick={onRegisterCTA}
              title="Đăng ký học viên ngay"
              className="text-[10px] text-emerald-300 font-extrabold mt-0.5 flex items-center gap-1 hover:text-emerald-200 hover:underline cursor-pointer"
            >
              🔥 CHỈ CÒN 39 SUẤT • ĐĂNG KÝ NGAY
            </button>
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
                : 'bg-[#18243d] text-slate-400 hover:text-white border border-emerald-900/40'
            }`}
          >
            Tất cả 11 Chuyên đề
          </button>
          <button
            onClick={() => setPartFilter('part1')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              partFilter === 'part1'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/50'
                : 'bg-[#18243d] text-slate-400 hover:text-white border border-emerald-900/40'
            }`}
          >
            Nội dung đào tạo (1/3)
          </button>
          <button
            onClick={() => setPartFilter('part2')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              partFilter === 'part2'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/50'
                : 'bg-[#18243d] text-slate-400 hover:text-white border border-emerald-900/40'
            }`}
          >
            Nội dung đào tạo (2/3)
          </button>
          <button
            onClick={() => setPartFilter('part3')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              partFilter === 'part3'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/50'
                : 'bg-[#18243d] text-slate-400 hover:text-white border border-emerald-900/40'
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
          // Tính trên danh sách ĐẦY ĐỦ, không phải filteredModules: khi học viên
          // đang lọc hoặc tìm kiếm thì chuyên đề liền trước có thể không nằm
          // trong kết quả, lấy theo danh sách đã lọc sẽ ra thứ tự sai.
          const blocker = getBlockingModule(modules, mod.id, completedModules);
          const isLocked = !!blocker;

          return (
            <div
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className={`glass-panel rounded-2xl p-6 border cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                isLocked
                  ? 'border-slate-700/60 opacity-70 hover:opacity-100'
                  : 'glass-panel-hover border-emerald-900/40'
              }`}
            >
              {/* Top Bar */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-3xl font-black tracking-tighter transition duration-300 ${
                    isLocked ? 'text-slate-400' : 'text-emerald-400 group-hover:scale-110'
                  }`}>
                    {mod.number}.
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      {mod.badge}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đã Đạt
                      </span>
                    ) : isLocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/60">
                        <Lock className="w-3 h-3" /> Chưa mở
                      </span>
                    ) : null}
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
                  <span className="flex items-center gap-1 font-semibold text-slate-300">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> {mod.quizCount || 3} Trắc nghiệm tình huống
                  </span>
                </div>

                {isLocked ? (
                  <span className="flex items-center gap-1 text-amber-300 font-bold text-[11px] text-right leading-snug">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    Cần đạt Chuyên đề {blocker.number}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold group-hover:translate-x-1 transition">
                    Vào Học <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
