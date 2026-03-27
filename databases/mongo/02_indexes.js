// ============================================================================
// Employee Management — MongoDB Indexes
// ============================================================================
// Creates indexes that match the MySQL index strategy and support the
// application's query patterns.
//
// Run AFTER: 01_init_database.js
//
// Usage:
//   mongosh < databases/mongo/02_indexes.js
// ============================================================================

const DB_NAME = "employee_management";
db = db.getSiblingDB(DB_NAME);

print(`\n=== Creating indexes for: ${DB_NAME} ===\n`);

// ---------------------------------------------------------------------------
// departments indexes
// ---------------------------------------------------------------------------
// Supports department name lookup and filtering
db.departments.createIndex(
  { name: 1 },
  { name: "idx_departments_name" }
);
print("  ✓ departments.idx_departments_name");

// ---------------------------------------------------------------------------
// employees indexes
// ---------------------------------------------------------------------------
// Supports: lookup by department (equivalent to FK index in MySQL)
db.employees.createIndex(
  { departmentId: 1 },
  { name: "idx_employees_department_id" }
);
print("  ✓ employees.idx_employees_department_id");

// Supports: employee lookup by email
db.employees.createIndex(
  { email: 1 },
  { name: "idx_employees_email" }
);
print("  ✓ employees.idx_employees_email");

// Supports: name-based sorting and filtering (compound index)
db.employees.createIndex(
  { lastName: 1, firstName: 1 },
  { name: "idx_employees_last_first" }
);
print("  ✓ employees.idx_employees_last_first");

// Supports: age range queries
db.employees.createIndex(
  { age: 1 },
  { name: "idx_employees_age" }
);
print("  ✓ employees.idx_employees_age");

// Supports: department-scoped queries with name sorting
db.employees.createIndex(
  { departmentId: 1, lastName: 1, firstName: 1 },
  { name: "idx_employees_dept_name" }
);
print("  ✓ employees.idx_employees_dept_name");

// ---------------------------------------------------------------------------
// users indexes
// ---------------------------------------------------------------------------
// Unique index on username — equivalent to UNIQUE constraint in MySQL
db.users.createIndex(
  { username: 1 },
  { unique: true, name: "idx_users_username_unique" }
);
print("  ✓ users.idx_users_username_unique");

print("\n=== Index creation complete ===\n");

// Print index summary
print("--- Index Summary ---");
["departments", "employees", "users"].forEach((coll) => {
  const indexes = db[coll].getIndexes();
  print(`\n${coll} (${indexes.length} indexes):`);
  indexes.forEach((idx) => {
    print(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
  });
});
print("");
