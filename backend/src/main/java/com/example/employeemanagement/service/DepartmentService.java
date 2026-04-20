package com.example.employeemanagement.service;

import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Department;
import com.example.employeemanagement.repository.DepartmentRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** This class represents the service for departments. */
@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    /**
     * Get all departments with employees.
     */
    public List<Department> getAllDepartments() {
        return departmentRepository.findAllWithEmployees();
    }

    /**
     * Get department by ID or throw exception.
     */
    public Department getDepartmentOrThrow(Long id) {
        return departmentRepository.findByIdWithEmployees(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found with id: " + id));
    }

    /**
     * Create a new department.
     */
    public Department createDepartment(String name) {
        Department department = new Department();
        department.setName(name);
        return departmentRepository.save(department);
    }

    /**
     * Update existing department.
     */
    public Department updateDepartment(Long id, String name) {
        Department department = getDepartmentOrThrow(id);
        department.setName(name);
        return departmentRepository.save(department);
    }

    /**
     * Delete department with validation.
     */
    public void deleteDepartment(Long id) {
        Department department = getDepartmentOrThrow(id);

        long employeeCount = employeeRepository.countByDepartmentId(id);
        if (employeeCount > 0) {
            throw new IllegalStateException(
                    "Cannot delete department with " + employeeCount + " employees. " +
                            "Reassign or remove employees first."
            );
        }

        departmentRepository.delete(department);
    }

    public long countEmployeesInDepartment(Long id) {
        return employeeRepository.countByDepartmentId(id);
    }
}