package com.example.employeemanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;

/** This class represents the main entry point of the application. */
@SpringBootApplication
@OpenAPIDefinition(
    info =
    @Info(
        title = "Employee Management System API",
        version = "1.0.0",
        description = "API documentation for managing employees and departments",
        contact = @Contact(
            name = "Employee Management System",
            email = "hoangson091104@gmail.com",
            url = "https://employee-management-fullstack-app.vercel.app/"
        ),
        license = @License(
            name = "MIT License",
            url = "https://opensource.org/licenses/MIT"
        ),
        termsOfService = "https://employee-management-fullstack-app.vercel.app/"
    )
)
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
