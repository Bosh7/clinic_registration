package com.example.clinic.util;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Aspect
@Component
public class LogAspect {

    @Before("execution(public * com.example.clinic.service.impl.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String method = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        System.out.println("【操作日誌】" + LocalDateTime.now() + 
                "，執行 " + className + "." + method +
                "，參數：" + Arrays.toString(args));
    }
}
