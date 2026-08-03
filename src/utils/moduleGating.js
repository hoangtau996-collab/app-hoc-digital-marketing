/**
 * Quy tắc mở khoá chuyên đề: học tuần tự, phải đạt bài kiểm tra của chuyên đề
 * liền trước mới vào được chuyên đề kế tiếp.
 *
 * Vì sao gom vào một chỗ: có bốn lối vào một chuyên đề — thẻ ở trang tổng quan,
 * danh sách dọc bên sidebar, dải chọn nhanh trên điện thoại, và nút "Chuyên đề
 * Tiếp Theo" cuối bài. Mỗi nơi tự viết điều kiện thì sớm muộn cũng lệch nhau, và
 * chỉ cần một lối quên kiểm tra là toàn bộ quy tắc mất tác dụng.
 *
 * Ba trường hợp luôn mở, theo đúng thứ tự kiểm tra trong hàm:
 *
 *   1. Chuyên đề đầu tiên — không có gì đứng trước nó để mà yêu cầu.
 *   2. Chuyên đề chính học viên đã đạt — đã đạt rồi thì không khoá lại, kể cả
 *      khi chuyên đề trước đó chưa đạt. Trường hợp này có thật: học viên cũ đã
 *      học xong trước khi có quy tắc này sẽ có tiến độ ngắt quãng, khoá lại là
 *      lấy đi thứ họ đã làm được.
 *   3. Chuyên đề liền trước đã nằm trong danh sách đạt.
 *
 * Chỉ xét chuyên đề LIỀN TRƯỚC chứ không xét toàn bộ các chuyên đề phía trước.
 * Với học viên mới hai cách cho kết quả giống hệt nhau vì tiến độ chạy tuần tự
 * từ chuyên đề 1. Khác biệt chỉ xuất hiện ở dữ liệu cũ ngắt quãng, và ở đó cách
 * này khoan dung hơn — đúng với lý do nêu ở mục 2.
 */

/** Chuẩn hoá đầu vào: nơi gọi có thể truyền undefined trong lúc dữ liệu đang tải. */
const asArray = (v) => (Array.isArray(v) ? v : []);

/**
 * Chuyên đề này đã mở khoá chưa.
 *
 * @param {Array<{id: string}>} modules Danh sách chuyên đề theo đúng thứ tự học.
 * @param {string} moduleId Chuyên đề muốn vào.
 * @param {string[]} completedModules Các chuyên đề đã đạt bài kiểm tra.
 * @returns {boolean}
 */
export function isModuleUnlocked(modules, moduleId, completedModules, bypass = false) {
  // Quản trị viên đi qua mọi khoá tuần tự.
  //
  // Khoá này để học viên học đúng thứ tự, không phải để giữ bí mật nội dung.
  // Ban Quản Trị cần mở bất kỳ chuyên đề nào để soát nội dung, kiểm tra câu hỏi
  // trắc nghiệm hay xem lại chỗ học viên báo lỗi — bắt họ học lần lượt 11 bài
  // mới xem được bài cuối là biến công cụ quản trị thành thứ không dùng được.
  //
  // Truyền cờ vào từ nơi gọi chứ không tự đọc trạng thái đăng nhập ở đây: tệp
  // này là hàm thuần, không biết gì về React lẫn Firebase, và giữ được như vậy
  // thì còn kiểm thử riêng được.
  if (bypass) return true;

  const list = asArray(modules);
  const done = asArray(completedModules);

  const index = list.findIndex((m) => m.id === moduleId);

  // Không tìm thấy thì trả về true: dữ liệu hỏng không phải lý do để chặn học
  // viên, và các tầng phía sau vẫn tự xử lý được trường hợp thiếu chuyên đề.
  if (index < 0) return true;

  if (index === 0) return true;
  if (done.includes(moduleId)) return true;

  return done.includes(list[index - 1].id);
}

/**
 * Chuyên đề đang chặn lối vào, dùng để nói rõ học viên cần làm gì.
 *
 * @returns {{id: string, number: string, title: string} | null} null khi đã mở khoá.
 */
export function getBlockingModule(modules, moduleId, completedModules, bypass = false) {
  if (isModuleUnlocked(modules, moduleId, completedModules, bypass)) return null;

  const list = asArray(modules);
  const index = list.findIndex((m) => m.id === moduleId);
  return list[index - 1] || null;
}

/**
 * Câu thông báo hiển thị khi học viên bấm vào một chuyên đề còn khoá.
 *
 * @returns {string | null} null khi đã mở khoá.
 */
export function getGateMessage(modules, moduleId, completedModules, bypass = false) {
  const blocker = getBlockingModule(modules, moduleId, completedModules, bypass);
  if (!blocker) return null;

  return `🔒 Cần đạt bài kiểm tra Chuyên đề ${blocker.number} — ${blocker.title} trước khi học chuyên đề tiếp theo.`;
}
