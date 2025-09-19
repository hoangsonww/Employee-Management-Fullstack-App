package com.example.employeemanagement.DTO;

public class EmployeeCountDto {
	 private String departmentName;
	  private Long employeeCount;
	  
	  
	  public EmployeeCountDto(String departmentName, Long employeeCount) {
	        this.departmentName = departmentName;
	        this.employeeCount = employeeCount;
	    }
	  
	  public String getDepartmentName() {
		  return departmentName;
	  }
	  public void setDepartmentName(String departmentName) {
		  this.departmentName = departmentName;
	  }
	  public Long getEmployeeCount() {
		  return employeeCount;
	  }
	  public void setEmployeeCount(Long employeeCount) {
		  this.employeeCount = employeeCount;
	  }

}
