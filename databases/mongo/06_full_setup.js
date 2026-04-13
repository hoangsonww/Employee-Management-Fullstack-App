// ============================================================================
// Employee Management — MongoDB Full Setup (All-in-One)
// ============================================================================
// Runs the complete MongoDB setup in a single file.
// This is a self-contained script that combines all individual scripts.
//
// Usage:
//   mongosh < databases/mongo/06_full_setup.js
//   mongosh mongodb://localhost:27017 < databases/mongo/06_full_setup.js
// ============================================================================

const DB_NAME = "employee_management";
db = db.getSiblingDB(DB_NAME);

print("╔══════════════════════════════════════════════════════════╗");
print("║   Employee Management — MongoDB Full Setup              ║");
print("╚══════════════════════════════════════════════════════════╝\n");

// ===== STEP 1: Create collections with schema validation =====
print("── Step 1/5: Creating collections ──\n");

// Drop existing (for clean re-runs)
[
  "v_employees_with_department",
  "v_department_summary",
  "v_department_age_stats",
  "v_empty_departments",
  "employees",
  "departments",
  "users",
].forEach((c) => {
  try {
    db[c].drop();
  } catch (e) {
    /* ignore */
  }
});

db.createCollection("departments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string", minLength: 1, maxLength: 255 },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
      additionalProperties: false,
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});
print("  ✓ departments");

db.createCollection("employees", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["firstName", "lastName", "email", "age", "departmentId"],
      properties: {
        _id: { bsonType: "objectId" },
        firstName: { bsonType: "string", minLength: 1, maxLength: 255 },
        lastName: { bsonType: "string", minLength: 1, maxLength: 255 },
        email: { bsonType: "string", maxLength: 255 },
        age: { bsonType: "int", minimum: 18, maximum: 65 },
        departmentId: { bsonType: "objectId" },
        departmentName: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
      additionalProperties: false,
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});
print("  ✓ employees");

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "password"],
      properties: {
        _id: { bsonType: "objectId" },
        username: { bsonType: "string", minLength: 1, maxLength: 255 },
        password: { bsonType: "string", minLength: 1 },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
      additionalProperties: false,
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});
print("  ✓ users\n");

// ===== STEP 2: Create indexes =====
print("── Step 2/5: Creating indexes ──\n");

db.departments.createIndex({ name: 1 }, { name: "idx_departments_name" });
db.employees.createIndex(
  { departmentId: 1 },
  { name: "idx_employees_department_id" },
);
db.employees.createIndex({ email: 1 }, { name: "idx_employees_email" });
db.employees.createIndex(
  { lastName: 1, firstName: 1 },
  { name: "idx_employees_last_first" },
);
db.employees.createIndex({ age: 1 }, { name: "idx_employees_age" });
db.employees.createIndex(
  { departmentId: 1, lastName: 1, firstName: 1 },
  { name: "idx_employees_dept_name" },
);
db.users.createIndex(
  { username: 1 },
  { unique: true, name: "idx_users_username_unique" },
);
print("  ✓ 7 indexes created\n");

// ===== STEP 3: Seed data =====
print("── Step 3/5: Seeding data ──\n");

const now = new Date();

const departments = [
  "Engineering",
  "Human Resources",
  "Marketing",
  "Finance",
  "Sales",
  "Operations",
  "Customer Support",
  "Product Management",
  "Legal",
  "Research & Development",
].map((name) => ({ name, createdAt: now, updatedAt: now }));

const deptResult = db.departments.insertMany(departments);
const deptIds = Object.values(deptResult.insertedIds);
print(`  ✓ ${deptResult.insertedCount} departments`);

const deptMap = {};
departments.forEach((d, i) => {
  deptMap[d.name] = deptIds[i];
});

const empData = [
  ["Alice", "Johnson", "alice.johnson@company.com", 30, "Engineering"],
  ["Bob", "Smith", "bob.smith@company.com", 28, "Engineering"],
  ["Carol", "Williams", "carol.williams@company.com", 35, "Human Resources"],
  ["David", "Brown", "david.brown@company.com", 42, "Marketing"],
  ["Emily", "Davis", "emily.davis@company.com", 26, "Finance"],
  ["Frank", "Miller", "frank.miller@company.com", 38, "Sales"],
  ["Grace", "Wilson", "grace.wilson@company.com", 31, "Operations"],
  ["Henry", "Moore", "henry.moore@company.com", 29, "Customer Support"],
  ["Irene", "Taylor", "irene.taylor@company.com", 45, "Product Management"],
  ["Jack", "Anderson", "jack.anderson@company.com", 33, "Legal"],
  ["Karen", "Thomas", "karen.thomas@company.com", 27, "Research & Development"],
  ["Leo", "Jackson", "leo.jackson@company.com", 36, "Engineering"],
  ["Maria", "White", "maria.white@company.com", 40, "Human Resources"],
  ["Nathan", "Harris", "nathan.harris@company.com", 24, "Marketing"],
  ["Olivia", "Martin", "olivia.martin@company.com", 32, "Finance"],
  ["Paul", "Garcia", "paul.garcia@company.com", 37, "Sales"],
  ["Quinn", "Martinez", "quinn.martinez@company.com", 29, "Operations"],
  ["Rachel", "Robinson", "rachel.robinson@company.com", 34, "Customer Support"],
  ["Sam", "Clark", "sam.clark@company.com", 41, "Product Management"],
  ["Tina", "Lewis", "tina.lewis@company.com", 25, "Legal"],
];

const employees = empData.map(([fn, ln, email, age, dept]) => ({
  firstName: fn,
  lastName: ln,
  email,
  age: NumberInt(age),
  departmentId: deptMap[dept],
  departmentName: dept,
  createdAt: now,
  updatedAt: now,
}));

const empResult = db.employees.insertMany(employees);
print(`  ✓ ${empResult.insertedCount} employees`);

db.users.insertOne({
  username: "admin",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  createdAt: now,
  updatedAt: now,
});
print('  ✓ 1 user (admin / "password")\n');

// ===== STEP 4: Create views =====
print("── Step 4/5: Creating views ──\n");

db.createView("v_employees_with_department", "employees", [
  {
    $lookup: {
      from: "departments",
      localField: "departmentId",
      foreignField: "_id",
      as: "department",
    },
  },
  { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      _id: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
      age: 1,
      department: { _id: "$department._id", name: "$department.name" },
    },
  },
]);
print("  ✓ v_employees_with_department");

db.createView("v_department_summary", "departments", [
  {
    $lookup: {
      from: "employees",
      localField: "_id",
      foreignField: "departmentId",
      as: "employees",
    },
  },
  { $project: { _id: 1, name: 1, employeeCount: { $size: "$employees" } } },
  { $sort: { name: 1 } },
]);
print("  ✓ v_department_summary");

db.createView("v_department_age_stats", "employees", [
  {
    $group: {
      _id: "$departmentId",
      departmentName: { $first: "$departmentName" },
      employeeCount: { $sum: 1 },
      minAge: { $min: "$age" },
      maxAge: { $max: "$age" },
      avgAge: { $avg: "$age" },
    },
  },
  {
    $project: {
      _id: 0,
      departmentId: "$_id",
      departmentName: 1,
      employeeCount: 1,
      minAge: 1,
      maxAge: 1,
      avgAge: { $round: ["$avgAge", 1] },
    },
  },
  { $sort: { departmentName: 1 } },
]);
print("  ✓ v_department_age_stats");

db.createView("v_empty_departments", "departments", [
  {
    $lookup: {
      from: "employees",
      localField: "_id",
      foreignField: "departmentId",
      as: "employees",
    },
  },
  { $match: { employees: { $size: 0 } } },
  { $project: { _id: 1, name: 1 } },
]);
print("  ✓ v_empty_departments\n");

// ===== STEP 5: Verify =====
print("── Step 5/5: Verification ──\n");
print(`  departments: ${db.departments.countDocuments()}`);
print(`  employees:   ${db.employees.countDocuments()}`);
print(`  users:       ${db.users.countDocuments()}`);
print(`  views:       ${db.getCollectionInfos({ type: "view" }).length}`);
print(
  `  indexes:     ${db.departments.getIndexes().length + db.employees.getIndexes().length + db.users.getIndexes().length} total`,
);

print("\n╔══════════════════════════════════════════════════════════╗");
print("║   Setup complete!                                       ║");
print("╚══════════════════════════════════════════════════════════╝\n");
