package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** This interface represents the repository for users. */
public interface UserRepository extends JpaRepository<User, Long> {
  /**
   * Finds a user by their username.
   *
   * @param username the username to search for
   * @return an {@link Optional} containing the user if found, or empty otherwise
   */
  Optional<User> findByUsername(String username);
}
