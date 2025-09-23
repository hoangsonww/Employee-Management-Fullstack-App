package com.example.employeemanagement.mapper;

import com.example.employeemanagement.dto.EmployeeListDto;
import com.example.employeemanagement.model.Employee;

public class EmployeeMapper {
  public static EmployeeListDto toListDto(Employee e) {
    EmployeeListDto dto = new EmployeeListDto();
    dto.setId(e.getId());
    dto.setFirstName(e.getFirstName());
    dto.setLastName(e.getLastName());
    dto.setEmail(e.getEmail());
    dto.setAge(e.getAge());
    dto.setDepartmentName(e.getDepartment() != null ? e.getDepartment().getName() : null);
    return dto;
  }
}