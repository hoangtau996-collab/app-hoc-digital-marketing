import React from 'react';
import { BookOpen, Flame, Wrench, Award } from 'lucide-react';

export default function MobileBottomNav({ 
  activeTab, 
  setActiveTab, 
  passedCount, 
  totalModules, 
  onOpenCertificate 
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden glass-panel border-t border-emerald-900/60 p-1.5 px-3 bg-[#070d0a]/95 backdrop-blur-lg">
      <div className="flex items-center justify-around">
        
        {/* Tab 1: Course */}
        <button
          onClick={() => setActiveTab('course')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
            activeTab === 'course'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px]">Khóa Học</span>
        </button>

        {/* Tab 2: News */}
        <button
          onClick={() => setActiveTab('news')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition relative ${
            activeTab === 'news'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Flame className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-1" />
          </div>
          <span className="text-[10px]">Tin Live</span>
        </button>

        {/* Tab 3: Tools */}
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
            activeTab === 'tools'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span className="text-[10px]">Công Cụ</span>
        </button>

        {/* Tab 4: Certificate */}
        <button
          onClick={onOpenCertificate}
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-amber-400 hover:text-amber-300 transition"
        >
          <Award className="w-4 h-4" />
          <span className="text-[10px]">Chứng Chỉ ({passedCount}/{totalModules})</span>
        </button>

      </div>
    </div>
  );
}
