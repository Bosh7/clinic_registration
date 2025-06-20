import { useState } from 'react';
import Swal from 'sweetalert2';
import './UserCreateForm.css';

export default function UserCreateForm() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'USER'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      Swal.fire({
        icon: "error",
        title: "❌ 帳號與密碼不得為空",
        position: "center",
        showConfirmButton: false,
        timer: 1500  
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "✅ 使用者新增成功",
          position: "center",
          showConfirmButton: false,
          timer: 1500  
        });
        setForm({ username: '', password: '', role: 'USER' });
      } else {
        const err = await res.text();
        Swal.fire({
          icon: "error",
          title: `❌ 新增失敗：${err}`,
          position: "center",
          showConfirmButton: false,
          timer: 1500  
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ 系統錯誤，請稍後再試",
        position: "center",
        showConfirmButton: false,
        timer: 1500  
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="usercreate-panel">
      <h3>➕ 新增使用者</h3>
      <form onSubmit={handleSubmit} className="usercreate-form">
        <label>
          帳號：
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="usercreate-input"
          />
        </label>

        <label>
          密碼：
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="usercreate-input"
          />
        </label>

        <label>
          角色：
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="usercreate-input"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>

        <button type="submit" className="usercreate-btn" disabled={loading}>
          {loading ? '送出中...' : '新增使用者'}
        </button>
      </form>
    </div>
  );
}
