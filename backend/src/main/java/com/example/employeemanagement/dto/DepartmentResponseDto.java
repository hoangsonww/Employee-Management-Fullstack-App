package com.example.employeemanagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for department responses.
 *
 * <p>Returned by the API when department information is requested. Contains the department
 * identifier, name, and the count of employees assigned to it.
 */
@Data
@NoArgsConstructor
public class DepartmentResponseDto {

  /** The unique identifier of the department. */
  private Long id;

  /** The name of the department. */
  private String name;

  /** The number of employees currently assigned to this department. */
  private int employeeCount;
}
