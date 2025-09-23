package com.example.employeemanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import javax.persistence.*;

/**
 * This class represents an Employee entity. Each employee has an ID, first name, last name, email,
 * department, and age.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "employees", indexes = {  
  @Index(name = "idx_employees_first_name", columnList = "firstName"),  
  @Index(name = "idx_employees_last_name", columnList = "lastName"),  
  @Index(name = "idx_employees_email", columnList = "email"),  
  @Index(name = "idx_employees_department_id", columnList = "department_id"),  
  @Index(name = "idx_employees_age", columnList = "age")  
})
public class Employee {

  /** The ID of the employee. It is unique and generated automatically. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** The first name of the employee. */
  private String firstName;

  /** The last name of the employee. */
  private String lastName;

  /** The email of the employee. */
  private String email;

  /** The department of the employee. */
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "department_id", nullable = false)
  @JsonBackReference
  private Department department;

  /** The age of the employee. */
  private int age;
}
