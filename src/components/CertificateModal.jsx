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
  Lock,
  ArrowRight,
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

  const isEligible = passedCount === totalModules && totalModules > 0;
  const progressPercent = Math.round((passedCount / totalModules) * 100);
  const currentDate = new Date().toLocaleDateString('vi-VN');

  // Detect iOS / iPad device
  const isIOSorIPad = typeof navigator !== 'undefined' && (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );

  // Handle PNG Image Download
  const handleDownloadPNG = async () => {
    if (!isEligible) return;
    const certArea = document.getElementById('certificate-print-area');
    if (!certArea) return;

    try {
      setIsExporting(true);
      const canvas = await html2canvas(certArea, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#08120d',
        logging: false
      });
      const dataUrl = canvas.toDataURL('image/png');

      // If iPad / iOS Safari, trigger window open fallback
      if (isIOSorIPad) {
        handleOpenForIPad();
        return;
      }

      const link = document.createElement('a');
      const filename = `ChungNhan_PMARCOM_${studentName.trim().replace(/\s+/g, '_')}.png`;
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting certificate image", err);
      handleOpenForIPad();
    } finally {
      setIsExporting(false);
    }
  };

  // Dedicated Handler for iPad / iPhone Users (Opens image in tab to allow Long-Press -> Save to Photos)
  const handleOpenForIPad = async () => {
    if (!isEligible) return;
    const certArea = document.getElementById('certificate-print-area');
    if (!certArea) return;

    try {
      setIsExporting(true);
      const canvas = await html2canvas(certArea, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#08120d',
        logging: false
      });
      const dataUrl = canvas.toDataURL('image/png');
      const newWin = window.open('');
      if (newWin) {
        newWin.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Bằng Chứng Nhận P MARCOM</title>
            </head>
            <body style="margin:0;background:#070d0a;display:flex;flex-direction:column;align-items:center;padding:16px;font-family:sans-serif;color:white;text-align:center;">
              <div style="background:#091a14;border:1px solid #10b981;padding:12px 20px;border-radius:12px;margin-bottom:16px;max-width:500px;">
                <h3 style="color:#00E676;margin:0 0 4px 0;font-size:16px;">📱 Hướng Dẫn Lưu Bằng Trên iPad / iPhone:</h3>
                <p style="font-size:13px;color:#e2e8f0;margin:0;line-height:1.4;">Chạm & <strong>Nhấn Giữ vào bức ảnh bằng</strong> dưới đây ➔ Chọn <strong>"Thêm vào Ảnh" (Save Image)</strong> hoặc <strong>"Lưu vào Tệp"</strong>.</p>
              </div>
              <img src="${dataUrl}" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 12px 40px rgba(0,230,118,0.2);" />
            </body>
          </html>
        `);
      } else {
        alert("Vui lòng cho phép Safari mở cửa sổ bật lên (Pop-up) để xem và lưu bằng!");
      }
    } catch (e) {
      alert("Lỗi xuất bằng: " + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle PDF Document Download
  const handleDownloadPDF = async () => {
    if (!isEligible) return;
    const certArea = document.getElementById('certificate-print-area');
    if (!certArea) return;

    try {
      setIsExporting(true);
      const canvas = await html2canvas(certArea, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
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
      
      if (isIOSorIPad) {
        const pdfBlob = pdf.output('bloburl');
        window.open(pdfBlob, '_blank');
      } else {
        pdf.save(filename);
      }
    } catch (err) {
      console.error("Error exporting PDF", err);
      handleOpenForIPad();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (!isEligible) return;
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

        {/* LOCKED STATE VIEW (When student has NOT completed all modules) */}
        {!isEligible ? (
          <div className="p-6 sm:p-10 text-center space-y-6 py-8">
            
            <div className="w-20 h-20 rounded-3xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-950/50 animate-pulse">
              <Lock className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 border border-amber-700/60 text-amber-300 text-xs font-bold uppercase">
                CHƯA ĐỦ ĐIỀU KIỆN CẤP BẰNG
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                HOÀN THÀNH KHÓA HỌC ĐỂ MỞ KHÓA CHỨNG CHỈ
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Bạn cần hoàn thành và đạt chuẩn 100% tất cả <strong>{totalModules}/{totalModules} Chuyên đề đào tạo</strong> để chính thức nhận Bằng Chứng Nhận Trưởng Phòng Digital Marketing được đóng dấu bảo chứng bởi <strong>HỌC VIỆN P MARCOM</strong> và <strong>Founder & CEO Lê Thành Phong</strong>.
              </p>
            </div>

            {/* Progress Tracker Bar */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#08120d] border border-emerald-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Tiến độ khóa học của bạn:</span>
                <span className="font-bold text-amber-400">{passedCount}/{totalModules} Chuyên đề ({progressPercent}%)</span>
              </div>

              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-emerald-950">
                <div 
                  className="bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 pt-1">
                Còn <strong>{totalModules - passedCount} chuyên đề</strong> nữa chưa đạt bài kiểm tra.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold inline-flex items-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-950/50 transition cursor-pointer"
              >
                <span>Tiếp Tục Học Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          /* UNLOCKED CERTIFICATE VIEW (Only when student completed ALL 11 modules) */
          <>
            {/* Certificate Container (Print Target) */}
            <div id="certificate-print-area" className="p-6 sm:p-10 md:p-12 rounded-2xl bg-[#08120d] border-2 border-emerald-500/50 relative overflow-hidden text-center space-y-6 shadow-2xl">
              
              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none select-none">
                <img src="/pmarcom-logo.jpg" alt="P Marcom Logo Watermark" className="w-[450px] h-[450px] object-cover rounded-3xl" />
              </div>

              {/* Certificate Header Branding */}
              <div className="space-y-3 relative z-10">
                <div className="flex justify-center items-center gap-3 mb-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-500/70 shadow-xl shadow-amber-950/70">
                    <img src="/pmarcom-logo.jpg" alt="Học viện P Marcom Logo" className="w-full h-full object-cover" />
                  </div>
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
                Đã hoàn tất xuất sắc toàn bộ <strong>{totalModules} Chuyên đề đào tạo thực chiến</strong> và vượt qua <strong>33 bài tập kiểm tra đánh giá năng lực quản lý Digital Marketing</strong> tại <strong>HỌC VIỆN P MARCOM</strong> (Bao gồm Goals, Budgeting, Staffing, Campaign Creative, Planning & Effectiveness).
              </p>

              {/* Footer Signatures & Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-emerald-900/50 max-w-2xl mx-auto text-xs relative z-10 items-end">
                
                {/* Verification Metadata */}
                <div className="text-left space-y-1 text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" /> BẢO CHỨNG BỞI P MARCOM
                  </div>
                  <div>Mã xác thực: <strong className="text-slate-200">PMC-2026-8892</strong></div>
                  <div>Giá trị đào tạo: <strong className="text-amber-400 font-bold">2.999.999 VNĐ</strong> (Tài trợ 100%)</div>
                  <div>Ngày cấp: <strong className="text-slate-200">{currentDate}</strong></div>
                </div>

                {/* Founder & CEO Signature Block */}
                <div className="text-center sm:text-right space-y-0.5">
                  <div className="text-amber-400 font-extrabold tracking-wide uppercase text-[10px]">
                    HỘI ĐỒNG THẨM ĐỊNH ACADEMY
                  </div>
                  
                  {/* Handwritten Signature Artwork (Refined smaller size) */}
                  <div className="py-0.5 flex justify-center sm:justify-end">
                    <div className="font-serif italic font-bold text-base sm:text-lg text-amber-300 tracking-wide select-none border-b border-amber-500/30 px-2 py-0.5">
                      Lê Thành Phong
                    </div>
                  </div>

                  <div className="text-[11px] font-bold text-white uppercase tracking-wider">
                    LÊ THÀNH PHONG
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold">
                    Founder & CEO Lê Thành Phong
                  </div>
                </div>

              </div>

            </div>

            {/* Action Controls & Export Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-400">
                Tiến độ hoàn thành: <strong className="text-emerald-400">{passedCount}/{totalModules}</strong> chuyên đề đã đạt chuẩn
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

                {/* Dedicated iPad / iPhone Fallback Button */}
                <button
                  disabled={isExporting}
                  onClick={handleOpenForIPad}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-900 border border-teal-500/60 hover:border-teal-400 text-teal-300 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                  title="Dành riêng cho máy iPad / iPhone để lưu ảnh trực tiếp"
                >
                  <Download className="w-4 h-4 text-teal-400" />
                  <span>📱 Mở & Lưu Trực Tiếp Trên iPad</span>
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
          </>
        )}

      </div>
    </div>
  );
}


