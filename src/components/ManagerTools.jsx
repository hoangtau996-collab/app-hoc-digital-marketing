import React, { useState } from 'react';
import { Calculator, DollarSign, Users, PieChart, TrendingUp } from 'lucide-react';
import { INDUSTRY_BENCHMARKS, STAFF_ROLES } from '../data/toolsData';
import {
  FunnelBudgetTool,
  MarketSizeTool,
  VideoAdDiagnosticTool,
  AttributionReconcileTool,
  LtvCacTool,
} from './MarketingFormulaTools';

/**
 * Danh sách công cụ khai báo tập trung thay vì viết cứng từng nút.
 *
 * Ba công cụ đầu tính trên bảng tham chiếu ngành trong toolsData nên nằm ngay
 * trong file này. Năm công cụ sau chỉ tính trên số liệu người dùng tự nhập nên
 * đặt ở MarketingFormulaTools, xem ghi chú đầu file đó.
 */
const TOOLS = [
  { id: 'budget', label: 'Phân Bổ Ngân Sách' },
  { id: 'roas', label: 'Hòa Vốn ROAS' },
  { id: 'staff', label: 'Định Biên Nhân Sự' },
  { id: 'funnel', label: 'Ngân Sách Ngược Phễu' },
  { id: 'market', label: 'TAM / SAM / SOM' },
  { id: 'video', label: 'Chẩn Đoán Video Ads' },
  { id: 'attribution', label: 'Đối Chiếu ROAS Đa Kênh' },
  { id: 'ltv', label: 'LTV / CAC' },
];

export default function ManagerTools() {
  const [activeTool, setActiveTool] = useState('budget');

  // Budget Calculator State
  const [targetRevenue, setTargetRevenue] = useState(1000000000); // 1 Tỷ
  const [selectedIndustry, setSelectedIndustry] = useState('ecommerce');

  // ROAS Calculator State
  const [productPrice, setProductPrice] = useState(500000); // 500k
  const [profitMargin, setProfitMargin] = useState(40); // 40%

  // Staffing Calculator State
  const [budgetLevel, setBudgetLevel] = useState(150000000); // 150tr/tháng

  const bench = INDUSTRY_BENCHMARKS[selectedIndustry];
  const totalBudget = targetRevenue * bench.budgetRatio;
  const adsBudget = totalBudget * bench.adsRatio;
  const contentBudget = totalBudget * bench.contentRatio;
  const brandingBudget = totalBudget * bench.brandingRatio;
  const techBudget = totalBudget * bench.techRatio;
  const estimatedLeads = Math.round(adsBudget / bench.avgCAC);

  // ROAS Calculations
  const grossProfit = productPrice * (profitMargin / 100);
  const maxCPA = grossProfit;
  const breakevenROAS = (100 / profitMargin).toFixed(2);

  // Staff Calculations
  const recommendedStaffCount = budgetLevel > 300000000 ? 5 : budgetLevel > 100000000 ? 3 : 2;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-glow-emerald">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold mb-2">
              <Calculator className="w-3.5 h-3.5" /> BỘ CÔNG CỤ THỰC CHUYÊN SÂU
            </div>
            <h2 className="text-2xl font-black text-white">
              BỘ CÔNG CỤ QUẢN LÝ DÀNH CHO TRƯỞNG PHÒNG
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Tám phép tính thực chiến: ngân sách, định biên nhân sự, ngưỡng hòa vốn, quy mô thị trường,
              chẩn đoán quảng cáo và sức khỏe mô hình kinh doanh.
            </p>
          </div>
        </div>

        {/* Thanh chọn công cụ: 8 mục nên phải cho xuống dòng, không ép một hàng */}
        <div className="flex flex-wrap gap-1.5 bg-[#18243d] p-1.5 rounded-xl border border-emerald-900/40 mt-5">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`px-3 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition ${
                activeTool === t.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tool 1: Budget Calculator */}
      {activeTool === 'budget' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Inputs Panel */}
          <div className="glass-panel p-6 rounded-2xl border border-emerald-900/40 space-y-5">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2 border-b border-emerald-900/40 pb-3">
              <DollarSign className="w-5 h-5 text-emerald-500" /> Nhập Thông Số Kinh Doanh
            </h3>

            {/* Target Revenue */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Doanh Thu Mục Tiêu Tháng (VNĐ):
              </label>
              <input
                type="number"
                value={targetRevenue}
                step={100000000}
                onChange={(e) => setTargetRevenue(Number(e.target.value))}
                className="w-full bg-[#152037] border border-emerald-900/60 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400">
                = {formatCurrency(targetRevenue)}
              </p>
            </div>

            {/* Industry Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Ngành Hàng Doanh Nghiệp:
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full bg-[#152037] border border-emerald-900/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {Object.keys(INDUSTRY_BENCHMARKS).map(key => (
                  <option key={key} value={key}>
                    {INDUSTRY_BENCHMARKS[key].name}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-emerald-400">Tỷ lệ % Ngân sách khuyên dùng:</span>
              <p>Ngành {bench.name} thường trích <strong>{(bench.budgetRatio * 100).toFixed(0)}%</strong> doanh thu cho Marketing.</p>
            </div>
          </div>

          {/* Outputs Panel */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-emerald-900/40 space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-400" /> Bảng Phân Bổ Ngân Sách Khuyên Dùng
              </h3>
              <span className="text-xs font-black text-emerald-400 px-3 py-1 bg-emerald-950 rounded-lg border border-emerald-800">
                Tổng Budget: {formatCurrency(totalBudget)}
              </span>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#152037] border border-emerald-900/40">
                <div className="text-xs text-slate-400">Paid Ads (Meta, TikTok, Google)</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">{formatCurrency(adsBudget)}</div>
                <div className="text-[11px] text-slate-500 mt-1">{(bench.adsRatio * 100)}% tổng ngân sách</div>
              </div>

              <div className="p-4 rounded-xl bg-[#152037] border border-emerald-900/40">
                <div className="text-xs text-slate-400">Sản xuất Content & Video Creative</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">{formatCurrency(contentBudget)}</div>
                <div className="text-[11px] text-slate-500 mt-1">{(bench.contentRatio * 100)}% tổng ngân sách</div>
              </div>

              <div className="p-4 rounded-xl bg-[#152037] border border-emerald-900/40">
                <div className="text-xs text-slate-400">Brand Building & Booking KOL/KOC</div>
                <div className="text-lg font-bold text-amber-400 mt-1">{formatCurrency(brandingBudget)}</div>
                <div className="text-[11px] text-slate-500 mt-1">{(bench.brandingRatio * 100)}% tổng ngân sách</div>
              </div>

              <div className="p-4 rounded-xl bg-[#152037] border border-emerald-900/40">
                <div className="text-xs text-slate-400">Phần mềm MarTech (CRM, Automation, Tool)</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">{formatCurrency(techBudget)}</div>
                <div className="text-[11px] text-slate-500 mt-1">{(bench.techRatio * 100)}% tổng ngân sách</div>
              </div>
            </div>

            {/* Estimated Output */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-700/50 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-300">Dự báo số lượng Khách hàng tiềm năng (Leads):</div>
                <div className="text-[11px] text-slate-300">Tính trên CAC ước tính {formatCurrency(bench.avgCAC)} / khách hàng</div>
              </div>
              <div className="text-2xl font-black text-emerald-400">
                ~ {estimatedLeads.toLocaleString()} Leads
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tool 2: ROAS Breakeven Calculator */}
      {activeTool === 'roas' && (
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-emerald-900/40 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-emerald-900/40 pb-3">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> TÍNH NGƯỠNG HÒA VỐN QUẢNG CÁO (BREAKEVEN ROAS & MAX CPA)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Giá bán Sản phẩm (VNĐ):
                </label>
                <input
                  type="number"
                  value={productPrice}
                  step={50000}
                  onChange={(e) => setProductPrice(Number(e.target.value))}
                  className="w-full bg-[#152037] border border-emerald-900/60 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Biên Lợi Nhuận Gộp (%):
                </label>
                <input
                  type="number"
                  value={profitMargin}
                  max={100}
                  min={1}
                  onChange={(e) => setProfitMargin(Number(e.target.value))}
                  className="w-full bg-[#152037] border border-emerald-900/60 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#152037] border border-emerald-900/60 space-y-4">
              <div>
                <span className="text-xs text-slate-400">Chi phí Chi trả Quảng cáo Tối đa / Đơn (Max CPA):</span>
                <div className="text-2xl font-black text-rose-400 mt-1">{formatCurrency(maxCPA)}</div>
                <p className="text-[11px] text-slate-400">Nếu CPA vượt quá số này, chiến dịch quảng cáo sẽ bị lỗ.</p>
              </div>

              <div className="pt-3 border-t border-emerald-900/40">
                <span className="text-xs text-slate-400">Chỉ số ROAS Hòa Vốn Tối thiểu (Breakeven ROAS):</span>
                <div className="text-3xl font-black text-emerald-400 mt-1">{breakevenROAS}x ({breakevenROAS * 100}%)</div>
                <p className="text-[11px] text-slate-400">Ví dụ: Chi 1 đồng tiền Ads phải thu về tối thiểu {breakevenROAS} đồng doanh thu.</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tool 3: Staffing Calculator */}
      {activeTool === 'staff' && (
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-emerald-900/40 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-emerald-900/40 pb-3">
            <Users className="w-5 h-5 text-emerald-400" /> TƯ VẤN ĐỊNH BIÊN NHÂN SỰ PHÒNG DIGITAL MARKETING
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Ngân Sách Vận Hành Marketing Hàng Tháng (VNĐ):
            </label>
            <input
              type="number"
              value={budgetLevel}
              step={20000000}
              onChange={(e) => setBudgetLevel(Number(e.target.value))}
              className="w-full max-w-md bg-[#152037] border border-emerald-900/60 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-400 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Khung Nhân Sự Khuyên Dùng ({recommendedStaffCount} vị trí chính):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STAFF_ROLES.slice(0, recommendedStaffCount + 1).map(role => (
                <div key={role.id} className="p-4 rounded-xl bg-[#152037] border border-emerald-900/40 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">{role.title}</h5>
                    <p className="text-[11px] text-slate-400">{role.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800 shrink-0">
                    ~ {formatCurrency(role.baseSalary)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Công cụ 4 đến 8: chỉ tính trên số liệu người dùng nhập, không dùng bảng ngành */}
      {activeTool === 'funnel' && <FunnelBudgetTool />}
      {activeTool === 'market' && <MarketSizeTool />}
      {activeTool === 'video' && <VideoAdDiagnosticTool />}
      {activeTool === 'attribution' && <AttributionReconcileTool />}
      {activeTool === 'ltv' && <LtvCacTool />}

    </div>
  );
}
