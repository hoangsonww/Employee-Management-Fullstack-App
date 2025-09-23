package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.DepartmentListDto;
import com.example.employeemanagement.dto.PageResponse;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.mapper.DepartmentMapper;
import com.example.employeemanagement.model.Department;
import com.example.employeemanagement.service.DepartmentService;
import com.example.employeemanagement.spec.DepartmentSpecifications;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/** This class represents the REST API controller for departments. */
@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Department APIs", description = "API Operations related to managing departments")
public class DepartmentController {

  /** The department service. */
  @Autowired private DepartmentService departmentService;

  private static final int DEFAULT_PAGE = 0;
  private static final int DEFAULT_SIZE = 10;
  private static final int MAX_SIZE = 100;
  private static final String DEFAULT_SORT = "id,asc";
  private static final List<String> ALLOWED_SORT_PROPERTIES = List.of("id", "name");
  
  @Operation(summary = "Get all departments", description = "Retrieve a paginated list of departments")
  @GetMapping
  public PageResponse<DepartmentListDto> getAllDepartments(
      @RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
      @RequestParam(name = "size", required = false, defaultValue = "10") Integer size,
      @RequestParam(name = "sort", required = false, defaultValue = "id,asc") String sort,
      @RequestParam(name = "q", required = false) String q
  ) {
      int safePage = page == null || page < 0 ? DEFAULT_PAGE : page;
      int safeSize = size == null || size < 1 ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);
  
      Sort springSort = parseAndValidateSort(sort);
      Pageable pageable = PageRequest.of(safePage, safeSize, springSort);
  
      Specification<Department> spec = Specification.where(DepartmentSpecifications.textSearch(q));
  
      Page<Department> result = departmentService.getDepartments(spec, pageable);
  
      List<DepartmentListDto> content = result.getContent().stream()
          .map(DepartmentMapper::toListDto)
          .collect(Collectors.toList());
  
      PageResponse<DepartmentListDto> response = new PageResponse<>();
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
      return Sort.by(new Sort.Order(dir, property));
  }
  /** This class represents the REST API controller for departments. */
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
    return ResponseEntity.ok(
        departmentService
            .getDepartmentById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Department not found with id: " + id))
    );
  }

  @Operation(summary = "Create a new department", description = "Create a new department record")
  @ApiResponse(responseCode = "201", description = "Department created successfully")
  @PostMapping
  public Department createDepartment(@RequestBody Department department) {
    return departmentService.saveDepartment(department);
  }

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

  @Operation(summary = "Delete a department", description = "Delete a department record by ID")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "204", description = "Department deleted"),
        @ApiResponse(responseCode = "404", description = "Department not found")
      })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteDepartment(
      @Parameter(description = "ID of the department to be deleted") @PathVariable Long id) {
    departmentService
        .getDepartmentById(id)
        .orElseThrow(
            () -> new ResourceNotFoundException("Department not found with id: " + id));

    departmentService.deleteDepartment(id);
    return ResponseEntity.noContent().build();
  }
}
