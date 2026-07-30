import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CourseOverview from './components/CourseOverview';
import LessonViewer from './components/LessonViewer';
import LiveNewsFeed from './components/LiveNewsFeed';
import ManagerTools from './components/ManagerTools';
import CertificateModal from './components/CertificateModal';
import AIStrategyAdvisor from './components/AIStrategyAdvisor';
import MobileBottomNav from './components/MobileBottomNav';
import AuthModal from './components/AuthModal';
import CompleteProfileModal from './components/CompleteProfileModal';
import UserProfileModal from './components/UserProfileModal';
import DigitalGlossary from './components/DigitalGlossary';
import FeatureMenuBar from './components/FeatureMenuBar';
import AdminDashboardModal from './components/AdminDashboardModal';
import SupportInboxModal from './components/SupportInboxModal';
import SurveyModal from './components/SurveyModal';
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
  consumeGoogleRedirectResult
} from './firebase';
import { hasRealPhone } from './utils/industryOptions';

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

import { COURSE_MODULES } from './data/courseData';
import { TRADE_MODULES } from './data/tradeCourseData';
import TradeMarketingCourse from './components/TradeMarketingCourse';
import { INITIAL_NEWS_ITEMS } from './data/newsData';
import { compareNewsRecency } from './utils/newsDate';
import { TRANSLATIONS } from './data/translations';

export default function App() {
  const [activeTab, setActiveTab] = useState('course'); // 'course', 'news', 'tools'
  const [selectedModuleId, setSelectedModuleId] = useState(null); // null = overview, string = module view
  const [searchQuery, setSearchQuery] = useState('');
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isTradeCertOpen, setIsTradeCertOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
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
   * Tài khoản gốc là ngoại lệ có chủ đích: danh sách nằm cứng trong mã nguồn
   * nên người dùng không sửa được, và điều kiện vẫn là phải đăng nhập được vào
   * đúng tài khoản đó. Giữ ngoại lệ này để không khoá chết hệ thống trong lúc
   * sổ `admins` trên Firestore chưa được mồi.
   */
  const resolveAdminRole = async (authUser) => {
    const email = normalizeEmail(authUser?.email);
    if (!email) return 'student';

    const verdict = await isAdminInCloud(email);

    if (verdict === true) {
      grantAdmin(email);
      return 'admin';
    }
    if (verdict === false) {
      if (isRootAdmin(email)) {
        // Tự mồi sổ phân quyền.
        //
        // Sổ `admins` rỗng thì không ai là quản trị viên, mà chỉ quản trị viên
        // mới ghi được vào sổ -> khoá chết, không ai cấp được cho ai. Firestore
        // Rules mở đúng một ngoại lệ cho tình huống này: tài khoản gốc tự tạo
        // bản ghi của CHÍNH NÓ. Không có bước này thì sau khi deploy rules,
        // quản trị viên đăng nhập vào sẽ thấy bảng rỗng vì lệnh liệt kê học
        // viên bị từ chối.
        //
        // Chạy được đúng một lần; những lần sau verdict đã là true.
        try {
          await grantAdminInCloud(email, email);
        } catch (err) {
          console.warn('Chưa mồi được sổ phân quyền trên Cloud:', err);
        }
        grantAdmin(email);
        return 'admin';
      }
      revokeAdmin(email);
      return 'student';
    }
    return isRootAdmin(email) || isAdminEmail(email) ? 'admin' : 'student';
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

        const cloudProfile = await getUserProgressFromCloud(user.uid, user.email);
        const resolvedRole = await resolveAdminRole(user);

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
        setRoleResolved(true);
      }
    });
    return () => unsubscribe();
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
  const buildStudentPayload = (user, progressFields = {}) => ({
    id: user.id || user.email.replace(/\./g, '_'),
    name: user.name,
    phone: user.phone || 'Chưa cập nhật',
    email: user.email,
    industry: user.industry || 'Kinh doanh',
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
  const mainCompletedCount = COURSE_MODULES.filter((m) =>
    completedModules.includes(m.id)
  ).length;
  const isTradeCourseUnlocked = isAdmin || mainCompletedCount === COURSE_MODULES.length;

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
    // Chỉ chạy khi đổi người dùng, không chạy lại mỗi lần tiến độ thay đổi
    // để tránh popup bật lên ngay giữa lúc học viên đang làm bài.
  }, [currentUser]);

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

  const [migrationNotice, setMigrationNotice] = useState('');

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
    setCurrentUser({ ...safeUser, role: 'student' });

    // Nhánh đăng nhập dự phòng tại máy không tạo phiên Firebase, nên
    // `onAuthStateChanged` sẽ không chạy lại để đặt cờ này. Không đặt ở đây thì
    // học viên đăng nhập theo nhánh đó không bao giờ được mời làm khảo sát.
    //
    // Đặt 'student' là đúng chứ không phải tạm bợ: quyền quản trị chỉ cấp sau
    // khi máy chủ xác nhận một phiên Firebase thật, mà nhánh này không có.
    setRoleResolved(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setCurrentUser(null);
    setIsProfileOpen(false);
  };

  const handleUpdateUserProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('dmm_active_user', JSON.stringify(updatedUser));
    localStorage.setItem('dmm_student_name', updatedUser.name);
    recordStudentAccountToCloud(updatedUser);
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
    // Mở một chuyên đề được tính là có học -> đặt lại đồng hồ nhắc.
    markStudyActivity();
    setIsReminderOpen(false);
    setSelectedModuleId(id);
  };

  const handleProtectedSelectTab = (tab) => {
    // Guests are free to use tools, glossary, news, and overview!
    setActiveTab(tab);
  };

  const handleNextModule = () => {
    const currentIndex = COURSE_MODULES.findIndex(m => m.id === selectedModuleId);
    if (currentIndex < COURSE_MODULES.length - 1) {
      setSelectedModuleId(COURSE_MODULES[currentIndex + 1].id);
    }
  };

  const handlePrevModule = () => {
    const currentIndex = COURSE_MODULES.findIndex(m => m.id === selectedModuleId);
    if (currentIndex > 0) {
      setSelectedModuleId(COURSE_MODULES[currentIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1526] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16 lg:pb-0">
      
      {/* Top Header Bar */}
      <Header
        setActiveTab={handleProtectedSelectTab}
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

        CHIỀU CAO BỊ CHẶN CỨNG. Ảnh gốc là 1672x941; để `h-auto` thì trên khung
        1.280px nó cao khoảng 720px — chiếm trọn màn hình đầu tiên, và học viên
        phải cuộn qua một tấm quảng cáo mới thấy được bài học. Ảnh bìa là thứ
        trang trí, không phải nội dung; nó không được chiếm chỗ của nội dung.

        `object-cover` + `object-center` cắt bớt trên dưới và giữ phần giữa —
        đúng phần có khối chữ "P MARCOM ACADEMY". Dùng `object-contain` sẽ ra
        một dải ảnh tí hon nằm giữa hai mảng trống, trông như tải ảnh hỏng.
      */}
      {activeTab === 'course' && !selectedModuleId && (
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4">
          <img
            src="/og-cover-v3.jpg"
            alt="Chào mừng đến với P MARCOM ACADEMY — Kết nối tri thức, nâng tầm tư duy, bứt phá tương lai"
            width="1672"
            height="941"
            fetchPriority="high"
            className="w-full h-[120px] sm:h-[160px] lg:h-[200px] object-cover object-center rounded-2xl border border-emerald-900/40 shadow-lg"
          />
        </div>
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
          
          {/* Left Sidebar / Mobile Touch Module Selector */}
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
          />

          {/* Main View Area */}
          <div className="flex-1 min-w-0">
            
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
                    setSelectedModuleId(COURSE_MODULES.find((m) => !completedModules.includes(m.id))?.id ?? null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )
            )}

            {activeTab === 'glossary' && (
              <DigitalGlossary />
            )}

            {activeTab === 'news' && (
              <LiveNewsFeed
                newsList={newsFeed}
                onAddNewNews={handleAddNewNews}
              />
            )}

            {activeTab === 'tools' && (
              <ManagerTools />
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
        t={t}
      />

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
        isTradeCourseUnlocked={isTradeCourseUnlocked}
        onOpenCertificate={() => requestCertificate('main')}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
      />

      {/* Footer */}
      <footer className="border-t border-emerald-950 bg-[#0a1020] py-6 px-4 text-center text-xs text-slate-500">
        <p>
          © 2026 HỌC VIỆN P MARCOM. Hệ thống Khóa Học Digital Thực Chiến.
        </p>
      </footer>

    </div>
  );
}

