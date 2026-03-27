package com.example.employeemanagement.dto;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for employee creation and update requests.
 *
 * <p>Carries the employee details submitted by the client, including personal information and a
 * reference to the department the employee belongs to.
 */
@Data
@NoArgsConstructor
public class EmployeeRequestDto {

  /** The first name of the employee. Must not be blank. */
  @NotBlank(message = "First name is required")
  private String firstName;

  /** The last name of the employee. Must not be blank. */
  @NotBlank(message = "Last name is required")
  private String lastName;

  /** The email address of the employee. Must be a valid email format and not blank. */
  @NotBlank(message = "Email is required")
  @Email(message = "Email must be valid")
  private String email;

  /** The age of the employee. Must be between 18 and 65 inclusive. */
  @Min(value = 18, message = "Age must be at least 18")
  @Max(value = 65, message = "Age must be at most 65")
  private int age;

  /** A reference to the department this employee belongs to. Must not be null. */
  @Valid
  @NotNull(message = "Department is required")
  private DepartmentRef department;

  /**
   * Nested DTO representing a reference to an existing department by its ID.
   *
   * <p>Used within {@link EmployeeRequestDto} to associate an employee with a department.
   */
  @Data
  @NoArgsConstructor
  public static class DepartmentRef {

    /** The unique identifier of the department. Must not be null. */
    @NotNull(message = "Department ID is required")
    private Long id;
  }
}
