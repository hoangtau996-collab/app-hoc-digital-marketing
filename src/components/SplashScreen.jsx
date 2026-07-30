import React, { useEffect, useRef, useState } from 'react';

/** Thời gian hiển thị, tính bằng mili-giây. Chủ dự án chốt 3 giây (2026-07-30). */
const SPLASH_MS = 3000;

/**
 * Màn hình chào khi mở web.
 *
 * ĐIỂM QUAN TRỌNG NHẤT: màn hình này KHÔNG chặn ứng dụng khởi động. Nó nằm đè
 * lên trên, còn `<App />` vẫn được dựng và chạy bên dưới ngay từ giây đầu — nạp
 * hồ sơ học viên, đọc tiến độ từ Firestore, dựng danh sách chuyên đề. Nhờ vậy 3
 * giây này là thời gian tải thật chứ không phải 3 giây chết thêm vào: lúc màn
 * hình biến mất thì bên dưới đã sẵn sàng.
 *
 * Làm ngược lại — chờ xong mới dựng App — là cộng thẳng 3 giây vào thời gian
 * chờ của mọi học viên, mỗi lần mở.
 *
 * CÓ NÚT BỎ QUA, và đó không phải chi tiết trang trí. Học viên vào học mỗi ngày
 * sẽ gặp màn hình này mỗi lần; không có đường thoát thì thứ định làm cho sinh
 * động lại thành thứ gây khó chịu nhất.
 */
export default function SplashScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const doneRef = useRef(false);

  // Chặn gọi `onDone` hai lần. Cần thiết vì hết giờ và bấm "Bỏ qua" có thể xảy
  // ra gần như cùng lúc, và <StrictMode> còn cố tình chạy effect hai lần khi dev.
  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setLeaving(true);
    // Chờ hiệu ứng mờ dần chạy xong rồi mới gỡ khỏi cây giao diện.
    setTimeout(onDone, 380);
  };

  useEffect(() => {
    const start = performance.now();
    let raf;

    // Đo bằng đồng hồ thật (`performance.now`) thay vì cộng dồn từng khung hình:
    // máy yếu hoặc tab chạy nền sẽ rớt khung, cộng dồn thì thanh tiến trình bò
    // chậm hơn nhiều so với 3 giây và người dùng thấy nó "đứng".
    const tick = (now) => {
      const ratio = Math.min((now - start) / SPLASH_MS, 1);
      setProgress(ratio);
      if (ratio >= 1) finish();
      else raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    // Bấm phím bất kỳ cũng bỏ qua — người dùng máy tính thường bấm Esc hoặc
    // Space theo phản xạ khi gặp màn hình chờ.
    const onKey = () => finish();
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={finish}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer transition-opacity duration-[380ms] ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'linear-gradient(160deg,#0b1f5c 0%,#123a9e 45%,#1d4fd8 100%)' }}
    >
      {/* Poster giữ nguyên tỉ lệ bằng `object-contain`, không cắt xén.
          Ảnh là khổ dọc, còn màn hình máy tính là khổ ngang — dùng `object-cover`
          sẽ cắt mất phần đầu và phần chân poster, đúng hai chỗ đặt logo và khẩu
          hiệu. Phần trống hai bên lấp bằng nền chuyển sắc cùng tông với ảnh nên
          nhìn ra là có chủ đích. */}
      {/* Nếu thiếu tệp poster thì hiện chữ, KHÔNG để biểu tượng ảnh vỡ.
          Không phải phòng xa vô cớ: `public/splash.png` là tệp nhị phân nằm
          ngoài mã nguồn, nên nó có thể chưa kịp lên máy chủ trong khi mã đã
          deploy. Ảnh vỡ ngay màn hình đầu tiên, mỗi lần mở web, là thứ trông
          giống hệt "trang này hỏng rồi". */}
      {posterFailed ? (
        <div className="text-center px-6 select-none">
          <div className="text-white text-sm font-bold tracking-[0.3em] mb-2">CHÀO MỪNG ĐẾN VỚI</div>
          <div className="text-white text-4xl sm:text-5xl font-black tracking-tight">P MARCOM</div>
          <div className="text-pink-300 text-4xl sm:text-5xl font-black tracking-tight mb-3">ACADEMY</div>
          <div className="text-white/80 text-[11px] sm:text-xs font-semibold tracking-wide">
            KẾT NỐI TRI THỨC — NÂNG TẦM TƯ DUY — BỨT PHÁ TƯƠNG LAI
          </div>
        </div>
      ) : (
        <img
          src="/splash.jpg"
          alt="Chào mừng đến với P MARCOM ACADEMY — Kết nối tri thức, nâng tầm tư duy, bứt phá tương lai"
          className="max-h-[82vh] max-w-[92vw] w-auto h-auto object-contain drop-shadow-2xl select-none"
          draggable="false"
          onError={() => setPosterFailed(true)}
        />
      )}

      <div className="w-[min(320px,80vw)] mt-6 space-y-3">
        <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-300 to-pink-400 rounded-full"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); finish(); }}
          className="mx-auto block px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white/90 text-[11px] font-bold tracking-wide transition cursor-pointer"
        >
          Bỏ qua &rarr;
        </button>
      </div>
    </div>
  );
}
