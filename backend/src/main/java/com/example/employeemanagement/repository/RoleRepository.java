package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/** This interface represents the repository for the Role entity. */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

  /**
   * Finds a role by its name.
   *
   * @param name The role name
   * @return The role, if found
   */
  Optional<Role> findByName(String name);

  /**
   * Checks if a role exists by name.
   *
   * @param name The role name
   * @return True if the role exists, false otherwise
   */
  boolean existsByName(String name);
}