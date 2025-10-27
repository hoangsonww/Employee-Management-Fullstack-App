package com.example.employeemanagement.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.employeemanagement.model.*;
import com.example.employeemanagement.service.RbacService;
import com.example.employeemanagement.service.AuditService;
import com.example.employeemanagement.security.JwtTokenUtil;
import com.example.employeemanagement.security.JwtRequestFilter;
import com.example.employeemanagement.security.CustomUserDetailsService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

/** Test class for AdminController RBAC functionality. */
@WebMvcTest(AdminController.class)
public class AdminControllerRbacTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private RbacService rbacService;

  @MockBean
  private AuditService auditService;

  @MockBean
  private JwtTokenUtil jwtTokenUtil;

  @MockBean
  private JwtRequestFilter jwtRequestFilter;

  @MockBean
  private CustomUserDetailsService userDetailsService;

  @Autowired
  private ObjectMapper objectMapper;

  private Role adminRole;
  private Role hrRole;
  private Role employeeRole;
  private Permission employeeReadPermission;
  private Permission userRoleAssignPermission;
  private Permission auditReadPermission;

  @BeforeEach
  void setUp() {
    // Setup test data
    adminRole = new Role("ADMIN", "System Administrator");
    hrRole = new Role("HR", "Human Resources");
    employeeRole = new Role("EMPLOYEE", "Regular Employee");

    employeeReadPermission = new Permission("EMPLOYEE_READ", "Read employee information");
    userRoleAssignPermission = new Permission("USER_ROLE_ASSIGN", "Assign roles to users");
    auditReadPermission = new Permission("AUDIT_READ", "Read audit logs");

    adminRole.addPermission(employeeReadPermission);
    adminRole.addPermission(userRoleAssignPermission);
    adminRole.addPermission(auditReadPermission);

    hrRole.addPermission(employeeReadPermission);
    hrRole.addPermission(auditReadPermission);

    employeeRole.addPermission(employeeReadPermission);
  }

  @Test
  @WithMockUser(authorities = {"USER_READ"})
  void testGetAllRoles_WithPermission_ShouldSucceed() throws Exception {
    // Given
    List<Role> roles = Arrays.asList(adminRole, hrRole, employeeRole);
    when(rbacService.getAllRoles()).thenReturn(roles);

    // When & Then
    mockMvc.perform(get("/api/admin/roles"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(3))
        .andExpect(jsonPath("$[0].name").value("ADMIN"))
        .andExpect(jsonPath("$[1].name").value("HR"))
        .andExpect(jsonPath("$[2].name").value("EMPLOYEE"));

    verify(rbacService).getAllRoles();
  }

  @Test
  void testGetAllRoles_WithoutPermission_ShouldReturn403() throws Exception {
    // When & Then
    mockMvc.perform(get("/api/admin/roles"))
        .andExpect(status().isForbidden());

    verify(rbacService, never()).getAllRoles();
  }

  @Test
  @WithMockUser(authorities = {"USER_ROLE_ASSIGN"})
  void testAssignRoleToUser_WithPermission_ShouldSucceed() throws Exception {
    // Given
    Long userId = 1L;
    String roleName = "HR";
    Long actorUserId = 2L;

    Map<String, Object> request = new HashMap<>();
    request.put("userId", userId);
    request.put("roleName", roleName);
    request.put("actorUserId", actorUserId);

    when(rbacService.assignRoleToUser(userId, roleName, actorUserId)).thenReturn(true);

    // When & Then
    mockMvc.perform(post("/api/admin/users/assign-role")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(content().string("Role assigned successfully"));

    verify(rbacService).assignRoleToUser(userId, roleName, actorUserId);
  }

  @Test
  void testAssignRoleToUser_WithoutPermission_ShouldReturn403() throws Exception {
    // Given
    Map<String, Object> request = new HashMap<>();
    request.put("userId", 1L);
    request.put("roleName", "HR");
    request.put("actorUserId", 2L);

    // When & Then
    mockMvc.perform(post("/api/admin/users/assign-role")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isForbidden());

    verify(rbacService, never()).assignRoleToUser(anyLong(), anyString(), anyLong());
  }

  @Test
  @WithMockUser(authorities = {"AUDIT_READ"})
  void testGetAuditLogs_WithPermission_ShouldSucceed() throws Exception {
    // When & Then
    mockMvc.perform(get("/api/admin/audit-logs"))
        .andExpect(status().isOk());
  }

  @Test
  void testGetAuditLogs_WithoutPermission_ShouldReturn403() throws Exception {
    // When & Then
    mockMvc.perform(get("/api/admin/audit-logs"))
        .andExpect(status().isForbidden());
  }
}