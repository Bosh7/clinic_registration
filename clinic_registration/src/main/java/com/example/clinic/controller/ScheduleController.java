package com.example.clinic.controller;

import com.example.clinic.model.dto.ScheduleDTO;
import com.example.clinic.model.entity.User;
import com.example.clinic.service.ScheduleService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

//  API
@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    // 查詢全部排班
    @GetMapping
    public List<ScheduleDTO> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    // 根據醫師姓名查排班
    @GetMapping("/doctor")
    public List<ScheduleDTO> getByDoctor(@RequestParam String name) {
        return scheduleService.getSchedulesByDoctorName(name);
    }

    // 根據科別查排班
    @GetMapping("/department")
    public List<ScheduleDTO> getByDepartment(@RequestParam String name) {
        return scheduleService.getSchedulesByDepartment(name);
    }

    // 根據科別與日期查詢排班（例如：星期三的內科）
    @GetMapping("/search-by-department-and-date")
    public List<ScheduleDTO> findByDepartmentAndDate(
            @RequestParam String departmentName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return scheduleService.findByDepartmentAndDate(departmentName, date);
    }

    // 新增排班（需登入）
    @PostMapping
    public ResponseEntity<String> addSchedule(@RequestBody ScheduleDTO dto, HttpSession session) {
        User user = (User) session.getAttribute("currentUser"); // 必須與登入 session key 一致
        if (user == null) {
            return ResponseEntity.status(401).body("未登入，無法新增排班");
        }
        scheduleService.addSchedule(dto, user);
        return ResponseEntity.ok("新增排班成功");
    }

    // 刪除排班並記錄歷史（需登入）
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSchedule(@PathVariable Integer id, HttpSession session) {
        User user = (User) session.getAttribute("currentUser");
        if (user == null) {
            return ResponseEntity.status(401).body("未登入，無法刪除排班");
        }
        try {
            scheduleService.deleteScheduleWithHistory(id, user);
            return ResponseEntity.ok("排班已刪除");
        } catch (RuntimeException ex) {
            // 將錯誤訊息回傳給前端，方便 debug
            return ResponseEntity.badRequest().body("刪除失敗：" + ex.getMessage());
        } catch (Exception ex) {
            // 捕捉未知錯誤
            ex.printStackTrace();
            return ResponseEntity.status(500).body("伺服器錯誤，請聯絡管理員");
        	}
    	}
}