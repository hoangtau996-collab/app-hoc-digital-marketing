import React, { useState } from 'react';
import { Award, X, CheckCircle2, Download, Printer, ShieldCheck, Sparkles } from 'lucide-react';

export default function CertificateModal({ 
  isOpen, 
  onClose, 
  passedCount, 
  totalModules 
}) {
  const [studentName, setStudentName] = useState("NGUYỄN VĂN A");
  const isEligible = passedCount === totalModules;
  const currentDate = new Date().toLocaleDateString('vi-VN');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-emerald-500/40 p-6 md:p-10 shadow-2xl bg-glow-radial space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Container (Print Target) */}
        <div id="certificate-print-area" className="p-8 md:p-12 rounded-2xl bg-[#08120d] border-2 border-emerald-500/50 relative overflow-hidden text-center space-y-6 shadow-2xl">
          
          {/* Watermark Chess Knight */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
            <span className="text-[280px] font-black text-emerald-400">♟</span>
          </div>

          {/* Certificate Header */}
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Award className="w-4 h-4 text-amber-400" /> CERTIFICATE OF COMPLETION
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-wider">
              CHỨNG NHẬN HOÀN THÀNH KHÓA HỌC
            </h2>
            <p className="text-xs md:text-sm text-emerald-400/80 font-bold uppercase tracking-widest">
              CHƯƠNG TRÌNH ĐÀO TẠO TRƯỞNG PHÒNG DIGITAL MARKETING
            </p>
          </div>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto" />

          {/* Student Name */}
          <div className="space-y-2 relative z-10">
            <p className="text-xs text-slate-400">Chứng nhận cấp cho Học viên:</p>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value.toUpperCase())}
              className="text-2xl md:text-4xl font-black text-gradient-emerald bg-transparent text-center border-b border-emerald-500/40 focus:outline-none focus:border-emerald-400 pb-1 w-full max-w-lg mx-auto"
            />
          </div>

          {/* Description */}
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed relative z-10">
            Đã hoàn tất xuất sắc toàn bộ <strong>11 Chuyên đề đào tạo thực chiến</strong> và vượt qua <strong>33 bài tập kiểm tra đánh giá năng lực quản lý Digital Marketing</strong> (Bao gồm Goals, Budgeting, Staffing, Campaign Creative, Planning & Effectiveness).
          </p>

          {/* Footer Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-emerald-900/50 max-w-xl mx-auto text-xs text-slate-400 relative z-10">
            <div className="text-left space-y-1">
              <div>Mã xác thực: <strong className="text-slate-200">DMM-2026-8892</strong></div>
              <div>Ngày cấp: <strong className="text-slate-200">{currentDate}</strong></div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-emerald-400 font-bold">HỘI ĐỒNG THẨM ĐỊNH</div>
              <div className="text-[11px] text-slate-400">Trưởng phòng Digital Marketing E-Learning</div>
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            Tiến độ bài test: <strong className="text-emerald-400">{passedCount}/{totalModules}</strong> chuyên đề đã đạt
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-950/50 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" /> In / Tải Chứng Chỉ PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
