/**
 * Danh sách "bia mộ" các học viên đã bị quản trị viên xoá.
 *
 * Vì sao cần: dữ liệu học viên được ghi vào 4 nơi (Firestore students,
 * Firestore registrations, Realtime Database qua REST, và localStorage). Chỉ
 * cần một nơi xoá sót là bản ghi sẽ quay lại sau khi F5. Ngoài ra danh sách
 * SAMPLE_STUDENTS luôn được trộn lại mỗi lần tải nên học viên mẫu không thể
 * xoá bằng cách xoá khỏi kho.
 *
 * Bia mộ là lớp chốt chặn cuối: đã nằm trong danh sách này thì không bao giờ
 * hiển thị lại, bất kể nguồn nào còn sót.
 */

const LS_KEY = 'dmm_deleted_students';

const norm = (email) => String(email || '').trim().toLowerCase();

export function getDeletedStudents() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(norm).filter(Boolean) : [];
  } catch (e) {
    return [];
  }
}

export function isStudentDeleted(email) {
  const key = norm(email);
  return key ? getDeletedStudents().includes(key) : false;
}

export function markStudentDeleted(email) {
  const key = norm(email);
  if (!key) return;
  try {
    const list = getDeletedStudents();
    if (!list.includes(key)) {
      localStorage.setItem(LS_KEY, JSON.stringify([...list, key]));
    }
  } catch (e) { /* bỏ qua */ }
}

/** Dùng khi quản trị viên muốn khôi phục một học viên đã xoá. */
export function unmarkStudentDeleted(email) {
  const key = norm(email);
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(getDeletedStudents().filter((e) => e !== key)));
  } catch (e) { /* bỏ qua */ }
}

/** Lọc bỏ mọi bản ghi đã bị xoá khỏi một danh sách học viên. */
export function filterDeleted(list) {
  const deleted = getDeletedStudents();
  if (!deleted.length) return list;
  return (list || []).filter((s) => s && !deleted.includes(norm(s.email)));
}
