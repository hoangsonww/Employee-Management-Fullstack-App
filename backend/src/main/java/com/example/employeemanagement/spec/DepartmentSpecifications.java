package com.example.employeemanagement.spec;

import com.example.employeemanagement.model.Department;
import org.springframework.data.jpa.domain.Specification;

public class DepartmentSpecifications {
  public static Specification<Department> textSearch(String q) {
    if (q == null || q.trim().isEmpty()) return null;
    final String like = "%" + q.toLowerCase() + "%";
    return (root, query, cb) -> cb.like(cb.lower(root.get("name")), like);
  }
}