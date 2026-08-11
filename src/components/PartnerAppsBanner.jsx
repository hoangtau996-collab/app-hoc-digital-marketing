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
 */

const PARTNER_APPS = [
  {
    id: 'healing',
    name: 'P Healing — Tarot Online',
    desc: 'Trải bài Tarot trực tuyến, luận giải theo từng câu hỏi.',
    domain: 'healing.pmarcom.com',
    href: 'https://healing.pmarcom.com/',
    icon: Sparkles,
    // Gradient viết bằng thang màu KHÔNG nằm trong danh sách bị nền sáng ghi
    // đè ở index.css (chỉ các mốc 900/950 của emerald, teal, slate, amber bị
    // đổi). Nhờ vậy ô biểu tượng giữ nguyên màu ở cả hai giao diện.
    tile: 'from-fuchsia-500 to-purple-600'
  },
  {
    id: 'xinxam',
    name: 'Xin Xăm — Gieo Quẻ',
    desc: 'Xin xăm, gieo quẻ trực tuyến theo nghi thức truyền thống.',
    domain: 'xinxam.pmarcom.com',
    href: 'https://xinxam.pmarcom.com/',
    icon: ScrollText,
    tile: 'from-orange-500 to-red-600'
  },
  {
    id: 'tracking',
    name: 'Tracking Công Việc',
    desc: 'Giao việc, theo dõi tiến độ và nhắc hạn cho cả nhóm.',
    domain: 'trackingtask.lethanhphong.vn',
    href: 'https://trackingtask.lethanhphong.vn/',
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              className="group flex items-center gap-3 p-3 rounded-2xl bg-[#101a2f] border border-emerald-900/40 shadow-lg transition hover:-translate-y-0.5 hover:shadow-emerald-900/30 hover:ring-2 hover:ring-emerald-400/50 cursor-pointer"
            >
              <span
                className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${app.tile} flex items-center justify-center shadow-md`}
              >
                {/* `text-slate-50` chứ không phải `text-white`: nền sáng đổi
                    .text-white thành xanh đen, biểu tượng sẽ chìm vào ô màu. */}
                <Icon className="w-5 h-5 text-slate-50" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-xs sm:text-[13px] font-black text-slate-100 leading-snug">
                  {app.name}
                </span>
                <span className="block text-[11px] text-slate-400 leading-snug mt-0.5">
                  {app.desc}
                </span>
                <span className="block text-[10px] text-slate-500 mt-1 truncate">
                  {app.domain}
                </span>
              </span>

              <ArrowUpRight className="shrink-0 w-4 h-4 text-emerald-400 opacity-70 group-hover:opacity-100 transition" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
