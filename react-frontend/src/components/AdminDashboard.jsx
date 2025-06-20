import { useState } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard({
  user,
  onViewAllRegistrations,
  onAddSchedule,
  onManageUsers,
  onAddUser
}) {
  const isAdmin = user?.role === 'ADMIN';

  // 只給 ADMIN 看全部功能
  if (isAdmin) {
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
      <div className="admin-dashboard-card">
        <h2 className="admin-dashboard-title">👨‍⚕️ 後台管理系統</h2>
        <ul className="admin-dashboard-list">
          <li>
            <button className="admin-dashboard-button" onClick={onViewAllRegistrations}>
              📋 查看全部掛號紀錄
            </button>
          </li>
          <li>
            <button
              className="admin-dashboard-button"
              onClick={onAddSchedule}
            >
              ➕ 新增醫師排班
            </button>
          </li>
          <li>
            <button
              className="admin-dashboard-button"
              onClick={() => setUserMenuOpen(prev => !prev)}
            >
              👤 使用者管理 {userMenuOpen ? '▲' : '▼'}
            </button>
            {userMenuOpen && (
              <ul className="admin-dashboard-sublist">
                <li>
                  <button className="admin-dashboard-sub-button" onClick={onManageUsers}>
                    🔧 管理用戶權限
                  </button>
                </li>
                <li>
                  <button className="admin-dashboard-sub-button" onClick={onAddUser}>
                    ➕ 新增使用者
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    );
  }

  // 如果是 USER，只顯示一個按鈕
  return (
    <div className="admin-dashboard-card">
      <h2 className="admin-dashboard-title">👨‍⚕️ 掛號紀錄</h2>
      <ul className="admin-dashboard-list">
        <li>
          <button className="admin-dashboard-button" onClick={onViewAllRegistrations}>
            📋 查看全部掛號紀錄
          </button>
        </li>
      </ul>
    </div>
  );
}
