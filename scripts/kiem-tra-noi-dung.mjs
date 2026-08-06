/**
 * KIỂM SOÁT NỘI DUNG KHOÁ HỌC
 *
 * Chạy:  npm run check:content          — kiểm tra ngoại tuyến, vài giây
 *        npm run check:content -- --net — kiểm tra thêm từng URL ảnh trả về 200
 *                                         (mất khoảng 3 phút vì phải đi chậm
 *                                         để không bị Wikimedia chặn tần suất)
 *
 * Dự án không có kiểm thử tự động (xem AI_MEMORY.md), nên đây là chốt chặn duy
 * nhất cho các ràng buộc dữ liệu đã từng bị vi phạm trong thực tế:
 *
 *   - lessonsCount / quizCount lệch với số phần tử thật (đã từng lệch ở 10/11
 *     chuyên đề khoá chính)
 *   - sectionId trùng nhau giữa hai khoá — vì LESSON_PHOTOS, LESSON_VISUALS và
 *     LESSON_CASES đều tra theo sectionId, trùng id là kéo nhầm minh hoạ của
 *     khoá kia sang mà không báo lỗi gì
 *   - trình kết xuất trong LessonViewer chỉ hiểu '### ', '#### ', '- ', '1. '
 *     và '**đậm**'. Bảng markdown hay khối mã sẽ hiện ra nguyên ký tự thô
 *   - ảnh minh hoạ trỏ tới sectionId không tồn tại thì im lặng không hiện
 *
 * Thoát mã 1 khi có LỖI. Cảnh báo không làm hỏng mã thoát.
 */
import { COURSE_MODULES } from '../src/data/courseData.js';
import { TRADE_MODULES, TRADE_COURSE_META } from '../src/data/tradeCourseData.js';
import { LESSON_PHOTOS } from '../src/data/lessonPhotos.js';

const loi = [];
const canhBao = [];
const bao = (ds, viTri, thongDiep) => ds.push(`${viTri} — ${thongDiep}`);

const COURSES = [
  { ten: 'Digital Marketing', modules: COURSE_MODULES, mauSection: /^m\d+-s\d+$/ },
  { ten: 'Trade Marketing', modules: TRADE_MODULES, mauSection: /^tm\d+-s\d+$/ }
];

/* ============ 1. CẤU TRÚC CHUYÊN ĐỀ ============ */

const moiSectionId = new Map(); // sectionId -> tên khoá, để bắt trùng giữa hai khoá
const moiModuleId = new Map();
let tongSection = 0;

for (const { ten, modules, mauSection } of COURSES) {
  if (!Array.isArray(modules) || modules.length === 0) {
    bao(loi, ten, 'không có chuyên đề nào');
    continue;
  }

  for (const mod of modules) {
    const viTri = `${ten} / ${mod.id}`;

    if (moiModuleId.has(mod.id)) {
      bao(loi, viTri, `id chuyên đề trùng với ${moiModuleId.get(mod.id)}`);
    }
    moiModuleId.set(mod.id, viTri);

    for (const truong of ['title', 'subtitle', 'description', 'badge', 'duration']) {
      if (!mod[truong]) bao(loi, viTri, `thiếu trường ${truong}`);
    }

    const sections = mod.sections ?? [];
    const quiz = mod.quiz ?? [];

    if (mod.lessonsCount !== sections.length) {
      bao(loi, viTri, `lessonsCount = ${mod.lessonsCount} nhưng có ${sections.length} bài`);
    }
    if (mod.quizCount !== quiz.length) {
      bao(loi, viTri, `quizCount = ${mod.quizCount} nhưng có ${quiz.length} câu hỏi`);
    }

    /* --- Bài học --- */
    for (const sec of sections) {
      tongSection += 1;
      const viTriBai = `${viTri} / ${sec.id}`;

      if (!mauSection.test(sec.id ?? '')) {
        bao(loi, viTriBai, `id bài không đúng mẫu ${mauSection}`);
      }
      if (moiSectionId.has(sec.id)) {
        bao(loi, viTriBai, `id bài trùng với ${moiSectionId.get(sec.id)} — sẽ kéo nhầm ảnh, sơ đồ và case của bài kia`);
      }
      moiSectionId.set(sec.id, viTriBai);

      if (!sec.title) bao(loi, viTriBai, 'thiếu tiêu đề bài');
      if (!sec.content) bao(loi, viTriBai, 'thiếu nội dung bài');
      if (!sec.takeaway) bao(canhBao, viTriBai, 'thiếu câu chốt takeaway');

      const noiDung = sec.content ?? '';
      if (noiDung.includes('```')) {
        bao(loi, viTriBai, 'có khối mã ``` — trình kết xuất không hiểu, sẽ hiện ra ký tự thô');
      }
      if (/^\s*\|.*\|\s*$/m.test(noiDung)) {
        bao(loi, viTriBai, 'có bảng markdown — trình kết xuất không hiểu, sẽ hiện ra ký tự thô');
      }
      if (/^#{1,2} (?!#)/m.test(noiDung)) {
        bao(canhBao, viTriBai, 'dùng tiêu đề # hoặc ## — chỉ ### và #### mới được kết xuất');
      }
      // Dấu ** phải đi theo cặp, lẻ một dấu là hỏng đoạn in đậm.
      const soSaoDoi = (noiDung.match(/\*\*/g) ?? []).length;
      if (soSaoDoi % 2 !== 0) {
        bao(loi, viTriBai, 'số cặp dấu ** lẻ — có một chỗ in đậm không đóng lại');
      }
    }

    /* --- Câu hỏi --- */
    const idCauHoi = new Set();
    for (const q of quiz) {
      const viTriHoi = `${viTri} / ${q.id}`;
      if (idCauHoi.has(q.id)) bao(loi, viTriHoi, 'id câu hỏi bị lặp trong cùng chuyên đề');
      idCauHoi.add(q.id);

      if (!q.question) bao(loi, viTriHoi, 'thiếu nội dung câu hỏi');
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        bao(loi, viTriHoi, `phải đúng 4 lựa chọn, đang có ${q.options?.length ?? 0}`);
      }
      if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3) {
        bao(loi, viTriHoi, `correct phải là số nguyên 0-3, đang là ${q.correct}`);
      }
      if (new Set(q.options ?? []).size !== (q.options ?? []).length) {
        bao(loi, viTriHoi, 'có hai lựa chọn trùng nội dung');
      }
      if (!q.explanation) bao(canhBao, viTriHoi, 'thiếu phần giải thích đáp án');
    }
  }
}

/* ============ 2. ẢNH MINH HOẠ ============ */

const anhPhang = []; // { key, photo } — đã trải phẳng cả ảnh đơn lẫn ảnh trong chùm
let soBaiCoAnh = 0;

for (const [sectionId, entry] of Object.entries(LESSON_PHOTOS)) {
  if (!moiSectionId.has(sectionId)) {
    bao(loi, `LESSON_PHOTOS['${sectionId}']`, 'trỏ tới bài không tồn tại — ảnh sẽ không bao giờ hiện');
    continue;
  }
  soBaiCoAnh += 1;

  const laChum = Array.isArray(entry.photos);
  if (laChum && !entry.gallery) {
    bao(loi, `LESSON_PHOTOS['${sectionId}']`, 'chùm ảnh thiếu tiêu đề gallery');
  }
  const danhSach = laChum ? entry.photos : [entry];
  if (laChum && danhSach.length < 2) {
    bao(canhBao, `LESSON_PHOTOS['${sectionId}']`, 'chùm ảnh chỉ có 1 tấm, nên khai báo dạng ảnh đơn');
  }

  danhSach.forEach((photo, i) => {
    const viTri = `LESSON_PHOTOS['${sectionId}']${laChum ? `[${i}]` : ''}`;
    for (const truong of ['url', 'caption', 'credit', 'source']) {
      if (!photo?.[truong]) bao(loi, viTri, `thiếu trường ${truong}`);
    }
    if (photo?.url && !photo.url.startsWith('https://')) {
      bao(loi, viTri, 'url phải dùng https');
    }
    // Giấy phép Creative Commons bắt buộc ghi công; thiếu tên giấy phép trong
    // credit là dùng ảnh sai điều khoản chứ không phải lỗi hiển thị.
    if (photo?.credit && !/\((CC|Public domain)/i.test(photo.credit)) {
      bao(loi, viTri, 'credit không ghi tên giấy phép');
    }
    if (laChum && !photo?.label) {
      bao(canhBao, viTri, 'ảnh trong chùm nên có label để gọi tên khái niệm');
    }
    if (photo?.url) anhPhang.push({ viTri, url: photo.url });
  });
}

const trung = new Map();
for (const { viTri, url } of anhPhang) {
  if (trung.has(url)) bao(canhBao, viTri, `dùng lại đúng tấm ảnh của ${trung.get(url)}`);
  else trung.set(url, viTri);
}

/* ============ 3. KIỂM TRA MẠNG (tuỳ chọn) ============ */

if (process.argv.includes('--net')) {
  const UA = { 'User-Agent': 'KiemTraNoiDung/1.0 (app hoc digital marketing)' };
  const nghi = (ms) => new Promise((r) => setTimeout(r, ms));

  /* Wikimedia chặn theo tần suất. Gọi liên tục 59 URL là bị trả 429 hàng loạt,
     và một bài kiểm tra báo sai còn tệ hơn không kiểm tra: lần sau không ai
     tin nó nữa. Nên gặp 429 thì lùi lại chờ rồi thử lại, chỉ khi hết lượt
     mới coi là ảnh hỏng thật. */
  const kiemTra = async (url) => {
    for (let lan = 0; lan < 4; lan += 1) {
      try {
        const res = await fetch(url, { headers: UA });
        if (res.status !== 429) return res.status;
      } catch (e) {
        if (lan === 3) return `không gọi được: ${e.message}`;
      }
      await nghi(3000 * (lan + 1));
    }
    return 429;
  };

  console.log(`Đang kiểm tra ${anhPhang.length} URL ảnh (mất vài phút)...`);
  let soBiChan = 0;
  for (const { viTri, url } of anhPhang) {
    await nghi(2500);
    const trangThai = await kiemTra(url);
    if (trangThai === 200) continue;

    /* 429 là "máy chủ chặn tần suất của mình", KHÔNG phải "ảnh hỏng". Xếp nó
       vào lỗi là bài kiểm tra tự bịa ra lỗi không có thật, rồi lần sau người
       đọc bỏ qua cả những lỗi thật. Hết lượt thử lại mà vẫn 429 thì báo là
       chưa kết luận được, và nói rõ cách kiểm lại. */
    if (trangThai === 429) {
      soBiChan += 1;
      bao(canhBao, viTri, 'bị Wikimedia chặn tần suất, chưa kết luận được — chạy lại sau vài phút hoặc mở thẳng URL trên trình duyệt');
    } else {
      bao(loi, viTri, `URL trả về HTTP ${trangThai}`);
    }
  }
  if (soBiChan > 0) {
    console.log(`Có ${soBiChan}/${anhPhang.length} URL bị chặn tần suất, không kết luận được.`);
  }
}

/* ============ 4. BÁO CÁO ============ */

const tongModule = COURSES.reduce((s, c) => s + c.modules.length, 0);
const tongQuiz = COURSES.reduce(
  (s, c) => s + c.modules.reduce((t, m) => t + (m.quiz?.length ?? 0), 0),
  0
);

console.log('');
console.log('KIỂM SOÁT NỘI DUNG');
console.log('------------------');
for (const { ten, modules } of COURSES) {
  const bai = modules.reduce((s, m) => s + (m.sections?.length ?? 0), 0);
  const cau = modules.reduce((s, m) => s + (m.quiz?.length ?? 0), 0);
  console.log(`${ten}: ${modules.length} chuyên đề · ${bai} bài · ${cau} câu hỏi`);
}
console.log(`Khoá nâng cao cập nhật: ${TRADE_COURSE_META.updatedAt} · biên soạn: ${TRADE_COURSE_META.author}`);
console.log(`Ảnh minh hoạ: ${anhPhang.length} tấm, phủ ${soBaiCoAnh}/${tongSection} bài`);
console.log(`Tổng cộng: ${tongModule} chuyên đề · ${tongQuiz} câu hỏi`);
console.log('');

if (canhBao.length) {
  console.log(`CẢNH BÁO (${canhBao.length}):`);
  canhBao.forEach((d) => console.log('  - ' + d));
  console.log('');
}

if (loi.length) {
  console.log(`LỖI (${loi.length}):`);
  loi.forEach((d) => console.log('  x ' + d));
  console.log('');
  process.exit(1);
}

console.log('Không có lỗi.');
