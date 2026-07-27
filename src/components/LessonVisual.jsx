import React from 'react';
import { LESSON_VISUALS } from '../data/lessonVisuals';

/**
 * Bộ kết xuất minh hoạ cho bài học.
 *
 * Trước đây mỗi sơ đồ là một khối JSX viết cứng và chỉ lọc theo moduleId, nên
 * cùng một sơ đồ bị lặp lại ở mọi bài trong cùng chuyên đề. Nay mỗi bài có một
 * spec riêng khai báo trong src/data/lessonVisuals.js, tra theo sectionId.
 *
 * Lưu ý Tailwind: KHÔNG ghép tên lớp động kiểu `text-${c}-300` vì trình quét
 * của Tailwind không sinh ra lớp đó. Mọi lớp phải là chuỗi tĩnh -> dùng bảng TONE.
 */

const TONE = {
  emerald: {
    card: 'border-emerald-700/60 bg-emerald-950/50',
    text: 'text-emerald-300',
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    chip: 'bg-emerald-500 text-slate-950',
    dot: 'bg-emerald-400',
  },
  amber: {
    card: 'border-amber-700/60 bg-amber-950/50',
    text: 'text-amber-300',
    bar: 'bg-gradient-to-r from-amber-500 to-amber-300',
    chip: 'bg-amber-400 text-slate-950',
    dot: 'bg-amber-400',
  },
  teal: {
    card: 'border-teal-700/60 bg-teal-950/50',
    text: 'text-teal-300',
    bar: 'bg-gradient-to-r from-teal-500 to-emerald-400',
    chip: 'bg-teal-400 text-slate-950',
    dot: 'bg-teal-400',
  },
  rose: {
    card: 'border-rose-700/60 bg-rose-950/50',
    text: 'text-rose-300',
    bar: 'bg-gradient-to-r from-rose-500 to-rose-400',
    chip: 'bg-rose-400 text-slate-950',
    dot: 'bg-rose-400',
  },
  sky: {
    card: 'border-sky-700/60 bg-sky-950/50',
    text: 'text-sky-300',
    bar: 'bg-gradient-to-r from-sky-500 to-cyan-400',
    chip: 'bg-sky-400 text-slate-950',
    dot: 'bg-sky-400',
  },
};

const tone = (name) => TONE[name] || TONE.emerald;

function Shell({ title, badge, children }) {
  return (
    <div className="my-5 p-4 sm:p-5 rounded-2xl bg-[#06140e] border border-emerald-500/40 shadow-xl space-y-4">
      <div className="flex items-start justify-between gap-3 border-b border-emerald-900/60 pb-2">
        <span className="text-xs font-black text-emerald-400 uppercase tracking-wider leading-snug">
          {title}
        </span>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 shrink-0">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* Hai đến ba thẻ đặt cạnh nhau để đối chiếu. */
function Compare({ items }) {
  return (
    <div className={`grid grid-cols-1 ${items.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
      {items.map((it, i) => {
        const t = tone(it.color);
        return (
          <div key={i} className={`p-3.5 rounded-xl border space-y-2 ${t.card}`}>
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-black ${t.text}`}>{it.label}</span>
              {it.tag && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${t.chip}`}>{it.tag}</span>
              )}
            </div>
            {typeof it.percent === 'number' && (
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-emerald-900/60">
                <div className={`h-full ${t.bar}`} style={{ width: `${Math.min(100, it.percent)}%` }} />
              </div>
            )}
            {it.value && <div className={`text-sm font-black ${t.text}`}>{it.value}</div>}
            <ul className="text-[11px] text-slate-300 space-y-1 pt-0.5">
              {(it.points || []).map((p, k) => (
                <li key={k} className="flex items-start gap-1.5">
                  <span className={`w-1 h-1 rounded-full shrink-0 mt-1.5 ${t.dot}`} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* Dải phân bổ theo phần trăm, xếp dọc. */
function Bars({ items }) {
  return (
    <div className="space-y-2.5">
      {items.map((it, i) => {
        const t = tone(it.color);
        return (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className={`font-black ${t.text}`}>{it.label}</span>
              <span className="text-slate-400 font-bold">{it.value || `${it.percent}%`}</span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-emerald-900/60">
              <div className={`h-full ${t.bar}`} style={{ width: `${Math.min(100, it.percent)}%` }} />
            </div>
            {it.note && <p className="text-[10px] text-slate-400 leading-relaxed">{it.note}</p>}
          </div>
        );
      })}
    </div>
  );
}

/* Các bước đánh số nối tiếp nhau. */
function Flow({ steps }) {
  return (
    <div className="space-y-2">
      {steps.map((s, i) => {
        const t = tone(s.color);
        return (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black ${t.chip}`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && <div className="w-px flex-1 min-h-[14px] bg-emerald-800/70 my-0.5" />}
            </div>
            <div className="pb-2 space-y-0.5">
              <div className={`text-xs font-black ${t.text}`}>{s.label}</div>
              {s.desc && <div className="text-[11px] text-slate-300 leading-relaxed">{s.desc}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Phễu thu hẹp dần, bề rộng tỉ lệ với giá trị lớn nhất. */
function Funnel({ stages }) {
  const max = Math.max(...stages.map((s) => Number(s.raw) || 1));
  return (
    <div className="space-y-1.5">
      {stages.map((s, i) => {
        const t = tone(s.color);
        const w = Math.max(18, ((Number(s.raw) || 0) / max) * 100);
        return (
          <div key={i} className="space-y-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-semibold">{s.label}</span>
              <span className={`font-black ${t.text}`}>{s.value}</span>
            </div>
            <div className="w-full bg-slate-950/60 h-6 rounded-lg overflow-hidden border border-emerald-900/50">
              <div
                className={`h-full ${t.bar} flex items-center justify-end pr-2`}
                style={{ width: `${w}%` }}
              >
                {s.drop && <span className="text-[9px] font-black text-slate-950">{s.drop}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Lưới ô số liệu. */
function Stats({ items }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {items.map((it, i) => {
        const t = tone(it.color);
        return (
          <div key={i} className={`p-3 rounded-xl border space-y-1 ${t.card}`}>
            <div className="text-[10px] text-slate-400 font-semibold leading-tight">{it.label}</div>
            <div className={`text-base sm:text-lg font-black ${t.text}`}>{it.value}</div>
            {it.note && <div className="text-[9px] text-slate-400 leading-tight">{it.note}</div>}
          </div>
        );
      })}
    </div>
  );
}

export default function LessonVisual({ sectionId }) {
  const spec = LESSON_VISUALS[sectionId];
  if (!spec) return null;

  return (
    <Shell title={spec.title} badge={spec.badge}>
      {spec.kind === 'compare' && <Compare items={spec.items} />}
      {spec.kind === 'bars' && <Bars items={spec.items} />}
      {spec.kind === 'flow' && <Flow steps={spec.steps} />}
      {spec.kind === 'funnel' && <Funnel stages={spec.stages} />}
      {spec.kind === 'stats' && <Stats items={spec.items} />}
      {spec.footnote && (
        <p className="text-[10px] text-slate-400 italic leading-relaxed border-t border-emerald-900/50 pt-2">
          {spec.footnote}
        </p>
      )}
    </Shell>
  );
}
