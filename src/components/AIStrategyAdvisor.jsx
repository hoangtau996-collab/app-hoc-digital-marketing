import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AIStrategyAdvisor() {
  const [industry, setIndustry] = useState("Thời trang & Mỹ phẩm E-commerce");
  const [budget, setBudget] = useState(200000000);
  const [goal, setGoal] = useState("Tăng gấp 2 lần doanh thu trong 90 ngày nhưng chi phí CPM quảng cáo Meta đang tăng cao");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleRunStrategy = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        diagnosis: "Phụ thuộc quá 80% vào Meta Performance Ads ngắn hạn làm tăng đà trượt giá CPM.",
        strategy30Days: [
          "Dịch chuyển 25% ngân sách sang kênh TikTok Live + Booking KOC ngành Mỹ phẩm",
          "Xây dựng chuỗi Zalo ZNS / Automation Email nuôi dưỡng lại tệp 30.000 khách cũ (Tăng LTV)",
          "Thử nghiệm 15 mẫu Video Reels chuẩn công thức 3s Hook - Story - Offer"
        ],
        riskMitigation: "Xây dựng ngay 2 tài khoản Business Manager dự phòng (BM2500) để chống gãy dòng tiền khi đợt quét tài khoản xảy ra.",
        expectedROAS: "Nâng Blended ROAS từ 2.1x lên 3.8x sau 60 ngày."
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-3xl border border-emerald-500/30 space-y-6">
      
      <div className="flex items-center gap-3 border-b border-emerald-900/40 pb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-bold">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            TRỢ LÝ AI TƯ VẤN CHIẾN LƯỢC CHO TRƯỞNG PHÒNG (MODULE 11)
          </h3>
          <p className="text-xs text-slate-400">
            Giả lập phòng tư vấn dự án doanh nghiệp cho học viên.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Input Scenario */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Mô hình / Ngành hàng Doanh nghiệp:</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-[#0b1411] border border-emerald-900/60 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Ngân sách Quảng cáo Hàng tháng (VNĐ):</label>
            <input
              type="number"
              value={budget}
              step={10000000}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full bg-[#0b1411] border border-emerald-900/60 rounded-xl px-4 py-2 text-xs text-emerald-400 font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Mục tiêu & Nỗi đau hiện tại:</label>
            <textarea
              rows={3}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-[#0b1411] border border-emerald-900/60 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <button
            onClick={handleRunStrategy}
            disabled={isAnalyzing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-950/50 transition cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Đang Phân Tích Dữ Liệu...' : 'Chẩn Đoán & Xuất Đề Xuất Chiến Lược'}</span>
          </button>
        </div>

        {/* AI Result */}
        <div>
          {analysisResult ? (
            <div className="p-6 rounded-2xl bg-[#0b1411] border border-emerald-900/60 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" /> KẾT QUẢ CHẨN ĐOÁN CHIẾN LƯỢC AI
              </div>

              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/40 text-xs text-rose-200">
                <strong>Chẩn đoán Nỗi đau:</strong> {analysisResult.diagnosis}
              </div>

              <div className="space-y-2">
                <strong className="text-xs font-bold text-emerald-300 block">Kế hoạch Hành động 30 Ngày:</strong>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {analysisResult.strategy30Days.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300">
                <strong>Bảo vệ Ngân sách & Quản trị Rủi ro:</strong> {analysisResult.riskMitigation}
              </div>

              <div className="text-xs font-bold text-amber-400">
                Dự báo kết quả: {analysisResult.expectedROAS}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[250px] p-6 rounded-2xl bg-[#0b1411]/50 border border-dashed border-emerald-900/40 flex flex-col items-center justify-center text-center text-slate-500 text-xs space-y-2">
              <Bot className="w-10 h-10 text-emerald-900" />
              <p>Nhập thông số doanh nghiệp của bạn bên trái và bấm <strong className="text-slate-400">"Chẩn Đoán & Xuất Đề Xuất Chiến Lược"</strong> để nhận lời khuyên thực chiến từ Trợ lý Digital Manager.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
