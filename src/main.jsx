import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ResetPasswordPage from './components/ResetPasswordPage.jsx'
import SplashScreen from './components/SplashScreen.jsx'
import { shouldShowSplash } from './utils/splashSession.js'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0e1526', color: 'white', padding: '24px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <div style={{ padding: '24px', background: '#17233f', border: '1px solid #10b981', borderRadius: '20px', maxWidth: '540px', width: '100%' }}>
            <h2 style={{ color: '#6495ED', margin: '0 0 12px 0' }}>HỌC VIỆN P MARCOM</h2>
            <p style={{ color: '#e2e8f0', fontSize: '14px', marginBottom: '16px' }}>Đã ghi nhận cập nhật phiên bản mới. Vui lòng nhấn nút bên dưới để tải lại dữ liệu.</p>
            <button 
              onClick={() => {
                try {
                  localStorage.clear();
                  sessionStorage.clear();
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(regs => {
                      regs.forEach(r => r.unregister());
                    });
                  }
                } catch (e) {}
                window.location.href = window.location.origin + '/?reset=' + Date.now();
              }}
              style={{ padding: '12px 24px', background: '#6495ED', color: '#0e1526', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', width: '100%' }}
            >
              🔄 Xóa Bộ Nhớ Cũ & Tải Lại Trang
            </button>
            {this.state.error && (
              <details style={{ marginTop: '16px', textAlign: 'left', background: '#0b1220', padding: '12px', borderRadius: '10px', fontSize: '11px', color: '#fbbf24', overflowX: 'auto' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Chi tiết kỹ thuật (Developer Info)</summary>
                <pre style={{ marginTop: '8px', whitespace: 'pre-wrap' }}>{String(this.state.error?.stack || this.state.error)}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Chọn màn hình gốc: trang đặt lại mật khẩu, hay toàn bộ ứng dụng.
 *
 * Phân nhánh Ở ĐÂY chứ không phải bên trong App.jsx, có hai lý do:
 *
 * 1. App.jsx gọi hàng chục hook. Chèn một lệnh `return` sớm vào giữa đó là vi
 *    phạm quy tắc thứ tự hook của React — lỗi kiểu chỉ hiện ra lúc chạy, và
 *    hiện ở một chỗ chẳng liên quan gì tới đoạn vừa sửa.
 *
 * 2. Người bấm link trong thư chưa đăng nhập và chỉ cần đúng một việc. Không có
 *    lý do gì bắt họ tải cả khoá học, bảng quản trị và bộ đếm truy cập.
 *
 * Đường dẫn `/doi-mat-khau` được `vercel.json` chuyển về index.html; thiếu khai
 * báo đó thì máy chủ trả về 404 trước khi JavaScript kịp chạy.
 */
function Root() {
  const isResetRoute = window.location.pathname.replace(/\/+$/, '') === '/doi-mat-khau';

  // Màn hình chào chỉ hiện khi HAI điều kiện cùng đúng.
  //
  // 1. Không phải trang đặt lại mật khẩu. Người tới đó vừa bấm đường dẫn trong
  //    thư, đang cần làm gấp đúng một việc và có thể đang lo vì không vào được
  //    tài khoản. Chen màn hình chào vào đó là chọn sai thời điểm.
  //
  // 2. Phiên này chưa chào lần nào. Trước đây bấm F5 là chào lại từ đầu, mỗi
  //    lần tải lại giữa buổi học đều mất thêm thời gian chờ.
  //
  // Tính trong hàm khởi tạo state để chỉ đọc kho lưu trữ đúng một lần, thay vì
  // đọc lại ở mỗi lần dựng lại giao diện.
  const [showSplash, setShowSplash] = React.useState(() => !isResetRoute && shouldShowSplash());

  if (isResetRoute) {
    const oobCode = new URLSearchParams(window.location.search).get('oobCode');
    return (
      <ResetPasswordPage
        oobCode={oobCode}
        onDone={() => { window.location.href = '/'; }}
      />
    );
  }

  // <App /> dựng NGAY, không chờ màn hình chào tắt. Giây đó ứng dụng vẫn đang
  // nạp dữ liệu bên dưới, nên khi màn hình biến mất thì mọi thứ đã sẵn sàng —
  // thời gian chờ được dùng vào việc thật thay vì cộng thêm vào.
  return (
    <>
      <App />
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </StrictMode>,
)
