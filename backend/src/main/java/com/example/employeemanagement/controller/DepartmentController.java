package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.DepartmentRequestDto;
import com.example.employeemanagement.dto.DepartmentResponseDto;
import com.example.employeemanagement.model.Department;
import com.example.employeemanagement.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Department APIs", description = "API Operations related to managing departments")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    /**
     * Get all departments.
     *
     * @return list of departments
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
     * Get department by ID.
     *
     * @param id the department ID
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
     * Create a new department.
     *
     * @param request department creation request
     * @return created department
     */
    @Operation(
            summary = "Create a new department",
            description = "Create a new department record"
    )
    @ApiResponse(responseCode = "201", description = "Department created successfully")
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<DepartmentResponseDto> createDepartment(
            @Valid @RequestBody DepartmentRequestDto request) {

        Department created = departmentService.createDepartment(request.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(created));
    }

    /**
     * Update an existing department.
     *
     * @param id the department ID
     * @param request updated department details
     * @return updated department
     */
    @Operation(
            summary = "Update an existing department",
            description = "Update an existing department's details"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Department updated"),
            @ApiResponse(responseCode = "404", description = "Department not found")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<DepartmentResponseDto> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequestDto request) {

        Department updated = departmentService.updateDepartment(id, request.getName());
        return ResponseEntity.ok(convertToDto(updated));
    }

    /**
     * Delete a department.
     *
     * @param id the department ID
     * @return response entity with no content
     */
    @Operation(
            summary = "Delete a department",
            description = "Delete a department record by ID"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Department deleted"),
            @ApiResponse(responseCode = "404", description = "Department not found"),
            @ApiResponse(responseCode = "409", description = "Department has employees assigned")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {

        Department department = departmentService.getDepartmentOrThrow(id);

        long employeeCount = departmentService.countEmployeesInDepartment(id);
        if (employeeCount > 0) {
            Map<String, String> error = new HashMap<>();
            error.put("message",
                    "Cannot delete department with " + employeeCount +
                            " employees. Reassign or remove employees first.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }

        departmentService.deleteDepartment(department.getId());
        return ResponseEntity.noContent().build();
    }

    /**
     * Convert Department entity to response DTO.
     *
     * @param department the department entity
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