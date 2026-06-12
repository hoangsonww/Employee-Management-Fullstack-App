package com.example.employeemanagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for employee responses.
 *
 * <p>Returned by the API when employee information is requested. Contains the employee's personal
 * details and a nested representation of their department.
 */
@Data
@NoArgsConstructor
public class EmployeeResponseDto {

  /** The unique identifier of the employee. */
  private Long id;

  /** The first name of the employee. */
  private String firstName;

  /** The last name of the employee. */
  private String lastName;

  /** The email address of the employee. */
  private String email;

  /** The age of the employee. */
  private int age;

  /** The department the employee belongs to. */
  private DepartmentDto department;

  /**
   * Nested DTO representing department information within an employee response.
   *
   * <p>Provides a lightweight view of the department containing only its ID and name, avoiding
   * circular references with the full {@link com.example.employeemanagement.model.Department}
   * entity.
   */
  @Data
  @NoArgsConstructor
  public static class DepartmentDto {

    /** The unique identifier of the department. */
    private Long id;

    /** The name of the department. */
    private String name;
  }
}
