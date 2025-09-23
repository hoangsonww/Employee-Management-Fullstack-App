package com.example.employeemanagement.mapper;

import com.example.employeemanagement.dto.DepartmentListDto;
import com.example.employeemanagement.model.Department;

public class DepartmentMapper {
  public static DepartmentListDto toListDto(Department d) {
    DepartmentListDto dto = new DepartmentListDto();
    dto.setId(d.getId());
    dto.setName(d.getName());
    return dto;
  }
}