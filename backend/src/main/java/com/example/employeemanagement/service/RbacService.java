package com.example.employeemanagement.service;

import com.example.employeemanagement.model.Permission;
import com.example.employeemanagement.model.Role;
import com.example.employeemanagement.model.User;
import com.example.employeemanagement.repository.PermissionRepository;
import com.example.employeemanagement.repository.RoleRepository;
import com.example.employeemanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/** This service handles RBAC operations. */
@Service
public class RbacService {

  @Autowired private RoleRepository roleRepository;

  @Autowired private PermissionRepository permissionRepository;

  @Autowired private UserRepository userRepository;

  @Autowired private AuditService auditService;

  /**
   * Gets all roles.
   *
   * @return List of all roles
   */
  public List<Role> getAllRoles() {
    return roleRepository.findAll();
  }

  /**
   * Gets all permissions.
   *
   * @return List of all permissions
   */
  public List<Permission> getAllPermissions() {
    return permissionRepository.findAll();
  }

  /**
   * Gets a role by ID.
   *
   * @param id The role ID
   * @return The role if found
   */
  public Optional<Role> getRoleById(Long id) {
    return roleRepository.findById(id);
  }

  /**
   * Gets a role by name.
   *
   * @param name The role name
   * @return The role if found
   */
  public Optional<Role> getRoleByName(String name) {
    return roleRepository.findByName(name);
  }

  /**
   * Assigns a role to a user.
   *
   * @param userId The user ID
   * @param roleName The role name
   * @param actorUserId The ID of the user performing the action (for audit)
   * @return True if successful, false otherwise
   */
  public boolean assignRoleToUser(Long userId, String roleName, Long actorUserId) {
    Optional<User> userOpt = userRepository.findById(userId);
    Optional<Role> roleOpt = roleRepository.findByName(roleName);

    if (userOpt.isPresent() && roleOpt.isPresent()) {
      User user = userOpt.get();
      Role role = roleOpt.get();

      if (!user.getRoles().contains(role)) {
        user.addRole(role);
        userRepository.save(user);

        // Log audit event
        auditService.logAuditEvent(
            actorUserId,
            "ASSIGN_ROLE",
            "USER",
            userId.toString(),
            String.format("{\"role\":\"%s\",\"username\":\"%s\"}", roleName, user.getUsername()),
            null,
            false
        );

        return true;
      }
    }
    return false;
  }

  /**
   * Removes a role from a user.
   *
   * @param userId The user ID
   * @param roleName The role name
   * @param actorUserId The ID of the user performing the action (for audit)
   * @return True if successful, false otherwise
   */
  public boolean removeRoleFromUser(Long userId, String roleName, Long actorUserId) {
    Optional<User> userOpt = userRepository.findById(userId);
    Optional<Role> roleOpt = roleRepository.findByName(roleName);

    if (userOpt.isPresent() && roleOpt.isPresent()) {
      User user = userOpt.get();
      Role role = roleOpt.get();

      if (user.getRoles().contains(role)) {
        user.removeRole(role);
        userRepository.save(user);

        // Log audit event
        auditService.logAuditEvent(
            actorUserId,
            "REMOVE_ROLE",
            "USER",
            userId.toString(),
            String.format("{\"role\":\"%s\",\"username\":\"%s\"}", roleName, user.getUsername()),
            null,
            false
        );

        return true;
      }
    }
    return false;
  }

  /**
   * Gets all users with their roles.
   *
   * @return List of all users
   */
  public List<User> getAllUsersWithRoles() {
    return userRepository.findAll();
  }

  /**
   * Checks if a user has a specific permission.
   *
   * @param userId The user ID
   * @param permissionName The permission name
   * @return True if the user has the permission, false otherwise
   */
  public boolean userHasPermission(Long userId, String permissionName) {
    Optional<User> userOpt = userRepository.findById(userId);
    return userOpt.map(user -> user.hasPermission(permissionName)).orElse(false);
  }

  /**
   * Checks if a user has a specific role.
   *
   * @param userId The user ID
   * @param roleName The role name
   * @return True if the user has the role, false otherwise
   */
  public boolean userHasRole(Long userId, String roleName) {
    Optional<User> userOpt = userRepository.findById(userId);
    return userOpt.map(user -> user.hasRole(roleName)).orElse(false);
  }

  /**
   * Gets all permissions for a user.
   *
   * @param userId The user ID
   * @return Set of permissions for the user
   */
  public Set<Permission> getUserPermissions(Long userId) {
    Optional<User> userOpt = userRepository.findById(userId);
    return userOpt.map(User::getAllPermissions).orElse(Set.of());
  }

  /**
   * Gets user by username with roles.
   *
   * @param username The username
   * @return The user if found
   */
  public Optional<User> getUserByUsernameWithRoles(String username) {
    return userRepository.findByUsername(username);
  }
}