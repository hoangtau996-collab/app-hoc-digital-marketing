import React, { useState } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  saveUserProgressToCloud
} from '../firebase';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess 
}) {
  const [mode, setMode] = useState('login'); // 'login', 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Helper to fetch user database from localStorage as local cache
  const getUsersDB = () => {
    try {
      const saved = localStorage.getItem('dmm_users_db');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'user-demo-01',
        email: 'hocvien@pmarcom.edu.vn',
        password: '123',
        name: 'NGUYỄN VĂN A',
        createdAt: new Date().toLocaleDateString('vi-VN')
      }
    ];
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

    try {
      // 1. Try Firebase Cloud Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;

      const studentUser = {
        id: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || fullName || email.split('@')[0].toUpperCase(),
        createdAt: new Date().toLocaleDateString('vi-VN')
      };

      setSuccessMsg('🟢 Đăng nhập thành công qua Firebase Cloud!');
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

    if (!fullName || !email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu bảo mật phải từ 6 ký tự trở lên.');
      setIsLoading(false);
      return;
    }

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
        createdAt: new Date().toLocaleDateString('vi-VN')
      };

      // Save initial student profile to Cloud Firestore
      await saveUserProgressToCloud(fbUser.uid, {
        name: fullName.trim().toUpperCase(),
        email: fbUser.email,
        createdAt: new Date().toISOString()
      });

      setSuccessMsg('🎉 Đăng ký tài khoản Đám mây Firebase thành công!');
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
        setErrorMsg('Email này đã được đăng ký. Vui lòng chọn Đăng nhập.');
        setIsLoading(false);
        return;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        email: email.trim(),
        password: password,
        name: fullName.trim().toUpperCase(),
        createdAt: new Date().toLocaleDateString('vi-VN')
      };

      try {
        localStorage.setItem('dmm_users_db', JSON.stringify([...users, newUser]));
      } catch (e) {}

      setSuccessMsg('Tạo tài khoản học viên P MARCOM thành công!');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <PMarcomLogo className="w-12 h-12" showText={false} />
          </div>

          <h3 className="text-xl font-black text-white tracking-wide">
            {mode === 'login' ? 'ĐẮNG NHẬP HỌC VIÊN' : 'ĐĂNG KÝ TÀI KHOẢN MỚI'}
          </h3>
          <p className="text-xs text-slate-400">
            HỆ THỐNG ĐÀO TẠO TRƯỞNG PHÒNG DIGITAL MARKETING
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-[#0b1411] p-1 rounded-xl border border-emerald-900/50">
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mode === 'login' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Đăng Nhập
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mode === 'register' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Đăng Ký Mới
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
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
          
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Họ và Tên Học Viên:</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: NGUYỄN VĂN A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#08120d] border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
              <span className="text-[10px] text-slate-500 block">Họ tên sẽ được ghi trực tiếp lên Giấy Chứng Nhận.</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">Địa chỉ Email:</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                placeholder="name@pmarcom.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#08120d] border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">Mật khẩu:</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#08120d] border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-emerald-950/50 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{mode === 'login' ? 'Xác Nhận Đăng Nhập' : 'Tạo Tài Khoản Mới'}</span>
          </button>
        </form>

        {/* Quick Demo Hint */}
        {mode === 'login' && (
          <div className="pt-2 border-t border-emerald-900/40 text-center space-y-2">
            <p className="text-[11px] text-slate-400">Bạn muốn trải nghiệm thử tài khoản mẫu?</p>
            <button
              onClick={fillQuickDemo}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-[11px] font-semibold hover:border-emerald-500 transition cursor-pointer"
            >
              🔑 Dùng Tài Khoản Mẫu (hocvien@pmarcom.edu.vn)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
