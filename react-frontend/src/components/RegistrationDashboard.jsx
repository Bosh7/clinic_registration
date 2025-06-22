import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './RegistrationDashboard.css';

export default function RegistrationDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [selectedDept, setSelectedDept] = useState('全部');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const today = new Date().toISOString().split('T')[0];

  const loadData = () => {
    setLoading(true);
    fetch('/api/registrations')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.data)) {
          const sorted = [...data.data].sort((a, b) =>
            new Date(a.registrationDate) - new Date(b.registrationDate)
          );
          setRegistrations(sorted);
        } else {
          Swal.fire({
            icon: "error",
            title: "❌ 無法取得掛號紀錄",
            position: "center",
            showConfirmButton: false,
            timer: 1500
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: "warning",
          title: "⚠️ 發生錯誤",
          position: "center",
          showConfirmButton: false,
          timer: 1500
        });
        setLoading(false);
      });
  };

  useEffect(loadData, []);

  const departments = [...new Set(registrations.map(r => r.departmentName))];

  const filtered = registrations.filter(r => {
    const matchDept = selectedDept === '全部' || r.departmentName === selectedDept;
    const matchDate = !selectedDate || r.registrationDate === selectedDate;
    return matchDept && matchDate;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  function getPagination(current, total) {
    let pages = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        pages = [1, 2, 3, 4, 5, 'ellipsis', total];
      } else if (current >= total - 3) {
        pages = [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
      } else {
        pages = [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
      }
    }
    return pages;
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "確定要刪除此筆掛號紀錄嗎？",
      position: "center",
      showCancelButton: true,
      confirmButtonText: "刪除",
      cancelButtonText: "取消"
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "✅ 已刪除",
          position: "center",
          showConfirmButton: false,
          timer: 1500
        });
        loadData();
      } else {
        Swal.fire({
          icon: "error",
          title: "❌ 刪除失敗",
          position: "center",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ 發生錯誤",
        position: "center",
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const countByDate = registrations.filter(r => r.registrationDate === selectedDate).length;

  return (
    <div className="rd-dashboard-card">
      <h1 className="rd-title">📝 掛號紀錄列表</h1>

      {/* 篩選工具列 */}
      <div className="rd-filter-bar">
        <div className="rd-filter-controls">
          <label>
            選擇日期：
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </label>
          {selectedDate && (
            <button onClick={() => setSelectedDate('')} className="rd-clear-btn">
              清除日期
            </button>
          )}
          {selectedDate && (
            <span className="rd-summary">📅 {selectedDate} 看診人數：{countByDate} 人</span>
          )}
        </div>
        <div className="rd-department-filters">
          <button
            onClick={() => { setSelectedDept('全部'); setCurrentPage(1); }}
            className={`rd-dept-btn ${selectedDept === '全部' ? 'active' : ''}`}
          >
            全部 ({registrations.length})
          </button>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => { setSelectedDept(dept); setCurrentPage(1); }}
              className={`rd-dept-btn ${selectedDept === dept ? 'active' : ''}`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* 表格滾動區塊 */}
      <div className="rd-table-container">
        {loading ? (
          <p>載入中...</p>
        ) : filtered.length === 0 ? (
          <p>目前沒有掛號紀錄。</p>
        ) : (
          <>
            <table className="rd-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>身分證 / 病歷號</th>
                  <th>醫師姓名</th>
                  <th>科別</th>
                  <th>日期</th>
                  <th>時段</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((r, index) => (
                  <tr key={r.id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{r.idNumber}</td>
                    <td>{r.doctorName}</td>
                    <td>{r.departmentName}</td>
                    <td>{r.registrationDate}</td>
                    <td>{r.timePeriod}</td>
                    <td>
                      <button onClick={() => handleDelete(r.id)} className="rd-delete-btn">
                        🗑 刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 分頁按鈕 */}
            <div className="rd-pagination">
              <button
                className="rd-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                &lt;
              </button>
              {getPagination(currentPage, totalPages).map((page, idx) =>
                page === 'ellipsis' ? (
                  <span key={'e' + idx} className="rd-ellipsis">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rd-page-btn ${page === currentPage ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className="rd-page-btn"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                &gt;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
