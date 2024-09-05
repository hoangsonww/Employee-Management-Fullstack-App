package com.example.employeemanagement;

import com.example.employeemanagement.model.Department;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.repository.DepartmentRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * This class implements unit tests for the EmployeeManagementApplication.
 */
@DataJpaTest
@Transactional
public class EmployeeManagementApplicationTests {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    private Department department;

    @BeforeEach
    void setUp() {
        department = new Department();
        department.setName("IT");
        department = departmentRepository.save(department);
    }

    @Test
    void shouldFindEmployeeById() {
        Employee employee = new Employee();
        employee.setFirstName("John");
        employee.setLastName("Doe");
        employee.setEmail("john.doe@example.com");
        employee.setDepartment(department);
        employee = employeeRepository.save(employee);

        Optional<Employee> foundEmployee = employeeRepository.findById(employee.getId());

        assertThat(foundEmployee).isPresent();
        assertThat(foundEmployee.get().getFirstName()).isEqualTo("John");
    }

    @Test
    void shouldSaveEmployee() {
        Employee employee = new Employee();
        employee.setFirstName("Jane");
        employee.setLastName("Doe");
        employee.setEmail("jane.doe@example.com");
        employee.setDepartment(department);

        Employee savedEmployee = employeeRepository.save(employee);

        assertThat(savedEmployee).isNotNull();
        assertThat(savedEmployee.getId()).isNotNull();
    }
}
