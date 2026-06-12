package com.example.employeemanagement.service;

import com.example.employeemanagement.model.Department;
import com.example.employeemanagement.repository.DepartmentRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** This class represents the service for departments. */
@Service
public class DepartmentService {

  /** The department repository. */
  @Autowired private DepartmentRepository departmentRepository;

  /** The employee repository, used to count employees per department. */
  @Autowired private EmployeeRepository employeeRepository;

  /**
   * Get all departments.
   *
   * @return List of all departments
   */
  public List<Department> getAllDepartments() {
    return departmentRepository.findAllWithEmployees();
  }

  /**
   * Get department by ID.
   *
   * @param id ID of the department to be retrieved
   * @return Department with the specified ID
   */
  public Optional<Department> getDepartmentById(Long id) {
    return departmentRepository.findByIdWithEmployees(id);
  }

  /**
   * Save a department.
   *
   * @param department Department to be saved
   * @return Saved department
   */
  public Department saveDepartment(Department department) {
    return departmentRepository.save(department);
  }

  /**
   * Counts the number of employees assigned to a given department.
   *
   * @param departmentId the ID of the department
   * @return the number of employees in the department
   */
  public long countEmployeesInDepartment(Long departmentId) {
    return employeeRepository.countByDepartmentId(departmentId);
  }

  /**
   * Deletes a department by its ID.
   *
   * @param id the ID of the department to delete
   */
  public void deleteDepartment(Long id) {
    departmentRepository.deleteById(id);
  }
}
