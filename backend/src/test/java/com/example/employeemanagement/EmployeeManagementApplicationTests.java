package com.example.employeemanagement;

import com.example.employeemanagement.controller.EmployeeController;
import com.example.employeemanagement.model.Department;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.repository.DepartmentRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.service.EmployeeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
class EmployeeManagementApplicationTests {

    // Repository Tests
    @DataJpaTest
    @Transactional
    static class EmployeeRepositoryTests {

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

    // Service Tests
    static class EmployeeServiceTests {

        @Mock
        private EmployeeRepository employeeRepository;

        @Mock
        private DepartmentRepository departmentRepository;

        @InjectMocks
        private EmployeeService employeeService;

        private Department department;

        @BeforeEach
        void setUp() {
            MockitoAnnotations.openMocks(this);
            department = new Department();
            department.setName("HR");
        }

        @Test
        void shouldSaveEmployee() {
            Employee employee = new Employee();
            employee.setFirstName("Alice");
            employee.setLastName("Smith");
            employee.setEmail("alice.smith@example.com");
            employee.setDepartment(department);

            when(employeeRepository.save(any(Employee.class))).thenReturn(employee);

            Employee savedEmployee = employeeService.saveEmployee(employee);

            assertThat(savedEmployee).isNotNull();
            assertThat(savedEmployee.getFirstName()).isEqualTo("Alice");
        }

        @Test
        void shouldFindEmployeeById() {
            Employee employee = new Employee();
            employee.setFirstName("Bob");
            employee.setLastName("Brown");
            employee.setEmail("bob.brown@example.com");
            employee.setDepartment(department);

            when(employeeRepository.findById(any(Long.class))).thenReturn(Optional.of(employee));

            Optional<Employee> foundEmployee = employeeService.getEmployeeById(1L);

            assertThat(foundEmployee).isPresent();
            assertThat(foundEmployee.get().getLastName()).isEqualTo("Brown");
        }
    }

    // Controller Tests
    @WebMvcTest(EmployeeController.class)
    static class EmployeeControllerTests {

        @Autowired
        private MockMvc mockMvc;

        @Mock
        private EmployeeService employeeService;

        @InjectMocks
        private EmployeeController employeeController;

        private ObjectMapper objectMapper;

        @BeforeEach
        void setUp() {
            MockitoAnnotations.openMocks(this);
            objectMapper = new ObjectMapper();
        }

        @Test
        void shouldReturnEmployeeById() throws Exception {
            Employee employee = new Employee();
            employee.setFirstName("Charlie");
            employee.setLastName("Green");
            employee.setEmail("charlie.green@example.com");

            when(employeeService.getEmployeeById(1L)).thenReturn(Optional.of(employee));

            mockMvc.perform(MockMvcRequestBuilders.get("/api/employees/1"))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value("Charlie"))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value("Green"));
        }

        @Test
        void shouldCreateEmployee() throws Exception {
            Employee employee = new Employee();
            employee.setFirstName("Diana");
            employee.setLastName("White");
            employee.setEmail("diana.white@example.com");

            when(employeeService.saveEmployee(any(Employee.class))).thenReturn(employee);

            mockMvc.perform(MockMvcRequestBuilders.post("/api/employees")
                            .contentType("application/json")
                            .content(objectMapper.writeValueAsString(employee)))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value("Diana"));
        }
    }
}
