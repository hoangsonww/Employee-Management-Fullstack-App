-- ============================================================================
-- Employee Management — Table Definitions
-- ============================================================================
-- Creates all three tables used by the Spring Boot backend.
-- Matches the JPA entity mappings in backend/src/main/java/.../model/
--
-- Run AFTER: 01_create_database.sql
-- ============================================================================

USE employee_management;

-- ---------------------------------------------------------------------------
-- departments
-- ---------------------------------------------------------------------------
-- Maps to: com.example.employeemanagement.model.Department
-- JPA relationship: OneToMany → Employee (mappedBy = "department")
-- Cascade: PERSIST, MERGE only (no CASCADE DELETE on employees)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
  id   BIGINT       NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
-- Maps to: com.example.employeemanagement.model.User
-- Used by: AuthController (register, authenticate, reset-password)
-- Password column stores BCrypt hashes (~60 chars, but 255 allows headroom)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id       BIGINT       NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT uk_users_username UNIQUE (username)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- employees
-- ---------------------------------------------------------------------------
-- Maps to: com.example.employeemanagement.model.Employee
-- JPA relationship: ManyToOne → Department (FetchType.EAGER)
-- Validation: age 18–65, email format, firstName/lastName not blank
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  first_name    VARCHAR(255) NOT NULL,
  last_name     VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  age           INT          NOT NULL,
  department_id BIGINT       NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_employees_department
    FOREIGN KEY (department_id) REFERENCES departments (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
