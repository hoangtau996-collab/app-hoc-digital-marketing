import React, { useState, useEffect } from 'react';
import PMarcomLogo from './PMarcomLogo';
import SupportThread from './SupportThread';
import { listenToSupportReplies, sendSupportReply } from '../firebase';
import {
  X,
  Mail,
  Phone,
  Inbox,
  CheckCheck,
  Trash2,
  AlertTriangle,
  MailOpen,
  RotateCcw,
  Clock,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

/**
 * Hộp Thư Hỗ Trợ — nơi Ban Quản Trị đọc lời nhắn học viên gửi từ khung chat Pipi.
 *
 * Thành phần này KHÔNG tự đọc Firestore. Dữ liệu do App.jsx truyền vào, vì bộ
 * đếm chưa đọc trên Header cũng cần đúng danh sách đó — mở hai kênh theo dõi cho
 * cùng một collection thì hai nơi sẽ lệch nhau đúng vào lúc có tin mới, và tin
 * mới là lúc duy nhất con số này có việc để làm.
 *
 * `messages === null` nghĩa là CHƯA ĐỌC ĐƯỢC (mất mạng, thiếu quyền, chưa deploy
 * rules), khác hẳn `[]` là đọc được và hộp thư đang rỗng. Hai trạng thái này
 * hiện ra hai màn khác nhau — gộp lại thì lúc hỏng, giao diện sẽ báo "không có
 * lời nhắn nào" trong khi có học viên đang chờ trả lời.
 */

const STATUS_META = {
  new: { label: 'Chưa đọc', cls: 'bg-rose-950 text-rose-300 border-rose-600' },
  read: { label: 'Đã đọc', cls: 'bg-amber-950 text-amber-300 border-amber-600' },
  done: { label: 'Đã xử lý', cls: 'bg-emerald-950 text-emerald-300 border-emerald-600' }
};

const FILTERS = [
  { key: 'new', label: 'Chưa đọc' },
  { key: 'read', label: 'Đã đọc' },
  { key: 'done', label: 'Đã xử lý' },
  { key: 'ALL', label: 'Tất cả' }
];

/** Giờ Việt Nam, dạng người đọc được. Chuỗi ISO hỏng thì trả về nguyên văn. */
const formatTime = (iso) => {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso || '—');
    return d.toLocaleString('vi-VN', { hour12: false });
  } catch (e) {
    return String(iso || '—');
  }
};

export default function SupportInboxModal({
  isOpen,
  onClose,
  messages,
  onSetStatus,
  onDelete,
  currentUser = null
}) {
  const [filter, setFilter] = useState('new');
  const [busyId, setBusyId] = useState('');
  const [notice, setNotice] = useState('');

  // Cuộc trao đổi đang mở để trả lời. Giữ id chứ không giữ cả object: danh sách
  // `messages` được cập nhật realtime, ôm một bản chụp cũ thì trạng thái trên
  // màn trả lời sẽ đứng yên trong khi bảng bên ngoài đã đổi.
  const [openThreadId, setOpenThreadId] = useState(null);
  const [replies, setReplies] = useState(null);

  useEffect(() => {
    if (!openThreadId) {
      setReplies(null);
      return;
    }
    const unsub = listenToSupportReplies(openThreadId, setReplies);
    return () => { if (typeof unsub === 'function') unsub(); };
  }, [openThreadId]);

  if (!isOpen) return null;

  const list = Array.isArray(messages) ? messages : [];
  const countOf = (key) => (key === 'ALL' ? list.length : list.filter((m) => (m.status || 'new') === key).length);
  const shown = filter === 'ALL' ? list : list.filter((m) => (m.status || 'new') === filter);
  const openThread = list.find((m) => m.id === openThreadId) || null;

  /**
   * Mở màn trả lời. Đánh dấu đã đọc luôn nếu còn 'new' — quản trị viên vừa mở
   * cuộc trao đổi ra thì hiển nhiên là đã đọc, bắt bấm thêm một nút nữa để nói
   * điều hiển nhiên đó chỉ khiến bộ đếm chưa đọc trôi khỏi thực tế.
   */
  const enterThread = (msg) => {
    setOpenThreadId(msg.id);
    if ((msg.status || 'new') === 'new') onSetStatus(msg.id, 'read');
  };

  const handleAdminReply = (text) =>
    sendSupportReply(openThreadId, {
      from: 'admin',
      text,
      threadEmail: openThread?.email,
      authorName: currentUser?.name || 'Ban Quản Trị'
    });

  const run = async (id, fn) => {
    setBusyId(id);
    const result = await fn();
    setBusyId('');
    if (result && result.ok === false) {
      setNotice(`Máy chủ từ chối: ${result.code || result.message || 'lỗi không rõ'}`);
      setTimeout(() => setNotice(''), 6000);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl h-[92vh] max-h-[900px] glass-panel rounded-3xl border border-emerald-500/40 p-4 sm:p-6 shadow-2xl space-y-3.5 my-auto flex flex-col">

        {/* Đầu khung */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-emerald-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <PMarcomLogo className="w-9 h-9" showText={false} />
            <div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-black border border-emerald-700 uppercase tracking-wider">
                HỘP THƯ HỖ TRỢ
              </span>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide mt-0.5">
                LỜI NHẮN CỦA HỌC VIÊN
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Đóng hộp thư"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {notice && (
          <div className="p-2.5 rounded-xl bg-rose-950 border border-rose-600 text-rose-200 text-xs font-bold shrink-0">
            {notice}
          </div>
        )}

        {/* ===== Màn trả lời một cuộc trao đổi ===== */}
        {openThread && (
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-900/50 shrink-0">
              <button
                onClick={() => setOpenThreadId(null)}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
                title="Quay lại hộp thư"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <p className="text-sm font-black text-white truncate">{openThread.name || '—'}</p>
                <p className="text-[11px] text-slate-400 truncate">
                  {openThread.email}
                  {openThread.phone ? ` · ${openThread.phone}` : ''}
                </p>
              </div>
              <span className={`ml-auto px-2 py-0.5 rounded text-[9.5px] font-black border uppercase tracking-wider shrink-0 ${
                (STATUS_META[openThread.status || 'new'] || STATUS_META.new).cls
              }`}>
                {(STATUS_META[openThread.status || 'new'] || STATUS_META.new).label}
              </span>
              {(openThread.status || 'new') !== 'done' && (
                <button
                  onClick={() => run(openThread.id, () => onSetStatus(openThread.id, 'done'))}
                  className="shrink-0 px-2.5 py-1.5 rounded-lg bg-emerald-600 border border-emerald-400 text-white text-[10.5px] font-bold hover:brightness-110 transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCheck className="w-3 h-3" /> Đã xử lý xong
                </button>
              )}
            </div>

            <SupportThread
              thread={openThread}
              replies={replies}
              me="admin"
              onSend={handleAdminReply}
            />
          </div>
        )}

        {/* Bộ lọc theo trạng thái */}
        {!openThread && (
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                filter === f.key
                  ? 'bg-emerald-600 border-emerald-400 text-white'
                  : 'bg-slate-900/80 border-emerald-900/60 text-slate-300 hover:border-emerald-500'
              }`}
            >
              {f.label} ({countOf(f.key)})
            </button>
          ))}
        </div>
        )}

        {/* Danh sách lời nhắn */}
        {!openThread && (
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">

          {messages === null ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-2 px-6">
              <AlertTriangle className="w-10 h-10 text-amber-400" />
              <p className="text-sm font-black text-amber-300">Chưa đọc được hộp thư</p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                Máy chủ chưa trả lời được lệnh đọc. Thường là do mất mạng, phiên đăng nhập đã hết hạn,
                hoặc <strong className="text-slate-200">firestore.rules chưa được deploy</strong> phần
                <strong className="text-slate-200"> support_messages</strong>. Đây KHÔNG có nghĩa là
                không có lời nhắn nào — có thể đang có học viên chờ trả lời.
              </p>
            </div>
          ) : shown.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-2">
              <Inbox className="w-10 h-10 text-slate-600" />
              <p className="text-sm font-bold text-slate-400">
                {filter === 'ALL' ? 'Chưa có lời nhắn nào' : `Không có lời nhắn ở mục "${FILTERS.find((f) => f.key === filter)?.label}"`}
              </p>
              <p className="text-[11px] text-slate-500">
                Học viên gửi lời nhắn từ khung chat Pipi, góc phải màn hình.
              </p>
            </div>
          ) : (
            shown.map((m) => {
              const status = m.status || 'new';
              const meta = STATUS_META[status] || STATUS_META.new;
              const isBusy = busyId === m.id;

              return (
                <div
                  key={m.id}
                  className={`rounded-2xl border p-3.5 space-y-2.5 transition ${
                    status === 'new'
                      ? 'bg-[#141d33] border-rose-700/50'
                      : 'bg-slate-900/50 border-emerald-900/50'
                  }`}
                >
                  {/* Người gửi */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-white truncate">{m.name || '—'}</span>
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-black border uppercase tracking-wider ${meta.cls}`}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-emerald-400" /> {m.email || '—'}
                        </span>
                        {m.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-400" /> {m.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {formatTime(m.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nội dung. whitespace-pre-wrap để giữ nguyên cách xuống dòng
                      của người viết — lời nhắn kể lỗi thường có danh sách bước. */}
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap break-words bg-[#0e1526] rounded-xl p-3 border border-emerald-900/40">
                    {m.message}
                  </p>

                  {m.handledBy && status !== 'new' && (
                    <p className="text-[10px] text-slate-500">
                      {meta.label} bởi {m.handledBy} · {formatTime(m.handledAt)}
                    </p>
                  )}

                  {m.lastReplyFrom === 'student' && (
                    <p className="text-[10.5px] text-rose-300 font-bold">
                      Học viên đã nhắn tiếp — đang chờ trả lời.
                    </p>
                  )}

                  {/* Việc cần làm */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Trả lời ngay trong ứng dụng — lối chính. Đặt trước nút
                        email vì học viên nhận được phản hồi ngay trong khung
                        chat Pipi, không phải đi mở hộp thư email. */}
                    <button
                      onClick={() => enterThread(m)}
                      className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10.5px] font-black hover:brightness-110 transition cursor-pointer flex items-center gap-1.5 shadow"
                    >
                      <MessageSquare className="w-3 h-3" /> Trả lời trong app
                    </button>

                    {m.email && (
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent('Phản hồi từ Học Viện P MARCOM')}&body=${encodeURIComponent(`Chào ${m.name || 'bạn'},\n\nBan Quản Trị đã nhận được lời nhắn của bạn:\n"${m.message}"\n\n`)}`}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10.5px] font-bold hover:border-emerald-400 transition flex items-center gap-1.5"
                      >
                        <Mail className="w-3 h-3" /> Trả lời qua Email
                      </a>
                    )}
                    {m.phone && (
                      <a
                        href={`tel:${String(m.phone).replace(/[^\d+]/g, '')}`}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-emerald-900/60 text-slate-300 text-[10.5px] font-bold hover:border-emerald-400 transition flex items-center gap-1.5"
                      >
                        <Phone className="w-3 h-3" /> Gọi
                      </a>
                    )}

                    {status === 'new' && (
                      <button
                        disabled={isBusy}
                        onClick={() => run(m.id, () => onSetStatus(m.id, 'read'))}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-950 border border-amber-700 text-amber-300 text-[10.5px] font-bold hover:border-amber-400 transition cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                      >
                        <MailOpen className="w-3 h-3" /> Đánh dấu đã đọc
                      </button>
                    )}

                    {status !== 'done' && (
                      <button
                        disabled={isBusy}
                        onClick={() => run(m.id, () => onSetStatus(m.id, 'done'))}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 border border-emerald-400 text-white text-[10.5px] font-bold hover:brightness-110 transition cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                      >
                        <CheckCheck className="w-3 h-3" /> Đã xử lý xong
                      </button>
                    )}

                    {status !== 'new' && (
                      <button
                        disabled={isBusy}
                        onClick={() => run(m.id, () => onSetStatus(m.id, 'new'))}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-emerald-900/60 text-slate-400 text-[10.5px] font-bold hover:border-emerald-500 transition cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                        title="Trả về chưa đọc để xử lý lại sau"
                      >
                        <RotateCcw className="w-3 h-3" /> Mở lại
                      </button>
                    )}

                    <button
                      disabled={isBusy}
                      onClick={() => {
                        // Xoá là mất hẳn, không có thùng rác. Hỏi lại một lần.
                        if (!window.confirm(`Xoá vĩnh viễn lời nhắn của ${m.name || m.email}?\n\nKhông khôi phục lại được.`)) return;
                        run(m.id, () => onDelete(m.id));
                      }}
                      className="ml-auto px-2.5 py-1.5 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 text-[10.5px] font-bold hover:border-rose-500 transition cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3 h-3" /> Xoá
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        )}

      </div>
    </div>
  );
}
