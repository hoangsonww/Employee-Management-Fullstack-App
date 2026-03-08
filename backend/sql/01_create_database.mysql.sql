-- Canonical MySQL bootstrap for the current Spring Boot backend.
-- Default database name in local docs/docker is `employee_management`.
-- If you use a different database name, update MYSQL_DB or spring.datasource.url to match.
--
-- This file creates only the database.
-- With the current Spring Boot setting `spring.jpa.hibernate.ddl-auto=update`,
-- the backend can create the tables automatically on first startup if:
--   1. this database already exists
--   2. the datasource user can create/alter tables inside it
--
-- If you want to provision the tables manually before boot, run:
--   1. 01_create_database.mysql.sql
--   2. 02_create_tables.mysql.sql

CREATE DATABASE IF NOT EXISTS employee_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE employee_management;
