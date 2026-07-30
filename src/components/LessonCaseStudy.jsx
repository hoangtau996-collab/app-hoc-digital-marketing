import React from 'react';
import { Building2, CheckCircle2, Lightbulb, BookMarked } from 'lucide-react';
import { LESSON_CASES } from '../data/lessonCases';

/**
 * Khối "Case thương hiệu thật" đặt cuối mỗi bài học.
 *
 * Vì sao tách hẳn khỏi phần lý thuyết về mặt thị giác: nội dung bài học dùng số
 * liệu giả định để dạy cách tính, còn khối này chỉ chứa sự việc đã xảy ra thật
 * kèm nguồn kiểm chứng. Nếu trình bày giống nhau, học viên sẽ nhớ lẫn hai loại
 * và đem con số minh hoạ đi trích dẫn như số liệu thị trường.
 *
 * Do đó khối này dùng tông hổ phách, khác hẳn tông ngọc lục bảo của phần lý
 * thuyết, và luôn hiện dòng nguồn ở cuối.
 */
export default function LessonCaseStudy({ sectionId }) {
  const c = LESSON_CASES[sectionId];
  if (!c) return null;

  return (
    <section className="my-5 rounded-2xl border-2 border-amber-500/40 bg-[#1a1608] shadow-xl overflow-hidden">

      <header className="px-4 sm:px-5 py-3 bg-amber-500/10 border-b border-amber-500/30 flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 shrink-0">
          <Building2 className="w-4 h-4 text-amber-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
              Case thương hiệu thật
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-600/50">
              {c.year}
            </span>
          </div>
          <h4 className="text-sm font-black text-amber-100 leading-snug mt-0.5">
            {c.brand} — {c.title}
          </h4>
        </div>
      </header>

      <div className="px-4 sm:px-5 py-4 space-y-4">

        <div className="space-y-2">
          {c.facts.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed flex-1">{f}</p>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-[#241d0a] border border-amber-600/40 flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-[11px] font-black text-amber-400 uppercase tracking-wide block">
              Trưởng phòng rút ra gì
            </strong>
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              {c.lesson}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 pt-1 border-t border-amber-900/50">
          <BookMarked className="w-3 h-3 text-slate-500 shrink-0 mt-1.5" />
          <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
            Nguồn kiểm chứng: {c.source}
          </p>
        </div>

      </div>
    </section>
  );
}
