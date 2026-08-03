import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import {
  renderCertificateCanvas,
  certFieldMetrics,
  makeVerifyCode,
  slugifyName,
  isIOSorIPad,
  getCertificateCourse,
  CERT_TEMPLATE_SRC,
  CERT_LAYOUT,
} from '../utils/certificateExport';
import {
  X,
  Printer,
  Download,
  FileText,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function CertificateModal({ 
  isOpen, 
  onClose, 
  passedCount, 
  totalModules,
  adminOverride = false,
  customStudentName = "",
  studentEmail = "",
  // 'main' = khoá Digital Thực Chiến, 'trade' = khoá Trade Marketing Thực Chiến
  course = 'main'
}) {
  const courseInfo = getCertificateCourse(course);
  const [studentName, setStudentName] = useState(() => {
    if (customStudentName) return customStudentName.toUpperCase();
    try {
      return localStorage.getItem('dmm_student_name') || "NGUYỄN VĂN A";
    } catch (e) {
      return "NGUYỄN VĂN A";
    }
  });

  const [isExporting, setIsExporting] = useState(false);

  // Kích thước thật của khung xem trước trên màn hình. Cần đo bằng px vì toạ độ
  // trong CERT_LAYOUT là tỉ lệ, còn cỡ chữ thì phải quy ra px mới đặt được —
  // đo xong thì bản xem trước và file tải về dùng chung một phép tính.
  //
  // Khung co theo bề ngang modal (mobile/desktop khác nhau) và chỉ có chiều cao
  // sau khi ảnh template tải xong, nên phải theo dõi bằng ResizeObserver chứ
  // không đọc một lần lúc mount được.
  const [previewBox, setPreviewBox] = useState({ w: 0, h: 0 });
  const [templateMissing, setTemplateMissing] = useState(false);
  const previewObserver = useRef(null);

  const attachPreview = useCallback((el) => {
    previewObserver.current?.disconnect();
    previewObserver.current = null;
    if (!el) return;

    const read = () => setPreviewBox({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    previewObserver.current = ro;
  }, []);

  useEffect(() => () => previewObserver.current?.disconnect(), []);

  useEffect(() => {
    if (customStudentName) {
      setStudentName(customStudentName.toUpperCase());
    }
  }, [customStudentName]);

  useEffect(() => {
    try {
      if (studentName) {
        localStorage.setItem('dmm_student_name', studentName);
      }
    } catch (e) {
      console.error("Error saving student name", e);
    }
  }, [studentName]);

  // Mã xác thực riêng của từng học viên. Ưu tiên bám vào email tài khoản để mã
  // không đổi khi học viên sửa lại họ tên; bằng do Admin cấp thì bám theo tên.
  //
  // Mỗi khoá phải ra một mã KHÁC nhau, nếu không hai tấm bằng của cùng một học
  // viên sẽ mang chung mã và việc tra cứu không phân biệt được. Khoá chính cố ý
  // KHÔNG thêm hậu tố: thêm vào sẽ làm đổi toàn bộ mã của những bằng đã cấp.
  const verifyCode = useMemo(() => {
    const seed = studentEmail || customStudentName || studentName;
    return makeVerifyCode(course === 'main' ? seed : `${seed}|${course}`);
  }, [studentEmail, customStudentName, studentName, course]);

  if (!isOpen) return null;

  const isEligible = adminOverride || (passedCount === totalModules && totalModules > 0);
  const progressPercent = Math.round((passedCount / totalModules) * 100);
  const currentDate = new Date().toLocaleDateString('vi-VN');

  // Mọi nút xuất file đều dựng lại bằng từ ảnh template gốc (src/utils/certificateExport.js)
  // thay vì chụp DOM Tailwind, vì html2canvas không đọc được oklch()/color-mix() của Tailwind v4.
  const buildCanvas = () => renderCertificateCanvas({
    studentName,
    issueDate: currentDate,
    verifyCode,
    course,
  });

  /**
   * Quy một ô trong CERT_LAYOUT ra style CSS cho bản xem trước.
   * Cỡ chữ lấy từ certFieldMetrics — đúng hàm mà file xuất dùng — nên tên dài
   * co lại trên màn hình y hệt lúc tải về.
   */
  const fieldStyle = (spec, text) => {
    const boxWidth = previewBox.w * (spec.right - spec.left);
    const { fontPx, letterSpacingPx } = certFieldMetrics(text, spec, boxWidth, previewBox.h);

    return {
      position: 'absolute',
      left: `${spec.left * 100}%`,
      width: `${(spec.right - spec.left) * 100}%`,
      bottom: `${(1 - spec.baseline) * 100}%`,
      textAlign: spec.align || 'center',
      fontFamily: spec.family,
      fontWeight: spec.weight,
      fontSize: `${fontPx}px`,
      letterSpacing: `${letterSpacingPx}px`,
      color: spec.color,
      lineHeight: 1,
      whiteSpace: 'nowrap',
    };
  };

  const exportFileName = (ext) => `ChungNhan_${courseInfo.fileTag}_${slugifyName(studentName)}.${ext}`;

  // Handle PNG Image Download
  const handleDownloadPNG = async () => {
    if (!isEligible) return;

    // Safari trên iOS/iPadOS không tôn trọng thuộc tính download -> mở tab để nhấn giữ lưu ảnh.
    if (isIOSorIPad) {
      await handleOpenForIPad();
      return;
    }

    try {
      setIsExporting(true);
      const canvas = await buildCanvas();
      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.download = exportFileName('png');
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting certificate image", err);
      alert("Không xuất được file ảnh: " + (err?.message || err));
    } finally {
      setIsExporting(false);
    }
  };

  // Dedicated Handler for iPad / iPhone Users (Opens image in tab to allow Long-Press -> Save to Photos)
  const handleOpenForIPad = async () => {
    if (!isEligible) return;

    try {
      setIsExporting(true);
      const canvas = await buildCanvas();
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
            <body style="margin:0;background:#0e1526;display:flex;flex-direction:column;align-items:center;padding:16px;font-family:sans-serif;color:white;text-align:center;">
              <div style="background:#17233f;border:1px solid #10b981;padding:12px 20px;border-radius:12px;margin-bottom:16px;max-width:500px;">
                <h3 style="color:#6495ED;margin:0 0 4px 0;font-size:16px;">📱 Hướng Dẫn Lưu Bằng Trên iPad / iPhone:</h3>
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

    try {
      setIsExporting(true);
      const canvas = await buildCanvas();
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      // Phủ trắng kín trang để phần viền thừa không bị lệch màu với bằng.
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageW, pageH, 'F');

      // Co ảnh vừa trang theo cạnh chật hơn -> không bao giờ bị tràn/cắt mất đáy bằng.
      const imgRatio = canvas.width / canvas.height;
      const pageRatio = pageW / pageH;
      const drawW = imgRatio > pageRatio ? pageW : pageH * imgRatio;
      const drawH = imgRatio > pageRatio ? pageW / imgRatio : pageH;

      pdf.addImage(
        imgData, 'PNG',
        (pageW - drawW) / 2, (pageH - drawH) / 2,
        drawW, drawH,
        undefined, 'FAST'
      );

      // subject bám theo khoá đang cấp — trước đây ghi cứng tên khoá chính nên
      // file PDF của khoá Trade Marketing vẫn hiện sai tên trong thuộc tính.
      pdf.setProperties({
        title: `Chứng Nhận Hoàn Thành - ${studentName}`,
        subject: courseInfo.title,
        author: 'P MARCOM ACADEMY'
      });

      if (isIOSorIPad) {
        window.open(pdf.output('bloburl'), '_blank');
      } else {
        pdf.save(exportFileName('pdf'));
      }
    } catch (err) {
      console.error("Error exporting PDF", err);
      alert("Không xuất được file PDF: " + (err?.message || err));
    } finally {
      setIsExporting(false);
    }
  };

  // In từ ảnh bằng đã dựng sẵn thay vì window.print() (dự án không có @media print,
  // gọi thẳng window.print() sẽ in nguyên trang app kèm menu/nút bấm).
  const handlePrint = async () => {
    if (!isEligible) return;

    try {
      setIsExporting(true);
      const canvas = await buildCanvas();
      const dataUrl = canvas.toDataURL('image/png');

      const win = window.open('');
      if (!win) {
        alert("Vui lòng cho phép trình duyệt mở cửa sổ bật lên (Pop-up) để in bằng!");
        return;
      }

      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${exportFileName('pdf')}</title>
            <style>
              @page { size: A4 landscape; margin: 0; }
              html, body { margin: 0; padding: 0; background: #ffffff; }
              img { display: block; width: 100%; height: auto; }
              @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.focus();window.print();" />
          </body>
        </html>
      `);
      win.document.close();
    } catch (err) {
      console.error("Error printing certificate", err);
      alert("Không in được bằng: " + (err?.message || err));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto glass-panel rounded-3xl border border-emerald-500/40 p-4 sm:p-8 md:p-10 shadow-2xl space-y-6">
        
        {/* Top Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-slate-900 border-2 border-emerald-500/80 text-emerald-400 hover:bg-emerald-600 hover:text-slate-950 flex items-center justify-center transition cursor-pointer z-30 shadow-xl"
          title="Đóng xem trước chứng nhận"
        >
          <X className="w-5 h-5 font-black" />
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
                Bạn cần hoàn thành và đạt chuẩn 100% tất cả <strong>{totalModules}/{totalModules} Chuyên đề</strong> của <strong className="text-emerald-300">{courseInfo.title}</strong> để chính thức nhận Bằng Chứng Nhận được đóng dấu bảo chứng bởi <strong>HỌC VIỆN P MARCOM</strong> và <strong>Founder &amp; CEO Lê Thành Phong</strong>.
              </p>
            </div>

            {/* Progress Tracker Bar */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#111a2e] border border-emerald-900/60 space-y-2">
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
            {/*
              Bản xem trước dựng y hệt file xuất: ảnh template gốc làm nền, chữ
              động phủ lên bằng toạ độ tỉ lệ trong CERT_LAYOUT. Không dựng lại
              khung/hoạ tiết bằng Tailwind — làm vậy là có hai bản bố cục song
              song và chúng sẽ trôi khỏi nhau ngay lần chỉnh sửa đầu tiên.
            */}
            <div
              id="certificate-print-area"
              ref={attachPreview}
              className="relative overflow-hidden rounded-2xl shadow-2xl"
              style={{ backgroundColor: '#ffffff' }}
            >
              <img
                src={CERT_TEMPLATE_SRC}
                alt="Mẫu bằng chứng nhận P Marcom Academy"
                className="block w-full h-auto select-none"
                draggable="false"
                onError={() => setTemplateMissing(true)}
                onLoad={() => setTemplateMissing(false)}
              />

              {/* Thiếu file template thì phải nói thẳng: nếu không, học viên chỉ
                  thấy một ô trắng có mấy dòng chữ trôi nổi và không hiểu vì sao. */}
              {templateMissing && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-center p-6">
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <strong className="block text-rose-700 mb-1">Chưa có file mẫu bằng chứng nhận</strong>
                    Hãy đặt file ảnh template vào <code className="px-1 rounded bg-slate-200">public{CERT_TEMPLATE_SRC}</code> rồi tải lại trang.
                  </div>
                </div>
              )}

              {/* Họ tên học viên — ô nhập trong suốt đặt đúng trên nét kẻ chấm */}
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value.toUpperCase())}
                placeholder="NHẬP HỌ VÀ TÊN"
                className="bg-transparent focus:outline-none focus:bg-amber-50/40 rounded transition"
                style={fieldStyle(CERT_LAYOUT.name, studentName || 'NHẬP HỌ VÀ TÊN')}
                title="Click để chỉnh sửa họ tên học viên"
              />

              <div style={fieldStyle(CERT_LAYOUT.course, courseInfo.title)}>
                {courseInfo.title}
              </div>

              <div style={fieldStyle(CERT_LAYOUT.date, currentDate)}>
                {currentDate}
              </div>

              <div style={fieldStyle(CERT_LAYOUT.code, verifyCode)}>
                {verifyCode}
              </div>
            </div>

            <p className="text-[11px] text-center text-slate-400 -mt-2">
              Click vào dòng họ tên trên tấm bằng để chỉnh sửa. Dòng hướng dẫn này không xuất hiện trong file tải về.
            </p>

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
                  disabled={isExporting}
                  onClick={handlePrint}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-900/60 hover:border-emerald-500 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>In Bằng</span>
                </button>

                {/* Explicit Close Button for Admin */}
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <X className="w-4 h-4 text-rose-400" />
                  <span>Đóng Xem Trước</span>
                </button>

              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}


