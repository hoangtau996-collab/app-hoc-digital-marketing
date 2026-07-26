import React, { useState } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { 
  X, 
  User, 
  LogOut, 
  Download, 
  Upload, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  CheckCircle2,
  FileJson,
  Sparkles,
  Key,
  RefreshCw,
  Sun,
  Moon,
  Monitor,
  Eye,
  Tag,
  Palette
} from 'lucide-react';

export default function UserProfileModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onLogout,
  passedCount,
  totalModules,
  completedModules,
  onImportBackupData,
  theme = 'system',
  setTheme = () => {},
  trafficStats
}) {
  const [importStatus, setImportStatus] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passUpdateMsg, setPassUpdateMsg] = useState('');

  if (!isOpen || !currentUser) return null;

  const progressPercent = Math.round((passedCount / totalModules) * 100);

  // Export progress data as JSON backup
  const handleExportBackup = () => {
    try {
      // Gather all quiz results for this user
      const quizResults = {};
      for (let i = 1; i <= 11; i++) {
        const modId = `module-${i < 10 ? '0' + i : i}`;
        const key = `dmm_quiz_results_${modId}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          quizResults[modId] = JSON.parse(saved);
        }
      }

      const backupObject = {
        app: "HỌC VIỆN P MARCOM",
        version: "1.0.0",
        timestamp: Date.now(),
        exportedAt: new Date().toLocaleString('vi-VN'),
        user: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email
        },
        progress: {
          completedModules,
          passedCount,
          totalModules,
          progressPercent
        },
        quizResults
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObject, null, 2));
      const downloadAnchor = document.createElement('a');
      const safeName = currentUser.name.replace(/\s+/g, '_');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `Backup_PMARCOM_${safeName}_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setImportStatus('🟢 Xuất file sao lưu .json thành công!');
      setTimeout(() => setImportStatus(''), 4000);
    } catch (e) {
      console.error("Error exporting backup", e);
      setImportStatus('❌ Lỗi khi tạo file sao lưu.');
    }
  };

  // Import progress data from JSON backup file
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target.result);
        if (content && content.progress && Array.isArray(content.progress.completedModules)) {
          // Restore quiz results if present
          if (content.quizResults) {
            Object.keys(content.quizResults).forEach(modId => {
              const key = `dmm_quiz_results_${modId}`;
              localStorage.setItem(key, JSON.stringify(content.quizResults[modId]));
            });
          }

          onImportBackupData(content.progress.completedModules);
          setImportStatus('✅ Khôi phục dữ liệu tiến độ bài học thành công!');
          setTimeout(() => setImportStatus(''), 4000);
        } else {
          setImportStatus('❌ File sao lưu không hợp lệ.');
        }
      } catch (err) {
        console.error("Error parsing backup JSON", err);
        setImportStatus('❌ Không thể đọc file JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 3) {
      setPassUpdateMsg('Mật khẩu mới phải từ 3 ký tự trở lên.');
      return;
    }

    try {
      const savedUsers = JSON.parse(localStorage.getItem('dmm_users_db') || '[]');
      const updated = savedUsers.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, password: newPassword };
        }
        return u;
      });
      localStorage.setItem('dmm_users_db', JSON.stringify(updated));
      setPassUpdateMsg('🟢 Đã đổi mật khẩu thành công!');
      setNewPassword('');
      setTimeout(() => setPassUpdateMsg(''), 4000);
    } catch (e) {
      setPassUpdateMsg('❌ Lỗi khi đổi mật khẩu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User Card Header */}
        <div className="flex items-center gap-4 border-b border-emerald-900/40 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-black text-xl border-2 border-emerald-400/40 shadow-lg shadow-emerald-950 shrink-0">
            {currentUser.name.charAt(0)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3 h-3" /> HỌC VIỆN P MARCOM
            </div>
            <h3 className="text-lg font-black text-white truncate">
              {currentUser.name}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {currentUser.email}
            </p>
          </div>
        </div>

        {/* Theme Customization Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-emerald-400" /> Tùy Chỉnh Giao Diện Trải Nghiệm
          </h4>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                theme === 'light'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                  : 'bg-[#08120d] text-slate-300 border-emerald-900/60 hover:border-emerald-500'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Giao diện Sáng</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                theme === 'dark'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                  : 'bg-[#08120d] text-slate-300 border-emerald-900/60 hover:border-emerald-500'
              }`}
            >
              <Moon className="w-4 h-4 text-emerald-400" />
              <span>Giao diện Tối</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                theme === 'system'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                  : 'bg-[#08120d] text-slate-300 border-emerald-900/60 hover:border-emerald-500'
              }`}
            >
              <Monitor className="w-4 h-4 text-teal-400" />
              <span>Theo Hệ Thống</span>
            </button>
          </div>
        </div>

        {/* Learning Progress Overview */}
        <div className="p-4 rounded-2xl bg-[#08120d] border border-emerald-900/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" /> Tiến Độ Khóa Học:
            </span>
            <span className="text-emerald-400">{passedCount}/{totalModules} Chuyên đề ({progressPercent}%)</span>
          </div>

          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-emerald-950">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Value Badge inside profile */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-emerald-900/40">
            <span>Trị giá khóa học: <strong className="text-amber-400">2.999.999 VNĐ</strong></span>
            <span className="text-emerald-400 font-bold">Tài trợ 100% Học phí</span>
          </div>

          {trafficStats && (
            <div className="flex items-center justify-between text-[10px] text-teal-400 font-medium">
              <span>Real-Time Web Traffic: {trafficStats.totalTraffic.toLocaleString('vi-VN')} views</span>
              <span>{trafficStats.totalGraduates.toLocaleString('vi-VN')}+ Đạt chứng nhận</span>
            </div>
          )}
        </div>

        {/* Backup & Sync Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileJson className="w-4 h-4" /> Sao Lưu & Bảo Mật Dữ Liệu Học Viên
          </h4>

          {importStatus && (
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs">
              {importStatus}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {/* Export Backup JSON Button */}
            <button
              onClick={handleExportBackup}
              className="p-3 rounded-xl bg-[#0a1511] border border-emerald-900/60 hover:border-emerald-500 text-slate-200 text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer group"
            >
              <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
              <span>Xuất File Sao Lưu (.json)</span>
            </button>

            {/* Import Backup JSON Button */}
            <label className="p-3 rounded-xl bg-[#0a1511] border border-emerald-900/60 hover:border-emerald-500 text-slate-200 text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer group">
              <Upload className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
              <span>Khôi Phục Dữ Liệu</span>
              <input 
                type="file" 
                accept=".json"
                onChange={handleFileImport}
                className="hidden" 
              />
            </label>
          </div>
        </div>

        {/* Password Update Accordion/Section */}
        <div className="pt-3 border-t border-emerald-900/40 space-y-2">
          <form onSubmit={handleUpdatePassword} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                placeholder="Đổi mật khẩu mới..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#08120d] border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-700 hover:border-emerald-500 text-emerald-300 text-xs font-semibold transition shrink-0 cursor-pointer"
            >
              Lưu MK
            </button>
          </form>

          {passUpdateMsg && (
            <p className="text-[11px] text-emerald-400 font-medium">{passUpdateMsg}</p>
          )}
        </div>

        {/* Logout Action */}
        <div className="pt-2 border-t border-emerald-900/40">
          <button
            onClick={onLogout}
            className="w-full py-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 hover:border-rose-600 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Đăng Xuất Tài Khoản
          </button>
        </div>

      </div>
    </div>
  );
}

