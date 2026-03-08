-- Optional performance layer for the current MySQL schema.
--
-- Purpose:
--   - Add a few non-destructive secondary indexes that are safe for the current app
--   - Refresh optimizer statistics after the indexes are in place
--
-- This script assumes:
--   - the `employee_management` database already exists
--   - the base tables from `02_create_tables.mysql.sql` already exist
--
-- If you use a different database name, update the `USE` statement below.

USE employee_management;

DROP PROCEDURE IF EXISTS add_index_if_missing;

DELIMITER //

CREATE PROCEDURE add_index_if_missing(
  IN p_table_name VARCHAR(64),
  IN p_index_name VARCHAR(64),
  IN p_index_columns_sql TEXT
)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = p_table_name
      AND index_name = p_index_name
  ) THEN
    SET @ddl = CONCAT(
      'ALTER TABLE `',
      p_table_name,
      '` ADD INDEX `',
      p_index_name,
      '` ',
      p_index_columns_sql
    );

    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END//

DELIMITER ;

-- Department name lookup/filter support.
CALL add_index_if_missing('departments', 'idx_departments_name', '(`name`)');

-- Operational employee lookup by email.
CALL add_index_if_missing('employees', 'idx_employees_email', '(`email`)');

-- Name-oriented employee list filtering/sorting support.
CALL add_index_if_missing('employees', 'idx_employees_last_first', '(`last_name`, `first_name`)');

-- Refresh optimizer statistics after index creation.
ANALYZE TABLE departments, employees, users;

DROP PROCEDURE IF EXISTS add_index_if_missing;
