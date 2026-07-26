import React, { useState, useEffect } from 'react';
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
  recordRealStudentEnrollment,
  recordRealStudentGraduate,
  listenToRealStats
} from './firebase';

import { COURSE_MODULES } from './data/courseData';
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
      return localStorage.getItem('dmm_theme') || 'system';
    } catch (e) {
      return 'system';
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

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');

      const handleChange = (e) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  // Real Web Traffic & Student Statistics (100% Real numbers measured strictly from real data)
  const [trafficStats, setTrafficStats] = useState({
    totalTraffic: 1,
    totalEnrolled: 1,
    totalGraduates: 0,
    onlineActive: 1
  });

  // Real-time Web Traffic & Student Stats tracker from Firebase Cloud & Local persistence
  useEffect(() => {
    // 1. Record real page view & real enrollment
    recordRealTrafficVisit().then(initialCount => {
      setTrafficStats(prev => ({
        ...prev,
        totalTraffic: initialCount
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
        totalTraffic: data.totalViews || prev.totalTraffic
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

  // Active student account
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dmm_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const studentUser = {
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0].toUpperCase(),
          createdAt: new Date().toLocaleDateString('vi-VN')
        };
        setCurrentUser(studentUser);

        // Fetch cloud progress from Cloud Firestore
        const cloudData = await getUserProgressFromCloud(user.uid);
        if (cloudData && Array.isArray(cloudData.completedModules)) {
          setCompletedModules(cloudData.completedModules);
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

  // News list state
  const [newsFeed, setNewsFeed] = useState(() => {
    try {
      const saved = localStorage.getItem('dmm_news_feed');
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

  useEffect(() => {
    try {
      localStorage.setItem('dmm_news_feed', JSON.stringify(newsFeed));
    } catch (e) {}
  }, [newsFeed]);

  const selectedModule = COURSE_MODULES.find(m => m.id === selectedModuleId);

  const [migrationNotice, setMigrationNotice] = useState('');

  const handlePassModule = (moduleId) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules(prev => [...prev, moduleId]);
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
  const handleProtectedSelectModule = (id) => {
    if (!currentUser) {
      setMigrationNotice('🔒 Vui lòng Đăng Ký / Đăng Nhập tài khoản học viên để tham gia học & làm bài trắc nghiệm!');
      setIsAuthOpen(true);
      return;
    }
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
    <div className="min-h-screen bg-[#070d0a] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16 lg:pb-0">
      
      {/* Top Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleProtectedSelectTab}
        passedCount={completedModules.length}
        totalModules={COURSE_MODULES.length}
        newsFeed={newsFeed}
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
        onOpenAdminModal={() => setIsAdminOpen(true)}
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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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
      <footer className="border-t border-emerald-950 bg-[#050907] py-6 px-4 text-center text-xs text-slate-500">
        <p>
          © 2026 HỌC VIỆN P MARCOM. Hệ thống Khóa Học Digital Thực Chiến.
        </p>
      </footer>

    </div>
  );
}

