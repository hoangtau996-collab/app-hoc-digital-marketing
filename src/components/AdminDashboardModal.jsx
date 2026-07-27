import React, { useState, useEffect } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { 
  getAllRegisteredStudentsFromCloud, 
  listenToAllStudentsFromCloud,
  recordStudentAccountToCloud,
  db,
  doc,
  deleteDoc,
  TRAFFIC_BASELINE,
  deleteStudentEverywhere
} from '../firebase';
import { markStudentDeleted, filterDeleted, getDeletedStudents } from '../utils/deletedStudents';
import { 
  X, 
  Users, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  CheckCircle2, 
  Award, 
  Eye, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  Briefcase, 
  FileSpreadsheet,
  TrendingUp,
  Upload,
  PlusCircle,
  FileText,
  Sparkles,
  UserPlus,
  FileCheck
} from 'lucide-react';

export default function AdminDashboardModal({
  isOpen,
  onClose,
  currentUser,
  trafficStats,
  onIssueCertificateForStudent,
  t
}) {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState('');

  // Pagination State (20 to 50 students / page)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // 20, 30, 50, or 'ALL'

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedIndustry, pageSize]);

  // Certificate Generator Modal state
  const [isCertGenOpen, setIsCertGenOpen] = useState(false);
  const [certGenTab, setCertGenTab] = useState('manual'); // 'manual', 'excel'
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualIndustry, setManualIndustry] = useState('Digital Marketing');
  const [excelParsedStudents, setExcelParsedStudents] = useState([]);
  const [rawPastedText, setRawPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Default seed sample data if empty
  const SAMPLE_STUDENTS = [
    {
      id: 'student-real-cambinh',
      name: 'ĐẶNG THỊ CẨM BÌNH',
      phone: '0901234567',
      email: 'binh.dang@cbcentres.com',
      industry: 'Giáo Dục & Đào Tạo',
      completedModules: ['module-01', 'module-02', 'module-03', 'module-04', 'module-05', 'module-06', 'module-07', 'module-08', 'module-09', 'module-10', 'module-11'],
      createdAt: '2026-07-26'
    },
    {
      id: 'student-demo-02',
      name: 'TRAN THI B',
      phone: '0988765432',
      email: 'tranthib@gmail.com',
      industry: 'Thương Mại Điện Tử & Bán Lẻ (E-Commerce)',
      completedModules: ['module-01', 'module-02', 'module-03', 'module-04', 'module-05'],
      createdAt: '2026-07-26'
    },
    {
      id: 'student-demo-03',
      name: 'LE HOANG C',
      phone: '0912345678',
      email: 'lehoangc@spa-beauty.vn',
      industry: 'Dịch Vụ & Spa - Thẩm Mỹ Viện',
      completedModules: ['module-01', 'module-02', 'module-03'],
      createdAt: '2026-07-26'
    },
    {
      id: 'student-demo-04',
      name: 'PHAM MINH D',
      phone: '0933456789',
      email: 'minhd.pham@fnb-group.com',
      industry: 'F&B - Nông Sản - Thực Phẩm',
      completedModules: ['module-01', 'module-02', 'module-03', 'module-04', 'module-05', 'module-06', 'module-07', 'module-08'],
      createdAt: '2026-07-26'
    }
  ];

  const loadStudentsList = async () => {
    setIsLoading(true);
    let list = [];

    // 1. Read from localStorage cache
    try {
      const localUsers = localStorage.getItem('dmm_users_db');
      if (localUsers) {
        list = JSON.parse(localUsers);
      }
    } catch (e) {}

    // 2. Fetch from Firebase Cloud Firestore
    try {
      const cloudList = await getAllRegisteredStudentsFromCloud();
      const emailMap = new Map();

      [...SAMPLE_STUDENTS, ...list, ...(cloudList || [])].forEach(item => {
        if (item && item.email) {
          const emailKey = item.email.toLowerCase();
          const existing = emailMap.get(emailKey);
          emailMap.set(emailKey, {
            ...existing,
            ...item,
            id: item.id || existing?.id || `user-${Date.now()}`,
            name: item.name || item.studentName || existing?.name || item.email.split('@')[0].toUpperCase(),
            phone: item.phone || existing?.phone || 'Chưa cập nhật',
            industry: item.industry || existing?.industry || 'Bất Động Sản',
            completedModules: Array.isArray(item.completedModules) ? item.completedModules : (item.completedCount ? Array(item.completedCount).fill(1) : (existing?.completedModules || [])),
            createdAt: item.createdAt ? (typeof item.createdAt === 'string' ? item.createdAt : new Date(item.createdAt).toLocaleDateString('vi-VN')) : (existing?.createdAt || new Date().toLocaleDateString('vi-VN'))
          });
        }
      });

      list = filterDeleted(Array.from(emailMap.values()));
    } catch (e) {
      console.warn("Error loading students list:", e);
    }

    // Chỉ mồi dữ liệu mẫu khi CHƯA từng xoá ai. Nếu quản trị viên đã xoá sạch
    // thì danh sách rỗng là đúng ý họ, không được mồi lại.
    if (list.length === 0 && getDeletedStudents().length === 0) {
      list = SAMPLE_STUDENTS;
    }

    setStudents(list);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadStudentsList();

      // Live subscription for all new student registrations on Cloud Firestore
      const unsub = listenToAllStudentsFromCloud((cloudStudents) => {
        if (cloudStudents && cloudStudents.length > 0) {
          setStudents(prev => {
            const emailMap = new Map();
            [...SAMPLE_STUDENTS, ...prev, ...cloudStudents].forEach(item => {
              if (item && item.email) {
                const emailKey = item.email.toLowerCase();
                const existing = emailMap.get(emailKey);
                emailMap.set(emailKey, {
                  ...existing,
                  ...item,
                  id: item.id || existing?.id || `user-${Date.now()}`,
                  name: item.name || item.studentName || existing?.name || item.email.split('@')[0].toUpperCase(),
                  phone: item.phone || existing?.phone || 'Chưa cập nhật',
                  industry: item.industry || existing?.industry || 'Kinh doanh',
                  completedModules: Array.isArray(item.completedModules) ? item.completedModules : (existing?.completedModules || []),
                  createdAt: item.createdAt ? (typeof item.createdAt === 'string' ? item.createdAt : new Date(item.createdAt).toLocaleDateString('vi-VN')) : (existing?.createdAt || new Date().toLocaleDateString('vi-VN'))
                });
              }
            });
            // Lọc bia mộ ở đây nữa, nếu không listener realtime sẽ dựng lại
            // học viên vừa xoá ngay khi Firestore đẩy dữ liệu về.
            return filterDeleted(Array.from(emailMap.values()));
          });
        }
      });

      return () => unsub();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtered Students
  const filteredStudents = students.filter(std => {
    const matchesSearch = 
      std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.phone.includes(searchQuery);
    
    const matchesIndustry = selectedIndustry === 'ALL' || std.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  // Pagination Calculations (20 - 50 students / page)
  const effectivePageSize = pageSize === 'ALL' ? (filteredStudents.length || 1) : Number(pageSize);
  const totalPages = Math.ceil(filteredStudents.length / effectivePageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * effectivePageSize;
  const paginatedStudents = pageSize === 'ALL' ? filteredStudents : filteredStudents.slice(startIndex, startIndex + effectivePageSize);

  // Unique Industries List for Filter
  const uniqueIndustries = Array.from(new Set(students.map(s => s.industry).filter(Boolean)));

  // Calculate Statistics
  const totalStudentsCount = students.length;
  const totalGraduatesCount = students.filter(s => (s.completedModules || []).length >= 11).length;
  const completionRate = totalStudentsCount > 0 ? Math.round((totalGraduatesCount / totalStudentsCount) * 100) : 0;

  // Export CSV Report Function (UTF-8 BOM Encoded for Excel compatibility)
  const handleExportCSV = () => {
    try {
      const headers = ["STT", "Họ và Tên Học Viên", "Số Điện Thoại (Zalo)", "Email", "Ngành Nghề Kinh Doanh", "Tiến Độ (Bài đã đạt / 11)", "Trạng Thái Tốt Nghiệp", "Ngày Đăng Ký"];
      
      const rows = filteredStudents.map((std, idx) => [
        idx + 1,
        `"${std.name.replace(/"/g, '""')}"`,
        `"${std.phone}"`,
        `"${std.email}"`,
        `"${(std.industry || 'Kinh doanh').replace(/"/g, '""')}"`,
        `"${(std.completedModules || []).length}/11"`,
        (std.completedModules || []).length >= 11 ? "Đã Tốt Nghiệp" : "Đang Học",
        `"${std.createdAt || new Date().toLocaleDateString('vi-VN')}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      const today = new Date().toISOString().slice(0, 10);
      link.setAttribute("href", url);
      link.setAttribute("download", `Bao_Cao_Hoc_Vien_P_MARCOM_${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setNotice('✅ Đã xuất báo cáo CSV thành công!');
      setTimeout(() => setNotice(''), 4000);
    } catch (e) {
      alert("Lỗi xuất file CSV: " + e.message);
    }
  };

  // Print Report Handler
  const handlePrintReport = () => {
    window.print();
  };

  // Delete Student Record
  const handleDeleteStudent = async (studentId, studentEmail) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa học viên ${studentEmail} khỏi hệ thống?`)) return;

    try {
      // 1. Ghi bia mộ TRƯỚC. Đây là bước quyết định: dù kho nào còn sót bản ghi
      //    thì nó cũng bị lọc ra khi tải lại. Cũng là cách duy nhất xoá được
      //    học viên mẫu, vì SAMPLE_STUDENTS luôn được trộn lại mỗi lần tải.
      markStudentDeleted(studentEmail);

      // 2. Xoá khỏi tất cả các kho: Firestore students + registrations,
      //    Realtime DB REST, và localStorage.
      await deleteStudentEverywhere(studentId, studentEmail);

      // 3. Cập nhật giao diện. KHÔNG ghi danh sách hiển thị ngược vào
      //    dmm_users_db nữa: danh sách đó đã trộn cả SAMPLE_STUDENTS nên bản cũ
      //    vô tình ghi luôn học viên mẫu xuống đĩa vĩnh viễn.
      setStudents(students.filter(s => s.id !== studentId && s.email !== studentEmail));

      setNotice(`🟢 Đã xóa thành công học viên ${studentEmail}`);
      setTimeout(() => setNotice(''), 4000);
    } catch (e) {
      alert("Lỗi xóa học viên: " + e.message);
    }
  };

  // CSV Text Parsing Helper
  const parseCSVText = (text) => {
    if (!text || !text.trim()) return [];
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    const result = [];

    lines.forEach((line, idx) => {
      // Skip header line if detected
      const lower = line.toLowerCase();
      if (idx === 0 && (lower.includes('họ') || lower.includes('name') || lower.includes('stt') || lower.includes('ho_ten'))) {
        return;
      }

      const parts = line.split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length > 0 && parts[0]) {
        const isFirstNum = /^\d+$/.test(parts[0]) && parts.length > 1;
        const nameIdx = isFirstNum ? 1 : 0;
        const name = parts[nameIdx];
        const phone = parts[nameIdx + 1] || '0901234567';
        const email = parts[nameIdx + 2] || `hocvien.${Date.now()}.${idx}@pmarcom.edu.vn`;
        const industry = parts[nameIdx + 3] || 'Digital Marketing';

        if (name && name.length >= 2) {
          result.push({
            name: name.toUpperCase(),
            phone: phone,
            email: email,
            industry: industry
          });
        }
      }
    });

    return result;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result || '';
      const parsed = parseCSVText(text);
      if (parsed.length > 0) {
        setExcelParsedStudents(parsed);
        setNotice(`📥 Đã đọc thành công ${parsed.length} học viên từ file CSV/Excel!`);
      } else {
        alert("Không thể đọc được danh sách học viên từ file này. Vui lòng kiểm tra định dạng file (CSV/TXT).");
      }
    };
    reader.readAsText(file);
  };

  const handleParseRawText = (text) => {
    setRawPastedText(text);
    const parsed = parseCSVText(text);
    setExcelParsedStudents(parsed);
  };

  const handleDownloadSampleTemplate = () => {
    const sampleCSV = "\uFEFF" + "STT,Ho_Ten,So_Dien_Thoai,Email,Nganh_Nghe\n" +
      "1,LÊ THÀNH PHONG,0901234567,phong.le@pmarcom.edu.vn,Digital Marketing\n" +
      "2,NGUYỄN VĂN A,0987654321,nguyenvana@gmail.com,Bất Động Sản\n" +
      "3,TRẦN THỊ B,0912345678,tranthib@fnb-group.com,F&B - Nông Sản\n";

    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "File_Mau_Import_Cap_Chung_Nhan_P_MARCOM.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateManualCert = async (e) => {
    e.preventDefault();
    if (!manualName.trim()) {
      alert("Vui lòng nhập Họ và Tên học viên.");
      return;
    }

    setIsProcessing(true);
    const nameUpper = manualName.trim().toUpperCase();
    const studentEmail = manualEmail.trim() || `cert.${Date.now()}@pmarcom.edu.vn`;
    const allModules = ['module-01', 'module-02', 'module-03', 'module-04', 'module-05', 'module-06', 'module-07', 'module-08', 'module-09', 'module-10', 'module-11'];

    const newCertStudent = {
      id: `cert-manual-${Date.now()}`,
      name: nameUpper,
      phone: manualPhone.trim() || '0901234567',
      email: studentEmail,
      industry: manualIndustry || 'Digital Marketing',
      completedModules: allModules,
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    // 1. Sync to Cloud Firestore
    await recordStudentAccountToCloud(newCertStudent);

    // 2. Add to local list
    setStudents(prev => [newCertStudent, ...prev]);

    // 3. Reset form
    setManualName('');
    setManualPhone('');
    setManualEmail('');
    setIsProcessing(false);
    setIsCertGenOpen(false);

    setNotice(`🎓 Đã cấp Bằng Chứng Nhận thành công cho học viên ${nameUpper}`);

    // 4. Open Certificate viewer
    if (onIssueCertificateForStudent) {
      onIssueCertificateForStudent(nameUpper);
    }
  };

  const handleCreateBulkExcelCerts = async () => {
    if (excelParsedStudents.length === 0) {
      alert("Vui lòng chọn file Excel/CSV hoặc dán danh sách học viên.");
      return;
    }

    setIsProcessing(true);
    const allModules = ['module-01', 'module-02', 'module-03', 'module-04', 'module-05', 'module-06', 'module-07', 'module-08', 'module-09', 'module-10', 'module-11'];

    const createdList = [];
    for (let idx = 0; idx < excelParsedStudents.length; idx++) {
      const std = excelParsedStudents[idx];
      const studentObj = {
        id: `cert-bulk-${Date.now()}-${idx}`,
        name: std.name.toUpperCase(),
        phone: std.phone || '0901234567',
        email: std.email || `bulk.${Date.now()}.${idx}@pmarcom.edu.vn`,
        industry: std.industry || 'Digital Marketing',
        completedModules: allModules,
        createdAt: new Date().toLocaleDateString('vi-VN')
      };
      await recordStudentAccountToCloud(studentObj);
      createdList.push(studentObj);
    }

    setStudents(prev => [...createdList, ...prev]);
    setNotice(`🎉 Đã cấp Bằng Chứng Nhận thành công cho ${createdList.length} học viên từ Excel/CSV!`);
    setIsProcessing(false);
    setExcelParsedStudents([]);
    setRawPastedText('');
    setIsCertGenOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl h-[94vh] max-h-[980px] glass-panel rounded-3xl border border-emerald-500/40 p-4 sm:p-6 shadow-2xl space-y-3.5 my-auto flex flex-col">
        
        {/* Modal Top Bar Header */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-emerald-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <PMarcomLogo className="w-9 h-9" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-black border border-emerald-700 uppercase tracking-wider">
                  ADMIN MASTER DASHBOARD
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                  🔒 QUẢN TRỊ VIÊN P MARCOM
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide mt-0.5">
                BẢNG QUẢN LÝ TÀI KHOẢN & BÁO CÁO HỌC VIÊN
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Đóng bảng quản trị"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Alert Banner */}
        {notice && (
          <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center justify-between shrink-0">
            <span>{notice}</span>
            <button onClick={() => setNotice('')} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Dashboard Overview Metric Cards (Compact) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
          <div className="p-2.5 rounded-xl glass-panel border border-emerald-800/60 space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Tổng Học Viên</span>
              <Users className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-lg sm:text-xl font-black text-white">{totalStudentsCount}</p>
            <p className="text-[9px] text-emerald-400 font-semibold">Tài khoản đã đăng ký</p>
          </div>

          <div className="p-2.5 rounded-xl glass-panel border border-emerald-800/60 space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Đã Tốt Nghiệp</span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-lg sm:text-xl font-black text-amber-300">{totalGraduatesCount}</p>
            <p className="text-[9px] text-amber-400 font-semibold">Đạt 11/11 chuyên đề</p>
          </div>

          <div className="p-2.5 rounded-xl glass-panel border border-emerald-800/60 space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Tổng Lượt Truy Cập Web</span>
              <Eye className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <p className="text-lg sm:text-xl font-black text-teal-300">
              {(trafficStats?.totalTraffic || TRAFFIC_BASELINE).toLocaleString('vi-VN')}
            </p>
            <p className="text-[9px] text-teal-400 font-semibold">
              Hôm nay: <strong className="text-teal-200">+{(trafficStats?.todayTraffic || 0).toLocaleString('vi-VN')}</strong> lượt
              <span className="text-slate-500"> · mốc {TRAFFIC_BASELINE}</span>
            </p>
          </div>

          <div className="p-2.5 rounded-xl glass-panel border border-emerald-800/60 space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Tỷ Lệ Hoàn Thành</span>
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="text-lg sm:text-xl font-black text-cyan-300">{completionRate}%</p>
            <p className="text-[9px] text-cyan-400 font-semibold">Tiến độ đào tạo chung</p>
          </div>
        </div>

        {/* Filter Controls & Report Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên, SĐT, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-emerald-900/60 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition"
              />
            </div>

            {/* Industry Filter Dropdown */}
            <div className="relative shrink-0">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="bg-slate-900/80 border border-emerald-900/60 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tất cả Ngành Nghề</option>
                {uniqueIndustries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Page Size Selector (20 - 50 per page) */}
            <div className="relative shrink-0">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                className="bg-slate-900/80 border border-amber-500/40 text-amber-300 font-bold rounded-xl px-3 py-1.5 text-xs focus:outline-none cursor-pointer"
                title="Chọn số lượng học viên hiển thị trên mỗi trang"
              >
                <option value={20}>20 học viên / trang</option>
                <option value={30}>30 học viên / trang</option>
                <option value={50}>50 học viên / trang</option>
                <option value="ALL">Tất cả ({filteredStudents.length})</option>
              </select>
            </div>
          </div>

          {/* Action Buttons: Export CSV / Print */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={loadStudentsList}
              title="Làm mới danh sách"
              className="p-1.5 rounded-xl bg-slate-900 border border-emerald-800 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsCertGenOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black hover:brightness-110 transition flex items-center gap-1.5 cursor-pointer shadow-lg shrink-0"
              title="Tạo thủ công hoặc upload file Excel tạo chứng nhận hàng loạt"
            >
              <Award className="w-3.5 h-3.5 text-slate-950" />
              <span>Tạo Chứng Nhận</span>
            </button>

            <button
              onClick={handlePrintReport}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>In Báo Cáo</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold hover:brightness-110 transition flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Xuất Excel (.CSV)</span>
            </button>
          </div>
        </div>

        {/* Student Accounts Table View (Expanded Vertical Space) */}
        <div className="flex-1 min-h-[460px] overflow-y-auto rounded-2xl border border-emerald-900/50 glass-panel">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-900/90 text-emerald-400 text-[11px] font-extrabold uppercase tracking-wider border-b border-emerald-900/50 sticky top-0 backdrop-blur-md z-10">
                <th className="py-2.5 px-3">STT</th>
                <th className="py-2.5 px-3">Họ và Tên Học Viên</th>
                <th className="py-2.5 px-3">Số Điện Thoại</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Ngành Nghề</th>
                <th className="py-2.5 px-3 text-center">Tiến Độ (11/11)</th>
                <th className="py-2.5 px-3">Ngày Đăng Ký</th>
                <th className="py-2.5 px-3 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/30 text-xs text-slate-200">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((std, idx) => {
                  const completedCount = (std.completedModules || []).length;
                  const isGraduate = completedCount >= 11;
                  const sttIndex = startIndex + idx + 1;

                  return (
                    <tr key={std.id || idx} className="hover:bg-emerald-950/40 transition">
                      <td className="py-2 px-3 font-mono text-slate-400">{sttIndex}</td>
                      <td className="py-2 px-3 font-bold text-white flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 font-extrabold text-[9px] flex items-center justify-center shrink-0 overflow-hidden">
                          {std.avatarUrl ? (
                            <img src={std.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span>{std.name ? std.name.charAt(0) : 'U'}</span>
                          )}
                        </div>
                        <span>{std.name}</span>
                      </td>
                      <td className="py-2 px-3 font-mono text-emerald-300">{std.phone || '0901234567'}</td>
                      <td className="py-2 px-3 font-mono text-slate-300">{std.email}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-300 font-medium">
                          {std.industry || 'Bất Động Sản'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          isGraduate 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {isGraduate ? '🎓 Tốt nghiệp (11/11)' : `${completedCount}/11 Chuyên đề`}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-400 text-[11px]">{std.createdAt || '2026-07-26'}</td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onIssueCertificateForStudent && onIssueCertificateForStudent(std.name)}
                            className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/60 text-amber-300 hover:brightness-125 text-[10px] font-black flex items-center gap-1 transition cursor-pointer shadow-md"
                            title="Tạo & Xuất Bằng Chứng Nhận chính thức cho Học viên này"
                          >
                            <Award className="w-3 h-3 text-amber-400" />
                            <span>Cấp Bằng</span>
                          </button>

                          <button
                            onClick={() => handleDeleteStudent(std.id, std.email)}
                            className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900 transition cursor-pointer"
                            title="Xóa tài khoản học viên"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400 text-xs">
                    Không tìm thấy học viên nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Bottom Action & Pagination Bar */}
        <div className="pt-3 border-t border-emerald-900/40 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>
              Hiển thị <strong>{filteredStudents.length > 0 ? startIndex + 1 : 0}</strong> - <strong>{Math.min(startIndex + (pageSize === 'ALL' ? filteredStudents.length : pageSize), filteredStudents.length)}</strong> trong tổng số <strong>{filteredStudents.length}</strong> học viên ({totalStudentsCount} học viên toàn hệ thống)
            </span>
          </div>

          {/* Page Buttons & Navigation Controls */}
          {pageSize !== 'ALL' && totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={safeCurrentPage === 1}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-emerald-900 text-emerald-400 hover:bg-emerald-950 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition"
              >
                ◀ Trang Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-black transition ${
                    safeCurrentPage === pageNum
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-emerald-900/60'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={safeCurrentPage === totalPages}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-emerald-900 text-emerald-400 hover:bg-emerald-950 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition"
              >
                Trang Sau ▶
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Trở Về Trang Chủ
            </button>
          </div>
        </div>

        {/* Certificate Creation Sub-Modal (Manual & Bulk Excel Import) */}
        {isCertGenOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-amber-500/40 p-6 shadow-2xl space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-wider">
                      🎓 TẠO & CẤP BẰNG CHỨNG NHẬN HỌC VIÊN
                    </h3>
                    <p className="text-xs text-slate-400">Tạo cấp bằng thủ công hoặc tải file Excel tạo hàng loạt</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCertGenOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sub-Tabs Switcher */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-emerald-900/60 text-xs font-bold">
                <button
                  onClick={() => setCertGenTab('manual')}
                  className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                    certGenTab === 'manual' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4" /> 1. Tạo Thủ Công (1 Học Viên)
                </button>
                <button
                  onClick={() => setCertGenTab('excel')}
                  className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                    certGenTab === 'excel' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" /> 2. Upload Excel / CSV (Hàng Loạt)
                </button>
              </div>

              {/* TAB 1: Manual Certificate Creation */}
              {certGenTab === 'manual' && (
                <form onSubmit={handleCreateManualCert} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Họ và Tên Học Viên (In Bằng): <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      placeholder="Ví dụ: LÊ THÀNH PHONG"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="w-full bg-slate-900 border border-emerald-900/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 uppercase tracking-wide font-bold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Số Điện Thoại (Zalo):</label>
                      <input
                        type="text"
                        placeholder="0901234567"
                        value={manualPhone}
                        onChange={(e) => setManualPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Địa chỉ Email:</label>
                      <input
                        type="email"
                        placeholder="email.hocvien@example.com"
                        value={manualEmail}
                        onChange={(e) => setManualEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Ngành Nghề Kinh Doanh:</label>
                    <input
                      type="text"
                      placeholder="Digital Marketing / Bất Động Sản..."
                      value={manualIndustry}
                      onChange={(e) => setManualIndustry(e.target.value)}
                      className="w-full bg-slate-900 border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-medium space-y-1">
                    <div className="font-bold text-amber-400 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Tự động chứng nhận 11/11 Chuyên đề
                    </div>
                    <p className="text-[11px] opacity-90">Học viên được cấp bằng sẽ lập tức nhận danh hiệu Tốt Nghiệp và có thể tra cứu/tải chứng nhận sắc nét.</p>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCertGenOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition cursor-pointer"
                    >
                      Hủy Bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:brightness-110 transition shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>{isProcessing ? 'Đang cấp bằng...' : '🎓 Cấp Bằng & Xem Chứng Nhận Ngay'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Bulk Excel / CSV Import */}
              {certGenTab === 'excel' && (
                <div className="space-y-4">
                  
                  {/* File Selector & Sample CSV Download Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-emerald-900/80">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-emerald-400" /> Chọn File Excel / CSV (.csv)
                      </h4>
                      <p className="text-[11px] text-slate-400">File chứa danh sách: Họ Tên, SĐT, Email, Ngành nghề</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadSampleTemplate}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 text-[11px] font-bold hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> File Mẫu CSV
                      </button>

                      <label className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold cursor-pointer transition shadow flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> Chọn File...
                        <input type="file" accept=".csv, .txt, .xlsx" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Or Paste Raw Text Box */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Hoặc Dán Trực Tiếp Cột Excel Vào Đây:</label>
                    <textarea
                      rows="4"
                      placeholder="Dán dữ liệu Excel (Ví dụ: LÊ THÀNH PHONG, 0901234567, phong.le@gmail.com, Digital Marketing)"
                      value={rawPastedText}
                      onChange={(e) => handleParseRawText(e.target.value)}
                      className="w-full bg-slate-900 border border-emerald-900/80 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  {/* Parsed Preview List */}
                  {excelParsedStudents.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                        <span>Danh Sách {excelParsedStudents.length} Học Viên Đã Đọc Từ File:</span>
                        <span className="text-[10px] text-amber-300">Sẵn sàng cấp bằng 11/11 chuyên đề</span>
                      </div>
                      <div className="max-h-36 overflow-y-auto rounded-xl border border-emerald-900/60 bg-slate-950 p-2 space-y-1">
                        {excelParsedStudents.map((std, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-900/60 text-slate-300">
                            <span className="font-bold text-white">{idx + 1}. {std.name}</span>
                            <span className="text-[11px] text-slate-400">{std.phone} • {std.email}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => setIsCertGenOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition cursor-pointer"
                    >
                      Hủy Bỏ
                    </button>
                    <button
                      onClick={handleCreateBulkExcelCerts}
                      disabled={isProcessing || excelParsedStudents.length === 0}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black transition shadow-lg flex items-center gap-2 ${
                        excelParsedStudents.length > 0 
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 cursor-pointer' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isProcessing ? 'Đang xử lý...' : `⚡ Cấp Bằng Hàng Loạt (${excelParsedStudents.length} Học Viên)`}</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
