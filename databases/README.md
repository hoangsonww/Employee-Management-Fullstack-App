# Database Setup

This directory contains all database setup scripts for the Employee Management application. The backend supports **MySQL** as its primary database and **MongoDB** as a secondary/alternative store.

## Directory Structure

```
databases/
├── README.md               ← You are here
├── sql/                    ← MySQL setup scripts
│   ├── 01_create_database.sql
│   ├── 02_create_tables.sql
│   ├── 03_indexes.sql
│   ├── 04_seed_data.sql
│   ├── 05_views.sql
│   ├── 06_stored_procedures.sql
│   └── 07_full_setup.sql   ← All-in-one runner
└── mongo/                  ← MongoDB setup scripts
    ├── 01_init_database.js
    ├── 02_indexes.js
    ├── 03_seed_data.js
    ├── 04_views.js
    ├── 05_drop_all.js       ← Reset script
    └── 06_full_setup.js     ← All-in-one runner
```

## Schema Overview

Both databases share the same logical schema with three entities:

```
┌──────────────┐       1:N       ┌──────────────────┐
│  departments │────────────────▶│    employees     │
├──────────────┤                 ├──────────────────┤
│ id (PK)      │                 │ id (PK)          │
│ name         │                 │ first_name       │
└──────────────┘                 │ last_name        │
                                 │ email            │
┌──────────────┐                 │ age (18–65)      │
│    users     │                 │ department_id(FK)│
├──────────────┤                 └──────────────────┘
│ id (PK)      │
│ username (UQ)│
│ password     │  ← BCrypt hash
└──────────────┘
```

**Relationships:**
- One **Department** has many **Employees**
- Each **Employee** belongs to exactly one **Department**
- **Users** are standalone (authentication only — no FK to employees)

**Constraints:**
- `employees.age` must be between 18 and 65
- `users.username` must be unique
- `employees.department_id` is a required foreign key
- Deleting a department with employees is blocked (`ON DELETE RESTRICT` / no cascade)

---

## MySQL Setup

### Prerequisites

- MySQL 8.0+
- A user with `CREATE DATABASE` privileges (for initial setup)

### Quick Start (All-in-One)

```bash
mysql -u root -p < databases/sql/07_full_setup.sql
```

This runs all scripts in order and verifies the setup with a health check.

### Step-by-Step

```bash
# 1. Create the database
mysql -u root -p < databases/sql/01_create_database.sql

# 2. Create tables (departments, employees, users)
mysql -u root -p < databases/sql/02_create_tables.sql

# 3. Add performance indexes (optional but recommended)
mysql -u root -p < databases/sql/03_indexes.sql

# 4. Insert seed data (optional — app also seeds on startup)
mysql -u root -p < databases/sql/04_seed_data.sql

# 5. Create views (optional — useful for reporting)
mysql -u root -p < databases/sql/05_views.sql

# 6. Create stored procedures (optional — DBA utilities)
mysql -u root -p < databases/sql/06_stored_procedures.sql
```

### Script Details

| Script | Purpose | Required? |
|--------|---------|-----------|
| `01_create_database.sql` | Creates `employee_management` database with utf8mb4 | Yes |
| `02_create_tables.sql` | DDL for all 3 tables with constraints and FK | Yes |
| `03_indexes.sql` | Secondary indexes for query performance | Recommended |
| `04_seed_data.sql` | 10 departments + 20 employees + 1 demo user | Optional |
| `05_views.sql` | 4 read-only views matching DTO response shapes | Optional |
| `06_stored_procedures.sql` | 6 utility procedures (search, transfer, report, health check) | Optional |
| `07_full_setup.sql` | Runs all scripts in order | Convenience |

### Views

| View | Description |
|------|-------------|
| `v_employees_with_department` | Employees joined with department name |
| `v_department_summary` | Departments with employee count |
| `v_department_age_stats` | Per-department min/max/avg age |
| `v_empty_departments` | Departments with zero employees |

### Stored Procedures

| Procedure | Usage |
|-----------|-------|
| `sp_get_employees_by_department(dept_id)` | List employees in a department |
| `sp_search_employees(search_term)` | Search by name or email |
| `sp_transfer_employee(emp_id, new_dept_id, @result)` | Move employee between departments |
| `sp_department_headcount_report()` | Department sizes with age stats |
| `sp_purge_empty_departments(@deleted)` | Remove empty departments |
| `sp_health_check()` | Row counts + server info |

### Connecting the Backend

Set these environment variables (or add to `backend/config.properties`):

```properties
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=employee_management
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_SSL_MODE=PREFERRED
```

### Note on Hibernate Auto-DDL

The backend uses `spring.jpa.hibernate.ddl-auto=update`, which means Hibernate will automatically create/update tables on startup. The SQL scripts here are provided for:

- Environments where the app user lacks DDL privileges
- Reviewed, version-controlled schema artifacts
- CI/CD pipelines and database provisioning
- Manual setup before first app start

---

## MongoDB Setup

### Prerequisites

- MongoDB 6.0+ (or compatible)
- `mongosh` shell installed

### Quick Start (All-in-One)

```bash
mongosh < databases/mongo/06_full_setup.js
```

This creates collections with schema validation, indexes, seed data, and views.

### Step-by-Step

```bash
# 1. Create collections with schema validators
mongosh < databases/mongo/01_init_database.js

# 2. Create indexes
mongosh < databases/mongo/02_indexes.js

# 3. Insert seed data (optional)
mongosh < databases/mongo/03_seed_data.js

# 4. Create aggregation views (optional)
mongosh < databases/mongo/04_views.js
```

### Reset (Drop Everything)

```bash
mongosh < databases/mongo/05_drop_all.js
```

### Script Details

| Script | Purpose | Required? |
|--------|---------|-----------|
| `01_init_database.js` | Collections with JSON Schema validators | Yes |
| `02_indexes.js` | 7 indexes matching MySQL strategy | Recommended |
| `03_seed_data.js` | Same seed data as SQL (10 depts + 20 emps + 1 user) | Optional |
| `04_views.js` | 4 aggregation views matching SQL views | Optional |
| `05_drop_all.js` | Drops all collections and views | Utility |
| `06_full_setup.js` | Complete setup in one file | Convenience |

### Schema Validation

MongoDB collections enforce the same constraints as MySQL via `$jsonSchema` validators:

- **departments**: `name` required, string, 1–255 chars
- **employees**: All fields required, `age` 18–65 (int), `departmentId` as ObjectId reference
- **users**: `username` and `password` required, username has unique index

### Connecting the Backend

Set the MongoDB URI in your environment:

```properties
MONGO_URI=mongodb://localhost:27017/employee_management
```

The backend currently has MongoDB configured but does not actively use it for data persistence. The Spring Data MongoDB dependency and configuration are in place for future use.

---

## Docker Compose

Both databases are available via Docker Compose from the project root:

```bash
docker-compose up mysql mongodb
```

This starts:
- **MySQL 8.0** on port `3306` (root password: `password`, database: `employee_management`)
- **MongoDB 6.0** on port `27017`

See `docker-compose.yml` in the project root for full configuration.

---

## Seed Data

Both SQL and MongoDB seed scripts provide the same deterministic dataset:

- **10 departments**: Engineering, Human Resources, Marketing, Finance, Sales, Operations, Customer Support, Product Management, Legal, Research & Development
- **20 employees**: Distributed across departments with ages 24–45
- **1 demo user**: username `admin`, password `password`

The Spring Boot `DataInitializer` also seeds data on startup (50 departments + 295 employees using Faker), but only if the database is empty. The scripts here provide a smaller, deterministic dataset for manual or CI setup.
