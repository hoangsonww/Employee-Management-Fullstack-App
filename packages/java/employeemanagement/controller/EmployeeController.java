package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.EmployeeRequestDto;
import com.example.employeemanagement.dto.EmployeeResponseDto;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Department;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.service.DepartmentService;
import com.example.employeemanagement.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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

/** This class represents the REST API controller for employees. */
@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Employees APIs", description = "API Operations related to managing employees")
public class EmployeeController {

  /** Service layer for employee business logic. */
  @Autowired private EmployeeService employeeService;

  /** Service layer for department business logic, used to resolve department references. */
  @Autowired private DepartmentService departmentService;

  /**
   * Get all employees API.
   *
   * @return List of all employees
   */
  @Operation(summary = "Get all employees", description = "Retrieve a list of all employees")
  @GetMapping
  public List<EmployeeResponseDto> getAllEmployees() {
    return employeeService.getAllEmployees().stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
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
  public ResponseEntity<EmployeeResponseDto> getEmployeeById(@PathVariable Long id) {
    Employee employee =
        employeeService
            .getEmployeeById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

    return ResponseEntity.ok(convertToDto(employee));
  }

  /**
   * Create a new employee API.
   *
   * @param request New employee details
   * @return New employee record
   */
  @Operation(summary = "Create a new employee", description = "Create a new employee record")
  @PostMapping
  public ResponseEntity<EmployeeResponseDto> createEmployee(
      @Valid @RequestBody EmployeeRequestDto request) {
    Employee employee = convertToEntity(request);
    Employee savedEmployee = employeeService.saveEmployee(employee);
    return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
        .body(convertToDto(savedEmployee));
  }

  /**
   * Update an existing employee API.
   *
   * @param id ID of the employee to be updated
   * @param request Updated employee details
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
  public ResponseEntity<EmployeeResponseDto> updateEmployee(
      @PathVariable Long id, @Valid @RequestBody EmployeeRequestDto request) {
    Employee employee =
        employeeService
            .getEmployeeById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

    Department department =
        departmentService
            .getDepartmentById(request.getDepartment().getId())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Department not found with id: " + request.getDepartment().getId()));

    employee.setFirstName(request.getFirstName());
    employee.setLastName(request.getLastName());
    employee.setEmail(request.getEmail());
    employee.setDepartment(department);
    employee.setAge(request.getAge());

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
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "204", description = "Employee deleted"),
        @ApiResponse(responseCode = "404", description = "Employee not found")
      })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
    employeeService
        .getEmployeeById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

    employeeService.deleteEmployee(id);
    return ResponseEntity.noContent().build();
  }

  /**
   * Converts an {@link Employee} entity to an {@link EmployeeResponseDto}.
   *
   * @param employee the employee entity to convert
   * @return the corresponding response DTO, including a nested department DTO if present
   */
  private EmployeeResponseDto convertToDto(Employee employee) {
    EmployeeResponseDto dto = new EmployeeResponseDto();
    dto.setId(employee.getId());
    dto.setFirstName(employee.getFirstName());
    dto.setLastName(employee.getLastName());
    dto.setEmail(employee.getEmail());
    dto.setAge(employee.getAge());
    if (employee.getDepartment() != null) {
      EmployeeResponseDto.DepartmentDto deptDto = new EmployeeResponseDto.DepartmentDto();
      deptDto.setId(employee.getDepartment().getId());
      deptDto.setName(employee.getDepartment().getName());
      dto.setDepartment(deptDto);
    }
    return dto;
  }

  /**
   * Converts an {@link EmployeeRequestDto} to an {@link Employee} entity, resolving the department
   * reference.
   *
   * @param request the request DTO containing employee details
   * @return the corresponding employee entity with its department association set
   * @throws com.example.employeemanagement.exception.ResourceNotFoundException if the referenced
   *     department does not exist
   */
  private Employee convertToEntity(EmployeeRequestDto request) {
    Employee employee = new Employee();
    employee.setFirstName(request.getFirstName());
    employee.setLastName(request.getLastName());
    employee.setEmail(request.getEmail());
    employee.setAge(request.getAge());

    Department department =
        departmentService
            .getDepartmentById(request.getDepartment().getId())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Department not found with id: " + request.getDepartment().getId()));
    employee.setDepartment(department);

    return employee;
  }
}
