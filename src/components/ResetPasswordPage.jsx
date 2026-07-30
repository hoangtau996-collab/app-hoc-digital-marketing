import React, { useEffect, useState } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { auth } from '../firebase';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, Home } from 'lucide-react';

/**
 * Trang đặt mật khẩu mới, mở từ đường dẫn trong thư:
 *   https://academy.pmarcom.com/doi-mat-khau?oobCode=...
 *
 * VÌ SAO TỰ DỰNG TRANG NÀY thay vì để Firebase lo: trang mặc định của Firebase
 * nằm ở tên miền firebaseapp.com, tiếng Anh, không có nhận diện Học Viện. Học
 * viên bấm link trong thư mà rơi vào một trang lạ hoắc thì phần lớn sẽ đóng lại
 * — và họ đúng khi làm vậy.
 *
 * Mã `oobCode` do Firebase cấp và Firebase kiểm tra (verifyPasswordResetCode).
 * Trang này không tự quyết định điều gì về bảo mật; nó chỉ là giao diện.
 *
 * BA TRẠNG THÁI, phải phân biệt rõ vì cách xử lý khác hẳn nhau:
 *   checking -> đang hỏi máy chủ xem mã còn dùng được không
 *   invalid  -> mã hỏng/hết hạn/đã dùng: KHÔNG hiện ô nhập, chỉ chỉ đường làm lại
 *   ready    -> hợp lệ, cho đặt mật khẩu mới
 */
export default function ResetPasswordPage({ oobCode, onDone }) {
  const [status, setStatus] = useState('checking');
  const [accountEmail, setAccountEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Kiểm tra mã NGAY khi mở trang, trước khi hiện ô nhập.
  //
  // Nếu để người dùng gõ xong mật khẩu mới rồi mới báo "liên kết đã hết hạn",
  // họ mất công vô ích và thường nghĩ là mình gõ sai chứ không hiểu link đã cũ.
  useEffect(() => {
    let cancelled = false;

    if (!oobCode) {
      setStatus('invalid');
      setErrorMsg('Đường dẫn không hợp lệ — thiếu mã xác nhận.');
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        if (cancelled) return;
        setAccountEmail(email);
        setStatus('ready');
      })
      .catch((e) => {
        if (cancelled) return;
        const code = String(e?.code || '');
        setStatus('invalid');
        if (code.includes('expired-action-code')) {
          setErrorMsg('Liên kết đã hết hạn. Mỗi liên kết chỉ dùng được trong một giờ.');
        } else if (code.includes('invalid-action-code')) {
          setErrorMsg('Liên kết không còn dùng được. Có thể bạn đã đặt lại mật khẩu bằng liên kết này rồi.');
        } else if (code.includes('user-disabled')) {
          setErrorMsg('Tài khoản này đã bị vô hiệu hoá. Vui lòng liên hệ Ban Quản Trị.');
        } else {
          setErrorMsg(`Không kiểm tra được liên kết (${code || 'lỗi không rõ'}).`);
        }
      });

    return () => { cancelled = true; };
  }, [oobCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải từ 6 ký tự trở lên.');
      return;
    }
    if (password !== confirm) {
      setErrorMsg('Hai lần nhập mật khẩu chưa khớp nhau.');
      return;
    }

    setIsSaving(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus('done');
    } catch (e) {
      const code = String(e?.code || '');
      if (code.includes('weak-password')) {
        setErrorMsg('Mật khẩu quá đơn giản. Hãy dùng mật khẩu dài hơn.');
      } else if (code.includes('expired-action-code') || code.includes('invalid-action-code')) {
        setStatus('invalid');
        setErrorMsg('Liên kết đã hết hạn hoặc đã được dùng. Vui lòng yêu cầu lại từ đầu.');
      } else {
        setErrorMsg(`Không đặt được mật khẩu mới (${code || 'lỗi không rõ'}).`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    'w-full bg-slate-900/60 border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-5">

        <div className="text-center space-y-1.5">
          <div className="flex justify-center mb-1">
            <PMarcomLogo className="w-11 h-11" showText={false} />
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-wide">ĐẶT LẠI MẬT KHẨU</h1>
          <p className="text-[11px] text-emerald-400 font-semibold">Học Viện P MARCOM</p>
        </div>

        {status === 'checking' && (
          <p className="text-xs text-slate-300 text-center py-6">Đang kiểm tra liên kết...</p>
        )}

        {status === 'invalid' && (
          <>
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-600/60 text-rose-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Hãy quay lại trang chủ, bấm <strong className="text-slate-200">Đăng nhập</strong> rồi chọn{' '}
              <strong className="text-slate-200">"Quên mật khẩu?"</strong> để nhận liên kết mới.
            </p>
          </>
        )}

        {status === 'ready' && (
          <>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Đặt mật khẩu mới cho tài khoản <strong className="text-slate-200">{accountEmail}</strong>.
            </p>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-600/60 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Mật khẩu mới:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition p-1 cursor-pointer"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Nhập lại mật khẩu mới:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Gõ lại đúng mật khẩu ở trên"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs hover:brightness-110 shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSaving ? 'Đang lưu...' : 'ĐẶT MẬT KHẨU MỚI'}</span>
              </button>
            </form>
          </>
        )}

        {status === 'done' && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Đã đổi mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
            </span>
          </div>
        )}

        {status !== 'checking' && (
          <div className="pt-2 border-t border-emerald-900/30">
            <button
              type="button"
              onClick={onDone}
              className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-slate-700"
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span>Về trang chủ &amp; đăng nhập</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
