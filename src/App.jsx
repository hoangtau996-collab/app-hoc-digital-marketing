import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CourseOverview from './components/CourseOverview';
import LessonViewer from './components/LessonViewer';
import LiveNewsFeed from './components/LiveNewsFeed';
import ManagerTools, { MANAGER_TOOLS } from './components/ManagerTools';
import CertificateModal from './components/CertificateModal';
import AIStrategyAdvisor from './components/AIStrategyAdvisor';
import MobileBottomNav from './components/MobileBottomNav';
import AuthModal from './components/AuthModal';
import CompleteProfileModal from './components/CompleteProfileModal';
import UserProfileModal from './components/UserProfileModal';
import DigitalGlossary from './components/DigitalGlossary';
import FeatureMenuBar from './components/FeatureMenuBar';
import AdminDashboardModal from './components/AdminDashboardModal';
import CoverSlider from './components/CoverSlider';
import CoverSliderModal from './components/CoverSliderModal';
import SupportInboxModal from './components/SupportInboxModal';
import SurveyModal from './components/SurveyModal';
import PartnerAppsBanner from './components/PartnerAppsBanner';
import { SURVEY_VERSION } from './data/surveyQuestions';
import {
  hasCompletedSurvey,
  writeSurvey,
  recordSkip,
  readSurvey,
  mergeCloudSurvey
} from './utils/surveyStorage';

import {
  auth,
  onAuthStateChanged,
  saveUserProgressToCloud,
  getUserProgressFromCloud,
  signOut,
  recordRealTrafficVisit,
  listenToRealTraffic,
  TRAFFIC_BASELINE,
  ENROLLED_BASELINE,
  GRADUATE_BASELINE,
  recordRealStudentGraduate,
  listenToRealStats,
  recordStudentAccountToCloud,
  isAdminInCloud,
  grantAdminInCloud,
  listenToSupportMessages,
  setSupportMessageStatus,
  deleteSupportMessage,
  saveSurveyToCloud,
  consumeGoogleRedirectResult,
  listenToCoverBanners,
  listenToCoverSliderConfig,
  normalizeCoverInterval,
  COVER_INTERVAL_DEFAULT_MS
} from './firebase';
import { hasRealPhone } from './utils/industryOptions';
import { sendGraduationEmail } from './utils/studentEmail';
import { isModuleUnlocked, getGateMessage } from './utils/moduleGating';

import StudyReminderModal from './components/StudyReminderModal';
import PipiChat from './components/PipiChat';
import {
  markStudyActivity,
  shouldRemind,
  getIdleDays,
  snoozeReminder,
} from './utils/studyReminder';

import {
  normalizeEmail,
  isRootAdmin,
  isAdminEmail,
  grantAdmin,
  revokeAdmin
} from './utils/adminRoles';

import {
  parseRoute,
  buildPath,
  buildDocumentTitle,
  isSameRoute,
  HOME_ROUTE,
  TAB_SEGMENTS
} from './utils/appRoutes';

import { COURSE_MODULES } from './data/courseData';
import { GLOSSARY_ITEMS } from './data/glossaryData';
import { TRADE_MODULES } from './data/tradeCourseData';
import TradeMarketingCourse from './components/TradeMarketingCourse';
import { INITIAL_NEWS_ITEMS } from './data/newsData';
import { compareNewsRecency } from './utils/newsDate';
import { TRANSLATIONS } from './data/translations';
import { normalizeTextScale } from './utils/textScale';

export default function App() {
  /* Khu vực đang xem, LẤY TỪ ĐỊA CHỈ ngay khi dựng lần đầu chứ không đặt cứng
     là 'course'. Mở `/ban-tin` mà khởi tạo bằng 'course' thì học viên thấy
     trang khoá học loé lên rồi mới nhảy sang bản tin — một cú giật không cần
     thiết ngay giây đầu tiên.

     Chỉ khu vực được lấy sớm như vậy, KHÔNG lấy luôn chuyên đề: chuyên đề có
     cổng khoá tuần tự, mà muốn kiểm tra cổng khoá thì phải đọc tiến độ học và
     trạng thái đăng nhập — hai thứ khai báo mãi bên dưới. Chuyên đề trong địa
     chỉ được nhận sau, ở phần "ĐỊA CHỈ TRÌNH DUYỆT" cuối tệp. */
  const [activeTab, setActiveTab] = useState(
    () => parseRoute(window.location.pathname)?.tab || HOME_ROUTE.tab
  );
  const [selectedModuleId, setSelectedModuleId] = useState(null); // null = overview, string = module view

  /* CHẾ ĐỘ TẬP TRUNG — mở bài là thu gọn mọi thứ quanh nội dung.

     Biến này chỉ trả lời một câu: học viên có đang chủ động bung lại danh
     sách chuyên đề hay không. Mặc định `false`, và được đặt lại về `false`
     mỗi lần đổi bài (xem effect ngay dưới) — nếu không, bung ra một lần là
     những bài sau cũng mở kèm danh sách, tức chế độ tập trung tự tắt sau
     lần dùng đầu tiên mà không ai chủ ý tắt nó.

     Effect đặt lại biến này nằm xa bên dưới, cạnh chỗ tính `isFocusMode` —
     phải chờ tới sau khi `selectedTradeModuleId` được khai báo mới đưa nó
     vào mảng phụ thuộc được. */
  const [focusSidebarOpen, setFocusSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isTradeCertOpen, setIsTradeCertOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCoverEditorOpen, setIsCoverEditorOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [reminderIdleDays, setReminderIdleDays] = useState(0);

  // Bilingual Language State: 'vi' | 'en'
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('dmm_language') || 'vi';
    } catch (e) {
      return 'vi';
    }
  });

  const toggleLanguage = () => {
    const nextLang = lang === 'vi' ? 'en' : 'vi';
    setLang(nextLang);
    try {
      localStorage.setItem('dmm_language', nextLang);
    } catch (e) {}
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.vi;

  // Theme State: 'light' | 'dark' | 'system'
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('dmm_theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  // Apply Theme effect
  useEffect(() => {
    try {
      localStorage.setItem('dmm_theme', theme);
    } catch (e) {}

    const applyTheme = (effectiveTheme) => {
      if (effectiveTheme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    };

    if (theme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        applyTheme(mediaQuery.matches ? 'dark' : 'light');

        const handleChange = (e) => {
          applyTheme(e.matches ? 'dark' : 'light');
        };

        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleChange);
          return () => mediaQuery.removeEventListener('change', handleChange);
        } else if (mediaQuery.addListener) {
          mediaQuery.addListener(handleChange);
          return () => mediaQuery.removeListener(handleChange);
        }
      } catch (e) {
        applyTheme('dark');
      }
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  /* CỠ CHỮ DO HỌC VIÊN TỰ CHỌN — nút A- / A / A+ trên Header

     Ba mức được ghi vào biến CSS `--app-text-scale` ở thẻ <html>; index.css
     nhân hệ số đó với cỡ chữ mặc định của trình duyệt. Không component nào
     phải biết tới cơ chế này: mọi cỡ chữ, khoảng đệm, bo góc trong ứng dụng
     đều tính bằng rem nên tự đi theo cỡ gốc.

     TRẦN TRÊN LÀ 1.12, cố ý thấp. Cao hơn nữa thì bảng học viên trong Bảng
     Quản Trị — chỗ duy nhất còn dựng cột bằng px — bắt đầu tràn. Ai cần to
     hơn mức này thì dùng Ctrl+ của trình duyệt: hai cơ chế nhân với nhau chứ
     không giẫm chân nhau, vì cỡ gốc lấy theo `100%` chứ không ghi cứng 16px. */
  const [textScale, setTextScale] = useState(() => {
    try {
      return normalizeTextScale(localStorage.getItem('dmm_text_scale'));
    } catch (e) {
      return 1;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dmm_text_scale', String(textScale));
    } catch (e) {}
    document.documentElement.style.setProperty('--app-text-scale', String(textScale));
  }, [textScale]);

  // Real Web Traffic & Student Statistics (100% Real numbers measured strictly from real data)
  // Khởi tạo đúng bằng mốc khởi điểm, không bằng 0: Cloud trả lời sau khoảng
  // một nhịp mạng, khởi tạo 0 sẽ khiến con số nhảy giật từ 0 lên 190 ngay trước
  // mắt người xem.
  const [trafficStats, setTrafficStats] = useState({
    totalTraffic: TRAFFIC_BASELINE,
    todayTraffic: 0,
    totalEnrolled: ENROLLED_BASELINE,
    totalGraduates: GRADUATE_BASELINE,
    onlineActive: 1
  });

  // Real-time Web Traffic & Student Stats tracker from Firebase Cloud & Local persistence
  useEffect(() => {
    // 1. Record real page view & real enrollment
    // Hiển thị ngay số đếm tại máy, không đợi Cloud. Lấy max để con số
    // không bao giờ nhảy giật lùi khi Cloud trả về ngay sau đó.
    recordRealTrafficVisit().then(initialCount => {
      setTrafficStats(prev => ({
        ...prev,
        totalTraffic: Math.max(prev.totalTraffic, initialCount)
      }));
    });

    // KHÔNG gọi recordRealStudentEnrollment() ở đây.
    //
    // Effect này chạy khi TẢI TRANG, nên bộ đếm "học viên ghi danh" thực chất
    // đang đếm lượt khách lần đầu vào web — kể cả người chỉ ghé xem rồi đi.
    // Đó là lý do `totalEnrolled` từng lên 9 trong khi máy chủ gần như chưa có
    // hồ sơ học viên nào. Số liệu ghi danh nay lấy từ `listenToRealStats` bên
    // dưới, và được Bảng Quản Trị đối soát lại bằng số đếm thật trên máy chủ.

    // 2. Subscribe to real-time Cloud Firestore traffic updates
    const unsubscribeTraffic = listenToRealTraffic((data) => {
      setTrafficStats(prev => ({
        ...prev,
        // Lấy thẳng số của Cloud, KHÔNG dùng Math.max với giá trị cũ. Kẹp theo
        // giá trị lớn nhất từng thấy sẽ khiến con số không bao giờ giảm được
        // nữa — kể cả sau khi đối soát lại cho đúng.
        totalTraffic: data.totalViews ?? prev.totalTraffic,
        todayTraffic: data.todayViews ?? prev.todayTraffic
      }));
    });

    // 3. Subscribe to real-time Cloud Firestore student stats (Enrolled & Graduates)
    const unsubscribeStats = listenToRealStats((data) => {
      setTrafficStats(prev => ({
        ...prev,
        totalEnrolled: data.totalEnrolled || prev.totalEnrolled,
        totalGraduates: data.totalGraduates !== undefined ? data.totalGraduates : prev.totalGraduates
      }));
    });

    return () => {
      unsubscribeTraffic();
      unsubscribeStats();
    };
  }, []);

  /**
   * Xác định vai trò của tài khoản.
   *
   * QUY TẮC: quyền quản trị CHỈ cấp cho một phiên đăng nhập Firebase Auth thật,
   * và chỉ khi máy chủ xác nhận. Tham số `authUser` phải là đối tượng do
   * `onAuthStateChanged` đưa ra — email trong đó lấy từ ID token đã ký, không
   * phải thứ trình duyệt tự khai.
   *
   * Vì sao bỏ hết các nguồn cũ (`dmm_active_user.role`, `dmm_users_db.role`,
   * `dmm_admin_emails`): cả ba đều nằm trong localStorage, sửa một dòng trong
   * devtools là tự phong quản trị viên. Nay chúng chỉ còn là bộ nhớ đệm cho
   * trường hợp mất mạng, không tự sinh ra quyền cho email chưa từng được máy
   * chủ xác nhận.
   *
   * Ba trạng thái trả lời của máy chủ được xử lý khác nhau:
   *   true  -> có quyền, ghi vào bộ nhớ đệm
   *   false -> không có quyền, xoá khỏi bộ nhớ đệm ngay (đây là cách việc thu
   *            hồi quyền lan tới máy của chính người bị thu hồi)
   *   null  -> chưa hỏi được (mất mạng / chưa deploy rules) -> dùng bộ nhớ đệm
   *
   * Tài khoản gốc KHÔNG đi qua ba nhánh trên — nó thoát ra ngay ở đầu hàm, xem
   * lý do đầy đủ tại đó. Đây là ngoại lệ có chủ đích: danh sách nằm cứng trong
   * mã nguồn nên người dùng không sửa được, và điều kiện vẫn là phải đăng nhập
   * được vào đúng tài khoản đó. Giữ ngoại lệ này để không khoá chết hệ thống
   * trong lúc sổ `admins` trên Firestore chưa được mồi.
   *
   * HÀM NÀY PHẢI NHANH. Lời nhắc học và bảng khảo sát đều hẹn giờ bật sau khi
   * trang tải xong; chừng nào nó chưa trả lời thì ứng dụng chưa biết người
   * đang đăng nhập là quản trị viên hay học viên. Trả lời muộn quá một nhịp là
   * quản trị viên bị hỏi như học viên thường — đúng lỗi đã gặp trên điện thoại.
   */
  const resolveAdminRole = async (authUser) => {
    const email = normalizeEmail(authUser?.email);
    if (!email) return 'student';

    /* TÀI KHOẢN GỐC: TRẢ LỜI NGAY, KHÔNG CHỜ MẠNG.
     *
     * Không phải tối ưu vặt — nó xoá hẳn một lớp lỗi. Với tài khoản gốc, cả ba
     * câu trả lời của máy chủ đều dẫn tới cùng một kết quả 'admin' (xem ba
     * nhánh bên dưới: true, false và null đều ra 'admin'), nên vòng hỏi
     * Firestore không đổi được gì — nó chỉ làm chậm.
     *
     * Mà chậm ở đây là hỏng thật. `getDoc` không có hạn chờ: mất sóng giữa
     * chừng thì nó cứ thử lại, không lỗi cũng không xong. Suốt quãng đó vai trò
     * chưa được kết luận nên nút Quản Trị không hiện ra — đúng cảnh "đăng nhập
     * bằng điện thoại thì không thấy bảng quản trị". Danh sách tài khoản gốc
     * nằm cứng trong mã nguồn và người dùng vẫn phải đăng nhập được vào đúng
     * tài khoản đó, nên trả lời sớm không nới lỏng chốt chặn nào.
     *
     * Ranh giới thật vẫn nằm ở Firestore Rules trên máy chủ: giao diện mở ra
     * sớm không đồng nghĩa với đọc được dữ liệu học viên.
     */
    if (isRootAdmin(email)) {
      grantAdmin(email);
      seedRootAdminInCloud(email);
      return 'admin';
    }

    const verdict = await isAdminInCloud(email);

    if (verdict === true) {
      grantAdmin(email);
      return 'admin';
    }
    if (verdict === false) {
      revokeAdmin(email);
      return 'student';
    }
    return isAdminEmail(email) ? 'admin' : 'student';
  };

  /**
   * Mồi sổ phân quyền cho tài khoản gốc — chạy nền, không ai chờ kết quả.
   *
   * VÌ SAO PHẢI MỒI: sổ `admins` rỗng thì không ai là quản trị viên, mà chỉ
   * quản trị viên mới ghi được vào sổ -> khoá chết, không ai cấp được cho ai.
   * Firestore Rules mở đúng một ngoại lệ cho tình huống này: tài khoản gốc tự
   * tạo bản ghi của CHÍNH NÓ. Thiếu bước này thì sau khi deploy rules, quản trị
   * viên đăng nhập vào sẽ thấy bảng rỗng vì lệnh liệt kê học viên bị từ chối.
   *
   * VÌ SAO KHÔNG CHỜ: việc này chỉ có tác dụng đúng một lần trong đời hệ thống,
   * còn cái giá của việc chờ thì phải trả ở mọi lần đăng nhập của mọi tài khoản
   * gốc, trên mọi chất lượng sóng. Bảng Quản Trị lại chỉ mở khi người dùng bấm
   * nút — cách lúc này vài giây, quá đủ cho một lệnh ghi chạy xong.
   */
  const seedRootAdminInCloud = (email) => {
    isAdminInCloud(email)
      .then((verdict) => {
        if (verdict !== false) return; // đã có trong sổ, hoặc chưa hỏi được
        return grantAdminInCloud(email, email);
      })
      .catch((err) => console.warn('Chưa mồi được sổ phân quyền trên Cloud:', err));
  };

  // Active student account with fail-safe sanitization
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dmm_active_user');
      if (!saved || saved === 'undefined' || saved === 'null') return null;
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return {
          id: parsed.id || 'guest',
          email: typeof parsed.email === 'string' ? parsed.email : '',
          name: typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name : (typeof parsed.email === 'string' && parsed.email.includes('@') ? parsed.email.split('@')[0].toUpperCase() : 'HỌC VIÊN'),
          phone: typeof parsed.phone === 'string' ? parsed.phone : 'Chưa có SĐT',
          industry: typeof parsed.industry === 'string' ? parsed.industry : 'Digital Marketing',
          // Luôn khởi tạo là 'student', KHÔNG đọc role từ localStorage.
          //
          // Đây chính là chỗ trước đây cho phép tự phong: chỉ cần sửa một dòng
          // trong `dmm_active_user` là có nút Quản Trị ngay từ lần tải trang
          // đầu. Quyền nay do listener `onAuthStateChanged` bên dưới cấp, sau
          // khi máy chủ xác nhận — chậm hơn khoảng một nhịp mạng, đổi lại
          // không giả được.
          role: 'student'
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  /**
   * Hồ sơ còn khuyết, phải điền nốt mới được vào học.
   *
   * Chỉ bật cho tài khoản đăng nhập BẰNG GOOGLE và CHƯA có số điện thoại. Google
   * không trả về số điện thoại lẫn ngành nghề, nên tài khoản kiểu này chưa từng
   * đi qua form đăng ký — khác với tài khoản email/mật khẩu vốn đã bắt điền đủ.
   *
   * Tính lại sau MỖI lần tải trang, từ dữ liệu máy chủ. Đó là lý do chốt chặn
   * đặt ở đây chứ không đặt trong AuthModal: đăng nhập bằng cách chuyển trang sẽ
   * tải lại cả ứng dụng, lúc quay về thì modal đăng nhập đã đóng từ lâu.
   */
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);

  /**
   * Máy chủ đã trả lời xong câu "tài khoản này có phải quản trị viên không" chưa.
   *
   * Cần một cờ riêng vì `isAdmin` đọc từ `currentUser.role`, mà giá trị đó chỉ
   * đúng SAU KHI `resolveAdminRole()` hỏi xong Firestore. Trước lúc đó mọi tài
   * khoản đều mang tạm vai trò 'student' — nghĩa là "chưa biết", nhưng nhìn từ
   * phần còn lại của ứng dụng thì không phân biệt được với "đã biết, là học viên".
   *
   * Chính chỗ đó làm bảng khảo sát loé lên trên màn hình quản trị viên: nó chờ
   * 900ms rồi cứ thế bật, mà một vòng hỏi Firestore lúc mạng chậm hoặc máy chủ
   * vừa khởi động thì lâu hơn thế nhiều.
   */
  const [roleResolved, setRoleResolved] = useState(false);

  /**
   * Máy chủ đã trả lời vai trò cho ĐÚNG email nào.
   *
   * `roleResolved` một mình không đủ vì nó không nhớ câu trả lời thuộc về ai.
   * Đăng xuất rồi đăng nhập bằng tài khoản khác trong cùng một lượt mở trang là
   * ra ngay lỗ hổng: lần đăng xuất đã đặt cờ thành true, nên tài khoản mới thừa
   * hưởng "đã biết vai trò" trong khi máy chủ còn chưa được hỏi về họ.
   *
   * Là ref chứ không phải state: chỉ dùng để so sánh tại thời điểm gọi, không
   * có gì trên màn hình phụ thuộc vào nó nên không cần dựng lại giao diện.
   */
  const roleResolvedForEmailRef = useRef(null);

  // Lỗi của lần đăng nhập Google bằng cách chuyển trang, chuyển vào AuthModal.
  const [googleAuthError, setGoogleAuthError] = useState('');

  // Listen to Firebase Auth state & merge saved profile attributes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let existingUser = null;
        try {
          const saved = localStorage.getItem('dmm_active_user');
          if (saved) existingUser = JSON.parse(saved);
        } catch (e) {}

        // Hỏi SONG SONG, không nối đuôi.
        //
        // Bản trước chờ xong hồ sơ đám mây rồi mới hỏi sổ phân quyền — hai
        // vòng mạng nối tiếp. Trên 4G yếu (đúng bối cảnh dùng điện thoại) tổng
        // thời gian vượt xa 1,2 giây, mà đó là hạn chót: lời nhắc học và bảng
        // khảo sát đều hẹn giờ bật ở mốc đó. Chậm một nhịp là quản trị viên bị
        // hỏi như học viên thường. Chạy song song cắt đi đúng một vòng mạng.
        //
        // Cả hai hàm đều tự nuốt lỗi và trả về null/'student', nên Promise.all
        // ở đây không bao giờ bị từ chối — không cần bọc thêm try/catch.
        const [cloudProfile, resolvedRole] = await Promise.all([
          getUserProgressFromCloud(user.uid, user.email),
          resolveAdminRole(user)
        ]);

        // Bản lưu tại máy CHỈ dùng khi đúng là của người đang đăng nhập. Trên
        // máy dùng chung, `dmm_active_user` còn là hồ sơ của người trước — lấy
        // số điện thoại của họ ra dùng thì chốt chặn tưởng hồ sơ đã đủ và cho
        // qua luôn, học viên mới không bao giờ được hỏi số của mình.
        const localMatchesUser =
          normalizeEmail(existingUser?.email) === normalizeEmail(user.email);
        const knownPhone =
          (localMatchesUser ? existingUser?.phone : '') || cloudProfile?.phone || '';

        // Chốt chặn áp cho MỌI học viên chưa có số điện thoại, không riêng người
        // đăng nhập bằng Google.
        //
        // Form đăng ký hiện tại đã bắt buộc điền SĐT, nhưng còn cả một lớp tài
        // khoản cũ tạo từ trước khi có ràng buộc đó — và nhánh đăng ký dự phòng
        // tại máy cũng sinh ra hồ sơ thiếu. Với những người này, Bảng Quản Trị
        // có tên mà không có cách nào liên lạc, nên mọi việc cần gọi điện —
        // nhắc học, xác minh danh tính để đổi email, báo lịch — đều tắc.
        //
        // Quản trị viên được miễn, cố ý: chặn nhầm họ là khoá luôn Bảng Quản
        // Trị, mà đó lại đúng là chỗ để đi sửa những hồ sơ thiếu này.
        setNeedsProfileCompletion(resolvedRole !== 'admin' && !hasRealPhone(knownPhone));

        const studentUser = {
          id: user.uid,
          email: user.email || (existingUser?.email || ''),
          name: (existingUser?.name || cloudProfile?.name || user.displayName || (user.email ? user.email.split('@')[0] : 'HỌC VIÊN')).toUpperCase(),
          phone: existingUser?.phone || cloudProfile?.phone || 'Chưa cập nhật',
          industry: existingUser?.industry || cloudProfile?.industry || 'Digital Marketing',
          avatarUrl: existingUser?.avatarUrl || cloudProfile?.avatarUrl || '',
          createdAt: existingUser?.createdAt || cloudProfile?.createdAt || new Date().toLocaleDateString('vi-VN'),
          // Đây là NƠI DUY NHẤT cấp quyền quản trị trong toàn ứng dụng, và chỉ
          // cấp sau khi máy chủ xác nhận (xem resolveAdminRole).
          role: resolvedRole
        };

        setCurrentUser(studentUser);
        // Từ đây vai trò là câu trả lời của máy chủ, không còn là giá trị tạm.
        roleResolvedForEmailRef.current = normalizeEmail(studentUser.email);
        setRoleResolved(true);
        try {
          localStorage.setItem('dmm_active_user', JSON.stringify(studentUser));
        } catch (e) {}

        // Fetch cloud progress from Cloud Firestore.
        // Hợp nhất chứ không ghi đè: học viên có thể đã học vài chuyên đề ở
        // chế độ khách ngay trên máy này trước khi đăng nhập, ghi đè thẳng bằng
        // dữ liệu đám mây sẽ xoá mất phần đó.
        if (cloudProfile && Array.isArray(cloudProfile.completedModules)) {
          setCompletedModules((prev) =>
            Array.from(new Set([...(Array.isArray(prev) ? prev : []), ...cloudProfile.completedModules]))
          );
        }
        if (cloudProfile && Array.isArray(cloudProfile.completedTradeModules)) {
          setCompletedTradeModules((prev) =>
            Array.from(new Set([...(Array.isArray(prev) ? prev : []), ...cloudProfile.completedTradeModules]))
          );
        }

        // Kéo bản khảo sát từ đám mây về máy này. Cần bước này vì trạng thái
        // "đã làm khảo sát chưa" đọc từ localStorage: học viên đã trả lời trên
        // điện thoại mà đăng nhập bằng máy tính thì máy tính không biết, và sẽ
        // hỏi lại từ đầu. `mergeCloudSurvey` chỉ ghi đè theo một chiều — bản
        // đám mây đã hoàn tất đè lên bản tại máy còn dở, không bao giờ ngược
        // lại.
        if (cloudProfile && cloudProfile.survey) {
          mergeCloudSurvey(user.email, cloudProfile.survey);
          setSurveyRevision((n) => n + 1);
        }
      } else {
        // Đăng xuất thì hạ chốt chặn xuống, nếu không màn hình hoàn tất hồ sơ
        // sẽ treo lại trên một phiên không còn tồn tại.
        setNeedsProfileCompletion(false);

        // Không có phiên Firebase thì cũng không thể là quản trị viên — quyền
        // chỉ cấp sau khi máy chủ xác nhận một phiên thật. Vậy là đã biết câu
        // trả lời, không phải "chưa hỏi xong".
        //
        // Bắt buộc phải đặt cờ ở nhánh này: học viên đăng nhập bằng nhánh dự
        // phòng tại máy không hề có phiên Firebase, bỏ sót thì họ không bao giờ
        // được mời làm khảo sát nữa.
        roleResolvedForEmailRef.current = null;
        setRoleResolved(true);
      }
    });
    return () => unsubscribe();
  }, []);

  /* ẢNH BÌA TRANG CHỦ — băng ảnh do quản trị viên cấu hình.
   *
   * Nghe theo thời gian thực cho MỌI người, kể cả khách chưa đăng nhập: ảnh bìa
   * là nội dung công khai, và nghe liên tục nghĩa là quản trị viên đổi ảnh thì
   * người đang mở trang thấy ngay, không phải chờ họ tải lại.
   *
   * `null` từ listener nghĩa là CHƯA ĐỌC ĐƯỢC (mất mạng, rules chưa dán), khác
   * hẳn mảng rỗng nghĩa là "đã đọc xong, chưa cấu hình ảnh nào". Với `null` thì
   * giữ nguyên thứ đang có — ghi đè bằng mảng rỗng sẽ làm ảnh bìa đang hiện
   * bỗng nhảy về ảnh mặc định mỗi lần sóng chập chờn.
   */
  const [coverBanners, setCoverBanners] = useState([]);
  const [coverIntervalMs, setCoverIntervalMs] = useState(COVER_INTERVAL_DEFAULT_MS);

  useEffect(() => {
    const stopBanners = listenToCoverBanners((list) => {
      if (Array.isArray(list)) setCoverBanners(list);
    });
    const stopConfig = listenToCoverSliderConfig((cfg) => {
      if (cfg) setCoverIntervalMs(normalizeCoverInterval(cfg.intervalMs));
    });
    return () => {
      stopBanners?.();
      stopConfig?.();
    };
  }, []);

  /**
   * Nhặt kết quả của lần đăng nhập Google bằng cách chuyển trang.
   *
   * Chạy đúng một lần lúc khởi động. Thành công thì không làm gì — listener
   * `onAuthStateChanged` ở trên đã lo. Chỉ quan tâm trường hợp THẤT BẠI: đây là
   * nơi duy nhất lấy được lý do, và không hiện ra thì học viên quay về màn hình
   * cũ mà không hiểu vì sao mình vẫn chưa đăng nhập được.
   */
  useEffect(() => {
    let cancelled = false;
    consumeGoogleRedirectResult().then((result) => {
      if (cancelled || result.ok || !result.code) return;
      setGoogleAuthError(result.code);
      setIsAuthOpen(true);
    });
    return () => { cancelled = true; };
  }, []);

  const [adminCertStudentName, setAdminCertStudentName] = useState("");
  // Khoá học của tấm bằng mà quản trị viên đang cấp ('main' | 'trade').
  const [adminCertCourse, setAdminCertCourse] = useState('main');

  const handleAdminIssueCertificate = (studentName, course = 'main') => {
    setAdminCertStudentName(studentName);
    setAdminCertCourse(course);
    setIsCertOpen(true);
  };

  // Persistent user progress in localStorage scoped to currentUser
  const getProgressStorageKey = (user) => user ? `dmm_completed_modules_${user.id}` : 'dmm_completed_modules';

  const [completedModules, setCompletedModules] = useState(() => {
    try {
      const savedUser = localStorage.getItem('dmm_active_user');
      const userObj = savedUser ? JSON.parse(savedUser) : null;
      const key = getProgressStorageKey(userObj);
      const saved = localStorage.getItem(key);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  // Tiến độ khoá nâng cao Trade Marketing. Giữ riêng khỏi completedModules vì
  // hai khoá tính tốt nghiệp độc lập: điều kiện nhận Bằng Chứng Nhận và điều
  // kiện mở khoá Trade đều chỉ đếm trên khoá chính.
  const getTradeProgressStorageKey = (user) =>
    user ? `dmm_completed_trade_${user.id}` : 'dmm_completed_trade';

  const [completedTradeModules, setCompletedTradeModules] = useState(() => {
    try {
      const savedUser = localStorage.getItem('dmm_active_user');
      const userObj = savedUser ? JSON.parse(savedUser) : null;
      const saved = localStorage.getItem(getTradeProgressStorageKey(userObj));
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const [selectedTradeModuleId, setSelectedTradeModuleId] = useState(null);

  /**
   * Gói hồ sơ học viên gửi lên Firestore: phần định danh dùng chung, cộng thêm
   * đúng những trường tiến độ mà nơi gọi truyền vào.
   *
   * Ghi lên Firestore dùng `merge: true` nên bỏ trống một trường KHÔNG làm mất
   * trường đó trên máy chủ. Nhờ vậy mỗi effect chỉ cần gửi phần dữ liệu nó sở
   * hữu: effect khoá chính gửi `completedModules`, effect khoá Trade gửi
   * `completedTradeModules`. Tách như vậy để không effect nào phải đọc state
   * của effect kia — thứ vừa sinh ra cảnh báo thiếu dependency, vừa có nguy cơ
   * ghi đè bằng giá trị cũ kẹt trong closure.
   */
  //
  // PHẢI mang theo `avatarUrl`. Hàm này dựng dữ liệu cho các lượt đồng bộ tiến
  // độ học, và `recordStudentAccountToCloud` ghi ĐÈ cả hồ sơ chứ không ghi từng
  // trường. Thiếu `avatarUrl` ở đây thì nó rơi về chuỗi rỗng, nên chỉ cần học
  // viên học xong một bài là ảnh đại diện vừa đặt bị xoá sạch trên máy chủ.
  // Học viên không thể lần ra nguyên nhân, vì việc làm mất ảnh lại là thao tác
  // học bài, chẳng liên quan gì tới hồ sơ.
  const buildStudentPayload = (user, progressFields = {}) => ({
    id: user.id || user.email.replace(/\./g, '_'),
    name: user.name,
    phone: user.phone || 'Chưa cập nhật',
    email: user.email,
    industry: user.industry || 'Kinh doanh',
    avatarUrl: user.avatarUrl || '',
    updatedAt: new Date().toISOString(),
    ...progressFields
  });

  /**
   * Cờ bỏ qua một lượt lưu ngay sau khi đổi tài khoản.
   *
   * Vì sao không so sánh id chủ sở hữu: effect nạp và effect lưu chạy trong
   * CÙNG một lượt commit, effect nạp lại đứng trước. Tới lúc effect lưu chạy
   * thì ref id đã trỏ sang tài khoản mới nhưng biến state `completedModules`
   * vẫn đang giữ giá trị của tài khoản cũ (setState chưa được áp dụng), nên
   * phép so id luôn khớp và vẫn ghi nhầm.
   *
   * Cờ này đánh dấu: lượt chạy kế tiếp của effect lưu là hệ quả của việc đổi
   * tài khoản, không phải do học viên vừa làm xong bài — bỏ qua nó. Lượt sau
   * đó, khi state đã mang dữ liệu của đúng người, việc lưu diễn ra bình thường.
   */
  const skipNextProgressSaveRef = useRef(false);
  const skipNextTradeSaveRef = useRef(false);

  /**
   * Quản trị viên xem được TOÀN BỘ nội dung: không cổng khoá nào áp lên tài
   * khoản này. Ban Quản Trị phải soát được bài giảng, bài kiểm tra và mẫu bằng
   * của mọi khoá để kiểm duyệt, mà bắt họ học lại từ đầu bằng chính tài khoản
   * quản trị thì vừa vô nghĩa vừa làm bẩn số liệu tiến độ học viên.
   *
   * Đặt ở đây — trước mọi phép tính cổng khoá bên dưới — vì các cờ đó đều phải
   * hỏi tới nó.
   *
   * Chỉ đọc `currentUser.role`, thứ duy nhất được cấp sau khi máy chủ xác nhận
   * (xem `resolveAdminRole`). Sửa localStorage không tự phong được quyền xem
   * này, vì `role` khi khôi phục phiên luôn khởi tạo lại là 'student'.
   */
  const isAdmin = currentUser?.role === 'admin';

  // Điều kiện bắt buộc để mở khoá Trade Marketing: hoàn thành TOÀN BỘ khoá
  // Digital Marketing. Dùng phép so khớp theo id chứ không so độ dài mảng —
  // dữ liệu cũ trong máy có thể chứa id chuyên đề đã bị xoá, khiến đếm số
  // lượng vẫn đủ trong khi thực tế còn chuyên đề chưa học.
  //
  // Quản trị viên đứng ngoài điều kiện này (xem `isAdmin` ở trên).
  //
  // Nhận tiến độ qua THAM SỐ chứ không đọc thẳng biến state: phần bàn giao sau
  // khi đăng nhập (xem khối "ĐỊA CHỈ TRÌNH DUYỆT") phải hỏi điều kiện này bằng
  // tiến độ vừa đọc từ localStorage, vì ngay nhịp đó biến state vẫn còn đang
  // giữ tiến độ của người dùng trước. Viết lại công thức ở chỗ kia là tạo
  // nguồn sự thật thứ hai cho cùng một quy tắc, nên chỉ có đúng hàm này.
  const countMainCompleted = (progress) =>
    COURSE_MODULES.filter((m) => progress.includes(m.id)).length;
  const isTradeUnlockedFor = (progress) =>
    isAdmin || countMainCompleted(progress) === COURSE_MODULES.length;

  const mainCompletedCount = countMainCompleted(completedModules);
  const isTradeCourseUnlocked = isTradeUnlockedFor(completedModules);

  // Số chuyên đề Trade đã đạt, dùng làm điều kiện cấp bằng khoá Trade.
  // Đối chiếu theo id vì cùng lý do như trên: đếm độ dài mảng sẽ tính nhầm khi
  // tiến độ cũ trong máy còn id chuyên đề đã bị xoá.
  //
  // Không cần cờ "đủ điều kiện" riêng ở đây: CertificateModal tự chặn bằng
  // `passedCount === totalModules`, và băng mời nhận bằng nằm trong
  // TradeMarketingCourse tự kiểm tra lấy. Thêm cờ thứ ba là thêm một nguồn sự
  // thật nữa phải giữ đồng bộ.
  const tradeCompletedCount = TRADE_MODULES.filter((m) =>
    completedTradeModules.includes(m.id)
  ).length;

  // Quản trị viên đang cấp bằng thủ công cho một học viên khác.
  const isAdminIssuing = Boolean(adminCertStudentName);
  const adminCertTotalModules =
    adminCertCourse === 'trade' ? TRADE_MODULES.length : COURSE_MODULES.length;

  // Kiểm tra lơ là: chạy sau khi đã biết học viên là ai và tiến độ tới đâu.
  // Hoãn 1,2 giây để lời nhắc không đè lên lúc trang vừa tải xong.
  useEffect(() => {
    if (!currentUser) {
      setIsReminderOpen(false);
      return;
    }

    // Quản trị viên KHÔNG bị nhắc học. Lời nhắc này đo số ngày lơ là để kéo học
    // viên quay lại khoá học — Ban Quản Trị vào hệ thống để quản lý, không phải
    // để học, nên với họ nó luôn sai và chỉ gây phiền.
    //
    // Chờ `roleResolved` chứ không chỉ hỏi `isAdmin`: trước khi máy chủ trả
    // lời, mọi tài khoản đều mang tạm vai trò 'student'. Đây đúng là cái bẫy đã
    // làm bảng khảo sát loé lên trên màn hình quản trị viên, và lời nhắc này
    // cũng hoãn 1,2 giây nên dính y hệt.
    if (!roleResolved || isAdmin) {
      setIsReminderOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      const due = shouldRemind({
        hasUser: true,
        completedCount: completedModules.length,
        totalModules: COURSE_MODULES.length,
      });
      if (due) {
        setReminderIdleDays(getIdleDays() ?? 0);
        setIsReminderOpen(true);
      }
    }, 1200);
    return () => clearTimeout(timer);
    // Chỉ chạy khi đổi người dùng hoặc khi vai trò vừa được xác nhận; không
    // chạy lại mỗi lần tiến độ thay đổi để tránh popup bật lên ngay giữa lúc
    // học viên đang làm bài.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, roleResolved, isAdmin]);

  // News list state.
  //
  // Khoá có hậu tố _v3: bản tin đổi cấu trúc lần nữa (thêm ảnh bìa thật, link
  // nguồn, bỏ chuỗi ngày cứng).
  //
  // QUAN TRỌNG — phải HỢP NHẤT chứ không được trả nguyên danh sách đã lưu.
  // Bản trước hễ thấy localStorage có dữ liệu là trả về nguyên xi, nên biên tập
  // viên thêm tin mới vào newsData.js rồi deploy cũng vô ích: mọi người đã từng
  // mở ứng dụng đều bị đóng băng ở danh sách cũ vĩnh viễn. Đó chính là lý do
  // bản tin đứng yên ở 28/07/2026. Nay tin biên tập luôn lấy từ file dữ liệu,
  // phần lưu trong máy chỉ giữ lại những tin do người dùng tự nạp bằng nút Live.
  const [newsFeed, setNewsFeed] = useState(() => {
    let userAdded = [];
    try {
      const saved = localStorage.getItem('dmm_news_feed_v3');
      const parsed = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed)) {
        const curatedIds = new Set(INITIAL_NEWS_ITEMS.map((n) => n.id));
        // Chỉ nhặt tin không có trong file dữ liệu, tức tin nạp từ nút Live.
        // Tin biên tập luôn đọc lại từ file để sửa nội dung là thấy ngay.
        userAdded = parsed.filter((n) => n && n.id && !curatedIds.has(n.id));
      }
    } catch (e) {}
    return [...userAdded, ...INITIAL_NEWS_ITEMS].sort(compareNewsRecency);
  });

  // Nạp lại tiến độ khoá chính mỗi khi đổi tài khoản, đồng thời đăng ký hồ sơ
  // học viên lên Firestore.
  //
  // LUÔN gán state, kể cả khi tài khoản chưa có bản ghi nào. Bản trước chỉ gán
  // khi `localStorage` có dữ liệu, nên học viên mới đăng nhập trên máy dùng
  // chung giữ nguyên tiến độ của người trước; effect lưu ngay bên dưới rồi ghi
  // tiến độ đó sang khoá của họ, và payload gửi lên Firestore cũng mang theo
  // luôn. Một người vừa tạo tài khoản có thể "tốt nghiệp" ngay mà chưa học buổi
  // nào, còn tiến độ thật của người kia thì bị nhân bản sai chỗ.
  useEffect(() => {
    const key = getProgressStorageKey(currentUser);
    let loadedModules = [];
    try {
      const saved = localStorage.getItem(key);
      const parsed = saved ? JSON.parse(saved) : [];
      loadedModules = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      loadedModules = [];
    }
    setCompletedModules(loadedModules);
    skipNextProgressSaveRef.current = true;

    try {
      if (currentUser) {
        localStorage.setItem('dmm_active_user', JSON.stringify(currentUser));
        localStorage.setItem('dmm_student_name', currentUser.name);

        // Dùng `loadedModules` chứ không dùng biến state `completedModules`:
        // trong lượt chạy này state vẫn đang giữ giá trị của tài khoản trước.
        let loadedTrade = [];
        try {
          const t = localStorage.getItem(getTradeProgressStorageKey(currentUser));
          const p = t ? JSON.parse(t) : [];
          loadedTrade = Array.isArray(p) ? p : [];
        } catch (e) {}
        recordStudentAccountToCloud(buildStudentPayload(currentUser, {
          completedModules: loadedModules,
          completedTradeModules: loadedTrade
        }));
      } else {
        localStorage.removeItem('dmm_active_user');
      }
    } catch (e) {
      console.error("Error loading user progress", e);
    }
  }, [currentUser]);

  // Lưu tiến độ khoá chính.
  useEffect(() => {
    if (skipNextProgressSaveRef.current) {
      skipNextProgressSaveRef.current = false;
      return;
    }

    const key = getProgressStorageKey(currentUser);
    try {
      localStorage.setItem(key, JSON.stringify(completedModules));
      if (currentUser) {
        const fullStudentData = buildStudentPayload(currentUser, { completedModules });
        saveUserProgressToCloud(currentUser.id || currentUser.email.replace(/\./g, '_'), fullStudentData);
        recordStudentAccountToCloud(fullStudentData);
      }
      // Ghi nhận tốt nghiệp: đối chiếu theo id chuyên đề chứ không so độ dài
      // mảng, vì dữ liệu cũ có thể chứa id chuyên đề đã bị xoá.
      if (COURSE_MODULES.every((m) => completedModules.includes(m.id))) {
        recordRealStudentGraduate();

        // Thư chúc mừng tốt nghiệp. Không await và không xử lý lỗi ở đây: máy
        // chủ tự chốt gửi đúng một lần (cờ trên Firestore), còn thư hỏng thì
        // tấm bằng vẫn nằm sẵn trong ứng dụng — không đáng để chặn luồng học.
        //
        // Bỏ qua tài khoản quản trị: đây là thư dành cho học viên, và Ban Quản
        // Trị vào hệ thống để quản lý chứ không phải để học.
        if (!isAdmin) {
          sendGraduationEmail();
        }
      }
    } catch (e) {
      console.error("Error saving completed modules", e);
    }
  }, [completedModules, currentUser]);

  // Nạp tiến độ Trade của đúng tài khoản đang đăng nhập.
  // LUÔN gán state kể cả khi chưa có dữ liệu lưu — nếu chỉ gán khi tìm thấy,
  // học viên mới trên máy dùng chung sẽ giữ nguyên tiến độ của người trước rồi
  // effect lưu bên dưới ghi đè tiến độ đó sang khoá của họ.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getTradeProgressStorageKey(currentUser));
      const parsed = saved ? JSON.parse(saved) : [];
      setCompletedTradeModules(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setCompletedTradeModules([]);
    }
    skipNextTradeSaveRef.current = true;
    setSelectedTradeModuleId(null);
  }, [currentUser]);

  // Lưu tiến độ Trade, đồng bộ lên Firestore để đổi máy không mất.
  useEffect(() => {
    if (skipNextTradeSaveRef.current) {
      skipNextTradeSaveRef.current = false;
      return;
    }
    try {
      localStorage.setItem(getTradeProgressStorageKey(currentUser), JSON.stringify(completedTradeModules));
      if (currentUser) {
        saveUserProgressToCloud(
          currentUser.id || currentUser.email.replace(/\./g, '_'),
          buildStudentPayload(currentUser, { completedTradeModules })
        );
      }
    } catch (e) {}
  }, [completedTradeModules, currentUser]);

  // Chỉ lưu tin do người dùng tự nạp. Ghi cả danh sách xuống máy là thừa —
  // tin biên tập đã nằm sẵn trong mã nguồn — và chính là thứ khoá cứng bản tin
  // ở phiên bản cũ. Dọn luôn khoá _v2 để máy đã dùng lâu không giữ rác.
  useEffect(() => {
    try {
      const curatedIds = new Set(INITIAL_NEWS_ITEMS.map((n) => n.id));
      const userAdded = newsFeed.filter((n) => !curatedIds.has(n.id));
      localStorage.setItem('dmm_news_feed_v3', JSON.stringify(userAdded));
      localStorage.removeItem('dmm_news_feed_v2');
    } catch (e) {}
  }, [newsFeed]);

  const selectedModule = COURSE_MODULES.find(m => m.id === selectedModuleId);

  /* Đang ở trong một bài học — của khoá chính hay khoá Trade đều tính.

     Điều kiện có cả `activeTab`: `selectedModuleId` không tự xoá khi học viên
     bấm sang Từ Điển hay Tin Tức, nên chỉ hỏi mỗi nó thì các tab khác cũng bị
     thu gọn theo, mất luôn danh sách chuyên đề ở những nơi chẳng liên quan. */
  const isFocusMode =
    (activeTab === 'course' && !!selectedModule) ||
    (activeTab === 'trade' && isTradeCourseUnlocked && !!selectedTradeModuleId);

  // Sidebar chỉ biến mất khi đang tập trung VÀ học viên chưa chủ động bung lại.
  const isSidebarHidden = isFocusMode && !focusSidebarOpen;

  // Đổi bài thì thu gọn trở lại. Xem lý do ở chỗ khai báo `focusSidebarOpen`.
  useEffect(() => {
    setFocusSidebarOpen(false);
  }, [selectedModuleId, selectedTradeModuleId]);

  const [migrationNotice, setMigrationNotice] = useState('');

  /* ================= ĐỊA CHỈ TRÌNH DUYỆT ==================

     Mỗi màn hình một địa chỉ dán được vào tin nhắn: `/digital-marketing/module-01`,
     `/ban-tin/<id tin>`, `/cong-cu/roas`, `/thuat-ngu/roas`... Quy tắc dịch
     địa chỉ ⇄ trạng thái nằm gọn trong `utils/appRoutes.js`; ở đây chỉ còn ba
     việc: nhận địa chỉ lúc mở trang, ghi địa chỉ mới khi học viên bấm chuyển,
     và nghe nút Lùi của trình duyệt.

     BA CHỖ DỄ VỠ — đừng gỡ khi sửa về sau:

     1. CỔNG KHOÁ PHẢI KIỂM TRA Ở ĐÂY NỮA. Địa chỉ tĩnh là một lối vào chuyên
        đề hoàn toàn mới: dán thẳng vào thanh địa chỉ là không đi qua
        `handleProtectedSelectModule`. Thiếu chốt này thì tính năng vừa thêm
        chính là cửa hậu vượt tiến độ học.

     2. CHƯA NHẬN XONG ĐỊA CHỈ VÀO THÌ CHƯA ĐƯỢC GHI ĐÈ NÓ. Lúc mới dựng,
        `selectedModuleId` vẫn là null nên địa chỉ dựng lại từ state sẽ ra `/`;
        ghi ngay là xoá mất `/digital-marketing/module-03` mà học viên vừa mở. Cờ
        `initialRouteAppliedRef` giữ ngòi bút lại cho tới khi nhận xong.

     3. CHỈ NHẬN ĐỊA CHỈ SAU KHI BIẾT AI ĐANG ĐĂNG NHẬP (`roleResolved`). Effect
        nạp tiến độ Trade xoá `selectedTradeModuleId` mỗi lần `currentUser` đổi;
        nhận sớm hơn thì liên kết tới chuyên đề Trade bị chính effect đó dọn đi
        vài trăm mili giây sau khi mở, và không ai hiểu vì sao.

     Ba effect bên dưới CỐ Ý không khai `applyRoute` và `syncDocumentTitle` vào
     mảng phụ thuộc, nên trình kiểm lỗi sẽ than phiền. Hai hàm đó dựng lại sau
     mỗi lần kết xuất; khai vào là effect ghi địa chỉ chạy theo từng lần kết
     xuất thay vì theo từng lần đổi màn hình. Đừng "sửa" cảnh báo đó. */

  /* Mục đang mở ở ba tab KHÔNG phải khoá học: thuật ngữ, tin, công cụ.

     Ba tab này trước đây tự giữ lựa chọn bên trong component nên App không có
     gì để ghi ra địa chỉ. Nay lựa chọn nằm ở đây và truyền xuống. Khoá học
     KHÔNG dùng biến này vì đã có sẵn `selectedModuleId` và
     `selectedTradeModuleId` — thêm nguồn sự thật thứ hai cho cùng một thứ là
     tự chuốc lấy cảnh hai bên lệch nhau.

     Lấy luôn từ địa chỉ lúc dựng lần đầu: ba tab này không có cổng khoá nào
     nên không phải chờ ai, mở `/ban-tin/<id>` là thấy đúng tin ngay.

     LƯU CẢ TAB SỞ HỮU chứ không lưu mỗi định danh. Ba tab dùng chung một biến,
     mà `setActiveTab` được gọi từ nhiều nơi không đi qua một cửa nào cả (thanh
     điều hướng dưới đáy trên điện thoại gọi thẳng). Chỉ lưu định danh thì đang
     mở công cụ 'roas' rồi bấm sang Bản Tin sẽ đẻ ra địa chỉ lai `/ban-tin/roas`
     — một địa chỉ không mô tả màn hình nào có thật. Kèm tên tab vào thì định
     danh tự vô hiệu khi rời tab, không cần ai nhớ đi dọn. */
  const [activeItem, setActiveItem] = useState(() => {
    const route = parseRoute(window.location.pathname);
    return route && route.tab !== 'course' && route.tab !== 'trade' && route.itemId
      ? { tab: route.tab, id: route.itemId }
      : null;
  });
  const activeItemId = activeItem?.tab === activeTab ? activeItem.id : null;

  /** Mở (hoặc đóng, khi `id` là null) một mục thuộc tab đang xem. */
  const openItem = (tab, id) => setActiveItem(id ? { tab, id } : null);

  /* Bài học đang đọc trong chuyên đề khoá chính — tầng thứ ba của địa chỉ.
     Khoá chính có 11 chuyên đề nhưng 36 bài học, và cả 36 bài nằm chung trên
     một trang cuộn. Không có tầng này thì gửi liên kết chỉ nói được "chuyên đề
     4", người nhận vẫn phải tự dò xem là bài nào trong bốn bài.

     Lưu KÈM chuyên đề sở hữu, cùng lý do như `activeItem`: định danh bài học
     chỉ có nghĩa bên trong đúng chuyên đề của nó, nên gắn tên chuyên đề vào là
     nó tự vô hiệu khi học viên sang bài khác — không nơi nào phải nhớ đi dọn. */
  const [activeSection, setActiveSection] = useState(null);
  const activeSectionId =
    activeSection?.moduleId === selectedModuleId ? activeSection.id : null;

  // Mục đang mở của màn hình hiện tại, gộp ba nguồn về một để `appRoutes` hiểu.
  const routeItemId =
    activeTab === 'course' ? selectedModuleId
      : activeTab === 'trade' ? selectedTradeModuleId
        : activeItemId;

  // Tầng thứ ba hiện chỉ khoá chính dùng tới.
  const routeSubId = activeTab === 'course' ? activeSectionId : null;

  /**
   * Lọc định danh chuyên đề khoá chính lấy từ địa chỉ.
   *
   * @param {string|null} itemId Chuyên đề mà địa chỉ yêu cầu.
   * @param {string[]} progress Tiến độ dùng để xét cổng khoá. Truyền vào chứ
   *   không đọc thẳng `completedModules`: ngay nhịp đăng nhập xong, biến state
   *   đó vẫn đang giữ tiến độ của người trước (xem effect nạp tiến độ, chỗ ghi
   *   chú "trong lượt chạy này state vẫn đang giữ giá trị của tài khoản trước").
   * @returns {{id: string|null, awaitingLogin?: boolean}}
   *   `awaitingLogin` báo cho nơi gọi biết đây là rào CÓ THỂ VƯỢT NGAY, khác
   *   hẳn rào tiến độ. Nơi gọi dựa vào đó để giữ nguyên thanh địa chỉ.
   */
  const admitCourseModule = (itemId, progress) => {
    if (!itemId) return { id: null };

    if (!COURSE_MODULES.some((m) => m.id === itemId)) {
      setMigrationNotice('Đường dẫn trỏ tới một chuyên đề không còn tồn tại. Đã đưa bạn về trang tổng quan khoá học.');
      return { id: null };
    }

    // Giữ đúng thứ tự chốt chặn của `handleProtectedSelectModule`: hỏi đăng
    // nhập trước, vì người chưa có tài khoản thì nói chuyện tiến độ là vô nghĩa.
    if (!currentUser) {
      setMigrationNotice('🔒 Vui lòng Đăng Ký / Đăng Nhập tài khoản học viên để tham gia học & làm bài trắc nghiệm!');
      setIsAuthOpen(true);
      return { id: null, awaitingLogin: true };
    }

    const gateMessage = getGateMessage(COURSE_MODULES, itemId, progress, isAdmin);
    if (gateMessage) {
      setMigrationNotice(gateMessage);
      return { id: null };
    }

    markStudyActivity();
    setIsReminderOpen(false);
    return { id: itemId };
  };

  /** Như trên, cho khoá Trade Marketing. */
  const admitTradeModule = (itemId, progress) => {
    if (!itemId) return { id: null };

    if (!TRADE_MODULES.some((m) => m.id === itemId)) {
      setMigrationNotice('Đường dẫn trỏ tới một chuyên đề Trade không còn tồn tại. Đã đưa bạn về trang tổng quan khoá.');
      return { id: null };
    }

    // Chưa đăng nhập thì phán quyết "khoá này còn khoá" chưa phải phán quyết
    // cuối: điều kiện mở khoá tính trên tiến độ của một tài khoản cụ thể, mà
    // ở đây chưa biết là tài khoản nào.
    if (!currentUser) {
      setMigrationNotice('🔒 Vui lòng Đăng Ký / Đăng Nhập tài khoản học viên để vào khoá Trade Marketing!');
      setIsAuthOpen(true);
      return { id: null, awaitingLogin: true };
    }

    // Khoá còn khoá thì im lặng đưa về trang tổng quan của nó: màn hình đó đã
    // nói rõ điều kiện mở khoá rồi, thêm một băng thông báo nữa là nói hai lần.
    if (!isTradeUnlockedFor(progress)) return { id: null };

    markStudyActivity();
    setIsReminderOpen(false);
    return { id: itemId };
  };

  /**
   * Đưa ứng dụng về đúng màn hình mà một địa chỉ mô tả.
   *
   * @param {{progress?: string[]}} [options] Tiến độ dùng để xét cổng khoá.
   *   Bỏ trống thì lấy biến state, đúng cho mọi lối gọi trừ lối bàn giao ngay
   *   sau khi đăng nhập.
   * @returns {{route: {tab: string, itemId: string|null}, awaitingLogin: boolean}}
   *   `route` là màn hình THẬT SỰ mở ra sau khi qua cổng khoá — có thể khác
   *   địa chỉ được yêu cầu. Nơi gọi dùng nó để sửa thanh địa chỉ cho khớp, nếu
   *   không thì màn hình hiện trang tổng quan trong khi địa chỉ vẫn khoe một
   *   chuyên đề còn khoá, và học viên lưu đúng địa chỉ đó vào dấu trang.
   *   `awaitingLogin` thì NGƯỢC LẠI — xem chỗ gọi.
   *
   * CỐ Ý chỉ đặt định danh của tab đích, không dọn hai tab kia: học viên đang
   * học dở mà ghé Từ Điển rồi bấm quay lại Khoá Học thì phải về đúng bài đang
   * đọc. Xoá sạch ở đây là lấy mất thói quen đó.
   */
  const applyRoute = (route, options = {}) => {
    const tab = TAB_SEGMENTS[route?.tab] ? route.tab : HOME_ROUTE.tab;
    const requestedId = route?.itemId || null;
    const requestedSubId = route?.subId || null;
    const progress = options.progress || completedModules;

    setActiveTab(tab);

    if (tab === 'course') {
      const { id, awaitingLogin } = admitCourseModule(requestedId, progress);
      setSelectedModuleId(id);

      // Bài học phải thuộc đúng chuyên đề vừa mở. Ghép bài của chuyên đề khác
      // vào là cuộn tới một chỗ không tồn tại, người dùng chỉ thấy trang đứng
      // yên và tưởng liên kết hỏng.
      const openedModule = id ? COURSE_MODULES.find((m) => m.id === id) : null;
      const subId =
        openedModule && requestedSubId && openedModule.sections.some((s) => s.id === requestedSubId)
          ? requestedSubId
          : null;
      setActiveSection(subId ? { moduleId: id, id: subId } : null);

      return { route: { tab, itemId: id, subId }, awaitingLogin: !!awaitingLogin };
    }

    if (tab === 'trade') {
      const { id, awaitingLogin } = admitTradeModule(requestedId, progress);
      setSelectedTradeModuleId(id);
      return { route: { tab, itemId: id, subId: null }, awaitingLogin: !!awaitingLogin };
    }

    // Ba tab còn lại không có cổng khoá, chỉ cần loại định danh không có thật —
    // tin mô phỏng do nút Live sinh ra chỉ nằm trong máy của chính người bấm,
    // nên liên kết loại đó gửi đi là chắc chắn rơi vào nhánh này.
    const catalogHasItem =
      tab === 'news' ? newsFeed.some((n) => n.id === requestedId)
        : tab === 'glossary' ? GLOSSARY_ITEMS.some((g) => g.id === requestedId)
          : MANAGER_TOOLS.some((t) => t.id === requestedId);

    const admitted = requestedId && catalogHasItem ? requestedId : null;
    if (requestedId && !admitted && tab === 'news') {
      setMigrationNotice('Tin trong đường dẫn không có trong bản tin của máy này. Đã mở danh sách tin mới nhất.');
    }
    openItem(tab, admitted);
    return { route: { tab, itemId: admitted, subId: null }, awaitingLogin: false };
  };

  /** Tên mục đang mở, dùng đặt tiêu đề tab trình duyệt và tên dấu trang. */
  const resolveItemLabel = (route) => {
    if (!route?.itemId) return '';
    switch (route.tab) {
      case 'course': {
        const m = COURSE_MODULES.find((x) => x.id === route.itemId);
        if (!m) return '';
        // Đang đọc một bài cụ thể thì lấy tên bài, vì đó mới là thứ trên màn
        // hình. Tên bài đã tự đánh số ("2. Khung phân bổ 60/40") nên ghép với
        // số chuyên đề là đọc ra ngay vị trí.
        const sec = route.subId ? m.sections.find((s) => s.id === route.subId) : null;
        return sec
          ? `${sec.title} — Chuyên đề ${m.number}`
          : `Chuyên đề ${m.number} — ${m.title}`;
      }
      case 'trade': {
        const m = TRADE_MODULES.find((x) => x.id === route.itemId);
        return m ? `Chuyên đề ${m.number} — ${m.title}` : '';
      }
      case 'news':
        return newsFeed.find((x) => x.id === route.itemId)?.title || '';
      case 'glossary':
        return GLOSSARY_ITEMS.find((x) => x.id === route.itemId)?.term || '';
      case 'tools':
        return MANAGER_TOOLS.find((x) => x.id === route.itemId)?.label || '';
      default:
        return '';
    }
  };

  const initialRouteAppliedRef = useRef(false);
  const lastRouteRef = useRef(null);

  /** Đặt tiêu đề tab trình duyệt theo màn hình đang mở. */
  const syncDocumentTitle = (route) => {
    document.title = buildDocumentTitle(route, resolveItemLabel(route));
  };

  /**
   * Ghi địa chỉ, giữ nguyên phần query và hash mà nơi khác có thể đang dùng.
   *
   * KHÔNG viết đè khi địa chỉ đang hiển thị đã mô tả đúng màn hình này, dù nó
   * viết khác cách. Một màn hình có thể có nhiều lối vào hợp lệ: `/` và
   * `/digital-marketing` cùng ra tổng quan khoá chính, `/chuyen-de/module-01` là tên cũ
   * của `/digital-marketing/module-01`. Thiếu luật này thì ai mở trang chủ cũng bị đổi
   * địa chỉ thành `/digital-marketing` ngay trước mắt — trang chủ mất địa chỉ trang chủ,
   * và mọi liên kết cũ vừa mở ra đã bị viết lại thành tên mới.
   *
   * Địa chỉ do ứng dụng SINH RA thì vẫn luôn là dạng chuẩn (`buildPath`). Luật
   * này chỉ tôn trọng thứ người dùng tự gõ hoặc tự bấm vào.
   *
   * `handleGoHome` là nơi duy nhất KHÔNG đi qua hàm này, vì nó cố tình ghi ra
   * `/` chứ không ghi dạng chuẩn — xem lý do ở đó.
   */
  const writeHistory = (route, mode) => {
    if (isSameRoute(parseRoute(window.location.pathname), route)) return;

    const url = buildPath(route) + window.location.search + window.location.hash;
    if (mode === 'replace') window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
  };

  // 1. NHẬN ĐỊA CHỈ LÚC MỞ TRANG. Chạy đúng một lần, ngay khi đã biết ai đang
  //    đăng nhập (xem chỗ dễ vỡ số 3 phía trên).
  useEffect(() => {
    if (initialRouteAppliedRef.current || !roleResolved) return;
    initialRouteAppliedRef.current = true;

    const route = parseRoute(window.location.pathname);

    // Địa chỉ không nhận ra: đưa về trang chủ và DỌN LUÔN thanh địa chỉ. Để
    // nguyên `/khoahoc` sai chính tả trong khi hiện trang chủ thì người dùng
    // lưu lại đúng cái địa chỉ hỏng đó, và lần sau vẫn hỏng.
    const { route: effective, awaitingLogin } = applyRoute(route || HOME_ROUTE);
    lastRouteRef.current = effective;
    if (!awaitingLogin) writeHistory(effective, 'replace');

    // Đặt tiêu đề NGAY tại đây, không đợi effect ghi địa chỉ bên dưới. Mở thẳng
    // `/ban-tin/<id>` thì trạng thái đã đúng từ lúc dựng nên effect kia không
    // có gì để chạy — bỏ dòng này là dấu trang lưu lại mang tên trang chủ,
    // đúng cái tên vô nghĩa mà tính năng này sinh ra để tránh.
    syncDocumentTitle(effective);
  }, [roleResolved]);

  // 2. GHI ĐỊA CHỈ MỚI KHI MÀN HÌNH ĐỔI.
  //
  //    Đẩy thêm mục lịch sử hay thay tại chỗ, quy tắc là: việc gì học viên coi
  //    là "đi tới chỗ khác" thì đẩy thêm, để nút Lùi quay về được. Đổi công cụ
  //    trong cùng bộ công cụ thì không — tám công cụ là tám lăng kính của cùng
  //    một màn hình, đẩy hết vào lịch sử thì bấm Lùi mười lần mới thoát nổi
  //    trang, trong khi địa chỉ vẫn dán gửi được như thường.
  useEffect(() => {
    if (!initialRouteAppliedRef.current) return;

    const route = { tab: activeTab, itemId: routeItemId, subId: routeSubId };
    syncDocumentTitle(route);

    if (isSameRoute(lastRouteRef.current, route)) return;

    const prev = lastRouteRef.current;
    const stayedInTools = prev?.tab === 'tools' && route.tab === 'tools';

    // Cuộn qua bài kế tiếp trong CÙNG một chuyên đề không phải là "đi tới chỗ
    // khác" — vẫn đang đọc đúng trang đó. Đẩy vào lịch sử thì cuộn hết một
    // chuyên đề bốn bài là bấm Lùi bốn lần mới ra khỏi nó.
    const scrolledWithinModule =
      prev?.tab === route.tab && prev?.itemId === route.itemId && prev?.subId !== route.subId;

    writeHistory(route, stayedInTools || scrolledWithinModule ? 'replace' : 'push');
    lastRouteRef.current = route;
  }, [activeTab, routeItemId, routeSubId, newsFeed]);

  // 3. NÚT LÙI / TIẾN CỦA TRÌNH DUYỆT.
  //
  //    Trước đây bấm Lùi là rời hẳn ứng dụng, kể cả khi chỉ muốn đóng một cửa
  //    sổ tin. Nay Lùi đi ngược đúng lối vừa đi. Trên điện thoại đây là thay
  //    đổi đáng giá nhất của cả tính năng: nút Lùi cứng của máy đóng được cửa
  //    sổ chi tiết, thay vì ném học viên ra khỏi bài đang đọc.
  useEffect(() => {
    const handlePopState = () => {
      const { route: effective, awaitingLogin } = applyRoute(
        parseRoute(window.location.pathname) || HOME_ROUTE
      );
      lastRouteRef.current = effective;
      // Cổng khoá có thể đổi đích so với địa chỉ vừa lùi về. Sửa tại chỗ chứ
      // không đẩy thêm mục mới, nếu không bấm Lùi lần nữa lại rơi về đúng địa
      // chỉ bị chặn — một cái bẫy không có lối ra.
      if (!awaitingLogin) writeHistory(effective, 'replace');
      syncDocumentTitle(effective);

      // Địa chỉ có chỉ đích tới một bài học thì ĐỪNG kéo lên đầu trang:
      // LessonViewer đang cuộn tới đúng bài đó, hai lệnh cuộn cùng lúc chỉ tổ
      // giằng nhau rồi dừng ở một chỗ không ai chọn.
      if (!effective.subId) window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser, completedModules, isAdmin, isTradeCourseUnlocked, newsFeed]);

  // 4. BÀN GIAO SAU KHI ĐĂNG NHẬP.
  //
  //    Khách bấm liên kết một bài học sẽ được mời đăng ký, và địa chỉ bài đó
  //    được GIỮ NGUYÊN trên thanh địa chỉ (`awaitingLogin` ở các nhánh trên).
  //    Đăng nhập xong thì đọc lại chính địa chỉ ấy để vào thẳng bài.
  //
  //    Dùng thanh địa chỉ làm chỗ ghi nhớ thay vì một biến riêng, vì đây là
  //    chỗ duy nhất SỐNG SÓT QUA MỘT LẦN TẢI LẠI TRANG. Đăng nhập bằng Google
  //    là chuyển hẳn sang trang của Google rồi quay về, cả ứng dụng dựng lại
  //    từ đầu; mọi biến trong bộ nhớ đều mất, còn địa chỉ thì Firebase trả về
  //    nguyên vẹn — nhánh đó tự chạy đúng mà không cần thêm dòng nào.
  //
  //    Thêm một lợi ích: khách bỏ ý định, tự bấm sang Bản Tin rồi mới đăng
  //    nhập thì địa chỉ đã đổi theo, không còn đích nào để bàn giao. Không cần
  //    ai nhớ đi xoá ý định cũ.
  const hadUserRef = useRef(!!currentUser);
  useEffect(() => {
    const hasUser = !!currentUser;
    const justLoggedIn = hasUser && !hadUserRef.current;
    hadUserRef.current = hasUser;

    if (!justLoggedIn || !initialRouteAppliedRef.current) return;

    const route = parseRoute(window.location.pathname);
    if (!route?.itemId) return;

    // Đọc tiến độ THẲNG TỪ localStorage của đúng tài khoản vừa đăng nhập.
    // Ngay nhịp này biến `completedModules` vẫn đang giữ tiến độ của phiên
    // trước — chính effect nạp tiến độ cũng phải tự đọc như vậy vì lý do đó,
    // xem ghi chú của nó. Tin vào biến state ở đây là chặn nhầm học viên cũ
    // khỏi đúng chuyên đề mà họ đã học xong từ lâu.
    let progress = [];
    try {
      const saved = localStorage.getItem(getProgressStorageKey(currentUser));
      const parsed = saved ? JSON.parse(saved) : [];
      progress = Array.isArray(parsed) ? parsed : [];
    } catch (e) {}

    const { route: effective } = applyRoute(route, { progress });
    lastRouteRef.current = effective;
    writeHistory(effective, 'replace');
    syncDocumentTitle(effective);
  }, [currentUser]);

  /* ================= HỘP THƯ HỖ TRỢ ==================
     Lời nhắn học viên gửi từ khung chat Pipi. Kênh theo dõi đặt Ở ĐÂY chứ không
     đặt trong SupportInboxModal, vì chuông trên Header cũng cần đúng danh sách
     này: mở hai kênh cho cùng một collection thì hai nơi sẽ lệch nhau đúng vào
     lúc có tin mới — mà tin mới là lúc duy nhất bộ đếm có việc để làm. */

  // `null` = CHƯA đọc được (chưa phải quản trị viên, mất mạng, thiếu quyền).
  // `[]`   = đọc được và hộp thư đang rỗng.
  // Không được gộp hai trạng thái: gộp thì lúc hỏng, giao diện báo "chưa có lời
  // nhắn nào" trong khi có học viên đang chờ trả lời.
  const [supportMessages, setSupportMessages] = useState(null);
  const [isSupportInboxOpen, setIsSupportInboxOpen] = useState(false);

  const supportUnreadCount = Array.isArray(supportMessages)
    ? supportMessages.filter((m) => (m.status || 'new') === 'new').length
    : 0;

  useEffect(() => {
    // Học viên thường không có quyền đọc collection này (xem firestore.rules),
    // nên không mở kênh — mở ra chỉ tổ nhận về một lỗi permission-denied mỗi
    // lần tải trang.
    if (!isAdmin) {
      setSupportMessages(null);
      return;
    }
    const unsub = listenToSupportMessages((list) => setSupportMessages(list));
    return () => { if (typeof unsub === 'function') unsub(); };
  }, [isAdmin]);

  // Số chưa đọc ở lượt trước, để phân biệt "có tin mới" với "vừa nạp xong lần
  // đầu". Dùng ref chứ không dùng state: giá trị này chỉ để so sánh, đưa vào
  // state sẽ kích hoạt thêm một lượt vẽ lại mà không đổi gì trên màn hình.
  const prevSupportUnreadRef = useRef(null);

  useEffect(() => {
    if (!isAdmin || !Array.isArray(supportMessages)) {
      prevSupportUnreadRef.current = null;
      return;
    }
    const prev = prevSupportUnreadRef.current;
    prevSupportUnreadRef.current = supportUnreadCount;

    // Bỏ qua lượt nạp đầu tiên. Không bỏ thì cứ mở trang là quản trị viên lại
    // bị báo về những lời nhắn cũ họ đã biết từ hôm trước.
    if (prev === null || supportUnreadCount <= prev) return;
    setMigrationNotice(
      `✉️ Có ${supportUnreadCount - prev} lời nhắn hỗ trợ mới từ học viên. Mở Hộp Thư để xem.`
    );
  }, [isAdmin, supportMessages, supportUnreadCount]);

  // Chặn ở tầng hành động chứ không chỉ ẩn nút — cùng lý do với Bảng Quản Trị.
  const openSupportInbox = () => {
    if (!isAdmin) {
      setMigrationNotice('🔒 Hộp Thư Hỗ Trợ chỉ dành cho Ban Quản Trị Học Viện.');
      return;
    }
    setIsSupportInboxOpen(true);
  };

  const handleSupportStatus = (id, status) =>
    setSupportMessageStatus(id, status, currentUser?.email);

  /* ================= KHẢO SÁT NHU CẦU HỌC VIÊN ==================
     Lịch xuất hiện, theo đúng thứ tự leo thang:
       1. Ngay sau khi đăng ký xong    -> bỏ qua được
       2. Mỗi lần đăng nhập sau đó     -> bỏ qua được
       3. Lúc bấm nhận Bằng Chứng Nhận -> KHÔNG bỏ qua được

     Bước 3 là chốt chặn thật. Hai bước đầu chỉ là lời mời; đặt cả ba đều mời
     thì bộ dữ liệu sẽ thủng đúng ở nhóm học viên đi tới cuối khoá — nhóm đáng
     phân tệp nhất. */

  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isSurveyMandatory, setIsSurveyMandatory] = useState(false);

  // Tấm bằng đang chờ mở sau khi làm xong khảo sát: 'main' | 'trade' | null.
  // Cần nhớ lại vì học viên bấm nút bằng nào thì phải mở đúng bằng đó, chứ
  // không phải cứ xong khảo sát là mở bằng khoá chính.
  const [certAfterSurvey, setCertAfterSurvey] = useState(null);

  // Đếm số lần bản khảo sát tại máy thay đổi, để các giá trị suy ra từ nó được
  // tính lại. `hasCompletedSurvey()` đọc localStorage — thứ React không theo
  // dõi được — nên thiếu mốc này thì giao diện vẫn giữ nguyên trạng thái cũ sau
  // khi học viên vừa bấm xong câu cuối.
  const [surveyRevision, setSurveyRevision] = useState(0);

  const surveyDone = React.useMemo(
    () => (currentUser?.email ? hasCompletedSurvey(currentUser.email) : true),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser?.email, surveyRevision]
  );

  // Quản trị viên KHÔNG bị hỏi: khảo sát này để phân tệp học viên, còn Ban Quản
  // Trị thì đã biết mình là ai. Chặn họ chỉ tổ làm bẩn dữ liệu phân tệp.
  //
  // `roleResolved` là điều kiện quyết định, không phải để cho chắc: thiếu nó thì
  // trong lúc còn chờ máy chủ trả lời, quản trị viên bị coi tạm là học viên và
  // bảng khảo sát bật lên trên màn hình của họ. Chờ biết chắc rồi mới hỏi —
  // muộn vài trăm mili-giây, đổi lại không bao giờ hỏi nhầm người.
  const shouldAskSurvey = Boolean(currentUser) && roleResolved && !isAdmin && !surveyDone;

  const openSurvey = (mandatory = false) => {
    setIsSurveyMandatory(mandatory);
    setIsSurveyOpen(true);
  };

  // Phần đã trả lời ở lần trước, để bảng khảo sát mở lại đúng câu còn thiếu.
  const savedSurveyAnswers = React.useMemo(
    () => (currentUser?.email ? readSurvey(currentUser.email).answers : {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser?.email, surveyRevision]
  );

  const handleSurveySubmit = (record) => {
    const email = currentUser?.email;
    if (!email) {
      // Không có email thì không lưu được, nhưng vẫn phải đóng bảng — để mở
      // thì học viên kẹt lại với một nút "Đang lưu..." không bao giờ xong.
      setIsSurveyOpen(false);
      setIsSurveyMandatory(false);
      setCertAfterSurvey(null);
      return;
    }

    const previous = readSurvey(email);
    const saved = { ...record, skips: previous.skips };

    // Ghi tại máy TRƯỚC, rồi mới bắn lên Cloud. Máy chủ hỏng thì học viên vẫn
    // không bị hỏi lại — đó là thứ họ cảm nhận được ngay, còn báo cáo của Ban
    // Quản Trị thì chờ được tới lần đồng bộ sau.
    writeSurvey(email, saved);
    setSurveyRevision((n) => n + 1);
    saveSurveyToCloud(email, saved);

    setIsSurveyOpen(false);
    setIsSurveyMandatory(false);

    // Mở đúng tấm bằng đang chờ, nếu khảo sát này bật lên từ bước cấp bằng.
    if (certAfterSurvey === 'main') setIsCertOpen(true);
    if (certAfterSurvey === 'trade') setIsTradeCertOpen(true);
    setCertAfterSurvey(null);

    setMigrationNotice('🎉 Cảm ơn bạn! Học Viện sẽ dùng câu trả lời này để thiết kế khoá nâng cao phù hợp.');
    setTimeout(() => setMigrationNotice(''), 6000);
  };

  /**
   * Bỏ qua khảo sát — nhưng KHÔNG vứt phần đã bấm.
   *
   * Trả lời dở dang vẫn là dữ liệu: biết học viên dừng ở câu nào cũng nói lên
   * điều gì đó, và giữ lại thì lần sau họ mở ra là tiếp đúng câu còn thiếu chứ
   * không phải bấm lại từ đầu — thứ khiến người ta bỏ qua thêm một lần nữa.
   *
   * Ghi KHÔNG kèm `completedAt`, nên bản ghi này không bao giờ bị nhầm là đã
   * hoàn tất: cả `hasCompletedSurvey()` lẫn cột trong Bảng Quản Trị đều đòi có
   * `completedAt` VÀ đủ cả 5 câu.
   */
  const handleSurveySkip = (partialAnswers) => {
    const email = currentUser?.email;
    if (email) {
      const skips = recordSkip(email);
      const answers = partialAnswers && typeof partialAnswers === 'object' ? partialAnswers : {};
      if (Object.keys(answers).length > 0) {
        const partial = { answers, completedAt: '', skips, version: SURVEY_VERSION };
        writeSurvey(email, partial);
        saveSurveyToCloud(email, partial);
      }
      setSurveyRevision((n) => n + 1);
    }
    setIsSurveyOpen(false);
    setCertAfterSurvey(null);
  };

  // Tài khoản đã được mời làm khảo sát trong phiên này.
  //
  // Thiếu mốc này thì bấm "Bỏ qua" xong bảng khảo sát bật lại ngay lập tức:
  // effect bên dưới thấy `shouldAskSurvey` vẫn đúng nên mời tiếp, thành một
  // vòng lặp không thoát ra được — đúng nghĩa đen là không bỏ qua nổi.
  const surveyAskedForRef = useRef('');

  useEffect(() => {
    if (!shouldAskSurvey) return;
    const email = currentUser?.email || '';
    if (surveyAskedForRef.current === email) return;
    surveyAskedForRef.current = email;

    // Hoãn 900ms cho đỡ đường đột — vừa đăng nhập xong đã bị đập ngay một bảng
    // câu hỏi vào mặt thì phản xạ đầu tiên là bấm tắt.
    //
    // Khoảng hoãn này KHÔNG còn là thứ chặn quản trị viên nữa. Trước đây nó
    // gánh luôn vai trò đó — chờ 900ms mong `resolveAdminRole()` kịp trả lời —
    // và hỏng đúng những lúc mạng chậm. Việc chặn nay do `roleResolved` lo,
    // dựa trên câu trả lời thật của máy chủ chứ không dựa vào đồng hồ.
    const timer = setTimeout(() => {
      setIsSurveyMandatory(false);
      setIsSurveyOpen(true);
    }, 900);
    return () => clearTimeout(timer);
  }, [shouldAskSurvey, currentUser?.email]);

  /**
   * Cổng vào Bằng Chứng Nhận.
   *
   * Mọi lối mở bằng của học viên đều đi qua đây — Header, thanh menu, thanh
   * dưới màn nhỏ, và băng mời trong khoá Trade. Gom về một chỗ vì chặn ở bốn
   * nơi riêng lẻ thì chỉ cần bỏ sót một nơi là cả chốt chặn vô nghĩa.
   *
   * Không áp cho quản trị viên cấp bằng thủ công cho người khác: đường đó đi
   * qua `handleAdminIssueCertificate`, không qua hàm này.
   */
  const requestCertificate = (course = 'main') => {
    if (!currentUser) {
      setMigrationNotice('🔒 Vui lòng Đăng Ký / Đăng Nhập để xem bằng cấp!');
      setIsAuthOpen(true);
      return;
    }
    if (shouldAskSurvey) {
      setCertAfterSurvey(course);
      openSurvey(true);
      return;
    }
    if (course === 'trade') setIsTradeCertOpen(true);
    else setIsCertOpen(true);
  };

  const handlePassModule = (moduleId) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules(prev => [...prev, moduleId]);
    }
  };

  const handlePassTradeModule = (moduleId) => {
    if (!completedTradeModules.includes(moduleId)) {
      setCompletedTradeModules(prev => [...prev, moduleId]);
    }
  };

  const selectedTradeModule = TRADE_MODULES.find(m => m.id === selectedTradeModuleId);

  const handleNextTradeModule = () => {
    const i = TRADE_MODULES.findIndex(m => m.id === selectedTradeModuleId);
    if (i > -1 && i < TRADE_MODULES.length - 1) {
      setSelectedTradeModuleId(TRADE_MODULES[i + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevTradeModule = () => {
    const i = TRADE_MODULES.findIndex(m => m.id === selectedTradeModuleId);
    if (i > 0) {
      setSelectedTradeModuleId(TRADE_MODULES[i - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (user) => {
    try {
      // 1. Read guest/trial progress from localStorage
      const guestSaved = localStorage.getItem('dmm_completed_modules');
      const guestModules = guestSaved ? JSON.parse(guestSaved) : [];

      // 2. Read user progress if already exists
      const userKey = getProgressStorageKey(user);
      const userSaved = localStorage.getItem(userKey);
      const userModules = userSaved ? JSON.parse(userSaved) : [];

      // 3. Merge guest progress into user progress
      const mergedModules = Array.from(new Set([...userModules, ...guestModules]));

      // 4. Save merged progress
      localStorage.setItem(userKey, JSON.stringify(mergedModules));
      setCompletedModules(mergedModules);

      // 5. Sync to Cloud Firestore
      saveUserProgressToCloud(user.id, {
        completedModules: mergedModules,
        studentName: user.name,
        email: user.email
      });

      // 6. Display migration notice if guest progress was migrated
      if (guestModules.length > 0) {
        setMigrationNotice(`🎉 Đã tự động chuyển tiếp ${guestModules.length} chuyên đề bạn đã học thử vào tài khoản mới!`);
        setTimeout(() => setMigrationNotice(''), 6000);
      }
    } catch (e) {
      console.error("Error migrating guest progress", e);
    }

    // Gỡ bỏ mọi vai trò do phía đăng nhập gửi sang.
    //
    // Nhánh đăng nhập dự phòng đọc bản ghi thẳng từ `dmm_users_db` — một kho
    // localStorage mà người dùng sửa được, nên `role` trong đó không đáng tin.
    // Nếu tài khoản này thật sự có quyền, listener `onAuthStateChanged` sẽ cấp
    // lại ngay sau khi máy chủ xác nhận.
    const { role: _untrustedRole, ...safeUser } = user || {};

    // GIỮ LẠI vai trò máy chủ đã xác nhận cho CHÍNH email này, nếu có.
    //
    // Bản trước đặt cứng 'student'. Hàm này chạy sau `onLoginSuccess`, tức là
    // nó có thể chạy SAU khi `onAuthStateChanged` đã hỏi xong máy chủ và cấp
    // quyền quản trị — và khi đó nó xoá thẳng quyền vừa cấp. Không có gì chạy
    // lại để sửa, nên quản trị viên mất nút Quản Trị cho tới lần tải trang sau.
    // Bên đăng nhập chờ 500ms trước khi gọi, đủ để trên máy tính mạng khoẻ
    // thỉnh thoảng thua cuộc; trên điện thoại thì ngược lại — máy chủ về muộn
    // hơn nên lỗi này ẩn đi, nhường chỗ cho lỗi ở `setRoleResolved` bên dưới.
    //
    // Không mở đường tự phong: `prev.role` chỉ có thể là 'admin' nếu chính
    // listener đã ghi vào sau khi máy chủ xác nhận. Bản khôi phục từ
    // localStorage luôn khởi tạo lại là 'student' (xem chỗ dựng `currentUser`).
    //
    // Ảnh đại diện đi cùng lý do đó. Hồ sơ mà bên đăng nhập gửi sang chỉ có
    // những trường gõ trong form, không có `avatarUrl`; đè lên bản listener vừa
    // kéo từ đám mây về là học viên vừa đăng nhập xong đã thấy mất ảnh.
    setCurrentUser((prev) => {
      const sameAccount =
        prev && normalizeEmail(prev.email) === normalizeEmail(safeUser.email);
      if (!sameAccount) return { ...safeUser, role: 'student' };
      return {
        ...safeUser,
        role: prev.role,
        avatarUrl: safeUser.avatarUrl || prev.avatarUrl || ''
      };
    });

    // Chỉ nhánh dự phòng TẠI MÁY mới được kết luận vai trò ở đây.
    //
    // Nhánh đó không tạo phiên Firebase nên `onAuthStateChanged` sẽ không chạy
    // lại để đặt cờ; bỏ qua thì học viên đăng nhập theo nhánh đó không bao giờ
    // được mời làm khảo sát. Đặt 'student' cho họ là đúng chứ không tạm bợ:
    // quyền quản trị chỉ cấp sau khi máy chủ xác nhận một phiên thật.
    //
    // Nhưng khi CÓ phiên Firebase thì đặt cờ ở đây là sai, và đây chính là lý
    // do quản trị viên đăng nhập bằng điện thoại vẫn bị nhắc học và bị hỏi
    // khảo sát: cờ này bật lên trong lúc `resolveAdminRole()` còn đang chờ
    // Firestore, nên suốt quãng đó ứng dụng tin chắc "đã biết rồi, là học
    // viên". Lời nhắc hẹn 1,2 giây, còn một vòng hỏi Firestore trên mạng di
    // động thường lâu hơn thế. Trên máy tính mạng khoẻ thì máy chủ kịp trả lời
    // trước nên không ai thấy lỗi. Nay để listener tự đặt cờ khi biết chắc.
    const loginEmail = normalizeEmail(safeUser.email);
    if (!auth.currentUser) {
      roleResolvedForEmailRef.current = loginEmail;
      setRoleResolved(true);
    } else {
      // So theo email chứ không giữ nguyên cờ cũ: đăng xuất rồi đăng nhập tài
      // khoản khác thì cờ đang là true nhưng đó là câu trả lời cho NGƯỜI TRƯỚC.
      setRoleResolved(roleResolvedForEmailRef.current === loginEmail);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setCurrentUser(null);
    setIsProfileOpen(false);
  };

  /**
   * Học viên vừa lưu hồ sơ.
   *
   * THỨ TỰ Ở ĐÂY LÀ CÓ CHỦ ĐÍCH. Bản trước ghi `localStorage` trước rồi mới gọi
   * lên máy chủ, và không bọc try/catch. Khi hồ sơ mang theo ảnh đại diện dạng
   * base64 vượt hạn mức lưu trữ, lệnh ghi ném lỗi ngay tại dòng đó — hàm dừng
   * lại, `recordStudentAccountToCloud` KHÔNG BAO GIỜ chạy. Hậu quả: ảnh không
   * lưu được ở máy, cũng không lên được máy chủ, mà giao diện thì vẫn hiện ảnh
   * vì `setCurrentUser` đã chạy xong trước đó. Học viên tin là đã lưu.
   *
   * Nay máy chủ được gọi TRƯỚC, và mỗi lệnh ghi xuống máy tự chịu trách nhiệm
   * riêng: một khoá hỏng không kéo theo khoá còn lại.
   */
  const handleUpdateUserProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    recordStudentAccountToCloud(updatedUser);

    try {
      localStorage.setItem('dmm_active_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Không lưu được hồ sơ xuống máy, hồ sơ vẫn được ghi lên máy chủ.', e);
    }
    try {
      localStorage.setItem('dmm_student_name', updatedUser.name);
    } catch (e) {}
  };

  /**
   * Học viên vừa điền nốt hồ sơ sau khi đăng nhập bằng Google.
   *
   * KHÔNG gọi lại recordStudentAccountToCloud ở đây: CompleteProfileModal đã ghi
   * lên máy chủ và CHỜ kết quả rồi mới báo về. Ghi thêm lần nữa chỉ tốn một vòng
   * mạng, mà lần này không ai kiểm tra kết quả nên hỏng cũng không biết.
   *
   * Vai trò lấy từ state hiện tại chứ không lấy từ đối tượng modal gửi sang.
   * Quyền quản trị chỉ được cấp ở một chỗ duy nhất là listener
   * `onAuthStateChanged`, sau khi máy chủ xác nhận — mọi đường khác đều phải coi
   * là không đáng tin, kể cả đường này.
   */
  const handleCompleteProfile = (profile) => {
    const merged = { ...profile, role: currentUser?.role || 'student' };
    setCurrentUser(merged);
    try {
      localStorage.setItem('dmm_active_user', JSON.stringify(merged));
      if (merged.name) localStorage.setItem('dmm_student_name', merged.name);
    } catch (e) {}
    setNeedsProfileCompletion(false);
    setIsAuthOpen(false);
  };

  const handleAddNewNews = (newNewsItem) => {
    setNewsFeed(prev => [newNewsItem, ...prev]);
  };

  // Protected Action Wrapper: Require Registration ONLY for Course Lessons & Quizzes
  // Các ô "CHỈ CÒN 39 SUẤT" dẫn thẳng tới đăng ký học viên.
  // Người đã đăng nhập thì không mở lại form đăng ký nữa mà đưa vào học luôn.
  const handleRegisterCTA = () => {
    if (currentUser) {
      setActiveTab('course');
      setSelectedModuleId(COURSE_MODULES[0]?.id ?? null);
      return;
    }
    setMigrationNotice('🎓 Đăng ký tài khoản học viên để nhận suất học miễn phí!');
    setIsAuthOpen(true);
  };

  // Chỉ tài khoản có role 'admin' mới được vào Bảng Quản Trị (`isAdmin` khai
  // báo cùng chỗ với các cổng khoá nội dung, phía trên).
  //
  // Chặn ở cả tầng hành động, không chỉ ẩn nút: ẩn nút mà vẫn để hàm mở tự do
  // thì chỉ cần gọi được hàm là vào được.
  const openAdminDashboard = () => {
    if (!isAdmin) {
      setMigrationNotice('🔒 Khu vực này chỉ dành cho Ban Quản Trị Học Viện.');
      return;
    }
    setIsAdminOpen(true);
  };

  const handleProtectedSelectModule = (id) => {
    if (!currentUser) {
      setMigrationNotice('🔒 Vui lòng Đăng Ký / Đăng Nhập tài khoản học viên để tham gia học & làm bài trắc nghiệm!');
      setIsAuthOpen(true);
      return;
    }

    // Khoá tuần tự: chặn ở tầng hành động chứ không chỉ làm mờ nút. Mọi lối vào
    // chuyên đề đều đi qua hàm này nên chỉ cần một chốt chặn duy nhất ở đây.
    const gateMessage = getGateMessage(COURSE_MODULES, id, completedModules, isAdmin);
    if (gateMessage) {
      setMigrationNotice(gateMessage);
      return;
    }

    // Mở một chuyên đề được tính là có học -> đặt lại đồng hồ nhắc.
    markStudyActivity();
    setIsReminderOpen(false);
    setSelectedModuleId(id);
  };

  const handleProtectedSelectTab = (tab) => {
    // Guests are free to use tools, glossary, news, and overview!
    setActiveTab(tab);
  };

  /**
   * Về TRANG CHỦ HỌC VIỆN — địa chỉ `/`, không phải `/digital-marketing`.
   *
   * CHỈ dành cho logo kèm chữ "HỌC VIỆN P MARCOM" trên Header. Nút "Digital" ở
   * thanh dưới đáy điện thoại KHÔNG dùng hàm này — nó là nút chọn khoá học nên
   * phải ra `/digital-marketing`, xem `handleOpenCourseHome` ngay bên dưới.
   *
   * VÌ SAO ĐÍCH LÀ `/` CHỨ KHÔNG PHẢI TÊN KHOÁ: logo mang tên Học Viện, không
   * mang tên khoá nào cả. Học viện sắp có thêm khoá; để logo dẫn tới
   * `/digital-marketing` là ngầm nói Digital Marketing chính là Học Viện, và
   * mỗi khoá mở thêm lại khiến điều đó sai thêm một lần. `/` là chỗ duy nhất
   * đứng trên mọi khoá.
   *
   * Hôm nay `/` hiện đúng tổng quan khoá Digital Marketing vì đó là khoá duy
   * nhất đủ lớn để làm mặt tiền. Khi có khoá thứ hai thì thứ hiện ở `/` sẽ
   * đổi, còn địa chỉ này thì không — đó chính là lý do phải tách hai thứ ra
   * ngay từ bây giờ, lúc còn rẻ.
   *
   * Ghi địa chỉ ngay trong hàm chứ không chờ effect đồng bộ: khi người dùng
   * đang đứng sẵn ở trang chủ thì không state nào đổi, effect không có gì để
   * chạy, mà lúc đó địa chỉ có thể vẫn đang là `/digital-marketing`.
   */
  const handleGoHome = () => {
    const home = { tab: 'course', itemId: null, subId: null };

    // Bản trước chỉ gọi `setActiveTab('course')` và KHÔNG xoá chuyên đề đang
    // mở. Lệnh đó không đưa ai về trang chủ cả: đang đọc dở một bài thì tab
    // vốn đã là 'course' nên bấm vào không đổi gì, còn bấm từ tab khác sang
    // thì rơi đúng vào chuyên đề mở dở lần trước.
    setActiveTab('course');
    setSelectedModuleId(null);

    const url = '/' + window.location.search + window.location.hash;
    if (url !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.pushState(null, '', url);
    }

    // Nói cho effect đồng bộ biết địa chỉ này đã đúng rồi, đừng viết đè bằng
    // dạng chuẩn `/digital-marketing`.
    lastRouteRef.current = home;
    syncDocumentTitle(home);
  };

  /**
   * Về tổng quan khoá Digital Marketing — địa chỉ `/digital-marketing`.
   *
   * Đây là hành động của NÚT CHỌN KHOÁ, khác hẳn logo: logo về trang chủ Học
   * Viện, còn nút này chọn một khoá cụ thể trong đó. Dùng cho nút "Digital" ở
   * thanh dưới đáy điện thoại, làm đúng như mục "Digital Marketing" trên thanh
   * menu máy tính vẫn làm.
   *
   * Không tự ghi địa chỉ: state đổi thì effect đồng bộ ghi ra dạng chuẩn.
   */
  const handleOpenCourseHome = () => {
    setActiveTab('course');
    setSelectedModuleId(null);
  };

  const handleNextModule = () => {
    const currentIndex = COURSE_MODULES.findIndex(m => m.id === selectedModuleId);
    if (currentIndex < 0 || currentIndex >= COURSE_MODULES.length - 1) return;

    const nextId = COURSE_MODULES[currentIndex + 1].id;

    // Nút "Chuyên đề Tiếp Theo" là lối vào duy nhất không đi qua
    // handleProtectedSelectModule, nên phải tự kiểm tra ở đây.
    const gateMessage = getGateMessage(COURSE_MODULES, nextId, completedModules, isAdmin);
    if (gateMessage) {
      setMigrationNotice(gateMessage);
      return;
    }

    markStudyActivity();
    setSelectedModuleId(nextId);
  };

  const handlePrevModule = () => {
    const currentIndex = COURSE_MODULES.findIndex(m => m.id === selectedModuleId);
    if (currentIndex > 0) {
      setSelectedModuleId(COURSE_MODULES[currentIndex - 1].id);
    }
  };

  return (
    /* `app-shell` thay cho `pb-16 lg:pb-0`: khoảng chừa dưới đáy phải cộng thêm
       vùng an toàn của iPhone, mà Tailwind không viết được `calc(...env(...))`
       bằng lớp tiện ích. Định nghĩa ở index.css. */
    /* `min-h-[100dvh]` chứ không `min-h-screen` (=100vh): trên trình duyệt điện
       thoại, 100vh tính theo màn hình lúc thanh địa chỉ đã thu lại, tức luôn
       cao hơn phần thật sự nhìn thấy. Trang ngắn vì thế vẫn cuộn được một đoạn
       trống vô nghĩa, và cú cuộn đó lại kích hoạt việc ẩn/hiện thanh địa chỉ
       nên màn hình giật lên giật xuống. `dvh` bám đúng vùng nhìn thấy. */
    <div className="app-shell min-h-[100dvh] bg-[#0e1526] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Header Bar */}
      <Header
        setActiveTab={handleProtectedSelectTab}
        onGoHome={handleGoHome}
        passedCount={completedModules.length}
        totalModules={COURSE_MODULES.length}
        onOpenCertificate={() => requestCertificate('main')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        onOpenAdminModal={isAdmin ? openAdminDashboard : null}
        onOpenSupportInbox={isAdmin ? openSupportInbox : null}
        supportUnreadCount={supportUnreadCount}
        theme={theme}
        setTheme={setTheme}
        textScale={textScale}
        setTextScale={setTextScale}
        trafficStats={trafficStats}
        lang={lang}
        toggleLanguage={toggleLanguage}
        t={t}
      />

      {/* Feature Menu Bar (UX Navigation Bar) */}
      <FeatureMenuBar
        activeTab={activeTab}
        setActiveTab={handleProtectedSelectTab}
        onSelectModule={handleProtectedSelectModule}
        onOpenCertificate={() => requestCertificate('main')}
        passedCount={completedModules.length}
        totalModules={COURSE_MODULES.length}
        isTradeCourseUnlocked={isTradeCourseUnlocked}
        tradePassedCount={completedTradeModules.length}
        tradeTotalModules={TRADE_MODULES.length}
        lang={lang}
        t={t}
      />

      {/*
        ẢNH BÌA TRANG CHỦ

        Chỉ hiện ở màn hình Khoá Học khi chưa mở bài nào — tức đúng "trang chủ".
        Không hiện khi học viên đang đọc bài, tra Từ Điển hay xem Tin Tức: ảnh
        cao gần nửa màn hình, để nguyên ở mọi trang thì mỗi lần chuyển bài đều
        phải cuộn qua nó mới tới nội dung.

        `fetchPriority="high"` chứ không `loading="lazy"`: ảnh này nằm ngay đầu
        trang, người dùng thấy nó trước cả khi cuộn. Đánh dấu lazy ở vị trí này
        làm trình duyệt hoãn tải, đổi lại một khoảng trắng nhấp nháy lúc mở
        trang — chậm hơn về mặt cảm nhận dù tổng thời gian không đổi.

        CHIỀU CAO KHÔNG ĐỂ ẢNH TỰ QUYẾT. Để `h-auto` thì ảnh bìa cao vài trăm
        pixel — chiếm trọn màn hình đầu tiên, và học viên phải cuộn qua một tấm
        quảng cáo mới thấy được bài học. Ảnh bìa là thứ trang trí, không phải
        nội dung; nó không được chiếm chỗ của nội dung.

        Chiều cao nằm ở lớp `.app-cover` trong index.css, tính bằng `clamp()`
        nên co giãn liên tục theo bề ngang màn hình thay vì nhảy theo breakpoint.
        Lý do và cách chỉnh ghi ngay tại chỗ định nghĩa lớp đó.

        `object-cover` + `object-center` cắt bớt trên dưới và giữ phần giữa —
        đúng phần có khối chữ "P MARCOM ACADEMY". Dùng `object-contain` sẽ ra
        một dải ảnh tí hon nằm giữa hai mảng trống, trông như tải ảnh hỏng.

        MỘT FILE ẢNH CHO MỌI THIẾT BỊ

        Đã từng phải dùng `<picture>` với hai file, vì bản màn rộng khi đó là
        6,04:1 — nhét vào khung điện thoại thì chỉ còn 46% bề ngang, mất logo
        lẫn cụm icon. Bản og-cover-v4 hiện tại là 2,76:1, trùng gần như tuyệt
        đối với khung điện thoại, nên một file phục vụ được tất cả và `<picture>`
        thành thừa.

        `og-cover-v4.jpg` là bản đã CẮT VIỀN TRẮNG và nén từ file PNG thiết kế
        gửi (1774x887, có viền trắng 127px trên / 129px dưới / ~16px hai bên).
        Để nguyên viền thì ảnh bìa hiện ra với hai dải trắng kẹp trên dưới,
        nhìn như tải hỏng. Vùng nội dung thật là 1742x631 — đúng con số ghi
        trong `aspect-ratio` ở index.css, ĐỔI ẢNH THÌ PHẢI SỬA THEO.

        PNG gốc vẫn nằm cạnh trong public/, không xoá — cần dựng lại thì lấy
        từ đó. Bản JPG chất lượng 85 nặng 192 KB thay vì 1,5 MB: ảnh này gắn
        `fetchPriority="high"` nên nó chặn đường mọi thứ khác, để nặng thì trên
        4G học viên nhìn màn hình trắng vài giây.

        Thẻ og:image trong index.html vẫn trỏ v3, KHÔNG đổi sang v4: Facebook
        và Zalo cắt ảnh share về 1,91:1, đưa ảnh 2,76:1 lên thì mất hai đầu.
      */}
      {activeTab === 'course' && !selectedModuleId && (
        <CoverSlider
          banners={coverBanners}
          intervalMs={coverIntervalMs}
          fallbackSrc="/og-cover-v4.jpg"
          fallbackAlt="Chào mừng đến với P MARCOM ACADEMY — Kết nối tri thức, nâng tầm tư duy, bứt phá tương lai"
          canEdit={isAdmin}
          onEdit={() => setIsCoverEditorOpen(true)}
        />
      )}

      {/* Guest Progress / Auth Protection Toast Banner */}
      {migrationNotice && (
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4">
          <div className="app-toast-banner p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-between shadow-2xl animate-bounce">
            <span className="flex items-center gap-2">
              {migrationNotice}
            </span>
            <button 
              onClick={() => setMigrationNotice('')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ml-2"
            >
              ✕ {t.btnClose || 'Đóng'}
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          
          {/*
            Left Sidebar / Mobile Touch Module Selector

            Tháo hẳn khỏi cây DOM khi đang tập trung, không phải `hidden`. Trên
            điện thoại Sidebar nằm TRÊN nội dung bài chứ không nằm bên trái, nên
            để nó ẩn mà vẫn còn trong luồng thì học viên mở bài xong vẫn phải
            cuộn qua một danh sách 11 mục mới tới chữ đầu tiên của bài — đúng
            thứ chế độ tập trung sinh ra để dẹp.
          */}
          {!isSidebarHidden && (
            <Sidebar
              modules={COURSE_MODULES}
              selectedModuleId={selectedModuleId}
              onSelectModule={handleProtectedSelectModule}
              completedModules={completedModules}
              activeTab={activeTab}
              setActiveTab={handleProtectedSelectTab}
              isTradeCourseUnlocked={isTradeCourseUnlocked}
              tradePassedCount={completedTradeModules.length}
              tradeTotalModules={TRADE_MODULES.length}
              /* Danh sách chuyên đề khoá nâng cao: thanh bên tự đổi sang khoá
                 Trade khi học viên đang ở tab đó. */
              tradeModules={TRADE_MODULES}
              selectedTradeModuleId={selectedTradeModuleId}
              onSelectTradeModule={(id) => {
                setSelectedTradeModuleId(id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              completedTradeModules={completedTradeModules}
              isAdmin={isAdmin}
            />
          )}

          {/* Main View Area */}
          <div className="flex-1 min-w-0">

            {/*
              Lối ra khỏi chế độ tập trung.

              Nút Bài trước / Bài sau trong LessonViewer chỉ đi được từng bước
              một; muốn nhảy từ bài 2 sang bài 9 mà không có nút này thì phải
              thoát hẳn về trang chủ rồi vào lại. Đặt ngay đầu vùng nội dung để
              nó là thứ đầu tiên đập vào mắt khi học viên tìm đường quay lại.
            */}
            {isFocusMode && (
              <button
                onClick={() => setFocusSidebarOpen(!focusSidebarOpen)}
                className="mb-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#18243d] border border-emerald-900/50 hover:border-emerald-500 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                {/* Ký tự thay cho icon: App.jsx không nhập lucide-react ở đâu
                    cả (nút Đóng của băng thông báo cũng dùng ✕), kéo cả thư
                    viện icon về chỉ vì một nút thì không đáng. */}
                <span className="text-emerald-400 text-sm leading-none">{focusSidebarOpen ? '✕' : '☰'}</span>
                <span>{focusSidebarOpen ? 'Thu gọn để tập trung' : 'Danh sách chuyên đề'}</span>
              </button>
            )}

            {activeTab === 'course' && (
              selectedModule ? (
                <div className="space-y-6 sm:space-y-8">
                  <LessonViewer
                    module={selectedModule}
                    onBack={() => setSelectedModuleId(null)}
                    onNextModule={handleNextModule}
                    onPrevModule={handlePrevModule}
                    onPassModule={handlePassModule}
                    isCompleted={completedModules.includes(selectedModule.id)}
                    /* Tầng bài học của địa chỉ. Chỉ khoá chính truyền hai prop
                       này; khoá Trade để trống nên phần theo dõi tự tắt. */
                    activeSectionId={activeSectionId}
                    onSectionInView={(id) =>
                      setActiveSection(id ? { moduleId: selectedModule.id, id } : null)
                    }
                    /* Nút "Tiếp Theo" tự biết mình đang bị khoá để đổi nhãn và
                       nói rõ điều kiện, thay vì bấm xong mới báo lỗi. */
                    isNextLocked={(() => {
                      const i = COURSE_MODULES.findIndex((m) => m.id === selectedModule.id);
                      const next = COURSE_MODULES[i + 1];
                      return !!next && !isModuleUnlocked(COURSE_MODULES, next.id, completedModules, isAdmin);
                    })()}
                  />

                  {/* Special AI Consulting Advisor for Module 11 */}
                  {selectedModule.id === 'module-11' && (
                    <AIStrategyAdvisor />
                  )}
                </div>
              ) : (
                <CourseOverview
                  modules={COURSE_MODULES}
                  onSelectModule={handleProtectedSelectModule}
                  completedModules={completedModules}
                  searchQuery={searchQuery}
                  trafficStats={trafficStats}
                  onRegisterCTA={handleRegisterCTA}
                  isAdmin={isAdmin}
                />
              )
            )}

            {activeTab === 'trade' && (
              // Cổng khoá kiểm tra ở ĐÂY chứ không chỉ ẩn nút trên menu: ẩn nút
              // mới là che giao diện, còn chặn ở chỗ kết xuất mới là chặn thật.
              isTradeCourseUnlocked && selectedTradeModule ? (
                <LessonViewer
                  module={selectedTradeModule}
                  onBack={() => setSelectedTradeModuleId(null)}
                  onNextModule={handleNextTradeModule}
                  onPrevModule={handlePrevTradeModule}
                  onPassModule={handlePassTradeModule}
                  isCompleted={completedTradeModules.includes(selectedTradeModule.id)}
                />
              ) : (
                <TradeMarketingCourse
                  isUnlocked={isTradeCourseUnlocked}
                  isAdmin={isAdmin}
                  mainCompletedCount={mainCompletedCount}
                  mainTotalModules={COURSE_MODULES.length}
                  completedTradeModules={completedTradeModules}
                  onSelectModule={(id) => {
                    setSelectedTradeModuleId(id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenCertificate={() => requestCertificate('trade')}
                  onGoToMainCourse={() => {
                    setActiveTab('course');
                    // Đưa về chuyên đề dở dang gần nhất, nhưng phải là chuyên đề
                    // đã mở khoá. Với tiến độ tuần tự hai điều kiện này trùng
                    // nhau; ràng buộc thêm isModuleUnlocked là để dữ liệu cũ
                    // ngắt quãng không đẩy học viên vào một chuyên đề còn khoá.
                    const resumeId = COURSE_MODULES.find(
                      (m) => !completedModules.includes(m.id)
                        && isModuleUnlocked(COURSE_MODULES, m.id, completedModules, isAdmin)
                    )?.id ?? null;
                    setSelectedModuleId(resumeId);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )
            )}

            {activeTab === 'glossary' && (
              <DigitalGlossary
                openTermId={activeItemId}
                onOpenTerm={(id) => openItem('glossary', id)}
              />
            )}

            {activeTab === 'news' && (
              <LiveNewsFeed
                newsList={newsFeed}
                onAddNewNews={handleAddNewNews}
                openNewsId={activeItemId}
                onOpenNews={(id) => openItem('news', id)}
              />
            )}

            {activeTab === 'tools' && (
              <ManagerTools
                openToolId={activeItemId}
                onOpenTool={(id) => openItem('tools', id)}
              />
            )}

          </div>

        </div>
      </main>

      {/* Certificate Modal */}
      {/* Trợ lý Pipi - nút nổi góc phải, hiện ở mọi màn */}
      <PipiChat
        variant="fab"
        onSelectModule={handleProtectedSelectModule}
        setActiveTab={handleProtectedSelectTab}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onRequireLogin={() => {
          setMigrationNotice('🔒 Đăng nhập tài khoản học viên để gửi lời nhắn tới Ban Quản Trị.');
          setIsAuthOpen(true);
        }}
      />

      {/* Nhắc quay lại học khi lơ là quá 2 ngày */}
      <StudyReminderModal
        isOpen={isReminderOpen}
        idleDays={reminderIdleDays}
        studentName={currentUser?.name || ''}
        completedCount={completedModules.length}
        totalModules={COURSE_MODULES.length}
        nextModule={COURSE_MODULES.find((m) => !completedModules.includes(m.id)) || null}
        onClose={() => setIsReminderOpen(false)}
        onSnooze={() => {
          snoozeReminder();
          setIsReminderOpen(false);
        }}
        onContinue={() => {
          const next = COURSE_MODULES.find((m) => !completedModules.includes(m.id));
          setIsReminderOpen(false);
          if (next) handleProtectedSelectModule(next.id);
        }}
      />

      {/* Bằng khoá chính, kiêm luôn khung xem bằng khi quản trị viên cấp thủ công.
          Ở chế độ quản trị, tên khoá và số chuyên đề phải bám theo khoá được
          chọn trong Bảng Quản Trị — nếu vẫn ghi cứng khoá chính thì cấp bằng
          Trade sẽ in ra tấm bằng mang tên khoá Digital. */}
      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => {
          setIsCertOpen(false);
          setAdminCertStudentName("");
          setAdminCertCourse('main');
        }}
        passedCount={isAdminIssuing ? adminCertTotalModules : completedModules.length}
        totalModules={isAdminIssuing ? adminCertTotalModules : COURSE_MODULES.length}
        adminOverride={isAdminIssuing || isAdmin}
        customStudentName={adminCertStudentName}
        studentEmail={isAdminIssuing ? "" : (currentUser?.email || "")}
        course={isAdminIssuing ? adminCertCourse : 'main'}
      />

      {/* Bằng Chứng Nhận khoá nâng cao Trade Marketing.
          Là một CertificateModal riêng chứ không dùng chung state với bằng khoá
          chính: hai bằng có thể cùng mở ra trong một phiên, và tiến độ của
          chúng đếm trên hai bộ dữ liệu độc lập. */}
      <CertificateModal
        isOpen={isTradeCertOpen}
        onClose={() => setIsTradeCertOpen(false)}
        passedCount={tradeCompletedCount}
        totalModules={TRADE_MODULES.length}
        adminOverride={isAdmin}
        studentEmail={currentUser?.email || ""}
        course="trade"
      />

      {/* Auth Login / Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => { setIsAuthOpen(false); setGoogleAuthError(''); }}
        onLoginSuccess={handleLoginSuccess}
        onReturnHome={() => {
          setActiveTab('course');
          setSelectedModuleId(null);
        }}
        googleErrorCode={googleAuthError}
        t={t}
      />

      {/* Hoàn tất hồ sơ sau khi đăng nhập bằng Google.
          Đặt SAU AuthModal và có z-index cao hơn: khi cả hai cùng mở (học viên
          vừa đăng nhập Google xong, modal đăng nhập chưa kịp đóng), màn hình
          này phải nằm trên. */}
      <CompleteProfileModal
        isOpen={needsProfileCompletion && !!currentUser}
        user={currentUser}
        onComplete={handleCompleteProfile}
        onLogout={handleLogout}
      />

      {/* User Profile & Backup Sync Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onUpdateProfile={handleUpdateUserProfile}
        passedCount={completedModules.length}
        totalModules={COURSE_MODULES.length}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Admin Master Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
        trafficStats={trafficStats}
        onIssueCertificateForStudent={handleAdminIssueCertificate}
        onOpenCoverEditor={() => setIsCoverEditorOpen(true)}
        t={t}
      />

      {/* Quản trị ảnh bìa trang chủ.
          Dựng có điều kiện `isAdmin` chứ không chỉ dựa vào cờ isOpen: ẩn nút mà
          vẫn để thành phần tồn tại thì chỉ cần gọi được hàm mở là vào được.
          Ranh giới thật vẫn nằm ở firestore.rules — đây chỉ là lớp giao diện. */}
      {isAdmin && (
        <CoverSliderModal
          isOpen={isCoverEditorOpen}
          onClose={() => setIsCoverEditorOpen(false)}
          banners={coverBanners}
          intervalMs={coverIntervalMs}
          fallbackSrc="/og-cover-v4.jpg"
          fallbackAlt="Ảnh bìa mặc định của Học Viện P MARCOM"
        />
      )}

      {/* Khảo sát nhu cầu học viên.
          Chỉ dựng khi thật sự còn phải hỏi — dựng sẵn rồi ẩn bằng cờ isOpen thì
          một lệnh gọi lạc là bảng bật lên với cả người đã trả lời xong. */}
      {shouldAskSurvey && (
        <SurveyModal
          isOpen={isSurveyOpen}
          mandatory={isSurveyMandatory}
          studentName={currentUser?.name || ''}
          initialAnswers={savedSurveyAnswers}
          onClose={() => setIsSurveyOpen(false)}
          onSubmit={handleSurveySubmit}
          onSkip={handleSurveySkip}
        />
      )}

      {/* Hộp Thư Hỗ Trợ — lời nhắn học viên gửi từ khung chat Pipi.
          Dựng có điều kiện `isAdmin` chứ không chỉ dựa vào cờ isOpen: ẩn nút mà
          vẫn để thành phần tồn tại thì chỉ cần gọi được hàm mở là vào được. */}
      {isAdmin && (
        <SupportInboxModal
          isOpen={isSupportInboxOpen}
          onClose={() => setIsSupportInboxOpen(false)}
          messages={supportMessages}
          currentUser={currentUser}
          onSetStatus={handleSupportStatus}
          onDelete={deleteSupportMessage}
        />
      )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCourseHome={handleOpenCourseHome}
        isTradeCourseUnlocked={isTradeCourseUnlocked}
        onOpenCertificate={() => requestCertificate('main')}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        onOpenAdminModal={isAdmin ? openAdminDashboard : null}
        supportUnreadCount={supportUnreadCount}
      />

      {/* Footer — cắt bỏ trong chế độ tập trung.

          Dòng bản quyền là thứ đóng trang lại. Đặt nó ngay dưới nút "Bài sau"
          là báo cho học viên rằng đã hết, đúng lúc đáng ra phải mời họ đi
          tiếp. Trang chủ vẫn còn footer, nên thông tin không mất đi đâu. */}
      {!isFocusMode && (
        <footer className="border-t border-emerald-950 bg-[#0a1020] py-6 px-4 text-center text-xs text-slate-500">
          {/* Giới thiệu chéo các ứng dụng khác. Đặt TRÊN dòng bản quyền: dòng
              bản quyền là thứ đóng trang lại, có gì muốn mời thêm thì phải nói
              trước nó. */}
          <PartnerAppsBanner />
          <p>
            © 2026 HỌC VIỆN P MARCOM. Hệ thống Khóa Học Digital Thực Chiến.
          </p>
        </footer>
      )}

    </div>
  );
}

