import React, { useState } from 'react';
import LessonVisual from './LessonVisual';
import LessonIllustration from './LessonIllustration';
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
import DigitalGlossary from './DigitalGlossary';

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
        <strong key={idx} className="text-emerald-300 font-extrabold px-0.5">
          {innerText}
        </strong>
      );
    }
    return part;
  });
}

// Visual Diagrams & Infographics renderer for each lesson section
// Sơ đồ minh hoạ nay tra theo sectionId trong src/data/lessonVisuals.js

export default function LessonViewer({ 
  module, 
  onBack, 
  onNextModule, 
  onPrevModule, 
  onPassModule, 
  isCompleted 
}) {
  const [activeSubTab, setActiveSubTab] = useState('theory'); // 'theory', 'quiz'

  if (!module) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl border border-emerald-900/40 text-slate-300 space-y-4">
        <p className="text-sm font-bold text-emerald-400">Không tìm thấy dữ liệu bài học này.</p>
        <button 
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs"
        >
          Quay Lại Danh Sách Chuyên Đề
        </button>
      </div>
    );
  }

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
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                {module.badge || "Thực Chiến"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {module.title}
            </h2>
          </div>
        </div>

        {/* Subtab Toggle */}
        <div className="flex items-center bg-[#18243d] p-1 rounded-xl border border-emerald-900/40 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('theory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs font-bold transition shrink-0 ${
              activeSubTab === 'theory'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Nội Dung Bài Học</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('glossary')}
            className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs font-bold transition shrink-0 ${
              activeSubTab === 'glossary'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Thuật Ngữ & Công Thức</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs font-bold transition relative shrink-0 ${
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
          <div className="p-6 rounded-2xl bg-[#16213a] border-2 border-emerald-500/50 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-300 font-black text-xl shrink-0 shadow-md">
                {module.number}
              </div>
              <div>
                <h3 className="text-lg font-black text-emerald-300 tracking-wide">{module.subtitle}</h3>
                <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed mt-1">{module.description}</p>
              </div>
            </div>
          </div>

          {/* Ảnh minh hoạ khái quát cho cả chuyên đề */}
          <LessonIllustration moduleId={module.id} />

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

                {/* Visual Diagram & Infographic Blueprint */}
                <LessonVisual sectionId={sec.id} />

                {sec.takeaway && (
                  <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-[#17233f] border-2 border-emerald-500/60 shadow-lg flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/40">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                      <strong className="text-xs sm:text-sm font-black text-emerald-400 tracking-wide block uppercase">
                        💡 Lưu ý cốt lõi cho Manager:
                      </strong>
                      <div className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                        {parseInlineBold(sec.takeaway)}
                      </div>
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
      ) : activeSubTab === 'glossary' ? (
        /* Glossary & Calculator Tab inside Lesson */
        <DigitalGlossary />
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
          className="px-4 py-2 rounded-xl bg-[#152037] border border-emerald-900/50 hover:border-emerald-600 text-xs text-slate-300 font-semibold flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" /> Chuyên đề Trước
        </button>

        <button
          onClick={onNextModule}
          className="px-4 py-2 rounded-xl bg-[#152037] border border-emerald-900/50 hover:border-emerald-600 text-xs text-slate-300 font-semibold flex items-center gap-2 transition"
        >
          Chuyên đề Tiếp Theo <ArrowRight className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

    </div>
  );
}
