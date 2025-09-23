package com.example.employeemanagement.service;

import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;  
import org.springframework.data.domain.Pageable;  
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/** This class represents the service for employees. */
@Service
public class EmployeeService {

  /** The employee repository. */
  @Autowired private EmployeeRepository employeeRepository;

  /**
   * Get all employees.
   *
   * @return List of all employees
   */
  public List<Employee> getAllEmployees() {
    return employeeRepository.findAllWithDepartments();
  }

/**
   * Get employees with specification and pagination.
   */
  public Page<Employee> getEmployees(Specification<Employee> specification, Pageable pageable) {
    return employeeRepository.findAll(specification, pageable);
  }
  
  /**
   * Get employee by ID.
   *
   * @param id ID of the employee to be retrieved
   * @return Employee with the specified ID
   */
  public Optional<Employee> getEmployeeById(Long id) {
    return employeeRepository.findById(id);
  }

  /**
   * Save an employee.
   *
   * @param employee Employee to be saved
   * @return Saved employee
   */
  public Employee saveEmployee(Employee employee) {
    return employeeRepository.save(employee);
  }

  /**
   * Update an employee.
   *
   * @param id ID of the employee to be updated
   */
  public void deleteEmployee(Long id) {
    employeeRepository.deleteById(id);
  }
}
