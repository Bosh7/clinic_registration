package com.example.clinic.service.impl;

import com.example.clinic.mapper.ScheduleMapper;
import com.example.clinic.model.dto.ScheduleDTO;
import com.example.clinic.model.entity.Doctor;
import com.example.clinic.model.entity.Schedule;
import com.example.clinic.model.entity.User;
import com.example.clinic.repository.DoctorRepository;
import com.example.clinic.repository.ScheduleRepository;
import com.example.clinic.service.ScheduleHistoryService;
import com.example.clinic.service.ScheduleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ScheduleMapper scheduleMapper;

    @Autowired
    private ScheduleHistoryService scheduleHistoryService;

    // 查詢所有排班
    @Override
    public List<ScheduleDTO> getAllSchedules() {
        return scheduleRepository.findAll().stream()
                .map(scheduleMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 根據醫師姓名查詢排班
    @Override
    public List<ScheduleDTO> getSchedulesByDoctorName(String doctorName) {
        return scheduleRepository.findByDoctorName(doctorName).stream()
                .map(scheduleMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 根據科別名稱查詢排班
    @Override
    public List<ScheduleDTO> getSchedulesByDepartment(String departmentName) {
        return scheduleRepository.findByDoctorDepartmentName(departmentName).stream()
                .map(scheduleMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 根據科別與日期（自動轉星期）查詢排班
    @Override
    public List<ScheduleDTO> findByDepartmentAndDate(String departmentName, LocalDate date) {
        String chineseDay = convertToChineseDay(date.getDayOfWeek());
        List<Doctor> doctors = doctorRepository.findByDepartmentName(departmentName);
        List<Integer> doctorIds = doctors.stream().map(Doctor::getId).collect(Collectors.toList());

        if (doctorIds.isEmpty()) return List.of();

        return scheduleRepository.findByDoctorIdInAndDayOfWeek(doctorIds, chineseDay).stream()
                .map(scheduleMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 新增排班，同時記錄建立者與歷史紀錄
    @Override
    public void addSchedule(ScheduleDTO dto, User user) {
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("醫師不存在，無法建立排班！"));
        Schedule entity = scheduleMapper.toEntity(dto, doctor);
        entity.setCreatedBy(user);
        Schedule saved = scheduleRepository.save(entity);
        scheduleHistoryService.recordAddHistory(saved, user);
    }

    // 刪除排班，必定記錄刪除歷史（外部唯一可用的刪除方法）
    @Override
    public void deleteScheduleWithHistory(Integer id, User user) {
        Optional<Schedule> optionalSchedule = scheduleRepository.findById(id);
        if (optionalSchedule.isPresent()) {
            Schedule deleted = optionalSchedule.get();
            // 1. 先記錄歷史，這時 schedule 還存在，schedule_id 是有效的
            scheduleHistoryService.recordDeleteHistory(deleted, user);
            // 2. 再刪除 schedule
            scheduleRepository.deleteById(id);
        } else {
            throw new RuntimeException("找不到此排班，無法刪除");
        }
    }


    // 英文星期轉中文
    private String convertToChineseDay(DayOfWeek day) {
        return switch (day) {
            case MONDAY -> "星期一";
            case TUESDAY -> "星期二";
            case WEDNESDAY -> "星期三";
            case THURSDAY -> "星期四";
            case FRIDAY -> "星期五";
            case SATURDAY -> "星期六";
            case SUNDAY -> "星期日";
        };
    }
}
