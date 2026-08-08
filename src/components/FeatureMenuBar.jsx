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
      badge: 'Main',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
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
      badge: isTradeCourseUnlocked ? 'Mở' : 'Khoá',
      badgeBg: isTradeCourseUnlocked
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        : 'bg-slate-500/20 text-slate-400 border-slate-500/40',
      action: () => setActiveTab('trade')
    },
    {
      id: 'glossary',
      title: textDict.menuGlossaryTitle,
      subtitle: textDict.menuGlossarySub,
      icon: Sparkles,
      badge: 'Hot',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      action: () => setActiveTab('glossary')
    },
    {
      id: 'news',
      title: textDict.menuNewsTitle,
      subtitle: textDict.menuNewsSub,
      icon: Newspaper,
      badge: 'Live',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      action: () => setActiveTab('news')
    },
    {
      id: 'tools',
      title: textDict.menuToolsTitle,
      subtitle: textDict.menuToolsSub,
      icon: Wrench,
      badge: 'Pro',
      badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      action: () => setActiveTab('tools')
    },
    {
      id: 'cert',
      title: textDict.menuCertTitle,
      subtitle: `${passedCount}/${totalModules} ${textDict.passedModulesCount || 'Đã Đạt'}`,
      icon: Award,
      badge: `${passedCount}/${totalModules}`,
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      action: onOpenCertificate
    }
  ];

  return (
    <div className="w-full bg-[#141f36]/95 backdrop-blur-lg border-b border-emerald-900/50 py-2.5 px-3 sm:px-6 sticky top-[60px] z-30 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Swappable Horizontal Feature Menu Row */}
        <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          
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
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition shrink-0 border cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md'
                    : 'glass-panel hover:bg-emerald-950/40 text-slate-300 hover:text-white border-emerald-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                <span className="text-xs font-bold whitespace-nowrap">{item.title}</span>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border shrink-0 ${item.badgeBg}`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
