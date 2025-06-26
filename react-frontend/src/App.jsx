import { useEffect, useState, useCallback } from 'react';
import DepartmentSelector from './components/DepartmentSelector';
import RegisterForm from './components/RegisterForm';
import RegistrationSearch from './components/RegistrationSearch';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import RegistrationDashboard from './components/RegistrationDashboard';
import AddScheduleForm from './components/AddScheduleForm';
import ScheduleHistoryPanel from './components/ScheduleHistoryPanel';
import UserRoleManager from './components/UserRoleManager';
import UserCreateForm from './components/UserCreateForm';
import Marquee from './components/Marquee';
import Swal from 'sweetalert2';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import './App.css';


function AppContent() {
  const [step, setStep] = useState('select');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // ----------- 用網址決定 step（只影響主分頁） -----------
  useEffect(() => {
    if (location.pathname === '/') setStep('select');
    else if (location.pathname === '/register') setStep('register');
    else if (location.pathname === '/search') setStep('search');
    else if (location.pathname === '/login') setStep('login');
    else if (location.pathname === '/admin') setStep('admin');
    else if (location.pathname === '/registrationList') setStep('registrationList');
    else if (location.pathname === '/addSchedule') setStep('addSchedule');
    else if (location.pathname === '/scheduleHistory') setStep('scheduleHistory');
    else if (location.pathname === '/manageUsers') setStep('manageUsers');
    else if (location.pathname === '/addUser') setStep('addUser');
  }, [location.pathname]);

  // ----------- 當 setStep 也自動換網址（防止「畫面有變，網址沒動」）-----------
  useEffect(() => {
    if (step === 'select' && location.pathname !== '/') navigate('/');
    else if (step === 'register' && location.pathname !== '/register') navigate('/register');
    else if (step === 'search' && location.pathname !== '/search') navigate('/search');
    else if (step === 'login' && location.pathname !== '/login') navigate('/login');
    else if (step === 'admin' && location.pathname !== '/admin') navigate('/admin');
    else if (step === 'registrationList' && location.pathname !== '/registrationList') navigate('/registrationList');
    else if (step === 'addSchedule' && location.pathname !== '/addSchedule') navigate('/addSchedule');
    else if (step === 'scheduleHistory' && location.pathname !== '/scheduleHistory') navigate('/scheduleHistory');
    else if (step === 'manageUsers' && location.pathname !== '/manageUsers') navigate('/manageUsers');
    else if (step === 'addUser' && location.pathname !== '/addUser') navigate('/addUser');
  }, [step, navigate, location.pathname]);

  // 1. 登出流程
  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('user');
    localStorage.removeItem('step');
    setCurrentUser(null);
    setStep('select');
  }, []);

  // 2. 首次與定時 session 檢查
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedStep = localStorage.getItem('step');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setStep(savedStep || 'admin');
    }

    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.data && data.data.username) {
            setCurrentUser(data.data);
            localStorage.setItem('user', JSON.stringify(data.data));
            setCheckingSession(false);
            return;
          }
        }
        localStorage.removeItem('user');
        localStorage.removeItem('step');
        setCurrentUser(null);
        setStep('select');
        setCheckingSession(false);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('step');
        setCurrentUser(null);
        setStep('select');
        setCheckingSession(false);
      }
    };
    checkSession();
    const timer = setInterval(checkSession, 2 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. localStorage 同步
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
      localStorage.setItem('step', step);
    }
  }, [currentUser, step]);

  // 4. 載入等待畫面
  if (checkingSession) {
    return (
      <div className="app-root">
        <header className="header-bar">
          <div className="header-content">
            <span className="header-title">網路掛號系統</span>
          </div>
        </header>
        <main className="main-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>載入中...</span>
        </main>
        <footer className="footer-bar">
          © 2025 健康醫療網掛號系統
        </footer>
      </div>
    );
  }

  // 5. 主畫面
  return (
    <div className="app-root">
      <header className="header-bar">
        <div className="header-content">
          <div className="header-logo-title">
            <span role="img" aria-label="logo" className="header-logo">🏥</span>
            <span className="header-title">網路掛號系統</span>
          </div>
          <div className="header-login">
            {currentUser ? (
              <>
                <span>👤 {currentUser.username}</span>
                <button className="btn logout-btn" onClick={handleLogout}>登出</button>
              </>
            ) : (
              <button className="btn login-btn" onClick={() => setStep('login')}>登入</button>
            )}
          </div>
        </div>
      </header>
      <main className="main-container">
        {(step === 'select' || step === 'register' || step === 'search') && (
          <Marquee text="本院防疫期間請全程配戴口罩。「近期腸病毒流行，請佩戴口罩前來就診」！" />
        )}
        {step === 'select' && (
          <section className="main-section">
            <DepartmentSelector selected={selectedDepartment} onSelect={setSelectedDepartment} />
            {selectedDepartment && (
              <div className="select-confirm-block">
                <div>
                  ✅ 你選擇的科別是：<strong>{selectedDepartment}</strong>
                </div>
                <button className="btn main-btn" onClick={() => setStep('register')}>確認掛號</button>
              </div>
            )}
            <div className="main-btn-group">
              <button className="btn main-btn" onClick={() => setStep('search')}>查詢掛號紀錄</button>
              {currentUser && (
                <button className="btn admin-btn" onClick={() => setStep('admin')}>
                  返回後台
                </button>
              )}
            </div>
          </section>
        )}
        {step === 'register' && (
          <RegisterForm
            selectedDepartment={selectedDepartment}
            onBack={() => {
              setSelectedDepartment(null);
              setStep('select');
            }}
          />
        )}
        {step === 'search' && (
          <section className="main-section">
            <RegistrationSearch />
          </section>
        )}
        {step === 'login' && (
          <section className="main-section">
            <Login
              onLoginSuccess={(user) => {
                if (user && user.username) {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "登入成功",
                    showConfirmButton:false,
                    timer: 1500
                  });
                  setCurrentUser(user);
                  setStep('admin');
                } else {
                  Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "登入失敗，請確認帳號與密碼及認證碼",
                    showConfirmButton: false,
                    timer: 1500
                  });
                }
              }}
              onCancel={() => setStep('select')}
            />
          </section>
        )}
        {currentUser && step === 'admin' && (
          <section className="main-section">
            <AdminDashboard
              user={currentUser}
              onViewAllRegistrations={() => setStep('registrationList')}
              onAddSchedule={() => setStep('addSchedule')}
              onViewHistory={() => setStep('scheduleHistory')}
              onManageUsers={() => setStep('manageUsers')}
              onAddUser={() => setStep('addUser')}
            />
          </section>
        )}
        {currentUser && step === 'registrationList' && (
          <section className="main-section">
            <button className="btn back-btn" onClick={() => setStep('admin')}>⬅️ 返回後台</button>
            <RegistrationDashboard />
          </section>
        )}
        {currentUser && step === 'addSchedule' && (
          <section className="main-section">
            <button className="btn back-btn" onClick={() => setStep('admin')}>⬅️ 返回後台</button>
            <AddScheduleForm onScheduleAdded={() => {}} />
          </section>
        )}
        {currentUser && step === 'scheduleHistory' && (
          <section className="main-section">
            <button className="btn back-btn" onClick={() => setStep('admin')}>⬅️ 返回後台</button>
            <ScheduleHistoryPanel />
          </section>
        )}
        {currentUser && step === 'manageUsers' && (
          <section className="main-section">
            <button className="btn back-btn" onClick={() => setStep('admin')}>⬅️ 返回後台</button>
            <UserRoleManager />
          </section>
        )}
        {currentUser && step === 'addUser' && (
          <section className="main-section">
            <button className="btn back-btn" onClick={() => setStep('admin')}>⬅️ 返回後台</button>
            <UserCreateForm />
          </section>
        )}
      </main>
      <footer className="footer-bar">
        © 2025 診易通網掛號系統
        <br />
        <small style={{ fontSize: '12px', color: '#f0f0f0' }}>
          本網站僅供個人學習與面試展示用途，所有資料均為系統亂數產生，不代表任何真實醫療機構或病患資訊。
        </small>
      </footer>
      {step !== 'select' && (
        <button
          className="float-home-btn"
          onClick={() => setStep('select')}
        >
          回首頁
        </button>
      )}
    </div>
  );
}

//  最外層用 BrowserRouter 包起來
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 用「*」通配，所有路徑都給 AppContent 自己控制 */}
        <Route path="*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}
