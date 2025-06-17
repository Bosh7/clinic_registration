package com.example.clinic.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleDTO {

    private Integer id;
    private Integer doctorId;
    private String doctorName;
    private String dayOfWeek;     
    private String timePeriod;   
    private Boolean available;
    private String departmentName;
    private String createdByUsername;
}
