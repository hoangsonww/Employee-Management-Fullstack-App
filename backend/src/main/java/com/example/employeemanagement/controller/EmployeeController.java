package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.EmployeeListDto;
import com.example.employeemanagement.dto.PageResponse;
import com.example.employeemanagement.mapper.EmployeeMapper;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.service.EmployeeService;
import com.example.employeemanagement.spec.EmployeeSpecifications;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/** This class represents the REST API controller for employees. */
@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Employees APIs", description = "API Operations related to managing employees")
public class EmployeeController {

  /** The employee service. */
  @Autowired private EmployeeService employeeService;

  private static final int DEFAULT_PAGE = 0;
  private static final int DEFAULT_SIZE = 10;
  private static final int MAX_SIZE = 100;
  private static final String DEFAULT_SORT = "id,asc";
  private static final List<String> ALLOWED_SORT_PROPERTIES = List.of(
      "id", "firstName", "lastName", "email", "age", "department.id", "department.name"
  );

  @Operation(summary = "Get all employees", description = "Retrieve a paginated list of employees")
  @GetMapping
  public PageResponse<EmployeeListDto> getAllEmployees(
      @RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
      @RequestParam(name = "size", required = false, defaultValue = "10") Integer size,
      @RequestParam(name = "sort", required = false, defaultValue = "id,asc") String sort,
      @RequestParam(name = "q", required = false) String q,
      @RequestParam(name = "departmentId", required = false) Long departmentId,
      @RequestParam(name = "minAge", required = false) Integer minAge,
      @RequestParam(name = "maxAge", required = false) Integer maxAge
  ) {
      int safePage = page == null || page < 0 ? DEFAULT_PAGE : page;
      int safeSize = size == null || size < 1 ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);
  
      Sort springSort = parseAndValidateSort(sort);
      Pageable pageable = PageRequest.of(safePage, safeSize, springSort);
  
      Specification<Employee> spec = Specification.where(EmployeeSpecifications.textSearch(q))
          .and(EmployeeSpecifications.departmentIdEquals(departmentId))
          .and(EmployeeSpecifications.ageBetween(minAge, maxAge));
  
      Page<Employee> result = employeeService.getEmployees(spec, pageable);
  
      List<EmployeeListDto> content = result.getContent().stream()
          .map(EmployeeMapper::toListDto)
          .collect(Collectors.toList());
  
      PageResponse<EmployeeListDto> response = new PageResponse<>();
      response.setContent(content);
      response.setPage(result.getNumber());
      response.setSize(result.getSize());
      response.setTotalElements(result.getTotalElements());
      response.setTotalPages(result.getTotalPages());
      response.setHasNext(result.hasNext());
      response.setHasPrevious(result.hasPrevious());
      response.setSort(toSortOrders(result.getSort()));
      return response;
  }
  
  private List<PageResponse.SortOrder> toSortOrders(Sort sort) {
      List<PageResponse.SortOrder> orders = new ArrayList<>();
      for (Sort.Order o : sort) {
          orders.add(new PageResponse.SortOrder(o.getProperty(), o.getDirection().name()));
      }
      return orders;
  }
  
  private Sort parseAndValidateSort(String sort) {
      String value = (sort == null || sort.isBlank()) ? DEFAULT_SORT : sort;
      String[] parts = value.split(",");
      String property = parts[0].trim();
      String direction = parts.length > 1 ? parts[1].trim().toLowerCase(Locale.ROOT) : "asc";
  
      if (!ALLOWED_SORT_PROPERTIES.contains(property)) {
          throw new IllegalArgumentException("Invalid sort field. Allowed: " + ALLOWED_SORT_PROPERTIES);
      }
  
      Sort.Direction dir = direction.equals("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
  
      return property.contains(".") ? Sort.by(new Sort.Order(dir, property)) : Sort.by(new Sort.Order(dir, property));
  }

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
    return ResponseEntity.ok(
      employeeService.getEmployeeById(id)
          .orElseThrow(() -> new com.example.employeemanagement.exception.ResourceNotFoundException("Employee not found with id: " + id))
  );
  }

  @Operation(summary = "Create a new employee", description = "Create a new employee record")
  @PostMapping
  public Employee createEmployee(@RequestBody Employee employee) {
    return employeeService.saveEmployee(employee);
  }

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
            .orElseThrow(() -> new com.example.employeemanagement.exception.ResourceNotFoundException("Employee not found with id: " + id));

    employee.setFirstName(employeeDetails.getFirstName());
    employee.setLastName(employeeDetails.getLastName());
    employee.setEmail(employeeDetails.getEmail());
    employee.setDepartment(employeeDetails.getDepartment());
    employee.setAge(employeeDetails.getAge());

    Employee updatedEmployee = employeeService.saveEmployee(employee);
    return ResponseEntity.ok(updatedEmployee);
  }

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
        .orElseThrow(() -> new com.example.employeemanagement.exception.ResourceNotFoundException("Employee not found with id: " + id));

    employeeService.deleteEmployee(id);
    return ResponseEntity.noContent().build();
  }
}
