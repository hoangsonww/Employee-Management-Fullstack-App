// ============================================================================
// Employee Management — MongoDB Database Initialization
// ============================================================================
// Creates the database, collections, and schema validators.
// Mirrors the MySQL schema so the app can use either database backend.
//
// Usage:
//   mongosh < databases/mongo/01_init_database.js
//   mongosh mongodb://localhost:27017 < databases/mongo/01_init_database.js
// ============================================================================

const DB_NAME = "employee_management";
db = db.getSiblingDB(DB_NAME);

print(`\n=== Initializing database: ${DB_NAME} ===\n`);

// ---------------------------------------------------------------------------
// departments collection
// ---------------------------------------------------------------------------
// Mirrors: com.example.employeemanagement.model.Department
// ---------------------------------------------------------------------------
db.createCollection("departments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Department",
      description: "A department within the organization",
      required: ["name"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Auto-generated unique identifier",
        },
        name: {
          bsonType: "string",
          minLength: 1,
          maxLength: 255,
          description: "Department name — required, non-empty",
        },
        createdAt: {
          bsonType: "date",
          description: "Timestamp of creation",
        },
        updatedAt: {
          bsonType: "date",
          description: "Timestamp of last update",
        },
      },
      additionalProperties: false,
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});
print("  ✓ Created collection: departments");

// ---------------------------------------------------------------------------
// employees collection
// ---------------------------------------------------------------------------
// Mirrors: com.example.employeemanagement.model.Employee
// Department is stored as a reference (departmentId) plus a denormalized
// departmentName for read performance — matching the EmployeeResponseDto shape.
// ---------------------------------------------------------------------------
db.createCollection("employees", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Employee",
      description: "An employee in the organization",
      required: ["firstName", "lastName", "email", "age", "departmentId"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Auto-generated unique identifier",
        },
        firstName: {
          bsonType: "string",
          minLength: 1,
          maxLength: 255,
          description: "Employee first name — required",
        },
        lastName: {
          bsonType: "string",
          minLength: 1,
          maxLength: 255,
          description: "Employee last name — required",
        },
        email: {
          bsonType: "string",
          maxLength: 255,
          description: "Employee email address — required",
        },
        age: {
          bsonType: "int",
          minimum: 18,
          maximum: 65,
          description: "Employee age — must be between 18 and 65",
        },
        departmentId: {
          bsonType: "objectId",
          description: "Reference to the department this employee belongs to",
        },
        departmentName: {
          bsonType: "string",
          description: "Denormalized department name for read performance",
        },
        createdAt: {
          bsonType: "date",
          description: "Timestamp of creation",
        },
        updatedAt: {
          bsonType: "date",
          description: "Timestamp of last update",
        },
      },
      additionalProperties: false,
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});
print("  ✓ Created collection: employees");

// ---------------------------------------------------------------------------
// users collection
// ---------------------------------------------------------------------------
// Mirrors: com.example.employeemanagement.model.User
// Used for JWT authentication (register, login, password reset).
// ---------------------------------------------------------------------------
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "User",
      description: "An authentication user account",
      required: ["username", "password"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Auto-generated unique identifier",
        },
        username: {
          bsonType: "string",
          minLength: 1,
          maxLength: 255,
          description: "Unique login username — required",
        },
        password: {
          bsonType: "string",
          minLength: 1,
          description: "BCrypt-hashed password — required",
        },
        createdAt: {
          bsonType: "date",
          description: "Timestamp of account creation",
        },
        updatedAt: {
          bsonType: "date",
          description: "Timestamp of last update",
        },
      },
      additionalProperties: false,
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});
print("  ✓ Created collection: users");

print("\n=== Database initialization complete ===\n");
