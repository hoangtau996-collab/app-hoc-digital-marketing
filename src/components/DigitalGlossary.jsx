import React, { useState } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { GLOSSARY_CATEGORIES, GLOSSARY_ITEMS } from '../data/glossaryData';
import { 
  Search, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Eye, 
  Target, 
  MousePointer, 
  Repeat, 
  CheckSquare, 
  Zap, 
  DollarSign, 
  BarChart2, 
  Award, 
  Compass, 
  RotateCcw, 
  Share2, 
  Globe, 
  RefreshCw, 
  Sparkles, 
  Home, 
  Video,
  Calculator,
  X,
  Copy,
  CheckCircle2,
  HelpCircle,
  // --- Bộ icon mở rộng cho 100 thuật ngữ bổ sung ---
  Coins,
  Scale,
  Gauge,
  UserX,
  UserCheck,
  UserPlus,
  ShoppingCart,
  CircleDollarSign,
  Package,
  Bell,
  Radar,
  Signal,
  Heart,
  TrendingDown,
  Clock,
  CirclePlay,
  Film,
  Anchor,
  Smartphone,
  Megaphone,
  Telescope,
  ThumbsUp,
  Star,
  Timer,
  Percent,
  Crosshair,
  Grid2x2,
  Blocks,
  LayoutGrid,
  Landmark,
  Shield,
  Funnel,
  Waypoints,
  Route,
  Layers,
  Contact,
  BadgeCheck,
  BadgePercent,
  Milestone,
  Network,
  Store,
  Rocket,
  Shuffle,
  Puzzle,
  Goal,
  Infinity as InfinityIcon,
  CreditCard,
  Image as ImageIcon,
  Boxes,
  Music,
  MessageCircle,
  Cpu,
  Newspaper,
  Handshake,
  Mic,
  Mail,
  Send,
  TabletSmartphone,
  MonitorSmartphone,
  Link2,
  FileText,
  ListChecks,
  Quote,
  FolderTree,
  Calendar,
  Speech,
  Palette,
  Camera,
  Sprout,
  Radio,
  Notebook,
  Flame,
  Bookmark,
  ChartColumn,
  ChartLine,
  ChartPie,
  Tag,
  Hash,
  Server,
  Cable,
  GitBranch,
  Split,
  Lock,
  Database,
  Podcast,
  Gift,
  Receipt,
  Wrench,
  Truck,
  Workflow,
  Bot,
  Brain,
  Orbit
} from 'lucide-react';

const ICON_MAP = {
  TrendingUp,
  Users,
  Eye,
  Target,
  MousePointer,
  Repeat,
  CheckSquare,
  Zap,
  DollarSign,
  BarChart2,
  Award,
  Compass,
  RotateCcw,
  Share2,
  Search,
  Globe,
  RefreshCw,
  Sparkles,
  Home,
  Video,
  Coins,
  Scale,
  Gauge,
  UserX,
  UserCheck,
  UserPlus,
  ShoppingCart,
  CircleDollarSign,
  Package,
  Bell,
  Radar,
  Signal,
  Heart,
  TrendingDown,
  Clock,
  CirclePlay,
  Film,
  Anchor,
  Smartphone,
  Megaphone,
  Telescope,
  ThumbsUp,
  Star,
  Timer,
  Percent,
  Crosshair,
  Grid2x2,
  Blocks,
  LayoutGrid,
  Landmark,
  Shield,
  Funnel,
  Waypoints,
  Route,
  Layers,
  Contact,
  BadgeCheck,
  BadgePercent,
  Milestone,
  Network,
  Store,
  Rocket,
  Shuffle,
  Puzzle,
  Goal,
  Infinity: InfinityIcon,
  CreditCard,
  Image: ImageIcon,
  Boxes,
  Music,
  MessageCircle,
  Cpu,
  Newspaper,
  Handshake,
  Mic,
  Mail,
  Send,
  TabletSmartphone,
  MonitorSmartphone,
  Link2,
  FileText,
  ListChecks,
  Quote,
  FolderTree,
  Calendar,
  Speech,
  Palette,
  Camera,
  Sprout,
  Radio,
  Notebook,
  Flame,
  Bookmark,
  ChartColumn,
  ChartLine,
  ChartPie,
  Tag,
  Hash,
  Server,
  Cable,
  GitBranch,
  Split,
  Lock,
  Database,
  Podcast,
  Gift,
  Receipt,
  Wrench,
  Truck,
  Workflow,
  Bot,
  Brain,
  Orbit
};

export default function DigitalGlossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Calculator State
  const [calcType, setCalcType] = useState('roas'); // 'roas', 'cac', 'cpl', 'cpm'
  const [spendInput, setSpendInput] = useState(10000000);
  const [revenueInput, setRevenueInput] = useState(50000000);
  const [conversionsInput, setConversionsInput] = useState(20);
  const [impressionsInput, setImpressionsInput] = useState(250000);

  const filteredTerms = GLOSSARY_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.shortDef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyTerm = (item) => {
    const textToCopy = `${item.term}\n\nĐịnh nghĩa: ${item.definition}\n\n${item.formula ? 'Công thức: ' + item.formula + '\n\n' : ''}Ví dụ: ${item.example}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Calculator Results
  const calculateResult = () => {
    if (calcType === 'roas') {
      if (!spendInput || spendInput <= 0) return 0;
      return (revenueInput / spendInput).toFixed(2);
    }
    if (calcType === 'cac' || calcType === 'cpl') {
      if (!conversionsInput || conversionsInput <= 0) return 0;
      return Math.round(spendInput / conversionsInput).toLocaleString('vi-VN');
    }
    if (calcType === 'cpm') {
      if (!impressionsInput || impressionsInput <= 0) return 0;
      return Math.round((spendInput / impressionsInput) * 1000).toLocaleString('vi-VN');
    }
    return 0;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-emerald-500/40 p-6 md:p-10 bg-glow-radial shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-700/60 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <PMarcomLogo className="w-5 h-5" showText={false} /> KHO THƯ VIỆN THUẬT NGỮ THỰC CHIẾN
            </div>
            
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              TỪ ĐIỂN THUẬT NGỮ <span className="text-gradient-emerald">DIGITAL MARKETING</span>
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Tra cứu nhanh <strong>{GLOSSARY_ITEMS.length} thuật ngữ chuyên ngành</strong> cốt lõi cho Trưởng phòng (ROAS, CAC, MER, LTV/CAC, SOSTAC, GA4, CDP, Livestream Commerce...) kèm định nghĩa chuẩn hóa, công thức toán học và ví dụ minh họa thực tế.
            </p>
          </div>

          <button
            onClick={() => setShowCalcModal(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-amber-950/50 transition shrink-0 cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>Công Cụ Tính Chỉ Số Live</span>
          </button>

        </div>

        {/* Live Search Input */}
        <div className="relative max-w-2xl pt-2">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Nhập thuật ngữ cần tra cứu (VD: ROAS, CPM, CAC, SEO, Hook 3s...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111a2e] border border-emerald-500/60 focus:border-emerald-400 rounded-2xl pl-12 pr-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {GLOSSARY_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/50'
                : 'bg-[#18243d] text-slate-300 border border-emerald-900/50 hover:border-emerald-700/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Result Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 -mb-2">
        <span>
          Hiển thị <strong className="text-emerald-400">{filteredTerms.length}</strong> / {GLOSSARY_ITEMS.length} thuật ngữ
        </span>
        {(searchQuery || selectedCategory !== 'all') && (
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition cursor-pointer"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Glossary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredTerms.map(item => {
          const IconComp = ICON_MAP[item.icon] || BookOpen;

          return (
            <div 
              key={item.id}
              className="glass-panel rounded-2xl p-5 border border-emerald-900/50 hover:border-emerald-500/60 transition flex flex-col justify-between space-y-4 group bg-[#111a2e]/90 shadow-xl"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        {item.categoryLabel}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                        {item.term}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyTerm(item)}
                    title="Sao chép thuật ngữ"
                    className="p-1.5 rounded-lg bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white transition"
                  >
                    {copiedId === item.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Short Def */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {item.shortDef}
                </p>

                {/* Formula Highlight if present */}
                {item.formula && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-[11px] font-mono text-emerald-300">
                    <strong className="block text-[10px] font-sans font-bold text-amber-400 mb-0.5">📐 CÔNG THỨC:</strong>
                    {item.formula}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedTerm(item)}
                className="w-full py-2 rounded-xl bg-[#1a2742] border border-emerald-900/60 hover:border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Xem Giải Thích & Ví Dụ</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </button>

            </div>
          );
        })}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12 glass-panel rounded-2xl border border-emerald-900/40 space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-sm font-bold text-white">Không tìm thấy thuật ngữ phù hợp</h4>
          <p className="text-xs text-slate-400">Hãy thử gõ từ khóa khác như CPM, ROAS, CAC, SOSTAC...</p>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-auto glass-panel rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
            
            <button
              onClick={() => setSelectedTerm(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-emerald-900/40 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  {selectedTerm.categoryLabel}
                </span>
                <h3 className="text-xl font-black text-white">
                  {selectedTerm.term}
                </h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <div>
                <h4 className="font-bold text-emerald-400 mb-1">📖 Định Nghĩa Chuyên Sâu:</h4>
                <p className="text-slate-200">{selectedTerm.definition}</p>
              </div>

              {selectedTerm.formula && (
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600/60 font-mono text-emerald-200 space-y-1">
                  <h4 className="font-sans font-bold text-amber-400 text-xs">📐 CÔNG THỨC TOÁN HỌC:</h4>
                  <p className="text-xs sm:text-sm font-semibold">{selectedTerm.formula}</p>
                </div>
              )}

              {selectedTerm.example && (
                <div className="p-4 rounded-xl bg-[#121c31] border border-emerald-900/60 space-y-1">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    💡 VÍ DỤ MINH HỌA THỰC TẾ:
                  </h4>
                  <p className="text-slate-300">{selectedTerm.example}</p>
                </div>
              )}

              {selectedTerm.takeaway && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-700/60 text-emerald-200 space-y-1">
                  <strong className="font-bold text-emerald-400 block">⭐ LƯU Ý CỐT LÕI CHO TRƯỞNG PHÒNG:</strong>
                  <p>{selectedTerm.takeaway}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTerm(null)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition cursor-pointer"
              >
                Đã Hiểu
              </button>
            </div>

          </div>
        </div>
      )}

      {/* INTERACTIVE METRIC CALCULATOR MODAL */}
      {showCalcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg my-auto glass-panel rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
            
            <button
              onClick={() => setShowCalcModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-emerald-900/40 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-600/60 flex items-center justify-center text-amber-400 shrink-0">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  CÔNG CỤ TÍNH CHỈ SỐ DIGITAL LIVE
                </h3>
                <p className="text-xs text-slate-400">Tự động tính toán ROAS, CAC, CPL, CPM theo thời gian thực</p>
              </div>
            </div>

            {/* Metric Type Selector */}
            <div className="grid grid-cols-4 gap-1.5 bg-[#152037] p-1 rounded-xl border border-emerald-900/50">
              {['roas', 'cac', 'cpl', 'cpm'].map(type => (
                <button
                  key={type}
                  onClick={() => setCalcType(type)}
                  className={`py-2 rounded-lg text-xs font-bold uppercase transition ${
                    calcType === type ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Tổng Chi Phí Quảng Cáo (VNĐ):</label>
                <input
                  type="number"
                  value={spendInput}
                  onChange={(e) => setSpendInput(Number(e.target.value))}
                  className="w-full bg-[#111a2e] border border-emerald-900/60 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              {calcType === 'roas' && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Tổng Doanh Thu Tạo Ra (VNĐ):</label>
                  <input
                    type="number"
                    value={revenueInput}
                    onChange={(e) => setRevenueInput(Number(e.target.value))}
                    className="w-full bg-[#111a2e] border border-emerald-900/60 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              )}

              {(calcType === 'cac' || calcType === 'cpl') && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">
                    {calcType === 'cac' ? 'Số Khách Hàng Mới:' : 'Số Leads Thu Được:'}
                  </label>
                  <input
                    type="number"
                    value={conversionsInput}
                    onChange={(e) => setConversionsInput(Number(e.target.value))}
                    className="w-full bg-[#111a2e] border border-emerald-900/60 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              )}

              {calcType === 'cpm' && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Tổng Số Lượt Hiển Thị (Impressions):</label>
                  <input
                    type="number"
                    value={impressionsInput}
                    onChange={(e) => setImpressionsInput(Number(e.target.value))}
                    className="w-full bg-[#111a2e] border border-emerald-900/60 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              )}
            </div>

            {/* Calculated Result Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-teal-950 border-2 border-emerald-500 text-center space-y-1 shadow-xl">
              <span className="text-xs text-emerald-400 font-bold uppercase">KẾT QUẢ TÍNH TOÁN {calcType.toUpperCase()}:</span>
              <div className="text-3xl font-black text-amber-400">
                {calculateResult()} {calcType === 'roas' ? 'x' : 'VNĐ'}
              </div>
              <p className="text-[11px] text-slate-300 pt-1">
                {calcType === 'roas' && `1 đồng tiền Ads mang về ${calculateResult()} đồng doanh thu.`}
                {calcType === 'cac' && `Chi phí trung bình để thu hút 1 khách mới là ${calculateResult()} VNĐ.`}
                {calcType === 'cpl' && `Chi phí thu thập 1 Lead tư vấn là ${calculateResult()} VNĐ.`}
                {calcType === 'cpm' && `Chi phí hiển thị 1.000 lần quảng cáo là ${calculateResult()} VNĐ.`}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
