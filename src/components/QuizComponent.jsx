import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  ArrowRight,
  Sparkles,
  AlertCircle,
  BookOpen
} from 'lucide-react';

/**
 * Xáo thứ tự lựa chọn của từng câu hỏi.
 *
 * Vì sao cần: trong 55 câu của khoá chính, đáp án đúng CHƯA BAO GIỜ nằm ở vị
 * trí thứ ba hay thứ tư — 20 câu ở vị trí một, 35 câu ở vị trí hai. Học viên
 * chỉ cần đoán trong hai lựa chọn đầu là vượt ngưỡng đạt 66%.
 *
 * Xáo ở tầng hiển thị thay vì sửa dữ liệu gốc: dữ liệu giữ nguyên nên dễ soát
 * và dễ sửa nội dung, đồng thời mọi câu hỏi thêm về sau tự động được bảo vệ.
 *
 * Hạt giống lấy từ id câu hỏi nên thứ tự CỐ ĐỊNH giữa các lần mở. Nếu xáo ngẫu
 * nhiên thật thì mỗi lần kết xuất lại một thứ tự khác, và đáp án học viên vừa
 * chọn sẽ trỏ sang lựa chọn khác.
 */
function shuffleQuizOptions(quiz) {
  if (!Array.isArray(quiz)) return [];

  return quiz.map((q) => {
    if (!Array.isArray(q.options) || q.options.length < 2) return q;

    // Băm chuỗi id thành số nguyên (biến thể FNV-1a, đủ dùng cho mục đích này)
    let seed = 2166136261;
    const key = String(q.id || q.question || '');
    for (let i = 0; i < key.length; i++) {
      seed ^= key.charCodeAt(i);
      seed = Math.imul(seed, 16777619) >>> 0;
    }
    const nextRandom = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    // Fisher-Yates trên mảng chỉ số, rồi ánh xạ lại vị trí đáp án đúng
    const order = q.options.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(nextRandom() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    return {
      ...q,
      options: order.map((i) => q.options[i]),
      correct: order.indexOf(q.correct)
    };
  });
}

export default function QuizComponent({
  module, 
  onPassModule, 
  isCompleted,
  onGoToTheory
}) {
  // Hậu tố _v2: thứ tự lựa chọn nay được xáo (xem shuffleQuizOptions bên dưới).
  // Kết quả lưu theo khoá cũ ghi đáp án đã chọn theo thứ tự GỐC, đọc lại bằng
  // thứ tự mới sẽ tô sáng nhầm ô. Tiến độ hoàn thành chuyên đề lưu ở chỗ khác
  // nên không bị ảnh hưởng, chỉ là bài đã làm hiện lại như chưa làm.
  const storageKey = `dmm_quiz_results_v2_${module.id}`;

  // Xáo một lần cho mỗi chuyên đề, không xáo lại ở mỗi lần kết xuất — nếu
  // không, mỗi lần bấm chọn là các lựa chọn lại nhảy chỗ.
  const quiz = useMemo(() => shuffleQuizOptions(module.quiz), [module.quiz]);

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showValidation, setShowValidation] = useState(false);

  // Load saved state from localStorage whenever module.id changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.score === 'number' && parsed.selectedAnswers) {
          setSelectedAnswers(parsed.selectedAnswers);
          setSubmitted(true);
          setScore(parsed.score);
          return;
        }
      }
    } catch (e) {
      console.error("Error loading quiz state from localStorage", e);
    }
    // Reset to clean state if no saved result
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setShowValidation(false);
  }, [module.id, storageKey]);

  const handleSelect = (qIndex, optionIndex) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
    setShowValidation(false);
  };

  const answeredCount = Object.keys(selectedAnswers).filter(
    k => selectedAnswers[k] !== undefined && selectedAnswers[k] !== null
  ).length;
  const totalQuestions = quiz.length;
  const isAllAnswered = answeredCount === totalQuestions && totalQuestions > 0;

  const handleSubmit = () => {
    if (!isAllAnswered) {
      setShowValidation(true);
      return;
    }

    let correctCount = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
    setShowValidation(false);

    // Save to localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        selectedAnswers,
        score: calculatedScore,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error("Error saving quiz state", e);
    }

    if (calculatedScore >= 66) { // Passed 2 out of 3 or 3 out of 3
      onPassModule(module.id);
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setShowValidation(false);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error("Error clearing quiz state", e);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 border border-emerald-900/50 space-y-6">
      
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            BÀI KIỂM TRA ĐÁNH GIÁ KIẾN THỨC
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            {module.number}. {module.title}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Answer Progress Tracker */}
          {!submitted && (
            <div className="flex items-center gap-2 bg-[#152038] px-3 py-1.5 rounded-xl border border-emerald-900/60 text-xs text-slate-300">
              <span>Đã chọn:</span>
              <span className={`font-bold ${isAllAnswered ? 'text-emerald-400' : 'text-amber-400'}`}>
                {answeredCount}/{totalQuestions}
              </span>
            </div>
          )}

          {isCompleted && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Đã Đạt Chuẩn
            </span>
          )}
        </div>
      </div>

      {/* Validation Warning Alert */}
      {showValidation && !isAllAnswered && (
        <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs flex items-center gap-3 animate-pulse">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <strong className="font-bold text-amber-300">Vui lòng chọn đầy đủ đáp án!</strong> Bạn mới hoàn thành {answeredCount}/{totalQuestions} câu hỏi. Hãy trả lời các câu còn thiếu bên dưới để bấm nộp bài.
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-8">
        {quiz.map((q, qIndex) => {
          const selected = selectedAnswers[qIndex];
          const isUnanswered = selected === undefined || selected === null;
          const isQuestionWarning = showValidation && isUnanswered;

          return (
            <div 
              key={q.id || qIndex} 
              className={`p-5 rounded-xl transition ${
                isQuestionWarning 
                  ? 'bg-amber-950/20 border-2 border-amber-500/80 shadow-lg shadow-amber-950/50' 
                  : 'bg-[#152037]/90 border border-emerald-900/40'
              } space-y-4`}
            >
              
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border ${
                    selected !== undefined 
                      ? 'bg-emerald-900 text-emerald-300 border-emerald-600' 
                      : isQuestionWarning
                        ? 'bg-amber-900 text-amber-200 border-amber-500'
                        : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  }`}>
                    {qIndex + 1}
                  </span>
                  <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                    {q.question}
                  </p>
                </div>

                {isQuestionWarning && (
                  <span className="text-[11px] font-bold text-amber-400 shrink-0 flex items-center gap-1 bg-amber-950 px-2 py-0.5 rounded border border-amber-600/40">
                    <AlertCircle className="w-3.5 h-3.5" /> Chưa chọn
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2 pl-9">
                {q.options.map((opt, optIndex) => {
                  let optStyle = "bg-[#18243e] border-emerald-950/60 text-slate-300 hover:border-emerald-700/50";
                  
                  if (selected === optIndex) {
                    optStyle = "bg-emerald-950/80 border-emerald-500 text-white font-medium shadow-sm";
                  }

                  if (submitted) {
                    if (optIndex === q.correct) {
                      optStyle = "bg-emerald-950 border-emerald-400 text-emerald-200 font-semibold shadow-sm";
                    } else if (selected === optIndex && selected !== q.correct) {
                      optStyle = "bg-rose-950/70 border-rose-600 text-rose-200 font-semibold";
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      disabled={submitted}
                      onClick={() => handleSelect(qIndex, optIndex)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-start gap-3 ${optStyle}`}
                    >
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                        selected === optIndex ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'border-emerald-800/80'
                      }`}>
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>

                      {submitted && optIndex === q.correct && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {submitted && selected === optIndex && selected !== q.correct && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submit */}
              {submitted && (
                <div className="pl-9 pt-2">
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-slate-300 space-y-1.5">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" /> Giải thích chi tiết cho Trưởng phòng:
                    </div>
                    <p className="leading-relaxed text-slate-300">{q.explanation}</p>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Submit / Result Section */}
      <div className="pt-4 border-t border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {!submitted ? (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              {isAllAnswered ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Đã sẵn sàng! Bạn có thể bấm nộp bài.
                </span>
              ) : (
                <span>Hãy chọn đầy đủ đáp án trước khi bấm Nộp Bài.</span>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                isAllAnswered
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-950/50'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              }`}
            >
              <span>Nộp Bài Kiểm Tra</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border shrink-0 ${
                score >= 66
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-950'
                  : 'bg-rose-950 border-rose-600 text-rose-400 shadow-md shadow-rose-950'
              }`}>
                {score}%
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {score >= 66 ? 'ĐẠT YÊU CẦU CHUYÊN ĐỀ!' : 'CHƯA ĐẠT ĐIỂM CHUẨN (CẦN > 66%)'}
                </h4>
                <p className="text-xs text-slate-400">
                  {score >= 66 
                    ? 'Chúc mừng! Kiến thức đã được tích lũy vào hệ thống Chứng nhận.'
                    : 'Hãy đọc lại nội dung bài học và thử sức lại bài kiểm tra nhé.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {score < 66 && onGoToTheory && (
                <button
                  onClick={onGoToTheory}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-700 hover:border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" /> Ôn lại Lý thuyết
                </button>
              )}

              <button
                onClick={handleReset}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-900/60 hover:border-emerald-500 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" /> Làm lại bài test
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

