package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/** This interface represents the repository for the Permission entity. */
@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {

  /**
   * Finds a permission by its name.
   *
   * @param name The permission name
   * @return The permission, if found
   */
  Optional<Permission> findByName(String name);

  /**
   * Checks if a permission exists by name.
   *
   * @param name The permission name
   * @return True if the permission exists, false otherwise
   */
  boolean existsByName(String name);
}