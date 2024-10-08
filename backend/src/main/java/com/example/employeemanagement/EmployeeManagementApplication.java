package com.example.employeemanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

/** This class represents the main entry point of the application. */
@SpringBootApplication
@OpenAPIDefinition(
    info =
        @Info(
            title = "Employee Management System API",
            version = "1.0.0",
            description = "API documentation for a system managing employees and departments"))
public class EmployeeManagementApplication {

  /**
   * The main entry point of the application.
   *
   * @param args Command-line arguments
   */
  public static void main(String[] args) {
    SpringApplication.run(EmployeeManagementApplication.class, args);
  }
}
