import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
