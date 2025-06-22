package com.example.clinic.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

import java.util.Random;

@RestController
public class CaptchaController {

    @GetMapping("/api/captcha")
    public String getTextCaptcha(HttpSession session) {
        // 產生四位數隨機數字驗證碼
        String code = String.format("%04d", new Random().nextInt(10000));
        session.setAttribute("captcha", code); // 存入 Session
        return code; // 直接傳回文字
    }
}
