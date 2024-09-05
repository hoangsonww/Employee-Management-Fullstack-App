package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** This interface represents a repository for departments. */
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {}
