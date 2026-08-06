import React, { useState, useEffect } from 'react';
import { Calculator, Users, PieChart, TrendingUp } from 'lucide-react';
import {
  INDUSTRY_BENCHMARKS,
  STAFF_ROLE_BY_ID,
  STAFFING_TIERS,
  getStaffingTier,
} from '../data/toolsData';
import {
  FunnelBudgetTool,
  MarketSizeTool,
  VideoAdDiagnosticTool,
  AttributionReconcileTool,
  LtvCacTool,
  ToolShell,
  Field,
  Stat,
  Verdict,
  Note,
} from './MarketingFormulaTools';
import { safeDiv, vnd, num, pct } from '../utils/toolFormat';

/**
 * Bộ công cụ Trưởng phòng: vỏ ngoài, thanh chọn, và ba công cụ dùng bảng tham
 * chiếu ngành. Năm công cụ còn lại nằm ở MarketingFormulaTools.
 *
 * Mọi mảnh giao diện và hàm định dạng số đều lấy từ MarketingFormulaTools. Điều
 * này quan trọng hơn vẻ ngoài: trước đây hai tệp có hai hàm định dạng tiền
 * riêng, nên chuyển tab là kiểu hiển thị số đổi theo dù cùng một màn hình.
 */

/**
 * Danh mục công cụ. XUẤT RA NGOÀI vì App.jsx cần nó để đặt tiêu đề tab trình
 * duyệt cho địa chỉ `/cong-cu/<id>` và để loại bỏ id lạ trên thanh địa chỉ.
 * `id` ở đây là một phần địa chỉ công khai — đổi là làm chết liên kết đã gửi.
 */
export const MANAGER_TOOLS = [
  { id: 'budget', label: 'Phân Bổ Ngân Sách' },
  { id: 'roas', label: 'Hòa Vốn ROAS' },
  { id: 'staff', label: 'Định Biên Nhân Sự' },
  { id: 'funnel', label: 'Ngân Sách Ngược Phễu' },
  { id: 'market', label: 'TAM / SAM / SOM' },
  { id: 'video', label: 'Chẩn Đoán Video Ads' },
  { id: 'attribution', label: 'Đối Chiếu ROAS Đa Kênh' },
  { id: 'ltv', label: 'LTV / CAC' },
];

/* ================================================================
   CÔNG CỤ 1 — Phân bổ ngân sách theo ngành (Chuyên đề 01 và 03)
   ================================================================ */

function BudgetAllocationTool() {
  const [industryKey, setIndustryKey] = useState('ecommerce');
  const [revenue, setRevenue] = useState(1000000000);

  // Ba giả định tách khỏi bảng ngành để người dùng sửa đè.
  //
  // Đây là thay đổi quan trọng nhất của công cụ này. Không bảng số nào đúng cho
  // mọi doanh nghiệp trong cùng một ngành: chuỗi 200 cửa hàng và một shop online
  // cùng mã ngành nhưng chi phí mỗi khách lệch cả chục lần. Chọn ngành chỉ để
  // ĐIỀN SẴN, còn con số cuối cùng phải là của người dùng.
  const [budgetPct, setBudgetPct] = useState(INDUSTRY_BENCHMARKS.ecommerce.budgetPct * 100);
  const [cpl, setCpl] = useState(INDUSTRY_BENCHMARKS.ecommerce.avgCPL);
  const [leadToCustomer, setLeadToCustomer] = useState(INDUSTRY_BENCHMARKS.ecommerce.leadToCustomer * 100);

  const bench = INDUSTRY_BENCHMARKS[industryKey];

  // Đổi ngành thì nạp lại giá trị gợi ý. Người dùng sửa tiếp lên trên nền đó.
  useEffect(() => {
    const b = INDUSTRY_BENCHMARKS[industryKey];
    setBudgetPct(b.budgetPct * 100);
    setCpl(b.avgCPL);
    setLeadToCustomer(b.leadToCustomer * 100);
  }, [industryKey]);

  const total = revenue * (budgetPct / 100);

  // Lăng kính 1 — theo MỤC TIÊU (Chuyên đề 01)
  const brand = total * bench.brandPct;
  const performance = total - brand;

  // Lăng kính 2 — theo RỦI RO (Chuyên đề 03), giống nhau ở mọi ngành
  const core = total * 0.7;
  const emerging = total * 0.2;
  const experimental = total * 0.1;

  // Lăng kính 3 — theo LOẠI CHI PHÍ
  const media = total * bench.costSplit.media;
  const content = total * bench.costSplit.content;
  const martech = total * bench.costSplit.martech;

  // Phễu: chỉ phần tiền mua hiển thị mới sinh ra khách tiềm năng. Phần sản xuất
  // nội dung và công cụ không mua được lượt hiển thị nào.
  const leads = safeDiv(media, cpl);
  const customers = leads * (leadToCustomer / 100);
  const cac = safeDiv(media, customers);

  return (
    <ToolShell
      icon={PieChart}
      title="PHÂN BỔ NGÂN SÁCH MARKETING THEO NGÀNH"
      moduleRef="Chuyên đề 01 · Bài 2 và Chuyên đề 03 · Bài 2"
      intro="Chọn ngành để lấy bộ giả định khởi đầu, rồi sửa lại theo số thật của doanh nghiệp bạn. Cùng một tổng ngân sách được cắt theo ba lăng kính khác nhau, phục vụ ba câu hỏi khác nhau."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">Ngành hàng của doanh nghiệp</label>
            <select
              value={industryKey}
              onChange={(e) => setIndustryKey(e.target.value)}
              className="w-full bg-[#152037] border border-emerald-900/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {Object.entries(INDUSTRY_BENCHMARKS).map(([key, v]) => (
                <option key={key} value={key}>{v.name}</option>
              ))}
            </select>
          </div>

          <Field label="Doanh thu mục tiêu tháng (VNĐ)" value={revenue} onChange={setRevenue} step={100000000} hint={vnd(revenue)} />
          <Field label="Ngân sách marketing trên doanh thu" value={budgetPct} onChange={setBudgetPct} suffix="%" hint="Gợi ý theo ngành, sửa được" />
          <Field label="Chi phí mỗi khách tiềm năng thô (VNĐ)" value={cpl} onChange={setCpl} step={10000} hint={vnd(cpl)} />
          <Field label="Tỷ lệ khách tiềm năng thành khách mua" value={leadToCustomer} onChange={setLeadToCustomer} suffix="%" />

          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 space-y-1">
            <span className="text-[11px] font-bold text-emerald-400 block">Lưu ý riêng của ngành</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">{bench.note}</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-700/50 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs font-bold text-emerald-300">Tổng ngân sách marketing tháng</div>
              <div className="text-[11px] text-slate-300">{num(budgetPct, 1)}% của {vnd(revenue)}</div>
            </div>
            <div className="text-2xl font-black text-emerald-400">{vnd(total)}</div>
          </div>

          {/* Lăng kính 1 */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              Lăng kính 1 — Chia theo mục tiêu (Chuyên đề 01)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Stat label={`Xây dựng thương hiệu · ${pct(bench.brandPct, 0)}`} value={vnd(brand)} note="Làm việc với nhóm chưa có nhu cầu mua ngay" tone="amber" />
              <Stat label={`Kích hoạt bán hàng · ${pct(1 - bench.brandPct, 0)}`} value={vnd(performance)} note="Làm việc với nhóm đang có nhu cầu" />
            </div>
          </div>

          {/* Lăng kính 2 */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              Lăng kính 2 — Chia theo rủi ro, quy tắc 70/20/10 (Chuyên đề 03)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Stat label="Kênh trụ cột · 70%" value={vnd(core)} note="Đã chứng minh hiệu quả" />
              <Stat label="Kênh tiềm năng · 20%" value={vnd(emerging)} note="Đang phát triển nhanh" />
              <Stat label="Kênh thử nghiệm · 10%" value={vnd(experimental)} note="Nuôi ý tưởng cho năm sau" tone="amber" />
            </div>
          </div>

          {/* Lăng kính 3 */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              Lăng kính 3 — Chia theo loại chi phí
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Stat label={`Tiền mua hiển thị · ${pct(bench.costSplit.media, 0)}`} value={vnd(media)} note="Phần duy nhất mua được lượt tiếp cận" />
              <Stat label={`Sản xuất nội dung · ${pct(bench.costSplit.content, 0)}`} value={vnd(content)} note="Quay dựng, thiết kế, nhân sự nội dung" />
              <Stat label={`Công cụ & dữ liệu · ${pct(bench.costSplit.martech, 0)}`} value={vnd(martech)} note="CRM, tự động hoá, đo lường" />
            </div>
          </div>

          {/* Phễu dự báo */}
          <div className="p-4 rounded-2xl bg-[#152037] border border-emerald-900/50 space-y-3">
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">Dự báo kết quả từ phần tiền mua hiển thị</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Stat label="Khách tiềm năng thô" value={`${num(leads)} khách`} note={`${vnd(media)} chia ${vnd(cpl)}`} />
              <Stat label="Khách thực mua" value={`${num(customers)} khách`} note={`${num(leads)} nhân ${num(leadToCustomer, 1)}%`} />
              <Stat label="Chi phí thu hút mỗi khách" value={vnd(cac)} note="Tiền hiển thị chia số khách mua" tone="amber" />
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Phân biệt hai con số này là điều bắt buộc: <strong className="text-emerald-300">khách tiềm năng</strong> mới
              chỉ là người để lại thông tin, còn <strong className="text-emerald-300">khách thực mua</strong> mới sinh ra
              doanh thu. Chi phí thu hút mỗi khách luôn cao hơn chi phí mỗi khách tiềm năng, và khoảng cách giữa hai con số
              chính là chất lượng của tầng dưới phễu.
            </p>
          </div>

          <Note>
            Số liệu theo ngành chỉ là điểm khởi đầu để bạn có cái điền vào ô trống, không phải chuẩn ngành. Sau tháng đầu
            chạy thật, hãy thay bằng chi phí mỗi khách tiềm năng và tỷ lệ chuyển đổi của chính bạn. Mốc tham chiếu quốc tế
            cho tỷ lệ ngân sách trên doanh thu là 7,7% theo khảo sát CMO năm 2024 và 2025 của Gartner, nhưng con số này
            khảo sát trên doanh nghiệp lớn ở Bắc Mỹ và Tây Âu nên doanh nghiệp Việt Nam quy mô vừa thường cao hơn.
          </Note>
        </div>
      </div>
    </ToolShell>
  );
}

/* ================================================================
   CÔNG CỤ 2 — Ngưỡng hoà vốn quảng cáo (Chuyên đề 03 và 10)
   ================================================================ */

function BreakevenRoasTool() {
  const [price, setPrice] = useState(500000);
  const [margin, setMargin] = useState(40);
  const [currentCpa, setCurrentCpa] = useState(150000);
  const [repeatRate, setRepeatRate] = useState(0);

  const grossPerOrder = price * (margin / 100);
  // safeDiv chặn trường hợp biên gộp bằng 0. Trước đây 100/0 cho ra Infinity và
  // màn hình in thẳng chữ "Infinity x (Infinity%)" ra cho người dùng đọc.
  const breakevenRoas = safeDiv(1, margin / 100);
  const maxCpaFirstOrder = grossPerOrder;

  // Có mua lại thì trần chi phí thu hút được nới ra theo giá trị trọn đời.
  const ordersPerCustomer = 1 + repeatRate / 100;
  const ltvGross = grossPerOrder * ordersPerCustomer;
  const maxCpaWithLtv = ltvGross;

  const actualRoas = safeDiv(price, currentCpa);
  const profitPerOrder = ltvGross - currentCpa;
  const headroom = safeDiv(maxCpaWithLtv - currentCpa, maxCpaWithLtv);

  let level = 'good';
  if (profitPerOrder < 0) level = 'bad';
  else if (headroom < 0.2) level = 'warn';

  return (
    <ToolShell
      icon={TrendingUp}
      title="NGƯỠNG HOÀ VỐN QUẢNG CÁO: MAX CPA VÀ BREAKEVEN ROAS"
      moduleRef="Chuyên đề 03 · Bài 1 và Chuyên đề 10 · Bài 3"
      intro="Ngưỡng hoà vốn không phụ thuộc giá bán mà phụ thuộc biên lợi nhuận gộp. Đây là con số phải biết trước khi bật bất kỳ chiến dịch nào."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Field label="Giá bán sản phẩm (VNĐ)" value={price} onChange={setPrice} step={50000} hint={vnd(price)} />
          <Field label="Biên lợi nhuận gộp" value={margin} onChange={setMargin} suffix="%" hint="Sau giá vốn, chưa trừ chi phí marketing" />
          <Field label="Chi phí quảng cáo mỗi đơn hiện tại (VNĐ)" value={currentCpa} onChange={setCurrentCpa} step={10000} hint={vnd(currentCpa)} />
          <Field label="Tỷ lệ khách mua lại" value={repeatRate} onChange={setRepeatRate} suffix="%" hint="Để 0 nếu là sản phẩm mua một lần" />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Stat label="Lợi nhuận gộp mỗi đơn" value={vnd(grossPerOrder)} note={`${vnd(price)} nhân ${num(margin)}%`} />
            <Stat
              label="ROAS hoà vốn tối thiểu"
              value={margin > 0 ? `${num(breakevenRoas, 2)} lần` : 'Cần nhập biên gộp'}
              note="Bằng 1 chia biên lợi nhuận gộp"
            />
            <Stat label="Trần chi phí mỗi đơn đầu tiên" value={vnd(maxCpaFirstOrder)} note="Vượt mức này là lỗ ngay ở đơn đầu" tone="amber" />
            <Stat
              label="Trần chi phí khi tính cả mua lại"
              value={vnd(maxCpaWithLtv)}
              note={repeatRate > 0 ? `Trung bình ${num(ordersPerCustomer, 2)} đơn mỗi khách` : 'Chưa tính mua lại'}
              tone="amber"
            />
          </div>

          <Verdict
            level={level}
            title={
              profitPerOrder >= 0
                ? `Đang lãi ${vnd(profitPerOrder)} mỗi khách`
                : `Đang lỗ ${vnd(Math.abs(profitPerOrder))} mỗi khách`
            }
          >
            <p>
              Chi phí hiện tại {vnd(currentCpa)} so với trần {vnd(maxCpaWithLtv)}. ROAS thực tế đang là{' '}
              {num(actualRoas, 2)} lần, ngưỡng hoà vốn là {num(breakevenRoas, 2)} lần.
            </p>
            {profitPerOrder >= 0 && headroom < 0.2 && (
              <p>
                Khoảng đệm chỉ còn {pct(headroom)}. Chi phí quảng cáo mùa cao điểm thường tăng vài chục phần trăm, nên với
                khoảng đệm này bạn có thể lật sang lỗ mà không kịp phản ứng.
              </p>
            )}
            {profitPerOrder < 0 && (
              <p>
                Tăng ngân sách lúc này chỉ khuếch đại khoản lỗ. Hai đường ra: nâng biên lợi nhuận gộp, hoặc xây tỷ lệ mua
                lại để nới trần chi phí thu hút.
              </p>
            )}
          </Verdict>

          <Note>
            ROAS là tỷ số, không phải phần trăm, và nó tính trên doanh thu chứ không tính trên lợi nhuận. Đây cũng chỉ là
            ngưỡng hoà vốn của riêng chi phí quảng cáo: chi phí nhân sự, công cụ và sản xuất nội dung chưa nằm trong đây.
            Muốn nhìn bức tranh đầy đủ hãy dùng chỉ số MER ở công cụ Đối Chiếu ROAS Đa Kênh.
          </Note>
        </div>
      </div>
    </ToolShell>
  );
}

/* ================================================================
   CÔNG CỤ 3 — Định biên nhân sự (Chuyên đề 04, bài 3)
   ================================================================ */

function StaffingTool() {
  const [monthlyBudget, setMonthlyBudget] = useState(150000000);

  const tier = getStaffingTier(monthlyBudget);
  // Danh sách vai trò và con số hiển thị lấy từ CÙNG một mảng.
  //
  // Trước đây tiêu đề in ra một con số còn danh sách thẻ lại cắt theo công thức
  // khác (slice(0, count + 1)), nên ngân sách 150 triệu hiện tiêu đề "3 vị trí"
  // mà bên dưới đếm được 4 thẻ.
  const roles = tier.roleIds.map((id) => STAFF_ROLE_BY_ID[id]).filter(Boolean);
  const payroll = roles.reduce((sum, r) => sum + r.baseSalary, 0);
  const payrollRatio = safeDiv(payroll, monthlyBudget);
  const budgetPerHead = safeDiv(monthlyBudget, roles.length);

  return (
    <ToolShell
      icon={Users}
      title="ĐỊNH BIÊN NHÂN SỰ PHÒNG DIGITAL MARKETING"
      moduleRef="Chuyên đề 04 · Bài 3"
      intro="Chỉ số neo là ngân sách quảng cáo mà một nhân sự vận hành được. Gánh quá nhiều thì chỉ còn thời gian giữ cho chiến dịch chạy chứ không còn thời gian tối ưu; gánh quá ít thì chi phí nhân sự ăn mòn hiệu quả."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Field label="Ngân sách marketing hàng tháng (VNĐ)" value={monthlyBudget} onChange={setMonthlyBudget} step={20000000} hint={vnd(monthlyBudget)} />

          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-400 block">Bậc định biên: {tier.label}</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">{tier.summary}</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-300 block">Bốn bậc theo Chuyên đề 04</span>
            {STAFFING_TIERS.map((t) => (
              <div
                key={t.label}
                className={`text-[11px] px-2.5 py-1.5 rounded-lg border ${
                  t === tier
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-bold'
                    : 'bg-slate-900/30 border-slate-700/50 text-slate-400'
                }`}
              >
                {t.label} → {t.roleIds.length} vị trí
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Stat label="Số vị trí khuyên dùng" value={`${roles.length} vị trí`} note={tier.label} />
            <Stat label="Tổng chi phí đội ngũ tháng" value={vnd(payroll)} note="Đã gồm các khoản đóng theo lương" tone="amber" />
            <Stat
              label="Ngân sách mỗi nhân sự vận hành"
              value={vnd(budgetPerHead)}
              note="Chỉ số neo để biết đội đang gánh nặng hay nhẹ"
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              Khung nhân sự khuyên dùng ({roles.length} vị trí)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roles.map((role) => (
                <div key={role.id} className="p-3.5 rounded-xl bg-[#152037] border border-emerald-900/40 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white">{role.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-snug">{role.desc}</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800 shrink-0">
                    {vnd(role.baseSalary)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {payrollRatio > 0.5 ? (
            <Verdict level="bad" title={`Chi phí đội ngũ chiếm ${pct(payrollRatio)} ngân sách`}>
              <p>
                Tiền nuôi người đang vượt quá tiền chạy quảng cáo. Ở quy mô này nên giữ đội gọn hơn và thuê ngoài phần
                sản xuất, hoặc nâng ngân sách lên cho tương xứng với đội hình.
              </p>
            </Verdict>
          ) : payrollRatio > 0.3 ? (
            <Verdict level="warn" title={`Chi phí đội ngũ chiếm ${pct(payrollRatio)} ngân sách`}>
              <p>
                Tỷ lệ này còn chấp nhận được nhưng đã ở mức cần theo dõi. Hãy kiểm tra xem có vai trò nào đang làm việc
                thuê ngoài rẻ hơn hay không.
              </p>
            </Verdict>
          ) : (
            <Verdict level="good" title={`Chi phí đội ngũ chiếm ${pct(payrollRatio)} ngân sách`}>
              <p>Tỷ lệ hợp lý. Phần lớn ngân sách vẫn đang đi vào việc tiếp cận khách hàng thay vì nuôi bộ máy.</p>
            </Verdict>
          )}

          <Note>
            Mức lương là ước lượng cho thị trường Việt Nam và chênh lệch mạnh giữa Hà Nội, Thành phố Hồ Chí Minh và các
            tỉnh. Dùng để ước lượng tổng chi phí đội ngũ, không dùng làm khung lương khi tuyển thật. Bài toán tuyển thêm
            người hay thuê Agency được tính chi tiết trong Chuyên đề 04 bài 3, nhớ quy doanh thu tăng thêm về lợi nhuận
            gộp trước khi trừ chi phí.
          </Note>
        </div>
      </div>
    </ToolShell>
  );
}

/* ================================================================
   Vỏ ngoài
   ================================================================ */

/**
 * @param {string|null} openToolId Công cụ đang mở, do App.jsx đọc từ địa chỉ.
 * @param {(id: string) => void} onOpenTool Báo ngược lên khi người dùng đổi công cụ.
 *
 * Lựa chọn công cụ nằm ở App.jsx chứ không còn là state riêng của component:
 * nó phải xuất hiện trên thanh địa chỉ, mà giữ hai bản sao của cùng một lựa
 * chọn thì sớm muộn cũng có lúc địa chỉ nói một đằng màn hình hiện một nẻo.
 */
export default function ManagerTools({ openToolId, onOpenTool }) {
  // Địa chỉ là thứ người ngoài gõ được, nên không tin id truyền vào: `/cong-cu`
  // trống và `/cong-cu/xyz` sai đều rơi về công cụ đầu tiên thay vì màn trắng.
  const activeTool = MANAGER_TOOLS.some((t) => t.id === openToolId) ? openToolId : 'budget';
  const setActiveTool = (id) => onOpenTool?.(id);

  return (
    <div className="space-y-8">

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
              Tám phép tính bám đúng công thức trong bài học. Mọi giả định đều sửa đè được để dùng cho ngành nghề
              và quy mô của riêng bạn.
            </p>
          </div>
        </div>

        {/* Thanh chọn công cụ: 8 mục nên phải cho xuống dòng, không ép một hàng */}
        <div className="flex flex-wrap gap-1.5 bg-[#18243d] p-1.5 rounded-xl border border-emerald-900/40 mt-5">
          {MANAGER_TOOLS.map((t) => (
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

      {activeTool === 'budget' && <BudgetAllocationTool />}
      {activeTool === 'roas' && <BreakevenRoasTool />}
      {activeTool === 'staff' && <StaffingTool />}
      {activeTool === 'funnel' && <FunnelBudgetTool />}
      {activeTool === 'market' && <MarketSizeTool />}
      {activeTool === 'video' && <VideoAdDiagnosticTool />}
      {activeTool === 'attribution' && <AttributionReconcileTool />}
      {activeTool === 'ltv' && <LtvCacTool />}

      <div className="glass-panel p-5 rounded-2xl border border-emerald-900/40">
        <p className="text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-emerald-400">Về độ chính xác của các con số:</strong> giá trị điền sẵn theo ngành chỉ
          để bạn có cái bắt đầu, không phải chuẩn ngành. Hai doanh nghiệp cùng ngành có thể chênh nhau nhiều lần về chi
          phí mỗi khách tiềm năng. Sau tháng đầu chạy thật, hãy thay toàn bộ bằng số của chính bạn — lúc đó công cụ mới
          cho ra kết luận đáng để mang đi họp.
        </p>
      </div>

    </div>
  );
}
