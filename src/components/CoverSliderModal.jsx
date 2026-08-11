import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, ArrowUp, ArrowDown, Clock, Image as ImageIcon, Loader2, AlertTriangle } from 'lucide-react';
import {
  saveCoverBanner,
  saveCoverBannerOrder,
  deleteCoverBanner,
  saveCoverSliderConfig,
  normalizeCoverInterval,
  MAX_COVER_BANNERS,
  COVER_INTERVAL_MIN_MS,
  COVER_INTERVAL_MAX_MS
} from '../firebase';
import { prepareBannerFile, formatBytes, BANNER_ASPECT_W, BANNER_ASPECT_H } from '../utils/bannerImage';

/**
 * Hộp thoại quản trị ảnh bìa trang chủ — chỉ quản trị viên mở được.
 *
 * KHÔNG GIỮ BẢN NHÁP CỦA DANH SÁCH ẢNH.
 *
 * Hộp thoại này cố ý không có nút "Lưu tất cả". Mỗi thao tác — tải ảnh, xoá,
 * đổi thứ tự — ghi thẳng lên Firestore rồi để listener ở App.jsx đẩy danh sách
 * mới xuống qua props. Vì vậy thứ hiện trong hộp thoại LUÔN là thứ đang thật sự
 * chạy ngoài trang chủ.
 *
 * Lý do: nếu giữ bản nháp thì phải đồng bộ hai nguồn, và tình huống hỏng của nó
 * rất khó chịu — quản trị viên sửa, quên bấm Lưu, đóng hộp thoại, và ảnh bìa
 * vẫn y như cũ mà không có gì nói vì sao. Đổi lại là mỗi thao tác tốn một vòng
 * mạng, chấp nhận được với một việc làm vài tháng một lần.
 *
 * NGOẠI LỆ DUY NHẤT là ô thời gian đổi slide: nó là ô nhập số, gõ tới đâu ghi
 * tới đó là đẩy hàng chục lượt ghi lên máy chủ chỉ để gõ xong hai chữ số. Ô đó
 * có nút Lưu riêng, và trạng thái chưa lưu được nói rõ ngay cạnh.
 */
export default function CoverSliderModal({
  isOpen,
  onClose,
  /** Danh sách ảnh hiện hành, do App.jsx truyền xuống từ listener Firestore. */
  banners = [],
  intervalMs = 5000,
  /** Ảnh mặc định đóng sẵn trong mã — hiện khi chưa cấu hình ảnh nào. */
  fallbackSrc,
  fallbackAlt = ''
}) {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const fileInputRef = useRef(null);

  // Bản nháp của riêng ô thời gian, tính bằng GIÂY cho người dùng dễ hình dung.
  const [seconds, setSeconds] = useState(() => Math.round(intervalMs / 1000));
  const [savingInterval, setSavingInterval] = useState(false);

  // Đồng bộ lại ô thời gian khi máy chủ trả về giá trị khác — trường hợp một
  // quản trị viên khác vừa đổi, hoặc lần đầu đọc xong cấu hình.
  useEffect(() => {
    setSeconds(Math.round(intervalMs / 1000));
  }, [intervalMs]);

  // Dọn thông báo mỗi lần mở lại: thông báo của lần trước còn nằm đó sẽ bị đọc
  // nhầm thành kết quả của việc sắp làm.
  useEffect(() => {
    if (isOpen) {
      setError('');
      setNotice('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const minSeconds = Math.round(COVER_INTERVAL_MIN_MS / 1000);
  const maxSeconds = Math.round(COVER_INTERVAL_MAX_MS / 1000);
  const isFull = banners.length >= MAX_COVER_BANNERS;

  /**
   * Diễn giải lỗi Firestore thành câu người dùng làm được gì đó với nó.
   *
   * `permission-denied` gần như luôn có đúng một nguyên nhân trong dự án này:
   * bộ rules mới chưa được dán lên Firebase Console. Rules KHÔNG tự lên máy chủ
   * theo lệnh deploy (xem DEPLOYMENT.md), nên đây là lỗi mà người triển khai sẽ
   * gặp đúng một lần và cần được chỉ thẳng chỗ sửa.
   */
  const describeError = (e) => {
    const code = String(e?.code || '');
    if (code.includes('permission-denied')) {
      return 'Máy chủ từ chối ghi. Nhiều khả năng bộ Firestore Rules mới chưa được dán lên Firebase Console — xem mục "Ảnh bìa trang chủ" trong DEPLOYMENT.md.';
    }
    if (code.includes('unavailable') || code.includes('deadline')) {
      return 'Không kết nối được máy chủ. Kiểm tra lại đường truyền rồi thử lại.';
    }
    if (code.includes('invalid-argument') || code.includes('resource-exhausted')) {
      return 'Ảnh vẫn quá nặng so với hạn mức của máy chủ. Hãy xuất lại ảnh ở kích thước nhỏ hơn.';
    }
    return e?.message || 'Không lưu được. Vui lòng thử lại.';
  };

  const handlePickFile = async (e) => {
    const file = e.target.files?.[0];
    // Xoá giá trị ngay: không xoá thì chọn lại đúng tệp vừa lỗi sẽ không kích
    // hoạt onChange, và người dùng tưởng nút hỏng.
    e.target.value = '';
    if (!file) return;

    setError('');
    setNotice('');
    setBusy('Đang xử lý ảnh...');

    try {
      const prepared = await prepareBannerFile(file);

      setBusy('Đang tải ảnh lên máy chủ...');
      // Mã ảnh sinh từ mốc thời gian: mỗi lần tải là một tài liệu mới, không
      // ghi đè ảnh đang có. Quản trị viên muốn thay thì xoá ảnh cũ — hai bước,
      // để không ai mất ảnh chỉ vì bấm nhầm nút tải lên.
      const id = `banner_${Date.now()}`;
      const nextOrder = banners.length > 0
        ? Math.max(...banners.map((b) => b.order || 0)) + 1
        : 0;

      await saveCoverBanner({
        id,
        imageData: prepared.dataUrl,
        alt: '',
        order: nextOrder
      });

      setNotice(`Đã thêm ảnh bìa (${prepared.width}px, ${formatBytes(prepared.bytes)}).`);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy('');
    }
  };

  const handleDelete = async (banner) => {
    setError('');
    setNotice('');
    setBusy('Đang xoá ảnh...');
    try {
      await deleteCoverBanner(banner.id);
      setNotice('Đã xoá ảnh bìa.');
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy('');
    }
  };

  /**
   * Đưa một ảnh lên trước hoặc xuống sau một bậc.
   *
   * GHI LẠI `order` CHO CẢ DANH SÁCH, không chỉ hai ảnh vừa đổi chỗ. Ghi hai
   * ảnh thì đủ đúng chừng nào mọi `order` còn phân biệt được với nhau — nhưng
   * chỉ cần hai ảnh trùng số một lần là thứ tự hiện ra do cách sắp xếp phá hoà
   * quyết định, tức là ngẫu nhiên dưới mắt người dùng, và không có gì tự chữa
   * được nữa. Ghi lại cả danh sách theo đúng vị trí mới thì mỗi lần đổi thứ tự
   * cũng là một lần dọn dẹp: số luôn là 0, 1, 2 liền mạch.
   *
   * Nhiều nhất ba lệnh ghi, mỗi lệnh vài chục byte — chỉ gửi số thứ tự, không
   * gửi lại chuỗi ảnh.
   */
  const handleMove = async (fromIndex, direction) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= banners.length) return;

    const reordered = [...banners];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    setError('');
    setNotice('');
    setBusy('Đang đổi thứ tự...');
    try {
      await Promise.all(reordered.map((b, i) => saveCoverBannerOrder(b.id, i)));
      setNotice('Đã đổi thứ tự ảnh bìa.');
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy('');
    }
  };

  const handleSaveInterval = async () => {
    setError('');
    setNotice('');
    setSavingInterval(true);
    try {
      const ms = normalizeCoverInterval(Number(seconds) * 1000);
      await saveCoverSliderConfig(ms);
      // Hiện lại giá trị ĐÃ ĐƯỢC ÉP về vùng cho phép, không phải số vừa gõ:
      // gõ 99 mà lưu thành 30 thì phải nói ra, im lặng là để người dùng tin
      // rằng đã lưu 99.
      setSeconds(Math.round(ms / 1000));
      setNotice(`Đã lưu: đổi ảnh mỗi ${Math.round(ms / 1000)} giây.`);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setSavingInterval(false);
    }
  };

  const intervalDirty = Math.round(intervalMs / 1000) !== Number(seconds);
  const isWorking = Boolean(busy);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      {/* z-[60] cao hơn Bảng Quản Trị (z-50): hộp thoại này mở được từ trang
          chủ, nhưng cũng có thể mở khi Bảng Quản Trị đang bật.

          `dvh` để đáy hộp thoại không chui xuống dưới thanh địa chỉ trên điện
          thoại — cùng lý do như các hộp thoại khác. */}
      <div className="relative w-full max-w-3xl max-h-[94dvh] glass-panel rounded-3xl border border-amber-500/40 p-4 sm:p-6 shadow-2xl my-auto flex flex-col gap-4">

        <div className="flex items-start justify-between gap-3 pb-3 border-b border-emerald-900/50 shrink-0">
          <div className="min-w-0">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/40 uppercase tracking-wider">
              Quản trị · Ảnh bìa
            </span>
            <h2 className="text-sm sm:text-lg font-black text-white tracking-wide mt-1">
              ẢNH BÌA TRANG CHỦ
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Tối đa {MAX_COVER_BANNERS} ảnh, chạy lần lượt và lặp lại. Ảnh tự cắt về tỉ lệ {BANNER_ASPECT_W}:{BANNER_ASPECT_H}.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vùng thông báo. Lỗi và thành công dùng hai khối riêng, không dùng
            chung một khối đổi màu: đọc lướt thì màu dễ trôi qua mắt hơn là vị
            trí, và lỗi ở đây thường kèm hướng dẫn dài. */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-xs font-semibold shrink-0">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}
        {notice && !error && (
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-xs font-bold shrink-0">
            {notice}
          </div>
        )}

        <div className="overflow-y-auto overscroll-contain flex flex-col gap-4 pr-0.5">

          {/* Thời gian đổi slide */}
          <div className="p-3.5 rounded-2xl glass-panel border border-emerald-800/60 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Clock className="w-4 h-4 text-emerald-400" />
              Thời gian đổi ảnh
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <input
                type="number"
                inputMode="numeric"
                min={minSeconds}
                max={maxSeconds}
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                className="w-24 bg-slate-900/80 border border-emerald-900/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 transition tabular-nums"
              />
              <span className="text-xs text-slate-400 font-semibold">
                giây · cho phép {minSeconds}–{maxSeconds}
              </span>

              <button
                onClick={handleSaveInterval}
                disabled={savingInterval || !intervalDirty}
                className="ml-auto px-3.5 py-2 rounded-xl bg-emerald-600 hover:brightness-110 text-white text-xs font-black transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {savingInterval && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {intervalDirty ? 'Lưu thời gian' : 'Đã lưu'}
              </button>
            </div>

            {banners.length < 2 && (
              <p className="text-[11px] text-slate-500">
                Cần từ 2 ảnh trở lên thì băng ảnh mới chạy. Hiện có {banners.length} ảnh.
              </p>
            )}
          </div>

          {/* Danh sách ảnh */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                Danh sách ảnh ({banners.length}/{MAX_COVER_BANNERS})
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isFull || isWorking}
                title={isFull ? `Đã đủ ${MAX_COVER_BANNERS} ảnh. Xoá bớt một ảnh để thêm ảnh mới.` : 'Chọn ảnh từ máy'}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-black transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isWorking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>{busy || 'Thêm ảnh'}</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePickFile}
                className="hidden"
              />
            </div>

            {banners.length === 0 ? (
              /* Chưa có ảnh nào -> cho xem đúng thứ trang chủ đang hiện, chứ
                 không phải một ô trống ghi "chưa có dữ liệu". Quản trị viên cần
                 biết cái gì đang chạy trước khi quyết định thay nó. */
              <div className="p-3.5 rounded-2xl glass-panel border border-emerald-900/50 space-y-2">
                <p className="text-[11px] text-slate-400 font-semibold">
                  Chưa cấu hình ảnh nào. Trang chủ đang hiện ảnh bìa mặc định đóng sẵn trong ứng dụng:
                </p>
                <img
                  src={fallbackSrc}
                  alt={fallbackAlt}
                  className="w-full rounded-xl border border-emerald-900/40 object-cover"
                  style={{ aspectRatio: `${BANNER_ASPECT_W} / ${BANNER_ASPECT_H}` }}
                />
                <p className="text-[11px] text-slate-500">
                  Thêm ảnh đầu tiên là ảnh mặc định này ngừng hiện. Xoá hết ảnh thì nó quay lại.
                </p>
              </div>
            ) : (
              banners.map((banner, i) => (
                <div
                  key={banner.id}
                  className="p-2.5 rounded-2xl glass-panel border border-emerald-900/50 flex items-center gap-3"
                >
                  <span className="w-6 h-6 shrink-0 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 text-[11px] font-black flex items-center justify-center tabular-nums">
                    {i + 1}
                  </span>

                  <img
                    src={banner.imageData}
                    alt={banner.alt || `Ảnh bìa ${i + 1}`}
                    className="w-28 sm:w-44 shrink-0 rounded-lg border border-emerald-900/40 object-cover"
                    style={{ aspectRatio: `${BANNER_ASPECT_W} / ${BANNER_ASPECT_H}` }}
                  />

                  <div className="flex-1 min-w-0 text-[11px] text-slate-400">
                    <p className="font-semibold text-slate-300 truncate">
                      {i === 0 ? 'Ảnh hiện đầu tiên' : `Vị trí thứ ${i + 1}`}
                    </p>
                    {banner.updatedAt && (
                      <p className="truncate">
                        Cập nhật {new Date(banner.updatedAt).toLocaleString('vi-VN')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMove(i, -1)}
                      disabled={i === 0 || isWorking}
                      title="Đưa lên trước"
                      className="w-8 h-8 rounded-lg bg-slate-900 border border-emerald-900 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(i, 1)}
                      disabled={i === banners.length - 1 || isWorking}
                      title="Đưa xuống sau"
                      className="w-8 h-8 rounded-lg bg-slate-900 border border-emerald-900 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner)}
                      disabled={isWorking}
                      title="Xoá ảnh này"
                      className="w-8 h-8 rounded-lg bg-rose-900/70 border border-rose-600 text-rose-200 hover:bg-rose-800 flex items-center justify-center transition cursor-pointer disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Ảnh được cắt giữa về tỉ lệ {BANNER_ASPECT_W}:{BANNER_ASPECT_H} và nén lại trước khi lưu, nên phần trên và
            dưới của ảnh khổ dọc sẽ bị cắt bớt. Bản xem trước trong danh sách trên đây là ảnh
            sau khi cắt — đúng thứ học viên sẽ thấy.
          </p>
        </div>
      </div>
    </div>
  );
}
