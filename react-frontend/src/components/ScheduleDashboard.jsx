import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './ScheduleDashboard.css';

export default function ScheduleDashboard({ user }) {
  const [schedules, setSchedules] = useState([]);
  const [department, setDepartment] = useState('');
  const [newSchedule, setNewSchedule] = useState({
    doctorName: '',
    departmentName: '',
    dayOfWeek: '',
    timePeriod: '上午',
    available: true
  });

  const fetchAllSchedules = async () => {
    const res = await fetch('/api/schedules');
    const data = await res.json();
    setSchedules(data);
  };

  const fetchByDepartment = async () => {
    if (!department) {
      Swal.fire({
        icon: "error",
        title: "請輸入科別名稱",
        position: "center",
        showConfirmButton: false,
        timer: 1500  
      });
      return;
    }
    const res = await fetch(`/api/schedules/department?name=${department}`);
    const data = await res.json();
    setSchedules(data);
  };

  const handleAdd = async () => {
    const res = await fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body: JSON.stringify(newSchedule)
    });

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "新增成功",
        position: "center",
        showConfirmButton: false,
        timer: 1500  
      });
      fetchAllSchedules();
    } else {
      const msg = await res.text(); 
      Swal.fire({
        icon: "error",
        title: "❌ 新增失敗：" + msg,
        position: "center",
        showConfirmButton: false,
        timer: 1500  
      });
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/schedules/${id}`, {
      method: 'DELETE',
      credentials: 'include' 
    });

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "刪除成功",
        position: "center",
        showConfirmButton: false,
        timer: 1500  
      });
      fetchAllSchedules();
    } else {
      Swal.fire({
        icon: "error",
        title: "刪除失敗",
        position: "center",
        showConfirmButton: false,
        timer: 1500  
      });
    }
  };

  useEffect(() => {
    fetchAllSchedules();
  }, []);

  return (
    <div className="schedule-card">
      <h2 className="schedule-title">🗂️ 排班管理</h2>

      {/* 查詢功能 */}
      <div className="schedule-filter-bar">
        <button className="schedule-btn" onClick={fetchAllSchedules}>全部排班</button>
        <input
          className="schedule-input"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="輸入科別名稱"
        />
        <button className="schedule-btn" onClick={fetchByDepartment}>依科別查詢</button>
      </div>

      {/* 新增排班（ADMIN） */}
      {user.role === 'ADMIN' && (
        <div className="schedule-add-block">
          <h4>新增排班</h4>
          <input
            className="schedule-input"
            placeholder="醫師姓名"
            value={newSchedule.doctorName}
            onChange={(e) => setNewSchedule({ ...newSchedule, doctorName: e.target.value })}
          />
          <input
            className="schedule-input"
            placeholder="科別名稱"
            value={newSchedule.departmentName}
            onChange={(e) => setNewSchedule({ ...newSchedule, departmentName: e.target.value })}
          />
          <input
            className="schedule-input"
            placeholder="星期（例如：星期一）"
            value={newSchedule.dayOfWeek}
            onChange={(e) => setNewSchedule({ ...newSchedule, dayOfWeek: e.target.value })}
          />
          <select
            className="schedule-select"
            value={newSchedule.timePeriod}
            onChange={(e) => setNewSchedule({ ...newSchedule, timePeriod: e.target.value })}
          >
            <option value="上午">上午</option>
            <option value="下午">下午</option>
          </select>
          <button className="schedule-add-btn" onClick={handleAdd}>新增排班</button>
        </div>
      )}

      {/* 排班表格 */}
      <div className="schedule-table-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>醫師</th>
              <th>科別</th>
              <th>星期</th>
              <th>時段</th>
              <th>是否排班</th>
              {user.role === 'ADMIN' && <th>建立者</th>}
              {user.role === 'ADMIN' && <th>操作</th>}
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.doctorName || '—'}</td>
                <td>{s.departmentName || '—'}</td>
                <td>{s.dayOfWeek}</td>
                <td>{s.timePeriod}</td>
                <td>{s.available ? '有醫師' : '無醫師'}</td>
                {user.role === 'ADMIN' && (
                  <td>{s.createdByUsername || '—'}</td>
                )}
                {user.role === 'ADMIN' && (
                  <td>
                    <button className="schedule-del-btn" onClick={() => handleDelete(s.id)}>刪除</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
