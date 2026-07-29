/**
 * Lưu trữ bản khảo sát tại máy.
 *
 * Vì sao cần lớp này thay vì đọc thẳng hồ sơ đám mây: khảo sát bật lên NGAY sau
 * khi đăng ký, sớm hơn lúc `getUserProgressFromCloud()` trả lời xong. Chờ máy
 * chủ mới biết học viên đã làm hay chưa thì hoặc là màn hình đứng im một nhịp
 * mạng, hoặc là hiện nhầm bảng khảo sát cho người vừa làm xong hôm qua.
 *
 * Bản tại máy là bản dùng để QUYẾT ĐỊNH có hỏi hay không. Bản trên Firestore là
 * bản để Ban Quản Trị đọc và xuất báo cáo. Hai bản ghi cùng lúc; máy chủ hỏng
 * thì học viên vẫn không bị hỏi lại, và lần đăng nhập sau `mergeCloudSurvey()`
 * kéo bản đám mây về cho máy mới.
 *
 * Lưu theo email nên một máy dùng chung không lẫn khảo sát của hai người.
 */

import { isSurveyComplete } from '../data/surveyQuestions';

const PREFIX = 'dmm_survey_';

const keyOf = (email) => {
  const clean = String(email || '').trim().toLowerCase();
  return clean ? `${PREFIX}${clean.replace(/[^a-z0-9]/g, '_')}` : '';
};

/** Bản ghi rỗng, dùng chung để nơi gọi không phải tự dựng hình dạng. */
const EMPTY = { answers: {}, completedAt: '', skips: 0, version: 0 };

export function readSurvey(email) {
  const key = keyOf(email);
  if (!key) return { ...EMPTY };
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...EMPTY };
    return {
      answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
      completedAt: typeof parsed.completedAt === 'string' ? parsed.completedAt : '',
      skips: Number.isFinite(parsed.skips) ? parsed.skips : 0,
      version: Number.isFinite(parsed.version) ? parsed.version : 0
    };
  } catch (e) {
    return { ...EMPTY };
  }
}

export function writeSurvey(email, record) {
  const key = keyOf(email);
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(record));
  } catch (e) { /* hết chỗ lưu thì thôi, bản đám mây vẫn còn */ }
}

/** Học viên này đã làm xong khảo sát chưa. */
export function hasCompletedSurvey(email) {
  const rec = readSurvey(email);
  return Boolean(rec.completedAt) && isSurveyComplete(rec.answers);
}

/** Ghi nhận một lần bấm "Bỏ qua". Trả về số lần đã bỏ qua tính cả lần này. */
export function recordSkip(email) {
  const rec = readSurvey(email);
  const next = { ...rec, skips: rec.skips + 1 };
  writeSurvey(email, next);
  return next.skips;
}

/**
 * Hợp nhất bản khảo sát đọc từ Firestore vào bản tại máy.
 *
 * Chỉ ghi đè khi bản đám mây ĐÃ HOÀN TẤT còn bản tại máy thì chưa. Chiều ngược
 * lại tuyệt đối không làm: học viên vừa làm xong trên máy này, hồ sơ đám mây
 * còn cũ, ghi đè bằng bản cũ là bắt họ làm lại từ đầu — và làm lại đúng ngay
 * sau khi vừa bấm xong là lỗi khó chịu nhất có thể có ở màn này.
 */
export function mergeCloudSurvey(email, cloudSurvey) {
  if (!cloudSurvey || typeof cloudSurvey !== 'object') return;
  if (!isSurveyComplete(cloudSurvey.answers)) return;
  if (hasCompletedSurvey(email)) return;
  writeSurvey(email, {
    answers: cloudSurvey.answers,
    completedAt: cloudSurvey.completedAt || new Date().toISOString(),
    skips: Number.isFinite(cloudSurvey.skips) ? cloudSurvey.skips : 0,
    version: Number.isFinite(cloudSurvey.version) ? cloudSurvey.version : 0
  });
}
