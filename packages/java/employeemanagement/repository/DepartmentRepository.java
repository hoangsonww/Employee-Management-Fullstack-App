package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.Department;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/** This interface represents a repository for departments. */
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

  /**
   * Retrieves all departments with their associated employees eagerly fetched in a single query.
   *
   * @return a list of all departments, each with its employees collection initialized
   */
  @Query("SELECT DISTINCT d FROM Department d LEFT JOIN FETCH d.employees")
  List<Department> findAllWithEmployees();

  /**
   * Retrieves a single department by ID with its associated employees eagerly fetched.
   *
   * @param id the department ID
   * @return an {@link Optional} containing the department if found, or empty otherwise
   */
  @Query("SELECT d FROM Department d LEFT JOIN FETCH d.employees WHERE d.id = :id")
  Optional<Department> findByIdWithEmployees(Long id);
}
