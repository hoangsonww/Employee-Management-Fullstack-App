package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.DepartmentRequestDto;
import com.example.employeemanagement.dto.DepartmentResponseDto;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Department;
import com.example.employeemanagement.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

/** This class represents the REST API controller for departments. */
@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Department APIs", description = "API Operations related to managing departments")
public class DepartmentController {

  /** Service layer for department business logic. */
  @Autowired private DepartmentService departmentService;

  /**
   * Get all departments API.
   *
   * @return List of all departments
   */
  @Operation(summary = "Get all departments", description = "Retrieve a list of all departments")
  @GetMapping
  public List<DepartmentResponseDto> getAllDepartments() {
    return departmentService.getAllDepartments().stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
  }

  /**
   * Get department by ID API.
   *
   * @param id ID of the department to be retrieved
   * @return Department with the specified ID
   */
  @Operation(
      summary = "Get department by ID",
      description = "Retrieve a specific department by its ID")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Department found"),
        @ApiResponse(responseCode = "404", description = "Department not found")
      })
  @GetMapping("/{id}")
  public ResponseEntity<DepartmentResponseDto> getDepartmentById(
      @Parameter(description = "ID of the department to be retrieved") @PathVariable Long id) {
    Department department =
        departmentService
            .getDepartmentById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Department not found with id: " + id));
    return ResponseEntity.ok(convertToDto(department));
  }

  /**
   * Create a new department API.
   *
   * @param request Department details
   * @return Created department object
   */
  @Operation(summary = "Create a new department", description = "Create a new department record")
  @ApiResponse(responseCode = "201", description = "Department created successfully")
  @PostMapping
  public ResponseEntity<DepartmentResponseDto> createDepartment(
      @Valid @RequestBody DepartmentRequestDto request) {
    Department department = new Department();
    department.setName(request.getName());
    Department created = departmentService.saveDepartment(department);
    return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(created));
  }

  /**
   * Update an existing department API.
   *
   * @param id ID of the department to be updated
   * @param request Updated department details
   * @return Updated department object
   */
  @Operation(
      summary = "Update an existing department",
      description = "Update an existing department's details")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Department updated"),
        @ApiResponse(responseCode = "404", description = "Department not found")
      })
  @PutMapping("/{id}")
  public ResponseEntity<DepartmentResponseDto> updateDepartment(
      @Parameter(description = "ID of the department to be updated") @PathVariable Long id,
      @Valid @RequestBody DepartmentRequestDto request) {
    Department department =
        departmentService
            .getDepartmentById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Department not found with id: " + id));

    department.setName(request.getName());

    Department updatedDepartment = departmentService.saveDepartment(department);
    return ResponseEntity.ok(convertToDto(updatedDepartment));
  }

  /**
   * Delete a department API.
   *
   * @param id ID of the department to be deleted
   * @return Response entity with no content
   */
  @Operation(summary = "Delete a department", description = "Delete a department record by ID")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "204", description = "Department deleted"),
        @ApiResponse(responseCode = "404", description = "Department not found")
      })
  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteDepartment(
      @Parameter(description = "ID of the department to be deleted") @PathVariable Long id) {
    departmentService
        .getDepartmentById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

    long employeeCount = departmentService.countEmployeesInDepartment(id);
    if (employeeCount > 0) {
      java.util.Map<String, String> error = new java.util.HashMap<>();
      error.put(
          "message",
          "Cannot delete department with "
              + employeeCount
              + " employees. Reassign or remove employees first.");
      return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    departmentService.deleteDepartment(id);
    return ResponseEntity.noContent().build();
  }

  /**
   * Converts a {@link Department} entity to a {@link DepartmentResponseDto}.
   *
   * @param department the department entity to convert
   * @return the corresponding response DTO
   */
  private DepartmentResponseDto convertToDto(Department department) {
    DepartmentResponseDto dto = new DepartmentResponseDto();
    dto.setId(department.getId());
    dto.setName(department.getName());
    dto.setEmployeeCount(department.getEmployees() != null ? department.getEmployees().size() : 0);
    return dto;
  }
}
