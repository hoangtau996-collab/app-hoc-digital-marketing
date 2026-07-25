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

import { COURSE_MODULES } from './data/courseData';
import { INITIAL_NEWS_ITEMS } from './data/newsData';

export default function App() {
  const [activeTab, setActiveTab] = useState('course'); // 'course', 'news', 'tools'
  const [selectedModuleId, setSelectedModuleId] = useState(null); // null = overview, string = module view
  const [searchQuery, setSearchQuery] = useState('');
  const [isCertOpen, setIsCertOpen] = useState(false);

  // Persistent user progress in localStorage
  const [completedModules, setCompletedModules] = useState(() => {
    try {
      const saved = localStorage.getItem('dmm_completed_modules');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // News list state
  const [newsFeed, setNewsFeed] = useState(() => {
    try {
      const saved = localStorage.getItem('dmm_news_feed');
      return saved ? JSON.parse(saved) : INITIAL_NEWS_ITEMS;
    } catch (e) {
      return INITIAL_NEWS_ITEMS;
    }
  });

  useEffect(() => {
    localStorage.setItem('dmm_completed_modules', JSON.stringify(completedModules));
  }, [completedModules]);

  useEffect(() => {
    localStorage.setItem('dmm_news_feed', JSON.stringify(newsFeed));
  }, [newsFeed]);

  const selectedModule = COURSE_MODULES.find(m => m.id === selectedModuleId);

  const handlePassModule = (moduleId) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules(prev => [...prev, moduleId]);
    }
  };

  const handleAddNewNews = (newNewsItem) => {
    setNewsFeed(prev => [newNewsItem, ...prev]);
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
        setActiveTab={setActiveTab}
        passedCount={completedModules.length}
        totalModules={COURSE_MODULES.length}
        newsFeed={newsFeed}
        onOpenCertificate={() => setIsCertOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          
          {/* Left Sidebar / Mobile Touch Module Selector */}
          <Sidebar
            modules={COURSE_MODULES}
            selectedModuleId={selectedModuleId}
            onSelectModule={(id) => setSelectedModuleId(id)}
            completedModules={completedModules}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
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
                  onSelectModule={(id) => setSelectedModuleId(id)}
                  completedModules={completedModules}
                  searchQuery={searchQuery}
                />
              )
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
        onClose={() => setIsCertOpen(false)}
        passedCount={completedModules.length}
        totalModules={COURSE_MODULES.length}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        passedCount={completedModules.length}
        totalModules={COURSE_MODULES.length}
        onOpenCertificate={() => setIsCertOpen(true)}
      />

      {/* Footer */}
      <footer className="border-t border-emerald-950 bg-[#050907] py-6 px-4 text-center text-xs text-slate-500">
        <p>
          © 2026 E-Learning Trưởng Phòng Digital Marketing. Hệ thống kiến thức chuẩn hóa & Live Algorithm Updates.
        </p>
      </footer>

    </div>
  );
}
