package com.example.employeemanagement.service;

import com.example.employeemanagement.DTO.EmployeeCountDto;
import com.example.employeemanagement.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final EmployeeRepository employeeRepository;

    public AnalyticsService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<EmployeeCountDto> getEmployeeCountByDepartment() {
    	List<EmployeeCountDto> results = employeeRepository.countEmployeesByDepartment();
        
        return results;
    }

   
}
