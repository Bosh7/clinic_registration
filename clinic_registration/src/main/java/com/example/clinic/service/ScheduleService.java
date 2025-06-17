package com.example.clinic.service;

import com.example.clinic.model.dto.ScheduleDTO;
import com.example.clinic.model.entity.User;
import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {

    // 查詢所有排班
    List<ScheduleDTO> getAllSchedules();

    // 根據醫師姓名查詢排班
    List<ScheduleDTO> getSchedulesByDoctorName(String doctorName);

    // 根據科別名稱查詢排班
    List<ScheduleDTO> getSchedulesByDepartment(String departmentName);

    // 根據科別 + 日期查詢（轉為星期幾後找出該日的排班）
    List<ScheduleDTO> findByDepartmentAndDate(String departmentName, LocalDate date);

    // 新增排班
    void addSchedule(ScheduleDTO dto, User user);

    // 刪除排班並記錄歷史
    void deleteScheduleWithHistory(Integer id, User user);

}
