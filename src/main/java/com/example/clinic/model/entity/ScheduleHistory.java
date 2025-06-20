package com.example.clinic.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "schedule_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String action;

    private String content;

    private LocalDateTime timestamp;

    // 關聯到 user 
    @ManyToOne
    @JoinColumn(name = "user_id")  
    private User user;
    
    // 關聯到 schedule
    @Column(name = "schedule_id")
    private Integer scheduleId; 
    
}
