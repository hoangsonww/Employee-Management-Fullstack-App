-- ============================================================================
-- Employee Management — Indexes & Performance Optimizations
-- ============================================================================
-- Safe secondary indexes that improve query performance without changing
-- the logical schema. All indexes are idempotent (CREATE INDEX IF NOT EXISTS
-- is not supported in MySQL, so we use a procedure to skip existing ones).
--
-- Run AFTER: 02_create_tables.sql
-- ============================================================================

USE employee_management;

-- ---------------------------------------------------------------------------
-- Helper: create index only if it does not already exist
-- ---------------------------------------------------------------------------
DELIMITER //
DROP PROCEDURE IF EXISTS add_index_if_missing //
CREATE PROCEDURE add_index_if_missing(
  IN p_table  VARCHAR(64),
  IN p_index  VARCHAR(64),
  IN p_ddl    VARCHAR(512)
)
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME  = p_table
      AND INDEX_NAME   = p_index
  ) THEN
    SET @sql = p_ddl;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END //
DELIMITER ;

-- ---------------------------------------------------------------------------
-- departments indexes
-- ---------------------------------------------------------------------------
-- Supports: department name lookup, filtering, and sorting
CALL add_index_if_missing(
  'departments',
  'idx_departments_name',
  'CREATE INDEX idx_departments_name ON departments (name)'
);

-- ---------------------------------------------------------------------------
-- employees indexes
-- ---------------------------------------------------------------------------
-- Supports: JOIN on department_id (critical for findAllWithDepartments)
CALL add_index_if_missing(
  'employees',
  'idx_employees_department_id',
  'CREATE INDEX idx_employees_department_id ON employees (department_id)'
);

-- Supports: employee lookup by email
CALL add_index_if_missing(
  'employees',
  'idx_employees_email',
  'CREATE INDEX idx_employees_email ON employees (email)'
);

-- Supports: name-based sorting and filtering in employee lists
CALL add_index_if_missing(
  'employees',
  'idx_employees_last_first',
  'CREATE INDEX idx_employees_last_first ON employees (last_name, first_name)'
);

-- Supports: age range queries and validation checks
CALL add_index_if_missing(
  'employees',
  'idx_employees_age',
  'CREATE INDEX idx_employees_age ON employees (age)'
);

-- ---------------------------------------------------------------------------
-- users indexes
-- ---------------------------------------------------------------------------
-- username already has a UNIQUE constraint which creates an implicit index.
-- No additional indexes needed for the current query patterns.

-- ---------------------------------------------------------------------------
-- Refresh optimizer statistics
-- ---------------------------------------------------------------------------
ANALYZE TABLE departments;
ANALYZE TABLE employees;
ANALYZE TABLE users;

-- Clean up helper procedure
DROP PROCEDURE IF EXISTS add_index_if_missing;
