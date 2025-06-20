package com.example.clinic.service.impl;

import com.example.clinic.mapper.ScheduleHistoryMapper;
import com.example.clinic.model.dto.ScheduleHistoryDTO;
import com.example.clinic.model.entity.ScheduleHistory;
import com.example.clinic.model.entity.Schedule;
import com.example.clinic.model.entity.User;
import com.example.clinic.model.entity.Doctor;
import com.example.clinic.repository.ScheduleHistoryRepository;
import com.example.clinic.service.ScheduleHistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleHistoryServiceImpl implements ScheduleHistoryService {

    @Autowired
    private ScheduleHistoryRepository scheduleHistoryRepository;

    @Autowired
    private ScheduleHistoryMapper scheduleHistoryMapper;

    // 取得全部歷史紀錄
    @Override
    public List<ScheduleHistoryDTO> getAllHistory() {
        return scheduleHistoryRepository.findAll().stream()
                .map(scheduleHistoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 提供前端 API 用的建立歷史（通常不會用到 scheduleId）
    @Override
    public ScheduleHistoryDTO create(ScheduleHistoryDTO dto, User user) {
        ScheduleHistory entity = ScheduleHistory.builder()
                .action(dto.getAction())
                .content(dto.getContent())
                .timestamp(ZonedDateTime.now(ZoneId.of("Asia/Taipei")).toLocalDateTime())
                .scheduleId(dto.getScheduleId()) // 假如 DTO 有帶 scheduleId
                .user(user)
                .build();

        ScheduleHistory saved = scheduleHistoryRepository.save(entity);
        return scheduleHistoryMapper.toDTO(saved);
    }

    // 記錄新增排班歷史
    @Override
    public void recordAddHistory(Schedule schedule, User user) {
        Doctor doctor = schedule.getDoctor();
        String doctorName = (doctor != null) ? doctor.getName() : "未知醫師";
        String content = doctorName + " " +
                         schedule.getDayOfWeek() + " " +
                         schedule.getTimePeriod();

        ScheduleHistory history = ScheduleHistory.builder()
                .action("新增")
                .content(content)
                .timestamp(ZonedDateTime.now(ZoneId.of("Asia/Taipei")).toLocalDateTime())
                .scheduleId(schedule.getId())    // 關鍵：記錄 schedule id
                .user(user)
                .build();

        scheduleHistoryRepository.save(history);
    }

    // 記錄刪除排班的歷史
    @Override
    public void recordDeleteHistory(Schedule schedule, User user) {
        Doctor doctor = schedule.getDoctor();
        String doctorName = (doctor != null) ? doctor.getName() : "未知醫師";
        String content = doctorName + " " +
                         schedule.getDayOfWeek() + " " +
                         schedule.getTimePeriod();

        ScheduleHistory history = ScheduleHistory.builder()
                .action("刪除")
                .content(content)
                .timestamp(ZonedDateTime.now(ZoneId.of("Asia/Taipei")).toLocalDateTime())
                .scheduleId(schedule.getId())   // 關鍵：記錄 schedule id
                .user(user)
                .build();

        scheduleHistoryRepository.save(history);
    }
}
