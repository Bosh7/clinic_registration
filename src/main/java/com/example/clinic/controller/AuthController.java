package com.example.clinic.controller;

import com.example.clinic.model.dto.UserLoginDTO;
import com.example.clinic.model.dto.LoginResponseDTO;
import com.example.clinic.model.entity.User;
import com.example.clinic.repository.UserRepository;
import com.example.clinic.response.ApiResponse;
import com.example.clinic.util.Hash;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    /**
     * 登入功能
     * @param dto 前端傳來的帳號、密碼、驗證碼
     * @param session HttpSession 用來存放登入資訊
     */
    @PostMapping("/login")
    public ApiResponse<LoginResponseDTO> login(@RequestBody UserLoginDTO dto, HttpSession session) {
        // 驗證驗證碼
        String sessionCaptcha = (String) session.getAttribute("captcha");
        if (sessionCaptcha == null || dto.getCaptcha() == null
                || !sessionCaptcha.equalsIgnoreCase(dto.getCaptcha())) {
            return ApiResponse.fail(400, "驗證失敗，請重新輸入");
        }
        // 查詢帳號
        Optional<User> optionalUser = userRepository.findByUsername(dto.getUsername());
        if (optionalUser.isEmpty()) {
            return ApiResponse.fail(400, "驗證失敗，請重新輸入");
        }
        User user = optionalUser.get();
        // 驗證密碼
        String inputHash = Hash.getHash(dto.getPassword(), user.getSalt());
        if (!inputHash.equals(user.getPassword())) {
            return ApiResponse.fail(400, "驗證失敗，請重新輸入");
        }
        // 登入成功，把 User 放到 session
        session.setAttribute("currentUser", user);

        // 回傳登入成功資訊
        LoginResponseDTO response = LoginResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .build();
        return ApiResponse.success(response);
    }

    /**
     * 登出功能
     * @param session HttpSession
     */
    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpSession session) {
        session.invalidate(); // 清空 session
        return ApiResponse.success(null);
    }

    /**
     * 檢查 session 是否仍有效，回傳目前登入者資訊（給前端輪詢用）
     */
    @GetMapping("/me")
    public ApiResponse<LoginResponseDTO> getCurrentUser(HttpSession session) {
        Object obj = session.getAttribute("currentUser");
        if (!(obj instanceof User)) {
            return ApiResponse.fail(401, "未登入或登入逾時");
        }
        User user = (User) obj;
        LoginResponseDTO response = LoginResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .build();
        return ApiResponse.success(response);
    }
}
