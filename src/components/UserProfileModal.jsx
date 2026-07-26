import React, { useState, useEffect } from 'react';
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
  onUpdateProfile,
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
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [industry, setIndustry] = useState(currentUser?.industry || 'Digital Marketing');
  const [coverBg, setCoverBg] = useState(currentUser?.coverBg || 'emerald');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setIndustry(currentUser.industry || 'Digital Marketing');
      setCoverBg(currentUser.coverBg || 'emerald');
      setAvatarUrl(currentUser.avatarUrl || '');
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const progressPercent = Math.round((passedCount / totalModules) * 100);

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setSaveStatus('⚠️ Dung lượng ảnh đại diện tối đa 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarUrl(event.target.result);
      setSaveStatus('🟢 Đã chọn ảnh đại diện thành công!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!name || !name.trim()) {
      setSaveStatus('❌ Họ và tên không được để trống.');
      return;
    }

    const updated = {
      ...currentUser,
      name: name.trim().toUpperCase(),
      phone: phone ? phone.trim() : '',
      industry: industry || 'Digital Marketing',
      coverBg: coverBg || 'emerald',
      avatarUrl: avatarUrl || ''
    };

    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }

    setSaveStatus('🟢 Đã lưu thay đổi thông tin thành công!');
    setIsEditing(false);
    
    // Auto-close modal and return to main page
    setTimeout(() => {
      onClose();
    }, 400);
  };

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
      const safeName = (currentUser && typeof currentUser.name === 'string' ? currentUser.name : 'HocVien').replace(/\s+/g, '_');
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
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-xl border-2 border-amber-400/60 shadow-lg shrink-0 overflow-hidden">
              {(avatarUrl || currentUser.avatarUrl) ? (
                <img src={avatarUrl || currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3 h-3" /> HỌC VIỆN P MARCOM
              </div>
              <h3 className="text-lg font-black text-white truncate">
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {currentUser.email} • {currentUser.phone || 'Chưa có SĐT'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition cursor-pointer shrink-0"
          >
            {isEditing ? '✕ Hủy' : '✏️ Thấu hiểu & Sửa Hồ Sơ'}
          </button>
        </div>

        {saveStatus && (
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-bold">
            {saveStatus}
          </div>
        )}

        {/* Editable Profile Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="p-4 rounded-2xl bg-[#091611] border border-amber-500/40 space-y-3.5">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-900/60 pb-2">
              <User className="w-4 h-4 text-amber-400" /> Cập Nhật Thông Tin Cá Nhân & Ảnh Đại Diện
            </h4>

            {/* Avatar Upload Section */}
            <div className="p-3 rounded-xl bg-[#07110d] border border-emerald-900/60 space-y-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-amber-400" /> Tải Ảnh Đại Diện Cá Nhân:
              </label>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-amber-400/60 flex items-center justify-center text-amber-300 font-bold overflow-hidden shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs">Chưa có</span>
                  )}
                </div>

                <div className="flex-1 flex flex-wrap items-center gap-2">
                  <label className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-600 hover:border-emerald-400 text-emerald-300 text-xs font-bold transition cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" /> Choose Photo...
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      className="hidden"
                    />
                  </label>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold hover:bg-rose-900 transition cursor-pointer"
                    >
                      ✕ Bỏ Ảnh
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Họ và Tên Học Viên (In Bằng):</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: ĐẶNG THỊ CẨM BÌNH"
                className="w-full bg-[#08120d] border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-white uppercase font-bold focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Số Điện Thoại (Zalo):</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901234567"
                  className="w-full bg-[#08120d] border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Ngành Nghề Kinh Doanh:</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Bất Động Sản / Spa / E-Commerce..."
                  className="w-full bg-[#08120d] border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Custom Background Image Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-amber-400" /> Chọn Phong Cách Hình Nền Ứng Dụng:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {[
                  { id: 'emerald', label: '🌲 Xanh Ngọc', color: 'from-emerald-950 to-slate-950 border-emerald-500' },
                  { id: 'gold', label: '⚜️ Vàng Hoàng Gia', color: 'from-amber-950 to-slate-950 border-amber-500' },
                  { id: 'dark', label: '🌌 Tối Huyền Bí', color: 'from-slate-950 to-black border-slate-700' },
                  { id: 'teal', label: '🚀 Công Nghệ Tech', color: 'from-teal-950 to-slate-950 border-teal-500' }
                ].map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setCoverBg(bg.id)}
                    className={`p-2 rounded-xl border text-[11px] font-bold transition bg-gradient-to-br ${bg.color} ${
                      coverBg === bg.id ? 'ring-2 ring-amber-400 shadow-md text-white' : 'text-slate-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black hover:brightness-110 transition shadow cursor-pointer"
              >
                💾 Lưu Thay Đổi
              </button>
            </div>
          </form>
        )}

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

