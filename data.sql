-- Root-level canonical MySQL bootstrap for the current Employee Management backend.
--
-- What this file does:
--   1. Creates the default database used in local setup
--   2. Creates all MySQL tables the backend currently uses
--   3. Adds the required constraints and a small set of safe secondary indexes
--
-- Important runtime notes:
--   - This project also has Hibernate auto-DDL enabled via `spring.jpa.hibernate.ddl-auto=update`.
--   - If the database already exists and your MySQL user has CREATE/ALTER privileges,
--     the backend can create the tables automatically on startup.
--   - The backend does NOT create the database itself if `MYSQL_DB` points to a database
--     that does not exist yet.
--   - On backend startup, `DataInitializer` deletes and re-seeds `departments` and `employees`.
--   - The `users` table is created here, but user accounts are NOT seeded automatically.
--
-- Verified live relational schema:
--   departments(id, name)
--   employees(id, age, email, first_name, last_name, department_id)
--   users(id, username, password)

CREATE DATABASE IF NOT EXISTS employee_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE employee_management;

CREATE TABLE IF NOT EXISTS departments (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Maps to Department.id',
  name VARCHAR(255) NULL COMMENT 'Maps to Department.name',
  PRIMARY KEY (id),
  KEY idx_departments_name (name)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Maps to com.example.employeemanagement.model.Department';

CREATE TABLE IF NOT EXISTS users (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Maps to User.id',
  username VARCHAR(255) NOT NULL COMMENT 'Used for auth lookup and login',
  password VARCHAR(255) NOT NULL COMMENT 'Stores BCrypt-encoded password hashes',
  PRIMARY KEY (id),
  CONSTRAINT uk_users_username UNIQUE (username)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Maps to com.example.employeemanagement.model.User';

CREATE TABLE IF NOT EXISTS employees (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Maps to Employee.id',
  age INT NOT NULL COMMENT 'Maps to primitive int Employee.age',
  email VARCHAR(255) NULL COMMENT 'Maps to Employee.email',
  first_name VARCHAR(255) NULL COMMENT 'Maps to Employee.firstName',
  last_name VARCHAR(255) NULL COMMENT 'Maps to Employee.lastName',
  department_id BIGINT NOT NULL COMMENT 'Maps to Employee.department',
  PRIMARY KEY (id),
  KEY idx_employees_department_id (department_id),
  KEY idx_employees_email (email),
  KEY idx_employees_last_first (last_name, first_name),
  CONSTRAINT fk_employees_department
    FOREIGN KEY (department_id) REFERENCES departments (id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Maps to com.example.employeemanagement.model.Employee';

-- Index rationale:
--   idx_departments_name:
--     Cheap support for department name lookups/filtering as the dataset grows.
--   idx_employees_department_id:
--     Important for joins and department-scoped access patterns.
--   idx_employees_email:
--     Useful for operational lookups; intentionally non-unique because the backend
--     does not enforce email uniqueness.
--   idx_employees_last_first:
--     Helps with common employee list filtering/sorting by name.
