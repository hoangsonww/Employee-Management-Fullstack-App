// ============================================================================
// Employee Management — MongoDB Drop All (Reset)
// ============================================================================
// Drops all collections and views so the database can be re-initialized.
// USE WITH CAUTION — this is destructive and irreversible.
//
// Usage:
//   mongosh < databases/mongo/05_drop_all.js
// ============================================================================

const DB_NAME = "employee_management";
db = db.getSiblingDB(DB_NAME);

print(`\n=== Dropping all collections in: ${DB_NAME} ===\n`);

// Drop views first (they depend on collections)
const views = ["v_employees_with_department", "v_department_summary", "v_department_age_stats", "v_empty_departments"];
views.forEach((v) => {
  try {
    db[v].drop();
    print(`  ✓ Dropped view: ${v}`);
  } catch (e) {
    print(`  - View not found: ${v}`);
  }
});

// Drop collections
const collections = ["employees", "departments", "users"];
collections.forEach((c) => {
  try {
    db[c].drop();
    print(`  ✓ Dropped collection: ${c}`);
  } catch (e) {
    print(`  - Collection not found: ${c}`);
  }
});

print("\n=== All collections dropped ===\n");
print("To re-initialize, run:");
print("  mongosh < databases/mongo/01_init_database.js");
print("  mongosh < databases/mongo/02_indexes.js");
print("  mongosh < databases/mongo/03_seed_data.js");
print("  mongosh < databases/mongo/04_views.js");
print("");
