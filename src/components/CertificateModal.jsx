import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import PMarcomLogo from './PMarcomLogo';
import { 
  Award, 
  X, 
  CheckCircle2, 
  Printer, 
  Download, 
  FileText,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function CertificateModal({ 
  isOpen, 
  onClose, 
  passedCount, 
  totalModules 
}) {
  const [studentName, setStudentName] = useState(() => {
    try {
      return localStorage.getItem('dmm_student_name') || "NGUYỄN VĂN A";
    } catch (e) {
      return "NGUYỄN VĂN A";
    }
  });

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('dmm_student_name', studentName);
    } catch (e) {
      console.error("Error saving student name", e);
    }
  }, [studentName]);

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('vi-VN');

  // Handle PNG Image Download
  const handleDownloadPNG = async () => {
    const certArea = document.getElementById('certificate-print-area');
    if (!certArea) return;

    try {
      setIsExporting(true);
      const canvas = await html2canvas(certArea, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#08120d',
        logging: false
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const filename = `ChungNhan_PMARCOM_${studentName.trim().replace(/\s+/g, '_')}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error exporting certificate image", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle PDF Document Download
  const handleDownloadPDF = async () => {
    const certArea = document.getElementById('certificate-print-area');
    if (!certArea) return;

    try {
      setIsExporting(true);
      const canvas = await html2canvas(certArea, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#08120d',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const filename = `ChungNhan_PMARCOM_${studentName.trim().replace(/\s+/g, '_')}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("Error exporting PDF", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-emerald-500/40 p-4 sm:p-8 md:p-10 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Container (Print Target) */}
        <div id="certificate-print-area" className="p-6 sm:p-10 md:p-12 rounded-2xl bg-[#08120d] border-2 border-emerald-500/50 relative overflow-hidden text-center space-y-6 shadow-2xl">
          
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
            <PMarcomLogo className="w-96 h-96" showText={false} />
          </div>

          {/* Certificate Header Branding */}
          <div className="space-y-3 relative z-10">
            <div className="flex justify-center mb-1">
              <PMarcomLogo className="w-12 h-12 sm:w-14 sm:h-14" showText={true} textClassName="text-xl sm:text-2xl font-black text-white" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-amber-300 text-xs font-bold uppercase tracking-widest">
              <Award className="w-4 h-4 text-amber-400" /> CERTIFICATE OF COMPLETION
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wider uppercase">
              CHỨNG NHẬN HOÀN THÀNH KHÓA HỌC
            </h2>
            <p className="text-xs sm:text-sm text-emerald-400 font-bold uppercase tracking-widest">
              CHƯƠNG TRÌNH ĐÀO TẠO TRƯỞNG PHÒNG DIGITAL MARKETING THỰC CHIẾN
            </p>
          </div>

          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto" />

          {/* Editable Student Name */}
          <div className="space-y-2 relative z-10">
            <p className="text-xs text-slate-400 italic">Chứng nhận cấp cho Học viên:</p>
            <div className="relative max-w-lg mx-auto">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value.toUpperCase())}
                placeholder="NHẬP HỌ VÀ TÊN HỌC VIÊN"
                className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-400 bg-transparent text-center border-b-2 border-emerald-500/60 focus:border-amber-400 focus:outline-none pb-1.5 w-full uppercase tracking-wider transition"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                (Click vào ô trên để chỉnh sửa họ tên học viên theo ý muốn)
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed relative z-10">
            Đã hoàn tất xuất sắc toàn bộ <strong>11 Chuyên đề đào tạo thực chiến</strong> và vượt qua <strong>33 bài tập kiểm tra đánh giá năng lực quản lý Digital Marketing</strong> tại <strong>HỌC VIỆN P MARCOM</strong> (Bao gồm Goals, Budgeting, Staffing, Campaign Creative, Planning & Effectiveness).
          </p>

          {/* Footer Signatures & Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-emerald-900/50 max-w-2xl mx-auto text-xs relative z-10 items-end">
            
            {/* Verification Metadata */}
            <div className="text-left space-y-1.5 text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" /> BẢO CHỨNG BỞI P MARCOM
              </div>
              <div>Mã xác thực: <strong className="text-slate-200">PMC-2026-8892</strong></div>
              <div>Ngày cấp: <strong className="text-slate-200">{currentDate}</strong></div>
            </div>

            {/* Founder & CEO Signature Block */}
            <div className="text-center sm:text-right space-y-1">
              <div className="text-amber-400 font-extrabold tracking-wide uppercase text-xs">
                HỘI ĐỒNG THẨM ĐỊNH ACADEMY
              </div>
              
              {/* Handwritten Signature Artwork */}
              <div className="py-1 flex justify-center sm:justify-end">
                <div className="font-serif italic font-extrabold text-2xl sm:text-3xl text-gradient-amber tracking-wider select-none border-b border-amber-500/30 px-3 py-0.5">
                  Lê Thành Phong
                </div>
              </div>

              <div className="text-xs font-bold text-white uppercase">
                LÊ THÀNH PHONG
              </div>
              <div className="text-[11px] text-emerald-400/90 font-semibold">
                Founder & CEO Lê Thành Phong
              </div>
            </div>

          </div>

        </div>

        {/* Action Controls & Export Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            Tiến độ hoàn thành: <strong className="text-emerald-400">{passedCount}/{totalModules}</strong> chuyên đề đã đạt
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            
            {/* Download PNG Button */}
            <button
              disabled={isExporting}
              onClick={handleDownloadPNG}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-950/50 transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Đang xuất...' : 'Tải File Ảnh (PNG)'}</span>
            </button>

            {/* Download PDF Button */}
            <button
              disabled={isExporting}
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-950/50 transition cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span>Tải File PDF</span>
            </button>

            {/* Print Direct Button */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-900/60 hover:border-emerald-500 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>In Bằng</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

