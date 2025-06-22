import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; 
import './RegisterForm.css'; 

function RegisterForm({ selectedDepartment, onBack }) {
  const [idType, setIdType] = useState('身分證號');
  const [idValue, setIdValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [scheduleData, setScheduleData] = useState({});
  const [registrationCount, setRegistrationCount] = useState(0);
  const [registrationLimit, setRegistrationLimit] = useState(30);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 60);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
  const periods = ['上午', '下午', '晚上'];

  useEffect(() => {
    if (selectedDepartment && selectedDate) {
      fetch(`/api/schedules/search-by-department-and-date?departmentName=${selectedDepartment}&date=${selectedDate}`)
        .then((res) => res.json())
        .then((data) => {
          const formatted = {};
          data.forEach((item) => {
            if (!formatted[item.timePeriod]) formatted[item.timePeriod] = {};
            formatted[item.timePeriod][item.dayOfWeek] = item.doctorName;
          });
          setScheduleData(formatted);
        });
    }
  }, [selectedDepartment, selectedDate]);

  useEffect(() => {
    if (selectedSlot && selectedDate) {
      getDoctorIdByName(selectedSlot.doctor)
        .then((doctorId) => {
          return fetch(
            `/api/registrations/count?doctorId=${doctorId}&date=${selectedDate}&timePeriod=${selectedSlot.period}`
          );
        })
        .then(res => res.json())
        .then(data => {
          setRegistrationCount(data.count);
          setRegistrationLimit(data.limit);
        })
        .catch(() => {
          setRegistrationCount(0);
          setRegistrationLimit(30);
        });
    } else {
      setRegistrationCount(0);
      setRegistrationLimit(30);
    }
  }, [selectedSlot, selectedDate]);

  const getDoctorIdByName = async (doctorName) => {
    const res = await fetch(`/api/doctors/find-id?name=${encodeURIComponent(doctorName)}`);
    if (!res.ok) throw new Error('找不到醫師 ID');
    const obj = await res.json();
    return obj.id || (obj.data && obj.data.id) || obj;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idValue || !selectedSlot || !selectedDate) {
      Swal.fire({
        icon: "error",
        title: "❌ 請完整選擇掛號資訊與輸入識別資料",
        position: "center",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    if (idType === '身分證號') {
      const idRegex = /^[A-Z][0-9]{9}$/;
      if (!idRegex.test(idValue)) {
        Swal.fire({
          icon: "error",
          title: "❌ 身分證號格式錯誤，請輸入正確格式（例如：A123456789）",
          position: "center",
          showConfirmButton: false,
          timer: 1500
        });
        return;
      }
    }
    if (idType === '病歷號' && idValue.length !== 10) {
      Swal.fire({
        icon: "error",
        title: "❌ 病歷號需為 10 碼，請重新輸入",
        position: "center",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    if (registrationCount >= registrationLimit) {
      Swal.fire({
        icon: "error",
        title: "❌ 本時段人數已滿，無法掛號！",
        position: "center",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    try {
      const doctorId = await getDoctorIdByName(selectedSlot.doctor);
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idType,
          idNumber: idValue,
          doctorId,
          dayOfWeek: selectedSlot.day,
          timePeriod: selectedSlot.period,
          registrationDate: selectedDate
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '掛號失敗');
      }

      setSubmitted(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "❌ 錯誤：" + error.message,
        position: "center",
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  if (submitted) {
    return (
      <div className="register-form-container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>掛號完成！</h2>
        <p>科別：{selectedDepartment}</p>
        <p>日期：{selectedDate}</p>
        <p>時段：{selectedSlot.day} {selectedSlot.period}</p>
        <p>醫師：{selectedSlot.doctor}</p>
      </div>
    );
  }

  return (
    <div className="register-form-container">
      <h2>預約掛號確認</h2>

      <div className="register-form-date-picker">
        <label>選擇掛號日期：</label>
        <input
          type="date"
          value={selectedDate || tomorrowStr}
          min={tomorrowStr}
          max={maxDateStr}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedSlot(null);
          }}
        />
      </div>

      <div className="register-form-table-wrapper">
        <table className="register-form-table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>時段</th>
              {days.map((day) => <th key={day}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period}>
                <td>{period}</td>
                {days.map((day) => {
                  const doctor = scheduleData[period]?.[day];
                  const isSelected = selectedSlot &&
                    selectedSlot.day === day &&
                    selectedSlot.period === period;
                  return (
                    <td
                      key={`${day}-${period}`}
                      onClick={() => doctor && setSelectedSlot({ day, period, doctor })}
                      className={
                        doctor
                          ? isSelected
                            ? 'selected'
                            : ''
                          : 'disabled'
                      }
                    >
                      {doctor || ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSlot && (
        <div className="register-form-selected-info">
          您選擇了：{selectedSlot.day} {selectedSlot.period} - {selectedSlot.doctor}
          <div className="register-form-count">
            看診人數：{registrationCount} / {registrationLimit}
            {registrationCount >= registrationLimit && (
              <span style={{ color: 'red', marginLeft: 10 }}>人數已滿，請選其他時段</span>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="register-form-input-block">
          <label>
            <input
              type="radio"
              value="病歷號"
              checked={idType === '病歷號'}
              onChange={(e) => setIdType(e.target.value)}
            /> 病歷號
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="radio"
              value="身分證號"
              checked={idType === '身分證號'}
              onChange={(e) => setIdType(e.target.value)}
            /> 身分證號
          </label>
        </div>

        <div className="register-form-input-block">
          <input
            type="text"
            placeholder={`請輸入 ${idType}`}
            value={idValue}
            onChange={(e) => setIdValue(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="register-form-button"
          disabled={registrationCount >= registrationLimit}
        >
          {registrationCount >= registrationLimit ? '人數已滿' : '掛號確認'}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
