package com.example.employeemanagement.controller;

import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Department;
import com.example.employeemanagement.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

  @Autowired
  private DepartmentService departmentService;

  // Get all departments
  @GetMapping
  public List<Department> getAllDepartments() {
    return departmentService.getAllDepartments();
  }

  // Get department by ID
  @GetMapping("/{id}")
  public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
    Department department = departmentService.getDepartmentById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    return ResponseEntity.ok(department);
  }

  // Create a new department
  @PostMapping
  public Department createDepartment(@RequestBody Department department) {
    return departmentService.saveDepartment(department);
  }

  // Update an existing department
  @PutMapping("/{id}")
  public ResponseEntity<Department> updateDepartment(@PathVariable Long id, @RequestBody Department departmentDetails) {
    Department department = departmentService.getDepartmentById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

    department.setName(departmentDetails.getName());

    Department updatedDepartment = departmentService.saveDepartment(department);
    return ResponseEntity.ok(updatedDepartment);
  }

  // Delete a department
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
    Department department = departmentService.getDepartmentById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

    departmentService.deleteDepartment(id);
    return ResponseEntity.noContent().build();
  }
}
