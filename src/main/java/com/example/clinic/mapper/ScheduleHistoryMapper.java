package com.example.clinic.mapper;

import com.example.clinic.model.dto.ScheduleHistoryDTO;
import com.example.clinic.model.entity.ScheduleHistory;
import org.springframework.stereotype.Component;

@Component
public class ScheduleHistoryMapper {

    // Entity → DTO
    public ScheduleHistoryDTO toDTO(ScheduleHistory entity) {
        if (entity == null) return null;

        return ScheduleHistoryDTO.builder()
                .id(entity.getId())
                .action(entity.getAction())
                .content(entity.getContent()) //  統整醫師 + 時段資訊
                .timestamp(entity.getTimestamp())
                .username(entity.getUser() != null ? entity.getUser().getUsername() : null) 
                .build();
    }

    // DTO → Entity
    public ScheduleHistory toEntity(ScheduleHistoryDTO dto) {
        if (dto == null) return null;

        return ScheduleHistory.builder()
                .id(dto.getId())
                .action(dto.getAction())
                .content(dto.getContent())
                .timestamp(dto.getTimestamp())
                .build(); 
    }
}
