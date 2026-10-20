import React, { useState } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { redeemAccessCode } from '../firebase';
import { chuanHoaMa, hinhThucMaHopLe, LOI_MA, nhanPhamVi } from '../utils/accessCode';
import {
  KeyRound,
  AlertCircle,
  LogOut,
  Phone,
  MessageCircle,
  Mail,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

/**
 * Màn nhập mã kích hoạt — chặn đường vào học khi học viên chưa có suất học.
 *
 * MÀN HÌNH NÀY CHẶN ĐƯỜNG, cố ý: không có nút đóng, không bấm ra ngoài để thoát.
 * Hai lối ra là nhập được mã hoặc đăng xuất. Cho phép bỏ qua thì cái khoá thành
 * vô nghĩa ngay từ đầu.
 *
 * AI KHÔNG GẶP MÀN HÌNH NÀY (xem tinhQuyenHoc trong utils/accessCode.js):
 *   - quản trị viên
 *   - học viên đăng ký trước mốc bật tính năng — lớp cũ được miễn
 *   - học viên đã nhập mã và mã đó còn sống
 *
 * Vế cuối là chỗ dễ hiểu nhầm nhất: nhập mã KHÔNG phải cửa qua một lần rồi
 * thôi. Mỗi lần vào học, quyền được tính lại từ bản ghi mã trên máy chủ. Mã hết
 * hạn hay bị Ban Quản Trị xoá thì học viên quay lại đúng màn hình này — và đó
 * chính là điều được yêu cầu, chứ không phải lỗi.
 *
 * NÚT LIÊN HỆ ĐẶT Ở ĐÂY vì đây là chỗ cần nhất: người đứng trước màn hình này
 * là người đang không vào học được. Bắt họ tự đi tìm số điện thoại ở trang khác
 * là mất họ.
 */

const HOTLINE = '0981813357';
const EMAIL_HO_TRO = 'pmarcomvn@gmail.com';

export default function AccessCodeGate({ isOpen, user, onRedeemed, onLogout }) {
  const [ma, setMa] = useState('');
  const [loi, setLoi] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const [xong, setXong] = useState(null);

  if (!isOpen) return null;

  const guiMa = async (e) => {
    e.preventDefault();
    if (dangGui) return;

    const sach = chuanHoaMa(ma);

    // Chặn hình thức sai NGAY TẠI MÁY, không gửi lên máy chủ. Người gõ nhầm
    // vài ký tự nhận lời nhắn tức thì thay vì chờ một vòng mạng, và máy chủ
    // không phải nhận những lệnh chắc chắn hỏng.
    if (!hinhThucMaHopLe(sach)) {
      setLoi('Mã gồm 4-32 ký tự, chỉ có chữ, số và dấu gạch ngang.');
      return;
    }

    setDangGui(true);
    setLoi('');

    const kq = await redeemAccessCode(sach, user);

    setDangGui(false);

    if (!kq.ok) {
      setLoi(
        kq.loi === 'mang'
          ? 'Không gửi được lên hệ thống. Kiểm tra mạng rồi thử lại giúp em.'
          : LOI_MA[kq.loi] || kq.loi || 'Mã không dùng được.'
      );
      return;
    }

    // Báo thành công rồi mới đóng: học viên cần thấy mã vừa nhập mở ra khoá
    // nào. Nhảy thẳng vào bài học làm họ không biết mình đang có quyền gì.
    setXong(kq.ma);
    setTimeout(() => onRedeemed?.(), 1600);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-5 my-auto">

        <div className="flex flex-col items-center text-center gap-2">
          <PMarcomLogo className="h-10 w-auto" />
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mt-1">
            <KeyRound className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-lg font-extrabold text-white mt-1">Nhập Mã Kích Hoạt</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Chào <strong className="text-emerald-300">{user?.name || user?.email}</strong>, tài khoản
            của bạn đã tạo xong. Nhập mã kích hoạt để bắt đầu học.
          </p>
        </div>

        {xong ? (
          <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-center space-y-1.5">
            <ShieldCheck className="w-7 h-7 text-emerald-400 mx-auto" />
            <p className="text-sm font-extrabold text-emerald-200">Kích hoạt thành công</p>
            <p className="text-xs text-slate-300">
              Bạn đã mở: <strong className="text-emerald-300">{nhanPhamVi(xong.khoa)}</strong>
            </p>
            <p className="text-[11px] text-slate-400">Đang đưa bạn vào lớp học...</p>
          </div>
        ) : (
          <form onSubmit={guiMa} className="space-y-3">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ma}
                onChange={(e) => { setMa(e.target.value); setLoi(''); }}
                placeholder="VD: PMA-K7X2M9QB"
                autoFocus
                spellCheck={false}
                autoCapitalize="characters"
                className="w-full bg-slate-900/60 border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-3 text-sm font-mono tracking-wider text-white placeholder-slate-500 focus:outline-none transition uppercase"
              />
            </div>

            {loi && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-600/60 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{loi}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={dangGui}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs hover:brightness-110 shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {dangGui
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang kiểm tra...</>
                : <><ShieldCheck className="w-4 h-4" /> Kích Hoạt Khoá Học</>}
            </button>
          </form>
        )}

        {/* ---- Liên hệ hỗ trợ ----
            Ba đường riêng chứ không phải một dòng chữ: trên điện thoại, bấm là
            mở thẳng Zalo / quay số / soạn mail. Bắt học viên bôi đen rồi chép
            số điện thoại là thêm một bước đủ để họ bỏ cuộc. */}
        <div className="pt-4 border-t border-emerald-900/50 space-y-2.5">
          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            Chưa có mã, hoặc mã báo lỗi?<br />Liên hệ Ban Quản Trị để được hỗ trợ ngay.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`https://zalo.me/${HOTLINE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-sky-500/15 border border-sky-500/40 text-sky-200 text-[11px] font-bold hover:bg-sky-500/25 transition"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Zalo
            </a>
            <a
              href={`tel:${HOTLINE}`}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold hover:bg-emerald-500/25 transition"
            >
              <Phone className="w-3.5 h-3.5" /> Gọi ngay
            </a>
          </div>

          <a
            href={`mailto:${EMAIL_HO_TRO}?subject=${encodeURIComponent('Hỗ trợ mã kích hoạt khoá học')}`}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800/70 border border-slate-600/60 text-slate-200 text-[11px] font-bold hover:bg-slate-700/70 transition"
          >
            <Mail className="w-3.5 h-3.5" /> {EMAIL_HO_TRO}
          </a>

          <p className="text-[11px] text-slate-500 text-center font-mono tracking-wide">
            Hotline / Zalo: {HOTLINE}
          </p>
        </div>

        {/* Lối ra duy nhất ngoài việc nhập được mã. Phải có: không thì người
            đăng nhập nhầm tài khoản bị kẹt vĩnh viễn ở màn hình này. */}
        <button
          onClick={onLogout}
          className="w-full py-2 text-[11px] font-bold text-slate-400 hover:text-rose-300 transition flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" /> Đăng xuất
        </button>

        {/* Trấn an, và là sự thật về cách hệ thống hoạt động: thu hồi quyền học
            và xoá người học là hai việc tách rời, chạm vào hai bảng khác nhau. */}
        <p className="text-[10px] text-slate-500 text-center leading-relaxed">
          Thông tin tài khoản và tiến độ học của bạn luôn được giữ nguyên,
          kể cả khi mã hết hạn.
        </p>
      </div>
    </div>
  );
}
