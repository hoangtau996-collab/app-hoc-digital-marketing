import React, { useState } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { INDUSTRY_OPTIONS } from '../utils/industryOptions';
import {
  auth,
  updateProfile,
  recordStudentAccountToCloud,
  recordRealStudentEnrollment
} from '../firebase';
import {
  User,
  Phone,
  Briefcase,
  Mail,
  ShieldCheck,
  AlertCircle,
  LogOut
} from 'lucide-react';

/**
 * Bước "Hoàn tất hồ sơ" — chặn đường vào học khi hồ sơ còn thiếu số điện thoại.
 *
 * VÌ SAO CÓ MÀN HÌNH NÀY: hồ sơ học viên cần SỐ ĐIỆN THOẠI và NGÀNH NGHỀ.
 * Thiếu chúng thì Bảng Quản Trị có tên học viên nhưng không có cách nào liên
 * lạc, và tấm bằng cấp ra không gắn với ngành nào cả.
 *
 * Hai lớp tài khoản rơi vào đây:
 *   - đăng nhập bằng Google: Google chỉ trả về email, tên và ảnh đại diện,
 *     không có hai trường kia
 *   - tài khoản cũ tạo trước khi form đăng ký bắt buộc điền SĐT, và tài khoản
 *     sinh ra từ nhánh đăng ký dự phòng tại máy
 *
 * MÀN HÌNH NÀY CHẶN ĐƯỜNG, cố ý: không có nút đóng, không bấm ra ngoài để thoát.
 * Chỉ hai lối ra là điền xong hoặc đăng xuất. Cho phép bỏ qua thì gần như chắc
 * chắn không ai quay lại điền, và mục đích thu số điện thoại — chăm sóc học viên
 * — mất luôn.
 *
 * Chốt chặn thật nằm ở App.jsx (`needsProfileCompletion`), tính lại sau MỖI lần
 * tải trang từ dữ liệu trên máy chủ. Đóng tab rồi mở lại không vòng qua được.
 */
export default function CompleteProfileModal({ isOpen, user, onComplete, onLogout }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState(INDUSTRY_OPTIONS[0]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Điền sẵn tên Google trả về, nhưng chỉ một lần và chỉ khi ô còn trống — người
  // dùng sửa lại tên rồi mà mỗi lần render lại bị ghi đè về tên Google thì không
  // sao gõ nổi.
  const [hasPrefilled, setHasPrefilled] = useState(false);
  React.useEffect(() => {
    if (isOpen && !hasPrefilled) {
      const suggested = String(user?.name || auth.currentUser?.displayName || '').trim();
      if (suggested) setFullName(suggested.toUpperCase());
      setHasPrefilled(true);
    }
  }, [isOpen, hasPrefilled, user]);

  if (!isOpen) return null;

  const email = String(user?.email || auth.currentUser?.email || '').trim().toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và Tên của bạn.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 9) {
      setErrorMsg('Vui lòng nhập Số điện thoại hợp lệ (tối thiểu 9 chữ số).');
      return;
    }

    setIsSaving(true);

    const profile = {
      ...(user || {}),
      id: user?.id || auth.currentUser?.uid,
      email,
      name: fullName.trim().toUpperCase(),
      phone: phone.trim(),
      industry,
      createdAt: user?.createdAt || new Date().toLocaleDateString('vi-VN')
    };

    // Đồng bộ tên sang hồ sơ Firebase Auth. Hỏng ở đây không chặn đường: đây chỉ
    // là bản sao cho tiện, nguồn thật của tên là hồ sơ trên Firestore.
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: profile.name });
      }
    } catch (err) {
      console.warn('Không cập nhật được tên hiển thị trên Firebase Auth:', err);
    }

    // CÓ await và CÓ kiểm tra kết quả — giống luồng đăng ký thường. Đây là lúc
    // duy nhất biết chắc hồ sơ có lên được máy chủ hay không.
    const cloudResult = await recordStudentAccountToCloud(profile);

    // Cộng bộ đếm ghi danh đúng MỘT lần cho mỗi email.
    //
    // Khác với form đăng ký (mỗi tài khoản chỉ đăng ký được một lần), màn hình
    // này có thể mở lại: lưu lên máy chủ hỏng thì học viên vào học bằng bản lưu
    // tại máy, và lần tải trang sau chốt chặn lại bật lên. Không có khoá này thì
    // mỗi vòng như vậy cộng thêm một học viên vào con số công bố.
    const enrollKey = `dmm_enroll_counted_${email}`;
    try {
      if (cloudResult && cloudResult.ok !== false && !localStorage.getItem(enrollKey)) {
        localStorage.setItem(enrollKey, '1');
        recordRealStudentEnrollment();
      }
    } catch (err) { /* localStorage bị chặn thì bỏ qua bộ đếm */ }

    setIsSaving(false);

    if (cloudResult && cloudResult.ok === false) {
      // Vẫn cho vào học, nhưng nói thật là hồ sơ chưa lên hệ thống — giống hệt
      // cách luồng đăng ký thường xử lý. Nhốt học viên lại ở đây khi máy chủ
      // hỏng thì họ không làm được gì cả, mà lỗi lại không phải của họ.
      setErrorMsg(
        `Hồ sơ đã lưu trên thiết bị này nhưng CHƯA lên được hệ thống ` +
        `(${cloudResult.code || 'lỗi không rõ'}). Bạn vẫn học được ngay, nhưng Ban Quản Trị ` +
        `chưa thấy hồ sơ của bạn — vui lòng báo lại để được hỗ trợ.`
      );
      setTimeout(() => onComplete(profile), 3500);
      return;
    }

    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-5 my-8">

        <div className="text-center space-y-1.5">
          <div className="flex justify-center mb-1">
            <PMarcomLogo className="w-11 h-11" showText={false} />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-wide">
            HOÀN TẤT HỒ SƠ HỌC VIÊN
          </h3>
          <p className="text-[11px] text-emerald-400 font-semibold leading-relaxed">
            Hồ sơ của bạn còn thiếu thông tin liên hệ. Xin bạn điền nốt để Ban Quản Trị
            liên hệ được khi cần và cấp Giấy Chứng Nhận đúng tên.
          </p>
        </div>

        {email && (
          <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-900/60 flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 font-semibold">Tài khoản Google đang dùng</div>
              <div className="text-xs text-white font-bold truncate">{email}</div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-600/60 text-rose-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Họ và Tên Học Viên:</span>
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
            <p className="text-[10px] text-slate-400">Tên này sẽ được in trên Giấy Chứng Nhận.</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Số Điện Thoại (Zalo):</span>
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

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Ngành Nghề Kinh Doanh:</span>
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

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs hover:brightness-110 shadow-lg transition cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSaving ? 'Đang Lưu Hồ Sơ...' : 'HOÀN TẤT & BẮT ĐẦU HỌC'}</span>
          </button>
        </form>

        <div className="pt-2 border-t border-emerald-900/30">
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-slate-700"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Đăng xuất, dùng tài khoản khác</span>
          </button>
        </div>

      </div>
    </div>
  );
}
