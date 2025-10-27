package com.example.employeemanagement.controller;

import com.example.employeemanagement.model.User;
import com.example.employeemanagement.repository.UserRepository;
import com.example.employeemanagement.security.JwtTokenUtil;
import com.example.employeemanagement.service.AuditService;
import com.example.employeemanagement.service.RbacService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/** This class represents the REST API controller for user authentication. */
@RestController
@Tag(name = "Authentication APIs", description = "API Operations related to user authentication")
public class AuthController {

  /** The authentication manager. */
  @Autowired
  private AuthenticationManager authenticationManager;

  /** The user details service. */
  @Autowired
  private UserDetailsService userDetailsService;

  /** The user repository. */
  @Autowired
  private UserRepository userRepository;

  /** The password encoder. */
  @Autowired
  private PasswordEncoder passwordEncoder;

  /** The JWT token util. */
  @Autowired
  private JwtTokenUtil jwtTokenUtil;

  /** The RBAC service. */
  @Autowired
  private RbacService rbacService;

  /** The audit service. */
  @Autowired
  private AuditService auditService;

  /**
   * Register user API.
   *
   * @param user The user to be registered
   * @param request The HTTP request for audit logging
   * @return Success message
   */
  @Operation(summary = "Register user", description = "Register a new user")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "User registered successfully"),
          @ApiResponse(responseCode = "409", description = "Username already exists"),
          @ApiResponse(responseCode = "500", description = "Unable to register user")
      })
  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@RequestBody User user, HttpServletRequest request) {
    try {
      user.setPassword(passwordEncoder.encode(user.getPassword()));
      
      // Assign default EMPLOYEE role to new users
      Optional<com.example.employeemanagement.model.Role> employeeRole = rbacService.getRoleByName("EMPLOYEE");
      if (employeeRole.isPresent()) {
        user.addRole(employeeRole.get());
      }
      
      User savedUser = userRepository.save(user);
      
      // Log audit event
      auditService.logAuditEvent(
          savedUser.getId(),
          "USER_REGISTER",
          "USER",
          savedUser.getId().toString(),
          String.format("{\"username\":\"%s\"}", savedUser.getUsername()),
          request,
          false
      );
      
      return ResponseEntity.ok("User registered successfully!");
    } catch (DataIntegrityViolationException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Username already exists");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Unable to register user");
    }
  }

  /**
   * Authenticate user API.
   *
   * @param user The user to be authenticated
   * @param request The HTTP request for audit logging
   * @return JWT token with user roles and permissions
   * @throws Exception If authentication fails
   */
  @Operation(summary = "Authenticate user", description = "Authenticate a user and generate a JWT token with roles and permissions")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "User authenticated successfully"),
          @ApiResponse(responseCode = "401", description = "Invalid username or password"),
          @ApiResponse(responseCode = "500", description = "Unable to authenticate user")
      })
  @PostMapping("/authenticate")
  public ResponseEntity<?> createAuthenticationToken(@RequestBody User user, HttpServletRequest request) {
    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
      );

      // Get user with roles from database
      Optional<User> dbUserOpt = rbacService.getUserByUsernameWithRoles(user.getUsername());
      if (!dbUserOpt.isPresent()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not found");
      }

      User dbUser = dbUserOpt.get();
      final String jwt = jwtTokenUtil.generateToken(dbUser);

      // Log audit event
      auditService.logAuditEvent(
          dbUser.getId(),
          "USER_LOGIN",
          "AUTH",
          null,
          String.format("{\"username\":\"%s\"}", dbUser.getUsername()),
          request,
          false
      );

      Map<String, Object> response = new HashMap<>();
      response.put("token", jwt);
      response.put("username", dbUser.getUsername());
      response.put("userId", dbUser.getId());
      response.put("roles", dbUser.getRoles().stream().map(role -> role.getName()).toArray());
      
      return ResponseEntity.ok(response);

    } catch (BadCredentialsException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid username or password");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Unable to authenticate");
    }
  }

  /**
   * Verify if a username exists.
   *
   * @param username The username to verify
   * @return Response message indicating whether the username exists
   */
  @Operation(summary = "Verify username", description = "Verify if a username exists in the system")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "Username exists"),
          @ApiResponse(responseCode = "404", description = "Username not found")
      })
  @GetMapping("/verify-username/{username}")
  public ResponseEntity<?> verifyUsername(@PathVariable String username) {
    Optional<User> user = userRepository.findByUsername(username);
    if (user.isPresent()) {
      return ResponseEntity.ok("Username exists");
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Username not found");
    }
  }

  /**
   * Reset password for a given username.
   *
   * @param request Map containing the username and new password
   * @return Response message indicating success or failure of the operation
   */
  @Operation(summary = "Reset password", description = "Reset the password for the given username")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "Password reset successfully"),
          @ApiResponse(responseCode = "404", description = "Username not found"),
          @ApiResponse(responseCode = "500", description = "Unable to reset password")
      })
  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
    String username = request.get("username");
    String newPassword = request.get("newPassword");

    Optional<User> user = userRepository.findByUsername(username);

    if (user.isPresent()) {
      User existingUser = user.get();
      existingUser.setPassword(passwordEncoder.encode(newPassword));
      userRepository.save(existingUser);
      return ResponseEntity.ok("Password reset successfully");
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Username not found");
    }
  }
}
