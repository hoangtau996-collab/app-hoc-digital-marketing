/**
 * Dữ liệu tham chiếu cho bộ công cụ Trưởng phòng.
 *
 * ====================================================================
 * ĐỌC KỸ TRƯỚC KHI SỬA SỐ
 * ====================================================================
 *
 * Đây là GIÁ TRỊ KHỞI TẠO, không phải chuẩn ngành.
 *
 * Không có bảng số nào đúng cho mọi doanh nghiệp trong cùng một ngành: một
 * chuỗi mỹ phẩm 200 cửa hàng và một cửa hàng mỹ phẩm online có cùng mã ngành
 * nhưng chi phí mỗi khách tiềm năng lệch nhau cả chục lần. Vì vậy mọi con số ở
 * đây chỉ dùng để ĐIỀN SẴN vào ô nhập, và người dùng sửa đè được toàn bộ. Công
 * cụ nào không cho sửa đè là công cụ đang nói dối về độ chính xác của nó.
 *
 * ĐỒNG BỘ VỚI BÀI HỌC: trường `brandPct` lấy đúng theo Chuyên đề 01 bài 2
 * (khung 60/40 của Les Binet & Peter Field). Trước đây tệp này có trường
 * `brandingRatio` với giá trị hoàn toàn khác — bài học dạy Thương mại điện tử
 * 40% Brand còn công cụ hiện 10% — nên học viên đọc xong bài rồi mở công cụ là
 * thấy hai con số chửi nhau. Sửa số ở đây thì phải sửa cả courseData.js.
 *
 * BA LĂNG KÍNH, KHÔNG PHẢI BA BẢNG SỐ RỜI: cùng một tổng ngân sách được cắt
 * theo ba cách khác nhau, phục vụ ba câu hỏi khác nhau.
 *
 *   1. brandPct        — chia theo MỤC TIÊU (Chuyên đề 01): xây thương hiệu
 *                        hay kích hoạt bán hàng.
 *   2. Quy tắc 70/20/10 — chia theo RỦI RO (Chuyên đề 03): kênh trụ cột, kênh
 *                        tiềm năng, kênh thử nghiệm. Giống nhau ở mọi ngành nên
 *                        không để trong bảng này, viết thẳng trong công cụ.
 *   3. costSplit       — chia theo LOẠI CHI PHÍ: tiền mua hiển thị, tiền sản
 *                        xuất nội dung, tiền công cụ và hạ tầng dữ liệu.
 *
 * Ba lăng kính cộng lại đều bằng 100% tổng ngân sách. Chúng KHÔNG cộng vào nhau.
 */

/**
 * @typedef {Object} IndustryBenchmark
 * @property {string} name        Tên hiển thị, khớp với danh sách ngành trong hồ sơ học viên.
 * @property {number} budgetPct   Ngân sách marketing trên doanh thu, dạng thập phân.
 * @property {number} brandPct    Phần ngân sách dành cho xây dựng thương hiệu (Chuyên đề 01).
 * @property {number} avgCPL      Chi phí trung bình cho một khách tiềm năng THÔ, đơn vị đồng.
 * @property {number} leadToCustomer Tỷ lệ khách tiềm năng thô trở thành khách mua, dạng thập phân.
 * @property {{media: number, content: number, martech: number}} costSplit Chia theo loại chi phí.
 * @property {string} note        Điều cần lưu ý riêng của ngành.
 */

/** @type {Record<string, IndustryBenchmark>} */
export const INDUSTRY_BENCHMARKS = {
  ecommerce: {
    name: 'Thương Mại Điện Tử & Bán Lẻ',
    budgetPct: 0.12,
    brandPct: 0.40,
    avgCPL: 60000,
    leadToCustomer: 0.08,
    costSplit: { media: 0.65, content: 0.22, martech: 0.13 },
    note: 'Chu kỳ mua ngắn nên ưu tiên kích hoạt bán hàng. Đổi lại phải chấp nhận chi phí hiển thị tăng dần khi tệp bão hoà.',
  },
  fmcg: {
    name: 'Hàng Tiêu Dùng Nhanh (FMCG)',
    budgetPct: 0.12,
    brandPct: 0.70,
    avgCPL: 30000,
    leadToCustomer: 0.20,
    costSplit: { media: 0.70, content: 0.22, martech: 0.08 },
    note: 'Bán qua kênh phân phối nên digital ít khi chốt đơn trực tiếp. Đo bằng độ phủ và mức độ nhớ thương hiệu, đừng ép ra ROAS.',
  },
  fnb: {
    name: 'F&B - Nông Sản - Thực Phẩm',
    budgetPct: 0.10,
    brandPct: 0.60,
    avgCPL: 40000,
    leadToCustomer: 0.12,
    costSplit: { media: 0.55, content: 0.35, martech: 0.10 },
    note: 'Bán theo bán kính địa lý quanh điểm bán. Nhắm sai vị trí là đốt tiền dù mẫu quảng cáo tốt.',
  },
  beauty: {
    name: 'Thời Trang - Mỹ Phẩm & Làm Đẹp',
    budgetPct: 0.14,
    brandPct: 0.55,
    avgCPL: 55000,
    leadToCustomer: 0.10,
    costSplit: { media: 0.55, content: 0.35, martech: 0.10 },
    note: 'Nội dung hỏng rất nhanh do chạy theo xu hướng. Phải giữ kho mẫu dự phòng, đây là ngành tốn chi phí sản xuất nhất.',
  },
  spa: {
    name: 'Dịch Vụ & Spa - Thẩm Mỹ Viện',
    budgetPct: 0.15,
    brandPct: 0.55,
    avgCPL: 150000,
    leadToCustomer: 0.15,
    costSplit: { media: 0.60, content: 0.28, martech: 0.12 },
    note: 'Tốc độ gọi lại quyết định tỷ lệ chốt. Điểm nghẽn thường nằm ở đội tư vấn chứ không nằm ở quảng cáo.',
  },
  health: {
    name: 'Y Tế - Sức Khỏe - Dược Phẩm',
    budgetPct: 0.08,
    brandPct: 0.65,
    avgCPL: 200000,
    leadToCustomer: 0.12,
    costSplit: { media: 0.50, content: 0.35, martech: 0.15 },
    note: 'Nội dung bị kiểm duyệt chặt trên mọi nền tảng. Phải tính trước thời gian duyệt và tỷ lệ mẫu bị từ chối.',
  },
  education: {
    name: 'Giáo Dục & Đào Tạo - Du Học',
    budgetPct: 0.15,
    brandPct: 0.50,
    avgCPL: 180000,
    leadToCustomer: 0.12,
    costSplit: { media: 0.58, content: 0.30, martech: 0.12 },
    note: 'Doanh thu dồn vào mùa tuyển sinh. Ngân sách nên phân bổ theo mùa chứ không chia đều 12 tháng.',
  },
  saas: {
    name: 'Công Nghệ - Phần Mềm & SaaS',
    budgetPct: 0.12,
    brandPct: 0.45,
    avgCPL: 400000,
    leadToCustomer: 0.06,
    costSplit: { media: 0.45, content: 0.35, martech: 0.20 },
    note: 'Doanh thu định kỳ nên phải tính theo giá trị trọn đời, không tính theo đơn đầu tiên. Chi phí công cụ và dữ liệu cao hơn ngành khác.',
  },
  finance: {
    name: 'Tài Chính - Ngân Hàng - Bảo Hiểm',
    budgetPct: 0.08,
    brandPct: 0.60,
    avgCPL: 250000,
    leadToCustomer: 0.05,
    costSplit: { media: 0.55, content: 0.28, martech: 0.17 },
    note: 'Ràng buộc pháp lý về nội dung quảng cáo rất nặng. Niềm tin quyết định chuyển đổi nhiều hơn ưu đãi.',
  },
  realestate: {
    name: 'Bất Động Sản',
    budgetPct: 0.10,
    brandPct: 0.70,
    avgCPL: 350000,
    leadToCustomer: 0.02,
    costSplit: { media: 0.60, content: 0.28, martech: 0.12 },
    note: 'Chu kỳ cân nhắc tính bằng tháng và tỷ lệ chốt rất thấp. Bắt buộc phải có hệ thống nuôi dưỡng khách dài hạn.',
  },
  agency: {
    name: 'Agency & Truyền Thông Marketing',
    budgetPct: 0.07,
    brandPct: 0.50,
    avgCPL: 300000,
    leadToCustomer: 0.10,
    costSplit: { media: 0.40, content: 0.42, martech: 0.18 },
    note: 'Khách đến chủ yếu từ uy tín cá nhân và giới thiệu. Hồ sơ năng lực đáng đầu tư hơn quảng cáo.',
  },
  b2b: {
    name: 'B2B - Sản Xuất - Công Nghiệp',
    budgetPct: 0.06,
    brandPct: 0.45,
    avgCPL: 500000,
    leadToCustomer: 0.08,
    costSplit: { media: 0.40, content: 0.38, martech: 0.22 },
    note: 'Đúng vùng áp dụng của Định luật 95-5: rất ít khách có nhu cầu ngay. Đo bằng số cơ hội trong đường ống, không đo bằng đơn hàng theo tháng.',
  },
  startup: {
    name: 'Khởi Nghiệp Giai Đoạn Đầu',
    budgetPct: 0.25,
    brandPct: 0.20,
    avgCPL: 200000,
    leadToCustomer: 0.08,
    costSplit: { media: 0.60, content: 0.28, martech: 0.12 },
    note: 'Ưu tiên chứng minh mô hình kinh doanh trước, xây thương hiệu sau. Tỷ lệ ngân sách trên doanh thu cao là bình thường ở giai đoạn này.',
  },
};

/**
 * Khung định biên nhân sự theo ngân sách vận hành hàng tháng.
 *
 * Các mốc lấy đúng theo Chuyên đề 04 bài 3. Trước đây công cụ dùng mốc riêng
 * (>100 triệu và >300 triệu) lệch hẳn với bài học (100 triệu, 400 triệu, 1 tỷ)
 * và không hề có mức "1 người kiêm nhiệm" mà bài học nêu đầu tiên.
 *
 * `maxBudget` là giới hạn TRÊN của bậc, đơn vị đồng. Bậc cuối để Infinity.
 * `roleIds` trỏ tới STAFF_ROLES bên dưới, số phần tử chính là số vị trí — nhờ
 * vậy con số hiển thị và danh sách thẻ không thể lệch nhau như trước.
 */
export const STAFFING_TIERS = [
  {
    maxBudget: 100000000,
    label: 'Dưới 100 triệu/tháng',
    roleIds: ['allrounder'],
    summary: 'Chưa đủ quy mô để lập phòng. Một người kiêm nhiệm quảng cáo và nội dung, thuê ngoài phần thiết kế.',
  },
  {
    maxBudget: 400000000,
    label: '100 đến 400 triệu/tháng',
    roleIds: ['manager', 'performance', 'content'],
    summary: 'Trưởng phòng vẫn trực tiếp làm chuyên môn. Thiết kế thuê bán thời gian hoặc thuê ngoài.',
  },
  {
    maxBudget: 1000000000,
    label: '400 triệu đến 1 tỷ/tháng',
    roleIds: ['manager', 'performance', 'content', 'designer', 'analytics'],
    summary: 'Tách vai trò rõ ràng. Trưởng phòng chuyển sang điều phối thay vì trực tiếp chạy chiến dịch.',
  },
  {
    maxBudget: Infinity,
    label: 'Trên 1 tỷ/tháng',
    roleIds: ['manager', 'leadPerformance', 'leadContent', 'seo', 'designer', 'analytics'],
    summary: 'Chia nhóm theo kênh hoặc theo dòng sản phẩm, mỗi nhóm có trưởng nhóm riêng và có vai trò phân tích dữ liệu chuyên trách.',
  },
];

/**
 * Mức lương tham chiếu, đơn vị đồng mỗi tháng, đã gồm các khoản đóng theo lương.
 *
 * Là con số ước lượng cho thị trường Việt Nam, chênh lệch mạnh giữa Hà Nội, TP
 * Hồ Chí Minh và các tỉnh. Dùng để ước lượng tổng chi phí đội ngũ, không dùng
 * để đặt khung lương thật khi tuyển.
 */
export const STAFF_ROLES = [
  { id: 'allrounder', title: 'Chuyên viên Digital kiêm nhiệm', baseSalary: 15000000, desc: 'Vừa chạy quảng cáo vừa làm nội dung' },
  { id: 'manager', title: 'Trưởng phòng Digital Marketing', baseSalary: 30000000, desc: 'Chiến lược, ngân sách và OKRs' },
  { id: 'performance', title: 'Chuyên viên Performance', baseSalary: 16000000, desc: 'Tối ưu thầu Meta, Google, TikTok' },
  { id: 'content', title: 'Chuyên viên Content & Creative', baseSalary: 14000000, desc: 'Nội dung và kịch bản video ngắn' },
  { id: 'designer', title: 'Thiết kế & Dựng video', baseSalary: 15000000, desc: 'Ấn phẩm và video dạng ngắn' },
  { id: 'seo', title: 'Chuyên viên SEO & Website', baseSalary: 14000000, desc: 'Lưu lượng tự nhiên và trang đích' },
  { id: 'analytics', title: 'Chuyên viên Dữ liệu & MarTech', baseSalary: 20000000, desc: 'GA4, mã theo dõi, báo cáo tự động' },
  { id: 'leadPerformance', title: 'Trưởng nhóm Performance', baseSalary: 25000000, desc: 'Quản lý đội chạy quảng cáo và kiểm định' },
  { id: 'leadContent', title: 'Trưởng nhóm Nội dung', baseSalary: 23000000, desc: 'Quản lý biên tập, thiết kế, dựng phim' },
];

/** Tra nhanh vai trò theo id. */
export const STAFF_ROLE_BY_ID = Object.fromEntries(STAFF_ROLES.map((r) => [r.id, r]));

/** Bậc định biên tương ứng với một mức ngân sách tháng. */
export const getStaffingTier = (monthlyBudget) =>
  STAFFING_TIERS.find((t) => (monthlyBudget || 0) < t.maxBudget) || STAFFING_TIERS[STAFFING_TIERS.length - 1];
