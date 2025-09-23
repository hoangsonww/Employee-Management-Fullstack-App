package com.example.employeemanagement.dto;

public class EmployeeListDto {
  private Long id;
  private String firstName;
  private String lastName;
  private String email;
  private String departmentName;
  private Integer age;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }
  public String getLastName() { return lastName; }
  public void setLastName(String lastName) { this.lastName = lastName; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getDepartmentName() { return departmentName; }
  public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
  public Integer getAge() { return age; }
  public void setAge(Integer age) { this.age = age; }
}