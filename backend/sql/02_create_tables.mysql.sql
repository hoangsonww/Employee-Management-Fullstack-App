-- Canonical MySQL table DDL for the current backend under `backend/src/main/java`.
-- Derived from the live JPA entities and verified against the runtime physical column names.
--
-- Tables actually used by the app:
--   1. departments
--   2. employees
--   3. users
--
-- Important notes:
--   - Spring Boot/Hibernate maps Employee.firstName -> first_name and
--     Employee.lastName -> last_name in SQL.
--   - `employees.age` is NOT NULL because the Java field is a primitive `int`.
--   - No SQL table is required for JWT tokens.
--   - MongoDB is configured, but no current backend model/repository persists to MongoDB.
--   - `users` are NOT seeded automatically. Register them through the UI or auth API.
--   - `departments` and `employees` ARE automatically re-seeded on backend startup by
--     `config/DataInitializer.java`.

USE employee_management;

CREATE TABLE departments (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Maps to Department.id',
  name VARCHAR(255) NULL COMMENT 'Maps to Department.name; nullable because no @Column(nullable = false)',
  PRIMARY KEY (id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Maps to com.example.employeemanagement.model.Department';

CREATE TABLE users (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Maps to User.id',
  username VARCHAR(255) NOT NULL COMMENT 'Maps to User.username; used for auth lookup',
  password VARCHAR(255) NOT NULL COMMENT 'Maps to User.password; stores BCrypt-encoded hashes',
  PRIMARY KEY (id),
  CONSTRAINT uk_users_username UNIQUE (username)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Maps to com.example.employeemanagement.model.User';

CREATE TABLE employees (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Maps to Employee.id',
  age INTEGER NOT NULL COMMENT 'Maps to primitive int Employee.age',
  email VARCHAR(255) NULL COMMENT 'Maps to Employee.email',
  first_name VARCHAR(255) NULL COMMENT 'Maps to Employee.firstName',
  last_name VARCHAR(255) NULL COMMENT 'Maps to Employee.lastName',
  department_id BIGINT NOT NULL COMMENT 'Maps to Employee.department via @JoinColumn(name = ''department_id'')',
  PRIMARY KEY (id),
  KEY idx_employees_department_id (department_id),
  CONSTRAINT fk_employees_department
    FOREIGN KEY (department_id) REFERENCES departments (id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Maps to com.example.employeemanagement.model.Employee';
