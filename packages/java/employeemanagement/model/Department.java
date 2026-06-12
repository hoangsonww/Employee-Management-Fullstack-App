package com.example.employeemanagement.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** This class represents a Department entity. Each department has an ID and a name. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "departments")
public class Department {

  /** The ID of the department. It is unique and generated automatically. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** The name of the department. */
  @NotBlank(message = "Department name is required")
  private String name;

  /** The list of employees in the department. */
  @OneToMany(
      mappedBy = "department",
      cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  @JsonManagedReference
  private List<Employee> employees;
}
