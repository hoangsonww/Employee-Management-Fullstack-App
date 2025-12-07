package com.example.employeemanagement.service;

import com.example.employeemanagement.model.Permission;
import com.example.employeemanagement.model.Role;
import com.example.employeemanagement.model.User;
import com.example.employeemanagement.repository.PermissionRepository;
import com.example.employeemanagement.repository.RoleRepository;
import com.example.employeemanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Arrays;

/** This service initializes RBAC data (roles, permissions, and default admin user). */
@Service
public class RbacDataInitializer {

  @Autowired private RoleRepository roleRepository;

  @Autowired private PermissionRepository permissionRepository;

  @Autowired private UserRepository userRepository;

  @Autowired private PasswordEncoder passwordEncoder;

  /** Initialize roles and permissions after the bean is created. */
  @PostConstruct
  public void initializeRbacData() {
    createPermissions();
    createRoles();
    createDefaultAdmin();
  }

  /** Create all necessary permissions. */
  private void createPermissions() {
    // Employee permissions
    createPermissionIfNotExists("EMPLOYEE_READ", "Read employee information");
    createPermissionIfNotExists("EMPLOYEE_CREATE", "Create new employees");
    createPermissionIfNotExists("EMPLOYEE_UPDATE", "Update employee information");
    createPermissionIfNotExists("EMPLOYEE_DELETE", "Delete employees");

    // Department permissions
    createPermissionIfNotExists("DEPARTMENT_READ", "Read department information");
    createPermissionIfNotExists("DEPARTMENT_CREATE", "Create new departments");
    createPermissionIfNotExists("DEPARTMENT_UPDATE", "Update department information");
    createPermissionIfNotExists("DEPARTMENT_DELETE", "Delete departments");

    // User management permissions
    createPermissionIfNotExists("USER_READ", "Read user information");
    createPermissionIfNotExists("USER_ROLE_ASSIGN", "Assign roles to users");

    // Audit permissions
    createPermissionIfNotExists("AUDIT_READ", "Read audit logs");

    // Optional impersonation permission
    createPermissionIfNotExists("IMPERSONATE_USER", "Impersonate other users");
  }

  /** Create all necessary roles and assign permissions. */
  private void createRoles() {
    // Create ADMIN role with all permissions
    Role adminRole = createRoleIfNotExists("ADMIN", "System Administrator");
    if (adminRole.getPermissions().isEmpty()) {
      permissionRepository.findAll().forEach(adminRole::addPermission);
      roleRepository.save(adminRole);
    }

    // Create HR role
    Role hrRole = createRoleIfNotExists("HR", "Human Resources");
    if (hrRole.getPermissions().isEmpty()) {
      assignPermissionsToRole(hrRole, Arrays.asList(
          "EMPLOYEE_READ", "EMPLOYEE_CREATE", "EMPLOYEE_UPDATE", "EMPLOYEE_DELETE",
          "DEPARTMENT_READ", "DEPARTMENT_CREATE", "DEPARTMENT_UPDATE", "DEPARTMENT_DELETE",
          "AUDIT_READ"
      ));
    }

    // Create MANAGER role
    Role managerRole = createRoleIfNotExists("MANAGER", "Department Manager");
    if (managerRole.getPermissions().isEmpty()) {
      assignPermissionsToRole(managerRole, Arrays.asList(
          "EMPLOYEE_READ", "EMPLOYEE_UPDATE", "DEPARTMENT_READ"
      ));
    }

    // Create EMPLOYEE role
    Role employeeRole = createRoleIfNotExists("EMPLOYEE", "Regular Employee");
    if (employeeRole.getPermissions().isEmpty()) {
      assignPermissionsToRole(employeeRole, Arrays.asList("EMPLOYEE_READ"));
    }
  }

  /** Create a default admin user if none exists. */
  private void createDefaultAdmin() {
    if (!userRepository.findByUsername("admin").isPresent()) {
      User admin = new User();
      admin.setUsername("admin");
      admin.setPassword(passwordEncoder.encode("admin123")); // Default password

      Role adminRole = roleRepository.findByName("ADMIN").orElse(null);
      if (adminRole != null) {
        admin.addRole(adminRole);
      }

      userRepository.save(admin);
      System.out.println("Default admin user created with username: admin, password: admin123");
    }
  }

  /**
   * Creates a permission if it doesn't exist.
   *
   * @param name The permission name
   * @param description The permission description
   * @return The created or existing permission
   */
  private Permission createPermissionIfNotExists(String name, String description) {
    return permissionRepository.findByName(name).orElseGet(() -> {
      Permission permission = new Permission(name, description);
      return permissionRepository.save(permission);
    });
  }

  /**
   * Creates a role if it doesn't exist.
   *
   * @param name The role name
   * @param description The role description
   * @return The created or existing role
   */
  private Role createRoleIfNotExists(String name, String description) {
    return roleRepository.findByName(name).orElseGet(() -> {
      Role role = new Role(name, description);
      return roleRepository.save(role);
    });
  }

  /**
   * Assigns permissions to a role.
   *
   * @param role The role
   * @param permissionNames The permission names to assign
   */
  private void assignPermissionsToRole(Role role, java.util.List<String> permissionNames) {
    for (String permissionName : permissionNames) {
      permissionRepository.findByName(permissionName)
          .ifPresent(role::addPermission);
    }
    roleRepository.save(role);
  }
}