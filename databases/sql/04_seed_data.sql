-- ============================================================================
-- Employee Management — Seed Data
-- ============================================================================
-- Inserts sample departments, employees, and a demo user for local dev/testing.
-- Safe to re-run: uses INSERT IGNORE to skip existing rows.
--
-- NOTE: The Spring Boot app also seeds data via DataInitializer on startup
--       (50 departments + 295 employees using Faker). This script provides a
--       smaller, deterministic dataset for manual database setup or CI.
--
-- Run AFTER: 02_create_tables.sql
-- ============================================================================

USE employee_management;

-- ---------------------------------------------------------------------------
-- Departments (10 common departments)
-- ---------------------------------------------------------------------------
INSERT INTO departments (id, name) VALUES
  (1,  'Engineering'),
  (2,  'Human Resources'),
  (3,  'Marketing'),
  (4,  'Finance'),
  (5,  'Sales'),
  (6,  'Operations'),
  (7,  'Customer Support'),
  (8,  'Product Management'),
  (9,  'Legal'),
  (10, 'Research & Development')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ---------------------------------------------------------------------------
-- Employees (20 sample employees spread across departments)
-- ---------------------------------------------------------------------------
INSERT INTO employees (id, first_name, last_name, email, age, department_id) VALUES
  (1,  'Alice',   'Johnson',   'alice.johnson@company.com',    30, 1),
  (2,  'Bob',     'Smith',     'bob.smith@company.com',        28, 1),
  (3,  'Carol',   'Williams',  'carol.williams@company.com',   35, 2),
  (4,  'David',   'Brown',     'david.brown@company.com',      42, 3),
  (5,  'Emily',   'Davis',     'emily.davis@company.com',      26, 4),
  (6,  'Frank',   'Miller',    'frank.miller@company.com',     38, 5),
  (7,  'Grace',   'Wilson',    'grace.wilson@company.com',     31, 6),
  (8,  'Henry',   'Moore',     'henry.moore@company.com',      29, 7),
  (9,  'Irene',   'Taylor',    'irene.taylor@company.com',     45, 8),
  (10, 'Jack',    'Anderson',  'jack.anderson@company.com',    33, 9),
  (11, 'Karen',   'Thomas',    'karen.thomas@company.com',     27, 10),
  (12, 'Leo',     'Jackson',   'leo.jackson@company.com',      36, 1),
  (13, 'Maria',   'White',     'maria.white@company.com',      40, 2),
  (14, 'Nathan',  'Harris',    'nathan.harris@company.com',    24, 3),
  (15, 'Olivia',  'Martin',    'olivia.martin@company.com',    32, 4),
  (16, 'Paul',    'Garcia',    'paul.garcia@company.com',      37, 5),
  (17, 'Quinn',   'Martinez',  'quinn.martinez@company.com',   29, 6),
  (18, 'Rachel',  'Robinson',  'rachel.robinson@company.com',  34, 7),
  (19, 'Sam',     'Clark',     'sam.clark@company.com',        41, 8),
  (20, 'Tina',    'Lewis',     'tina.lewis@company.com',       25, 9)
ON DUPLICATE KEY UPDATE
  first_name    = VALUES(first_name),
  last_name     = VALUES(last_name),
  email         = VALUES(email),
  age           = VALUES(age),
  department_id = VALUES(department_id);

-- ---------------------------------------------------------------------------
-- Demo user (password: "password" — BCrypt hash)
-- ---------------------------------------------------------------------------
-- Use this account to test the /authenticate endpoint locally.
-- NEVER use this in production.
INSERT INTO users (id, username, password) VALUES
  (1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON DUPLICATE KEY UPDATE
  username = VALUES(username),
  password = VALUES(password);
