package com.example.employeemanagement.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/** This class represents the user entity. */
@Entity
@Table(name = "users")
public class User {

  /** The user ID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** The username. */
  @Column(nullable = false, unique = true)
  private String username;

  /** The password. */
  @Column(nullable = false)
  private String password;

  /** The roles associated with this user. */
  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "user_roles",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<Role> roles = new HashSet<>();

  // Getters and Setters

  /**
   * Gets the user ID.
   *
   * @return The user ID
   */
  public Long getId() {
    return id;
  }

  /**
   * Sets the user ID.
   *
   * @param id The user ID
   */
  public void setId(Long id) {
    this.id = id;
  }

  /**
   * Gets the username.
   *
   * @return The username
   */
  public String getUsername() {
    return username;
  }

  /**
   * Sets the username.
   *
   * @param username The username
   */
  public void setUsername(String username) {
    this.username = username;
  }

  /**
   * Gets the password.
   *
   * @return The password
   */
  public String getPassword() {
    return password;
  }

  /**
   * Sets the password.
   *
   * @param password The password
   */
  public void setPassword(String password) {
    this.password = password;
  }

  /**
   * Gets the roles associated with this user.
   *
   * @return The roles
   */
  public Set<Role> getRoles() {
    return roles;
  }

  /**
   * Sets the roles associated with this user.
   *
   * @param roles The roles
   */
  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }

  /**
   * Adds a role to this user.
   *
   * @param role The role to add
   */
  public void addRole(Role role) {
    this.roles.add(role);
  }

  /**
   * Removes a role from this user.
   *
   * @param role The role to remove
   */
  public void removeRole(Role role) {
    this.roles.remove(role);
  }

  /**
   * Checks if user has a specific role.
   *
   * @param roleName The role name to check
   * @return True if user has the role, false otherwise
   */
  public boolean hasRole(String roleName) {
    return roles.stream().anyMatch(role -> role.getName().equals(roleName));
  }

  /**
   * Gets all permissions for this user from their roles.
   *
   * @return Set of all permissions
   */
  public Set<Permission> getAllPermissions() {
    Set<Permission> permissions = new HashSet<>();
    for (Role role : roles) {
      permissions.addAll(role.getPermissions());
    }
    return permissions;
  }

  /**
   * Checks if user has a specific permission.
   *
   * @param permissionName The permission name to check
   * @return True if user has the permission, false otherwise
   */
  public boolean hasPermission(String permissionName) {
    return getAllPermissions().stream()
        .anyMatch(permission -> permission.getName().equals(permissionName));
  }
}
