package com.example.employeemanagement.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.employeemanagement.dto.EmployeeResponseDto;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.service.EmployeeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/** This class represents the REST API controller for employees. */
@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Employees APIs", description = "API Operations related to managing employees")
public class EmployeeController {

  /** The employee service. */
  @Autowired
  private EmployeeService employeeService;

  /**
   * Get all employees API.
   *
   * @return List of all employees
   */
  @Operation(summary = "Get all employees", description = "Retrieve a list of all employees")
  @GetMapping
  public List<EmployeeResponseDto> getAllEmployees() {
    return employeeService.getAllEmployees().stream().map(employee -> convertToDto(employee))
        .collect(Collectors.toList());
  }

  /**
   * Get employee by ID API.
   *
   * @param id ID of the employee to be retrieved
   * @return Employee with the specified ID
   */
  @Operation(summary = "Get employee by ID", description = "Retrieve a specific employee by their ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Employee found"),
      @ApiResponse(responseCode = "404", description = "Employee not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<EmployeeResponseDto> getEmployeeById(@PathVariable Long id) {
    Employee employee = employeeService
        .getEmployeeById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

    EmployeeResponseDto employeeResponseDto = new EmployeeResponseDto();
    employeeResponseDto.setId(employee.getId());
    employeeResponseDto.setFirstName(employee.getFirstName());
    employeeResponseDto.setLastName(employee.getLastName());
    employeeResponseDto.setEmail(employee.getEmail());
    employeeResponseDto.setDepartmentName(employee.getDepartment().getName());
    employeeResponseDto.setAge(employee.getAge());

    return ResponseEntity.ok(employeeResponseDto);
  }

  /**
   * Create a new employee API.
   *
   * @param employee New employee details
   * @return New employee record
   */
  @Operation(summary = "Create a new employee", description = "Create a new employee record")
  @PostMapping
  public ResponseEntity<EmployeeResponseDto> createEmployee(@Valid @RequestBody Employee employee) {
    Employee savedEmployee = employeeService.saveEmployee(employee);
    return ResponseEntity.ok(convertToDto(savedEmployee));
  }

  /**
   * Update an existing employee API.
   *
   * @param id              ID of the employee to be updated
   * @param employeeDetails Updated employee details
   * @return Updated employee record
   */
  @Operation(summary = "Update an existing employee", description = "Update an existing employee's details")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Employee updated"),
      @ApiResponse(responseCode = "404", description = "Employee not found")
  })
  @PutMapping("/{id}")
  public ResponseEntity<EmployeeResponseDto> updateEmployee(
      @PathVariable Long id, @Valid @RequestBody Employee employeeDetails) {
    Employee employee = employeeService
        .getEmployeeById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

    employee.setFirstName(employeeDetails.getFirstName());
    employee.setLastName(employeeDetails.getLastName());
    employee.setEmail(employeeDetails.getEmail());
    employee.setDepartment(employeeDetails.getDepartment());
    employee.setAge(employeeDetails.getAge());

    Employee updatedEmployee = employeeService.saveEmployee(employee);
    return ResponseEntity.ok(convertToDto(updatedEmployee));
  }

  /**
   * Delete an employee API.
   *
   * @param id ID of the employee to be deleted
   * @return No content
   */
  @Operation(summary = "Delete an employee", description = "Delete an employee record by ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "Employee deleted"),
      @ApiResponse(responseCode = "404", description = "Employee not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
    Employee employee = employeeService
        .getEmployeeById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

    employeeService.deleteEmployee(id);
    return ResponseEntity.noContent().build();
  }

  private EmployeeResponseDto convertToDto(Employee employee) {
    EmployeeResponseDto dto = new EmployeeResponseDto();
    dto.setId(employee.getId());
    dto.setFirstName(employee.getFirstName());
    dto.setLastName(employee.getLastName());
    dto.setEmail(employee.getEmail());
    dto.setAge(employee.getAge());
    dto.setDepartmentName(employee.getDepartment().getName());
    return dto;
  }
}
