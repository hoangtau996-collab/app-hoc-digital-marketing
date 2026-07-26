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
function VisualDiagram({ moduleId, sectionId }) {
  if (moduleId === 'module-01') {
    return (
      <div className="my-5 p-4 sm:p-5 rounded-2xl bg-[#06140e] border border-emerald-500/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            📊 SƠ ĐỒ KHUNG PHÂN BỔ NGÂN SÁCH 60/40 BRAND & PERFORMANCE
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">Mô hình Les Binet & Peter Field</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400">BRAND MARKETING (60%)</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">Dài Hạn</span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-amber-500/40">
              <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full w-[60%]" />
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1 pt-1">
              <li>🔹 Target: Toàn bộ thị trường (Broad Audience)</li>
              <li>🔹 KPI: Brand Search Volume, Sentiment, LTV</li>
              <li>🔹 Mục tiêu: Tạo niềm tin & giảm chi phí CAC tương lai</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-teal-950/60 border border-teal-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-teal-300">PERFORMANCE MARKETING (40%)</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-400 text-slate-950">Ngắn Hạn</span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-teal-500/40">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full w-[40%]" />
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1 pt-1">
              <li>🔹 Target: Tệp khách hàng có nhu cầu nóng (In-market)</li>
              <li>🔹 KPI: CPA, CPL, CVR, ROAS, Revenue</li>
              <li>🔹 Mục tiêu: Thu hồi vốn & tạo dòng tiền quay vòng lập tức</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (moduleId === 'module-02') {
    return (
      <div className="my-5 p-4 sm:p-5 rounded-2xl bg-[#06140e] border border-emerald-500/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            🔄 SƠ ĐỒ BÁNH ĐÀ HÀNH TRÌNH KHÁCH HÀNG (CUSTOMER JOURNEY FLYWHEEL)
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">5 Giai Đoạn Chuyển Đổi</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-xs font-bold">
          <div className="p-2 sm:p-3 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 space-y-1">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 mx-auto font-black flex items-center justify-center text-[10px]">1</div>
            <div className="font-extrabold text-white">Nhận Thức</div>
            <div className="text-[9px] text-slate-400">Reels, Video, Ads</div>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 space-y-1">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 mx-auto font-black flex items-center justify-center text-[10px]">2</div>
            <div className="font-extrabold text-white">Cân Nhắc</div>
            <div className="text-[9px] text-slate-400">SEO, Review, Chat</div>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-amber-950 border border-amber-600 text-amber-300 space-y-1">
            <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 mx-auto font-black flex items-center justify-center text-[10px]">3</div>
            <div className="font-extrabold text-white">Mua Hàng</div>
            <div className="text-[9px] text-amber-200">Offer, Checkout</div>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-teal-950 border border-teal-700 text-teal-300 space-y-1">
            <div className="w-6 h-6 rounded-full bg-teal-400 text-slate-950 mx-auto font-black flex items-center justify-center text-[10px]">4</div>
            <div className="font-extrabold text-white">Gắn Kết</div>
            <div className="text-[9px] text-slate-400">CSKH, Zalo OA</div>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 space-y-1">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 mx-auto font-black flex items-center justify-center text-[10px]">5</div>
            <div className="font-extrabold text-white">Trung Thành</div>
            <div className="text-[9px] text-slate-400">Upsell, Referral</div>
          </div>
        </div>
      </div>
    );
  }

  if (moduleId === 'module-03') {
    return (
      <div className="my-5 p-4 sm:p-5 rounded-2xl bg-[#06140e] border border-emerald-500/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            💰 SƠ ĐỒ QUẢN TRỊ NGÂN SÁCH RỦI RO 70 - 20 - 10
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">Tối Ưu Ngân Sách</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 space-y-1">
            <span className="text-xs font-black text-emerald-400">70% NGÂN SÁCH CỐ ĐỊNH</span>
            <p className="text-[11px] text-slate-300">Dành cho các kênh quảng cáo đã chứng minh hiệu quả ổn định (Core Channels: Meta, Google Search).</p>
          </div>
          <div className="p-3 rounded-xl bg-teal-950/80 border border-teal-600 space-y-1">
            <span className="text-xs font-black text-teal-300">20% NGÂN SÁCH TĂNG TRƯỞNG</span>
            <p className="text-[11px] text-slate-300">Mở rộng kênh quảng cáo tiềm năng mới (Emerging Channels: TikTok Ads, Shopee Ads, Influencers).</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-600 space-y-1">
            <span className="text-xs font-black text-amber-400">10% THỬ NGHIỆM ĐỘT PHÁ</span>
            <p className="text-[11px] text-slate-300">Thử nghiệm các hình thức tiếp cận tiên phong (AI Avatar Ads, Affiliate KOC bứt phá).</p>
          </div>
        </div>
      </div>
    );
  }

  // Generic High-Impact Diagram for Modules 04 - 11
  return (
    <div className="my-5 p-4 sm:p-5 rounded-2xl bg-[#06140e] border border-emerald-500/40 shadow-xl space-y-3">
      <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2">
        <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          📐 SƠ ĐỒ KHUNG CHIẾN LƯỢC QUẢN TRỊ THỰC CHIẾN - CHUYÊN ĐỀ {moduleId.replace('module-', '')}
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">P MARCOM Blueprint</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-900/60 space-y-1">
          <strong className="text-emerald-400 font-extrabold block">1. Đầu Vào (Inputs)</strong>
          <p className="text-[11px] text-slate-300">Nghiên cứu thị trường, chân dung khách hàng, ngân sách & dữ liệu quá khứ.</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/40 space-y-1">
          <strong className="text-amber-400 font-extrabold block">2. Thực Thi (Execution)</strong>
          <p className="text-[11px] text-slate-300">Sản xuất Creative, cài đặt kênh quảng cáo, tối ưu chuyển đổi CVR & A/B testing.</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/90 border border-teal-500/40 space-y-1">
          <strong className="text-teal-300 font-extrabold block">3. Đầu Ra (Outputs)</strong>
          <p className="text-[11px] text-slate-300">Đo lường ROI, báo cáo chỉ số tài chính CAC/LTV & tối ưu hóa quy trình dài hạn.</p>
        </div>
      </div>
    </div>
  );
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
        <div className="flex items-center bg-[#0d1713] p-1 rounded-xl border border-emerald-900/40 shrink-0 overflow-x-auto no-scrollbar">
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
          <div className="p-6 rounded-2xl bg-[#0c1813] border-2 border-emerald-500/50 shadow-xl">
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
                <VisualDiagram moduleId={module.id} sectionId={sec.id} />

                {sec.takeaway && (
                  <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-[#091a14] border-2 border-emerald-500/60 shadow-lg flex items-start gap-3.5">
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
