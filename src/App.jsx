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
import UserProfileModal from './components/UserProfileModal';
import DigitalGlossary from './components/DigitalGlossary';
import FeatureMenuBar from './components/FeatureMenuBar';
import AdminDashboardModal from './components/AdminDashboardModal';

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
  grantAdminInCloud
} from './firebase';

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
          coverBg: typeof parsed.coverBg === 'string' ? parsed.coverBg : 'emerald',
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

        const studentUser = {
          id: user.uid,
          email: user.email || (existingUser?.email || ''),
          name: (existingUser?.name || cloudProfile?.name || user.displayName || (user.email ? user.email.split('@')[0] : 'HỌC VIÊN')).toUpperCase(),
          phone: existingUser?.phone || cloudProfile?.phone || 'Chưa cập nhật',
          industry: existingUser?.industry || cloudProfile?.industry || 'Digital Marketing',
          coverBg: existingUser?.coverBg || cloudProfile?.coverBg || 'emerald',
          avatarUrl: existingUser?.avatarUrl || cloudProfile?.avatarUrl || '',
          createdAt: existingUser?.createdAt || cloudProfile?.createdAt || new Date().toLocaleDateString('vi-VN'),
          // Đây là NƠI DUY NHẤT cấp quyền quản trị trong toàn ứng dụng, và chỉ
          // cấp sau khi máy chủ xác nhận (xem resolveAdminRole).
          role: resolvedRole
        };

        setCurrentUser(studentUser);
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
      }
    });
    return () => unsubscribe();
  }, []);

  const [adminCertStudentName, setAdminCertStudentName] = useState("");

  const handleAdminIssueCertificate = (studentName) => {
    setAdminCertStudentName(studentName);
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

  // Điều kiện bắt buộc để mở khoá Trade Marketing: hoàn thành TOÀN BỘ khoá
  // Digital Marketing. Dùng phép so khớp theo id chứ không so độ dài mảng —
  // dữ liệu cũ trong máy có thể chứa id chuyên đề đã bị xoá, khiến đếm số
  // lượng vẫn đủ trong khi thực tế còn chuyên đề chưa học.
  const mainCompletedCount = COURSE_MODULES.filter((m) =>
    completedModules.includes(m.id)
  ).length;
  const isTradeCourseUnlocked = mainCompletedCount === COURSE_MODULES.length;

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
  // Khoá có hậu tố _v2: bản tin đã đổi cấu trúc (thêm tranh minh hoạ, thân bài,
  // số liệu chính). Dữ liệu lưu theo khoá cũ thiếu các trường đó nên phải bỏ
  // qua, nếu không người dùng cũ sẽ mãi thấy bản tin rút gọn.
  const [newsFeed, setNewsFeed] = useState(() => {
    try {
      const saved = localStorage.getItem('dmm_news_feed_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return INITIAL_NEWS_ITEMS;
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

  useEffect(() => {
    try {
      localStorage.setItem('dmm_news_feed_v2', JSON.stringify(newsFeed));
    } catch (e) {}
  }, [newsFeed]);

  const selectedModule = COURSE_MODULES.find(m => m.id === selectedModuleId);

  const [migrationNotice, setMigrationNotice] = useState('');

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

  const handleImportBackupData = (importedModules) => {
    if (Array.isArray(importedModules)) {
      setCompletedModules(importedModules);
    }
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

  // Chỉ tài khoản có role 'admin' mới được vào Bảng Quản Trị.
  const isAdmin = currentUser?.role === 'admin';

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
        onOpenCertificate={() => {
          if (!currentUser) {
            setMigrationNotice('🔒 Vui lòng Đăng Ký / Đăng Nhập để xem bằng cấp!');
            setIsAuthOpen(true);
          } else {
            setIsCertOpen(true);
          }
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        onOpenAdminModal={isAdmin ? openAdminDashboard : null}
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
        onOpenCertificate={() => {
          if (!currentUser) {
            setMigrationNotice('🔒 Vui lòng Đăng Ký / Đăng Nhập để xem bằng cấp!');
            setIsAuthOpen(true);
          } else {
            setIsCertOpen(true);
          }
        }}
        passedCount={completedModules.length}
        totalModules={COURSE_MODULES.length}
        isTradeCourseUnlocked={isTradeCourseUnlocked}
        tradePassedCount={completedTradeModules.length}
        tradeTotalModules={TRADE_MODULES.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        lang={lang}
        t={t}
      />

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
                  mainCompletedCount={mainCompletedCount}
                  mainTotalModules={COURSE_MODULES.length}
                  completedTradeModules={completedTradeModules}
                  onSelectModule={(id) => {
                    setSelectedTradeModuleId(id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenCertificate={() => setIsTradeCertOpen(true)}
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

      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => {
          setIsCertOpen(false);
          setAdminCertStudentName("");
        }}
        passedCount={completedModules.length}
        totalModules={COURSE_MODULES.length}
        adminOverride={Boolean(adminCertStudentName)}
        customStudentName={adminCertStudentName}
        studentEmail={adminCertStudentName ? "" : (currentUser?.email || "")}
        course="main"
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
        studentEmail={currentUser?.email || ""}
        course="trade"
      />

      {/* Auth Login / Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onReturnHome={() => {
          setActiveTab('course');
          setSelectedModuleId(null);
        }}
        t={t}
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
        completedModules={completedModules}
        onImportBackupData={handleImportBackupData}
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

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isTradeCourseUnlocked={isTradeCourseUnlocked}
        onOpenCertificate={() => setIsCertOpen(true)}
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

