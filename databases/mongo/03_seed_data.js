// ============================================================================
// Employee Management — MongoDB Seed Data
// ============================================================================
// Inserts sample departments, employees, and a demo user.
// Mirrors the SQL seed data (databases/sql/04_seed_data.sql).
// Safe to re-run: checks for existing data before inserting.
//
// Run AFTER: 01_init_database.js, 02_indexes.js
//
// Usage:
//   mongosh < databases/mongo/03_seed_data.js
// ============================================================================

const DB_NAME = "employee_management";
db = db.getSiblingDB(DB_NAME);

print(`\n=== Seeding database: ${DB_NAME} ===\n`);

// Skip if data already exists
if (db.departments.countDocuments() > 0) {
  print("  ⚠ Data already exists — skipping seed. Drop collections first to re-seed.");
  print("    Use: mongosh < databases/mongo/05_drop_all.js");
  quit();
}

const now = new Date();

// ---------------------------------------------------------------------------
// Departments (10 common departments)
// ---------------------------------------------------------------------------
const departments = [
  { name: "Engineering" },
  { name: "Human Resources" },
  { name: "Marketing" },
  { name: "Finance" },
  { name: "Sales" },
  { name: "Operations" },
  { name: "Customer Support" },
  { name: "Product Management" },
  { name: "Legal" },
  { name: "Research & Development" }
].map((d) => ({
  ...d,
  createdAt: now,
  updatedAt: now
}));

const deptResult = db.departments.insertMany(departments);
const deptIds = Object.values(deptResult.insertedIds);
print(`  ✓ Inserted ${deptResult.insertedCount} departments`);

// Build a name → ObjectId lookup
const deptMap = {};
departments.forEach((d, i) => {
  deptMap[d.name] = deptIds[i];
});

// ---------------------------------------------------------------------------
// Employees (20 sample employees)
// ---------------------------------------------------------------------------
const employees = [
  { firstName: "Alice",   lastName: "Johnson",   email: "alice.johnson@company.com",   age: 30, dept: "Engineering" },
  { firstName: "Bob",     lastName: "Smith",      email: "bob.smith@company.com",       age: 28, dept: "Engineering" },
  { firstName: "Carol",   lastName: "Williams",   email: "carol.williams@company.com",  age: 35, dept: "Human Resources" },
  { firstName: "David",   lastName: "Brown",      email: "david.brown@company.com",     age: 42, dept: "Marketing" },
  { firstName: "Emily",   lastName: "Davis",      email: "emily.davis@company.com",     age: 26, dept: "Finance" },
  { firstName: "Frank",   lastName: "Miller",     email: "frank.miller@company.com",    age: 38, dept: "Sales" },
  { firstName: "Grace",   lastName: "Wilson",     email: "grace.wilson@company.com",    age: 31, dept: "Operations" },
  { firstName: "Henry",   lastName: "Moore",      email: "henry.moore@company.com",     age: 29, dept: "Customer Support" },
  { firstName: "Irene",   lastName: "Taylor",     email: "irene.taylor@company.com",    age: 45, dept: "Product Management" },
  { firstName: "Jack",    lastName: "Anderson",   email: "jack.anderson@company.com",   age: 33, dept: "Legal" },
  { firstName: "Karen",   lastName: "Thomas",     email: "karen.thomas@company.com",    age: 27, dept: "Research & Development" },
  { firstName: "Leo",     lastName: "Jackson",    email: "leo.jackson@company.com",     age: 36, dept: "Engineering" },
  { firstName: "Maria",   lastName: "White",      email: "maria.white@company.com",     age: 40, dept: "Human Resources" },
  { firstName: "Nathan",  lastName: "Harris",     email: "nathan.harris@company.com",   age: 24, dept: "Marketing" },
  { firstName: "Olivia",  lastName: "Martin",     email: "olivia.martin@company.com",   age: 32, dept: "Finance" },
  { firstName: "Paul",    lastName: "Garcia",     email: "paul.garcia@company.com",     age: 37, dept: "Sales" },
  { firstName: "Quinn",   lastName: "Martinez",   email: "quinn.martinez@company.com",  age: 29, dept: "Operations" },
  { firstName: "Rachel",  lastName: "Robinson",   email: "rachel.robinson@company.com", age: 34, dept: "Customer Support" },
  { firstName: "Sam",     lastName: "Clark",      email: "sam.clark@company.com",       age: 41, dept: "Product Management" },
  { firstName: "Tina",    lastName: "Lewis",      email: "tina.lewis@company.com",      age: 25, dept: "Legal" }
].map((e) => ({
  firstName: e.firstName,
  lastName: e.lastName,
  email: e.email,
  age: NumberInt(e.age),
  departmentId: deptMap[e.dept],
  departmentName: e.dept,
  createdAt: now,
  updatedAt: now
}));

const empResult = db.employees.insertMany(employees);
print(`  ✓ Inserted ${empResult.insertedCount} employees`);

// ---------------------------------------------------------------------------
// Demo user (password: "password" — BCrypt hash)
// ---------------------------------------------------------------------------
const userResult = db.users.insertOne({
  username: "admin",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  createdAt: now,
  updatedAt: now
});
print(`  ✓ Inserted demo user: admin (password: "password")`);

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
print("\n--- Seed Summary ---");
print(`  departments: ${db.departments.countDocuments()}`);
print(`  employees:   ${db.employees.countDocuments()}`);
print(`  users:       ${db.users.countDocuments()}`);
print("\n=== Seeding complete ===\n");
