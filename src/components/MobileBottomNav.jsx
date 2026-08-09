import React from 'react';
import { BookOpen, Flame, Wrench, Award, Sparkles, User, GraduationCap, Lock, ShieldCheck } from 'lucide-react';

/**
 * Một mục trên thanh đáy.
 *
 * `shrink-0` + bề ngang tối thiểu 56px: hàng này cuộn ngang được (xem thanh
 * ngoài), nên mục KHÔNG được phép tự bóp lại cho vừa. Để chúng bóp thì thêm một
 * mục là mọi mục cùng hẹp đi một chút, chữ xuống dòng và vùng chạm teo dần —
 * hỏng đều tay thay vì hiện ra thanh cuộn.
 *
 * 56px là mức tối thiểu để vùng chạm đạt chuẩn ~44px của cả iOS lẫn Android.
 */
function NavItem({ icon, label, active = false, tone = 'default', badge = null, onClick }) {
  const toneClass =
    tone === 'gold'
      ? 'text-amber-400 hover:text-amber-300'
      : tone === 'admin'
        ? 'text-amber-300'
        : active
          ? 'text-emerald-400 font-bold'
          : 'text-slate-400 hover:text-slate-200';

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-0.5 shrink-0 min-w-[56px] py-1.5 px-1.5 rounded-xl transition ${toneClass} ${
        tone === 'admin' ? 'bg-amber-500/15 border border-amber-500/40' : ''
      }`}
    >
      {icon}
      <span className="text-[10px] leading-none whitespace-nowrap">{label}</span>
      {badge}
    </button>
  );
}

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  // Chạm "Digital" phải về tổng quan khoá Digital Marketing, mà
  // `setActiveTab('course')` một mình không xoá chuyên đề đang mở nên đang đọc
  // dở bài thì chạm vào không đi đâu cả.
  //
  // CỐ Ý không dùng chung với logo trên Header: logo về trang chủ Học Viện
  // (`/`), còn nút này chọn một khoá cụ thể (`/digital-marketing`). Học viện
  // sắp có thêm khoá nên hai việc đó sẽ càng ngày càng khác nhau.
  onOpenCourseHome,
  onOpenCertificate,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal,
  isTradeCourseUnlocked = false,
  /**
   * Lối vào Bảng Quản Trị cho màn hình nhỏ. Truyền `null` cho tài khoản không
   * phải quản trị viên thì mục này không được dựng ra.
   *
   * VÌ SAO Ở ĐÂY CHỨ KHÔNG PHẢI TRÊN HEADER: bản màn nhỏ của Header không có
   * chỗ. Hàng nút bên phải nó đã chật sẵn (chuông hộp thư, hiển thị, tài khoản,
   * tìm kiếm, chứng chỉ) và tràn ngang trên máy 390px trước cả khi thêm gì —
   * đó chính là lý do nút Quản Trị chưa từng xuất hiện trên điện thoại, dù
   * người dùng đã đăng nhập đúng tài khoản quản trị tối cao. Thanh đáy vừa còn
   * chỗ, vừa nằm trong tầm ngón cái.
   */
  onOpenAdminModal = null,
  /** Số lời nhắn hỗ trợ chưa đọc — hiện thành huy hiệu trên mục Quản Trị. */
  supportUnreadCount = 0
}) {
  return (
    /* pb an toàn cho iPhone: thanh gạt Home nằm đè lên đáy màn hình, không chừa
       thì mục cuối bị che một phần và chạm vào hay bị nhận nhầm thành thao tác
       vuốt về màn hình chính. `env(safe-area-inset-bottom)` bằng 0 trên máy
       không có gạt Home nên không tốn chỗ oan. */
    <div
      className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden glass-panel border-t border-emerald-900/60 p-1 px-1.5 bg-[#0e1526]/95 backdrop-blur-lg"
      style={{ paddingBottom: 'calc(0.25rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* CUỘN NGANG là chốt chặn, không phải bố cục chính.

          Số mục ở đây thay đổi theo người dùng: học viên thấy 7, quản trị viên
          thấy 8. Trên máy 390px thì 8 mục không thể cùng nằm gọn nếu vẫn giữ
          vùng chạm đủ lớn. Hai đường ra: bóp mọi mục lại cho vừa, hoặc cho cuộn.
          Bóp là hỏng đều tay cho tất cả mọi người; cuộn thì chỉ quản trị viên
          trên máy hẹp mới phải vuốt, còn học viên không thấy khác gì.

          `justify-between` vẫn có tác dụng khi hàng chưa tràn (máy tính bảng,
          điện thoại rộng, học viên) — lúc đó các mục trải đều như trước. */}
      <div className="flex items-center justify-between gap-0.5 overflow-x-auto no-scrollbar">

        {/* Tab 1: Course */}
        <NavItem
          onClick={onOpenCourseHome || (() => setActiveTab('course'))}
          active={activeTab === 'course'}
          icon={<BookOpen className="w-4 h-4" />}
          /* "Digital" chứ không phải "Digital Marketing": thanh này có tới 8 mục
             trên màn hình điện thoại, nhãn dài là tràn ngang. Rút gọn theo đúng
             cách mục kế bên rút "Trade Marketing" thành "Trade" — hai nhãn vẫn
             phân biệt được đúng hai khoá. */
          label="Digital"
        />

        {/* Tab 2: Trade Marketing (khoá nâng cao) */}
        <NavItem
          onClick={() => setActiveTab('trade')}
          active={activeTab === 'trade'}
          icon={isTradeCourseUnlocked ? <GraduationCap className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          label="Trade"
        />

        {/* Tab 3: Glossary */}
        <NavItem
          onClick={() => setActiveTab('glossary')}
          active={activeTab === 'glossary'}
          icon={<Sparkles className="w-4 h-4 text-amber-400" />}
          label="Từ Điển"
        />

        {/* Tab 4: News */}
        <NavItem
          onClick={() => setActiveTab('news')}
          active={activeTab === 'news'}
          icon={
            <div className="relative">
              <Flame className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-1" />
            </div>
          }
          label="Tin Live"
        />

        {/* Tab 5: Tools */}
        <NavItem
          onClick={() => setActiveTab('tools')}
          active={activeTab === 'tools'}
          icon={<Wrench className="w-4 h-4" />}
          label="Công Cụ"
        />

        {/* Tab 6: User Account / Login */}
        {currentUser ? (
          <NavItem
            onClick={onOpenProfileModal}
            active
            icon={<User className="w-4 h-4" />}
            label={currentUser.name ? currentUser.name.split(' ')[0] : 'Tài Khoản'}
          />
        ) : (
          <NavItem
            onClick={onOpenAuthModal}
            active
            icon={<User className="w-4 h-4" />}
            label="Đăng Nhập"
          />
        )}

        {/* Tab 7: Certificate */}
        <NavItem
          onClick={onOpenCertificate}
          tone="gold"
          icon={<Award className="w-4 h-4" />}
          label="Bằng Cấp"
        />

        {/* Tab 8: Bảng Quản Trị — chỉ quản trị viên.

            Có viền và nền riêng, cố ý khác hẳn các mục còn lại: đây không phải
            một khu vực học mà là khu vực quản lý, và nó chỉ hiện với một nhóm
            rất nhỏ người dùng. Nhìn khác đi thì không ai bấm nhầm, và quản trị
            viên tìm thấy ngay giữa hàng mục xam xám.

            Huy hiệu đỏ đếm lời nhắn hỗ trợ chưa đọc: chuông Hộp Thư nằm trên
            Header, mà trên điện thoại Header lại chật, nên đây là chỗ duy nhất
            báo được có việc mới mà không phải mở bảng ra xem. */}
        {onOpenAdminModal && (
          <NavItem
            onClick={onOpenAdminModal}
            tone="admin"
            icon={<ShieldCheck className="w-4 h-4" />}
            label="Quản Trị"
            badge={
              supportUnreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border border-[#0e1526] tabular-nums">
                  {supportUnreadCount > 9 ? '9+' : supportUnreadCount}
                </span>
              ) : null
            }
          />
        )}

      </div>
    </div>
  );
}
