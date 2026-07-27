import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Send, X, Sparkles } from 'lucide-react';
import { askPipi, PIPI_SUGGESTIONS } from '../utils/pipiBrain';

/**
 * Pipi - trợ lý tra cứu của khoá học, thay cho ô tìm kiếm cũ.
 *
 * Nhân vật là robot mèo máy nguyên bản do dự án tự vẽ, lấy cảm hứng từ dòng
 * robot hoạt hình cổ điển (thân tròn, vòng cổ có chuông, túi trước bụng).
 * Cố ý KHÔNG sao chép tạo hình Doraemon vì đó là nhân vật có bản quyền.
 *
 * Câu trả lời do utils/pipiBrain.js sinh ra, chạy hoàn toàn tại máy.
 */

/* Ảnh đại diện Pipi, vẽ bằng SVG nội tuyến */
export function PipiAvatar({ size = 40, talking = false, blink = false }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-label="Pipi" role="img">
      <defs>
        <linearGradient id="pipi-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93b3f6" />
          <stop offset="100%" stopColor="#4a7ce4" />
        </linearGradient>
      </defs>
      {/* thân/đầu tròn */}
      <circle cx="50" cy="48" r="34" fill="url(#pipi-body)" />
      {/* mặt */}
      <ellipse cx="50" cy="55" rx="26" ry="24" fill="#fffdf7" />
      {/* mắt */}
      <ellipse cx="41" cy="36" rx="9" ry="11" fill="#fffdf7" />
      <ellipse cx="59" cy="36" rx="9" ry="11" fill="#fffdf7" />
      <circle className={blink ? 'pipi-blink' : undefined} cx={talking ? 43 : 42} cy="38" r="3.4" fill="#17233d" />
      <circle className={blink ? 'pipi-blink' : undefined} cx={talking ? 61 : 60} cy="38" r="3.4" fill="#17233d" />
      <circle cx="43.6" cy="36.6" r="1.1" fill="#ffffff" />
      <circle cx="61.6" cy="36.6" r="1.1" fill="#ffffff" />
      {/* mũi + vạch dọc */}
      <circle cx="50" cy="48" r="4.6" fill="#ea4c8b" />
      <circle cx="48.6" cy="46.6" r="1.4" fill="#ffdaf0" />
      <line x1="50" y1="52" x2="50" y2="62" stroke="#17233d" strokeWidth="1.6" strokeLinecap="round" />
      {/* miệng */}
      {talking ? (
        <ellipse cx="50" cy="67" rx="7" ry="5.5" fill="#b01f59" />
      ) : (
        <path d="M36 62q14 12 28 0" fill="none" stroke="#17233d" strokeWidth="1.8" strokeLinecap="round" />
      )}
      {/* râu */}
      <g stroke="#17233d" strokeWidth="1.3" strokeLinecap="round" opacity="0.75">
        <line x1="26" y1="50" x2="36" y2="52" />
        <line x1="26" y1="57" x2="36" y2="57" />
        <line x1="74" y1="50" x2="64" y2="52" />
        <line x1="74" y1="57" x2="64" y2="57" />
      </g>
      {/* vòng cổ + chuông */}
      <rect x="24" y="78" width="52" height="7" rx="3.5" fill="#ea4c8b" />
      <circle cx="50" cy="86" r="7" fill="#FFDAE9" stroke="#b01f59" strokeWidth="1.6" />
      <line x1="44" y1="85" x2="56" y2="85" stroke="#b01f59" strokeWidth="1.3" />
      <circle cx="50" cy="88" r="1.7" fill="#b01f59" />
    </svg>
  );
}

/* Tô đậm **chữ** trong câu trả lời */
function RichLine({ text }) {
  const parts = String(text).split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i} className="text-emerald-300 font-extrabold">{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  );
}

export default function PipiChat({ onSelectModule, setActiveTab, setSearchQuery, variant = 'inline' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showHello, setShowHello] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      from: 'pipi',
      title: 'Chào bạn! Mình là Pipi 🔔',
      lines: [
        'Mình tra giúp bạn **thuật ngữ**, tìm **bài học**, và **tính các chỉ số** Digital Marketing.',
        'Bấm một gợi ý bên dưới hoặc gõ câu hỏi nhé.',
      ],
      actions: [],
    },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Bóng chào thi thoảng nhô ra để người dùng biết có trợ lý ở đây.
  // Chỉ áp dụng cho nút nổi, và ngưng hẳn khi đã mở khung chat.
  useEffect(() => {
    if (variant !== 'fab' || isOpen) return;
    const first = setTimeout(() => setShowHello(true), 2500);
    const hide = setTimeout(() => setShowHello(false), 9000);
    const loop = setInterval(() => {
      setShowHello(true);
      setTimeout(() => setShowHello(false), 6000);
    }, 45000);
    return () => { clearTimeout(first); clearTimeout(hide); clearInterval(loop); };
  }, [variant, isOpen]);

  const send = (text) => {
    const q = String(text || '').trim();
    if (!q) return;
    const answer = askPipi(q);
    setMessages((prev) => [
      ...prev,
      { from: 'user', title: q, lines: [], actions: [] },
      { from: 'pipi', title: answer.title, lines: answer.lines, actions: answer.actions || [] },
    ]);
    setInput('');
  };

  const runAction = (a) => {
    if (a.type === 'openModule' && onSelectModule) onSelectModule(a.id);
    if (a.type === 'openTab' && setActiveTab) setActiveTab(a.tab);
    if (a.type === 'search' && setSearchQuery) {
      setSearchQuery(a.query);
      if (setActiveTab) setActiveTab('course');
    }
    setIsOpen(false);
  };

  const trigger =
    variant === 'fab' ? (
      /* Nút nổi góc phải. Trên màn nhỏ phải nâng lên khỏi MobileBottomNav
         (thanh đó fixed bottom-0 z-40), nếu không sẽ đè lên nhau. */
      <div className="fixed right-4 lg:right-6 bottom-20 lg:bottom-6 z-[85] flex flex-col items-end gap-2 pointer-events-none">
        {showHello && (
          <div className="pipi-pop pointer-events-auto max-w-[210px] px-3 py-2 rounded-2xl rounded-br-sm bg-[#111a2e] border border-emerald-500/50 shadow-xl">
            <p className="text-[11px] text-slate-200 leading-snug">
              Cần tra thuật ngữ hay tính chỉ số? <strong className="text-emerald-300">Hỏi Pipi nhé!</strong>
            </p>
          </div>
        )}

        <button
          onClick={() => { setIsOpen(true); setShowHello(false); }}
          aria-label="Mở trợ lý Pipi"
          title="Hỏi Pipi — trợ lý tra cứu"
          className="pipi-launcher pointer-events-auto relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-2xl shadow-emerald-950/60 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        >
          {/* vòng sóng lan toả */}
          <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-25 animate-ping" />
          <span className="absolute inset-0 rounded-full ring-2 ring-emerald-300/50" />
          <span className="pipi-head pipi-float relative">
            <PipiAvatar size={46} blink />
          </span>
          {/* chấm báo đang sẵn sàng */}
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 border-2 border-[#0e1526]" />
        </button>
      </div>
    ) : (
      /* Nút trong thanh menu, thay cho ô tìm kiếm cũ */
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2 bg-[#0e1526] border border-emerald-900/60 hover:border-emerald-400 rounded-xl pl-2 pr-3 py-1.5 text-xs text-slate-400 transition shadow-inner cursor-pointer group"
        title="Hỏi Pipi - trợ lý tra cứu"
      >
        <span className="shrink-0 group-hover:scale-110 transition-transform">
          <PipiAvatar size={24} blink />
        </span>
        <span className="truncate">Hỏi Pipi bất cứ điều gì...</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400 ml-auto shrink-0" />
      </button>
    );

  return (
    <div className={variant === 'fab' ? 'contents' : 'relative w-full md:w-64 shrink-0'}>
      {trigger}

      {/* Đưa ra thẳng body: FeatureMenuBar có backdrop-blur, tạo containing
          block mới khiến position:fixed bám vào thanh menu thay vì viewport,
          làm lớp phủ chỉ che được một dải nhỏ. */}
      {!isOpen ? null : createPortal(
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full sm:max-w-lg h-[85vh] sm:h-[70vh] glass-panel sm:rounded-3xl rounded-t-3xl border border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden">

            {/* Đầu khung */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-emerald-900/50 shrink-0">
              <PipiAvatar size={40} talking />
              <div className="min-w-0">
                <div className="text-sm font-black text-emerald-300 leading-tight">Pipi</div>
                <div className="text-[11px] text-slate-400 truncate">
                  Trợ lý tra cứu của HỌC VIỆN P MARCOM
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto w-9 h-9 rounded-full bg-slate-900 border border-emerald-700/60 text-emerald-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Khung hội thoại */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar">
              {messages.map((m, i) =>
                m.from === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] px-3.5 py-2 rounded-2xl rounded-br-sm bg-emerald-600 text-white text-xs font-medium">
                      {m.title}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-2.5">
                    <span className="shrink-0 mt-0.5"><PipiAvatar size={28} /></span>
                    <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-[#111a2e] border border-emerald-900/60 space-y-1.5">
                      <div className="text-xs font-black text-emerald-300">{m.title}</div>
                      {m.lines.map((l, k) => (
                        <p key={k} className="text-[11.5px] text-slate-300 leading-relaxed">
                          <RichLine text={l} />
                        </p>
                      ))}
                      {m.actions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {m.actions.map((a, k) => (
                            <button
                              key={k}
                              onClick={() => runAction(a)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-600/70 text-emerald-300 text-[10.5px] font-bold hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                            >
                              {a.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
              <div ref={endRef} />
            </div>

            {/* Gợi ý bấm nhanh */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {PIPI_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-2.5 py-1 rounded-full bg-slate-900 border border-emerald-900/60 text-slate-300 text-[10.5px] hover:border-emerald-500 hover:text-emerald-300 transition cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Ô nhập */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 px-3 py-3 border-t border-emerald-900/50 shrink-0"
            >
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi Pipi: ROAS là gì, tính CPA, tìm bài học..."
                className="flex-1 bg-[#0e1526] border border-emerald-900/60 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center hover:brightness-110 transition cursor-pointer disabled:opacity-40"
                title="Gửi"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
