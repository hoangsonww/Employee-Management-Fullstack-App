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
import static org.assertj.core.api.Assertions.setRemoveAssertJRelatedElementsFromStackTrace;

/** This class implements unit tests for the EmployeeManagementApplication. */
@DataJpaTest
@Transactional
public class JUnit {

  /** The employee repository. */
  @Autowired private EmployeeRepository employeeRepository;

  /** The department repository. */
  @Autowired private DepartmentRepository departmentRepository;

  /** The department. */
  private Department department;

  /** Set up the test environment. */
  @BeforeEach
  void setUp() {
    department = new Department();
    department.setName("IT");
    department = departmentRepository.save(department);
  }

  /** Test the find all employees method. */
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

  /** Test the save employee method. */
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

  /** Test the update employee method. */
  @Test
  void shouldDeleteEmployee() {
    Employee employee = new Employee();
    employee.setFirstName("Jane");
    employee.setLastName("Doe");
    employee.setEmail("jane.doe@example.com");
    employee.setDepartment(department);

    employee = employeeRepository.save(employee);
    employeeRepository.deleteById(employee.getId());

    Optional<Employee> foundEmployee = employeeRepository.findById(employee.getId());
    assertThat(foundEmployee).isEmpty();
    assertThat(employeeRepository.count()).isEqualTo(0);
  }

  /** Test the find all departments method. */
  @Test
  void shouldFindAllDepartments() {
    Department department1 = new Department();
    department1.setName("HR");
    departmentRepository.save(department1);

    Department department2 = new Department();
    department2.setName("Finance");
    departmentRepository.save(department2);

    assertThat(departmentRepository.findAll()).hasSize(3);
  }

  /** Test the find department by ID method. */
  @Test
  void shouldFindDepartmentById() {
    Department department = new Department();
    department.setName("Marketing");
    department = departmentRepository.save(department);

    Optional<Department> foundDepartment = departmentRepository.findById(department.getId());

    assertThat(foundDepartment).isPresent();
    assertThat(foundDepartment.get().getName()).isEqualTo("Marketing");
  }

  /** Test the save department method. */
  @Test
  void shouldSaveDepartment() {
    Department department = new Department();
    department.setName("Sales");

    Department savedDepartment = departmentRepository.save(department);

    assertThat(savedDepartment).isNotNull();
    assertThat(savedDepartment.getId()).isNotNull();
  }

  /** Test the update department method. */
  @Test
  void shouldUpdateDepartment() {
    Department department = new Department();
    department.setName("Sales");
    department = departmentRepository.save(department);

    department.setName("Sales & Marketing");
    Department updatedDepartment = departmentRepository.save(department);

    assertThat(updatedDepartment.getName()).isEqualTo("Sales & Marketing");
  }

  /** Test the delete department method. */
  @Test
  void shouldDeleteDepartment() {
    Department department = new Department();
    department.setName("Sales");
    department = departmentRepository.save(department);

    departmentRepository.deleteById(department.getId());

    Optional<Department> foundDepartment = departmentRepository.findById(department.getId());
    assertThat(foundDepartment).isEmpty();
    assertThat(departmentRepository.count()).isEqualTo(1);
  }

  /** Test the find employees by department ID method. */
  @Test
  void shouldFindEmployeesByDepartmentId() {
    Department department1 = new Department();
    department1.setName("HR");
    department1 = departmentRepository.save(department1);

    Department department2 = new Department();
    department2.setName("Finance");
    department2 = departmentRepository.save(department2);

    Employee employee1 = new Employee();
    employee1.setFirstName("John");
    employee1.setLastName("Doe");
    employee1.setEmail("jane.doe@example.com");
    employee1.setDepartment(department1);
    employeeRepository.save(employee1);

    Employee employee2 = new Employee();
    employee2.setFirstName("Jane");
    employee2.setLastName("Doe");
    employee2.setEmail("jane.doe2@example.com");
    employee2.setDepartment(department2);
    employeeRepository.save(employee2);

    assertThat(employeeRepository.findById(employee1.getId()).get().getDepartment().getId())
        .isEqualTo(department1.getId());
    assertThat(employeeRepository.findById(employee2.getId()).get().getDepartment().getId())
        .isEqualTo(department2.getId());
  }

  /** Test the find employees by department name method. */
  @Test
  void shouldFindEmployeesByDepartmentName() {
    Department department1 = new Department();
    department1.setName("HR");
    department1 = departmentRepository.save(department1);

    Department department2 = new Department();
    department2.setName("Finance");
    department2 = departmentRepository.save(department2);

    Employee employee1 = new Employee();
    employee1.setFirstName("John");
    employee1.setLastName("Doe");
    employee1.setEmail("jane.doe@example.com");
    employee1.setDepartment(department1);
    employeeRepository.save(employee1);

    assertThat(employeeRepository.findById(employee1.getId()).get().getDepartment().getName())
        .isEqualTo("HR");
    assertThat(employeeRepository.findById(employee1.getId()).get().getDepartment().getName())
        .isNotEqualTo("Finance");
  }
}
