package com.example.employeemanagement.spec;

import com.example.employeemanagement.model.Employee;
import org.springframework.data.jpa.domain.Specification;

public class EmployeeSpecifications {
  public static Specification<Employee> textSearch(String q) {
    if (q == null || q.trim().isEmpty()) return null;
    final String like = "%" + q.toLowerCase() + "%";
    return (root, query, cb) -> cb.or(
      cb.like(cb.lower(root.get("firstName")), like),
      cb.like(cb.lower(root.get("lastName")), like),
      cb.like(cb.lower(root.get("email")), like)
    );
  }

  public static Specification<Employee> departmentIdEquals(Long departmentId) {
    if (departmentId == null) return null;
    return (root, query, cb) -> cb.equal(root.get("department").get("id"), departmentId);
  }

  public static Specification<Employee> ageBetween(Integer minAge, Integer maxAge) {
    if (minAge == null && maxAge == null) return null;
    if (minAge != null && maxAge != null) {
      return (root, query, cb) -> cb.between(root.get("age"), minAge, maxAge);
    } else if (minAge != null) {
      return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("age"), minAge);
    } else {
      return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("age"), maxAge);
    }
  }
}