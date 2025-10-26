package com.example.employeemanagement.repository;

import com.example.employeemanagement.DTO.EmployeeCountDto;
import com.example.employeemanagement.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/** This interface represents a repository for employees. */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

  /**
   * Find all employees with their departments.
   *
   * @return List of all employees with their departments
   */
  @Query("SELECT e FROM Employee e JOIN FETCH e.department")
  List<Employee> findAllWithDepartments();
  
  @Query("SELECT new com.example.employeemanagement.DTO.EmployeeCountDto(d.name, COUNT(e)) " +
	       "FROM Employee e JOIN e.department d GROUP BY d.name")
 List<EmployeeCountDto> countEmployeesByDepartment();

}
