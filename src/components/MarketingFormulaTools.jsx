import React, { useState } from 'react';
import {
  Filter,
  Globe2,
  Video,
  Layers,
  Repeat,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { safeDiv, vnd, num, pct } from '../utils/toolFormat';

/**
 * Năm công cụ tính bổ sung cho bộ công cụ Trưởng phòng.
 *
 * Vì sao tách khỏi ManagerTools: ba công cụ cũ dùng chung bảng tham chiếu ngành
 * trong toolsData. Năm công cụ này ngược lại, chỉ tính trên số liệu người dùng
 * tự nhập, không có hằng số ngành nào. Gộp chung vào một file sẽ khiến chỗ nào
 * là giả định của hệ thống, chỗ nào là dữ liệu của học viên bị lẫn vào nhau.
 *
 * Mỗi công cụ bám đúng công thức của một chuyên đề cụ thể, ghi rõ ở trường
 * moduleRef, để học viên tính xong còn quay lại đọc phần lý thuyết tương ứng.
 *
 * Quy ước chống chia cho 0: mọi phép chia đi qua safeDiv, trả về 0 thay vì
 * Infinity hay NaN. Người dùng xoá trắng một ô là chuyện xảy ra liên tục.
 */

/* ============ Mảnh giao diện dùng chung ============
   Hàm định dạng số nằm ở utils/toolFormat để tệp này chỉ xuất ra component,
   nếu không Fast Refresh của Vite sẽ tải lại cả trang mỗi lần sửa. */

export function ToolShell({ icon: Icon, title, moduleRef, intro, children }) {
  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl border border-emerald-900/40 space-y-6">
      <div className="border-b border-emerald-900/40 pb-3 space-y-2">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            <Icon className="w-5 h-5 text-emerald-400 shrink-0" />
            {title}
          </h3>
          <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-600/40 shrink-0">
            {moduleRef}
          </span>
        </div>
        {intro && <p className="text-[11px] text-slate-400 leading-relaxed">{intro}</p>}
      </div>
      {children}
    </div>
  );
}

export function Field({ label, value, onChange, step = 1, suffix, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-300 block">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          step={step}
          min={0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-[#152037] border border-emerald-900/60 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-slate-500 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-[10px] text-slate-500">{hint}</p>}
    </div>
  );
}

export function Stat({ label, value, note, tone = 'emerald' }) {
  // Tailwind quét tên lớp theo chuỗi tĩnh nên không ghép động được.
  const toneText =
    tone === 'rose' ? 'text-rose-400' : tone === 'amber' ? 'text-amber-400' : 'text-emerald-400';
  return (
    <div className="p-4 rounded-xl bg-[#152037] border border-emerald-900/40">
      <div className="text-[11px] text-slate-400 leading-snug">{label}</div>
      <div className={`text-lg font-black mt-1 ${toneText}`}>{value}</div>
      {note && <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">{note}</div>}
    </div>
  );
}

/** Khối kết luận: xanh khi đạt, hổ phách khi cần chú ý, đỏ khi hỏng. */
export function Verdict({ level, title, children }) {
  const map = {
    good: { box: 'bg-emerald-950/60 border-emerald-600/50', head: 'text-emerald-300', Icon: CheckCircle2 },
    warn: { box: 'bg-amber-950/50 border-amber-600/50', head: 'text-amber-300', Icon: AlertTriangle },
    bad: { box: 'bg-rose-950/50 border-rose-600/50', head: 'text-rose-300', Icon: AlertTriangle },
  };
  const s = map[level] || map.warn;
  return (
    <div className={`p-4 sm:p-5 rounded-2xl border-2 flex items-start gap-3 ${s.box}`}>
      <s.Icon className={`w-5 h-5 shrink-0 mt-0.5 ${s.head}`} />
      <div className="space-y-1 flex-1">
        <strong className={`text-xs font-black uppercase tracking-wide block ${s.head}`}>{title}</strong>
        <div className="text-xs sm:text-sm text-slate-100 leading-relaxed space-y-1.5">{children}</div>
      </div>
    </div>
  );
}

export function Note({ children }) {
  return (
    <div className="flex items-start gap-2 text-[10px] text-slate-500 leading-relaxed">
      <Info className="w-3 h-3 shrink-0 mt-0.5" />
      <p>{children}</p>
    </div>
  );
}

/* ================================================================
   CÔNG CỤ 4 — Tính ngược ngân sách theo phễu (Chuyên đề 03, bài 3)
   ================================================================ */

export function FunnelBudgetTool() {
  const [revenue, setRevenue] = useState(3000000000);
  const [aov, setAov] = useState(20000000);
  const [closeRate, setCloseRate] = useState(12);
  const [reachRate, setReachRate] = useState(60);
  const [cpl, setCpl] = useState(180000);
  const [opex, setOpex] = useState(135000000);

  const orders = safeDiv(revenue, aov);
  const qualifiedLeads = safeDiv(orders, closeRate / 100);
  const rawLeads = safeDiv(qualifiedLeads, reachRate / 100);
  const adBudget = rawLeads * cpl;
  const total = adBudget + opex;
  const ratio = safeDiv(total, revenue);

  // Hai đòn bẩy đặt cạnh nhau: tối ưu quảng cáo so với sửa tầng dưới phễu.
  // Mọi phép chia đều qua safeDiv vì người dùng xoá trắng một ô là chuyện thường.
  const saveFromCpl = adBudget - rawLeads * cpl * 0.9;
  const closeUp2 = closeRate + 2;
  const rawLeadsIfCloseUp2 = safeDiv(safeDiv(orders, closeUp2 / 100), reachRate / 100);
  const saveFromClose = adBudget - rawLeadsIfCloseUp2 * cpl;
  const closeWins = saveFromClose > saveFromCpl;

  return (
    <ToolShell
      icon={Filter}
      title="TÍNH NGƯỢC NGÂN SÁCH TỪ MỤC TIÊU DOANH THU"
      moduleRef="Chuyên đề 03 · Bài 3"
      intro="Khi Ban Giám Đốc hỏi vì sao cần từng ấy tiền, câu trả lời không được phép là theo kinh nghiệm. Công cụ này đi ngược từ doanh thu mục tiêu qua từng tầng phễu để ra con số bảo vệ được."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Field label="Doanh thu mục tiêu tháng (VNĐ)" value={revenue} onChange={setRevenue} step={100000000} hint={vnd(revenue)} />
          <Field label="Giá trị đơn hàng trung bình (VNĐ)" value={aov} onChange={setAov} step={1000000} hint={vnd(aov)} />
          <Field label="Tỷ lệ chốt của đội bán hàng" value={closeRate} onChange={setCloseRate} suffix="%" />
          <Field label="Tỷ lệ khách để lại thông tin mà liên hệ được" value={reachRate} onChange={setReachRate} suffix="%" />
          <Field label="Chi phí mỗi khách tiềm năng thô (VNĐ)" value={cpl} onChange={setCpl} step={10000} hint={vnd(cpl)} />
          <Field label="Chi phí vận hành tháng (VNĐ)" value={opex} onChange={setOpex} step={5000000} hint="Nhân sự, công cụ, sản xuất nội dung" />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Stat label="Số đơn hàng cần có" value={`${num(orders)} đơn`} note="Doanh thu chia giá trị đơn trung bình" />
            <Stat label="Số khách tiềm năng đạt chuẩn" value={`${num(qualifiedLeads)} khách`} note="Số đơn chia tỷ lệ chốt" />
            <Stat label="Số khách thô cần thu về" value={`${num(rawLeads)} khách`} note="Đã tính hao hụt do không liên hệ được" />
            <Stat label="Ngân sách quảng cáo cần thiết" value={vnd(adBudget)} note="Số khách thô nhân chi phí mỗi khách" />
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-700/50 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs font-bold text-emerald-300">Tổng ngân sách đề xuất</div>
              <div className="text-[11px] text-slate-300">Quảng cáo cộng chi phí vận hành</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-emerald-400">{vnd(total)}</div>
              <div className="text-[11px] text-slate-300">chiếm {pct(ratio)} doanh thu mục tiêu</div>
            </div>
          </div>

          {ratio > 0.2 ? (
            <Verdict level="bad" title="Tỷ lệ ngân sách trên doanh thu quá cao">
              <p>
                Mức {pct(ratio)} vượt xa mốc tham chiếu 7,7% doanh thu mà khảo sát CMO của Gartner ghi nhận.
                Trước khi xin thêm tiền, hãy kiểm tra biên lợi nhuận gộp có gánh nổi không và điểm nghẽn có nằm ở
                tầng dưới phễu không.
              </p>
            </Verdict>
          ) : ratio > 0.15 ? (
            <Verdict level="warn" title="Tỷ lệ ngân sách cao hơn mức thông thường">
              <p>
                Mức {pct(ratio)} cao hơn mốc tham chiếu 7,7% doanh thu của khảo sát Gartner. Vẫn bảo vệ được
                nếu bạn giải trình rõ lý do, ví dụ đang mở thị trường mới hoặc đang giành thị phần.
              </p>
            </Verdict>
          ) : (
            <Verdict level="good" title="Tỷ lệ ngân sách nằm trong khung hợp lý">
              <p>Mức {pct(ratio)} doanh thu là con số trình được. Việc còn lại là bảo vệ từng giả định đầu vào.</p>
            </Verdict>
          )}

          <div className="p-4 rounded-2xl bg-[#152037] border border-emerald-900/50 space-y-3">
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              Đòn bẩy nào mạnh hơn
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border ${closeWins ? 'border-slate-700 bg-slate-900/40' : 'border-emerald-600/60 bg-emerald-950/40'}`}>
                <div className="text-[11px] text-slate-400">Tối ưu quảng cáo, giảm chi phí mỗi khách 10%</div>
                <div className="text-base font-black text-emerald-400 mt-1">Tiết kiệm {vnd(saveFromCpl)}</div>
              </div>
              <div className={`p-3 rounded-xl border ${closeWins ? 'border-emerald-600/60 bg-emerald-950/40' : 'border-slate-700 bg-slate-900/40'}`}>
                <div className="text-[11px] text-slate-400">Đào tạo đội bán, nâng tỷ lệ chốt lên {num(closeUp2, 1)}%</div>
                <div className="text-base font-black text-emerald-400 mt-1">Tiết kiệm {vnd(saveFromClose)}</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {closeWins
                ? 'Sửa tầng dưới phễu đang có tác động lớn hơn tối ưu quảng cáo. Hãy kiểm tra đội bán hàng trước khi xin thêm ngân sách.'
                : 'Ở cấu hình hiện tại, tối ưu quảng cáo đang cho tác động lớn hơn. Dù vậy vẫn nên rà lại tỷ lệ chốt vì đó là phần bền hơn.'}
            </p>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

/* ================================================================
   CÔNG CỤ 5 — Quy mô thị trường TAM / SAM / SOM (Chuyên đề 05, bài 4)
   ================================================================ */

export function MarketSizeTool() {
  const [totalCustomers, setTotalCustomers] = useState(280000);
  const [valuePerYear, setValuePerYear] = useState(18000000);
  const [fitRate, setFitRate] = useState(35);
  const [accessRate, setAccessRate] = useState(40);
  const [yearBudget, setYearBudget] = useState(3000000000);
  const [cac, setCac] = useState(2500000);

  const tam = totalCustomers * valuePerYear;
  const samCustomers = totalCustomers * (fitRate / 100) * (accessRate / 100);
  const sam = samCustomers * valuePerYear;
  const somCustomers = safeDiv(yearBudget, cac);
  const som = somCustomers * valuePerYear;
  const somShare = safeDiv(som, sam);
  const overSam = somCustomers > samCustomers && samCustomers > 0;

  return (
    <ToolShell
      icon={Globe2}
      title="QUY MÔ THỊ TRƯỜNG TAM / SAM / SOM"
      moduleRef="Chuyên đề 05 · Bài 4"
      intro="Trước khi cam kết một con số doanh thu, phải kiểm tra thị trường có đủ lớn để chứa mục tiêu đó không. SOM không phải con số mơ ước mà là kết quả chia ngân sách cho chi phí thu hút khách."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Field label="Tổng số khách hàng tiềm năng trên địa bàn" value={totalCustomers} onChange={setTotalCustomers} step={1000} hint={`${num(totalCustomers)} khách`} />
          <Field label="Giá trị mỗi khách mang lại trong 1 năm (VNĐ)" value={valuePerYear} onChange={setValuePerYear} step={1000000} hint={vnd(valuePerYear)} />
          <Field label="Tỷ lệ khách thực sự phù hợp với sản phẩm" value={fitRate} onChange={setFitRate} suffix="%" hint="Lọc theo quy mô, nhu cầu, khả năng chi trả" />
          <Field label="Tỷ lệ khách phù hợp mà bạn với tới được" value={accessRate} onChange={setAccessRate} suffix="%" hint="Lọc theo địa bàn, kênh phân phối, thói quen mua" />
          <Field label="Ngân sách marketing cả năm (VNĐ)" value={yearBudget} onChange={setYearBudget} step={100000000} hint={vnd(yearBudget)} />
          <Field label="Chi phí thu hút một khách hàng (VNĐ)" value={cac} onChange={setCac} step={100000} hint={vnd(cac)} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#152037] border border-sky-800/50">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-black text-sky-300">TAM — Tổng thị trường</span>
                <span className="text-lg font-black text-sky-400">{vnd(tam)}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full mt-2 border border-sky-900/60">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: '100%' }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">{num(totalCustomers)} khách nhân giá trị mỗi khách mỗi năm</p>
            </div>

            <div className="p-4 rounded-xl bg-[#152037] border border-teal-800/50">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-black text-teal-300">SAM — Thị trường phục vụ được</span>
                <span className="text-lg font-black text-teal-400">{vnd(sam)}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full mt-2 border border-teal-900/60">
                <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400" style={{ width: `${Math.min(100, safeDiv(sam, tam) * 100)}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">{num(samCustomers)} khách, bằng {pct(safeDiv(sam, tam))} của TAM</p>
            </div>

            <div className="p-4 rounded-xl bg-[#152037] border border-amber-700/50">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-black text-amber-300">SOM — Thị phần giành được trong 12 tháng</span>
                <span className="text-lg font-black text-amber-400">{vnd(som)}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full mt-2 border border-amber-900/60">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300" style={{ width: `${Math.min(100, safeDiv(som, tam) * 100)}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">{num(somCustomers)} khách, bằng {pct(somShare)} của SAM</p>
            </div>
          </div>

          {overSam ? (
            <Verdict level="bad" title="SOM đang vượt quá SAM, tức là có gì đó sai">
              <p>
                Ngân sách của bạn đủ mua {num(somCustomers)} khách, nhưng thị trường phục vụ được chỉ có {num(samCustomers)} khách.
                Nghĩa là một trong hai điều: chi phí thu hút khách đang bị đánh giá quá thấp, hoặc hai bộ lọc SAM đang quá chặt.
                Xem lại trước khi đưa con số này ra bàn họp.
              </p>
            </Verdict>
          ) : somShare < 0.01 ? (
            <Verdict level="warn" title="SOM dưới 1% SAM">
              <p>
                Vấn đề không nằm ở thị trường mà nằm ở chi phí thu hút khách quá cao so với ngân sách. Hạ chi phí thu hút
                xuống hoặc chấp nhận rằng đây là một thị trường bạn chỉ chạm được phần rất nhỏ trong năm đầu.
              </p>
            </Verdict>
          ) : (
            <Verdict level="good" title={`SOM đạt ${pct(somShare)} của SAM`}>
              <p>
                Đây là con số trần thực tế cho năm nay. Nếu mục tiêu được giao vượt {vnd(som)}, bạn có căn cứ định lượng
                để đề nghị hoặc tăng ngân sách, hoặc hạ chi phí thu hút khách, hoặc giãn thời hạn.
              </p>
            </Verdict>
          )}

          <Note>
            TAM và SAM nên lấy từ nguồn công khai trích dẫn được như Tổng cục Thống kê, Sách trắng Thương mại điện tử
            của Bộ Công Thương hoặc báo cáo e-Conomy SEA. Tự ước lượng rồi trình sẽ bị chất vấn ngay ở dòng đầu tiên.
          </Note>
        </div>
      </div>
    </ToolShell>
  );
}

/* ================================================================
   CÔNG CỤ 6 — Chẩn đoán quảng cáo video 4 tầng (Chuyên đề 07, bài 3)
   ================================================================ */

export function VideoAdDiagnosticTool() {
  const [impressions, setImpressions] = useState(500000);
  const [views3s, setViews3s] = useState(140000);
  const [viewsComplete, setViewsComplete] = useState(12000);
  const [clicks, setClicks] = useState(3500);
  const [conversions, setConversions] = useState(42);

  const hookRate = safeDiv(views3s, impressions);
  const holdRate = safeDiv(viewsComplete, views3s);
  const ctr = safeDiv(clicks, impressions);
  const cvr = safeDiv(conversions, clicks);

  // Dữ liệu vô lý thì chẩn đoán vô nghĩa, nên chặn trước.
  const invalid =
    views3s > impressions || viewsComplete > views3s || clicks > impressions || conversions > clicks;

  // Chẩn đoán theo đúng thứ tự phễu: hỏng tầng nào thì dừng ở tầng đó.
  let dx;
  if (invalid) {
    dx = null;
  } else if (hookRate < 0.2) {
    dx = {
      level: 'bad',
      stage: 'Hỏng ở 3 giây đầu',
      why: `Tỷ lệ giữ chân 3 giây chỉ ${pct(hookRate)}, dưới ngưỡng tham chiếu 20%. Hình ảnh mở đầu không đủ chặn ngón tay lướt.`,
      fix: 'Đổi khung hình đầu tiên, thêm chữ lớn nêu thẳng vấn đề, bỏ phần giới thiệu logo ở đầu video.',
    };
  } else if (holdRate < 0.15) {
    dx = {
      level: 'bad',
      stage: 'Hỏng ở phần thân video',
      why: `Mở đầu tốt với ${pct(hookRate)}, nhưng chỉ ${pct(holdRate)} số người đó xem hết. Mở đầu đã hứa hẹn mà phần thân không giữ được.`,
      fix: 'Rút ngắn video, đưa phần chứng minh lên sớm hơn, bỏ đoạn kể lể tính năng.',
    };
  } else if (ctr < 0.01) {
    dx = {
      level: 'warn',
      stage: 'Hỏng ở lời kêu gọi hành động',
      why: `Nội dung giữ chân tốt với ${pct(holdRate)} xem hết, nhưng chỉ ${pct(ctr, 2)} bấm vào. Người xem thích nội dung mà không thấy lý do phải bấm.`,
      fix: 'Làm rõ ưu đãi, thêm yếu tố giới hạn thời gian, đặt lời kêu gọi hành động sớm hơn thay vì chỉ ở cuối.',
    };
  } else if (cvr < 0.02) {
    dx = {
      level: 'warn',
      stage: 'Hỏng ở trang đích',
      why: `Quảng cáo thuyết phục tốt với ${pct(ctr, 2)} bấm vào, nhưng chỉ ${pct(cvr)} chuyển đổi. Đứt gãy xảy ra sau cú bấm.`,
      fix: 'Đồng bộ tiêu đề và hình ảnh trang đích với quảng cáo, kiểm tra tốc độ tải trên điện thoại, giảm số ô bắt buộc trong biểu mẫu.',
    };
  } else {
    dx = {
      level: 'good',
      stage: 'Cả bốn tầng đều đạt ngưỡng tham chiếu',
      why: 'Không có tầng nào rơi dưới mức cảnh báo. Đây là mẫu đáng để tăng ngân sách.',
      fix: 'Tăng ngân sách theo từng nấc khoảng 20% mỗi vài ngày, đồng thời nhân bản công thức này sang kênh thứ hai.',
    };
  }

  return (
    <ToolShell
      icon={Video}
      title="CHẨN ĐOÁN QUẢNG CÁO VIDEO THEO 4 TẦNG"
      moduleRef="Chuyên đề 07 · Bài 3"
      intro="Câu trả lời quảng cáo này không chạy được là vô dụng với Trưởng phòng. Nhập số liệu thô từ trình quản lý quảng cáo để biết chính xác video hỏng ở giây thứ mấy."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Field label="Số lượt hiển thị (Impressions)" value={impressions} onChange={setImpressions} step={10000} hint={num(impressions)} />
          <Field label="Số lượt xem 3 giây" value={views3s} onChange={setViews3s} step={1000} hint={num(views3s)} />
          <Field label="Số lượt xem hết video" value={viewsComplete} onChange={setViewsComplete} step={1000} hint={num(viewsComplete)} />
          <Field label="Số lượt bấm vào liên kết" value={clicks} onChange={setClicks} step={100} hint={num(clicks)} />
          <Field label="Số chuyển đổi (đơn hàng hoặc khách tiềm năng)" value={conversions} onChange={setConversions} step={1} hint={num(conversions)} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Hook Rate" value={pct(hookRate)} note="Xem 3 giây / hiển thị" tone={hookRate < 0.2 ? 'rose' : 'emerald'} />
            <Stat label="Hold Rate" value={pct(holdRate)} note="Xem hết / xem 3 giây" tone={holdRate < 0.15 ? 'rose' : 'emerald'} />
            <Stat label="CTR" value={pct(ctr, 2)} note="Lượt bấm / hiển thị" tone={ctr < 0.01 ? 'amber' : 'emerald'} />
            <Stat label="CVR" value={pct(cvr)} note="Chuyển đổi / lượt bấm" tone={cvr < 0.02 ? 'amber' : 'emerald'} />
          </div>

          {invalid ? (
            <Verdict level="bad" title="Số liệu đầu vào không hợp lệ">
              <p>
                Số lượt xem 3 giây không thể lớn hơn số lượt hiển thị, số xem hết không thể lớn hơn số xem 3 giây,
                và số chuyển đổi không thể lớn hơn số lượt bấm. Kiểm tra lại các ô đang nhập.
              </p>
            </Verdict>
          ) : (
            <Verdict level={dx.level} title={dx.stage}>
              <p>{dx.why}</p>
              <p className="pt-1 border-t border-slate-100/10">
                <strong className="font-black">Cách sửa: </strong>{dx.fix}
              </p>
            </Verdict>
          )}

          <Note>
            Các ngưỡng 20%, 15%, 1% và 2% là mức tham chiếu để so sánh giữa các mẫu quảng cáo của chính bạn,
            không phải chuẩn tuyệt đối của ngành. Khi mẫu A mở đầu tốt còn mẫu B phần thân tốt, hãy ghép 3 giây đầu
            của A vào phần thân của B rồi chạy lại, thay vì làm lại video từ đầu.
          </Note>
        </div>
      </div>
    </ToolShell>
  );
}

/* ================================================================
   CÔNG CỤ 7 — Đối chiếu ROAS đa nền tảng (Chuyên đề 10, bài 3)
   ================================================================ */

export function AttributionReconcileTool() {
  const [metaRevenue, setMetaRevenue] = useState(520000000);
  const [metaCost, setMetaCost] = useState(120000000);
  const [googleRevenue, setGoogleRevenue] = useState(380000000);
  const [googleCost, setGoogleCost] = useState(90000000);
  const [realRevenue, setRealRevenue] = useState(600000000);
  const [overhead, setOverhead] = useState(80000000);

  const platformSum = metaRevenue + googleRevenue;
  const adCost = metaCost + googleCost;
  const overlap = platformSum - realRevenue;
  const inflation = safeDiv(overlap, realRevenue);

  const metaRoas = safeDiv(metaRevenue, metaCost);
  const googleRoas = safeDiv(googleRevenue, googleCost);
  const blendedRoas = safeDiv(realRevenue, adCost);
  const mer = safeDiv(realRevenue, adCost + overhead);

  return (
    <ToolShell
      icon={Layers}
      title="ĐỐI CHIẾU ROAS ĐA NỀN TẢNG VÀ PHÁT HIỆN GHI NHẬN TRÙNG"
      moduleRef="Chuyên đề 10 · Bài 3"
      intro="Cộng doanh thu Meta báo với doanh thu Google báo luôn ra số lớn hơn doanh thu thật. Không ai gian lận, đó là ghi nhận trùng. Công cụ này đo phần chênh và cho ra con số duy nhất nên dùng khi báo cáo."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Field label="Doanh thu Meta tự báo cáo (VNĐ)" value={metaRevenue} onChange={setMetaRevenue} step={10000000} hint={vnd(metaRevenue)} />
          <Field label="Chi phí quảng cáo Meta (VNĐ)" value={metaCost} onChange={setMetaCost} step={10000000} hint={vnd(metaCost)} />
          <Field label="Doanh thu Google tự báo cáo (VNĐ)" value={googleRevenue} onChange={setGoogleRevenue} step={10000000} hint={vnd(googleRevenue)} />
          <Field label="Chi phí quảng cáo Google (VNĐ)" value={googleCost} onChange={setGoogleCost} step={10000000} hint={vnd(googleCost)} />
          <Field label="Doanh thu thật từ hệ thống bán hàng (VNĐ)" value={realRevenue} onChange={setRealRevenue} step={10000000} hint={vnd(realRevenue)} />
          <Field label="Chi phí nhân sự và công cụ (VNĐ)" value={overhead} onChange={setOverhead} step={5000000} hint="Dùng để tính MER cho Giám đốc Tài chính" />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Stat label="ROAS nền tảng Meta tự báo" value={`${num(metaRoas, 2)} lần`} note="Chỉ dùng so sánh trong nội bộ Meta" tone="amber" />
            <Stat label="ROAS nền tảng Google tự báo" value={`${num(googleRoas, 2)} lần`} note="Chỉ dùng so sánh trong nội bộ Google" tone="amber" />
            <Stat label="ROAS tổng hợp" value={`${num(blendedRoas, 2)} lần`} note="Doanh thu thật chia tổng chi quảng cáo. Đây là con số nên trình Ban Giám Đốc" />
            <Stat label="MER" value={`${num(mer, 2)} lần`} note="Doanh thu thật chia tổng chi marketing gồm cả nhân sự và công cụ" />
          </div>

          {overlap > 0 ? (
            <Verdict level="warn" title={`Đang bị thổi phồng ${pct(inflation)} so với doanh thu thật`}>
              <p>
                Hai nền tảng cộng lại báo {vnd(platformSum)}, trong khi hệ thống bán hàng ghi nhận {vnd(realRevenue)}.
                Phần chênh <strong className="font-black">{vnd(overlap)}</strong> chính là các đơn hàng có chạm vào cả hai kênh
                và được cả hai cùng nhận công trọn vẹn.
              </p>
              <p>
                Nếu bạn báo cáo con số {vnd(platformSum)}, chỉ số ROAS sẽ bị thổi lên {num(safeDiv(platformSum, adCost), 2)} lần
                thay vì {num(blendedRoas, 2)} lần thật, và mọi quyết định phân bổ ngân sách sau đó đều dựa trên nền sai.
              </p>
            </Verdict>
          ) : overlap < 0 ? (
            <Verdict level="warn" title="Doanh thu thật đang cao hơn tổng hai nền tảng báo về">
              <p>
                Điều này thường có nghĩa là một phần doanh thu đến từ kênh không gắn mã theo dõi, chẳng hạn khách gọi
                điện trực tiếp, mua tại cửa hàng, hoặc do truyền miệng. Đây là tin tốt nhưng cũng là điểm mù: bạn đang
                không nhìn thấy kênh nào tạo ra phần {vnd(Math.abs(overlap))} đó.
              </p>
            </Verdict>
          ) : (
            <Verdict level="good" title="Không có chênh lệch giữa nền tảng và hệ thống bán hàng">
              <p>Trường hợp này hiếm gặp trong thực tế. Hãy kiểm tra lại xem cửa sổ ghi nhận của hai bên có thực sự cùng kỳ không.</p>
            </Verdict>
          )}

          <Note>
            Nguyên tắc bất di bất dịch: không bao giờ cộng doanh thu do các nền tảng tự báo cáo. Chỉ dùng ROAS nền tảng để
            so sánh các chiến dịch trong cùng một nền tảng, và chỉ dùng ROAS tổng hợp khi trình Ban Giám Đốc.
          </Note>
        </div>
      </div>
    </ToolShell>
  );
}

/* ================================================================
   CÔNG CỤ 8 — LTV / CAC và ngưỡng hoà vốn mô hình (Chuyên đề 11, bài 3)
   ================================================================ */

export function LtvCacTool() {
  const [aov, setAov] = useState(620000);
  const [margin, setMargin] = useState(42);
  const [cac, setCac] = useState(340000);
  const [repeatRate, setRepeatRate] = useState(8);

  const ordersPerCustomer = 1 + repeatRate / 100;
  const ltvRevenue = aov * ordersPerCustomer;
  const ltvGross = ltvRevenue * (margin / 100);
  const profitPerCustomer = ltvGross - cac;
  const grossPerOrder = aov * (margin / 100);
  // Tỷ lệ mua lại tối thiểu để lợi nhuận gộp trọn đời bằng chi phí thu hút.
  const breakevenRepeat = safeDiv(cac, grossPerOrder) - 1;
  const ltvCacRatio = safeDiv(ltvGross, cac);
  const healthy = profitPerCustomer >= 0;

  // Nếu giữ nguyên tỷ lệ mua lại, cần nâng giá trị đơn lên bao nhiêu để hoà vốn.
  const requiredAov = safeDiv(cac, (margin / 100) * ordersPerCustomer);

  return (
    <ToolShell
      icon={Repeat}
      title="LTV / CAC VÀ NGƯỠNG HOÀ VỐN MÔ HÌNH KINH DOANH"
      moduleRef="Chuyên đề 11 · Bài 3"
      intro="Khi chi phí thu hút khách vượt lợi nhuận gộp trọn đời, vấn đề nằm ở mô hình kinh doanh chứ không nằm ở quảng cáo. Tối ưu giá thầu lúc đó chỉ làm chậm tốc độ lỗ."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Field label="Giá trị đơn hàng trung bình (VNĐ)" value={aov} onChange={setAov} step={10000} hint={vnd(aov)} />
          <Field label="Biên lợi nhuận gộp" value={margin} onChange={setMargin} suffix="%" hint="Sau giá vốn, chưa trừ chi phí marketing" />
          <Field label="Chi phí thu hút một khách mới (VNĐ)" value={cac} onChange={setCac} step={10000} hint={vnd(cac)} />
          <Field label="Tỷ lệ khách mua lại" value={repeatRate} onChange={setRepeatRate} suffix="%" hint="Tỷ lệ khách quay lại mua thêm lần nữa" />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Stat label="Lợi nhuận gộp mỗi đơn" value={vnd(grossPerOrder)} note="Giá trị đơn nhân biên lợi nhuận gộp" />
            <Stat label="Doanh thu trọn đời mỗi khách" value={vnd(ltvRevenue)} note={`Trung bình ${num(ordersPerCustomer, 2)} đơn mỗi khách`} />
            <Stat label="Lợi nhuận gộp trọn đời" value={vnd(ltvGross)} note="Đây mới là con số đem so với chi phí thu hút" />
            <Stat
              label={profitPerCustomer >= 0 ? 'Lãi trên mỗi khách mới' : 'Lỗ trên mỗi khách mới'}
              value={vnd(Math.abs(profitPerCustomer))}
              note="Lợi nhuận gộp trọn đời trừ chi phí thu hút"
              tone={profitPerCustomer >= 0 ? 'emerald' : 'rose'}
            />
          </div>

          {healthy ? (
            <Verdict
              level={ltvCacRatio >= 3 ? 'good' : 'warn'}
              title={`Mô hình có lãi, tỷ lệ LTV trên CAC bằng ${num(ltvCacRatio, 2)} lần`}
            >
              <p>
                Mỗi khách mới mang về {vnd(profitPerCustomer)} lợi nhuận gộp sau khi trừ chi phí thu hút.
                {ltvCacRatio >= 3
                  ? ' Tỷ lệ từ 3 lần trở lên là vùng đủ dày để chịu được biến động giá thầu và có thể tăng ngân sách.'
                  : ' Tuy nhiên tỷ lệ dưới 3 lần là vùng mỏng: chỉ cần chi phí thu hút tăng vài chục phần trăm là mô hình lật sang lỗ. Hãy củng cố trước khi mở rộng.'}
              </p>
            </Verdict>
          ) : (
            <Verdict level="bad" title={`Đang lỗ ${vnd(Math.abs(profitPerCustomer))} trên mỗi khách hàng mới`}>
              <p>
                Lợi nhuận gộp trọn đời {vnd(ltvGross)} thấp hơn chi phí thu hút {vnd(cac)}. Tăng ngân sách quảng cáo
                lúc này chỉ khuếch đại khoản lỗ.
              </p>
              <p>
                <strong className="font-black">Hai đường ra:</strong> nâng tỷ lệ mua lại lên tối thiểu{' '}
                <strong className="font-black">{pct(Math.max(0, breakevenRepeat))}</strong>, hoặc giữ nguyên tỷ lệ mua lại
                và nâng giá trị đơn trung bình lên <strong className="font-black">{vnd(requiredAov)}</strong>.
                Kết hợp cả hai thì mỗi phần chỉ cần cải thiện một nửa.
              </p>
            </Verdict>
          )}

          <div className="p-4 rounded-2xl bg-[#152037] border border-emerald-900/50 space-y-2">
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">Ngưỡng hoà vốn</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Với giá trị đơn {vnd(aov)} và biên gộp {num(margin)}%, tỷ lệ mua lại phải đạt tối thiểu{' '}
              <strong className="text-emerald-300 font-black">{pct(Math.max(0, breakevenRepeat))}</strong> thì lợi nhuận gộp
              trọn đời mới bằng chi phí thu hút {vnd(cac)}.
            </p>
          </div>

          <Note>
            Công cụ dùng mô hình giản lược: một khách trung bình mua 1 cộng tỷ lệ mua lại đơn hàng. Với mô hình thu phí
            định kỳ hoặc ngành mua đi mua lại nhiều lần, hãy thay bằng số đơn trung bình thực tế trong 12 tháng, vì mô hình
            giản lược sẽ đánh giá thấp giá trị trọn đời.
          </Note>
        </div>
      </div>
    </ToolShell>
  );
}
