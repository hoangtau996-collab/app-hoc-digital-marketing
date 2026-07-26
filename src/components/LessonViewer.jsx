import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Briefcase, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Zap,
  ChevronRight
} from 'lucide-react';
import QuizComponent from './QuizComponent';

// Helper function to format bold **text** and bullet points nicely without raw ** asterisks
function FormattedBlock({ text }) {
  if (!text) return null;

  // Split lines
  const lines = text.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // Check headers
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={lIdx} className="text-base font-bold text-white pt-3 pb-1 border-b border-emerald-900/40">
              {parseInlineBold(trimmed.replace('### ', ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('#### ')) {
          return (
            <h5 key={lIdx} className="text-sm font-bold text-emerald-400 pt-2 pb-0.5">
              {parseInlineBold(trimmed.replace('#### ', ''))}
            </h5>
          );
        }

        // Check bullet lists
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const listText = trimmed.replace(/^[\*\-]\s+/, '');
          return (
            <div key={lIdx} className="flex items-start gap-2.5 pl-2 py-0.5 text-xs md:text-sm text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
              <div className="flex-1 leading-relaxed">{parseInlineBold(listText)}</div>
            </div>
          );
        }

        // Check numbered lists
        if (/^\d+\.\s+/.test(trimmed)) {
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={lIdx} className="flex items-start gap-2.5 pl-2 py-0.5 text-xs md:text-sm text-slate-300">
                <span className="text-xs font-bold text-emerald-400 shrink-0 mt-0.5">{numMatch[1]}.</span>
                <div className="flex-1 leading-relaxed">{parseInlineBold(numMatch[2])}</div>
              </div>
            );
          }
        }

        // Normal paragraph
        return (
          <p key={lIdx} className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {parseInlineBold(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Parses **bold** into styled <span> tags
function parseInlineBold(str) {
  if (!str) return '';
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const innerText = part.slice(2, -2);
      return (
        <strong key={idx} className="text-emerald-300 font-semibold">
          {innerText}
        </strong>
      );
    }
    return part;
  });
}

export default function LessonViewer({ 
  module, 
  onBack, 
  onNextModule, 
  onPrevModule, 
  onPassModule, 
  isCompleted 
}) {
  const [activeSubTab, setActiveSubTab] = useState('theory'); // 'theory', 'quiz'

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-emerald-900/40">
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-slate-900 border border-emerald-900/60 hover:border-emerald-500 text-emerald-400 flex items-center justify-center transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                Chuyên đề {module.number}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" /> {module.duration}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {module.title}
            </h2>
          </div>
        </div>

        {/* Subtab Toggle */}
        <div className="flex items-center bg-[#0d1713] p-1 rounded-xl border border-emerald-900/40 shrink-0">
          <button
            onClick={() => setActiveSubTab('theory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'theory'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Nội Dung Bài Học</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition relative ${
              activeSubTab === 'quiz'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Kiểm Tra Kiến Thức ({module.quizCount})</span>
            {isCompleted && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            )}
          </button>
        </div>

      </div>

      {/* Main Content Area */}
      {activeSubTab === 'theory' ? (
        <div className="space-y-8">
          
          {/* Module Banner Description */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#0d1c16] to-[#070d0a] border border-emerald-800/40">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xl shrink-0">
                {module.number}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{module.subtitle}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">{module.description}</p>
              </div>
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-6">
            {module.sections.map((sec) => (
              <div key={sec.id} className="glass-panel rounded-2xl p-6 md:p-8 border border-emerald-900/40 space-y-4">
                
                <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 border-b border-emerald-900/40 pb-3">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  {sec.title}
                </h3>

                {/* Formatted Content */}
                <div className="space-y-3">
                  <FormattedBlock text={sec.content} />
                </div>

                {sec.takeaway && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-700/50 text-xs text-emerald-200 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-emerald-400 block mb-0.5">Lưu ý cốt lõi cho Manager:</strong>
                      {parseInlineBold(sec.takeaway)}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Action Footer Button */}
          <div className="glass-panel p-6 rounded-2xl border border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Bạn đã nắm vững lý thuyết bài học này?</h4>
              <p className="text-xs text-slate-400">Hãy thực hành làm bài test gồm {module.quizCount} câu hỏi tình huống thực tế ngay.</p>
            </div>

            <button
              onClick={() => setActiveSubTab('quiz')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold flex items-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-950/50 transition cursor-pointer"
            >
              <span>Bắt Đầu Làm Quiz Kiểm Tra</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* Quiz Tab */
        <QuizComponent 
          key={module.id}
          module={module}
          onPassModule={onPassModule}
          isCompleted={isCompleted}
          onGoToTheory={() => setActiveSubTab('theory')}
        />
      )}

      {/* Prev / Next Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-emerald-900/40">
        <button
          onClick={onPrevModule}
          className="px-4 py-2 rounded-xl bg-[#0b1411] border border-emerald-900/50 hover:border-emerald-600 text-xs text-slate-300 font-semibold flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" /> Chuyên đề Trước
        </button>

        <button
          onClick={onNextModule}
          className="px-4 py-2 rounded-xl bg-[#0b1411] border border-emerald-900/50 hover:border-emerald-600 text-xs text-slate-300 font-semibold flex items-center gap-2 transition"
        >
          Chuyên đề Tiếp Theo <ArrowRight className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

    </div>
  );
}
