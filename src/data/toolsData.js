export const INDUSTRY_BENCHMARKS = {
  ecommerce: {
    name: "Thương mại điện tử / Bán lẻ",
    budgetRatio: 0.15, // 15% doanh thu
    adsRatio: 0.65,
    contentRatio: 0.15,
    brandingRatio: 0.10,
    techRatio: 0.10,
    avgCAC: 120000
  },
  b2b: {
    name: "Doanh nghiệp B2B / Dịch vụ",
    budgetRatio: 0.08, // 8% doanh thu
    adsRatio: 0.40,
    contentRatio: 0.30,
    brandingRatio: 0.15,
    techRatio: 0.15,
    avgCAC: 850000
  },
  fmcg: {
    name: "Tiêu dùng nhanh (FMCG)",
    budgetRatio: 0.12, // 12% doanh thu
    adsRatio: 0.45,
    contentRatio: 0.20,
    brandingRatio: 0.25,
    techRatio: 0.10,
    avgCAC: 45000
  },
  highticket: {
    name: "Sản phẩm Giá trị cao / BĐS / Mỹ viện",
    budgetRatio: 0.10, // 10% doanh thu
    adsRatio: 0.50,
    contentRatio: 0.20,
    brandingRatio: 0.20,
    techRatio: 0.10,
    avgCAC: 2500000
  }
};

export const STAFF_ROLES = [
  { id: "manager", title: "Trưởng phòng Digital Marketing", baseSalary: 30000000, desc: "Quản trị chiến lược, ngân sách và OKRs" },
  { id: "performance", title: "Chuyên viên Performance (Ads)", baseSalary: 16000000, desc: "Tối ưu thầu Meta, Google, TikTok Ads" },
  { id: "content", title: "Chuyên viên Content & Creative", baseSalary: 14000000, desc: "Sáng tạo nội dung, kịch bản Video ngắn" },
  { id: "designer", title: "Graphic & Video Editor", baseSalary: 15000000, desc: "Thiết kế Banner, dựng Video Reels/TikTok" },
  { id: "seo", title: "Chuyên viên SEO & Website", baseSalary: 14000000, desc: "Tối ưu tìm kiếm Google & Traffic tự nhiên" }
];
