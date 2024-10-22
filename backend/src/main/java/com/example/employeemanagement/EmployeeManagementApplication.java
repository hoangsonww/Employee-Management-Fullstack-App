package com.example.employeemanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
// Using the fully qualified name for SecurityScheme to avoid conflict
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
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
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = "JWT Authorization header using the Bearer scheme"
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

  /**
   * Configure OpenAPI with JWT Bearer authentication.
   *
   * @return OpenAPI custom configuration.
   */
  @Bean
  public OpenAPI customOpenAPI() {
    return new OpenAPI()
        // Add security requirement globally
        .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
        .components(new Components()
            // Fully qualified name for SecurityScheme to avoid name conflict
            .addSecuritySchemes("bearerAuth",
                new io.swagger.v3.oas.models.security.SecurityScheme()
                    .name("bearerAuth")
                    .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
  }
}
