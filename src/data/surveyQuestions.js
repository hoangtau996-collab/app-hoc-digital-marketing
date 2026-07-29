/**
 * BỘ CÂU HỎI KHẢO SÁT ĐẦU VÀO
 *
 * Mục đích: phân tệp học viên để thiết kế khoá nâng cao "đo ni đóng giày" cho
 * từng nhóm (chuyên viên, quản lý, chủ doanh nghiệp).
 *
 * ĐÂY LÀ NGUỒN KHẲNG ĐỊNH DUY NHẤT của bộ câu hỏi. Modal khảo sát, cột trong
 * Bảng Quản Trị và tiêu đề cột của tệp xuất đều đọc từ đây. Trước khi thêm bản
 * sao ở nơi khác, nhớ: ba nơi đó phải luôn khớp nhau, mà ghi tay ba lần thì chỉ
 * cần sửa một chỗ là hai chỗ còn lại trôi đi lặng lẽ — câu hỏi hiện trên màn
 * hình một đằng, tiêu đề cột trong báo cáo một nẻo.
 *
 * ĐỔI CÂU HỎI THÌ PHẢI TĂNG `SURVEY_VERSION`. Câu trả lời cũ lưu theo mã đáp án
 * (`value`), không lưu theo nhãn hiển thị; đổi nhãn thì dữ liệu cũ vẫn đọc đúng,
 * nhưng đổi/xoá `value` sẽ khiến bản ghi cũ trở thành mã lạ không tra ra nhãn.
 * Số phiên bản đi kèm từng bản ghi để về sau còn biết bản trả lời đó thuộc bộ
 * câu hỏi nào.
 */

export const SURVEY_VERSION = 1;

export const SURVEY_QUESTIONS = [
  {
    id: 'field',
    title: 'Hiện tại bạn đang làm việc trong lĩnh vực nào?',
    hint: 'Giúp Học Viện chọn ví dụ và bài tập sát với công việc thật của bạn.',
    csvLabel: 'Lĩnh vực đang làm',
    options: [
      { value: 'marketing', label: 'Marketing / Truyền thông / Agency' },
      { value: 'sales', label: 'Kinh doanh / Sales / Bán hàng online' },
      { value: 'management', label: 'Quản lý / Điều hành doanh nghiệp' },
      { value: 'student', label: 'Học sinh / Sinh viên' },
      {
        value: 'other',
        label: 'Khác',
        // Đáp án duy nhất cho phép ghi thêm. Một ô nhập tự do là một trường dữ
        // liệu không gom nhóm được, nên chỉ mở đúng chỗ thật sự cần.
        allowText: true,
        textPlaceholder: 'Bạn ghi rõ lĩnh vực giúp Học Viện nhé'
      }
    ]
  },
  {
    id: 'position',
    title: 'Vị trí công việc hiện tại của bạn là gì?',
    hint: 'Cùng một kiến thức, cách triển khai của nhân viên và của chủ doanh nghiệp khác hẳn nhau.',
    csvLabel: 'Vị trí công việc',
    options: [
      { value: 'staff', label: 'Nhân viên / Chuyên viên (Junior / Senior)' },
      { value: 'leader', label: 'Quản lý / Trưởng nhóm (Leader / Manager)' },
      { value: 'owner', label: 'Chủ doanh nghiệp / Founder / Freelancer' },
      { value: 'transition', label: 'Chưa đi làm / Đang chuyển nghề' }
    ]
  },
  {
    id: 'goal',
    title: 'Mục tiêu lớn nhất của bạn sau khi hoàn thành khóa học là gì?',
    hint: 'Học Viện sẽ ưu tiên nội dung phục vụ đúng mục tiêu này.',
    csvLabel: 'Mục tiêu sau khoá học',
    options: [
      { value: 'promotion', label: 'Tăng thăng tiến / Tăng lương ở vị trí hiện tại' },
      { value: 'career-switch', label: 'Chuyển ngành thành công sang làm Digital Marketing' },
      { value: 'own-business', label: 'Tự vận hành Marketing để phát triển thương hiệu/doanh nghiệp riêng' },
      { value: 'portfolio', label: 'Bổ sung CV / Làm đẹp Portfolio để xin việc mới' }
    ]
  },
  {
    id: 'skill',
    title: 'Năng lực nào bạn muốn nâng cấp nhất để đạt mục tiêu trên?',
    hint: 'Chọn một năng lực bạn thấy thiếu nhất ở thời điểm này.',
    csvLabel: 'Năng lực muốn nâng cấp',
    options: [
      { value: 'strategy', label: 'Tư duy lập Chiến lược & Quản lý ngân sách' },
      { value: 'performance', label: 'Thực chiến Quảng cáo (Performance Ads — Facebook, Google, TikTok)' },
      { value: 'ai-automation', label: 'Ứng dụng AI & Tự động hóa (Automation) vào Marketing' },
      { value: 'content', label: 'Xây dựng Content, Video ngắn & Thương hiệu cá nhân' }
    ]
  },
  {
    id: 'format',
    title: 'Nếu Học Viện mở khóa học tiếp theo để giúp bạn đạt mục tiêu, bạn ưu tiên hình thức nào?',
    hint: 'Câu trả lời này quyết định hình thức khoá học tiếp theo được mở.',
    csvLabel: 'Hình thức khoá học mong muốn',
    options: [
      { value: 'short', label: 'Lớp ngắn hạn thực chiến (1–2 tuần, giải quyết 1 kỹ năng cụ thể)' },
      { value: 'deep', label: 'Lộ trình chuyên sâu (1–2 tháng, từ tổng quan đến thực hành)' },
      { value: 'coaching', label: 'Lớp Coaching 1:1 / Nhóm nhỏ (giải quyết trực tiếp bài toán của bạn)' }
    ]
  }
];

export const SURVEY_TOTAL = SURVEY_QUESTIONS.length;

/** Khoá lưu phần ghi thêm của một câu: `field` -> `fieldOther`. */
export const otherKeyOf = (questionId) => `${questionId}Other`;

/**
 * Một câu đã trả lời xong chưa.
 *
 * Chọn "Khác" mà bỏ trống ô ghi thêm thì CHƯA xong: bản ghi khi đó chỉ nói được
 * "không thuộc bốn nhóm kia", đúng thứ vô dụng nhất khi đi phân tệp.
 */
export function isAnswered(question, answers) {
  const value = answers?.[question.id];
  if (!value) return false;
  const opt = question.options.find((o) => o.value === value);
  if (!opt) return false;
  if (opt.allowText) return String(answers?.[otherKeyOf(question.id)] || '').trim().length > 0;
  return true;
}

/** Cả bộ đã trả lời xong chưa. */
export function isSurveyComplete(answers) {
  if (!answers || typeof answers !== 'object') return false;
  return SURVEY_QUESTIONS.every((q) => isAnswered(q, answers));
}

/** Số câu đã trả lời, dùng cho thanh tiến độ và cột trong Bảng Quản Trị. */
export function answeredCount(answers) {
  if (!answers || typeof answers !== 'object') return 0;
  return SURVEY_QUESTIONS.filter((q) => isAnswered(q, answers)).length;
}

/**
 * Nhãn đọc được của một câu trả lời, dùng cho Bảng Quản Trị và tệp xuất.
 *
 * Trả về chính mã đáp án nếu không tra ra nhãn — nghĩa là bản ghi thuộc một
 * phiên bản câu hỏi cũ. Hiện mã thô còn hơn hiện ô trống: ô trống trông y hệt
 * "chưa trả lời", còn mã thô thì nhìn ra ngay là dữ liệu cũ cần đối chiếu.
 */
export function answerLabel(questionId, answers) {
  const q = SURVEY_QUESTIONS.find((x) => x.id === questionId);
  const value = answers?.[questionId];
  if (!q || !value) return '';
  const opt = q.options.find((o) => o.value === value);
  if (!opt) return String(value);
  if (opt.allowText) {
    const text = String(answers?.[otherKeyOf(questionId)] || '').trim();
    return text ? `Khác: ${text}` : 'Khác';
  }
  return opt.label;
}
