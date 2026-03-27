-- ============================================================================
-- Employee Management — Views
-- ============================================================================
-- Read-only views that simplify common queries. These mirror the response
-- shapes used by the backend DTOs.
--
-- Run AFTER: 02_create_tables.sql
-- ============================================================================

USE employee_management;

-- ---------------------------------------------------------------------------
-- v_employees_with_department
-- ---------------------------------------------------------------------------
-- Mirrors EmployeeResponseDto — flattens the department join into a single row.
-- Useful for reporting, admin dashboards, and ad-hoc queries.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_employees_with_department AS
SELECT
  e.id              AS employee_id,
  e.first_name,
  e.last_name,
  e.email,
  e.age,
  d.id              AS department_id,
  d.name            AS department_name
FROM employees e
JOIN departments d ON e.department_id = d.id;

-- ---------------------------------------------------------------------------
-- v_department_summary
-- ---------------------------------------------------------------------------
-- Mirrors DepartmentResponseDto — shows each department with its employee count.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_department_summary AS
SELECT
  d.id              AS department_id,
  d.name            AS department_name,
  COUNT(e.id)       AS employee_count
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id
GROUP BY d.id, d.name;

-- ---------------------------------------------------------------------------
-- v_department_age_stats
-- ---------------------------------------------------------------------------
-- Per-department age statistics for HR analytics.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_department_age_stats AS
SELECT
  d.id              AS department_id,
  d.name            AS department_name,
  COUNT(e.id)       AS employee_count,
  MIN(e.age)        AS min_age,
  MAX(e.age)        AS max_age,
  ROUND(AVG(e.age), 1) AS avg_age
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id
GROUP BY d.id, d.name;

-- ---------------------------------------------------------------------------
-- v_empty_departments
-- ---------------------------------------------------------------------------
-- Departments with zero employees — useful for cleanup or auditing.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_empty_departments AS
SELECT
  d.id   AS department_id,
  d.name AS department_name
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id
WHERE e.id IS NULL;
