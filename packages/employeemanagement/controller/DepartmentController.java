package com.example.employeemanagement.controller;

import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Department;
import com.example.employeemanagement.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/** This class represents the REST API controller for departments. */
@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Department APIs", description = "API Operations related to managing departments")
public class DepartmentController {

  /** The department service. */
  @Autowired private DepartmentService departmentService;

  /**
   * Get all departments API.
   *
   * @return List of all departments
   */
  @Operation(summary = "Get all departments", description = "Retrieve a list of all departments")
  @GetMapping
  public List<Department> getAllDepartments() {
    return departmentService.getAllDepartments();
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
  public ResponseEntity<Department> getDepartmentById(
      @Parameter(description = "ID of the department to be retrieved") @PathVariable Long id) {
    Department department =
        departmentService
            .getDepartmentById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Department not found with id: " + id));
    return ResponseEntity.ok(department);
  }

  /**
   * Create a new department API.
   *
   * @param department Department object to be created
   * @return Created department object
   */
  @Operation(summary = "Create a new department", description = "Create a new department record")
  @ApiResponse(responseCode = "201", description = "Department created successfully")
  @PostMapping
  public Department createDepartment(@RequestBody Department department) {
    return departmentService.saveDepartment(department);
  }

  /**
   * Update an existing department API.
   *
   * @param id ID of the department to be updated
   * @param departmentDetails Updated department object
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
  public ResponseEntity<Department> updateDepartment(
      @Parameter(description = "ID of the department to be updated") @PathVariable Long id,
      @RequestBody Department departmentDetails) {
    Department department =
        departmentService
            .getDepartmentById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Department not found with id: " + id));

    department.setName(departmentDetails.getName());

    Department updatedDepartment = departmentService.saveDepartment(department);
    return ResponseEntity.ok(updatedDepartment);
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
  public ResponseEntity<Void> deleteDepartment(
      @Parameter(description = "ID of the department to be deleted") @PathVariable Long id) {
    Department department =
        departmentService
            .getDepartmentById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Department not found with id: " + id));

    departmentService.deleteDepartment(id);
    return ResponseEntity.noContent().build();
  }
}
