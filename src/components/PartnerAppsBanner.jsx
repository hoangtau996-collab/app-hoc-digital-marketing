import React from 'react';
import { Sparkles, ScrollText, ListChecks, ArrowUpRight } from 'lucide-react';

/**
 * Dải banner giới thiệu các ứng dụng khác, đặt ở chân trang.
 *
 * Đặt ở footer chứ không đặt trên đầu trang là có chủ ý: đây là nội dung mời
 * thêm, không phải việc học viên vào đây để làm. Ai đã cuộn tới cuối trang chủ
 * thì hoặc đang tìm thêm thứ gì đó, hoặc đã xong việc — đúng lúc để mời, mà
 * không cắt ngang đường vào bài học.
 *
 * MỌI LIÊN KẾT ĐỀU MỞ TAB MỚI. Học viên có thể đang dở một bài, tiến độ chỉ ghi
 * lại theo từng mốc; điều hướng cả cửa sổ sang tên miền khác là đá họ ra khỏi
 * lớp học. `rel="noopener noreferrer"` đi kèm bắt buộc: thiếu `noopener`, trang
 * mở ra nắm được `window.opener` và có thể tự ý đổi địa chỉ tab khoá học.
 *
 * ẢNH LÀ BẢN SAO ĐỂ TRONG public/apps/, KHÔNG hotlink thẳng og:image của ba
 * trang kia. Ba ảnh gốc cộng lại 1,4 MB (615 + 148 + 643 KB) — nhét nguyên vào
 * chân trang là bắt học viên dùng 4G tải thêm chừng ấy chỉ để xem quảng cáo.
 * Bản trong repo đã thu về 760px ngang, JPEG q82, còn tổng khoảng 190 KB.
 * Đổi lại: ba trang kia thay ảnh bìa thì bản sao ở đây không tự cập nhật, phải
 * tải lại thủ công.
 */

const PARTNER_APPS = [
  {
    id: 'healing',
    name: 'P Healing — Tarot Online',
    desc: 'Xem Tarot online, nhận thông điệp chữa lành cho 5 khía cạnh cuộc sống.',
    domain: 'healing.pmarcom.com',
    href: 'https://healing.pmarcom.com/',
    img: '/apps/healing.jpg',
    icon: Sparkles,
    // Gradient viết bằng thang màu KHÔNG nằm trong danh sách bị nền sáng ghi
    // đè ở index.css (chỉ các mốc 900/950 của emerald, teal, slate, amber bị
    // đổi). Nhờ vậy ô biểu tượng giữ nguyên màu ở cả hai giao diện.
    tile: 'from-fuchsia-500 to-purple-600'
  },
  {
    id: 'xinxam',
    name: 'Xin Xăm — Luận Quẻ',
    desc: 'Gieo keo âm dương, lắc ống xăm và luận giải quẻ theo lối truyền thống.',
    domain: 'xinxam.pmarcom.com',
    href: 'https://xinxam.pmarcom.com/',
    img: '/apps/xinxam.jpg',
    icon: ScrollText,
    tile: 'from-orange-500 to-red-600'
  },
  {
    id: 'tracking',
    name: 'Capy Track — Tracking Công Việc',
    desc: 'Giao việc, đồng bộ đám mây và nhắc hạn chót cho cả nhóm.',
    domain: 'trackingtask.lethanhphong.vn',
    href: 'https://trackingtask.lethanhphong.vn/',
    img: '/apps/capytrack.jpg',
    icon: ListChecks,
    tile: 'from-sky-500 to-indigo-600'
  }
];

export default function PartnerAppsBanner() {
  return (
    <div className="max-w-5xl mx-auto mb-6 text-left">

      {/* Nhãn phân đoạn: gạch ngang hai bên để tách hẳn khối giới thiệu khỏi
          dòng bản quyền, tránh học viên hiểu nhầm đây là mục của khoá học. */}
      <div className="flex items-center gap-3 mb-3">
        <span className="h-px flex-1 bg-emerald-900/50" />
        <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-emerald-400 uppercase">
          Ứng dụng khác
        </span>
        <span className="h-px flex-1 bg-emerald-900/50" />
      </div>

      {/*
        ĐIỆN THOẠI VUỐT NGANG, MÁY TÍNH XẾP BA CỘT.

        Ba ảnh bìa 16:9 xếp dọc trên màn 360px là gần 800px chiều cao — chân
        trang dài hơn cả phần nội dung nó đứng dưới. Chuyển sang băng cuộn ngang
        có điểm dừng: mỗi thẻ rộng 78% màn hình nên luôn hở một mẩu thẻ kế bên,
        đó là thứ báo cho ngón tay biết còn thứ để vuốt mà không cần chấm tròn
        hay mũi tên. Từ 640px trở lên đủ chỗ cho ba cột nên tắt cuộn đi.

        `-mx-3 px-3` để thẻ đầu và thẻ cuối vẫn chạm được mép màn hình khi cuộn,
        thay vì bị lề của chân trang cắt cụt.
      */}
      <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 pb-1">
        {PARTNER_APPS.map((app) => {
          const Icon = app.icon;

          return (
            <a
              key={app.id}
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Mở ${app.name} trong tab mới`}
              /* Phản hồi khi di chuột dùng `ring` chứ không dùng `border`:
                 giao diện sáng ghi đè màu viền của mọi thẻ `bg-[#...]` bằng
                 !important, nên đổi màu viền khi hover sẽ không thấy gì. */
              className="group snap-center shrink-0 w-[78%] sm:w-auto flex flex-col rounded-2xl overflow-hidden bg-[#101a2f] border border-emerald-900/40 shadow-lg transition hover:-translate-y-0.5 hover:ring-2 hover:ring-emerald-400/50 cursor-pointer"
            >
              {/* Ảnh bìa SEO của chính trang đó.

                  Khung ép 16:9 cho cả ba: ảnh của P Healing là ảnh vuông, hai
                  ảnh còn lại là 1200x630 và 1200x669. Cùng một tỉ lệ thì ba thẻ
                  mới thẳng hàng; `object-center` giữ phần chữ ở giữa ảnh, chỗ bị
                  xén chỉ là nền.

                  `loading="lazy"` là bắt buộc chứ không phải làm cho đẹp: khối
                  này nằm cuối trang, không tải cho tới khi học viên cuộn xuống
                  thật. Kèm width/height để trình duyệt chừa sẵn chỗ, tránh giật
                  bố cục lúc ảnh về. */}
              <span className="block relative w-full aspect-video overflow-hidden bg-[#0d1526]">
                <img
                  src={app.img}
                  alt={`Ảnh bìa ứng dụng ${app.name}`}
                  width="760"
                  height="428"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition duration-500 group-hover:scale-[1.04]"
                />
              </span>

              <span className="flex items-start gap-2.5 p-3">
                <span
                  className={`shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${app.tile} flex items-center justify-center shadow-md`}
                >
                  {/* `text-slate-50` chứ không phải `text-white`: nền sáng đổi
                      .text-white thành xanh đen, biểu tượng sẽ chìm vào ô màu. */}
                  <Icon className="w-4.5 h-4.5 text-slate-50" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-black text-slate-100 leading-snug">
                    {app.name}
                  </span>
                  <span className="block text-[11px] text-slate-400 leading-snug mt-1 line-clamp-2">
                    {app.desc}
                  </span>
                  <span className="flex items-center gap-1 mt-1.5 text-[10px] font-bold text-emerald-400">
                    <span className="truncate">{app.domain}</span>
                    <ArrowUpRight className="shrink-0 w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition" />
                  </span>
                </span>
              </span>
            </a>
          );
        })}
      </div>

      <p className="sm:hidden text-center text-[10px] text-slate-500 mt-2">
        Vuốt ngang để xem thêm ứng dụng
      </p>
    </div>
  );
}
