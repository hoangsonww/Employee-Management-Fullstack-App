package com.example.employeemanagement.controller;

import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

  @Autowired
  private EmployeeService employeeService;

  // Get all employees
  @GetMapping
  public List<Employee> getAllEmployees() {
    return employeeService.getAllEmployees();
  }

  // Get employee by ID
  @GetMapping("/{id}")
  public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
    Employee employee = employeeService.getEmployeeById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    return ResponseEntity.ok(employee);
  }

  // Create a new employee
  @PostMapping
  public Employee createEmployee(@RequestBody Employee employee) {
    return employeeService.saveEmployee(employee);
  }

  // Update an existing employee
  @PutMapping("/{id}")
  public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
    Employee employee = employeeService.getEmployeeById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

    employee.setFirstName(employeeDetails.getFirstName());
    employee.setLastName(employeeDetails.getLastName());
    employee.setEmail(employeeDetails.getEmail());
    employee.setDepartment(employeeDetails.getDepartment());

    Employee updatedEmployee = employeeService.saveEmployee(employee);
    return ResponseEntity.ok(updatedEmployee);
  }

  // Delete an employee
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
    Employee employee = employeeService.getEmployeeById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

    employeeService.deleteEmployee(id);
    return ResponseEntity.noContent().build();
  }
}
