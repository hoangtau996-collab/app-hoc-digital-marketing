import React, { useState, useEffect, useRef } from 'react';
import { ImagePlus } from 'lucide-react';

/**
 * Ảnh bìa trang chủ — một ảnh tĩnh, hoặc băng ảnh chạy tự động khi quản trị
 * viên đã cấu hình nhiều hơn một ảnh.
 *
 * BA THỨ KHÔNG ĐƯỢC ĐỔI Ở ĐÂY MÀ KHÔNG ĐỔI CHỖ KHÁC
 *
 *   1. Tỉ lệ khung nằm ở `.app-cover` trong index.css và ở `BANNER_ASPECT_*`
 *      trong utils/bannerImage.js. Ba nơi phải khớp, lệch một nơi là ảnh tải
 *      lên bị cắt khác với bản xem trước lúc tải.
 *   2. `fetchPriority="high"` cho ảnh ĐẦU TIÊN: nó nằm ngay đầu trang, người
 *      dùng thấy trước cả khi cuộn. Các ảnh sau để mặc định, chúng còn cả một
 *      nhịp đổi slide mới cần tới.
 *   3. Chiều cao do khung quyết định, không để ảnh tự quyết. Ảnh bìa là thứ
 *      trang trí; nó không được chiếm chỗ của bài học.
 */
export default function CoverSlider({
  /** Danh sách ảnh từ Cloud. Rỗng thì rơi về ảnh mặc định đóng sẵn trong mã. */
  banners = [],
  intervalMs = 5000,
  /** Ảnh mặc định, dùng khi chưa cấu hình gì hoặc chưa đọc được Cloud. */
  fallbackSrc,
  fallbackAlt = '',
  /** Chỉ quản trị viên mới nhận `true` — nút sửa ảnh bìa. */
  canEdit = false,
  onEdit
}) {
  /* Danh sách thật sự đem hiển thị.

     Rơi về ảnh mặc định khi chưa có ảnh nào trên Cloud, HOẶC khi chưa đọc được
     Cloud (mất mạng, rules chưa dán). Không có bước này thì mọi trục trặc phía
     máy chủ đều biến trang chủ thành một khoảng trống cao 300px — trông như
     trang hỏng, trong khi thứ hỏng chỉ là phần trang trí. */
  const slides = banners.length > 0
    ? banners
    : [{ id: '__default__', imageData: fallbackSrc, alt: fallbackAlt }];

  const [index, setIndex] = useState(0);

  /* Mốc để hẹn lại giờ đổi slide.

     Người dùng vừa tự chọn ảnh thì đồng hồ phải chạy lại từ đầu, nếu không ảnh
     họ vừa chọn có thể trôi đi sau nửa giây — đúng khoảnh khắc còn sót lại của
     nhịp đang chạy dở. Đổi số này là ép effect bên dưới dựng một đồng hồ mới. */
  const [timerEpoch, setTimerEpoch] = useState(0);

  // Danh sách ngắn đi (quản trị viên vừa xoá một ảnh) thì chỉ số đang đứng có
  // thể trỏ ra ngoài mảng. Kéo về ảnh đầu thay vì để hiện ra khoảng trắng.
  useEffect(() => {
    setIndex((i) => (i < slides.length ? i : 0));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;

    // Tôn trọng người dùng đã tắt hiệu ứng chuyển động trong hệ điều hành. Với
    // họ, băng ảnh tự chạy không chỉ khó chịu mà còn có thể gây chóng mặt —
    // đứng yên ở ảnh đầu là hành vi đúng, không phải thiếu tính năng.
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      intervalMs
    );
    return () => clearInterval(timer);
  }, [slides.length, intervalMs, timerEpoch]);

  const goTo = (next) => {
    setIndex((next + slides.length) % slides.length);
    setTimerEpoch((n) => n + 1);
  };

  /* Vuốt ngang để đổi ảnh.

     Chỉ dùng `touchstart`/`touchend`, KHÔNG chặn `touchmove`: chặn là cướp luôn
     thao tác cuộn dọc của trang, mà ảnh bìa nằm ngay đầu trang nên đó đúng là
     chỗ người dùng vuốt lên để đọc tiếp.

     Ngưỡng 45px và điều kiện "ngang phải dài hơn dọc" để cú vuốt cuộn trang hơi
     chéo không bị hiểu nhầm thành lệnh đổi ảnh. */
  const touchStart = useRef(null);

  const handleTouchStart = (e) => {
    const t = e.changedTouches?.[0];
    touchStart.current = t ? { x: t.clientX, y: t.clientY } : null;
  };

  const handleTouchEnd = (e) => {
    const start = touchStart.current;
    const t = e.changedTouches?.[0];
    touchStart.current = null;
    if (!start || !t || slides.length < 2) return;

    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(dy)) return;

    goTo(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4">
      <div
        className="app-cover relative w-full overflow-hidden rounded-2xl border border-emerald-900/40 shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Các ảnh xếp chồng, hiện bằng cách mờ dần vào nhau.

            Xếp chồng chứ không dịch ngang: mọi ảnh đều đã nằm sẵn trong bộ nhớ
            (chúng là chuỗi base64 tải về cùng lúc), nên không có gì để tiết
            kiệm bằng cách chỉ dựng ảnh đang xem. Đổi lại, mờ dần không cần biết
            bề ngang khung là bao nhiêu nên không vỡ khi xoay ngang máy. */}
        {slides.map((slide, i) => (
          <img
            key={slide.id}
            src={slide.imageData}
            alt={slide.alt || fallbackAlt}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            aria-hidden={i !== index}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Chấm tròn chọn ảnh. Chỉ dựng khi có từ hai ảnh trở lên — một chấm
            đơn độc không nói lên điều gì ngoài việc chiếm chỗ. */}
        {slides.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-950/45 backdrop-blur-sm">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => goTo(i)}
                aria-label={`Xem ảnh bìa ${i + 1} trên ${slides.length}`}
                aria-current={i === index}
                /* Nút thật rộng 20px cho ngón tay chạm, nhưng chấm nhìn thấy
                   chỉ 6px — vùng chạm lớn hơn phần nhìn thấy là chủ đích. */
                className="w-5 h-5 flex items-center justify-center cursor-pointer"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all ${
                    i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/80'
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        {/* Nút sửa ảnh bìa — chỉ quản trị viên.

            Đặt ngay trên ảnh chứ không giấu trong Bảng Quản Trị: đây là thứ
            người ta nghĩ tới đúng lúc đang nhìn nó. Bảng Quản Trị là nơi làm
            việc với học viên, ảnh bìa lạc vào đó thì phải nhớ mới tìm ra. */}
        {canEdit && onEdit && (
          <button
            onClick={onEdit}
            title="Đổi ảnh bìa trang chủ"
            className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/70 hover:bg-slate-950/90 backdrop-blur-sm border border-amber-500/50 text-amber-300 text-[11px] font-black transition cursor-pointer shadow-lg"
          >
            <ImagePlus className="w-4 h-4" />
            <span className="hidden sm:inline">Đổi Ảnh Bìa</span>
          </button>
        )}
      </div>
    </div>
  );
}
