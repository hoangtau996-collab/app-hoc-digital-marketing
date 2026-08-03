import React, { useState } from 'react';
import PMarcomLogo from './PMarcomLogo';
import { createCredential, verifyCredential, upgradeRecord } from '../utils/localCredentials';
import { isRootAdmin } from '../utils/adminRoles';
import { INDUSTRY_OPTIONS } from '../utils/industryOptions';
import { requestPasswordReset } from '../utils/requestPasswordReset';
import { sendWelcomeEmail } from '../utils/studentEmail';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  saveUserProgressToCloud,
  recordStudentAccountToCloud,
  recordRealStudentEnrollment,
  isFirebaseConfigured,
  missingFirebaseEnv,
  signInWithGoogle,
  isInAppBrowser
} from '../firebase';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone,
  Briefcase,
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Home,
  Eye,
  EyeOff
} from 'lucide-react';

// Tài khoản dùng thử của bản demo trước đây - đã ngừng hoạt động, không cho đăng nhập nữa.
const BLOCKED_DEMO_EMAILS = ['hocvien@pmarcom.edu.vn'];

const isBlockedDemoAccount = (mail) =>
  BLOCKED_DEMO_EMAILS.includes(String(mail || '').trim().toLowerCase());

/**
 * Máy nào đã từng chạy bản cũ vẫn còn tài khoản dùng thử (kèm mật khẩu) nằm
 * trong localStorage. Dọn ngay khi mở form đăng nhập, không đợi tới lúc có
 * người bấm đăng nhập.
 */
const purgeDemoAccountsFromStorage = () => {
  try {
    const saved = localStorage.getItem('dmm_users_db');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((u) => !isBlockedDemoAccount(u?.email));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('dmm_users_db', JSON.stringify(cleaned));
        }
      }
    }
    // Đừng tự điền lại email dùng thử vào ô đăng nhập.
    if (isBlockedDemoAccount(localStorage.getItem('dmm_remembered_email'))) {
      localStorage.removeItem('dmm_remembered_email');
    }
  } catch (e) {}
};

/**
 * Diễn giải mã lỗi của Firebase Auth thành câu nói đúng nguyên nhân.
 *
 * Vì sao cần: trước đây MỌI thất bại đăng nhập đều hiện chung một câu "Email
 * hoặc mật khẩu không chính xác" — kể cả khi nguyên nhân là thiếu biến môi
 * trường Firebase, chưa bật phương thức Email/Password, hay mất mạng. Người
 * dùng gõ lại mật khẩu mười lần cũng không qua được, vì mật khẩu chưa bao giờ
 * là vấn đề. Thông báo sai nguyên nhân còn tốn thời gian hơn là không có
 * thông báo.
 */
const describeAuthError = (err) => {
  const code = String(err?.code || '');

  // So khớp theo TIỀN TỐ chứ không khớp chính xác. Firebase gắn thêm đuôi mô tả
  // vào mã lỗi — mã thật trả về là
  // `auth/api-key-not-valid.-please-pass-a-valid-api-key.` — nên `switch` khớp
  // chính xác trượt hết và rơi về nhánh mặc định.
  const is = (...prefixes) => prefixes.some((p) => code.startsWith(p));

  if (is('auth/api-key-not-valid', 'auth/invalid-api-key', 'auth/configuration-not-found')) {
    return `Ứng dụng chưa được cấu hình Firebase${
      missingFirebaseEnv.length ? ` — thiếu: ${missingFirebaseEnv.join(', ')}` : ''
    }. Đây là lỗi cài đặt, KHÔNG phải do mật khẩu. Xem DEPLOYMENT.md.`;
  }
  if (is('auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found')) {
    return 'Email hoặc mật khẩu không đúng. Nếu chưa có tài khoản, hãy chuyển sang tab "Đăng Ký Mới".';
  }
  if (is('auth/invalid-email')) return 'Địa chỉ email không hợp lệ.';
  if (is('auth/user-disabled')) return 'Tài khoản này đã bị vô hiệu hoá trên Firebase.';
  if (is('auth/too-many-requests')) {
    return 'Đăng nhập sai quá nhiều lần nên Firebase tạm khoá. Chờ vài phút rồi thử lại.';
  }
  if (is('auth/network-request-failed')) {
    return 'Không kết nối được máy chủ Firebase. Kiểm tra đường truyền rồi thử lại.';
  }
  if (is('auth/operation-not-allowed')) {
    return 'Phương thức Email/Password chưa được bật: Firebase Console → Authentication → Sign-in method.';
  }

  return code
    ? `Không đăng nhập được. Firebase báo: ${code}`
    : 'Không đăng nhập được. Vui lòng thử lại.';
};

/**
 * Diễn giải lỗi RIÊNG của luồng đăng nhập bằng Google.
 *
 * Tách khỏi describeAuthError vì cùng một mã lỗi mang nghĩa khác nhau ở hai
 * luồng: `auth/operation-not-allowed` ở luồng mật khẩu nghĩa là chưa bật
 * Email/Password, còn ở đây nghĩa là chưa bật provider Google — chỉ đúng một
 * câu, và câu sai thì người quản trị đi tìm nhầm chỗ trong Console.
 */
const describeGoogleError = (code) => {
  const is = (...prefixes) => prefixes.some((p) => String(code || '').startsWith(p));

  if (is('auth/popup-closed-by-user', 'auth/user-cancelled')) {
    return 'Bạn đã đóng cửa sổ Google trước khi chọn xong tài khoản. Bấm lại để thử tiếp.';
  }
  if (is('auth/cancelled-popup-request')) {
    return 'Bạn bấm hai lần liên tiếp nên lần trước bị huỷ. Bấm lại một lần nữa nhé.';
  }
  if (is('auth/operation-not-allowed')) {
    return 'Đăng nhập bằng Google chưa được bật cho ứng dụng: Firebase Console → Authentication → Sign-in method → Google. Đây là lỗi cài đặt, không phải do tài khoản của bạn.';
  }
  if (is('auth/unauthorized-domain')) {
    return 'Tên miền của trang này chưa được khai báo trong Firebase Console → Authentication → Settings → Authorized domains. Đây là lỗi cài đặt, không phải do tài khoản của bạn.';
  }
  if (is('auth/account-exists-with-different-credential')) {
    return 'Email này đã có tài khoản đăng ký bằng mật khẩu. Vui lòng đăng nhập bằng Email + Mật khẩu như trước.';
  }
  if (is('auth/network-request-failed')) {
    return 'Không kết nối được máy chủ Google. Kiểm tra đường truyền rồi thử lại.';
  }
  if (is('auth/popup-blocked')) {
    return 'Trình duyệt đang chặn cửa sổ đăng nhập Google. Cho phép pop-up cho trang này rồi thử lại, hoặc mở trang bằng Chrome/Safari.';
  }
  if (is('auth/internal-error')) {
    return 'Google trả về lỗi nội bộ. Thử lại sau ít phút; nếu vẫn vậy, vui lòng báo Ban Quản Trị.';
  }
  return code
    ? `Không đăng nhập được bằng Google. Mã lỗi: ${code}`
    : 'Không đăng nhập được bằng Google. Vui lòng thử lại.';
};

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onReturnHome,
  googleErrorCode,
  t
}) {
  const textDict = t || {
    authTitleRegister: "ĐĂNG KÝ TÀI KHOẢN HỌC VIÊN",
    authTitleLogin: "ĐĂNG NHẬP HỌC VIÊN",
    authSubtitle: "Đăng ký tài khoản để tham gia học 11 chuyên đề & nhận Giấy Chứng Nhận",
    tabRegister: "1. Đăng Ký Mới",
    tabLogin: "2. Đăng Nhập",
    labelFullName: "Họ và Tên Học Viên:",
    labelPhone: "Số Điện Thoại (Zalo):",
    labelIndustry: "Ngành Nghề Kinh Doanh:",
    labelEmail: "Địa chỉ Email:",
    labelPassword: "Mật khẩu bảo mật:",
    rememberMeLabel: "Ghi nhớ đăng nhập trên thiết bị này",
    btnRegisterSubmit: "HOÀN TẤT ĐĂNG KÝ HỌC VIÊN",
    btnLoginSubmit: "XÁC NHẬN ĐĂNG NHẬP",
    btnReturnHome: "Trở Về Trang Chủ (Xem Tổng Quan)"
  };

  const [mode, setMode] = useState('register'); // 'register', 'login'
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [industry, setIndustry] = useState(INDUSTRY_OPTIONS[0]);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Pre-fill remembered login email if stored
  React.useEffect(() => {
    if (isOpen) {
      purgeDemoAccountsFromStorage();
      // Lỗi của lần đăng nhập Google bằng cách chuyển trang: App.jsx nhặt được
      // lúc khởi động rồi mở lại modal này để báo. Nếu không hiện ra thì học
      // viên quay về đúng màn hình cũ, không có phiên đăng nhập và không hiểu
      // vì sao.
      if (googleErrorCode) setErrorMsg(describeGoogleError(googleErrorCode));
      try {
        const savedEmail = localStorage.getItem('dmm_remembered_email');
        const savedChoice = localStorage.getItem('dmm_remember_me_choice');
        if (savedEmail) {
          setEmail(savedEmail);
        }
        if (savedChoice !== null) {
          setRememberMe(savedChoice === 'true');
        }
      } catch (e) {}
    }
  }, [isOpen, googleErrorCode]);

  if (!isOpen) return null;

  // Helper to fetch user database from localStorage as local cache
  const getUsersDB = () => {
    try {
      const saved = localStorage.getItem('dmm_users_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Máy nào đã từng chạy bản cũ sẽ còn tài khoản dùng thử nằm trong
          // localStorage -> phải lọc bỏ, nếu không nó vẫn đăng nhập được.
          const cleaned = parsed.filter((u) => !isBlockedDemoAccount(u?.email));
          if (cleaned.length !== parsed.length) {
            try { localStorage.setItem('dmm_users_db', JSON.stringify(cleaned)); } catch (e) {}
          }
          return cleaned;
        }
      }
    } catch (e) {}
    return [
      {
        id: 'admin-master-01',
        email: 'admin@pmarcom.edu.vn',
        // Mật khẩu quản trị vẫn nằm trong mã nguồn (xem TODO.md, mục Bảo mật),
        // nhưng ít nhất không ghi dạng chữ thường xuống localStorage nữa:
        // bản ghi được nâng cấp thành muối + băm ngay lần đăng nhập đầu tiên.
        password: 'admin',
        name: 'QUẢN TRỊ VIÊN ADMIN',
        phone: '0999999999',
        industry: 'Ban Quản Trị Học Viện',
        // CỐ Ý KHÔNG có `role: 'admin'` ở đây.
        //
        // Bản ghi này nằm trong localStorage và mật khẩu của nó đọc được ngay
        // trong mã nguồn công khai — bất kỳ ai cũng đăng nhập được vào nhánh dự
        // phòng này. Trước đây nó kèm `role: 'admin'` nên đó là đường chiếm
        // quyền quản trị dễ nhất trong toàn ứng dụng, còn chẳng cần tự phong.
        // Quyền quản trị nay chỉ cấp sau khi Firebase Auth xác thực và máy chủ
        // xác nhận (xem App.jsx `resolveAdminRole`), nên nhánh dự phòng này chỉ
        // còn cho đăng nhập ở mức học viên.
        createdAt: new Date().toLocaleDateString('vi-VN')
      }
    ];
  };

  const saveRememberedState = () => {
    try {
      if (rememberMe) {
        localStorage.setItem('dmm_remembered_email', email.trim());
        localStorage.setItem('dmm_remember_me_choice', 'true');
      } else {
        localStorage.removeItem('dmm_remembered_email');
        localStorage.setItem('dmm_remember_me_choice', 'false');
      }
    } catch (e) {}
  };

  /**
   * Đăng nhập bằng tài khoản Google.
   *
   * KHÔNG có nhánh dự phòng localStorage như luồng mật khẩu — và không thể có:
   * xác thực nằm hoàn toàn ở phía Google, mất mạng là không có cách nào biết
   * người bấm nút có thật sự sở hữu email đó không. Vì vậy mọi thất bại ở đây
   * đều dừng lại và báo lý do, thay vì âm thầm cho vào bằng một tài khoản tạm.
   *
   * Hồ sơ CHƯA được ghi lên Firestore ở bước này. Google không trả về số điện
   * thoại và ngành nghề, nên ghi ngay sẽ tạo ra một hồ sơ khuyết trên máy chủ.
   * Việc ghi để dành cho CompleteProfileModal, sau khi học viên điền nốt.
   */
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const result = await signInWithGoogle();

    // Trình duyệt đang chuyển sang trang đăng nhập của Google. Không tắt trạng
    // thái chờ và không báo gì cả — trang này sắp bị rời khỏi.
    if (result.pending) return;

    if (!result.ok) {
      setErrorMsg(describeGoogleError(result.code));
      setIsLoading(false);
      return;
    }

    const fbUser = result.user;
    const studentUser = {
      id: fbUser.uid,
      email: fbUser.email,
      name: (fbUser.displayName || fbUser.email.split('@')[0]).toUpperCase(),
      // Hai trường Google không có. Để nguyên giá trị giữ chỗ ở đây là CỐ Ý:
      // đó chính là dấu hiệu để chốt chặn trong App.jsx bật màn hình hoàn tất
      // hồ sơ lên. Bịa một số điện thoại giả vào đây là vô hiệu hoá cả bước đó.
      phone: 'Chưa cập nhật',
      industry: '',
      avatarUrl: fbUser.photoURL || '',
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    try {
      if (rememberMe && fbUser.email) {
        localStorage.setItem('dmm_remembered_email', fbUser.email);
        localStorage.setItem('dmm_remember_me_choice', 'true');
      }
    } catch (e) {}

    setSuccessMsg('🟢 Đăng nhập Google thành công!');
    setTimeout(() => {
      onLoginSuccess(studentUser);
      onClose();
    }, 500);
  };

  /**
   * "Quên mật khẩu?" — nhờ máy chủ gửi thư đặt lại.
   *
   * Gọi hàm máy chủ của chính mình (`/api/forgot-password`) chứ không gọi
   * `sendPasswordResetEmail` của Firebase, dù hàm đó có sẵn và ngắn hơn nhiều.
   * Lý do: thư của Firebase gửi từ `noreply@hr-project-b982a.firebaseapp.com`,
   * nội dung tiếng Anh, và đường dẫn bên trong cũng mang tên miền đó — học viên
   * nhận được sẽ thấy đúng mọi dấu hiệu của thư lừa đảo. Đường qua máy chủ cho
   * ta tự quyết cả người gửi, nội dung lẫn tên miền của đường dẫn.
   *
   * Câu trả lời hiện ra LUÔN GIỐNG NHAU dù email có tài khoản hay không. Trả
   * lời khác nhau là biến ô này thành công cụ dò xem ai đang là học viên.
   */
  const handleForgotPassword = async () => {
    const target = email.trim();
    setErrorMsg('');
    setSuccessMsg('');

    if (!target) {
      setErrorMsg('Nhập địa chỉ email của bạn vào ô phía trên, rồi bấm lại "Quên mật khẩu?".');
      return;
    }

    setIsSendingReset(true);
    const result = await requestPasswordReset(target);
    if (result.ok) {
      setSuccessMsg(result.message);
    } else {
      setErrorMsg(result.message);
    }
    setIsSendingReset(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      setIsLoading(false);
      return;
    }

    // Chặn trước cả bước gọi Firebase, phòng trường hợp tài khoản dùng thử
    // vẫn còn tồn tại trên Cloud Auth.
    if (isBlockedDemoAccount(email)) {
      setErrorMsg('Tài khoản dùng thử đã ngừng hoạt động. Vui lòng đăng ký tài khoản học viên riêng của bạn.');
      setIsLoading(false);
      return;
    }

    saveRememberedState();

    try {
      // 1. Try Firebase Cloud Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;

      const studentUser = {
        id: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || fullName || email.split('@')[0].toUpperCase(),
        phone: phone || 'Chưa cập nhật',
        industry: industry || 'Kinh doanh',
        createdAt: new Date().toLocaleDateString('vi-VN')
      };

      setSuccessMsg('🟢 Đăng nhập thành công!');
      setTimeout(() => {
        onLoginSuccess(studentUser);
        onClose();
      }, 500);
    } catch (firebaseErr) {
      console.warn(
        `Firebase Auth thất bại (${firebaseErr?.code || 'không có mã lỗi'}), thử nhánh dự phòng tại máy:`,
        firebaseErr?.message
      );

      // 2. Fallback to local accounts
      const users = getUsersDB();
      const candidate = users.find(u => u.email && u.email.toLowerCase() === email.trim().toLowerCase());
      const { ok, needsUpgrade } = await verifyCredential(password, candidate);
      const foundUser = ok ? candidate : null;

      // Bản ghi cũ còn lưu mật khẩu chữ thường -> nâng cấp thành muối + băm ngay.
      if (ok && needsUpgrade) {
        try {
          const credential = await createCredential(password);
          const upgraded = upgradeRecord(candidate, credential);
          localStorage.setItem(
            'dmm_users_db',
            JSON.stringify(users.map(u => (u === candidate ? upgraded : u)))
          );
        } catch (e) {
          console.warn('Không nâng cấp được bản ghi đăng nhập tại máy:', e);
        }
      }

      if (foundUser) {
        setSuccessMsg('🟢 Đăng nhập thành công!');
        setTimeout(() => {
          onLoginSuccess(foundUser);
          onClose();
        }, 500);
      } else {
        // Nhánh dự phòng cũng không khớp -> báo đúng lý do Firebase đã từ chối,
        // thay vì đổ hết cho "sai mật khẩu".
        setErrorMsg(describeAuthError(firebaseErr));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!fullName.trim() || !phone.trim() || !email.trim() || !password || !industry) {
      setErrorMsg('Vui lòng điền đầy đủ 4 thông tin bắt buộc: Họ Tên, SĐT, Email và Ngành Nghề.');
      setIsLoading(false);
      return;
    }

    if (phone.trim().length < 9) {
      setErrorMsg('Vui lòng nhập Số điện thoại hợp lệ.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu bảo mật phải từ 6 ký tự trở lên.');
      setIsLoading(false);
      return;
    }

    if (isBlockedDemoAccount(email)) {
      setErrorMsg('Email này thuộc tài khoản dùng thử đã ngừng hoạt động. Vui lòng dùng email cá nhân của bạn.');
      setIsLoading(false);
      return;
    }

    // Không cho đăng ký bằng email của tài khoản Quản Trị Tối Cao.
    //
    // Nếu tài khoản đó chưa tồn tại trên Firebase Auth thì bất kỳ ai cũng có thể
    // đăng ký chiếm chỗ và trở thành quản trị viên cao nhất — chiếm quyền mà
    // không cần tự phong. Chặn ở đây là lớp cuối; lớp thật là tài khoản đó phải
    // đã được tạo sẵn trên Firebase Console (xem DEPLOYMENT.md).
    if (isRootAdmin(email)) {
      setErrorMsg('Email này thuộc Ban Quản Trị Học Viện, không dùng để đăng ký học viên.');
      setIsLoading(false);
      return;
    }

    saveRememberedState();

    try {
      // 1. Register via Firebase Cloud Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;

      // Set display name in Firebase Profile
      await updateProfile(fbUser, { displayName: fullName.trim().toUpperCase() });

      const studentUser = {
        id: fbUser.uid,
        email: fbUser.email,
        name: fullName.trim().toUpperCase(),
        phone: phone.trim(),
        industry: industry,
        createdAt: new Date().toLocaleDateString('vi-VN')
      };

      // Record complete student profile to Cloud Firestore & Storage.
      //
      // CÓ await và CÓ kiểm tra kết quả: đây là lúc duy nhất biết chắc hồ sơ có
      // lên được máy chủ hay không. Ghi hỏng mà vẫn báo "thành công" thì học
      // viên tưởng đã có tài khoản, còn quản trị viên không bao giờ thấy họ.
      const cloudResult = await recordStudentAccountToCloud(studentUser);
      saveUserProgressToCloud(fbUser.uid, {
        name: fullName.trim().toUpperCase(),
        phone: phone.trim(),
        email: fbUser.email,
        industry: industry,
        createdAt: new Date().toISOString()
      });

      if (cloudResult && cloudResult.ok === false) {
        setErrorMsg(
          `Tài khoản đã tạo được nhưng hồ sơ CHƯA lưu lên hệ thống (${cloudResult.code || 'lỗi không rõ'}). ` +
          `Bạn vẫn học được, nhưng Ban Quản Trị chưa thấy hồ sơ của bạn. Vui lòng báo lại để được hỗ trợ.`
        );
      } else {
        // Chỉ cộng bộ đếm ghi danh khi hồ sơ THẬT SỰ đã lên máy chủ.
        recordRealStudentEnrollment();

        // Thư chào mừng. Không await: thư là việc phụ, không được để nó giữ
        // học viên lại ở màn hình đăng ký. Máy chủ tự chốt gửi đúng một lần
        // nên gọi ở đây không đụng với luồng đăng nhập Google (nơi thư được
        // gửi sau bước hoàn tất hồ sơ).
        sendWelcomeEmail();

        setSuccessMsg('🎉 Đăng ký tài khoản học viên P MARCOM thành công! Bạn có thể bắt đầu học ngay.');
      }

      setTimeout(() => {
        onLoginSuccess(studentUser);
        onClose();
      }, cloudResult && cloudResult.ok === false ? 3500 : 600);
    } catch (firebaseErr) {
      console.warn("Firebase Register Error, falling back to local storage:", firebaseErr.message);

      // Fallback local registration if offline or demo key
      const users = getUsersDB();
      const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

      if (existing) {
        setErrorMsg('Email này đã được đăng ký. Vui lòng chuyển sang Đăng nhập.');
        setIsLoading(false);
        return;
      }

      // Không bao giờ ghi mật khẩu dạng chữ thường xuống localStorage.
      // credential = null khi trang chạy trên http thuần (không có Web Crypto):
      // khi đó bỏ luôn phần mật khẩu, tài khoản vẫn tạo được nhưng không đăng
      // nhập offline được — vẫn hơn là để lộ mật khẩu.
      const credential = await createCredential(password);
      const newUser = {
        id: `user-${Date.now()}`,
        email: email.trim(),
        ...(credential || {}),
        name: fullName.trim().toUpperCase(),
        phone: phone.trim(),
        industry: industry,
        createdAt: new Date().toLocaleDateString('vi-VN')
      };

      try {
        localStorage.setItem('dmm_users_db', JSON.stringify([...users, newUser]));
        // Vẫn thử đẩy lên Cloud, nhưng gần như chắc chắn hỏng: tới nhánh này là
        // Firebase Auth đã từ chối, nên không có phiên đăng nhập, mà Firestore
        // Rules đòi phải đăng nhập mới ghi được hồ sơ.
        recordStudentAccountToCloud(newUser);
      } catch (e) {}

      // Nói thật với học viên. Tài khoản này CHỈ nằm trên máy họ: đổi máy là
      // mất, và Ban Quản Trị không bao giờ thấy. Trước đây chỗ này báo "🎉 Tạo
      // tài khoản thành công" y hệt nhánh online — đó là lý do có học viên đăng
      // ký xong mà không xuất hiện trong Bảng Quản Trị, không ai biết vì sao.
      setErrorMsg(
        `Không kết nối được hệ thống (${describeAuthError(firebaseErr)}) ` +
        `Tài khoản đã tạo TẠM trên thiết bị này để bạn học ngay, nhưng CHƯA đăng ký lên hệ thống ` +
        `và Ban Quản Trị chưa thấy hồ sơ của bạn. Khi có mạng trở lại, vui lòng đăng ký lại.`
      );
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 600);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      {/* `min-w-0`: tấm nền là flex item, mặc định `min-width: auto` nên nó
          không chịu hẹp hơn bề ngang tối thiểu của nội dung — chỉ cần một khối
          con không co được là cả hộp thoại tràn khỏi màn hình điện thoại và bị
          cắt cụt bên phải. `min-w-0` cho nó co đúng bằng `w-full`.
          `p-4` trên màn nhỏ: trả lại bề ngang cho ô nhập liệu trên máy 360px. */}
      <div className="relative w-full max-w-md min-w-0 glass-panel rounded-3xl border border-emerald-500/40 p-4 sm:p-8 shadow-2xl space-y-5 my-auto">
        
        {/* Return to Homepage Button (Top-Left Corner) */}
        <button
          type="button"
          onClick={() => {
            if (onReturnHome) onReturnHome();
            onClose();
          }}
          className="absolute top-4 left-4 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 hover:border-emerald-400 text-emerald-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition cursor-pointer shadow-md"
          title="Trở về Trang chủ"
        >
          <Home className="w-3.5 h-3.5 text-emerald-400" />
          <span>Trang chủ</span>
        </button>

        {/* Close Button (Top-Right Corner) */}
        <button
          type="button"
          onClick={() => {
            if (onReturnHome) onReturnHome();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-emerald-900 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shadow-md"
          title="Đóng & Trở về trang chủ"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header Branding */}
        <div className="text-center space-y-1.5">
          <div className="flex justify-center mb-1">
            <PMarcomLogo className="w-11 h-11" showText={false} />
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white tracking-wide">
            {mode === 'register' ? textDict.authTitleRegister : textDict.authTitleLogin}
          </h3>
          <p className="text-[11px] text-emerald-400 font-semibold">
            {textDict.authSubtitle}
          </p>
        </div>

        {/* Cảnh báo thiếu cấu hình Firebase.
            Hiện TRƯỚC khi người dùng kịp gõ, thay vì để họ thử mật khẩu nhiều
            lần rồi mới biết lỗi không nằm ở mật khẩu. */}
        {!isFirebaseConfigured && (
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-[11px] space-y-1">
            <div className="font-black flex items-center gap-1.5 text-amber-300">
              <AlertCircle className="w-4 h-4" /> Ứng dụng chưa được cấu hình Firebase
            </div>
            <p className="leading-relaxed">
              Thiếu biến môi trường: <strong className="font-mono">{missingFirebaseEnv.join(', ')}</strong>.
              Đăng nhập và đồng bộ dữ liệu sẽ không hoạt động cho tới khi khai báo. Xem <strong>DEPLOYMENT.md</strong>.
            </p>
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div className="flex bg-slate-900/60 p-1 rounded-xl border border-emerald-900/50">
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> {textDict.tabRegister}
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> {textDict.tabLogin}
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-600/60 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Đăng nhập nhanh bằng tài khoản Google.
            Đặt TRƯỚC form: đây là đường vào nhanh nhất (không phải nghĩ mật
            khẩu, không quên mật khẩu), nên để dưới cùng là phần lớn học viên
            không nhìn thấy. */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>{isLoading ? 'Đang Xử Lý...' : 'Đăng nhập bằng Google (Gmail)'}</span>
          </button>

          {/* Trình duyệt nhúng trong Zalo/Facebook: Google TỪ CHỐI đăng nhập từ
              đây, không phải lỗi của ứng dụng và không sửa được bằng mã nguồn.
              Nói trước để học viên khỏi bấm mãi một nút không bao giờ chạy. */}
          {isInAppBrowser() && (
            <p className="text-[10px] text-amber-300 leading-relaxed flex items-start gap-1.5 px-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
              <span>
                Bạn đang mở trang trong ứng dụng Zalo/Facebook — Google chặn đăng nhập từ đây.
                Bấm menu <strong>⋮</strong> ở góc màn hình rồi chọn <strong>"Mở bằng trình duyệt"</strong> (Chrome/Safari),
                hoặc dùng Email + Mật khẩu bên dưới.
              </span>
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <span className="h-px flex-1 bg-emerald-900/60" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">hoặc dùng email</span>
            <span className="h-px flex-1 bg-emerald-900/60" />
          </div>
        </div>

        {/* Form Controls */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-3.5">
          
          {mode === 'register' && (
            <>
              {/* Field 1: Họ và tên */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>{textDict.labelFullName}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">*Bắt buộc</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: NGUYỄN VĂN A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-900/60 border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Field 2: Số điện thoại */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>{textDict.labelPhone}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">*Bắt buộc</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0901234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900/60 border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Field 4: Ngành nghề kinh doanh */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>{textDict.labelIndustry}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">*Bắt buộc</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-slate-900/60 border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none transition appearance-none cursor-pointer"
                  >
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Field 3: Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>{textDict.labelEmail}</span>
              <span className="text-[10px] text-emerald-400 font-bold">*Bắt buộc</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@pmarcom.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/60 border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>{textDict.labelPassword}</span>
              <span className="text-[10px] text-emerald-400 font-bold">*Bắt buộc</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="•••••••• (Tối thiểu 6 ký tự)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-emerald-900/60 focus:border-emerald-400 rounded-xl pl-9 pr-10 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition p-1 cursor-pointer"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1 pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-emerald-400 transition select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-emerald-800 bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
              />
              <span className="font-semibold text-[11px] sm:text-xs">{textDict.rememberMeLabel || "Ghi nhớ đăng nhập trên thiết bị này"}</span>
            </label>

            {/* "Quên mật khẩu?" chỉ hiện ở tab Đăng Nhập.
                Ở tab Đăng Ký nó vô nghĩa — chưa có tài khoản thì chưa có mật
                khẩu nào để quên — và còn làm người mới phân vân không biết mình
                đang ở bước nào. */}
            {mode === 'login' && (
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isSendingReset}
                className="text-[11px] sm:text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition cursor-pointer shrink-0 ml-2 disabled:opacity-60"
              >
                {isSendingReset ? 'Đang gửi...' : 'Quên mật khẩu?'}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs hover:brightness-110 shadow-lg transition cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Đang Xử Lý...' : mode === 'register' ? textDict.btnRegisterSubmit : textDict.btnLoginSubmit}</span>
          </button>
        </form>

        {/* Return Home Secondary Action Button */}
        <div className="pt-2 border-t border-emerald-900/30 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onReturnHome) onReturnHome();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-slate-700 shadow-sm"
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span>Trở Về Trang Chủ (Xem Tổng Quan)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
