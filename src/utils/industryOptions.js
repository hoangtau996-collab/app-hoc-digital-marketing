/**
 * Danh sách ngành nghề kinh doanh của học viên.
 *
 * Để ở một tệp dùng chung vì có HAI nơi ghi trường `industry` xuống Firestore:
 * form đăng ký thường (AuthModal) và bước hoàn tất hồ sơ sau khi đăng nhập bằng
 * Google (CompleteProfileModal). Chép danh sách ra hai chỗ thì sớm muộn cũng
 * lệch nhau một chữ, và lúc đó Bảng Quản Trị lọc theo ngành sẽ đếm ra hai nhóm
 * riêng cho cùng một ngành — kiểu sai không báo lỗi, chỉ làm số liệu sai âm thầm.
 */
export const INDUSTRY_OPTIONS = [
  'Bất Động Sản',
  'Thương Mại Điện Tử & Bán Lẻ (E-Commerce)',
  'F&B - Nông Sản - Thực Phẩm',
  'Thời Trang - Mỹ Phẩm & Làm Đẹp',
  'Dịch Vụ & Spa - Thẩm Mỹ Viện',
  'Y Tế - Sức Khỏe - Dược Phẩm',
  'Giáo Dục & Đào Tạo - Du Học',
  'Công Nghệ - Phần Mềm & SaaS',
  'Tài Chính - Ngân Hàng - Bảo Hiểm',
  'Agency & Truyền Thông Marketing',
  'Ngành nghề Khác'
];

/**
 * Số điện thoại đã điền thật hay chưa.
 *
 * Đếm CHỮ SỐ chứ không so chuỗi với 'Chưa cập nhật': giá trị giữ chỗ xuất hiện
 * dưới vài dạng khác nhau trong kho dữ liệu cũ ('Chưa cập nhật', 'Chưa có SĐT',
 * chuỗi rỗng), so từng chuỗi một là sót. Dưới 9 chữ số thì không phải số điện
 * thoại Việt Nam gọi được, nên coi như chưa có.
 */
export const hasRealPhone = (phone) =>
  String(phone || '').replace(/\D/g, '').length >= 9;
