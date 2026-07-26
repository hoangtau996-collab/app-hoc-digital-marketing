import React, { useState } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  saveUserProgressToCloud,
  recordStudentAccountToCloud
} from '../firebase';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone,
  Briefcase,
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Home,
  Eye,
  EyeOff
} from 'lucide-react';

const INDUSTRY_OPTIONS = [
  'Bất Động Sản',
  'Thương Mại Điện Tử & Bán Lẻ (E-Commerce)',
  'F&B - Nông Sản - Thực Phẩm',
  'Thời Trang - Mỹ Phẩm & Làm Đẹp',
  'Dịch Vụ & Spa - Thẩm Mỹ Viện',
  'Y Tế - Sức Khỏe - Dược Phẩm',
  'Giáo Dục & Đào Tạo - Du Học',
  'Công Nghệ - Phần Mềm & SaaS',
  'Tài Chính - Ngân Hàng - Bảo Hiểm',
  'Agency & Truyền Thông Marketing',
  'Ngành nghề Khác'
];

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  onReturnHome,
  t
}) {
  const textDict = t || {
    authTitleRegister: "ĐĂNG KÝ TÀI KHOẢN HỌC VIÊN",
    authTitleLogin: "ĐĂNG NHẬP HỌC VIÊN",
    authSubtitle: "Đăng ký tài khoản để tham gia học 11 chuyên đề & nhận Giấy Chứng Nhận",
    tabRegister: "1. Đăng Ký Mới",
    tabLogin: "2. Đăng Nhập",
    labelFullName: "Họ và Tên Học Viên:",
    labelPhone: "Số Điện Thoại (Zalo):",
    labelIndustry: "Ngành Nghề Kinh Doanh:",
    labelEmail: "Địa chỉ Email:",
    labelPassword: "Mật khẩu bảo mật:",
    rememberMeLabel: "Ghi nhớ đăng nhập trên thiết bị này",
    btnRegisterSubmit: "HOÀN TẤT ĐĂNG KÝ HỌC VIÊN",
    btnLoginSubmit: "XÁC NHẬN ĐĂNG NHẬP",
    btnReturnHome: "Trở Về Trang Chủ (Xem Tổng Quan)",
    btnQuickDemo: "🔑 Dùng Tài Khoản Mẫu (hocvien@pmarcom.edu.vn)"
  };

  const [mode, setMode] = useState('register'); // 'register', 'login'
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [industry, setIndustry] = useState(INDUSTRY_OPTIONS[0]);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill remembered login email if stored
  React.useEffect(() => {
    if (isOpen) {
      try {
        const savedEmail = localStorage.getItem('dmm_remembered_email');
        const savedChoice = localStorage.getItem('dmm_remember_me_choice');
        if (savedEmail) {
          setEmail(savedEmail);
        }
        if (savedChoice !== null) {
          setRememberMe(savedChoice === 'true');
        }
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Helper to fetch user database from localStorage as local cache
  const getUsersDB = () => {
    try {
      const saved = localStorage.getItem('dmm_users_db');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'admin-master-01',
        email: 'admin@pmarcom.edu.vn',
        password: 'admin',
        name: 'QUẢN TRỊ VIÊN ADMIN',
        phone: '0999999999',
        industry: 'Ban Quản Trị Học Viện',
        role: 'admin',
        createdAt: new Date().toLocaleDateString('vi-VN')
      },
      {
        id: 'user-demo-01',
        email: 'hocvien@pmarcom.edu.vn',
        password: '123',
        name: 'NGUYỄN VĂN A',
        phone: '0901234567',
        industry: 'Bất Động Sản',
        createdAt: new Date().toLocaleDateString('vi-VN')
      }
    ];
  };

  const saveRememberedState = () => {
    try {
      if (rememberMe) {
        localStorage.setItem('dmm_remembered_email', email.trim());
        localStorage.setItem('dmm_remember_me_choice', 'true');
      } else {
        localStorage.removeItem('dmm_remembered_email');
        localStorage.setItem('dmm_remember_me_choice', 'false');
      }
    } catch (e) {}
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      setIsLoading(false);
      return;
    }

    saveRememberedState();

    try {
      // 1. Try Firebase Cloud Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;

      const studentUser = {
        id: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || fullName || email.split('@')[0].toUpperCase(),
        phone: phone || 'Chưa cập nhật',
        industry: industry || 'Kinh doanh',
        createdAt: new Date().toLocaleDateString('vi-VN')
      };

      setSuccessMsg('🟢 Đăng nhập thành công!');
      setTimeout(() => {
        onLoginSuccess(studentUser);
        onClose();
      }, 500);
    } catch (firebaseErr) {
      console.warn("Firebase Auth Error, trying local DB fallback:", firebaseErr.message);

      // 2. Fallback to local accounts
      const users = getUsersDB();
      const foundUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);

      if (foundUser) {
        setSuccessMsg('🟢 Đăng nhập thành công!');
        setTimeout(() => {
          onLoginSuccess(foundUser);
          onClose();
        }, 500);
      } else {
        setErrorMsg('Email hoặc mật khẩu không chính xác. Thử tài khoản hocvien@pmarcom.edu.vn / 123');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!fullName.trim() || !phone.trim() || !email.trim() || !password || !industry) {
      setErrorMsg('Vui lòng điền đầy đủ 4 thông tin bắt buộc: Họ Tên, SĐT, Email và Ngành Nghề.');
      setIsLoading(false);
      return;
    }

    if (phone.trim().length < 9) {
      setErrorMsg('Vui lòng nhập Số điện thoại hợp lệ.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu bảo mật phải từ 6 ký tự trở lên.');
      setIsLoading(false);
      return;
    }

    saveRememberedState();

    try {
      // 1. Register via Firebase Cloud Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;

      // Set display name in Firebase Profile
      await updateProfile(fbUser, { displayName: fullName.trim().toUpperCase() });

      const studentUser = {
        id: fbUser.uid,
        email: fbUser.email,
        name: fullName.trim().toUpperCase(),
        phone: phone.trim(),
        industry: industry,
        createdAt: new Date().toLocaleDateString('vi-VN')
      };

      // Save complete student profile to Cloud Firestore
      await saveUserProgressToCloud(fbUser.uid, {
        name: fullName.trim().toUpperCase(),
        phone: phone.trim(),
        email: fbUser.email,
        industry: industry,
        createdAt: new Date().toISOString()
      });

      setSuccessMsg('🎉 Đăng ký tài khoản học viên P MARCOM thành công! Bạn có thể bắt đầu học ngay.');
      setTimeout(() => {
        onLoginSuccess(studentUser);
        onClose();
      }, 600);
    } catch (firebaseErr) {
      console.warn("Firebase Register Error, falling back to local storage:", firebaseErr.message);

      // Fallback local registration if offline or demo key
      const users = getUsersDB();
      const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

      if (existing) {
        setErrorMsg('Email này đã được đăng ký. Vui lòng chuyển sang Đăng nhập.');
        setIsLoading(false);
        return;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        email: email.trim(),
        password: password,
        name: fullName.trim().toUpperCase(),
        phone: phone.trim(),
        industry: industry,
        createdAt: new Date().toLocaleDateString('vi-VN')
      };

      try {
        localStorage.setItem('dmm_users_db', JSON.stringify([...users, newUser]));
        // Sync fallback registration to Cloud Firestore as well
        recordStudentAccountToCloud(newUser);
      } catch (e) {}

      setSuccessMsg('🎉 Tạo tài khoản học viên P MARCOM thành công! Bạn có thể bắt đầu học ngay.');
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 600);
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickDemo = () => {
    setEmail('hocvien@pmarcom.edu.vn');
    setPassword('123');
    setMode('login');
    setErrorMsg('');
  };

  const fillAdminDemo = () => {
    setEmail('admin@pmarcom.edu.vn');
    setPassword('admin');
    setMode('login');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-5 my-8">
        
        {/* Return to Homepage Button (Top-Left Corner) */}
        <button
          type="button"
          onClick={() => {
            if (onReturnHome) onReturnHome();
            onClose();
          }}
          className="absolute top-4 left-4 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 hover:border-emerald-400 text-emerald-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition cursor-pointer shadow-md"
          title="Trở về Trang chủ"
        >
          <Home className="w-3.5 h-3.5 text-emerald-400" />
          <span>Trang chủ</span>
        </button>

        {/* Close Button (Top-Right Corner) */}
        <button
          type="button"
          onClick={() => {
            if (onReturnHome) onReturnHome();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shadow-md"
          title="Đóng & Trở về trang chủ"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header Branding */}
        <div className="text-center space-y-1.5">
          <div className="flex justify-center mb-1">
            <PMarcomLogo className="w-11 h-11" showText={false} />
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white tracking-wide">
            {mode === 'register' ? textDict.authTitleRegister : textDict.authTitleLogin}
          </h3>
          <p className="text-[11px] text-emerald-400 font-semibold">
            {textDict.authSubtitle}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-slate-900/60 p-1 rounded-xl border border-emerald-900/50">
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> {textDict.tabRegister}
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> {textDict.tabLogin}
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-600/60 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Controls */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-3.5">
          
          {mode === 'register' && (
            <>
              {/* Field 1: Họ và tên */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>{textDict.labelFullName}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">*Bắt buộc</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: NGUYỄN VĂN A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-900/60 border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Field 2: Số điện thoại */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>{textDict.labelPhone}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">*Bắt buộc</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0901234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900/60 border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Field 4: Ngành nghề kinh doanh */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>{textDict.labelIndustry}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">*Bắt buộc</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-slate-900/60 border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none transition appearance-none cursor-pointer"
                  >
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Field 3: Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>{textDict.labelEmail}</span>
              <span className="text-[10px] text-emerald-400 font-bold">*Bắt buộc</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@pmarcom.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/60 border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>{textDict.labelPassword}</span>
              <span className="text-[10px] text-emerald-400 font-bold">*Bắt buộc</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="•••••••• (Tối thiểu 6 ký tự)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-10 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition p-1 cursor-pointer"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1 pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-emerald-400 transition select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-emerald-800 bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
              />
              <span className="font-semibold text-[11px] sm:text-xs">{textDict.rememberMeLabel || "Ghi nhớ đăng nhập trên thiết bị này"}</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs hover:brightness-110 shadow-lg transition cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Đang Xử Lý...' : mode === 'register' ? textDict.btnRegisterSubmit : textDict.btnLoginSubmit}</span>
          </button>
        </form>

        {/* Return Home Secondary Action Button */}
        <div className="pt-2 border-t border-emerald-900/30 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onReturnHome) onReturnHome();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-slate-700 shadow-sm"
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span>Trở Về Trang Chủ (Xem Tổng Quan)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
