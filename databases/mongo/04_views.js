// ============================================================================
// Employee Management — MongoDB Views (Aggregation Pipelines)
// ============================================================================
// Read-only views that mirror the SQL views and DTO response shapes.
//
// Run AFTER: 01_init_database.js
//
// Usage:
//   mongosh < databases/mongo/04_views.js
// ============================================================================

const DB_NAME = "employee_management";
db = db.getSiblingDB(DB_NAME);

print(`\n=== Creating views for: ${DB_NAME} ===\n`);

// ---------------------------------------------------------------------------
// v_employees_with_department
// ---------------------------------------------------------------------------
// Mirrors EmployeeResponseDto — joins employee with department data.
// Equivalent to SQL: v_employees_with_department
// ---------------------------------------------------------------------------
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
      department: {
        _id: "$department._id",
        name: "$department.name",
      },
    },
  },
]);
print("  ✓ Created view: v_employees_with_department");

// ---------------------------------------------------------------------------
// v_department_summary
// ---------------------------------------------------------------------------
// Mirrors DepartmentResponseDto — department with employee count.
// Equivalent to SQL: v_department_summary
// ---------------------------------------------------------------------------
db.createView("v_department_summary", "departments", [
  {
    $lookup: {
      from: "employees",
      localField: "_id",
      foreignField: "departmentId",
      as: "employees",
    },
  },
  {
    $project: {
      _id: 1,
      name: 1,
      employeeCount: { $size: "$employees" },
    },
  },
  { $sort: { name: 1 } },
]);
print("  ✓ Created view: v_department_summary");

// ---------------------------------------------------------------------------
// v_department_age_stats
// ---------------------------------------------------------------------------
// Per-department age statistics for HR analytics.
// Equivalent to SQL: v_department_age_stats
// ---------------------------------------------------------------------------
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
print("  ✓ Created view: v_department_age_stats");

// ---------------------------------------------------------------------------
// v_empty_departments
// ---------------------------------------------------------------------------
// Departments with zero employees.
// Equivalent to SQL: v_empty_departments
// ---------------------------------------------------------------------------
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
  {
    $project: {
      _id: 1,
      name: 1,
    },
  },
]);
print("  ✓ Created view: v_empty_departments");

print("\n=== View creation complete ===\n");

// Print view list
print("--- Available Views ---");
db.getCollectionInfos({ type: "view" }).forEach((v) => {
  print(`  - ${v.name}`);
});
print("");
