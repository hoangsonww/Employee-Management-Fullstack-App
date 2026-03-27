-- ============================================================================
-- Employee Management — Full Setup (All-in-One)
-- ============================================================================
-- Runs the complete SQL setup in order. Use this for a single-command
-- bootstrap of a fresh MySQL instance.
--
-- Usage:
--   mysql -u root -p < databases/sql/07_full_setup.sql
-- ============================================================================

SOURCE databases/sql/01_create_database.sql;
SOURCE databases/sql/02_create_tables.sql;
SOURCE databases/sql/03_indexes.sql;
SOURCE databases/sql/04_seed_data.sql;
SOURCE databases/sql/05_views.sql;
SOURCE databases/sql/06_stored_procedures.sql;

-- Verify setup
USE employee_management;
CALL sp_health_check();
