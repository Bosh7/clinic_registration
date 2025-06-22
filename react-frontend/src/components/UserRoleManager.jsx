import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './UserRoleManager.css';

export default function UserRoleManager() {
  const [users, setUsers] = useState([]);

  // 取得所有使用者
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "❌ 無法載入使用者資料",
        position: "center",
        showConfirmButton: false,
        timer: 1500  
      });
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 切換角色
  const toggleRole = async (id, currentRole, username) => {
    if (username === 'admin') return;

    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';

    const result = await Swal.fire({
      icon: 'question',
      title: `確定要將 ${username} 的角色變更為 ${newRole} 嗎？`,
      position: "center",
      showCancelButton: true,
      confirmButtonText: '確認',
      cancelButtonText: '取消'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "✅ 角色更新成功",
          position: "center",
          showConfirmButton: false,
          timer: 1500
        });
        fetchUsers();
      } else {
        const errMsg = await res.text();
        Swal.fire({
          icon: "error",
          title: `❌ 更新失敗：${errMsg}`,
          position: "center",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ 無法送出更新",
        position: "center",
        showConfirmButton: false,
        timer: 1500
      });
      console.error(err);
    }
  };

  // 刪除使用者
  const deleteUser = async (id, username) => {
    if (username === 'admin') return;

    const result = await Swal.fire({
      icon: 'warning',
      title: `確定要刪除使用者 ${username} 嗎？`,
      position: "center",
      showCancelButton: true,
      confirmButtonText: '刪除',
      cancelButtonText: '取消'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "✅ 使用者已刪除",
          position: "center",
          showConfirmButton: false,
          timer: 1500
        });
        fetchUsers();
      } else {
        const errorText = await res.text();
        Swal.fire({
          icon: "error",
          title: `❌ 刪除失敗：${errorText}`,
          position: "center",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ 系統錯誤",
        position: "center",
        showConfirmButton: false,
        timer: 1500
      });
      console.error(err);
    }
  };

  return (
    <div className="urole-panel">
      <h3>👤 使用者角色管理</h3>
      <div className="urole-table-wrapper">
        <table className="urole-table">
          <thead>
            <tr>
              <th>帳號</th>
              <th>目前角色</th>
              <th>變更權限</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isAdminUser = user.username === 'admin';
              return (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      disabled={isAdminUser}
                      onClick={() => toggleRole(user.id, user.role, user.username)}
                      className={`urole-action-btn ${isAdminUser ? 'disabled' : 'role'}`}
                    >
                      {isAdminUser ? '不可變更' : `切換為 ${user.role === 'ADMIN' ? 'USER' : 'ADMIN'}`}
                    </button>
                  </td>
                  <td>
                    <button
                      disabled={isAdminUser}
                      onClick={() => deleteUser(user.id, user.username)}
                      className={`urole-action-btn ${isAdminUser ? 'disabled' : 'delete'}`}
                    >
                      {isAdminUser ? '不可刪除' : '刪除使用者'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
