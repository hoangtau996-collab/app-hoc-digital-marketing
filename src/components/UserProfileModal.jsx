import React, { useState, useEffect } from 'react';
import { getSignInMethods, addPasswordToGoogleAccount } from '../firebase';
import { requestPasswordReset } from '../utils/requestPasswordReset';
import { resizeAvatarFile } from '../utils/avatarImage';
import {
  X,
  User,
  Upload,
  LogOut,
  ShieldCheck,
  Award,
  Key,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
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
  theme = 'system',
  setTheme = () => {}
}) {
  const [passUpdateMsg, setPassUpdateMsg] = useState('');
  const [resetOk, setResetOk] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isAddingPassword, setIsAddingPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [industry, setIndustry] = useState(currentUser?.industry || 'Digital Marketing');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setIndustry(currentUser.industry || 'Digital Marketing');
      setAvatarUrl(currentUser.avatarUrl || '');
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const progressPercent = Math.round((passedCount / totalModules) * 100);

  // Đọc thẳng từ phiên Firebase Auth chứ không từ hồ sơ trong state: `providerData`
  // là thứ máy chủ cấp, còn hồ sơ trong state ghép từ localStorage nên có thể là
  // của người dùng trước trên máy dùng chung.
  const signInMethods = getSignInMethods();

  /**
   * Nhận tệp ảnh rồi thu nhỏ trước khi đưa vào state.
   *
   * Bản trước đọc thẳng tệp gốc thành base64 và nhét nguyên vào hồ sơ. Ảnh 3MB
   * thành chuỗi hơn 4MB, vượt trần `localStorage` lẫn trần 1MB của tài liệu
   * Firestore, nên hồ sơ không lưu được — mà học viên vẫn thấy ảnh hiện lên nên
   * tưởng đã xong. Xem `src/utils/avatarImage.js`.
   */
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files[0];
    // Xoá giá trị của ô chọn tệp để chọn lại đúng tệp vừa rồi vẫn kích hoạt
    // được sự kiện. Không làm thì người dùng sửa ảnh rồi chọn lại sẽ không thấy
    // gì xảy ra.
    e.target.value = '';
    if (!file) return;

    setSaveStatus('⏳ Đang xử lý ảnh...');
    try {
      const dataUrl = await resizeAvatarFile(file);
      setAvatarUrl(dataUrl);
      setSaveStatus('🟢 Đã chọn ảnh đại diện. Bấm Lưu Thay Đổi để ghi nhớ.');
    } catch (err) {
      setSaveStatus(`⚠️ ${err.message}`);
    }
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
      avatarUrl: avatarUrl || ''
    };

    // 1. Instantly update profile state & cloud sync
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }

    setIsEditing(false);
    
    // 2. Instantly close profile modal & return to main page
    if (onClose) {
      onClose();
    }
  };

  /**
   * Đặt thêm mật khẩu cho tài khoản đang đăng nhập bằng Google.
   *
   * Sau khi thành công, `getSignInMethods()` đọc lại từ phiên Firebase sẽ thấy
   * tài khoản đã có mật khẩu, nên khối giao diện này tự chuyển sang dạng "gửi
   * thư đặt lại" ở lần render kế tiếp. Không cần tải lại trang.
   */
  const handleAddPassword = async () => {
    setIsAddingPassword(true);
    setPassUpdateMsg('');
    const result = await addPasswordToGoogleAccount(newPassword);
    setPassUpdateMsg(result.message);
    setResetOk(Boolean(result.ok));
    if (result.ok) setNewPassword('');
    setIsAddingPassword(false);
  };

  /**
   * Gửi thư đặt lại mật khẩu về đúng email của tài khoản đang đăng nhập.
   *
   * Bản trước ở đây ghi mật khẩu mới vào localStorage rồi báo "🟢 Đã đổi mật
   * khẩu thành công!" — trong khi mật khẩu thật trên Firebase KHÔNG hề đổi. Tệ
   * hơn cả không có chức năng: học viên tin là đã đổi, lần sau đăng nhập bằng
   * mật khẩu mới thì không vào được, và họ không có lý do gì để nghi ngờ cái
   * thông báo màu xanh kia.
   */
  const handleSendPasswordReset = async () => {
    setIsSendingReset(true);
    setPassUpdateMsg('');
    const result = await requestPasswordReset(currentUser?.email);
    setPassUpdateMsg(result.message);
    setResetOk(Boolean(result.ok));
    setIsSendingReset(false);
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

        {/* User Card Header
            `min-w-0` ở khối bên trái là thứ giữ nút Sửa Hồ Sơ nằm trong khung.
            Mặc định một phần tử flex không co xuống dưới bề rộng nội dung của
            nó, nên khối tên và email cứ giữ nguyên chiều ngang và đẩy nút văng
            hẳn ra ngoài mép hộp thoại. Có `truncate` bên trong cũng vô ích vì
            nó chỉ chạy khi phần tử đã bị co lại.
            `pr-12` chừa chỗ cho nút đóng đang nằm đè ở góc trên bên phải. */}
        <div className="flex items-start justify-between gap-3 flex-wrap border-b border-emerald-900/40 pb-5 pr-12">
          <div className="flex items-center gap-4 min-w-0 flex-1">
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
          <form onSubmit={handleSaveProfile} className="p-4 rounded-2xl bg-[#131e34] border border-amber-500/40 space-y-3.5">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-900/60 pb-2">
              <User className="w-4 h-4 text-amber-400" /> Cập Nhật Thông Tin Cá Nhân & Ảnh Đại Diện
            </h4>

            {/* Avatar Upload Section */}
            <div className="p-3 rounded-xl bg-[#0f1728] border border-emerald-900/60 space-y-2">
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
                className="w-full bg-[#111a2e] border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-white uppercase font-bold focus:outline-none focus:border-amber-400"
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
                  className="w-full bg-[#111a2e] border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Ngành Nghề Kinh Doanh:</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Bất Động Sản / Spa / E-Commerce..."
                  className="w-full bg-[#111a2e] border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* ĐÃ GỠ: bộ chọn "Phong Cách Hình Nền Ứng Dụng" (Xanh Ngọc / Vàng
                Hoàng Gia / Tối Huyền Bí / Công Nghệ Tech).

                Bốn nút đó bấm được, sáng viền lên, lưu xuống hồ sơ và đồng bộ
                cả lên Firestore — nhưng KHÔNG có chỗ nào trong ứng dụng đọc giá
                trị `coverBg` ra để vẽ. Nói cách khác, học viên chọn xong thì
                không có gì thay đổi cả.

                Một nút bấm không làm gì còn tệ hơn là không có nút: người dùng
                tưởng mình làm sai, thử đi thử lại, rồi kết luận ứng dụng hỏng.
                Việc đổi sáng/tối thật sự có tác dụng nằm ngay bên dưới, ở mục
                "Tùy Chỉnh Giao Diện Trải Nghiệm". */}

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
                  : 'bg-[#111a2e] text-slate-300 border-emerald-900/60 hover:border-emerald-500'
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
                  : 'bg-[#111a2e] text-slate-300 border-emerald-900/60 hover:border-emerald-500'
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
                  : 'bg-[#111a2e] text-slate-300 border-emerald-900/60 hover:border-emerald-500'
              }`}
            >
              <Monitor className="w-4 h-4 text-teal-400" />
              <span>Theo Hệ Thống</span>
            </button>
          </div>
        </div>

        {/* Learning Progress Overview */}
        <div className="p-4 rounded-2xl bg-[#111a2e] border border-emerald-900/60 space-y-3">
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

          {/* Đã gỡ dòng "Real-Time Web Traffic / Đạt chứng nhận".
              Đây là hồ sơ cá nhân của học viên — số liệu vận hành toàn hệ thống
              không thuộc về chỗ này, và nó cũng chẳng nói lên điều gì về việc
              học của họ. Số liệu đó vẫn còn ở Bảng Quản Trị và trang Tổng Quan. */}
        </div>

        {/* ĐÃ GỠ: mục "Sao Lưu & Bảo Mật Dữ Liệu Học Viên" (Xuất File Sao Lưu
            .json / Khôi Phục Dữ Liệu).

            Hai lý do, lý do thứ hai mới là lý do thật:

            1. Thừa. Tiến độ học nay đồng bộ lên Firestore và tự nạp lại mỗi lần
               đăng nhập (xem getUserProgressFromCloud trong App.jsx). Học viên
               xoá trình duyệt hay đổi máy đều không mất gì. Nút sao lưu tay là
               di sản từ thời đồng bộ đám mây chưa chạy.

            2. Nút "Khôi Phục Dữ Liệu" là một lỗ hổng với tấm bằng. Nó nhận
               thẳng mảng `completedModules` từ tệp JSON người dùng đưa vào,
               không đối chiếu email, không kiểm tra gì cả. Nghĩa là mở tệp bằng
               Notepad, sửa thành đủ 11 chuyên đề, nạp lên — là đủ điều kiện
               nhận Giấy Chứng Nhận mà không học buổi nào. Tệp còn chia sẻ được
               cho người khác dùng chung.

            Giấy Chứng Nhận là thứ có giá trị nhất mà học viện cấp ra. Giữ một
            đường tắt như vậy chỉ để tiện sao lưu — trong khi đám mây đã lo phần
            sao lưu — là đánh đổi sai. */}

        {/* ĐỔI MẬT KHẨU

            Hiện đúng một trong hai thứ, tuỳ cách tài khoản này đăng nhập:
              - có mật khẩu  -> nút gửi thư đặt lại
              - chỉ có Google -> lời giải thích, không có nút nào

            Không gộp thành một giao diện chung: học viên đăng nhập bằng Google
            KHÔNG có mật khẩu nào ở hệ thống này, đưa cho họ nút đổi mật khẩu là
            mời họ đi làm một việc không tồn tại. */}
        <div className="pt-3 border-t border-emerald-900/40 space-y-2">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-4 h-4" /> Mật Khẩu Đăng Nhập
          </h4>

          {signInMethods.hasPassword ? (
            <>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Bấm nút dưới đây, hệ thống gửi một đường dẫn đặt lại mật khẩu về email{' '}
                <strong className="text-slate-200">{currentUser.email}</strong>. Bạn không cần nhớ mật khẩu cũ.
              </p>
              <button
                type="button"
                onClick={handleSendPasswordReset}
                disabled={isSendingReset}
                className="w-full py-2.5 rounded-xl bg-emerald-950 border border-emerald-700 hover:border-emerald-500 text-emerald-300 text-xs font-bold transition cursor-pointer disabled:opacity-60"
              >
                {isSendingReset ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
              </button>
            </>
          ) : signInMethods.hasGoogle ? (
            <>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Bạn đang đăng nhập bằng <strong className="text-slate-200">tài khoản Google</strong>.
                Đặt thêm một mật khẩu riêng thì lần sau vào học được bằng <strong className="text-slate-200">cả hai cách</strong>.
              </p>
              <p className="text-[11px] text-amber-300/90 leading-relaxed">
                Nên đặt: khi mở link khoá học <strong>ngay trong Zalo hoặc Facebook</strong>, Google chặn đăng nhập
                từ đó. Lúc ấy mật khẩu là lối vào duy nhất.
              </p>

              {/* Nút con mắt: gõ mật khẩu mà không nhìn thấy mình gõ gì là
                  nguồn gốc của phần lớn ca "đặt mật khẩu xong không đăng nhập
                  được". Ở đây lại càng nên có, vì đây là ô đặt mật khẩu MỚI —
                  không có ô nhập lại để đối chiếu, gõ sai một ký tự là học viên
                  tự khoá mình ra ngoài mà không hề hay biết. */}
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#111a2e] border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-8 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition p-1 cursor-pointer"
                  title={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddPassword}
                disabled={isAddingPassword}
                className="w-full py-2.5 rounded-xl bg-emerald-950 border border-emerald-700 hover:border-emerald-500 text-emerald-300 text-xs font-bold transition cursor-pointer disabled:opacity-60"
              >
                {isAddingPassword ? 'Đang đặt mật khẩu...' : 'Đặt mật khẩu cho tài khoản này'}
              </button>
            </>
          ) : (
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tài khoản này đang đăng nhập ở chế độ tạm trên thiết bị của bạn nên chưa đặt được mật khẩu.
              Vui lòng đăng xuất rồi đăng ký lại khi có kết nối mạng.
            </p>
          )}

          {passUpdateMsg && (
            <p className={`text-[11px] font-medium leading-relaxed ${resetOk ? 'text-emerald-400' : 'text-rose-400'}`}>
              {passUpdateMsg}
            </p>
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

