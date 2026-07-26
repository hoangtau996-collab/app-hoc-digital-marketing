export const GLOSSARY_CATEGORIES = [
  { id: 'all', label: 'Tất Cả Thuật Ngữ' },
  { id: 'kpi', label: 'Chỉ Số & KPIs (Metrics)' },
  { id: 'strategy', label: 'Chiến Lược & Mô Hình' },
  { id: 'media', label: 'Kênh & Công Nghệ Số' },
  { id: 'creative', label: 'Sáng Tạo & Truyền Thông' }
];

export const GLOSSARY_ITEMS = [
  // --- KPI & METRICS ---
  {
    id: 'roas',
    term: 'ROAS (Return on Ad Spend)',
    category: 'kpi',
    categoryLabel: 'Chỉ Số & KPIs',
    shortDef: 'Tỷ suất doanh thu tạo ra trên mỗi đồng chi phí quảng cáo trực tiếp.',
    definition: 'ROAS đo lường hiệu quả tài chính trực tiếp của các chiến dịch quảng cáo trả phí (Paid Ads). Giúp Trưởng phòng xác định kênh quảng cáo nào đang mang lại dòng tiền hiệu quả nhất.',
    formula: 'ROAS = (Tổng Doanh Thu từ Quảng Cáo / Tổng Chi Phí Quảng Cáo) x 100%',
    example: 'Chi 10.000.000 VNĐ cho Google Ads mang về 50.000.000 VNĐ doanh thu bán hàng. Khi đó ROAS = 50.000.000 / 10.000.000 = 5x (tương đương 500%).',
    takeaway: 'ROAS > 1 không đồng nghĩa với có lời. Cần tính toán biên lợi nhuận gộp để xác định điểm hòa vốn ROAS (Break-even ROAS).',
    icon: 'TrendingUp'
  },
  {
    id: 'cac',
    term: 'CAC (Customer Acquisition Cost)',
    category: 'kpi',
    categoryLabel: 'Chỉ Số & KPIs',
    shortDef: 'Chi phí trung bình để thu hút được 1 khách hàng mới trả tiền.',
    definition: 'CAC bao gồm toàn bộ chi phí Marketing và Sales (Ads, lương nhân sự, phần mềm, booking KOC) chia cho tổng số khách hàng mới thu được trong cùng một khoảng thời gian.',
    formula: 'CAC = (Tổng Chi Phí Marketing + Chi Phí Sales) / Số Khách Hàng Mới Thu Được',
    example: 'Tổng ngân sách Marketing & Sales tháng 5 là 100.000.000 VNĐ. Bạn mang về 200 khách hàng mới mua lần đầu. Khi đó CAC = 100.000.000 / 200 = 500.000 VNĐ/khách hàng.',
    takeaway: 'Tối ưu CAC bằng cách tăng tỷ lệ chuyển đổi (CVR) và nâng cao hiệu quả quảng cáo bám đuổi (Retargeting).',
    icon: 'Users'
  },
  {
    id: 'cpm',
    term: 'CPM (Cost Per Mille / Cost Per 1,000 Impressions)',
    category: 'kpi',
    categoryLabel: 'Chỉ Số & KPIs',
    shortDef: 'Chi phí cho mỗi 1.000 lượt hiển thị mẫu quảng cáo tới người dùng.',
    definition: 'CPM là phương thức tính phí cơ bản trên Meta Ads, TikTok Ads và Google Display Network. CPM phản ánh độ cạnh tranh giá thầu của thị trường và độ hấp dẫn của nội dung quảng cáo.',
    formula: 'CPM = (Tổng Chi Phí Quảng Cáo / Tổng Số Lượt Hiển Thị) x 1.000',
    example: 'Chạy chiến dịch Meta Ads hết 2.000.000 VNĐ và đạt 50.000 lượt hiển thị. Khi đó CPM = (2.000.000 / 50.000) x 1.000 = 40.000 VNĐ/1.000 lượt xem.',
    takeaway: 'Nội dung quảng cáo có tỷ lệ tương tác (CTR) cao và giữ chân người dùng lâu sẽ giúp thuật toán ưu tiên giảm CPM.',
    icon: 'Eye'
  },
  {
    id: 'cpl',
    term: 'CPL (Cost Per Lead)',
    category: 'kpi',
    categoryLabel: 'Chỉ Số & KPIs',
    shortDef: 'Chi phí bỏ ra để thu thập được 1 thông tin khách hàng tiềm năng (Lead).',
    definition: 'CPL đo lường hiệu quả thu thập dữ liệu khách hàng (Họ tên, SĐT, Email, Nhu cầu) thông qua Form đăng ký hoặc Chat nhắn tin tư vấn.',
    formula: 'CPL = Tổng Chi Phí Quảng Cáo / Tổng Số Leads Thu Được',
    example: 'Chạy quảng cáo chiến dịch Bất Động Sản hết 15.000.000 VNĐ thu về 50 Form đăng ký tư vấn. Khi đó CPL = 15.000.000 / 50 = 300.000 VNĐ/Lead.',
    takeaway: 'CPL thấp chưa chắc đã tốt nếu chất lượng Lead kém. Cần theo dõi tỷ lệ Lead-to-Sale (MQL -> SQL).',
    icon: 'Target'
  },
  {
    id: 'ctr',
    term: 'CTR (Click-Through Rate)',
    category: 'kpi',
    categoryLabel: 'Chỉ Số & KPIs',
    shortDef: 'Tỷ lệ phần trăm người dùng nhấp vào quảng cáo sau khi xem.',
    definition: 'CTR đo lường sức hút của hình ảnh, Video Hook 3s và tiêu đề quảng cáo đối với đối tượng mục tiêu.',
    formula: 'CTR = (Tổng Số Lượt Nhấp Click / Tổng Số Lượt Hiển Thị) x 100%',
    example: 'Quảng cáo hiển thị 10.000 lần và nhận được 300 lượt nhấp vào liên kết. Khi đó CTR = (300 / 10.000) x 100% = 3.0%.',
    takeaway: 'Mức CTR chuẩn ngành Ecommerce là 1.5% - 3%. CTR > 4% chứng tỏ sáng tạo Hook bài viết rất xuất sắc.',
    icon: 'MousePointer'
  },
  {
    id: 'ltv',
    term: 'LTV (Customer Lifetime Value)',
    category: 'kpi',
    categoryLabel: 'Chỉ Số & KPIs',
    shortDef: 'Tổng giá trị doanh thu mà 1 khách hàng đóng góp cho doanh nghiệp trong suốt vòng đời.',
    definition: 'LTV thể hiện giá trị dài hạn của khách hàng. Doanh nghiệp có LTV cao có thể chấp nhận chi chi phí CAC cao hơn ở lần bán đầu tiên.',
    formula: 'LTV = Giá Trị Đơn Trung Bình x Số Lần Mua Trung Bình/Năm x Số Năm Gắn Bán',
    example: 'Khách hàng mua mỹ phẩm trung bình 500.000 VNĐ/đơn, mua 4 lần/năm và gắn bó 3 năm. Khi đó LTV = 500k x 4 x 3 = 6.000.000 VNĐ.',
    takeaway: 'Tỷ lệ vàng bền vững của doanh nghiệp là LTV / CAC >= 3x (LTV gấp ít nhất 3 lần chi phí thu hút khách hàng).',
    icon: 'Repeat'
  },
  {
    id: 'cpa',
    term: 'CPA (Cost Per Action / Acquisition)',
    category: 'kpi',
    categoryLabel: 'Chỉ Số & KPIs',
    shortDef: 'Chi phí cho mỗi hành động chuyển đổi cụ thể của người dùng (Mua hàng, Tải App).',
    definition: 'CPA đo lường chi phí thực tế bỏ ra để đạt được một hành động mục tiêu tạo ra giá trị cho doanh nghiệp.',
    formula: 'CPA = Tổng Chi Phí Quảng Cáo / Tổng Số Hành Động Chuyển Đổi',
    example: 'Chạy chiến dịch ứng dụng hết 20.000.000 VNĐ nhận về 400 lượt tải App hoàn tất đăng ký. Khi đó CPA = 20.000.000 / 400 = 50.000 VNĐ/lượt tải.',
    takeaway: 'Cần giới hạn Max CPA hòa vốn để tránh chạy quảng cáo tăng số lượng nhưng bị lỗ trực tiếp.',
    icon: 'CheckSquare'
  },
  {
    id: 'cvr',
    term: 'CVR (Conversion Rate)',
    category: 'kpi',
    categoryLabel: 'Chỉ Số & KPIs',
    shortDef: 'Tỷ lệ phần trăm người truy cập thực hiện hành vi chuyển đổi mục tiêu.',
    definition: 'CVR đánh giá chất lượng trải nghiệm trang Landing Page hoặc giao diện mua hàng E-commerce.',
    formula: 'CVR = (Số Đơn Hàng Hoàn Tất / Tổng Số Lượt Truy Cập Traffic) x 100%',
    example: 'Website có 10.000 lượt truy cập trong tháng và nhận được 250 đơn hàng thành công. Khi đó CVR = (250 / 10.000) x 100% = 2.5%.',
    takeaway: 'Tăng CVR từ 1% lên 2% giúp nhân đôi doanh thu mà không cần tốn thêm 1 đồng tiền quảng cáo.',
    icon: 'Zap'
  },
  {
    id: 'aov',
    term: 'AOV (Average Order Value)',
    category: 'kpi',
    categoryLabel: 'Chỉ Số & KPIs',
    shortDef: 'Giá trị trung bình trên mỗi đơn hàng được bán ra.',
    definition: 'AOV đo lường số tiền trung bình khách hàng chi trả trong một lần thanh toán.',
    formula: 'AOV = Tổng Doanh Thu / Tổng Số Đơn Hàng',
    example: 'Doanh thu tháng đạt 200.000.000 VNĐ từ 400 đơn hàng. Khi đó AOV = 200.000.000 / 400 = 500.000 VNĐ/đơn.',
    takeaway: 'Tăng AOV bằng các chiến thuật Upsell (bán combo), Cross-sell (bán kèm) và chính sách Freeship.',
    icon: 'DollarSign'
  },

  // --- STRATEGY & FRAMEWORKS ---
  {
    id: 'performance-marketing',
    term: 'Performance Marketing (Marketing Hiệu Suất)',
    category: 'strategy',
    categoryLabel: 'Chiến Lược & Mô Hình',
    shortDef: 'Chiến lược tiếp thị tập trung vào các kết quả chuyển đổi có thể đo lường trực tiếp.',
    definition: 'Performance Marketing tập trung tối ưu dòng tiền ngắn hạn với các chỉ số ROI, ROAS, CPA, CPL. Ngân sách có thể tăng giảm linh hoạt theo hiệu quả thực tế.',
    example: 'Chạy Meta Ads chuyển đổi tập trung kéo đơn hàng Shopee Live trong ngày Mega Sale 11/11.',
    takeaway: 'Performance giúp doanh nghiệp sống sót hôm nay, nhưng phụ thuộc hoàn toàn vào quảng cáo trả phí nếu không xây Brand.',
    icon: 'BarChart2'
  },
  {
    id: 'brand-marketing',
    term: 'Brand Marketing (Marketing Thương Hiệu)',
    category: 'strategy',
    categoryLabel: 'Chiến Lược & Mô Hình',
    shortDef: 'Chiến lược định hình nhận thức, niềm tin và sự yêu thích của khách hàng dài hạn.',
    definition: 'Brand Marketing xây dựng tài sản thương hiệu bền vững, giúp tăng lượt tìm kiếm tự nhiên (Brand Search Volume) và giảm chi phí CAC dài hạn.',
    example: 'Chiến dịch TVC "Đi để trở về" của Biti\'s Hunter khắc sâu vị thế thương hiệu trong lòng giới trẻ.',
    takeaway: 'Tỷ lệ phân bổ ngân sách lý tưởng theo nghiên cứu Binet & Field là 60% Brand : 40% Performance.',
    icon: 'Award'
  },
  {
    id: 'sostac-framework',
    term: 'SOSTAC Framework',
    category: 'strategy',
    categoryLabel: 'Chiến Lược & Mô Hình',
    shortDef: 'Quy trình lập kế hoạch Digital Marketing chuẩn quốc tế gồm 6 bước.',
    definition: 'SOSTAC viết tắt của: Situation Analysis (Hiện trạng) -> Objectives (Mục tiêu) -> Strategy (Chiến lược) -> Tactics (Chiến thuật) -> Action (Hành động) -> Control (Kiểm soát).',
    example: 'Trưởng phòng lập Kế hoạch Master năm 2026 cho công ty dựa trên bảng biểu Gantt Chart và ma trận KPI Control.',
    takeaway: 'SOSTAC giúp giải trình minh bạch chiến lược và bảo vệ ngân sách trước Ban Giám Đốc.',
    icon: 'Compass'
  },
  {
    id: 'raci-matrix',
    term: 'Ma Trận RACI',
    category: 'strategy',
    categoryLabel: 'Chiến Lược & Mô Hình',
    shortDef: 'Công cụ phân định rõ vai trò và trách nhiệm nhân sự trong dự án Marketing.',
    definition: 'RACI viết tắt của: Responsible (Người trực tiếp làm) - Accountable (Người chịu trách nhiệm duyệt) - Consulted (Người tư vấn chuyên môn) - Informed (Người nhận thông báo).',
    example: 'Performance Specialist thực thi Ads (R), Digital Manager duyệt ngân sách (A), Data Lead tư vấn tracking (C), CEO nhận báo cáo tuần (I).',
    takeaway: 'Áp dụng RACI giúp phòng Marketing vận hành trơn tru, tránh chồng chéo hoặc bỏ sót công việc.',
    icon: 'Users'
  },
  {
    id: 'flywheel-model',
    term: 'Mô Hình Flywheel (Bánh Đà Tăng Trưởng)',
    category: 'strategy',
    categoryLabel: 'Chiến Lược & Mô Hình',
    shortDef: 'Mô hình tăng trưởng lấy sự thỏa mãn của khách hàng làm động cơ xoay vòng.',
    definition: 'Flywheel thay thế phễu Marketing truyền thống với 3 giai đoạn: Attract (Thu hút) -> Engage (Tương tác) -> Delight (Thỏa mãn khách hàng biến họ thành người giới thiệu).',
    example: 'Kết hợp Outbound Ads để kéo người dùng mới vào hệ thống Inbound Content giá trị cao và Email Automation chăm sóc.',
    takeaway: 'Bánh đà quay càng nhanh thì chi phí thu hút khách hàng CAC càng giảm nhờ sức mạnh truyền miệng (Word of Mouth).',
    icon: 'RotateCcw'
  },

  // --- MEDIA & TECHNOLOGY ---
  {
    id: 'meta-ads',
    term: 'Meta Ads (Quảng Cáo Facebook/Instagram)',
    category: 'media',
    categoryLabel: 'Kênh & Công Nghệ Số',
    shortDef: 'Nền tảng quảng cáo trên mạng xã hội dựa trên sở thích và hành vi người dùng.',
    definition: 'Meta Ads sử dụng thuật toán máy học (Machine Learning) để phân phối quảng cáo tới đúng tệp đối tượng mục tiêu dựa trên Lookalike Audiences và Pixel Data.',
    example: 'Chạy chiến dịch quảng cáo Messenger tư vấn sản phẩm thời trang nữ độ tuổi 22-35 tại TP.HCM.',
    takeaway: 'Hiệu quả Meta Ads hiện nay phụ thuộc 80% vào chất lượng nội dung Sáng tạo (Creative) và Hook Video.',
    icon: 'Share2'
  },
  {
    id: 'google-search-ads',
    term: 'Google Search Ads (Quảng Cáo Tìm Kiếm)',
    category: 'media',
    categoryLabel: 'Kênh & Công Nghệ Số',
    shortDef: 'Quảng cáo tiếp cận khách hàng ngay khi họ chủ động gõ từ khóa nhu cầu trên Google.',
    definition: 'Search Ads hoạt động theo cơ chế đấu giá từ khóa (PPC - Pay Per Click), mang lại tỷ lệ chuyển đổi cao vì khách hàng đã có nhu cầu rõ ràng.',
    example: 'Đấu giá từ khóa "mua máy hút bụi cầm tay giá rẻ" đưa Website công ty lên vị trí Top 1 tìm kiếm.',
    takeaway: 'Tối ưu chỉ số Quality Score (Điểm chất lượng từ khóa) để giảm giá thầu CPC.',
    icon: 'Search'
  },
  {
    id: 'seo',
    term: 'SEO (Search Engine Optimization)',
    category: 'media',
    categoryLabel: 'Kênh & Công Nghệ Số',
    shortDef: 'Tối ưu hóa website để đạt vị trí thứ hạng cao tự nhiên trên kết quả tìm kiếm Google.',
    definition: 'SEO bao gồm On-page SEO (tối ưu nội dung & kỹ thuật website) và Off-page SEO (xây dựng liên kết Backlink uy tín).',
    example: 'Viết tuyến bài 50 bài viết hướng dẫn chuyên sâu ngành Skincare kéo 100.000 Organic Traffic/tháng hoàn toàn miễn phí.',
    takeaway: 'SEO là kênh xây dựng tài sản Inbound bền vững mang lại lãi suất kép dài hạn.',
    icon: 'Globe'
  },
  {
    id: 'retargeting',
    term: 'Retargeting (Quảng Cáo Bám Đuổi)',
    category: 'media',
    categoryLabel: 'Kênh & Công Nghệ Số',
    shortDef: 'Hiển thị quảng cáo nhắc nhớ tới những người đã từng tương tác với thương hiệu.',
    definition: 'Retargeting sử dụng dữ liệu Pixel hoặc CRM để bám đuổi người dùng đã vào Website, thêm hàng vào giỏ nhưng chưa bấm thanh toán.',
    example: 'Khách xem mẫu giày trên Web nhưng chưa mua, khi lướt Facebook sẽ thấy quảng cáo tặng voucher giảm 10% cho mẫu giày đó.',
    takeaway: 'Retargeting thường có chỉ số ROAS cao gấp 3-5 lần quảng cáo tiếp cận tệp khách hàng mới.',
    icon: 'RefreshCw'
  },

  // --- CREATIVE & CONTENT ---
  {
    id: 'hook-3s',
    term: 'Hook 3 Giây Đầu',
    category: 'creative',
    categoryLabel: 'Sáng Tạo & Truyền Thông',
    shortDef: 'Đoạn mở đầu 3 giây quyết định việc người dùng dừng lại xem tiếp hay vuốt qua Video.',
    definition: 'Hook gây tò mò, tạo sự bất ngờ hoặc đánh thẳng vào nỗi đau thầm kín của khách hàng trên nền tảng Video ngắn (TikTok, Reels, Shorts).',
    example: '"Dừng lại ngay nếu bạn đang chạy quảng cáo Facebook mà bị cắn tiền không ra đơn!"',
    takeaway: 'Video có Hook xuất sắc có thể giúp tăng gấp 3 lần thời lượng xem trung bình (Watch Time).',
    icon: 'Sparkles'
  },
  {
    id: 'message-house',
    term: 'Message House (Ngôi Nhà Thông Điệp)',
    category: 'creative',
    categoryLabel: 'Sáng Tạo & Truyền Thông',
    shortDef: 'Mô hình chuẩn hóa toàn bộ hệ thống thông điệp truyền thông của chiến dịch.',
    definition: 'Message House bao gồm Big Idea (Ý tưởng lớn) ở mái nhà, được nâng đỡ bởi các Content Pillars (Trụ cột nội dung) và các Proof Points (Bằng chứng xác minh) ở phần móng.',
    example: 'Chuẩn hóa thông điệp chiến dịch ra mắt xe điện mới giúp toàn bộ team Content, Designer và Agency triển khai nhất quán.',
    takeaway: 'Message House giúp tránh tình trạng bài viết truyền thông bị vụn vặt và đi lệch định vị thương hiệu.',
    icon: 'Home'
  },
  {
    id: 'ugc-challenge',
    term: 'UGC Challenge (User Generated Content)',
    category: 'creative',
    categoryLabel: 'Sáng Tạo & Truyền Thông',
    shortDef: 'Thử thách kích hoạt người dùng tự tạo nội dung lan truyền cho thương hiệu.',
    definition: 'UGC Challenge thu hút hàng nghìn video tham gia từ cộng đồng trên TikTok bằng âm thanh cuốn hút, điệu nhảy dễ nhớ và giải thưởng kích thích.',
    example: 'Thử thách nhảy #VuDieuRuaTay của Biti\'s đạt hơn 300 triệu lượt xem trên TikTok.',
    takeaway: 'Rào cản tham gia (Barrier to Entry) phải cực kỳ đơn giản để bất kỳ ai cũng có thể quay video hưởng ứng.',
    icon: 'Video'
  }
];
