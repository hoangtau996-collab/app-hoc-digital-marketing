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
  recordRealStudentEnrollment,
  recordRealStudentGraduate,
  listenToRealStats,
  recordStudentAccountToCloud
} from './firebase';

import StudyReminderModal from './components/StudyReminderModal';
import PipiChat from './components/PipiChat';
import {
  markStudyActivity,
  shouldRemind,
  getIdleDays,
  snoozeReminder,
} from './utils/studyReminder';

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
  const [trafficStats, setTrafficStats] = useState({
    totalTraffic: TRAFFIC_BASELINE,
    todayTraffic: 0,
    totalEnrolled: 1,
    totalGraduates: 0,
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

    recordRealStudentEnrollment().then(enrolledCount => {
      setTrafficStats(prev => ({
        ...prev,
        totalEnrolled: enrolledCount
      }));
    });

    // 2. Subscribe to real-time Cloud Firestore traffic updates
    const unsubscribeTraffic = listenToRealTraffic((data) => {
      setTrafficStats(prev => ({
        ...prev,
        totalTraffic: Math.max(prev.totalTraffic, data.totalViews || 0),
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
   * Xác định vai trò của tài khoản. Chỉ trả về 'admin' khi có nguồn khẳng định,
   * mọi trường hợp còn lại quy về 'student'.
   *
   * Có tra thêm sổ tài khoản `dmm_users_db` theo email vì đó là nguồn khai báo
   * gốc của tài khoản quản trị. Không có bước này thì những máy đã bị lỗi cũ
   * xoá mất role trong `dmm_active_user` sẽ không bao giờ khôi phục được quyền,
   * kể cả sau khi đăng nhập lại.
   */
  const resolveUserRole = (email, existingUser, cloudProfile) => {
    if (existingUser?.role === 'admin' || cloudProfile?.role === 'admin') return 'admin';
    try {
      const db = JSON.parse(localStorage.getItem('dmm_users_db') || '[]');
      const normalized = String(email || '').trim().toLowerCase();
      if (
        normalized &&
        Array.isArray(db) &&
        db.some((u) => String(u?.email || '').trim().toLowerCase() === normalized && u?.role === 'admin')
      ) {
        return 'admin';
      }
    } catch (e) {}
    return 'student';
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
          // Bộ làm sạch này trước đây NUỐT MẤT trường role, nên không tầng nào
          // phân biệt được admin với học viên. Dùng chung bộ phân giải với
          // listener đăng nhập để máy nào đã bị xoá mất role vẫn khôi phục được
          // ngay từ lần tải trang đầu, không phải chờ Firebase trả lời.
          role: resolveUserRole(parsed.email, parsed, null)
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

        const cloudProfile = await getUserProgressFromCloud(user.uid);

        const studentUser = {
          id: user.uid,
          email: user.email || (existingUser?.email || ''),
          name: (existingUser?.name || cloudProfile?.name || user.displayName || (user.email ? user.email.split('@')[0] : 'HỌC VIÊN')).toUpperCase(),
          phone: existingUser?.phone || cloudProfile?.phone || 'Chưa cập nhật',
          industry: existingUser?.industry || cloudProfile?.industry || 'Digital Marketing',
          coverBg: existingUser?.coverBg || cloudProfile?.coverBg || 'emerald',
          avatarUrl: existingUser?.avatarUrl || cloudProfile?.avatarUrl || '',
          createdAt: existingUser?.createdAt || cloudProfile?.createdAt || new Date().toLocaleDateString('vi-VN'),
          // Trường role BẮT BUỘC phải dựng lại ở đây. Thiếu nó thì listener này
          // vừa xoá quyền admin khỏi state, vừa ghi đè bản localStorage bên dưới
          // nên quyền mất luôn ở những lần tải trang sau — đúng triệu chứng
          // "admin không còn thấy nút Quản Trị".
          role: resolveUserRole(user.email || existingUser?.email, existingUser, cloudProfile)
        };

        setCurrentUser(studentUser);
        try {
          localStorage.setItem('dmm_active_user', JSON.stringify(studentUser));
        } catch (e) {}

        // Fetch cloud progress from Cloud Firestore
        if (cloudProfile && Array.isArray(cloudProfile.completedModules)) {
          setCompletedModules(cloudProfile.completedModules);
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

  // Ghi nhớ tiến độ trong state đang thuộc về tài khoản nào, để effect lưu
  // không ghi nhầm sang khoá của tài khoản vừa đăng nhập.
  const tradeProgressOwnerRef = useRef(null);

  // Điều kiện bắt buộc để mở khoá Trade Marketing: hoàn thành TOÀN BỘ khoá
  // Digital Marketing. Dùng phép so khớp theo id chứ không so độ dài mảng —
  // dữ liệu cũ trong máy có thể chứa id chuyên đề đã bị xoá, khiến đếm số
  // lượng vẫn đủ trong khi thực tế còn chuyên đề chưa học.
  const mainCompletedCount = COURSE_MODULES.filter((m) =>
    completedModules.includes(m.id)
  ).length;
  const isTradeCourseUnlocked = mainCompletedCount === COURSE_MODULES.length;

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

  // Re-load completedModules whenever currentUser changes & sync to Cloud
  useEffect(() => {
    const key = getProgressStorageKey(currentUser);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setCompletedModules(JSON.parse(saved));
      }
      if (currentUser) {
        localStorage.setItem('dmm_active_user', JSON.stringify(currentUser));
        localStorage.setItem('dmm_student_name', currentUser.name);

        // Cloud Firestore Sync (Immediate 100% sync on startup across all devices)
        const fullStudentData = {
          id: currentUser.id || currentUser.email.replace(/\./g, '_'),
          name: currentUser.name,
          phone: currentUser.phone || 'Chưa cập nhật',
          email: currentUser.email,
          industry: currentUser.industry || 'Kinh doanh',
          completedModules,
          updatedAt: new Date().toISOString()
        };
        recordStudentAccountToCloud(fullStudentData);
      } else {
        localStorage.removeItem('dmm_active_user');
      }
    } catch (e) {
      console.error("Error loading user progress", e);
    }
  }, [currentUser]);

  useEffect(() => {
    const key = getProgressStorageKey(currentUser);
    try {
      localStorage.setItem(key, JSON.stringify(completedModules));
      if (currentUser) {
        const fullStudentData = {
          id: currentUser.id || currentUser.email.replace(/\./g, '_'),
          name: currentUser.name,
          phone: currentUser.phone || 'Chưa cập nhật',
          email: currentUser.email,
          industry: currentUser.industry || 'Kinh doanh',
          completedModules,
          updatedAt: new Date().toISOString()
        };
        saveUserProgressToCloud(currentUser.id || currentUser.email.replace(/\./g, '_'), fullStudentData);
        recordStudentAccountToCloud(fullStudentData);
      }
      // Record real graduate achievement when all 11 modules completed
      if (completedModules.length === COURSE_MODULES.length) {
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
    tradeProgressOwnerRef.current = currentUser ? currentUser.id : null;
    setSelectedTradeModuleId(null);
  }, [currentUser]);

  // Lưu tiến độ Trade. Chốt chặn bằng ref: ngay sau khi đổi tài khoản, effect
  // này chạy trước khi state kịp cập nhật, nên nếu ghi ngay sẽ đổ tiến độ của
  // người cũ vào khoá của người mới.
  useEffect(() => {
    const ownerId = currentUser ? currentUser.id : null;
    if (tradeProgressOwnerRef.current !== ownerId) return;
    try {
      localStorage.setItem(getTradeProgressStorageKey(currentUser), JSON.stringify(completedTradeModules));
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

    setCurrentUser(user);
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
        trafficStats={trafficStats}
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
        passedCount={completedModules.length}
        totalModules={COURSE_MODULES.length}
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

