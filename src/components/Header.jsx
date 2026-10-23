import React, { useState, useEffect, useRef } from 'react';
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
      className={`nav-btn relative ${compact ? 'nav-btn-icon' : ''}`}
    >
      <Bell className="w-4 h-4" />
      {!compact && <span>Hộp Thư</span>}
      {/* Có thư mới thì chỉ chấm số đỏ báo hiệu, nút giữ nguyên kiểu như mọi
          nút khác trên hàng — không tô cả nút hồng như bản trước. */}
      {has && (
        <span className="nav-unread">
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
   * Bấm logo hoặc chữ "HỌC VIỆN P MARCOM" là về TRANG CHỦ HỌC VIỆN — địa chỉ
   * `/`, không phải địa chỉ của một khoá nào.
   *
   * Phải là một hàm riêng chứ không gọi tạm `setActiveTab('course')` như bản
   * trước: đang đọc dở một bài thì tab vốn đã là 'course' rồi, nên lệnh đó
   * không đổi gì cả và bấm logo trông như nút hỏng. Còn từ tab khác bấm sang
   * thì nó thả người dùng vào đúng chuyên đề mở dở lần trước chứ không phải
   * trang chủ. Việc "về trang chủ" cần xoá cả chuyên đề đang mở lẫn ghi lại
   * địa chỉ, mà Header không nắm hai thứ đó nên nơi gọi phải đưa xuống trọn
   * vẹn hành động.
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
  lang = 'vi',
  toggleLanguage,
  t
}) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  /* CHIỀU CAO THẬT CỦA HEADER, công bố ra biến CSS `--app-header-h`.

     FeatureMenuBar dính ngay dưới Header nên phải biết Header cao bao nhiêu.
     Trước đây con số đó ghi cứng là 60px, và nó sai ở mọi thiết bị: trên máy
     tính Header cao khoảng 80px, trên điện thoại khoảng 70px. Sai bao nhiêu thì
     thanh menu chui xuống dưới Header đúng bấy nhiêu — Header có tầng z cao hơn
     nên phần chui vào bị che mất, mà không ai đoán ra vì nó vẫn trông "gần
     đúng".

     Không thể ghi cứng cho xong: ba thứ đều đổi chiều cao Header trong lúc
     chạy. Cỡ chữ A-/A/A+ nhân toàn bộ rem, ô tìm kiếm trên điện thoại bung ra
     thêm một hàng, và tên khoá học dài có thể xuống dòng. Nên phải đo.

     Ghi lên `documentElement` chứ không phải state: giá trị này chỉ để CSS
     dùng, đưa vào state là dựng lại toàn bộ cây giao diện mỗi lần Header nhúc
     nhích một pixel. */
  const headerRef = useRef(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const apply = () => {
      const h = Math.round(el.getBoundingClientRect().height);
      if (h > 0) document.documentElement.style.setProperty('--app-header-h', `${h}px`);
    };
    apply();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    <header ref={headerRef} className="sticky top-0 z-40 bg-[#0e1526]/95 backdrop-blur-md border-b border-emerald-900/40 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo & Course Title

            `min-w-0` thay cho `shrink-0`: khối này PHẢI co lại được.

            Trước đây nó từ chối co, nên trên máy 390px tổng bề ngang của hàng
            vượt khung và phần bị ép lại là hàng nút bên phải — nơi có nút tài
            khoản và nút chứng chỉ. Chúng bị bóp méo hoặc đẩy khuất, mà body lại
            có `overflow-x: hidden` nên không hề có thanh cuộn để lần ra. Nay
            chỗ thiếu được trừ vào tên khoá học (vốn đã cắt bằng `truncate`),
            còn hàng nút giữ nguyên kích thước. */}
        <div
          className="flex items-center gap-2.5 cursor-pointer min-w-0"
          onClick={onGoHome || (() => setActiveTab('course'))}
          title="Về trang chủ"
        >
          <PMarcomLogo className="w-9 h-9 sm:w-11 sm:h-11 shrink-0" showText={false} />
          {/* ĐÃ GỠ hai huy hiệu cạnh tên: "Trị Giá 2.999.999 VNĐ" và số lượt
              truy cập. Giá đặt sát tên khoá học khiến thanh tiêu đề đọc như
              một tấm biển quảng cáo; lượt truy cập đã có ở cuối trang chủ.
              Tên Học Viện thành dòng chữ nhỏ thay vì ô viền, để tên khoá học
              là thứ duy nhất nổi bật trong khối này. */}
          <div className="min-w-0">
            <span className="nav-brand-eyebrow">Học Viện P Marcom</span>
            <h1 className="nav-brand-title truncate">
              {textDict.courseTitle || 'Khóa Học Digital Thực Chiến'}
            </h1>
          </div>
        </div>

        {/* Desktop Search & Controls */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          <label className="nav-search hidden xl:flex w-44">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm bài học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>

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
              className="nav-btn nav-btn-icon"
            >
              {lang === 'vi' ? 'VI' : 'EN'}
            </button>
          )}

          {/* Theme Customization Toggle Button */}
          <div className="relative shrink-0" data-display-menu>
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="Tuỳ chỉnh Giao diện: Sáng / Tối / Mặc định hệ thống"
              className="nav-btn nav-btn-icon"
            >
              {theme === 'light' && <Sun className="w-4 h-4" />}
              {theme === 'dark' && <Moon className="w-4 h-4" />}
              {theme === 'system' && <Monitor className="w-4 h-4" />}
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
            className="nav-btn hidden xl:inline-flex"
          >
            <Award className="w-4 h-4" />
            <span>Chứng chỉ</span>
            <span className="nav-count">{passedCount}/{totalModules}</span>
          </button>

          {/* Chuông Hộp Thư Hỗ Trợ (chỉ quản trị viên) */}
          {onOpenSupportInbox && (
            <SupportBell onOpen={onOpenSupportInbox} unread={supportUnreadCount} />
          )}

          {/* Admin Master Dashboard Access Button */}
          {onOpenAdminModal && (
            <button
              onClick={onOpenAdminModal}
              className="nav-btn"
              title="Mở Bảng Quản Trị Học Viên & Xuất Báo Cáo Data"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Quản Trị</span>
            </button>
          )}

          {/* User Account / Auth Button (GUARANTEED VISIBLE SHRINK-0) */}
          {currentUser ? (
            <button
              onClick={onOpenProfileModal}
              className="nav-btn"
            >
              <div className="nav-avatar">
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
              className="nav-btn nav-btn-primary"
            >
              <User className="w-4 h-4" />
              <span>Đăng Ký / Đăng Nhập</span>
            </button>
          )}
        </div>

        {/* Mobile Header Right Action Icons

            ĐO TRƯỚC KHI THÊM BẤT KỲ NÚT NÀO VÀO ĐÂY.

            Hàng này từng chứa cả năm nút: chuông hộp thư, hiển thị, tài khoản,
            tìm kiếm, chứng chỉ. Cộng với khối logo bên trái thì bề ngang thật
            là khoảng 460px — trên máy 390px là thừa ra 70px, và vì body có
            `overflow-x: hidden` nên phần thừa biến mất không dấu vết thay vì
            hiện thanh cuộn. Đó là lý do nút Quản Trị chưa bao giờ có chỗ ở đây,
            và cũng là lý do nó nay nằm ở thanh đáy.

            Hai nút TÀI KHOẢN và CHỨNG CHỈ chỉ hiện từ 640px trở lên. Dưới mức
            đó chúng lặp y nguyên hai mục "Tài Khoản" và "Bằng Cấp" của thanh
            đáy — cùng đích đến, mà thanh đáy còn ghi rõ tên học viên và nằm
            trong tầm ngón cái. Bỏ hai nút trùng lặp trả lại đúng chỗ cho ba nút
            không có ở nơi nào khác: hộp thư, hiển thị, tìm kiếm. Tiến độ học
            vẫn đọc được ngay dưới đây, ở vạch tiến độ cuối Header. */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
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
              className="nav-btn nav-btn-icon"
              title="Hiển thị: nền sáng/tối và cỡ chữ"
            >
              {theme === 'light' && <Sun className="w-4 h-4" />}
              {theme === 'dark' && <Moon className="w-4 h-4" />}
              {theme === 'system' && <Monitor className="w-4 h-4" />}
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
              className="nav-btn nav-btn-icon hidden sm:inline-flex"
            >
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="nav-btn nav-btn-primary hidden sm:inline-flex"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>
          )}

          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="nav-btn nav-btn-icon"
            title="Tìm kiếm bài học"
          >
            {showMobileSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenCertificate}
            className="nav-btn hidden sm:inline-flex"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{passedCount}/{totalModules}</span>
          </button>
        </div>

      </div>

      {/* Collapsible Mobile Search Input */}
      {showMobileSearch && (
        <div className="mt-2 pt-2 border-t border-emerald-900/40 lg:hidden">
          <label className="nav-search w-full">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm chuyên đề, bài học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
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

