import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertTriangle, ShieldCheck, User } from 'lucide-react';
import { SUPPORT_MESSAGE_MAX } from '../firebase';

/**
 * Một cuộc trao đổi hỗ trợ, hiển thị y hệt nhau cho cả hai phía.
 *
 * Dùng chung cho khung chat Pipi (phía học viên) và Hộp Thư Hỗ Trợ (phía Ban
 * Quản Trị). Dựng hai bản riêng thì hai bên sẽ trôi khỏi nhau — mà đây đúng là
 * chỗ không được phép lệch: cả hai phải nhìn thấy cùng một nội dung, cùng một
 * thứ tự, thì mới nói chuyện được với nhau.
 *
 * `me` quyết định lượt nào nằm bên phải và nhãn nào hiện ra, KHÔNG quyết định
 * quyền: máy chủ mới là bên xét ai được gửi với danh nghĩa gì (firestore.rules,
 * khối `replies`).
 *
 * `replies === null` nghĩa là CHƯA đọc được, khác `[]` là đọc được và chưa ai
 * trả lời. Gộp hai cái sẽ thành "chưa có phản hồi" đúng lúc đường truyền hỏng.
 */
export default function SupportThread({
  thread,
  replies,
  me = 'student',
  onSend,
  compact = false
}) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  const list = Array.isArray(replies) ? replies : [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [replies]);

  const submit = async (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || isSending) return;
    setIsSending(true);
    setError('');
    const result = await onSend(body);
    setIsSending(false);
    if (result && result.ok === false) {
      // Giữ nguyên nội dung đã gõ khi gửi hỏng — xoá đi là bắt người ta viết
      // lại từ đầu đúng lúc họ đang cần được giúp.
      setError(result.message || 'Không gửi được.');
      return;
    }
    setText('');
  };

  const timeOf = (iso) => {
    try {
      const d = new Date(iso);
      return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('vi-VN', { hour12: false });
    } catch (e) {
      return '';
    }
  };

  /** Một bong bóng hội thoại. `side` = 'right' khi là lời của chính mình. */
  const Bubble = ({ from, author, body, at }) => {
    const isAdmin = from === 'admin';
    const mine = from === me;
    return (
      <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[85%] space-y-1 ${mine ? 'items-end' : 'items-start'} flex flex-col`}>
          <div className={`flex items-center gap-1.5 text-[10px] font-bold ${
            isAdmin ? 'text-amber-300' : 'text-emerald-300'
          }`}>
            {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
            <span>{isAdmin ? 'Ban Quản Trị Học Viện' : (author || 'Học viên')}</span>
          </div>
          <div className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap break-words border ${
            isAdmin
              ? 'bg-amber-950/40 border-amber-700/50 text-amber-50 rounded-tl-sm'
              : mine
                ? 'bg-emerald-600 border-emerald-500 text-white rounded-br-sm'
                : 'bg-[#111a2e] border-emerald-900/60 text-slate-200 rounded-tl-sm'
          }`}>
            {body}
          </div>
          <span className="text-[9.5px] text-slate-500">{timeOf(at)}</span>
        </div>
      </div>
    );
  };

  return (
    // `flex-1 min-h-0` chứ không phải `h-full`: cả hai nơi dùng thành phần này
    // đều là khung flex dọc có sẵn một thanh đầu bên trên. `h-full` là 100%
    // chiều cao khung cha, cộng thêm thanh đầu là tràn ra ngoài — ô soạn trả
    // lời bị đẩy khỏi tầm nhìn. `min-h-0` để phần hội thoại co lại và tự cuộn
    // thay vì đẩy phần bên dưới đi.
    <div className="flex-1 min-h-0 flex flex-col">

      <div className={`flex-1 overflow-y-auto space-y-3 ${compact ? 'px-3 py-2' : 'px-1 py-2'}`}>

        {/* Lời nhắn mở đầu. Luôn là của học viên và luôn đứng trước — nó là câu
            hỏi mà cả cuộc trao đổi xoay quanh. */}
        <Bubble
          from="student"
          author={thread?.name}
          body={thread?.message}
          at={thread?.createdAt}
        />

        {replies === null ? (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-950/50 border border-amber-600/50 text-amber-200 text-[11px] leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>
              Chưa đọc được phần trao đổi. Có thể do mất mạng hoặc hệ thống chưa mở kênh trao đổi hai chiều —
              đây <strong>không</strong> có nghĩa là chưa ai trả lời.
            </span>
          </div>
        ) : (
          list.map((r) => (
            <Bubble
              key={r.id}
              from={r.from}
              author={r.authorName}
              body={r.text}
              at={r.createdAt}
            />
          ))
        )}

        {replies !== null && list.length === 0 && me === 'student' && (
          <p className="text-[11px] text-slate-500 text-center py-2 leading-relaxed">
            Ban Quản Trị chưa trả lời. Bạn sẽ thấy phản hồi ngay tại đây,
            và nút Pipi sẽ hiện chấm đỏ khi có tin mới.
          </p>
        )}

        <div ref={endRef} />
      </div>

      {error && (
        <p className="px-3 pb-1.5 text-[10.5px] text-rose-300 font-semibold leading-snug shrink-0">{error}</p>
      )}

      {/* Ô soạn trả lời */}
      <form onSubmit={submit} className={`shrink-0 border-t border-emerald-900/50 ${compact ? 'px-3 py-2.5' : 'px-1 pt-3'} space-y-2`}>
        <textarea
          rows={compact ? 2 : 3}
          value={text}
          maxLength={SUPPORT_MESSAGE_MAX}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // Enter gửi, Shift+Enter xuống dòng — thói quen của mọi khung chat.
            if (e.key === 'Enter' && !e.shiftKey) submit(e);
          }}
          placeholder={me === 'admin' ? 'Trả lời học viên...' : 'Nhắn tiếp cho Ban Quản Trị...'}
          className="w-full bg-[#0e1526] border border-emerald-900/60 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition resize-none"
        />
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 tabular-nums">
            {text.trim().length}/{SUPPORT_MESSAGE_MAX}
          </span>
          <button
            type="submit"
            disabled={!text.trim() || isSending}
            className="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[11px] flex items-center gap-1.5 hover:brightness-110 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Đang gửi...' : 'Gửi'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
