package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.AuthRequestDto;
import com.example.employeemanagement.dto.ResetPasswordRequestDto;
import com.example.employeemanagement.model.User;
import com.example.employeemanagement.repository.UserRepository;
import com.example.employeemanagement.security.JwtTokenUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import javax.validation.Valid;
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

/** This class represents the REST API controller for user authentication. */
@RestController
@Tag(name = "Authentication APIs", description = "API Operations related to user authentication")
public class AuthController {

  /** The Spring Security authentication manager used to verify credentials. */
  @Autowired private AuthenticationManager authenticationManager;

  /** The service that loads user-specific data for authentication. */
  @Autowired private UserDetailsService userDetailsService;

  /** The repository for persisting and querying {@link User} entities. */
  @Autowired private UserRepository userRepository;

  /** The encoder used to hash and verify passwords. */
  @Autowired private PasswordEncoder passwordEncoder;

  /** Utility for generating and validating JWT tokens. */
  @Autowired private JwtTokenUtil jwtTokenUtil;

  /**
   * Register user API.
   *
   * @param request The registration details
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
  public ResponseEntity<?> registerUser(@Valid @RequestBody AuthRequestDto request) {
    try {
      User user = new User();
      user.setUsername(request.getUsername());
      user.setPassword(passwordEncoder.encode(request.getPassword()));
      userRepository.save(user);
      return ResponseEntity.ok("User registered successfully!");
    } catch (DataIntegrityViolationException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Username already exists");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error: Unable to register user");
    }
  }

  /**
   * Authenticate user API.
   *
   * @param request The login credentials
   * @return JWT token
   */
  @Operation(
      summary = "Authenticate user",
      description = "Authenticate a user and generate a JWT token")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "User authenticated successfully"),
        @ApiResponse(responseCode = "401", description = "Invalid username or password"),
        @ApiResponse(responseCode = "500", description = "Unable to authenticate user")
      })
  @PostMapping("/authenticate")
  public ResponseEntity<?> createAuthenticationToken(@Valid @RequestBody AuthRequestDto request) {
    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

      final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
      final String jwt = jwtTokenUtil.generateToken(userDetails.getUsername());

      Map<String, String> response = new HashMap<>();
      response.put("token", jwt);
      return ResponseEntity.ok(response);

    } catch (BadCredentialsException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body("Error: Invalid username or password");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error: Unable to authenticate");
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
   * @param request The reset password details
   * @return Response message indicating success or failure
   */
  @Operation(summary = "Reset password", description = "Reset the password for the given username")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Password reset successfully"),
        @ApiResponse(responseCode = "404", description = "Username not found")
      })
  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequestDto request) {
    Optional<User> user = userRepository.findByUsername(request.getUsername());

    if (user.isPresent()) {
      User existingUser = user.get();
      existingUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
      userRepository.save(existingUser);
      return ResponseEntity.ok("Password reset successfully");
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Username not found");
    }
  }
}
