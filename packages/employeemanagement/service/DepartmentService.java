package com.example.employeemanagement.service;

import com.example.employeemanagement.model.Department;
import com.example.employeemanagement.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/** This class represents the service for departments. */
@Service
public class DepartmentService {

  /** The department repository. */
  @Autowired private DepartmentRepository departmentRepository;

  /**
   * Get all departments.
   *
   * @return List of all departments
   */
  public List<Department> getAllDepartments() {
    return departmentRepository.findAll();
  }

  /**
   * Get department by ID.
   *
   * @param id ID of the department to be retrieved
   * @return Department with the specified ID
   */
  public Optional<Department> getDepartmentById(Long id) {
    return departmentRepository.findById(id);
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
   * Update a department.
   *
   * @param id ID of the department to be updated
   */
  public void deleteDepartment(Long id) {
    departmentRepository.deleteById(id);
  }
}
