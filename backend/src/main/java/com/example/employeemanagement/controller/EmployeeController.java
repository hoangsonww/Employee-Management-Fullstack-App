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

/** This class represents the REST API controller for employees. */
@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Employee APIs", description = "API Operations related to managing employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    /**
     * Get all employees API.
     *
     * @return list of all employees
     */
    @Operation(
            summary = "Get all employees",
            description = "Retrieve a list of all employees along with their department details"
    )
    @ApiResponse(responseCode = "200", description = "Employees retrieved successfully")
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<EmployeeResponseDto> getAllEmployees() {
        return employeeService.getAllEmployees().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get employee by ID API.
     *
     * @param id ID of the employee
     * @return employee details
     */
    @Operation(
            summary = "Get employee by ID",
            description = "Retrieve a specific employee by their ID"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Employee found"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EmployeeResponseDto> getEmployeeById(@PathVariable Long id) {
        Employee employee = employeeService.getEmployeeOrThrow(id);
        return ResponseEntity.ok(convertToDto(employee));
    }

    /**
     * Create employee API.
     *
     * @param request employee details
     * @return created employee
     */
    @Operation(
            summary = "Create a new employee",
            description = "Create a new employee and assign them to a department"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Employee created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Department not found")
    })
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<EmployeeResponseDto> createEmployee(
            @Valid @RequestBody EmployeeRequestDto request) {

        Employee saved = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(convertToDto(saved));
    }

    /**
     * Update employee API.
     *
     * @param id ID of the employee
     * @param request updated employee details
     * @return updated employee
     */
    @Operation(
            summary = "Update employee",
            description = "Update an existing employee's details including department assignment"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Employee updated successfully"),
            @ApiResponse(responseCode = "404", description = "Employee or Department not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponseDto> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequestDto request) {

        Employee updated = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(convertToDto(updated));
    }

    /**
     * Delete employee API.
     *
     * @param id ID of the employee
     * @return no content response
     */
    @Operation(
            summary = "Delete employee",
            description = "Delete an employee record by ID"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Employee deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Convert Employee entity to response DTO.
     *
     * @param employee employee entity
     * @return employee response DTO
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
}