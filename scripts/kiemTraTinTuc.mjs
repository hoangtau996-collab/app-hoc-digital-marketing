/**
 * Kiểm tra dữ liệu bản tin trước khi cho phép đẩy lên.
 *
 * Chạy sau mỗi lần cập nhật tự động. Sai bất kỳ điều nào là thoát với mã lỗi,
 * quy trình dừng và KHÔNG commit — thà không có tin mới còn hơn đẩy tin hỏng
 * ra cho học viên đọc.
 *
 * Chạy tay: node scripts/kiemTraTinTuc.mjs
 */

import { INITIAL_NEWS_ITEMS } from '../src/data/newsData.js';

const TONG_TOI_THIEU = 8;
const TONG_TOI_DA = 12;
const TRAN_MOI_NGUON = 4;
const NGUON_TOI_THIEU = 4;
const TRAN_MOI_NHOM = 6;

const NHOM_HOP_LE = ['Meta Ads', 'TikTok Shop & Ads', 'Google Ads & SEO', 'AI Marketing'];

const loi = [];
const canh = [];

const tatCa = INITIAL_NEWS_ITEMS;
const that = tatCa.filter((n) => n.sourceUrl);

/* --- Số lượng --- */
if (that.length < TONG_TOI_THIEU || that.length > TONG_TOI_DA) {
  loi.push(`có ${that.length} tin thật, phải trong khoảng ${TONG_TOI_THIEU}-${TONG_TOI_DA}`);
}

/* --- Ranh giới tin thật và tin mô phỏng ---
   Gắn nguồn thật hay ảnh thật vào tin mô phỏng là dựng chứng cứ giả. */
tatCa
  .filter((n) => n.isSimulated && (n.sourceUrl || n.image))
  .forEach((n) => loi.push(`tin mô phỏng bị gắn nguồn hoặc ảnh thật: ${n.id}`));

/* --- Không còn chuỗi ngày cứng ---
   Chuỗi kiểu '2 ngày trước' không tự già đi nên sẽ sai chỉ sau một đêm. */
tatCa.filter((n) => n.date).forEach((n) => loi.push(`còn chuỗi ngày cứng: ${n.id}`));

/* --- Đủ trường, đủ độ sâu --- */
for (const n of that) {
  const thieu = [];
  if (!n.publishedAt || !/^\d{2}\/\d{2}\/\d{4}$/.test(n.publishedAt)) thieu.push('publishedAt sai định dạng');
  if (!n.title || n.title.length < 20) thieu.push('title');
  if (!n.summary || n.summary.length < 60) thieu.push('summary');
  if (!n.impact || n.impact.length < 40) thieu.push('impact');
  if (!n.ifIgnored || n.ifIgnored.length < 40) thieu.push('ifIgnored');
  if (!Array.isArray(n.keyNumbers) || n.keyNumbers.length < 2) thieu.push('keyNumbers');
  if (!Array.isArray(n.content) || n.content.length < 4) thieu.push('content');
  if (!Array.isArray(n.actionChecklist) || n.actionChecklist.length < 4) thieu.push('actionChecklist');
  if (!NHOM_HOP_LE.includes(n.category)) thieu.push(`category lạ: ${n.category}`);
  if (thieu.length) loi.push(`${n.id}: ${thieu.join(', ')}`);
}

/* --- Không trùng --- */
const thayUrl = new Set();
const thayTieuDe = new Set();
const thayId = new Set();
for (const n of that) {
  if (thayUrl.has(n.sourceUrl)) loi.push(`trùng sourceUrl: ${n.id}`);
  thayUrl.add(n.sourceUrl);
  const k = n.title.toLowerCase().trim();
  if (thayTieuDe.has(k)) loi.push(`trùng tiêu đề: ${n.id}`);
  thayTieuDe.add(k);
  if (thayId.has(n.id)) loi.push(`trùng id: ${n.id}`);
  thayId.add(n.id);
}

/* --- Cân bằng nguồn và nhóm --- */
const demNguon = {};
const demNhom = {};
for (const n of that) {
  const h = new URL(n.sourceUrl).hostname.replace(/^www\./, '');
  demNguon[h] = (demNguon[h] || 0) + 1;
  demNhom[n.category] = (demNhom[n.category] || 0) + 1;
}
Object.entries(demNguon)
  .filter(([, c]) => c > TRAN_MOI_NGUON)
  .forEach(([h, c]) => loi.push(`nguồn ${h} có ${c} tin, trần là ${TRAN_MOI_NGUON}`));
if (Object.keys(demNguon).length < NGUON_TOI_THIEU) {
  loi.push(`chỉ có ${Object.keys(demNguon).length} nguồn, tối thiểu ${NGUON_TOI_THIEU}`);
}
Object.entries(demNhom)
  .filter(([, c]) => c > TRAN_MOI_NHOM)
  .forEach(([k, c]) => loi.push(`nhóm ${k} có ${c} tin, trần là ${TRAN_MOI_NHOM}`));

/* --- Cảnh báo, không chặn ---
   Thiếu ảnh không phải lỗi: giao diện tự lùi về tranh SVG. Nhưng nếu nhiều tin
   cùng thiếu thì đáng xem lại cách lấy ảnh. */
const khongAnh = that.filter((n) => !n.image?.url);
if (khongAnh.length > 0) canh.push(`${khongAnh.length} tin không có ảnh bìa, sẽ dùng tranh SVG`);

const nhomVang = NHOM_HOP_LE.filter((k) => !demNhom[k]);
if (nhomVang.length) canh.push(`nhóm chưa có tin nào: ${nhomVang.join(', ')}`);

/* --- Kết luận --- */
if (canh.length) {
  console.log('Cảnh báo (không chặn):');
  canh.forEach((c) => console.log('  - ' + c));
}

if (loi.length) {
  console.error('KIỂM TRA THẤT BẠI:');
  loi.forEach((l) => console.error('  - ' + l));
  process.exit(1);
}

console.log(
  `ĐẠT: ${that.length} tin thật, ${Object.keys(demNguon).length} nguồn`,
  JSON.stringify(demNguon)
);
console.log('Nhóm:', JSON.stringify(demNhom));
