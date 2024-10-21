package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/** This interface represents the repository for users. */
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);
}
