import React, { useEffect, useState } from 'react';
import { Camera, Images } from 'lucide-react';
import { LESSON_PHOTOS } from '../data/lessonPhotos';

/**
 * Ảnh chụp thật cho từng bài học.
 *
 * Đây là lớp minh hoạ thứ ba, đứng cạnh LessonIllustration (tranh khái niệm vẽ
 * bằng SVG cho cả chuyên đề) và LessonVisual (sơ đồ số liệu của từng bài). Hai
 * lớp kia không phát sinh yêu cầu mạng nên luôn hiển thị được; lớp này nạp ảnh
 * từ máy chủ Wikimedia nên phải tự ẩn khi hỏng thay vì để lại khung vỡ.
 *
 * Ảnh đặt trước sơ đồ số liệu trong LessonViewer: người học nhìn bối cảnh thật
 * trước rồi mới tới phần trừu tượng hoá bằng biểu đồ.
 *
 * Một bài có thể khai báo MỘT ảnh (dạng object) hoặc MỘT CHÙM ảnh (dạng
 * { gallery, photos: [] }). Chùm ảnh sinh ra cho những khái niệm chỉ nhìn một
 * tấm là không đủ — POSM là ví dụ rõ nhất: standee, wobbler, kệ dump bin và
 * thẻ giá là bốn thứ khác hẳn nhau nhưng cùng nằm dưới một chữ viết tắt.
 */
export default function LessonPhoto({ sectionId }) {
  const entry = LESSON_PHOTOS[sectionId];
  // Ảnh nào hỏng thì ẩn riêng ảnh đó, không kéo cả chùm đi theo.
  const [failedIndexes, setFailedIndexes] = useState([]);

  // Đổi bài thì phải cho ảnh cơ hội tải lại. Nếu không, một bài lỗi ảnh sẽ kéo
  // theo mọi bài sau đó dùng lại component này đều bị ẩn oan.
  useEffect(() => {
    setFailedIndexes([]);
  }, [sectionId]);

  if (!entry) return null;

  const isGallery = Array.isArray(entry.photos);
  const photos = isGallery ? entry.photos : [entry];
  const visible = photos.filter((_, i) => !failedIndexes.includes(i));

  if (visible.length === 0) return null;

  const markFailed = (index) =>
    setFailedIndexes((prev) => (prev.includes(index) ? prev : [...prev, index]));

  /* ============ MỘT ẢNH ============ */
  if (!isGallery) {
    const photo = photos[0];
    return (
      <figure className="my-5 rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#101a2e] shadow-xl">
        <img
          src={photo.url}
          alt={photo.caption}
          className="w-full h-48 sm:h-64 object-cover block"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => markFailed(0)}
        />
        <figcaption className="px-4 py-3 border-t border-emerald-900/50 bg-[#0a1120] space-y-1.5">
          <div className="flex items-start gap-2">
            <Camera className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed flex-1">
              {photo.caption}
            </p>
          </div>
          {/* Ghi công để dạng chữ thường, KHÔNG bọc thẻ liên kết.
              Giấy phép Creative Commons bắt buộc phải ghi công nên dòng này không
              được bỏ, nhưng biến nó thành liên kết thì học viên bấm nhầm là rời
              hẳn khỏi bài học sang Wikimedia. Đường dẫn gốc vẫn lưu ở trường
              source trong lessonPhotos.js để tra khi cần đối chiếu bản quyền. */}
          <p className="text-[10px] text-slate-500 pl-5">Ảnh: {photo.credit}</p>
        </figcaption>
      </figure>
    );
  }

  /* ============ CHÙM ẢNH ============ */
  return (
    <section className="my-5 rounded-2xl border border-emerald-500/30 bg-[#101a2e] shadow-xl overflow-hidden">
      <header className="px-4 py-3 border-b border-emerald-900/50 bg-[#0a1120] flex items-start gap-2">
        <Images className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs sm:text-sm font-bold text-emerald-300 leading-snug">
            {entry.gallery}
          </h4>
          {entry.note && (
            <p className="text-[11px] text-slate-400 leading-relaxed">{entry.note}</p>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-emerald-900/40">
        {photos.map((photo, index) =>
          failedIndexes.includes(index) ? null : (
            <figure key={photo.url} className="bg-[#101a2e] flex flex-col">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-40 sm:h-44 object-cover block"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => markFailed(index)}
              />
              <figcaption className="px-3.5 py-3 space-y-1 flex-1">
                {photo.label && (
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {photo.label}
                  </span>
                )}
                <p className="text-[11px] text-slate-300 leading-relaxed">{photo.caption}</p>
                <p className="text-[10px] text-slate-500">Ảnh: {photo.credit}</p>
              </figcaption>
            </figure>
          )
        )}
      </div>
    </section>
  );
}
