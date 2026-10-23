import React from 'react';
import {
  BookOpen,
  Sparkles,
  Newspaper,
  Wrench,
  Award,
  GraduationCap,
  Lock
} from 'lucide-react';

/**
 * Thanh chọn khu vực: Khoá Học, Trade Marketing, Từ Điển, Tin Tức, Công Cụ,
 * Chứng Nhận.
 *
 * KHÔNG chứa nút hồ sơ / đăng nhập, cố ý. Trước đây có, và nó trùng y hệt nút
 * trong Header — cùng tên học viên, cùng ảnh đại diện, bấm vào mở cùng một hộp
 * thoại, chỉ khác chỗ đứng. Người dùng thấy hai lần thì phải dừng lại đoán xem
 * hai nút có khác nhau không, mà câu trả lời là không.
 *
 * Giữ lại nút ở Header vì đó là chỗ ai cũng tìm tài khoản của mình, và Header
 * đã lo đủ cả hai trạng thái (đã đăng nhập / chưa) trên cả máy tính lẫn điện
 * thoại. Thanh này chỉ còn đúng một loại việc: chuyển khu vực.
 */
export default function FeatureMenuBar({
  activeTab,
  setActiveTab,
  onSelectModule,
  onOpenCertificate,
  passedCount,
  totalModules,
  isTradeCourseUnlocked = false,
  tradePassedCount = 0,
  tradeTotalModules = 0,
  t
}) {
  // Nhãn giữ NGẮN để cả thanh menu nằm gọn trong khung 1.280px không phải cuộn
  // ngang. Phần mô tả dài chuyển xuống phụ đề, hiện khi di chuột qua.
  const textDict = t || {
    menuCourseTitle: "Digital Marketing",
    menuCourseSub: "Khoá chính — 11 chuyên đề thực chiến",
    menuGlossaryTitle: "Từ Điển",
    menuGlossarySub: "121 thuật ngữ Digital Marketing",
    menuNewsTitle: "Tin Tức",
    menuNewsSub: "Bản tin thuật toán Meta, TikTok, Google",
    menuToolsTitle: "Công Cụ",
    menuToolsSub: "Tính ngân sách, ROI và nhân sự",
    menuCertTitle: "Chứng Nhận",
    searchPlaceholder: "Tra cứu bài học / Thuật ngữ..."
  };

  const MENU_ITEMS = [
    {
      id: 'course',
      title: textDict.menuCourseTitle,
      subtitle: textDict.menuCourseSub,
      icon: BookOpen,
      // Không nhãn: "Main" chỉ nói lại điều tab này vốn đã là.
      action: () => {
        setActiveTab('course');
        onSelectModule(null);
      }
    },
    {
      // Khoá nâng cao. Vẫn hiện nút khi chưa mở khoá — bấm vào sẽ thấy màn giải
      // thích điều kiện và tiến độ còn thiếu, hữu ích hơn là giấu hẳn khiến học
      // viên không biết có khoá này.
      id: 'trade',
      title: 'Trade Marketing',
      subtitle: isTradeCourseUnlocked
        ? `${tradePassedCount}/${tradeTotalModules} chuyên đề nâng cao`
        : 'Mở sau khi tốt nghiệp khoá chính',
      icon: isTradeCourseUnlocked ? GraduationCap : Lock,
      // Đã mở thì không cần nhãn — biểu tượng mũ tốt nghiệp đã nói đủ.
      badge: isTradeCourseUnlocked ? null : 'Khoá',
      badgeTone: 'muted',
      action: () => setActiveTab('trade')
    },
    {
      id: 'glossary',
      title: textDict.menuGlossaryTitle,
      subtitle: textDict.menuGlossarySub,
      icon: Sparkles,
      badge: 'Hot',
      badgeTone: 'hot',
      action: () => setActiveTab('glossary')
    },
    {
      id: 'news',
      title: textDict.menuNewsTitle,
      subtitle: textDict.menuNewsSub,
      icon: Newspaper,
      badge: 'Live',
      badgeTone: 'live',
      action: () => setActiveTab('news')
    },
    {
      id: 'tools',
      title: textDict.menuToolsTitle,
      subtitle: textDict.menuToolsSub,
      icon: Wrench,
      badge: 'Pro',
      badgeTone: 'pro',
      action: () => setActiveTab('tools')
    },
    {
      id: 'cert',
      title: textDict.menuCertTitle,
      subtitle: `${passedCount}/${totalModules} ${textDict.passedModulesCount || 'Đã Đạt'}`,
      icon: Award,
      badge: `${passedCount}/${totalModules}`,
      badgeTone: 'count',
      action: onOpenCertificate
    }
  ];

  return (
    /* DÍNH TRÊN MÁY TÍNH, CUỘN THEO TRANG TRÊN ĐIỆN THOẠI.

       Vị trí dính lấy từ biến `--app-header-h` — chiều cao THẬT của Header, do
       chính Header đo rồi công bố. Trước đây chỗ này ghi cứng `top-[60px]`,
       thấp hơn Header thật (70px trên điện thoại, 80px trên máy tính) nên thanh
       menu trượt vào nấp sau Header và bị cắt cụt phần trên. 60px giữ lại làm
       giá trị dự phòng cho nhịp dựng đầu tiên, trước khi phép đo kịp chạy.

       `lg:sticky` — dưới 1024px thanh này KHÔNG dính nữa. Sáu mục của nó trùng
       đúng sáu mục đầu của thanh điều hướng đáy, mà thanh đáy thì luôn hiện và
       nằm trong tầm ngón cái. Giữ cả hai cùng đứng yên là chiếm mất khoảng 44px
       chiều cao vĩnh viễn để hiện lại thứ đã có sẵn — trên màn hình điện thoại
       cao chừng 700px, cộng cả Header và thanh đáy thì chỉ còn non 75% cho nội
       dung bài học. Nay cuộn xuống đọc bài là nó nhường chỗ. */
    <div
      className="nav-bar w-full py-2.5 px-3 sm:px-6 lg:sticky z-30"
      style={{ top: 'var(--app-header-h, 60px)' }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Cuộn ngang trên màn hẹp; dải `.nav-track` ôm vừa các tab. */}
        <div className="overflow-x-auto no-scrollbar scroll-smooth">
        <div className="nav-track">
          {/*
            MỤC MENU CHÍNH — bố cục MỘT DÒNG.
            Bản trước xếp hai dòng (tiêu đề + phụ đề) nên mỗi mục rộng khoảng
            200px; bảy mục là hơn 1.400px, tràn khỏi khung 1.280px và mục cuối
            "Giấy Chứng Nhận" bị cắt mất. Phụ đề chuyển sang thuộc tính title để
            di chuột vẫn đọc được mà không tốn chỗ.
          */}
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={item.action}
                title={item.subtitle}
                aria-current={isActive ? 'page' : undefined}
                className={`nav-tab ${isActive ? 'is-active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.title}</span>
                {item.badge && (
                  <span className={`nav-badge nav-badge-${item.badgeTone}`}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </div>
        </div>

      </div>
    </div>
  );
}
