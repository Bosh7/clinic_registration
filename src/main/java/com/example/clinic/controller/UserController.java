package com.example.clinic.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.clinic.model.dto.UserDTO;
import com.example.clinic.model.entity.User;
import com.example.clinic.repository.UserRepository;
import com.example.clinic.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // 查詢所有使用者
    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // 新增使用者
    @PostMapping
    public UserDTO createUser(@RequestBody UserDTO userDTO) {
        return userService.createUser(userDTO);
    }

    // 修改使用者角色
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        String newRole = request.get("role");

        if (!"ADMIN".equals(newRole) && !"USER".equals(newRole)) {
            return ResponseEntity.badRequest().body(" 無效的角色，只能是 ADMIN 或 USER");
        }

        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(" 找不到使用者");
        }

        User user = optionalUser.get();
        user.setRole(newRole);
        userRepository.save(user);

        return ResponseEntity.ok(" 角色更新成功");
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        Optional<User> userOpt = userRepository.findById(id);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("使用者不存在");
        }

        User user = userOpt.get();
        if ("admin".equalsIgnoreCase(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("admin 帳號不能被刪除");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("刪除成功");
    }

}
