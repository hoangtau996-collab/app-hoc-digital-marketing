import React, { useState, useEffect } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { TEXT_SCALES } from '../utils/textScale';
import {
  Award,
  Search,
  X,
  User,
  Sun,
  Moon,
  Monitor,
  Eye,
  Tag,
  ShieldCheck,
  Bell
} from 'lucide-react';

/**
 * Chuông báo lời nhắn hỗ trợ. Chỉ dựng khi nơi gọi truyền `onOpen` — tức là chỉ
 * quản trị viên thấy nó.
 *
 * Con số trên huy hiệu là số lời nhắn CHƯA ĐỌC, không phải tổng số: tổng thì
 * đứng yên nên nhìn mãi cũng không biết có việc mới hay không.
 */
function SupportBell({ onOpen, unread = 0, compact = false }) {
  const has = unread > 0;
  return (
    <button
      onClick={onOpen}
      title={has ? `${unread} lời nhắn hỗ trợ chưa đọc` : 'Hộp Thư Hỗ Trợ — chưa có lời nhắn mới'}
      className={`relative flex items-center justify-center shrink-0 cursor-pointer transition border rounded-lg ${
        compact ? 'w-8 h-8' : 'gap-1.5 px-3 py-1.5'
      } ${
        has
          ? 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/50 text-rose-200'
          : 'bg-[#18243d] hover:border-emerald-500 border-emerald-900/50 text-slate-300'
      }`}
    >
      <Bell className={`w-4 h-4 ${has ? 'text-rose-300' : 'text-slate-400'}`} />
      {!compact && <span className="text-xs font-bold">Hộp Thư</span>}
      {has && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#0e1526] tabular-nums">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </button>
  );
}

/**
 * Bảng "Hiển thị": chọn nền Sáng/Tối/Hệ thống và cỡ chữ A- / A / A+.
 *
 * VÌ SAO GỘP CHUNG MỘT BẢNG, KHÔNG TÁCH THÀNH NÚT RIÊNG TRÊN HEADER
 *
 * Hàng nút bên phải Header đã tràn sẵn trước khi có tính năng cỡ chữ: đo trên
 * khung 390px thì nội dung hàng rộng 410px, tức nút "Chứng chỉ 0/11" đã bị đẩy
 * khỏi màn hình (body có `overflow-x: hidden` nên không ai thấy thanh cuộn,
 * chỉ thấy nút biến mất). Thêm một cụm ba nút A- / A / A+ vào đó đẩy thêm 72px
 * nữa, mất luôn nút tài khoản.
 *
 * Nhét vào bảng đang có thì không tốn thêm một pixel bề ngang nào. Và về mặt
 * người dùng cũng đúng chỗ hơn: nền tối và cỡ chữ là cùng một câu hỏi — "trang
 * này hiện ra thế nào cho vừa mắt tôi" — nên nằm cạnh nhau thì người đi tìm
 * chỉ phải mở một chỗ.
 */
function DisplayMenu({ theme, setTheme, textScale, setTextScale, onClose }) {
  const themeOptions = [
    { key: 'light', icon: <Sun className="w-3.5 h-3.5 text-amber-400" />, label: 'Sáng (Light)' },
    { key: 'dark', icon: <Moon className="w-3.5 h-3.5 text-emerald-400" />, label: 'Tối (Dark)' },
    { key: 'system', icon: <Monitor className="w-3.5 h-3.5 text-teal-400" />, label: 'Hệ thống (Auto)' },
  ];

  return (
    <div className="absolute right-0 mt-2 w-52 rounded-xl glass-panel display-menu border border-emerald-500/40 p-1.5 shadow-2xl z-50 space-y-1">
      {themeOptions.map(opt => (
        <button
          key={opt.key}
          onClick={() => { setTheme(opt.key); onClose(); }}
          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            theme === opt.key ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:bg-emerald-950'
          }`}
        >
          {opt.icon}
          <span>{opt.label}</span>
        </button>
      ))}

      <div className="pt-1.5 mt-1.5 border-t border-emerald-900/60">
        <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
          Cỡ chữ
        </div>
        {/* Không đóng bảng sau khi bấm: chọn cỡ chữ là việc phải nhìn kết quả
            rồi cân nhắc lại, khác với chọn nền. Đóng ngay thì muốn thử nấc kế
            tiếp lại phải mở bảng từ đầu. */}
        <div className="flex items-center gap-1 px-1.5">
          {TEXT_SCALES.map(scale => (
            <button
              key={scale.value}
              onClick={() => setTextScale(scale.value)}
              title={scale.title}
              aria-pressed={textScale === scale.value}
              className={`flex-1 py-1.5 rounded-lg font-extrabold leading-none transition cursor-pointer ${
                scale.value === 0.92 ? 'text-[10px]' : scale.value === 1 ? 'text-xs' : 'text-sm'
              } ${
                textScale === scale.value
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-emerald-950'
              }`}
            >
              {scale.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header({
  // Bỏ `activeTab` và `newsFeed`: sau khi gỡ nhóm nút điều hướng trùng lặp thì
  // Header không còn cần biết đang ở tab nào, và biến tin mới nhất cũng chưa
  // từng được dùng tới.
  setActiveTab,
  /**
   * Bấm logo là về trang chủ — tức tổng quan khoá chính, KHÔNG còn chuyên đề
   * nào mở dở.
   *
   * Phải là một hàm riêng chứ không gọi tạm `setActiveTab('course')` như bản
   * trước: đang đọc dở một bài thì tab vốn đã là 'course' rồi, nên lệnh đó
   * không đổi gì cả và bấm logo trông như nút hỏng. Còn từ tab khác bấm sang
   * thì nó thả người dùng vào đúng chuyên đề mở dở lần trước chứ không phải
   * trang chủ. Chuyện "về trang chủ" cần xoá cả chuyên đề, mà Header không
   * nắm biến đó nên nơi gọi phải đưa xuống trọn vẹn hành động.
   */
  onGoHome,
  passedCount,
  totalModules,
  onOpenCertificate,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenAdminModal,
  // Chuông hộp thư hỗ trợ: truyền `null` cho tài khoản không phải quản trị viên
  // thì nút không được dựng ra.
  onOpenSupportInbox = null,
  supportUnreadCount = 0,
  theme = 'system',
  setTheme = () => {},
  textScale = 1,
  setTextScale = () => {},
  trafficStats,
  lang = 'vi',
  toggleLanguage,
  t
}) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  /* Bấm ra ngoài thì đóng bảng Hiển thị.

     Trước đây không cần: bảng chỉ có ba lựa chọn nền, chọn xong là tự đóng nên
     không bao giờ đứng lại trên màn hình. Nay hàng cỡ chữ CỐ Ý không đóng bảng
     (còn phải thử nấc khác), nên nếu không có chỗ này thì bảng nằm lì cho tới
     khi người dùng đoán ra là phải bấm lại đúng cái nút đã mở nó.

     `mousedown` chứ không `click`: nút mở bảng nằm ngoài vùng bảng, nên với
     `click` thì thao tác bấm nút để đóng sẽ chạy hai lần — đóng ở đây rồi mở
     lại ở onClick của nút, kết quả là bảng không bao giờ đóng được.

     Nhận diện bằng `data-display-menu` thay vì ref: Header dựng bảng này hai
     lần (một bản desktop, một bản điện thoại), một ref chỉ trỏ được vào một
     bản nên bản kia sẽ bị coi là "bấm ra ngoài" và đóng ngay khi vừa chạm. */
  useEffect(() => {
    if (!showThemeMenu) return;
    const handler = (e) => {
      if (!e.target.closest?.('[data-display-menu]')) setShowThemeMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showThemeMenu]);
  const textDict = t || {};
  const overallProgress = totalModules > 0 ? Math.round((passedCount / totalModules) * 100) : 0;


  return (
    <header className="sticky top-0 z-40 bg-[#0e1526]/95 backdrop-blur-md border-b border-emerald-900/40 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo & Course Title */}
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          onClick={onGoHome || (() => setActiveTab('course'))}
          title="Về trang chủ"
        >
          <PMarcomLogo className="w-9 h-9 sm:w-11 sm:h-11" showText={false} />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/60 uppercase tracking-wider">
                HỌC VIỆN P MARCOM
              </span>
              
              {/* Course Value Tag Header */}
              <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Tag className="w-3 h-3 text-amber-400" /> Trị Giá: 2.999.999 VNĐ
              </span>

              {/* Total Cumulative Web Traffic Counter */}
              {trafficStats && (
                <span className="hidden 2xl:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700/60">
                  <Eye className="w-3 h-3 text-teal-400" /> {(trafficStats.totalTraffic || 0).toLocaleString('vi-VN')} Lượt Truy Cập Web
                </span>
              )}
            </div>
            <h1 className="text-xs sm:text-base font-black text-white tracking-wide truncate max-w-[150px] sm:max-w-none mt-0.5 uppercase">
              {textDict.courseTitle || "KHÓA HỌC DIGITAL THỰC CHIẾN"}
            </h1>
          </div>
        </div>

        {/* Desktop Search & Controls */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          <div className="relative hidden xl:block w-36 lg:w-44">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm bài học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18243d] border border-emerald-900/50 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/*
            ĐÃ GỠ: nhóm bốn nút Khóa học / Từ điển / Tin tức / Công cụ.
            Chúng lặp y nguyên các mục của FeatureMenuBar ngay bên dưới, mà
            thanh đó còn ghi rõ nhãn và tiến độ. Hai hàng điều hướng cùng nội
            dung vừa gây rối vừa chiếm khoảng 330px, đẩy nút Quản Trị và nút tài
            khoản ra khỏi tầm nhìn trên màn hình hẹp. Đừng thêm lại.
          */}

          {/* Language Selector Switcher Button */}
          {toggleLanguage && (
            <button
              onClick={toggleLanguage}
              title={lang === 'vi' ? "Chuyển sang Tiếng Anh (English)" : "Switch to Vietnamese (Tiếng Việt)"}
              className="px-2.5 py-1.5 rounded-lg bg-[#18243d] border border-emerald-900/50 hover:border-emerald-500 text-slate-200 hover:text-white transition flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer shadow-sm"
            >
              <span className="text-sm">{lang === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
              <span className="uppercase text-[11px] font-extrabold text-emerald-400">{lang === 'vi' ? 'VI' : 'EN'}</span>
            </button>
          )}

          {/* Theme Customization Toggle Button */}
          <div className="relative shrink-0" data-display-menu>
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="Tuỳ chỉnh Giao diện: Sáng / Tối / Mặc định hệ thống"
              className="p-2 rounded-lg bg-[#18243d] border border-emerald-900/50 hover:border-emerald-500 text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              {theme === 'light' && <Sun className="w-4 h-4 text-amber-400" />}
              {theme === 'dark' && <Moon className="w-4 h-4 text-emerald-400" />}
              {theme === 'system' && <Monitor className="w-4 h-4 text-teal-400" />}
            </button>

            {showThemeMenu && (
              <DisplayMenu
                theme={theme} setTheme={setTheme}
                textScale={textScale} setTextScale={setTextScale}
                onClose={() => setShowThemeMenu(false)}
              />
            )}
          </div>

          <button
            onClick={onOpenCertificate}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-medium transition shrink-0 cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Chứng chỉ</span>
            <span className="bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-amber-800">
              {passedCount}/{totalModules}
            </span>
          </button>

          {/* Chuông Hộp Thư Hỗ Trợ (chỉ quản trị viên) */}
          {onOpenSupportInbox && (
            <SupportBell onOpen={onOpenSupportInbox} unread={supportUnreadCount} />
          )}

          {/* Admin Master Dashboard Access Button */}
          {onOpenAdminModal && (
            <button
              onClick={onOpenAdminModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition shrink-0 cursor-pointer shadow-sm"
              title="Mở Bảng Quản Trị Học Viên & Xuất Báo Cáo Data"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>🔑 Quản Trị</span>
            </button>
          )}

          {/* User Account / Auth Button (GUARANTEED VISIBLE SHRINK-0) */}
          {currentUser ? (
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700 hover:border-emerald-500 text-emerald-300 text-xs font-bold transition shrink-0 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px] overflow-hidden shrink-0">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  currentUser.name ? currentUser.name.charAt(0) : 'U'
                )}
              </div>
              {/* Nới từ 100px lên 150px: gỡ nhóm nút trùng lặp đã trả lại chỗ,
                  tên "QUẢN TRỊ VIÊN ADMIN" trước đây bị cắt còn "QUẢN TRỊ VIÊN ..." */}
              <span className="truncate max-w-[150px]">{currentUser.name || 'Học Viên'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-md"
            >
              <User className="w-4 h-4" />
              <span>Đăng Ký / Đăng Nhập</span>
            </button>
          )}
        </div>

        {/* Mobile Header Right Action Icons */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Chuông Hộp Thư Hỗ Trợ — quản trị viên hay trực bằng điện thoại,
              nên nút này phải có ở cả bản màn nhỏ. */}
          {onOpenSupportInbox && (
            <SupportBell onOpen={onOpenSupportInbox} unread={supportUnreadCount} compact />
          )}

          {/* Nút Hiển thị cho điện thoại.

              Trước đây nút này đảo vòng Tối -> Sáng -> Hệ thống ngay khi bấm.
              Nay nó mở đúng bảng mà bản desktop dùng, vì cỡ chữ không thể nhét
              vào một nút đảo vòng — và vì đảo vòng vốn đã khó dùng: muốn về
              Sáng từ Hệ thống phải bấm hai lần và đoán xem còn mấy nhịp nữa.
              Bảng hiện cả ba lựa chọn cùng lúc, bấm một lần là tới nơi. */}
          <div className="relative shrink-0" data-display-menu>
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="w-8 h-8 rounded-lg bg-[#18243d] border border-emerald-900/50 flex items-center justify-center text-slate-300"
              title="Hiển thị: nền sáng/tối và cỡ chữ"
            >
              {theme === 'light' && <Sun className="w-4 h-4 text-amber-400" />}
              {theme === 'dark' && <Moon className="w-4 h-4 text-emerald-400" />}
              {theme === 'system' && <Monitor className="w-4 h-4 text-teal-400" />}
            </button>

            {showThemeMenu && (
              <DisplayMenu
                theme={theme} setTheme={setTheme}
                textScale={textScale} setTextScale={setTextScale}
                onClose={() => setShowThemeMenu(false)}
              />
            )}
          </div>

          {currentUser ? (
            <button
              onClick={onOpenProfileModal}
              className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-600 flex items-center justify-center text-emerald-400 font-bold text-xs"
            >
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>
          )}

          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="w-8 h-8 rounded-lg bg-[#18243d] border border-emerald-900/50 flex items-center justify-center text-slate-300"
          >
            {showMobileSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 border border-amber-500/40 text-amber-300 text-xs font-bold"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{passedCount}/{totalModules}</span>
          </button>
        </div>

      </div>

      {/* Collapsible Mobile Search Input */}
      {showMobileSearch && (
        <div className="mt-2 pt-2 border-t border-emerald-900/40 lg:hidden">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm chuyên đề, bài học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18243d] border border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-900 h-1 mt-2.5 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </header>
  );
}

