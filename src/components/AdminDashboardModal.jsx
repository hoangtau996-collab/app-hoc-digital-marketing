import React, { useState, useEffect } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { 
  getAllRegisteredStudentsFromCloud, 
  listenToAllStudentsFromCloud,
  recordStudentAccountToCloud,
  db,
  doc,
  deleteDoc,
  TRAFFIC_BASELINE,
  ENROLLED_BASELINE,
  GRADUATE_BASELINE,
  deleteStudentEverywhere,
  setStudentRoleInCloud,
  fetchAdminRosterFromCloud,
  grantAdminInCloud,
  revokeAdminInCloud,
  diagnoseCloudAccess,
  reconcileGlobalStats,
  fetchStudentsFromCloudOnly
} from '../firebase';
import { markStudentDeleted, filterDeleted, getDeletedStudents } from '../utils/deletedStudents';
import { updateStudentEmail, deleteStudentsPermanently, sendNotification } from '../utils/adminApi';
import {
  SURVEY_QUESTIONS,
  SURVEY_TOTAL,
  answerLabel,
  answeredCount,
  isSurveyComplete
} from '../data/surveyQuestions';
import { CERTIFICATE_COURSES, getCertificateCourse } from '../utils/certificateExport';
import { COURSE_MODULES } from '../data/courseData';
import { TRADE_MODULES } from '../data/tradeCourseData';
import {
  ROOT_ADMIN_PROFILES,
  normalizeEmail,
  isRootAdmin,
  getAccountRole,
  isAdminAccount,
  grantAdmin,
  revokeAdmin,
  canDeleteAccount,
  replaceAdminCache
} from '../utils/adminRoles';
import { 
  X, 
  Users, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  CheckCircle2, 
  Award, 
  Eye, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  Briefcase, 
  FileSpreadsheet,
  TrendingUp,
  Upload,
  PlusCircle,
  FileText,
  Sparkles,
  UserPlus,
  FileCheck,
  Crown,
  KeyRound,
  UserMinus,
  Lock,
  ClipboardList,
  Mail,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';

/** Bản khảo sát của một dòng học viên. Hồ sơ cũ chưa có trường này. */
const surveyOf = (std) => (std && typeof std.survey === 'object' ? std.survey : null);

/** Học viên này đã trả lời xong khảo sát chưa. */
const hasSurvey = (std) => {
  const s = surveyOf(std);
  return Boolean(s && s.completedAt && isSurveyComplete(s.answers));
};

/**
 * Tài khoản Quản Trị Tối Cao phải LUÔN có mặt trong bảng.
 *
 * Bản ghi thật của nó chỉ sinh ra sau lần đăng nhập đầu tiên trên từng máy, và
 * `filterDeleted` có thể loại nó đi nếu ai đó từng bấm xoá ở bản cũ. Không hiển
 * thị thì quản trị viên không thấy được ai đang giữ quyền cao nhất — mà đó
 * chính là dòng không được phép biến mất.
 */
const withRootAdmins = (list) => {
  const rows = Array.isArray(list) ? [...list] : [];
  ROOT_ADMIN_PROFILES.forEach((profile) => {
    const at = rows.findIndex((s) => normalizeEmail(s?.email) === normalizeEmail(profile.email));
    if (at >= 0) {
      // Dữ liệu thật thắng hồ sơ mặc định, nhưng vai trò thì không được phép đè.
      rows[at] = { ...profile, ...rows[at], role: 'admin' };
    } else {
      rows.unshift({ ...profile });
    }
  });
  return rows;
};

/**
 * Các khoá học có thể cấp bằng.
 *
 * Đọc thẳng từ cấu hình bằng (`utils/certificateExport`) chứ không liệt kê lại
 * ở đây: thêm khoá mới vào cấu hình đó là danh sách này tự có, không phải nhớ
 * sửa hai chỗ rồi quên mất một chỗ.
 */
const CERT_COURSE_OPTIONS = Object.values(CERTIFICATE_COURSES);

/** Id toàn bộ chuyên đề của một khoá — dùng để đánh dấu học viên đã hoàn tất. */
const moduleIdsOf = (courseKey) =>
  (courseKey === 'trade' ? TRADE_MODULES : COURSE_MODULES).map((m) => m.id);

/**
 * Trường tiến độ tương ứng trên hồ sơ học viên.
 *
 * Hai khoá đếm trên hai trường tách biệt (xem App.jsx). Cấp bằng Trade mà ghi
 * vào `completedModules` sẽ khiến học viên bỗng dưng "tốt nghiệp" khoá chính.
 */
const progressFieldOf = (courseKey) =>
  courseKey === 'trade' ? 'completedTradeModules' : 'completedModules';

/** Thứ tự hiển thị: quyền cao nhất lên đầu bảng. */
const ROLE_ORDER = { root: 0, admin: 1, student: 2 };

const ROLE_LABEL = {
  root: 'Quản Trị Tối Cao',
  admin: 'Quản Trị Viên',
  student: 'Học viên'
};

function RoleBadge({ role }) {
  if (role === 'root') {
    return (
      <span
        className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[10px] font-black inline-flex items-center gap-1 whitespace-nowrap"
        title="Quyền quản trị cao nhất — không tài khoản nào được phép thu hồi hay xoá"
      >
        <Crown className="w-3 h-3" /> Quản Trị Tối Cao
      </span>
    );
  }
  if (role === 'admin') {
    return (
      <span
        className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[10px] font-black inline-flex items-center gap-1 whitespace-nowrap"
        title="Quản trị viên — có thể thu hồi quyền"
      >
        <ShieldCheck className="w-3 h-3" /> Quản Trị Viên
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold whitespace-nowrap">
      Học viên
    </span>
  );
}

export default function AdminDashboardModal({
  isOpen,
  onClose,
  currentUser,
  trafficStats,
  onIssueCertificateForStudent,
  t
}) {
  const [students, setStudents] = useState([]);

  /* --- Chọn hàng loạt ---
     Lưu theo EMAIL chứ không theo `id`. Cùng một học viên có thể mang hai id
     khác nhau tuỳ nguồn dữ liệu (uid của Firebase Auth, hay mã suy ra từ
     email), còn email thì luôn là một — và cũng chính là thứ hàm máy chủ nhận
     vào để xoá. Chọn theo id sẽ có lúc chọn một người mà xoá trượt. */
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [isBulkWorking, setIsBulkWorking] = useState(false);

  /* --- Đổi email học viên --- */
  const [editingEmailFor, setEditingEmailFor] = useState(null);
  const [newEmailValue, setNewEmailValue] = useState('');
  const [isSavingEmail, setIsSavingEmail] = useState(false);

  /* --- Gửi thư thông báo --- */
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifyScope, setNotifyScope] = useState('selected'); // 'selected' | 'filtered'
  const [notifySubject, setNotifySubject] = useState('');
  const [notifyMessage, setNotifyMessage] = useState('');
  const [notifySending, setNotifySending] = useState(false);
  const [notifyProgress, setNotifyProgress] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL'); // 'ALL' | 'ADMIN' | 'STUDENT'
  const [selectedSurvey, setSelectedSurvey] = useState('ALL'); // 'ALL' | 'DONE' | 'MISSING'
  // Học viên đang xem chi tiết khảo sát. Một khung riêng chứ không nhồi 5 câu
  // trả lời vào bảng: mỗi câu là một dòng dài, dựng thẳng vào bảng sẽ đẩy các
  // cột thao tác ra khỏi tầm nhìn.
  const [surveyDetailStudent, setSurveyDetailStudent] = useState(null);

  // Sổ phân quyền đọc từ Firestore. `null` = chưa đọc được (mất mạng hoặc chưa
  // deploy rules) -> rơi về bộ nhớ đệm tại máy, và hiện cảnh báo cho quản trị
  // viên biết là đang xem dữ liệu cũ.
  const [adminRoster, setAdminRoster] = useState(null);

  // Kết quả chẩn đoán kết nối Cloud. null = chưa chạy.
  const [cloudCheck, setCloudCheck] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const runCloudCheck = async () => {
    setIsChecking(true);
    try {
      setCloudCheck(await diagnoseCloudAccess());
    } catch (e) {
      setCloudCheck([{ label: 'Chẩn đoán thất bại', ok: false, detail: e.message }]);
    }
    setIsChecking(false);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState('');

  // Pagination State (20 to 50 students / page)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // 20, 30, 50, or 'ALL'

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedIndustry, selectedRole, pageSize]);

  // Khoá học đang được chọn để cấp bằng.
  //
  // MỘT state duy nhất cho cả nút "Cấp Bằng" từng dòng lẫn form tạo bằng thủ
  // công/hàng loạt. Tách làm hai lựa chọn riêng sẽ sinh ra tình huống chọn một
  // đằng cấp một nẻo mà không ai nhận ra.
  const [certCourse, setCertCourse] = useState('main');
  const certCourseInfo = getCertificateCourse(certCourse);

  // Certificate Generator Modal state
  const [isCertGenOpen, setIsCertGenOpen] = useState(false);
  const [certGenTab, setCertGenTab] = useState('manual'); // 'manual', 'excel'
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualIndustry, setManualIndustry] = useState('Digital Marketing');
  const [excelParsedStudents, setExcelParsedStudents] = useState([]);
  const [rawPastedText, setRawPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Default seed sample data if empty
  const SAMPLE_STUDENTS = [
    {
      id: 'student-real-cambinh',
      name: 'ĐẶNG THỊ CẨM BÌNH',
      phone: '0901234567',
      email: 'binh.dang@cbcentres.com',
      industry: 'Giáo Dục & Đào Tạo',
      completedModules: ['module-01', 'module-02', 'module-03', 'module-04', 'module-05', 'module-06', 'module-07', 'module-08', 'module-09', 'module-10', 'module-11'],
      createdAt: '2026-07-26'
    },
    {
      id: 'student-demo-02',
      name: 'TRAN THI B',
      phone: '0988765432',
      email: 'tranthib@gmail.com',
      industry: 'Thương Mại Điện Tử & Bán Lẻ (E-Commerce)',
      completedModules: ['module-01', 'module-02', 'module-03', 'module-04', 'module-05'],
      createdAt: '2026-07-26'
    },
    {
      id: 'student-demo-03',
      name: 'LE HOANG C',
      phone: '0912345678',
      email: 'lehoangc@spa-beauty.vn',
      industry: 'Dịch Vụ & Spa - Thẩm Mỹ Viện',
      completedModules: ['module-01', 'module-02', 'module-03'],
      createdAt: '2026-07-26'
    },
    {
      id: 'student-demo-04',
      name: 'PHAM MINH D',
      phone: '0933456789',
      email: 'minhd.pham@fnb-group.com',
      industry: 'F&B - Nông Sản - Thực Phẩm',
      completedModules: ['module-01', 'module-02', 'module-03', 'module-04', 'module-05', 'module-06', 'module-07', 'module-08'],
      createdAt: '2026-07-26'
    }
  ];

  const loadStudentsList = async () => {
    setIsLoading(true);
    let list = [];

    // 1. Read from localStorage cache
    try {
      const localUsers = localStorage.getItem('dmm_users_db');
      if (localUsers) {
        list = JSON.parse(localUsers);
      }
    } catch (e) {}

    // 2. Fetch from Firebase Cloud Firestore
    try {
      const cloudList = await getAllRegisteredStudentsFromCloud();
      const emailMap = new Map();

      [...SAMPLE_STUDENTS, ...list, ...(cloudList || [])].forEach(item => {
        if (item && item.email) {
          const emailKey = item.email.toLowerCase();
          const existing = emailMap.get(emailKey);
          emailMap.set(emailKey, {
            ...existing,
            ...item,
            id: item.id || existing?.id || `user-${Date.now()}`,
            name: item.name || item.studentName || existing?.name || item.email.split('@')[0].toUpperCase(),
            phone: item.phone || existing?.phone || 'Chưa cập nhật',
            industry: item.industry || existing?.industry || 'Bất Động Sản',
            completedModules: Array.isArray(item.completedModules) ? item.completedModules : (item.completedCount ? Array(item.completedCount).fill(1) : (existing?.completedModules || [])),
            createdAt: item.createdAt ? (typeof item.createdAt === 'string' ? item.createdAt : new Date(item.createdAt).toLocaleDateString('vi-VN')) : (existing?.createdAt || new Date().toLocaleDateString('vi-VN'))
          });
        }
      });

      list = filterDeleted(Array.from(emailMap.values()));
    } catch (e) {
      console.warn("Error loading students list:", e);
    }

    // Chỉ mồi dữ liệu mẫu khi CHƯA từng xoá ai. Nếu quản trị viên đã xoá sạch
    // thì danh sách rỗng là đúng ý họ, không được mồi lại.
    if (list.length === 0 && getDeletedStudents().length === 0) {
      list = SAMPLE_STUDENTS;
    }

    setStudents(withRootAdmins(list));
    setIsLoading(false);
  };

  /** Đọc sổ phân quyền từ máy chủ và đồng bộ lại bộ nhớ đệm tại máy. */
  const loadAdminRoster = async () => {
    const emails = await fetchAdminRosterFromCloud();
    if (Array.isArray(emails)) {
      setAdminRoster(new Set(emails.map(normalizeEmail).filter(Boolean)));
      replaceAdminCache(emails);
    } else {
      setAdminRoster(null);
    }
  };

  /**
   * Đối soát số liệu công khai bằng con số đếm trên máy chủ.
   *
   * Bảng Quản Trị là nơi duy nhất đọc được toàn bộ collection `students`, nên
   * cũng là nơi duy nhất biết con số thật. Mỗi lần mở bảng là một lần sửa lại
   * bộ đếm đã trôi.
   *
   * Điều kiện bắt buộc: chỉ ghi khi ĐỌC ĐƯỢC máy chủ. `null` nghĩa là không đọc
   * được — ghi tiếp lúc đó sẽ đặt số liệu toàn hệ thống về 0.
   */
  const reconcileStats = async () => {
    const cloudOnly = await fetchStudentsFromCloudOnly();
    if (!Array.isArray(cloudOnly)) return;

    const realStudents = filterDeleted(cloudOnly).filter(s => !isAdminAccount(s, adminRoster));
    const graduates = realStudents.filter(s => (s.completedModules || []).length >= 11).length;

    await reconcileGlobalStats({
      totalEnrolled: realStudents.length,
      totalGraduates: graduates
    });
  };

  useEffect(() => {
    if (isOpen) {
      loadStudentsList();
      loadAdminRoster().then(reconcileStats);

      // Live subscription for all new student registrations on Cloud Firestore
      const unsub = listenToAllStudentsFromCloud((cloudStudents) => {
        if (cloudStudents && cloudStudents.length > 0) {
          setStudents(prev => {
            const emailMap = new Map();
            [...SAMPLE_STUDENTS, ...prev, ...cloudStudents].forEach(item => {
              if (item && item.email) {
                const emailKey = item.email.toLowerCase();
                const existing = emailMap.get(emailKey);
                emailMap.set(emailKey, {
                  ...existing,
                  ...item,
                  id: item.id || existing?.id || `user-${Date.now()}`,
                  name: item.name || item.studentName || existing?.name || item.email.split('@')[0].toUpperCase(),
                  phone: item.phone || existing?.phone || 'Chưa cập nhật',
                  industry: item.industry || existing?.industry || 'Kinh doanh',
                  completedModules: Array.isArray(item.completedModules) ? item.completedModules : (existing?.completedModules || []),
                  createdAt: item.createdAt ? (typeof item.createdAt === 'string' ? item.createdAt : new Date(item.createdAt).toLocaleDateString('vi-VN')) : (existing?.createdAt || new Date().toLocaleDateString('vi-VN'))
                });
              }
            });
            // Lọc bia mộ ở đây nữa, nếu không listener realtime sẽ dựng lại
            // học viên vừa xoá ngay khi Firestore đẩy dữ liệu về.
            return withRootAdmins(filterDeleted(Array.from(emailMap.values())));
          });
        }
      });

      return () => unsub();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Tầng chặn cuối. Kể cả khi isOpen bị bật bằng cách khác (sửa state qua
  // devtools, lỗi truyền props), modal vẫn không được phép hiển thị danh sách
  // học viên cho người không phải quản trị viên.
  if (currentUser?.role !== 'admin') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <div className="w-full max-w-sm glass-panel rounded-3xl border border-rose-500/50 p-7 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center mx-auto text-rose-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-white">Khu vực dành riêng Ban Quản Trị</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tài khoản của bạn không có quyền truy cập Bảng Quản Trị Học Viên.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-emerald-900/60 hover:border-emerald-500 text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  // Filtered Students
  const filteredStudents = students.filter(std => {
    const matchesSearch =
      (std.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (std.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (std.phone || '').includes(searchQuery);

    const matchesIndustry = selectedIndustry === 'ALL' || std.industry === selectedIndustry;

    const role = getAccountRole(std, adminRoster);
    const matchesRole =
      selectedRole === 'ALL' ||
      (selectedRole === 'ADMIN' ? role !== 'student' : role === 'student');

    const matchesSurvey =
      selectedSurvey === 'ALL' ||
      (selectedSurvey === 'DONE' ? hasSurvey(std) : !hasSurvey(std));

    return matchesSearch && matchesIndustry && matchesRole && matchesSurvey;
  });

  // Quyền cao nhất đứng đầu bảng, trong cùng một nhóm thì giữ nguyên thứ tự gốc.
  // Tính hạng trước rồi mới sắp xếp: getAccountRole() đọc localStorage nên gọi
  // nó trong hàm so sánh sẽ thành O(n log n) lượt đọc thay vì đúng n lượt.
  const orderedStudents = filteredStudents
    .map((std, index) => ({ std, index, rank: ROLE_ORDER[getAccountRole(std, adminRoster)] }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((row) => row.std);

  // Pagination Calculations (20 - 50 students / page)
  const effectivePageSize = pageSize === 'ALL' ? (orderedStudents.length || 1) : Number(pageSize);
  const totalPages = Math.ceil(orderedStudents.length / effectivePageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * effectivePageSize;
  const paginatedStudents = pageSize === 'ALL' ? orderedStudents : orderedStudents.slice(startIndex, startIndex + effectivePageSize);

  // Unique Industries List for Filter
  const uniqueIndustries = Array.from(new Set(students.map(s => s.industry).filter(Boolean)));

  // Calculate Statistics
  // Tách tài khoản quản trị ra khỏi số liệu đào tạo: quản trị viên không phải
  // học viên, gộp vào sẽ làm tỷ lệ hoàn thành sai lệch.
  const adminAccounts = students.filter(s => isAdminAccount(s, adminRoster));
  const studentAccounts = students.filter(s => !isAdminAccount(s, adminRoster));
  const totalStudentsCount = studentAccounts.length;
  const totalGraduatesCount = studentAccounts.filter(s => (s.completedModules || []).length >= 11).length;
  const completionRate = totalStudentsCount > 0 ? Math.round((totalGraduatesCount / totalStudentsCount) * 100) : 0;

  const currentUserEmail = normalizeEmail(currentUser?.email);

  // Export CSV Report Function (UTF-8 BOM Encoded for Excel compatibility)
  const handleExportCSV = () => {
    try {
      // Bọc MỌI ô trong dấu nháy kép và nhân đôi nháy có sẵn bên trong, chứ
      // không chỉ bọc những ô "trông có vẻ nguy hiểm". Câu trả lời khảo sát có
      // dấu phẩy sẵn trong nhãn (ví dụ "Facebook, Google, TikTok"), còn ô "Khác"
      // thì học viên gõ gì cũng được — sót một ô là cả dòng lệch cột và bảng
      // báo cáo thành vô dụng mà nhìn qua vẫn thấy bình thường.
      const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

      // Tiêu đề cột khảo sát đọc từ chính bộ câu hỏi, không ghi tay: thêm hay
      // sửa câu hỏi thì tệp xuất tự khớp theo, không phải nhớ sửa hai nơi.
      const headers = [
        "STT",
        "Họ và Tên Học Viên",
        "Số Điện Thoại (Zalo)",
        "Email",
        "Phân Quyền",
        "Ngành Nghề Kinh Doanh",
        `Tiến Độ Khoá Chính (/${COURSE_MODULES.length})`,
        `Tiến Độ Khoá Trade (/${TRADE_MODULES.length})`,
        "Trạng Thái Tốt Nghiệp",
        "Ngày Đăng Ký",
        "Đã Làm Khảo Sát",
        ...SURVEY_QUESTIONS.map((q) => q.csvLabel),
        "Số Lần Bỏ Qua Khảo Sát",
        "Thời Điểm Làm Khảo Sát"
      ];

      // Có chọn thì xuất đúng phần đã chọn, không chọn thì xuất tất cả sau bộ lọc.
      //
      // Giữ thứ tự của `orderedStudents` thay vì thứ tự bấm chọn: quản trị viên
      // nhìn thấy bảng theo thứ tự nào thì tệp xuất ra phải theo thứ tự đó, nếu
      // không sẽ mất công dò từng dòng để đối chiếu.
      const exportSource = selectedEmails.length
        ? orderedStudents.filter((s) => selectedEmails.includes(normalizeEmail(s.email)))
        : orderedStudents;

      const rows = exportSource.map((std, idx) => {
        const survey = surveyOf(std);
        const answers = survey?.answers || {};
        return [
          idx + 1,
          cell(std.name),
          cell(std.phone),
          cell(std.email),
          cell(ROLE_LABEL[getAccountRole(std, adminRoster)]),
          cell(std.industry || 'Kinh doanh'),
          cell(`${(std.completedModules || []).length}/${COURSE_MODULES.length}`),
          cell(`${(std.completedTradeModules || []).length}/${TRADE_MODULES.length}`),
          cell((std.completedModules || []).length >= COURSE_MODULES.length ? "Đã Tốt Nghiệp" : "Đang Học"),
          cell(std.createdAt || new Date().toLocaleDateString('vi-VN')),
          cell(hasSurvey(std) ? 'Rồi' : `Chưa (${answeredCount(answers)}/${SURVEY_TOTAL} câu)`),
          ...SURVEY_QUESTIONS.map((q) => cell(answerLabel(q.id, answers))),
          cell(Number.isFinite(survey?.skips) ? survey.skips : 0),
          cell(survey?.completedAt || '')
        ];
      });

      const csvContent = "\uFEFF" + [headers.map(cell).join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      const today = new Date().toISOString().slice(0, 10);
      link.setAttribute("href", url);
      // Tên tệp nói rõ đây là bản trích chọn, không phải toàn bộ. Hai tệp cùng
      // tên mà nội dung khác nhau là cách nhanh nhất để báo cáo sai số liệu.
      const suffix = selectedEmails.length ? `_Chon_${exportSource.length}_hoc_vien` : '';
      link.setAttribute("download", `Bao_Cao_Hoc_Vien_P_MARCOM_${today}${suffix}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const withSurvey = orderedStudents.filter(hasSurvey).length;
      setNotice(
        `✅ Đã tải về ${orderedStudents.length} học viên · ${headers.length} cột · ` +
        `${withSurvey} bản khảo sát đầy đủ. Mở bằng Excel hoặc Google Sheets.`
      );
      setTimeout(() => setNotice(''), 7000);
    } catch (e) {
      alert("Lỗi xuất file CSV: " + e.message);
    }
  };

  // Print Report Handler
  const handlePrintReport = () => {
    window.print();
  };

  const showNotice = (message, ms = 5000) => {
    setNotice(message);
    setTimeout(() => setNotice(''), ms);
  };

  /** Ghi vai trò mới vào danh sách đang hiển thị để bảng cập nhật ngay. */
  const applyRoleToRow = (email, role) => {
    const key = normalizeEmail(email);
    setStudents(prev => prev.map(s => (normalizeEmail(s.email) === key ? { ...s, role } : s)));
  };

  // Nâng một tài khoản lên Quản Trị Viên
  const handlePromoteToAdmin = async (student) => {
    const email = normalizeEmail(student?.email);
    if (!email) {
      showNotice('⛔ Tài khoản không có email hợp lệ nên không thể nâng quyền.');
      return;
    }

    const confirmed = window.confirm(
      `Nâng quyền QUẢN TRỊ VIÊN cho ${email}?\n\n` +
      `Tài khoản này sẽ xem được toàn bộ danh sách học viên, cấp Bằng Chứng Nhận ` +
      `và nâng quyền cho tài khoản khác.`
    );
    if (!confirmed) return;

    // Máy chủ ghi TRƯỚC. Nếu Firestore Rules từ chối (người bấm không thực sự
    // là quản trị viên), phải dừng ở đây — không được cập nhật giao diện rồi
    // báo thành công cho một thao tác chưa hề xảy ra.
    try {
      await grantAdminInCloud(email, currentUser?.email);
    } catch (err) {
      showNotice(`⛔ Máy chủ từ chối nâng quyền cho ${email}: ${err.message}`, 8000);
      return;
    }

    grantAdmin(email); // bộ nhớ đệm tại máy
    setAdminRoster(prev => new Set([...(prev || []), email]));
    applyRoleToRow(email, 'admin');
    await setStudentRoleInCloud(email, 'admin');
    showNotice(`🔑 Đã nâng ${email} lên Quản Trị Viên. Quyền có hiệu lực ở lần đăng nhập kế tiếp của họ.`, 6000);
  };

  // Thu hồi quyền quản trị
  const handleRevokeAdmin = async (student) => {
    const email = normalizeEmail(student?.email);

    // Chốt chặn thứ nhất, ngay tại giao diện. Chốt chặn thật nằm trong
    // revokeAdmin() — nút này còn không được vẽ ra cho tài khoản gốc.
    if (isRootAdmin(email)) {
      showNotice(`🔒 ${email} là Quản Trị Tối Cao — không tài khoản nào được phép gỡ quyền quản trị cao nhất.`, 6000);
      return;
    }

    // Tự hạ quyền chính mình sẽ đá người đang thao tác ra khỏi bảng này ngay
    // giữa chừng. Bắt phải nhờ một quản trị viên khác làm.
    if (email && email === currentUserEmail) {
      showNotice('⛔ Không thể tự thu hồi quyền của chính mình. Hãy nhờ một quản trị viên khác thực hiện.', 6000);
      return;
    }

    const confirmed = window.confirm(
      `Thu hồi quyền quản trị của ${email}?\n\n` +
      `Tài khoản trở lại vai trò Học viên và mất quyền vào Bảng Quản Trị.`
    );
    if (!confirmed) return;

    // Chốt chặn tại máy, để báo lỗi cho dễ hiểu.
    const result = revokeAdmin(email);
    if (!result.ok) {
      showNotice(`⛔ ${result.message}`, 7000);
      return;
    }

    // Chốt chặn thật nằm ở Firestore Rules: lệnh xoá bản ghi của Quản Trị Tối
    // Cao bị máy chủ từ chối, không phụ thuộc vào việc giao diện có chặn hay không.
    try {
      await revokeAdminInCloud(email);
    } catch (err) {
      grantAdmin(email); // hoàn lại bộ nhớ đệm vì máy chủ không chấp nhận
      showNotice(`⛔ Máy chủ từ chối thu hồi quyền của ${email}: ${err.message}`, 8000);
      return;
    }

    setAdminRoster(prev => {
      if (!prev) return prev;
      const next = new Set(prev);
      next.delete(email);
      return next;
    });
    applyRoleToRow(email, 'student');
    await setStudentRoleInCloud(email, 'student');
    showNotice(`🟡 ${result.message}`);
  };

  // Delete Student Record
  const handleDeleteStudent = async (student) => {
    const studentId = student?.id;
    const studentEmail = student?.email;

    // Không xoá được tài khoản quản trị: Quản Trị Tối Cao thì tuyệt đối, quản
    // trị viên thường thì phải thu hồi quyền trước.
    const permission = canDeleteAccount(student, adminRoster);
    if (!permission.ok) {
      showNotice(`🔒 ${permission.message}`, 6000);
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa học viên ${studentEmail} khỏi hệ thống?`)) return;

    try {
      // 1. Ghi bia mộ TRƯỚC. Đây là bước quyết định: dù kho nào còn sót bản ghi
      //    thì nó cũng bị lọc ra khi tải lại. Cũng là cách duy nhất xoá được
      //    học viên mẫu, vì SAMPLE_STUDENTS luôn được trộn lại mỗi lần tải.
      markStudentDeleted(studentEmail);

      // 2. Xoá khỏi tất cả các kho: Firestore students + registrations,
      //    Realtime DB REST, và localStorage.
      await deleteStudentEverywhere(studentId, studentEmail);

      // 3. Cập nhật giao diện. KHÔNG ghi danh sách hiển thị ngược vào
      //    dmm_users_db nữa: danh sách đó đã trộn cả SAMPLE_STUDENTS nên bản cũ
      //    vô tình ghi luôn học viên mẫu xuống đĩa vĩnh viễn.
      setStudents(students.filter(s => s.id !== studentId && s.email !== studentEmail));

      setNotice(`🟢 Đã xóa thành công học viên ${studentEmail}`);
      setTimeout(() => setNotice(''), 4000);
    } catch (e) {
      alert("Lỗi xóa học viên: " + e.message);
    }
  };

  /* ============================================================
     CHỌN HÀNG LOẠT
     ============================================================ */

  const toggleSelectStudent = (email) => {
    const key = normalizeEmail(email);
    if (!key) return;
    setSelectedEmails((prev) =>
      prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key]
    );
  };

  /**
   * Ô chọn ở đầu bảng: chọn/bỏ chọn TRANG HIỆN TẠI, không phải toàn bộ danh sách.
   *
   * Cố ý giới hạn trong trang đang nhìn thấy. Ô "chọn tất cả" mà quét luôn cả
   * những dòng ở trang sau — thứ quản trị viên chưa hề nhìn qua — là cách dễ
   * nhất để xoá nhầm hàng loạt: người bấm tưởng mình chọn 20 dòng trước mắt,
   * thực ra chọn 300.
   */
  const pageEmails = paginatedStudents.map((s) => normalizeEmail(s.email)).filter(Boolean);
  const allOnPageSelected = pageEmails.length > 0 && pageEmails.every((e) => selectedEmails.includes(e));

  const toggleSelectPage = () => {
    setSelectedEmails((prev) =>
      allOnPageSelected
        ? prev.filter((e) => !pageEmails.includes(e))
        : [...new Set([...prev, ...pageEmails])]
    );
  };

  const selectedStudents = students.filter((s) => selectedEmails.includes(normalizeEmail(s.email)));

  /**
   * Xoá vĩnh viễn các học viên đã chọn.
   *
   * Khác hẳn nút xoá từng dòng: nút này gọi hàm máy chủ nên xoá được CẢ TÀI
   * KHOẢN ĐĂNG NHẬP. Nút xoá cũ chỉ xoá dữ liệu, học viên vẫn đăng nhập lại
   * được và hồ sơ tự sinh lại — xoá mà không xoá.
   */
  const handleBulkDelete = async () => {
    if (!selectedEmails.length) return;

    // Chặn trước ở đây cho thông báo dễ hiểu; máy chủ vẫn có chốt riêng.
    const blocked = selectedStudents.filter((s) => !canDeleteAccount(s, adminRoster).ok);
    if (blocked.length) {
      showNotice(
        `🔒 Trong danh sách đã chọn có ${blocked.length} tài khoản quản trị (${blocked
          .map((s) => s.email)
          .join(', ')}). Thu hồi quyền trước rồi mới xoá được.`,
        8000
      );
      return;
    }

    const names = selectedStudents.slice(0, 5).map((s) => `• ${s.name || s.email} (${s.email})`).join('\n');
    const more = selectedStudents.length > 5 ? `\n… và ${selectedStudents.length - 5} người nữa` : '';

    // Hỏi lại bằng danh sách TÊN THẬT chứ không phải con số.
    //
    // "Xoá 23 học viên?" thì ai cũng bấm OK. Nhìn thấy tên từng người mới là
    // lúc phát hiện mình lỡ chọn nhầm — và đây là thao tác không hoàn tác được.
    const confirmed = window.confirm(
      `XOÁ VĨNH VIỄN ${selectedStudents.length} học viên sau đây?\n\n${names}${more}\n\n` +
        `Sẽ mất: tiến độ học, kết quả trắc nghiệm, khảo sát, lịch sử hỗ trợ và CẢ TÀI KHOẢN ĐĂNG NHẬP.\n` +
        `KHÔNG THỂ HOÀN TÁC.`
    );
    if (!confirmed) return;

    setIsBulkWorking(true);
    const result = await deleteStudentsPermanently(selectedEmails);
    setIsBulkWorking(false);

    const deleted = Array.isArray(result.deleted) ? result.deleted : [];

    // Ghi bia mộ cho từng người đã xoá được. Cần bước này vì danh sách hiển thị
    // còn trộn từ localStorage và học viên mẫu — không đánh dấu thì họ hiện lại
    // ngay lần tải sau.
    deleted.forEach((email) => markStudentDeleted(email));
    if (deleted.length) {
      setStudents((prev) => prev.filter((s) => !deleted.includes(normalizeEmail(s.email))));
    }
    setSelectedEmails(selectedEmails.filter((e) => !deleted.includes(e)));

    showNotice(
      result.ok ? `🟢 ${result.message}` : `⚠️ ${result.message || 'Xoá không thành công.'}`,
      result.ok ? 5000 : 10000
    );
    if (Array.isArray(result.failed) && result.failed.length) {
      console.warn('Các trường hợp xoá lỗi:', result.failed);
    }
  };

  /* ============================================================
     GỬI THƯ THÔNG BÁO
     ============================================================ */

  /**
   * Người nhận, tính theo phạm vi đang chọn.
   *
   * HAI PHẠM VI XỬ LÝ TÀI KHOẢN QUẢN TRỊ KHÁC NHAU, và đây là chỗ đã từng làm
   * sai:
   *
   *   'selected'  -> gửi ĐÚNG những người được tick, kể cả tài khoản quản trị.
   *                  Tick là một hành động có chủ đích; lọc bớt thứ người dùng
   *                  vừa tự tay chọn là làm trái ý họ mà không nói. Đây cũng là
   *                  đường duy nhất để gửi thư thử trước khi phát cho cả lớp.
   *
   *   'filtered'  -> loại tài khoản quản trị. Ở đây người dùng chọn một NHÓM
   *                  chứ không chọn từng người, mà thư viết cho học viên ("bạn
   *                  đang là học viên của Học Viện") nên gửi cho Ban Quản Trị
   *                  vừa vô nghĩa vừa làm lệch số liệu đã gửi.
   *
   * Bản đầu lọc bỏ quản trị viên ở CẢ HAI phạm vi. Hậu quả: tick một tài khoản
   * quản trị thì màn hình báo "Sẽ gửi tới 0 học viên" mà không giải thích gì —
   * người dùng không có cách nào biết mình sai ở đâu.
   *
   * Phạm vi 'filtered' bám theo BỘ LỌC ĐANG HIỂN THỊ chứ không phải toàn bộ kho
   * dữ liệu. Quản trị viên lọc ra "ngành Bất Động Sản, chưa tốt nghiệp" rồi bấm
   * gửi thì phải gửi đúng nhóm đó — gửi cho tất cả là chuyện hoàn toàn khác, và
   * không rút lại được.
   */
  const notifySource = notifyScope === 'selected' ? selectedStudents : orderedStudents;
  const notifyExcludedAdmins =
    notifyScope === 'filtered'
      ? notifySource.filter((s) => getAccountRole(s, adminRoster) !== 'student').length
      : 0;

  const notifyRecipients = notifySource
    .filter((s) => notifyScope === 'selected' || getAccountRole(s, adminRoster) === 'student')
    .map((s) => normalizeEmail(s.email))
    .filter(Boolean);

  const openNotifyComposer = () => {
    setNotifyScope(selectedEmails.length ? 'selected' : 'filtered');
    setNotifySubject('');
    setNotifyMessage('');
    setNotifyProgress(null);
    setIsNotifyOpen(true);
  };

  const handleSendNotification = async () => {
    if (!notifySubject.trim() || !notifyMessage.trim()) {
      showNotice('⚠️ Cần có cả tiêu đề và nội dung thư.', 4000);
      return;
    }
    if (!notifyRecipients.length) {
      showNotice('⚠️ Không có người nhận nào trong phạm vi đã chọn.', 4000);
      return;
    }

    // Hỏi lại kèm CON SỐ THẬT. Thư gửi đi rồi không thu hồi được, và gửi nhầm
    // cho cả trăm học viên là chuyện phải xin lỗi bằng một lá thư nữa.
    if (
      !window.confirm(
        `Gửi thư "${notifySubject.trim()}" tới ${notifyRecipients.length} người?\n\n` +
          `${notifyRecipients.slice(0, 5).map((e) => `• ${e}`).join('\n')}` +
          `${notifyRecipients.length > 5 ? `\n… và ${notifyRecipients.length - 5} người nữa` : ''}\n\n` +
          `Thư đã gửi không thu hồi được.`
      )
    ) {
      return;
    }

    setNotifySending(true);
    setNotifyProgress({ done: 0, total: notifyRecipients.length, sent: 0 });

    const result = await sendNotification({
      subject: notifySubject.trim(),
      message: notifyMessage.trim(),
      emails: notifyRecipients,
      onProgress: setNotifyProgress
    });

    setNotifySending(false);

    if (result.ok) {
      setIsNotifyOpen(false);
      showNotice(`🟢 ${result.message}`, 8000);
    } else {
      showNotice(`⚠️ ${result.message}`, 12000);
    }
  };

  /* ============================================================
     ĐỔI EMAIL HỌC VIÊN
     ============================================================ */

  const openEmailEditor = (student) => {
    setEditingEmailFor(student);
    setNewEmailValue('');
  };

  /**
   * Lưu email mới.
   *
   * Việc nặng nằm ở máy chủ (`api/admin/update-student-email`) vì đổi email kéo
   * theo dời cả hồ sơ, sổ phân quyền và lịch sử hỗ trợ sang mã tài liệu mới —
   * mã đó suy ra từ chính email. Phía này chỉ kiểm tra sơ bộ cho người dùng đỡ
   * mất một vòng mạng.
   */
  const handleSaveNewEmail = async () => {
    const oldEmail = normalizeEmail(editingEmailFor?.email);
    const newEmail = normalizeEmail(newEmailValue);

    if (!newEmail) {
      showNotice('⚠️ Chưa nhập email mới.', 4000);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      showNotice('⚠️ Địa chỉ email mới không hợp lệ.', 4000);
      return;
    }
    if (newEmail === oldEmail) {
      showNotice('⚠️ Email mới trùng email cũ.', 4000);
      return;
    }

    setIsSavingEmail(true);
    const result = await updateStudentEmail(oldEmail, newEmail);
    setIsSavingEmail(false);

    if (result.ok) {
      setStudents((prev) =>
        prev.map((s) => (normalizeEmail(s.email) === oldEmail ? { ...s, email: newEmail } : s))
      );
      setSelectedEmails((prev) => prev.map((e) => (e === oldEmail ? newEmail : e)));
      setEditingEmailFor(null);
      setNewEmailValue('');
      showNotice(`🟢 ${result.message}`, 6000);
    } else {
      showNotice(`⚠️ ${result.message || 'Không đổi được email.'}`, 10000);
    }
  };

  // CSV Text Parsing Helper
  const parseCSVText = (text) => {
    if (!text || !text.trim()) return [];
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    const result = [];

    lines.forEach((line, idx) => {
      // Skip header line if detected
      const lower = line.toLowerCase();
      if (idx === 0 && (lower.includes('họ') || lower.includes('name') || lower.includes('stt') || lower.includes('ho_ten'))) {
        return;
      }

      const parts = line.split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length > 0 && parts[0]) {
        const isFirstNum = /^\d+$/.test(parts[0]) && parts.length > 1;
        const nameIdx = isFirstNum ? 1 : 0;
        const name = parts[nameIdx];
        const phone = parts[nameIdx + 1] || '0901234567';
        const email = parts[nameIdx + 2] || `hocvien.${Date.now()}.${idx}@pmarcom.edu.vn`;
        const industry = parts[nameIdx + 3] || 'Digital Marketing';

        if (name && name.length >= 2) {
          result.push({
            name: name.toUpperCase(),
            phone: phone,
            email: email,
            industry: industry
          });
        }
      }
    });

    return result;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result || '';
      const parsed = parseCSVText(text);
      if (parsed.length > 0) {
        setExcelParsedStudents(parsed);
        setNotice(`📥 Đã đọc thành công ${parsed.length} học viên từ file CSV/Excel!`);
      } else {
        alert("Không thể đọc được danh sách học viên từ file này. Vui lòng kiểm tra định dạng file (CSV/TXT).");
      }
    };
    reader.readAsText(file);
  };

  const handleParseRawText = (text) => {
    setRawPastedText(text);
    const parsed = parseCSVText(text);
    setExcelParsedStudents(parsed);
  };

  const handleDownloadSampleTemplate = () => {
    const sampleCSV = "\uFEFF" + "STT,Ho_Ten,So_Dien_Thoai,Email,Nganh_Nghe\n" +
      "1,LÊ THÀNH PHONG,0901234567,phong.le@pmarcom.edu.vn,Digital Marketing\n" +
      "2,NGUYỄN VĂN A,0987654321,nguyenvana@gmail.com,Bất Động Sản\n" +
      "3,TRẦN THỊ B,0912345678,tranthib@fnb-group.com,F&B - Nông Sản\n";

    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "File_Mau_Import_Cap_Chung_Nhan_P_MARCOM.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateManualCert = async (e) => {
    e.preventDefault();
    if (!manualName.trim()) {
      alert("Vui lòng nhập Họ và Tên học viên.");
      return;
    }

    setIsProcessing(true);
    const nameUpper = manualName.trim().toUpperCase();
    const studentEmail = manualEmail.trim() || `cert.${Date.now()}@pmarcom.edu.vn`;

    // Id chuyên đề đọc từ dữ liệu khoá thật, không liệt kê tay. Danh sách ghi
    // cứng 'module-01'..'module-11' sẽ sai ngay khi khoá học đổi cấu trúc, và
    // hoàn toàn không dùng được cho khoá Trade (id khác hẳn).
    const doneField = progressFieldOf(certCourse);

    const newCertStudent = {
      id: `cert-manual-${Date.now()}`,
      name: nameUpper,
      phone: manualPhone.trim() || '0901234567',
      email: studentEmail,
      industry: manualIndustry || 'Digital Marketing',
      [doneField]: moduleIdsOf(certCourse),
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    // 1. Sync to Cloud Firestore
    await recordStudentAccountToCloud(newCertStudent);

    // 2. Add to local list
    setStudents(prev => [newCertStudent, ...prev]);

    // 3. Reset form
    setManualName('');
    setManualPhone('');
    setManualEmail('');
    setIsProcessing(false);
    setIsCertGenOpen(false);

    setNotice(`🎓 Đã cấp Bằng "${certCourseInfo.title}" cho học viên ${nameUpper}`);

    // 4. Open Certificate viewer — mở đúng bằng của khoá vừa chọn
    if (onIssueCertificateForStudent) {
      onIssueCertificateForStudent(nameUpper, certCourse);
    }
  };

  const handleCreateBulkExcelCerts = async () => {
    if (excelParsedStudents.length === 0) {
      alert("Vui lòng chọn file Excel/CSV hoặc dán danh sách học viên.");
      return;
    }

    setIsProcessing(true);
    const doneField = progressFieldOf(certCourse);
    const allModules = moduleIdsOf(certCourse);

    const createdList = [];
    for (let idx = 0; idx < excelParsedStudents.length; idx++) {
      const std = excelParsedStudents[idx];
      const studentObj = {
        id: `cert-bulk-${Date.now()}-${idx}`,
        name: std.name.toUpperCase(),
        phone: std.phone || '0901234567',
        email: std.email || `bulk.${Date.now()}.${idx}@pmarcom.edu.vn`,
        industry: std.industry || 'Digital Marketing',
        [doneField]: allModules,
        createdAt: new Date().toLocaleDateString('vi-VN')
      };
      await recordStudentAccountToCloud(studentObj);
      createdList.push(studentObj);
    }

    setStudents(prev => [...createdList, ...prev]);
    setNotice(`🎉 Đã cấp Bằng "${certCourseInfo.title}" cho ${createdList.length} học viên từ Excel/CSV!`);
    setIsProcessing(false);
    setExcelParsedStudents([]);
    setRawPastedText('');
    setIsCertGenOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      {/* `dvh` chứ không `vh`: trên trình duyệt điện thoại, `vh` tính theo màn
          hình lúc thanh địa chỉ đã thu lại, nên `94vh` thực tế cao hơn phần
          nhìn thấy được — đáy hộp thoại, tức hàng nút thao tác, nằm khuất dưới
          thanh địa chỉ ngay khi vừa mở. `dvh` bám theo vùng nhìn thấy thật. */}
      <div className="relative w-full max-w-6xl h-[94dvh] max-h-[980px] glass-panel rounded-3xl border border-emerald-500/40 p-3 sm:p-6 shadow-2xl space-y-3.5 my-auto flex flex-col">
        
        {/* Modal Top Bar Header */}
        <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-emerald-900/50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <PMarcomLogo className="w-9 h-9 shrink-0" showText={false} />
            <div className="min-w-0">
              {/* `flex-wrap` + giấu nhãn thứ hai dưới 640px: hai nhãn này cộng
                  lại rộng khoảng 300px, đứng cùng hàng với logo thì đẩy nút
                  Đóng ra khỏi màn hình điện thoại. Nhãn còn lại đã nói đủ đây
                  là khu vực quản trị. */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-black border border-emerald-700 uppercase tracking-wider">
                  ADMIN MASTER DASHBOARD
                </span>
                <span className="hidden sm:inline px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                  🔒 QUẢN TRỊ VIÊN P MARCOM
                </span>
              </div>
              <h2 className="text-sm sm:text-lg font-black text-white tracking-wide mt-0.5">
                BẢNG QUẢN LÝ TÀI KHOẢN & BÁO CÁO HỌC VIÊN
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Đóng bảng quản trị"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Alert Banner */}
        {notice && (
          <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center justify-between shrink-0">
            <span>{notice}</span>
            <button onClick={() => setNotice('')} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Dashboard Overview Metric Cards (Compact) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
          <div className="p-2.5 rounded-xl glass-panel border border-emerald-800/60 space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Tổng Học Viên</span>
              <Users className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-lg sm:text-xl font-black text-white">{totalStudentsCount}</p>
            {/* Số THẬT, khớp đúng số dòng trong bảng bên dưới. Trang công khai
                hiển thị con số này cộng mốc khởi điểm, nên hai nơi lệch nhau
                đúng bằng mốc — ghi rõ ra để khỏi tưởng là lỗi. */}
            <p className="text-[9px] text-emerald-400 font-semibold">
              Số thật · trang chủ hiện {(ENROLLED_BASELINE + totalStudentsCount).toLocaleString('vi-VN')} (gồm mốc {ENROLLED_BASELINE})
            </p>
            <p className="text-[9px] text-amber-400 font-semibold">{adminAccounts.length} quản trị viên</p>
          </div>

          <div className="p-2.5 rounded-xl glass-panel border border-emerald-800/60 space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Đã Tốt Nghiệp</span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-lg sm:text-xl font-black text-amber-300">{totalGraduatesCount}</p>
            <p className="text-[9px] text-amber-400 font-semibold">
              Đạt 11/11 · trang chủ hiện {(GRADUATE_BASELINE + totalGraduatesCount).toLocaleString('vi-VN')} (gồm mốc {GRADUATE_BASELINE})
            </p>
          </div>

          <div className="p-2.5 rounded-xl glass-panel border border-emerald-800/60 space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Tổng Lượt Truy Cập Web</span>
              <Eye className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <p className="text-lg sm:text-xl font-black text-teal-300">
              {(trafficStats?.totalTraffic || 0).toLocaleString('vi-VN')}
            </p>
            <p className="text-[9px] text-teal-400 font-semibold">
              Hôm nay: <strong className="text-teal-200">+{(trafficStats?.todayTraffic || 0).toLocaleString('vi-VN')}</strong> lượt
              <span className="text-slate-500"> · gồm mốc {TRAFFIC_BASELINE}</span>
            </p>
          </div>

          <div className="p-2.5 rounded-xl glass-panel border border-emerald-800/60 space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Tỷ Lệ Hoàn Thành</span>
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="text-lg sm:text-xl font-black text-cyan-300">{completionRate}%</p>
            <p className="text-[9px] text-cyan-400 font-semibold">Tiến độ đào tạo chung</p>
          </div>
        </div>

        {/* Filter Controls & Report Action Buttons Bar */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[180px] sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên, SĐT, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-emerald-900/60 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition"
              />
            </div>

            {/* Role Filter Dropdown */}
            <div className="relative shrink-0">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-slate-900/80 border border-emerald-900/60 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                title="Lọc theo phân quyền tài khoản"
              >
                <option value="ALL">Tất cả Phân Quyền</option>
                <option value="ADMIN">Chỉ Quản Trị Viên ({adminAccounts.length})</option>
                <option value="STUDENT">Chỉ Học Viên ({studentAccounts.length})</option>
              </select>
            </div>

            {/* Lọc theo khảo sát — đây là lối vào việc phân tệp: xem nhóm nào đã
                khai nhu cầu, và ai còn thiếu để nhắc. */}
            <div className="relative shrink-0">
              <select
                value={selectedSurvey}
                onChange={(e) => setSelectedSurvey(e.target.value)}
                className="bg-slate-900/80 border border-emerald-900/60 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                title="Lọc theo tình trạng khảo sát nhu cầu"
              >
                <option value="ALL">Tất cả Khảo Sát</option>
                <option value="DONE">Đã làm khảo sát ({students.filter(hasSurvey).length})</option>
                <option value="MISSING">Chưa làm khảo sát ({students.filter((s) => !hasSurvey(s)).length})</option>
              </select>
            </div>

            {/* Industry Filter Dropdown */}
            <div className="relative shrink-0">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="bg-slate-900/80 border border-emerald-900/60 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tất cả Ngành Nghề</option>
                {uniqueIndustries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Page Size Selector (20 - 50 per page) */}
            <div className="relative shrink-0">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                className="bg-slate-900/80 border border-amber-500/40 text-amber-300 font-bold rounded-xl px-3 py-1.5 text-xs focus:outline-none cursor-pointer"
                title="Chọn số lượng học viên hiển thị trên mỗi trang"
              >
                <option value={20}>20 học viên / trang</option>
                <option value={30}>30 học viên / trang</option>
                <option value={50}>50 học viên / trang</option>
                <option value="ALL">Tất cả ({orderedStudents.length})</option>
              </select>
            </div>
          </div>

          {/* Action Buttons: Export CSV / Print */}
          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-end">
            <button
              onClick={loadStudentsList}
              title="Làm mới danh sách"
              className="p-1.5 rounded-xl bg-slate-900 border border-emerald-800 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={runCloudCheck}
              disabled={isChecking}
              title="Kiểm tra vì sao danh sách không có dữ liệu từ Cloud"
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-700 text-cyan-300 text-xs font-bold hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isChecking ? 'Đang kiểm tra...' : 'Kiểm Tra Cloud'}</span>
            </button>

            {/* Chọn khoá để cấp bằng. Cùng một state với form tạo bằng bên
                trong, nên chọn ở đâu cũng ra một kết quả. */}
            <select
              value={certCourse}
              onChange={(e) => setCertCourse(e.target.value)}
              className="bg-slate-900/80 border border-amber-500/50 text-amber-300 font-bold rounded-xl px-3 py-1.5 text-xs focus:outline-none cursor-pointer shrink-0"
              title="Chọn khoá học để cấp Bằng Chứng Nhận"
            >
              {CERT_COURSE_OPTIONS.map((c) => (
                <option key={c.key} value={c.key}>🎓 {c.title}</option>
              ))}
            </select>

            <button
              onClick={() => setIsCertGenOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black hover:brightness-110 transition flex items-center gap-1.5 cursor-pointer shadow-lg shrink-0"
              title="Tạo thủ công hoặc upload file Excel tạo chứng nhận hàng loạt"
            >
              <Award className="w-3.5 h-3.5 text-slate-950" />
              <span>Tạo Chứng Nhận</span>
            </button>

            <button
              onClick={handlePrintReport}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>In Báo Cáo</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold hover:brightness-110 transition flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Xuất Excel (.CSV)</span>
            </button>
          </div>
        </div>

        {/* Kết quả chẩn đoán kết nối Cloud.
            Hiện nguyên văn mã lỗi Firebase: đây là thứ duy nhất phân biệt được
            "chưa ai đăng ký" với "bị máy chủ từ chối quyền đọc". */}
        {cloudCheck && (
          <div className="shrink-0 rounded-xl bg-slate-950/80 border border-cyan-800/60 p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-cyan-300 uppercase tracking-wide">
                Chẩn đoán kết nối Cloud
              </span>
              <button
                onClick={() => setCloudCheck(null)}
                className="text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {cloudCheck.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px]">
                <span className={step.ok ? 'text-emerald-400' : 'text-rose-400'}>
                  {step.ok ? '✓' : '✕'}
                </span>
                <span className="text-slate-300 font-semibold min-w-[210px]">{step.label}</span>
                <span className={`font-mono ${step.ok ? 'text-slate-400' : 'text-rose-300'}`}>
                  {step.detail}
                </span>
              </div>
            ))}

            {/* Kết luận: chỉ ra đúng bước hỏng đầu tiên và cách xử lý. */}
            {(() => {
              const failed = cloudCheck.find(s => !s.ok);
              if (!failed) {
                return (
                  <p className="text-[11px] text-emerald-300 pt-1 border-t border-emerald-900/50">
                    Đường lên Cloud thông suốt. Nếu danh sách vẫn trống thì đúng là chưa có học viên nào đăng ký thành công trên hệ thống online.
                  </p>
                );
              }
              const hint =
                failed.label === 'Cấu hình Firebase'
                  ? 'Khai báo biến môi trường VITE_FIREBASE_* rồi khởi động lại (local) hoặc redeploy (Vercel). Xem DEPLOYMENT.md.'
                  : failed.label === 'Phiên đăng nhập Firebase Auth'
                  ? 'Bạn đang đăng nhập bằng nhánh dự phòng tại máy, nhánh này KHÔNG cấp quyền quản trị. Phải đăng nhập bằng tài khoản có thật trên Firebase Authentication.'
                  : failed.label === 'Có tên trong sổ phân quyền admins'
                  ? 'Chưa có bản ghi quyền trên máy chủ nên Firestore từ chối cho đọc danh sách. Đăng xuất rồi đăng nhập lại bằng tài khoản Quản Trị Tối Cao để ứng dụng tự mồi sổ admins.'
                  : 'Xem mã lỗi ở trên. `permission-denied` nghĩa là Firestore Rules chặn — thường do tài khoản chưa có trong sổ admins.';
              return (
                <p className="text-[11px] text-amber-300 pt-1 border-t border-amber-900/50">
                  <strong>Hỏng ở bước:</strong> {failed.label}. {hint}
                </p>
              );
            })()}
          </div>
        )}

        {/* Quy tắc phân quyền — nói rõ ngay tại chỗ thao tác để không ai phải
            bấm thử mới biết vì sao nút bị khoá. */}
        <div className="shrink-0 flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2 rounded-xl bg-slate-900/70 border border-amber-500/25 text-[11px] text-slate-300">
          <span className="font-black text-amber-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Quy tắc phân quyền:
          </span>
          <span className="flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-emerald-400" />
            Quản trị viên được <strong className="text-emerald-300">nâng quyền</strong> cho tài khoản khác.
          </span>
          <span className="flex items-center gap-1">
            <Crown className="w-3 h-3 text-amber-400" />
            Tài khoản <strong className="text-amber-300">Quản Trị Tối Cao</strong> không tài khoản nào được phép thu hồi quyền hay xoá.
          </span>
          {adminRoster === null && (
            <span className="flex items-center gap-1 text-orange-300 font-bold">
              <Lock className="w-3 h-3" />
              Chưa đọc được sổ phân quyền trên máy chủ — đang hiển thị theo bộ nhớ đệm tại máy.
            </span>
          )}
        </div>

        {/* Nút gửi thông báo khi CHƯA chọn ai — gửi cho toàn bộ danh sách đang
            lọc. Đặt riêng ở đây vì thanh thao tác hàng loạt chỉ hiện khi có
            dòng được tick, mà gửi thông báo cho cả lớp là việc thường xuyên hơn
            gửi cho vài người được chọn. */}
        {selectedEmails.length === 0 && (
          <div className="flex justify-end">
            <button
              onClick={openNotifyComposer}
              className="px-3.5 py-2 rounded-xl bg-sky-700 hover:brightness-110 text-white text-xs font-black flex items-center gap-2 transition cursor-pointer shadow"
              title="Soạn và gửi thư thông báo cho học viên"
            >
              <Mail className="w-4 h-4" />
              <span>Gửi Thông Báo Cho Học Viên</span>
            </button>
          </div>
        )}

        {/* Thanh thao tác hàng loạt.
            Chỉ hiện khi thật sự có dòng được chọn — luôn hiện thì nó chiếm chỗ
            và nhờn mắt, tới lúc cần thì không ai để ý nữa. */}
        {selectedEmails.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/50">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Đã chọn {selectedEmails.length} học viên</span>
              <button
                onClick={() => setSelectedEmails([])}
                className="ml-1 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 hover:text-white text-[10px] font-bold transition cursor-pointer"
              >
                Bỏ chọn hết
              </button>
            </div>

            {/* `flex-wrap`: ba nút này cộng lại rộng khoảng 420px, quá khổ với
                màn hình điện thoại. Không cho xuống dòng thì nút "Xoá vĩnh
                viễn" — nút nguy hiểm nhất bảng — bị cắt mất một nửa. */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportCSV}
                disabled={isBulkWorking}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:brightness-110 text-white text-[11px] font-black flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất {selectedEmails.length} học viên đã chọn</span>
              </button>

              <button
                onClick={openNotifyComposer}
                disabled={isBulkWorking}
                className="px-3 py-1.5 rounded-xl bg-sky-700 hover:brightness-110 text-white text-[11px] font-black flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Gửi thông báo</span>
              </button>

              <button
                onClick={handleBulkDelete}
                disabled={isBulkWorking}
                className="px-3 py-1.5 rounded-xl bg-rose-900/80 border border-rose-600 hover:bg-rose-800 text-rose-100 text-[11px] font-black flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60"
                title="Xoá vĩnh viễn, gồm cả tài khoản đăng nhập. Không hoàn tác được."
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isBulkWorking ? 'Đang xoá...' : `Xoá vĩnh viễn ${selectedEmails.length}`}</span>
              </button>
            </div>
          </div>
        )}

        {/* Student Accounts Table View (Expanded Vertical Space)

            `overflow-auto` chứ không `overflow-y-auto`: bảng bên trong rộng tối
            thiểu 900px (11 cột, không cột nào bỏ được), nên trên điện thoại nó
            thừa ra hơn 500px. Chỉ cho cuộn dọc thì phần thừa đó không cuộn tới
            được — quản trị viên nhìn thấy đúng cột Tên và Số Điện Thoại, còn
            Phân Quyền, Tiến Độ và cả cột Thao Tác thì nằm ngoài màn hình vĩnh
            viễn. Không có thanh cuộn nào chỉ ra điều đó, vì body đặt
            `overflow-x: hidden`.

            `min-h` hạ xuống trên màn nhỏ: 460px là gần trọn chiều cao một màn
            hình điện thoại. Ép sàn cao như vậy trong khung `h-[94dvh]` thì các
            hàng phía trên (bốn thẻ số liệu, ô lọc, hàng nút) bị đẩy ra ngoài. */}
        <div className="flex-1 min-h-[220px] sm:min-h-[460px] overflow-auto overscroll-contain rounded-2xl border border-emerald-900/50 glass-panel">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-900/90 text-emerald-400 text-[11px] font-extrabold uppercase tracking-wider border-b border-emerald-900/50 sticky top-0 backdrop-blur-md z-10">
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleSelectPage}
                    className="w-4 h-4 rounded border-emerald-700 bg-slate-900 accent-emerald-500 cursor-pointer align-middle"
                    title="Chọn / bỏ chọn toàn bộ học viên trong trang này"
                  />
                </th>
                <th className="py-2.5 px-3">STT</th>
                <th className="py-2.5 px-3">Họ và Tên Học Viên</th>
                <th className="py-2.5 px-3">Số Điện Thoại</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Phân Quyền</th>
                <th className="py-2.5 px-3">Ngành Nghề</th>
                <th className="py-2.5 px-3 text-center">Tiến Độ (11/11)</th>
                <th className="py-2.5 px-3 text-center">Khảo Sát</th>
                <th className="py-2.5 px-3">Ngày Đăng Ký</th>
                <th className="py-2.5 px-3 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/30 text-xs text-slate-200">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((std, idx) => {
                  const completedCount = (std.completedModules || []).length;
                  const isGraduate = completedCount >= 11;
                  const sttIndex = startIndex + idx + 1;
                  const role = getAccountRole(std, adminRoster);
                  const isSelf = normalizeEmail(std.email) === currentUserEmail;

                  const rowEmail = normalizeEmail(std.email);
                  const isPicked = selectedEmails.includes(rowEmail);

                  return (
                    <tr
                      key={std.id || idx}
                      className={`transition ${isPicked ? 'bg-emerald-950/60' : 'hover:bg-emerald-950/40'}`}
                    >
                      <td className="py-2 px-3">
                        <input
                          type="checkbox"
                          checked={isPicked}
                          onChange={() => toggleSelectStudent(std.email)}
                          className="w-4 h-4 rounded border-emerald-700 bg-slate-900 accent-emerald-500 cursor-pointer align-middle"
                        />
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-400">{sttIndex}</td>
                      <td className="py-2 px-3 font-bold text-white flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 font-extrabold text-[9px] flex items-center justify-center shrink-0 overflow-hidden">
                          {std.avatarUrl ? (
                            <img src={std.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span>{std.name ? std.name.charAt(0) : 'U'}</span>
                          )}
                        </div>
                        <span>{std.name}</span>
                      </td>
                      <td className="py-2 px-3 font-mono text-emerald-300">{std.phone || '0901234567'}</td>
                      <td className="py-2 px-3 font-mono text-slate-300">{std.email}</td>
                      <td className="py-2 px-3">
                        <RoleBadge role={role} />
                      </td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-300 font-medium">
                          {std.industry || 'Bất Động Sản'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          isGraduate 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {isGraduate ? '🎓 Tốt nghiệp (11/11)' : `${completedCount}/11 Chuyên đề`}
                        </span>
                      </td>
                      {/* Khảo sát: bấm vào là mở đủ 5 câu trả lời. Bản chưa đầy
                          đủ vẫn xem được — dở dang cũng là dữ liệu, và biết học
                          viên dừng ở câu nào còn nói lên điều gì đó. */}
                      <td className="py-2 px-3 text-center">
                        {(() => {
                          const done = hasSurvey(std);
                          const answered = answeredCount(surveyOf(std)?.answers);
                          if (!done && answered === 0) {
                            return <span className="text-[10px] text-slate-500 font-semibold">— Chưa làm</span>;
                          }
                          return (
                            <button
                              onClick={() => setSurveyDetailStudent(std)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border transition cursor-pointer inline-flex items-center gap-1 ${
                                done
                                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:brightness-125'
                                  : 'bg-orange-500/20 text-orange-300 border-orange-500/40 hover:brightness-125'
                              }`}
                              title="Xem câu trả lời khảo sát của học viên này"
                            >
                              <ClipboardList className="w-3 h-3" />
                              {done ? 'Xem trả lời' : `Dở dang ${answered}/${SURVEY_TOTAL}`}
                            </button>
                          );
                        })()}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-400 text-[11px]">{std.createdAt || '2026-07-26'}</td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onIssueCertificateForStudent && onIssueCertificateForStudent(std.name, certCourse)}
                            className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/60 text-amber-300 hover:brightness-125 text-[10px] font-black flex items-center gap-1 transition cursor-pointer shadow-md"
                            title={`Cấp Bằng "${certCourseInfo.title}" cho học viên này`}
                          >
                            <Award className="w-3 h-3 text-amber-400" />
                            <span>Cấp Bằng</span>
                          </button>

                          {/* Phân quyền.
                              Tài khoản Quản Trị Tối Cao KHÔNG có nút thu hồi —
                              không vẽ ra chứ không phải vẽ rồi chặn. */}
                          {role === 'root' ? (
                            <span
                              className="px-2 py-0.5 rounded-lg bg-slate-900 border border-amber-600/50 text-amber-400/90 text-[10px] font-black flex items-center gap-1 cursor-not-allowed"
                              title="Quyền quản trị cao nhất được khoá vĩnh viễn: không tài khoản nào thu hồi hay xoá được"
                            >
                              <Lock className="w-3 h-3" />
                              <span>Khoá quyền</span>
                            </span>
                          ) : role === 'admin' ? (
                            <button
                              onClick={() => handleRevokeAdmin(std)}
                              disabled={isSelf}
                              className={`px-2 py-0.5 rounded-lg border text-[10px] font-black flex items-center gap-1 transition ${
                                isSelf
                                  ? 'bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed'
                                  : 'bg-orange-950/60 border-orange-700 text-orange-300 hover:bg-orange-900 cursor-pointer'
                              }`}
                              title={isSelf
                                ? 'Không thể tự thu hồi quyền của chính mình'
                                : 'Thu hồi quyền quản trị, đưa về vai trò Học viên'}
                            >
                              <UserMinus className="w-3 h-3" />
                              <span>Thu Hồi Quyền</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePromoteToAdmin(std)}
                              className="px-2 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-600 text-emerald-300 hover:bg-emerald-900 text-[10px] font-black flex items-center gap-1 transition cursor-pointer"
                              title="Nâng tài khoản này lên Quản Trị Viên"
                            >
                              <KeyRound className="w-3 h-3" />
                              <span>Nâng Quyền</span>
                            </button>
                          )}

                          {/* Đổi email — dùng khi học viên gõ sai lúc đăng ký và
                              không còn đăng nhập được để tự sửa. Xác minh danh
                              tính qua số điện thoại trong hồ sơ trước khi đổi. */}
                          <button
                            onClick={() => openEmailEditor(std)}
                            className="p-1.5 rounded-lg bg-sky-950/60 border border-sky-800 text-sky-300 hover:bg-sky-900 transition cursor-pointer"
                            title={`Đổi email đăng nhập của ${std.email}`}
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>

                          {role === 'student' ? (
                            <button
                              onClick={() => handleDeleteStudent(std)}
                              className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900 transition cursor-pointer"
                              title="Xóa tài khoản học viên"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-600 cursor-not-allowed inline-flex"
                              title={role === 'root'
                                ? 'Không thể xoá tài khoản Quản Trị Tối Cao'
                                : 'Thu hồi quyền quản trị trước khi xoá tài khoản này'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="11" className="p-8 text-center text-slate-400 text-xs">
                    Không tìm thấy tài khoản nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Bottom Action & Pagination Bar */}
        <div className="pt-3 border-t border-emerald-900/40 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>
              Hiển thị <strong>{orderedStudents.length > 0 ? startIndex + 1 : 0}</strong> - <strong>{Math.min(startIndex + (pageSize === 'ALL' ? orderedStudents.length : pageSize), orderedStudents.length)}</strong> trong tổng số <strong>{orderedStudents.length}</strong> tài khoản
              {' '}(toàn hệ thống: {totalStudentsCount} học viên + <strong className="text-amber-400">{adminAccounts.length} quản trị viên</strong>)
            </span>
          </div>

          {/* Page Buttons & Navigation Controls */}
          {pageSize !== 'ALL' && totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={safeCurrentPage === 1}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-emerald-900 text-emerald-400 hover:bg-emerald-950 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition"
              >
                ◀ Trang Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-black transition ${
                    safeCurrentPage === pageNum
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-emerald-900/60'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={safeCurrentPage === totalPages}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-emerald-900 text-emerald-400 hover:bg-emerald-950 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition"
              >
                Trang Sau ▶
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Trở Về Trang Chủ
            </button>
          </div>
        </div>

        {/* Certificate Creation Sub-Modal (Manual & Bulk Excel Import) */}
        {isCertGenOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-amber-500/40 p-6 shadow-2xl space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-wider">
                      🎓 TẠO & CẤP BẰNG CHỨNG NHẬN HỌC VIÊN
                    </h3>
                    <p className="text-xs text-slate-400">Tạo cấp bằng thủ công hoặc tải file Excel tạo hàng loạt</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCertGenOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chọn khoá học để cấp bằng.
                  Đặt TRÊN hai tab và trước mọi ô nhập: đây là lựa chọn quyết
                  định tấm bằng in ra tên khoá nào, phải thấy trước khi gõ. */}
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-2">
                <label className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Cấp bằng cho khoá học:
                </label>
                <select
                  value={certCourse}
                  onChange={(e) => setCertCourse(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/50 text-white font-bold rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {CERT_COURSE_OPTIONS.map((c) => (
                    <option key={c.key} value={c.key}>{c.title}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Học viên sẽ được ghi nhận hoàn tất{' '}
                  <strong className="text-emerald-300">
                    {moduleIdsOf(certCourse).length} chuyên đề
                  </strong>{' '}
                  của khoá này. Mỗi khoá có mã xác thực riêng.
                </p>
              </div>

              {/* Sub-Tabs Switcher */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-emerald-900/60 text-xs font-bold">
                <button
                  onClick={() => setCertGenTab('manual')}
                  className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                    certGenTab === 'manual' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4" /> 1. Tạo Thủ Công (1 Học Viên)
                </button>
                <button
                  onClick={() => setCertGenTab('excel')}
                  className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                    certGenTab === 'excel' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" /> 2. Upload Excel / CSV (Hàng Loạt)
                </button>
              </div>

              {/* TAB 1: Manual Certificate Creation */}
              {certGenTab === 'manual' && (
                <form onSubmit={handleCreateManualCert} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Họ và Tên Học Viên (In Bằng): <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      placeholder="Ví dụ: LÊ THÀNH PHONG"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="w-full bg-slate-900 border border-emerald-900/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 uppercase tracking-wide font-bold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Số Điện Thoại (Zalo):</label>
                      <input
                        type="text"
                        placeholder="0901234567"
                        value={manualPhone}
                        onChange={(e) => setManualPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Địa chỉ Email:</label>
                      <input
                        type="email"
                        placeholder="email.hocvien@example.com"
                        value={manualEmail}
                        onChange={(e) => setManualEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Ngành Nghề Kinh Doanh:</label>
                    <input
                      type="text"
                      placeholder="Digital Marketing / Bất Động Sản..."
                      value={manualIndustry}
                      onChange={(e) => setManualIndustry(e.target.value)}
                      className="w-full bg-slate-900 border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-medium space-y-1">
                    <div className="font-bold text-amber-400 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Tự động chứng nhận {moduleIdsOf(certCourse).length}/{moduleIdsOf(certCourse).length} Chuyên đề
                    </div>
                    <p className="text-[11px] opacity-90">
                      Học viên được ghi nhận hoàn tất <strong>{certCourseInfo.title}</strong> và có thể tải chứng nhận sắc nét ngay.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCertGenOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition cursor-pointer"
                    >
                      Hủy Bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:brightness-110 transition shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>{isProcessing ? 'Đang cấp bằng...' : '🎓 Cấp Bằng & Xem Chứng Nhận Ngay'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Bulk Excel / CSV Import */}
              {certGenTab === 'excel' && (
                <div className="space-y-4">
                  
                  {/* File Selector & Sample CSV Download Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-emerald-900/80">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-emerald-400" /> Chọn File Excel / CSV (.csv)
                      </h4>
                      <p className="text-[11px] text-slate-400">File chứa danh sách: Họ Tên, SĐT, Email, Ngành nghề</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadSampleTemplate}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 text-[11px] font-bold hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> File Mẫu CSV
                      </button>

                      <label className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold cursor-pointer transition shadow flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> Chọn File...
                        <input type="file" accept=".csv, .txt, .xlsx" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Or Paste Raw Text Box */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Hoặc Dán Trực Tiếp Cột Excel Vào Đây:</label>
                    <textarea
                      rows="4"
                      placeholder="Dán dữ liệu Excel (Ví dụ: LÊ THÀNH PHONG, 0901234567, phong.le@gmail.com, Digital Marketing)"
                      value={rawPastedText}
                      onChange={(e) => handleParseRawText(e.target.value)}
                      className="w-full bg-slate-900 border border-emerald-900/80 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  {/* Parsed Preview List */}
                  {excelParsedStudents.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                        <span>Danh Sách {excelParsedStudents.length} Học Viên Đã Đọc Từ File:</span>
                        <span className="text-[10px] text-amber-300">Sẵn sàng cấp bằng {certCourseInfo.title}</span>
                      </div>
                      <div className="max-h-36 overflow-y-auto rounded-xl border border-emerald-900/60 bg-slate-950 p-2 space-y-1">
                        {excelParsedStudents.map((std, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-900/60 text-slate-300">
                            <span className="font-bold text-white">{idx + 1}. {std.name}</span>
                            <span className="text-[11px] text-slate-400">{std.phone} • {std.email}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => setIsCertGenOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition cursor-pointer"
                    >
                      Hủy Bỏ
                    </button>
                    <button
                      onClick={handleCreateBulkExcelCerts}
                      disabled={isProcessing || excelParsedStudents.length === 0}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black transition shadow-lg flex items-center gap-2 ${
                        excelParsedStudents.length > 0 
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 cursor-pointer' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isProcessing ? 'Đang xử lý...' : `⚡ Cấp Bằng Hàng Loạt (${excelParsedStudents.length} Học Viên)`}</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

        {/* ===== CHI TIẾT KHẢO SÁT CỦA MỘT HỌC VIÊN ===== */}
        {surveyDetailStudent && (
          <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-4">

              <div className="flex items-start justify-between gap-4 pb-3 border-b border-emerald-900/60">
                <div className="min-w-0">
                  <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 text-[10px] font-black border border-teal-700 uppercase tracking-wider">
                    Khảo sát nhu cầu
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white mt-1 truncate">
                    {surveyDetailStudent.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono truncate">
                    {surveyDetailStudent.email}
                    {surveyDetailStudent.phone ? ` · ${surveyDetailStudent.phone}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => setSurveyDetailStudent(null)}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
                  title="Đóng"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {(() => {
                const survey = surveyOf(surveyDetailStudent);
                const answers = survey?.answers || {};
                return (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className={`px-2.5 py-1 rounded-lg font-black border ${
                        hasSurvey(surveyDetailStudent)
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                          : 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                      }`}>
                        {answeredCount(answers)}/{SURVEY_TOTAL} câu đã trả lời
                      </span>
                      {survey?.completedAt && (
                        <span className="text-slate-400">
                          Hoàn tất: {new Date(survey.completedAt).toLocaleString('vi-VN', { hour12: false })}
                        </span>
                      )}
                      {Number.isFinite(survey?.skips) && survey.skips > 0 && (
                        <span className="text-amber-400 font-semibold">
                          Đã bỏ qua {survey.skips} lần trước khi trả lời
                        </span>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      {SURVEY_QUESTIONS.map((q, i) => {
                        const label = answerLabel(q.id, answers);
                        return (
                          <div
                            key={q.id}
                            className="rounded-2xl border border-emerald-900/60 bg-slate-900/60 p-3.5 space-y-1.5"
                          >
                            <p className="text-[11px] text-slate-400 font-semibold leading-snug">
                              {i + 1}. {q.title}
                            </p>
                            {label ? (
                              <p className="text-xs sm:text-sm font-bold text-emerald-300 leading-relaxed">
                                {label}
                              </p>
                            ) : (
                              <p className="text-xs text-slate-500 italic">Chưa trả lời</p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[10.5px] text-slate-500 leading-relaxed pt-1">
                      Dữ liệu này dùng để phân tệp học viên, phục vụ thiết kế khoá nâng cao "đo ni đóng giày"
                      cho từng nhóm (chuyên viên, quản lý, chủ doanh nghiệp). Tải toàn bộ bằng nút
                      <strong className="text-slate-300"> Xuất CSV </strong> ở thanh công cụ.
                    </p>
                  </>
                );
              })()}

            </div>
          </div>
        )}

        {/* Hộp soạn thư thông báo. */}
        {isNotifyOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-xl glass-panel rounded-3xl border border-sky-500/50 p-6 shadow-2xl space-y-4 my-auto">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-sky-400" /> GỬI THƯ THÔNG BÁO
                </h3>
                <button
                  onClick={() => setIsNotifyOpen(false)}
                  disabled={notifySending}
                  className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 transition cursor-pointer disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chọn người nhận. Hiện luôn CON SỐ THẬT bên cạnh mỗi lựa chọn:
                  "gửi cho tất cả" mà không biết tất cả là bao nhiêu người thì
                  không ai đánh giá được mức độ nghiêm trọng trước khi bấm. */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Gửi cho:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNotifyScope('selected')}
                    disabled={!selectedEmails.length || notifySending}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      notifyScope === 'selected'
                        ? 'bg-sky-600 text-white border-sky-400'
                        : 'bg-slate-900/70 text-slate-300 border-slate-700 hover:border-sky-500'
                    }`}
                  >
                    Học viên đã chọn
                    <span className="block text-[11px] font-semibold opacity-80 mt-0.5">
                      {selectedEmails.length ? `${selectedEmails.length} người được tick` : 'chưa tick ai'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNotifyScope('filtered')}
                    disabled={notifySending}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer disabled:opacity-50 ${
                      notifyScope === 'filtered'
                        ? 'bg-sky-600 text-white border-sky-400'
                        : 'bg-slate-900/70 text-slate-300 border-slate-700 hover:border-sky-500'
                    }`}
                  >
                    Toàn bộ danh sách đang lọc
                    <span className="block text-[11px] font-semibold opacity-80 mt-0.5">
                      theo bộ lọc hiện tại trên bảng
                    </span>
                  </button>
                </div>

                {/* Ô này phải NÓI RA vì sao con số là như vậy.
                    Bản đầu chỉ hiện "Sẽ gửi tới 0 học viên" rồi im lặng, và
                    người dùng tick đúng một người vẫn thấy số 0 mà không có
                    cách nào biết mình sai ở đâu. */}
                <div
                  className={`p-2.5 rounded-xl border text-[11px] leading-relaxed ${
                    notifyRecipients.length
                      ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200'
                      : 'bg-amber-950/60 border-amber-600/60 text-amber-200'
                  }`}
                >
                  {notifyRecipients.length > 0 ? (
                    <>
                      Sẽ gửi tới <strong className="text-white">{notifyRecipients.length} người</strong>.
                      {notifyExcludedAdmins > 0 && (
                        <> Đã loại {notifyExcludedAdmins} tài khoản quản trị khỏi danh sách.</>
                      )}{' '}
                      Người đã bấm huỷ nhận thư thông báo sẽ được máy chủ tự bỏ qua ngay trước khi gửi.
                    </>
                  ) : notifyScope === 'selected' ? (
                    <>Chưa tick học viên nào ở bảng bên dưới. Đóng cửa sổ này, tick người cần gửi rồi mở lại.</>
                  ) : (
                    <>
                      Bộ lọc hiện tại không còn học viên nào
                      {notifyExcludedAdmins > 0 && <> (đã loại {notifyExcludedAdmins} tài khoản quản trị)</>}.
                      Đóng cửa sổ này và nới bộ lọc trên bảng.
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Tiêu đề thư:</label>
                <input
                  type="text"
                  maxLength={150}
                  disabled={notifySending}
                  placeholder="Ví dụ: Mở chuyên đề mới — Quảng cáo TikTok từ 05/08"
                  value={notifySubject}
                  onChange={(e) => setNotifySubject(e.target.value)}
                  className="w-full bg-slate-900/60 border border-sky-900/60 focus:border-sky-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition disabled:opacity-60"
                />
                <p className="text-[10px] text-slate-400">
                  {notifySubject.length}/150 ký tự — hộp thư sẽ cắt bớt nếu dài hơn.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Nội dung:</label>
                <textarea
                  rows={8}
                  disabled={notifySending}
                  placeholder={'Chào bạn,\n\nHọc Viện vừa mở thêm chuyên đề...\n\nTrân trọng,\nBan Quản Trị'}
                  value={notifyMessage}
                  onChange={(e) => setNotifyMessage(e.target.value)}
                  className="w-full bg-slate-900/60 border border-sky-900/60 focus:border-sky-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition resize-y disabled:opacity-60"
                />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Gõ chữ thường, xuống dòng như bình thường. Hệ thống tự dựng khung thư có logo Học Viện,
                  nút vào trang khoá học và đường dẫn huỷ nhận thư.
                </p>
              </div>

              {notifySending && notifyProgress && (
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all"
                      style={{ width: `${Math.round((notifyProgress.done / notifyProgress.total) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-sky-300 font-semibold">
                    Đang gửi {notifyProgress.done}/{notifyProgress.total}... Đừng đóng cửa sổ này.
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setIsNotifyOpen(false)}
                  disabled={notifySending}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSendNotification}
                  disabled={notifySending || !notifyRecipients.length}
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:brightness-110 text-white text-xs font-black transition cursor-pointer disabled:opacity-60"
                >
                  {notifySending ? 'Đang gửi...' : `Gửi cho ${notifyRecipients.length} người`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hộp thoại đổi email học viên.
            Đặt trong lớp phủ riêng, z-index cao hơn Bảng Quản Trị: đây là thao
            tác đổi danh tính đăng nhập, phải buộc người bấm dừng lại đọc chứ
            không lẫn vào giữa bảng. */}
        {editingEmailFor && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="w-full max-w-md glass-panel rounded-3xl border border-sky-500/50 p-6 shadow-2xl space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-sky-400" /> ĐỔI EMAIL HỌC VIÊN
                </h3>
                <button
                  onClick={() => setEditingEmailFor(null)}
                  className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 space-y-1">
                <div className="text-[10px] text-slate-400 font-semibold">Học viên</div>
                <div className="text-xs text-white font-bold">{editingEmailFor.name || '(chưa có tên)'}</div>
                <div className="text-[11px] text-slate-300 font-mono break-all">{editingEmailFor.email}</div>
                <div className="text-[11px] text-emerald-300 font-mono">
                  SĐT: {editingEmailFor.phone || 'chưa có'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-600/50 text-amber-200 text-[11px] leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Gọi điện xác minh trước khi đổi.</strong> Đổi email tức là đổi danh tính đăng nhập —
                  người nắm email mới sẽ vào được tài khoản này cùng toàn bộ tiến độ và quyền nhận Giấy Chứng Nhận.
                  Số điện thoại ở trên chính là để dùng lúc này.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email mới:</label>
                <input
                  type="email"
                  autoFocus
                  placeholder="hocvien@gmail.com"
                  value={newEmailValue}
                  onChange={(e) => setNewEmailValue(e.target.value)}
                  className="w-full bg-slate-900/60 border border-sky-900/60 focus:border-sky-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Hồ sơ, tiến độ học, khảo sát và lịch sử hỗ trợ được dời sang email mới. Học viên đăng nhập
                  bằng địa chỉ mới ngay sau khi lưu.
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setEditingEmailFor(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSaveNewEmail}
                  disabled={isSavingEmail}
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:brightness-110 text-white text-xs font-black transition cursor-pointer disabled:opacity-60"
                >
                  {isSavingEmail ? 'Đang lưu...' : 'Xác nhận đổi email'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
