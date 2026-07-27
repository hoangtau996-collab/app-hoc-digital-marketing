import React from 'react';
import { X, Flame, ArrowRight, Clock, BookOpen } from 'lucide-react';

/**
 * Nhắc học viên quay lại khi đã quá 2 ngày không vào học.
 * Điều kiện hiện popup nằm ở src/utils/studyReminder.js
 */
export default function StudyReminderModal({
  isOpen,
  onClose,
  onSnooze,
  onContinue,
  idleDays = 0,
  studentName = '',
  completedCount = 0,
  totalModules = 0,
  nextModule = null,
}) {
  if (!isOpen) return null;

  const percent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  const remaining = Math.max(0, totalModules - completedCount);
  const firstName = String(studentName || '').trim().split(/\s+/).pop() || 'bạn';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-amber-500/50 p-6 sm:p-8 shadow-2xl space-y-5 my-8">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900 border border-amber-500/60 text-amber-400 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition cursor-pointer"
          title="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
            <Flame className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 border border-amber-700/60 text-amber-300 text-[11px] font-bold uppercase tracking-wide">
            <Clock className="w-3.5 h-3.5" />
            Đã {idleDays} ngày bạn chưa vào học
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
            Quay lại học tiếp nhé {firstName}!
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Bạn còn <strong className="text-amber-300">{remaining} chuyên đề</strong> nữa là hoàn tất khoá học
            và nhận Bằng Chứng Nhận của <strong className="text-emerald-300">HỌC VIỆN P MARCOM</strong>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111a2e] border border-emerald-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Tiến độ của bạn</span>
            <span className="font-bold text-emerald-400">{completedCount}/{totalModules} chuyên đề ({percent}%)</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-emerald-950">
            <div
              className="bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 h-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          {nextModule && (
            <div className="flex items-start gap-2.5 pt-2 border-t border-emerald-900/50 mt-1">
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-700/50 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Học tiếp từ</div>
                <div className="text-xs font-bold text-emerald-300 truncate">
                  {nextModule.number}. {nextModule.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{nextModule.subtitle}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onContinue}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-950/50 transition cursor-pointer"
          >
            <span>Tiếp Tục Học Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onSnooze}
            className="px-4 py-3 rounded-xl bg-slate-900 border border-emerald-900/60 hover:border-emerald-500 text-slate-300 text-xs font-bold transition cursor-pointer shrink-0"
          >
            Nhắc tôi ngày mai
          </button>
        </div>

      </div>
    </div>
  );
}
