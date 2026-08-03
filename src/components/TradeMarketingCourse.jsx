import React from 'react';
import {
  Lock,
  Award,
  CheckCircle2,
  ArrowRight,
  Store,
  Network,
  Layers,
  TrendingUp,
  Rocket,
  BookOpen,
  HelpCircle,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { TRADE_MODULES, TRADE_COURSE_META } from '../data/tradeCourseData';

const ICON_MAP = { Store, Network, Layers, TrendingUp, Rocket };

export default function TradeMarketingCourse({
  isUnlocked,
  // Quản trị viên: mọi cổng khoá trong màn này đều mở, kể cả băng cấp bằng.
  isAdmin = false,
  mainCompletedCount,
  mainTotalModules,
  completedTradeModules = [],
  onSelectModule,
  onGoToMainCourse,
  onOpenCertificate = () => {}
}) {
  const totalLessons = TRADE_MODULES.reduce((s, m) => s + m.sections.length, 0);
  const totalQuiz = TRADE_MODULES.reduce((s, m) => s + m.quiz.length, 0);
  const donePercent = Math.round((completedTradeModules.length / TRADE_MODULES.length) * 100);

  // Đối chiếu theo id chứ không so độ dài mảng: tiến độ cũ lưu trong máy có thể
  // còn id chuyên đề đã bị xoá, khiến đếm số lượng vẫn đủ trong khi thực tế
  // còn chuyên đề chưa học.
  //
  // Quản trị viên thấy băng cấp bằng ngay từ đầu — đó là lối duy nhất mở mẫu
  // bằng khoá Trade ra xem trên màn này.
  const isCertificateReady =
    isAdmin || TRADE_MODULES.every((m) => completedTradeModules.includes(m.id));
  const mainPercent = mainTotalModules > 0 ? Math.round((mainCompletedCount / mainTotalModules) * 100) : 0;
  const remaining = Math.max(0, mainTotalModules - mainCompletedCount);

  /* ============ TRẠNG THÁI KHOÁ ============ */
  if (!isUnlocked) {
    return (
      <div className="space-y-6 md:space-y-8">

        <div className="relative rounded-3xl overflow-hidden glass-panel border border-amber-500/40 p-6 md:p-10 bg-glow-radial shadow-2xl">
          <div className="relative z-10 space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-950 border border-amber-600/60 flex items-center justify-center text-amber-400 shrink-0">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="inline-block text-[10px] font-black px-2.5 py-1 rounded-lg bg-amber-950 text-amber-400 border border-amber-700 uppercase tracking-wider">
                  Khoá nâng cao · Chưa mở
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {TRADE_COURSE_META.title}
                </h1>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {TRADE_COURSE_META.promise}
                </p>
              </div>
            </div>

            {/* Điều kiện mở khoá */}
            <div className="p-5 rounded-2xl bg-[#152037]/80 border border-amber-900/50 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                Điều kiện bắt buộc để mở khoá
              </div>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Hoàn thành toàn bộ <strong className="text-white">{mainTotalModules} chuyên đề</strong> của khoá
                Digital Marketing và đủ điều kiện nhận Bằng Chứng Nhận. Khoá Trade Marketing dựng trên nền
                kiến thức đó nên không mở trước được.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Tiến độ khoá Digital Marketing</span>
                  <span className="font-black text-amber-400">
                    {mainCompletedCount}/{mainTotalModules} chuyên đề · {mainPercent}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-[#0e1526] border border-emerald-900/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${mainPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  {remaining > 0
                    ? `Còn ${remaining} chuyên đề nữa là mở được khoá này.`
                    : 'Đã đủ điều kiện — tải lại trang nếu khoá chưa mở.'}
                </p>
              </div>

              <button
                onClick={onGoToMainCourse}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg transition cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Tiếp tục khoá Digital Marketing</span>
              </button>
            </div>

          </div>
        </div>

        {/* Xem trước nội dung bên trong */}
        <div className="space-y-4">
          <h2 className="text-base md:text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Mở khoá rồi bạn sẽ học gì
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRADE_MODULES.map((mod) => {
              const Icon = ICON_MAP[mod.icon] || BookOpen;
              return (
                <div
                  key={mod.id}
                  className="glass-panel rounded-2xl p-5 border border-emerald-900/40 space-y-3 opacity-70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-emerald-900/60 flex items-center justify-center text-slate-500 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Chuyên đề {String(mod.number).padStart(2, '0')} · {mod.badge}
                    </span>
                    <h3 className="text-sm font-bold text-slate-300">{mod.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{mod.subtitle}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-emerald-900/40">
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{mod.lessonsCount} bài</span>
                    <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" />{mod.quizCount} câu</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{mod.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  /* ============ TRẠNG THÁI ĐÃ MỞ ============ */
  return (
    <div className="space-y-6 md:space-y-8">

      <div className="relative rounded-3xl overflow-hidden glass-panel border border-emerald-500/40 p-6 md:p-10 bg-glow-radial shadow-2xl">
        <div className="relative z-10 space-y-5">

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-700 uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã mở khoá
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg bg-amber-950 text-amber-400 border border-amber-700 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> Khoá nâng cao
            </span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              {TRADE_COURSE_META.title}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {TRADE_COURSE_META.promise}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> {TRADE_MODULES.length} chuyên đề · {totalLessons} bài · {totalQuiz} câu hỏi
            </span>
          </div>

          {/* Tiến độ khoá này */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">Tiến độ của bạn</span>
              <span className="font-black text-emerald-400">
                {completedTradeModules.length}/{TRADE_MODULES.length} chuyên đề · {donePercent}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-[#0e1526] border border-emerald-900/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${donePercent}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Băng cấp bằng — chỉ hiện khi đã đạt đủ toàn bộ chuyên đề của khoá này.
          Đặt ngay trên lưới chuyên đề để học viên vừa học xong chuyên đề cuối
          là thấy ngay, không phải đi tìm. */}
      {isCertificateReady && (
        <div className="rounded-3xl border border-amber-500/50 bg-gradient-to-r from-amber-950/60 via-slate-900/80 to-emerald-950/60 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" /> Đã đạt {TRADE_MODULES.length}/{TRADE_MODULES.length} chuyên đề
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Chúc mừng! Bạn đủ điều kiện nhận Bằng Chứng Nhận
              </h3>
              <p className="text-[11px] text-slate-300">
                Chứng nhận hoàn thành <strong className="text-amber-300">TRADE MARKETING THỰC CHIẾN</strong> — tách riêng với bằng khoá Digital, có mã xác thực riêng.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCertificate}
            className="w-full sm:w-auto shrink-0 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg transition cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Nhận Bằng Chứng Nhận</span>
          </button>
        </div>
      )}

      {/* Lưới chuyên đề */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {TRADE_MODULES.map((mod) => {
          const Icon = ICON_MAP[mod.icon] || BookOpen;
          const isDone = completedTradeModules.includes(mod.id);

          return (
            <div
              key={mod.id}
              className={`glass-panel rounded-2xl p-5 border transition flex flex-col justify-between gap-4 group bg-[#111a2e]/90 shadow-xl ${
                isDone ? 'border-emerald-500/60' : 'border-emerald-900/50 hover:border-emerald-500/60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  {isDone && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ĐÃ ĐẠT
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Chuyên đề {String(mod.number).padStart(2, '0')} · {mod.badge}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                    {mod.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {mod.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-emerald-900/40">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{mod.lessonsCount} bài</span>
                  <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" />{mod.quizCount} câu</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{mod.duration}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectModule(mod.id)}
                className="w-full py-2.5 rounded-xl bg-[#1a2742] border border-emerald-900/60 hover:border-emerald-500 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>{isDone ? 'Xem lại chuyên đề' : 'Bắt đầu học'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        Nội dung biên soạn bởi {TRADE_COURSE_META.author} · {TRADE_COURSE_META.updatedAt} ·
        Số liệu thị trường có thể thay đổi, nên kiểm tra lại trước khi sử dụng.
      </p>

    </div>
  );
}
