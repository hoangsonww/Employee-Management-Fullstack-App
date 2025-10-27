package com.example.employeemanagement.model;

import javax.persistence.*;

/** This class represents the permission entity for RBAC. */
@Entity
@Table(name = "permissions")
public class Permission {

  /** The permission ID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** The permission name. */
  @Column(nullable = false, unique = true, length = 128)
  private String name;

  /** The permission description. */
  @Column(length = 255)
  private String description;

  // Constructors

  /** Default constructor. */
  public Permission() {}

  /**
   * Constructor with name and description.
   *
   * @param name The permission name
   * @param description The permission description
   */
  public Permission(String name, String description) {
    this.name = name;
    this.description = description;
  }

  // Getters and Setters

  /**
   * Gets the permission ID.
   *
   * @return The permission ID
   */
  public Long getId() {
    return id;
  }

  /**
   * Sets the permission ID.
   *
   * @param id The permission ID
   */
  public void setId(Long id) {
    this.id = id;
  }

  /**
   * Gets the permission name.
   *
   * @return The permission name
   */
  public String getName() {
    return name;
  }

  /**
   * Sets the permission name.
   *
   * @param name The permission name
   */
  public void setName(String name) {
    this.name = name;
  }

  /**
   * Gets the permission description.
   *
   * @return The permission description
   */
  public String getDescription() {
    return description;
  }

  /**
   * Sets the permission description.
   *
   * @param description The permission description
   */
  public void setDescription(String description) {
    this.description = description;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Permission that = (Permission) o;
    return name != null ? name.equals(that.name) : that.name == null;
  }

  @Override
  public int hashCode() {
    return name != null ? name.hashCode() : 0;
  }
}