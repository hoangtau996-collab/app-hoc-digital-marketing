import React, { useState } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { ChevronRight, ChevronLeft, Lock, CheckCircle2, Award } from 'lucide-react';
import {
  SURVEY_QUESTIONS,
  SURVEY_TOTAL,
  SURVEY_VERSION,
  otherKeyOf,
  isAnswered
} from '../data/surveyQuestions';

/**
 * KHẢO SÁT ĐẦU VÀO — mỗi màn một câu, bấm đáp án là sang câu kế.
 *
 * Vì sao mỗi màn một câu chứ không dựng cả năm câu trong một biểu mẫu dài: bảng
 * này bật lên ngay sau khi đăng ký, đúng lúc học viên đang muốn vào học. Một
 * biểu mẫu dài hiện ra lúc đó trông như một hàng rào; năm màn bấm một nhát là
 * xong thì không.
 *
 * HAI CHẾ ĐỘ:
 *   - Thường (`mandatory = false`): có nút "Bỏ qua". Dùng sau khi đăng ký và ở
 *     các lần đăng nhập sau.
 *   - Bắt buộc (`mandatory = true`): KHÔNG có nút bỏ qua và không đóng được
 *     bằng phím Esc hay bấm ra ngoài. Dùng ở bước nhận Bằng Chứng Nhận.
 *
 * Ở chế độ bắt buộc, lý do bị chặn phải nói thẳng ra màn hình. Chặn mà không
 * giải thích thì học viên tưởng nút cấp bằng bị hỏng.
 */
export default function SurveyModal({
  isOpen,
  onClose,
  onSubmit,
  onSkip,
  studentName = '',
  mandatory = false,
  // Phần đã trả lời ở lần trước, nếu học viên từng bỏ dở. Nạp lại để họ không
  // phải làm lại những câu đã bấm — và để bắt đầu ngay ở câu còn thiếu.
  initialAnswers = {}
}) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [step, setStep] = useState(() => {
    const firstUnanswered = SURVEY_QUESTIONS.findIndex((q) => !isAnswered(q, initialAnswers));
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const question = SURVEY_QUESTIONS[step];
  const chosen = answers[question.id];
  const chosenOption = question.options.find((o) => o.value === chosen);
  const needsText = Boolean(chosenOption?.allowText);
  const canAdvance = isAnswered(question, answers);
  const isLast = step === SURVEY_TOTAL - 1;

  const goNext = () => {
    if (!canAdvance) return;
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    setIsSaving(true);
    onSubmit({
      answers,
      completedAt: new Date().toISOString(),
      version: SURVEY_VERSION
    });
  };

  const pick = (option) => {
    const next = { ...answers, [question.id]: option.value };
    // Đổi sang đáp án khác thì bỏ luôn phần ghi thêm của đáp án cũ, nếu không
    // bản ghi sẽ mang theo một dòng chữ không còn thuộc về đáp án nào.
    if (!option.allowText) delete next[otherKeyOf(question.id)];
    setAnswers(next);

    // Đáp án thường: sang câu kế ngay, không bắt bấm thêm nút xác nhận.
    // Đáp án có ô ghi thêm thì phải dừng lại để người ta gõ.
    if (!option.allowText) {
      if (!isLast) {
        setStep(step + 1);
      } else {
        setIsSaving(true);
        onSubmit({
          answers: next,
          completedAt: new Date().toISOString(),
          version: SURVEY_VERSION
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/92 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-emerald-500/40 p-5 sm:p-8 shadow-2xl my-auto space-y-5">

        {/* Đầu khung */}
        <div className="flex items-center gap-3">
          <PMarcomLogo className="w-9 h-9 shrink-0" showText={false} />
          <div className="min-w-0">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-black border border-emerald-700 uppercase tracking-wider">
              Khảo sát nhu cầu học viên
            </span>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {studentName ? `${studentName} · ` : ''}5 câu, mỗi câu một lượt bấm
            </p>
          </div>
        </div>

        {/* Vì sao bị chặn — chỉ ở chế độ bắt buộc */}
        {mandatory && (
          <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-[11.5px] leading-relaxed flex gap-2.5">
            <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-amber-300">Còn một bước nữa là nhận được Bằng Chứng Nhận.</strong>{' '}
              Bạn đã bỏ qua khảo sát này ở những lần trước, nên Học Viện xin phép hỏi nốt trước khi cấp bằng.
              Câu trả lời dùng để thiết kế khoá nâng cao đúng với công việc của bạn — mất chưa tới một phút.
            </span>
          </div>
        )}

        {/* Câu hỏi */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">
              Câu {step + 1}/{SURVEY_TOTAL}
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white leading-snug tracking-tight">
            {question.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{question.hint}</p>
        </div>

        {/* Đáp án */}
        <div className="space-y-2.5">
          {question.options.map((opt) => {
            const active = chosen === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => pick(opt)}
                className={`w-full text-left px-4 py-3.5 rounded-2xl border flex items-center gap-3 transition cursor-pointer ${
                  active
                    ? 'bg-emerald-600/20 border-emerald-400 shadow-lg'
                    : 'bg-slate-900/70 border-emerald-900/60 hover:border-emerald-500 hover:bg-slate-900'
                }`}
              >
                <span className={`flex-1 text-xs sm:text-sm font-bold leading-snug ${active ? 'text-white' : 'text-slate-200'}`}>
                  {opt.label}
                </span>
                {active ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </button>
            );
          })}

          {/* Ô ghi thêm, chỉ hiện khi đáp án đang chọn cho phép */}
          {needsText && (
            <div className="pl-1 pt-0.5 space-y-1.5">
              <input
                autoFocus
                type="text"
                value={answers[otherKeyOf(question.id)] || ''}
                onChange={(e) =>
                  setAnswers({ ...answers, [otherKeyOf(question.id)]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canAdvance) goNext();
                }}
                maxLength={120}
                placeholder={chosenOption.textPlaceholder || 'Bạn ghi rõ giúp Học Viện nhé'}
                className="w-full bg-[#0e1526] border border-emerald-500/70 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition"
              />
              {!canAdvance && (
                <p className="text-[10.5px] text-amber-400 font-semibold">
                  Chọn "Khác" thì cần ghi rõ — bỏ trống thì câu trả lời không dùng để phân nhóm được.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Chân khung: tiến độ · quay lại · bỏ qua · tiếp tục */}
        <div className="pt-1 space-y-3">
          <div className="flex items-center gap-1.5">
            {SURVEY_QUESTIONS.map((q, i) => (
              <span
                key={q.id}
                className={`h-1.5 rounded-full transition-all ${
                  i === step
                    ? 'w-7 bg-emerald-400'
                    : i < step
                      ? 'w-4 bg-emerald-700'
                      : 'w-4 bg-slate-700'
                }`}
              />
            ))}
            <span className="ml-2 text-[11px] text-slate-400 font-semibold">
              Bước {step + 1}/{SURVEY_TOTAL}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-emerald-900/60 text-slate-300 hover:border-emerald-500 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Quay lại
              </button>
            )}

            {/* Nút bỏ qua KHÔNG được dựng ra ở chế độ bắt buộc — không vẽ nút
                rồi chặn, mà không vẽ. */}
            {!mandatory && (
              <button
                type="button"
                // Trả phần đã bấm lên trên khi bỏ qua. Trả lời dở dang vẫn là dữ
                // liệu — biết học viên dừng ở câu nào cũng nói lên điều gì đó —
                // và lần sau họ không phải bấm lại từ đầu.
                onClick={() => { onSkip(answers); onClose(); }}
                className="px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-[11px] font-bold transition cursor-pointer"
              >
                Bỏ qua
              </button>
            )}

            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance || isSaving}
              className="ml-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs flex items-center gap-1.5 hover:brightness-110 shadow-lg transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{isSaving ? 'Đang lưu...' : isLast ? 'Hoàn tất khảo sát' : 'Tiếp tục'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {mandatory && (
            <p className="text-[10.5px] text-slate-500 flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Hoàn tất khảo sát là Bằng Chứng Nhận mở ra ngay.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
