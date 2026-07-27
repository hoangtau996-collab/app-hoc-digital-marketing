/**
 * Logic nhắc học viên quay lại khi lơ là.
 *
 * Tách khỏi giao diện để kiểm chứng được bằng test mà không cần dựng React.
 */

export const IDLE_DAYS_THRESHOLD = 2;   // quá 2 ngày không học thì nhắc
export const SNOOZE_DAYS = 1;           // bấm "để sau" thì im 1 ngày

const LS_LAST_STUDY = 'dmm_last_study_at';
const LS_SNOOZE_UNTIL = 'dmm_study_reminder_snoozed_until';

const DAY_MS = 24 * 60 * 60 * 1000;

function readTime(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const t = Number(raw);
    return Number.isFinite(t) && t > 0 ? t : null;
  } catch (e) {
    return null;
  }
}

function writeTime(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch (e) {
    /* trình duyệt chặn localStorage: bỏ qua, tính năng nhắc chỉ là hỗ trợ */
  }
}

/** Gọi mỗi khi học viên thực sự học: mở bài, nộp bài kiểm tra. */
export function markStudyActivity(now = Date.now()) {
  writeTime(LS_LAST_STUDY, now);
}

export function getLastStudyAt() {
  return readTime(LS_LAST_STUDY);
}

/** Số ngày kể từ lần học gần nhất. Trả về null nếu chưa từng học. */
export function getIdleDays(now = Date.now()) {
  const last = getLastStudyAt();
  if (!last) return null;
  return Math.floor((now - last) / DAY_MS);
}

export function snoozeReminder(now = Date.now(), days = SNOOZE_DAYS) {
  writeTime(LS_SNOOZE_UNTIL, now + days * DAY_MS);
}

/**
 * Có nên hiện lời nhắc không.
 *
 * Cố tình KHÔNG nhắc trong các trường hợp sau, vì nhắc lúc đó chỉ gây khó chịu:
 *  - Khách chưa đăng nhập.
 *  - Học viên chưa từng học buổi nào (mới đăng ký xong đã bị nhắc thì rất vô lý).
 *  - Đã hoàn thành toàn bộ chuyên đề.
 *  - Vừa bấm "để sau" và chưa hết thời gian tạm hoãn.
 */
export function shouldRemind({ hasUser, completedCount, totalModules, now = Date.now() } = {}) {
  if (!hasUser) return false;
  if (totalModules > 0 && completedCount >= totalModules) return false;

  const snoozedUntil = readTime(LS_SNOOZE_UNTIL);
  if (snoozedUntil && now < snoozedUntil) return false;

  const idle = getIdleDays(now);
  if (idle === null) return false;

  return idle >= IDLE_DAYS_THRESHOLD;
}

/** Dùng cho test và cho nút đặt lại trong phần quản trị. */
export function resetStudyReminder() {
  try {
    localStorage.removeItem(LS_LAST_STUDY);
    localStorage.removeItem(LS_SNOOZE_UNTIL);
  } catch (e) { /* bỏ qua */ }
}
