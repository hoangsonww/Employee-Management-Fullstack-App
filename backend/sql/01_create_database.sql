-- ============================================================================
-- Employee Management — Database Creation
-- ============================================================================
-- Run this FIRST before any other scripts.
-- Requires a MySQL user with CREATE DATABASE privileges.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS employee_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Create a dedicated application user (optional — adjust credentials as needed)
-- Uncomment the following lines if you want a non-root user for the app:
--
-- CREATE USER IF NOT EXISTS 'emp_app'@'%' IDENTIFIED BY 'change_me_in_production';
-- GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP
--   ON employee_management.* TO 'emp_app'@'%';
-- FLUSH PRIVILEGES;
