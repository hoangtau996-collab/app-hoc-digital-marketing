/**
 * Luật mã kích hoạt khoá học.
 *
 * VÌ SAO QUYỀN HỌC KHÔNG ĐƯỢC CHÉP THÀNH MỘT DẤU TICK TRÊN HỒ SƠ HỌC VIÊN
 *
 * Yêu cầu đặt ra: mã hết hạn hoặc bị xoá thì học viên không vào học được nữa.
 * Nếu lúc nhập mã ta ghi `daMoKhoa: true` lên hồ sơ rồi từ đó chỉ đọc dấu tick
 * ấy, thì xoá mã đi chẳng ảnh hưởng gì — dấu tick vẫn nằm đó. Muốn thu hồi
 * phải đi sửa từng hồ sơ, và chỉ cần sót một người là người đó học mãi mãi.
 *
 * Nên quyền học ở đây được TÍNH LẠI mỗi lần cần, từ hai mẩu dữ liệu rời:
 *
 *     lượt nhập mã (ai đã nhập mã nào)  +  bản thân mã (còn sống không)
 *
 * Mã bị xoá thì phép tính không tìm thấy vế thứ hai, quyền mất ngay lập tức mà
 * không ai phải đụng vào hồ sơ học viên. Đó cũng chính là lý do THÔNG TIN HỌC
 * VIÊN KHÔNG MẤT khi thu hồi quyền: hai thứ nằm ở hai bảng khác nhau, xoá bảng
 * này không chạm vào bảng kia.
 *
 * Tệp này là hàm thuần: không biết gì về React lẫn Firebase, nên kiểm thử được
 * bằng cách gọi thẳng. Mọi nơi trong ứng dụng phải hỏi quyền qua đây chứ không
 * tự viết lại điều kiện — một quy tắc nằm ở hai chỗ là sớm muộn cũng lệch nhau.
 */

/** Các khoá học mã có thể mở. Phải khớp `activeTab` trong App.jsx. */
export const KHOA_HOP_LE = ['main', 'trade'];

export const TEN_KHOA = {
  main: 'Digital Marketing',
  trade: 'Trade Marketing',
};

/**
 * MỐC BẮT ĐẦU YÊU CẦU MÃ.
 *
 * Học viên đăng ký TRƯỚC mốc này vào học bình thường, không cần mã. Họ đã học
 * dở từ khi chưa có luật này; bật cái khoá lên rồi chặn hết là lấy đi thứ họ
 * đang có và gần như chắc chắn mất người học.
 *
 * Đặt là hằng số trong mã nguồn chứ không để trên Firestore: đây là một quyết
 * định lịch sử, đã qua rồi thì không bao giờ đổi nữa. Để trên Firestore thì nó
 * thành một cái nút bấm nhầm được, mà bấm nhầm là khoá nhầm cả lớp cũ.
 */
export const MOC_YEU_CAU_MA = Date.parse('2026-10-20T00:00:00+07:00');

/**
 * Chuẩn hoá mã người dùng gõ vào.
 *
 * Học viên chép mã từ tin nhắn Zalo nên thường dính khoảng trắng đầu cuối, đôi
 * khi cả dấu cách giữa chừng, và gõ thường hay hoa tuỳ máy. Chuẩn hoá ở đúng
 * một chỗ để lúc tra cứu và lúc lưu luôn ra cùng một chuỗi.
 */
export function chuanHoaMa(thoMa) {
  return String(thoMa || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
}

/** Mã hợp lệ về hình thức: 4-32 ký tự, chỉ chữ in, số và dấu gạch ngang. */
export function hinhThucMaHopLe(ma) {
  return /^[A-Z0-9-]{4,32}$/.test(chuanHoaMa(ma));
}

/**
 * Thời điểm mã hết hiệu lực, tính theo giờ Việt Nam.
 *
 * `hanDung` lưu dạng 'YYYY-MM-DD'. Mã còn dùng được HẾT ngày đó chứ không phải
 * đến 0 giờ sáng ngày đó: học viên đọc "hạn 31/12" sẽ hiểu là hết ngày 31, và
 * cắt lúc rạng sáng là cắt sớm mất một ngày so với điều đã hứa.
 *
 * Ghim múi giờ +07:00 thay vì để trình duyệt tự suy: máy học viên đặt sai múi
 * giờ là chuyện thường, mà hạn dùng thì phải giống nhau với mọi người.
 */
export function mocHetHan(hanDung) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(hanDung || ''))) return null;
  const moc = Date.parse(`${hanDung}T23:59:59+07:00`);
  return Number.isFinite(moc) ? moc : null;
}

/**
 * Tình trạng hiện thời của một mã.
 *
 * Trả về chuỗi chứ không phải true/false: giao diện quản trị cần nói rõ mã chết
 * vì lý do gì, và màn nhập mã cần báo đúng nguyên nhân cho học viên. Gộp hết
 * vào một chữ "không hợp lệ" là đẩy học viên sang gọi điện hỏi.
 *
 * @returns {'khong-ton-tai'|'tat'|'het-han'|'het-luot'|'hong'|'dung-duoc'}
 */
export function tinhTrangMa(ma, bayGio = Date.now()) {
  if (!ma) return 'khong-ton-tai';
  if (ma.active === false) return 'tat';

  const moc = mocHetHan(ma.hanDung);
  // Mã hỏng dữ liệu thì coi như chết, KHÔNG coi như vô hạn. Sai theo hướng chặt
  // là học viên gọi hỗ trợ; sai theo hướng lỏng là mã vô hạn trôi nổi bên ngoài.
  if (moc === null) return 'hong';
  if (bayGio > moc) return 'het-han';

  const daDung = Number(ma.daDung) || 0;
  const toiDa = Number(ma.soLuot) || 0;
  if (toiDa <= 0) return 'hong';
  if (daDung >= toiDa) return 'het-luot';

  return 'dung-duoc';
}

export const LOI_MA = {
  'khong-ton-tai': 'Mã không tồn tại. Kiểm tra lại từng ký tự giúp em nhé.',
  tat: 'Mã này đã bị ngưng sử dụng.',
  'het-han': 'Mã đã hết hạn sử dụng.',
  'het-luot': 'Mã đã dùng hết số lượt cho phép.',
  hong: 'Mã có lỗi dữ liệu, vui lòng liên hệ Ban Quản Trị.',
};

/** Học viên này thuộc lớp cũ, được miễn mã. */
export function duocMienMa(user, moc = MOC_YEU_CAU_MA) {
  if (!user) return false;

  const dangKyLuc = Date.parse(user.createdAt || '');

  // KHÔNG đọc được ngày đăng ký thì MIỄN, không phải chặn.
  //
  // Hồ sơ cũ có thể thiếu `createdAt`, hoặc lưu bằng định dạng khác. Chặn nhầm
  // một học viên thật đang học dở là hỏng nặng hơn nhiều so với cho lọt một
  // người lẽ ra phải nhập mã — người lọt vẫn nằm trong danh sách quản trị và
  // xử lý tay được, còn người bị chặn oan thì bỏ đi mất.
  if (!Number.isFinite(dangKyLuc)) return true;

  return dangKyLuc < moc;
}

/**
 * Tính quyền học từ dữ liệu rời.
 *
 * @param {object}   p
 * @param {object}   p.user        Hồ sơ học viên đang đăng nhập.
 * @param {boolean}  p.isAdmin     Quản trị viên đi qua mọi cổng.
 * @param {Array}    p.luotNhap    Các lượt nhập mã của chính học viên này.
 * @param {object}   p.maTheoId    Bản đồ { MÃ: bản ghi mã } đã tải về.
 * @param {number}   p.bayGio
 * @returns {{duocVao: boolean, khoaMo: string[], nguon: string, maSong: Array}}
 */
export function tinhQuyenHoc({
  user,
  isAdmin = false,
  luotNhap = [],
  maTheoId = {},
  bayGio = Date.now(),
} = {}) {
  if (!user) return { duocVao: false, khoaMo: [], nguon: 'chua-dang-nhap', maSong: [] };

  // Quản trị viên mở hết. Họ phải vào được mọi khoá để soát nội dung, và khoá
  // chính người đi cấp mã ra ngoài là tự khoá mình khỏi công cụ của mình.
  if (isAdmin) {
    return { duocVao: true, khoaMo: [...KHOA_HOP_LE], nguon: 'quan-tri', maSong: [] };
  }

  if (duocMienMa(user)) {
    return { duocVao: true, khoaMo: [...KHOA_HOP_LE], nguon: 'lop-cu', maSong: [] };
  }

  // Đây là chỗ phép tính nói ở đầu tệp thật sự diễn ra: mỗi lượt nhập mã chỉ
  // còn giá trị khi bản ghi mã tương ứng vẫn còn sống. Mã bị xoá khỏi
  // `maTheoId` thì lượt nhập đó rơi ra khỏi kết quả, không cần ai thu hồi.
  const maSong = [];
  const khoaMo = new Set();

  for (const luot of luotNhap) {
    const ma = maTheoId[chuanHoaMa(luot?.ma)];
    if (tinhTrangMa(ma, bayGio) !== 'dung-duoc') continue;

    maSong.push(ma);
    // Lấy danh sách khoá từ BẢN GHI MÃ chứ không từ lượt nhập đã lưu: quản trị
    // viên sửa phạm vi mã thì phải có hiệu lực ngay với người đã nhập, chứ
    // không phải chỉ với người nhập sau.
    (Array.isArray(ma.khoa) ? ma.khoa : []).forEach((k) => {
      if (KHOA_HOP_LE.includes(k)) khoaMo.add(k);
    });
  }

  return {
    duocVao: khoaMo.size > 0,
    khoaMo: [...khoaMo],
    nguon: khoaMo.size > 0 ? 'ma' : 'chua-co-ma',
    maSong,
  };
}

/**
 * Sinh mã ngẫu nhiên cho quản trị viên.
 *
 * Bỏ các ký tự dễ đọc nhầm khi chép tay: số 0 với chữ O, số 1 với chữ I. Mã
 * được đọc qua điện thoại và chép lại từ tin nhắn, nên một cặp dễ lẫn là một
 * cuộc gọi hỗ trợ.
 */
export function sinhMa(tienTo = 'PMA') {
  const BANG = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let than = '';
  for (let i = 0; i < 8; i += 1) {
    than += BANG[Math.floor(Math.random() * BANG.length)];
  }
  return `${chuanHoaMa(tienTo)}-${than}`;
}

/** Nhãn gọn cho phạm vi mã, dùng ở bảng quản trị và màn nhập mã. */
export function nhanPhamVi(khoa) {
  const ds = (Array.isArray(khoa) ? khoa : []).filter((k) => KHOA_HOP_LE.includes(k));
  if (ds.length === 0) return 'Chưa chọn khoá';
  if (ds.length === KHOA_HOP_LE.length) return 'Combo cả 2 khoá';
  return TEN_KHOA[ds[0]] || ds[0];
}
