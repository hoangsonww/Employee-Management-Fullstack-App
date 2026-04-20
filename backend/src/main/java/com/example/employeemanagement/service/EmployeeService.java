package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.EmployeeRequestDto;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Department;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.repository.EmployeeRepository;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** This class represents the service for employees. */
@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private EntityManager entityManager;

    /**
     * Get all employees with departments.
     */
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAllWithDepartments();
    }

    /**
     * Get employee by ID or throw exception.
     */
    public Employee getEmployeeOrThrow(Long id) {
        return employeeRepository.findByIdWithDepartment(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found with id: " + id));
    }

    /**
     * Create employee.
     */
    @Transactional
    public Employee createEmployee(EmployeeRequestDto request) {

        Department department = departmentService.getDepartmentOrThrow(
                request.getDepartment().getId()
        );

        Employee employee = new Employee();
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setAge(request.getAge());
        employee.setDepartment(department);

        return saveAndFetch(employee);
    }

    /**
     * Update employee.
     */
    @Transactional
    public Employee updateEmployee(Long id, EmployeeRequestDto request) {

        Employee employee = getEmployeeOrThrow(id);

        Department department = departmentService.getDepartmentOrThrow(
                request.getDepartment().getId()
        );

        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setAge(request.getAge());
        employee.setDepartment(department);

        return saveAndFetch(employee);
    }

    /**
     * Delete employee.
     */
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeOrThrow(id);
        employeeRepository.delete(employee);
    }

    /**
     * Save and re-fetch employee with department.
     */
    private Employee saveAndFetch(Employee employee) {
        Employee saved = employeeRepository.save(employee);
        entityManager.flush();
        entityManager.clear();
        return employeeRepository.findByIdWithDepartment(saved.getId()).orElse(saved);
    }
}