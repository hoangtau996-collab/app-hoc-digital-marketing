import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Send, Minus, Sparkles, Mail, LogIn, X } from 'lucide-react';
import { askPipi, PIPI_SUGGESTIONS } from '../utils/pipiBrain';
import { sendSupportMessage, SUPPORT_MESSAGE_MAX } from '../firebase';

/**
 * Pipi - trợ lý tra cứu của khoá học, thay cho ô tìm kiếm cũ.
 *
 * TẠO HÌNH: robot hiện đại nguyên bản — đầu bo góc vuông, kính che mặt tối màu
 * với hai mắt phát sáng, ăng-ten, hai khối loa hai bên.
 *
 * Bản trước là mèo máy đầu tròn xanh, mặt trắng, mũi đỏ có vạch dọc, râu mèo,
 * vòng cổ kèm chuông. Chú thích khi đó ghi "cố ý không sao chép Doraemon",
 * nhưng đúng tập hợp đặc điểm ấy CHÍNH LÀ tạo hình Doraemon — nhân vật có bản
 * quyền của Fujiko Pro. Đã vẽ lại hoàn toàn: đổi hình khối (vuông bo góc thay
 * vì tròn), bỏ sạch mọi chi tiết nhận dạng của nhân vật cũ (râu, mũi đỏ, vạch
 * dọc, chuông, vòng cổ đỏ), và chuyển sang bảng màu ngọc lục bảo của thương
 * hiệu. KHÔNG khôi phục lại bản cũ.
 *
 * Câu trả lời do utils/pipiBrain.js sinh ra, chạy hoàn toàn tại máy.
 */

/* Ảnh đại diện Pipi, vẽ bằng SVG nội tuyến */
export function PipiAvatar({ size = 40, talking = false, blink = false }) {
  // Id gradient phải duy nhất theo từng lần vẽ. Nhiều PipiAvatar cùng nằm trên
  // một trang (nút nổi + đầu khung chat + từng dòng trả lời) mà trùng id thì
  // trình duyệt lấy định nghĩa đầu tiên cho tất cả.
  const uid = React.useId();
  const gShell = `pipi-shell-${uid}`;
  const gVisor = `pipi-visor-${uid}`;
  const gGlow = `pipi-glow-${uid}`;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-label="Pipi" role="img">
      <defs>
        <linearGradient id={gShell} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2f7fd" />
          <stop offset="55%" stopColor="#d3e0f0" />
          <stop offset="100%" stopColor="#a8bcd6" />
        </linearGradient>
        <linearGradient id={gVisor} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2a44" />
          <stop offset="100%" stopColor="#0b1424" />
        </linearGradient>
        <radialGradient id={gGlow}>
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ăng-ten */}
      <line x1="50" y1="20" x2="50" y2="9" stroke="#8aa2c0" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="7.5" r="5" fill={`url(#${gGlow})`} />
      <circle cx="50" cy="7.5" r="3.2" fill="#34d399" />

      {/* Khối loa hai bên */}
      <rect x="6" y="42" width="10" height="20" rx="4" fill="#9db2cd" />
      <rect x="84" y="42" width="10" height="20" rx="4" fill="#9db2cd" />

      {/* Đầu: vuông bo góc — khác hẳn đầu tròn của bản cũ */}
      <rect x="15" y="20" width="70" height="62" rx="20" fill={`url(#${gShell})`} stroke="#8aa2c0" strokeWidth="1.5" />

      {/* Kính che mặt */}
      <rect x="24" y="31" width="52" height="36" rx="15" fill={`url(#${gVisor})`} />
      <rect x="27.5" y="34" width="45" height="12" rx="7" fill="#ffffff" opacity="0.07" />

      {/* Mắt phát sáng */}
      <g className={blink ? 'pipi-blink' : undefined}>
        <circle cx={talking ? 39.5 : 39} cy="47" r="9" fill={`url(#${gGlow})`} />
        <circle cx={talking ? 60.5 : 61} cy="47" r="9" fill={`url(#${gGlow})`} />
        <rect x={talking ? 35.5 : 35} y="42" width="8" height="10" rx="4" fill="#34d399" />
        <rect x={talking ? 56.5 : 57} y="42" width="8" height="10" rx="4" fill="#34d399" />
        <circle cx={talking ? 37.8 : 37.3} cy="44.8" r="1.4" fill="#eafff6" />
        <circle cx={talking ? 58.8 : 59.3} cy="44.8" r="1.4" fill="#eafff6" />
      </g>

      {/* Miệng: dải sóng âm khi nói, vạch LED khi im */}
      {talking ? (
        <g fill="#34d399">
          <rect x="41" y="57" width="3" height="6" rx="1.5" />
          <rect x="46" y="54.5" width="3" height="11" rx="1.5" />
          <rect x="51" y="56" width="3" height="8" rx="1.5" />
          <rect x="56" y="58" width="3" height="4" rx="1.5" />
        </g>
      ) : (
        <rect x="42" y="58.5" width="16" height="3" rx="1.5" fill="#34d399" opacity="0.75" />
      )}

      {/* Cổ và vai */}
      <rect x="43" y="82" width="14" height="6" rx="3" fill="#9db2cd" />
      <path d="M26 100q6-11 24-11t24 11z" fill="#b6c8de" />
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

export default function PipiChat({
  onSelectModule,
  setActiveTab,
  setSearchQuery,
  variant = 'inline',
  // Cần để biết gửi lời nhắn hỗ trợ dưới danh nghĩa ai. Không có phiên đăng
  // nhập thì không gửi được: máy chủ đòi trường `email` khớp email trong ID
  // token (xem firestore.rules, /support_messages).
  currentUser = null,
  onRequireLogin = null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showHello, setShowHello] = useState(false);
  const [input, setInput] = useState('');
  // Khung soạn lời nhắn gửi Ban Quản Trị. Là một chế độ riêng của khung chat
  // chứ không phải cửa sổ mới: học viên vẫn thấy đoạn hội thoại vừa rồi, nên
  // không phải kể lại từ đầu vấn đề họ đang gặp.
  const [isComposing, setIsComposing] = useState(false);
  const [supportText, setSupportText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'pipi',
      title: 'Chào bạn! Mình là Pipi 🤖',
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

  /** Thêm một lượt trả lời của Pipi vào cuối hội thoại. */
  const sayPipi = (title, lines) =>
    setMessages((prev) => [...prev, { from: 'pipi', title, lines, actions: [] }]);

  const openCompose = () => {
    setIsOpen(true);
    if (!currentUser) {
      // Không tự bật khung soạn khi chưa đăng nhập: gõ xong cả đoạn rồi mới bị
      // từ chối là mất công người viết.
      sayPipi('Cần đăng nhập trước đã', [
        'Ban Quản Trị phải biết **ai** đang cần hỗ trợ thì mới liên hệ lại được, nên lời nhắn phải gửi từ một tài khoản học viên.',
        'Bạn đăng nhập rồi quay lại đây nhé — mình vẫn giữ nguyên đoạn hội thoại này.',
      ]);
      return;
    }
    setIsComposing(true);
  };

  const runAction = (a) => {
    // Lời nhắn hỗ trợ xử lý NGAY trong khung chat, nên không đóng khung như các
    // hành động khác — các hành động kia đều điều hướng đi chỗ khác.
    if (a.type === 'support') {
      openCompose();
      return;
    }
    if (a.type === 'openModule' && onSelectModule) onSelectModule(a.id);
    if (a.type === 'openTab' && setActiveTab) setActiveTab(a.tab);
    if (a.type === 'search' && setSearchQuery) {
      setSearchQuery(a.query);
      if (setActiveTab) setActiveTab('course');
    }
    setIsOpen(false);
  };

  const submitSupport = async (e) => {
    e.preventDefault();
    const body = supportText.trim();
    if (!body || isSending) return;

    setIsSending(true);
    const result = await sendSupportMessage({
      name: currentUser?.name,
      email: currentUser?.email,
      phone: currentUser?.phone,
      message: body
    });
    setIsSending(false);

    if (!result.ok) {
      // Giữ nguyên nội dung đã gõ. Xoá đi khi gửi hỏng là bắt học viên viết lại
      // từ đầu đúng lúc họ đang bực vì gặp trục trặc.
      sayPipi('Chưa gửi được lời nhắn', [result.message]);
      return;
    }

    setSupportText('');
    setIsComposing(false);
    setMessages((prev) => [
      ...prev,
      { from: 'user', title: body, lines: [], actions: [] },
      {
        from: 'pipi',
        title: 'Đã gửi tới Ban Quản Trị ✅',
        lines: [
          'Lời nhắn của bạn đã nằm trong hộp thư của Ban Quản Trị Học Viện, kèm tên và thông tin liên hệ trong hồ sơ của bạn.',
          'Ban Quản Trị sẽ liên hệ lại qua **email hoặc số điện thoại** bạn đã đăng ký. Trong lúc chờ, bạn cứ học tiếp nhé.',
        ],
        actions: []
      }
    ]);
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
      {/* Khung chat neo ở góc phải, ngay trên nút nổi.
          KHÔNG dùng lớp phủ toàn màn: người dùng vẫn đọc và thao tác được với
          nội dung phía sau trong lúc hỏi Pipi. */}
      {!isOpen ? null : createPortal(
        <div className="fixed z-[88] right-4 lg:right-6 bottom-[152px] lg:bottom-[104px] w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] h-[58vh] sm:h-[520px] max-h-[calc(100vh-190px)]">
          <div className="pipi-pop w-full h-full pipi-panel rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden">

            {/* Đầu khung */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-emerald-900/50 shrink-0">
              <PipiAvatar size={40} talking />
              <div className="min-w-0">
                <div className="text-sm font-black text-emerald-300 leading-tight">Pipi</div>
                <div className="text-[11px] text-slate-400 truncate">
                  Trợ lý tra cứu của HỌC VIỆN P MARCOM
                </div>
              </div>
              {/* Lối gặp người thật, luôn nhìn thấy được. Chôn nó sau một câu
                  hỏi mà Pipi phải trả lời trúng mới hiện ra thì đúng lúc học
                  viên bí nhất lại là lúc không tìm thấy nút. */}
              <button
                onClick={openCompose}
                className={`ml-auto h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-[11px] font-bold transition cursor-pointer shrink-0 border ${
                  isComposing
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : 'bg-emerald-950 border-emerald-700/70 text-emerald-300 hover:border-emerald-400'
                }`}
                title="Để lại lời nhắn cho Ban Quản Trị Học Viện"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Nhắn Ban Quản Trị</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:bg-emerald-950 hover:text-emerald-300 flex items-center justify-center transition cursor-pointer shrink-0"
                title="Thu nhỏ"
              >
                <Minus className="w-4 h-4" />
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
            {messages.length <= 1 && !isComposing && (
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

            {/* Lời mời đăng nhập, chỉ hiện cho khách chưa có tài khoản. */}
            {!currentUser && onRequireLogin && (
              <div className="px-3 pb-2 shrink-0">
                <button
                  onClick={() => { setIsOpen(false); onRequireLogin(); }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-800/70 hover:border-emerald-400 text-emerald-300 text-[11px] font-bold transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng nhập để nhắn được cho Ban Quản Trị</span>
                </button>
              </div>
            )}

            {isComposing ? (
              /* Khung soạn lời nhắn gửi Ban Quản Trị */
              <form
                onSubmit={submitSupport}
                className="px-3 py-3 border-t border-emerald-900/50 shrink-0 space-y-2"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-300">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Lời nhắn gửi Ban Quản Trị</span>
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="ml-auto w-6 h-6 rounded-lg text-slate-400 hover:bg-emerald-950 hover:text-emerald-300 flex items-center justify-center transition cursor-pointer"
                    title="Huỷ, quay lại hỏi Pipi"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Nói rõ những gì được gửi kèm. Học viên có quyền biết lời nhắn
                    mang theo thông tin gì của họ trước khi bấm gửi. */}
                <p className="text-[10.5px] text-slate-400 leading-relaxed">
                  Gửi kèm: <strong className="text-slate-200">{currentUser?.name || '—'}</strong>
                  {currentUser?.email ? ` · ${currentUser.email}` : ''}
                  {currentUser?.phone && currentUser.phone !== 'Chưa cập nhật' ? ` · ${currentUser.phone}` : ''}
                </p>

                <textarea
                  autoFocus
                  rows={3}
                  value={supportText}
                  maxLength={SUPPORT_MESSAGE_MAX}
                  onChange={(e) => setSupportText(e.target.value)}
                  placeholder="Bạn đang gặp vấn đề gì? Ví dụ: học xong chuyên đề 5 nhưng tiến độ không lưu, hoặc cần cấp lại bằng..."
                  className="w-full bg-[#0e1526] border border-emerald-900/60 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition resize-none"
                />

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 tabular-nums">
                    {supportText.trim().length}/{SUPPORT_MESSAGE_MAX}
                  </span>
                  <button
                    type="submit"
                    disabled={!supportText.trim() || isSending}
                    className="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[11px] flex items-center gap-1.5 hover:brightness-110 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Đang gửi...' : 'Gửi lời nhắn'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Ô nhập */
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
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
