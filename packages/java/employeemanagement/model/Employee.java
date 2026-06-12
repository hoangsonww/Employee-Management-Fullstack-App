package com.example.employeemanagement.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * This class represents an Employee entity. Each employee has an ID, first name, last name, email,
 * department, and age.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "employees")
public class Employee {

  /** The ID of the employee. It is unique and generated automatically. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** The first name of the employee. */
  @NotBlank(message = "First name is required")
  private String firstName;

  /** The last name of the employee. */
  @NotBlank(message = "Last name is required")
  private String lastName;

  /** The email of the employee. */
  @NotBlank(message = "Email is required")
  @Email(message = "Email must be valid")
  private String email;

  /** The department of the employee. */
  @NotNull(message = "Department is required")
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "department_id", nullable = false)
  @JsonBackReference
  private Department department;

  /** The age of the employee. */
  @Min(value = 18, message = "Age must be at least 18")
  @Max(value = 65, message = "Age must be at most 65")
  private int age;
}
