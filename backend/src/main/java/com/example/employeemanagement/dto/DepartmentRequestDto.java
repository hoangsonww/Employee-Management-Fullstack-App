package com.example.employeemanagement.dto;

import javax.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for department creation and update requests.
 *
 * <p>Carries the department name submitted by the client when creating or updating a department.
 */
@Data
@NoArgsConstructor
public class DepartmentRequestDto {

  /** The name of the department. Must not be blank. */
  @NotBlank(message = "Department name is required")
  private String name;
}
