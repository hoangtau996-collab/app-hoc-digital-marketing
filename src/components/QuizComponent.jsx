import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  HelpCircle, 
  ArrowRight,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function QuizComponent({ 
  module, 
  onPassModule, 
  isCompleted 
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qIndex, optionIndex) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    module.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / module.quiz.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);

    if (calculatedScore >= 66) { // Passed 2 out of 3 or 3 out of 3
      onPassModule(module.id);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const allAnswered = Object.keys(selectedAnswers).length === module.quiz.length;

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 border border-emerald-900/50 space-y-6">
      
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-emerald-900/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            BÀI KIỂM TRA ĐÁNH GIÁ KIẾN THỨC
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            {module.number}. {module.title}
          </h3>
        </div>

        {isCompleted && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Đã Đạt Chuẩn
          </span>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-8">
        {module.quiz.map((q, qIndex) => {
          const selected = selectedAnswers[qIndex];
          const isCorrect = selected === q.correct;

          return (
            <div key={q.id || qIndex} className="p-5 rounded-xl bg-[#0b1411]/90 border border-emerald-900/40 space-y-4">
              
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-800">
                  {qIndex + 1}
                </span>
                <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 pl-9">
                {q.options.map((opt, optIndex) => {
                  let optStyle = "bg-[#0d1814] border-emerald-950/60 text-slate-300 hover:border-emerald-700/50";
                  
                  if (selected === optIndex) {
                    optStyle = "bg-emerald-950/80 border-emerald-500 text-white font-medium";
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
                      <span className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span className="flex-1">{opt}</span>

                      {submitted && optIndex === q.correct && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {submitted && selected === optIndex && selected !== q.correct && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submit */}
              {submitted && (
                <div className="pl-9 pt-2">
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-slate-300 space-y-1">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Giải thích chi tiết cho Trưởng phòng:
                    </div>
                    <p className="leading-relaxed">{q.explanation}</p>
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
          <button
            disabled={!allAnswered}
            onClick={handleSubmit}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              allAnswered
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-950/50 cursor-pointer'
                : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
            }`}
          >
            <span>Nộp Bài Kiểm Tra</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border ${
                score >= 66
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                  : 'bg-rose-950 border-rose-600 text-rose-400'
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

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-emerald-900/60 hover:border-emerald-500 text-slate-300 text-xs font-semibold flex items-center gap-2 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" /> Làm lại bài test
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
