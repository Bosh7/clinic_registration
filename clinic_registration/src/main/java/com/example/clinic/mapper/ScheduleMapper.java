package com.example.clinic.mapper;

import com.example.clinic.model.dto.ScheduleDTO;
import com.example.clinic.model.entity.Schedule;
import com.example.clinic.model.entity.Doctor;
import org.springframework.stereotype.Component;

@Component
public class ScheduleMapper {

    // Entity → DTO
    public ScheduleDTO toDTO(Schedule schedule) {
        return ScheduleDTO.builder()
                .id(schedule.getId())
                .doctorId(
                        schedule.getDoctor() != null ? schedule.getDoctor().getId() : null)
                .doctorName(
                        schedule.getDoctor() != null ? schedule.getDoctor().getName() : null)
                .dayOfWeek(schedule.getDayOfWeek())
                .timePeriod(schedule.getTimePeriod())
                .available(schedule.getAvailable())
                .departmentName(
                        (schedule.getDoctor() != null && schedule.getDoctor().getDepartment() != null)
                                ? schedule.getDoctor().getDepartment().getName()
                                : null)
                .createdByUsername(
                        schedule.getCreatedBy() != null ? schedule.getCreatedBy().getUsername() : null)
                .build();
    }


    // DTO → Entity
    public Schedule toEntity(ScheduleDTO dto, Doctor doctor) {
        return Schedule.builder()
                .id(dto.getId())
                .doctor(doctor)
                .dayOfWeek(dto.getDayOfWeek())
                .timePeriod(dto.getTimePeriod())
                .available(dto.getAvailable())
                .build();
    }
}
