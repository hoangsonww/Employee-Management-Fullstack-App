package com.example.employeemanagement.controller;

import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.service.EmployeeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/** This class represents the REST API controller for employees. */
@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Employees APIs", description = "API Operations related to managing employees")
public class EmployeeController {

  /** The employee service. */
  @Autowired private EmployeeService employeeService;

  /**
   * Get all employees API.
   *
   * @return List of all employees
   */
  @Operation(summary = "Get all employees", description = "Retrieve a list of all employees")
  @GetMapping
  public List<Employee> getAllEmployees() {
    return employeeService.getAllEmployees();
  }

  /**
   * Get employee by ID API.
   *
   * @param id ID of the employee to be retrieved
   * @return Employee with the specified ID
   */
  @Operation(
      summary = "Get employee by ID",
      description = "Retrieve a specific employee by their ID")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Employee found"),
        @ApiResponse(responseCode = "404", description = "Employee not found")
      })
  @GetMapping("/{id}")
  public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
    Employee employee =
        employeeService
            .getEmployeeById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    return ResponseEntity.ok(employee);
  }

  /**
   * Create a new employee API.
   *
   * @param employee New employee details
   * @return New employee record
   */
  @Operation(summary = "Create a new employee", description = "Create a new employee record")
  @PostMapping
  public Employee createEmployee(@RequestBody Employee employee) {
    return employeeService.saveEmployee(employee);
  }

  /**
   * Update an existing employee API.
   *
   * @param id ID of the employee to be updated
   * @param employeeDetails Updated employee details
   * @return Updated employee record
   */
  @Operation(
      summary = "Update an existing employee",
      description = "Update an existing employee's details")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Employee updated"),
        @ApiResponse(responseCode = "404", description = "Employee not found")
      })
  @PutMapping("/{id}")
  public ResponseEntity<Employee> updateEmployee(
      @PathVariable Long id, @RequestBody Employee employeeDetails) {
    Employee employee =
        employeeService
            .getEmployeeById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

    employee.setFirstName(employeeDetails.getFirstName());
    employee.setLastName(employeeDetails.getLastName());
    employee.setEmail(employeeDetails.getEmail());
    employee.setDepartment(employeeDetails.getDepartment());
    employee.setAge(employeeDetails.getAge());

    Employee updatedEmployee = employeeService.saveEmployee(employee);
    return ResponseEntity.ok(updatedEmployee);
  }

  /**
   * Delete an employee API.
   *
   * @param id ID of the employee to be deleted
   * @return No content
   */
  @Operation(summary = "Delete an employee", description = "Delete an employee record by ID")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "204", description = "Employee deleted"),
        @ApiResponse(responseCode = "404", description = "Employee not found")
      })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
    Employee employee =
        employeeService
            .getEmployeeById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

    employeeService.deleteEmployee(id);
    return ResponseEntity.noContent().build();
  }
}
