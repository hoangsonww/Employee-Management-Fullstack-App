package com.example.employeemanagement.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.employeemanagement.DTO.EmployeeCountDto;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.service.AnalyticsService;
import com.example.employeemanagement.service.DepartmentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Analytics APIs", description = "API Operations related to analytics")

public class AnalyticsController {
	
	private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @Operation(summary = "Get employee count by department",
               description = "Returns the number of employees grouped by department.")
    @GetMapping("/employees-by-department")
    public List<EmployeeCountDto> getEmployeesByDepartment() {
        return analyticsService.getEmployeeCountByDepartment();
    }

    /*   @Operation(summary = "Get new hires per month",
               description = "Returns the number of new employees hired each month.")
    @GetMapping("/new-hires")
    public Map<String, Long> getNewHiresPerMonth() {
        return analyticsService.getNewHiresPerMonth();
    }

  
    @Operation(summary = "Get turnover rate per quarter",
               description = "Returns the number of employees who exited the company per quarter.")
    @GetMapping("/turnover-rate")
    public Map<String, Long> getTurnoverRatePerQuarter() {
        return analyticsService.getTurnoverRatePerQuarter();
    }

    @Operation(summary = "Get average employee tenure",
               description = "Returns the average tenure of employees in years.")
    @GetMapping("/average-tenure")
    public Double getAverageTenure() {
        return analyticsService.getAverageTenure();
    }*/
}
