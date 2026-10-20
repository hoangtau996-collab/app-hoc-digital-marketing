import React, { useEffect, useMemo, useState } from 'react';
import {
  listenToAccessCodes,
  saveAccessCode,
  deleteAccessCode,
  fetchAllEnrollments,
} from '../firebase';
import {
  tinhTrangMa,
  sinhMa,
  nhanPhamVi,
  chuanHoaMa,
  hinhThucMaHopLe,
  KHOA_HOP_LE,
  TEN_KHOA,
} from '../utils/accessCode';
import {
  KeyRound,
  Plus,
  Trash2,
  Power,
  RefreshCw,
  Users,
  AlertCircle,
  Copy,
  Check,
  CalendarClock,
} from 'lucide-react';

/**
 * Bảng quản lý mã kích hoạt cho Ban Quản Trị.
 *
 * TÁCH THÀNH TỆP RIÊNG thay vì nhét vào AdminDashboardModal: tệp đó đã hơn
 * 2.300 dòng, thêm một khối CRUD nữa vào là không ai còn đọc nổi. Ở đây nó
 * đứng một mình, sửa được mà không sợ đụng vào phần cấp bằng hay hộp thư.
 *
 * HAI NÚT KHÁC NHAU, CỐ Ý:
 *   - "Tắt"  : mã ngừng dùng được nhưng vẫn nằm trong sổ, bật lại được, và vẫn
 *              tra được ai đã nhập mã đó. Đây là việc nên làm thường ngày.
 *   - "Xoá"  : mã biến mất hẳn. Người đã nhập mất quyền ngay lập tức.
 *
 * Cả hai đều KHÔNG đụng tới hồ sơ học viên. Học viên bị thu hồi quyền vẫn còn
 * nguyên trong danh sách, vẫn còn tiến độ, vẫn liên lạc được — cấp mã mới là
 * họ học tiếp từ đúng chỗ đang dở.
 */

const HOM_NAY = () => new Date().toISOString().slice(0, 10);

/** Mặc định hạn 90 ngày: đủ dài cho một khoá học, đủ ngắn để không trôi nổi mãi. */
const MAC_DINH_HAN = () => {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return d.toISOString().slice(0, 10);
};

const MAU_TINH_TRANG = {
  'dung-duoc': { chu: 'Đang chạy', lop: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' },
  'het-han': { chu: 'Hết hạn', lop: 'bg-amber-500/15 text-amber-300 border-amber-500/40' },
  'het-luot': { chu: 'Hết lượt', lop: 'bg-amber-500/15 text-amber-300 border-amber-500/40' },
  tat: { chu: 'Đã tắt', lop: 'bg-slate-600/20 text-slate-300 border-slate-500/40' },
  hong: { chu: 'Lỗi dữ liệu', lop: 'bg-rose-500/15 text-rose-300 border-rose-500/40' },
  'khong-ton-tai': { chu: '—', lop: 'bg-slate-700/20 text-slate-400 border-slate-600/40' },
};

export default function AccessCodeManager({ adminEmail }) {
  const [danhSach, setDanhSach] = useState([]);
  const [loiTai, setLoiTai] = useState(false);
  const [luotNhap, setLuotNhap] = useState([]);
  const [dangLuu, setDangLuu] = useState(false);
  const [thongBao, setThongBao] = useState('');
  const [daChep, setDaChep] = useState('');
  const [xemLuot, setXemLuot] = useState(null);

  const [form, setForm] = useState({
    code: '',
    khoa: ['main'],
    hanDung: MAC_DINH_HAN(),
    soLuot: 20,
    ghiChu: '',
  });

  useEffect(() => {
    const huy = listenToAccessCodes((ds) => {
      if (ds === null) { setLoiTai(true); return; }
      setLoiTai(false);
      setDanhSach(ds);
    });
    return () => { if (typeof huy === 'function') huy(); };
  }, []);

  const taiLuotNhap = async () => {
    const ds = await fetchAllEnrollments();
    setLuotNhap(ds || []);
  };
  useEffect(() => { taiLuotNhap(); }, []);

  // Đếm số người đã nhập theo từng mã, lấy từ sổ lượt nhập thật.
  //
  // KHÔNG dùng để thay cho `daDung`: `daDung` là con số máy chủ tăng trong
  // transaction và là thứ quyết định mã còn lượt hay không. Bảng dưới hiển thị
  // cả hai, vì lệch nhau là dấu hiệu có người xoá lượt nhập bằng tay.
  const demTheoMa = useMemo(() => {
    const d = {};
    luotNhap.forEach((l) => {
      const k = chuanHoaMa(l.ma);
      d[k] = (d[k] || 0) + 1;
    });
    return d;
  }, [luotNhap]);

  const doiKhoa = (k) => {
    setForm((f) => ({
      ...f,
      khoa: f.khoa.includes(k) ? f.khoa.filter((x) => x !== k) : [...f.khoa, k],
    }));
  };

  const taoMa = async (e) => {
    e.preventDefault();
    const code = chuanHoaMa(form.code) || sinhMa();

    if (!hinhThucMaHopLe(code)) {
      setThongBao('Mã phải có 4-32 ký tự, chỉ chữ, số và dấu gạch ngang.');
      return;
    }
    if (form.khoa.length === 0) {
      setThongBao('Chọn ít nhất một khoá học cho mã này.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.hanDung)) {
      setThongBao('Chọn hạn sử dụng.');
      return;
    }
    if (Number(form.soLuot) < 1) {
      setThongBao('Số lượt phải từ 1 trở lên.');
      return;
    }
    if (danhSach.some((m) => m.code === code)) {
      setThongBao(`Mã ${code} đã tồn tại. Đổi mã khác hoặc sửa mã đang có.`);
      return;
    }

    setDangLuu(true);
    try {
      await saveAccessCode({ ...form, code }, adminEmail);
      setThongBao(`Đã tạo mã ${code}.`);
      setForm((f) => ({ ...f, code: '', ghiChu: '' }));
    } catch (err) {
      setThongBao('Không lưu được. Kiểm tra quyền quản trị và kết nối mạng.');
    }
    setDangLuu(false);
  };

  const batTat = async (ma) => {
    try {
      await saveAccessCode({ ...ma, active: !ma.active }, adminEmail);
    } catch (e) {
      setThongBao('Không đổi được trạng thái mã.');
    }
  };

  const xoa = async (ma) => {
    const soNguoi = demTheoMa[ma.code] || 0;
    const canhBao = soNguoi > 0
      ? `Xoá mã ${ma.code}?\n\n${soNguoi} học viên đã nhập mã này sẽ MẤT QUYỀN HỌC NGAY LẬP TỨC.\n\nThông tin và tiến độ của họ vẫn được giữ nguyên.`
      : `Xoá mã ${ma.code}? Chưa có ai nhập mã này.`;
    if (!window.confirm(canhBao)) return;

    try {
      await deleteAccessCode(ma.code);
      setThongBao(`Đã xoá mã ${ma.code}.`);
    } catch (e) {
      setThongBao('Không xoá được mã.');
    }
  };

  const chep = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setDaChep(code);
      setTimeout(() => setDaChep(''), 1500);
    } catch (e) {
      setThongBao(`Không chép tự động được. Mã là: ${code}`);
    }
  };

  const bayGio = Date.now();

  return (
    <div className="space-y-5">

      {/* ---- Tạo mã mới ---- */}
      <form onSubmit={taoMa} className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-900/60 space-y-3">
        <h3 className="text-xs font-extrabold text-emerald-300 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tạo Mã Kích Hoạt Mới
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Mã (để trống sẽ tự sinh)</label>
            <div className="flex gap-1.5">
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="Tự sinh nếu để trống"
                className="flex-1 min-w-0 bg-slate-900/70 border border-emerald-900/60 focus:border-emerald-400 rounded-lg px-2.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none uppercase"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, code: sinhMa() })}
                title="Sinh mã ngẫu nhiên"
                className="px-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Khoá được mở</label>
            <div className="flex gap-1.5">
              {KHOA_HOP_LE.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => doiKhoa(k)}
                  className={`flex-1 min-w-0 px-2 py-2 rounded-lg text-[11px] font-bold border transition truncate ${
                    form.khoa.includes(k)
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                      : 'bg-slate-900/70 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {TEN_KHOA[k]}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500">Chọn cả hai = mã combo.</p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Hạn sử dụng (hết ngày)</label>
            <input
              type="date"
              value={form.hanDung}
              min={HOM_NAY()}
              onChange={(e) => setForm({ ...form, hanDung: e.target.value })}
              className="w-full bg-slate-900/70 border border-emerald-900/60 focus:border-emerald-400 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Số lượt dùng tối đa</label>
            <input
              type="number"
              min="1"
              value={form.soLuot}
              onChange={(e) => setForm({ ...form, soLuot: e.target.value })}
              className="w-full bg-slate-900/70 border border-emerald-900/60 focus:border-emerald-400 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <input
          value={form.ghiChu}
          onChange={(e) => setForm({ ...form, ghiChu: e.target.value })}
          placeholder="Ghi chú — VD: Lớp tháng 10, khách hàng ABC"
          className="w-full bg-slate-900/70 border border-emerald-900/60 focus:border-emerald-400 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={dangLuu}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs hover:brightness-110 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <KeyRound className="w-4 h-4" /> {dangLuu ? 'Đang lưu...' : 'Tạo Mã'}
        </button>

        {thongBao && (
          <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-600/60 text-[11px] text-slate-200 flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
            <span>{thongBao}</span>
          </div>
        )}
      </form>

      {/* ---- Danh sách mã ---- */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-extrabold text-emerald-300">
            Kho Mã ({danhSach.length})
          </h3>
          <button
            onClick={taiLuotNhap}
            className="text-[11px] font-bold text-slate-400 hover:text-emerald-300 flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3 h-3" /> Tải lại lượt nhập
          </button>
        </div>

        {loiTai && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600/50 text-[11px] text-rose-200">
            Không đọc được kho mã. Kiểm tra quyền quản trị và luật Firestore đã deploy chưa.
          </div>
        )}

        {!loiTai && danhSach.length === 0 && (
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-[11px] text-slate-400 text-center">
            Chưa có mã nào. Tạo mã đầu tiên ở khung phía trên.
          </div>
        )}

        {danhSach.map((ma) => {
          const tt = tinhTrangMa(ma, bayGio);
          const mau = MAU_TINH_TRANG[tt] || MAU_TINH_TRANG['khong-ton-tai'];
          const soNguoi = demTheoMa[ma.code] || 0;

          return (
            <div key={ma.code} className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/80 space-y-2">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <code className="text-xs font-extrabold font-mono text-white tracking-wider">{ma.code}</code>
                    <button
                      onClick={() => chep(ma.code)}
                      title="Chép mã"
                      className="text-slate-400 hover:text-emerald-300 transition"
                    >
                      {daChep === ma.code
                        ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                        : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <span className={`px-1.5 py-0.5 rounded-md border text-[10px] font-bold ${mau.lop}`}>
                      {mau.chu}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {nhanPhamVi(ma.khoa)}
                    {ma.ghiChu ? ` · ${ma.ghiChu}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => batTat(ma)}
                    title={ma.active ? 'Tắt mã (giữ lại trong sổ)' : 'Bật lại mã'}
                    className={`p-1.5 rounded-lg border transition ${
                      ma.active
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                        : 'bg-slate-700/40 border-slate-600 text-slate-400 hover:bg-slate-600/40'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => xoa(ma)}
                    title="Xoá hẳn — người đã nhập mất quyền ngay"
                    className="p-1.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500/25 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <strong className={ma.daDung >= ma.soLuot ? 'text-amber-300' : 'text-slate-200'}>
                    {ma.daDung}/{ma.soLuot}
                  </strong> lượt
                </span>
                <span className="flex items-center gap-1">
                  <CalendarClock className="w-3 h-3" />
                  hết ngày <strong className="text-slate-200">
                    {ma.hanDung ? ma.hanDung.split('-').reverse().join('/') : '—'}
                  </strong>
                </span>
                {soNguoi > 0 && (
                  <button
                    onClick={() => setXemLuot(xemLuot === ma.code ? null : ma.code)}
                    className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-2"
                  >
                    {xemLuot === ma.code ? 'Ẩn danh sách' : `Xem ${soNguoi} người đã nhập`}
                  </button>
                )}
                {/* Lệch giữa bộ đếm máy chủ và sổ lượt nhập là dấu hiệu có người
                    xoá lượt bằng tay — nói ra chứ không giấu. */}
                {soNguoi !== ma.daDung && (
                  <span className="text-amber-400" title="Bộ đếm và sổ lượt nhập không khớp">
                    (sổ ghi {soNguoi})
                  </span>
                )}
              </div>

              {xemLuot === ma.code && (
                <div className="pt-2 border-t border-slate-700/80 space-y-1">
                  {luotNhap
                    .filter((l) => chuanHoaMa(l.ma) === ma.code)
                    .sort((a, b) => String(b.nhapLuc).localeCompare(String(a.nhapLuc)))
                    .map((l) => (
                      <div key={l.id} className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="text-slate-300 truncate">{l.email}</span>
                        <span className="text-slate-500 flex-shrink-0">
                          {l.nhapLuc ? new Date(l.nhapLuc).toLocaleDateString('vi-VN') : ''}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-slate-500 leading-relaxed">
        <strong className="text-slate-400">Tắt</strong> giữ mã lại trong sổ và bật lại được.
        <strong className="text-slate-400"> Xoá</strong> gỡ hẳn mã, người đã nhập mất quyền học ngay.
        Cả hai đều không xoá thông tin hay tiến độ của học viên.
      </p>
    </div>
  );
}
