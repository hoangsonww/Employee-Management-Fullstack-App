-- ============================================================================
-- Employee Management — Stored Procedures
-- ============================================================================
-- Optional utility procedures for common operations. These complement the
-- Spring Boot service layer and are useful for:
--   - DBA maintenance tasks
--   - Data migration scripts
--   - CI/CD health checks
--   - Ad-hoc reporting
--
-- Run AFTER: 02_create_tables.sql
-- ============================================================================

USE employee_management;

DELIMITER //

-- ---------------------------------------------------------------------------
-- sp_get_employees_by_department
-- ---------------------------------------------------------------------------
-- Returns all employees in a given department.
-- Usage: CALL sp_get_employees_by_department(1);
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_get_employees_by_department //
CREATE PROCEDURE sp_get_employees_by_department(IN p_department_id BIGINT)
BEGIN
  SELECT
    e.id,
    e.first_name,
    e.last_name,
    e.email,
    e.age,
    d.name AS department_name
  FROM employees e
  JOIN departments d ON e.department_id = d.id
  WHERE d.id = p_department_id
  ORDER BY e.last_name, e.first_name;
END //

-- ---------------------------------------------------------------------------
-- sp_search_employees
-- ---------------------------------------------------------------------------
-- Full-text-style search across employee name and email.
-- Usage: CALL sp_search_employees('alice');
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_search_employees //
CREATE PROCEDURE sp_search_employees(IN p_search VARCHAR(255))
BEGIN
  SET @term = CONCAT('%', p_search, '%');
  SELECT
    e.id,
    e.first_name,
    e.last_name,
    e.email,
    e.age,
    d.name AS department_name
  FROM employees e
  JOIN departments d ON e.department_id = d.id
  WHERE e.first_name LIKE @term
     OR e.last_name  LIKE @term
     OR e.email      LIKE @term
  ORDER BY e.last_name, e.first_name;
END //

-- ---------------------------------------------------------------------------
-- sp_transfer_employee
-- ---------------------------------------------------------------------------
-- Moves an employee from one department to another.
-- Returns 1 on success, 0 if employee or target department not found.
-- Usage: CALL sp_transfer_employee(5, 3, @result); SELECT @result;
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_transfer_employee //
CREATE PROCEDURE sp_transfer_employee(
  IN  p_employee_id      BIGINT,
  IN  p_new_department_id BIGINT,
  OUT p_success           TINYINT
)
BEGIN
  DECLARE v_emp_exists INT DEFAULT 0;
  DECLARE v_dept_exists INT DEFAULT 0;

  SELECT COUNT(*) INTO v_emp_exists  FROM employees   WHERE id = p_employee_id;
  SELECT COUNT(*) INTO v_dept_exists FROM departments WHERE id = p_new_department_id;

  IF v_emp_exists = 1 AND v_dept_exists = 1 THEN
    UPDATE employees SET department_id = p_new_department_id WHERE id = p_employee_id;
    SET p_success = 1;
  ELSE
    SET p_success = 0;
  END IF;
END //

-- ---------------------------------------------------------------------------
-- sp_department_headcount_report
-- ---------------------------------------------------------------------------
-- Returns a summary of all departments with employee counts, sorted by size.
-- Usage: CALL sp_department_headcount_report();
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_department_headcount_report //
CREATE PROCEDURE sp_department_headcount_report()
BEGIN
  SELECT
    d.id              AS department_id,
    d.name            AS department_name,
    COUNT(e.id)       AS employee_count,
    MIN(e.age)        AS youngest,
    MAX(e.age)        AS oldest,
    ROUND(AVG(e.age), 1) AS avg_age
  FROM departments d
  LEFT JOIN employees e ON e.department_id = d.id
  GROUP BY d.id, d.name
  ORDER BY employee_count DESC, d.name;
END //

-- ---------------------------------------------------------------------------
-- sp_purge_empty_departments
-- ---------------------------------------------------------------------------
-- Deletes departments that have zero employees. Returns the count deleted.
-- Usage: CALL sp_purge_empty_departments(@deleted); SELECT @deleted;
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_purge_empty_departments //
CREATE PROCEDURE sp_purge_empty_departments(OUT p_deleted INT)
BEGIN
  DELETE d FROM departments d
  LEFT JOIN employees e ON e.department_id = d.id
  WHERE e.id IS NULL;

  SET p_deleted = ROW_COUNT();
END //

-- ---------------------------------------------------------------------------
-- sp_health_check
-- ---------------------------------------------------------------------------
-- Quick sanity check for CI/CD or monitoring.
-- Returns row counts for all tables and the current server time.
-- Usage: CALL sp_health_check();
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_health_check //
CREATE PROCEDURE sp_health_check()
BEGIN
  SELECT
    (SELECT COUNT(*) FROM departments) AS department_count,
    (SELECT COUNT(*) FROM employees)   AS employee_count,
    (SELECT COUNT(*) FROM users)       AS user_count,
    NOW()                              AS server_time,
    VERSION()                          AS mysql_version;
END //

DELIMITER ;
