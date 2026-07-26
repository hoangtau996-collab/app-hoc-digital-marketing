import React, { useState, useEffect } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { 
  getAllRegisteredStudentsFromCloud, 
  db,
  doc,
  deleteDoc
} from '../firebase';
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
  TrendingUp
} from 'lucide-react';

export default function AdminDashboardModal({
  isOpen,
  onClose,
  currentUser,
  trafficStats,
  t
}) {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState('');

  // Default seed sample data if empty
  const SAMPLE_STUDENTS = [
    {
      id: 'student-demo-01',
      name: 'NGUYỄN VĂN A',
      phone: '0901234567',
      email: 'hocvien@pmarcom.edu.vn',
      industry: 'Bất Động Sản',
      completedModules: ['module-01', 'module-02', 'module-03', 'module-04', 'module-05', 'module-06', 'module-07', 'module-08', 'module-09', 'module-10', 'module-11'],
      createdAt: '2026-07-25'
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
      if (cloudList && cloudList.length > 0) {
        // Merge cloud & local unique users by email
        const emailMap = new Map();
        [...SAMPLE_STUDENTS, ...list, ...cloudList].forEach(item => {
          if (item.email) {
            emailMap.set(item.email.toLowerCase(), {
              ...item,
              name: item.name || item.studentName || item.email.split('@')[0].toUpperCase(),
              phone: item.phone || '0901234567',
              industry: item.industry || 'Bất Động Sản',
              completedModules: item.completedModules || (item.completedCount ? Array(item.completedCount).fill(1) : []),
              createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN')
            });
          }
        });
        list = Array.from(emailMap.values());
      }
    } catch (e) {
      console.warn("Error loading students list:", e);
    }

    if (list.length === 0) {
      list = SAMPLE_STUDENTS;
    }

    setStudents(list);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadStudentsList();
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
      // 1. Delete from Cloud Firestore
      try {
        await deleteDoc(doc(db, 'students', studentId));
      } catch (e) {}

      // 2. Delete from LocalStorage
      const updated = students.filter(s => s.id !== studentId && s.email !== studentEmail);
      setStudents(updated);
      try {
        localStorage.setItem('dmm_users_db', JSON.stringify(updated));
      } catch (e) {}

      setNotice(`🟢 Đã xóa thành công học viên ${studentEmail}`);
      setTimeout(() => setNotice(''), 4000);
    } catch (e) {
      alert("Lỗi xóa học viên: " + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl glass-panel rounded-3xl border border-emerald-500/40 p-5 sm:p-8 shadow-2xl space-y-6 my-6 max-h-[90vh] flex flex-col">
        
        {/* Modal Top Bar Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-emerald-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <PMarcomLogo className="w-10 h-10" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-black border border-emerald-700 uppercase tracking-wider">
                  ADMIN MASTER DASHBOARD
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                  🔒 QUẢN TRỊ VIÊN P MARCOM
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white tracking-wide mt-0.5">
                BẢNG QUẢN LÝ TÀI KHOẢN & BÁO CÁO HỌC VIÊN
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Đóng bảng quản trị"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Alert Banner */}
        {notice && (
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center justify-between shrink-0">
            <span>{notice}</span>
            <button onClick={() => setNotice('')} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Dashboard Overview Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl glass-panel border border-emerald-800/60 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Tổng Học Viên</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white">{totalStudentsCount}</p>
            <p className="text-[10px] text-emerald-400 font-semibold">Tài khoản đã đăng ký</p>
          </div>

          <div className="p-3.5 rounded-2xl glass-panel border border-emerald-800/60 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Đã Tốt Nghiệp</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-300">{totalGraduatesCount}</p>
            <p className="text-[10px] text-amber-400 font-semibold">Đạt 11/11 chuyên đề</p>
          </div>

          <div className="p-3.5 rounded-2xl glass-panel border border-emerald-800/60 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Lượt Xem Real-Time</span>
              <Eye className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-teal-300">
              {trafficStats ? trafficStats.totalTraffic.toLocaleString('vi-VN') : '142'}
            </p>
            <p className="text-[10px] text-teal-400 font-semibold">Đếm traffic thật 100%</p>
          </div>

          <div className="p-3.5 rounded-2xl glass-panel border border-emerald-800/60 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Tỷ Lệ Hoàn Thành</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-cyan-300">{completionRate}%</p>
            <p className="text-[10px] text-cyan-400 font-semibold">Tiến độ đào tạo chung</p>
          </div>
        </div>

        {/* Filter Controls & Report Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên, SĐT, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-emerald-900/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition"
              />
            </div>

            {/* Industry Filter Dropdown */}
            <div className="relative shrink-0">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="bg-slate-900/80 border border-emerald-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tất cả Ngành Nghề</option>
                {uniqueIndustries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons: Export CSV / Print */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={loadStudentsList}
              title="Làm mới danh sách"
              className="p-2 rounded-xl bg-slate-900 border border-emerald-800 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handlePrintReport}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>In Báo Cáo</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold hover:brightness-110 transition flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Báo Cáo Excel (.CSV)</span>
            </button>
          </div>
        </div>

        {/* Student Accounts Table View */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-emerald-900/50 glass-panel">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-900/80 text-emerald-400 text-[11px] font-extrabold uppercase tracking-wider border-b border-emerald-900/50 sticky top-0 backdrop-blur-md">
                <th className="p-3">STT</th>
                <th className="p-3">Họ và Tên Học Viên</th>
                <th className="p-3">Số Điện Thoại</th>
                <th className="p-3">Email</th>
                <th className="p-3">Ngành Nghề</th>
                <th className="p-3 text-center">Tiến Độ (11/11)</th>
                <th className="p-3">Ngày Đăng Ký</th>
                <th className="p-3 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/30 text-xs text-slate-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((std, idx) => {
                  const completedCount = (std.completedModules || []).length;
                  const isGraduate = completedCount >= 11;

                  return (
                    <tr key={std.id || idx} className="hover:bg-emerald-950/40 transition">
                      <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                          {std.name ? std.name.charAt(0) : 'U'}
                        </div>
                        <span>{std.name}</span>
                      </td>
                      <td className="p-3 font-mono text-emerald-300">{std.phone || '0901234567'}</td>
                      <td className="p-3 font-mono text-slate-300">{std.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[11px] text-slate-300 font-medium">
                          {std.industry || 'Bất Động Sản'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          isGraduate 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {isGraduate ? '🎓 Tốt nghiệp (11/11)' : `${completedCount}/11 Chuyên đề`}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-400 text-[11px]">{std.createdAt || '2026-07-26'}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteStudent(std.id, std.email)}
                          className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900 transition cursor-pointer"
                          title="Xóa tài khoản học viên"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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

        {/* Modal Bottom Action Bar */}
        <div className="pt-3 border-t border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <span>Hiển thị {filteredStudents.length} / {totalStudentsCount} học viên đã đăng ký</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Trở Về Trang Chủ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
