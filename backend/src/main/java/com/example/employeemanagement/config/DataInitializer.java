package com.example.employeemanagement.config;

import com.example.employeemanagement.model.Department;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.repository.DepartmentRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Configuration
public class DataInitializer implements CommandLineRunner {

  @Autowired
  private DepartmentRepository departmentRepository;

  @Autowired
  private EmployeeRepository employeeRepository;

  private final Faker faker = new Faker();
  private final Random random = new Random();

  @Override
  public void run(String... args) {
    // Check if data already exists to prevent duplicates
    if (departmentRepository.count() == 0 && employeeRepository.count() == 0) {
      // Create fake departments
      List<Department> departments = new ArrayList<>();
      for (int i = 1; i <= 5; i++) {
        Department department = new Department();
        department.setName(faker.company().industry());
        departments.add(department);
      }
      departmentRepository.saveAll(departments);

      // Create fake employees
      List<Employee> employees = new ArrayList<>();
      for (int i = 1; i <= 20; i++) {
        Employee employee = new Employee();
        employee.setFirstName(faker.name().firstName());
        employee.setLastName(faker.name().lastName());
        employee.setEmail(faker.internet().emailAddress());

        // Assign a random department to each employee
        employee.setDepartment(departments.get(random.nextInt(departments.size())));
        employees.add(employee);
      }
      employeeRepository.saveAll(employees);

      System.out.println("Fake data initialized successfully!");
    } else {
      System.out.println("Data already exists, skipping initialization.");
    }
  }
}
