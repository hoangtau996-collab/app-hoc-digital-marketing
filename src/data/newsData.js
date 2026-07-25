export const INITIAL_NEWS_ITEMS = [
  {
    id: "news-01",
    category: "Meta Ads",
    platformIcon: "Facebook",
    title: "Meta ra mắt thuật toán AI Andromeda 2.0: Tự động hóa 90% ngân sách nhóm quảng cáo",
    date: "Vừa xong (Live Update)",
    isHot: true,
    summary: "Meta nâng cấp hệ thống Advantage+ Shopping Campaigns với khả năng tự phân bổ thầu real-time dựa trên hành vi đa ứng dụng (Instagram Reels + Messenger).",
    impact: "Trưởng phòng cần dừng cấu trúc nhóm Ads thủ công rườm rà, tập trung 80% thời gian vào sản xuất 15-20 góc Creative (Broad Targeting).",
    actionChecklist: [
      "Chuyển ngân sách thử nghiệm sang Advantage+ Budget",
      "Sản xuất ít nhất 5 mẫu Video Reels chuẩn 9:16 mỗi tuần",
      "Kiểm tra cài đặt Meta Conversions API (CAPI) để tránh mất dữ liệu pixel"
    ]
  },
  {
    id: "news-02",
    category: "TikTok Shop & Ads",
    platformIcon: "Video",
    title: "TikTok Shop thay đổi thuật toán đề xuất GMV Max: Ưu tiên Shop có chỉ số CSAT > 4.5",
    date: "10 phút trước",
    isHot: true,
    summary: "TikTok vừa thông báo điều chỉnh chỉ số phân phối Livestream: Các shop có tỷ lệ hủy đơn cao hoặc đánh giá dưới 4.2 sao sẽ bị bóp 50% lượng view tự nhiên.",
    impact: "Chỉ số vận hành (Fulfillment) ảnh hưởng trực tiếp đến traffic quảng cáo. Trưởng phòng Marketing phải siết chặt phối hợp với bộ phận Kho & CSKH.",
    actionChecklist: [
      "Rà soát chỉ số Shop Health trên TikTok Seller Center",
      "Tối ưu tốc độ giao hàng cho đơn vị vận chuyển dưới 24h",
      "Cài đặt chatbot phản hồi tin nhắn tự động dưới 3 phút"
    ]
  },
  {
    id: "news-03",
    category: "Google Ads & SEO",
    platformIcon: "Search",
    title: "Google AI Overviews cập nhật tại Việt Nam: Kết quả tìm kiếm tự nhiên giảm 35% lượt nhấp",
    date: "30 phút trước",
    isHot: false,
    summary: "Google bắt đầu hiển thị câu trả lời tổng hợp bằng AI ngay đầu trang tìm kiếm. Người dùng đọc xong câu trả lời mà không cần bấm vào trang web (Zero-Click Searches).",
    impact: "SEO truyền thống kéo traffic thông tin thuần túy bị suy giảm. Cần dịch chuyển sang GEO (Generative Engine Optimization) và tối ưu từ khóa mua hàng (High-intent keywords).",
    actionChecklist: [
      "Bổ sung cấu trúc dữ liệu Schema Markup cho thông tin sản phẩm",
      "Viết nội dung mang tính trải nghiệm cá nhân (E-E-A-T) mà AI không thể tự tổng hợp",
      "Tăng cường chạy quảng cáo Google Search cho các từ khóa chốt đơn"
    ]
  },
  {
    id: "news-04",
    category: "AI Marketing",
    platformIcon: "Sparkles",
    title: "OpenAI & Adobe hợp tác ra mắt công cụ dựng Video Ads chuẩn 4K trong 60 giây",
    date: "1 giờ trước",
    isHot: true,
    summary: "Công cụ AI mới cho phép biến bài viết landing page thành 10 phiên bản Video quảng cáo ngắn khác nhau với giọng đọc cá nhân hóa và hiệu ứng điện ảnh.",
    impact: "Tốc độ sản xuất Creative tăng gấp 10 lần. Trưởng phòng có thể A/B testing 50 mẫu quảng cáo mỗi tuần với chi phí gần như bằng 0.",
    actionChecklist: [
      "Đào tạo team Content & Video áp dụng AI Prompting",
      "Thử nghiệm thử mẫu Video AI cho các chiến dịch remarketing",
      "Chuẩn hóa kho dữ liệu Brand Voice cho AI học"
    ]
  },
  {
    id: "news-05",
    category: "Meta Ads",
    platformIcon: "Facebook",
    title: "Meta áp dụng quy định mới về chính sách bảo mật dữ liệu quảng cáo Châu Á",
    date: "3 giờ trước",
    isHot: false,
    summary: "Bắt buộc các tài khoản doanh nghiệp (Business Manager) xác thực danh tính hai lớp và khai báo nguồn dữ liệu khách hàng tải lên custom audience.",
    impact: "Tránh nguy cơ bị khóa tài khoản quảng cáo hàng loạt trong đợt quét định kỳ.",
    actionChecklist: [
      "Kiểm tra trạng thái xác minh doanh nghiệp BM",
      "Xác thực miền (Domain Verification) trên hệ thống Meta"
    ]
  }
];

export const LIVE_NEWS_SIMULATOR_POOL = [
  {
    category: "TikTok Shop & Ads",
    platformIcon: "Video",
    title: "TikTok nâng mức hoa hồng mặc định Affiliate đối với KOC ngành thời trang lên 15%",
    summary: "Chính sách mới nhằm khuyến khích KOC đẩy mạnh Livestream bán hàng chuẩn bị cho đợt Sale Giữa Tháng.",
    impact: "Cần cập nhật lại bảng hoa hồng và đàm phán hợp đồng lại với dàn KOC chiến lược.",
    actionChecklist: ["Cập nhật chính sách hoa hồng trên TikTok Seller Hub", "Gửi thông báo cho KOC đối tác"]
  },
  {
    category: "Google Ads & SEO",
    platformIcon: "Search",
    title: "Google Performance Max (PMax) ra mắt tính năng loại trừ từ khóa Brand âm tính theo thời gian thực",
    summary: "Giúp doanh nghiệp không bị lãng phí ngân sách PMax vào việc mua lại từ khóa tên thương hiệu của chính mình.",
    impact: "Tiết kiệm 15-20% ngân sách quảng cáo tìm kiếm bị trùng lặp.",
    actionChecklist: ["Bật tính năng Brand Exclusion trong cài đặt PMax", "Theo dõi lại chỉ số CPC trung bình"]
  },
  {
    category: "AI Marketing",
    platformIcon: "Sparkles",
    title: "Sora AI mở phiên bản thử nghiệm cho các nhà quản lý Marketing tạo TVC thương hiệu",
    summary: "Khả năng tạo chuỗi cảnh quay liền mạch với chất lượng chuẩn điện ảnh giúp rút ngắn 90% thời gian tiền kỳ.",
    impact: "Đột phá ngân sách sản xuất video thương hiệu cho các SME.",
    actionChecklist: ["Đăng ký tài khoản trải nghiệm Beta", "Thử nghiệm dựng concept TVC ra mắt sản phẩm mới"]
  }
];
