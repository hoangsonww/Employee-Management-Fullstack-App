package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.Employee;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/** This interface represents a repository for employees. */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

  /**
   * Find all employees with their departments.
   *
   * @return List of all employees with their departments
   */
  @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.department")
  List<Employee> findAllWithDepartments();

  /**
   * Retrieves a single employee by ID with its associated department eagerly fetched.
   *
   * @param id the employee ID
   * @return an {@link Optional} containing the employee if found, or empty otherwise
   */
  @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.department WHERE e.id = :id")
  Optional<Employee> findByIdWithDepartment(Long id);

  /**
   * Counts the number of employees assigned to the given department.
   *
   * @param departmentId the ID of the department to count employees for
   * @return the number of employees in the specified department
   */
  long countByDepartmentId(Long departmentId);
}
