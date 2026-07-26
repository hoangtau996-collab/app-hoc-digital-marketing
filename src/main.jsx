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
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#070d0a', color: 'white', padding: '24px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <div style={{ padding: '24px', background: '#091a14', border: '1px solid #10b981', borderRadius: '20px', maxWidth: '500px' }}>
            <h2 style={{ color: '#00E676', margin: '0 0 12px 0' }}>HỌC VIỆN P MARCOM</h2>
            <p style={{ color: '#e2e8f0', fontSize: '14px', marginBottom: '16px' }}>Đã tự động cập nhật hệ thống mới. Vui lòng nhấn nút bên dưới để tải lại dữ liệu.</p>
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
                window.location.href = window.location.origin;
              }}
              style={{ padding: '12px 24px', background: '#00E676', color: '#070d0a', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
            >
              🔄 Khôi Phục & Tải Lại Trang
            </button>
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
