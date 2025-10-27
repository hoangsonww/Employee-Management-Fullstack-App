package com.example.employeemanagement.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/** This class represents the role entity for RBAC. */
@Entity
@Table(name = "roles")
public class Role {

  /** The role ID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** The role name. */
  @Column(nullable = false, unique = true, length = 64)
  private String name;

  /** The role description. */
  @Column(length = 255)
  private String description;

  /** The permissions associated with this role. */
  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "role_permissions",
      joinColumns = @JoinColumn(name = "role_id"),
      inverseJoinColumns = @JoinColumn(name = "permission_id"))
  private Set<Permission> permissions = new HashSet<>();

  // Constructors

  /** Default constructor. */
  public Role() {}

  /**
   * Constructor with name and description.
   *
   * @param name The role name
   * @param description The role description
   */
  public Role(String name, String description) {
    this.name = name;
    this.description = description;
  }

  // Getters and Setters

  /**
   * Gets the role ID.
   *
   * @return The role ID
   */
  public Long getId() {
    return id;
  }

  /**
   * Sets the role ID.
   *
   * @param id The role ID
   */
  public void setId(Long id) {
    this.id = id;
  }

  /**
   * Gets the role name.
   *
   * @return The role name
   */
  public String getName() {
    return name;
  }

  /**
   * Sets the role name.
   *
   * @param name The role name
   */
  public void setName(String name) {
    this.name = name;
  }

  /**
   * Gets the role description.
   *
   * @return The role description
   */
  public String getDescription() {
    return description;
  }

  /**
   * Sets the role description.
   *
   * @param description The role description
   */
  public void setDescription(String description) {
    this.description = description;
  }

  /**
   * Gets the permissions associated with this role.
   *
   * @return The permissions
   */
  public Set<Permission> getPermissions() {
    return permissions;
  }

  /**
   * Sets the permissions associated with this role.
   *
   * @param permissions The permissions
   */
  public void setPermissions(Set<Permission> permissions) {
    this.permissions = permissions;
  }

  /**
   * Adds a permission to this role.
   *
   * @param permission The permission to add
   */
  public void addPermission(Permission permission) {
    this.permissions.add(permission);
  }

  /**
   * Removes a permission from this role.
   *
   * @param permission The permission to remove
   */
  public void removePermission(Permission permission) {
    this.permissions.remove(permission);
  }
}