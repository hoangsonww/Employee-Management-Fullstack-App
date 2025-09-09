package com.example.employeemanagement.controller;

import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.service.AuditService;
import com.example.employeemanagement.service.EmployeeService;
import com.example.employeemanagement.security.JwtUserDetails;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/** This class represents the REST API controller for employees. */
@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Employees APIs", description = "API Operations related to managing employees")
@SecurityRequirement(name = "bearerAuth")
public class EmployeeController {

  /** The employee service. */
  @Autowired private EmployeeService employeeService;

  /** The audit service. */
  @Autowired private AuditService auditService;

  /**
   * Get all employees API.
   *
   * @return List of all employees
   */
  @Operation(summary = "Get all employees", description = "Retrieve a list of all employees")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "Successfully retrieved employees"),
          @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions")
      })
  @GetMapping
  @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
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
        @ApiResponse(responseCode = "404", description = "Employee not found"),
        @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions")
      })
  @GetMapping("/{id}")
  @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
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
   * @param request The HTTP request for audit logging
   * @return New employee record
   */
  @Operation(summary = "Create a new employee", description = "Create a new employee record")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "Employee created successfully"),
          @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions")
      })
  @PostMapping
  @PreAuthorize("hasAuthority('EMPLOYEE_CREATE')")
  public Employee createEmployee(@RequestBody Employee employee, HttpServletRequest request) {
    Employee savedEmployee = employeeService.saveEmployee(employee);
    
    // Log audit event
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth.getPrincipal() instanceof JwtUserDetails) {
      JwtUserDetails userDetails = (JwtUserDetails) auth.getPrincipal();
      auditService.logAuditEvent(
          userDetails.getUserId(),
          "CREATE_EMPLOYEE",
          "EMPLOYEE",
          savedEmployee.getId().toString(),
          String.format("{\"name\":\"%s %s\",\"email\":\"%s\"}", 
              savedEmployee.getFirstName(), savedEmployee.getLastName(), savedEmployee.getEmail()),
          request,
          userDetails.getImpersonated()
      );
    }
    
    return savedEmployee;
  }

  /**
   * Update an existing employee API.
   *
   * @param id ID of the employee to be updated
   * @param employeeDetails Updated employee details
   * @param request The HTTP request for audit logging
   * @return Updated employee record
   */
  @Operation(
      summary = "Update an existing employee",
      description = "Update an existing employee's details")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Employee updated"),
        @ApiResponse(responseCode = "404", description = "Employee not found"),
        @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions")
      })
  @PutMapping("/{id}")
  @PreAuthorize("hasAuthority('EMPLOYEE_UPDATE')")
  public ResponseEntity<Employee> updateEmployee(
      @PathVariable Long id, @RequestBody Employee employeeDetails, HttpServletRequest request) {
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
    
    // Log audit event
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth.getPrincipal() instanceof JwtUserDetails) {
      JwtUserDetails userDetails = (JwtUserDetails) auth.getPrincipal();
      auditService.logAuditEvent(
          userDetails.getUserId(),
          "UPDATE_EMPLOYEE",
          "EMPLOYEE",
          updatedEmployee.getId().toString(),
          String.format("{\"name\":\"%s %s\",\"email\":\"%s\"}", 
              updatedEmployee.getFirstName(), updatedEmployee.getLastName(), updatedEmployee.getEmail()),
          request,
          userDetails.getImpersonated()
      );
    }
    
    return ResponseEntity.ok(updatedEmployee);
  }

  /**
   * Delete an employee API.
   *
   * @param id ID of the employee to be deleted
   * @param request The HTTP request for audit logging
   * @return No content
   */
  @Operation(summary = "Delete an employee", description = "Delete an employee record by ID")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "204", description = "Employee deleted"),
        @ApiResponse(responseCode = "404", description = "Employee not found"),
        @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions")
      })
  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('EMPLOYEE_DELETE')")
  public ResponseEntity<Void> deleteEmployee(@PathVariable Long id, HttpServletRequest request) {
    Employee employee =
        employeeService
            .getEmployeeById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

    // Log audit event before deletion
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth.getPrincipal() instanceof JwtUserDetails) {
      JwtUserDetails userDetails = (JwtUserDetails) auth.getPrincipal();
      auditService.logAuditEvent(
          userDetails.getUserId(),
          "DELETE_EMPLOYEE",
          "EMPLOYEE",
          employee.getId().toString(),
          String.format("{\"name\":\"%s %s\",\"email\":\"%s\"}", 
              employee.getFirstName(), employee.getLastName(), employee.getEmail()),
          request,
          userDetails.getImpersonated()
      );
    }

    employeeService.deleteEmployee(id);
    return ResponseEntity.noContent().build();
  }
}
