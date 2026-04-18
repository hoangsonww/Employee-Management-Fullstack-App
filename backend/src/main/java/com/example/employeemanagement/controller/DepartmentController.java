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
import org.springframework.security.access.prepost.PreAuthorize;
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

    @Autowired
    private DepartmentService departmentService;

    /**
     * Get all departments API.
     *
     * @return list of all departments
     */
    @Operation(
            summary = "Get all departments",
            description = "Retrieve a list of all departments along with employee count"
    )
    @ApiResponse(responseCode = "200", description = "Departments retrieved successfully")
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<DepartmentResponseDto> getAllDepartments() {
        return departmentService.getAllDepartments().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get department by ID API.
     *
     * @param id ID of the department
     * @return department details
     */
    @Operation(
            summary = "Get department by ID",
            description = "Retrieve a specific department by its ID"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Department found"),
            @ApiResponse(responseCode = "404", description = "Department not found")
    })
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DepartmentResponseDto> getDepartmentById(@PathVariable Long id) {
        Department department = departmentService.getDepartmentOrThrow(id);
        return ResponseEntity.ok(convertToDto(department));
    }

    /**
     * Create department API.
     *
     * @param request department details
     * @return created department
     */
    @Operation(
            summary = "Create a new department",
            description = "Create a new department with the given name"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Department created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<DepartmentResponseDto> createDepartment(
            @Valid @RequestBody DepartmentRequestDto request) {

        Department created = departmentService.createDepartment(request.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(created));
    }

    /**
     * Update department API.
     *
     * @param id ID of the department
     * @param request updated department details
     * @return updated department
     */
    @Operation(
            summary = "Update department",
            description = "Update an existing department's name by its ID"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Department updated successfully"),
            @ApiResponse(responseCode = "404", description = "Department not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<DepartmentResponseDto> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequestDto request) {

        Department updated = departmentService.updateDepartment(id, request.getName());
        return ResponseEntity.ok(convertToDto(updated));
    }

    /**
     * Delete department API.
     *
     * @param id ID of the department
     * @return no content response
     */
    @Operation(
            summary = "Delete department",
            description = "Delete a department by ID. Fails if department has employees assigned"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Department deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Department not found"),
            @ApiResponse(responseCode = "409", description = "Department has employees assigned")
    })
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Convert Department entity to response DTO.
     *
     * @param department department entity
     * @return department response DTO
     */
    private DepartmentResponseDto convertToDto(Department department) {
        DepartmentResponseDto dto = new DepartmentResponseDto();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setEmployeeCount(
                department.getEmployees() != null ? department.getEmployees().size() : 0
        );
        return dto;
    }
}