import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
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
 */
export default function LessonPhoto({ sectionId }) {
  const photo = LESSON_PHOTOS[sectionId];
  const [failed, setFailed] = useState(false);

  // Đổi bài thì phải cho ảnh cơ hội tải lại. Nếu không, một bài lỗi ảnh sẽ kéo
  // theo mọi bài sau đó dùng lại component này đều bị ẩn oan.
  useEffect(() => {
    setFailed(false);
  }, [sectionId]);

  if (!photo || failed) return null;

  return (
    <figure className="my-5 rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#101a2e] shadow-xl">
      <img
        src={photo.url}
        alt={photo.caption}
        className="w-full h-48 sm:h-64 object-cover block"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
      <figcaption className="px-4 py-3 border-t border-emerald-900/50 bg-[#0a1120] space-y-1.5">
        <div className="flex items-start gap-2">
          <Camera className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed flex-1">
            {photo.caption}
          </p>
        </div>
        <p className="text-[10px] text-slate-500 pl-5">
          {photo.source ? (
            <a
              href={photo.source}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-emerald-400 underline decoration-dotted underline-offset-2"
            >
              Ảnh: {photo.credit}
            </a>
          ) : (
            <>Ảnh: {photo.credit}</>
          )}
        </p>
      </figcaption>
    </figure>
  );
}
