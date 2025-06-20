package com.example.clinic.controller;

import com.example.clinic.model.dto.ScheduleHistoryDTO;
import com.example.clinic.model.entity.User;
import com.example.clinic.service.ScheduleHistoryService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule-history")
public class ScheduleHistoryController {

    @Autowired
    private ScheduleHistoryService scheduleHistoryService;

    // 建立歷史紀錄
    @PostMapping
    public ScheduleHistoryDTO create(@RequestBody ScheduleHistoryDTO dto, HttpSession session) {
        // 從 session 取得登入使用者
        User user = (User) session.getAttribute("currentUser");
        if (user == null) {
            throw new RuntimeException("未登入，無法建立歷史紀錄");
        }
        return scheduleHistoryService.create(dto, user);
    }

    // 取得所有歷史紀錄
    @GetMapping
    public List<ScheduleHistoryDTO> getAll() {
        return scheduleHistoryService.getAllHistory();
    }
}
