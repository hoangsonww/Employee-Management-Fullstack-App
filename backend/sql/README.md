# MySQL Bootstrap Guide

These SQL files describe the live relational schema used by the current backend:

- `01_create_database.mysql.sql`
- `02_create_tables.mysql.sql`
- `03_performance_optimizations.mysql.sql`

They are derived from the actual JPA entities under `backend/src/main/java`, not from the stale `data.sql` references in older docs.

## What The Backend Uses

The backend currently uses exactly three MySQL tables:

1. `departments`
2. `employees`
3. `users`

MongoDB is configured, but no current backend repository or model persists application data there.

## Recommended Setup For New Users

If you are starting with a blank MySQL server, use this flow:

1. Run `01_create_database.mysql.sql` to create the database.
2. Set `MYSQL_DB` and the other datasource variables to that database.
3. Start the backend.

With the current backend configuration, Spring Boot uses `spring.jpa.hibernate.ddl-auto=update`, so Hibernate will create the missing tables automatically when the application starts, as long as:

- the database itself already exists
- the MySQL user can connect to it
- the MySQL user has permission to create and alter tables

## Manual Setup Option

If you want to provision the schema yourself before starting the backend, run these files in order:

1. `01_create_database.mysql.sql`
2. `02_create_tables.mysql.sql`
3. `03_performance_optimizations.mysql.sql` (optional but recommended)

This is useful when:

- your database user does not have schema-management privileges
- you want the tables created before the app starts
- you want a reviewed SQL artifact for onboarding or deployment

The third script is an optional performance layer. It adds a few safe secondary indexes and refreshes optimizer statistics without changing the logical schema.

## Important Startup Behavior

When the backend starts:

- Hibernate can auto-create or update the tables because `ddl-auto=update` is enabled
- `DataInitializer` automatically deletes and re-seeds `departments` and `employees`
- `users` are not auto-seeded

That means:

- a blank existing database can become usable on startup
- a nonexistent database will not be created by the backend automatically
- a new login account must be created through the UI or auth API

## Auth Data

The `users` table stores login accounts for the authentication flows:

- `POST /register`
- `POST /authenticate`
- `GET /verify-username/{username}`
- `POST /reset-password`

Passwords are stored as BCrypt hashes in the `password` column.

## Column Naming Detail

One important detail for manual SQL users:

- Java field `firstName` maps to SQL column `first_name`
- Java field `lastName` maps to SQL column `last_name`

This is the runtime physical naming used by Spring Boot and Hibernate in this project.
