package com.example.employeemanagement.controller;

import com.example.employeemanagement.model.AuditLog;
import com.example.employeemanagement.model.Permission;
import com.example.employeemanagement.model.Role;
import com.example.employeemanagement.model.User;
import com.example.employeemanagement.service.AuditService;
import com.example.employeemanagement.service.RbacService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/** This class represents the REST API controller for admin operations. */
@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin APIs", description = "API Operations for admin users - role management and audit logs")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

  @Autowired private RbacService rbacService;

  @Autowired private AuditService auditService;

  /**
   * Get all roles.
   *
   * @return List of all roles
   */
  @Operation(summary = "Get all roles", description = "Retrieve all available roles in the system")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "Successfully retrieved roles"),
          @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions")
      })
  @GetMapping("/roles")
  @PreAuthorize("hasAuthority('USER_READ')")
  public ResponseEntity<List<Role>> getAllRoles() {
    List<Role> roles = rbacService.getAllRoles();
    return ResponseEntity.ok(roles);
  }

  /**
   * Get all permissions.
   *
   * @return List of all permissions
   */
  @Operation(summary = "Get all permissions", description = "Retrieve all available permissions in the system")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "Successfully retrieved permissions"),
          @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions")
      })
  @GetMapping("/permissions")
  @PreAuthorize("hasAuthority('USER_READ')")
  public ResponseEntity<List<Permission>> getAllPermissions() {
    List<Permission> permissions = rbacService.getAllPermissions();
    return ResponseEntity.ok(permissions);
  }

  /**
   * Get all users with their roles.
   *
   * @return List of all users
   */
  @Operation(summary = "Get all users", description = "Retrieve all users with their assigned roles")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "Successfully retrieved users"),
          @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions")
      })
  @GetMapping("/users")
  @PreAuthorize("hasAuthority('USER_READ')")
  public ResponseEntity<List<User>> getAllUsers() {
    List<User> users = rbacService.getAllUsersWithRoles();
    return ResponseEntity.ok(users);
  }

  /**
   * Assign a role to a user.
   *
   * @param request The request containing userId and roleName
   * @return Success or failure response
   */
  @Operation(summary = "Assign role to user", description = "Assign a role to a specific user")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "Role assigned successfully"),
          @ApiResponse(responseCode = "400", description = "Invalid request data"),
          @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
          @ApiResponse(responseCode = "404", description = "User or role not found")
      })
  @PostMapping("/users/assign-role")
  @PreAuthorize("hasAuthority('USER_ROLE_ASSIGN')")
  public ResponseEntity<String> assignRoleToUser(@RequestBody Map<String, Object> request) {
    try {
      Long userId = Long.valueOf(request.get("userId").toString());
      String roleName = request.get("roleName").toString();
      Long actorUserId = Long.valueOf(request.get("actorUserId").toString());

      boolean success = rbacService.assignRoleToUser(userId, roleName, actorUserId);
      
      if (success) {
        return ResponseEntity.ok("Role assigned successfully");
      } else {
        return ResponseEntity.badRequest().body("Failed to assign role - user may already have this role or invalid data");
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error assigning role: " + e.getMessage());
    }
  }

  /**
   * Remove a role from a user.
   *
   * @param request The request containing userId and roleName
   * @return Success or failure response
   */
  @Operation(summary = "Remove role from user", description = "Remove a role from a specific user")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "Role removed successfully"),
          @ApiResponse(responseCode = "400", description = "Invalid request data"),
          @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
          @ApiResponse(responseCode = "404", description = "User or role not found")
      })
  @PostMapping("/users/remove-role")
  @PreAuthorize("hasAuthority('USER_ROLE_ASSIGN')")
  public ResponseEntity<String> removeRoleFromUser(@RequestBody Map<String, Object> request) {
    try {
      Long userId = Long.valueOf(request.get("userId").toString());
      String roleName = request.get("roleName").toString();
      Long actorUserId = Long.valueOf(request.get("actorUserId").toString());

      boolean success = rbacService.removeRoleFromUser(userId, roleName, actorUserId);
      
      if (success) {
        return ResponseEntity.ok("Role removed successfully");
      } else {
        return ResponseEntity.badRequest().body("Failed to remove role - user may not have this role or invalid data");
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error removing role: " + e.getMessage());
    }
  }

  /**
   * Get audit logs with optional filtering and pagination.
   *
   * @param actorUserId Filter by actor user ID (optional)
   * @param action Filter by action (optional)
   * @param resourceType Filter by resource type (optional)
   * @param startDate Filter by start date (optional)
   * @param endDate Filter by end date (optional)
   * @param page Page number (default 0)
   * @param size Page size (default 20)
   * @param sort Sort criteria (default timestamp,desc)
   * @return Paginated audit logs
   */
  @Operation(summary = "Get audit logs", description = "Retrieve audit logs with optional filtering and pagination")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "Successfully retrieved audit logs"),
          @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions")
      })
  @GetMapping("/audit-logs")
  @PreAuthorize("hasAuthority('AUDIT_READ')")
  public ResponseEntity<Page<AuditLog>> getAuditLogs(
      @RequestParam(required = false) Long actorUserId,
      @RequestParam(required = false) String action,
      @RequestParam(required = false) String resourceType,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @RequestParam(defaultValue = "timestamp,desc") String sort) {

    // Parse sort parameter
    String[] sortParams = sort.split(",");
    Sort.Direction direction = sortParams.length > 1 && "asc".equalsIgnoreCase(sortParams[1]) 
        ? Sort.Direction.ASC : Sort.Direction.DESC;
    
    Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));
    
    Page<AuditLog> auditLogs = auditService.getAuditLogs(
        actorUserId, action, resourceType, startDate, endDate, pageable);
        
    return ResponseEntity.ok(auditLogs);
  }
}