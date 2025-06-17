package com.example.clinic.service;

import com.example.clinic.model.dto.ScheduleHistoryDTO;
import com.example.clinic.model.entity.Schedule;
import com.example.clinic.model.entity.User;

import java.util.List;

public interface ScheduleHistoryService {
    List<ScheduleHistoryDTO> getAllHistory();
    ScheduleHistoryDTO create(ScheduleHistoryDTO dto, User user);
    void recordAddHistory(Schedule schedule, User user);
    void recordDeleteHistory(Schedule schedule, User user);
}
	