package com.example.clinic.repository;

import com.example.clinic.model.entity.Department;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {

    // 根據名稱查詢科別
    boolean existsByName(String name);
    
    List<Department> findByCategory(String category);

}
